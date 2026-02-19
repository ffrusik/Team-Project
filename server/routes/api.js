import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// Get all rooms
router.get('/api/rooms', async (req, res) => {
    const result = await pool.query('SELECT * FROM room');
    res.json(result.rows);
})

// Get a room by its id
router.get('/api/rooms/:id', async (req, res) => {
    const roomNumber = Number(req.params.id)
    const result = await pool.query('SELECT * FROM room WHERE "roomNumber" = $1', [roomNumber])

    if (!result) return res.status(404).send('Room not found');

    res.json(result.rows[0])
})

// Add a new room
router.post('/api/rooms', (req, res) => {
    res.send('New room')
})

// Add a booking
router.post('/api/bookings', async (req, res) => {
    const {
        guestName,
        email,
        password,
        repeatPassword,
        phoneNumber,
        town,
        county,
        eirCode,
        roomNumber,
        numberOfGuests,
        startDate,
        endDate,
        emailLogin,
        passwordLogin
    } = req.body

    let guestId

    // If the user has an account, they can log in and book without registering again, otherwise they can register and book at the same time
    if (emailLogin && passwordLogin) {
        const userResult = await pool.query(
            `SELECT * FROM "guest" WHERE email = $1`, [emailLogin]
        )
        const user = userResult.rows[0]
        if (!user) {
            return res.status(400).json({ error: "Invalid email" })
        }
        const isPasswordValid = await bcrypt.compare(passwordLogin, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" })
        }
        
        guestId = user.id
    }
    // Register instead
    else {
        if (password !== repeatPassword) {
            return res.status(400).json({ error: "Passwords do not match" })
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user and booking
        const userResult = await pool.query(
                `INSERT INTO "guest" 
                ("guestName", "email", "password", "phoneNumber", "town", "county", "eirCode", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING id`,
                [guestName, email, hashedPassword, phoneNumber, town, county, eirCode]
            )
        

        guestId = userResult.rows[0].id
    }
    try {
        // Get the room id based on the room number
        if (!roomNumber || !numberOfGuests || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing booking details" })
        }

        const roomId = await pool.query(
            `SELECT id FROM "room" WHERE "roomNumber" = $1`, [roomNumber]  
        )

        if (!roomId.rows[0]) {
            return res.status(400).json({ error: "Room not found" })
        }

        // Insert the booking into the database
        await pool.query(
            `INSERT INTO "reservation"
            ("guestId", "roomId", "startDate", "endDate", "numberOfGuests", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [guestId, roomId.rows[0].id, startDate, endDate, numberOfGuests]
        )

        res.json({ message: 'Booking successful' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// Show all bookings
router.get('/api/bookings', async (req, res) => {
    try {
        // Join the reservation and room tables to get the room number for each booking
        const result = await pool.query(`
        SELECT 
            reservation.*, 
            room."roomNumber"
        FROM reservation
        JOIN room 
            ON reservation."roomId" = room.id
        `)

        if (result.rows.length === 0) {
            return res.status(404).send('No bookings found')
        }

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// !(:id) Show a certain booking
router.get('/api/bookings/:id', (req, res) => {
    const id = Number(req.params.id)
    res.send(`Some booking with id ${id}`)
})

// Delete certain room
router.delete('/api/rooms/:id', (req, res) => {
    const id = Number(req.params.id)
    res.send(`Deleting a room with id ${id}`)
})

// Delete certain booking
router.delete('/api/bookings/:id', (req, res) => {
    const id = Number(req.params.id)
    res.send(`Deleting a booking with id ${id}`)
})

function isAdmin(req, res) {
    if (req.user && req.user.role == 'admin') {
        return true
    }
    return false
}

// export
export default router
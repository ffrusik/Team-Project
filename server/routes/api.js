import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET not set')
  process.exit(1)
}

// Middleware: Verify JWT and attach user to req
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // { userId, email, role }
    next();
  });
};

// Middleware: Only admins
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all available rooms (public)
router.get('/rooms', async (req, res) => {
    const result = await pool.query(`SELECT * FROM room 
        WHERE id NOT IN (SELECT "roomId" FROM reservation WHERE ("startDate", "endDate") OVERLAPS ($1, $2))`, 
        [req.query.startDate, req.query.endDate])
    res.json(result.rows);
})

// Get a room by its id
router.get('/rooms/:id', async (req, res) => {
    const roomNumber = Number(req.params.id)
    
    try {
        const result = await pool.query('SELECT * FROM room WHERE "roomNumber" = $1', [roomNumber])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

// Add a new room
router.post('/rooms', (req, res) => {
    res.send('New room')
})

// Add a booking
router.post('/bookings', authenticateToken, async (req, res) => {
    const {
        roomNumber,
        numberOfGuests,
        startDate,
        endDate,
    } = req.body

    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" })
    }

    const guestId = req.user.userId

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

// Show all of user's bookings (public)
router.get('/bookings', authenticateToken, async (req, res) => {
    try {
        if (req.user) {
            // Join the reservation and room tables to get the room number for each booking
            const result = await pool.query(`
            SELECT 
                reservation.*, 
                room."roomNumber"
            FROM reservation
            JOIN room 
                ON reservation."roomId" = room.id
            WHERE reservation."guestId" = $1
            `, [req.user.userId])

            res.json({
                success: true,
                bookings: result.rows || [],  // always array
                message: result.rows.length === 0 ? 'No bookings found' : undefined
            });
        }
        else {
            res.json({
                success: false,
                bookings: [],  // always array
                message: 'User not authenticated'
            });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ 
            success: false,
            bookings: [],  // always array  
            error: 'Server error' 
        })
    }
})

// Delete certain booking
router.delete('/bookings/:id', authenticateToken, requireAdmin, async (req, res) => {
    const {
        id
    } = req.params

    await pool.query(
        `DELETE FROM "reservation" WHERE id = $1`,
        [id]
    )

    res.json({ message: 'Booking deleted successfully' })
})

// !(:id) Show a certain booking
router.get('/bookings/:id', authenticateToken, async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            `SELECT * FROM "reservation" WHERE id = $1`,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// Delete a certain room
router.delete('/admin/rooms/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM room WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' })
    }

    res.json({ message: 'Room deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete room' })
  }
})

router.get('/admin/rooms', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room')
    res.json(result.rows || []) // always array
  } catch (err) {
    console.error(err)
    res.status(500).json([])
  }
})

// export
export default router
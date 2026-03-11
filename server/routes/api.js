import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

//const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
//if (!JWT_SECRET) {
  //console.error('JWT_SECRET not set')
  //process.exit(1)
//}

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

// Get ALL rooms
router.get('/admin/rooms', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room')
    res.json(result.rows || []) // always array
  } catch (err) {
    console.error(err)
    res.status(500).json([])
  }
})

// Create a new room
router.post('/admin/rooms', authenticateToken, requireAdmin, async (req, res) => {
    const { roomNumber, description, capacity, price, availability } = req.body

    try {
        const result = await pool.query(
            `INSERT INTO room 
            ("roomNumber", "description", "capacity", "price", "availability", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *`,
            [roomNumber, description, capacity, price, availability]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create room' })
    }
})

// Edit a room
router.put('/admin/rooms/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params
    const { roomNumber, description, capacity, price, availability } = req.body

    try {
        const result = await pool.query(
            `UPDATE room SET 
            "roomNumber" = $1,
            "description" = $2,
            "capacity" = $3,
            "price" = $4,
            "availability" = $5,
            "updatedAt" = NOW()
            WHERE id = $6
            RETURNING *`,
            [roomNumber, description, capacity, price, availability, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Room not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to update room' })
    }
})

// Get ALL bookings
router.get('/admin/bookings', authenticateToken, requireAdmin, async (req, res) => {
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
            `, [])

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

// Get ALL guests
router.get('/admin/guests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guest');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load guests' });
  }
});

// Create a new guest
router.post('/admin/guests', authenticateToken, requireAdmin, async (req, res) => {
  const { guestName, email, password, phoneNumber, town, county, eirCode, role } = req.body;

  if (!email || !password || !phoneNumber || !eirCode) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO guest ("guestName", email, password, "phoneNumber", town, county, "eirCode", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [guestName || email.split('@')[0], email, hashedPassword, phoneNumber, town || null, county || null, eirCode, role || 'USER']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add guest' });
  }
});

router.put('/admin/guests/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params
    const { guestName, email, password, phoneNumber, town, county, eirCode, role } = req.body

    try {
        let query;
        let values;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `
                UPDATE guest SET 
                    "guestName" = $1,
                    email = $2,
                    password = $3,
                    "phoneNumber" = $4,
                    town = $5,
                    county = $6,
                    "eirCode" = $7,
                    role = $8,
                    "updatedAt" = NOW()
                WHERE id = $9
                RETURNING *
            `;
            values = [guestName || email.split('@')[0], email, hashedPassword, phoneNumber, town || null, county || null, eirCode, role || 'USER', id];
        } else {
            query = `
                UPDATE guest SET 
                    "guestName" = $1,
                    email = $2,
                    "phoneNumber" = $3,
                    town = $4,
                    county = $5,
                    "eirCode" = $6,
                    role = $7,
                    "updatedAt" = NOW()
                WHERE id = $8
                RETURNING *
            `;
            values = [guestName || email.split('@')[0], email, phoneNumber, town || null, county || null, eirCode, role || 'USER', id];
        }

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Guest not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update guest' });
    }
});

router.delete('/admin/guests/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM guest WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Guest not found' })
    }

    res.json({ message: 'Guest deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete guest' })
  }
})

// export
export default router
import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Get all rooms
router.get('/api/rooms', async (req, res) => {
    const result = await pool.query('SELECT * FROM rooms')
    res.json(result.rows)
})

// Get a room by its id
router.get('/api/rooms/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id])

    if (!result) return res.status(404).send('Room not found');

    res.json(result.rows)
})

// Add a new room
router.post('/api/rooms', (req, res) => {
    res.send('New room')
})

// Add a booking
router.post('/api/bookings', (req, res) => {
    res.send('New booking')
})

// Show all bookings
router.get('/api/bookings', (req, res) => {
    res.send('Show all bookings')
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
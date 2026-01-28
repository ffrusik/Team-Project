import express from 'express'
import pool from '../db/db.js'

const router = express.Router()

router.get('/api/rooms', async (req, res) => {
    const result = await pool.query('SELECT * FROM rooms')
    res.json(result.rows)
})

router.get('/api/rooms/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id])

    if (!result) return res.status(404).send('Room not found');

    res.json(result.rows)
})

routerApi.post('/api/rooms', (req, res) => {
    res.send('New room')
})

module.exports = router
import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express()
const PORT = process.env.PORT

const routerApi = express.Router()

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] ${req.method} ${req.url}`)

    next()
})

routerApi.get('/rooms', async (req, res) => {
    const result = await pool.query('SELECT * FROM rooms')
    res.json(result.rows)
})

routerApi.get('/rooms/:id', async (req, res) => {
    const id = Number(req.params.id)
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id])

    if (!result) return res.status(404).send('Room not found');

    res.json(room)
})

routerApi.post('/rooms', (req, res) => {
    res.send('New room')
})

app.use('/api', routerApi)

app.listen(PORT, () => {
    console.log('Server started on port 5000...')
})
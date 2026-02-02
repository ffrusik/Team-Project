import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express()
const PORT = process.env.PORT

// routers
import clientRouter from './routes/client.js';
import apiRouter from './routes/api.js';

// middleware
app.use(express.json())
app.use(cors())

// logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] ${req.method} ${req.url}`)

    next()
})

// importing routers
app.use('/', clientRouter, apiRouter)

// starting up the backend
app.listen(PORT, () => {
    console.log('Server started on port 5000...')
})
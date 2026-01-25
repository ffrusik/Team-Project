import express from 'express'

const app = express()
const PORT = process.env.PORT || 5000

const routerApi = express.Router()

app.use(express.json())

app.use((req, res, next) => {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] ${req.method} ${req.url}`)

    next()
})

let rooms = [
    { id: 1, price: 70, roomNumber: 10 },
    { id: 2, price: 80, roomNumber: 21 },
    { id: 3, price: 65, roomNumber: 17 },
]

routerApi.get('/rooms', (req, res) => {
    res.json(rooms)
})

routerApi.get('/rooms/:id', (req, res) => {
    const id = Number(req.params.id)
    const room = rooms.find((room) => room.id === id)

    if (!room) return res.status(404).send('Car not found');

    res.json(room)
})

routerApi.post('/rooms', (req, res) => {
    res.send('New car')
})

app.use('/api', routerApi)

app.listen(5000, () => {
    console.log('Server started on port 5000...')
})
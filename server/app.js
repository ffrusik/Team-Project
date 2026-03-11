import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import db from './db.js'
//import apiRouter from './routes/api.js'
import guestRoutes from './routes/guests.js'
import roomRoutes from "./routes/rooms.js";

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.url}`)
    next()
})

//app.use('/api', apiRouter)
app.use('/api/guests', guestRoutes)
app.use("/api/rooms", roomRoutes);

db.serialize(() => {
  //tables
  // create project tables
db.serialize(() => {

  db.run(`
  CREATE TABLE IF NOT EXISTS Guest (
    GuestID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT,
    Password TEXT,
    Phone TEXT,
    Eircode TEXT
  )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS Room (
    RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
    Type TEXT,
    PricePerNight REAL
  )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS Reservation (
    ResID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER,
    RoomID INTEGER,
    StartDate TEXT,
    EndDate TEXT,
    CheckInTime TEXT,
    CheckOutTime TEXT,
    NumberOfGuests INTEGER,
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
  )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS ExtraType (
    ExtraTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Cost REAL
  )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS Extra (
    ExtraID INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT,
    Time TEXT,
    Quantity INTEGER,
    ReservationID INTEGER,
    ExtraTypeID INTEGER,
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ResID),
    FOREIGN KEY (ExtraTypeID) REFERENCES ExtraType(ExtraTypeID)
  )
  `)

})
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
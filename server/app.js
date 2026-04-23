import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()

import express from 'express'
import cors from 'cors'

import db from './db.js'
//import apiRouter from './routes/api.js'
import guestRoutes from './routes/guests.js'
import roomRoutes from "./routes/rooms.js";
import reservationRoutes from "./routes/reservations.js";
import authRoutes from "./routes/auth.js";
import extraTypesRoutes from "./routes/extraTypes.js";
import extrasRoutes from "./routes/extras.js";

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.url}`)
    next()
})

app.use('/api/auth', authRoutes)
app.use('/api/', guestRoutes)  // guests
app.use("/api/", roomRoutes);  // rooms
app.use("/api/", reservationRoutes);  // reservations
app.use("/api", extraTypesRoutes); //extra type
app.use("/api", extrasRoutes);


  //tables
  // create project tables -- needs to be updated so table is not created every single time node app.js is ran
db.serialize(async () => {

  db.run(`
  CREATE TABLE IF NOT EXISTS Guest (
    GuestID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT,
    Password TEXT,
    Phone TEXT,
    Eircode TEXT,
    Role TEXT
  )
  `)

  db.run(`
  CREATE TABLE IF NOT EXISTS Room (
    RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
    Type TEXT,
    PricePerNight REAL,
    Description TEXT,
    Capacity INTEGER,
    Facilities TEXT
  )
  `)
  db.run(`ALTER TABLE Room ADD COLUMN Description TEXT`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message);
  }
});

db.run(`ALTER TABLE Room ADD COLUMN Capacity INTEGER`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message);
  }
});

db.run(`ALTER TABLE Room ADD COLUMN Facilities TEXT`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message);
  }
});

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
    Status TEXT DEFAULT 'Pending',
    CardholderName TEXT,
    CardLast4Digits TEXT,
    ExpiryDate TEXT,
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
  )
  `)
  db.run(`ALTER TABLE Reservation ADD COLUMN Status TEXT DEFAULT 'Pending'`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message)
  }
})
db.run(`ALTER TABLE Reservation ADD COLUMN CardholderName TEXT`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message)
  }
})
db.run(`ALTER TABLE Reservation ADD COLUMN CardLast4Digits TEXT`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message)
  }
})
db.run(`ALTER TABLE Reservation ADD COLUMN ExpiryDate TEXT`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message)
  }
})

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

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  db.run(`
  INSERT INTO Guest (FirstName, LastName, Email, Password, Phone, Eircode, Role)
  SELECT ?, ?, ?, ?, ?, ?, ?
  WHERE NOT EXISTS (
    SELECT 1 FROM Guest WHERE Email = ?
  )
`, ['Admin', 'Admin', 'admin@email.com', hashedPassword, '1234567890', 'F92U8WT', 'ADMIN', 'admin@email.com']);

})
//})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
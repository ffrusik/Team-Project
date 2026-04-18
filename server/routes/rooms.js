import express from "express";
import { runQuery, getQuery, allQuery } from "../database.js";

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router();

// Verification and authentication
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET not set')
  process.exit(1)
}

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


// GET all rooms
router.get("/rooms/", async (req, res) => {
  const rooms = await allQuery("SELECT * FROM Room");
  res.json(rooms);
});


// GET one room
router.get("/rooms/:id", async (req, res) => {

  const room = await getQuery(
    "SELECT * FROM Room WHERE RoomID=?",
    [req.params.id]
  );

  res.json(room);

});


// CREATE room
router.post("/rooms/", async (req, res) => {

  const { Type, PricePerNight,Description,Capacity,Facilities} = req.body;

  const result = await runQuery(
    "INSERT INTO Room (Type, PricePerNight,Description,Capacity,Facilities) VALUES (?, ?,?,?,?)",
    [Type, PricePerNight,Description,Capacity,Facilities]
  );

  res.json({
    message: "Room created",
    id: result.id
  });

});


// UPDATE room
router.put("/rooms/:id", async (req, res) => {

  const { Type, PricePerNight,Description,Capacity,Facilities } = req.body;

  await runQuery(
    `UPDATE Room
     SET Type=?, PricePerNight=?,Description=?,Capacity=?,Facilities=?
     WHERE RoomID=?`,
    [Type, PricePerNight,Description,Capacity,Facilities, req.params.id]
  );

  res.json({ message: "Room updated" });

});


// DELETE room
router.delete("/rooms/:id", async (req, res) => {

  await runQuery(
    "DELETE FROM Room WHERE RoomID=?",
    [req.params.id]
  );

  res.json({ message: "Room deleted" });

});

export default router;
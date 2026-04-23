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

// GET all extras
router.get("/extras/", async (req, res) => {
  const extras = await allQuery(`
    SELECT Extra.*, ExtraType.Name, ExtraType.Cost
    FROM Extra
    LEFT JOIN ExtraType ON Extra.ExtraTypeID = ExtraType.ExtraTypeID
  `);

  res.json(extras);
});

// GET one extra
router.get("/extras/:id", async (req, res) => {
  const extra = await getQuery(
    `SELECT Extra.*, ExtraType.Name, ExtraType.Cost
     FROM Extra
     LEFT JOIN ExtraType ON Extra.ExtraTypeID = ExtraType.ExtraTypeID
     WHERE Extra.ExtraID=?`,
    [req.params.id]
  );

  res.json(extra);
});

// CREATE extra
router.post("/extras/", async (req, res) => {
  const { Date, Time, Quantity, ReservationID, ExtraTypeID } = req.body;

  const reservation = await getQuery(
    "SELECT * FROM Reservation WHERE ResID=?",
    [ReservationID]
  );

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  if (!reservation.Status || reservation.Status.toLowerCase() !== "checked in") {
    return res.status(400).json({ error: "Extras can only be added for checked-in guests" });
  }

  const result = await runQuery(
    "INSERT INTO Extra (Date, Time, Quantity, ReservationID, ExtraTypeID) VALUES (?, ?, ?, ?, ?)",
    [Date, Time, Quantity, ReservationID, ExtraTypeID]
  );

  res.json({
    message: "Extra created",
    id: result.id
  });
});

// UPDATE extra
router.put("/extras/:id", async (req, res) => {
  const { Date, Time, Quantity, ReservationID, ExtraTypeID } = req.body;

  const reservation = await getQuery(
    "SELECT * FROM Reservation WHERE ResID=?",
    [ReservationID]
  );

  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  if (!reservation.Status || reservation.Status.toLowerCase() !== "checked in") {
    return res.status(400).json({ error: "Extras can only be added for checked-in guests" });
  }

  await runQuery(
    `UPDATE Extra
     SET Date = ?, Time = ?, Quantity = ?, ReservationID = ?, ExtraTypeID = ?
     WHERE ExtraID=?`,
    [Date, Time, Quantity, ReservationID, ExtraTypeID, req.params.id]
  );

  res.json({ message: "Extra updated" });
});

// DELETE extra
router.delete("/extras/:id", async (req, res) => {
  await runQuery(
    "DELETE FROM Extra WHERE ExtraID=?",
    [req.params.id]
  );

  res.json({ message: "Extra deleted" });
});

export default router;
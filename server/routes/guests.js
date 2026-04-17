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


// GET all guests
router.get("/guests/", async (req, res) => {
  const guests = await allQuery("SELECT * FROM Guest");
  res.json(guests);
});


// GET one guest
router.get("/guests/:id", async (req, res) => {
  const guest = await getQuery(
    "SELECT * FROM Guest WHERE GuestID=?",
    [req.params.id]
  );

  res.json(guest);
});


// CREATE guest
router.post("/guests/", async (req, res) => {

  const {
    FirstName,
    LastName,
    Email,
    Password,
    Phone,
    Eircode
  } = req.body;

  const result = await runQuery(
    `INSERT INTO Guest
    (FirstName, LastName, Email, Password, Phone, Eircode)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [FirstName, LastName, Email, Password, Phone, Eircode]
  );

  res.json({
    message: "Guest created",
    id: result.id
  });

});


// UPDATE guest
router.put("/guests/:id", async (req, res) => {

  const {
    FirstName,
    LastName,
    Email,
    Password,
    Phone,
    Eircode
  } = req.body;

  await runQuery(
    `UPDATE Guest
     SET FirstName=?, LastName=?, Email=?, Password=?, Phone=?, Eircode=?
     WHERE GuestID=?`,
    [FirstName, LastName, Email, Password, Phone, Eircode, req.params.id]
  );

  res.json({ message: "Guest updated" });

});


// DELETE guest
router.delete("/guests/:id", async (req, res) => {

  await runQuery(
    "DELETE FROM Guest WHERE GuestID=?",
    [req.params.id]
  );

  res.json({ message: "Guest deleted" });

});


export default router;
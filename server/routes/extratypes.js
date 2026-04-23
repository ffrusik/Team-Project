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

// GET all extra types
router.get("/extra-types/", async (req, res) => {
  const extraTypes = await allQuery("SELECT * FROM ExtraType");
  res.json(extraTypes);
});

// GET one extra type
router.get("/extra-types/:id", async (req, res) => {
  const extraType = await getQuery(
    "SELECT * FROM ExtraType WHERE ExtraTypeID=?",
    [req.params.id]
  );

  res.json(extraType);
});

// CREATE extra type
router.post("/extra-types/", async (req, res) => {
  const { Name, Cost } = req.body;

  const result = await runQuery(
    "INSERT INTO ExtraType (Name, Cost) VALUES (?, ?)",
    [Name, Cost]
  );

  res.json({
    message: "Extra type created",
    id: result.id
  });
});

// UPDATE extra type
router.put("/extra-types/:id", async (req, res) => {
  const { Name, Cost } = req.body;

  await runQuery(
    `UPDATE ExtraType
     SET Name = ?, Cost = ?
     WHERE ExtraTypeID=?`,
    [Name, Cost, req.params.id]
  );

  res.json({ message: "Extra type updated" });
});

// DELETE extra type
router.delete("/extra-types/:id", async (req, res) => {
  await runQuery(
    "DELETE FROM ExtraType WHERE ExtraTypeID=?",
    [req.params.id]
  );

  res.json({ message: "Extra type deleted" });
});

export default router;






































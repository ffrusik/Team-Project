import express from "express";
import { runQuery, getQuery, allQuery } from "../database.js";
//errors are to help understand where a problem is coming from
const router = express.Router();
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

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

// GET all reservations
router.get("/admin/reservations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reservations = await allQuery("SELECT * FROM Reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one reservation
router.get("/admin/reservations/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reservation = await getQuery(
      "SELECT * FROM Reservation WHERE ResID = ?",
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE reservation
router.post("/admin/reservations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      GuestID,
      RoomID,
      StartDate,
      EndDate,
      NumberOfGuests,
      CheckInTime,
      CheckOutTime
    } = req.body;

    const today = new Date().toISOString().split("T")[0];

    if (!GuestID || !RoomID || !StartDate || !EndDate || !NumberOfGuests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (StartDate < today) {
      return res.status(400).json({ error: "Cannot book in the past" });
    }

    if (EndDate <= StartDate) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const capacity = await getQuery(
      "SELECT Capacity FROM room WHERE RoomID = ?",
      [RoomID]
    );

    console.log(capacity.Capacity)
    console.log(NumberOfGuests)

    if (NumberOfGuests > capacity.Capacity) {
      return res.status(400).json({ error: "Number of guests exceeds room capacity" });
    }

    const guest = await getQuery(
      "SELECT * FROM Guest WHERE GuestID = ?",
      [GuestID]
    );

    if (!guest) {
      return res.status(404).json({ error: "Guest does not exist" });
    }

    const room = await getQuery(
      "SELECT * FROM Room WHERE RoomID = ?",
      [RoomID]
    );

    if (!room) {
      return res.status(404).json({ error: "Room does not exist" });
    }

    const overlap = await getQuery(
      `SELECT * FROM Reservation
       WHERE RoomID = ?
       AND Status != 'Rejected'
       AND NOT (EndDate <= ? OR StartDate >= ?)`,
      [RoomID, StartDate, EndDate]
    );

    if (overlap) {
      return res.status(400).json({ error: "Room already booked for those dates" });
    }

    const result = await runQuery(
      `INSERT INTO Reservation
      (GuestID, RoomID, StartDate, EndDate, CheckInTime, CheckOutTime, NumberOfGuests, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        GuestID,
        RoomID,
        StartDate,
        EndDate,
        CheckInTime || null,
        CheckOutTime || null,
        NumberOfGuests,
        "Pending"
      ]
    );

    res.json({
      message: "Reservation created",
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE reservation
router.put("/:id", async (req, res) => {
  try {
    const {
      GuestID,
      RoomID,
      StartDate,
      EndDate,
      CheckInTime,
      CheckOutTime,
      NumberOfGuests
    } = req.body;

    const reservationId = req.params.id;
    const today = new Date().toISOString().split("T")[0];

    const existingReservation = await getQuery(
      "SELECT * FROM Reservation WHERE ResID = ?",
      [reservationId]
    );

    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (!GuestID || !RoomID || !StartDate || !EndDate || !NumberOfGuests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (StartDate < today) {
      return res.status(400).json({ error: "Cannot book in the past" });
    }

    if (EndDate <= StartDate) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const guest = await getQuery(
      "SELECT * FROM Guest WHERE GuestID = ?",
      [GuestID]
    );

    if (!guest) {
      return res.status(404).json({ error: "Guest does not exist" });
    }

    const room = await getQuery(
      "SELECT * FROM Room WHERE RoomID = ?",
      [RoomID]
    );

    if (!room) {
      return res.status(404).json({ error: "Room does not exist" });
    }

    const overlap = await getQuery(
      `SELECT * FROM Reservation
       WHERE RoomID = ?
       AND ResID != ?
       AND Status != 'Rejected'
       AND NOT (EndDate <= ? OR StartDate >= ?)`,
      [RoomID, reservationId, StartDate, EndDate]
    );

    if (overlap) {
      return res.status(400).json({ error: "Room already booked for those dates" });
    }

    await runQuery(
      `UPDATE Reservation
       SET GuestID = ?, RoomID = ?, StartDate = ?, EndDate = ?,
           CheckInTime = ?, CheckOutTime = ?, NumberOfGuests = ?
       WHERE ResID = ?`,
      [
        GuestID,
        RoomID,
        StartDate,
        EndDate,
        CheckInTime || null,
        CheckOutTime || null,
        NumberOfGuests,
        reservationId
      ]
    );

    res.json({ message: "Reservation updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE reservation
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await getQuery(
      "SELECT * FROM Reservation WHERE ResID = ?",
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await runQuery(
      "DELETE FROM Reservation WHERE ResID = ?",
      [req.params.id]
    );

    res.json({ message: "Reservation cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CONFIRM reservation
router.put("/:id/confirm", async (req, res) => {
  try {
    const reservation = await getQuery(
      "SELECT * FROM Reservation WHERE ResID = ?",
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await runQuery(
      "UPDATE Reservation SET Status = ? WHERE ResID = ?",
      ["Confirmed", req.params.id]
    );

    res.json({ message: "Reservation confirmed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REJECT reservation
router.put("/:id/reject", async (req, res) => {
  try {
    const reservation = await getQuery(
      "SELECT * FROM Reservation WHERE ResID = ?",
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await runQuery(
      "UPDATE Reservation SET Status = ? WHERE ResID = ?",
      ["Rejected", req.params.id]
    );

    res.json({ message: "Reservation rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
import express from "express";
import { runQuery, getQuery, allQuery } from "../database.js";

const router = express.Router();

// GET all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await allQuery("SELECT * FROM Reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE reservation
router.post("/", async (req, res) => {
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
       AND NOT (EndDate <= ? OR StartDate >= ?)`,
      [RoomID, StartDate, EndDate]
    );

    if (overlap) {
      return res.status(400).json({ error: "Room already booked for those dates" });
    }

    const result = await runQuery(
      `INSERT INTO Reservation
      (GuestID, RoomID, StartDate, EndDate, CheckInTime, CheckOutTime, NumberOfGuests)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [GuestID, RoomID, StartDate, EndDate, CheckInTime || null, CheckOutTime || null, NumberOfGuests]
    );

    res.json({
      message: "Reservation created",
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
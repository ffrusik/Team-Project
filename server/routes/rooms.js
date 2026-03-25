import express from "express";
import { runQuery, getQuery, allQuery } from "../database.js";

const router = express.Router();


// GET all rooms
router.get("/", async (req, res) => {
  const rooms = await allQuery("SELECT * FROM Room");
  res.json(rooms);
});


// GET one room
router.get("/:id", async (req, res) => {

  const room = await getQuery(
    "SELECT * FROM Room WHERE RoomID=?",
    [req.params.id]
  );

  res.json(room);

});


// CREATE room
router.post("/", async (req, res) => {

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
router.put("/:id", async (req, res) => {

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
router.delete("/:id", async (req, res) => {

  await runQuery(
    "DELETE FROM Room WHERE RoomID=?",
    [req.params.id]
  );

  res.json({ message: "Room deleted" });

});

export default router;
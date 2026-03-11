import express from "express";
import { runQuery, getQuery, allQuery } from "../database.js";

const router = express.Router();


// GET all guests
router.get("/", async (req, res) => {
  const guests = await allQuery("SELECT * FROM Guest");
  res.json(guests);
});


// GET one guest
router.get("/:id", async (req, res) => {
  const guest = await getQuery(
    "SELECT * FROM Guest WHERE GuestID=?",
    [req.params.id]
  );

  res.json(guest);
});


// CREATE guest
router.post("/", async (req, res) => {

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
router.put("/:id", async (req, res) => {

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
router.delete("/:id", async (req, res) => {

  await runQuery(
    "DELETE FROM Guest WHERE GuestID=?",
    [req.params.id]
  );

  res.json({ message: "Guest deleted" });

});


export default router;
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM Guest", [], (err, rows) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { FirstName, LastName, Email, Password, Phone, Eircode } = req.body;

  db.run(
    `INSERT INTO Guest (FirstName, LastName, Email, Password, Phone, Eircode)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [FirstName, LastName, Email, Password, Phone, Eircode],
    function (err) {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.json({
        message: "Guest created",
        id: this.lastID
      });
    }
  );
});

export default router;
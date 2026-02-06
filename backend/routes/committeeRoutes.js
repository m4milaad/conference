import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/organizing-committee", (req, res) => {
  db.query(
    "SELECT * FROM committee WHERE committee_type = 'Organizing Committee'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(results); // See what is returned from MySQL
      res.json(results);
    }
  );
});

router.get("/steering-committee", (req, res) => {
  db.query(
    "SELECT * FROM committee WHERE committee_type = 'Steering Committee'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(results); // See what is returned from MySQL
      res.json(results);
    }
  );
});

router.get("/technical-committee", (req, res) => {
  db.query(
    "SELECT * FROM committee WHERE committee_type = 'Technical Committee'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(results); 
      res.json(results);
    }
  );
});

export default router;

import express from "express";
import db from "../db.js";

const router = express.Router();

// Login API
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password); // Add this line
  db.query(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, msg: "Server error" });
      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false, msg: "Invalid credentials" });
      }
    }
  );
});

export default router;

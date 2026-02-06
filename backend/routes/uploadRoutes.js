import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import db from "../db.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload Excel and update committee table
router.post("/upload-committee", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  console.log(data); // See what was parsed from Excel

  // Optional: Clear old data
  db.query("DELETE FROM committee", (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Prepare values for bulk insert
    const values = data.map(member => [
      member.committee_type || null,
      member.sub_committe || null, 
      member.name || null,
      member.role || null,
      member.organization || null,
      member.country || null
    ]);

    db.query(
      "INSERT INTO committee (committee_type, sub_committe, name, role, organization, country) VALUES ?",
      [values],
      (err2) => {
        if (err2) {
          console.log(err2); // Log error for debugging
          return res.status(500).json({ error: err2.message });
        }
        res.json({ success: true, inserted: values.length });
      }
    );
  });
});

export default router;

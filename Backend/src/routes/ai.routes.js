const express = require("express");
const multer = require("multer");
const { simplifyReportAI } = require("../services/ai.service");

const router = express.Router();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG or PDF files are allowed"));
  },
});

// POST /ai/simplify-report   (form-data field name: "file")
router.post("/simplify-report", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // NOTE: we deliberately do not log the report contents (private medical data)
    const report = await simplifyReportAI(req.file.path, req.file.mimetype);

    if (report.status === "unprocessed") {
      return res.status(422).json(report);
    }
    res.json(report);
  } catch (err) {
    console.error("Error in simplify-report:", err.message);
    res.status(500).json({ error: "Failed to process report" });
  }
});

module.exports = router;
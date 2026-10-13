const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Only allow your own frontend(s). Set FRONTEND_URL in .env / Render (comma-separated for several).
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check (useful for Render and for waking the server up)
app.get("/health", (req, res) => res.send("ok"));

app.use("/ai", aiRoutes);

// Central error handler (catches multer errors: file too large, wrong type, etc.)
// Must come AFTER the routes.
app.use((err, req, res, next) => {
  console.error("Request error:", err.message);
  const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  res.status(status).json({ error: err.message });
});

module.exports = app;
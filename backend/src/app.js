require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { sequelize } = require("./models");

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
}));
app.use(express.json());

// Serve uploaded files as static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const bookingRoutes = require("./routes/bookings");
const galleryRoutes = require("./routes/gallery");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");

app.use("/api/bookings", bookingRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Initialize database
sequelize.sync({ alter: true })
  .catch(err => console.error("Database sync error:", err));

module.exports = app;

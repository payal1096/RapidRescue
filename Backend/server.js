// Backend/server.js
// FINAL CLEAN VERSION

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

/* =========================
   CONFIG
========================= */
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rapidrescue";

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static frontend serve
app.use(express.static(path.join(__dirname, "..")));

/* =========================
   DATABASE
========================= */
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* =========================
   MODELS
========================= */
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
  })
);

const Report = mongoose.model(
  "Report",
  new mongoose.Schema({
    name: String,
    contact: String,
    type: String,
    location: String,
    description: String,
    photo: String,
    status: {
      type: String,
      default: "Ambulance Assigned",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

/* =========================
   AUTH ROUTES
========================= */

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hash,
    });

    res.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Signup failed",
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.json({
        success: false,
        message: "Wrong password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Login failed",
    });
  }
});

/* =========================
   REPORT ROUTES
========================= */

// Create Report
app.post("/api/report", async (req, res) => {
  try {
    await Report.create(req.body);

    res.json({
      success: true,
      message: "Accident Report Submitted",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Report failed",
    });
  }
});

// Dashboard Stats
app.get("/api/stats", async (req, res) => {
  const total = await Report.countDocuments();
  const critical = await Report.countDocuments({ type: "Critical" });
  const major = await Report.countDocuments({ type: "Major" });
  const minor = await Report.countDocuments({ type: "Minor" });

  res.json({
    total,
    critical,
    major,
    minor,
  });
});

// All Reports
app.get("/api/reports", async (req, res) => {
  const data = await Report.find()
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(data);
});

// Search Reports
app.get("/api/search/:key", async (req, res) => {
  const key = req.params.key;

  const data = await Report.find({
    $or: [
      { name: { $regex: key, $options: "i" } },
      { location: { $regex: key, $options: "i" } },
      { type: { $regex: key, $options: "i" } },
    ],
  });

  res.json(data);
});

// Update Status
app.put("/api/status/:id", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });

  res.json({
    success: true,
    message: "Status updated",
  });
});

// Delete Report
app.delete("/api/report/:id", async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Report deleted",
  });
});

/* =========================
   FRONTEND ROUTE
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});
/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
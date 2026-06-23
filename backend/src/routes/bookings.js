const express = require("express");
const router = express.Router();

const { Booking } = require("../models");
const { authenticate, requireAdmin } = require("../middleware/auth");

const getTodayInputValue = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60000).toISOString().slice(0, 10);
};

router.post("/", async (req, res) => {
  try {
    const {
      fullname,
      email_address,
      phone_number,
      visitor_category,
      select_activities,
      booking_date,
      number_of_visitors,
    } = req.body || {};

    const required = {
      fullname,
      email_address,
      phone_number,
      visitor_category,
      select_activities,
      booking_date,
    };

    for (const [key, value] of Object.entries(required)) {
      if (value === undefined || value === null || String(value).trim() === "") {
        return res.status(400).json({
          error: `${key} is required`,
        });
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(booking_date))) {
      return res.status(400).json({
        error: "booking_date must be in YYYY-MM-DD format",
        booking_date,
      });
    }

    if (String(booking_date) < getTodayInputValue()) {
      return res.status(400).json({
        error: "booking_date must be today or a future date",
        booking_date,
      });
    }

    if (!/^\d+$/.test(String(phone_number))) {
      return res.status(400).json({ error: "phone_number must contain numbers only" });
    }

    const numVisitors = Number(number_of_visitors || 1);
    if (!Number.isInteger(numVisitors) || numVisitors < 1) {
      return res.status(400).json({ error: "number_of_visitors must be an integer >= 1" });
    }

    const bookingPayload = {
      fullname: String(fullname),
      email_address: String(email_address),
      phone_number: String(phone_number),
      visitor_category: String(visitor_category),
      select_activities: String(select_activities),
      number_of_visitors: numVisitors,
      status: String(req.body.status || "pending"),
      amount_paid: Number(req.body.amount_paid || 0),
      booking_date: String(booking_date),
    };

    const booking = await Booking.create(bookingPayload);

    return res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Insert booking failed", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    return res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      attributes: [
        "booking_id",
        "fullname",
        "email_address",
        "phone_number",
        "visitor_category",
        "select_activities",
        "number_of_visitors",
        "status",
        "amount_paid",
        "booking_date",
      ],
      order: [["booking_id", "DESC"]],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings failed:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { status, amount_paid, amount_paid_delta } = req.body;

    if (status !== undefined) {
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid booking status" });
      }
      booking.status = status;
    }

    if (amount_paid !== undefined) {
      // absolute set
      booking.amount_paid = Number(amount_paid) || 0;
    }

    if (amount_paid_delta !== undefined) {
      // increment by delta
      const current = Number(booking.amount_paid) || 0;
      booking.amount_paid = current + Number(amount_paid_delta || 0);
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await booking.destroy();
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

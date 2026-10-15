
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

const services = [
  { id: 1, name: "Classic Manicure", price: 499, duration: "30 min" },
  { id: 2, name: "Gel Nail Extensions", price: 1499, duration: "60 min" },
  { id: 3, name: "Nail Art", price: 799, duration: "45 min" },
  { id: 4, name: "Luxury Pedicure", price: 899, duration: "45 min" },
];

let bookings = [];
let nextBookingId = 1;

app.get("/", (req, res) => {
  res.send("Nail Onns backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { customerName, phone, service, date, time } = req.body;

  if (
    !customerName?.trim() ||
    !phone?.trim() ||
    !service ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields.",
    });
  }

  const booking = {
    id: nextBookingId++,
    customerName: customerName.trim(),
    phone: phone.trim(),
    service,
    date,
    time,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully!",
    booking,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nail Onns backend running at http://localhost:${PORT}`);
});

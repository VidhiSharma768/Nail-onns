
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((url) => url.trim()),
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "20kb" }));

const services = [
  {
    id: 1,
    name: "Classic Manicure",
    description: "A clean, timeless manicure for everyday elegance.",
    price: 499,
    duration: 30
  },
  {
    id: 2,
    name: "Gel Nail Art",
    description: "Glossy, long-lasting color with a creative finish.",
    price: 899,
    duration: 60
  },
  {
    id: 3,
    name: "Premium Nail Extensions",
    description: "Beautiful extensions for your statement look.",
    price: 1499,
    duration: 90
  }
];

// Demo storage only: data disappears when the server restarts.
const bookings = [];

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Nail Onns API",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const {
    customerName,
    phone,
    serviceId,
    appointmentDate,
    appointmentTime
  } = req.body || {};

  if (
    typeof customerName !== "string" ||
    customerName.trim().length < 2 ||
    customerName.trim().length > 80
  ) {
    return res.status(400).json({
      message: "Please enter a name between 2 and 80 characters."
    });
  }

  if (
    typeof phone !== "string" ||
    !/^[0-9 +()-]{8,20}$/.test(phone.trim())
  ) {
    return res.status(400).json({
      message: "Please enter a valid phone number."
    });
  }

  if (
    !Number.isInteger(serviceId) ||
    !services.some((service) => service.id === serviceId)
  ) {
    return res.status(400).json({
      message: "Please select a valid service."
    });
  }

  if (
    typeof appointmentDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)
  ) {
    return res.status(400).json({
      message: "Please select a valid appointment date."
    });
  }

  const date = new Date(`${appointmentDate}T00:00:00.000Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== appointmentDate ||
    date < today
  ) {
    return res.status(400).json({
      message: "The appointment date must be today or a future date."
    });
  }

  if (
    typeof appointmentTime !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime)
  ) {
    return res.status(400).json({
      message: "Please select a valid appointment time."
    });
  }

  const service = services.find((item) => item.id === serviceId);

  const booking = {
    id: randomUUID().slice(0, 8),
    customerName: customerName.trim(),
    phone: phone.trim(),
    serviceId,
    serviceName: service.name,
    price: service.price,
    appointmentDate,
    appointmentTime,
    status: "Requested",
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);

  return res.status(201).json(booking);
});

app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "An unexpected server error occurred."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nail Onns API running at http://localhost:${PORT}`);
});

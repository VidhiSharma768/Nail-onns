
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getServices() {
  return request("/api/services");
}

export function getBookings() {
  return request("/api/bookings");
}

export function createBooking(booking) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(booking)
  });
}

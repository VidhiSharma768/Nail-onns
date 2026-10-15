
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Menu,
  Palette,
  Sparkles,
  Star
} from "lucide-react";
import {
  createBooking,
  getBookings,
  getServices
} from "./api";

const initialForm = {
  customerName: "",
  phone: "",
  serviceId: "",
  appointmentDate: "",
  appointmentTime: ""
};

export default function App() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceData, bookingData] = await Promise.all([
          getServices(),
          getBookings()
        ]);

        setServices(serviceData);
        setBookings(bookingData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const booking = await createBooking({
        ...form,
        serviceId: Number(form.serviceId)
      });

      setBookings((previous) => [booking, ...previous]);
      setMessage(
        `Appointment requested successfully! Booking #${booking.id}`
      );
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = services.find(
    (service) => service.id === Number(form.serviceId)
  );

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <Sparkles size={22} />
          </span>
          <span>nail onns<span className="brand-dot">.</span></span>
        </a>

        <nav>
          <a href="#services">Our Services</a>
          <a href="#about">Our Studio</a>
          <a href="#booking">Book Appointment</a>
        </nav>

        <a className="nav-cta" href="#booking">
          Book your visit <ArrowRight size={16} />
        </a>

        <Menu className="mobile-menu" />
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> YOUR NAILS, YOUR CANVAS
            </div>

            <h1>
              Little details.
              <br />
              <span>Beautiful</span> nails.
            </h1>

            <p className="hero-description">
              Your self-care moment starts here. Discover beautiful
              nail art, thoughtful care, and a look that feels like you.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#booking">
                Book an appointment <ArrowRight size={17} />
              </a>
              <a className="button-text" href="#services">
                Explore services
              </a>
            </div>

            <div className="social-proof">
              <div className="avatar-stack">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </div>
              <div>
                <div className="stars">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p>Your next favorite nail day awaits</p>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1100&q=85"
              alt="Elegant manicure and nail art"
            />
            <div className="floating-note">
              <Heart size={20} />
              <div>
                <strong>Made for you</strong>
                <p>A little luxury, every day</p>
              </div>
            </div>
            <div className="round-stamp">
              <Sparkles size={24} />
              <span>LOVE YOUR NAILS</span>
            </div>
          </div>
        </section>

        <section className="benefits" id="about">
          <div>
            <Palette size={24} />
            <span>Creative nail art</span>
          </div>
          <div>
            <Heart size={24} />
            <span>Self-care first</span>
          </div>
          <div>
            <Sparkles size={24} />
            <span>Details that shine</span>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A LITTLE SOMETHING FOR YOU</span>
              <h2>Find your nail moment.</h2>
            </div>
            <p>
              From timeless classics to playful designs,
              choose the service that fits your mood.
            </p>
          </div>

          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="service-grid">
              {services.map((service, index) => (
                <article className="service-card" key={service.id}>
                  <div className={`service-art art-${index % 3}`}>
                    {index === 0 ? (
                      <Heart size={43} />
                    ) : index === 1 ? (
                      <Sparkles size={43} />
                    ) : (
                      <Palette size={43} />
                    )}
                    <span>{service.duration} MIN</span>
                  </div>
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-bottom">
                      <strong>₹{service.price}</strong>
                      <a
                        href="#booking"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            serviceId: String(service.id)
                          }))
                        }
                      >
                        Choose <ArrowRight size={15} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="booking-section section" id="booking">
          <div className="booking-intro">
            <span className="eyebrow">YOUR ME-TIME STARTS HERE</span>
            <h2>Let's make it a nail day.</h2>
            <p>
              Pick your favorite service and preferred appointment
              time. We'll save your request in our demo booking system.
            </p>

            <div className="booking-detail">
              <CalendarDays size={22} />
              <div>
                <strong>Your preferred date</strong>
                <p>Choose a date that works for you.</p>
              </div>
            </div>

            <div className="booking-detail">
              <Clock3 size={22} />
              <div>
                <strong>Your preferred time</strong>
                <p>We'll record your selected time.</p>
              </div>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <h3>Book an appointment</h3>
            <p className="form-subtitle">
              Fill in your details to create a booking request.
            </p>

            <label htmlFor="customerName">Your name</label>
            <input
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={updateForm}
              placeholder="Enter your full name"
              minLength={2}
              maxLength={80}
              required
            />

            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateForm}
              placeholder="Enter your phone number"
              pattern="[0-9 +()-]{8,20}"
              title="Enter a valid phone number"
              required
            />

            <label htmlFor="serviceId">Choose a service</label>
            <select
              id="serviceId"
              name="serviceId"
              value={form.serviceId}
              onChange={updateForm}
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — ₹{service.price}
                </option>
              ))}
            </select>

            {selectedService && (
              <p className="selected-service">
                {selectedService.duration} minutes · ₹{selectedService.price}
              </p>
            )}

            <div className="form-row">
              <div>
                <label htmlFor="appointmentDate">Preferred date</label>
                <input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.appointmentDate}
                  onChange={updateForm}
                  required
                />
              </div>
              <div>
                <label htmlFor="appointmentTime">Preferred time</label>
                <input
                  id="appointmentTime"
                  name="appointmentTime"
                  type="time"
                  value={form.appointmentTime}
                  onChange={updateForm}
                  required
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {message && (
              <p className="success-message">
                <CheckCircle2 size={17} /> {message}
              </p>
            )}

            <button
              className="button-primary submit-button"
              type="submit"
              disabled={submitting || loading}
            >
              {submitting ? "Saving..." : "Request appointment"}
              {!submitting && <ArrowRight size={17} />}
            </button>

            <p className="form-footnote">
              Demo only: this does not confirm salon availability.
            </p>
          </form>
        </section>

        <section className="recent-bookings section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR DEMO DATA</span>
              <h2>Recent booking requests</h2>
            </div>
            <button
              className="refresh-button"
              onClick={async () => {
                try {
                  setBookings(await getBookings());
                  setError("");
                } catch (err) {
                  setError(err.message);
                }
              }}
            >
              Refresh list
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="empty-state">
              No bookings yet. Your first appointment request will
              appear here.
            </p>
          ) : (
            <div className="booking-list">
              {bookings.map((booking) => (
                <article className="booking-item" key={booking.id}>
                  <div>
                    <strong>{booking.customerName}</strong>
                    <p>{booking.serviceName}</p>
                    <p>
                      {booking.appointmentDate} at {booking.appointmentTime}
                    </p>
                  </div>
                  <span className="booking-status">{booking.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">nail onns.</a>
        <p>A little color. A little care. A lot of you.</p>
        <span>© {new Date().getFullYear()} Nail Onns</span>
      </footer>
    </div>
  );
}

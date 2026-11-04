"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

const fallbackServices: Service[] = [
  { id: "svc-1", name: "Signature Cut", duration: 45, price: 1200 },
  { id: "svc-2", name: "Hair Spa Ritual", duration: 60, price: 2400 },
  { id: "svc-3", name: "Bridal Glow", duration: 90, price: 4500 },
  { id: "svc-4", name: "Skin Renewal Facial", duration: 50, price: 1800 },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customerName: "",
    serviceId: "svc-1",
    stylist: "Riya",
    time: "Today, 5:30 PM",
    branchId: "branch-1",
  });
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.services) && data.services.length) {
          setServices(data.services);
          setForm((prev) => ({ ...prev, serviceId: data.services[0].id }));
        }
      })
      .catch((error) => {
        console.error("Failed to load services:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer demo-token`,
        },
        body: JSON.stringify({
          customerName: form.customerName || "Guest Client",
          serviceId: form.serviceId,
          stylist: form.stylist,
          time: form.time,
          branchId: form.branchId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setBookingMessage(`Booking confirmed: ${result.booking.service} at ${result.booking.time}`);
      setForm((prev) => ({ ...prev, customerName: "" }));
    } catch (error) {
      setBookingMessage(error instanceof Error ? error.message : "Booking failed");
    }
  };

  return (
    <div className="salon-page">
      <header className="top-nav">
        <div className="brand">
          <span className="logo">G</span>
          GlowLane
        </div>

        <nav>
          <a href="#services">Services</a>
          <a href="#experience">Experience</a>
          <a href="#reviews">Reviews</a>
          <a href="#offers">Offers</a>
        </nav>

        <button className="nav-btn">Book now</button>
      </header>

      <main className="hero">
        <section className="hero-copy">
          <span className="badge">Premium salon experience</span>
          <h1>Beauty that feels personal, polished, and unforgettable.</h1>
          <p className="subtext">
            Discover luxury grooming, multi-branch salon care, and instant appointments across Mumbai’s most-loved beauty destinations.
          </p>

          <div className="cta-row">
            <button className="primary-btn">Book an appointment</button>
            <button className="secondary-btn">View packages</button>
          </div>

          <ul className="feature-list">
            <li>Multi-branch salon access</li>
            <li>Certified stylists</li>
            <li>Same-day slots</li>
          </ul>
        </section>

        <aside className="hero-card">
          <div className="mini-panel">
            <span>Today’s bookings</span>
            <strong>184</strong>
          </div>

          <form className="booking-card" onSubmit={handleSubmit}>
            <p>Next available slot</p>
            <h3>Today • 5:30 PM</h3>

            <div className="field-row">
              <label>
                Name
                <input value={form.customerName} onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))} />
              </label>
            </div>

            <div className="field-row split">
              <label>
                Service
                <select value={form.serviceId} onChange={(event) => setForm((prev) => ({ ...prev, serviceId: event.target.value }))}>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Time
                <input value={form.time} onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))} />
              </label>
            </div>

            <div className="field-row split">
              <label>
                Stylist
                <input value={form.stylist} onChange={(event) => setForm((prev) => ({ ...prev, stylist: event.target.value }))} />
              </label>

              <label>
                Branch
                <input value={form.branchId} onChange={(event) => setForm((prev) => ({ ...prev, branchId: event.target.value }))} />
              </label>
            </div>

            <button className="primary-btn" style={{ width: "100%" }} type="submit">
              Reserve slot
            </button>

            {bookingMessage && <div className="booking-message">{bookingMessage}</div>}
          </form>
        </aside>
      </main>

      <section className="services-section" id="services">
        <div className="section-head">
          <span className="badge alt">Our services</span>
          <h2>Salon services designed for every mood and moment.</h2>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article key={service.id} className="service-card">
              <div className="service-icon">{["✂", "✦", "❋", "✧"][index % 4]}</div>
              <h3>{service.name}</h3>
              <p>{service.duration} minutes</p>
              <div className="service-footer">
                <span>₹{service.price}</span>
                <button type="button">Book</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="info-row" id="experience">
        <div className="info-card">
          <span className="badge alt">Why GlowLane</span>
          <h2>Thoughtful beauty care, built around your routine.</h2>
        </div>

        <div className="info-card accent-card">
          <div className="stat-box">
            <strong>12k+</strong>
            <span>happy clients</span>
          </div>
          <div className="stat-box">
            <strong>4.9/5</strong>
            <span>average rating</span>
          </div>
          <div className="stat-box">
            <strong>6</strong>
            <span>premium branches</span>
          </div>
        </div>
      </section>

      <section className="reviews" id="reviews">
        <div className="review-card">
          <p>
            “The booking experience was seamless and the quality of care was salon-level premium. I booked in seconds and my stylist knew exactly what I wanted.”
          </p>
          <strong>— Nisha M., Bandra</strong>
        </div>
        <div className="review-card">
          <p>
            “Best bridal prep experience I’ve had. The team is polished, warm, and incredibly professional across all services.”
          </p>
          <strong>— Aditi S., Powai</strong>
        </div>
      </section>

      <section className="offer-strip" id="offers">
        <div>
          <span className="badge alt">Limited offer</span>
          <h3>Book any 2 premium services and save 15% today.</h3>
        </div>
        <button className="primary-btn">Claim offer</button>
      </section>

      {loading && <p className="status-line">Loading latest salon offers...</p>}
    </div>
  );
}

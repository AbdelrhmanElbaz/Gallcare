export default function HelpDesk({ showToast }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! We will reply within 24 hours.");
    e.currentTarget.reset();
  };

  return (
    <section id="help" style={{ textAlign: "center" }}>
      <div className="section-label">Support</div>
      <h2 className="section-title">Reach our Help Desk for support</h2>
      <p className="section-sub" style={{ margin: "0 auto" }}>
        Have a question or concern? Our support team is on standby to assist you
        with bookings, billing, and clinical queries.
      </p>

      <form className="help-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Your email address" required />
        <select>
          <option value="">Topic</option>
          <option>Appointment Booking</option>
          <option>Billing & Insurance</option>
          <option>Medical Records</option>
          <option>Technical Support</option>
        </select>
        <button type="submit" className="btn-primary">
          Contact Us
        </button>
      </form>
    </section>
  );
}

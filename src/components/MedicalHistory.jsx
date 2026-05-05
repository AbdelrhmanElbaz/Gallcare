import { useState } from "react";

export default function MedicalHistory({ showToast }) {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    symptoms: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Medical history saved!");
    setForm({
      fname: "",
      lname: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      symptoms: "",
    });
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <section id="history">
      <div className="section-head">
        <div className="section-label">Patient Records</div>
        <h2 className="section-title">Medical History</h2>
        <p className="section-sub">
          Please fill in your health information so our specialists can provide
          the most accurate and personalised care.
        </p>
      </div>

      <form className="history-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fname">First Name</label>
            <input
              id="fname"
              type="text"
              placeholder="Ahmed"
              value={form.fname}
              onChange={handleChange("fname")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lname">Last Name</label>
            <input
              id="lname"
              type="text"
              placeholder="Hassan"
              value={form.lname}
              onChange={handleChange("lname")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={form.dob}
              onChange={handleChange("dob")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={form.gender}
              onChange={handleChange("gender")}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+20 010 0000 0000"
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div className="form-group full">
            <label htmlFor="symptoms">Current Symptoms</label>
            <textarea
              id="symptoms"
              placeholder="Describe your symptoms, when they started, and any relevant history..."
              value={form.symptoms}
              onChange={handleChange("symptoms")}
            />
          </div>
          <div
            className="form-group full"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "auto" }}
            >
              Save Medical History
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

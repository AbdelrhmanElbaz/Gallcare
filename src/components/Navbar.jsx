export default function Navbar() {
  return (
    <nav>
      <a className="logo" href="#">
        <div className="logo-icon">💚</div>
        GallCare
      </a>

      <ul className="nav-links">
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#how">How it Works</a>
        </li>
        <li>
          <a href="#testimonials">Testimonials</a>
        </li>
        <li>
          <a href="#history">Medical History</a>
        </li>
        <li>
          <a href="#help">Help Desk</a>
        </li>
      </ul>

      <a href="#help" className="nav-cta">
        Get Help Now
      </a>
    </nav>
  );
}

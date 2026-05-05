import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import MedicalHistory from "./components/MedicalHistory";
import Upload from "./components/Upload";
import HelpDesk from "./components/HelpDesk";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Register from "./components/Register";
import SignIn from "./components/SignIn";

function HomePage({ showToast }) {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <MedicalHistory showToast={showToast} />
      <Upload showToast={showToast} />
      <HelpDesk showToast={showToast} />
      <Footer />
    </>
  );
}

function App() {
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const showToast = (message) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3500);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<HomePage showToast={showToast} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
      <Toast visible={toast.visible} message={toast.message} />
    </BrowserRouter>
  );
}

export default App;

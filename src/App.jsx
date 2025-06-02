// src/App.jsx
import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import AboutQuincho from './components/features/AboutQuincho';
import Services from './components/features/Services';
import Gallery from './components/features/Gallery';
import BookingSection from './components/features/Booking/BookingSection';
import Testimonials from './components/features/Testimonials';
import Contact from './components/features/Booking/Contact'; // 1. Importa

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutQuincho />
        <Services />
        <Gallery />
        <BookingSection />
        <Testimonials />
        <Contact /> {/* 2. Añade */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
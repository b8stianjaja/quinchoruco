// src/components/features/Hero.jsx
import React from 'react';
import heroBackgroundImage from '../../assets/images/quincho.jpg'; // Verifica que esta ruta sea correcta

function Hero() {
  const heroStyle = {
    backgroundImage: `url(${heroBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center text-white relative"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center p-6 max-w-3xl mx-auto">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-hero-title" // <-- APLICA LA CLASE AQUÍ
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
        >
          El espacio ideal para celebrar es en <br/>Quincho El Ruco
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto font-hero-title" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          Eventos, asados y momentos inolvidables. Totalmente equipado y listo para que disfrutes.
        </p>
        <a
          href="#booking"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-hero-title font-semibold py-3 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          Ver Disponibilidad y Reservar
        </a>
      </div>
    </section>
  );
}

export default Hero;
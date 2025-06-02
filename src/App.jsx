// QER/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Componentes del sitio público (asegúrate que las rutas de importación sean correctas)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import AboutQuincho from './components/features/AboutQuincho';
import Services from './components/features/Services';
import Gallery from './components/features/Gallery';
import BookingSection from './components/features/Booking/BookingSection';
import Testimonials from './components/features/Testimonials';
import Contact from './components/features/Booking/Contact'; // Asumo que Contact es parte del sitio público

// Componente del Panel de Administración
// Asegúrate de que la ruta de importación sea correcta según tu estructura de carpetas.
// Si creaste QER/src/admin/AdminPanel.jsx, esta ruta debería ser correcta.
import AdminPanel from './admin/AdminPanel'; 

// Componente que envuelve todas las secciones del sitio público
// Esto ayuda a mantener el Navbar y Footer solo para las secciones públicas.
const PublicSiteLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Aquí puedes definir sub-rutas para el sitio público si las tuvieras,
            o simplemente renderizar todas las secciones como antes.
            Por simplicidad, las renderizamos todas directamente. */}
        <Hero />
        <AboutQuincho />
        <Services />
        <Gallery />
        <BookingSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    // Clases para asegurar que el div principal ocupe toda la altura y permita que el footer se pegue abajo.
    <div className="flex flex-col min-h-screen bg-gray-50"> 
      <Router>
        <Routes>
          {/* Ruta para el Panel de Administración */}
          {/* Cualquier URL que comience con /admin/ será manejada por AdminPanel. */}
          {/* React-Admin, a través de su authProvider, se encargará de mostrar */}
          {/* su propia página de login si el usuario no está autenticado, */}
          {/* sin cambiar la URL base de /admin. */}
          <Route path="/admin/*" element={<AdminPanel />} />
          
          {/* Rutas para el Sitio Público */}
          {/* Usamos "/*" como comodín para todas las demás rutas, que mostrarán el PublicSiteLayout. */}
          {/* Esto incluye la ruta raíz "/" (tu landing page). */}
          <Route path="/*" element={<PublicSiteLayout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
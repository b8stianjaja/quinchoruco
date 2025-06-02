// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import logoImage from '../../assets/images/qer.svg'; // Asegúrate que esta ruta es correcta y tienes tu logo aquí

const navLinksData = [
  { href: '#hero', label: 'Inicio' },
  { href: '#about', label: 'El Quincho' },
  { href: '#services', label: 'Servicios' },
  { href: '#gallery', label: 'Galería' },
  { href: '#booking', label: 'Reservas' },
  { href: '#testimonials', label: 'Opiniones' },
  { href: '#contact', label: 'Contacto' },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleScroll = useCallback(() => {
    let currentSection = navLinksData[0].href; 
    navLinksData.forEach(link => {
      const sectionId = link.href.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop - 120; // Offset para la detección del scroll
        if (window.scrollY >= sectionTop) {
          currentSection = link.href;
        }
      }
    });
    
    const lastLink = navLinksData[navLinksData.length - 1];
    const lastSection = document.getElementById(lastLink.href.substring(1));
    if (lastSection && (window.innerHeight + window.scrollY >= lastSection.offsetTop + lastSection.offsetHeight / 2 || window.innerHeight + window.scrollY >= document.body.offsetHeight - 20 )) {
        currentSection = lastLink.href;
    }

    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    handleScroll(); 
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false); // Cierra el menú móvil al hacer clic en un enlace
  };

  const renderNavLinks = (isMobile = false) =>
    navLinksData.map((link) => (
      <a
        key={link.label}
        href={link.href}
        onClick={isMobile ? handleMobileLinkClick : undefined}
        className={`
          font-nav-link // Tu clase para la fuente (definida en index.css)
          transition-colors duration-300
          ${isMobile 
            ? 'block w-full text-left py-3 px-6 text-base' // Móvil: bloque, ancho completo, texto a la izquierda, padding
            : 'px-3 py-2 rounded-md text-sm font-medium'    // Desktop: padding, texto mediano
          }
          ${activeSection === link.href
            ? isMobile // Estilos ACTIVO Móvil
              ? 'bg-orange-50 text-orange-600 font-semibold' 
              // Estilos ACTIVO Desktop
              : 'text-orange-600 font-semibold border-b-2 border-orange-600' 
            : isMobile // Estilos INACTIVO Móvil
              ? 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
              // Estilos INACTIVO Desktop
              : 'text-gray-600 hover:text-orange-600'
          }
        `}
      >
        {link.label}
      </a>
    ));

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      {/* Contenedor principal del Navbar: flex, items-center. No usamos justify-between aquí. */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* 1. Logo a la izquierda */}
        <div className="flex-shrink-0"> {/* Contenedor para el logo para que no se deforme */}
          <a href="#hero" className="flex items-center">
            <img
              src={logoImage}
              alt="Logo Quincho QERa"
              className="h-9 w-auto" // Ajusta la altura de tu logo
            />
          </a>
        </div>

        {/* 2. Enlaces de Navegación Desktop - CENTRADOS */}
        {/* `flex-grow` hace que este div ocupe el espacio disponible. */}
        {/* `justify-center` centra los enlaces <a> dentro de este div. */}
        <div className="hidden md:flex flex-grow items-center justify-center space-x-1 lg:space-x-2">
          {renderNavLinks()}
        </div>
        
        {/* 3. Botón "Reservar" de ESCRITORIO HA SIDO ELIMINADO */}

        {/* 4. Contenedor para el botón de hamburguesa en MÓVIL */}
        {/* `ml-auto` empuja este bloque a la derecha cuando los links NO son flex-grow */}
        {/* O, como los links son flex-grow, este div se posicionará después de ellos. */}
        {/* Para asegurar que quede a la derecha del todo y el flex-grow de los links funcione bien, */}
        {/* le damos un ancho mínimo (invisible en desktop si no hay contenido) o lo hacemos flex-shrink-0 */}
        <div className="flex items-center justify-end md:flex-shrink-0" style={{ minWidth: '50px' /* Espacio para el botón hamburguesa o para balancear el logo */ }}>
          {/* Botón "Reservar" para móvil HA SIDO ELIMINADO para simplificar */}
          {/* Si lo quieres de vuelta, iría aquí, antes del botón de hamburguesa */}

          {/* Botón de Menú Móvil (Hamburguesa) */}
          <div className="md:hidden"> {/* Solo visible en pantallas pequeñas */}
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="text-gray-600 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 p-2 rounded-md"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg" id="mobile-menu">
          <div className="py-2"> {/* Ajustado padding y quitado space-y-1 para control total con el padding de los items */}
            {renderNavLinks(true)}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
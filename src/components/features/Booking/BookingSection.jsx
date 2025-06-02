// src/components/features/Booking/BookingSection.jsx
import React, { useState, useCallback } from 'react';
import Calendar from './Calendar';
import BookingForm from './BookingForm';

function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotAvailability, setSlotAvailability] = useState({ 
    isDaySlotAvailable: true, // Valor inicial optimista
    isNightSlotAvailable: true // Valor inicial optimista
  });
  const [selectedSlot, setSelectedSlot] = useState(null); // 'day', 'night', or null

  // Esta función es llamada por Calendar.jsx cuando se selecciona una fecha.
  // 'availability' es un objeto como { isDaySlotAvailable: boolean, isNightSlotAvailable: boolean }
  const handleDateSelection = useCallback((date, availability) => {
    setSelectedDate(date);
    setSlotAvailability(availability || { isDaySlotAvailable: true, isNightSlotAvailable: true });
    setSelectedSlot(null); // Importante: Resetea la franja al cambiar de día
  }, []);

  const handleSlotSelection = useCallback((slot) => {
    setSelectedSlot(slot);
  }, []);

  const handleBookingSuccess = useCallback(() => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlotAvailability({ isDaySlotAvailable: true, isNightSlotAvailable: true });
    // Aquí podríamos querer forzar una actualización de los datos del calendario
    // si el hook useCalendar no lo hace automáticamente al cambiar selectedDate a null.
    // Por ahora, la lógica de useCalendar se actualiza al cambiar de mes.
  }, []);

  return (
    <section id="booking" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-4 font-hero-title" style={{ color: '#6F4E37' }}>
            Realiza tu Reserva
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-hero-title">
            Consulta nuestra disponibilidad y elige la fecha y franja horaria perfecta para tu evento en Quincho El Ruco.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-gray-50 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left font-hero-title">
              1. Selecciona una Fecha
            </h3>
            <Calendar
              onDateSelect={handleDateSelection}
              initialSelectedDate={selectedDate} 
            />
          </div>

          <div className="w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left font-hero-title">
              2. Elige Franja y Completa Datos
            </h3>
            <BookingForm
              selectedDate={selectedDate}
              onBookingSuccess={handleBookingSuccess}
              slotAvailability={slotAvailability}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelection} // Pasa la función para seleccionar franja
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingSection;
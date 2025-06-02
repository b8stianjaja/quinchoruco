// QER/src/components/features/Booking/BookingSection.jsx
import React, { useState, useCallback, useEffect } from 'react';
import Calendar from './Calendar';
import BookingForm from './BookingForm';

function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotAvailability, setSlotAvailability] = useState({ 
    isDaySlotAvailable: true,
    isNightSlotAvailable: true 
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingProcessStatus, setBookingProcessStatus] = useState({ message: '', type: '' });

  // Ya no necesitamos 'resetSelectionAfterSuccess', lo manejamos en el setTimeout

  const clearMainStatusMessage = useCallback(() => {
    // Esta función es para que BookingForm pueda limpiar el mensaje si cambia la fecha/slot
    console.log("[BookingSection] clearMainStatusMessage llamado");
    setBookingProcessStatus({ message: '', type: '' });
  }, []);

  const handleDateSelection = useCallback((date, availability) => {
    setSelectedDate(date);
    setSlotAvailability(availability || { isDaySlotAvailable: true, isNightSlotAvailable: true });
    setSelectedSlot(null);
    setBookingProcessStatus({ message: '', type: '' }); // Limpiar mensaje al seleccionar nueva fecha
  }, []);

  const handleSlotSelection = useCallback((slot) => {
    setSelectedSlot(slot);
    setBookingProcessStatus({ message: '', type: '' }); // Limpiar mensaje al seleccionar nuevo slot
  }, []);

  const handleBookingAttemptSuccess = useCallback((successMessage) => {
    console.log("[BookingSection] handleBookingAttemptSuccess llamado con mensaje:", successMessage);
    setBookingProcessStatus({ message: successMessage, type: 'success' });
    
    // Limpiamos la selección de fecha/franja DESPUÉS de un delay
    // para dar tiempo a que el mensaje de éxito se muestre en la UI.
    // BookingForm limpiará sus propios campos de texto.
    setTimeout(() => {
      console.log("[BookingSection] setTimeout en success: Limpiando selectedDate y selectedSlot");
      setSelectedDate(null); 
      setSelectedSlot(null); 
      // Opcional: Limpiar también el mensaje de éxito después de que se haya mostrado un tiempo
      // Si quieres que el mensaje desaparezca después de este delay, descomenta la siguiente línea:
      // setBookingProcessStatus({ message: '', type: '' }); 
    }, 5000); // Mostrar mensaje por 5 segundos (o el tiempo que desees)
  }, []);

  const handleBookingAttemptError = useCallback((errorMessage) => {
    console.log("[BookingSection] handleBookingAttemptError llamado con mensaje:", errorMessage);
    setBookingProcessStatus({ message: errorMessage, type: 'error' });
    // No limpiamos fecha/franja para que el usuario pueda corregir y reintentar.
  }, []);
  
  // Log para depurar el estado del mensaje ANTES del return
  console.log("[BookingSection] Renderizando. bookingProcessStatus:", bookingProcessStatus);

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

        {/* --- RENDERIZADO DEL MENSAJE --- */}
        {bookingProcessStatus.message && (
          <div className="max-w-5xl mx-auto mb-6 text-center">
            <p 
              role="alert" 
              aria-live="assertive" 
              style={{ /* ... tus estilos en línea para visibilidad ... */ 
                padding: '1rem', borderRadius: '0.375rem', fontSize: '0.875rem',
                border: '1px solid',
                backgroundColor: bookingProcessStatus.type === 'success' ? '#DEF7E0' : bookingProcessStatus.type === 'error' ? '#FED7D7' : '#FEF3C7',
                color: bookingProcessStatus.type === 'success' ? '#2F855A' :  bookingProcessStatus.type === 'error' ? '#C53030' : '#92400E',
                borderColor: bookingProcessStatus.type === 'success' ? '#9AE6B4' : bookingProcessStatus.type === 'error' ? '#FEB2B2' : '#FEEBC8',
              }}
            >
              {bookingProcessStatus.message}
            </p>
          </div>
        )}
        {/* --- FIN DEL RENDERIZADO DEL MENSAJE --- */}

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
              onBookingAttemptSuccess={handleBookingAttemptSuccess}
              onBookingAttemptError={handleBookingAttemptError}
              slotAvailability={slotAvailability}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelection}
              // Pasamos la función para que BookingForm pueda limpiar el mensaje principal
              // si el usuario cambia la fecha/slot ANTES de enviar el formulario.
              clearBookingProcessStatus={clearMainStatusMessage} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default BookingSection;  
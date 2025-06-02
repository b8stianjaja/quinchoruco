// QER/src/components/features/Booking/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { submitBooking } from '../../../services/bookingService'; // Tu servicio modificado

function BookingForm({ 
  selectedDate, 
  onBookingSuccess, // Callback que BookingSection usa para resetear selectedDate, etc.
  slotAvailability, 
  selectedSlot, 
  onSlotSelect 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado local para manejar el mensaje de éxito o error de la sumisión
  const [submissionStatus, setSubmissionStatus] = useState({ message: '', type: '' }); 
  const [formDataState, setFormDataState] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    notes: ''
  });

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
      })
    : 'Ninguna fecha seleccionada';

  // Efecto para limpiar el formulario y el mensaje de submission
  // cuando el usuario cambia la fecha o la franja seleccionada.
  useEffect(() => {
    console.log("[BookingForm] useEffect: selectedDate o selectedSlot cambió. Limpiando formulario y mensaje.");
    setFormDataState({ name: '', email: '', phone: '', guests: '', notes: '' });
    setSubmissionStatus({ message: '', type: '' }); // Limpia cualquier mensaje previo
  }, [selectedDate, selectedSlot]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Limpia cualquier mensaje de submission previo ANTES de un nuevo intento
    setSubmissionStatus({ message: '', type: '' });

    if (!selectedDate) {
      setSubmissionStatus({ message: 'Por favor, selecciona una fecha del calendario.', type: 'error' });
      return;
    }
    if (!selectedSlot) {
      setSubmissionStatus({ message: 'Por favor, selecciona una franja horaria.', type: 'error' });
      return;
    }

    setIsSubmitting(true); 
    
    const bookingData = {
      bookingDate: new Date(selectedDate).toISOString().split('T')[0],
      slotType: selectedSlot,
      userName: formDataState.name,
      userEmail: formDataState.email,
      userPhone: formDataState.phone,
      guestCount: formDataState.guests,
      notes: formDataState.notes,
    };
    console.log('[BookingForm] handleSubmit: Enviando datos:', bookingData);

    try {
      const response = await submitBooking(bookingData); 
      console.log('[BookingForm] handleSubmit: Respuesta del backend:', response);
      
      if (response && response.success && response.message) {
        setSubmissionStatus({ message: response.message, type: 'success' });
        // ¡Importante! NO limpiamos formDataState aquí.
        // Dejamos que el useEffect lo haga si onBookingSuccess cambia selectedDate.
        // O, si queremos que el formulario se limpie explícitamente y el mensaje persista:
        // setFormDataState({ name: '', email: '', phone: '', guests: '', notes: '' });

        if (onBookingSuccess) {
           onBookingSuccess(); // Esto es lo que llama BookingSection para resetear selectedDate etc.
                               // Si esto cambia selectedDate, el useEffect de arriba limpiará el mensaje.
                               // Si onBookingSuccess NO cambia selectedDate, el mensaje de éxito persistirá.
        }
      } else {
        // La respuesta del backend no fue exitosa o no tiene el formato esperado
        const errorMessage = (response && response.message) 
          ? response.message 
          : 'Respuesta inesperada del servidor al procesar la solicitud.';
        setSubmissionStatus({ message: errorMessage, type: 'error' });
        console.warn('[BookingForm] handleSubmit: Respuesta del backend no fue exitosa o no tiene formato esperado:', response);
      }
    } catch (error) {
      console.error('[BookingForm] handleSubmit: Error capturado:', error);
      const errorMessage = (error && error.message) 
        ? error.message 
        : 'Ocurrió un error desconocido al enviar la solicitud de reserva.';
      setSubmissionStatus({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases para los botones de franja (se mantienen igual)
  const slotButtonBaseClasses = "w-full p-3 border rounded-lg text-sm text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-70";
  const slotButtonSelectedClasses = "bg-orange-500 text-white border-orange-600 ring-orange-500 shadow-md";
  const slotButtonAvailableClasses = "bg-white hover:bg-orange-50 border-gray-300 text-gray-800 hover:border-orange-300";
  const slotButtonDisabledClasses = "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed";

  console.log("[BookingForm] Renderizando. submissionStatus:", submissionStatus);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
      {/* Campo Fecha Seleccionada */}
      <div>
        <label htmlFor="selected-date-display" className="block text-sm font-medium text-gray-700 mb-1">Fecha Seleccionada</label>
        <input type="text" id="selected-date-display" value={formattedDate} readOnly className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-sm text-gray-700"/>
      </div>

      {/* Selección de Franja Horaria */}
      {selectedDate && (
        <div className="space-y-3">
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Elige una Franja Horaria para el <span className="font-semibold">{new Date(selectedDate).toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})}</span>:
          </p>
          <button type="button" onClick={() => slotAvailability?.isDaySlotAvailable && onSlotSelect('day')} disabled={!slotAvailability?.isDaySlotAvailable || isSubmitting}
            className={`${slotButtonBaseClasses} ${slotAvailability?.isDaySlotAvailable ? (selectedSlot === 'day' ? slotButtonSelectedClasses : slotButtonAvailableClasses) : slotButtonDisabledClasses}`}>
            <span className="font-semibold block">Franja Día</span>
            <span className="text-xs">09:00 - 19:00 hrs</span>
            {!slotAvailability?.isDaySlotAvailable && <span className="text-xs block">(No disponible)</span>}
          </button>
          <button type="button" onClick={() => slotAvailability?.isNightSlotAvailable && onSlotSelect('night')} disabled={!slotAvailability?.isNightSlotAvailable || isSubmitting}
            className={`${slotButtonBaseClasses} ${slotAvailability?.isNightSlotAvailable ? (selectedSlot === 'night' ? slotButtonSelectedClasses : slotButtonAvailableClasses) : slotButtonDisabledClasses}`}>
            <span className="font-semibold block">Franja Noche</span>
            <span className="text-xs">20:00 - 07:00 hrs (+1 día)</span>
            {!slotAvailability?.isNightSlotAvailable && <span className="text-xs block">(No disponible)</span>}
          </button>
        </div>
      )}

      {/* Fieldset para datos del usuario */}
      <fieldset disabled={!selectedDate || !selectedSlot || isSubmitting} className="space-y-6">
        {/* ... tus campos de input (name, email, phone, guests, notes) ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo<span className="text-red-500 ml-0.5">*</span></label>
          <input type="text" id="name" name="name" value={formDataState.name} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 disabled:bg-gray-100" placeholder="Ej: Juan Pérez"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico<span className="text-red-500 ml-0.5">*</span></label>
          <input type="email" id="email" name="email" value={formDataState.email} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 disabled:bg-gray-100" placeholder="Ej: juan.perez@correo.com"/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input type="tel" id="phone" name="phone" value={formDataState.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 disabled:bg-gray-100" placeholder="Ej: +56 9 1234 5678"/>
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Nº de Invitados (aprox.)</label>
          <input type="number" id="guests" name="guests" value={formDataState.guests} onChange={handleInputChange} min="1" max="50" className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 disabled:bg-gray-100" placeholder="Ej: 25"/>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales (opcional)</label>
          <textarea id="notes" name="notes" value={formDataState.notes} onChange={handleInputChange} rows="3" className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 disabled:bg-gray-100" placeholder="Ej: Necesitaremos espacio extra..."></textarea>
        </div>
      </fieldset>

      {/* Botón de Envío */}
      <button type="submit" disabled={!selectedDate || !selectedSlot || isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
        {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Enviando Solicitud...</>) : ('Solicitar Reserva')}
      </button>
      
      {/* --- ESTE ES EL BLOQUE QUE MUESTRA EL MENSAJE EN LA UI --- */}
      {submissionStatus.message && (
        <p 
          role="alert" 
          aria-live="assertive" 
          className={`text-sm text-center mt-3 ${ // Clases de Tailwind para el estilo
            submissionStatus.type === 'success' ? 'text-green-700' : 
            submissionStatus.type === 'error' ? 'text-red-600' : 
            'text-yellow-700' // Un color por defecto si type no es success o error
          }`}
          // Puedes añadir estilos en línea para asegurar visibilidad si Tailwind no aplica bien
          // style={{ 
          //   backgroundColor: submissionStatus.type === 'success' ? '#f0fff4' : '#fff5f5',
          //   padding: '0.75rem', borderRadius: '0.25rem' 
          // }}
        >
          {submissionStatus.message}
        </p>
      )}
      {/* --- FIN DEL BLOQUE DEL MENSAJE --- */}
    </form>
  );
}
export default BookingForm;
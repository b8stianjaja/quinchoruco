// QER/src/services/bookingService.js

// Esta será la URL base de tu API backend.
// Cuando desarrolles tu backend, correrá en un puerto local, ej: http://localhost:3001
// Para producción, esta será la URL de tu backend desplegado.
// Considera usar variables de entorno para esto: import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = 'http://localhost:3001/api'; // ¡AJUSTA ESTO CUANDO TENGAS TU BACKEND EN PRODUCCIÓN!

/**
 * Obtiene las franjas horarias que ya han sido CONFIRMADAS por un administrador.
 * @param {number} year - El año a consultar.
 * @param {number} month - El mes a consultar (0-indexado, como lo usa JavaScript Date).
 * @returns {Promise<Array<{date: string, slot: 'day' | 'night'}>>}
 * @throws {Error} Si hay un problema con la petición o la respuesta del servidor.
 */
export const getBookedSlots = async (year, month) => {
  const apiMonth = month + 1; 
  try {
    const response = await fetch(`${API_BASE_URL}/availability?year=${year}&month=${apiMonth}`);
    if (!response.ok) {
      let errorData = { message: `Error del servidor: ${response.status} al obtener disponibilidad.` };
      try {
        const specificError = await response.json();
        errorData.message = specificError.message || errorData.message;
      } catch (jsonError) {
        // Silencio en la consola, el error se propaga
      }
      throw new Error(errorData.message);
    }
    const confirmedBookings = await response.json();
    return confirmedBookings || [];
  } catch (error) {
    throw error; 
  }
};

/**
 * Envía una nueva SOLICITUD de reserva al backend para ser revisada por un administrador.
 * @param {object} bookingData - Los datos de la reserva a enviar.
 * @returns {Promise<object>} La respuesta del backend.
 * @throws {Error} Si hay un problema con la petición o la respuesta del servidor.
 */
export const submitBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      let errorData = { message: `Error del servidor: ${response.status} al enviar la solicitud.` };
      try {
        const specificError = await response.json();
        errorData.message = specificError.message || errorData.message;
      } catch (jsonError) {
        // Silencio en la consola
      }
      throw new Error(errorData.message);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
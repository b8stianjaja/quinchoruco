// src/components/features/Contact.jsx
import React, { useState } from 'react';
// Más adelante podríamos importar una función para enviar el formulario desde src/services/emailService.js
// import { sendContactForm } from '../../services/emailService';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' }); // type: 'success' o 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: '', type: '' });

    // Simulación de envío de formulario (reemplazar con llamada a emailService.js más adelante)
    console.log('Datos del formulario de contacto:', formData);
    try {
      // await sendContactForm(formData); // Descomentar cuando tengas el servicio
      // Simulación de éxito:
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de red
      setFormStatus({ message: '¡Gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Limpiar formulario
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setFormStatus({ message: error.message || 'Ocurrió un error al enviar tu mensaje. Por favor, inténtalo de nuevo.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Coordenadas de ejemplo para San Pedro de la Paz. Reemplaza con la ubicación real de QERa.
  // Puedes obtener el enlace correcto desde Google Maps > Compartir > Incorporar un mapa.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.220213470557!2d-70.98717300121635!3d-32.83942057363754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96883b004de10cf5%3A0xd143f4bdcd19652b!2sQuincho%20el%20Ruco!5e0!3m2!1ses!2scl!4v1748815941906!5m2!1ses!2scll";




  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-4 font-hero-title" style={{ color: '#6F4E37' }}>
            Ponte en Contacto
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-hero-title">
            ¿Tienes preguntas, quieres coordinar una visita o necesitas más información? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Columna de Información y Mapa */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-hero-title">Información de Contacto</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-xl mr-3 text-yellow-600">📞</span>
                  <a href="tel:+56912345678" className="hover:text-yellow-700">+56 9 1234 5678</a> {/* Reemplaza con tu número */}
                </li>
                <li className="flex items-center">
                  <span className="text-xl mr-3 text-yellow-600">✉️</span>
                  <a href="mailto:contacto@qera.cl" className="hover:text-yellow-700">quinchoelruco@gmail.com</a> {/* Reemplaza con tu email */}
                </li>
                <li className="flex items-center">
                  <span className="text-xl mr-3 text-yellow-600">📍</span>
                  <span>Chile</span> {/* Reemplaza con tu dirección */}
                </li>
                 <li className="flex items-center">
                  <span className="text-xl mr-3 text-yellow-600">🕒</span>
                  <span>Horario de atención para consultas: Lunes a Domingo, 09:00 - 20:00 hrs.</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-hero-title">Encuéntranos</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl border">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border:0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Quincho QERa"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Columna del Formulario */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 font-hero-title">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo<span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-">Correo Electrónico<span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje<span className="text-red-500">*</span></label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" required disabled={isSubmitting} className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>
              {formStatus.message && (
                <p className={`text-sm text-center mt-3 ${formStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
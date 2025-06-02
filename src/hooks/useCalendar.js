// src/hooks/useCalendar.js
import { useState, useMemo, useEffect, useCallback } from 'react';
import { getBookedSlots } from '../services/bookingService'; // Asegúrate que la ruta es correcta

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Mes y año actual que se muestra
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada por el usuario
  const [bookedSlots, setBookedSlots] = useState([]); // Almacenará { date: 'YYYY-MM-DD', slot: 'day' | 'night' }
  const [isLoadingBookedDates, setIsLoadingBookedDates] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = Enero, 11 = Diciembre
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long' });

  const fetchBookedDataForMonth = useCallback(async (fetchYear, fetchMonth) => {
    setIsLoadingBookedDates(true);
    setFetchError(null);
    try {
      const slots = await getBookedSlots(fetchYear, fetchMonth);
      setBookedSlots(slots);
    } catch (error) {
      console.error("Hook: Error fetching booked slots:", error);
      setFetchError(error.message || 'Error al cargar disponibilidad.');
      setBookedSlots([]); // Limpiar franjas si hay error para evitar estados inconsistentes
    } finally {
      setIsLoadingBookedDates(false);
    }
  }, []); // useCallback para evitar re-creación innecesaria si no cambian sus dependencias internas (ninguna aquí)

  useEffect(() => {
    fetchBookedDataForMonth(year, month);
  }, [year, month, fetchBookedDataForMonth]); // Se ejecuta cuando cambia el mes/año visible

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null); // Opcional: Deseleccionar fecha al cambiar de mes
  };

  const goToPrevMonth = () => {
    const today = new Date();
    today.setDate(1); // Comienzo del mes actual
    today.setHours(0, 0, 0, 0);

    const newPrevMonth = new Date(year, month - 1, 1);
    // No permitir ir a meses anteriores al actual
    if (newPrevMonth.getFullYear() < today.getFullYear() || 
        (newPrevMonth.getFullYear() === today.getFullYear() && newPrevMonth.getMonth() < today.getMonth())) {
      return; 
    }
    setCurrentDate(newPrevMonth);
    setSelectedDate(null); // Opcional
  };

  const selectDate = (date) => {
    // La validación de si el día está completamente reservado se hace visualmente
    // y la selección final de la franja se hará en el formulario.
    // Solo prevenimos seleccionar fechas pasadas directamente aquí.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);
  };

  const days = useMemo(() => {
    const daysArray = [];
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Dom) - 6 (Sáb)
    const correctedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Ajustado para que Lunes sea 0

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar 'today' para comparaciones precisas

    // Celdas vacías para los días antes del inicio del mes en la primera semana
    for (let i = 0; i < correctedFirstDay; i++) {
      daysArray.push({ key: `empty-${i}-${month}-${year}`, isEmpty: true });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateObj = new Date(year, month, day);
      dateObj.setHours(0, 0, 0, 0); // Normalizar dateObj a medianoche
      const dateString = dateObj.toISOString().split('T')[0];
      
      const isPast = dateObj < today; // Definir isPast ANTES de usarla

      let dayStatus = 'available'; // Por defecto, un día está disponible
      let actualDaySlotAvailable = !isPast; // Por defecto, si no es pasado, está disponible
      let actualNightSlotAvailable = !isPast; // Por defecto, si no es pasado, está disponible

      if (isPast) {
        dayStatus = 'past';
      } else {
        // Verificar si las franjas específicas de ESTE DÍA están reservadas directamente
        const daySlotDirectlyBooked = bookedSlots.some(s => s.date === dateString && s.slot === 'day');
        const nightSlotDirectlyBooked = bookedSlots.some(s => s.date === dateString && s.slot === 'night');

        // Verificar si la mañana de ESTE DÍA está afectada por una reserva nocturna del DÍA ANTERIOR
        const prevDayObj = new Date(dateObj);
        prevDayObj.setDate(dateObj.getDate() - 1);
        const prevDayString = prevDayObj.toISOString().split('T')[0];
        const morningBlockedByPrevNight = bookedSlots.some(s => s.date === prevDayString && s.slot === 'night');

        // Determina la disponibilidad real de las franjas para ESTE DÍA
        actualDaySlotAvailable = !daySlotDirectlyBooked && !morningBlockedByPrevNight;
        actualNightSlotAvailable = !nightSlotDirectlyBooked;

        // Determina el estado visual general del día
        if (!actualDaySlotAvailable && !actualNightSlotAvailable) {
          dayStatus = 'booked'; // Ambas franjas (o las partes que afectan a este día) están ocupadas
        } else if (!actualDaySlotAvailable || !actualNightSlotAvailable) {
          dayStatus = 'partial'; // Al menos una franja (o parte de ella) está ocupada
        } else {
          dayStatus = 'available'; // Ambas franjas están completamente libres para este día
        }
      }

      daysArray.push({
        key: dateString,
        date: dateObj,
        dayOfMonth: day,
        isCurrentMonth: true,
        isToday: dateObj.getTime() === today.getTime(),
        isSelected: selectedDate ? dateObj.getTime() === selectedDate.getTime() : false,
        status: dayStatus, // 'available', 'partial', 'booked', 'past'
        // Esta información se pasa al BookingForm para la selección de franja
        isDaySlotAvailable: actualDaySlotAvailable,
        isNightSlotAvailable: actualNightSlotAvailable,
      });
    }
    return daysArray;
  }, [year, month, selectedDate, bookedSlots]); // bookedSlots es ahora una dependencia clave

  return {
    currentDate,
    selectedDate,
    days,
    monthName,
    year,
    isLoadingBookedDates,
    fetchError,
    goToNextMonth,
    goToPrevMonth,
    selectDate,
  };
}
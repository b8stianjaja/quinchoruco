// src/hooks/useNewCalendar.js
import { useState, useMemo, useEffect, useCallback } from 'react';
import { getConfirmedBookedSlots } from '../services/apiService'; // Usamos el nuevo servicio

export function useNewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Mes y año actual que se muestra
  const [selectedDate, setSelectedDate] = useState(null);    // Fecha seleccionada por el usuario
  const [bookedSlots, setBookedSlots] = useState([]);        // Slots confirmados: { date: 'YYYY-MM-DD', slot: 'day' | 'night' }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = Enero, 11 = Diciembre
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long' });

  const fetchBookedData = useCallback(async (fetchYear, fetchMonth) => {
    setIsLoading(true);
    setError(null);
    try {
      const slots = await getConfirmedBookedSlots(fetchYear, fetchMonth);
      setBookedSlots(slots || []);
    } catch (err) {
      console.error("Hook: Error fetching booked slots:", err);
      setError(err.message || 'Error al cargar disponibilidad.');
      setBookedSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedData(year, month);
  }, [year, month, fetchBookedData]);

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToPrevMonth = () => {
    const today = new Date();
    today.setDate(1); 
    today.setHours(0, 0, 0, 0);

    const newPrevMonth = new Date(year, month - 1, 1);
    if (newPrevMonth.getFullYear() < today.getFullYear() || 
        (newPrevMonth.getFullYear() === today.getFullYear() && newPrevMonth.getMonth() < today.getMonth())) {
      return; 
    }
    setCurrentDate(newPrevMonth);
    setSelectedDate(null);
  };

  const selectDateHandler = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    setSelectedDate(date);
  };

  const daysToRender = useMemo(() => {
    const daysArray = [];
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const correctedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < correctedFirstDay; i++) {
      daysArray.push({ key: `empty-<span class="math-inline">\{i\}\-</span>{month}-${year}`, isEmpty: true });
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateObj = new Date(year, month, day);
      dateObj.setHours(0, 0, 0, 0);
      const dateString = dateObj.toISOString().split('T')[0];

      const isPast = dateObj < today;

      let dayStatus = 'available';
      let isDaySlotFullyAvailable = !isPast;
      let isNightSlotFullyAvailable = !isPast;

      if (isPast) {
        dayStatus = 'past';
      } else {
        const daySlotBooked = bookedSlots.some(s => s.date === dateString && s.slot === 'day');
        const nightSlotBooked = bookedSlots.some(s => s.date === dateString && s.slot === 'night');

        // Lógica para considerar que una reserva "night" afecta la mañana del día "dateString"
        // Esto es porque la reserva "night" del día anterior (prevDayString) ocupa la mañana de "dateString".
        const prevDayObj = new Date(dateObj);
        prevDayObj.setDate(dateObj.getDate() - 1);
        const prevDayString = prevDayObj.toISOString().split('T')[0];
        const morningBlockedByPrevNight = bookedSlots.some(s => s.date === prevDayString && s.slot === 'night');

        isDaySlotFullyAvailable = !daySlotBooked && !morningBlockedByPrevNight;
        isNightSlotFullyAvailable = !nightSlotBooked;

        if (!isDaySlotFullyAvailable && !isNightSlotFullyAvailable) {
          dayStatus = 'booked';
        } else if (!isDaySlotFullyAvailable || !isNightSlotFullyAvailable) {
          dayStatus = 'partial';
        } else {
          dayStatus = 'available';
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
        isDaySlotAvailable: isDaySlotFullyAvailable,
        isNightSlotAvailable: isNightSlotFullyAvailable,
      });
    }
    return daysArray;
  }, [year, month, selectedDate, bookedSlots]);

  return {
    currentDate,
    selectedDate,
    days: daysToRender,
    monthName,
    year,
    isLoading,
    error,
    goToNextMonth,
    goToPrevMonth,
    selectDate: selectDateHandler,
  };
}
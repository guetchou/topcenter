export const calculateAvailableSlots = (
  date: Date,
  bookedSlots: string[],
  workingHours = { start: 9, end: 18 }
) => {
  const slots: string[] = [];
  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    const timeSlot = `${hour}:00`;
    if (!bookedSlots.includes(timeSlot)) {
      slots.push(timeSlot);
    }
  }
  return slots;
};

export const estimateWaitTime = (
  currentAppointments: number,
  averageAppointmentDuration: number = 30
): number => {
  return currentAppointments * averageAppointmentDuration;
};

export const suggestOptimalSlot = (
  preferences: { morning?: boolean; afternoon?: boolean },
  availableSlots: string[]
): string | null => {
  if (preferences.morning) {
    const morningSlots = availableSlots.filter(slot => 
      parseInt(slot.split(':')[0]) < 12
    );
    if (morningSlots.length) return morningSlots[0];
  }
  
  if (preferences.afternoon) {
    const afternoonSlots = availableSlots.filter(slot => 
      parseInt(slot.split(':')[0]) >= 12
    );
    if (afternoonSlots.length) return afternoonSlots[0];
  }
  
  return availableSlots.length ? availableSlots[0] : null;
};
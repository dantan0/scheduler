export function getAppointmentsForDay(state, day) {
  // first, find the appointment ids for a specific day
  let appointmentIds;
  for (const dayInfo of state.days) {
    if (dayInfo.name === day) {
      appointmentIds = dayInfo.appointments;
      break;
    }
  };

  // if the day is not found, return an empty array
  if (!appointmentIds) {
    return [];
  }

  // find all the appointments
  let appointments = [];
  for (const id in state.appointments) {
    if (appointmentIds.includes(Number(id))) {
      appointments.push(state.appointments[id]);
    }
  }
  return appointments;
}
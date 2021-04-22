export const SET_DAY = "SET_DAY";  
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

const updateSpots = function (day, days, appointments) {
  // find day object
  const dayObj = days.find((item) => item.name === day);

  // iterate its appointment array
  const appointmentIds = dayObj.appointments;
  let spots = 0;
  for (const id of appointmentIds) {
    if (appointments[id].interview === null) {
      spots++;
    }
  }

  // update the spots in the dayObj <- days; at this point, nothing is changed
  // here dayObj is mutated
  dayObj.spots = spots;
  return [...days];
};

export default function reducer (state, action) {
  switch (action.type) {
    case SET_DAY:
      const { day } = action;
      return { ...state, day };

    case SET_APPLICATION_DATA:
      const { days, appointments, interviewers } = action;
      return { ...state, days, appointments, interviewers };

    case SET_INTERVIEW:
      const { id, interview } = action;

      const appointment = {
        ...state.appointments[id],
        interview: interview && { ...interview },
      };

      const newAppointments = {
        ...state.appointments,
        [id]: appointment,
      };

      // update spots work for multiple clients only when both clients are on
      // the same say because of state.day
      const newDays = updateSpots(state.day, state.days, newAppointments);
      return {
        ...state,
        appointments: newAppointments,
        days: newDays,
      };

    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
};
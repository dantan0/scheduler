export function getAppointmentsForDay(state, day) {
  // first, find the appointment ids for a specific day
  let appointmentIds;
  for (const dayInfo of state.days) {
    if (dayInfo.name === day) {
      appointmentIds = dayInfo.appointments;
      break;
    }
  }

  // if the day is not found, return an empty array
  if (!appointmentIds) {
    return [];
  }

  // find all the appointments
  let appointments = [];
  for (const id of appointmentIds) {
    if (state.appointments[id]) {
      appointments.push(state.appointments[id]);
    }
  }
  return appointments;
}

// return a new object with the interviewer details inside
export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  const interviewerId = interview.interviewer;
  if (state.interviewers[interviewerId]) {
    interview.interviewer = state.interviewers[interviewerId];
  }
  return interview;
}

export function getInterviewersForDay(state, day) {
  // first get all the interview ids
  let interviewerIds;
  for (const dayInfo of state.days) {
    if (dayInfo.name === day) {
      interviewerIds = dayInfo.interviewers;
      break;
    }
  }

  if (!interviewerIds) {
    return [];
  }

  let interviewers = [];
  for (const id of interviewerIds) {
    if (state.interviewers[id]) {
      interviewers.push(state.interviewers[id]);
    }
  }

  return interviewers;
}

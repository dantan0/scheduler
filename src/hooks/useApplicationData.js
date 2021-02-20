import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviwers: {}
  });

  // useEffect doesn't depend on state (empty dependency list)
  // dont want to make a request every time a component renders
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("api/days")),
      Promise.resolve(axios.get("api/appointments")),
      Promise.resolve(axios.get("api/interviewers"))
    ]).then((all) => {
      const [dayInfo, apppointmentInfo, interviewerInfo] = all;
      setState(prev => ({ 
        ...prev, 
        days: dayInfo.data,
        appointments: apppointmentInfo.data,
        interviewers: interviewerInfo.data
      }))
    })
  }, []);
  
  // define aliasing actions
  const setDay = day => setState({ ...state, day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newDays = [...state.days];
    for (const day of newDays) {
      if (day.name === state.day) {
        day.spots -= 1;
        break;
      }
    }

    return axios.put(`api/appointments/${id}`, {
      interview
    })
    .then(() => setState(prev => ({ ...prev, appointments, newDays })))
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newDays = [...state.days];
    for (const day of newDays) {
      if (day.name === state.day) {
        day.spots += 1;
        break;
      }
    }

    return axios.delete(`api/appointments/${id}`)
    .then(() => setState(prev => ({ ...prev, appointments, newDays })))
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
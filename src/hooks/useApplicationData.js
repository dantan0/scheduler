import React, { useReducer, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const reducer = function(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
        }
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days, 
          appointments: action.appointments, 
          interviewers: action.interviewers
        }
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days
        }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
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
    ])
    .then((all) => {
      const [dayInfo, apppointmentInfo, interviewerInfo] = all;
      dispatch({ 
        type: SET_APPLICATION_DATA,
        days: dayInfo.data,
        appointments: apppointmentInfo.data,
        interviewers: interviewerInfo.data
      })
    })
  }, []);
  
  // define aliasing actions
  const setDay = day => dispatch({ type: SET_DAY, day });

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

    return axios.put(`api/appointments/${id}`, { interview })
    .then(() => dispatch({
      type: SET_INTERVIEW, 
      appointments: appointments, 
      days: newDays 
    }))
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
    .then(() => dispatch({
      type: SET_INTERVIEW,
      appointments: appointments,
      days: newDays
    }))
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
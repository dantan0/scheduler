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

  const updateSpots = function(day, days, appointments) {
    // find day object
    const dayObj = days.find(item => item.name === day);

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
  }

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`api/appointments/${id}`, { interview })
    .then(() => {
      const days = updateSpots(state.day, state.days, appointments);
      dispatch({
        type: SET_INTERVIEW, 
        appointments,
        days
      })
    });
  }

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      const days = updateSpots(state.day, state.days, appointments);
      dispatch({
        type: SET_INTERVIEW, 
        appointments,
        days
      })
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
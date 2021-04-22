import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from '../reducers/application.js';

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviwers: {},
  });

  // useEffect doesn't depend on state (empty dependency list)
  // dont want to make a request every time a component renders
  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`);

    ws.onmessage = function (event) {
      const msg = JSON.parse(event.data);
      if (msg.type === SET_INTERVIEW) {
        const { type, id, interview } = msg;
        dispatch({ type, id, interview });
      }
    };

    Promise.all([
      Promise.resolve(axios.get("api/days")),
      Promise.resolve(axios.get("api/appointments")),
      Promise.resolve(axios.get("api/interviewers")),
    ]).then((all) => {
      const [dayInfo, apppointmentInfo, interviewerInfo] = all;
      dispatch({
        type: SET_APPLICATION_DATA,
        days: dayInfo.data,
        appointments: apppointmentInfo.data,
        interviewers: interviewerInfo.data,
      });
    });
  }, []);

  // define aliasing actions
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  const bookInterview = function (id, interview) {
    return axios.put(`api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
      })
  };

  const cancelInterview = function (id) {
    return axios.delete(`api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null })
      })
  };

  return { state, setDay, bookInterview, cancelInterview };
}
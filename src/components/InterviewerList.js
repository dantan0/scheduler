import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import "./InterviewerList.scss";

export default function InterviewerList(props) {
  const interviewerData = props.interviewers.map(interviewer => {
    return (
      <li key={interviewer.id}>
        <InterviewerListItem
          name={interviewer.name}
          avatar={interviewer.avatar}
          selected={interviewer.id === props.value}
          handleClick={props.handleClick}
          interviewer={interviewer.id}
        />
      </li>
    )
  })
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light"></h4>
      <ul className="interviewers__list">{interviewerData}</ul>
    </section>
  )
}
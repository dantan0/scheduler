import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import "./InterviewerList.scss";
import PropTypes from 'prop-types';

function InterviewerList(props) {
  const interviewerData = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.value}
        handleClick={props.handleClick}
        interviewer={interviewer.id}
      />
    )
  })
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light"></h4>
      <ul className="interviewers__list">{interviewerData}</ul>
    </section>
  )
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;
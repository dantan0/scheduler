import React from 'react';
import './InterviewerListItem.scss';

const classNames = require('classnames');

export default function InterviewerListItem(props) {
  const interviewerListClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  return (
    <li className={interviewerListClass} onClick={() => props.handleClick(props.interviewer)}>
      <img
        className="interviewers__item--image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}
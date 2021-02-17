import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  const dayData = props.days.map((day, index) => {
    return (
      <li key={index}>
        <DayListItem
          name={day.name}
          spots={day.spots}
          selected={day.name === props.day}
          setDay={props.setDay}
        />
      </li>
    )
  })

  return (
    <ul>{dayData}</ul>
  )
};
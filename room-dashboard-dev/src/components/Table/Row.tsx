import React from 'react';
import { IRoomInfo } from "../../types/IRoomData.type";

const getGradient = (people: number, total: number): string => {
  const percentage = (people / total) * 100;
  return `linear-gradient(to right, ${getColor(percentage)} ${percentage}%, #f2f2f2 ${percentage}%)`;
};

const getColor = (percentage: number): string => {
  if (percentage >= 66.6) return '#41d762';
  if (percentage >= 33.3) return '#f7f700';
  if (percentage > 0) return '#fa2727';
  return '#f2f2f2';
};

const getDotColor = (total: number): string => {
  if (total === 0) return 'red';
  return 'green';
};

interface Table1Props {
  roomData: IRoomInfo;
  series: Array<{ number_people: number; distribution: number }>;
}

export function Table1({ roomData, series }: Table1Props) {
  const _id = roomData._id ?? '';
  const name = roomData.name;
  const capacity: number = roomData.capacity;

  const lastEntry = series[series.length - 1];
  const numberPeople = lastEntry ? lastEntry.number_people : 0;
  const distribution = lastEntry ? lastEntry.distribution : 0;

  return {
    name: (
      <span>
        <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: getDotColor(numberPeople), borderRadius: '50%', marginRight: '8px' }}></span>
        {name}
      </span>
    ),
    total: (
      <div style={{ background: getGradient(numberPeople, capacity), padding: '4px 8px', borderRadius: '4px' }}>
        {numberPeople}/{capacity}
      </div>
    ),
    distribution: (
      <div style={{ backgroundColor: getColor(distribution), padding: '4px 8px', borderRadius: '4px' }}>
        {distribution}%
      </div>
    ),
  };
}

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

function DigitalClock() {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <div className="font-bold text-lg text-cyan-600">
      <div>{time.format('dddd, MMMM DD, YYYY')}</div>
      <div>{time.format('h:mm:ss A')}</div>
    </div>
  );
}

export default DigitalClock;

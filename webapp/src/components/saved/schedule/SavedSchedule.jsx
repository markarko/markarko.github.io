import React from 'react';
import classes from './SavedSchedules.module.css';

export const colors = ['#7697a0', '#f0c27b', '#8a9a5b', '#e2d2c1', '#846c5b', '#bdb4a5', '#ff6f61'];

export default function SavedSchedule(props) {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hoursInDay = 24;
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const tbodyRef = React.useRef(null);

  React.useEffect(() => {
    if (tbodyRef.current) {
      const height = tbodyRef.current.clientHeight;
      const width = tbodyRef.current.clientWidth;
      
      setDimensions({ width, height });
    }

    const handleResize = () => {
      if (tbodyRef.current) {
        setDimensions({
          width: tbodyRef.current.clientWidth,
          height: tbodyRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <table className={classes.SavedSchedule}>
    <div className={classes.THeadDiv}>
      <thead>
        <tr>
          <th></th>
          {weekDays.map((day) => <th>{day}</th>)}  
        </tr>
      </thead>
    </div>
    <div className={classes.TBodyDiv}>
      <div className={classes.Grid} style={{ width: dimensions.width, height: dimensions.height}}>
        {
          Object.keys(props.savedSchedule).map((courseId, courseIndex) => props.savedSchedule[courseId].schedules.map(schedule => {
            return (
              <div key={JSON.stringify(schedule)} style={{
                gridColumn: schedule.dayOfWeek,
                gridRow: `${(schedule.startTime) / 15 + 1} / ${(schedule.endTime) / 15 + 1}`,
                backgroundColor: colors[courseIndex % colors.length],
                color: "white",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "15px",
                outline: "2px solid #07254a"
              }} className={classes.Course}>
                <div>{courseId}</div>
                <div>{props.savedSchedule[courseId].section}</div>
                <div>{schedule.location}</div>
              </div>
            )
          }))
        }
      </div>
      <tbody ref={tbodyRef}>
        {[...Array(hoursInDay).keys().map(hour => {
          return <tr>
            <td>{hoursTo12HourClockTime(hour)}</td>
            {weekDays.map((day) => <td></td>)}  
          </tr>
        })]}
      </tbody>
    </div>
  </table>
}

function hoursTo12HourClockTime(hours) {
  if (hours === 0) {
    return '12:00 AM';
  } else if (hours < 12) {
    return `${hours}:00 AM`;
  } else if (hours === 12) {
    return '12:00 PM';
  } else {
    return `${hours - 12}:00 PM`;
  }
}
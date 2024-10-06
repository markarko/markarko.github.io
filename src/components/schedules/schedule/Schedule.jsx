import React from 'react';
import classes from './Schedules.module.css';
import {Button} from '@mantine/core';

function Schedule(props) {
  const gridConfigs = {
    tdHeight: 5 * props.zoom.scale,
    tdWidth: 20 * props.zoom.scale
  }

  const numHoursInDay = 24;
  const minutesInHour = 60;
  const minutesPerTableSlot = 30;
  const slotsPerHour = minutesInHour / minutesPerTableSlot;
  const daysInWeek = 7;

  const verticalTableSlots = Array.from({length: numHoursInDay * slotsPerHour}, (_, i) => i + 1);
  const horizontalTableSlots = Array.from({length: daysInWeek}, (_, i) => i + 1);

  if (!props.schedule) {
    return <div></div>
  }
  
  const isScheduleSaved = props.savedSchedules.some(savedSchedule => JSON.stringify(savedSchedule) === JSON.stringify(props.schedule));

  return (
    <div className={classes.FlipCard} style={{width: daysInWeek * gridConfigs.tdWidth + 1, height: numHoursInDay * slotsPerHour * gridConfigs.tdHeight + 1, visibility: `${props.hide ? "hidden" : "visible"}`}}>
      <div className={classes.FlipCardInner}>
        <div className={classes.ScheduleFront}>
          <div className={classes.Table}>
            <div>
              <table className={classes.TableSchedule}>
                <tbody>
                  {verticalTableSlots.map(_ => (
                    <tr>
                      {horizontalTableSlots.map(_ => (<td className={classes.TableScheduleTd} style={{width: gridConfigs.tdWidth, height: gridConfigs.tdHeight}}></td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> 
            <div className={classes.Grid} style={{width: daysInWeek * gridConfigs.tdWidth, height: numHoursInDay * slotsPerHour * gridConfigs.tdHeight}}>
              {
                Object.keys(props.schedule).map(courseId => props.schedule[courseId].schedules.map(schedule => {
                  const selectedCourse = props.selectedCourses[courseId];
                  return (
                    <div style={{
                      gridColumn: schedule.dayOfWeek,
                      gridRow: `${(schedule.startTime) / 30} / ${(schedule.endTime) / 30}`,
                      backgroundColor: selectedCourse ? selectedCourse.color : undefined,
                    }}></div>
                  )
                }))
              }
            </div>
          </div>
        </div>
        <div className={classes.ScheduleBack}>
          <div className={classes.ActionButtons}>
            <Button className={classes.ActionButton} onClick={() => {props.onScheduleSave(props.schedule)}}>
              <div>{isScheduleSaved ? "Saved" : "Save"}</div>
            </Button>
            <Button className={classes.ActionButton} disabled={!isScheduleSaved} onClick={() => props.onView(props.schedule)}>
              <div>View</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
}

export default React.memo(Schedule, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
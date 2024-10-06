import { useEffect } from "react";
import SelectedCourses from "../Search/SelectedCourse/SelectedCourses";
import classes from './SchedulesPage.module.css';
import Schedules from './schedule/Schedules';
import React from 'react';
import Dropdown from "../search/dropdown/Dropdown";
import FiltersPanel from "./filters/FiltersPanel";

const Zoom = {
  Small: {
    label: "Small",
    scale: 1
  },
  Medium: {
    label: "Medium",
    scale: 1.5
  },
  Large: {
    label: "Large",
    scale: 2.5
  }
}

export default function SchedulesPage(props) {
  const [zoom, setZoom] = React.useState(Zoom.Small);

  const onScheduleSave = (schedule) => {
    const scheduleExists = props.savedSchedules.some(savedSchedule => JSON.stringify(savedSchedule) === JSON.stringify(schedule));
    if (scheduleExists) {
      // toast
    } else {
      props.setSavedSchedules([...props.savedSchedules, schedule]);
    }
  }

  return (
    <div className={classes.SchedulesPage}>
      <div className={classes.Filters}>
        <div className={classes.SelectedCourses}>
          <SelectedCourses selectedCourses={props.selectedCourses} setSelectedCourses={props.setSelectedCourses} />
        </div>
        <div className={classes.Zoom}>
          <div>Zoom</div>
          <Dropdown values={Object.keys(Zoom).map(key => Zoom[key].label)} onSelect={(key) => setZoom(Zoom[key])} />  
        </div>
      </div>
      <Schedules schedules={props.schedules || []} selectedCourses={props.selectedCourses}
        zoom={zoom} onScheduleSave={onScheduleSave} savedSchedules={props.savedSchedules} onView={props.onView} />
      <FiltersPanel selectedCourses={props.selectedCourses} applyFilters={props.applyFilters}/>
    </div>
  )
}
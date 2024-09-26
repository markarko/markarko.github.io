import classes from './Filters.module.css';
import React, { useEffect } from 'react';
import { MultiSelect, SegmentedControl, Button } from '@mantine/core';
import Dropdown from '../../search/dropdown/Dropdown';

export default function Filters(props) {
  const [generalFilters, setGeneralFilters] = React.useState({});
  const [courseSpecificFilters, setCourseSpecificFilters] = React.useState({});
  const [selectedCourse, setSelectedCourse] = React.useState('');

  React.useEffect(() => {
    const keys = Object.keys(props.selectedCourses);

    if (!selectedCourse && keys.length > 0) {
      setSelectedCourse(Object.keys(props.selectedCourses)[0]);
    }
  }, [props.selectedCourses])

  useEffect(() => {
    if (selectedCourse && !courseSpecificFilters[selectedCourse]) {
      setCourseSpecificFilters({ ...courseSpecificFilters, [selectedCourse]: {} });
    }
  }, [selectedCourse]);

  return <div className={classes.Filters}>
    <h2 className={classes.Heading}>Filters</h2>
    <hr className={classes.HR} />
    <h3 className={classes.Heading}>General</h3>
    <CommonFilters onStartTimeChange={(startTime) => {
        setGeneralFilters({ ...generalFilters, startTime });
      }}
      onEndTimeChange={(endTime) => {
        setGeneralFilters({ ...generalFilters, endTime });
      }}
      onExcludedWeekDaysChange={(excludedWeekDays) => {
        setGeneralFilters({ ...generalFilters, excludedWeekDays });
      }}
      startTime={generalFilters.startTime}
      endTime={generalFilters.endTime}
      excludedWeekDays={generalFilters.excludedWeekDays}
    />
    <hr className={classes.HR} />
    {props.selectedCourses && Object.keys(props.selectedCourses).length > 0 &&
      <>
        <h3 className={classes.Heading}>Course Specific</h3>
        <Dropdown values={Object.keys(props.selectedCourses)} onSelect={setSelectedCourse} style={{ width: "100%" }} />
        <CommonFilters onStartTimeChange={(startTime) => {
            const filtersTmp = { ...courseSpecificFilters };
            filtersTmp[selectedCourse].startTime = startTime;
            setCourseSpecificFilters(filtersTmp);
          }}
          onEndTimeChange={(endTime) => {
            const filtersTmp = { ...courseSpecificFilters };
            filtersTmp[selectedCourse].endTime = endTime;
            setCourseSpecificFilters(filtersTmp);
          }}
          onExcludedWeekDaysChange={(excludedWeekDays) => {
            const filtersTmp = { ...courseSpecificFilters };
            filtersTmp[selectedCourse].excludedWeekDays = excludedWeekDays;
            setCourseSpecificFilters(filtersTmp);
          }}
          startTime={courseSpecificFilters[selectedCourse]?.startTime}
          endTime={courseSpecificFilters[selectedCourse]?.endTime}
          excludedWeekDays={courseSpecificFilters[selectedCourse]?.excludedWeekDays}
        />
        <hr className={classes.HR} />
      </>
    }
    <Button style={{ border: "1px solid white"}} onClick={() => props.applyFilters({
      generalFilters: generalFilters,
      courseSpecificFilters: courseSpecificFilters
    })}><div>Generate</div></Button>
  </div>
}

function CommonFilters(props) {
  return <>
    <div className={classes.GeneralStartEndTime}>
      <div className={classes.GeneralStartEndTimeSelector}>
        <label htmlFor="start-time">Min Start time </label>
        <input id="start-time" type="time" value={props.startTime ? props.startTime : ''} onChange={e => {
          props.onStartTimeChange(e.target.value);
        }} />
      </div>
      <div className={classes.GeneralStartEndTimeSelector}>
        <label htmlFor="end-time">Max End time </label>
        <input id="end-time" type="time" value={props.endTime ? props.endTime : ''} onChange={e => {
          props.onEndTimeChange(e.target.value);
        }} />
      </div>
    </div>
    <MultiSelect
      label="Excluded Week Days"
      placeholder="Select week days to exclude"
      data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
      value={props.excludedWeekDays ? props.excludedWeekDays : []}
      onChange={props.onExcludedWeekDaysChange}
    />
  </>
}
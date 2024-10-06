import React from 'react';
import SavedSchedule from './schedule/SavedSchedule';
import classes from './SavedSchedulesPage.module.css';
import CardsCarousel from './carousel/CardsCarousel';

export default function SavedSchedulesPage(props) {
  return <div className={classes.SavedSchedulesPage}>
    <CardsCarousel selectedCourses={props.selectedCourses} savedSchedules={props.savedSchedules} />
  </div>
}   
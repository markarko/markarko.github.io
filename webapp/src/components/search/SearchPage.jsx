import React from 'react';
import './SearchPage.css';
import SearchBar from './input/SearchBar';
import CourseResults from './results/CourseResults';
import SelectedCourses from './SelectedCourse/SelectedCourses';

export const colors = ['#7697a0', '#f0c27b', '#8a9a5b', '#e2d2c1', '#846c5b', '#bdb4a5', '#ff6f61'];

export default function SearchPage(props) {
  const [results, setResults] = React.useState([]);

  const onCourseSelect = (courseId, course) => {
    props.setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses[courseId]) {
        // schedule exists
        // toast
        return prevSelectedCourses;
      } else if (Object.keys(prevSelectedCourses).length >= 7) {
        // max limit reached
        // TODO: toast
        return prevSelectedCourses;
      } else {
        const color = colors[Object.keys(prevSelectedCourses).length % colors.length];
        return {
          ...prevSelectedCourses,
          [courseId]: {
            sections: course.sections,
            color: color
          }
        };
      }
    });
  }

  return (
    <div className='SearchPage'>
      <SearchBar setResults={setResults} />
      <SelectedCourses selectedCourses={props.selectedCourses} setSelectedCourses={props.setSelectedCourses} />
      <CourseResults results={results} onCourseSelect={onCourseSelect} />
    </div>
  );
}
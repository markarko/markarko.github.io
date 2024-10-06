import React, { useEffect, useRef } from 'react';
import './SearchPage.css';
import SearchBar from './input/SearchBar';
import CourseResults from './results/CourseResults';
import SelectedCourses from './SelectedCourse/SelectedCourses';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export const colors = ['#7697a0', '#f0c27b', '#8a9a5b', '#e2d2c1', '#846c5b', '#bdb4a5', '#ff6f61'];

export default function SearchPage(props) {
  const [results, setResults] = React.useState([]);
  const selectedCoursesRef = useRef(props.selectedCourses);

  // Keep selectedCoursesRef updated with the latest props
  useEffect(() => {
    selectedCoursesRef.current = props.selectedCourses;
  }, [props.selectedCourses]);

  const onCourseSelect = (courseId, course) => {
    const selectedCourses = selectedCoursesRef.current;
    const isAlreadySelected = !!selectedCourses[courseId];
    const selectedCount = Object.keys(selectedCourses).length;

    if (isAlreadySelected) {
      toast.error("This course is already selected", {
        autoClose: 2000
      });
      return;
    }

    if (selectedCount >= 7) {
      toast.error("You can't select more than 7 courses.", {
        autoClose: 2000
      });
      return;
    }

    const color = colors[selectedCount % colors.length];

    props.setSelectedCourses((prevSelectedCourses) => ({
      ...prevSelectedCourses,
      [courseId]: {
        sections: course.sections,
        color: color
      }
    }));
  };

  return (
    <div className='SearchPage'>
      <SearchBar setResults={setResults} />
      <SelectedCourses selectedCourses={props.selectedCourses} setSelectedCourses={props.setSelectedCourses} />
      <CourseResults results={results} onCourseSelect={onCourseSelect} />
    </div>
  );
}

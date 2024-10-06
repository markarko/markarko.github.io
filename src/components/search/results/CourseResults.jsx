import React from 'react'
import CourseResult from "./CourseResult";
import classes from './CourseResult.module.css';

const gap = 30;

export default function CourseResults(props) {
  const courseResultsRef = React.useRef(null);
  const [extraChildren, setExtraChildren] = React.useState(0);
  const [singleRow, setSingleRow] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (courseResultsRef && courseResultsRef.current && courseResultsRef.current.firstChild) {
        const width = courseResultsRef.current.clientWidth;
        const childWidth = courseResultsRef.current.firstChild.clientWidth;
        const extraChildren = getExtraElementsAmount(width, childWidth, props.results.length);
        setExtraChildren(extraChildren);
        setSingleRow(props.results.length <= getChildrenPerRow(width, childWidth));
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
 }, [props.results]);
 
  return (
    <div ref={courseResultsRef} className={classes.results} style={{ justifyContent: `${singleRow ? "flex-start" : "space-between"}`, gap: `${gap}px`}}>
      { props.results.map((result) => <CourseResult key={result.courseNumber} result={result} onCourseSelect={props.onCourseSelect}/>) }
      { props.results.length > 0 && Array(extraChildren).fill(props.results[0]).map((result) =>
        <CourseResult key={result.courseNumber} result={result} onCourseSelect={props.onCourseSelect} hide={true}/>) }
    </div>
  );
}

function getExtraElementsAmount(width, childWidth, numChildren) {
  const childrenPerRow = getChildrenPerRow(width, childWidth);
  const numExtraChildren = childrenPerRow - numChildren % childrenPerRow;
  return childrenPerRow === numExtraChildren ? 0 : numExtraChildren;
}

function getChildrenPerRow(width, childWidth) {
  return Math.floor((width + gap) / (childWidth + gap));
}
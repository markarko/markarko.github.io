import React from 'react';
import Schedule from './Schedule';
import classes from './Schedules.module.css';

const gap = 45;

export default function Schedules(props) {
  const schedulesRef = React.useRef(null);
  const [extraChildren, setExtraChildren] = React.useState(0);
  const [singleRow, setSingleRow] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (schedulesRef && schedulesRef.current && schedulesRef.current.firstChild) {
        const width = schedulesRef.current.clientWidth;
        const childWidth = schedulesRef.current.firstChild.clientWidth;
        const extraChildren = getExtraElementsAmount(width, childWidth, props.schedules.length);
        setExtraChildren(extraChildren);
        setSingleRow(props.schedules.length <= getChildrenPerRow(width, childWidth));
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
 }, [props.schedules, props.zoom]);

  return (
    <div className={classes.Schedules} ref={schedulesRef} style={{ justifyContent: `${singleRow ? "flex-start" : "space-between"}`, gap: `${gap}px`}}>
      { props.schedules.map((schedule, i) => {
        return <Schedule key={i} schedule={schedule} selectedCourses={props.selectedCourses}
                         zoom={props.zoom} onScheduleSave={props.onScheduleSave} savedSchedules={props.savedSchedules} onView={props.onView}/>
      }) }
      { props.schedules.length > 0 && Array(extraChildren).fill(props.schedules[0]).map((schedule, i) => {
        return <Schedule key={props.schedules.length + i} schedule={schedule} selectedCourses={props.selectedCourses}
                         zoom={props.zoom} onScheduleSave={props.onScheduleSave} savedSchedules={props.savedSchedules} onView={props.onView} hide={true} />
      }) }
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
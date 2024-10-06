import classes from './SelectedCourses.module.css';
import SelectedCourse from './SelectedCourse';

export const colors = ['#7697a0', '#f0c27b', '#8a9a5b', '#e2d2c1', '#846c5b', '#bdb4a5', '#ff6f61'];

export default function SelectedCourses(props) {
    const onDelete = (id) => {
        props.setSelectedCourses((prevSelectedCourses) => {
            const newSelectedCourses = {...prevSelectedCourses};
            delete newSelectedCourses[id];
            return newSelectedCourses;
        });
    }
    
    return (
        <div className={classes.SelectedCourses}>
            {Object.keys(props.selectedCourses).map((key, i) =>
              <SelectedCourse key={key} courseId={key} course={props.selectedCourses[key]} onDelete={onDelete} color={colors[i]} />)}
        </div>
    );
}
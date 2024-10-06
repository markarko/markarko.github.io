import { Paper, Text, Button } from '@mantine/core';
import classes from './CourseResult.module.css';
import React from 'react';
import Dropdown from '../dropdown/Dropdown';

const allSections = 'All';

function CourseResult(props) {
  const [selectedSection, setSelectedSection] = React.useState(allSections);

  const onSectionSelect = (section) => {
    setSelectedSection(section);
  }

  return (
    <Paper withBorder radius="md" className={classes.result} style={{ visibility: `${props.hide ? 'hidden' : ''}`}}>
      <div>
        <Text size="xl" fw={500} mt="md">
        {props.result.title} ({props.result.courseNumber})
        </Text>
        <Text size="sm" mt="sm" c="dimmed">
          {props.result.courseDescription}
        </Text>
      </div>
      <div className={classes.inputs}>
        <Dropdown values={[allSections].concat(props.result.sections.map(s => s.section))} onSelect={onSectionSelect} />
        <Button className={classes.fullHeight} onClick={() => props.onCourseSelect(props.result.courseNumber, {
            sections: [selectedSection]
          })}>
          <div>Choose</div>
        </Button>
      </div>
    </Paper>
  );
}

export default React.memo(CourseResult, (prevProps, nextProps) => {
  return prevProps.result.courseNumber === nextProps.result.courseNumber;
});
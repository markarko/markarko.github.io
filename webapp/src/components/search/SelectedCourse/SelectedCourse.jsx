import classes from './SelectedCourses.module.css';
import { useMantineTheme } from '@mantine/core';
import React from 'react';
import { ActionIcon, rem } from '@mantine/core';
import { IconSquareX } from '@tabler/icons-react';

export default function SelectedCourse(props) {
  const theme = useMantineTheme();
  return (
    <ActionIcon className={classes.SelectedCourse} size={48} radius="xl"
      color={theme.primaryColor} variant="filled" onClick={() => props.onDelete(props.courseId)}
      style={{backgroundColor: props.color}}>
      {props.courseId}
      <IconSquareX style={{ width: rem(26), height: rem(26), marginLeft: rem(5) }} stroke={1.5} />
    </ActionIcon>
  );
}
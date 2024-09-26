import React from 'react';
import classes from './FiltersPanel.module.css';
import { ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconFilter, IconArrowRight } from '@tabler/icons-react';
import Filters from './Filters';

export default function FiltersPanel(props) {
  const theme = useMantineTheme();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return <div className={`${classes.filterPanel} ${isPanelOpen ? classes.open : ''}`}>
    <ActionIcon className={classes.toggleButton} size={64} radius="xl" color={theme.primaryColor} variant="filled" onClick={togglePanel}>
      { isPanelOpen && 
        <IconArrowRight style={{ width: rem(64), height: rem(64) }} stroke={2} />
      }
      { !isPanelOpen &&
        <IconFilter style={{ width: rem(64), height: rem(64) }} stroke={2} />
      }
    </ActionIcon>
    <div className={classes.panelContent}>
      <Filters selectedCourses={props.selectedCourses} applyFilters={props.applyFilters}/>
    </div>
  </div>
}
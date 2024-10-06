import { useState } from 'react';
import { UnstyledButton, Menu, Group } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './Dropdown.module.css';

export default function Dropdown(props) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(props.values[0]);
  
  const items = props.values.map((value) => (
    <Menu.Item
      onClick={() => {
        setSelected(value);
        props.onSelect(value);
      }}
      key={value}
    >
      {value}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} style={props.style} data-expanded={opened || undefined}>
          <Group gap="xs">
            <span className={classes.label}>{selected}</span>
          </Group>
          <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}
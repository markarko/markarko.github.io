import React from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconSettings,
  IconRegistered,
  IconLogin,
  IconSearch,
  IconCalendarMonth,
  IconBookmark,
  IconPlug
} from '@tabler/icons-react';
import classes from './Navbar.module.css';

export const NavbarItem = {
  Search: 'Search',
  Schedules: 'Schedules',
  Saved: 'Saved',
  Plugins: 'Plugins',
  Settings: 'Settings'
};

const data = [
  { link: '', label: NavbarItem.Search, icon: IconSearch },
  { link: '', label: NavbarItem.Schedules, icon: IconCalendarMonth },
  { link: '', label: NavbarItem.Saved, icon: IconBookmark },
  // { link: '', label: NavbarItem.Plugins, icon: IconPlug },
  // { link: '', label: NavbarItem.Settings, icon: IconSettings },
];

export default function Navbar(props) {
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === props.activePage || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault(); 
        props.setActivePage(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700} className={classes.version}>
            v3.1.2
          </Code>
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconRegistered className={classes.linkIcon} stroke={1.5} />
          <span>Register</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogin className={classes.linkIcon} stroke={1.5} />
          <span>Login</span>
        </a>
      </div>
    </nav>
  );
}
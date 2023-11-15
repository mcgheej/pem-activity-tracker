import { NavProps } from '../shell.types';

export const navProps: NavProps[] = [
  {
    title: 'Activities',
    url: './activities',
    loggedInRequired: true,
  },
  {
    title: 'Login',
    url: './login',
    loggedInRequired: false,
  },
];

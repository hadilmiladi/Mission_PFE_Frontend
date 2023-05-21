import { Users } from 'react-feather';

export default [
  // ** client navigation
  {
    id: "client",
    title: "Clients",
    icon: <Users size={20} />,
    navLink: "/admin/clients",
    role: "admin",
  },
  {
    id: "employee",
    title: "Employees",
    icon: <Users size={20} />,
    navLink: "/admin/employees",
    role: "admin",
  },
  {
    id: "rank",
    title: "Ranks",
    icon: <Users size={20} />,
    navLink: "/admin/ranks",
    role: "admin",
  },
];

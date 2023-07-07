import {
  Archive,
  BarChart,
  BarChart2,
  FileText,
  Settings,
  User,
  Users,
} from 'react-feather';

export default [
  // ** admin navigation
  {
    id:"adminMissions",
    title:"Missions",
    icon: <Archive />,
    navLink: "/admin/missions",
    role: "admin",
  },
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
    icon: <BarChart size={20} />,
    navLink: "/admin/ranks",
    role: "admin",
  },
  {
    id: "invoice",
    title: "Invoices",
    icon: <FileText size={20} />,
    navLink: "/admin/invoice",
    role: "admin",
  },
 /*  {
    id:"adminSettings",
    title: "Settings",
    icon: <Settings size={20} />,
    navLink: "/admin/settings",
    role: "admin",
  }, */
  {
    id:"adminProfile",
    title: "Profile",
    icon: <User size={20} />,
    navLink: "/admin/profile",
    role: "admin",
  },
  {
    id:"employeeMissions",
    title:"Missions",
    icon: <Archive />,
    navLink:"/employee/missions",
    role: "employee",
  },
  {
    id:"employeeSettings",
    title: "Settings",
    icon: <Settings size={20} />,
    navLink: "/employee/settings",
    role: "employee",
  },
  {
    id:"ceoDashboard",
    title: "Dashboard",
    icon: <BarChart2 size={20} />,
    navLink: "/ceo/dashboard",
    role: "ceo",
  },
  {
    id:"ceoMissions",
    title:"Missions",
    icon: <Archive size={20} />,
    navLink: "/ceo/missionCeo",
    role: "ceo",
  },
  {
    id:"ceoSttings",
    title:"Passports/Visa",
    icon: <Archive size={20} />,
    navLink: "/ceo/settings",
    role: "ceo",
  },
  
];

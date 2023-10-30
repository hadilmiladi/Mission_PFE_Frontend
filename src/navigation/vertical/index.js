import {
  Activity,
  Archive,
  BarChart2,
  FileText,
  Mail,
  Settings,
  UserCheck,
  Users,
} from 'react-feather';
import { Home } from 'react-feather/dist';

export default [
  // ** admin navigation
  {
    id:"adminAcceuil",
    title:"Home",
    icon: <Home />,
    navLink: "/admin/acceuil",
    role: "admin",
  },
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
    icon: <UserCheck size={20} />,
    navLink: "/admin/employees",
    role: "admin",
  },
  {
    id: "rank",
    title: "Ranks",
    icon: <Activity size={20} />,
    navLink: "/admin/ranks",
    role: "admin",
  },
  {
    id:"mailconfig",
    title:"E-mail configuration",
    icon: <Mail />,
    navLink: "/admin/mailconfig",
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
    icon: <Settings size={20} />,
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
  /* {
    id:"employeeSettings",
    title: "Settings",
    icon: <Settings size={20} />,
    navLink: "/employee/settings",
    role: "employee",
  }, */
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
 /*  {
    id:"ceoSttings",
    title:"Passports/Visa",
    icon: <Archive size={20} />,
    navLink: "/ceo/settings",
    role: "ceo",
  }, */
  {
    id:"chefallMissions",
    title:"Missions",
    icon: <Archive />,
    navLink: "/chef/accueil",
    role: "chef du projet",
  },
  {
    id:"chefSttings",
    title:"Profil",
    icon: <Archive size={20} />,
    navLink: "/chef/settings",
    role: "chef du projet",
  },
  
];

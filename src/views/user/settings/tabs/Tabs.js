// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";
// ** Icons Imports
import { User, Lock, Bookmark, Calendar, UserPlus } from "react-feather";
// ** ----------------------------------------------------------------------
function Tabs({ activeTab, toggleTab }) {
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink
          active={activeTab === "profile"}
          onClick={() => toggleTab("profile")}
        >
          <User size={18} className="me-50" />
          <span className="fw-bold">Profile</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={activeTab === "password"}
          onClick={() => toggleTab("password")}
        >
          <Lock size={18} className="me-50" />
          <span className="fw-bold">Sécurité</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
}

export default Tabs;

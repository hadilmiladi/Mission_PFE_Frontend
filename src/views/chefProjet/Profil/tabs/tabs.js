// ** Icons Imports
import {
  Lock,
  User,
} from 'react-feather';
// ** Reactstrap Imports
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

// ** ----------------------------------------------------------------------
function Tabs({ activeTab, toggleTab }) {
    return (
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink
            active={activeTab === "mission"}
            onClick={() => toggleTab("mission")}
          >
            <User size={18} className="me-50" />
            <span className="fw-bold">Mission</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "profile"}
            onClick={() => toggleTab("profile")}
          >
            <User size={18} className="me-50" />
            <span className="fw-bold">passport</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "visa"}
            onClick={() => toggleTab("visa")}
          >
            <Lock size={18} className="me-50" />
            <span className="fw-bold">visa</span>
          </NavLink>
        </NavItem>
      </Nav>
    );
  }
  
  export default Tabs;
  
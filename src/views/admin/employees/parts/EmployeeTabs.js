// ** Icons Imports
import { Calendar } from 'react-feather';
// ** Reactstrap Imports
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import EmployeeMissionsTab from '../tabs/EmployeeMission/EmployeeMissionsTab';

// ** ------------------------------------------------------------------
function EmployeeTabs(props) {
  // ** props
  const { active, toggleTab } = props;
  console.log("active: ", active);
  // ** ==>
  return (
    <>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink
            active={active === "missions"}
            onClick={() => toggleTab("missions")}
          >
            <Calendar className="font-medium-3 me-50" />
            <span className="fw-bold">Missions</span>
          </NavLink>
        </NavItem>

      </Nav>
      
      <TabContent activeTab={active}>
        <TabPane tabId="missions">
          <EmployeeMissionsTab active={active} />
        </TabPane>
      </TabContent>
    </>
  );
}

export default EmployeeTabs;


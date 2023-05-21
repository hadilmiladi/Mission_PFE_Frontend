// ** Icons Imports
import {
  Calendar,
  FileText,
} from 'react-feather';
// ** Reactstrap Imports
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import EmployeeMissionsTab from '../tabs/EmployeeMission/CreateNewMission';
import EmployeePassporttab from '../tabs/EmployeePassport/EmployeePassporttab';

// ** ------------------------------------------------------------------
function EmployeeTabs(props) {
   // ** props
   const { active, toggleTab, order, refresh,employee,passports } = props;
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
        
        <NavItem>
          <NavLink
            active={active === "passports"}
            onClick={() => toggleTab("passports")}
          >
            <FileText className="font-medium-3 me-50" />
            <span className="fw-bold">Passports</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === "visa"}
            onClick={() => toggleTab("visa")}
          >
            <FileText className="font-medium-3 me-50" />
            <span className="fw-bold">Visa</span>
          </NavLink>
        </NavItem>
    </Nav>
    <TabContent activeTab={active}>
        <TabPane tabId="missions">
          <EmployeeMissionsTab />
        </TabPane>

        
        
        <TabPane tabId="passports">
            <EmployeePassporttab refresh={refresh} employee={employee} passports={passports} />
        </TabPane>
      </TabContent>
    </>
  )
}

export default EmployeeTabs
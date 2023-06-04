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

import EmployeeMissionsTab from '../tabs/EmployeeMission/EmployeeMissionsTab';
// * Tabs
import EmployeePassporttab from '../tabs/EmployeePassport/EmployeePassporttab';
import EmployeeVisaTab from '../tabs/EmployeeVisa/EmployeeVisaTab';

// ** ------------------------------------------------------------------
function EmployeeTabs(props) {
  // ** props
  const { active, toggleTab, refresh, employee, passports,currentPassport } = props;
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

        <NavItem>
        <NavLink
          active={active === "visa"}
          onClick={() => toggleTab("visa")}
        >
          <Calendar className="font-medium-3 me-50" />
          <span className="fw-bold">Visa</span>
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

      </Nav>
      
      <TabContent activeTab={active}>
        <TabPane tabId="missions">
          <EmployeeMissionsTab active={active} />
        </TabPane>

        <TabPane tabId="visa">
          <EmployeeVisaTab active={active} currentPassport={currentPassport} />
        </TabPane>

        <TabPane tabId="passports">
          <EmployeePassporttab
            refresh={refresh}
            employee={employee}
            passports={passports}
            active={active}
          />
        </TabPane>
      </TabContent>
    </>
  );
}

export default EmployeeTabs;

/* 
<TabPane tabId="visa">
  <EmployeeVisaTab active={active} />
</TabPane>
*/
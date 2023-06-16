// ** styles
import '@styles/react/apps/app-users.scss';

// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

// ** toast
import toast from 'react-hot-toast';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
// ** Reactstrap Imports
import {
  Col,
  Row,
} from 'reactstrap';

// ** Costum components
import Breadcrumbs from '@components/breadcrumbs';

// ** api link
import axios from '../../../service/axios';
import {
  notFoundMessage,
  serverErrorMessage,
} from '../../../utility/messages';
// ** Parts
import EmployeeInfoCard from './parts/EmployeeInfoCard';
import EmployeeTabs from './parts/EmployeeTabs';

// ** ---------------------------------------------------------------------
function ViewEmployee() {
  // ** params
  const { id } = useParams();
  // ** router
  const navigate = useNavigate();
  // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  // ** states
  const [active, setActive] = useState("missions");
  const [employee, setEmployee] = useState(null);
  const [currentPassport, setCurrentPassport]=useState(null)
  const [passports, setPassports] = useState([]);
  const [match, setMatch] = useState(true);
  // ** fetching data
  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);
  // fetch function
  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`employee/one/${id}`, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 200) {
        setEmployee({ ...res?.data?.item });
        setCurrentPassport({...res?.data?.currentPassport})
        setPassports([...res?.data?.passports]);
      }
    } catch (error) {
      // not found
      if (error?.response?.status === 404) {
        toast.error(notFoundMessage, {
          duration: 5000,
        });
        setMatch(false);
      }
      //  server error
      else if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
  };
  // ** toogle switcher
  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  // ** ==>
  return (
    <>
      <Breadcrumbs
        title="Employees Management"
        data={[
          {
            title: `Employee`,
            link: `/admin/employees`,
          },
          {
            title: `Employee ${id}`,
          },
        ]}
      />
      <div className="app-user-view">
        {employee !== null ? (
          <Row>
            <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
              <EmployeeInfoCard employee={employee} refresh={fetchEmployee} currentPassport={currentPassport} />
            </Col>
            <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
              <EmployeeTabs
                active={active}
                toggleTab={toggleTab}
                employee={employee}
                refresh={fetchEmployee}
                passports={passports}
                currentPassport={currentPassport}
              />
            </Col>
          </Row>
        ) : match ? (
          `Order ${id} ...`
        ) : (
          <h6 className="text-capitalize">
            We're sorry but it seems to be that this employee doesn't exist or
            was deleted.
          </h6>
        )}
      </div>
    </>
  );
}

export default ViewEmployee;

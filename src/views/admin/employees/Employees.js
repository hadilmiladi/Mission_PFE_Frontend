import React, {
  useEffect,
  useState,
} from 'react';

// ** Toast
import toast from 'react-hot-toast';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
// ** Reactstrap Imports
import {
  Badge,
  Card,
  Table,
} from 'reactstrap';

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';

// ** api config
import axios from '../../../service/axios';
// ** utils
import { cleanUserLocalStorage } from '../../../utility/Auth';
import {
  serverErrorMessage,
  sessionExpired,
} from '../../../utility/messages';
// ** modals
import CreateEmployeeModal from './modals/CreateEmployeeModal';
import AddSection from './supplements/section/AddSection';
import CountDashboard from './supplements/section/CountDashboard';

// ** -----------------------------------------------------------------------
function Employees() {
  // ** router
  const navigate = useNavigate();
   // ** access token
   const accessToken = localStorage.getItem(
    "access_token"
  );
  
  // ** initial state
  const initialQueries = {
    p: 1,
    l: 10,
    sortBy: "default",
    select: "all",
  };
  // ** states
  const [employees, setEmployees] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  // modals
  const [showCreateEmployeesModal, setShowCreateEmployeesModal] =
    useState(false);

  // ** fetching data
  useEffect(() => {
    fetchEmplyees();
  }, []);
  // ** fetch function
  const fetchEmplyees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`employee/all`, {
       
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.status === 200) {
        setEmployees([...res?.data?.items]);
        setSize(res?.data?.items?.length);
      }
    } catch (error) {
      // not token
      if (error?.response?.status === 401) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      // expired
      else if (error?.response?.status === 403) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      else if (error?.response?.status === 400) {
        toast.error("failed to retrieve", {
          duration: 5000,
        });
      }
      //  server error
      else if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
    setLoading(false);
  };
  console.log('this size', size)
  // ** Pagination
  const pagination = [];
  for (let i = 0; i < size / queries.l; i++) {
    pagination.push(i);
  }
  // ** pagination config
  const prevPagination = () => {
    if (queries.p > 0) {
      setQueries((prev) => ({ ...prev, p: queries.p - 1 }));
    }
  };
  // ** next
  const nextPagination = () => {
    const condition = queries.p == (size / queries.l).toFixed(0);
    if (!condition) {
      setQueries((prev) => ({ ...prev, p: queries.p + 1 }));
    }
  };
  // ** select
  const selectPagination = (index) => {
    setQueries((prev) => ({ ...prev, p: index }));
  };
  // ** ==>
 
  return (
    <>
      <Breadcrumbs
        title="Employees management"
        data={[{ title: "Employees" }]}
      />
      <CountDashboard size={size} />
      <AddSection
        refresh={fetchEmplyees}
        openModal={() => setShowCreateEmployeesModal(true)}
      />
     
      <Card className={`${employees.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contacts</th>
              <th>Rank</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                        <Link
                          to={`/admin/employees/${row?.id}`}
                          className="user_name text-truncate text-body"
                        >
                          <span className="fw-bolder text-capitalize">
                            {row?.firstname + " " + row?.lastname}
                          </span>
                        </Link>
                        <small className="text-truncate text-muted">
                          {row?.registration}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.email}
                      </span>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder text-capitalize">
                        {row?.rank?.name}
                      </span>
                      <small className="text-truncate text-muted text-capitalize">
                        {row?.rank?.permission}
                      </small>
                    </div>
                  </td>
                  <td>
                    {row?.activated === true ? (
                      <Badge color="light-success" className="p-50 w-100">
                        Activated
                      </Badge>
                    ) : (
                      <Badge color="light-danger" className="p-50 w-100">
                        Disabled
                      </Badge>
                    )}
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <CreateEmployeeModal
        visibility={showCreateEmployeesModal}
        closeModal={() => setShowCreateEmployeesModal(false)}
        refresh={fetchEmplyees}
      />
    </>
  );
}

export default Employees;

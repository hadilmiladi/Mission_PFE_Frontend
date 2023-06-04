// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import { X } from 'react-feather';
// ** toast
import toast from 'react-hot-toast';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
// ** Reactstrap Imports
import {
  Badge,
  Card,
  Table,
} from 'reactstrap';

// ** utils
// ** api config
import axios from '../../../../service/axios';
import { cleanUserLocalStorage } from '../../../../utility/Auth';
import { sessionExpired } from '../../../../utility/messages';

// ** -------------------------------------------------------------------------------
function Employees({ employee, refresh, active , user }) {
  // ** router
  const navigate = useNavigate();
  const {id} =useParams();
  // ** access token
  const accesToken = localStorage.getItem(
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
  const [passports, setPassports] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });

   // modals
   const [showCreateEmployeesModal, setShowCreateEmployeesModal] =
   useState(false);

  // ** fetching data
  useEffect(() => {
    if ( active === "profile") {
      fetchEmployees();
    }
  }, [user, active]);
  // ** fetch function
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/passport/employee`, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 200) {
        setPassports([...res?.data?.items]);
        console.log(res)
        setSize(res?.data?.size);
      }
    } catch (error) {
      console.log(error)
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
      //  server error
      else if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
    setLoading(false);
  };
  // ** Pagination
  const pagination = [];
  for (let i = 0; i < size / queries.l; i++) {
    pagination.push(i);
  }
  return (
    <>
      {/* <AddCompanySection
        refresh={fetchEmplyees}
        openModal={() => setShowCreateEmployeesModal(true)}
      /> */}
      <Card className={`${passports?.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Registration</th>
              <th>nationality</th>
              <th>createdAt</th>
              <th>expiresAt</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {passports?.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <span className="user_name text-truncate text-body fw-bolder">
                      {row?.registration}
                    </span>
                  </td>
                  <td classname="pe-0 me-0">
                    <span className="user_name text-truncate text-body fw-bolder">
                      {row?.nationality}
                    </span>
                  </td>
                  <td classname="pe-0 me-0">
                    <span className="user_name text-truncate text-body fw-bolder">
                      {row?.createdAt}
                    </span>
                  </td>
                  <td classname="pe-0 me-0">
                    <span className="user_name text-truncate text-body fw-bolder">
                      {row?.expiresAt}
                    </span>
                  </td>
                  <td>
                    {employee?.currentPassport === row?.id ? (
                      <Badge color="light-success" className="p-50">
                        <Check size={23} />
                      </Badge>
                    ) : (
                      <Badge color="light-danger" className="p-50">
                        <X size={18} />
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      {/* <CreateEmployeeModal
        visibility={showCreateEmployeesModal}
        closeModal={() => setShowCreateEmployeesModal(false)}
        refresh={refresh}
      /> */}
    </>
  );
}

export default Employees;

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Check,
  X,
} from 'react-feather';
// ** Toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Badge,
  Card,
  Table,
} from 'reactstrap';

// ** api config
import axios from '../../../../../service/axios';
// ** parts
// ** modals
// ** utils
import { cleanUserLocalStorage } from '../../../../../utility/Auth';
import {
  serverErrorMessage,
  sessionExpired,
} from '../../../../../utility/messages';
import AddCompanySection from '../../../companies/section/AddCompanySection';
import CreateEmployeeModal from './CreateNewPassport';

// ** -----------------------------------------------------------------------

function Employees({employee,passports,refresh}) {
  // ** router
const navigate = useNavigate();
// ** access token
const accesToken = localStorage.getItem(
  `${process.env.REACT_APP_ACCESS_TOKEN}`
);
// ** initial state
const initialQueries = {
  p: 1,
  l: 10,
  sortBy: "default",
  select: "all",
};
// ** states
  const [passport, setPassport] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  // modals
  const [showCreateEmployeesModal, setShowCreateEmployeesModal] = useState(false);
  // ** fetching data
  useEffect(() => {
    // there's a token
    /* if (accesToken) {
      fetchEmplyees();
    }
    // no token
    else {
      cleanUserLocalStorage(); 
      navigate("/login");
    } */
    //fetchEmplyees()
  }, [/* queries */]);
   // ** fetch function
   const fetchEmplyees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`passport/one/${id}`, {
        /* params: {
          page: queries.p,
          limit: queries.l,
        },
        headers: {
          authorization: `Bearer ${accesToken}`,
        }, */
      });
      console.log("res: ",res.data)
      if (res?.status === 200) {
        setPassport([...res?.data?.items]);
        setSize(res?.data?.size);
      }
    } catch (error) {
      console.log("err: ",error)
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
       
      <AddCompanySection
        refresh={fetchEmplyees}
         openModal={() => setShowCreateEmployeesModal(true)} 
      />
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
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                        <small className="text-truncate text-muted">
                          {row?.registration}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">  
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.nationality}
                      </span>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">  
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.createdAt}
                      </span>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">  
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.expiresAt}
                      </span>
                    </div>
                  </td>
                  <td>
                  
                  {employee?.currentPassport===row?.id ? <Badge color="light-success"><Check size={18} /></Badge>:<Badge color="light-danger"><X size={18} /></Badge>}</td>
                
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <CreateEmployeeModal
      visibility={showCreateEmployeesModal}
      closeModal={() => setShowCreateEmployeesModal(false)}
      refresh={refresh}
     />
    </>
  )
}

export default Employees;
import React, {
  useEffect,
  useState,
} from 'react';

// ** Toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
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
import CreateVisaModal from './CreateNewVisa';

// ** -----------------------------------------------------------------------

function EmployeeVisaTab({refresh,currentPassport,active }) {
  // ** router
  const navigate = useNavigate();
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
  const [visa, setvisa] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  // modals
  const [showCreateEmployeesModal, setShowCreateEmployeesModal] =
    useState(false);
  // ** fetching data
  useEffect(() => {
    if(active==="visa"){
      fetchEmplyees()
    }
  }, [active]);
  //console.log(currentPassport)
  // ** fetch function
  const fetchEmplyees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`visa/passport/${currentPassport.id}`, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      
      if (res?.status === 200) {
        setvisa([...res?.data?.items]);
        setSize(res?.data?.size);
        
      }
      console.log("res: ", visa);
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
      <Card className={`${visa?.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Valable for</th>
              <th>StartAt</th>
              <th>ExpiresAt</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {visa?.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                        <small className="text-truncate text-muted">
                          {row?.valable_for}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.startAt}
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
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <CreateVisaModal
        visibility={showCreateEmployeesModal}
        closeModal={() => setShowCreateEmployeesModal(false)}
        refresh={refresh}
        currentPassport={currentPassport}
      />
    </>
  );
}

export default EmployeeVisaTab;

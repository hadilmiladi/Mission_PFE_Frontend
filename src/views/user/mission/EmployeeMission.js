// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import { Eye } from 'react-feather';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
// ** react imports
import {
  Badge,
  Button,
  Card,
  Table,
} from 'reactstrap';

import axios from '../../../service/axios';
import AddCompanySection from '../companies/section/AddCompanySection';
import CreateNewMission from './CreateNewMission';
import ViewMission from './ViewMission';

function EmployeeMission() {
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
const [missions, setMissions] = useState([]);
const [loading, setLoading] = useState(false);
const [size, setSize] = useState(0);
const [showViewMission, setShowViewMission] = useState(false);
const [queries, setQueries] = useState({ ...initialQueries });
const [selectedMission, setSelectedMission] = useState({});
const navigate= useNavigate();
const { id } = useParams();
const [showCreateNewMission, setShowCreateNewMission] = useState(false);

 // ** fetch data
 useEffect(() => {
   fetchMissions();
}, []);
// ** fetch function
const fetchMissions = async () => {
  console.log("called");
  setLoading(true);
   try {
    const res = await axios.get(`mission/employee`, {
      headers: {
        authorization: `Bearer ${accesToken}`,
      },
    })
    if (res?.status === 200) {
      setMissions([...res?.data?.items]);
      setSize(res?.data?.size);
    }
  } catch (error) {
    console.log("err: ", error);
    // errors
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
return (
  <>
   <AddCompanySection
        refresh={fetchMissions}
        openModal={() => setShowCreateNewMission(true)}
      />
    <Card className={`${missions?.length === 0 && 'pb-2'} pb-1`}>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Date</th>
            <th>Destination</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {missions.map((row, index) => {
              return (
                
                  <tr> 
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.id}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.client?.company_name}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {`${String(row?.start).slice(0, 16)}-${String(row?.finish).slice(0, 16)}`}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.destination}
                      </span>
                    </td>
                    <td>
                      {row?.accepted === true && row?.declined === false ? (
                        <Badge color="light-success" className="p-50 w-100">
                          Accepted
                        </Badge>
                      ) : row?.accepted === false && row?.declined === true ? (
                        <Badge color="light-danger" className="p-50 w-100">
                          Canceled
                        </Badge>
                      ) : row?.accepted === false && row?.declined === false ? (
                        <Badge color="light-primary" className="p-50 w-100">
                          Pending
                        </Badge>
                      ) : null}
                    </td>
                    <td>  <Button
                      color="primary"
                      className="btn-icon rounded-circle"
                      onClick={() => {
                        setSelectedMission({ ...row });
                        setShowViewMission(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button></td>
                  </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <ViewMission
        visibility={showViewMission}
        closeModal={() => setShowViewMission(false)}
        row={selectedMission}
       /*  openDeleteMissionModal={() => setShowDeleteMission(true)}
        openCancelMissionModal={() => setShowCancelMissionModal(true)}
        openConfirmMissionModal={() => setShowAcceptMissionModal(true)}
        openEditMissionModal={() => setShowEditMissionModal(true)} */
      />
       <CreateNewMission
        visibility={showCreateNewMission}
        closeModal={() => setShowCreateNewMission(false)}
        refresh={fetchMissions}
      />
    </>
  );
};

export default EmployeeMission
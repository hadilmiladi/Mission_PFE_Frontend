// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

// ** icons
import {
  Eye,
  FileText,
} from 'react-feather';
import {
  Link,
  useParams,
} from 'react-router-dom';
// ** reactstrap
import {
  Badge,
  Button,
  Card,
  Table,
} from 'reactstrap';

// ** axios instance
import axios from '../../../../../service/axios';
// ** sections
import AddCompanySection from '../../../companies/section/AddCompanySection';
import CancelMissionModal from './CancelMissionModal';
import ConfirmMissionModal from './ConfirmMissionModal';
import CreateMissionModal from './CreateNewMission';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import EditMissionModal from './EditMissionModal';
import ValidMissionModal from './ValidatedMission';
import ViewMissionModal from './ViewMissionModal';

// -------------------------------------------------------------------------
function EmployeeMissionsTab({ active }) {
  // ** router
 
  const { id } = useParams();

  // ** access token
  const accessToken = localStorage.getItem('access_token');

  // ** initial state
  const initialQueries = {
    p: 1,
    l: 10,
    sortBy: 'default',
    select: 'all',
  };

  // ** states
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(0);
  const [queries, setQueries] = useState({ ...initialQueries });
  const [selectedMission, setSelectedMission] = useState({});

  // ** modals
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const [showViewMissionModal, setShowViewMissionModal] = useState(false);
  const [showDeleteMissionModal, setShowDeleteMissionModal] = useState(false);
  const [showEditMissionModal, setShowEditMissionModal] = useState(false);
  const [showCancelMissionModal, setShowCancelMissionModal] = useState(false);
  const [showAcceptMissionModal, setShowAcceptMissionModal] = useState(false);
  const [showValidMissionModal, setShowValidMissionModal] = useState(false);

  // ** fetch data
  useEffect(() => {
    if (active === 'missions') {
      fetchMissions();
    }
  }, [active]);

  // ** fetch function
  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`mission/employee/${id}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.status === 200) {
        setMissions([...res?.data?.items]);
        setSize(res?.data?.items?.length);
      }
    } catch (error) {
      console.log('err: ', error);
      // handle errors
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

  const nextPagination = () => {
    const condition = queries.p == (size / queries.l).toFixed(0);
    if (!condition) {
      setQueries((prev) => ({ ...prev, p: queries.p + 1 }));
    }
  };

  const selectPagination = (index) => {
    setQueries((prev) => ({ ...prev, p: index }));
  };
console.log('size',size)
  return (
    <>
      <AddCompanySection refresh={fetchMissions} openModal={() => setShowCreateMissionModal(true)} />
      {size!==0 ? (
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
                <tr key={`row-${index}`}>
                  <td>
                    <span className="user_name text-truncate text-body fw-bolder">{row?.id}</span>
                  </td>
                  <td>
                    <span className="user_name text-truncate text-body fw-bolder">{row?.client?.company_name}</span>
                  </td>
                  <td>
                    <span className="user_name text-truncate text-body fw-bolder">
                      {`${String(row?.start).slice(0, 16)} / ${String(row?.finish).slice(0, 16)}`}
                    </span>
                  </td>
                  <td>
                    <span className="user_name text-truncate text-body fw-bolder">{row?.destination}</span>
                  </td>
                  <td>
                    {row?.accepted === true && row?.declined === false && row?.validated === false ? (
                      <Badge color="light-success" className="p-50 w-100">
                        Accepted
                      </Badge>
                    ) : row?.accepted === false && row?.declined === false && row?.validated === true ? (
                      <Badge color="light-info" className="p-50 w-100">
                        Validated
                      </Badge>
                    ) : row?.accepted === false && row?.declined === true && row?.validated === false ? (
                      <Badge color="light-danger" className="p-50 w-100">
                        Canceled
                      </Badge>
                    ) : row?.accepted === false && row?.declined === false && row?.validated === false ? (
                      <Badge color="light-primary" className="p-50 w-100">
                        Pending
                      </Badge>
                    ) : null}
                  </td>
                  <td>
                    <Button
                      to={`/admin/invoices/${row?.id}`}
                      tag={Link}
                      color="primary"
                      className="btn-icon rounded-circle me-25"
                      disabled={row?.accepted === false}
                    >
                      <FileText size={16} />
                    </Button>
                    <Button
                      color="primary"
                      className="btn-icon rounded-circle"
                      onClick={() => {
                        setSelectedMission({ ...row });
                        setShowViewMissionModal(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      
 ) : (
  <>
  <Card className={`${missions?.length === 0 ? 'pb-2' : ''} pb-1`}>
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
        <tr>
          <td colSpan="5" className="text-center">
            No data found
          </td>
        </tr>
      </tbody>
    </Table>
  </Card>
</>
)}

      <CreateMissionModal
        visibility={showCreateMissionModal}
        closeModal={() => setShowCreateMissionModal(false)}
        refresh={fetchMissions}
      />

      <ViewMissionModal
        visibility={showViewMissionModal}
        closeModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        openDeleteMissionModal={() => setShowDeleteMissionModal(true)}
        openCancelMissionModal={() => setShowCancelMissionModal(true)}
        openConfirmMissionModal={() => setShowAcceptMissionModal(true)}
        openValidMissionModal={() => setShowValidMissionModal(true)}
        openEditMissionModal={() => setShowEditMissionModal(true)}
      />

      <DeleteEmployeeModal
        visibility={showDeleteMissionModal}
        closeModal={() => setShowDeleteMissionModal(false)}
        closeMainModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        refresh={fetchMissions}
      />

      <CancelMissionModal
        visibility={showCancelMissionModal}
        closeModal={() => setShowCancelMissionModal(false)}
        closeMainModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        refresh={fetchMissions}
      />

      <ConfirmMissionModal
        visibility={showAcceptMissionModal}
        closeModal={() => setShowAcceptMissionModal(false)}
        closeMainModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        refresh={fetchMissions}
      />

      <ValidMissionModal
        visibility={showValidMissionModal}
        closeModal={() => setShowValidMissionModal(false)}
        closeMainModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        refresh={fetchMissions}
      />

      <EditMissionModal
        visibility={showEditMissionModal}
        closeModal={() => setShowEditMissionModal(false)}
        closeMainModal={() => setShowViewMissionModal(false)}
        row={selectedMission}
        refresh={fetchMissions}
      />
     
    </>
  );
}

export default EmployeeMissionsTab;

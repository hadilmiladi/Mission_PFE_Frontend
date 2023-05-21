// ** react imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// ** react imports
import { Badge, Button, Card, Table } from "reactstrap";
// ** icons
import { Eye } from "react-feather";
// ** sections
import AddCompanySection from "../../../companies/section/AddCompanySection";
// ** Modals
import CreateMissionModal from "./CreateNewMission";
import ViewMissionModal from "./ViewMissionModal";
// ** api config
import axios from "../../../../../service/axios";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import CancelMissionModal from "./CancelMissionModal";
import ConfirmMissionModal from "./ConfirmMissionModal";
import EditMissionModal from "./EditMissionModal";
// -------------------------------------------------------------------------
function EmployeeMissionsTab({ active }) {
  // ** router
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  const [selectedMission, setSelectedMission] = useState({});
  // ** modals
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const [showViewMissionModal, setShowViewMissionModal] = useState(false);
  const [showDeleteMissionModal, setShowDeleteMissionModal] = useState(false);
  const [showEditMissionModal, setShowEditMissionModal] = useState(false);
  const [showCancelMissionModal, setShowCancelMissionModal] = useState(false);
  const [showAcceptMissionModal, setShowAcceptMissionModal] = useState(false);
  // ** fetch data
  useEffect(() => {
    if (active === "missions") {
      fetchMissions();
    }
  }, [active]);
  // ** fetch function
  const fetchMissions = async () => {
    console.log("called");
    setLoading(true);
    try {
      const res = await axios.get(`mission/employee/${id}`);
      console.log("res: ", res.data);
      if (res?.status === 200) {
        setMissions([...res?.data?.items]);
      }
    } catch (error) {
      console.log("err: ", error);
      // errors
    }
    setLoading(false);
  };
  // ** ==>
  return (
    <>
      <AddCompanySection
        refresh={fetchMissions}
        openModal={() => setShowCreateMissionModal(true)}
      />
      <Card className={`${missions?.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>ClientX</th>
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
                      {`${String(row?.start).slice(0, 16)}-${String(
                        row?.finish
                      ).slice(0, 16)}`}
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
                  <td>
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

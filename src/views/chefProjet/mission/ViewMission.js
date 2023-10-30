// ** Reactstrap Imports
import {
  useEffect,
  useState,
} from 'react';

// ** icons
import { Pocket } from 'react-feather';
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

// ** --------------------------------------------------------------------------
function ViewMissionModal(props) {
  // ** props
  const {
    visibility,
    closeModal,
    row,
    openConfirmValidationModal
  } = props;
  // ** states
  const [mission, setMission] = useState({});
  // ** set client
  useEffect(() => {
    if (visibility) {
      setMission((prev) => ({ ...prev, ...row }));
    }
  }, [visibility]);
  // ** reset form
  const resetForm = () => {
    setMission({});
  };
 
  // ** ==>
  return (
    <Modal
      isOpen={visibility}
      toggle={closeModal}
      modalClassName="modal-danger"
      onClosed={resetForm}
      backdropClassName="bg-dark"
    >
      <ModalHeader
        toggle={closeModal}
        className="text-center text-capitalize"
      ></ModalHeader>
      <ModalBody className="px-sm-2 pb-2">
        <div className="info-container">
          <ul className="list-unstyled">
            <li className="mb-75">
              <span className="fw-bolder me-25">#:</span>
              <span className="text-capitalize">{mission?.id} </span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Client :</span>
              <span className="text-capitalize">
                {mission?.client?.company_name}
              </span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Start Date :</span>
              <span className="text-capitalize">
                {String(mission?.start).slice(0, 10)}
              </span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Finish Date :</span>
              <span className="text-capitalize">
                {String(mission?.finish).slice(0, 10)}
              </span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Destination :</span>
              <span className="text-capitalize">{mission?.destination}</span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Hotel Link :</span>
              <a target='_blank' href={mission.hotelLink}>
                {`${String(mission.hotelLink).slice(0,50)}`}
              </a>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Plane Code :</span>
              <span className="text-capitalize">{mission?.planeId}</span>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Plane Link :</span>
              <a target='_blank' href={mission.planeLink}>
                {`${String(mission.planeLink).slice(0,50)}`}
              </a>
            </li>
            <li className="mb-75">
              <span className="fw-bolder me-25">Description :</span>
              <span className="text-capitalize">{mission?.description}</span>
            </li>
            <li className="mb-75">
            {!mission?.accepted && !mission?.declined && !mission?.validated && (
              <span>
              <span className="fw-bolder me-25">Validate this mission?</span>
              <div className="d-flex justify-content-center pt-2 gap-1">
            <Button
              id="openSetOrderDeliveredModal"
              color="info"
              className="btn-icon rounded-circle"
              onClick={openConfirmValidationModal}
            >
              <Pocket size={18} />
            </Button>
            </div>
            </span>
           )} 
        </li>
          </ul>
          </div>
      </ModalBody>
    </Modal>
  );
}

export default ViewMissionModal;































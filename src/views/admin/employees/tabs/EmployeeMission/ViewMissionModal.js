// ** Reactstrap Imports
import {
  useEffect,
  useState,
} from 'react';

// ** icons
import {
  Check,
  Edit,
  Pocket,
  Slash,
  Trash,
} from 'react-feather';
// ** Reactstrap Imports
import {
  Badge,
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
    openDeleteMissionModal,
    openCancelMissionModal,
    openConfirmMissionModal,
    openEditMissionModal,
    openValidMissionModal
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
              <span className="text-capitalize">{mission?.id}</span>
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
              <span className="fw-bolder me-25">Status :</span>
              {mission?.accepted === true && mission?.declined === false && mission?.validated === false ? (
                <Badge color="light-success" className="p-50">
                  Accepted
                </Badge>
              ) : mission?.accepted === false && mission?.declined === false && mission?.validated === true ? (
                <Badge color="light-info" className="p-50 ">
                  Validated
                </Badge>
              ) :mission?.accepted === false && mission?.declined === true && mission?.validated === false ? (
                <Badge color="light-danger" className="p-50">
                  Canceled
                </Badge>
              ) : (
                <Badge color="light-primary" className="p-50">
                  Pending
                </Badge>
              )}
            </li>
            {mission?.accepted === true && mission?.declined === false && mission?.validated === false && (
              <>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Accepted At :</span>
                  <span className="text-capitalize">
                    {String(mission?.acceptedAt).slice(0, 10)}
                  </span>
                </li>
                {/* <li className="mb-75">
                  <span className="fw-bolder me-25">Reason :</span>
                  <span className="text-capitalize">{mission?.comment}</span>
                </li> */}
              </>
            )}
              {mission?.accepted === false && mission?.declined === false && mission?.validated === true && (
              <>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Accepted At :</span>
                  <span className="text-capitalize">
                    {String(mission?.validatedAt).slice(0, 10)}
                  </span>
                </li>
                {/* <li className="mb-75">
                  <span className="fw-bolder me-25">Reason :</span>
                  <span className="text-capitalize">{mission?.comment}</span>
                </li> */}
              </>
            )}
            {mission?.accepted === false && mission?.declined === true && mission?.validated === false && (
              <>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Declined At :</span>
                  <span className="text-capitalize">
                    {String(mission?.declinedAt).slice(0, 10)}
                  </span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Reason :</span>
                  <span className="text-capitalize">{mission?.comment}</span>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex justify-content-center pt-2 gap-1">
            <Button
              id="openCancelOrderModal"
              color="danger"
              className="btn-icon rounded-circle"
              onClick={openCancelMissionModal}
            >
              <Slash size={18} />
            </Button>
            <Button
              id="openEditOrderModal"
              color="primary"
              className="btn-icon rounded-circle"
              onClick={openEditMissionModal}
            >
              <Edit size={18} />
            </Button>

            <Button
              id="openSetOrderDeliveredModal"
              color="success"
              className="btn-icon rounded-circle"
              onClick={openConfirmMissionModal}
            >
              <Check size={18} />
            </Button>
            <Button
              id="openSetOrderDeliveredModal"
              color="info"
              className="btn-icon rounded-circle"
              onClick={openValidMissionModal}
            >
              <Pocket size={18} />
            </Button>
            <Button
              id="openDeleteOrderModal"
              color="danger"
              className="btn-icon rounded-circle"
              onClick={openDeleteMissionModal}
            >
              <Trash size={18} />
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default ViewMissionModal;

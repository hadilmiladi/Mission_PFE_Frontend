/* // ** Reactstrap Imports
import {
  useEffect,
  useState,
} from 'react';

import { Pocket } from 'react-feather';
import toast from 'react-hot-toast';
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import axios from '../../../service/axios';

// ** --------------------------------------------------------------------------
    function ViewMission(props){
     
       // ** props
    const {
      visibility,
      closeModal,
      row,
      openEditMissionModal,
      refresh,
      closeMainModal
    } = props;
    // ** states
   const [mission, setMission] = useState({});
   const accessToken = localStorage.getItem("access_token");
   // ** states
  const [spinning, setSpinning] = useState(false);
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
   const handleClick = async () => {
    setSpinning(true);
  
    try {
      const res = await axios.put(
        `mission/status/set/${row?.id}`,
        {
          accepted: false,
          declined: false,
          validated: true,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res?.status === 202) {
        toast.success(`Mission was validated successfully`, {
          duration: 5000,
        });
        refresh();
        closeModal();
        closeMainModal();
      }
    } catch (error) {
      // errors
      console.log("err: ", error);
      if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
    setSpinning(false);
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
            {console.log("status ",mission?.accepted)}
            {console.log("mission here ",mission)}
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
            <span className="fw-bolder me-25">Employee :</span>
            <span className="text-capitalize">
              {mission?.employee?.firstname } {mission?.employee?.firstname}
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
      <Button color="info" className="btn-icon rounded-circle" onClick={handleClick}>
        <Pocket size={18} />
      </Button>
    </span>
  )}
</li>

          </ul>
          </div>
    </ModalBody>
  </Modal>
);
 }
export default ViewMission; */
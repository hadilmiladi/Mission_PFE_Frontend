// ** React Imports
import { useState } from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';
// ** Reactstrap Imports
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from 'reactstrap';

// ** api config
import axios from '../../../service/axios';
// ** utils
import { serverErrorMessage } from '../../../utility/messages';

// ** --------------------------------------------------------------------------
function ConfirmValidationModal(props) {
  // ** Props
  const { visibility, closeModal, row, refresh, closeMainModal } = props;
  // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  // ** states
  const [spinning, setSpinning] = useState(false);
  // ** on submit
  const onSubmit = async () => {
    setSpinning(true);
    try {
      const res = await axios.put(`mission/status/set/${row?.id}`, {
        accepted: false,
        declined: false,
        validated: true
      },{
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
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
       console.log("err: ",error)
       if (error?.response?.status === 500) {
         toast.error(serverErrorMessage, {
           duration: 5000,
         });
       }
     }
     setSpinning(false);
   };
   // ** onCancel
  const onDiscard = () => {
    setSpinning(false);
  };
  // ** ==>
  return (
    <Modal
      isOpen={visibility}
      toggle={closeModal}
      className="modal-dialog-centered"
      modalClassName="modal-danger"
      onClosed={onDiscard}
    >
      <ModalHeader
        toggle={closeModal}
        className="text-center text-capitalize"
      ></ModalHeader>
      <ModalBody className="px-2 mx-25 pb-2">
        <p className="text-center text-capitalize">
          Are you sure you would like to set this mission to be validated ?
        </p>

        <Col xs={12} className="text-center mt-2 pt-50">
          <Button
            type="submit"
            className="me-1"
            color="primary"
            onClick={onSubmit}
          >
            {!spinning ? (
              "Yes, Confirm"
            ) : (
              <>
                <Spinner size="sm" />
                <span className="ms-50">...</span>
              </>
            )}
          </Button>

          <Button type="button" color="danger" outline onClick={closeModal}>
            Cancel
          </Button>
        </Col>
      </ModalBody>
    </Modal>
  );
}

export default ConfirmValidationModal;

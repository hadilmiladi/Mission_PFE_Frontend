// ** React Imports
import { useState } from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
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
import axios from '../../../../../service/axios';
// ** utils
import { serverErrorMessage } from '../../../../../utility/messages';

// ** --------------------------------------------------------------------------
function ConfirmMissionModal(props) {
  // ** Props
  const { visibility, closeModal, row, refresh, closeMainModal } = props;
  // ** router
  const navigate = useNavigate();
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
  // ** states
  const [spinning, setSpinning] = useState(false);
  // ** on submit
  const onSubmit = async () => {
    setSpinning(true);
    try {
      const res = await axios.put(`mission/status/set/${row?.id}`, {
        operation: "accept",
      });
      if (res?.status === 202) {
        toast.success(`Mission was accepted successfully`, {
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
          Are you sure you would like to set this mission to be accepted ?
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

export default ConfirmMissionModal;

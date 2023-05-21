// ** React Imports
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Spinner,
} from "reactstrap";
// ** Third Party Components
import toast from "react-hot-toast";
// ** utils
import { serverErrorMessage } from "../../../../../utility/messages";
// ** api config
import axios from "../../../../../service/axios";
// ** --------------------------------------------------------------------------
function DeleteEmployeeModal(props) {
  // ** Props
  const { visibility, closeModal, row, refresh, closeMainModal } = props;
  // ** states
  const [spinning, setSpinning] = useState(false);
  // ** on submit
  const onSubmit = async () => {
    setSpinning(true);
    try {
      const res = await axios.delete(`mission/delete/${row?.id}`, {});
      if (res?.status === 202) {
        toast.success(`Mission was deleted successfully`, {
          duration: 5000,
        });
        refresh();
        closeModal();
        closeMainModal();
      }
    } catch (error) {
      console.log("err: ", error);
      // server error
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
        <p className="text-center text-capitalize fw-bold">
          Are you sure you would like to delete this mission permantly ?
        </p>
        <p className="text-center">
          <small className="text-danger text-capitalize fw-bolder">
            This mission data will be lost with no way to recover it back.
          </small>
        </p>

        <Col xs={12} className="text-center mt-2 pt-50">
          <Button
            type="submit"
            className="me-1"
            color="primary"
            onClick={onSubmit}
          >
            {!spinning ? (
              "Yes, Delete"
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

export default DeleteEmployeeModal;

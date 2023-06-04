// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Alert,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from 'reactstrap';

// ** api config
import axios from '../../../../service/axios';
// ** utilies functions
import { cleanUserLocalStorage } from '../../../../utility/Auth';
// ** utily messages
import {
  badRequestMessage,
  serverErrorMessage,
  sessionExpired,
} from '../../../../utility/messages';

// ** ---------------------------------------------------------
function DeleteRankModal(props) {
    // ** Props
    const { visibility, closeModal, row, refresh } = props;
     // ** router
  const navigate = useNavigate();
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
   // ** states
   const [spinning, setSpinning] = useState(false);
   const [showAlert, setShowALert] = useState(false);
   // ** check if company can be deleted.
   useEffect(() => {
     if (visibility && row?.count > 0) {
       setShowALert(true);
     }
   }, [visibility]);
    // ** on submit
  const onSubmit = async () => {
    setSpinning(true);
    try {
      const res = await axios.delete(`rank/delete/${row?.id}`, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 202) {
        toast.success(`${row?.name} was deleted successfully`, {
          duration: 5000,
        });
        refresh();
        closeModal();
      }
    } catch (error) {
      // errors
      if (error?.response?.status === 400) {
        toast.error(badRequestMessage, {
          duration: 5000,
        });
    }
    // not token
    else if (error?.response?.status === 401) {
      cleanUserLocalStorage();
      navigate("/login");
      toast.error(sessionExpired, {
        duration: 5000,
      });
    }
     // token invalide
     else if (error?.response?.status === 403) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      // gender is not valid
      else if (error?.response?.status === 409) {
        setShowALert(true);
      }
      // server error
      else if (error?.response?.status === 500) {
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
  setShowALert(false);
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
          Are you sure you would like to delete
          <strong className="text-capitalize"> {row?.name}</strong>{" "}
          permantly ?
        </p>
        <p className="text-center">
          <small className="text-danger text-capitalize fw-bold">
            This rank data will be lost with no way to recover it back.
          </small>
        </p>
        {showAlert && (
          <Alert color="danger" className="pb-50">
            <div className="alert-body text-center">
              We're sorry but this rank is already used by an order.
            </div>
            <div className="alert-body text-center">
              If you insist on deleting it, Please delete the order first.
            </div>
          </Alert>
        )}
         <Col xs={12} className="text-center mt-2 pt-50">
          <Button
            type="submit"
            className="me-1"
            color="primary"
            onClick={onSubmit}
            disabled={showAlert}
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

export default DeleteRankModal;

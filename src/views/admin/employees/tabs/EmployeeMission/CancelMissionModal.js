// ** React Imports
import { useState } from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';
// ** Reactstrap Imports
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

// ** api config
import axios from '../../../../../service/axios';
// ** utils
import { serverErrorMessage } from '../../../../../utility/messages';

// ** --------------------------------------------------------------------------
function CancelMissionModal(props) {
  // ** Props
  const { visibility, closeModal, row, refresh, closeMainModal } = props;

  // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert]=useState(false)
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setSpinning(true);
    setShowAlert(false)
    try {
      const res = await axios.put(`mission/status/set/${row?.id}`, {
        declined:true,
        accepted:false,
        validated:false,
        comment,
      },
      {
        headers: {
          authorization: `Bearer ${accesToken}`,
    }},);
      if (res?.status === 202) {
        toast.success(`Mission was canceled successfully`, {
          duration: 5000,
        });
        refresh();
        closeModal();
        closeMainModal();
      }
    } catch (error) {
      if(error?.response?.status === 409){
        setShowAlert(true)
      }
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
    setComment("");
    setShowAlert(false)
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
        <div className="text-center mb-1">
          <h4 className="mb-1">Cancel this mission</h4>
          <p>Please fill all the required informations.</p>
        </div>
        <Form onSubmit={onSubmit}>
          <Row className="mb-1">
            <Label sm="3" for="comment">
              Reason:
            </Label>
            <Col sm="9">
              <Input
                type="textarea"
                name="comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                id="comment"
                placeholder="why the mission was canceled"
                required
              />
            </Col>
          </Row>
          {showAlert&&<Alert color="danger">
            <div className='alert-body'>
              We're sorry but it seems to be that this mission was already accepeted and we can't cancel it now.
            </div>
          </Alert>}
          <Row>
            <Col className="d-flex mt-1" md={{ size: 9, offset: 3 }}>
              <Button className="me-1" color="primary" type="submit" disabled={showAlert}>
                Cancel
              </Button>
              <Button
                outline
                color="secondary"
                type="reset"
                onClick={closeModal}
                
              >
                Discard
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default CancelMissionModal;

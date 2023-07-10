// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';
// ** Reactstrap Imports
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

// ** api config
// ** utils
import axios from '../../../service/axios';
import { serverErrorMessage } from '../../../utility/messages';

// ** --------------------------------------------------------------------------

function SetPaid(props) {
  // ** Props
  const { visibility, closeModal, row, refresh, closeMainModal } = props;

  // ** Access token
  const accessToken = localStorage.getItem('access_token');

  // ** States
  const [spinning, setSpinning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // ** On Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSpinning(true);
    setShowAlert(false);
    
    try {
      const res = await axios.put(
        `globalinvoice/set/${row?.id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res?.status === 202) {
        console.log("i am here ",res);
        toast.success('Invoice Paid');
        refresh();
        closeModal();
        closeMainModal();
      }
      
      console.log('row?.paid', row?.paid);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }

    setSpinning(false);
  };

  useEffect(() => {
    if (visibility) {
      setShowAlert(false);
    }
  }, [visibility]);

  return (
    <Modal
      isOpen={visibility}
      toggle={closeModal}
      className="modal-dialog-centered"
      modalClassName="modal-danger"
    >
      <ModalHeader toggle={closeModal} className="text-center text-capitalize"></ModalHeader>
      <ModalBody className="px-2 mx-25 pb-2">
        <div className="text-center mb-1">
          <h4 className="mb-1">Invoice is Paid?</h4>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col className="d-flex mt-1" md={{ size: 9, offset: 3 }}>
              <Button className="me-1" color="primary" type="submit" disabled={showAlert}>
                Yes, it's paid
              </Button>
              <Button outline color="secondary" type="reset" onClick={closeModal}>
                Discard
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default SetPaid;

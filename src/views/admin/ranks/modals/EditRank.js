// ** styles
import 'cleave.js/dist/addons/cleave-phone.us';

// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

// ** toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';

// ** api config
import axios from '../../../../service/axios';
// ** utilies functions
import { cleanUserLocalStorage } from '../../../../utility/Auth';
// ** utily messages
import {
  badRequestMessage,
  requiredField,
  serverErrorMessage,
  sessionExpired,
} from '../../../../utility/messages';

// ** --------------------------------------------------------------------------
function EditRankModal(props) {
    // ** props
    const { visibility, closeModal, refresh, row } = props;
    // ** router
    const navigate = useNavigate();
 // ** access token
 const accesToken = localStorage.getItem(
  "access_token"
);
   // ** initial rank
   const initialRank = {
    name: "",
    permission: "",
    perdiem: "",
  };
    // ** states
    const [spinning, setSpinning] = useState(false);
    const [errors, setErrors] = useState({});
    const [rank, setRank] = useState({ ...initialRank});
     // ** set data
  useEffect(() => {
    if (visibility) {
      setRank((prev) => ({
        ...prev,
        name: row?.name,
        permission: row?.permission,
        perdiem: row?.perdiem
      }));
    }
  }, [visibility]);
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setRank((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeCheck=(event)=>{
    const {checked}=event.target;
    setRank(prev=>({...prev,activated:checked}))
  }
   // ** on submit
   const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(rank);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.put(`rank/update/${row?.id}`, rank, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 202) {
        toast.success(
          `${rank?.name?.toUpperCase()} was updated successfully`
        );
        refresh();
        closeModal();
      }
    } catch (error) {
        // failed to create for some reason
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
      // this name already exist

      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "name"
      ) {
        setErrors((prev) => ({
          name: "Name already used",
        }));
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
   // ** validate form
   const validate = (values) => {
    const errors = {};
    if (values.name === "") {
      errors.name = requiredField;
    }
    if (values.permission === "") {
      errors.permission = requiredField;
    }
    if (values.perdiem === "") {
      errors.perdiem = requiredField;
    }
    return errors;
};
 // ** reset form on close
 const resetForm = () => {
    setSpinning(false);
    setErrors({});
    setRank({ ...initialRank });
  };
  // ** ==>
  return (
    <Modal
      isOpen={visibility}
      toggle={closeModal}
      modalClassName="modal-danger"
      /* className="modal-lg" */
      onClosed={resetForm}
    >
        <ModalHeader
        toggle={closeModal}
        className="text-center text-capitalize"
      ></ModalHeader>
      <ModalBody className="px-sm-2 pb-2">
        <div className="text-center mb-1">
          <h4 className="mb-1">Update {row?.name}</h4>
          <p>Please fill all the required informations.</p>
        </div>
        <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="name">
              Rank name{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={rank.name}
              onChange={onChange}
              invalid={true && errors.name}
              placeholder="Example: ESB ..."
              required
            />
            {errors.name && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.name}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="permission">
              Permission{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="permission"
              type="text"
              name="permission"
              value={rank.permission}
              onChange={onChange}
              invalid={true && errors.permission}
              placeholder="Example: ESB ..."
              required
            />
            {errors.permission && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.permission}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="perdiem">
              Perdiem{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="perdiem"
              type="text"
              name="perdiem"
              value={rank.perdiem}
              onChange={onChange}
              invalid={true && errors.perdiem}
              placeholder="Example: ESB ..."
              required
            />
            {errors.perdiem && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.perdiem}
              </FormFeedback>
            )}
          </Col>
          
          
          <Col xs={12} className="text-center mt-0 pt-50 mb-1 mt-2">
            <Button type="submit" className="me-1" color="primary">
              {!spinning ? (
                "Update"
              ) : (
                <>
                  <Spinner size="sm" />
                  <span className="ms-50">Loading...</span>
                </>
              )}
            </Button>
            <Button type="reset" color="danger" outline onClick={closeModal}>
              Cancel
              </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
}


export default EditRankModal;
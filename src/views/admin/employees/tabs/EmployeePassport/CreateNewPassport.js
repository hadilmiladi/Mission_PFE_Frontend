// ** React Imports
import { useState } from 'react';

// ** toast
import toast from 'react-hot-toast';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
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
import axios from '../../../../../service/axios';
// ** utilies functions
import { cleanUserLocalStorage } from '../../../../../utility/Auth';
// ** utily messages
import {
  badRequestMessage,
  requiredField,
  serverErrorMessage,
  sessionExpired,
} from '../../../../../utility/messages';

// ** --------------------------------------------------------------------------
function CreatePassportModal(props) {
  // ** props
  const { visibility, closeModal, refresh } = props;
  // ** router
  const navigate = useNavigate();
  const { id } = useParams();
  // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  // ** initial passport
  const initialPassport = {
    registration: "",
    nationality: "",
    createdAt: "",
    expiresAt: "",
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [passport, setPassport] = useState({ ...initialPassport });
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setPassport((prev) => ({ ...prev, [name]: value }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(passport);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.post(`passport/create/${id}`, passport, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 201) {
        toast.success(
          `${
            passport.registration.toLowerCase() +
            " " +
            passport.nationality.toLowerCase()
          } was created successfully`
        );
        refresh();
        closeModal();
      }
    } catch (error) {
      console.log("err: ", error);
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
      // this registration number already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "registration"
      ) {
        setErrors((prev) => ({
          registration:
            "registration already used by an other in another passport",
        }));
      }
      // this email already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "date"
      ) {
        setErrors((prev) => ({
          createdAt: "create date must be before the expires date",
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
    if (values.registration === "") {
      errors.registration = requiredField;
    }
    if (values.nationality === "") {
      errors.nationality = requiredField;
    }
    if (values.createdAt === "") {
      errors.createdAt = requiredField;
    }
    if (values.expiresAt === "") {
      errors.expiresAt = requiredField;
    }
    return errors;
  };
  // ** reset form on close
  const resetForm = () => {
    setSpinning(false);
    setErrors({});
    setPassport({ ...initialPassport });
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
        <div className="text-center mb-1">
          <h4 className="mb-1">Add a new passport</h4>
          <p>Please fill all the required informations.</p>
        </div>
        <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="registration">
              register{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="registration"
              type="text"
              name="registration"
              value={passport.registration}
              onChange={onChange}
              invalid={true && errors.registration}
              placeholder="Example: ESB ..."
              required
            />
            {errors.registration && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.registration}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="nationality">
              nationality{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="nationality"
              type="text"
              name="nationality"
              value={passport.nationality}
              onChange={onChange}
              invalid={true && errors.nationality}
              placeholder="Example: ESB ..."
              required
            />
            {errors.nationality && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.nationality}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="createdAt">
              createdAt{": "}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="createdAt"
              type="date"
              name="createdAt"
              value={passport.createdAt}
              onChange={onChange}
              invalid={true && errors.createdAt}
              // placeholder="Example: 56599..."
              required
            />
            {errors.createdAt && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.createdAt}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="expiresAt">
              expiresAt{": "}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="expiresAt"
              type="date"
              name="expiresAt"
              value={passport.expiresAt}
              onChange={onChange}
              invalid={true && errors.expiresAt}
              // placeholder="Example: 56599..."
              required
            />
            {errors.expiresAt && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.expiresAt}
              </FormFeedback>
            )}
          </Col>
          <Col xs={12} className="text-center mt-0 pt-50 mb-1 mt-2">
            <Button type="submit" className="me-1" color="primary">
              {!spinning ? (
                "Create"
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

export default CreatePassportModal;

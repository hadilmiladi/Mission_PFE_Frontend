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
function EditCompanyModal(props) {
  // ** props
  const { visibility, closeModal, refresh, row } = props;
  // ** router
  const navigate = useNavigate();
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
  // ** initial company
  const initialCompany = {
    company_name: "",
    code: "",
    address: "",
    email: "",
    activated:false
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState({ ...initialCompany });
  // ** set data
  useEffect(() => {
    if (visibility) {
      setCompany((prev) => ({
        ...prev,
        company_name: row?.company_name,
        code: row?.code,
        address: row?.address,
        email: row?.email,
        activated:row?.activated
      }));
    }
  }, [visibility]);
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeCheck=(event)=>{
    const {checked}=event.target;
    setCompany(prev=>({...prev,activated:checked}))
  }
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(company);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.put(`client/update/${row?.id}`, company, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 202) {
        toast.success(
          `${company?.company_name?.toUpperCase()} was updated successfully`
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
      // this email already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.email === "email"
      ) {
        setErrors((prev) => ({
          email: "Email already used by an other client",
        }));
      }
      // this email already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "code"
      ) {
        setErrors((prev) => ({
          code: "Code is used by an other company",
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
    if (values.company_name === "") {
      errors.company_name = requiredField;
    }
    if (values.code === "") {
      errors.code = requiredField;
    }
    if (values.address === "") {
      errors.address = requiredField;
    }
    if (values.email === "") {
      errors.email = requiredField;
    }
    return errors;
  };
  // ** reset form on close
  const resetForm = () => {
    setSpinning(false);
    setErrors({});
    setCompany({ ...initialCompany });
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
          <h4 className="mb-1">Update {row?.CompanyName}</h4>
          <p>Please fill all the required informations.</p>
        </div>
        <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="CompanyName">
              Company name{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="company_name"
              type="text"
              name="company_name"
              value={company.company_name}
              onChange={onChange}
              invalid={true && errors.company_name}
              placeholder="Example: ESB ..."
              required
            />
            {errors.company_name && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.company_name}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label
              className="form-label text-capitalize"
              for="code"
            >
              Company Code{": "}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="code"
              type="number"
              name="code"
              value={company.code}
              onChange={onChange}
              invalid={true && errors.code}
              placeholder="Example: John..."
              required
            />
            {errors.code && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.code}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label" for="email">
              E-mail{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={company.email}
              onChange={onChange}
              invalid={true && errors.email}
              placeholder="Example: jhon@example.com ..."
              required
            />
            {errors.email && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.email}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label" for="address">
              Address{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="address"
              type="textarea"
              name="address"
              value={company.address}
              onChange={onChange}
              invalid={true && errors.address}
              placeholder="Example: Menzah 7 ..."
              required
            />
            {errors.address && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.address}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <div className="d-flex align-items-center pt-0 flex-row-reverse">
              <div className="form-switch w-100 form-check-success ps-0">
                <Label
                  className="form-check-label fw-bolder ms-0 text-capitalize"
                  for="sendMail"
                >
                  this client is activated
                </Label>
                <Input
                  checked={company?.activated}
                  type="switch"
                  name="activated"
                  className="ms-1"
                  onChange={onChangeCheck}
                  id="sendMail"
                />
              </div>
            </div>
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

export default EditCompanyModal;

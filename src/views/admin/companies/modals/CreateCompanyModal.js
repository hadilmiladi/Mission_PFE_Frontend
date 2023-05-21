// ** React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Input,
  Label,
  FormFeedback,
  Spinner,
} from "reactstrap";
// ** toast
import toast from "react-hot-toast";
// ** utilies functions
import { cleanUserLocalStorage } from "../../../../utility/Auth";
// ** utily messages
import {
  sessionExpired,
  serverErrorMessage,
  requiredField,
  badRequestMessage,
} from "../../../../utility/messages";
// ** api config
import axios from "./../../../../service/axios";
// ** --------------------------------------------------------------------------
function CreateCompanyModal(props) {
  // ** props
  const { visibility, closeModal, refresh } = props;
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
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState({ ...initialCompany });
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };
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
      const res = await axios.post("client/create", company, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 201) {
        toast.success(
          `${company.company_name.toUpperCase()} was created successfully`
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
        error?.response?.data?.code === "email"
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
      /* className="bg-dark" */
      onClosed={resetForm}
      /* backdrop={false} */
      backdropClassName="bg-dark"
    >
      <ModalHeader
        toggle={closeModal}
        className="text-center text-capitalize"
      ></ModalHeader>
      <ModalBody className="px-sm-2 pb-2">
        <div className="text-center mb-1">
          <h4 className="mb-1">Create a new company</h4>
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

export default CreateCompanyModal;

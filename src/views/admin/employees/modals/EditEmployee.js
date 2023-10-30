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
  requiredField,
  serverErrorMessage,
  sessionExpired,
} from '../../../../utility/messages';

// ** --------------------------------------------------------------------------
function EditEmployeeModal(props) {
  // ** props
  const { visibility, closeModal, refresh, row } = props;
  // ** router
  const navigate = useNavigate();
    // ** access token
    const accesToken = localStorage.getItem(
      "access_token"
    );
  // ** initial Employee
  const initialEmployee = {
    firstname: "",
    lastname: "",
    registration: "",
    email: "",
    activated: false,
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [employee, setEmployee] = useState({ ...initialEmployee });
  const [ranks, setRank]=useState([]);
  // fetch ranks
  useEffect(()=>{
    if(visibility){
      fetchRank()
    }
  },[visibility])
  // retrive all ranks
  const fetchRank = async ()=>{
    try {
      const res = await axios.get("rank/all", {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      console.log("res: ",res.data)
      if (res?.status === 200) {
        setRank([...res?.data?.items])
      }
    } catch (error) {
      console.log("err: ",error)
      // errors
    }
  }
  // ** set data
  useEffect(() => {
    if (visibility) {
      setEmployee((prev) => ({
        ...prev,
        firstname: row?.firstname,
        lastname: row?.lastname,
        registration: row?.registration,
        email: row?.email,
        rankId:row?.rankId,
        
        activated: row?.activated,
      }));
    }
  }, [visibility]);
  // ** on change
  const onChange = (event) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeCheck = (event) => {
    const { checked } = event.target;
    setEmployee((prev) => ({ ...prev, activated: checked }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(employee);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.put(`employee/update/${row?.id}`, employee, {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 202) {
        toast.success(
          `${employee?.firstname?.toUpperCase()} was updated successfully`
        );
        refresh();
        closeModal();
      }
    } catch (error) {
      console.log("err: ",error)
      // failed to create for some reason
      if (error?.response?.status === 400) {
        toast.error("failed to update for some reason", {
          duration: 5000,
        });
      }
      else if (
        error?.response?.status === 404 &&
        error?.response?.data?.code === "rank"
      ) {
        setErrors((prev) => ({
          rank: "Rank doesn't exist",
        }));
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
          email: "Email already used by an other employee",
        }));
      }
      // this registration already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "registration"
      ) {
        setErrors((prev) => ({
          registration: "registration number is used by an other employee",
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
    if (values.firstname === "") {
      errors.firstname = requiredField;
    }
    if (values.lastname === "") {
      errors.lastname = requiredField;
    }
    if (values.registration === "") {
      errors.registration = requiredField;
    }
    if (values.email === "") {
      errors.email = requiredField;
    }
    if (values.rankId === "") {
      errors.rankId = requiredField;
    }
    return errors;
  };
  // ** reset form on close
  const resetForm = () => {
    setSpinning(false);
    setErrors({});
    setEmployee({ ...initialEmployee });
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
          <h4 className="mb-1">Update {row?.firstname}</h4>
          <p>Please fill all the required informations.</p>
        </div>
        <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="firstname">
              First Name{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="firstname"
              type="text"
              name="firstname"
              value={employee.firstname}
              onChange={onChange}
              invalid={true && errors.firstname}
              placeholder="Example: ESB ..."
              required
            />
            {errors.employee && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.firstname}
              </FormFeedback>
            )}
          </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="lastname">
              Last Name{": "} <span className="text-danger">*</span>
            </Label>
            <Input
              id="lastname"
              type="text"
              name="lastname"
              value={employee.lastname}
              onChange={onChange}
              invalid={true && errors.lastname}
              placeholder="Example: ESB ..."
              required
            />
            {errors.employee && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.lastname}
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
              value={employee.email}
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
          <Label className="form-label" for="rankId">
            Rank{": "} <span className="text-danger">*</span>
          </Label>
          <Input
            id="rankId"
            type="select"
            name="rankId"
            value={employee.rankId}
            onChange={onChange}
            invalid={true && errors.rankId}
            placeholder="Example: jhon@example.com ..."
            required
          >
            {ranks?.map((item,index)=>{
              return <option key={`row-${index}`} value={item?.id}>
                {item?.name}
              </option>
            })}
          </Input>
          {errors.rankId && (
            <FormFeedback className="d-block text-capitalize fw-bold">
              {errors.rankId}
            </FormFeedback>
          )}
        </Col>
          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="registration">
              employee registration{": "}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="registration"
              type="number"
              name="registration"
              value={employee.registration}
              onChange={onChange}
              invalid={true && errors.registration}
              placeholder="Example: John..."
              required
            />
            {errors.registration && (
              <FormFeedback className="d-block text-capitalize fw-bold">
                {errors.registration}
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
                  this employee is activated
                </Label>
                <Input
                  checked={employee?.activated}
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

export default EditEmployeeModal;

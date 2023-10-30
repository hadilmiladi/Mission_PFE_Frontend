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
// ** utily messages
import {
  requiredField,
  serverErrorMessage,
  sessionExpired,
} from '../../../../utility/messages';

// ** --------------------------------------------------------------------------
function CreateRankModal(props) {
    // ** props
    const { visibility, closeModal, refresh } = props;
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
   const [rank, setRank] = useState({ ...initialRank });
   const [permission, setPermission] = useState('');
   // ** on change
   const onChange = (event) => {
    const { name, value } = event.target;
    setRank((prev) => ({ ...prev, [name]: value }));
  };
  //useEffect
  useEffect(() => {
    const fetchRankData = async () => {
      try {
        const res = await axios.get('rank/all', {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 200) {
          const rank = res.data;
          setPermission(rank.permission);
        }
      } catch (error) {
         // not token
      if (error?.response?.status === 401) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      // token invalid
      else if (error?.response?.status === 403) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      //failed to retrieve for some reason
      else if (error?.response?.status === 400) {
        toast.error("failed to retirve ranks", {
          duration: 5000,
        });
      }
       //  server error
       else if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
      }
    };
  
    fetchRankData();
  }, []);
  console.log(rank)
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
        const res = await axios.post("rank/create", rank, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 201) {
            toast.success(
              `${rank.name.toUpperCase()} was created successfully`
            );
            refresh();
            closeModal();
          }
        } catch (error) {
            // failed to create for some reason
            if (error?.response?.status === 400) {
              toast.error("failed to create ", {
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
      // this rank name already exist
      else if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === "name"
      ) {
        setErrors((prev) => ({
          name: "Name already exist",
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
  //console.log(permission)
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
      onClosed={resetForm}
      backdropClassName="bg-dark"
    >
        <ModalHeader
        toggle={closeModal}
        className="text-center text-capitalize"
      ></ModalHeader>
       <ModalBody className="px-sm-2 pb-2">
        <div className="text-center mb-1">
          <h4 className="mb-1">Create a new rank</h4>
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
    Permission {": "} <span className="text-danger">*</span>
  </Label>
  <Input
    id="permission"
    type="select"
    name="permission"
    value={permission}
    onChange={onChange}
    invalid={!!errors.permission} 
    placeholder="Example: ESB ..."
    required
  >
    <option value="">Select Permission</option>
    <option value="user">User</option>
    <option value="admin">Admin</option>
    <option value="ceo">CEO</option>
    <option value="chef du projet">Chef du Projet</option>
  </Input>
  {errors.permission && (
    <FormFeedback className="d-block text-capitalize fw-bold">
      {errors.permission}
    </FormFeedback>
  )}
</Col>


          <Col md={12} xs={12}>
            <Label className="form-label text-capitalize" for="perdiem">
              Perdiem {": "} <span className="text-danger">*</span>
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

export default CreateRankModal;

// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

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
  function CreateNewVisa(props) {
    // ** props
    const { visibility, closeModal, refresh,currentPassport } = props;
    // ** router
  const navigate = useNavigate();
  const { id } = useParams();
  // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
   // ** initial visa
   const initialVisa = {
    valable_for: "",
    startAt: "",
    expiresAt: "",
    passportId:"",
  };
   // ** states
   const [spinning, setSpinning] = useState(false);
   const [errors, setErrors] = useState({});
   const [visa, setVisa] = useState({ ...initialVisa });
   ///
   useEffect(()=>{
     setVisa(prev=>({...prev,passportId:currentPassport}))
   },[])
   // ** on change
   const onChange = (event) => {
     const { name, value } = event.target;
     setVisa((prev) => ({ ...prev, [name]: value }));
   };
    // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(visa);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
        const res = await axios.post(`visa/create`, visa, {
            headers: {
              authorization: `Bearer ${accesToken}`,
            },
          });
          if (res?.status === 201) {
            toast.success(
              `${
                visa.valable_for.toLowerCase() +
                " " 
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
           // this date is not defined
          else if (
            error?.response?.status === 409 &&
            error?.response?.data?.code === "date"
          ) {
            toast.error("the visa range date is outside the passport date, Check again", {
                duration: 5000,
              });
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
        if (values.valable_for === "") {
          errors.valable_for = requiredField;
        }
        if (values.startAt === "") {
            errors.startAt = requiredField;
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
        setVisa({ ...initialVisa});
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
              <h4 className="mb-1">Add a new visa</h4>
              <p>Please fill all the required informations.</p>
            </div>
            <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
              <Col md={12} xs={12}>
                <Label className="form-label text-capitalize" for="valable for">
                  valable_for{": "} <span className="text-danger">*</span>
                </Label>
                <Input
                  id="valable_for"
                  type="text"
                  name="valable_for"
                  value={visa.valable_for}
                  onChange={onChange}
                  invalid={true && errors.valable_for}
                  placeholder="Example: ESB ..."
                  required
                />
                 {errors.valable_for && (
                  <FormFeedback className="d-block text-capitalize fw-bold">
                    {errors.valable_for}
                  </FormFeedback>
                )}
              </Col>
              <Col md={12} xs={12}>
                <Label className="form-label text-capitalize" for="startAt">
                  startAt{": "}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  id="startAt"
                  type="date"
                  name="startAt"
                  value={visa.startAt}
                  onChange={onChange}
                  invalid={true && errors.startAt}
                  // placeholder="Example: 56599..."
                  required
                />
                {errors.startAt && (
                  <FormFeedback className="d-block text-capitalize fw-bold">
                    {errors.startAt}
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
                  value={visa.expiresAt}
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
    
    export default CreateNewVisa;
    
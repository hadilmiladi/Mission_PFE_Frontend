// ** Reactstrap Imports
import {
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
// ** toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
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
import axios from '../../../service/axios';
// ** utily messages
import {
  badRequestMessage,
  serverErrorMessage,
  sessionExpired,
} from '../../../utility/messages';

// ** --------------------------------------------------------------------------
const CreateMission= (props) => {
    // ** props
    const { visibility, closeModal, refresh } = props;
    // ** param
    /* const { id } = useParams(); */
    
     // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  
  const token = localStorage.getItem('access_token');
  console.log('token', token);
  const decodedToken = jwt_decode(token);
  const id = decodedToken.id;

  console.log('id :', id);
    // ** router
    const navigate = useNavigate();
    // **
    const initialMission = {
      description: "",
      comment: "",
      start: null,
      finish: null,
      destination: "",
      planeId: "",
      planeLink:"",
      planePrice:"",
      hotelLink: "",
      hotelPrice: "",
      clientId: "",
      employeeId: id,
    };
    // ** states
    const [mission, setMission] = useState({ ...initialMission });
    const [loading, setLoading] = useState(false);
    const [client, setClients] = useState([]);
    // ** set client
    useEffect(() => {
      if (visibility) {
        fetchClients();
      }
    }, [visibility]);
    // fetc client
    const fetchClients = async () => {
      try {
        const res = await axios.get("client/all",{
          headers: {
              authorization: `Bearer ${accesToken}`,
            },
      });
        if (res?.status === 200) {
          setClients([...res?.data?.items]);
        }
      } catch (error) {
        console.log("err: ", error);
      }
    };
    // ** on change
    const onChange = (event) => {
      const { name, value } = event.target;
      setMission((prev) => ({ ...prev, [name]: value }));
    };
    // ** on submit
    const onSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const res = await axios.post(`mission/create/employee/${id}`, mission,{
            headers: {
                authorization: `Bearer ${accesToken}`,
              },
        });
        if (res?.status === 201) {
          toast.success(`New mission was created successfully`);
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
         /*  cleanUserLocalStorage();
          navigate("/login"); */
          toast.error(sessionExpired, {
            duration: 5000,
          });
        }
        // token invalide
        else if (error?.response?.status === 403) {
          /* cleanUserLocalStorage();
          navigate("/login"); */
          toast.error(sessionExpired, {
            duration: 5000,
          });
        }
        // this email already exist
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "activated"
        ) {
          toast.error(
            "we're sorry bit it seems to be that this employee is currently deactivated and we can't create a mission for him.",
            {
              duration: 5000,
            }
          );
        }
        // this email already exist
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "passport"
        ) {
          toast.error(
            "we're sorry bit it seems to be that this employee passport is currently unavailable for this mission.",
            {
              duration: 5000,
            }
          );
        }
        // this email already exist
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "visa"
        ) {
          toast.error(
            "we're sorry bit it seems to be that this employee doesn't have a visa to this country",
            {
              duration: 5000,
            }
          );
        }
        // this email already exist
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "date"
        ) {
          toast.error(
            "we're sorry bit it seems to be that this employee have a mission in the date",
            {
              duration: 5000,
            }
          );
        }
        // server error
        else if (error?.response?.status === 500) {
          toast.error(serverErrorMessage, {
            duration: 5000,
          });
        }
        // errors
      }
      setLoading(false);
    };
    // ** reset form
    const resetForm = () => {
      setMission({ ...initialMission });
      setClients([]);
      setLoading(false);
    };
    const handleClick = () => {
        window.open("https://www.skyscanner.fr/", "_blank");
      };
      
    // ** ==>
    return (
      <>
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
              <h4 className="mb-1">Create a new mission</h4>
              <p>Please fill all the required informations.</p>
            </div>
            <Form onSubmit={onSubmit}>
              <Row className="mb-1">
                <Label sm="3" for="name">
                  Client:
                </Label>
                <Col sm="9">
                  <Input
                    type="select"
                    name="clientId"
                    onChange={onChange}
                    value={mission.clientId}
                    id="clientId"
                    placeholder="First Name"
                    required
                  >
                    <option value="">Select</option>
                    {client.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.company_name}
                        </option>
                      );
                    })}
                  </Input>
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="destination">
                  Destination:
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    name="destination"
                    value={mission.destination}
                    onChange={onChange}
                    id="destination"
                    placeholder="example: lac, menzah 7, ..."
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="start">
                  Start date:
                </Label>
                <Col sm="9">
                  <Input
                    type="date"
                    name="start"
                    value={mission.start}
                    onChange={onChange}
                    id="start"
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="finish">
                  Finish date:
                </Label>
                <Col sm="9">
                  <Input
                    type="date"
                    name="finish"
                    id="finish"
                    required
                    value={mission.finish}
                    onChange={onChange}
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="description">
                  Description:
                </Label>
                <Col sm="9">
                  <Input
                    type="textarea"
                    name="description"
                    value={mission.description}
                    onChange={onChange}
                    id="description"
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="planeId">
                  Plane:
                </Label>
                <Col sm="9">
                  <Input
                    type="text"
                    name="planeId"
                    id="planeId"
                    value={mission.planeId}
                    onChange={onChange}
                    placeholder="3513zex13zzdx"
                  />
                </Col>
                
                <Col className="d-flex mt-1" md={{ size: 9, offset: 3 }}>
                  <Button className="me-2" color="primary" type="button" onClick={handleClick}>
                    Search
                  </Button>
                  </Col>
              </Row>
              <Row className="mb-1">
                <Label sm="3" for="planeLink">
                  Link to plane:
                </Label>
                <Col sm="9">
                  <Input
                    type="url"
                    name="planeLink"
                    id="planeLink"
                    value={mission.planeLink}
                    onChange={onChange}
                    placeholder="vol Link"
                  />
                </Col> </Row>
                {/* <Row className="mb-1">
                <Label sm="3" for="planePrice">
                  Pricing:
                </Label>
                <Col sm="9">
                  <Input
                    type="number"
                    name="planePrice"
                    id="planePrice"
                    value={mission.planePrice}
                    onChange={onChange}
                    placeholder="planePrice"
                  />
                </Col>  </Row>    */} 
          
              <Row className="mb-1">
                <Label sm="3" for="hotelLink">
                  Link to hotel:
                </Label>
                <Col sm="9">
                  <Input
                    type="url"
                    name="hotelLink"
                    id="hotelLink"
                    value={mission.hotelLink}
                    onChange={onChange}
                    placeholder="hotel Link"
                  />
                </Col> </Row>
                {/* <Row className="mb-1">
                <Label sm="3" for="hotelPrice">
                  Pricing:
                </Label>
                <Col sm="9">
                  <Input
                    type="number"
                    name="hotelPrice"
                    id="hotelPrice"
                    value={mission.hotelPrice}
                    onChange={onChange}
                    placeholder="hotelPrice"
                  />
                </Col>  </Row>    */} 
              <Row>
                <Col className="d-flex mt-1" md={{ size: 9, offset: 3 }}>
                  <Button className="me-1" color="primary" type="submit">
                    Create
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
      </>
    );
  };
  export default CreateMission;
  
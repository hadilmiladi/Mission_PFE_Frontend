// ** Reactstrap Imports
import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Input,
  Label,
  Row,
} from 'reactstrap';

import axios from '../../../../../service/axios';

const HorizontalForm = () => {
  // ** param
  const {id}=useParams()
  // ** router
  const navigate = useNavigate();
  // ** 
  const initialMission={
    description:"",
    comment:"",
    start:null,
    finish: null,
    destination:"",
    planeId:"",
    hotelId:"",
    clientId:"",
    employeeId:id,

  }
  // ** states
  const [mission, setMission]=useState({...initialMission})
  const [loading, setLoading]=useState(false);
  const [client,setClients]=useState([])
  // ** set client
  useEffect(()=>{
    fetchClients()
  },[])
  // fetc client
  const fetchClients=async()=>{
    try {
      const res = await axios.get('client/all');
      if(res?.status===200){
        setClients([...res?.data?.items])
      }
    } catch (error) {
      console.log("err: ",error)
    }
  }
  // ** on change
  const onChange=event=>{
    const {name,value}=event.target;
    setMission(prev=>({...prev,[name]:value}))
  }

  // on submit
  const onSubmit= async(event)=>{
    event.preventDefault()
    try {
      const res=await axios.post('mission/create',mission);
      if(res?.status===201){
        toast.success(
          `New mission was created successfully`
        );
        /* refresh();
        closeModal(); */
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
        error?.response?.data?.code === "activated"
      ) {
        toast.error("we're sorry bit it seems to be that this employee is currently deactivated and we can't create a mission for him.", {
          duration: 5000,
        });
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
      // errors
    }
  }
  // ==>
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Horizontal Form</CardTitle>
      </CardHeader>

      <CardBody>
        <Form onSubmit={onSubmit}>
          <Row className='mb-1'>
            <Label sm='3' for='name'>
              Client: 
            </Label>
            <Col sm='9'>
              <Input type='select' name='clientId' onChange={onChange} value={mission.clientId} id='clientId' placeholder='First Name' required>
              <select value="" >Select</select>
              {client.map((item,index)=>{
                return <option key={index} value={item.id} >
                {item.company_name}</option>
              })}
              </Input>
            </Col>
          </Row>

          <Row className='mb-1'>
            <Label sm='3' for='destination'>
              Destination: 
            </Label>
            <Col sm='9'>
              <Input type='text' name='destination' value={mission.destination} onChange={onChange} id='destination' placeholder='example: lac, menzah 7, ...' required />
            </Col>
          </Row>

          <Row className='mb-1'>
            <Label sm='3' for='start'>
              Start date:
            </Label>
            <Col sm='9'>
              <Input type='date' name='start' value={mission.start} onChange={onChange}  id='start' required />
            </Col>
          </Row>

          <Row className='mb-1'>
            <Label sm='3' for='finish'>
              Finish date:
            </Label>
            <Col sm='9'>
              <Input type='date' name='finish' id='finish' required value={mission.finish} onChange={onChange}  />
            </Col>
          </Row>

          <Row className='mb-1'>
            <Label sm='3' for='description'>
              Description: 
            </Label>
            <Col sm='9'>
              <Input type='textarea' name='description' value={mission.description} onChange={onChange} id='description' />
            </Col>
          </Row>

          <Row className='mb-1'>
            <Label sm='3' for='comment'>
              Comment: 
            </Label>
            <Col sm='9'>
              <Input type='textarea' name='comment' id='comment' value={mission.comment} onChange={onChange} />
            </Col>
          </Row>

          {/* <Row className='mb-1'>
            <Col sm={{ size: 9, offset: 3 }}>
              <div className='form-check'>
                <Input type='checkbox' id='remember-me' defaultChecked={false} />
                <Label for='remember-me'>Remember Me</Label>
              </div>
            </Col>
            </Row> */}

          <Row>
            <Col className='d-flex' md={{ size: 9, offset: 3 }}>
              <Button className='me-1' color='primary' type='submit'>
                Create
              </Button>
              <Button outline color='secondary' type='reset'>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default HorizontalForm

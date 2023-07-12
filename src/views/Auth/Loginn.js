import '@styles/react/pages/page-authentication.scss';

import {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CardText,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';

import axios from '../../service/axios';
import {
  cleanUserLocalStorage,
  getUserRoutePerRole,
  isUserLoggedIn,
} from '../../utility/Auth';
import {
  requiredField,
  serverErrorMessage,
} from '../../utility/messages';

const Loginn = () => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [redirectToMicrosoft, setRedirectToMicrosoft] = useState(false);
// ** check if already authed
useEffect(() => {
  const isLogged = isUserLoggedIn()
  if (!isLogged) {
    cleanUserLocalStorage();
    navigate('/login')
    return;
  }
  if (isLogged) {
    navigate('/');
    return;
  }
  
}, [navigate]);


  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setShowAlert(false);
    const inputErrors = validate(email);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    if (Object.keys(inputErrors).length === 0) {
      try {
        const res = await axios.get(`/Login/${email}`);
        console.log("res: ", res)
        if (res?.status === 200) {
          console.log("res: ",res)
          localStorage.setItem('access_token',res?.data?.token)
          localStorage.setItem('access_role',res?.data?.role)
          const home = getUserRoutePerRole(res?.data?.role)
          console.log("home: ",home)
          navigate(home)
          
        }
      } catch (error) {
        console.log("err: ", error)
        const status = error?.response?.status;
        if (status === 404) {
          setErrors({
            email: "This user doesn't exist",
          });
        }
        else if (status === 500) {
          toast.error(serverErrorMessage, {
            duration: 5000,
          });
        }
      }
    }
    setSpinning(false);
  };

  const validate = (values) => {
    const errors = {};
    if (values === "") {
      errors.email = requiredField;
    }
    return errors;
  };

  const handleMicrosoftLogin = () => {
    setRedirectToMicrosoft(true);
  };
// Redirect to Microsoft login when redirectToMicrosoft is true
useEffect(() => {
  const handleMicrosoftLoginCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("this is the codddddeeeee",code);
    if (code) {
      try {
        const res = await axios.post('admin/clients', { code });
        console.log("this is my ressssss",res);
        // Handle the response and perform necessary actions
        // For example, store the access token and role in localStorage
        localStorage.setItem('access_token', res?.data?.token);
        localStorage.setItem('access_role', res?.data?.role);
        const home = getUserRoutePerRole(res?.data?.role);
        navigate(home);
      } catch (error) {
        // Handle the error
      }
    }
  };
  if (redirectToMicrosoft) {
    window.location.href = 'https://login.microsoft.com'; // Replace with the appropriate Microsoft login URL
  } else {
    handleMicrosoftLoginCallback();
  }
}, [redirectToMicrosoft, navigate]);


  return (
  

    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
         

          <h2 className="brand-text text-primary ms-1">Nexus</h2>
        <Col className="d-none d-lg-flex align-items-center" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
           {/*  <img className="img-fluid" src={logo} alt="Login Cover" /> */}
          </div>
        </Col>

        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Welcome! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={onSubmit}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="example: johnk@example.com"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  invalid={errors.email && true}
                  autoFocus
                  required
                />
                {errors.email && (
                  <FormFeedback className="d-block">
                    {errors.email}
                  </FormFeedback>
                )}
              </div>
              {showAlert && (
                <Alert color="danger">
                  <div className="alert-body text-center">
                    Your account is currently suspended, Please contact administration to slove this issue.
                  </div>
                </Alert>
              )}
              
              <Button color="primary"/*  block onClick={handleMicrosoftLogin} */>
                Sign in with Microsoft
              </Button>
            </Form>
           
          </Col>
        </Col>
      </Row>
    </div>
 
  );
};

export default Loginn;
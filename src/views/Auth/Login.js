import '@styles/react/pages/page-authentication.scss';

import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Button,
  CardText,
  Col,
  Row,
} from 'reactstrap';

import { PublicClientApplication } from '@azure/msal-browser';

import coverImage from '../../assets/images/cover.png';
import axios from '../../service/axios';
import {
  cleanUserLocalStorage,
  getUserRoutePerRole,
} from '../../utility/Auth';
import { serverErrorMessage } from '../../utility/messages';
import { config } from './config';

const Login = () => {
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [user,setUser]=useState({});

  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirctUri,
      authority: config.authority,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  });

  const handleLogin = async () => {
    try {
      await publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      });

      const tokenString = localStorage.getItem(
        '00000000-0000-0000-bf8e-ce2eb0f284fe.9188040d-6c67-4c5b-b112-36a304b66dad-login.windows.net-298fe323-14d7-4887-81aa-86e61b43e140'
      );

      try {
        const tokenObject = JSON.parse(tokenString);
        setEmail(tokenObject.username);
      } catch (error) {
        console.error('Error parsing token string:', error);
      }
    } catch (error) {
      setError(error);
      setIsAuthenticated(false);
      setUser({});
      cleanUserLocalStorage();
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/Login/${email}`);
        if (res?.status === 200) {
          localStorage.setItem('access_token', res?.data?.token);
          localStorage.setItem('access_role', res?.data?.role);
          const home = getUserRoutePerRole(res?.data?.role);
          navigate(home);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
        const status = error?.response?.status;
        if (status === 404) {
          setError({
            email: "This user doesn't exist",
          });
        } else if (status === 500) {
          toast.error(serverErrorMessage, {
            duration: 5000,
          });
        }
      }
    };

    if (email) {
      fetchData();
    }
  }, [email, navigate]);

  const login = async () => {
    await handleLogin();
    setIsAuthenticated(true);
  };

  return (
    
    <div className="auth-wrapper auth-cover">
     <Row className="auth-inner m-0">
     {/*  <h2 className="brand-text text-primary ms-1">Nexus</h2> */}
      <Col className="d-none d-lg-flex align-items-center" lg="8" sm="12">
        <div className="w-100 d-lg-flex align-items-center justify-content-center px-5"> 
        <img src={coverImage} alt="Login Cover" className="img-fluid" />
        </div>
      </Col>
      <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
        <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
         {/*  <CardTitle tag="h2" className="fw-bold mb-1">
                Welcome! 👋
              </CardTitle> */}
              <CardText className="mb-2">
                Please sign in to your account and start the adventure
              </CardText>
              <Button color="primary" onClick={login}>
                Sign in with Microsoft
              </Button>
            </Col>
          </Col>
        </Row> 
     
    
        </div>
      
    );
  };

export default Login;

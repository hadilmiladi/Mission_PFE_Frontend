import '@styles/react/pages/page-authentication.scss';

import React, {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
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
import { useSkin } from '../../utility/hooks/useSkin';
import { serverErrorMessage } from '../../utility/messages';
import { config } from './config';
import styles, { container } from './login.css';

const Login = () => {
  /* // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  ); */
  const [error, setError] = useState(null);
  const { skin } = useSkin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [user,setUser]=useState({});
  const [msal, setMsal] = useState("");


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
      
      const msal = localStorage.getItem('msal.account.keys')
      const result = msal.substring(2, msal.length - 2);
      console.log(result) 
      const tokenString = localStorage.getItem(result);
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
  console.log('email', email)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/Login/${email}` /* ,{
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        }  */);
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
          toast.error("User doesn't exist", {
            duration: 5000,
          });
        }
        else if (status===401){
          toast.error("User unauthoraurized", {
            duration: 5000,
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
        <CardText className="mb-4">
                Sign in with your Microsoft account
              </CardText>
        <div className={styles.container}>
        <div className={styles.bsk-container}>
          <button className="bsk-btn bsk-btn-default" onClick={login}>
            <img
              src="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg"
              alt="Microsoft Icon"
              className={styles.xIcon} // Use the class name from your CSS module
            />
            Sign in with Microsoft
          </button>
        </div>
      </div>
          </Col>
          </Col>
        </Row> 
     
    
        </div>
      
    );
  };

export default Login;

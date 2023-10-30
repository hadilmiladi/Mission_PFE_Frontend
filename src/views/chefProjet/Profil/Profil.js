// ** React Imports
import {
  Fragment,
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Col,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

// ** components
import Breadcrumbs from '@components/breadcrumbs';

import axios from '../../../service/axios';
import {
  badRequestMessage,
  serverErrorMessage,
} from '../../../utility/messages';
import Tabs from './tabs/tabs';
import ViewChefMission from './tabs/ViewChefMission';

// ** ------------------------------------------------------------------------
function Settings({refresh}) {
    // ** access token
    const accesToken = localStorage.getItem(
      `access_token`
    );
    const token = localStorage.getItem('access_token');
    console.log('token', token);
    const decodedToken = jwt_decode(token);
    const id = decodedToken.id;
  
    console.log('id :', id);
  
    // ** router
    const navigate = useNavigate();
    // ** states
    const [active, setActive] = useState("mission");
    const [profile, setProfile] = useState(null);
    // ** fetching profile
    useEffect(() => {
      // there's a token
      if (accesToken) {
        fetchProfile(); 
      }
      // no token
      else {
        /* cleanUserLocalStorage();
        navigate("/login"); */
      }
    }, [active]);
    // ** fetch function
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`employee/one/${id}`, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 200) {
          console.log("res: res",res.data)
          setProfile((prev) => ({ ...res?.data?.item }));
        }
      } catch (error) {
        console.log("err: ",error)
        // not token
        if (error?.response?.status === 401) {
          cleanUserLocalStorage();
          navigate("/login");
          toast.error(badRequestMessage, {
            duration: 5000,
          });
        }
        else if(error?.response?.status === 403){
          cleanUserLocalStorage();
          navigate("/login");
          toast.error(badRequestMessage, {
            duration: 5000,
          });
        }
        else if(error?.response?.status === 404){
          toast.error("employee doesn't exist", {
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
    // ** switch between tabs
    const toggleTab = (tab) => {
      setActive(tab);
    };
    // ** ==>
    return (
      <Fragment>
        <Breadcrumbs
          title="Account Settings"
          data={[{ title: "Account Settings" }]}
        />
        <Row>
          <Col xs={12}>
            <Tabs className="mb-2" activeTab={active} toggleTab={toggleTab} />
  
            <TabContent activeTab={active}>
            <TabPane tabId="mission">
                <ViewChefMission
                 
                  refresh={refresh}
                  active={active}
                />
              </TabPane>
              
            </TabContent>
          </Col>
        </Row>
      </Fragment>
    );
  }
  
  export default Settings;
  
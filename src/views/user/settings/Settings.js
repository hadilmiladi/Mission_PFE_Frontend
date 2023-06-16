// ** React Imports
import {
  Fragment,
  useEffect,
  useState,
} from 'react';

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

// ** api config
import axios from '../../../service/axios';
import {
  badRequestMessage,
  serverErrorMessage,
} from '../../../utility/messages';
import PasswordSettingTab from './tabs/PasswordSettingTab';
import ProfileSettingTab from './tabs/ProfileSettingTab';
// ** Tabs
import Tabs from './tabs/Tabs';

// ** ------------------------------------------------------------------------
function Settings() {
  // ** access token
  const accesToken = localStorage.getItem(
    `access_token`
  );
  // ** router
  const navigate = useNavigate();
  // ** states
  const [active, setActive] = useState("profile");
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
      const res = await axios.get("employee/one", {
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      });
      if (res?.status === 200) {
        console.log("res: ",res.data)
        setProfile((prev) => ({ ...res?.data?.item }));
      }
    } catch (error) {
      console.log("err: ",error)
      // not token
      if (error?.response?.status === 401) {
        /* cleanUserLocalStorage();
        navigate("/login"); */
        toast.error(badRequestMessage, {
          duration: 5000,
        });
      }
      // not token
      /* else if (error?.response?.status === 401) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      // expired
      else if (error?.response?.status === 403) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      } */
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
            <TabPane tabId="profile">
              <ProfileSettingTab
                user={profile}
                refresh={fetchProfile}
                active={active}
              />
            </TabPane>
            <TabPane tabId="visa">
              <PasswordSettingTab 
               active={active}
               currentPassport={profile?.currentPassport}
               />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Settings;

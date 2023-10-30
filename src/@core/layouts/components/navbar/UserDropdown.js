// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
// ** Third Party Components
import {
  LogOut,
  Power,
} from 'react-feather';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import axios from '../../../../service/axios';
// ** utils
import { cleanUserLocalStorage } from '../../../../utility/Auth';

// ** -----------------------------------------------------------------------
const UserDropdown = () => {
  const token = localStorage.getItem('access_token');
  const decodedToken = jwt_decode(token);
  const id = decodedToken.id;

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchName();
  }, []);

  const fetchName = async () => {
    try {
      const res = await axios.get(`employee/name/${id}`);
      if (res.status === 200) {
        setUserData(res.data); 
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  
  // ** log out
  const logOut = (event) => {
    event.preventDefault();
    cleanUserLocalStorage();
    navigate("/login");
    console.log('logged out')
  };
  // ** ==>
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        
        <div className="user-nav d-sm-flex d-none">
          <span className="user-status text-capitalize fw-bold">
            {userData}
          </span>
         
        </div>
        <LogOut />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem divider />
        <DropdownItem onClick={logOut}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Sign out</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;

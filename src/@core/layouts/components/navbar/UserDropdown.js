// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

// ** Third Party Components
import { Power } from 'react-feather';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

// ** Custom Components
import Avatar from '@components/avatar';
// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg';

// ** utils
import { cleanUserLocalStorage } from '../../../../utility/Auth';

// ** -----------------------------------------------------------------------
const UserDropdown = () => {
  // ** router
  const navigate = useNavigate();
  // ** states
  const [userData, setUserData] = useState(null);
  // ** set data
  useEffect(() => {
    const data = localStorage.getItem('access_role');
    if (data == null) {
      navigate("/login");
    }
    //
    if (data !== null) {
      setUserData(data);
    }
  }, []);
  // ** log out
  const logOut = (event) => {
    event.preventDefault();
    cleanUserLocalStorage();
    navigate("/login");
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
        <Avatar
          img={defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem divider />
        <DropdownItem onClick={logOut}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Se Déconnecter</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;

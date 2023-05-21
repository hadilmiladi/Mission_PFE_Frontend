// ** React Imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// ** Custom Components
import Avatar from "@components/avatar";
// ** Third Party Components
import { Settings, Power } from "react-feather";
// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
// ** api config
import { BASE_PATH } from "../../../../service/axios";
// ** utils
import { cleanUserLocalStorage } from "../../../../utility/Auth";
// ** -----------------------------------------------------------------------
const UserDropdown = () => {
  // ** router
  const navigate = useNavigate();
  // ** states
  const [userData, setUserData] = useState(null);
  // ** set data
  useEffect(() => {
    /* const data = localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
    if (data == null) {
      navigate("/login");
    }
    //
    if (data !== null) {
      const user = JSON.parse(data);
      setUserData({ ...user });
    } */
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
          {userData?.responsableName && (
            <span className="user-name fw-bold text-capitalize">
              {userData?.responsableName}
            </span>
          )}
          <span className="user-status text-capitalize fw-bold">
            {userData?.role}
          </span>
        </div>
        <Avatar
          img={userData?.avatar ? BASE_PATH + userData.avatar : defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/settings">
          <Settings size={14} className="me-75" />
          <span className="align-middle">Paramètres</span>
        </DropdownItem>
        <DropdownItem onClick={logOut}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Se Déconnecter</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;

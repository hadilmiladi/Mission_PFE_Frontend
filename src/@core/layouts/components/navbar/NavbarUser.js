// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";

const NavbarUser = () => {
  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;

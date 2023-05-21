// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
// ** util auth
/* import { getAuthedUserRole, isUserLoggedIn } from "./../utility/Auth"; */
// ** -----------------------------------------------------------
const VerticalLayout = (props) => {
  //
  /* const isAuthed = isUserLoggedIn();
  let filteredNavigation = [];
  if (isAuthed) {
    filteredNavigation = navigation.filter((item) => {
      return item.role === role;
    });
  } */
  // ** ==>
  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;

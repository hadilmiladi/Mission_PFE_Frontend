// ** React Imports
import { Outlet } from 'react-router-dom';

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout';
// ** Menu Items Array
import navigation from '@src/navigation/vertical';

// ** Auth
import { getAuthedUserRole } from '../utility/Auth';

// ** -----------------------------------------------------------
const VerticalLayout = (props) => {
  //
  const role = getAuthedUserRole();
  let filteredNavigation = [];
  if (role) {
    filteredNavigation = navigation.filter((item) => {
      return item.role === role;
    });
  }
  // ** ==>
  return (
    <Layout menuData={filteredNavigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;

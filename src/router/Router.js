// ** Router imports
import { lazy } from 'react';

// ** Router imports
import { useRoutes } from 'react-router-dom';

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout';
// ** Layouts
import BlankLayout from '@layouts/BlankLayout';

// ** Auth functions
import { getUserHomePageRoute } from '../utility/Auth';
// ** GetRoutes
import { getRoutes } from './routes';

// ** components
const Error = lazy(() => import("../views/Error"));
const Login = lazy(() => import("../views/Auth/Login"));
const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);

  const getHomeRoute = () => {
    console.log("route: ",getUserHomePageRoute)
    return getUserHomePageRoute()
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Login replace to={getHomeRoute()} />,
    },
   /*  {
      path: "/login",
      element: <Login />,
    }, */
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
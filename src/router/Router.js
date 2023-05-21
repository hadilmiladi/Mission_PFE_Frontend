// ** Router imports
import { lazy } from "react";

// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";

// ** GetRoutes
import { getRoutes } from "./routes";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Auth functions
/* import { getAuthedUserRole, getUserRoutePerRole } from "../utility/Auth"; */

// ** components
const Error = lazy(() => import("../views/Error"));
const Login = lazy(() => import("../views/Auth/Login"));
/* const Scans = lazy(() => import("../views/scans/index")); */
const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);

  const getHomeRoute = () => {
    /* const user = getAuthedUserRole();
    console.log("user: ", user);
    if (user) {
      return "/admin/dashboard";
    } else {
      return "/login";
    } */
    return "/";
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
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

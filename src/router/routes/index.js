// ** React Imports
import {
  Fragment,
  lazy,
} from 'react';

import { Navigate } from 'react-router-dom';

// ** Route Components
import PublicRoute from '@components/routes/PublicRoute';
// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper';
import HorizontalLayout from '@src/layouts/HorizontalLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
// ** Utils
import { isObjEmpty } from '@utils';

// ** layouts
const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};
// ** --------------------------------------------------------------------------
// ** Document title
const TemplateTitle = "";
// ** Default Route
const DefaultRoute = "/";
// ** Auth imports   ------------------------------------------------------------------------
const Login = lazy(() => import("../../views/Auth/Login"));
// ** admin imports ------------------------------------------------------------------------
// ** companies
const AdminCompanies = lazy(() =>
  import("../../views/admin/companies/Companies")
);
const AdminProfile = lazy(() =>
  import("../../views/admin/AdminProfile/index")
);
//** employees */
const AdminEmployees = lazy(() =>
  import("../../views/admin/employees/Employees")
);
const AdminViewEmployee = lazy(() =>
  import("../../views/admin/employees/ViewEmployee")
);
// ** ranks
const AdminRank = lazy(() =>
  import("../../views/admin/ranks/Ranks")
);
// ** invoices 
const AdminInvoices = lazy(()=>import("../../views/admin/factureMission/AdminInvoices"))
// ** invoice
const AdminInvoice = lazy(() =>
  import("../../views/admin/factureMission/preview/index")
);
const AdminMission = lazy(()=>import("../../views/admin/mission/Mission"))
/* const AdminSettings = lazy(()=>import("../../views/admin/settings/Settings")) */
// ** user settings
const EmployeeMission = lazy(()=>import("../../views/user/mission/EmployeeMission"))

// ** ceo mission
const MissionCeo = lazy(()=>import("../../views/ceo/missionCeo/CeoMission"))
// ** user settings
const CeoDashboard = lazy(()=>import("../../views/ceo/dashboard/CeoDashboard"))
// ** ceo passportvisa
const CeoSettings = lazy(()=>import("../../views/ceo/CeopassportVisa/Settings"))
// ** cliient imports ----------------------------------------------------------------------
const EmployeeSettings = lazy(()=>import("../../views/user/settings/Settings"))

const Invoice=lazy(()=>import("../../views/admin/factureMission/invoices"))
// ** Catching imports ----------------------------------------------------------------------
const Error = lazy(() => import("../../views/Error"));

// ** --------------------------------------------------------------------------
// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  // ** client auth routes ----------------------------------------------------------------
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  // ** adminS routes -------------------------------------------------------
  {
    path: "/admin/clients",
    element: <AdminCompanies />,
  },
  {
    path: "/admin/ranks",
    element: <AdminRank />,
  },
  {
    path: "/admin/employees",
    element: <AdminEmployees />,
  },
  {
    path: "/admin/employees/:id",
    element: <AdminViewEmployee />,
  },
  {
    path:"/admin/invoice",
    element:<AdminInvoices />
  },
  {
    path:"/admin/miniinvoice/:id",
    element:<Invoice />
  },
  {
    path: "/admin/invoices/:id",
    element: <AdminInvoice />,
  },
  {
    path:"/admin/missions",
    element:<AdminMission />
  }, 
  {
    path:"/admin/profile",
    element:<AdminProfile />
  },
  /* {
    path: "/admin/settings",
    element: <AdminSettings />,
  }, */
  // ** user settings routes -------------------------------------------------------
  {
    path:"/employee/missions",
    element:<EmployeeMission />
  },
  {
    path: "/employee/settings",
    element: <EmployeeSettings />,
  },
  // ** ceo settings routes -------------------------------------------------------
  {
    path: "/ceo/dashboard",
    element: <CeoDashboard />,
  },
  {
    path: "/ceo/missionCeo",
    element: <MissionCeo />,
  },
  {
    path: "/ceo/settings",
    element: <CeoSettings />,
  },
  /* {
    path: "/ceo/employees",
    element: <AdminEmployees />,
  }, */
  /* {
    path: "/ceo/mission",
    element: <AdminMission />,
  }, */
  // ** Catching errors ------------------------------------------------------------
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, getRoutes, Routes, TemplateTitle };

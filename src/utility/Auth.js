// ** check if the user is authed or not
export const isUserLoggedIn = () => {
  const test =
    localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN) &&
    localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
  if (test === false) {
    /* cleanUserLocalStorage(); */
  }
  return test;
};

// ** clean user storage
export const cleanUserLocalStorage = () => {
  localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
  localStorage.removeItem(process.env.REACT_APP_ROLE_DATA);
};

// ** get the redirect user path
export const getUserHomePageRoute = () => {
  const user = localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
  if (user === null) {
    return "/";
  }
  const parsedUser = JSON.parse(user);
  if (!parsedUser?.role) {
    return undefined;
  }
  switch (String(parsedUser?.role)) {
    case "admin":
      return "/admin/dashboard";
    case "client":
      return "/dashboard";
    default:
      return "/";
  }
};

// ** get home route per role
export const getUserRoutePerRole = (role) => {
  switch (String(role)) {
    case "admin":
      return "/back/dashboard";
    case "client":
      return "/dashboard";
    default:
      return "/";
  }
};

// ** get user auth data
export const getAuthedUserRole = () => {
  const user = localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
  if (user) {
    return JSON.parse(user);
  }
  return user;
};

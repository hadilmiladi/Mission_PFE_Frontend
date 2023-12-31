// ** check if the user is authed or not
export const isUserLoggedIn = () => {
  const test =
    localStorage.getItem("access_token") &&
    localStorage.getItem('access_role');
  return test;
};

// ** clean user storage
export const cleanUserLocalStorage = () => {
 /* localStorage.removeItem("access_token")
 localStorage.removeItem('access_role') */
 localStorage.clear()

};

// ** get the redirect user path
export const getUserHomePageRoute = () => {
  const user = localStorage.getItem('access_role')
  console.log("user: ",user)
  if(user===null){
    return "/"
  }
  if(user==="admin"){
    return "/admin/missions"
  }
  if(user==="employee"){
    return "/employee/missions"
  }
  if(user==="ceo"){
    return "/ceo/dashboard"
  }
  if(user==="chef du projet"){
    return "/chef/accueil"
  }
};

// ** get home route per role
export const getUserRoutePerRole = (role) => {
  switch (String(role)) {
    case "admin":
      return "/admin/acceuil";
    case "employee":
      return "/employee/missions";
    case "ceo":
      return "/ceo/dashboard";
    case "chef du projet":
      return "/chef/accueil";
  }
};

// ** get user auth data
export const getAuthedUserRole = () => {
  return localStorage.getItem('access_role')
};

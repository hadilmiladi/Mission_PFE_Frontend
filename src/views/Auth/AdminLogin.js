// ** React imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import Avatar from "./../../@core/components/avatar/index";
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Spinner,
  FormFeedback,
  Alert,
} from "reactstrap";
// ** icons
import { Coffee, X } from "react-feather";
// ** packages
import toast from "react-hot-toast";
// ** Api config
import axios from "./../../service/axios";
// ** util auth functions
import {
  getUserRoutePerRole,
  isUserLoggedIn,
  cleanUserLocalStorage,
  getUserHomePageRoute,
} from "../../utility/Auth";
// ** util messages functions
import { serverErrorMessage, requiredField } from "../../utility/messages";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
// ** --------------------------------------------------------------
function AdminLogin() {
  // ** router
  const navigate = useNavigate();
  // ** check if already authed
  /* useEffect(() => {
    const isLogged = isUserLoggedIn();
    const checkRole = getUserHomePageRoute();
    if (!checkRole) {
      cleanUserLocalStorage();
    }
    if (isLogged && checkRole) {
      navigate(getUserHomePageRoute());
    }
  }, [navigate]); */
  // ** toast component
  const ToastContent = ({ t, name, role }) => {
    return (
      <div className="d-flex">
        <div className="me-1">
          <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <h6 className="text-capitalize">{name}</h6>
            <X
              size={12}
              className="cursor-pointer"
              onClick={() => toast.dismiss(t.id)}
            />
          </div>
          <span className="text-capitalize">
            You have successfully logged in as {role}. Now you can start
            exploring. Enjoy!
          </span>
        </div>
      </div>
    );
  };
  // ** initial state
  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({ ...initialValues });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  // ** on Changes
  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeRememberMe = (event) => {
    setUser((prev) => ({ ...prev, remember: event.target.checked }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setShowAlert(false);
    setAlertMessage("");
    const inputErrors = validate(user);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.post("back/signin", user);
      if (res?.status === 200) {
        const token = res?.data?.token;
        const user = res?.data?.item;
        // save tokens
        localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN, token);
        localStorage.setItem(
          process.env.REACT_APP_ROLE_DATA,
          JSON.stringify(user)
        );
        // navigate depending on role
        const homeRoute = getUserRoutePerRole(user.role);
        navigate(homeRoute);
        // Display toast
        toast((t) => (
          <ToastContent
            t={t}
            role={user?.role}
            name={res?.data?.item?.responsableName}
          />
        ));
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409 || status === 401) {
        setShowAlert(true);
        setAlertMessage("Wrong credentials");
      }
      if (status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
      // errors
    }
    setSpinning(false);
  };
  // ** validate
  const validate = (values) => {
    const errors = {};
    // exist
    if (values.email === "") {
      errors.email = requiredField;
    }
    // exist
    if (values.password === "") {
      errors.password = requiredField;
    }
    return errors;
  };
  // ** ==>
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link className="brand-logo" to="/">
              <h4 className="brand-text text-primary ms-1 text-uppercase">
                Logo
              </h4>
            </Link>
            <Form className="auth-login-form mt-2 mb-1" onSubmit={onSubmit}>
              <div className="mb-1">
                <Label className="form-label" for="email">
                  E-mail: <span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="example: johnk@example.com"
                  name="email"
                  value={user.email}
                  onChange={onChange}
                  invalid={errors.email && true}
                  autoFocus
                  required
                />
                {errors.email && (
                  <FormFeedback className="d-block">
                    {errors.email}
                  </FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password: <span className="text-danger">*</span>
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={onChange}
                  invalid={errors.password && true}
                  required
                />
                {errors.password && (
                  <FormFeedback className="d-block">
                    {errors.password}
                  </FormFeedback>
                )}
              </div>
              {showAlert && (
                <Alert color="danger">
                  <div className="alert-body text-center">
                    {showAlert && alertMessage}
                  </div>
                </Alert>
              )}
              <div className="form-check mb-1">
                <Input
                  type="checkbox"
                  name="remember"
                  defaultValue={true}
                  onChange={onChangeRememberMe}
                  id="remember"
                />
                <Label className="form-check-label" for="remember">
                  Remember me
                </Label>
              </div>
              <Button color="primary" type="submit" block>
                {!spinning ? "Sign in" : <Spinner size="sm" />}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminLogin;

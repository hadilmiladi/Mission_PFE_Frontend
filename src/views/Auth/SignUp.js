// ** React Imports
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
// ** toast
import toast from "react-hot-toast";
// ** util auth functions
import {
  getUserRoutePerRole,
  isUserLoggedIn,
  cleanUserLocalStorage,
  getUserHomePageRoute,
} from "../../utility/Auth";
// ** utils
import { requiredField, serverErrorMessage } from "../../utility/messages";
// ** api config
import axios from "../../service/axios";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
// ** ----------------------------------------------------------------
function SignUp() {
  // ** router
  const navigate = useNavigate();
  // ** initial state
  const initialUser = {
    CompanyName: "",
    ResponsableName: "",
    Email: "",
    Tel: "",
  };
  // ** states
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({ ...initialUser });
  const [success, setSuccess] = useState(false);
  // ** check if already authed
  useEffect(() => {
    const isLogged = isUserLoggedIn();
    const checkRole = getUserHomePageRoute();
    if (!checkRole) {
      cleanUserLocalStorage();
    }
    if (isLogged && checkRole) {
      navigate(getUserHomePageRoute());
    }
  }, [navigate]);
  // ** on Changes
  const onChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSuccess(false);
    const inputErrors = validate(user);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    try {
      const res = await axios.post("auth/signup", user);
      if (res?.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      // ** email already used
      if (
        error?.response?.status === 409 &&
        error?.response?.data?.code === 1
      ) {
        setErrors({
          Email: "This email is already used!",
        });
      }
      // ** phone number already used
      else if (
        error.response?.status === 409 &&
        error?.response?.data?.code === 2
      ) {
        setErrors({
          Tel: "This phone number is already used!",
        });
      }
      // ** server error
      else if (errors.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
    setSpinning(false);
  };
  // ** validate form
  const validate = (values) => {
    const errors = {};
    // exist
    if (values.CompanyName === "") {
      errors.CompanyName = requiredField;
    }
    // exist
    if (values.ResponsableName === "") {
      errors.ResponsableName = requiredField;
    }
    // exist
    if (values.Email === "") {
      errors.Email = requiredField;
    }
    // exist
    if (values.Tel === "") {
      errors.Tel = requiredField;
    }
    // invalid format
    else if (!values.Tel.match("[0-9]{10}")) {
      errors.Tel = "this is not a valid phone number format!";
    }
    return errors;
  };
  // ** ==>
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              {/*  <svg viewBox="0 0 139 95" version="1.1" height="28">
                <defs>
                  <linearGradient
                    x1="100%"
                    y1="10.5120544%"
                    x2="50%"
                    y2="89.4879456%"
                    id="linearGradient-1"
                  >
                    <stop stopColor="#000000" offset="0%"></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient
                    x1="64.0437835%"
                    y1="46.3276743%"
                    x2="37.373316%"
                    y2="100%"
                    id="linearGradient-2"
                  >
                    <stop
                      stopColor="#EEEEEE"
                      stopOpacity="0"
                      offset="0%"
                    ></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Artboard"
                    transform="translate(-400.000000, -178.000000)"
                  >
                    <g id="Group" transform="translate(400.000000, 178.000000)">
                      <path
                        d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                        id="Path"
                        className="text-primary"
                        style={{ fill: "currentColor" }}
                      ></path>
                      <path
                        d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                        id="Path"
                        fill="url(#linearGradient-1)"
                        opacity="0.2"
                      ></path>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.049999997"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                      ></polygon>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.099999994"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                      ></polygon>
                      <polygon
                        id="Path-3"
                        fill="url(#linearGradient-2)"
                        opacity="0.099999994"
                        points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg> */}
              <h2 className="brand-text text-primary ms-1">Logo</h2>
            </Link>
            <CardTitle tag="h4" className="mb-1">
              Adventure starts here 🚀
            </CardTitle>
            <CardText className="mb-2">
              Make your orders management easier!
            </CardText>
            <Form className="auth-register-form mt-2" onSubmit={onSubmit}>
              <div className="mb-1">
                <Label className="form-label" for="CompanyName">
                  Company name
                </Label>
                <Input
                  id="CompanyName"
                  type="text"
                  name="CompanyName"
                  onChange={onChange}
                  value={user.CompanyName}
                  invalid={errors.CompanyName && true}
                  placeholder="johndoe"
                  disabled={success}
                  required
                  autoFocus
                />
                {errors.CompanyName && (
                  <FormFeedback className="d-block">
                    {errors.CompanyName}
                  </FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="ResponsableName">
                  Responsable name
                </Label>
                <Input
                  id="ResponsableName"
                  type="text"
                  name="ResponsableName"
                  onChange={onChange}
                  value={user.ResponsableName}
                  invalid={errors.ResponsableName && true}
                  placeholder="johndoe"
                  disabled={success}
                  required
                />
                {errors.ResponsableName && (
                  <FormFeedback className="d-block">
                    {errors.ResponsableName}
                  </FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="Email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="Email"
                  name="Email"
                  value={user.Email}
                  onChange={onChange}
                  invalid={errors.Email && true}
                  placeholder="john@example.com"
                  disabled={success}
                  required
                />
                {errors.Email && (
                  <FormFeedback className="d-block">
                    {errors.Email}
                  </FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <Label className="form-label" for="Tel">
                  Phone number
                </Label>
                <Input
                  type="text"
                  id="Tel"
                  name="Tel"
                  value={user.Tel}
                  onChange={onChange}
                  invalid={errors.Tel && true}
                  placeholder="+## ## ### ###"
                  required
                  disabled={success}
                />
                {errors.Tel && (
                  <FormFeedback className="d-block">{errors.Tel}</FormFeedback>
                )}
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="terms" />
                <Label className="form-check-label" for="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              {success && (
                <Alert color="success">
                  <div className="alert-body text-center">
                    An email was sent successfully, Please check your email for
                    further instructions
                  </div>
                </Alert>
              )}
              <Button color="primary" block disabled={success}>
                {!spinning ? (
                  "Sign up"
                ) : (
                  <>
                    <Spinner size="sm" />
                    <span className="ms-50">Loading...</span>
                  </>
                )}
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;

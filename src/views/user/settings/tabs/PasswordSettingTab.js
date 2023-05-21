// ** React Imports
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Spinner,
} from "reactstrap";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
// ** toast
import toast from "react-hot-toast";
// ** api config
import axios from "../../../../service/axios";
// ** -----------------------------------------------------------------------
function PasswordSettingTab() {
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
  // ** router
  const navigate = useNavigate();
  // ** initial state
  const defaultPasswordState = {
    newPassword: "",
    oldPassword: "",
    confirmNewPassword: "",
  };
  // ** states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({ ...defaultPasswordState });
  // ** onChange
  const onChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  // ** onSubmit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(passwords);
    if (Object.keys(inputErrors).length > 0) {
      setErrors((prev) => ({ ...inputErrors }));
    }
    setLoading(true);
    if (Object.keys(inputErrors).length === 0) {
      try {
        const res = await axios.put("user/update/password", passwords, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 202) {
          toast.success(`Your password was updated successfully`, {
            duration: 5000,
          });
        }
      } catch (error) {
        // failed to create for some reason
        if (error?.response?.status === 400) {
          toast.error(
            "Ops! Something is missing, Please refresh the page and try again",
            {
              duration: 5000,
            }
          );
        }
        // not token
        else if (error?.response?.status === 401) {
          cleanUserStorage();
          navigate("/login");
          toast.error("Session expired, Please login again", {
            duration: 5000,
          });
        }
        // token invalide
        else if (error?.response?.status === 403) {
          cleanUserStorage();
          navigate("/login");
          toast.error("Session expired, Please login again", {
            duration: 5000,
          });
        }
        // this email already exist
        else if (error?.response?.status === 409) {
          setErrors((prev) => ({
            oldPassword: "Password provided is incorrect",
          }));
        }
        // server error
        else if (error?.response?.status === 500) {
          toast.error(
            "Ops! Server Error, Please contact the costumer service",
            {
              duration: 5000,
            }
          );
        }
      }
    }
    setLoading(false);
  };
  // ** validate
  const validate = (values) => {
    const errors = {};
    const requiredField = "This field is required!";
    const lengthField = "Password must be at least 8 caracters";
    // exist
    if (values.newPassword === "") {
      errors.newPassword = requiredField;
    }
    // length
    else if (values.newPassword.length < 8) {
      errors.newPassword = lengthField;
    }
    // exist
    if (values.oldPassword === "") {
      errors.oldPassword = requiredField;
    }
    // length
    else if (values.oldPassword.length < 8) {
      errors.oldPassword = lengthField;
    }
    // exist
    if (values.confirmNewPassword === "") {
      errors.confirmNewPassword = requiredField;
    }
    // length
    else if (values.confirmNewPassword.length < 8) {
      errors.confirmNewPassword = lengthField;
    }
    // 2 passwords match
    if (
      values.confirmNewPassword &&
      values.newPassword &&
      values.newPassword !== values.confirmNewPassword
    ) {
      errors.newPassword = "2 passwords don't match";
      errors.confirmNewPassword = "2 passwords don't match";
    }
    return errors;
  };
  // ** reset form
  const onCancel = () => {
    setPasswords({ ...defaultPasswordState });
    setErrors({});
    setLoading(false);
  };
  // ** ==>
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Change Password</CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Form onSubmit={onSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  id="oldPassword"
                  name="oldPassword"
                  value={passwords?.oldPassword}
                  onChange={onChange}
                  label="Current Password"
                  htmlFor="oldPassword"
                  className="input-group-merge"
                  invalid={errors.oldPassword && true}
                  required
                  autoFocus
                />
                {errors.oldPassword && (
                  <FormFeedback className="d-block">
                    {errors.oldPassword}
                  </FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  htmlFor="newPassword"
                  className="input-group-merge"
                  invalid={errors.newPassword && true}
                  value={passwords?.newPassword}
                  onChange={onChange}
                  required
                />
                {errors.newPassword && (
                  <FormFeedback className="d-block">
                    {errors.newPassword}
                  </FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  label="Retype New Password"
                  htmlFor="confirmNewPassword"
                  className="input-group-merge"
                  invalid={errors.newPassword && true}
                  value={passwords?.confirmNewPassword}
                  onChange={onChange}
                  required
                />
                {errors.confirmNewPassword && (
                  <FormFeedback className="d-block">
                    {errors.confirmNewPassword}
                  </FormFeedback>
                )}
              </Col>
              <Col className="mt-1" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {!loading ? (
                    "Save changes"
                  ) : (
                    <>
                      <Spinner size="sm" />
                      <span className="ms-50">Loading...</span>
                    </>
                  )}
                </Button>
                <Button
                  color="secondary"
                  type="button"
                  onClick={onCancel}
                  outline
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default PasswordSettingTab;

// ** react imports
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Spinner,
} from "reactstrap";
// ** toast
import toast from "react-hot-toast";
// ** utils

// ** api config
import axios, { BASE_PATH } from "../../../../service/axios";
// ** -------------------------------------------------------------------------------
function ProfileSettingTab({ user, active }) {
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
  // ** router
  const navigate = useNavigate();
  // ** initial state
  const defaultBlankAvatar =
    require("@src/assets/images/avatars/avatar-blank.png").default;
  const initialUser = {
    CompanyName: "",
    ResponsableName: "",
    Email: "",
    Tel: "",
  };
  const initialAvatar = {
    row: null,
    sent: null,
  };
  // ** states
  const [avatar, setAvatar] = useState({ ...initialAvatar });
  const [profile, setProfile] = useState({ ...initialUser });
  const [errors, setErrors] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [disableUpload, setDisableUpload] = useState(false);
  const [spinning, setSpinning] = useState(false);
  // ** fetching data
  useEffect(() => {
    if (user !== null && active === "profile") {
      setProfile((prev) => ({ ...prev, ...user }));
      if (user?.avatar) {
        setAvatar((prev) => ({ ...prev, row: BASE_PATH + user?.avatar }));
      }
    }
  }, [user, active]);
  // ** onChange
  const onChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const onChangeAvatar = (event) => {
    const { files } = event.target;
    const reader = new FileReader();
    reader.onload = function () {
      setAvatar((prev) => ({ ...prev, row: reader.result }));
    };
    reader.readAsDataURL(files[0]);
    setAvatar((prev) => ({ ...prev, sent: files[0] }));
  };
  // ** on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const inputErrors = validate(profile);
    if (Object.keys(inputErrors).length > 0) {
      setErrors({ ...inputErrors });
    }
    setSpinning(true);
    if (Object.keys(inputErrors).length === 0) {
      try {
        const res = await axios.put("user/update/profile", profile, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 202) {
          toast.success(`Your profile was updated successfully`, {
            duration: 5000,
          });
          let userData = localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
          userData = JSON.parse(userData);
          userData.ResponsableName = profile?.ResponsableName;
          localStorage.setItem(
            process.env.REACT_APP_ROLE_DATA,
            JSON.stringify(userData)
          );
          window.location.reload();
        }
      } catch (error) {
        console.log("err: ", error);
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
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "email"
        ) {
          setErrors((prev) => ({
            email: "This email is already used, Please choose an other one",
          }));
        }
        // this email already exist
        else if (
          error?.response?.status === 409 &&
          error?.response?.data?.code === "phoneNumber"
        ) {
          setErrors((prev) => ({
            phoneNumber:
              "This phone number is already used, Please choose an other one",
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
    setSpinning(false);
  };
  // ** on submit new icon
  const onSubmitAvatar = async (event) => {
    event.preventDefault();
    setUploadErrors({});
    const errors = {};
    if (avatar.sent === null) {
      errors.avatar = "Please upload first!";
    }
    if (Object.keys(errors).length > 0) {
      setUploadErrors({ ...errors });
    }
    if (Object.keys(errors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("avatar", avatar.sent);
        const res = await axios.put("user/update/avatar", formData, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        });
        if (res?.status === 202) {
          toast.success(`Your profile picture was updated successfully`, {
            duration: 5000,
          });
          let userData = localStorage.getItem(process.env.REACT_APP_ROLE_DATA);
          userData = JSON.parse(userData);
          userData.avatar = res?.data?.avatar;
          localStorage.setItem(
            process.env.REACT_APP_ROLE_DATA,
            JSON.stringify(userData)
          );
          window.location.reload();
          setDisableUpload(true);
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
  };
  // ** validate form
  const validate = (values) => {
    const errors = {};
    const alertText = "this field is required and can't be left empty";
    if (values.CompanyName === "") {
      errors.CompanyName = alertText;
    }
    if (values.ResponsableName === "") {
      errors.ResponsableName = alertText;
    }
    if (values.Email === "") {
      errors.Email = alertText;
    }
    if (values.Tel === "") {
      errors.Tel = alertText;
    }
    return errors;
  };
  // ** reset img
  const handleImgReset = () => {
    if (profile?.avatar) {
      setAvatar((prev) => ({ ...prev, sent: null, row: profile?.avatar }));
    } else {
      setAvatar((prev) => ({ ...prev, sent: null, row: defaultBlankAvatar }));
    }
  };
  // ** reset form
  const onDiscard = () => {
    setProfile({ ...initialAvatar });
    setErrors({});
    setSpinning(false);
  };
  // ** ==>
  return (
    <>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Edit your profile</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Row tag={Form} onSubmit={onSubmitAvatar}>
            <Col sm="6" className="mb-1">
              <div className="d-flex">
                <div className="me-25">
                  <img
                    className="rounded me-50"
                    src={avatar.row === null ? defaultBlankAvatar : avatar.row}
                    alt="Generic placeholder image"
                    height="100"
                    width="100"
                    type="submit"
                  />
                </div>
                <div className="d-flex align-items-end mt-75 gap-1">
                  <div>
                    <Button
                      color="success"
                      size="sm"
                      className="mb-75 me-75"
                      disabled={avatar.sent === null || disableUpload}
                    >
                      Upload
                    </Button>
                    <Button
                      tag={Label}
                      className="mb-75 me-75"
                      size="sm"
                      color="primary"
                    >
                      Select
                      <Input
                        type="file"
                        name="avatar"
                        onChange={onChangeAvatar}
                        hidden
                        accept="image/*"
                      />
                    </Button>
                    <Button
                      className="mb-75"
                      color="danger"
                      size="sm"
                      outline
                      onClick={handleImgReset}
                      disabled={disableUpload}
                    >
                      Reset
                    </Button>
                    {uploadErrors.avatar && (
                      <FormFeedback className="d-block text-capitalize fw-bold">
                        {uploadErrors.avatar}
                      </FormFeedback>
                    )}
                    <p className="mb-0">Upload your profile picture</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Form className="mt-2 pt-50" onSubmit={onSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="CompanyName">
                  Company Name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="CompanyName"
                  type="text"
                  name="CompanyName"
                  placeholder="Alex ..."
                  value={profile.CompanyName}
                  onChange={onChange}
                  invalid={errors.CompanyName && true}
                  autoFocus
                  required
                />
                {errors.CompanyName && (
                  <FormFeedback className="d-block fw-bold">
                    {errors.CompanyName}
                  </FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="ResponsableName">
                  Responsable Name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="ResponsableName"
                  type="text"
                  name="ResponsableName"
                  placeholder="Scirocco ..."
                  value={profile.ResponsableName}
                  onChange={onChange}
                  invalid={errors.ResponsableName && true}
                  required
                />
                {errors.ResponsableName && (
                  <FormFeedback className="d-block fw-bold">
                    {errors.ResponsableName}
                  </FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Email">
                  E-mail <span className="text-danger">*</span>
                </Label>
                <Input
                  id="Email"
                  type="email"
                  name="Email"
                  placeholder="iskander.dakkem@esprit.tn"
                  value={profile.Email}
                  onChange={onChange}
                  invalid={errors.Email && true}
                  required
                />
                {errors.Email && (
                  <FormFeedback className="d-block fw-bold">
                    {errors.Email}
                  </FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Tel">
                  Phone Number <span className="text-danger">*</span>
                </Label>
                <Input
                  id="Tel"
                  type="text"
                  name="Tel"
                  placeholder="+(216) ## ### ###"
                  value={profile.Tel}
                  onChange={onChange}
                  invalid={errors.Tel && true}
                  required
                />
                {errors.Tel && (
                  <FormFeedback className="d-block fw-bold">
                    {errors.Tel}
                  </FormFeedback>
                )}
              </Col>

              <Col className="mt-2 mb-1" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {!spinning ? (
                    "Save changes"
                  ) : (
                    <>
                      <Spinner size="sm" />
                      <span className="ms-50">Loading...</span>
                    </>
                  )}
                </Button>
                <Button
                  color="danger"
                  type="button"
                  onClick={onDiscard}
                  outline
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

export default ProfileSettingTab;

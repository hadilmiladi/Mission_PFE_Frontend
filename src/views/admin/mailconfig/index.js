// ** React Imports
import { useState } from 'react';

// ** toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  ModalBody,
  Row,
  Spinner,
} from 'reactstrap';

// ** api config
import axios from '../../../service/axios';
// ** utily messages
import {
  badRequestMessage,
  serverErrorMessage,
} from '../../../utility/messages';

// ** --------------------------------------------------------------------------
  function CreateConfig(props) {
      // ** props
      const { visibility, closeModal, refresh } = props;
      // ** router
      const navigate = useNavigate();
     // ** access token
    const accesToken = localStorage.getItem(
      "access_token"
    );
       // ** initial rank
    const initialConfigmail = {
      name: "",
      permission: "",
      perdiem: "",
      typeofmail:""
    };
     // ** states
     const [spinning, setSpinning] = useState(false);
     const [errors, setErrors] = useState({});
     const [config, setConfig] = useState({ ...initialConfigmail });
     
     
     // ** on change
     const onChange = (event) => {
      const { name, value } = event.target;
      setConfig((prev) => ({ ...prev, [name]: value }));
    };

    // ** on submit
    const onSubmit = async (event) => {
      event.preventDefault();
      setErrors({});
      /* const inputErrors = validate(config);
      if (Object.keys(inputErrors).length > 0) {
        setErrors({ ...inputErrors });
      } */
      setSpinning(true);
      try {
          const res = await axios.post("mailing/createConfigmail", config, {
            headers: {
              authorization: `Bearer ${accesToken}`,
            },
          });
          if (res?.status === 201 || res?.status === 202) {
              toast.success("saved");
              /* refresh();
              closeModal(); */
            }
          } catch (error) {
              // failed to create for some reason
              if (error?.response?.status === 400) {
                toast.error(badRequestMessage, {
                  duration: 5000,
                });
              }
         // server error
         else if (error?.response?.status === 500) {
          toast.error(serverErrorMessage, {
            duration: 5000,
          });
        }
      }
      setSpinning(false);
    };
     // ** validate form
    /*  const validate = (values) => {
      const errors = {};
      if (values.from === "") {
        errors.from = requiredField;
      }
      if (values.subject === "") {
          errors.subject = requiredField;
        }
        if (values.body === "") {
          errors.body = requiredField;
        }
        if (values.configname === "") {
            errors.configname = requiredField;
          }
        return errors;
    }; */
    //console.log(permission)
    // ** reset form on close
  /*   const resetForm = () => {
      setSpinning(false);
      setErrors({});
      setConfig({ ...initialConfigmail });
    }; */
     // ** ==>
     return (
     
         <ModalBody className="px-sm-2 pb-2">
          <div className="text-center mb-1">
            
            <p>Please fill all the required informations.</p>
          </div>
          <Row tag="form" className="gy-1 pt-75" onSubmit={onSubmit}>
          <Col  md={12} xs={12}>
  <Label className="form-label text-capitalize" for="typeofmail">
    select {": "} <span className="text-danger">*</span>
  </Label>
  <Input
    type="select"
    name="typeofmail" 
    value={config.typeofmail}
    onChange={onChange}
    id="typeofmail"
    placeholder="Select Mail Type"
    required
    
  >
    <option value="">Select</option>
    <option value="outlook">Outlook</option>
    <option value="gmail">Gmail</option>
  </Input>
</Col>
              {console.log("sssssss",config.typeofmail)}
            <Col md={6} xs={12}>
              <Label className="form-label text-capitalize" for="from">
                email{": "} <span className="text-danger">*</span>
              </Label>
              <Input
                id="from"
                type="email"
                name="from"
                value={config.from}
                onChange={onChange}
                invalid={true && errors.from}
                placeholder="Example: ESB ..."
                required
              />
               {errors.from && (
                <FormFeedback className="d-block text-capitalize fw-bold">
                  {errors.from}
                </FormFeedback>
              )}
            </Col>

            <Col md={6} xs={12}>
              <Label className="form-label text-capitalize" for="password">
                password{": "} <span className="text-danger">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={config.password}
                onChange={onChange}
                invalid={true && errors.password}
                placeholder="Example: ESB ..."
                required
              />
               {errors.password && (
                <FormFeedback className="d-block text-capitalize fw-bold">
                  {errors.password}
                </FormFeedback>
              )}
            </Col>
            <Col md={12} xs={12}>
            
    <Label className="form-label text-capitalize" for="subject">
      subject {": "} <span className="text-danger">*</span>
    </Label>
    <Input
      id="subject"
      type="text"
      name="subject"
      value={config.subject}
      onChange={onChange}
      invalid={!!errors.subject} // Updated to use boolean conversion
      placeholder="Example: ESB ..."
      required
    >
    </Input>
    {errors.subject && (
      <FormFeedback className="d-block text-capitalize fw-bold">
        {errors.subject}
      </FormFeedback>
    )}
  </Col>
  
  
        
            
            <Col xs={12} className="text-center mt-0 pt-50 mb-1 mt-2">
              <Button type="submit" className="me-1" color="primary">
                {!spinning ? (
                  "Create"
                ) : (
                  <>
                    <Spinner size="sm" />
                    <span className="ms-50">Loading...</span>
                  </>
                )}
              </Button>
              
            </Col>
          </Row>
        </ModalBody>
     
    );
  }
  
  export default CreateConfig;
  
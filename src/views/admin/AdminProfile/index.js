import React, {
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import {
  Button,
  Col,
  Input,
  Label,
  Row,
} from 'reactstrap';

import axios from '../../../service/axios';
import { badRequestMessage } from '../../../utility/messages';

const AccountTabs = (/* props */) => {
 /*  const { visibility, closeModal, refresh } = props; */
  // Access token
  const accessToken = localStorage.getItem('access_token');
  const token = localStorage.getItem('access_token');
  console.log('token', token);
  const decodedToken = jwt_decode(token);
  const id = decodedToken.id;

  console.log('id :', id);

  const [admin, setAdmin] = useState({
    firstname: '',
    lastname: '',
    registration: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`employee/one/${id}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.status === 200) {
        setAdmin({ ...res?.data?.item });
        console.log(res);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSpinning(true);
    try {
      const res = await axios.put(`employee/update/${id}`, admin, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.status === 202) {
        toast.success(
          `${admin?.firstname?.toUpperCase()} was updated successfully`
        );
        /* refresh(); */
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(badRequestMessage, {
        duration: 5000,
      });
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Row tag="form" className="gy-1 pt-75" onSubmit={handleFormSubmit}>
        <Col md={6} xs={12}>
          <Label className="form-label text-capitalize" for="firstname">
            First Name<span className="text-danger">*</span>
          </Label>
          <Input
            id="firstname"
            type="text"
            name="firstname"
            value={admin.firstname}
            onChange={handleInputChange}
            placeholder="Example: ESB ..."
          />
        </Col>
        <Col md={6} xs={12}>
          <Label className="form-label text-capitalize" for="lastname">
            Last Name<span className="text-danger">*</span>
          </Label>
          <Input
            id="lastname"
            type="text"
            name="lastname"
            value={admin.lastname}
            onChange={handleInputChange}
            placeholder="Example: ESB ..."
          />
        </Col>
        <Col md={6} xs={12}>
          <Label className="form-label text-capitalize" for="email">
            Email<span className="text-danger">*</span>
          </Label>
          <Input
            id="email"
            type="text"
            name="email"
            value={admin.email}
            onChange={handleInputChange}
            placeholder="Example: ESB ..."
          />
        </Col>
        <Col md={12} className="mt-3">
          <Button type="submit" color="primary" disabled={spinning}>
            {spinning ? 'Updating...' : 'Update'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AccountTabs;

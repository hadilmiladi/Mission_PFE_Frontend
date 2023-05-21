import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ** Toast
import toast from "react-hot-toast";
// ** Reactstrap Imports
import { Badge, Card, Col, Form, Input, Row, Table } from "reactstrap";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
// ** sections
import AddCompanySection from "../companies/section/AddCompanySection";
import CompaniesCountDashboard from "../companies/section/CompaniesCountDashboard";
// ** modals
import CreateEmployeeModal from "./modals/CreateEmployeeModal";
// ** utils
import { cleanUserLocalStorage } from "../../../utility/Auth";
import { serverErrorMessage, sessionExpired } from "../../../utility/messages";
import { paginationOptions } from "../../../utility/Static";
// ** api config
import axios from "../../../service/axios";
// ** -----------------------------------------------------------------------
function Employees() {
  // ** router
  const navigate = useNavigate();
  // ** access token
  const accesToken = localStorage.getItem(
    `${process.env.REACT_APP_ACCESS_TOKEN}`
  );
  // ** initial state
  const initialQueries = {
    p: 1,
    l: 10,
    sortBy: "default",
    select: "all",
  };
  // ** states
  const [employees, setEmployees] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  // modals
  const [showCreateEmployeesModal, setShowCreateEmployeesModal] =
    useState(false);

  // ** fetching data
  useEffect(() => {
    fetchEmplyees();
  }, []);
  // ** fetch function
  const fetchEmplyees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("employee/all", {
        /* params: {
          page: queries.p,
          limit: queries.l,
        },
        headers: {
          authorization: `Bearer ${accesToken}`,
        }, */
      });
      if (res?.status === 200) {
        setEmployees([...res?.data?.items]);
        setSize(res?.data?.size);
      }
    } catch (error) {
      // not token
      if (error?.response?.status === 401) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      // expired
      else if (error?.response?.status === 403) {
        cleanUserLocalStorage();
        navigate("/login");
        toast.error(sessionExpired, {
          duration: 5000,
        });
      }
      //  server error
      else if (error?.response?.status === 500) {
        toast.error(serverErrorMessage, {
          duration: 5000,
        });
      }
    }
    setLoading(false);
  };
  // ** Pagination
  const pagination = [];
  for (let i = 0; i < size / queries.l; i++) {
    pagination.push(i);
  }
  // ** pagination config
  const prevPagination = () => {
    if (queries.p > 0) {
      setQueries((prev) => ({ ...prev, p: queries.p - 1 }));
    }
  };
  // ** next
  const nextPagination = () => {
    const condition = queries.p == (size / queries.l).toFixed(0);
    if (!condition) {
      setQueries((prev) => ({ ...prev, p: queries.p + 1 }));
    }
  };
  // ** select
  const selectPagination = (index) => {
    setQueries((prev) => ({ ...prev, p: index }));
  };
  // ** ==>
  return (
    <>
      <Breadcrumbs
        title="Employees management"
        data={[{ title: "Employees" }]}
      />
      <CompaniesCountDashboard size={size} />
      <AddCompanySection
        refresh={fetchEmplyees}
        openModal={() => setShowCreateEmployeesModal(true)}
      />
      <Card>
        <div className="invoice-list-table-header w-100 py-2 px-2">
          <Row>
            <Col lg="8"></Col>
            <Col
              lg="4"
              className="d-flex align-items-center justify-content-lg-end px-0 px-lg-1"
            >
              {/* <Button
                className="btn-icon rounded-circle me-1"
                color="success"
                type="button"
                onClick={fetchCompanies}
              >
                <RefreshCcw size={15} />
              </Button> */}
              <Form className="d-flex align-items-center">
                <div className="d-flex align-items-center me-2">
                  <label htmlFor="rows-per-page">Show</label>
                  <Input
                    type="select"
                    id="rows-per-page"
                    className="form-control ms-50 pe-3"
                    /* onChange={onChangeQueries} */
                    name="l"
                  >
                    {paginationOptions.map((option, index) => {
                      return (
                        <option value={option} key={`option-${index}`}>
                          {option}
                        </option>
                      );
                    })}
                  </Input>
                </div>
                {/* <div className="d-flex align-items-center">
                  <Label htmlFor="rows-per-page">Sort</Label>
                  <Input
                    type="select"
                    id="rows-per-page"
                    className="form-control ms-50 pe-3"
                    onChange={onChangeQueries}
                    name="sortBy"
                  >
                    {sortingOptions.map((option, index) => {
                      return (
                        <option value={option.value} key={`option-${index}`}>
                          {option.name}
                        </option>
                      );
                    })}
                  </Input>
                </div> */}
              </Form>
              {/* <Button
                className="btn-icon rounded-circle me-1"
                color="danger"
                type="button"
                onClick={cancelQueries}
              >
                <X size={15} />
              </Button> */}
            </Col>
          </Row>
        </div>
      </Card>
      <Card className={`${employees.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Contacts</th>
              <th>Rank</th>
              <th>Current Passport</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                        <Link
                          to={`/admin/employees/${row?.id}`}
                          className="user_name text-truncate text-body"
                        >
                          <span className="fw-bolder text-capitalize">
                            {row?.firstname + " " + row?.lastname}
                          </span>
                        </Link>
                        <small className="text-truncate text-muted">
                          {row?.registration}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.email}
                      </span>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder text-capitalize">
                        {row?.rank?.name}
                      </span>
                      <small className="text-truncate text-muted text-capitalize">
                        {row?.rank?.permission}
                      </small>
                    </div>
                  </td>
                  <td classname="pe-0 me-0">
                    <Link to={`/admin/employees/${row?.id}`}>
                      <div className="d-flex flex-column">
                        <span className="user_name text-truncate text-body fw-bolder">
                          {row?.currentPassport ? (
                            <Badge color="light-success" className="p-50 w-100">
                              Passport valid
                            </Badge>
                          ) : (
                            <Badge color="light-danger" className="p-50 w-100">
                              Passport invalid
                            </Badge>
                          )}
                        </span>
                      </div>
                    </Link>
                  </td>

                  <td>
                    {row?.activated === true ? (
                      <Badge color="light-success" className="p-50 w-100">
                        Activated
                      </Badge>
                    ) : (
                      <Badge color="light-danger" className="p-50 w-100">
                        Disabled
                      </Badge>
                    )}
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      <CreateEmployeeModal
        visibility={showCreateEmployeesModal}
        closeModal={() => setShowCreateEmployeesModal(false)}
        refresh={fetchEmplyees}
      />
    </>
  );
}

export default Employees;

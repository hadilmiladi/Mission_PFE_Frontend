// ** React Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ** Reactstrap Imports
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  Form,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Badge,
} from "reactstrap";
// ** Icons Imports
import { ChevronLeft, ChevronRight, Edit, Trash } from "react-feather";
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import Avatar from "@components/avatar";
// ** Toast
import toast from "react-hot-toast";
// ** Parts
import CompaniesCountDashboard from "./section/CompaniesCountDashboard";
import AddCompanySection from "./section/AddCompanySection";
// ** Modals
import CreateCompanyModal from "./modals/CreateCompanyModal";
import DeleteCompanyModal from "./modals/DeleteCompanyModal";
import EditCompanyModal from "./modals/EditCompanyModal";
// ** utils
import { cleanUserLocalStorage } from "../../../utility/Auth";
import {
  sessionExpired,
  serverErrorMessage,
} from "./../../../utility/messages";
import { paginationOptions } from "../../../utility/Static";
// ** api config
import axios, { BASE_PATH } from "./../../../service/axios";

// ** -----------------------------------------------------------------------
function Companies() {
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
  const [companies, setCompanies] = useState([]);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({ ...initialQueries });
  // ** Modals
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false);
  // ** selected company
  const [selectedCompany, setSelectedCompany] = useState({});
  // ** fetching data
  useEffect(() => {
    fetchCompanies();
  }, []);
  // ** fetch function
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("client/all", {
        /* params: {
          page: queries.p,
          limit: queries.l,
        },
        headers: {
          authorization: `Bearer ${accesToken}`,
        }, */
      });
      if (res?.status === 200) {
        setCompanies([...res?.data?.items]);
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
  // ** Modal functions
  const openEditCompanyModal = (row) => {
    setSelectedCompany((prev) => ({ ...prev, ...row }));
    setShowEditCompanyModal(true);
  };
  const openDeleteCompanyModal = (row) => {
    setSelectedCompany((prev) => ({ ...prev, ...row }));
    setShowDeleteCompanyModal(true);
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
        title="Companies management"
        data={[{ title: "Companies" }]}
      />
      <CompaniesCountDashboard size={size} />
      <AddCompanySection
        refresh={fetchCompanies}
        openModal={() => setShowCreateCompanyModal(true)}
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
      <Card className={`${companies.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>E-mail</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                        <span
                          to={`/companies/${row?.id}`}
                          className="user_name text-truncate text-body"
                        >
                          <span className="fw-bolder text-capitalize">
                            {row?.company_name}
                          </span>
                        </span>
                        <small className="text-truncate text-muted">
                          {row?.code}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder text-capitalize">
                        {row?.address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.email}
                      </span>
                    </div>
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
                  <td>
                    <Button
                      color="primary"
                      className="btn-icon rounded-circle me-1"
                      onClick={() => openEditCompanyModal(row)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      color="danger"
                      className="btn-icon rounded-circle"
                      onClick={() => openDeleteCompanyModal(row)}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
      {/* {companies.length > 0 && (
        <Card>
          {!loading && (
            <div className="d-flex flex-row-reverse pt-1 me-5">
              <Pagination className="d-flex">
                <PaginationItem disabled={queries.p === 1}>
                  <PaginationLink
                    className="text-nowrap"
                    onClick={prevPagination}
                    first
                  >
                    <ChevronLeft className="align-middle" size={15} />
                    <span className="align-middle">Prev</span>
                  </PaginationLink>
                </PaginationItem>
                {pagination.map((index) => {
                  return (
                    <PaginationItem
                      key={`pagination-${index}`}
                      active={index + 1 === queries.p}
                    >
                      <PaginationLink onClick={() => selectPagination(index)}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem
                  disabled={queries.p - 1 == (size / queries.l).toFixed(0)}
                >
                  <PaginationLink
                    className="text-nowrap"
                    onClick={nextPagination}
                    last
                  >
                    <span className="align-middle">Next</span>
                    <ChevronRight className="align-middle" size={15} />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </div>
          )}
        </Card>
      )} */}
      <CreateCompanyModal
        visibility={showCreateCompanyModal}
        closeModal={() => setShowCreateCompanyModal(false)}
        refresh={fetchCompanies}
      />
      <DeleteCompanyModal
        visibility={showDeleteCompanyModal}
        closeModal={() => setShowDeleteCompanyModal(false)}
        refresh={fetchCompanies}
        row={selectedCompany}
      />
      <EditCompanyModal
        visibility={showEditCompanyModal}
        closeModal={() => setShowEditCompanyModal(false)}
        refresh={fetchCompanies}
        row={selectedCompany}
      />
    </>
  );
}

export default Companies;

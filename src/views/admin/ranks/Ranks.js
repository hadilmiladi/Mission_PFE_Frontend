// ** React Imports
import React, {
  useEffect,
  useState,
} from 'react';

// ** Icons Imports
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
} from 'react-feather';
// ** Toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from 'reactstrap';

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';

// ** api config
import axios from '../../../service/axios';
// ** utils
import { cleanUserLocalStorage } from '../../../utility/Auth';
import {
  serverErrorMessage,
  sessionExpired,
} from '../../../utility/messages';
import { paginationOptions } from '../../../utility/Static';
import CreateRankModal from './modals/CreateNewRank';
import DeleteRankModal from './modals/DeleteRank';
import EditRankModal from './modals/EditRank';
// ** Parts
import AddRankSection from './section/AddRankSection';

// ** -----------------------------------------------------------------------
function Ranks() {
  // ** router
  const navigate = useNavigate();
 // ** access token
 const accesToken = localStorage.getItem(
  "access_token"
);
  // ** initial state
  const initialQueries = {
    p: 1,
    l: 10,
    sortBy: "default",
    select: "all",
  };
   // ** states
   const [ranks, setRanks] = useState([]);
   const [size, setSize] = useState(0);
   const [loading, setLoading] = useState(false);
   const [queries, setQueries] = useState({ ...initialQueries });

    // ** Modals
  const [showCreateRankModal, setShowCreateRankModal] = useState(false);
  const [showEditRankModal, setShowEditRankModal] = useState(false);
  const [showDeleteRankModal, setShowDeleteRankModal] = useState(false);
   // ** selected rank
   const [selectedRank, setSelectedRank] = useState({});
    // ** fetching data
  useEffect(() => {
    fetchRanks();
  }, []);
  // ** fetch function
  const fetchRanks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("rank/all", {
        
        headers: {
          authorization: `Bearer ${accesToken}`,
        }, 
      });
      if (res?.status === 200) {
        setRanks([...res?.data?.items]);
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
   const openEditRankModal = (row) => {
    setSelectedRank((prev) => ({ ...prev, ...row }));
    setShowEditRankModal(true);
  };
  const openDeleteRankModal = (row) => {
    setSelectedRank((prev) => ({ ...prev, ...row }));
    setShowDeleteRankModal(true);
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
        title="Ranks management"
        data={[{ title: "Ranks" }]}
      />
       <AddRankSection
      refresh={fetchRanks}
      openModal={() => setShowCreateRankModal(true)}
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
                onClick={fetchRanks}
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
        <Card className={`${ranks.length === 0 && "pb-2"} pb-1`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Rank Name</th>
              <th>Pemission</th>
              <th>Perdiem</th>
              
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((row, index) => {
              return (
                <tr key={`row-${index}`}>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="d-flex flex-column">
                      <span
                          to={`/ranks/${row?.id}`}
                          className="user_name text-truncate text-body"
                        >
                        <span className="fw-bolder text-capitalize">
                        {row?.name}
                      </span>
                    </span>
                    
                </div>
              </div>
            </td>
            <td>
            <div className="d-flex flex-column">
              <span className="user_name text-truncate text-body fw-bolder text-capitalize">
                {row?.permission}
              </span>
            </div>
          </td>
          <td>
          <div className="d-flex flex-column">
            <span className="user_name text-truncate text-body fw-bolder">
              {row?.perdiem}
            </span>
          </div>
        </td>
        
        <td>
                    <Button
                      color="primary"
                      className="btn-icon rounded-circle me-1"
                      onClick={() => openEditRankModal(row)}
                    >
                      <Edit size={16} />
                    </Button>
                    
                    
                    <Button
                    color="danger"
                    className="btn-icon rounded-circle"
                    onClick={() => openDeleteRankModal(row)}
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
    {ranks.length > 0 && (
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
      )} 
       <CreateRankModal
        visibility={showCreateRankModal}
        closeModal={() => setShowCreateRankModal(false)}
        refresh={fetchRanks}
      /> 
      
      <DeleteRankModal
        visibility={showDeleteRankModal}
        closeModal={() => setShowDeleteRankModal(false)}
        refresh={fetchRanks}
        row={selectedRank}
      />
      <EditRankModal
      visibility={showEditRankModal}
      closeModal={() => setShowEditRankModal(false)}
      refresh={fetchRanks}
      row={selectedRank} 
    /> 
  </>
);
}
export default Ranks;
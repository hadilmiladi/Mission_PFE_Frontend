// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
import { Eye } from 'react-feather';
import { useNavigate } from 'react-router-dom';
// ** react imports
import {
  Badge,
  Button,
  Card,
  Table,
} from 'reactstrap';

import axios from '../../../../service/axios';
import AddCompanySection
  from '../../../ceo/companies/section/AddCompanySection';
import AddNewMission from './AddNewMission';

function EmployeeMission({active, user}) {
      // ** access token
      const accesToken = localStorage.getItem(
        "access_token"
      );
      const token = localStorage.getItem('access_token');
      console.log('token', token);
      const decodedToken = jwt_decode(token);
      const id = decodedToken.id;
    
      console.log('id :', id);
    
      // ** initial state
      const initialQueries = {
        p: 1,
        l: 10,
        sortBy: "default",
        select: "all",
      };
    // ** states
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(0);
    const [showViewMission, setShowViewMission] = useState(false);
    const [queries, setQueries] = useState({ ...initialQueries });
    const [selectedMission, setSelectedMission] = useState({});
    const navigate= useNavigate();
    const [showAddNewMission, setShowAddNewMission] = useState(false);
    
     // ** fetch data
     useEffect(() => {
      if(active ==="mission"){
       fetchMissions();}
    }, [user,active]);
    // ** fetch function
    const fetchMissions = async () => {
      console.log("called");
      setLoading(true);
       try { const res = await axios.get(`mission/employee/${id}`, {
          headers: {
            authorization: `Bearer ${accesToken}`,
          },
        })
        if (res?.status === 200) {
          setMissions([...res?.data?.items]);
          setSize(res?.data?.size);
          //console.log(missions.length)
        }
      } catch (error) {
        console.log("err: ", error);
        // errors
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
    console.log("missions.length",missions.length)
    if(missions.length!==0){
    return (
      <>
       <AddCompanySection
            refresh={fetchMissions}
            openModal={() => setShowAddNewMission(true)}
          />
        <Card className={`${missions?.length === 0 && 'pb-2'} pb-1`}>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {missions.map((row, index) => {
                  return (
                    
                      <tr> 
                        <td>
                          <span className="user_name text-truncate text-body fw-bolder">
                            {row?.id}
                          </span>
                        </td>
                        <td>
                          <span className="user_name text-truncate text-body fw-bolder">
                            {row?.client?.company_name}
                          </span>
                        </td>
                        <td>
                          <span className="user_name text-truncate text-body fw-bolder">
                            {`${String(row?.start).slice(0, 16)}-${String(row?.finish).slice(0, 16)}`}
                          </span>
                        </td>
                        <td>
                          <span className="user_name text-truncate text-body fw-bolder">
                            {row?.destination}
                          </span>
                        </td>
                        <td>
                        {row?.accepted === true && row?.declined === false && row?.validated === false ? (
                    <Badge color="light-success" className="p-50">
                      Accepted
                    </Badge>
                  ) : row?.accepted === false && row?.declined === false && row?.validated === true ? (
                    <Badge color="light-info" className="p-50 ">
                      Validated
                    </Badge>
                  ) :row?.accepted === false && row?.declined === true && row?.validated === false ? (
                    <Badge color="light-danger" className="p-50">
                      Canceled
                    </Badge>
                  ) : (
                    <Badge color="light-primary" className="p-50">
                      Pending
                    </Badge>
                  )}
                        </td>
                        <td>  <Button
                          color="primary"
                          className="btn-icon rounded-circle"
                         /*  onClick={() => {
                            setSelectedMission({ ...row });
                            setShowViewMission(true);
                          }} */
                        >
                          <Eye size={16} />
                        </Button></td>
                      </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
          {/* <ViewMission
            visibility={showViewMission}
            closeModal={() => setShowViewMission(false)}
            row={selectedMission}/> */}
            {/* openDeleteMissionModal={() => setShowDeleteMission(true)}
            openCancelMissionModal={() => setShowCancelMissionModal(true)}
            openConfirmMissionModal={() => setShowAcceptMissionModal(true)}
            openEditMissionModal={() => setShowEditMissionModal(true)}  */}
          
           <AddNewMission
            visibility={showAddNewMission}
            closeModal={() => setShowAddNewMission(false)}
            refresh={fetchMissions}
          />
        </>
      );}
      else{
          return (
            <>
              <AddCompanySection
                refresh={fetchMissions}
                openModal={() => setShowAddNewMission(true)}
              />
              <Card className={`${missions?.length === 0 && 'pb-2'} pb-1`}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center">
                        <h6 className="text-capitalize">
                          We're sorry but no missions are available for this employee.
                        </h6>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
              <AddNewMission
            visibility={showAddNewMission}
            closeModal={() => setShowAddNewMission(false)}
            refresh={fetchMissions}
          />
            </>
          );
        }
      }
      
    export default EmployeeMission
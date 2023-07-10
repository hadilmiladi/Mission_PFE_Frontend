// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
// ** react imports
import {
  Badge,
  Card,
  Table,
} from 'reactstrap';

import axios from '../../../service/axios';

function Mission() {
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
  const [queries, setQueries] = useState({ ...initialQueries });
  const [selectedMission, setSelectedMission] = useState({});
  const navigate= useNavigate();
 
  // ** fetch data
  useEffect(() => {
    {
      fetchMissions();
    }
  }, []);
  // ** fetch function
 const fetchMissions = async () => {
    console.log("called");
    setLoading(true);
     try {
      const res = await axios.get(`mission/all`,{

        headers: {
            authorization: `Bearer ${accesToken}`,
          },})
        if (res?.status === 200) {
          setMissions([...res?.data?.items]);
          setSize(res?.data?.size);
        }
      } catch (error) {
        console.log("err: ", error);
        // errors
      }
      setLoading(false); 
    };
    console.log("missions",missions)
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
    
 
    return (
        <>
          <Card className={`${missions?.length === 0 && 'pb-2'} pb-1`}>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {missions.map((row, index) => {
              {console.log('index',row.employeeId)}
              return (
              
                  <tr key={`row-${index}`} /* onClick={() => handleClick(row?.employeeId)} */> 
                    <td><span className="user_name text-truncate text-body fw-bolder">
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
                        {row?.employee?.firstname + ' ' + row?.employee?.lastname}
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
                  </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
export default Mission;
// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

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

const handleClick = (id) => {
  navigate(`/admin/employees/${id}`);
};
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
              return (
                
                  <tr key={`row-${index}`} onClick={() => handleClick(row?.id)}> 
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
                      {row?.accepted === true && row?.declined === false ? (
                        <Badge color="light-success" className="p-50 w-100">
                          Accepted
                        </Badge>
                      ) : row?.accepted === false && row?.declined === true ? (
                        <Badge color="light-danger" className="p-50 w-100">
                          Canceled
                        </Badge>
                      ) : row?.accepted === false && row?.declined === false ? (
                        <Badge color="light-primary" className="p-50 w-100">
                          Pending
                        </Badge>
                      ) : null}
                    </td>
                  </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
};
export default Mission;
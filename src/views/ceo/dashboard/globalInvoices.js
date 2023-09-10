// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import { TrendingUp } from 'react-feather';
// ** react imports
import {
  Badge,
  Card,
  Row,
  Table,
} from 'reactstrap';

import axios from '../../../service/axios';

function CeoInvoices(){
    // ** access token
  const accesToken = localStorage.getItem(
    "access_token"
  );
  //console.log(accesToken)
  // ** initial state
  const initialQueries = {
    p: 1,
    l: 10,
    sortBy: "default",
    select: "all",
  };
  // ** states

const [globalinvoices, setGlobalnvoices] = useState([]);

const [size, setSize] = useState(0);
const [queries, setQueries] = useState({ ...initialQueries });






 // ** fetch data
 useEffect(() => {
    {
      //fetchInvoices();
      //fetchglobalinvoice();
      fetchinvoicesall();
      
    }
  }, []);
  // ** fetch globalInvoices
const fetchinvoicesall=async()=>{
    try {
      const res = await axios.get(`globalinvoice/all`,{
        
        headers: {
          authorization: `Bearer ${accesToken}`,
        },
      })
      //console.log("res: ",res?.data.items)
      if (res?.status === 200) {
        setGlobalnvoices((res?.data?.globalInvoices));
        setSize(res?.data?.size);
      }
    } catch (error) {
      console.log("errors: ",error)
      // errors
    }
  }
  // ** Pagination
const pagination = [];
for (let i = 0; i < size / queries.l; i++) {
  pagination.push(i);
};
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
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
      
      </Row>
    </div>
    
    <Card className={`${globalinvoices?.length === 0 && 'pb-2'} pb-1`}>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th> <TrendingUp size={14} /></th>
            <th>Client</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th> 
            
            
            <th></th>
          </tr>
        </thead>
        <tbody>
       

          {globalinvoices.map((row, index) => {
         
              return (
                <tr key={`row-${index}`}  > 
                <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.id}
                      </span>
                    </td>
                    <td>
  <span className="user_name text-truncate text-body fw-bolder">
  {row?.send===false ? (
                        <Badge color="light-primary" className="p-50 w-100">
                        Not send
                      </Badge>
                      ): row?.send===true ?(
                        <Badge color="light-success" className="p-50 w-100">
                         send
                      </Badge>
                      ): null}
    
  </span>
</td>
<td>

                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.client?.company_name}
                      </span>
                      </td>
                    {/*  <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.mission?.employee?.firstname + ' ' + row?.mission?.employee?.lastname}
                      </span>
                    </td>  */}
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {`${String(row?.start?.substring(0, 10)).slice(0, 16)}-${String(row?.end?.substring(0, 10)).slice(0, 16)}`}
                      </span>
                    </td>
                    <td>
                    <span className="user_name text-truncate text-body fw-bolder">
                     
                    </span>
                   
                  </td>
                    <td >
                      
                    <span className="user_name text-truncate text-body fw-bolder">
  {row?.paid === false && row?.deadline === true ? (
    <Badge color="light-danger" className="p-50 w-100">
      Not paid
    </Badge>
  ) : row?.paid === false ? (
    <Badge color="light-primary" className="p-50 w-100">
      Not paid
    </Badge>
  ) : row?.paid === true ? (
    <Badge color="light-success" className="p-50 w-100">
      Paid
    </Badge>
  ) : null}
</span>
             {/*  {console.log('paid is', row?.paid)} */}
</td>


                      <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                      
                       </span>
                        </td> </tr>
              );
            })}
          </tbody>
        </Table>
        
      </Card>
     
    </>
  );
};
 export default CeoInvoices;

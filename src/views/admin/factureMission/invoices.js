// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';
// ** react imports
import {
  Card,
  Table,
} from 'reactstrap';

import axios from '../../../service/axios';

function AdminInvoices() {
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
  const initialDates=[new Date(),new Date()]
  const initialFilters ={
    clientId:"all",
    employeeId:"all",
    type:"all"
  }
// ** states
const [invoices, setInvoices] = useState([]);
const [loading, setLoading] = useState(false);
const [size, setSize] = useState(0);
const [queries, setQueries] = useState({ ...initialQueries });
const [selectedMission, setSelectedMission] = useState({});
const [range,setRange]=useState([...initialDates])
const [clients, setClients]=useState([])
const [employees, setemployees]=useState([])
const [filters, setfilters]=useState({
...initialFilters
})

const { id } = useParams();
const navigate= useNavigate();


 // ** fetch data
  useEffect(() => {
  {
    fetchInvoices();
  }
}, []);

 // ** fetch function
 const fetchInvoices = async () => {
  console.log("called");
  setLoading(true);
  try {
    const res = await axios.get(`globalinvoice/invoices/${id}`, {
      headers: {
        authorization: `Bearer ${accesToken}`
      }
    });
  
    if (res?.status === 200) {
      setInvoices((res.data.invoices));
      setSize(res?.data?.size);
    }
  } catch (error) {
    console.log("err: ", error);
    // Handle errors
  }
  
  setLoading(false);
};

console.log('invoices',invoices)

const handleClick=(id)=>{
  navigate(`/admin/invoices/${id}`)
}
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

const onChangeDate=(values)=>{
  if(values.length===2){
    setRange([new Date(values[0]),new Date(values[1])])
  }
}

  const onChange=event=>{
    const {name,value}=event.target;
    setfilters(prev=>({...prev,[name]:value}))
  } 
  return (
    <>
    
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      
    </div>
    <Card className={`${invoices?.length === 0 && 'pb-2'} pb-1`}>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((row, index) => {
            console.log('row:', row?.id);
              return ( 
                <tr key={`row-${index}`} onClick={() => handleClick(row?.id)}> 
                <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.id}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.mission?.client?.company_name}
                      </span>
                      </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {row?.mission?.employee?.firstname + ' ' + row?.mission?.employee?.lastname}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {`${String(row?.start).slice(0, 16)}-${String(row?.end).slice(0, 16)}`}
                      </span>
                    </td>
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                      {row?.amount} $
                      </span>
                    </td>  </tr>
               ); 
             } 
             ) 
             } 
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export default AdminInvoices
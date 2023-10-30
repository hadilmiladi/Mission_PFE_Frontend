// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';

// ** react imports
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Eye,
  Send,
  TrendingUp,
} from 'react-feather';
// ** Third Party Components
import Flatpickr from 'react-flatpickr';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// ** react imports
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Label,
  Row,
  Table,
} from 'reactstrap';

import axios from '../../../service/axios';
import SetPaid from './setPaid';

function AdminInvoices() {
  // ** access token
  const accessToken = localStorage.getItem(
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
 
  const initialDates=[new Date(),new Date()]
  const initialFilters ={
    clientId:"all",
  }
 
// ** states
const [invoices, setInvoices] = useState([]);
const [globalinvoices, setGlobalnvoices] = useState([]);
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

const[hasDelaisToday,setHasDelaisToday]=useState(false)
const [rangeString, setRangeString] = useState('');
const[global,setGlobal]=useState();
const navigate= useNavigate();
const [showSetPaid, setShowSetPaid] = useState(false);
const [sendstatus, setSendstatus] = useState({});


  const toggleModal = () => {
    setShowModal(!showModal);
  };

useEffect(()=>{
  fetchClients()
  
  //fetchEmployees()
},[])
 // ** fetch data
 useEffect(() => {
  {
    fetchinvoicesall();
  }
}, [range,filters]);


const fetchGlobalInvoice = async () => {
  setLoading(true);
  const params = {
    start: range[0],
    end: range[1],
    clientId: filters.clientId
  };

  try {
      const res = await axios.post(`globalinvoice/create`,params, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
        
      });
  
      if (res.status === 200) {
        toast.success('Invoice created successfully');
        setSize(res.data.size);
        
        fetchinvoicesall();
      }
    } catch (error) {
      
  
      if (error?.response?.status===400 &&  error?.response?.data?.code ==='parameters'){
        toast.error("check params")
      }else if (error?.response?.status === 400 && error?.response?.data?.code === 'exist') {
        toast.error('already exist');
      }
        else if (error?.response?.status === 400 && error?.response?.data?.code === 'no_invoices') {
          toast.error('no such invoice exist');}
      else if(error?.response?.status===500){
        toast.error('serveur')
      }
      
    }
    setLoading(false);
};


// ** fetch clients
const fetchClients=async()=>{
  try {
    const res = await axios.get(`client/all`,{
      
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    if (res?.status === 200) {
      setClients([...res?.data?.items]);
    }
  } catch (error) {
    console.log("errors: ",error)
  }
}
// ** fetch globalInvoices
const fetchinvoicesall=async()=>{
  try {
    const res = await axios.get(`globalinvoice/all`,{
      
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    if (res?.status === 200) {
      setGlobalnvoices((res?.data?.globalInvoices));
      setSize(res?.data?.size);
      
    }
  } catch (error) {
    console.log("errors: ",error)
  }
  
}


const handleClick=(id)=>{
  navigate(`/admin/globalinvoice/${id}`)
}

const sendMail=async(id)=>{
  //console.log('i am here')
  try{
    const res=await axios.post(`globalinvoice/global/${id}`,{},{
      
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    if (res?.status === 200) {
      toast.success("Email sent");
      fetchinvoicesall();
    }
  } catch (error) {
    if(error?.response?.status ===400){
      toast.error("verify your e-mailconfiguration ")
    } else
    toast.error("an error is occured")
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
    <Card>
    <div className='invoice-list-table-header d-flex justify-content-center w-100 me-1 ms-50 mt-2 mb-75'>
  <Col xl="2" className="d-flex align-items-center p-0">
    <Label className="form-label" for="range-picker">
      Dates
    </Label>
    <Flatpickr
      value={range}
      id="range-picker"
      className="form-control"
      onChange={onChangeDate}
      options={{
        mode: "range",
      }}
    />
  </Col>
  <Col xl='4' className='d-flex align-items-center p-0'>
    <label htmlFor='rows-per-page' >Client</label>
    <Input
      className='mx-2'
      type='select'
      name="clientId"
      id='rows-per-page'
      value={filters.clientId}
      onChange={onChange}
    >
      <option value='all'>clients</option>
      {clients.map((item, index) => (
        <option key={`option-${index+1}`} value={item?.id}>
          {item.company_name}
        </option>
      ))}
    </Input>
  </Col>
  <Col xl='2' className='d-flex align-items-center p-0'>
    <Button color='primary' onClick={fetchGlobalInvoice}>
      Add Record
    </Button>
  </Col>
  
</div>


    </Card>   
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
           {/*  <th>Total</th> */}
            <th>Status</th> 
            <th>Action</th> 
            
            <th></th>
          </tr>
        </thead>
        <tbody>
       

          {globalinvoices.map((row, index) => {
        
              return (
                <tr key={`row-${index}`} color='FF3342' > 
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
                  
                    <td>
                      <span className="user_name text-truncate text-body fw-bolder">
                        {`${String(row?.start?.substring(0, 10)).slice(0, 16)}/${String(row?.end?.substring(0, 10)).slice(0, 16)}`}
                      </span>
                    </td>
                    {/* <td>
                    <span className="user_name text-truncate text-body fw-bolder">
                     
                    </span>
                   
                  </td> */}
                    <td onClick={() => setShowSetPaid(true)}>
                      
                      <span className="user_name text-truncate text-body fw-bolder">
  { row?.paid === false ? (
    <Badge color="light-primary" className="p-50 w-100">
      Not paid
    </Badge>
  ) : row?.paid === true ? (
    <Badge color="light-success" className="p-50 w-100">
      Paid
    </Badge>
  ) : null}
</span>
           
</td>
{showSetPaid && (
  <SetPaid
    visibility={showSetPaid}
    closeModal={() => setShowSetPaid(false)}
    row={row}
    refresh={fetchinvoicesall}
    closeMainModal={toggleModal}
    
  />
)}


                    <td>
                    
                    <Send className='cursor-pointer' size={17} id={`send-tooltip-${row.id}`} onClick={(event) => {
      event.stopPropagation(); // Prevent event propagation
      sendMail(row.id);
    }}
    
 />
                
          <Eye size={17} className='mx-1' onClick={() => handleClick(row?.id)} />
      
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

export default AdminInvoices;
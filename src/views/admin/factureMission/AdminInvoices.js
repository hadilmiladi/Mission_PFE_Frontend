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
 
  const initialDates=[new Date(),new Date()]
  const initialFilters ={
    clientId:"all",
   /*  employeeId:"all",
    type:"all" */
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
    //fetchInvoices();
    //fetchglobalinvoice();
    fetchinvoicesall();
    
  }
}, [range,filters]);


const fetchGlobalInvoice = async () => {
  //console.log('fetchGlobalInvoice called');
  setLoading(true);
  const params = {
    start: range[0],
    end: range[1],
    clientId: filters.clientId
  };

  try {
  //console.log('i am in try')
      const res = await axios.post(`globalinvoice/create`,params, {
        headers: {
          authorization: `Bearer ${accesToken}`,
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
        
        //console.log("hhhhaaaadiiillll")
        
      }else if (error?.response?.status === 400 && error?.response?.data?.code === 'exist') {
        toast.error('already exist');
      }
        else if (error?.response?.status === 400 && error?.response?.data?.code === 'no_invoices') {
          toast.error('no such invoice exist');}
   /*    else if(error?.response?.status===500){
        console.log("errorrr",error)
        toast.error('serveur')
      } */
      
    }
    
    setLoading(false);
    
  
};


 /* // ** fetch function
 const fetchInvoices = async () => {
  console.log("called");
  setLoading(true);
  try {
    const res = await axios.get(`invoice/all`,{
      params:{
        start:range[0],
        end:range[1],
        type:filters.type,
        employeeId:filters.employeeId, 
        clientId:filters.clientId,
      },
      headers: {
        authorization: `Bearer ${accesToken}`,
      },
    })
    if (res?.status === 200) {
      setInvoices([...res?.data?.items]);
      setSize(res?.data?.size);
    }
  } catch (error) {
    console.log("err: ", error);
    // errors
  }
  setLoading(false); 
}; */
// ** fetch clients
const fetchClients=async()=>{
  try {
    const res = await axios.get(`client/all`,{
      
      headers: {
        authorization: `Bearer ${accesToken}`,
      },
    })
    //console.log("res: ",res)
    if (res?.status === 200) {
      setClients([...res?.data?.items]);
      //setSize(res?.data?.size);
    }
  } catch (error) {
    console.log("errors: ",error)
    // errors
  }
}
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
    console.log("globaaaaaaaaaaaaaaaaaaal",globalinvoices)
  } catch (error) {
    console.log("errors: ",error)
    // errors
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
        authorization: `Bearer ${accesToken}`,
      },
    })
    //console.log("res: ",res)
    if (res?.status === 200) {
      //console.log("this is resssss", res?.data?.globalInvoice);
      toast.success("Email sent");
      fetchinvoicesall();
    }
      
    
    
  } catch (error) {
    console.log("errors: ",error)
    toast.error("an error is occured")
    // errors
  }
}

//console.log("global",global)

//console.log("this is the filters ",filters.clientId)
//console.log("the global invoice is ", globalinvoices)
/* 
// ** fetch employee
const fetchEmployees=async()=>{
  try {
    const res = await axios.get(`employee/all`,{
      
      headers: {
        authorization: `Bearer ${accesToken}`,
      },
    })
    console.log("res: ",res)
    if (res?.status === 200) {
      setemployees([...res?.data?.items]);
      setSize(res?.data?.size);
    }
  } catch (error) {
    // errors
  }
}; */
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

/* const onChangeDate = (values) => {
  if (values.length === 2) {
    const startValue = values[0];
    const endValue = values[1];

    // Convert start date to ISO 8601 format
    const startDate = new Date(startValue);
    startDate.toISOString().split('T')[0];

    // Convert end date to ISO 8601 format
    const endDate = new Date(endValue);
    endDate.toISOString().split('T')[0];

    setRange([startDate, endDate]);
    //setRangeString(`${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`);
  }
}; */
const onChangeDate=(values)=>{
  if(values.length===2){
    setRange([new Date(values[0]),new Date(values[1])])
  }
}




  const onChange=event=>{
    const {name,value}=event.target;
    setfilters(prev=>({...prev,[name]:value}))
  }
  
/* 
  const calculateSubtotal = (globalInvoice) => {
    const invoices = globalInvoice.invoices;
    let totalAmount = 0;
  
    invoices.forEach((invoice) => {
      const invoiceStartDate = new Date(invoice.start);
      const invoiceEndDate = new Date(invoice.end);
      const invoiceTimeDifference = Math.abs(invoiceEndDate - invoiceStartDate);
      const invoiceNumberOfDays = Math.ceil(invoiceTimeDifference / (1000 * 60 * 60 * 24));
  
      // Check if the necessary properties exist and have valid values
      const subtotal =
        (invoice?.mission?.planePrice || 0) +
        (invoice?.mission?.hotelPrice || 0) +
        (invoice?.mission?.employee?.rank?.perdiem || 0) * invoiceNumberOfDays;
  
      totalAmount += subtotal; // Add the subtotal to the totalAmount
    });
  
     // Log the totalAmount inside the function
  
    return totalAmount;
    
  }; */
  
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
    <label htmlFor='rows-per-page' /* className="me-2" */>Client</label>
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
            <th>Total</th>
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
                    <td onClick={() => setShowSetPaid(true)}>
                      {console.log(row?.deadline)}
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
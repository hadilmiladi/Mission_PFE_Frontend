import {
  useEffect,
  useState,
} from 'react';

import {
  Activity,
  Archive,
  FileText,
  UserCheck,
  Users,
} from 'react-feather';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Col,
  Row,
} from 'reactstrap';

import StatsVertical
  from '../../../@core/components/widgets/stats/StatsVertical';
import axios from '../../../service/axios';

function accueil(){
    const accessToken = localStorage.getItem('access_token');
    const [sizeclient, setSizeclient] = useState(0);
    const [sizeEmployee,setSizeEmployee]= useState(0);
    const [Employee,setEmployee]= useState([]);
    const [sizeRank,setSizeRank]= useState(0);
    const [sizeMission,setSizeMission]= useState(0);
    const [sizeInvoice,setSizeInvoice]= useState(0);
    
    useEffect(() => {
        fetchClient();
        fetchEmplyees();
        fetchRanks();
        fetchMissions();
        fetchinvoicesall();
      }, []);
    
      // ** fetch function
      const fetchClient = async () => {
       
        try {
          const res = await axios.get('client/all', {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          if (res?.status === 200) {
            setSizeclient(res?.data?.size);
            setEmployee(res?.data?.length)
                       
          }
        } catch (error) {
          // not token
          if (error?.response?.status === 401) {
            toast.error(sessionExpired, {
              duration: 5000,
            });
          }
          // expired
          else if (error?.response?.status === 403) {
            toast.error(sessionExpired, {
              duration: 5000,
            });
          }
          // server error
          else if (error?.response?.status === 500) {
            toast.error(serverErrorMessage, {
              duration: 5000,
            });
          }
        }
        
        
      };
      console.log("client",sizeclient)

      const fetchEmplyees = async () => {
        try {
          const res = await axios.get(`client/active`, {
           
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          if (res?.status === 200) {
            setSizeclient(res?.data?.items?.length);
          }
        } catch (error) {
          // not token
          if (error?.response?.status === 401) {
            toast.error(sessionExpired, {
              duration: 5000,
            });
          }
          // expired
          else if (error?.response?.status === 403) {
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
      };
     
      const fetchRanks = async () => {
        try {
          const res = await axios.get("rank/all", {
            
            headers: {
              authorization: `Bearer ${accessToken}`,
            }, 
          });
          if (res?.status === 200) {
            setSizeRank(res?.data?.items?.length);
            
          }
        } catch (error) {
          // not token
          if (error?.response?.status === 401) {
            toast.error(sessionExpired, {
              duration: 5000,
            });
          }
          // expired
          else if (error?.response?.status === 403) {
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
      };
      
      const fetchMissions = async () => {
        
         try {
          const res = await axios.get(`mission/all`,{
            headers: {
              authorization: `Bearer ${accessToken}`,
            },})
          if (res?.status === 200) {
            setSizeMission(res?.data?.items?.length);
          }
        } catch (error) {
          console.log("err: ", error);
        }
      }
      
      const fetchinvoicesall=async()=>{
        try {
          const res = await axios.get(`globalinvoice/all`,{
            
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          })
          if (res?.status === 200) {
            setSizeInvoice(res?.data?.globalInvoices?.length);
          }
        } catch (error) {
          console.log("errors: ",error)
        }
      }

return(
 <>
 <Row>
 <Col xl="5" md="4" sm="6">
      <Link to="/admin/clients">
        <StatsVertical stats={sizeclient} statTitle="Total Clients" icon={<Users size={20}/>} color='warning'  />
      </Link>
    </Col>
    <Col xl="5" md="4" sm="6">
      <Link to="/admin/sizeclients">
        <StatsVertical stats={sizeEmployee} statTitle="Total Employees" icon={<UserCheck size={20} />} color='danger' />
      </Link>
      </Col>
      <Col xl="5" md="4" sm="6">
      <Link to="/admin/ranks">
        <StatsVertical stats={sizeRank} statTitle="Total Ranks" icon={<Activity size={20} />} color='primary'/>
      </Link>
    </Col>
    <Col xl="5" md="4" sm="6">
      <Link to="/admin/missions">
        <StatsVertical stats={sizeMission} statTitle="Total Missions" icon={<Archive size={20} />} color='success'/>
      </Link>
   </Col>
   <Col xl="5" md="4" sm="6">
      <Link to="/admin/invoice">
        <StatsVertical stats={sizeInvoice} statTitle="Total Invoices" icon={<FileText size={20} />} color='info' />
      </Link>
      </Col>
      </Row>
      </>
);
};

export default accueil;


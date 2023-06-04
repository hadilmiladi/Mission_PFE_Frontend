// ** Styles
import '@styles/base/pages/app-invoice.scss';

// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';
// ** Reactstrap Imports
import {
  Alert,
  Col,
  Row,
} from 'reactstrap';

// ** Third Party Components
import axios from '../../../../service/axios';
import PreviewActions from './PreviewActions';
// ** Invoice Preview Components
import PreviewCard from './PreviewPrescription';

const InvoicePreview = () => {
  // ** HooksVars
  const { id } = useParams();

  // ** States
  const [data, setData] = useState(null);
  const [notFound, setNotFound]=useState(false)
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen);
  const toggleAddSidebar = () => setAddPaymentOpen(!addPaymentOpen);

  // ** Get invoice on mount based on id
  useEffect(() => {
    if(id){
      getOneInvoice()
    }
  }, [id]);
  const getOneInvoice = async()=>{
    try {
      const res = await axios.get(`/invoice/one/11`)
      if(res?.status===200){
        setData(prev=>({...res?.data?.item}))
      }
    } catch (error) {
      console.log("err: ",error)
      if(error?.response?.status===404){
        setNotFound(true)
      }
    }
  }
  return data !== null  ? (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={9} md={8} sm={12}>
          <PreviewCard data={data} />
        </Col>
        <Col xl={3} md={4} sm={12}>
          <PreviewActions
            id={id}
            setSendSidebarOpen={setSendSidebarOpen}
            setAddPaymentOpen={setAddPaymentOpen}
          />
        </Col>
      </Row>
      {/* <SendInvoiceSidebar
        toggleSidebar={toggleSendSidebar}
        open={sendSidebarOpen}
      />
      <AddPaymentSidebar
        toggleSidebar={toggleAddSidebar}
        open={addPaymentOpen}
      /> */}
    </div>
  ) : notFound===false?   <h4 className="alert-heading">loading ...</h4> :
    <Alert color="danger">
      <h4 className="alert-heading">Invoice not found</h4>
      <div className="alert-body">
        Invoice with id: {id} doesn't exist. Check list of all invoices:{" "}
        <Link to="/apps/invoice/list">Invoice List</Link>
      </div>
    </Alert>
  
};

export default InvoicePreview;

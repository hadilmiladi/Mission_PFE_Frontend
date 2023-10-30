import React from 'react';

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardText,
  Col,
  Row,
  Table,
} from 'reactstrap';

const PreviewCard = ({ data }) => {
  console.log("data: ",data)
  let subtotal = 0;
  let itemArray = Array.isArray(data?.item) ? data.item : [data.item];
  console.log("itemArray",itemArray)
  itemArray.forEach((item) => {
      const invoiceStartDate = new Date(item.item.start);
      console.log("invoiceStartDate",invoiceStartDate)
      const invoiceEndDate = new Date(item.item.end);
      console.log("invoiceEndDate",invoiceEndDate)
      const invoiceTimeDifference = Math.abs(invoiceEndDate - invoiceStartDate);
      console.log("invoiceTimeDifference",invoiceTimeDifference)
      const invoiceNumberOfDays = Math.ceil(invoiceTimeDifference / (1000 * 60 * 60 * 24));
      console.log("invoiceNumberOfDays",invoiceNumberOfDays)
      console.log(" item.item.rank.perdiem", item.item.mission.employee.rank.perdiem)
      subtotal = item.item.mission.planePrice + item.item.mission.hotelPrice + item.item.mission.employee.rank.perdiem * invoiceNumberOfDays;
    });
    console.log("subtota",subtotal)
  
  return data !== null ? (
    <Card className="invoice-preview-card">
      <CardBody className="invoice-padding pb-0">
        {/* Header */}
        <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
          <div>
            <div className="logo-wrapper">
             
              <h3 className="text-primary invoice-logo">Nexus</h3>
            </div>
            <CardText className="mb-25">
            {data?.item?.client?.company_name}
            </CardText>
            <CardText className="mb-25">
            {data?.item?.client?.email  }
            </CardText>
            <CardText className="mb-0">
            {data?.item?.client?.address}
            </CardText>
          </div>
          <div className="mt-md-0 mt-2">
            <h4 className="invoice-title">
              Invoice <span className="invoice-number">#{data?.item?.item?.id}</span>
            </h4>
            <div className="invoice-date-wrapper">
              <p className="invoice-date-title">Date Issued:</p>
              <p className="invoice-date">{data?.item?.item?.start/* ?.substring(0, 10) */}</p>
            </div>
            <div className="invoice-date-wrapper">
              <p className="invoice-date-title">Due Date:</p>
              <p className="invoice-date">{data?.item?.item?.end/* ?.substring(0, 10) */}</p>
            </div>
          </div>
        </div>
        {/* /Header */}
      </CardBody>

      <hr className="invoice-spacing" />

      <Table responsive>
        <thead>
          <tr>
          <th className="py-1">#</th>
            <th className="py-1">Destination</th>
            <th className="py-1">Employee</th>
            <th className="py-1">Perdiem</th>
            <th className="py-1">Plan</th>
            <th className="py-1">Hotel</th>
           
            {/* <th className="py-1">Number of Days</th> */}
          </tr>
        </thead>
        <tbody>
        {[data?.item].map((invoice, index) => {
              return (
                <tr key={index}>
                  <td className="py-1">
                    <span className="fw-bold">#{invoice?.mission?.id}</span>
                    {console.log("invoice?.mission?.id",invoice?.mission?.id)}
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{invoice?.mission?.destination} </span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{invoice?.employee?.firstname} {invoice?.employee?.lastname}</span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{invoice?.rank?.perdiem}</span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{invoice?.mission?.planePrice} $</span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{invoice?.mission?.hotelPrice} $</span>
                  </td>
                 
              
                </tr>
              );
              }
        )
            }
            
            
        
          
  </tbody>
</Table>
     
      <CardBody className="invoice-padding pb-0">
  <Row className="invoice-sales-total-wrapper">
    
    <Col className="mt-md-0 mt-3" md="6" order={{ md: 1, lg: 2 }}>
    
    </Col>
   
    <Col className="d-flex justify-content-end" md="6" order={{ md: 2, lg: 1 }}>
      <div className="invoice-total-wrapper">
        <div className="invoice-total-item">
          <p className="fw-bold text-end">Total:</p>
          <p className="invoice-total-amount text-end">
            <span className="fw-bold">{subtotal} $</span>
          </p>
        </div>
      </div>
    </Col>
  </Row>
</CardBody>
     

      <hr className="invoice-spacing" />

     
      <CardBody className="invoice-padding pt-0">
        <Row>
          <Col sm="12">
            <span className="fw-bold">Note: </span>
            <span>
              It was a pleasure working with you and your team. We hope you will
              keep us in mind for future freelance projects. Thank You!
            </span>
          </Col>
        </Row>
      </CardBody>
   
    </Card>
  ) : null;
};

export default PreviewCard;

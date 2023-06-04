// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
} from 'reactstrap';

// ** ---------------------------------------------------------------------
const PreviewActions = ({ id, setSendSidebarOpen, setAddPaymentOpen }) => {
  return (
    <Card className="invoice-action-wrapper">
      <CardBody>
        <Button
          color="primary"
          block
          className="mb-75"
          onClick={() => setSendSidebarOpen(true)}
        >
          Send Invoice
        </Button>
        {/* <Button color="secondary" block outline className="mb-75">
          Download
        </Button> */}
       {/*  <Button
          color="secondary"
          tag={Link}
          to="/apps/invoice/print"
          target="_blank"
          block
          outline
          className="mb-75"
        >
          Print
        </Button> */}
      {/*   <Button
          tag={Link}
          to={`/apps/invoice/edit`}
          color="secondary"
          block
          outline
          className="mb-75"
        >
          Edit
        </Button> */}
        {/* <Button color="success" block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button> */}
      </CardBody>
    </Card>
  );
};

export default PreviewActions;

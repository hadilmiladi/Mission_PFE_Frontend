// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';

// ** icons
import {
  Check,
  Clock,
  Edit,
  Slash,
  Trash,
} from 'react-feather';
import { Link } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
} from 'reactstrap';

function EmployeeInfoCard(props) {
    // props
    const { employee, refresh } = props;
  return (
    <>
    <Card>
        <CardBody>
        <h4 className="fw-bolder border-bottom pb-50 mb-1">Details</h4>
        <div className="info-container">
        <ul className="list-unstyled">
        <li className="mb-75">
                <span className="fw-bolder me-25">#:</span>
                <span className="text-capitalize">{employee?.id}</span>
                <span className="fw-bolder me-25">ena houni</span>
              </li>
              <li className="mb-75">
              <span className="fw-bolder me-25">Full Name :</span>
              <span className="text-capitalize">{employee?.firstname+" "+employee?.lastname}</span>
            </li>
            <li className="mb-75">
            <span className="fw-bolder me-25">E-mail :</span>
            <span className="text-capitalize">{employee?.email}</span>
          </li>
          <li className="mb-75">
            <span className="fw-bolder me-25">Registration number :</span>
            <span className="text-capitalize">{employee?.registration}</span>
          </li>
          <li className="mb-75">
            <span className="fw-bolder me-25">Status :</span>
            <span className="text-capitalize">{
              employee?.activated===true ? <span  className="p-50 w-100">Activated</span>:<span className="p-50 w-100">Disabled</span>
            }</span>
          </li>
          <li className="mb-75">
            <span className="fw-bolder me-25">Current Passport :</span>
            <span className="text-capitalize">{employee?.passports?.registration}</span>
          </li>  /* hedhi mahabetch */
        </ul>
        </div>
        <div className="d-flex justify-content-center pt-2 gap-1">
            <Button
              id="openCancelOrderModal"
              color="danger"
              className="btn-icon rounded-circle"
            >
              <Slash size={18} />
            </Button>
            <Link
             to="../EditEmployee.js">
            <Button
              id="openEditOrderModal"
              color="primary"
              className="btn-icon rounded-circle"
            >
              <Edit size={18} />
            </Button>
            </Link>

            <Button
              id="openDeleteOrderModal"
              color="danger"
              className="btn-icon rounded-circle"
              
            >
              <Trash size={18} />
            </Button>
            <Button
              id="openSetOrderDeliveredModal"
              color="success"
              className="btn-icon rounded-circle"
             
            >
              <Check size={18} />
            </Button>
            <Button
              id="openSetOrderDeliveredLateModal"
              color="warning"
              className="btn-icon rounded-circle"
              
            >
              <Clock size={18} />
            </Button>
          </div>
        </CardBody>
        </Card>  
    </>
  )
}

export default EmployeeInfoCard
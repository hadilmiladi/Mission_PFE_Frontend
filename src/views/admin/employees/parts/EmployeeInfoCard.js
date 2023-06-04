// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';

import { useState } from 'react';

// ** icons
import {
  Check,
  Clock,
  Edit,
  Slash,
  Trash,
} from 'react-feather';
// ** Reactstrap Imports
import {
  Badge,
  Button,
  Card,
  CardBody,
} from 'reactstrap';

import EditEmployeeModal from '../modals/EditEmployee';

// -------------------------------------------------------------------------
function EmployeeInfoCard(props) {
  // props
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
 // ** selected Employee
 const [selectedEmployee, setSelectedEmployee] = useState({});
  const { employee, refresh,currentPassport } = props;
  // ** ==>
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
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">Full Name :</span>
                <span className="text-capitalize">
                  {employee?.firstname + " " + employee?.lastname}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">E-mail :</span>
                <span className="text-capitalize">{employee?.email}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">Registration number :</span>
                <span className="text-capitalize">
                  {employee?.registration}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">Status :</span>
                <span className="text-capitalize">
                  {employee?.activated === true ? (
                    <Badge color="light-success" className="p-50">
                      Activated
                    </Badge>
                  ) : (
                    <Badge color="light-danger" className="p-50">
                      Disabled
                    </Badge>
                  )}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">Current Passport :</span>
                {currentPassport ? (
                  <span className="text-capitalize">
                    {currentPassport?.registration}
                  </span>
                ) : (
                  <Badge color="light-danger" className="p-50 text-capitalize">
                    no passport currently
                  </Badge>
                )}
              </li>
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
           
              <Button
                id="openEditOrderModal"
                color="primary"
                className="btn-icon rounded-circle"
               onClick={() => setShowEditEmployeeModal(true)}
              >
                <Edit size={18} />
              </Button>
            

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
      <EditEmployeeModal
      visibility={showEditEmployeeModal}
      closeModal={()=>setShowEditEmployeeModal(false)}
      row={employee}
      refresh={refresh}
      />
    </>
  );
}
    
  

export default EmployeeInfoCard;

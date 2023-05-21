// ** React Imports
import React from 'react';

// ** Icons Imports
import { Plus } from 'react-feather';
// ** Reactstrap Imports
import {
  Button,
  Col,
  Row,
} from 'reactstrap';

// ** --------------------------------------------------------
function AddRankSection(props) {
  // ** props
  const { openModal } = props;
  // ** ==>
  return (
    <div className="invoice-list-table-header w-100 pb-2">
      <Row>
        <Col
          lg="12"
          className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap"
        >
          <Button
            id="createPatientModal"
            color="primary"
            className="btn-icon"
            onClick={openModal}
          >
            <Plus size={18} />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default AddRankSection;

// ** React Imports
import React from 'react';

// ** Icons Imports
import { Users } from 'react-feather';
// ** Reactstrap Imports
import {
  Col,
  Row,
} from 'reactstrap';

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';

// ** ----------------------------------------------------------------------------------
function CountDashboard(props) {
  // ** props
  const { size = 0 } = props;
  // ** ==>
  return (
    <Row className="p-0">
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="primary"
          statTitle="Total employees"
          icon={<Users size={20} />}
          renderStats={<h3 className="fw-bolder mb-75">{size}</h3>}
        />
      </Col>
    </Row>
  );
}

export default CountDashboard;

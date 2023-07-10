import React, { useContext } from 'react';

import {
  Col,
  Row,
} from 'reactstrap';

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors';

import GoalOverview from './element';
import GlobalInvoices from './globalInvoices';

function CeoDashboard() {
  // ** Context
  const { colors } = useContext(ThemeColors);

  return (
    <div id="dashboard-ecommerce">
      <Row>
        <Col lg="4" md="6" xs="12">
          <GoalOverview success={colors.success.main} />
        </Col>
        <Col lg="8" xs="12">
          <GlobalInvoices />
        </Col>
      </Row>
    </div>
  );
}

export default CeoDashboard;

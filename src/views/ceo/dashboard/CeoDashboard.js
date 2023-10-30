import React, { useContext } from 'react';

import {
  Col,
  Row,
} from 'reactstrap';
import { PieChart } from 'recharts';

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors';

import GoalOverview from './InvoiceDashboard/element';
import GlobalInvoices from './InvoiceDashboard/globalInvoices';

function CeoDashboard() {
  // ** Context
  const { colors } = useContext(ThemeColors);
 // ** Vars
 const donut = {
  series1: "#ffe700",
  series2: "#00d4bd",
  series3: "#826bf8",
  series4: "#2b9bf4",
  series5: "#FFA1A1",
};

   
  return (
    <div id="dashboard-ecommerce">
      <Row>
        <Col lg="6" md="6" xs="12">
          <GoalOverview success={colors.success.main} />
        </Col>
      
        <Col xl="6" lg="12">
          <PieChart
            series1={donut.series1}
            series2={donut.series2}
            series3={donut.series3}
            series5={donut.series5}
          />
        </Col>
        <Col lg="8" xs="12">
          <GlobalInvoices />
        </Col>
      </Row>
    </div>
  );
}

export default CeoDashboard;

// ** React Imports
import {
  useEffect,
  useState,
} from 'react';

import Chart from 'react-apexcharts';
import { HelpCircle } from 'react-feather';
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import axios from '../../../../service/axios';

const GoalOverview = props => {
    // ** State
    const [data, setData] = useState(null)
    const [paidCount, setPaidCount] = useState(0);
    const [unpaidCount, setUnpaidCount] = useState(0);
    const [percentage, setPercentage] = useState(0);
  
    useEffect(() => {
        axios.get('globalinvoice/all').then((res) => {
          setData(res.data);
          const { paidCount, unpaidCount } = countPaidGlobalInvoices(res.data?.globalInvoices || []);
          setPaidCount(paidCount);
          setUnpaidCount(unpaidCount);
          const totalCount = paidCount + unpaidCount;
         
          const paidPercentage = (paidCount / totalCount) * 100;
          setPercentage(paidPercentage);
        });
        return () => setData(null);
      }, []);


    const countPaidGlobalInvoices = (globalInvoices) => {
        let paidCount = 0;
        let unpaidCount = 0;
      
        globalInvoices.forEach((globalInvoice) => {
          if (globalInvoice.paid) {
            paidCount++;
          } else {
            unpaidCount++;
          }
        });
        console.log("paidCount", paidCount)
        return { paidCount, unpaidCount };
        
      };
      
      
    const options = {
        chart: {
          sparkline: {
            enabled: true
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1
          }
        },
        colors: ['#51e5a8'],
        plotOptions: {
          radialBar: {
            offsetY: 10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '77%'
            },
            track: {
              background: '#ebe9f1',
              strokeWidth: '50%'
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                color: '#5e5873',
                fontFamily: 'Montserrat',
                fontSize: '2.86rem',
                fontWeight: '600'
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [props.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        grid: {
          padding: {
            bottom: 30
          }
        }
      },
      series = [percentage]
  
    return data !== null ? (
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Goal Overview</CardTitle>
          <HelpCircle size={18} className='text-muted cursor-pointer' />
        </CardHeader>
        <CardBody className='p-0'>
          <Chart options={options} series={series} type='radialBar' height={245} />
        </CardBody>
        <Row className='border-top text-center mx-0'>
          <Col xs='6' className='border-end py-1'>
            <CardText className='text-muted mb-0'>Paid</CardText>
            <h3 className='fw-bolder mb-0'>{paidCount}</h3>
          </Col>
          <Col xs='6' className='py-1'>
            <CardText className='text-muted mb-0'>Unpaid</CardText>
            <h3 className='fw-bolder mb-0'>{unpaidCount}</h3>
          </Col>
        </Row>
      </Card>
    ) : null
  }
  export default GoalOverview
  
import React, {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';
import {
  Card,
  Table,
} from 'reactstrap';

import axios from '../../../../service/axios';
import {
  serverErrorMessage,
  sessionExpired,
} from '../../../../utility/messages';
import AddCompanySection
  from '../../../ceo/companies/section/AddCompanySection';
import AddNewVisa from './AddNewVisa';

function UserVisaTab({ currentPassport, active, refresh }) {
        const [visa, setVisa] = useState([]);
        const [size, setSize] = useState(0);
        const [loading, setLoading] = useState(false);
        const [queries, setQueries] = useState({ p: 1, l: 10, sortBy: 'default', select: 'all' });
        const [showAddNewVisa, setShowAddNewVisa] = useState(false);
      
        useEffect(() => {
          if (active === 'visa') {
            fetchVisa();
          }
        }, [active]);
      console.log("&&&&&&&&&&&&&&&&&&&&&",currentPassport)
        const fetchVisa = async () => {
          setLoading(true);
          try {
            const res = await axios.get(`visa/passport/${currentPassport}`, {
              headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            });
            if (res?.status === 200) {
              console.log('visa',res?.data.visas)   
              setVisa([...res?.data?.visas]);
              setSize(res?.data?.size);
                 }
          } catch (error) {
            if (error?.response?.status === 401) {
              toast.error(sessionExpired, {
                duration: 5000,
              });
            } else if (error?.response?.status === 403) {
              toast.error(sessionExpired, {
                duration: 5000,
              });
            } else if (error?.response?.status === 500) {
              toast.error(serverErrorMessage, {
                duration: 5000,
              });
            }
          }
          setLoading(false);
        };
      //console.log(visa)
        const pagination = [];
        for (let i = 0; i < size / queries.l; i++) {
          pagination.push(i);
        }
      
        const prevPagination = () => {
          if (queries.p > 0) {
            setQueries((prev) => ({ ...prev, p: queries.p - 1 }));
          }
        };
      
        const nextPagination = () => {
          const condition = queries.p == (size / queries.l).toFixed(0);
          if (!condition) {
            setQueries((prev) => ({ ...prev, p: queries.p + 1 }));
          }
        };
      
        const selectPagination = (index) => {
          setQueries((prev) => ({ ...prev, p: index }));
        };
      console.log('currentpassport',currentPassport)
      return (
        <>
          <AddCompanySection refresh={fetchVisa} openModal={() => setShowAddNewVisa(true)} />
          <Card className={`${visa?.length === 0 && 'pb-2'} pb-1`}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Valable for</th>
                  <th>StartAt</th>
                  <th>ExpiresAt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visa?.map((row, index) => (
                  <tr key={`row-${index}`}>
                    <td>
                      <div className="d-flex justify-content-left align-items-center">
                        <div className="d-flex flex-column">
                          <small className="text-truncate text-muted">{row?.valable_for}</small>
                        </div>
                      </div>
                    </td>
                    <td className="pe-0 me-0">
                      <div className="d-flex flex-column">
                        <span className="user_name text-truncate text-body fw-bolder">{row?.startAt}</span>
                      </div>
                    </td>
                    <td className="pe-0 me-0">
                      <div className="d-flex flex-column">
                        <span className="user_name text-truncate text-body fw-bolder">{row?.expiresAt}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <AddNewVisa
            visibility={showAddNewVisa}
            closeModal={() => setShowAddNewVisa(false)}
            refresh={fetchVisa}
            currentPassport={currentPassport}
          />
        </>
      );
    }
    
    export default UserVisaTab;
    
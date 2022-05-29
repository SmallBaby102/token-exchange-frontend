import React, {
  useEffect,
  useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
} from 'reactstrap';
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import { setChecking } from '../actions';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  Row,
  RSelect,
} from '../components/Component';
import Content from '../layout/content/Content';
import Head from '../layout/head/Head';
import { getAuthenticatedApi, myServerApi } from '../utils/api';
import { dateFormatter, dateFormatterAlt, fromStringTodateFormatter } from '../utils/Utils';
import {
  cryptoActivityOptions,
  filterStatusOptions,
  filterCoin,
} from './TransData';
// Tab
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Helper from '../utils/Helper';
import { useHistory, useParams } from 'react-router';
import DatePickerMobile from 'react-mobile-datepicker'
import DatePicker from 'react-datepicker';

const WireHistory = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const email = localStorage.getItem("username");

  const [modal, setModal] = useState({
    add: false,
  });
  const [modalDetail, setModalDetail] = useState(false);
  const [data, setData] = useState("");
  const [detail, setDetail] = useState({});
  const [orderData, setOrderData] = useState("");
  const [formData, setFormData] = useState({
    orderType: "Deposit",
    amountBTC: "",
    amountUSD: "",
    balanceBTC: "",
    balanceUSD: "",
    status: "PENDING",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [displaySetting, setDisplaySetting] = useState({
    from: null,
    end: null,
    type : "",
    currency : "",
  });
  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.ref.localeCompare(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.ref.localeCompare(a.ref));
      setData([...sortedData]);
    }
  };
  function renameKey(obj, old_key, new_key) {   
    // check if old key = new key  
        if (old_key !== new_key) {                  
           Object.defineProperty(obj, new_key, // modify old key
                                // fetch description from object
           Object.getOwnPropertyDescriptor(obj, old_key));
           delete obj[old_key];                // delete old key
           }
    }
  // Changing state value when searching name
  useEffect(async () => {
      const secureApi = getAuthenticatedApi();
        dispatch(setChecking(true));
        // get report data from local db
        const myApi = myServerApi();
        await myApi.get(`/wirehistory/all/${email}`).then(res => {
          if (res) {
            let wirehistories = res.data.data;
            wirehistories = wirehistories.sort((a, b) => {
              return a.date < b.date? 1 : -1
            })
            setOrderData(wirehistories);
            setData(wirehistories);
            
          }
        }).catch(err => {
            console.log('error: ', err);
        });
        dispatch(setChecking(false));

       
  }, []);

    // Changing state value when searching name
    useEffect(() => {
      if ( orderData?.length > 0) {
        if (displaySetting.from !== null || displaySetting.end !== null || displaySetting.type !== "" || displaySetting.paidStatus !== "" || displaySetting.status !== "" || displaySetting.from !== null || displaySetting.end !== null) {
            let filteredObject = orderData;
            if (displaySetting.from !== null) {
              filteredObject = filteredObject.filter((item) => {
                return displaySetting.from <= new Date(item.date);
              });  
            } 
            if (displaySetting.end !== null) {
              filteredObject = filteredObject.filter((item) => {
                return new Date(item.date) <= new Date(displaySetting.end);
              });  
            }
            if (displaySetting.type !== "" &&  displaySetting.type !== "All") {
              filteredObject = filteredObject.filter((item) => {
                return item.entity_type.toLowerCase() == displaySetting.type.toLowerCase();
              });  
            }
            if (displaySetting.currency !== "" &&  displaySetting.currency !== "All") {
              filteredObject = filteredObject.filter((item) => {
                return item.product_id.toLowerCase() == displaySetting.currency.toLowerCase();
              });  
            }
            setData([...filteredObject]);
        } else {
           setData([...orderData]);
        }  
      }
      
  
    }, [onSearchText, displaySetting]);
  
  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [state, setState] = useState({
    time: new Date(),
    isOpen: false,
    isOpen1: false,
    theme: 'default',
})
  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggle = (isOpen) => () => {
      setState({ isOpen });
  }
  const handleToggle1 = (isOpen1) => () => {
      setState({ isOpen1 });
  }

  const handleThemeToggle = (theme) => () => {
      setState({ theme, isOpen: true });
  }
  const handleThemeToggle1 = (theme) => () => {
      setState({ theme, isOpen1: true });
  }

  return (
    <React.Fragment>
      <Head title="Trasaction List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Wire History</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} history.</p>
              </BlockDes>
            </BlockHeadContent>
            {/* <BlockHeadContent>
              <ul className="nk-block-tools g-3">
                <li>
                  <Button color="light" outline className="btn-white">
                    <Icon name="download-cloud"></Icon>
                    <span>Export</span>
                  </Button>
                </li>
                <li>
                  <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                    <Icon name="plus"></Icon>
                  </Button>
                </li>
              </ul>
            </BlockHeadContent> */}
          </BlockBetween>
        </BlockHead>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          </Box>
          <Block>
              <DataTable className="card-stretch">
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="card-title">
                      <h5 className="title">All History</h5>
                      <Row>
                        <FormGroup style={{width:"30%"}} className="d-none d-md-block">
                          <label className="form-label">Date(from)</label>
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.from}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                                setDisplaySetting({ ...displaySetting, from: date }); 
                              }}
                          />
                        </FormGroup>
                        <FormGroup className='d-md-none'>
                        <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(From)</label><br/>
                        <input style={{width:"60%"}}  value={dateFormatterAlt(displaySetting.from, true)}/>
                          <a
                              style={{opacity: "0", position:"absolute", left: "0"}}
                              className="select-btn sm"
                              onClick={handleThemeToggle('default')}>
                              {displaySetting.from === null ? "Select Date" : dateFormatterAlt(displaySetting.from, true)}
                          </a>
                          <DatePickerMobile
                          // value={displaySetting.from}
                          theme={state.theme}
                          isOpen={state.isOpen}
                          showCaption
                          dateConfig={{
                              'year': {
                                  format: 'YYYY',
                                  caption: 'Year',
                                  step: 1,
                              },
                              'month': {
                                  format: 'M',
                                  caption: 'Month',
                                  step: 1,
                              },
                              'date': {
                                  format: 'D',
                                  caption: 'Day',
                                  step: 1,
                              },
                          }}
                          onSelect={(date) => {setDisplaySetting({ ...displaySetting, from: date }); setState({isOpen:false})}}
                          onCancel={handleToggle(false)} />
                      </FormGroup>
                        <FormGroup style={{width:"30%", marginLeft:"20px"}} className="d-none d-md-block">
                          <label className="form-label">Date(to)</label>
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.end}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                                setDisplaySetting({ ...displaySetting, end: date }); 
                              }}
                          />
                        </FormGroup>
                        <FormGroup className='d-md-none'  >
                        <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(To)</label><br/>
                        <input style={{width:"60%"}}  value={dateFormatterAlt(displaySetting.end, true)}/>
                          <a
                            style={{opacity: "0", position:"absolute", left: "0"}}
                              className="select-btn sm"
                              onClick={handleThemeToggle1('default')}>
                              {displaySetting.end === null ? "Select Date" : dateFormatterAlt(displaySetting.end, true)}
                          </a>
                          <DatePickerMobile
                          theme={state.theme}
                          isOpen={state.isOpen1}
                          showCaption
                          dateConfig={{
                              'year': {
                                  format: 'YYYY',
                                  caption: 'Year',
                                  step: 1,
                              },
                              'month': {
                                  format: 'M',
                                  caption: 'Month',
                                  step: 1,
                              },
                              'date': {
                                  format: 'D',
                                  caption: 'Day',
                                  step: 1,
                              },
                          }}
                          onSelect={(date) => {setDisplaySetting({ ...displaySetting, end: date }); setState({isOpen1:false})}}
                          onCancel={handleToggle1(false)} />
                      </FormGroup>
                    </Row>
                    </div>

                    <div className="card-tools mr-n1">
                      <ul className="btn-toolbar gx-1">
                        {/* <li>
                          <Button
                            href="#search"
                            onClick={(ev) => {
                              ev.preventDefault();
                              toggle();
                            }}
                            className="btn-icon search-toggle toggle-search"
                          >
                            <Icon name="search"></Icon>
                          </Button>
                        </li> */}
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                              <div className="dot dot-primary"></div>
                              <Icon name="filter-alt"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right className="filter-wg dropdown-menu-xl">
                              <div className="dropdown-head">
                                <span className="sub-title dropdown-title">Advanced Filter</span>
                                {/* <div className="dropdown">
                                  <Button size="sm" className="btn-icon">
                                    <Icon name="more-h"></Icon>
                                  </Button>
                                </div> */}
                              </div>
                              <div className="dropdown-body dropdown-body-rg" style={{height: "250px"}}>
                                <Row className="gx-6 gy-4" >
                                  <Col size="6">
                                    <FormGroup>
                                      <label className="overline-title overline-title-alt">Type</label>
                                      <RSelect options={cryptoActivityOptions} onChange={(e) => setDisplaySetting({...displaySetting, type: e.value})} placeholder="Any Activity" />
                                    </FormGroup>
                                  </Col>
                                  <Col size="6">
                                    <FormGroup className="form-group">
                                      <label className="overline-title overline-title-alt">Currency</label>
                                      <RSelect options={filterCoin} placeholder="Any coin" onChange={(e) => setDisplaySetting({...displaySetting, currency: e.value})} />
                                    </FormGroup>
                                  </Col> 
                                </Row>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                              <Icon name="setting"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right className="dropdown-menu-xs">
                              <ul className="link-check">
                                <li>
                                  <span>Show</span>
                                </li>
                                <li className={itemPerPage === 10 ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setItemPerPage(10);
                                    }}
                                  >
                                    10
                                  </DropdownItem>
                                </li>
                                <li className={itemPerPage === 15 ? "active" : ""}>
                                  <DropdownItem
                                    tag="a"
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setItemPerPage(15);
                                    }}
                                  >
                                    15
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <DataTableBody bodyclass="nk-tb-tnx">
                  <DataTableHead>
                    <DataTableRow>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Date</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Bank name</span>
                    </DataTableRow>
                    <DataTableRow >
                      <span>Wire Id</span>
                    </DataTableRow>
                    <DataTableRow className="text-right" size="sm">
                      <span>Amount</span>
                    </DataTableRow>
                    <DataTableRow className="">
                      <span>Status</span>
                    </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <DataTableItem key={item.entity_id}>
                            <DataTableRow>
                              <div className="nk-tnx-type">
                                <div className="nk-tnx-type-text">
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow>
                              <div className="nk-tnx-type">
                                <div className="nk-tnx-type-text">
                                  <span className="tb-date">{fromStringTodateFormatter(item.date, true)}</span>
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <div className="nk-tnx-type">
                                <div className="nk-tnx-type-text">
                                  <span className="tb-date">{item.bank_name}</span>
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow className="">
                              <span className="tb-amount">
                                     <Link to ={`/wirehistory/${item.wireid}`}>{item.wireid}</Link>
                              </span>
                            </DataTableRow>
                            <DataTableRow className="text-right" size="sm">
                              <span className="tb-amount">
                                  {Helper.limitDecimal(item.amount, 2)} USD
                              </span>
                            </DataTableRow>
                            <DataTableRow >
                              {/* <div
                                className={`dot dot-${
                                    item.status === "0"
                                    ? "warning"
                                    : item.status === "1" || item.status === "2"
                                    ? "info"
                                    : item.status === "3"
                                    ? "success"
                                    : "danger"
                                } d-md-none`}
                              ></div> */}
                              <span
                                className={`badge badge-sm badge-dim badge-outline-${
                                  item.status === "0"
                                    ? "warning"
                                    : item.status === "1" || item.status === "2"
                                    ? "info"
                                    : item.status === "3"
                                    ? "success"
                                    : "danger"
                                } d-md-inline-flex`}
                              >
                                {item.status === "0" ? "Pending" : (item.status === "1" ? "Approved": item.status === "2" ? "Processing" : item.status === "3" ? "Completed" : "Decline")}
                              </span>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner">
                  {currentItems.length > 0 ? (
                    <PaginationComponent
                      noDown
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No data found</span>
                    </div>
                  )}
                </div>
              </DataTable>
            </Block>
      </Box>
        
      </Content>
    </React.Fragment>
  );
};
export default WireHistory;

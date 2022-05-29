import React, {
  useEffect,
  useState,
} from 'react';
import DatePickerMobile from 'react-mobile-datepicker'
import DatePicker from 'react-datepicker';

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
import { dateFormatter,dateCompare, hideEmail, dateFormatterAlt, fromStringTodateFormatter, fromStringTodateTimeFormatter } from '../utils/Utils';
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

const TransactionHistory = () => {
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
  const [orderDataUsd, setOrderDataUsd] = useState("");
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
        const exchange = "PLUSQO";
        let type = "";
        if(displaySetting.type !== ""){
          type = displaySetting.type.toUpperCase();
        }
        let temp;
        dispatch(setChecking(true));
        await secureApi.get(`/trade/orders/closed`).then(res => {
          if (res) {
              let transactions = res.data.items;
              transactions.forEach(obj => {
                if (obj.side === "sell")
                {
                  obj.entity_type = obj.side.toUpperCase();
                  obj.amount = obj.quantity;
                  obj.timestamp = obj.close_time;
                  obj.date = new Date(obj.timestamp);
                  obj.date.setTime(obj.date.getTime() - 9 * 60 * 60 * 1000)

                  obj.product_id = obj.instrument_id.substring(0,3);
                  if (obj.status === "completely_filled" || obj.status.toUpperCase() === "partially_filled") {
                    obj.status = "COMPLETED";
                    
                  } else {
                    obj.status = "Failed";
                    
                  }

                }  
              });
              temp = transactions.filter(obj =>  obj.entity_type === "SELL" && obj.status === "COMPLETED" && (obj.product_id === "BTC" || obj.product_id === "USDT" || obj.product_id === "ETH"))
            }
        })
        let dataForUsd = temp;
        dataForUsd.forEach(obj => {
          obj.status = "Crypto SELL";
          obj.date = new Date(obj.open_time);
          obj.date.setTime(obj.date.getTime() - 9 * 60 * 60 * 1000)
          obj.datetemp = obj.date;
          obj.amount1 = obj.amount;
          obj.amount2 = obj.amount * obj.average_price;
          obj.balance2 = 0;
          for (const key in  obj.transactions) {
              const element = obj.transactions[key];
              if (element.post_balance > obj.balance2)
                obj.balance2 = element.post_balance;
          }
          obj.type = obj.product_id;

        })
        
        await secureApi.get(`/wallet/transaction/history?exchange=${exchange}&type=${type}`).then(res => {
          if (res) {
            let transactions = res.data.transactions;
            transactions.forEach(obj => renameKey(obj, 'txid', 'transactionId'));
            transactions.forEach(obj => renameKey(obj, 'state_hash', 'transactionHash'));
            transactions.forEach(obj => renameKey(obj, 'type', 'entity_type'));
            transactions.forEach(obj => renameKey(obj, 'created_at_timestamp', 'timestamp'));
            transactions.forEach(obj => renameKey(obj, 'product', 'product_id'));
            transactions.forEach(obj => {
              obj.date = new Date(obj.timestamp);
              obj.date.setTime(obj.date.getTime() - 9 * 60 * 60 * 1000)
    
            })
            temp = [...temp, ...transactions.filter(obj =>  obj.status === "COMPLETED" && (obj.product_id === "BTC" || obj.product_id === "USDT" || obj.product_id === "ETH"))]
            

          }
        }).catch(err => {
            console.log('error: ', err);
        });
       
      
        // get report data from local db
        const myApi = myServerApi();
        await myApi.get(`/report/${email}`).then(res => {
          if (res) {
            let reports = res.data.data;
             reports.forEach(element => {
              if (element.status === "SELL"){
                element.status =  "Crypto SELL";
              // element.detail = `Sell ${element.amount1} ${element.type}`;
              }
              if (element.status === "WIRE"){
                element.status =  "Wire";
                // element.detail = `WireID is <Link>WID${element.id}</Link>`;
              }
              if (element.status === "FAIL"){
                element.status =  "Back";
                // element.detail = `WID${element.id} was failed`;
              }
              element.datetemp = new Date(element.date);
              // element.datetemp.setTime(element.datetemp.getTime() + 3 * 60 * 60 * 1000)
              element.date = new Date(element.date);
              
            });
           
            reports = reports.sort((a, b) => {
              return a.date < b.date? 1 : -1
            })
            let tempForUsd = [...dataForUsd, ...reports];
            tempForUsd = tempForUsd.sort((a, b) => {
              return a.datetemp < b.datetemp? 1 : -1 
            })
            setOrderDataUsd(tempForUsd);
            reports.forEach(element => {
              if (element.status === "Crypto SELL"){
                element.product_id = element.type;
                element.entity_type = "SELL";
                element.amount = element.amount1;
                element.timestamp = element.date;
                // element.detail = `Sell ${element.amount1} ${element.type}`;
              } 
              
            });
            let usdt_reports = reports.filter(elm => {
              return elm.entity_type === "SELL";
            })
            temp = [...temp, ...usdt_reports];
          }
        }).catch(err => {
            console.log('error: ', err);
        });
        temp.forEach(element => {
          element.datetemp = new Date(element.date);
          element.timestamp = dateFormatterAlt(element.date, true)
        });
        temp = temp.sort((a, b) => {
          return a.datetemp < b.datetemp? 1 : -1
        })
        setData(temp); 
        setOrderData(temp);
        dispatch(setChecking(false));
      }, []);

    // Changing state value when searching name
    useEffect(() => {
      if ( orderData?.length > 0) {
        if (displaySetting.from !== null || displaySetting.end !== null || displaySetting.type !== "" || displaySetting.paidStatus !== "" || displaySetting.status !== "" || displaySetting.from !== null || displaySetting.end !== null) {
            let filteredObject = orderData;
            if (value === 1) {
              filteredObject = orderDataUsd;
            }
            if (displaySetting.from !== null ) {
              filteredObject = filteredObject.filter((item) => {
                return displaySetting.from <=  item.datetemp ;
              });  
            } 
            if (displaySetting.end !== null) {
              filteredObject = filteredObject.filter((item) => {
                return item.datetemp <= displaySetting.end ;
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
           if (value === 1) {
             setData([...orderDataUsd]);

           }
        }  
      }
      
  
    }, [onSearchText, displaySetting]);
  
  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  const [state, setState] = useState({
    time: new Date(),
    isOpen: false,
    isOpen1: false,
    theme: 'default',
})

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


  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    
    if (newValue === 0){
      setData(orderData);
    }
    else {
      setData(orderDataUsd);
    }
  };

  return (
    <React.Fragment>
      <Head title="Trasaction List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Transaction History</BlockTitle>
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
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="CRYPTO" {...a11yProps(0)} />
              <Tab label="USD" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Block>
              <DataTable className="card-stretch">
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="card-title">
                      <h5 className="title">All History</h5>
                      <Row>
                        <FormGroup style={{width:"30%"}} className="d-none d-md-block">
                          <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(From)</label>
                          
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.from}
                            className="form-control d-none d-md-block"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                                setDisplaySetting({ ...displaySetting, from: date }); 
                                console.log(dateFormatterAlt(date, true));
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
                        <FormGroup style={{width:"30%", marginLeft:"20px"}}  className="d-none d-md-block">
                          <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(To)</label>
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.end}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            minDate={displaySetting.from}
                            onChange={(date) => setDisplaySetting({ ...displaySetting, end: date })}
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
                    <DataTableRow >
                      <span>Type</span>
                    </DataTableRow>
                    <DataTableRow >
                      <span>Currency</span>
                    </DataTableRow>
                    <DataTableRow className="text-right">
                      <span>Amount</span>
                    </DataTableRow>
                    <DataTableRow size="sm" className="text-right">
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
                                  <span className="tb-lead">{item.desc}</span>
                                  <span className="tb-date">{item.timestamp}</span>
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow >
                              {/* <span className="tb-lead-sub">{item.entity_type}</span> */}
                              <span
                                className={`badge badge-dot badge-${
                                  item.entity_type === "SELL"
                                    ? "success"
                                    : item.entity_type === "WITHDRAW"
                                    ? "warning"
                                    : item.entity_type === "DEPOSIT"
                                    ? "info"
                                    : "danger"
                                }`}
                              >
                                {item.entity_type}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                                  <span className="tb-type">{item.product_id}</span>
                            </DataTableRow>
                            <DataTableRow className="text-right">
                              <span className="tb-amount">
                                {item.amount} <span>{item.product_id}</span>
                              </span>
                              {/* <span className="tb-amount-sm">{item.amountUSD} USD</span> */}
                            </DataTableRow>
                            <DataTableRow className="text-right" size="sm">
                              <span className="tb-amount">
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
          </TabPanel>
          <TabPanel value={value} index={1}>
          <Block>
              <DataTable className="card-stretch">
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="card-title">
                      <h5 className="title">All History</h5>
                      <Row>
                        <FormGroup style={{width:"30%"}} className="d-none d-md-block">
                          <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(From)</label>
                          
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.from}
                            className="form-control d-none d-md-block"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                                setDisplaySetting({ ...displaySetting, from: date }); 
                                console.log(dateFormatterAlt(date, true));
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
                        <FormGroup style={{width:"30%", marginLeft:"20px"}}  className="d-none d-md-block">
                          <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(To)</label>
                          <DatePicker
                            style = {{"zIndex": "9999"}}
                            selected={displaySetting.end}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            minDate={displaySetting.from}
                            onChange={(date) => setDisplaySetting({ ...displaySetting, end: date })}
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
                        {/* <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                              <div className="dot dot-primary"></div>
                              <Icon name="filter-alt"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right className="filter-wg dropdown-menu-xl">
                              <div className="dropdown-head">
                                <span className="sub-title dropdown-title">Advanced Filter</span>
                               
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
                        </li> */}
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
                    <DataTableRow >
                      <span>Type</span>
                    </DataTableRow>
                    <DataTableRow >
                      <span>Detail</span>
                    </DataTableRow>
                    <DataTableRow size="sm" className="text-right">
                      <span>Amount</span>
                    </DataTableRow>
                    <DataTableRow size="sm" className="text-right">
                      <span>Balance</span>
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
                                  <span className="tb-date">{dateFormatterAlt(item.date, true)}</span>
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow >
                              <span
                                className={`badge badge-dot badge-${
                                  item.status === "Wire"
                                    ? "warning"
                                    : item.status === "Back"
                                    ? "danger"
                                    : item.status === "Crypto SELL"
                                    ? "success"
                                    : "danger"
                                }`}
                              >
                                {item.status}
                              </span>
                            </DataTableRow>
                            <DataTableRow className="">
                              <span className="tb-amount">
                                {
                                    item.status === "Wire" ? <>WireID is <Link to ={`/wirehistory/${item.wireid}`}>{item.wireid}</Link></>:
                                    (item.status === "Back" ? <>{item.wireid} was failed</>:
                                    <>Sell {item.amount1} {item.type}</>)
                                }

                              </span>
                            </DataTableRow>
                            <DataTableRow className="text-right" size="sm">
                              <span className="tb-amount">
                                  {Helper.limitDecimal(item.amount2, 2)} USD
                              </span>
                            </DataTableRow>
                            <DataTableRow className="text-right" size="sm">
                              <span className="tb-amount">
                                  {Helper.limitDecimal(item.balance2, 2)} USD
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
          </TabPanel>
      </Box>
        
      </Content>
    </React.Fragment>
  );
};
export default TransactionHistory;

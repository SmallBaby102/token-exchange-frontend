import React, {
  useEffect,
  useState,
} from 'react';

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
  // Route,
  // Switch,
} from 'react-router-dom';
import { setChecking } from '../actions';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  // Button,
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
import { dateFormatterWithdoutTime, dateFormatterAlt, fromStringTodateFormatter, fromStringTodatetimeFormatter } from '../utils/Utils';
import {
  filterStatusOptions,
} from './TransData';
// Tab
import Box from '@mui/material/Box';
import Helper from '../utils/Helper';
import { useParams } from 'react-router';
import DatePickerMobile from 'react-mobile-datepicker'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from 'react-i18next'
const WireHistory = () => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  const [onSearchText, setSearchText] = useState("");
  const email = localStorage.getItem("username");
  const [data, setData] = useState("");
  const [orderData, setOrderData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [displaySetting, setDisplaySetting] = useState({
    from: null,
    end: null,
    type : "",
    status : "All",
  });
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
        if (displaySetting.from !== null || displaySetting.end !== null || displaySetting.status !== "") {
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
            if (displaySetting.status !== "" &&  displaySetting.status !== "All") {
              filteredObject = filteredObject.filter((item) => {
                return item.status.toLowerCase() === displaySetting.status.toLowerCase();
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
      <Head title={t('Wire History')}></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>{t('Wire History')}</BlockTitle>
              <BlockDes className="text-soft">
                <p>{t('desc', {total: data.length})}</p>
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
                      <h5 className="title">{t('all_history')}</h5>
                      <Row>
                        <FormGroup style={{width:"30%"}} className="d-none d-md-block mt-3">
                             <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                  <DesktopDatePicker
                                    label={`${t('date')}(${t('from')})`}
                                    inputFormat="dd/MM/yyyy"
                                    value={displaySetting.from}
                                    onChange={(date) => {if(!date || date == "Invalid Date") return; setDisplaySetting({ ...displaySetting, from: date }); }}
                                    renderInput={(params) => <TextField {...params} />}
                                  />
                                  </Stack>
                              </LocalizationProvider>
                        </FormGroup>
                        <FormGroup className='d-md-none'>
                          <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>{`${t('date')}(${t('from')})`}</label><br/>
                          <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.from, true)}/>
                          <a
                              style={{opacity: "0",width:"60%", position:"absolute", left: "0"}}
                              className="select-btn sm"
                              onClick={handleThemeToggle('default')}>
                              {displaySetting.from === null ? t('select_date') : dateFormatterAlt(displaySetting.from, true)}
                          </a>
                          <DatePickerMobile
                          value={displaySetting.from !== null ? new Date(displaySetting.from) : new Date()}
                          theme={state.theme}
                          isOpen={state.isOpen}
                          showCaption
                          headerFormat="DD/MM/YYYY"
                          confirmText={t('set')}
                          cancelText={t('cancel')}
                          dateConfig={{
                            'date': {
                              format: 'D',
                              caption: 'Day',
                              step: 1,
                              },
                              'month': {
                                  format: 'M',
                                  caption: 'Month',
                                  step: 1,
                              },
                              'year': {
                                format: 'YYYY',
                                caption: 'Year',
                                step: 1,
                              },
                          }}
                          onSelect={(date) => {setDisplaySetting({ ...displaySetting, from: date }); setState({isOpen:false})}}
                          onCancel={handleToggle(false)} />
                        </FormGroup>
                        <FormGroup style={{width:"30%", marginLeft:"20px"}} className="d-none d-md-block mt-3">
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={3}>
                                  <DesktopDatePicker
                                    label={`${t('date')}(${t('to')})`}
                                    minDate={displaySetting.from}
                                    inputFormat="dd/MM/yyyy"
                                    value={displaySetting.end}
                                    onChange={(date) => {if(!date || date == "Invalid Date") return; setDisplaySetting({ ...displaySetting, end: date }); }}
                                    renderInput={(params) => <TextField {...params} />}
                                  />
                                  </Stack>
                              </LocalizationProvider>
                        </FormGroup>
                        <FormGroup className='d-md-none'  >
                        <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>{`${t('date')}(${t('to')})`}</label><br/>
                        <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.end, true)}/>
                          <a
                            style={{opacity: "0",width:"60%", position:"absolute", left: "0"}}
                              className="select-btn sm"
                              onClick={handleThemeToggle1('default')}>
                              {displaySetting.end === null ? t('select_date') : dateFormatterAlt(displaySetting.end, true)}
                          </a>
                          <DatePickerMobile
                          value={displaySetting.end !== null ? new Date(displaySetting.end) : new Date()}
                          theme={state.theme}
                          isOpen={state.isOpen1}
                          showCaption
                          headerFormat="DD/MM/YYYY"
                          confirmText={t('set')}
                          cancelText={t('cancel')}
                          dateConfig={{
                            'date': {
                              format: 'D',
                              caption: 'Day',
                              step: 1,
                              },
                              'month': {
                                  format: 'M',
                                  caption: 'Month',
                                  step: 1,
                              },
                              'year': {
                                format: 'YYYY',
                                caption: 'Year',
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
                                <span className="sub-title dropdown-title">{t('advanced_filter')}</span>
                                {/* <div className="dropdown">
                                  <Button size="sm" className="btn-icon">
                                    <Icon name="more-h"></Icon>
                                  </Button>
                                </div> */}
                              </div>
                              <div className="dropdown-body dropdown-body-rg" style={{height: "250px", overflowY: "scroll"}}>
                                <Row className="gx-6 gy-4" >
                                  <Col size="6">
                                    <FormGroup>
                                      <label className="overline-title overline-title-alt">{t('status')}</label>
                                      <RSelect options={filterStatusOptions} defaultValue={{value: displaySetting.status, label: displaySetting.status === "0" ? "Pending" : (displaySetting.status === "1" ? "Approved": displaySetting.status === "2" ? "Processing" : displaySetting.status === "3" ? "Completed" : displaySetting.status === "All" ? "All" : "Decline")}} onChange={(e) => setDisplaySetting({...displaySetting, status: e.value})} placeholder="Any Status" />
                                    </FormGroup>
                                  </Col>
                                  {/* <Col size="6">
                                    <FormGroup className="form-group">
                                      <label className="overline-title overline-title-alt">Currency</label>
                                      <RSelect options={filterCoin} placeholder="Any coin" onChange={(e) => setDisplaySetting({...displaySetting, currency: e.value})} />
                                    </FormGroup>
                                  </Col>  */}
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
                                  <span>{t('show')}</span>
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
                      <span>{t('date')}</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>{t('bank_name')}</span>
                    </DataTableRow>
                    <DataTableRow >
                      <span>{t('wire_id')}</span>
                    </DataTableRow>
                    <DataTableRow className="text-right" >
                      <span>{t('amount')}</span>
                    </DataTableRow>
                    <DataTableRow className="text-right" >
                      <span>{t('received_amount')}</span>
                    </DataTableRow>
                    <DataTableRow className="">
                      <span>{t('status')}</span>
                    </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <DataTableItem key={item.entity_id}>
                            <DataTableRow size="sm">
                              <div className="nk-tnx-type">
                                <div className="nk-tnx-type-text">
                                  <span className="tb-date">{fromStringTodatetimeFormatter(item.date, true)}</span>
                                </div>
                              </div>
                            </DataTableRow>
                            <DataTableRow className="d-md-none">
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
                            <DataTableRow className="text-right" >
                              <span className="tb-amount">
                                  {Helper.limitDecimal(item.amount, 2)} USD
                              </span>
                            </DataTableRow>
                            <DataTableRow className="text-right" >
                              <span className="tb-amount">
                                  {Helper.limitDecimal(item.receive_amount, 2)} USD
                              </span>
                            </DataTableRow>
                            <DataTableRow >
                              <div
                                className={`dot dot-${
                                    item.status === "0"
                                    ? "warning"
                                    : item.status === "1" || item.status === "2"
                                    ? "info"
                                    : item.status === "3"
                                    ? "success"
                                    : "danger"
                                } d-md-none`}
                              ></div>
                              <span
                                style={{width: "80px", justifyContent: "center"}}
                                className={`badge badge-sm badge-dim badge-outline-${
                                  item.status === "0"
                                    ? "warning"
                                    : item.status === "1" || item.status === "2"
                                    ? "info"
                                    : item.status === "3"
                                    ? "success"
                                    : "danger"
                                } d-md-inline-flex d-none`}
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
                      <span className="text-silent">{t('nodata')}</span>
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

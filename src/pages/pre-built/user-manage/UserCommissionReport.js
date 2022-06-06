import React, {
  useEffect,
  useState,
} from 'react';
import DatePicker from 'react-datepicker';

// import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
} from 'reactstrap';

import { setChecking } from '../../../actions';
import {
  Block,
  BlockBetween,
  // BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  // DataTable,
  // DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  Row,
  RSelect,
} from '../../../components/Component';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import Helper from '../../../utils/Helper';
import { fromStringTodateFormatter, dateFormatterAlt,dateFormatterWithdoutTime, dateCompare, hideEmail } from '../../../utils/Utils';
import {
  commissionTypeOptions,
  commissionStatusOptions,
  commissionPaidStatusOptions,
} from '../../TransData';
 import DatePickerMobile from 'react-mobile-datepicker';
 import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
const UserCommissionReport = ({setProfileProgress, sm, updateSm, setProfileName }) => {
  const dispatch = useDispatch();
  // const [onSearch, setonSearch] = useState(true);
  // const [onSearchText, setSearchText] = useState("");
  // const user = useSelector(state => state.user.user);
  const email = localStorage.getItem("username");
  // const [modalDetail, setModalDetail] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [data, setData] = useState([]);
  const [total_commission_pending_approval, setTotal_commission_pending_approval] = useState("");
  const [total_commission_unpaid, setTotal_commission_unpaid] = useState("");
  const [total_commission_paid, setTotal_commission_paid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [closeDropdown, setCloseDropdown] = useState(false);
  const [displaySetting, setDisplaySetting] = useState({
    from: null,
    end: null,
    type : "All",
    status : "All",
    paidStatus : "All",
  });
  useEffect(() => {
    const myApi = myServerApi();
    dispatch(setChecking(true));
    // let username = "Tomtony202232@outlook.com"
    myApi.get(`commission_report/${email}`)
    .then(res => {
      let temp = res.data.commission_arr;
      temp = temp.sort((a, b) => {
        return a.dateinserted < b.dateinserted? 1 : -1
      })
      setOrderData(temp);
      setData(temp);
      setTotal_commission_pending_approval(res.data.total_commission_pending_approval)
      setTotal_commission_unpaid(res.data.total_commission_unpaid)
      setTotal_commission_paid(res.data.total_commission_paid)
      dispatch(setChecking(false));
    })
    .catch(err => {
      setOrderData([]);
      setData([]);
      dispatch(setChecking(false));
      console.log("get commission report error", err)
    })
  }, [])
  // Changing state value when searching name
  useEffect(() => {
    if ( orderData?.length > 0) {
      if (displaySetting.type !== "" || displaySetting.paidStatus !== "" || displaySetting.status !== "" || displaySetting.from !== null || displaySetting.end !== null) {
          let filteredObject = orderData;
          if (displaySetting.from !== null) {
            filteredObject = filteredObject.filter((item) => {
              return displaySetting.from <= new Date(item.dateinserted);
            });  
          } 
          if (displaySetting.end !== null) {
            filteredObject = filteredObject.filter((item) => {
              return  new Date(item.dateinserted) <= displaySetting.end;
            });  
          }
          if (displaySetting.type !== "" &&  displaySetting.type !== "All") {
            filteredObject = filteredObject.filter((item) => {
              return item.type.toLowerCase() == displaySetting.type.toLowerCase();
            });  
          }
          if (displaySetting.status !== "" &&  displaySetting.status !== "All") {
            filteredObject = filteredObject.filter((item) => {
              return item.rstatus.toLowerCase() == displaySetting.status.toLowerCase();
            });
          }

          if (displaySetting.paidStatus !== "" &&  displaySetting.paidStatus !== "All") {
            filteredObject = filteredObject.filter((item) => {
              return item.payoutstatus.toLowerCase() == displaySetting.paidStatus.toLowerCase();
            });
          }
          setData([...filteredObject]);
      } else {
         setData([...orderData]);
      }  
    }
    

  }, [displaySetting]);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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

// const handleSelect = (time) => {
//     setState({ time, isOpen: false });
//     setDisplaySetting({ ...displaySetting, from: time })
// }
  return (
    <React.Fragment>
      <Head title="Trasaction List"></Head>
        <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
              <BlockTitle page>Commission Report</BlockTitle>
          </BlockHeadContent>
          <BlockHeadContent className="align-self-start d-lg-none">
            <Button
              className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
              onClick={() => updateSm(!sm)}
            >
              <Icon name="menu-alt-r"></Icon>
            </Button>
          </BlockHeadContent>
        </BlockBetween>
        </BlockHead>
        <Block >
          <div style={{fontSize: ".8rem"}}>
            <div className="card-inner" style={{paddingBottom: "0"}}>
              <div className="card-title-group">
                <div className="card-title">
                  <div className="justify-content-around " style={{ justifyContent:"space-around", display: "flex"}}>
                      <label className="" style={{fontSize: "1rem"}}>Pending {total_commission_pending_approval? Helper.limitDecimal(total_commission_pending_approval, 2): "0.00"} USDT</label> 
                      <label className="" style={{fontSize: "1rem"}}>Unpaid {total_commission_unpaid? Helper.limitDecimal(total_commission_unpaid, 2): "0.00"} USDT</label> 
                      <label className="" style={{fontSize: "1rem"}}>Paid {total_commission_paid? Helper.limitDecimal(total_commission_paid, 2): "0.00"} USDT</label> 

                  </div> 
                  <Row>
                    <FormGroup style={{width:"30%"}} className="d-none d-md-block">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              label="Date(From)"
                              inputFormat="dd/MM/yyyy"
                              value={displaySetting.from}
                              onChange={(date) => {setDisplaySetting({ ...displaySetting, from: date }); }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            </Stack>
                        </LocalizationProvider>
                     

                    </FormGroup>
                    <FormGroup className='d-md-none'>
                       <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(From)</label><br/>
                       <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.from, true)}/>
                        <a
                            style={{opacity: "0",width:"60%", position:"absolute", left: "0"}}
                            className="select-btn sm"
                            onClick={handleThemeToggle('default')}>
                            {displaySetting.from === null ? "Select Date" : dateFormatterAlt(displaySetting.from, true)}
                        </a>
                        <DatePickerMobile
                        value={new Date(displaySetting.from)}
                        theme={state.theme}
                        isOpen={state.isOpen}
                        showCaption
                        headerFormat="DD/MM/YYYY"
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
                    <FormGroup style={{width:"30%", marginLeft:"20px"}}  className="d-none d-md-block">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              label="Date(To)"
                              inputFormat="dd/MM/yyyy"
                              value={displaySetting.end}
                              minDate={displaySetting.from}
                              onChange={(date) => {setDisplaySetting({ ...displaySetting, end: date }); }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            </Stack>
                        </LocalizationProvider>
                    </FormGroup>
                    <FormGroup className='d-md-none'  >
                       <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>Date(To)</label><br/>
                       <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.end, true)}/>
                        <a
                          style={{opacity: "0",width:"60%", position:"absolute", left: "0"}}
                            className="select-btn sm"
                            onClick={handleThemeToggle1('default')}>
                            {displaySetting.end === null ? "Select Date" : dateFormatterAlt(displaySetting.end, true)}
                        </a>
                        <DatePickerMobile
                        value={new Date(displaySetting.end)}
                        theme={state.theme}
                        isOpen={state.isOpen1}
                        showCaption
                        headerFormat="DD/MM/YYYY"
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
                        <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle"  >
                          <div className="dot dot-primary"></div>
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        {
                          !closeDropdown && 
                        <DropdownMenu right className="filter-wg dropdown-menu-xl">
                          <div className="dropdown-head">
                            <span className="sub-title dropdown-title">Advanced Filter</span>
                          </div>
                          <div className="dropdown-body dropdown-body-rg" style={{height: "330px"}}>
                            <Row className="gx-6 gy-4" >
                              <Col size="6">
                                <FormGroup>
                                  <label className="overline-title overline-title-alt">Type</label>
                                  <RSelect options={commissionTypeOptions} onChange={(e) => setDisplaySetting({...displaySetting, type: e.value})} placeholder="Any Type" />
                                </FormGroup>
                              </Col>
                              <Col size="6">
                                <FormGroup>
                                  <label className="overline-title overline-title-alt">Status</label>
                                  <RSelect options={commissionStatusOptions} onChange={(e) => setDisplaySetting({...displaySetting, status: e.value})} placeholder="Any Status" />
                                </FormGroup>
                              </Col>
                               <Col size="6">
                                <FormGroup className="form-group">
                                  <label className="overline-title overline-title-alt">Paid Status</label>
                                  {displaySetting.status === "Pending"? <RSelect isDisabled={true} placeholder="-" /> :<RSelect options={commissionPaidStatusOptions} onChange={(e) => setDisplaySetting({...displaySetting, paidStatus: e.value})}  placeholder="Any Status" />}
                                  
                                </FormGroup>
                              </Col> 
                              
                              {/* <Col size="12">
                                <FormGroup className="form-group">
                                  <Button type="button" onClick={(e) => {  setCloseDropdown(true)}} className="btn btn-secondary">
                                    Close
                                  </Button>
                                </FormGroup>
                              </Col> */}
                            </Row>
                          </div>
                        </DropdownMenu>}
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
                          {/* <ul className="link-check">
                            <li>
                              <span>Order</span>
                            </li>
                            <li className={sort === "dsc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("dsc");
                                  sortFunc("dsc");
                                }}
                              >
                                DESC
                              </DropdownItem>
                            </li>
                            <li className={sort === "asc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("asc");
                                  sortFunc("asc");
                                }}
                              >
                                ASC
                              </DropdownItem>
                            </li>
                          </ul> */}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{overflow: "overlay"}} bodyclass="nk-tb-tnx">
              <DataTableHead>
                <DataTableRow>
                  <span>Date</span>
                </DataTableRow>
                <DataTableRow >
                  <span>User</span>
                </DataTableRow>
                <DataTableRow class="nk-tb-col tb-col-lg">
                  <span>Type</span>
                </DataTableRow>
                <DataTableRow className="text-right">
                  <span>Wire Amount</span>
                </DataTableRow>
                <DataTableRow size="sm" className="text-right">
                  <span>Commission</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-status">
                  <span className="sub-text ">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-status">
                  <span className="sub-text ">Paid</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools"></DataTableRow>
              </DataTableHead>

              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="nk-tnx-type">
                              <div className="nk-tnx-type-text">
                                <span className="tb-date">{fromStringTodateFormatter(item.dateinserted, true)}</span>
                              </div>
                          </div>
                        </DataTableRow>
                        <DataTableRow >
                              <span className="tb-amount d-none d-md-inline-flex">
                                {hideEmail(item.orderid)}
                              </span>
                              <span className="tb-amount d-md-none">
                                 {hideEmail(item.orderid).substring(0,3)}
                              </span>
                        </DataTableRow>
                        <DataTableRow class="nk-tb-col tb-col-lg">
                          <span className="tb-amount">{item.type}</span>
                        </DataTableRow>
                        <DataTableRow className="text-right">
                          <span className="tb-amount">
                             {Helper.limitDecimal(item.totalcost,2)}
                          </span>
                        </DataTableRow>
                        <DataTableRow className="text-right">
                          <span className="tb-amount">
                             {Helper.limitDecimal(item.commission,2)}
                          </span>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-status">
                          {/* <div
                            className={`dot dot-${
                              item.rstatus === "APPROVED"
                                ? "success"
                                : item.rstatus === "Upcoming"
                                ? "warning"
                                : item.rstatus === "PENDING"
                                ? "warning"
                                : "danger"
                            } d-md-none`}
                          ></div> */}
                          <span
                            className={`badge badge-sm badge-dim badge-outline-${
                              item.rstatus === "APPROVED"
                                ? "success"
                                : item.rstatus === "Upcoming"
                                ? "warning"
                                : item.rstatus === "PENDING"
                                ? "warning"
                                : "danger"
                            } d-md-inline-flex`}
                          >
                            {item.rstatus}
                          </span>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-status">
                          {
                            item.rstatus !== "PENDING" && item.rstatus !== "DECLINE"  &&
                            <div
                              className={`dot dot-${
                                item.payoutstatus === "PAID"
                                  ? "success"
                                  : item.payoutstatus === "Upcoming"
                                  ? "warning"
                                  : item.payoutstatus === "UNPAID"
                                  ? "warning"
                                  : "danger"
                              } d-md-none`}
                            ></div>
                          }
                           {
                            item.rstatus !== "PENDING" && item.rstatus !== "DECLINE" &&
                            <span
                              className={`badge badge-sm badge-dim badge-outline-${
                                item.payoutstatus === "PAID"
                                  ? "success"
                                  : item.payoutstatus === "Upcoming"
                                  ? "warning"
                                  : item.payoutstatus === "UNPAID"
                                  ? "warning"
                                  : "danger"
                              } d-none d-md-inline-flex`}
                            >
                              {item.payoutstatus}
                            </span>
                          }
                        </DataTableRow>
                        {/* <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li
                              className="nk-tb-action-hidden"
                              onClick={() => {
                                loadDetail(item.id);
                                toggleModalDetail();
                              }}
                            >
                              <TooltipComponent
                                tag="a"
                                containerClassName="bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip"
                                id={item.ref + "details"}
                                icon="eye"
                                direction="top"
                                text="Details"
                              />
                            </li>
                            {item.rstatus !== "COMPLETED" && item.rstatus !== "Rejected" && (
                              <React.Fragment>
                                <li className="nk-tb-action-hidden" onClick={() => onApproveClick(item.id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip"
                                    id={item.ref + "approve"}
                                    icon="done"
                                    direction="top"
                                    text="approve"
                                  />
                                </li>
                                <li className="nk-tb-action-hidden" onClick={() => onRejectClick(item.id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip"
                                    id={item.ref + "reject"}
                                    icon="cross-round"
                                    direction="top"
                                    text="Reject"
                                  />
                                </li>
                              </React.Fragment>
                            )}
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="dropdown-toggle bg-white btn btn-sm btn-outline-light btn-icon"
                                >
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    {item.rstatus !== "COMPLETED" && item.rstatus !== "Rejected" && (
                                      <React.Fragment>
                                        <li onClick={() => onApproveClick(item.id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#approve"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="done"></Icon>
                                            <span>Approve</span>
                                          </DropdownItem>
                                        </li>
                                        <li onClick={() => onRejectClick(item.id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#reject"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="cross-round"></Icon>
                                            <span>Reject</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                    <li
                                      onClick={() => {
                                        loadDetail(item.id);
                                        toggleModalDetail();
                                      }}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#details"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>Details</span>
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow> */}
                      </DataTableItem>
                    );
                  })
                : null}
            </div>
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
          </div>
        </Block>
    </React.Fragment>
  );
};

export default UserCommissionReport;
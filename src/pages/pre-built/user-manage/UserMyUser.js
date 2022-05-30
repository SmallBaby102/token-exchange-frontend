import { Help, TrendingUpRounded } from '@mui/icons-material';
import React, {
  useEffect,
  useState,
} from 'react';
import DatePicker from 'react-datepicker';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../../../components/Component';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import { myServerApi, getAuthenticatedApi } from '../../../utils/api';
import Helper from '../../../utils/Helper';
import { fromStringTodateFormatter, dateFormatterAlt, dateCompare, hideEmail, dateFormatterWithdoutTime } from '../../../utils/Utils';
import {
  commissionTypeOptions,
  commissionStatusOptions,
  commissionPaidStatusOptions,
} from '../../TransData';
import DatePickerMobile from 'react-mobile-datepicker'
 
const UserMyUser = ({setProfileProgress, sm, updateSm, setProfileName }) => {
  const dispatch = useDispatch();
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const user = useSelector(state => state.user.user);
  const email = localStorage.getItem("username");
  const [modalDetail, setModalDetail] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [data, setData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [displaySetting, setDisplaySetting] = useState({
    from: null,
    end: null,
    tier1 : false,
    tier2 : false,
    tier3 : false,
    type : "",
    status : "",
    paidStatus : "",
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
    useEffect(() => {
      if (data.length > 0 ) return;
      const myApi = myServerApi();
      dispatch(setChecking(true));
      // let username = "Tomtony202232@outlook.com"
      myApi.get(`commission_myuser/${email}`)
      .then(res => {
        let temp = res.data.commission_arr;
        temp = temp.sort((a, b) => {
          return a.dateinserted < b.dateinserted? 1 : -1
        })
        setOrderData(temp);
        setData(temp);
        dispatch(setChecking(false));
      })
      .catch(err => {
        dispatch(setChecking(false));
        console.log("get commission user error", err)
      })
    }, [])
  // Changing state value when searching name
  useEffect(() => {
    if ( orderData?.length > 0) {
          let filteredObject = orderData;
          if (displaySetting.from !== null) {
            filteredObject = filteredObject.filter((item) => {
              return !dateCompare(dateFormatterAlt(displaySetting.from, true).toLowerCase(), fromStringTodateFormatter(item.dateinserted, true).toLowerCase());
            });  
          } 
          if (displaySetting.end !== null) {
            filteredObject = filteredObject.filter((item) => {
              return !dateCompare(fromStringTodateFormatter(item.dateinserted, true).toLowerCase(), dateFormatterAlt(displaySetting.end, true).toLowerCase());
            });  
          }
          // 
          if (displaySetting.tier1 && displaySetting.tier2 && displaySetting.tier3) {
            filteredObject = filteredObject.filter((item) => {
              return (item.type.toLowerCase() == "tier1".toLowerCase() || item.type.toLowerCase() == "tier2".toLowerCase() || item.type.toLowerCase() == "tier3".toLowerCase());
            }); 
          }else{
              if (displaySetting.tier2 && displaySetting.tier1) {
                filteredObject = filteredObject.filter((item) => {
                  return (item.type.toLowerCase() == "tier2".toLowerCase() || item.type.toLowerCase() == "tier1".toLowerCase());
                });  
              }else{
                console.log("else")
                if (displaySetting.tier3 && displaySetting.tier1) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() == "tier3".toLowerCase() || item.type.toLowerCase() == "tier1".toLowerCase());
                  });  
                } else if (displaySetting.tier2 && displaySetting.tier3) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() == "tier2".toLowerCase() || item.type.toLowerCase() == "tier3".toLowerCase());
                  });  
                } else if (displaySetting.tier1) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() == "tier1".toLowerCase());
                  });
                } else if (displaySetting.tier2) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() == "tier2".toLowerCase());
                  });
                } else if (displaySetting.tier3) {
                  console.log("tier3")
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() == "tier3".toLowerCase());
                  });
                }
              } 
          }
          setData([...filteredObject]);
    }
    

  }, [onSearchText, displaySetting]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };


  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // function to toggle details modal
  const toggleModalDetail = () => setModalDetail(!modalDetail);

  const { errors, register, handleSubmit } = useForm();
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
  return (
    <React.Fragment>
      <Head title="Trasaction List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween> 
            <BlockHeadContent>
                <BlockTitle page>My User</BlockTitle>
                <BlockDes className="text-soft">
                <p>You have total {data.length} users.</p>
              </BlockDes>
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

        <Block>
          <div className="card-stretch" style={{fontSize: ".9rem"}}>
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
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
                       <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.from, true)}/>
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
                       <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.end, true)}/>
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
                          <div className="dropdown-body dropdown-body-rg pl-5" style={{height: "130px"}}>
                              <Row>
                                  Type
                              </Row>
                              <div className="mt-2" style={{ justifyContent:"space-around", display: "flex", marginLeft: "-20px"}}>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel" checked={displaySetting.tier1} onChange={(e) => setDisplaySetting({...displaySetting, tier1: e.target.checked})}  />
                                    <label className="custom-control-label" htmlFor="includeDel">
                                      Tier1
                                    </label>
                                  </div>
                                </FormGroup>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel2" checked={displaySetting.tier2} onChange={(e) => setDisplaySetting({...displaySetting, tier2: e.target.checked})} />
                                    <label className="custom-control-label" htmlFor="includeDel2">
                                      Tier2
                                    </label>
                                  </div>
                                </FormGroup>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel3" checked={displaySetting.tier3} onChange={(e) => setDisplaySetting({...displaySetting, tier3: e.target.checked})} />
                                    <label className="custom-control-label" htmlFor="includeDel3">
                                      Tier3
                                    </label>
                                  </div>
                                </FormGroup>
                              </div>
                                
                              {/* <Row>
                                <FormGroup className="form-group mt-2">
                                  <Button type="button" onClick={(e) => {  console.log("filter clicked")}} className="btn btn-secondary">
                                    Filter
                                  </Button>
                                </FormGroup>
                              </Row> */}
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
                  <span>Register Date</span>
                </DataTableRow>
                <DataTableRow >
                  <span>User</span>
                </DataTableRow>
                <DataTableRow >
                  <span>Type</span>
                </DataTableRow>
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
                                 {hideEmail(item.username)}
                              </span>
                            <span className="tb-amount d-md-none">
                                 {hideEmail(item.username).substring(0,3)}
                              </span>
                        </DataTableRow>
                        <DataTableRow className="">
                         
                          <span
                            className={`badge badge-sm badge-dim badge-outline-${
                              item.type === "Tier1"
                                ? "success"
                                : item.type === "Tier2"
                                ? "warning"
                                : item.type === "Tier3"
                                ? "danger"
                                : "info"
                            } d-md-inline-flex`}
                          >
                            {item.type}
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
          </div>
        </Block>

        {/* <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Transaction</h5>
              <Form className="mt-4" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                <Row className="g-gs">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Order Type</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={cryptoActivityOptions}
                          defaultValue={[{ value: "deposit", label: "Deposit" }]}
                          onChange={(e) => setFormData({ ...formData, orderType: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatusOptions}
                          defaultValue={[{ value: "PENDING", label: "PENDING" }]}
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <OverlineTitle className="pt-4"> Amount </OverlineTitle>
                <hr className="hr mt-2 border-light" />
                <Row className="g-gs">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">BTC</label>
                      <input
                        type="number"
                        name="amountBTC"
                        defaultValue={formData.amountBTC}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.amountBTC && <span className="invalid">{errors.amountBTC.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">USD</label>
                      <input
                        type="number"
                        name="amountUSD"
                        defaultValue={formData.amountUSD}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.amountUSD && <span className="invalid">{errors.amountUSD.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>
                <OverlineTitle className="pt-4"> Balance </OverlineTitle>
                <hr className="hr mt-2 border-light" />
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">BTC</label>
                      <input
                        type="number"
                        name="balanceBTC"
                        defaultValue={formData.balanceBTC}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balanceBTC && <span className="invalid">{errors.balanceBTC.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">USD</label>
                      <input
                        type="number"
                        name="balanceUSD"
                        defaultValue={formData.balanceUSD}
                        className="form-control"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balanceUSD && <span className="invalid">{errors.balanceUSD.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button type="submit" color="primary" size="md">
                          Add Transaction
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={modalDetail} toggle={() => toggleModalDetail()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                toggleModalDetail();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="nk-modal-head mb-3">
              <h4 className="nk-modal-title title">
                Transaction <small className="text-primary">{detail.transactionId}</small>
              </h4>
            </div>
            <div className="nk-tnx-details">
              <BlockBetween className="flex-wrap g-3">
                <div className="nk-tnx-type">
                  <div
                    className={`nk-tnx-type-icon bg-${
                      detail.status === "COMPLETED"
                        ? "success"
                        : detail.status === "Upcoming"
                        ? "warning"
                        : detail.status === "PENDING"
                        ? "info"
                        : "danger"
                    } text-white`}
                  >
                    <Icon name="arrow-up-right"></Icon>
                  </div>
                  <div className="nk-tnx-type-text">
                    <h5 className="title">+ {detail.amountBTC} BTC</h5>
                    <span className="sub-text mt-n1">{detail.date}</span>
                  </div>
                </div>
                <ul className="align-center flex-wrap gx-3">
                  <li>
                    <Badge
                      color={
                        detail.status === "COMPLETED"
                          ? "success"
                          : detail.status === "Upcoming"
                          ? "warning"
                          : detail.status === "PENDING"
                          ? "info"
                          : "danger"
                      }
                      size="sm"
                    >
                      {detail.status}
                    </Badge>
                  </li>
                </ul>
              </BlockBetween>
              <div className="nk-modal-head mt-4 mb-3">
                <h5 className="title">Transaction Info</h5>
              </div>
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Order ID</span>
                  <span className="caption-text">{detail.ref}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Reference ID</span>
                  <span className="caption-text text-break">{detail.referenceId}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Transaction Fee</span>
                  <span className="caption-text">{detail.transactionFee} BTC</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Amount</span>
                  <span className="caption-text">{detail.amountBTC} BTC</span>
                </Col>
              </Row>
              <div className="nk-modal-head mt-4 mb-3">
                <h5 className="title">Transaction Details</h5>
              </div>
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Transaction Type</span>
                  <span className="caption-text">{detail.orderType}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment Gateway</span>
                  <span className="caption-text align-center">
                    CoinPayments{" "}
                    <Badge color="primary" className="ml-2 text-white">
                      Online Gateway
                    </Badge>
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment From</span>
                  <span className="caption-text text-break">{detail.paymentForm}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Payment To</span>
                  <span className="caption-text text-break">{detail.paymentTo}</span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Transaction Hash</span>
                  <span className="caption-text text-break">{detail.transactionHash}</span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Details</span>
                  <span className="caption-text">{detail.orderType} funds</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal> */}
      </Content>
    </React.Fragment>
  );
};

export default UserMyUser;
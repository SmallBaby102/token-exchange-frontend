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
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  // Col,
  // DataTable,
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  Row,
} from '../../../components/Component';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import Helper from '../../../utils/Helper';
import { fromStringTodateFormatter, dateFormatterAlt, dateCompare, hideEmail, dateFormatterWithdoutTime } from '../../../utils/Utils';
import DatePickerMobile from 'react-mobile-datepicker'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from 'react-i18next'
const UserMyUser = ({setProfileProgress, sm, updateSm, setProfileName }) => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  // const [onSearch, setonSearch] = useState(true);
  // const [onSearchText, setSearchText] = useState("");
  // const user = useSelector(state => state.user.user);
  const email = localStorage.getItem("username");
  const [modalDetail, setModalDetail] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [data, setData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
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
              return displaySetting.from <= new Date(item.dateinserted);
            });  
          } 
          if (displaySetting.end !== null) {
            filteredObject = filteredObject.filter((item) => {
              return  new Date(item.dateinserted) <= displaySetting.end;
            });  
          }
          // 
          if (displaySetting.tier1 && displaySetting.tier2 && displaySetting.tier3) {
            filteredObject = filteredObject.filter((item) => {
              return (item.type.toLowerCase() === "tier1".toLowerCase() || item.type.toLowerCase() === "tier2".toLowerCase() || item.type.toLowerCase() === "tier3".toLowerCase());
            }); 
          }else{
              if (displaySetting.tier2 && displaySetting.tier1) {
                filteredObject = filteredObject.filter((item) => {
                  return (item.type.toLowerCase() === "tier2".toLowerCase() || item.type.toLowerCase() === "tier1".toLowerCase());
                });  
              }else{
                console.log("else")
                if (displaySetting.tier3 && displaySetting.tier1) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() === "tier3".toLowerCase() || item.type.toLowerCase() === "tier1".toLowerCase());
                  });  
                } else if (displaySetting.tier2 && displaySetting.tier3) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() === "tier2".toLowerCase() || item.type.toLowerCase() === "tier3".toLowerCase());
                  });  
                } else if (displaySetting.tier1) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() === "tier1".toLowerCase());
                  });
                } else if (displaySetting.tier2) {
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() === "tier2".toLowerCase());
                  });
                } else if (displaySetting.tier3) {
                  console.log("tier3")
                  filteredObject = filteredObject.filter((item) => {
                    return (item.type.toLowerCase() === "tier3".toLowerCase());
                  });
                }
              } 
          }
          setData([...filteredObject]);
    }
    

  }, [displaySetting]);


  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to toggle the search option
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
        <BlockHead size="sm">
          <BlockBetween> 
            <BlockHeadContent>
                <BlockTitle page>{t('my_user')}</BlockTitle>
                <BlockDes className="text-soft">
                <p>{t('desc_user', {total: data.length})}</p>
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              label={`${t('date')}(${t('from')})`}
                              inputFormat="dd/MM/yyyy"
                              value={displaySetting.from}
                              onChange={(date) => {setDisplaySetting({ ...displaySetting, from: date }); }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                            </Stack>
                        </LocalizationProvider>
                      </FormGroup>
                      <FormGroup className='d-md-none'>
                       <label className="" style={{marginBottom: 0, fontSize: ".8rem"}}>{`${t('date')}(${t('from')})`}</label><br/>
                       <input style={{width:"60%"}}  value={dateFormatterWithdoutTime(displaySetting.from, true)}/>
                        <a
                            style={{opacity: "0",width:"60%", zIndex:"9999", position:"absolute", left: "0"}}
                            className="select-btn sm"
                            onClick={handleThemeToggle('default')}>
                            {displaySetting.from === null ? t('select_date'): dateFormatterAlt(displaySetting.from, true)}
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
                      <FormGroup style={{width:"30%", marginLeft:"20px"}} className="d-none d-md-block">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={3}>
                            <DesktopDatePicker
                              label={`${t('date')}(${t('to')})`}
                              inputFormat="dd/MM/yyyy"
                              minDate={displaySetting.from}
                              value={displaySetting.end}
                              onChange={(date) => {setDisplaySetting({ ...displaySetting, end: date }); }}
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
                        theme={state.theme}
                        value={displaySetting.end !== null ? new Date(displaySetting.end) : new Date()}
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
                          </div>
                          <div className="dropdown-body dropdown-body-rg pl-5" style={{height: "130px"}}>
                              <Row>
                              {t('type')}
                              </Row>
                              <div className="mt-2" style={{ justifyContent:"space-around", display: "flex", marginLeft: "-20px"}}>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel" checked={displaySetting.tier1} onChange={(e) => setDisplaySetting({...displaySetting, tier1: e.target.checked})}  />
                                    <label className="custom-control-label" htmlFor="includeDel">
                                      {t('tier1')}
                                    </label>
                                  </div>
                                </FormGroup>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel2" checked={displaySetting.tier2} onChange={(e) => setDisplaySetting({...displaySetting, tier2: e.target.checked})} />
                                    <label className="custom-control-label" htmlFor="includeDel2">
                                    {t('tier2')}
                                    </label>
                                  </div>
                                </FormGroup>
                                <FormGroup>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="includeDel3" checked={displaySetting.tier3} onChange={(e) => setDisplaySetting({...displaySetting, tier3: e.target.checked})} />
                                    <label className="custom-control-label" htmlFor="includeDel3">
                                    {t('tier3')}
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
                  <span>{t('register_date')}</span>
                </DataTableRow>
                <DataTableRow >
                  <span>{t('my_user')}</span>
                </DataTableRow>
                <DataTableRow >
                  <span>{t('type')}</span>
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
                  <span className="text-silent">{t('nodata')}</span>
                </div>
              )}
            </div>
          </div>
        </Block>
    </React.Fragment>
  );
};

export default UserMyUser;
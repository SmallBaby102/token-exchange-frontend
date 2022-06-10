import React, {
  useEffect,
  useState,
} from 'react';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import {
  FormGroup,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import axios from 'axios';

import { setChecking, setLoading } from '../../../actions';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  Row,
} from '../../../components/Component';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import { toast } from 'react-toastify';
import Helper from '../../../utils/Helper';
let RapidAPIKey = '575b213f4emsh6492c40f41807b3p1502cajsn546e9d7adab9';
const Security = () => {
  const dispatch = useDispatch();
  const email = localStorage.getItem("username");
  const myApi = myServerApi();
  const [loading, setLoading] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  // const [password, setPassword] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [secret_val, setSecret_val] = useState("")
  // For QR code generation
  // const [value, setValue] = useState();
  // const [back, setBack] = useState('#FFFFFF');
  // const [fore, setFore] = useState('#000000');
  // const [size, setSize] = useState(256);
  const [enrollUrl, setEnrollUrl] = useState(null);
  // 
  const [security, setSecurity] = useState({})

  const onChangeStatus = async () => {
    setLoading2FA(true);
    let flag = "False";
    // if (password !== "")
    // {
      const options = {
        method: 'GET',
        url: 'https://google-authenticator.p.rapidapi.com/validate/',
        params: {code: authCode, secret: secret_val},
        headers: {
          'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com',
          'X-RapidAPI-Key': RapidAPIKey
        }
      };

      let res = await axios.request(options);
      flag =  res.data
    // }
    setAuthCode("");
    if (flag === "False"){
      toast.warn("Please input correct credential");
      setLoading2FA(false);
      return;
    }
    let status = 0;
    let login = 1;
    let withdraw = 1;
    let request_wire = 0;
    if(security.status === 1)  
      {
        setSecurity({...security, status: 0})
        status = 0;
        // withdraw = 0;
        // request_wire = 0;
      }
    else 
     {
      setSecurity({...security, status: 1, login: 1, withdraw: 1})
      status = 1;
      // withdraw = 1;
      // request_wire = 1;
     }
    let data = {
      status,
      login,
      withdraw,
      request_wire,
      code_from_app: secret_val

    } 
    myApi.post(`security/${email}`, data)
    .then(res => {
      dispatch(setChecking(false));
      setLoading2FA(false);
  })
    .catch(err => {
      setLoading2FA(false);
      dispatch(setChecking(false));
    })
    
  }
  const updateStatus = () => {
    setLoading(true);
    myApi.post(`security/${email}`, security)
    .then(res => {
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
    })
    
  }
  useEffect(async () => {
    dispatch(setChecking(true));
    let res = await myApi.get(`security/${email}`);
    dispatch(setChecking(false));
    if (res.data.data)
    {
       setSecurity(res.data.data);
       setSecret_val(res.data.data.code_from_app);

    }
    else
      setSecurity({
        status : 0,
        login : 0,
        withdraw : 0,
        request_wire : 0,
      });
  }, [])
  useEffect(async () => {
    if (security.status === 0)
    {
      const options = {
      method: 'GET',
      url: 'https://google-authenticator.p.rapidapi.com/new_v2/',
      headers: {
        'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com',
        'X-RapidAPI-Key': RapidAPIKey
      }
      };

    axios.request(options).then(function (response) {
          setSecret_val(response.data);
          const options = {
            method: 'GET',
            url: 'https://google-authenticator.p.rapidapi.com/enroll/',
            params: {secret: response.data, issuer: 'Cryptowire', account: email},
            headers: {
              'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com',
              'X-RapidAPI-Key': RapidAPIKey
            }
          };

          axios.request(options).then(function (res) {
              setEnrollUrl(res.data);
          }).catch(function (error) {
              console.error(error);
          });
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, [security])

  return (
    <React.Fragment>
      <Head title="2-Factor Authenticator"></Head>
      <BlockHead size="sm">
        <BlockBetween> 
          <BlockHeadContent>
              <BlockTitle className="">2-FACTOR AUTHENTIFICATION SETTING</BlockTitle>
              <BlockDes className="text-soft">
            </BlockDes>
            </BlockHeadContent>
        </BlockBetween>
      </BlockHead>
      {security &&<Block className="pl-3">
        <div className="nk-data data-list"> 
          <Row >
            <Col md={6} style={{marginLeft: "-15px"}}>
                <label>Current status : </label>
                <label className='ml-4' style={{fontWeight: "bold"}}> { security.status === 1 ? "Enable": "Disable"}</label>
            </Col>
          </Row>
          {security.status === 0 ? <div  style={{width: "100%!important"}}>       
              <div className='' style={{width: "100%", borderTop: "1px solid darkgray"}}>
                { security.status === 0 && <label className="mt-3">
                    Enable 2FA function
                </label>}   
              </div>
              <Col md={12}>
                  <label>1. Install Google Authenticator. (<a target='_blank' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'>Android</a> / <a target='_blank' href='https://apps.apple.com/us/app/google-authenticator/id388497605'>iOS</a>)</label>
              </Col>
              <Col md={12}>
                  <label>2. Scan QR code or enter authenticator key</label>
              </Col>
              <Col md={6}>
                  {/* {value && ( */}
                    <FormGroup className="mt-3 text-center" >
                      {/* <QRCode
                        title="Security Code"
                        value={value}
                        bgColor={back}
                        fgColor={fore}
                        size={size === '' ? 0 : size}
                      /> */}
                        {enrollUrl === null ? <Spinner size="sm" color="dark" /> : <img src = {enrollUrl} alt=""/>}
                      
                    </FormGroup>
                  {/* )} */}
              </Col>
              <Col md={12} className="mt-5">
                  <label>3. Enter code from your Google Authenticator App to confirm</label>
              </Col>
            </div>: 
            <div >
              <div className='mb-3' style={{width: "100%", borderTop: "1px solid darkgray"}}></div>
              <label>Change confirm setting</label>
              <Row>
                  <Col md="12">
                    <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          name="saveTemplate"
                          className="custom-control-input form-control"
                          id='login'
                          checked={security.status}
                          disabled={true}
                          // checked={saveTemplate}
                          onChange={e => {setSecurity({...security, login:  e.target.checked});}}
                        />
                          <label className="custom-control-label form-label" htmlFor="login">
                          Login
                        </label>
                    </div>
                  </Col>
              </Row>
              <Row >
                  <Col md="12">
                    <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          name="saveTemplate"
                          checked={security.status}
                          disabled={true}
                          className="custom-control-input form-control"
                          id='withdraw'
                          // checked={saveTemplate}
                          onChange={e => {setSecurity({...security, withdraw:  e.target.checked});}}
                        />
                          <label className="custom-control-label form-label" htmlFor="withdraw">
                          Withdraw crypto
                        </label>
                    </div>
                  </Col>
              </Row>
              <Row>
                  <Col md="12">
                    <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          name="request_wire"
                          className="custom-control-input form-control"
                          checked={security.request_wire}
                          id='request_wire'
                          onChange={e => {setSecurity({...security, request_wire:  e.target.checked});}}
                        />
                          <label className="custom-control-label form-label" htmlFor="request_wire">
                          Request wire
                        </label>
                    </div>
                  </Col>
              </Row>
              <Row>
                  <FormGroup>
                    <Button color="primary"  className="mt-3 ml-3"  onClick={() => updateStatus()}>
                        {loading ? <Spinner size="sm" color="light" /> : "Update"}
                        
                    </Button>
                  </FormGroup>
              </Row>
            </div>
          }
          <form onSubmit={onChangeStatus}>
              <div className="mt-3"  style={{width: "100%!important"}}>
          
              { security.status === 1 && <div className='' style={{width: "100%", borderTop: "1px solid darkgray"}}>
                    <label className="mt-3">
                        Disable 2FA function
                    </label>
                  </div>}
                  <Col md={6} >
                      <FormGroup >
                        <div className="form-label-group">
                          <label className="form-label" htmlFor="default-01">
                            Enter code from your Google Authenticator App
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control "
                          placeholder=""
                          value={authCode}
                          onChange={e => setAuthCode(e.target.value)}
                        />
                      </FormGroup>
                  </Col>
                  {/* <Col md={6}>
                      <FormGroup style={{width: "70%"}}>
                        <div className="form-label-group">
                          <label className="form-label">
                            Confirm your password
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control "
                          placeholder=""
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </FormGroup>
                  </Col> */}
                  
                </div>
                <Row>
                  <Col md={6}>
                      <FormGroup>
                        <Button color="primary"  className="mt-3"  onClick={() => onChangeStatus()}>
                          {loading2FA ? <Spinner size="sm" color="light" /> :
                          security.status === 0 ? "Enable 2-Factor authentication" : "Disable 2-Factor authentication"} 
                        </Button>
                      </FormGroup>
                  </Col>
                </Row>
            </form>
                    
          </div>
      
    </Block>}
    
    </React.Fragment>
  );
};

export default Security;
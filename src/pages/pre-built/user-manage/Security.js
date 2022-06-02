import React, {
  useEffect,
  useState,
} from 'react';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import {
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
  Row,
} from '../../../components/Component';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import Helper from '../../../utils/Helper';
 
const SecurityLayout = () => {
  const dispatch = useDispatch();
  const email = localStorage.getItem("username");
  // For QR code generation
  const [value, setValue] = useState();
  const [back, setBack] = useState('#FFFFFF');
  const [fore, setFore] = useState('#000000');
  const [size, setSize] = useState(256);
  // 
  const [security, setSecurity] = useState(null)
  useEffect(() => {
    const myApi = myServerApi();
    dispatch(setChecking(true));
    myApi.get(`security/${email}`)
    .then(res => {
      setSecurity(res.data.data);
      setValue(res.data.data.code_from_app)
      dispatch(setChecking(false));
    })
    .catch(err => {
      dispatch(setChecking(false));
      console.log("get commission user error", err)
    })
  }, [])
  return (
    <React.Fragment>
      <Head title="Trasaction List"></Head>
      <Content > 
        <BlockHead size="sm">
          <BlockBetween> 
            <BlockHeadContent>
                <BlockTitle className="mt-5">2-FACTOR AUTHENTIFICATION SETTING</BlockTitle>
                <BlockDes className="text-soft">
              </BlockDes>
             </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block className="pl-5">
          <div className="nk-data data-list"> 
          <Row>
            <Col md={6}>
                <label>Current status : </label>
                <label className='ml-5'> {security && security.status === 1 ? "Enable": "Disable"}</label>
            </Col>
          </Row>
          <Row>          
            <Col md={12}>
                <label>1. Install Google Authenticator. (<a target='_blank' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'>Android</a> / <a target='_blank' href='https://apps.apple.com/us/app/google-authenticator/id388497605'>iOS</a>)</label>
            </Col>
            <Col md={12}>
                <label>2. Scan QR code or enter authenticator key</label>
            </Col>
            <Col md={6}>
                {value && (
                  <FormGroup className="mt-3 text-center" >
                    <QRCode
                      title="GeeksForGeeks"
                      value={value}
                      bgColor={back}
                      fgColor={fore}
                      size={size === '' ? 0 : size}
                    />
                  </FormGroup>
                )}
            </Col>
            <Col md={12} className="mt-5">
                <label>3. Enter code from your Google Authenticator App and your login password again to confirm</label>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
                <FormGroup style={{width: "70%"}}>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Enter code from your Google Authenticator App
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control "
                    placeholder=""
                  />
                </FormGroup>
            </Col>
            <Col md={6}>
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
                  />
                </FormGroup>
            </Col>
            
          </Row>
          <Row>
            <Col md={6}>
                <FormGroup>
                  <Button color="primary"  className="mt-3" >
                    Enable 2-Factor authentication
                  </Button>
                </FormGroup>
            </Col>
          </Row>
                   
          </div>
        
      </Block>
      </Content>
    </React.Fragment>
  );
};

export default SecurityLayout;
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Col,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  Spinner,
} from 'reactstrap';

import {
  setAccounts,
  setChecking,
  setCurrentUser,
  setQuoteData,

} from '../../actions';
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from '../../components/Component';
import Head from '../../layout/head/Head';
import PageContainer from '../../layout/page-container/PageContainer';
import api, { myServerApi } from '../../utils/api';
import Helper from '../../utils/Helper';
import Http from '../../utils/Http';
import AuthFooter from './AuthFooter';
import LogoComp from './Logo';
import { useCookies } from 'react-cookie';
import axios from 'axios';

let RapidAPIKey = '575b213f4emsh6492c40f41807b3p1502cajsn546e9d7adab9';
const Login = () => {
  const { t } = useTranslation(); 
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const accountIntervalId = useSelector(state => state.user.accountIntervalId);
  const quoteIntervalId = useSelector(state => state.user.quoteIntervalId);
  const [email, setEmail] = useState("")
  const currentPath = useSelector(state => state.user.currentPath)
  const [secret_val, setSecret_val] = useState("")
  const [tempForLogin, setTempForLogin] = useState();
  const [data, setData] = useState()
  const [modal, setModal] = useState({
    auth: false,
  });
  const [enrollUrl, setEnrollUrl] = useState("");
  const [authCode, setAuthCode] = useState("")
  const [errorsf, setErrorsf] = useState({
    emailfield: { status: false, message : "Please input correct email address",},
    password: { status: false, message : "Must be only alphabetic characters",},
    authfield: { status: false, message : "Must be only alphabetic characters",},
  });
  const confirmLogin = async () => {
    if (authCode === ""){
      setErrorsf({...errorsf, authfield: {status: true}});
      return;
    }
    let flag = "False";
    const options = {
      method: 'GET',
      url: 'https://google-authenticator.p.rapidapi.com/validate/',
      params: {code: authCode, secret: secret_val},
      headers: {
        'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com',
        'X-RapidAPI-Key': RapidAPIKey
      }
    };
    setLoadingConfirm(true)

    let response = await axios.request(options);
    setLoadingConfirm(false)
    setAuthCode("");

    flag =  response.data
    if (flag === "True"){
        let res = tempForLogin;
        Helper.storeUser(res);
        // const role = res.data.user.role;
        // const pStep = res.data.user.user.profile_complete_step;
        // if (pStep === 0) {
          // history.push('/dashboard');
        console.log("currentpath", currentPath)
        let nextPath = currentPath;
        if (nextPath === null || nextPath === "/auth-login"  )
            nextPath = "/dashboard"
        history.push(nextPath);
        let registerData = {
            email: email,
            password: data.passcode,
            firstname: email,
            lastname: email,
            papCookie: data.papCookie,
            AffRefId: cookies.PAPAffiliateId || " ",
            pap_visitorId: cookies.PAPVisitorId || " ",
          }
          const myApi = myServerApi();
          myApi.post("signinAffiliate", registerData)
          .then( (res) => {
          })
          .catch( err => [

          ])
      
      // } else if (pStep === 1) {
      //   history.push('/onboarding2');
      // } else {
        dispatch(setCurrentUser({ ...res}));
        Http.getAccounts(res.exchange_access_token)
        .then((response) => {
          if (response.status == 401){
            history.push("auth-login");
            dispatch(setChecking(false));
            return;
          }
          dispatch(setAccounts(response));
          dispatch(setChecking(false));
          
        })
        .catch(e =>{
            // toast.error(e.response.message);
            dispatch(setChecking(false));
        })
        api.get("exchange/quotes?exchange=PLUSQO")
        .then((res) => {
            let pairPriceArr = res.data;
            dispatch(setQuoteData(pairPriceArr));
        })
        .catch((err) => {
          console.log(err)
        // toast.error("Server error. Failed to get btc price");
        })

      //   role === "admin" ? history.push("/") : history.push("/");
      // }
    } else {
      toast.warn(t('code_error'));
    }
     
  }
  const onFormSubmit = (formData) => {
    if (loading) return;
    setData(formData);
    if (email.match(/[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*-:_.,]+@[a-z\d]+\.[a-z]{2,3}/) == null || email === ""){
      setErrorsf({
          ...errorsf, emailfield: {status: true}
        });
      return;
    }
    setLoading(true);
    if (email !== "" && formData.passcode !== "") {
      localStorage.setItem("username", email);
      Http.login(email, formData.passcode)
        .then( async (res) => {
          if (res.result === "success") {
            localStorage.setItem("registerData", null)
            setTempForLogin(res);
            const myApi = myServerApi();
            let security = await myApi.get(`security/${email}`)
            let twoFactor = 0;
            if (security.data.data !== null)
                twoFactor = security.data.data.status;
            setLoading(false);
            if (twoFactor === 1){
              setModal({...modal, auth: true});
              setSecret_val(security.data.data.code_from_app);
            } else {
                Helper.storeUser(res);
                // const role = res.data.user.role;
                // const pStep = res.data.user.user.profile_complete_step;
                // if (pStep === 0) {
                  // history.push('/dashboard');
                console.log("currentpath", currentPath)
                let nextPath = currentPath;
                if (nextPath === null || nextPath === "/auth-login"  )
                    nextPath = "/dashboard"
                history.push(nextPath);
                let registerData = {
                    email: email,
                    password: formData.passcode,
                    firstname: email,
                    lastname: email,
                    papCookie: formData.papCookie,
                    AffRefId: cookies.PAPAffiliateId || " ",
                    pap_visitorId: cookies.PAPVisitorId || " ",
                  }
                  const myApi = myServerApi();
                  myApi.post("signinAffiliate", registerData)
                  .then( (res) => {
                  })
                  .catch( err => [
        
                  ])
              
              // } else if (pStep === 1) {
              //   history.push('/onboarding2');
              // } else {
                dispatch(setCurrentUser({ ...res}));
                Http.getAccounts(res.exchange_access_token)
                .then((response) => {
                  if (response.status == 401){
                    history.push("auth-login");
                    dispatch(setChecking(false));
                    return;
                  }
                  dispatch(setAccounts(response));
                  dispatch(setChecking(false));
                  
                })
                .catch(e =>{
                    // toast.error(e.response.message);
                    dispatch(setChecking(false));
                })
                api.get("exchange/quotes?exchange=PLUSQO")
                .then((res) => {
                    let pairPriceArr = res.data;
                    dispatch(setQuoteData(pairPriceArr));
                })
                .catch((err) => {
                  console.log(err)
                // toast.error("Server error. Failed to get btc price");
                })
        
              //   role === "admin" ? history.push("/") : history.push("/");
              // }
            }
            
           
          } else {
            setLoading(false);
            if (res.message === "User is not confirmed"){
              toast.info(t('verify_email_warn'));
              // for test
              localStorage.setItem("registerData", null)
              localStorage.setItem("pass", formData.passcode)

              history.push('/register-success');
            } else if(res.result === "error") {
              toast.error(t('login_system_error'));
            }else
            {
              toast.error(t('incorrect_credential'));
            }
          }
        })      
    } else {
        setError("Can't login with credentials");
        setLoading(false);
    }
  };

  const { errors, register, handleSubmit } = useForm();
  const handleKeyPress = (e) => {
    if (e.key.toLowerCase() === 'tab') {
      let nextfield;
      if (e.shiftKey) {
        if (e.target.name === "passcode") {
         nextfield = document.querySelector(
           `input[name=name]`
         );
        } else {
          if (e.target.name === "login") {
            nextfield = document.querySelector(
              `[name=passcode]`
            );
          } else {
            if (e.target.name === "create") {
              nextfield = document.querySelector(
                `[name=login]`
              );
            }
          }
       }
      } else {
        if(e.target.name === "name"){
          nextfield = document.querySelector(
           `input[name=passcode]`
         );
         
       } else if (e.target.name === "passcode") {
         nextfield = document.querySelector(
           `button[name=login]`
         );
       } else {
         if (e.target.name === "login") {
           nextfield = document.querySelector(
             `[name=create]`
           );
         } else {
           if (e.target.name === "create") {
             nextfield = document.querySelector(
               `[name=forgot]`
             );
           }
         }
         
       }  
      }
      
      if (nextfield !== null)  {
        nextfield.focus();
      }
      e.preventDefault();
      
    }
  }
  useEffect(() => {
    if (!accountIntervalId)
      clearInterval(accountIntervalId); 
    if (!quoteIntervalId)
      clearInterval(quoteIntervalId);
    const script = document.createElement('script');

    script.src = "https://cryptowire.postaffiliatepro.com/scripts/69afqzh0j";
    script.async = true;
    document.body.appendChild(script);
    // PostAffTracker.writeCookieToCustomField('papCookie', '', '', false);
  }, [])
  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <LogoComp />
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">{t('signin')}</BlockTitle>
                <BlockDes>
                  <p>{t('access')}</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with these credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
              
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    {t('email')}
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="name"
                    value={email}
                    placeholder={t('placeholder_email')}
                    className="form-control-lg form-control"
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                    if (e.target.value.match(/^[a-zA-Z\d-!$`=~{}@#"$'%^&+|*:_.,]+$/) != null || e.target.value === "" ) {
                      setEmail(e.target.value); 
                      if (e.target.value === "")  
                      setErrorsf({
                        ...errorsf, emailfield: {status:true}
                      });
                      else {
                        setErrorsf({...errorsf, emailfield: {status:false}})
                      }
                    } else 
                      setErrorsf({
                        ...errorsf, emailfield: {status:true}
                      })
                    }}
                  />
                   {errorsf.emailfield.status && <p className="invalid">{t('email_error')}</p>}
             
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                  {t('password')}

                  </label>
                  <Link className="link link-sm" name="forgot" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    {t('forgot_password')}
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    defaultValue=""
                    name="passcode"
                    ref={register({ required: t('required') })}
                    onKeyDown={(e) => handleKeyPress(e)}
                    placeholder={t('placeholder_password')}
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <input type="hidden" id="papCookie" name="papCookie" value="noCookie" 
                      ref={register({ required: t('required')})}
              
              />
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" name="login" color="primary" onKeyDown={(e) => handleKeyPress(e)}>
                  {loading ? <Spinner size="sm" color="light" /> : t('signin')}
                </Button>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              {t('new')} <Link to={`${process.env.PUBLIC_URL}/auth-register`}  onKeyDown={(e) => handleKeyPress(e)} name="create">{t('create_account')}</Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
        <Modal isOpen={modal.auth} toggle={() => setModal({ auth: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                setModal({ auth: false });
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <div className="">
                <Form className="row gy-4" onSubmit={handleSubmit(confirmLogin)}>
                  <Col md="12">
                    <FormGroup>
                        <label className="form-label" htmlFor="default-01">
                          {t('enter_code')}
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            id="default-01"
                            name="authcode"
                            value={authCode}
                            placeholder={t('input_2fa')}
                            className="form-control-lg form-control"
                            onChange={ e => {
                              // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                            if (e.target.value.match(/^[a-zA-Z\d-!$`=~{}@#"$'%^&+|*:_.,]+$/) != null || e.target.value === "" ) {
                              setAuthCode(e.target.value); 
                              if (e.target.value === "")  
                              setErrorsf({
                                ...errorsf, emailfield: {status:true}
                              });
                              else {
                                setErrorsf({...errorsf, emailfield: {status:false}})
                              }
                            } else 
                              setErrorsf({
                                ...errorsf, emailfield: {status:true}
                              })
                            }}
                          />
                          {errorsf.authfield.status && <p className="invalid">{t('required')}</p>}
                    
                        </div>
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit" >
                          {loadingConfirm ? <Spinner size="sm" color="light" /> : t('confirm')}
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal({ auth: false })
                          }}
                          className="link link-light"
                        >
                          
                          {t('cancel')}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;

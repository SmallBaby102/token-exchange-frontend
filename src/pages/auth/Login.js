import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Form,
  FormGroup,
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
const Login = () => {
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const accountIntervalId = useSelector(state => state.user.accountIntervalId);
  const quoteIntervalId = useSelector(state => state.user.quoteIntervalId);
  const [email, setEmail] = useState("")
  const currentPath = useSelector(state => state.user.currentPath)
  const [errorsf, setErrorsf] = useState({
    emailfield: { status: false, message : "Please input correct email address",},
    password: { status: false, message : "Must be only alphabetic characters",},
  });
  const onFormSubmit = (formData) => {
    if (loading) return;
    if (email.match(/[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*:_.,]+@[a-z\d]+\.[a-z]{2,3}/) == null || email === ""){
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
          setLoading(false);
           dispatch(setChecking(true));
          if (res.result === "success") {
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
                if (response.message === "Unauthorized"){
                  history.push("auth-login");
                  dispatch(setChecking(false));
                  return;
                }
                dispatch(setAccounts(response));
                dispatch(setChecking(false));
                
              })
              .catch(e =>{
                  toast.error(e.response.message);
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
            if (res.message === "User is not confirmed"){
              toast.info("Please verify email");
              // for test
              localStorage.setItem("registerData", null)
              localStorage.setItem("pass", formData.passcode)

              history.push('/register-success');
            } else if(res.result === "error") {
              toast.error("Can't login now due to system error, please try again later.");
            }else
            {
              toast.error("Incorrect credential");
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
                <BlockTitle tag="h4">SignIn</BlockTitle>
                <BlockDes>
                  <p>Access Cryptowire using your email and password.</p>
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
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="name"
                    value={email}
                    placeholder="Enter your email address"
                    className="form-control-lg form-control"
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                    if (e.target.value.match(/^[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*:_.,]+$/) != null || e.target.value === "" ) {
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
                   {errorsf.emailfield.status && <p className="invalid">Please input correct email address</p>}
             
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-sm" name="forgot" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot password?
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
                    ref={register({ required: "This field is required" })}
                    onKeyDown={(e) => handleKeyPress(e)}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <input type="hidden" id="papCookie" name="papCookie" value="noCookie" 
                      ref={register({ required: "This field is required"})}
              
              />
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" name="login" color="primary" onKeyDown={(e) => handleKeyPress(e)}>
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}  onKeyDown={(e) => handleKeyPress(e)} name="create">Create an account</Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;

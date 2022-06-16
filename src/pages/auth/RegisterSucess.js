import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FormGroup,
  Spinner,
} from 'reactstrap';

import {
  Block,
  BlockTitle,
  Button,
  PreviewCard,
} from '../../components/Component';
import Head from '../../layout/head/Head';
import Http from '../../utils/Http';
import { useCookies } from 'react-cookie';
import api, { myServerApi } from '../../utils/api';
import { useTranslation } from 'react-i18next'

const RegisterSuccess = () => {
  const { t } = useTranslation(); 
  const [cookies, setCookie] = useCookies();
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [loadingResend, setLoadingResend] = useState(false)
  const email = localStorage.getItem("username"); //useSelector((state) => state.user.user.username)
  const [ formData, setFormData ] = useState({
    verification_code: '',
    country: '',
  });
  const handleChange = e => {
    setFormData({
      ...formData,
      [ e.target.name ]: e.target.value,
    });
  }
  const handleSubmit = e => {
    if (loading) return;
    if (formData.verification_code === ''){
      toast.warn(t('input_verification_code'));
      return;
    }
    e.preventDefault();
    setLoading(true);
    Http.confirmRegister(formData).then((res) => {
      if (res.result) {
        history.push("/dashboard");
        let registerData = JSON.parse(localStorage.getItem("registerData"));
        if (!registerData) {
          registerData = {
            email: localStorage.getItem("username"),
            password: localStorage.getItem("pass"),
            firstname: localStorage.getItem("username"),
            lastname: localStorage.getItem("username"),
            papCookie: formData.papCookie,
            AffRefId: cookies.PAPAffiliateId || " ",
            pap_visitorId: cookies.PAPVisitorId || " ",
          }

        }
        const myApi = myServerApi();
        myApi.post("signinAffiliate", registerData)
        .then( (res) => {
            localStorage.setItem("registerData", null);
            localStorage.setItem("pass", null);

        })
        .catch( err => {
          localStorage.setItem("registerData", null);
          localStorage.setItem("pass", null);

      })
        
        setLoading(false)
      } else {
        setLoading(false)
        toast.warn(t('input_correct_verification_code'));
      }    
    });
  };
  const resendCode = () => {
    setLoadingResend(true);
    Http.resendCode().then(res => {
      setLoadingResend(false);
      console.log("successfully resent")
    })
    .catch(e => {
      setLoadingResend(false);
      console.log(e);
    })
  }
  return (
    <React.Fragment>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <BlockTitle tag="h1">Welcome!</BlockTitle>
          <p>Please enter the code we have sent to your email address (we have sent from <strong>no-reply@mailverificate.com</strong>) to complete your sign up.</p>
        </div>
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <form className="is-alter" onSubmit={handleSubmit}>
            <FormGroup>
              <label className="form-label" htmlFor="name">
                  Verification Code
              </label>
              <div className="form-control-wrap">
                  <a
                    href="#verification_code"
                    onClick={(ev) => {
                      ev.preventDefault();
                      resendCode();
                    }}
                    className={`form-icon lg form-icon-right`}
                    style={{right: "20px"}}
                  >
                    {loadingResend ? <Spinner size="sm" color="light" /> : "Resend"}
                    
                  </a>
                <input
                  type="text"
                  id="verification_code"
                  name="verification_code"
                  placeholder="Enter your verification code"
                  className="form-control-lg form-control"
                  value={formData.verification_code}
                  onChange={handleChange}
                />
              </div>
            </FormGroup>
            <input type="hidden" id="papCookie" name="papCookie" value="noCookie" 
              />
            <FormGroup>
              <Button type="submit" color="primary" size="lg" className="btn-block">
                {loading ? <Spinner size="sm" color="light" /> : "Verify your code"}
              </Button>
            </FormGroup>
          </form>
        </PreviewCard>
      </Block>
    </React.Fragment>
  );
};
export default RegisterSuccess;

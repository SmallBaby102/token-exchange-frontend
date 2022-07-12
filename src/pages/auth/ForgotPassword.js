import React, { useState } from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FormGroup,
  Spinner,
} from 'reactstrap';

import { forgotPassword } from '../../actions';
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  PreviewCard,
} from '../../components/Component';
import Head from '../../layout/head/Head';
import PageContainer from '../../layout/page-container/PageContainer';
import AuthFooter from './AuthFooter';
import LogoComp from './Logo';
import { useTranslation } from 'react-i18next'

const ForgotPassword = () => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);
  const history = useHistory();
  const [ email, setEmail ] = useState('');
  const [errorsf, setErrorsf] = useState({
    emailfield: { status: false, message : t('email_error')},
    password: { status: false, message : t('must_alpha')},
    password_confirm: { status: false, message : t('must_alpha')},
  });
  const handleSubmit = e => {
    if (loading) return;
    e.preventDefault()
    if (email.match(/[a-zA-Z\d-!$`=-~{}@#"$'%^&+|-*:_.,]+@[a-z\d]+\.[a-z]{2,3}/) == null || email === ""){
      setErrorsf({
        ...errorsf, emailfield: {status: true}
      });
      return;
    }
    if (email !== '') {
      dispatch(forgotPassword(email, history));
    } else {
      toast.error(t('placeholder_email'));
    }
  }

  return (
    <React.Fragment>
      <Head title="Forgot Password" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <LogoComp />
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h5">{t('forgot_password')}</BlockTitle>
                <BlockDes>
                  <p>{t('forgot_password_desc')}</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    {t('email')}
                  </label>
                </div>
                <input
                    type="text"
                    bssize="lg"
                    id="email"
                    name="email"
                    value={email}
                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                    if (e.target.value.match(/^[a-zA-Z\d-!$`=-~{}@#/$'"%^&+|-*:_.,]+$/) != null || e.target.value === "" ) {
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
                    // ref={register({ required: "This field is required", validate: (value)=> { 
                    //   if (value.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/))
                    //       return true; 
                    //   else
                    //     return "Please input correct email address";
                    //     }
                    //   })
                    // }  
                    className="form-control-lg form-control"
                    placeholder={t('placeholder_email')}
                  />
                  {errorsf.emailfield.status && <p className="invalid">{t('email_error')}</p>}
              
              </FormGroup>
              <FormGroup>
                <Button color="primary" size="lg" className="btn-block" onClick={handleSubmit}>
                {loading ? <Spinner size="sm" color="light" /> : t('reset_password')}
                </Button>
              </FormGroup>
            </form>
            <div className="form-note-s2 text-center pt-4">
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>{t('return_to_login')}</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default ForgotPassword;

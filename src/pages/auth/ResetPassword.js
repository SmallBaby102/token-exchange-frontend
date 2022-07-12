import React, { useState } from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useHistory,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FormGroup,
  Spinner,
} from 'reactstrap';

import { resetPassword } from '../../actions';
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

const ResetPassword = () => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(state => state.user.loading);

  const [ password, setPassword ] = useState('');
  const [ verificationCode, setVerificationCode ] = useState('');
  const [errorsf, setErrorsf] = useState({
    emailfield: { status: false, message : t('email_error')},
    password: { status: false, message : t('must_alpha')},
    password_confirm: { status: false, message : t('must_alpha')},
  });
  const handleSubmit = e => {
    e.preventDefault()

    if (password ==="" || password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_|{}[\]!<>@'$%^/#&*.,()=~;:?]).{6,}/) == null) {
      setErrorsf({
        ...errorsf, password: {status: true}
      });
      return false;
      
    }
    if (password === '' || verificationCode === "") {
      toast.error(t('reset_error'));
    } else {
      dispatch(resetPassword(password, verificationCode, history));
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
                <BlockTitle tag="h5">{t('reset_password')}</BlockTitle>
                <BlockDes>
                  <p>{t('placeholder_new_password')}</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    {t('password')}
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="default-01"
                  // placeholder="Password"
                  value={password}
                  onChange={ e => {
                    // (e.target.value.match(/^[a-zA-Z\d-+_!@#$%^&*.,?]+$/)|| " " ) && setPassword(e.target.value)
                    if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'#$/%^&*.,()=~;:?]+$/) != null || e.target.value === "" ) {
                      setPassword(e.target.value); 
                      if (e.target.value === "")  
                      setErrorsf({
                        ...errorsf, password: {status:true}
                      });
                      else {
                        setErrorsf({...errorsf, password: {status:false}})
                      }
                    } else 
                      setErrorsf({
                        ...errorsf, password: {status:true}
                      })
                  }
                  }
                />
                  {errorsf.password.status && <span className="invalid">{t('combination')}</span>}

              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    {t('verification_code')}
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="default-02"
                  placeholder= {t('verification_code')}
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Button color="primary" size="lg" className="btn-block" onClick={handleSubmit}>
                {loading ? <Spinner size="sm" color="light" /> :  t('reset_password')}
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
export default ResetPassword;

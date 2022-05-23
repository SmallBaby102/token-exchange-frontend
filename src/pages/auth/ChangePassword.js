import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "../../components/Component";
import { FormGroup, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import LogoComp from "./Logo";
import { resetPassword } from "../../actions";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useParams();
  const loading = useSelector(state => state.user.loading);

  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');

  const handleSubmit = e => {
    e.preventDefault()
    if (password === '' || password !== confirmPassword) {
      toast.error('Please fill the form with valid values.');
    } else {
      dispatch(resetPassword(password, token, history));
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
                <BlockTitle tag="h5">Reset password</BlockTitle>
                <BlockDes>
                  <p>Please input the new password.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="default-01"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="default-02"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Button color="primary" size="lg" className="btn-block" onClick={handleSubmit}>
                {loading ? <Spinner size="sm" color="light" /> : "Reset Password"}
                </Button>
              </FormGroup>
            </form>
            <div className="form-note-s2 text-center pt-4">
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Return to login</strong>
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

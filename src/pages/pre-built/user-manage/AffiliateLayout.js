import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card } from 'reactstrap';

import { Icon } from '../../../components/Component';
import Content from '../../../layout/content/Content';
import UserAffiliate from './UserAffiliate';
import UserMyUser from './UserMyUser';
import UserCommissionReport from './UserCommissionReport';

const UserProfileLayout = () => {
  const dispatch = useDispatch();
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [profileName, setProfileName] = useState("");
  const user = useSelector((state) => state.user.user);
  const email = user?.username;
  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };
  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
   
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <div className="card-inner-group">
                <div className="card-inner">
                  <div className="user-card">
                    {/* <UserAvatar text={profileName} theme="primary" /> */}
                    <div className="user-info" style={{overflowWrap: "anywhere"}}>
                      <span className="lead-text">{profileName}</span>
                      <span className="sub-text">{email}</span>
                    </div>
                    {/* <div className="user-action">
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-icon btn-trigger mr-n2">
                          <Icon name="more-v"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="camera-fill"></Icon>
                                <span>Change Photo</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="edit-fill"></Icon>
                                <span>Update Profile</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div> */}
                  </div>
                </div>
                {/* <div className="card-inner">
                  <div className="user-account-info py-0">
                    <h6 className="overline-title-alt">Wallet Account</h6>
                    <div className="user-balance">
                      12.395769 <small className="currency currency-btc">BTC</small>
                    </div>
                    <div className="user-balance-sub">
                      Locked{" "}
                      <span>
                        0.344939 <span className="currency currency-btc">BTC</span>
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="card-inner p-0">
                  <ul className="link-list-menu">
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-affiliate`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-affiliate` ? "active" : ""
                        }
                      >
                        <Icon name="link"></Icon>
                        <span>My Affiliate Link</span>
                      </Link>
                    </li>
                    <li onClick={() => { updateSm(false); }}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-myuser`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-myuser`
                            ? "active"
                            : ""
                        }
                      >
                        <Icon name="users"></Icon>
                        <span>My User</span>
                      </Link>
                    </li>
                    <li onClick={() => { updateSm(false); }}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-commission-report`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-commission-report`
                            ? "active"
                            : ""
                        }
                      >
                        <Icon name="reports"></Icon>
                        <span>Commission Report</span>
                      </Link>
                    </li>
                    {/* 
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-profile-activity`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-activity` ? "active" : ""
                        }
                      >
                        <Icon name="activity-round-fill"></Icon>
                        <span>Account Activity</span>
                      </Link>
                    </li>
                    <li onClick={() => updateSm(false)}>
                      <Link
                        to={`${process.env.PUBLIC_URL}/user-profile-setting`}
                        className={
                          window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-setting` ? "active" : ""
                        }
                      >
                        <Icon name="lock-alt-fill"></Icon>
                        <span>Security Setting</span>
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-inner card-inner-lg" style={{width: "70%"}}>
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <Switch>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-affiliate`}
                  render={() => <UserAffiliate updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
                ></Route>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-myuser`}
                  render={() => <UserMyUser updateSm={updateSm} sm={sm} />}
                ></Route>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/user-commission-report`}
                  render={() => <UserCommissionReport updateSm={updateSm} sm={sm} />}
                ></Route>
              </Switch>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileLayout;

import React, { useState } from 'react';

import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { useWeb3React } from '@web3-react/core';

import Logo from '../logo/Logo';
import Menu from '../menu/Menu';
import MobileMenu from '../menu/MobileMenu';
import Toggle from '../sidebar/Toggle';
import Cwallet from './Cwallet';
import User from './dropdown/user/User';
import MobileUser from './dropdown/user/MobileUser';
import Theme from './Theme';
import { Link } from 'react-router-dom';
import LogoLight2x from '../../images/logo02_c.png';

const Header = ({ fixed, theme, visibility, toggleSidebar, mobileView, className }) => {
  const { active, account } = useWeb3React();
  const [ isOpenDialog, setIsOpenDialog ] = useState(false);
  const history = useHistory();
  const pathname = history.location.pathname;

  const onConnectWallet = async () => {
    setIsOpenDialog(true);
  }
  
  const headerClass = classNames({
    "nk-header is-regular": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });

  return (
    <div className={headerClass}>
      <div className="container-fluid wide-xl">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger mr-sm-2 d-lg-none">
            <Toggle className="nk-nav-toggle nk-quick-nav-icon" icon="menu" click={toggleSidebar} />
            
          </div>
          <div className="nk-header-brand">
            <Logo />
          </div>
          {
            pathname !== '/onboarding' && pathname !== '/onboarding2' &&
            <>
              <div className={`nk-header-menu ${mobileView ? "mobile-menu" : ""}  ${visibility ? "nk-header-active" : ""}`}>
                <div className="nk-header-mobile">
                  <div className="nk-header-brand">
                  <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link justify-content-center d-flex align-items-center">
                      <img className="logo-dark logo-img" src={LogoLight2x} alt="logo" />
                    </Link>
                  </div>
                  <div className="nk-menu-trigger mr-n2">
                    <Toggle className="nk-nav-toggle nk-quick-nav-icon" icon="arrow-left" click={toggleSidebar} />
                  </div>
                </div>
                { mobileView ? (
                  <MobileMenu sidebarToggle={toggleSidebar} mobileView={true}/>
                ) : (
                  <Menu />
                  ) } 
              </div>
              {visibility && <div className="nk-header-overlay" onClick={toggleSidebar}></div>}
              <div className="nk-header-tools">
                <ul className="nk-quick-nav">
                  <li className="notification-dropdown mr-n1">
                    {/* <Notification /> */}
                  </li>
                  <li className="user-dropdown d-none d-md-block">
                    <User />
                  </li> 
                  <li className="user-dropdown d-md-none">
                    <MobileUser />
                  </li>
                  <li>
                    <Theme />
                  </li>
                  <li>
                    <div>
                      {/* {
                        active ?
                        <Button className="btn-round" color="primary" onClick={() => onConnectWallet()}>{account.substring(0, 3)} ... {account.substring(account.length - 3)}</Button> :
                        <Button className="btn-round" color="primary" onClick={() => onConnectWallet()}>Connect Metamask</Button>
                      } */}
                      <Cwallet isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
                    </div>
                  </li>
                </ul>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};
export default Header;

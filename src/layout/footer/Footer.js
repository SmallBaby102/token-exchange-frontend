import React from 'react';

const Footer = () => {
  return (
    <div className="nk-footer nk-footer-fluid bg-lighter">
      <div className="container-xl wide-xl">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            &copy; 2022 Cryptowire
          </div>
          <div className="nk-footer-links ">
            <ul className="nav nav-sm mr-2">
              <li className="nav-item">
              <a href='https://cryptowire.vip/terms/' target="_blank" >Terms</a>
              </li>
              <li className="nav-item ml-3">
                <a href='https://cryptowire.vip/privacy-policy/' target="_blank" >Privacy</a>
              </li>
              <li className="nav-item  ml-3">
                <a href='https://cryptowire.vip/contact-us/' target="_blank" >Help</a>
                
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;

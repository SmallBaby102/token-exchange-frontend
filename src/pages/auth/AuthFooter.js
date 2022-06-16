import React, { useState } from 'react';

import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import {
  Col,
  Row,
} from '../../components/Component';
import EnglishFlag from '../../images/flags/english.png';
import ChineseFlag from '../../images/flags/china.png';
import JapaneseFlag from '../../images/flags/jp.webp';
import KoreanFlag from '../../images/flags/kr.webp';
import { useTranslation } from 'react-i18next'
const AuthFooter = () => {
  const { t } = useTranslation(); 
  const [lang, setLang] = useState(localStorage.getItem('i18nextLng'));
  const languages = { 
    en: t('english'),
    zh: t('chinese'),
    ko: t('korean'),
    ja: t('japanese'),
  }
  const handleChange = (value) => { 
    setLang(value);
    let loc = `${process.env.REACT_APP_SELF}/auth-login`;
    window.location.replace(loc + "?lng=" + value);
}
  return (
    <div className="nk-footer nk-auth-footer-full">
      <div className="container wide-lg">
        <Row className="g-3">
          <Col lg={6} className="order-lg-last">
            <ul className="nav nav-sm justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a href='https://cryptowire.vip/terms/' className='nav-link' target="_blank" >{t('terms_conditions')}</a>
              </li>
              <li className="nav-item">
                <a href='https://cryptowire.vip/privacy-policy/' className='nav-link' target="_blank" >{t('privacy_policy')}</a>
              </li>
              <li className="nav-item">
               <a href='https://cryptowire.vip/contact-us/' className='nav-link' target="_blank" >{t('help')}</a>
              </li>
              <li className="nav-item ">
                <UncontrolledDropdown direction="up">
                  <DropdownToggle
                    color="transparent"
                    className="dropdown-toggle dropdown-indicator has-indicator nav-link"
                  >
                    <span>{languages[lang]}</span>
                  </DropdownToggle>
                  <DropdownMenu right className="dropdown-menu-sm">
                    <ul className="language-list">
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleChange("en");
                          }}
                          className="language-item"
                        >
                          <img src={EnglishFlag} alt="" className="language-flag" />
                          <span className="language-name">English</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleChange("zh");

                          }}
                          className="language-item"
                        >
                          <img src={ChineseFlag} alt="" className="language-flag" />
                          <span className="language-name">Chinese</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleChange("zh");

                          }}
                          className="language-item"
                        >
                          <img src={KoreanFlag} alt="" className="language-flag" />
                          <span className="language-name">Korean</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleChange("ja");

                          }}
                          className="language-item"
                        >
                          <img src={JapaneseFlag} alt="" className="language-flag" />
                          <span className="language-name">Japanese</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          </Col>
          <Col lg="6">
            <div className="nk-block-content text-center text-lg-left">
              <p className="text-soft">&copy; 2022 Cryptowire</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AuthFooter;

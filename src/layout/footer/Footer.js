import React, { useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import EnglishFlag from '../../images/flags/english.png';
import ChineseFlag from '../../images/flags/china.png';
import JapaneseFlag from '../../images/flags/jp.webp';
import KoreanFlag from '../../images/flags/kr.webp';
import { useTranslation } from 'react-i18next'
const Footer = () => {
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
    let loc = `${process.env.REACT_APP_SELF}${window.location.pathname}`;
    window.location.replace(loc + "?lng=" + value);
}
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
              <a href='https://cryptowire.vip/terms/' target="_blank" >{t('terms')}</a>
              </li>
              <li className="nav-item ml-3">
                <a href='https://cryptowire.vip/privacy-policy/' target="_blank" >{t('privacy')}</a>
              </li>
              <li className="nav-item  ml-3">
                <a href='https://cryptowire.vip/contact-us/' target="_blank" >{t('help')}</a>
                
              </li>
              <li className="nav-item ">
                <UncontrolledDropdown direction="up">
                  <DropdownToggle
                    color="transparent"
                    className="dropdown-toggle dropdown-indicator has-indicator nav-link p-0 pl-3"
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
                            handleChange("ko");

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
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;

import React from 'react';

import { Link } from 'react-router-dom';

import LogoDark2x from '../../images/logo02_k.png';
import LogoLight2x from '../../images/logo02_c.png';
import { useSelector } from 'react-redux';

const Logo = () => {
  const theme = useSelector(state => state.layout.theme);

  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link justify-content-center d-flex align-items-center">
      {/* {theme === "dark" && <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />} */}
      <img className="logo-light logo-img logo-img-lg" src={LogoDark2x} alt="logo" />
      {/* <span className="m-0 ml-2" style={{color: 'white'}}>Cryptowire</span> */}
    </Link>
  );
}; 

export default Logo;

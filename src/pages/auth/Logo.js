import React from 'react';

import { Link } from 'react-router-dom';

import LogoDark from '../../images/logo02_k.png';
import LogoLight from '../../images/logo02_c.png';
import { useSelector } from 'react-redux';

// const theme = useSelector(state => state.layout.theme);
const LogoComp = () => {
    return (
        <div className="brand-logo pb-4 text-center">
            <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link d-flex justify-content-center">
                <img className="logo-light logo-img logo-img-lg" src={LogoDark} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={LogoLight} alt="logo-dark" />
            </Link>
        </div>
    )
}

export default LogoComp;
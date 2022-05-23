import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setLayout } from '../../actions';

const Theme = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.layout.theme);

    const changeTheme = () => {
        if (theme === 'light') dispatch(setLayout('dark'));
        else dispatch(setLayout('light'));
    }

    return <span className="icon ni ni-sun-fill choose-theme-rt" style={{color: 'white'}} onClick={changeTheme}></span>
    
}

export default Theme;
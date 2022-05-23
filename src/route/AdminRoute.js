/* eslint-disable */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';

const AdminRoute = props => {
    const currentUser = useSelector(state => state.user.user);
    const role = currentUser?.role;

    if (role === 'admin') {
        return (
            <Route { ...props } />
        )
    } else {
        return (
            <Redirect to="/" />
        )
    }
}

export default AdminRoute;

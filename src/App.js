import React from "react";
import PrivateRoute from "./route/PrivateRoute";
import Layout from "./layout/Index";

import Error404Classic from "./pages/error/404-classic";
import Error404Modern from "./pages/error/404-modern";
import Error504Modern from "./pages/error/504-modern";
import Error504Classic from "./pages/error/504-classic";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import { Switch, Route, withRouter } from "react-router-dom";
import { RedirectAs404 } from "./utils/Utils";
import RegisterSuccess from "./pages/auth/RegisterSucess";
// Importing toastify module
import {toast} from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
 // toast-configuration method,
 // it is compulsory method.
toast.configure()


const App = () => {
  
  return (
    <Switch>
      {/* Auth Pages */}
      <Route path={`/auth-reset`} component={ ForgotPassword }></Route>
      <Route path='/resetpassword' component={ ResetPassword } />
      <Route path={`/auth-register`} component={ Register }></Route>
      <Route path={`/auth-login`} component={ Login }></Route>
      <Route path='/register-success' component={ RegisterSuccess } />

      {/*Error Pages*/}
      <Route path={`/errors/404-classic`} component={ Error404Classic }></Route>
      <Route path={`/errors/504-modern`} component={ Error504Modern }></Route>
      <Route path={`/errors/404-modern`} component={ Error404Modern }></Route>
      <Route path={`/errors/504-classic`} component={ Error504Classic }></Route>

      {/*Main Routes*/}
      <PrivateRoute path="" component={ Layout }></PrivateRoute>
      <Route component={ RedirectAs404 }></Route>
    </Switch>
  );
};
export default withRouter(App);

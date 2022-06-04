import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";

import { RedirectAs404 } from "../utils/Utils";
import Dashboard from "../pages/Dashboard";
import Welcome from "../pages/LeaderBoardWelcome";
import Faq from "../pages/Faq";
import MyWallet from "../pages/MyWallet";
import CompleteProfile from '../pages/auth/CompleteProfile';
import CompleteProfile2 from '../pages/auth/CompleteProfile2';
import InvestHomePage from '../pages/Invest';
import Terms from "../pages/Terms";

import AdminRoute from "./AdminRoute";
import Users from '../pages/Users';
import UserProfileLayout from "../pages/pre-built/user-manage/UserProfileLayout";
import AffiliateLayout from "../pages/pre-built/user-manage/AffiliateLayout";
import SecurityLayout from "../pages/pre-built/user-manage/SecurityLayout";
import TransactionHistory from "../pages/TransactionHistory";
import WireHistory from "../pages/WireHistory";
import WireHistoryDetail from "../pages/WireHistoryDetail";

import RequestWire from "../pages/RequestWire";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path='/' component={ Dashboard }></Route>
        <Route exact path='/dashboard' component={ Dashboard }></Route>
        <Route exact path='/dashboard/:aid' component={ Dashboard }></Route>
        <Route path='/leaderboard-welcome' component={ Welcome } />
        <Route path='/mywallet' component={ MyWallet }></Route>
        <Route path='/requestwire' component={ RequestWire }></Route>
        <Route path='/transactionhistory' component={ TransactionHistory }></Route>
        <Route exact path='/wirehistory' component={ WireHistory } />
        <Route exact path='/wirehistory/:wireid' component={ WireHistoryDetail } />

        <Route path='/leaderboard-oldind' component={ InvestHomePage } />
        <Route path='/onboarding' component={ CompleteProfile } />
        <Route path='/onboarding2' component={ CompleteProfile2 } />
        <Route path='/terms' component={ Terms } />
        <Route path='/faq' component={ Faq } />

        <AdminRoute path="/users" component={ Users } />
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-regular/`} component={UserProfileLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-profile-verification/`} component={UserProfileLayout}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/user-affiliate/`} component={AffiliateLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-myuser/`} component={AffiliateLayout}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user-commission-report/`} component={AffiliateLayout}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/security`} component={SecurityLayout}></Route>

        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.js";
import "./../node_modules/jquery/dist/jquery.js";

import "./index.css";
import Login from "./pages/Login";

import * as serviceWorker from "./serviceWorker";
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
// import reducer from './reducers/reducer';
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

import Passcode from "./pages/Passcode";
import UpdateForgotPassword from "./pages/updateforgotpassword";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PopupModal from "./component/popup";
import UserAgreement from "./pages/UserAgreement";
import QRCode from "./pages/QRCode";
import ShippingDetails from "./pages/shipping-details";
import ShippingDetailsTwo from "./pages/shipping-details-2";
// import Signin from './pages/Signin';
// const store=createStore(reducer);

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Login} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/changepassword" component={ChangePassword} />
    <Route exact path="/forgotpassword" component={ForgotPassword} />
    <Route exact path="/passcode" component={Passcode} />
    <Route
      exact
      path="/updateforgotpassword"
      component={UpdateForgotPassword}
    />
    <Route exact path="/user-agreement" component={UserAgreement} />
    {/* <Route exact path="/popup" component={PopupModal} /> */}

    <Route exact path="/qrcode" component={QRCode} />
    <Route exact path="/shipping-details" component={ShippingDetails} />
    <Route exact path="/shipping-details-2" component={ShippingDetailsTwo} />
    {/* <Route  path="/" component={Login} />   */}
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

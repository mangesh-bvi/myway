import React, { Component } from "react";
import Dashboard from "../pages/Dashboard";
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import Passcode from './page/Passcode';
import Aux from "./child";

export default class layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <Aux>     
        <Dashboard/>
        <ChangePassword/>
        <ForgotPassword/>
        <Passcode/>
        <div className="main-content" style={{backgroundColor:"#f5f8f9"}}>{children}</div>
      </Aux>
    );
  }
}
import React, { Component } from "react";
import Dashboard from "../pages/Dashboard";
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import Passcode from './page/Passcode';
import Updateforgotpassword from './pages/updateforgotpassword'
import QRCode from './pages/QRCode'
import AddUser from "./pages/AddUser"
import AddSalesUser from "./pages/AddSalesUser"
import MyOrder from "./pages/MyOrder"
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
        <Updateforgotpassword/>
        <QRCode/>
        <AddUser/>
        <AddSalesUser/>
        <MyOrder/>
        <div className="main-content" style={{backgroundColor:"#f5f8f9"}}>{children}</div>
      </Aux>
    );
  }
}
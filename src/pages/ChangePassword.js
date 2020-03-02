import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpassword: "",
      password: "",
      newpassword: ""
    };
    this.HandleChange = this.HandleChange.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
  componentDidMount() { 
    if (encryption(window.localStorage.getItem("username"),"desc") == null) {
      window.location.href = "./";
    }
  }
  ////Handle Change Text Filed
  HandleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
////  Handle Submit button click  
  HandleSubmit(e) {      
    var oldpwd =encryption(window.localStorage.getItem("password"),"desc");
    this.setState({ submitted: true });
    const { oldpassword, password, newpassword } = this.state;
    if (oldpassword !== oldpwd) {
      NotificationManager.error("Please enter correct old password");
      return false;
    }
    if (password === newpassword) {
      ChangePasswordCheck(oldpwd, newpassword);    
    } else {
      NotificationManager.error("Confirmed password is not matched");
    }
  }
  render() {
    return (
      <section className="login-between">
        <div className="login-sect">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="login-cntr">
            <h2>Change Password</h2>
            <div className="login-fields-cntr">
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name={"oldpassword"}
                    onChange={this.HandleChange}
                    placeholder="Enter Your Old Password"
                  />
                </div>
                <div className="login-fields">
                  <label>New Password</label>
                  <input
                    id="password"
                    name={"password"}
                    onChange={this.HandleChange}
                    placeholder="Enter Your New Password"
                    type="password"
                  />
                </div>
                <div className="login-fields">
                  <label>Confirm Password</label>
                  <input
                    id="newpassword"
                    name={"newpassword"}
                    onChange={this.HandleChange}
                    placeholder="Re Enter Your New Password"
                    type="password"
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="butn"
                  onClick={() => this.HandleSubmit()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer/>
      </section>
    );
  }
}
////Handle Chagen Password Check 
function ChangePasswordCheck(password, newpassword) {  
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      UserName:encryption(window.localStorage.getItem("username"),"desc"),
      OldPassword: password,
      NewPassword: newpassword,
      PrivateIPAddress:"",
      PublicIPAddress: ""
    })
  };
  return fetch(`${appSettings.APIURL}/ChangeUserPassword`, requestOptions)
    .then(handleResponse      
      )
    .catch(error => {
       
    });
}
//// Handle Response
function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      NotificationManager.error("Internal Server error. Please contact administrator.");
    } else {
      NotificationManager.success("Password change successfully");
      window.location.href = "./";
    }
    return data;
  });
}

export default ChangePassword;

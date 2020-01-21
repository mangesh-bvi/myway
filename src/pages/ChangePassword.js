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
    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    //debugger;
    if (encryption(window.localStorage.getItem("username"),"desc") == null) {
      window.location.href = "./";
    }
  }
  handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
   //debugger;
    //  e.preventDefault();
    var oldpwd =encryption(window.localStorage.getItem("password"),"desc");
    this.setState({ submitted: true });
    const { oldpassword, password, newpassword } = this.state;
    if (oldpassword !== oldpwd) {
      NotificationManager.error("Please enter correct old password");
      return false;
    }
    if (password === newpassword) {
      ChangePasswordCheck(oldpwd, newpassword);
    //debugger;
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
                    onChange={this.handlechange}
                    placeholder="Enter Your Old Password"
                  />
                </div>
                <div className="login-fields">
                  <label>New Password</label>
                  <input
                    id="password"
                    name={"password"}
                    onChange={this.handlechange}
                    placeholder="Enter Your New Password"
                    type="password"
                  />
                </div>
                <div className="login-fields">
                  <label>Confirm Password</label>
                  <input
                    id="newpassword"
                    name={"newpassword"}
                    onChange={this.handlechange}
                    placeholder="Re Enter Your New Password"
                    type="password"
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="butn"
                  onClick={() => this.handleSubmit()}
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

function ChangePasswordCheck(password, newpassword) {
  //debugger;
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
      ////debugger;
      console.log(error);
    });
}

function handleResponse(response) {
//debugger;
  console.log(response);
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

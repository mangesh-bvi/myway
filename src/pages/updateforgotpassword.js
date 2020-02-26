import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class Updateforgotpassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: ""
    };
    this.Handlechange = this.Handlechange.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }

  ////Handle Change Text Filed Data
  Handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  ////Handle Submit Data
  HandleSubmit(e) {
    this.setState({ submitted: true });
    var userid = window.localStorage.getItem("userid");
    if (this.state.password === this.state.confirmPassword) {
      ValidatePassCode(userid, this.state.password);
    } else {
      NotificationManager.error("New password and Confirm password Not Match");
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
            <h2>Update Password</h2>
            <div className="login-fields-cntr">
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>New Password</label>
                  <input
                    type="password"
                    name={"password"}
                    onChange={this.Handlechange}
                    placeholder="Enter Your New Password"
                  />
                </div>
                <div className="login-fields">
                  <label>Confirm Password</label>
                  <input
                    id="confirmpassword"
                    name={"confirmPassword"}
                    onChange={this.Handlechange}
                    placeholder="Confirm Your New Password"
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
         <NotificationContainer leaveTimeout={appSettings.NotficationTime} />
      </section>
    );
  }
}

////Validate pass code funcation
function ValidatePassCode(UserId, Password) {
  
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      UserID: UserId,
      Password: Password
    })
  };
  return fetch(`${appSettings.APIURL}/UpdatePassword`, requestOptions)
    .then(HandleResponse)
    .catch(error => {
      console.log(error);
    });
}
//// Handle response for update password
function HandleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      NotificationManager.error("Oops! error occured");
    } else {
      NotificationManager.success("Password has been updated successfully");
      setTimeout(() => {
        window.location.href = "./login";
      }, 1000);
    }

    return data;
  });
}

export default Updateforgotpassword;

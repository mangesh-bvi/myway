import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import { encryption } from "../helpers/encryption";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
    if (encryption(window.localStorage.getItem("username"), "desc") == null) {
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
    var oldpwd = encryption(window.localStorage.getItem("password"), "desc");
    this.setState({ submitted: true });
    const { oldpassword, password, newpassword } = this.state;
    if (oldpassword !== oldpwd) {
      store.addNotification({
        // title: "Error",
        message: "Please enter correct old password",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      return false;
    }
    if (password === newpassword) {
      ChangePasswordCheck(oldpwd, newpassword);
    } else {
      store.addNotification({
        // title: "Error",
        message: "Confirmed password is not matched",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
    }
  }
  render() {
    return (
      <section className="login-between">
        <ReactNotification />
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
      UserName: encryption(window.localStorage.getItem("username"), "desc"),
      OldPassword: password,
      NewPassword: newpassword,
      PrivateIPAddress: "",
      PublicIPAddress: ""
    })
  };
  return fetch(`${appSettings.APIURL}/ChangeUserPassword`, requestOptions)
    .then(handleResponse)
    .catch(error => {});
}
//// Handle Response
function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      store.addNotification({
        // title: "Error",
        message: "Internal Server error. Please contact administrator.",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
    } else {
      
      store.addNotification({
        // title: "Error",
        message: "Password change successfully",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      setTimeout(() => {
        window.location.href = "./";
      }, appSettings.NotficationTime);
    }
    return data;
  });
}

export default ChangePassword;

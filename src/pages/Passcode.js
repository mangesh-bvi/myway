import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import { encryption } from "../helpers/encryption";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class Passcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailaddress: "",
      passcode: ""
    };
    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    var username = encryption(window.localStorage.getItem("email"), "desc");
    var passcode = encryption(window.localStorage.getItem("passcode"), "desc");

    this.setState({ submitted: true });
    if (username !== "" && passcode !== "") {
      ValidatePassCode(username, passcode);
    } else {
      store.addNotification({
        // title: "Error",
        message: "Error",
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
            <h2>Verification Code</h2>
            <div className="login-fields-cntr">
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>Verification Code</label>
                  <input
                    id="password"
                    name={"passcode"}
                    onChange={this.handlechange}
                    placeholder="Enter the Verification Code"
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
      </section>
    );
  }
}

function ValidatePassCode(emailaddress, passcode) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      EmailID: emailaddress,
      PassCode: passcode
    })
  };
  return fetch(`${appSettings.APIURL}/ValidatePasscode`, requestOptions)
    .then(handleResponse)
    .catch(error => {
      store.addNotification({
        // title: "Error",
        message: "Error",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      
    });
}

function handleResponse(response) {
  
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
    } else {
      window.localStorage.setItem("userid", data[0].UserId);
      window.location.href = "./updateforgotpassword";
    }

    return data;
  });
}

export default Passcode;

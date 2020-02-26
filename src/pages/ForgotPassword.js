import React from "react";
import { authHeader } from "../helpers/authHeader";
import Logo from "./../assets/img/logo.png";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.HandleChange = this.HandleChange.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }
////Handle Back To Login Page 
  HandleCancel(){
    this.props.history.push("/");
  }

  ////Handle Change Text Filed
  HandleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  ////Handle Submit button Click  
  HandleSubmit(e) {
    this.setState({ submitted: true });
    const { email } = this.state;
    if (email !== "") {
      ChangePasswordCheck(email);
    } else {
      NotificationManager.error('Please enter Email Id');      
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
            <h2>Forgot Password</h2>
            <div className="login-fields-cntr">
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>Registered Email ID</label>
                  <input
                    type="email"
                    name={"email"}
                    onChange={this.HandleChange}
                    placeholder="Enter Your Email ID"
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
                <button
                      className="butn cancel-butn"
                      onClick={this.HandleCancel.bind(this)}
                    >
                      Cancel
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

////Handle Change Password Check with Emil Address
function ChangePasswordCheck(email) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      EmailID: email
    })
  };
  return fetch(`${appSettings.APIURL}forgotpassword`, requestOptions)
    .then(handleResponse)
    .catch(error => {
    });
    
}

function handleResponse(response) {  
  return response.text().then(text => {    
    if(text.includes('No Record Found') === true)
    {
      NotificationManager.error('Please enter valid Email Id');      
      return false;
    }
    const data = text && JSON.parse(text);
    if (!response.ok) {
    } else {
      window.localStorage.setItem("email",encryption(data[0].EmailID,"enc"));
      window.localStorage.setItem("passcode",encryption(data[0].PassCode,"enc"));
      console.log(data[0].PassCode);
      window.location.href = "./passcode";
    }
    return data;
  });
}

export default ForgotPassword;
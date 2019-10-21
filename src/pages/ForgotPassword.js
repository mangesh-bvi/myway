import React from "react";
import { authHeader } from "../helpers/authHeader";
import Logo from "./../assets/img/logo.png";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  HandleCancel(){

    this.props.history.push("/");
  }
  handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    this.setState({ submitted: true });
    const { email } = this.state;
    if (email !== "") {
      ChangePasswordCheck(email);
    } else {
      alert("Please enter password");
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
                    onChange={this.handlechange}
                    placeholder="Enter Your Email ID"
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
      </section>
    );
  }
}
function ChangePasswordCheck(email) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      EmailID: email
    })
  };
  return fetch(`${appSettings.APIURL}/forgotpassword`, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
    });
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
    } else {
      window.localStorage.setItem("email",encryption(data[0].EmailID,"enc"));
      window.localStorage.setItem("passcode",encryption(data[0].PassCode,"enc"));
      window.location.href = "./passcode";
    }
    return data;
  });
}

export default ForgotPassword;

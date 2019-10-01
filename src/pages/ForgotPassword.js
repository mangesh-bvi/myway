import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
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
      // <div>Enter email address&nbsp;<input type="text" name={'email'} onChange={this.handlechange}  placeholder="Email address"></input></div>
      // <div>&nbsp;<button type="button" className="btn btn-primary" onClick={() => this.handleSubmit()}>Submit</button></div>
      <section className="login-between">
        <div className="login-sect">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="login-cntr">
            <h2>
              Welcome <span>Login to get started!</span>
            </h2>
            <div className="login-fields-cntr">
              <div className="login-fields">
                <label>User Name</label>
                <input
                  type="text"
                  name={"username"}
                  onChange={this.handlechange}
                  placeholder="Enter Your User Name"
                />
              </div>
              <div className="login-fields">
                <label>Password</label>
                <input
                  id="password"
                  name={"password"}
                  onChange={this.handlechange}
                  placeholder="Enter Your Password"
                  type="password"
                />
              </div>
              <div className="remember-forgot">
                <div>
                  <input id="remember" type="checkbox" name={"remember me"} />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <a href="./forgotPassword">Forgot Password?</a>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  className="butn"
                  onClick={this.handleSubmit}
                >
                  Login
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
      window.localStorage.setItem("email", data.EmailID);
      window.localStorage.setItem("passcode", data.PassCode);
    }
    return data;
  });
}

export default ForgotPassword;

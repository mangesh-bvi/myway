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
      <div>
        <div>
          Enter email address&nbsp;
          <input
            type="text"
            name={"email"}
            onChange={this.handlechange}
            placeholder="Email address"
          ></input>
        </div>
        <div>
          &nbsp;
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
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
  debugger;
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
    } else {
      window.localStorage.setItem("email", data[0].EmailID);
      window.localStorage.setItem("passcode", data[0].PassCode);
      window.location.href = "./passcode";
    }
    return data;
  });
}

export default ForgotPassword;

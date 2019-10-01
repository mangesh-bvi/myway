import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";

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
    debugger;
    //  e.preventDefault();
    var username = window.localStorage.getItem("username");
    this.setState({ submitted: true });
    const { emailaddress, passcode } = this.state;
    if (emailaddress !== "" && passcode !== "") {
      ValidatePassCode(emailaddress, passcode);
    } else {
      // var error= username===''?'Please enter the username\n':'';
      //     error+=password===''?'Please enter the passowrd':'';
      alert("error");
    }
  }
  render() {
    return (
      <div>
        <div>
          Email address&nbsp;
          <input
            type="text"
            name={"emailaddress"}
            onChange={this.handlechange}
            placeholder="Email address"
          ></input>
        </div>
        <div>
          Passcode:&nbsp;
          <input
            id="password"
            name={"passcode"}
            onChange={this.handlechange}
            placeholder="Passcode"
            type="text"
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
      console.log(error);
    });
}

function handleResponse(response) {
  debugger;
  console.log(response);
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

import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import { encryption } from "../helpers/encryption";

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
    //  e.preventDefault();
    var username = window.localStorage.getItem(encryption("username","desc"));
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
      <section className="login-between">
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
      console.log(error);
    });
}

function handleResponse(response) { 
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

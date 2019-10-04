import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";

class Updateforgotpassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: ""
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
            <h2>Update Password</h2>
            <div className="login-fields-cntr">
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>New Password</label>
                  <input
                    type="password"
                    name={"password"}
                    onChange={this.handlechange}
                    placeholder="Enter Your New Password"
                  />
                </div>
                <div className="login-fields">
                  <label>Confirm Password</label>
                  <input
                    id="confirmpassword"
                    name={"confirmPassword"}
                    onChange={this.handlechange}
                    placeholder="Confirm Your New Password"
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
      alert("Oops! error occured");
    } else {
      alert("Password has been updated successfully");
      window.location.href = "./login";
    }

    return data;
  });
}

export default Updateforgotpassword;

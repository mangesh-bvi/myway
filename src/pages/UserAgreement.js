import React, { Component } from "react";
import cross from "./../assets/img/close.png";
import {authHeader} from '../helpers/authHeader';
import appSettings from "../helpers/appSetting";

class UserAgreement extends Component {
  constructor(props) {
    super(props);   
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    //VerifyAgreement();
    window.location.href='./dashboard';
  }
  
  componentDidMount()
  {
    debugger;
    var userName=window.localStorage.getItem("username");
    var password=window.localStorage.getItem("password");
    GenerateToken(userName,password);
  }
  render() {
    return (
      <section className="login-between">
        <div className="login-sect user-agreement-sect">
          <div className="login-cntr">
            <div className="position-relative">
              <h2>User Agreement</h2>
              <a href="/" className="user-agree-close">
                <img src={cross} alt="cross icon" />
              </a>
            </div>
            <div className="login-fields-cntr">
              <iframe
                src="https://vizio.atafreight.com/WebVizio_3_0/TAndC/ClickToAccept.pdf#toolbar=0&navpanes=0&scrollbar=0"
                type="application/pdf"
                className="agreement-pdf"
              ></iframe>
            </div>
            <div className="text-right user-agreement-butns">
              <button
                type="button"
                className="butn blue-butn"
                onClick={this.handleSubmit}
              >
                Accept
              </button>
              <a
                href="/"
                className="butn cancel-butn"
                // onClick={() => this.handleSubmit()}
              >
                Close
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  
}
function VerifyAgreement()
{
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      UserName: window.localStorage.getItem("username"),       
      publicIPAddress: "202.102.302.89",
      privateIPAddress: "172.459.202.12",
      LocalTimeZone:"India Standard Time"
    })
  };
  return fetch(`${appSettings.APIURL}/AcceptAgreement`, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
    });
}

 async function GenerateToken(username, password) {

  var details = {
    username: username,
    password: password,
    grant_type: "password"
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: formBody
  };
  let response = await fetch(`${appSettings.APIURL}/token`,requestOptions);
  let data = await response.json()
  debugger;
  window.localStorage.setItem("token",data.access_token);
}

function handleResponse(response) {
  console.log(response);

  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      localStorage.clear();
      window.location.href='./login';
    } else {      
      window.location.href = "./dashboard";
    }

    // return data;
  });
}
export default UserAgreement;

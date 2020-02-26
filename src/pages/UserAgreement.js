import React, { Component } from "react";
import cross from "./../assets/img/close.png";
import {authHeader} from '../helpers/authHeader';
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";

class UserAgreement extends Component {
  constructor(props) {
    super(props);   
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {   
    window.location.href='./dashboard';
  }
  
  componentDidMount()
  {
    VerifyAgreement();
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
  
  var userName=encryption(window.localStorage.getItem("username"),"desc");
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      UserName:userName,       
      publicIPAddress:window.localStorage.getItem("ipaddress"),
      privateIPAddress: "",
      LocalTimeZone:"India Standard Time"
    })
  };
  return fetch(`${appSettings.APIURL}/AcceptAgreement`, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
    });
}

 

function handleResponse(response) {  
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      localStorage.clear();
      window.location.href='./login';
    } else {      
     
    }    
  });
}
export default UserAgreement;

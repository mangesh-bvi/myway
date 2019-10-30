import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { delay } from "q";
// import { connect } from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      submitted: false,
      showLoginError: false,
      errorText: "",
      loading: false
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
    this.setState({ submitted: true, loading: true });
    const { username, password } = this.state;
    window.localStorage.setItem("password",encryption(password,"enc"));
    if (username !== "" && password !== "") {
      var ipaddress = window.localStorage.getItem("ipaddress");
      console.log("axios" + new Date());
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/mywayapi/Login",
        data: {
          UserName: username,
          Password: password,
          publicIPAddress: ipaddress,
          PrivateIPAddress: ""
        },
        headers: authHeader("no")
      }).then(function(response) {
        debugger;
        console.log("axios response" + new Date());
        debugger;
        var data = response.data;
        window.localStorage.setItem("st",new Date());
        console.log(data);
        window.localStorage.setItem("username",encryption(data.Table[0].UserName,"enc"));
        window.localStorage.setItem("firstname",encryption(data.Table[0].FirstName,"enc"));
        window.localStorage.setItem(
          "lastlogindate",
          encryption(data.Table[0].LastLoginDate,"enc")
        );
        window.localStorage.setItem("lastname",encryption(data.Table[0].LastName,"enc"));
        window.localStorage.setItem("qrcode", data.Table1[0].QRCode);
        window.localStorage.setItem(
          "modeoftransport",
          data.Table[0].ModeOfTransport
        );
        window.localStorage.setItem("userid",encryption(data.Table[0].UserId,"enc") );
        window.localStorage.setItem("usertype",encryption(data.Table[0].UserType,"enc"));
        window.localStorage.setItem(
          "dashboardrefreshtime",
          data.Table[0].DashboardRefreshTime
        );
        window.localStorage.setItem("IsEnabled", data.Table[0].IsEnabled);
        GenerateToken(username, password);
        //window.location.href = "./user-agreement";
      }).catch(error => {
        debugger;
        this.setState({loading: false })
        var temperror=error.response.data
        var err=temperror.split(':');
        NotificationManager.error(err[1].replace('}',''));
        // this.state.usernamee = '';
        this.setState({username: '', password:''})
        setTimeout(5000);
    });
    } else {
      debugger;
      this.setState({ settoaste: true, loading: true });

      var error = username === "" ? "Please enter the username\n" : "";
      error += password === "" ? "Please enter the passowrd" : "";
      // alert(error);
      //  window.location='./Dashboard'
      NotificationManager.error(error);
      setTimeout(function(){ window.location.href="./" }, 5000);
    }
  }

  componentDidMount() {
    localStorage.clear();
    const publicIp = require("public-ip");
    (async () => {
      console.log(await publicIp.v4());
      window.localStorage.setItem("ipaddress", await publicIp.v4());
    })();
  }
  render() {
    //  const { username, password } = this.state;
    const { loading } = this.state;
    return (
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
              <div className="login-input-cntr">
                <div className="login-fields">
                  <label>User Name</label>
                  <input
                    type="text"
                    name={"username"}
                    onChange={this.handlechange}
                    value={this.state.username}
                    placeholder="Enter Your User Name"
                  />
                </div>
                <div className="login-fields">
                  <label>Password</label>
                  <input
                    id="password"
                    name={"password"}
                    onChange={this.handlechange}
                    value={this.state.password}
                    placeholder="Enter Your Password"
                    type="password"
                  />
                </div>
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
                  className="butn login-butn"
                  onClick={this.handleSubmit}
                  disabled={loading}
                >
                  {loading && (
                    <i
                      style={{ marginRight: 15 }}
                      className="fa fa-refresh fa-spin"
                    ></i>
                  )}
                  {loading ? "Please Wait ..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </section>
    );
  }
}

function GenerateToken(username, password) {
  debugger;
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
  return fetch(`${appSettings.APIURL}/token`, requestOptions)
    .then(TokenhandleResponse)
    .catch(error => {
      console.log(error);
    });
}

function TokenhandleResponse(response) {
  debugger;
  console.log(response);

  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      //alert('oops!error occured');
    } else {
      window.localStorage.setItem("token",encryption(data.access_token,"enc"));
      if (window.localStorage.getItem("IsEnabled") == true) {
        window.location.href = "./dashboard";
      } else {
        window.location.href = "./user-agreement";
      }
    }

    // return data;
  });
}
export default Login;

import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import axios from 'axios';
import {encryption} from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
// import { connect } from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",   
      password: "",
      submitted: false,
      showLoginError: false,
      errorText: ""
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
    const { username, password } = this.state;
    window.localStorage.setItem("password",password);
    if (username !== "" && password !== "") {
      var ipaddress=window.localStorage.getItem("ipaddress");      
      console.log('axios'+new Date());
      axios({
        method: 'post',
        url: 'http://vizio.atafreight.com/mywayapi/Login',
        data: {
          UserName:username,
          Password:password,
          publicIPAddress:ipaddress,
          PrivateIPAddress:''         
        },
        headers:authHeader('no')
      }).then(function (response) { 
      //  NotificationManager.success("Login Successfully");  
        console.log('axios response'+new Date());    
        debugger;
        var data=response.data;     
        console.log(data);   
        window.localStorage.setItem("username",data.Table[0].UserName);
        window.localStorage.setItem("firstname", data.Table[0].FirstName);
        window.localStorage.setItem("lastlogindate", data.Table[0].LastLoginDate);
        window.localStorage.setItem("lastname", data.Table[0].LastName);
        window.localStorage.setItem("qrcode",data.Table1[0].QRCode);
        window.localStorage.setItem(
          "modeoftransport",
          data.Table[0].ModeOfTransport
        );
        window.localStorage.setItem("userid", data.Table[0].UserId);
        window.localStorage.setItem("usertype", data.Table[0].UserType);
        window.localStorage.setItem(
          "dashboardrefreshtime",
          data.Table[0].DashboardRefreshTime
        );
      //   debugger;       
      //   var b=encryption(window.localStorage.getItem("username"));
      //   var c=encryption(b,"desc");
      //   var username =window.localStorage.getItem("username");
      //   var password =window.localStorage.getItem("password");
      //   console.log('redirect start'+new Date());
      //  // window.location.href='./user-agreement';
      //  GenerateToken(username, password)
      //  .then(tokenData => window.localStorage.setItem("token",tokenData)); 
       // GenerateToken(username, password);
        window.location.href = "./user-agreement";
        });
      // axios.post('http://vizio.atafreight.com/mywayapi/Login', {
      //   UserName: 'demouser',
      //   Password: 'Admin@1234',
      //   publicIPAddress:'202.149.197.99',
      //   PrivateIPAddress:'202.149.197.99',
      //   headers:authHeader('no')
      // })
      // .then(function (response) {
      //   console.log('axios response'+new Date());
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });  
     //  authentication(username, password,ipaddress);
      // NotificationManager.success("Login Successfully");
    } else {
      this.setState({ settoaste: true });

      var error = username === "" ? "Please enter the username\n" : "";
      error += password === "" ? "Please enter the passowrd" : "";
      // alert(error);
      //  window.location='./Dashboard'
      NotificationManager.error(error);
    }
  }

  componentDidMount()
  {
    localStorage.clear();
    const publicIp = require('public-ip'); 
    (async () => {
    console.log(await publicIp.v4());
    window.localStorage.setItem('ipaddress',await publicIp.v4());    
    })();    
  }
  render() {
    //  const { username, password } = this.state;

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
        <NotificationContainer />
      </section>
    );
  }
}

function authentication(username, password,ipaddress) {
  console.log('logtime'+new Date());   
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      UserName: username,
      Password: password,
      publicIPAddress:window.localStorage.getItem("ipaddress"),
      privateIPAddress: ""
    })
  };
  return fetch(`${appSettings.APIURL}/Login`, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
    });
}

function handleResponse(response) {  
  console.log('logendtime'+new Date());   
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      var error = data.split(":");
      error[1] = error[1].replace("}", "");
      alert(error[1]);
    } else {
      // hanleChangeRediect();
    

     // window.localStorage.setItem("username", encryption(data.Table[0].UserName));
      window.localStorage.setItem("username",data.Table[0].UserName);

      window.localStorage.setItem("firstname", data.Table[0].FirstName);
      window.localStorage.setItem("lastlogindate", data.Table[0].LastLoginDate);
      window.localStorage.setItem("lastname", data.Table[0].LastName);
      window.localStorage.setItem("qrcode",data.Table1[0].QRCode);
      window.localStorage.setItem(
        "modeoftransport",
        data.Table[0].ModeOfTransport
      );
      window.localStorage.setItem("userid", data.Table[0].UserId);
      window.localStorage.setItem("usertype", data.Table[0].UserType);
      window.localStorage.setItem(
        "dashboardrefreshtime",
        data.Table[0].DashboardRefreshTime
      );
    }

    return data;
  });
}



function TokenhandleResponse(response) {
 // console.log(response);
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      //alert('oops!error occured');
    } else {
      window.localStorage.setItem("token", data.access_token);     
      console.log('redirect'+new Date());
    }

    // return data;
  });
}
// const mapStateToProps=(state)=>{
//   return {
//     username:state.username
//   };
// }

// const mapDispatchToProps=(dispatch)=>{
//     return {
//         changeName:(username)=>{dispatch({type:'ChangeName',payload:username})}
//     }
// }

export default Login;

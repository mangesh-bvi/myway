import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
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
  // hanleChangeRediect() {
  //   debugger
  //   this.props.history.push("/Dashboard");
  // };
  handleSubmit(e) {
    //  e.preventDefault();
    // this.props.changeName("mangesh");
    //this.props.history.push("/Dashboard");
    this.setState({ submitted: true });
    const { username, password } = this.state;
    if (username !== "" && password !== "") {
      window.localStorage.setItem("password", password);
      authentication(username, password);
    } else {
      var error = username === "" ? "Please enter the username\n" : "";
      error += password === "" ? "Please enter the passowrd" : "";
      alert(error);
      //  window.location='./Dashboard'
    }
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
      </section>
    );
  }
}

function authentication(username, password) {
  console.log("LOGGING IN 1");
  const requestOptions = {
    method: "POST",
    headers: authHeader("no"),
    body: JSON.stringify({
      UserName: username,
      Password: password,
      publicIPAddress: "202.102.302.89",
      privateIPAddress: "172.459.202.12"
    })
  };
  return fetch(`${appSettings.APIURL}/Login`, requestOptions)
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
      var error = data.split(":");
      error[1] = error[1].replace("}", "");
      alert(error[1]);
    } else {
      // hanleChangeRediect();
      window.localStorage.setItem('username',data.Table[0].UserName);   
       window.localStorage.setItem('firstname',data.Table[0].FirstName);     
       window.localStorage.setItem('lastlogindate',data.Table[0].LastLoginDate);       
       window.localStorage.setItem('lastname',data.Table[0].LastName);  
       window.localStorage.setItem('modeoftransport',data.Table[0].ModeOfTransport);  
       window.localStorage.setItem('userid',data.Table[0].UserId);  
       window.localStorage.setItem('usertype',data.Table[0].UserType);  
       window.localStorage.setItem('dashboardrefreshtime',data.Table[0].DashboardRefreshTime); 
       
      var username = window.localStorage.getItem("username");
      var password = window.localStorage.getItem("password");
      GenerateToken(username, password);
      //  window.location.href="./dashboard";
      //  alert('log in successfully');
    }

    return data;
  });
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
      window.localStorage.setItem("token", data.access_token);
      window.location.href = "./dashboard";
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

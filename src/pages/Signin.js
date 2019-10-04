import React, { Component } from "react";

class Signin extends Component {
  hanleChangeRediect() {
    this.props.history.push("/Dashboard");
  }
  render() {
    return (
      <div>
        <div>
          <div>
            UserName&nbsp;
            <input type="text" name={"username"} placeholder="UserName"></input>
          </div>
          <div>
            Password:&nbsp;
            <input
              id="password"
              name={"password"}
              placeholder="Password"
              type="password"
            ></input>
          </div>
          <div>
            &nbsp;
            <button type="button" onClick={this.hanleChangeRediect.bind(this)}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signin;

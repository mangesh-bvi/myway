import React, { Component } from "react";
import Logo from "./../assets/img/logo.png";
import "../assets/css/custom.css";
import BellIcon from "./../assets/img/bell.png";
import ChatIcon from "./../assets/img/chat.png";
import LoginActore from "./../assets/img/login-actore.jfif";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (window.localStorage.getItem("username") == null) {
      window.location.href = "./login";
    } else {
      document.getElementById('spnUser').textContent=window.localStorage.getItem('username');
      document.getElementById(
        "spnFirstName"
      ).textContent = window.localStorage.getItem("username");
      document.getElementById(
        "spnLastLogin"
      ).textContent = window.localStorage.getItem("lastlogindate");
    }
  }

  onLogout() {
    localStorage.clear();
    window.location.href = "./login";
  }

  onSetting() {
    // document.getElementById("dvsetting").className.remove("cls-hide");
  }
  render() {
    return (
      <div>
        <div className="cls-header-1">
          <div className="row">
            <div className="col-xs col-sm-6 col-md-3">
              <img src={Logo} alt="log-icon" className="header-log" />
            </div>
            <div className="col-xs col-sm-6 col-md-9">
              <ul className="header-ul">
                <li>
                  <button className="header-btn">SEARCH RATES</button>
                </li>
                <li>
                  <img
                    src={BellIcon}
                    alt="bell-icon"
                    className="header-bell-icon"
                  />
                </li>
                <li style={{ padding: "10px 15px" }}>
                  <img
                    src={ChatIcon}
                    alt="chat-icon"
                    className="header-chat-icon"
                  />

                  <label>Live Chat</label>
                </li>
                <li>
                  <ul className="header-ul-login-dtls">
                    <li>
                      <img
                        src={LoginActore}
                        alt="login-actore-icon"
                        className="rounded-circle header-login-actore-icon"
                      />
                    </li>
                    <li>
                      <div class="dropdown">
                        <button
                          type="button"
                          class="dropdown-toggle"
                          data-toggle="dropdown"
                          id="spnUser"
                        >
                          Michael Smith
                        </button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item" href="#">
                            LogOut
                          </a>
                        </div>
                      </div>

                      <p className="login-actore-text">LOREM IPSUM</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="dvsetting" className="">
          <div>
            UserName:<span id="spnFirstName"></span>
          </div>
          <div>
            LastLogin:<span id="spnLastLogin"></span>
          </div>
          <div>Activity Log</div>
          <div>
            <a href="/ChangePassword">Change Password</a>
          </div>
          <div>
            <a id="LogOut" onClick={this.onLogout.bind(this)} href={null}>
              Logout
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;

import React, { Component } from "react";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import Logo from "./../assets/img/logo.png";
import "../assets/css/custom.css";
import BellIcon from "./../assets/img/bell.png";
import ChatIcon from "./../assets/img/chat.png";
import LoginActore from "./../assets/img/login-actore.jfif";
import PhoneIcon from "./../assets/img/phone.png";
import QRCode from "../pages/QRCode";
import UserIcon from "./../assets/img/user.png";
import ActivityLogIcon from "./../assets/img/activity-log.png";
import ProfileSettingIcon from "./../assets/img/profilesetting.png";
import LogoutIcon from "./../assets/img/logout.png";
import { encryption } from "../helpers/encryption";
// import { OverlayTrigger, Popover ,Button} from "react-bootstrap";




class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {tooltipOpen: false,lastlogin:""};
    
  }

  componentDidMount() {
    if (encryption(window.localStorage.getItem("username"),"desc") == null) {
     window.location.href = "./login";
    } else {
      document.getElementById(
        "spnUser"
      ).textContent =encryption(window.localStorage.getItem("username"),"desc");
      document.getElementById(
        "spnFirstName"
      ).textContent =encryption(window.localStorage.getItem("username"),"desc");
      document.getElementById(
        "spnLastLogin"
      ).textContent =encryption(window.localStorage.getItem("lastlogindate"),"desc");
      this.setState({
        lastlogin: (document.getElementById(
          "spnLastLogin"
        ).textContent =encryption(window.localStorage.getItem("lastlogindate"),"desc"))
      });
    }
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  closepopover(){
    this.setState({
      tooltipOpen: false
    });
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
                  {/* <img
                    src={PhoneIcon}
                    alt="mobile-icon"
                    className="header-phone-icon"
                  // /> */}
                  <div className="dropdown">
                    <img
                      className="header-phone-icon dropdown-toggle"
                      data-toggle="dropdown"
                      id="qrCode"
                      src={PhoneIcon}
                      alt="mobile-icon"
                    />

                    <div className="dropdown-menu qr-code-dropdown">
                      <QRCode />
                    </div>
                  </div>
                </li>
                <li style={{ padding: "10px 15px" }}>
                  <img
                    src={ChatIcon}
                    alt="chat-icon"
                    className="header-chat-icon"
                  />

                  <label>Live Chat</label>
                </li>

                <li id="activelog-open">
                  <ul className="header-ul-login-dtls">
                    <li>
                      <img
                        src={LoginActore}
                        alt="login-actore-icon"
                        className="rounded-circle header-login-actore-icon"
                      />
                    </li>

                    <li>
                      <div className="dropdown rmarrow">
                        <button
                          type="button"
                          className="dropdown-toggle rmstylebtn"
                          data-toggle="dropdown"
                          id="spnUser"
                        ></button>
                        <div className="dropdown-menu profile-dropdown">
                          <ul className="profile-ul">
                            <li>
                              <img
                                src={UserIcon}
                                className="drp-usericon"
                                alt="use-icon"
                              />
                              <label
                                id="spnFirstName"
                                className="lbl-cursor"
                              ></label>
                            </li>
                            <li className="lastlogin-li">
                              <ul className="lastlogin-ul">
                                <li>
                                  <img
                                    src={UserIcon}
                                    className="drp-usericon"
                                    alt="user-icon"
                                  />
                                </li>
                                <li>
                                  <label className="lbl-cursor">
                                    Last Login
                                    <span
                                      id="spnLastLogin"
                                      className="lastlogin-lbl lbl-cursor"
                                    ></span>
                                  </label>
                                </li>
                              </ul>
                            </li>
                            <li
                              className="activitylog-li"
                              onClick={this.toggle.bind(this)}
                            >
                              <img
                                src={ActivityLogIcon}
                                alt="activity-log"
                                className="activitylog-icon"
                              />
                              Activity Log
                            </li>
                            <li className="profile-setting-li">
                              <img
                                src={ProfileSettingIcon}
                                alt="profile-icon"
                                className="profilesetting-icon"
                              />
                              Profile Setting
                            </li>
                            <li
                              className="logout-li"
                              onClick={this.onLogout.bind(this)}
                            >
                              <img
                                src={LogoutIcon}
                                alt="logout-icon"
                                className="activitylog-icon"
                              />
                              Logout
                            </li>
                          </ul>
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
         
          <UncontrolledPopover
            trigger="Legacy"
            placement="auto"
            target="activelog-open"
            isOpen={this.state.tooltipOpen}
            rootClose ={this.closepopover.bind(this)}
            className="popovercls"
          >
            <PopoverHeader>
              <img
                src={ActivityLogIcon}
                alt="activity-icon"
                className="activitylog-icon"
              />
              Activity Log
            </PopoverHeader>
            
            <PopoverBody>
              <label>Log-in</label>
              <br/>
              <label>{encryption(window.localStorage.getItem("lastlogindate"),"desc")}</label>
            </PopoverBody>
          </UncontrolledPopover>
         
      </div>
    );
  }
}

export default Header;

import React, { Component } from "react";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import Logo from "./../assets/img/logo.png";
import Menubars from "./../assets/img/menubars.png";
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
import FileUpload from "./../assets/img/file.png";
import { Link } from "react-router-dom";

// import { OverlayTrigger, Popover ,Button} from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { Button, Modal, ModalBody } from "reactstrap";
// import ModalHeader from "react-bootstrap/ModalHeader";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
      laslastlogintlogin: "",
      searchButn: true,
      notificationData: [],
      modalDocu: false,
      modalProfile: false,
      DropdownCommonMessage: [],
      selectedFile: "",
      selectedFileName: "",
      popupHBLNO: ""
    };
    this.BindNotifiation = this.BindNotifiation.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
    this.RedirectoShipment = this.RedirectoShipment.bind(this);
  }

  componentDidMount() {
    if (encryption(window.localStorage.getItem("username"), "desc") == null) {
      window.location.href = "./login";
    } else {
      document.getElementById("spnUser").textContent = encryption(
        window.localStorage.getItem("username"),
        "desc"
      );
      document.getElementById("compName").textContent = encryption(
        window.localStorage.getItem("companyname"),
        "desc"
      );
      // document.getElementById("spnFirstName").textContent = encryption(
      //   window.localStorage.getItem("username"),
      //   "desc"
      // );
      document.getElementById("spnLastLogin").textContent = encryption(
        window.localStorage.getItem("lastlogindate"),
        "desc"
      );
      this.setState({
        lastlogin: (document.getElementById(
          "spnLastLogin"
        ).textContent = encryption(
          window.localStorage.getItem("lastlogindate"),
          "desc"
        ))
      });
    }
    if (window.location.pathname === "/rate-search") {
      this.setState({ searchButn: false });
    }

    window.addEventListener("load", this.BindNotifiation);

    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindDropdownCommonMessage`,

      headers: authHeader()
    }).then(function(response) {
      self.setState({ DropdownCommonMessage: response.data });
    });
  }
  toggleDocu() {
    this.setState(prevState => ({
      modalDocu: !prevState.modalDocu
    }));

    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf("/") + 1);
    //alert(sPage);

    if (sPage == "shipment-details") {
      this.setState({
        popupHBLNO: document.getElementById("popupHBLNO").value
      });
      //alert(document.getElementById("popupHBLNO").value)
    }
  }

  toggleProfile() {
    this.setState(prevState => ({
      modalProfile: !prevState.modalProfile
    }));
  }

  BindNotifiation() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/UserNotification`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      // self.state.Notificationcount = response.data.Table.length;
      var today = new Date();
      today.setDate(today.getDate() - 8);

      if (response != null) {
        if (response.data != null) {
          if (response.data.Table != null) {
            if (response.data.Table.length > 0) {
              var date = today.toJSON();
              date = "2019-10-21";
              self.setState({
                notificationData: response.data.Table.filter(
                  item => item.ActivityDate > date
                )
              });

              document.getElementById("Notificationcount").innerHTML =
                self.state.notificationData.length;
              self.forceUpdate();
            }
          }
        }
      }
    });
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  closepopover() {
    this.setState({
      tooltipOpen: false
    });
  }
  onLogout() {
    localStorage.clear();
    window.location.href = "./login";
  }

  onDocumentChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };

  onSetting() {
    // document.getElementById("dvsetting").className.remove("cls-hide");
  }

  SendMessage = () => {
    var drpshipment = document.getElementById("drpshipment");
    var txtShipmentNo = document.getElementById("txtShipmentNo");
    var txtshipmentcomment = document.getElementById("txtshipmentcomment");

    if (drpshipment.value.trim() == "0") {
      //alert("Please select shipment type");
      NotificationManager.error("Please select shipment type");
      drpshipment.focus();
      return false;
    }
    if (txtShipmentNo.value.trim() == "") {
      //alert("Please enter shipment no.");
      NotificationManager.error("Please enter shipment no.");
      txtShipmentNo.focus();
      return false;
    }
    if (txtshipmentcomment.value.trim() == "") {
      //alert("Please enter shipment comment.");
      NotificationManager.error("Please enter shipment comment.");
      txtshipmentcomment.focus();
      return false;
    }

    var month_names = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    var today = new Date();

    var day = today.getDate();
    var month_index = today.getMonth();
    var year = today.getFullYear();

    //alert(txtshipmentcomment.value.trim() + " on " + day + " " + month_names[month_index] + " " + year);
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SendCommonMessage`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        ReferenceNo: txtShipmentNo.value.trim(),
        TypeOfMessage: drpshipment.value.trim(),
        // Message:
        //   txtshipmentcomment.value.trim() +
        //   " on " +
        //   day +
        //   " " +
        //   month_names[month_index] +
        //   " " +
        //   year
        Message: txtshipmentcomment.value.trim()
      },
      headers: authHeader()
    }).then(function(response) {
      if (response != null) {
        if (response.data != null) {
          if (response.data.length > 0) {
            if (response.data[0] != null) {
              var message = response.data[0].Result;
              NotificationManager.success(response.data[0].Result);
            }
          }
        }
      }

      var sPath = window.location.pathname;
      var sPage = sPath.substring(sPath.lastIndexOf("/") + 1);
      //alert(sPage);

      if (sPage == "shipment-details") {
        document.getElementById("activity-tab").click();
      }
    });
    this.toggleDocu();
  };

  onShipmentNoChangeHandler = event => {
    this.setState({
      popupHBLNO: event.target.value
    });
  };

  RedirectoShipment(RefNo) {
    debugger;
    // this.props.history.push({
    //   pathname: "shipment-details",
    //   state: { detail: RefNo }
    // });
    window.location.href = "shipment-details?hblno=" + RefNo;
  }

  render() {
    let optionNotificationItems = this.state.notificationData.map((item, i) => (
      <div
        key={i}
        onClick={() => {
          this.RedirectoShipment(item.RefNo);
        }}
      >
        <p>
          Shipment: <a> {item.Product}</a>
        </p>
        <p>
          RefNo: <a>{item.RefNo} </a>
        </p>
        <p>
          Status :{" "}
          <a>
            {" "}
            {item.ProductStatus}
            {/* - { new Date( item.ActivityDate).toLocaleDateString()}  */}
          </a>
        </p>
      </div>
    ));

    let optionItems = this.state.DropdownCommonMessage.map((planet, i) =>
      i == 0 ? (
        <option key={i} value={planet.ID} selected="selected">
          {planet.Value}
        </option>
      ) : (
        <option value={planet.ID}>{planet.Value}</option>
      )
    );

    let popupHBLNO = this.state.popupHBLNO;

    return (
      <div>
        <div className="cls-header-1">
          <div className="row">
            <div className="col-xs col-sm-6 col-md-3">
              <Link to="/Dashboard">
                <img src={Logo} alt="log-icon" className="header-log" />
              </Link>
              {/* <img src={Menubars} alt="Menu Bars" className="menubars" id="menubars" /> */}
            </div>
            <div className="col-xs col-sm-6 col-md-9">
              <ul className="header-ul">
                {encryption(window.localStorage.getItem("usertype"), "desc") ===
                "Sales User"
                  ? this.state.searchButn && (
                      <li>
                        <a href="/rate-search" className="header-btn">
                          SEARCH RATES
                        </a>
                      </li>
                    )
                  : this.state.searchButn && (
                      <li>
                        <a href="/new-rate-search" className="header-btn">
                          SEARCH RATES
                        </a>
                      </li>
                    )}
                <li>
                  <div className="dropdown" style={{ position: "relative" }}>
                    <img
                      src={BellIcon}
                      alt="bell-icon"
                      className="header-bell-icon"
                      data-toggle="dropdown"
                    />
                    <a id="Notificationcount" className="notificationss">
                      0
                    </a>
                    <div className="dropdown-menu noti-drop-down">
                      {optionNotificationItems}
                      {/*<p>yuguhyuyg</p>*/}
                    </div>
                  </div>
                </li>

                {/* <li style={{ padding: "10px 15px" }}>
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
                </li> */}
                <li style={{ padding: "10px 15px" }}>
                  <img
                    src={ChatIcon}
                    alt="chat-icon"
                    className="header-chat-icon"
                    onClick={this.toggleDocu}
                  />

                  <Modal
                    className="delete-popup pol-pod-popup"
                    isOpen={this.state.modalDocu}
                    toggle={this.toggleDocu}
                    centered={true}
                    // backdrop="static"
                  >
                    <ModalBody>
                      <h3 className="mb-4">Send Message</h3>
                      <div className="rename-cntr login-fields">
                        <select id="drpshipment">
                          <option value="0">Select</option>
                          {/* <option value="Shipment">Shipment</option> */}
                          {optionItems}
                          <option value="Subject">Subject</option>
                        </select>
                      </div>
                      <div className="rename-cntr login-fields">
                        <input
                          id="txtShipmentNo"
                          type="text"
                          placeholder="Enter Shipment No."
                          value={popupHBLNO}
                          onChange={this.onShipmentNoChangeHandler}
                        />
                      </div>
                      <div className="rename-cntr login-fields">
                        <textarea
                          id="txtshipmentcomment"
                          name="comment"
                          className="txt-add"
                          placeholder="Enter Comment..."
                        ></textarea>
                      </div>

                      <Button
                        className="butn"
                        onClick={() => {
                          this.SendMessage();
                        }}
                      >
                        Send
                      </Button>
                      <Button
                        className="butn"
                        onClick={() => {
                          this.toggleDocu();
                        }}
                      >
                        Close
                      </Button>
                    </ModalBody>
                  </Modal>
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

                    <li
                      data-toggle="dropdown"
                      className="p-0 mt-1 loign-dtlss"
                      title={encryption(
                        window.localStorage.getItem("companyname"),
                        "desc"
                      )}
                    >
                      <div className="dropdown rmarrow">
                        <button
                          type="button"
                          className="dropdown-toggle rmstylebtn"
                          // data-toggle="dropdown"
                          id="spnUser"
                        ></button>
                      </div>

                      <p className="login-actore-text" id="compName"></p>
                    </li>
                    <div className="dropdown-menu profile-dropdown">
                      <ul className="profile-ul">
                        {/* <li>
                          <img
                            src={UserIcon}
                            className="drp-usericon"
                            alt="use-icon"
                          />
                          <label
                            id="spnFirstName"
                            className="lbl-cursor"
                          ></label>
                        </li> */}
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
                          id="abcd"
                        >
                          <img
                            src={ActivityLogIcon}
                            alt="activity-log"
                            className="activitylog-icon"
                          />
                          Activity Log
                        </li>
                        {/* <li className="profile-setting-li">
                          <a href="changePassword">
                            <img
                              src={ProfileSettingIcon}
                              alt="profile-icon"
                              className="profilesetting-icon"
                            />
                            Change Password
                          </a>
                        </li> */}
                        {/* <li
                          className="profile-setting-li"
                          onClick={this.toggleProfile}
                        >
                          <a href="#!">
                            <img
                              src={ProfileSettingIcon}
                              alt="profile-icon"
                              className="profilesetting-icon"
                            />
                            Profile Settings
                          </a>
                        </li> */}
                        {/* <li className="profile-setting-li">
                          <img
                            className="header-phone-icon dropdown-toggle"
                            data-toggle="dropdown"
                            id="qrCode"
                            src={PhoneIcon}
                            alt="mobile-icon"
                          />
                          Mobile App
                          <div className="dropdown-menu qr-code-dropdown">
                            <QRCode />
                          </div>
                        </li> */}
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
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Modal
          className="delete-popup pol-pod-popup"
          isOpen={this.state.modalProfile}
          toggle={this.toggleProfile}
          centered={true}
        >
          <ModalBody>
            <div className="d-flex align-items-center text-left">
              <div className="prof-img">
                <img src={LoginActore} />
              </div>
              <div className="pl-3">
                <p className="prof-name">
                  {encryption(window.localStorage.getItem("username"), "desc")}
                </p>
                <p className="prof-comp">
                  {encryption(
                    window.localStorage.getItem("companyname"),
                    "desc"
                  )}
                </p>
              </div>
            </div>
            <div className="rename-cntr login-fields d-block mt-4">
              <div className="d-flex w-100 align-items-center">
                <label>Change Image</label>
                <div className="w-100">
                  <input
                    id="file-upload"
                    className="file-upload d-none"
                    type="file"
                    onChange={this.onDocumentChangeHandler}
                  />
                  <label htmlFor="file-upload">
                    <div className="file-icon">
                      <img src={FileUpload} alt="file-upload" />
                    </div>
                    Upload Image
                  </label>
                </div>
              </div>
              <p className="file-name">{this.state.selectedFileName}</p>
            </div>
            <Button
              className="butn"
              onClick={() => {
                this.toggleProfile();
                // this.onDocumentClickHandler();
              }}
            >
              Submit
            </Button>
            <Button
              className="butn cancel-butn"
              onClick={() => {
                this.toggleProfile();
              }}
            >
              Cancel
            </Button>
          </ModalBody>
        </Modal>

        <UncontrolledPopover
          trigger="legacy"
          placement="top"
          target="abcd"
          // isOpen={this.state.tooltipOpen}
          rootClose={this.closepopover.bind(this)}
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
            <br />
            <label>
              {encryption(window.localStorage.getItem("lastlogindate"), "desc")}
            </label>
          </PopoverBody>
        </UncontrolledPopover>
        <NotificationContainer />
      </div>
    );
  }
}
export default Header;

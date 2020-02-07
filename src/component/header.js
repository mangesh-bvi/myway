import React, { Component } from "react";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { Popover, Button } from "antd";
import Select from "react-select";
import Logo from "./../assets/img/logo.png";
import "../assets/css/custom.css";
import BellIcon from "./../assets/img/bell.png";
import ChatIcon from "./../assets/img/chat-old.png";
import LoginActore from "./../assets/img/login-actore.jfif";

import UserIcon from "./../assets/img/user.png";
import ActivityLogIcon from "./../assets/img/activity-log.png";

import LogoutIcon from "./../assets/img/logout.png";
import { encryption } from "../helpers/encryption";
import FileUpload from "./../assets/img/file.png";
import { Link, Route } from "react-router-dom";
import { withRouter } from "react-router";

// import { OverlayTrigger, Popover ,Button} from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { Modal, ModalBody } from "reactstrap";
// import ModalHeader from "react-bootstrap/ModalHeader";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Autocomplete from "react-autocomplete";

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
      popupHBLNO: "",
      ActivityDateArry: [],
      selectedType: "",
      customerData: [],
      fields: {},
      CompanyID: 0,
      companyName: "",
      CompanyAddress: "",
      selectedCurrency: "USD",
      profileImgURL: "",
      currencyData: [],
      currencyCode: "",
      currencyObj: {},
      iscurrencydrp: false
    };
    this.BindNotifiation = this.BindNotifiation.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
    this.handleCurrencyBind = this.handleCurrencyBind.bind(this);
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

    this.BindNotifiation();

    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindDropdownCommonMessage`,

      headers: authHeader()
    }).then(function(response) {
      self.setState({
        DropdownCommonMessage: response.data,
        selectedType: "Subject"
      });
    });

    var Imgurl = encryption(window.localStorage.getItem("UserLogo"), "desc");
    if (Imgurl != "") {
      var profileImgURL = encryption(
        window.localStorage.getItem("UserLogo"),
        "desc"
      );
      this.setState({ profileImgURL });
    }
    this.handleCurrencyBind();
    debugger;
    var iscurrencydrp = false;
    var pathName = this.props.location.pathname;
    if (pathName !== "/rate-table") {
      iscurrencydrp = true;
      this.setState({ iscurrencydrp });
    } else {
      iscurrencydrp = false;
      this.setState({ iscurrencydrp });
    }
  }

  handleCurrencyBind() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,

      headers: authHeader()
    }).then(function(response) {
      var currencyData = response.data.Table4;
      self.setState({
        currencyData
      });
      // debugger;
      var currencyObj = window.localStorage.getItem("currencyObj");
      var currencyCode = window.localStorage.getItem("currencyObj");

      if (currencyCode && currencyObj) {
        // debugger;
        var data = JSON.parse(currencyCode);

        self.setState({ currencyObj: data, currencyCode });
      }
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
      //debugger;

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
    //debugger;
    let self = this;
    var UserID = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchActivityDetails`,
      data: {
        UserID: UserID //341 //UserID
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var ActivityDateArry = response.data.Table;
      if (ActivityDateArry.length > 0) {
        self.setState({
          tooltipOpen: !self.state.tooltipOpen,
          ActivityDateArry
        });
      }
    });
  }
  closepopover() {
    this.setState({
      tooltipOpen: false,
      ActivityDateArry: []
    });
  }
  onLogout() {
    localStorage.clear();
    this.props.history.push("/login");
    // window.location.href = "./login";
  }

  onDocumentChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };

  SendMessage = () => {
    debugger;
    var drpshipment = document.getElementById("drpshipment");
    var txtShipmentNo = document.getElementById("txtShipmentNo");
    var txtshipmentcomment = document.getElementById("txtshipmentcomment");

    if (drpshipment.value.trim() == "0") {
      //alert("Please select shipment type");
      NotificationManager.error("Please Select Type");
      drpshipment.focus();
      return false;
    }

    if (txtShipmentNo.value.trim() == "") {
      //alert("Please enter shipment no.");
      NotificationManager.error(
        this.state.selectedType === "Subject"
          ? "Please Enter Subject"
          : "Please Enter " + this.state.selectedType + " No"
      );
      txtShipmentNo.focus();
      return false;
    }
    if (txtshipmentcomment.value.trim() == "") {
      //alert("Please enter shipment comment.");
      NotificationManager.error("Please enter shipment comment.");
      txtshipmentcomment.focus();
      return false;
    }
    var CustomerID = this.state.CompanyID;
    if (this.state.CompanyID === 0) {
      CustomerID = encryption(window.localStorage.getItem("companyid"), "dec");
    } else {
      CustomerID = this.state.CompanyID;
    }
    debugger;

    //alert(txtshipmentcomment.value.trim() + " on " + day + " " + month_names[month_index] + " " + year);
    let self = this;

    var ReferenceNo = "";
    var subject = txtShipmentNo.value.trim();
    if (this.state.selectedType === "Subject") {
      ReferenceNo = "";
    } else {
      ReferenceNo = txtShipmentNo.value.trim();
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SendCommonMessage`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        ReferenceNo: ReferenceNo,
        TypeOfMessage: drpshipment.value.trim(),
        CustomerID: CustomerID,
        SubjectMessage: subject,
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

  RedirectoShipment(RefNo, ID, Type, Product, ProductStatus) {
    debugger;

    if (Type === "Booking") {
      this.props.history.push({
        pathname: "booking-view",
        state: {
          BookingNostr: RefNo,
          bookingNo: ID,
          Mode: Product
        }
      });
    } else if (Type === "SalesQuote") {
      var ptype = Product;
      var qnumber = RefNo;
      var Status = ProductStatus;
      var detail = {
        Quotes: qnumber,
        Type: ptype,
        Status: Status
      };
      //debugger;

      this.props.history.push({
        pathname: "rate-finalizing-still",
        state: {
          detail: detail
        }
      });
    } else {
      this.props.history.push({
        pathname: "shipment-details",
        state: { detail: RefNo }
      });
    }
  }

  HandleActivityClick(ActivityTypeID, MODE, CSV) {
    debugger;
    var ActivityTypeID = ActivityTypeID;
    var MODE = MODE;

    if (ActivityTypeID === 3) {
      this.props.history.push({
        pathname: "shipment-details",
        state: { detail: CSV }
      });
    } else if (ActivityTypeID === 5 && MODE !== "") {
      var detail = {
        Quotes: CSV,
        Type: MODE
      };
      this.props.history.push({
        pathname: "rate-finalizing-still",
        state: {
          detail: detail
        }
      });
    } else if (ActivityTypeID === 30 && MODE !== "") {
      this.props.history.push({
        pathname: "booking-view",
        state: {
          bookingNo: CSV,
          Mode: MODE
        }
      });
    } else {
      NotificationManager.error("No Redirect");
    }
  }

  HandleChangeCon(field, e) {
    //debugger;;
    let self = this;
    self.state.error = "";
    var customertxtlen = e.target.value;

    let fields = this.state.fields;
    fields[field] = e.target.value;
    if (fields[field].length >= 2) {
      self.setState({ fields });
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerAutoSearchMessage`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc"),
          CompanyName: customertxtlen
        },
        headers: authHeader()
      }).then(function(response) {
        // debugger;

        if (response.data.length != 0) {
          if (field == "CustomerList") {
            self.setState({
              customerData: response.data,
              fields
            });
          } else {
            self.setState({
              customerData: response.data,
              fields
            });
          }
        } else {
          self.state.error = "Please enter valid Consignee";
        }
        self.setState({
          error: self.state.error
        });
      });
    } else {
      self.setState({
        customerData: [],
        fields
      });
    }
  }

  handleSelectCon(field, value, e) {
    let fields = this.state.fields;
    fields[field] = value;
    var compId = e.Company_ID;
    var compName = e.Company_Name;
    var companyAddress = e.CompanyAddress;
    var contactName = e.ContactName;
    var contactEmail = e.ContactEmail;
    this.setState({
      fields,
      CompanyID: compId,
      CompanyName: compName,
      CompanyAddress: companyAddress,
      ContactName: contactName,
      ContactEmail: contactEmail
    });
  }

  HandleChangeType(e) {
    debugger;
    var value = e.target.value;
    // document.getElementById("txtShipmentNo").value("");
    // document.getElementById("txtshipmentcomment").value("");
    // "txtshipmentcomment"
    document.getElementById("txtshipmentcomment").value = "";
    this.setState({ selectedType: value, popupHBLNO: "" });
  }

  onErrorImg(e) {
    return (e.target.src =
      "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png");
  }

  HandleCurrencyChange(e) {
    // debugger;

    this.setState({
      currencyCode: e.CurrencyCode,
      currencyObj: e
    });
    window.localStorage.setItem("currencyCode", e.CurrencyCode);
    window.localStorage.setItem("currencyObj", JSON.stringify(e));

    setTimeout(() => {
      this.getCurrencyBaseValue();
    }, 100);
  }

  getCurrencyBaseValue() {
    var selectedCurrency = this.state.currencyCode;

    var base = "";
    if (selectedCurrency === "TL") {
      base = "TRY";
    } else {
      base = selectedCurrency;
    }
    var url = "https://api.exchangeratesapi.io/latest?base=" + base;
    axios({
      method: "get",
      url: url
    }).then(function(response) {
      // debugger;
      window.location.reload(false);
    });
  }
  render() {
    let self = this;

    let optionNotificationItems = this.state.notificationData.map((item, i) => (
      <div
        key={i}
        onClick={() => {
          self.RedirectoShipment(
            item.RefNo,
            item.ID,
            item.ActivityType,
            item.Product,
            item.ProductStatus
          );
        }}
      >
        <p>
          {item.ActivityType}: <a> {item.Product}</a>
        </p>
        <p>
          RefNo: <a>{item.RefNo} </a>
        </p>
        <p>
          Status :<a> {item.ProductStatus}</a>
        </p>
      </div>
    ));

    let optionItems = this.state.DropdownCommonMessage.map((planet, i) =>
      i == 0 ? (
        <option key={i} value={planet.Value} selected="selected">
          {planet.Value}
        </option>
      ) : (
        <option value={planet.ID}>{planet.Value}</option>
      )
    );

    var adataval;
    if (this.state.ActivityDateArry.length > 0) {
      adataval = this.state.ActivityDateArry.map((item, i) =>
        this.state.ActivityDateArry.length == 0 ? (
          <div
            className="active-log-pop"
            key={i}
            onClick={() => {
              self.HandleActivityClick(
                item.ActivityTypeID,
                item.MODE,
                item.CSV
              );
            }}
          >
            <span>{item.CNT + " "}</span> <label>{item.ActivityDesc}</label>
            {item.CSV}
            <br />
            {/* <label>{item.ActMessage}</label> */}
            <label>{item.SingleActDate}</label>
          </div>
        ) : (
          <div
            className="active-log-pop"
            key={i}
            onClick={() => {
              self.HandleActivityClick(
                item.ActivityTypeID,
                item.MODE,
                item.CSV
              );
            }}
          >
            <span>{item.CNT + " "}</span>
            <label>{item.ActivityDesc}</label>
            <sap>{item.CSV}</sap>
            <br />
            {/* <label>{item.ActMessage}</label> */}
            <label>{item.SingleActDate}</label>
            <hr />
          </div>
        )
      );
    }

    let popupHBLNO = this.state.popupHBLNO;

    return (
      <div className="pdtop">
        <div className="header-fixed">
          <div className="cls-header-1">
            <div className="row">
              <div className="col-xs col-sm-3 col-md-4 col-lg-3">
                <Link to="/Dashboard">
                  <img src={Logo} alt="log-icon" className="header-log" />
                </Link>
              </div>
              <div className="col-xs col-sm-9 col-md-8 col-lg-9">
                <ul className="header-ul">
                  {encryption(
                    window.localStorage.getItem("usertype"),
                    "desc"
                  ) === "Sales User"
                    ? this.state.searchButn && (
                        <li>
                          <Link className="header-btn" to="/rate-search">
                            SEARCH RATES
                          </Link>
                        </li>
                      )
                    : this.state.searchButn && (
                        <li>
                          <Link className="header-btn" to="/new-rate-search">
                            SEARCH RATES
                          </Link>
                        </li>
                      )}
                  <li>
                    <Select
                      className="rate-dropdown mt-0 CurrencyCodecss "
                      closeMenuOnSelect={true}
                      getOptionLabel={option => option.BaseCurrencyName}
                      getOptionValue={option => option.CurrencyCode}
                      // components={animatedComponents}
                      value={this.state.currencyObj}
                      isSearchable={false}
                      isDisabled={this.state.iscurrencydrp}
                      options={this.state.currencyData}
                      onChange={this.HandleCurrencyChange.bind(this)}
                      defaultValue={{
                        BaseCurrencyName: "US Dollars",
                        CurrencyCode: "USD"
                      }}
                    />
                  </li>
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

                  <li className="br-none" style={{ padding: "20px" }}>
                    <img
                      src={ChatIcon}
                      alt="chat-icon"
                      className="header-chat-icon"
                      onClick={this.toggleDocu}
                    />
                    {/* <label style={{fontSize:"12px" , fontWeight: "bold" , color: "#1a1919"}}>Live Chat</label> */}
                    <Modal
                      className="delete-popup"
                      isOpen={this.state.modalDocu}
                      toggle={this.toggleDocu}
                      centered={true}
                      // backdrop="static"
                    >
                      <ModalBody>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          onClick={this.toggleDocu}
                        >
                          <span>&times;</span>
                        </button>
                        <div
                          style={{
                            background: "#fff",
                            padding: "15px",
                            borderRadius: "15px"
                          }}
                        >
                          <h3 className="mb-4">Send Message</h3>
                          <div className="rename-cntr login-fields">
                            <select
                              id="drpshipment"
                              onChange={this.HandleChangeType.bind(this)}
                            >
                              <option value="0">Select</option>
                              {/* <option value="Shipment">Shipment</option> */}
                              {optionItems}
                              <option value="Subject" selected>
                                Subject
                              </option>
                            </select>
                          </div>
                          {this.state.selectedType === "Subject" &&
                          encryption(
                            window.localStorage.getItem("usertype"),
                            "desc"
                          ) === "Sales User" ? (
                            <div className="rename-cntr login-fields cusrename1">
                              <Autocomplete
                                id="searchtxt"
                                className="title-sect p-0 pt-2"
                                getItemValue={item => item.Company_Name}
                                items={this.state.customerData}
                                renderItem={(item, isHighlighted) => (
                                  <div
                                    style={{
                                      background: isHighlighted
                                        ? "lightgray"
                                        : "white",
                                      padding: "5px"
                                    }}
                                  >
                                    {item.Company_Name}
                                  </div>
                                )}
                                value={this.state.fields["Company_Name"]}
                                onChange={this.HandleChangeCon.bind(
                                  this,
                                  "Company_Name"
                                )}
                                menuStyle={this.state.menuStyle}
                                onSelect={this.handleSelectCon.bind(
                                  this,
                                  "Company_Name"
                                )}
                                inputProps={{
                                  placeholder: "Search Account/Consignee"
                                }}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="rename-cntr login-fields">
                            <input
                              id="txtShipmentNo"
                              type="text"
                              placeholder={
                                this.state.selectedType === "Shipment"
                                  ? "Enter Shipment No."
                                  : this.state.selectedType === "Sales Quote"
                                  ? "Enter Sales Quote No."
                                  : this.state.selectedType === "Booking"
                                  ? "Enter Booking No."
                                  : this.state.selectedType === "Subject"
                                  ? "Enter Subject"
                                  : ""
                              }
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
                        </div>
                      </ModalBody>
                    </Modal>
                  </li>

                  <li id="activelog-open">
                    <ul className="header-ul-login-dtls">
                      <li>
                        <img
                          src={this.state.profileImgURL}
                          alt="login-actore"
                          className="rounded-circle header-login-actore-icon"
                          onError={this.onErrorImg.bind(this)}
                        />
                      </li>

                      <li
                        data-toggle="dropdown"
                        className="p-0 mt-3 loign-dtlss"
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
                              <li style={{ position: "static" }}>
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

                          <li
                            style={{ position: "static" }}
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
                    {encryption(
                      window.localStorage.getItem("username"),
                      "desc"
                    )}
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
              <div className="active-log-pop">{adataval}</div>
            </PopoverBody>
          </UncontrolledPopover>
          <NotificationContainer />
        </div>
      </div>
    );
  }
}
export default withRouter(Header);

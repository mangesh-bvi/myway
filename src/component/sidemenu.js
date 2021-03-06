import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import "../styles/custom.css";
import { Accordion, Button, Card } from "react-bootstrap";
import GreenCounterIcon from "./../assets/img/green-counter-side.png";
import BookingsIcon from "./../assets/img/bookings-side.png";
import AnalyticsIcon from "./../assets/img/analytics-side.png";
import RatesIcon from "./../assets/img/rates-side.png";
import AdminIcon from "./../assets/img/admin-side.png";
import ChatIcon from "./../assets/img/chat.png";
import sideArrow from "./../assets/img/side-arr.png";
import PlaneWhite from "./../assets/img/hamb-plane.png";
import ShipWhite from "./../assets/img/ship-white.png";
import TruckWhite from "./../assets/img/shipments.png";
import ShipmentPlannerIcon from "./../assets/img/shipment-planner-side.png";
import ShipmentsIcon from "./../assets/img/shipment-side.png";
import DashboardIcon from "./../assets/img/dashboard-side.png";
import PhoneIcon from "./../assets/img/phone.png";
import QRCode from "../pages/QRCode";
import ProfileSettingIcon from "./../assets/img/profilesetting.png";
import QuotesIcon from "./../assets/img/quotes-side.png";
import InfoIcon from "./../assets/img/info.png";
import SettingIcon from "./../assets/img/Settings.png";
import "font-awesome/css/font-awesome.css";
import { encryption } from "../helpers/encryption";
import FileUpload from "./../assets/img/file.png";
import { Modal, ModalBody } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircount: "0",
      quotePendingCount: "0",
      bookPendingCount: "0",
      activeRateSearch: "",
      activeSpotList: "",
      modalProfile: false,
      isColClick: false,
      profileImgURL: "",
      imageFile: {},
      loading: false,
      QrModal: false,
      QRCode: "",
      CustomerType: "",
    };

    this.highlightClass = this.highlightClass.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
    this.toggleCloseQRModal = this.toggleCloseQRModal.bind(this);
    this.toggleOpenQRModal = this.toggleOpenQRModal.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentDidMount() {
    
    var CustomerType = encryption(
      window.localStorage.getItem("CustomerType"),
      "desc"
    );
    this.setState({ CustomerType });

    var previousAir = window.localStorage.getItem("aircount");
    var previousQuotePending = window.localStorage.getItem("quotepending");
    var previousBookPending = window.localStorage.getItem("bookpending");
    setInterval(() => {
      if (window.localStorage.getItem("aircount") !== previousAir) {
        this.setState({
          aircount: window.localStorage.getItem("aircount"),
        });
      }
      if (
        window.localStorage.getItem("quotepending") !== previousQuotePending
      ) {
        this.setState({
          quotePendingCount: window.localStorage.getItem("quotepending"),
        });
      }
      if (window.localStorage.getItem("bookpending") !== previousBookPending) {
        this.setState({
          bookPendingCount: window.localStorage.getItem("bookpending"),
        });
      }
    }, 1);

    var profileImgURL = encryption(
      window.localStorage.getItem("UserLogo"),
      "desc"
    );
    this.setState({ profileImgURL });
  }

  clickShipmentType(e) {
    var value = e.target.getAttribute("data-shptye");

    if (value === "" || value === null) {
      window.location.href = "shipment-summary";
    } else {
      window.location.href = "shipment-summary?stype=" + value;
    }
  }
  clickQuetesType(e) {
    var value = e.target.getAttribute("data-Quetye");
    if (value === "" || value === null) {
      window.location.href = "quote-table";
    } else {
      window.location.href = "quote-table?Qtype=" + value;
    }
  }

  toggleProfile() {
    this.setState((prevState) => ({
      modalProfile: !prevState.modalProfile,
    }));
  }

  sidebarCollapse(e) {
    if (localStorage.getItem("isColepse") === "true") {
      e.currentTarget.parentNode.parentNode.classList.remove("colap");

      localStorage.setItem("isColepse", false);
      this.setState({ isColClick: false });
    } else {
      localStorage.setItem("isColepse", true);
      e.currentTarget.parentNode.parentNode.classList.add("colap");

      this.setState({ isColClick: true });
    }
  }

  highlightClass(e) {
    var elems = document.getElementsByClassName("side-menus");

    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.remove("active-menu");
    }
    e.currentTarget.classList.add("active-menu");
  }

  clickBookingType(e) {
    var value = e.target.getAttribute("data-Quetye");
    if (value === "" || value === null) {
      this.props.history.push("booking-table");
    } else {
      this.props.history.push({
        pathname: "booking-table",
        state: {
          status: value,
        },
      });
    }
  }
  ////Handle Submit Profile Pic
  HandleSubmitProfilePic() {
    this.setState({ loading: true });
    let self = this;
    var formData = new FormData();

    var userid = parseInt(
      encryption(window.localStorage.getItem("userid"), "desc")
    );
    formData.append("ProfilePicPath", this.state.imageFile);
    formData.append("UserID", userid);
    formData.append(
      "UserName",
      encryption(window.localStorage.getItem("username"), "desc")
    );
    formData.append("ModifiedBy", userid);

    axios({
      method: "post",
      url: `${appSettings.APIURL}/UpdateProfilePic`,
      data: formData,
      headers: authHeader(),
    })
      .then(function (response) {
        if (response.data.Table.length > 0) {
          self.setState({
            profileImgURL: response.data.Table[0].UserLogo,
          });

          store.addNotification({
            // title: "Success",
            message: response.data.Table[0].Result,
            type: "success", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime,
            },
          });
          window.localStorage.setItem(
            "UserLogo",
            encryption(response.data.Table[0].UserLogo, "enc")
          );
          var pathname = self.props.location.pathname;
          self.setState({ loading: false });
          self.toggleProfile();
          setTimeout(() => {
            window.location.reload(false);
          }, appSettings.NotficationTime);

          self.forceUpdate();
        }
      })
      .catch((error) => {
        self.setState({ loading: false });

        store.addNotification({
          // title: "Error",
          message: error.response.data,
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      });
  }

  ////Handle File Input Data
  HandleFileInput(e) {
    var file = e.target.files[0];
    var t = file.type.split("/").pop().toLowerCase();

    if (t != "jpeg" && t != "jpg" && t != "png" && t != "gif") {
      store.addNotification({
        // title: "Error",
        message: "Please select valid profile image",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    } else {
      var reader = new FileReader();

      var imgtag = document.getElementById("profileImg");
      imgtag.title = file.name;

      reader.onload = function (e) {
        imgtag.src = e.target.result;
      };

      reader.readAsDataURL(file);
      this.setState({ imageFile: file });
    }
  }
  ////toggle QR Code Modal
  toggleCloseQRModal() {
    this.setState({ QrModal: false });
  }

  toggleOpenQRModal() {
    this.handleBindQRCode();
  }

  handleBindQRCode() {
    let self = this;
    var userid = Number(
      encryption(window.localStorage.getItem("userid"), "desc")
    );
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GenerateQRCode`,
      data: {
        UserID: userid,
        IsRefresh: 1,
      },
      headers: authHeader(),
    })
      .then(function (response) {
        var data = response.data;
        if (data.length > 0) {
          self.setState({ QRCode: data[0].QRCode, QrModal: true });
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }
  render() {
    var urlShipSum = window.location.pathname;
    window.localStorage.setItem("defShipActKey", "0");
    if (urlShipSum === "/shipment-summary") {
      window.localStorage.setItem("defShipActKey", "1");
    } else {
      window.localStorage.setItem("defShipActKey", "0");
    }

    var urlQuote = window.location.pathname;
    window.localStorage.setItem("quoteKey", "0");
    if (urlQuote === "/quote-table") {
      window.localStorage.setItem("quoteKey", "1");
    } else {
      window.localStorage.setItem("quoteKey", "0");
    }
    var bookQuote = window.location.pathname;
    window.localStorage.setItem("bookingKey", "0");
    if (bookQuote === "/booking-table") {
      window.localStorage.setItem("bookingKey", "1");
    } else {
      window.localStorage.setItem("bookingKey", "0");
    }

    var urlShipSum = window.location.pathname;
    window.localStorage.setItem("defActKey", "0");
    if (
      encryption(window.localStorage.getItem("usertype"), "desc") ===
        "Sales User" &&
      urlShipSum === "/rate-search"
    ) {
      window.localStorage.setItem("defActKey", "1");
      this.state.activeRateSearch = "rate-active";
    } else if (
      encryption(window.localStorage.getItem("usertype"), "desc") ===
        "Customer" &&
      urlShipSum === "/new-rate-search"
    ) {
      window.localStorage.setItem("defActKey", "1");
      this.state.activeRateSearch = "rate-active";
    } else if (urlShipSum === "/spot-rate-table") {
      window.localStorage.setItem("defActKey", "1");
      this.state.activeSpotList = "rate-active";
    } else {
      window.localStorage.setItem("defActKey", "0");
    }

    return (
      <div
        className="d-flex flex-column justify-content-between h-100 sidemenubar position-relative"
        id="sidemenubar"
      >
        <ReactNotification />
        <div className="side-arrow" onClick={this.sidebarCollapse.bind(this)}>
          <img src={sideArrow} alt="side arrow" />
        </div>

        <ul className="sidemenu-ul">
          <li
            className={
              this.state.CustomerType === "New"
                ? "sidemenu-ul-li lidisabled"
                : "sidemenu-ul-li"
            }
          >
            <Link
              to="/dashboard"
              className="side-menus"
              onClick={this.highlightClass.bind(this)}
            >
              <img
                src={DashboardIcon}
                alt="green-counter-icon"
                title={"Dashboard"}
                className="header-greencounter-icon"
              />
              <span className="menuname">Dashboard</span>
            </Link>
          </li>
          <li
            className={
              this.state.CustomerType === "New"
                ? "sidemenu-ul-li shipmentli lidisabled"
                : "sidemenu-ul-li shipmentli"
            }
            style={{ borderTop: "1px solid #265eb5" }}
          >
            <Accordion
              defaultActiveKey={window.localStorage.getItem("defShipActKey")}
            >
              <Card>
                <Card.Header>
                  <Link
                    to="#"
                    data-shptye=""
                    onClick={this.clickShipmentType.bind(this)}
                    style={{ display: "block" }}
                  >
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img
                        src={ShipmentsIcon}
                        title={"Shipment"}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      <span className="menuname">Shipment</span>
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-shptye="Air"
                          onClick={this.clickShipmentType.bind(this)}
                        >
                          <img
                            src={PlaneWhite}
                            className="header-greencounter-icon AirColor"
                          />
                          Air
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("aircount")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-shptye="Ocean"
                          onClick={this.clickShipmentType.bind(this)}
                        >
                          <img
                            src={ShipWhite}
                            className="header-greencounter-icon AirColor"
                          />
                          Ocean
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("oceancount")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-shptye="Inland"
                          onClick={this.clickShipmentType.bind(this)}
                        >
                          <img
                            src={TruckWhite}
                            className="header-greencounter-icon AirColor"
                          />
                          Inland
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("inlandcount")}
                        </label>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </li>

          <li
            className={
              this.state.CustomerType === "New"
                ? "sidemenu-ul-li shipmentli"
                : this.state.CustomerType === "Hide_rates"
                ? "lidisplay"
                : "sidemenu-ul-li shipmentli"
            }
            style={{ borderTop: "1px solid #265eb5" }}
          >
            <Accordion
              defaultActiveKey={window.localStorage.getItem("defActKey")}
            >
              <Card>
                <Card.Header>
                  {encryption(
                    window.localStorage.getItem("usertype"),
                    "desc"
                  ) === "Sales User" ? (
                    <Link to="/rate-search" style={{ display: "block" }}>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        <img
                          src={RatesIcon}
                          title={"Rates"}
                          alt="green-counter-icon"
                          className="header-greencounter-icon"
                        />
                        Rates
                      </Accordion.Toggle>
                    </Link>
                  ) : (
                    <Link to="/new-rate-search" style={{ display: "block" }}>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        <img
                          src={RatesIcon}
                          title={"Rates"}
                          alt="green-counter-icon"
                          className="header-greencounter-icon"
                        />

                        <span className="menuname">Rates</span>
                      </Accordion.Toggle>
                    </Link>
                  )}
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul sidemenu">
                      <li>
                        {encryption(
                          window.localStorage.getItem("usertype"),
                          "desc"
                        ) === "Sales User" ? (
                          <a
                            href="rate-search"
                            className={this.state.activeRateSearch}
                          >
                            Rate Search
                          </a>
                        ) : (
                          <a
                            href="new-rate-search"
                            className={this.state.activeRateSearch}
                          >
                            Rate Search
                          </a>
                        )}
                      </li>
                      <li>
                        <a
                          href="spot-rate-table"
                          className={this.state.activeSpotList}
                        >
                          Spot Rate Listing
                        </a>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </li>
          <li
            className="sidemenu-ul-li shipmentli"
            style={{ borderTop: "1px solid #265eb5" }}
            onClick={this.highlightClass.bind(this)}
          >
            <Accordion
              defaultActiveKey={window.localStorage.getItem("quoteKey")}
            >
              <Card>
                <Card.Header>
                  <Link
                    to="/quote-table"
                    style={{ display: "block" }}
                    onClick={this.clickQuetesType.bind(this)}
                  >
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img
                        src={QuotesIcon}
                        title={"Quotes"}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      <span className="menuname">Quotes</span>
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Pending"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Pending
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("quotepending")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Approved"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Approved
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("quoteapproved")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Expired"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Expired
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("quoteexpired")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Rejected"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Rejected
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("quoterejected")}
                        </label>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </li>
          <li
            className="sidemenu-ul-li shipmentli"
            style={{ borderTop: "1px solid #265eb5" }}
          >
            <Accordion
              defaultActiveKey={window.localStorage.getItem("bookingKey")}
            >
              <Card>
                <Card.Header>
                  <Link to="/booking-table" style={{ display: "block" }}>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img
                        src={BookingsIcon}
                        title={"Bookings"}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />

                      <span className="menuname">Bookings</span>
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Pending"
                          onClick={this.clickBookingType.bind(this)}
                        >
                          Pending
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("bookpending")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Approved"
                          onClick={this.clickBookingType.bind(this)}
                        >
                          Approved
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("bookapproved")}
                        </label>
                      </li>
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Rejected"
                          onClick={this.clickBookingType.bind(this)}
                        >
                          Rejected
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("bookrejected")}
                        </label>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </li>
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") ===
              "Customer"
            ) {
              return (
                <li
                  className={
                    this.state.CustomerType === "New"
                      ? "sidemenu-ul-li shipmentli lidisabled"
                      : "sidemenu-ul-li shipmentli"
                  }
                  // className="sidemenu-ul-li"
                  style={{ borderTop: "1px solid #265eb5" }}
                >
                  <Link
                    to="/shipment-planner"
                    onClick={this.highlightClass.bind(this)}
                  >
                    <img
                      src={ShipmentPlannerIcon}
                      title={"Shipment Planner"}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />
                    <span className="menuname">Shipment Planner</span>
                  </Link>
                </li>
              );
            }
          })()}
          <li
            className={
              this.state.CustomerType === "New"
                ? "sidemenu-ul-li shipmentli lidisabled"
                : "sidemenu-ul-li shipmentli"
            }
            // className="sidemenu-ul-li"
          >
            <Link
              to="/analytics"
              className="side-menus"
              onClick={this.highlightClass.bind(this)}
            >
              <img
                src={AnalyticsIcon}
                title={"Analytics"}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />

              <span className="menuname">Analytics</span>
            </Link>
          </li>
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") ===
              "Customer"
            ) {
              return (
                <li
                  className={
                    this.state.CustomerType === "New"
                      ? "sidemenu-ul-li shipmentli lidisabled"
                      : "sidemenu-ul-li shipmentli"
                  }
                  // className="sidemenu-ul-li"
                >
                  <Link to="/green-counter">
                    <img
                      src={GreenCounterIcon}
                      alt="green-counter-icon"
                      title={"Green Counter"}
                      className="header-greencounter-icon"
                    />

                    <span className="menuname">Green Counter</span>
                  </Link>
                </li>
              );
            }
          })()}
          {(() => {
            if (
              encryption(window.localStorage.getItem("isAdmin"), "desc") === "Y"
            ) {
              return (
                <li
                  className={
                    this.state.CustomerType === "New"
                      ? "sidemenu-ul-li shipmentli lidisabled"
                      : "sidemenu-ul-li shipmentli"
                  }
                  //  className="sidemenu-ul-li"
                >
                  <Link to="/add-user">
                    <img
                      src={AdminIcon}
                      title={"Admin"}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />

                    <span className="menuname">Admin</span>
                  </Link>
                </li>
              );
            }
          })()}
        </ul>
        <div className="dropdown">
          <ul className="sidemenu-ul2 m-0 menu-optio">
            <li className="op" style={{ width: "100%" }}>
              <img src={InfoIcon} className="inofIcon imgop1" alt="info-icon" />
            </li>
            <li className="op" style={{ width: "100%" }} data-toggle="dropdown">
              <img
                src={SettingIcon}
                className="settingIcon imgop1"
                alt="setting-icon"
              />
            </li>
            <div className="dropdown-menu">
              <ul className="profile-ul">
                <li
                  className={
                    this.state.CustomerType == "New"
                      ? "profile-setting-li lidisabled"
                      : "profile-setting-li"
                  }
                >
                  <Link to="mywayMessage">
                    <img
                      src={ChatIcon}
                      alt="profile-icon"
                      className="profilesetting-icon"
                    />
                    Messages
                  </Link>
                </li>

                <li className="profile-setting-li">
                  <Link to="changePassword">
                    <img
                      src={ProfileSettingIcon}
                      alt="profile-icon"
                      className="profilesetting-icon"
                    />
                    Change Password
                  </Link>
                </li>
                <li className="profile-setting-li" onClick={this.toggleProfile}>
                  <img
                    src={ProfileSettingIcon}
                    alt="profile-icon"
                    className="profilesetting-icon"
                  />
                  Profile Settings
                </li>
                <li
                  className="profile-setting-li dropdown"
                  onClick={this.toggleOpenQRModal}
                >
                  {/* <a href=""> */}
                  <img
                    className="header-phone-icon dropdown-toggle"
                    data-toggle="dropdown"
                    id="qrCode"
                    src={PhoneIcon}
                    alt="mobile-icon"
                  />
                  Mobile App
                  {/* </a> */}
                  <div className="dropdown-menu">
                    <QRCode />
                  </div>
                </li>
              </ul>
            </div>
          </ul>
        </div>
        <Modal
          className="delete-popup pol-pod-popup"
          isOpen={this.state.modalProfile}
          toggle={this.toggleProfile}
          centered={true}
        >
          <ModalBody>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={this.toggleProfile}
            >
              <span>&times;</span>
            </button>
            <div
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "15px",
              }}
            >
              <div className="d-flex align-items-center text-left">
                <div className="prof-img">
                  <img
                    id="profileImg"
                    className="profileIMG"
                    src={this.state.profileImgURL}
                  />
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
                      onChange={this.HandleFileInput.bind(this)}
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

              <button
                className="butn btn btn-secondary"
                onClick={this.HandleSubmitProfilePic.bind(this)}
              >
                {this.state.loading == true ? (
                  <i
                    style={{ marginRight: 15 }}
                    className="fa fa-refresh fa-spin"
                  ></i>
                ) : null}
                {this.state.loading ? "Please Wait ..." : "Submit"}
              </button>
              <Button
                className="butn cancel-butn btn btn-secondary"
                onClick={() => {
                  this.toggleProfile();
                }}
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>

        {/*----------------------------- QR Code Modal--------------------- */}
        <Modal
          className="delete-popup pol-pod-popup"
          isOpen={this.state.QrModal}
          toggle={this.toggleCloseQRModal.bind(this)}
          centered={true}
        >
          <ModalBody>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={this.toggleCloseQRModal.bind(this)}
            >
              <span>&times;</span>
            </button>
            <div
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "15px",
              }}
            >
              <h3>QR Code</h3>
              {this.state.QRCode !== "" ? (
                <QRCode QRCode={this.state.QRCode} />
              ) : null}
            </div>
          </ModalBody>
        </Modal>
        {/*----------------------------- QR Code Modal--------------------- */}
      </div>
    );
  }
}

export default withRouter(SideMenu);

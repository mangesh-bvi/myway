import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/custom.css";
import { Accordion, Button, Card } from "react-bootstrap";
import GreenCounterIcon from "./../assets/img/green-counter-side.png";
import BookingsIcon from "./../assets/img/bookings-side.png";
import AnalyticsIcon from "./../assets/img/analytics-side.png";
import RatesIcon from "./../assets/img/rates-side.png";
import AdminIcon from "./../assets/img/admin-side.png";
import ShipmentPlannerIcon from "./../assets/img/shipment-planner-side.png";
import ShipmentsIcon from "./../assets/img/shipment-side.png";
import DashboardIcon from "./../assets/img/dashboard-side.png";
import QuotesIcon from "./../assets/img/quotes-side.png";
import InfoIcon from "./../assets/img/info.png";
import SettingIcon from "./../assets/img/Settings.png";
import { encryption } from "../helpers/encryption";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircount: "0",
      activeRateSearch: "",
      activeSpotList: ""
    };
  }

  clickShipmentType(e) {
    var value = e.target.getAttribute("data-shptye");
    //  alert(value)
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

  highlightClass(e) {
    debugger;
    console.log(e.classList);

    var elems = document.getElementsByClassName("side-menus");
    // elems.forEach(element => {
    //   debugger;
    //   element.classList.remove("active-menu");
    // });
    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.remove("active-menu");
    }
    e.currentTarget.classList.add("active-menu");
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
    if (urlShipSum === "/rate-search") {
      window.localStorage.setItem("defActKey", "1");
      this.state.activeRateSearch = "rate-active";
    } else if (urlShipSum === "/spot-rate-table") {
      window.localStorage.setItem("defActKey", "1");
      this.state.activeSpotList = "rate-active";
    } else {
      window.localStorage.setItem("defActKey", "0");
    }

    // var urlShipSum = window.location.pathname;
    // window.localStorage.setItem("defspotActKey", "0");
    // if (urlShipSum === "/spot-rate-table") {
    //   window.localStorage.setItem("defspotActKey", "1");
    // } else {
    //   window.localStorage.setItem("defspotActKey", "0");
    // }

    return (
      <div className="d-flex flex-column justify-content-between h-100">
        <ul className="sidemenu-ul">
          <li className="sidemenu-ul-li">
            <Link
              to="/dashboard"
              className="side-menus active-menu"
              // onClick={this.highlightClass.bind(this)}
            >
              <img
                src={DashboardIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Dashboard
            </Link>
          </li>
          <li className="sidemenu-ul-li shipmentli">
            {/* <Link to="/quote-table">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Quotes
            </Link> */}
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
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      Quotes
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      {/* <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Current"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Current
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("quotecurrent")}
                        </label>
                      </li> */}
                      <li>
                        <label
                          className="shipment-ul-lilbl1"
                          data-Quetye="Pending"
                          onClick={this.clickQuetesType.bind(this)}
                        >
                          Pending
                        </label>
                        <label className="shipment-ul-lilbl2">
                          {/* {parseFloat(window.localStorage.getItem("quotepending")) + parseFloat(window.localStorage.getItem("quotecurrent"))} */}
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
          <li className="sidemenu-ul-li shipmentli">
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
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      Shipment
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
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") ===
              "Customer"
            ) {
              return (
                <li className="sidemenu-ul-li">
                  <Link to="/shipment-planner">
                    <img
                      src={ShipmentPlannerIcon}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />
                    Shipment Planner
                  </Link>
                </li>
              );
            }
          })()}
          <li className="sidemenu-ul-li shipmentli">
            {/* <Link to="/booking-table">
              <img
                src={GreenCounterIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Bookings
            </Link> */}

            <Accordion
              defaultActiveKey={window.localStorage.getItem("bookingKey")}
            >
              <Card>
                <Card.Header>
                  <Link to="/booking-table" style={{ display: "block" }}>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img
                        src={BookingsIcon}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      Bookings
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      <li>
                        <label className="shipment-ul-lilbl1">Pending</label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("bookpending")}
                        </label>
                      </li>
                      <li>
                        <label className="shipment-ul-lilbl1">Approved</label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("bookapproved")}
                        </label>
                      </li>
                      <li>
                        <label className="shipment-ul-lilbl1">Rejected</label>
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
          <li className="sidemenu-ul-li shipmentli">
            <Accordion
              defaultActiveKey={window.localStorage.getItem("defActKey")}
              // defaultActiveKey={window.localStorage.getItem("defspotActKey")}
            >
              <Card>
                <Card.Header>
                  <Link to="/rate-search" style={{ display: "block" }}>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      <img
                        src={RatesIcon}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      Rates
                    </Accordion.Toggle>
                  </Link>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul className="shipment-ul">
                      <li>
                        {/* <label className="shipment-ul-lilbl1">Rate Search</label> */}
                        <a
                          href="rate-search"
                          className={this.state.activeRateSearch}
                        >
                          {/* <img
                            src={RatesIcon}
                            alt="green-counter-icon"
                            className="header-greencounter-icon"
                          /> */}
                          Rate Search
                        </a>
                      </li>
                      <li>
                        <a
                          href="spot-rate-table"
                          className={this.state.activeSpotList}
                        >
                          {/* <img
                            src={RatesIcon}
                            alt="green-counter-icon"
                            className="header-greencounter-icon"
                          /> */}
                          Spot Rate Listing
                        </a>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </li>
          <li className="sidemenu-ul-li">
            <Link
              to="/analytics"
              className="side-menus"
              // onClick={this.highlightClass.bind(this)}
            >
              <img
                src={AnalyticsIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Analytics
            </Link>
          </li>
          {/* <li className="sidemenu-ul-li">
            <Link to="/reports">
              <img
                src={AnalyticsIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Reports
            </Link>
          </li> */}
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") ===
              "Customer"
            ) {
              return (
                <li className="sidemenu-ul-li">
                  <Link to="/green-counter">
                    <img
                      src={GreenCounterIcon}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />
                    Green Counter
                  </Link>
                </li>
              );
            }
          })()}
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") !==
                "Customer" &&
              encryption(window.localStorage.getItem("usertype"), "desc") !==
                "Sales User"
            ) {
              return (
                <li className="sidemenu-ul-li">
                  <Link to="/add-user">
                    <img
                      src={AdminIcon}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />
                    Admin
                  </Link>
                </li>
              );
            }
          })()}
        </ul>
        <ul className="sidemenu-ul2 m-0">
          <li style={{ width: "50%" }}>
            <img src={InfoIcon} className="inofIcon" alt="info-icon" />
          </li>
          <li style={{ width: "50%" }}>
            <img src={SettingIcon} className="settingIcon" alt="setting-icon" />
          </li>
        </ul>
      </div>
    );
  }
}

export default SideMenu;

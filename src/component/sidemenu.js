import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/custom.css";
import { Accordion, Button, Card } from "react-bootstrap";
import GreenCounterIcon from "./../assets/img/green-counter.png";
import AnalyticsIcon from "./../assets/img/analytics.png";
import RatesIcon from "./../assets/img/rates.png";
import ShipmentsIcon from "./../assets/img/shipments.png";
import DashboardIcon from "./../assets/img/dashboard.png";
import QuotesIcon from "./../assets/img/quotes.png";
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

  render() {
    var urlShipSum = window.location.pathname;
    window.localStorage.setItem("defShipActKey", "0");
    if (urlShipSum === "/shipment-summary") {
      window.localStorage.setItem("defShipActKey", "1");
    } else {
      window.localStorage.setItem("defShipActKey", "0");
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
            <Link to="/dashboard">
              <img
                src={DashboardIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Dashboard
            </Link>
          </li>
          <li className="sidemenu-ul-li">
            <Link to="/quote-table">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Quotes
            </Link>
          </li>
          <li className="sidemenu-ul-li shipmentli">
            <Accordion
              defaultActiveKey={window.localStorage.getItem("defShipActKey")}
            >
              <Card>
                <Card.Header>
                  <Link to="/shipment-summary" style={{ display: "block" }}>
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
                        <label className="shipment-ul-lilbl1">Air</label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("aircount")}
                        </label>
                      </li>
                      <li>
                        <label className="shipment-ul-lilbl1">Ocean</label>
                        <label className="shipment-ul-lilbl2">
                          {window.localStorage.getItem("oceancount")}
                        </label>
                      </li>
                      <li>
                        <label className="shipment-ul-lilbl1">Inland</label>
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
              encryption(window.localStorage.getItem("usertype"), "desc") ==
              "Customer"
            ) {
              return (
                <li className="sidemenu-ul-li">
                  <Link to="/shipment-planner">
                    <img
                      src={RatesIcon}
                      alt="green-counter-icon"
                      className="header-greencounter-icon"
                    />
                    Shipment Planner
                  </Link>
                </li>
              );
            }
          })()}
          <li className="sidemenu-ul-li">
            <Link to="/booking-table">
              <img
                src={GreenCounterIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Bookings
            </Link>
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
                          <img
                            src={RatesIcon}
                            alt="green-counter-icon"
                            className="header-greencounter-icon"
                          />
                          Rate Search
                        </a>
                      </li>
                      <li>
                        <a
                          href="spot-rate-table"
                          className={this.state.activeSpotList}
                        >
                          <img
                            src={RatesIcon}
                            alt="green-counter-icon"
                            className="header-greencounter-icon"
                          />
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
            <Link to="/analytics">
              <img
                src={AnalyticsIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Analytics
            </Link>
          </li>
          {(() => {
            if (
              encryption(window.localStorage.getItem("usertype"), "desc") ==
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
          <li className="sidemenu-ul-li">
            <Link to="/add-user">
              <img
                src={GreenCounterIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Admin
            </Link>
          </li>
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

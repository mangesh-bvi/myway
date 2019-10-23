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

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircount: "0"
    };
  }

  render() {
    var urlShipSum = window.location.pathname;
    window.localStorage.setItem("defActKey", "0");
    if (urlShipSum === "/shipment-summary") {
      window.localStorage.setItem("defActKey", "1");
    } else {
      window.localStorage.setItem("defActKey", "0");
    }

    return (
      <div>
        <div>
          <ul className="sidemenu-ul">
            <li className="sidemenu-ul-li">
              <a href="/dashboard">
                <img
                  src={DashboardIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Dashboard
              </a>
            </li>
            <li className="sidemenu-ul-li">
              <a href="quote-table">
                <img
                  src={QuotesIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Quotes
              </a>
            </li>
            <li className="sidemenu-ul-li shipmentli">
              <Accordion
                defaultActiveKey={window.localStorage.getItem("defActKey")}
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
            <li className="sidemenu-ul-li">
              <a href="shipment-planner">
                <img
                  src={RatesIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Shipment Planner
              </a>
            </li>
            <li className="sidemenu-ul-li">
              <a href="booking-table">
                <img
                  src={GreenCounterIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Bookings
              </a>
            </li>
            <li className="sidemenu-ul-li">
              <a href="rate-search">
                <img
                  src={RatesIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Rates
              </a>
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={AnalyticsIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Analytics
            </li>
            <li className="sidemenu-ul-li">
              <a href="green-counter">
                <img
                  src={GreenCounterIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Green Counter
              </a>
            </li>
          </ul>
          <ul className="sidemenu-ul2" style={{ marginTop: "84%" }}>
            <li style={{ width: "50%" }}>
              <img src={InfoIcon} className="inofIcon" alt="info-icon" />
            </li>
            <li style={{ width: "50%" }}>
              <img
                src={SettingIcon}
                className="settingIcon"
                alt="setting-icon"
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SideMenu;

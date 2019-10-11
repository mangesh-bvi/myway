import React, { Component } from "react";
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
    this.state = {};
  }

  openPage = () => {
    window.location.href = "./shipment-summary";
  };

  render() {
    return (
      <div>
        <div>
          <ul className="sidemenu-ul">
            <li className="sidemenu-ul-li">
              <img
                src={DashboardIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />{" "}
              Dashboard
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Quotes
            </li>
            <li className="sidemenu-ul-li shipmentli">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle
                      onClick={this.openPage}
                      as={Button}
                      variant="link"
                      eventKey="1"
                    >
                      <img
                        src={ShipmentsIcon}
                        alt="green-counter-icon"
                        className="header-greencounter-icon"
                      />
                      Shipment
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <ul className="shipment-ul">
                        <li>
                          <label className="shipment-ul-lilbl1">Air</label>
                          <label className="shipment-ul-lilbl2">25</label>
                        </li>
                        <li>
                          <label className="shipment-ul-lilbl1">Ocean</label>
                          <label className="shipment-ul-lilbl2">10</label>
                        </li>
                        <li>
                          <label className="shipment-ul-lilbl1">Truck</label>
                          <label className="shipment-ul-lilbl2">5</label>
                        </li>
                        <li>
                          <label className="shipment-ul-lilbl1">LCL</label>
                          <label className="shipment-ul-lilbl2">1</label>
                        </li>
                      </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={GreenCounterIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Bookings
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={RatesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Rates
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

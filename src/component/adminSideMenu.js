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
import { Link } from "react-router-dom";

class AdminSideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openPage = () => {
    window.location.href = "./shipment-summary";
  };

  render() {
    return (
      <div className="d-flex flex-column justify-content-between h-100">
        <ul className="sidemenu-ul">
          <li className="sidemenu-ul-li">
            <Link to="/view-user">
              <img
                src={DashboardIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />{" "}
              User Listing
            </Link>
          </li>
          <li className="sidemenu-ul-li">
            <Link to="/add-user">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />{" "}
              Add User
            </Link>
          </li>
          <li className="sidemenu-ul-li">
            <Link to="/add-sales-user">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />{" "}
              Add Sales User
            </Link>
          </li>
          <li className="sidemenu-ul-li">
            <Link to="/event-management">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Add Event
            </Link>
          </li>
          <li className="sidemenu-ul-li">
            <Link to="/activity-log">
              <img
                src={QuotesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Activity Log
            </Link>
          </li>
          {/* <li className="sidemenu-ul-li">
              <img
                src={GreenCounterIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Add Sales User
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={RatesIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              View Banners
            </li>
            <li className="sidemenu-ul-li">
              <img
                src={AnalyticsIcon}
                alt="green-counter-icon"
                className="header-greencounter-icon"
              />
              Add Banners
            </li>
            <li className="sidemenu-ul-li">
              <a href="green-counter">
                <img
                  src={GreenCounterIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Activity Log
              </a>
            </li>
            <li className="sidemenu-ul-li">
              <a href="green-counter">
                <img
                  src={GreenCounterIcon}
                  alt="green-counter-icon"
                  className="header-greencounter-icon"
                />
                Event Management
              </a>
            </li> */}
        </ul>
        <ul className="sidemenu-ul2 m-0"></ul>
      </div>
    );
  }
}

export default AdminSideMenu;

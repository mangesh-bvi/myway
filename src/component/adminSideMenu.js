import React, { Component } from "react";
import "../styles/custom.css"; 
import DashboardIcon from "./../assets/img/dashboard.png";
import QuotesIcon from "./../assets/img/quotes.png"; 
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
           
        </ul>
        <ul className="sidemenu-ul2 m-0"></ul>
      </div>
    );
  }
}

export default AdminSideMenu;

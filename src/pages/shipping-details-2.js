import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";

class ShippingDetailsTwo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8 p-0">
                  <div className="title-sect">
                    <h2>Details View</h2>
                  </div>
                  <ul className="nav cust-tabs" role="tablist">
                    <li>
                      <a
                        className="active"
                        id="details-tab"
                        data-toggle="tab"
                        href="#details"
                        role="tab"
                        aria-controls="details"
                        aria-selected="true"
                      >
                        Details
                      </a>
                    </li>
                    <li>
                      <a
                        id="documents-tab"
                        data-toggle="tab"
                        href="#documents"
                        role="tab"
                        aria-controls="documents"
                        aria-selected="false"
                      >
                        Documents
                      </a>
                    </li>
                    <li>
                      <a
                        id="activity-tab"
                        data-toggle="tab"
                        href="#activity"
                        role="tab"
                        aria-controls="activity"
                        aria-selected="false"
                      >
                        Activity
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content cust-tabs-content">
                    <div
                      className="tab-pane fade show active"
                      id="details"
                      role="tabpanel"
                      aria-labelledby="details-tab"
                    >
                      <div className="row">
                        <div className="col-md-3 details-border">
                          <p className="details-title">HBL#</p>
                          <a href="#!" className="details-para">
                            AQTYISTSE015723
                          </a>
                        </div>
                        <div className="col-md-3 details-border">
                          <p className="details-para">MEDUI1105929</p>
                        </div>
                        <div className="col-md-3 details-border">
                          <p className="details-title">Status</p>
                          <p className="details-para">Transshipped</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 details-border">
                          <p className="details-title">Mode of Transport</p>
                          <p className="details-para">Ocean</p>
                        </div>
                        <div className="col-md-3 details-border">
                          <p className="details-title">Cargo Type</p>
                          <p className="details-para">Straight</p>
                        </div>
                        <div className="col-md-3 details-border">
                          <p className="details-title">ATA Booking No#</p>
                        </div>
                        <div className="col-md-3 details-border">
                          <p className="details-title">SRT No#</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 details-border">
                          <p className="details-title">Status Date</p>
                          <p className="details-para">9-18-2019 12:00:00 AM</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="documents"
                      role="tabpanel"
                      aria-labelledby="documents-tab"
                    >
                      2
                    </div>
                    <div
                      className="tab-pane fade"
                      id="activity"
                      role="tabpanel"
                      aria-labelledby="activity-tab"
                    >
                      3
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="ship-detail-maps">
                    <div className="shipment-track-cntr">
                      <div className="shipment-track">
                        <div>
                          <p className="est-title">Estimated Time of Arrival</p>
                          <p className="est-time">
                            9 October 2019, 90:45:56 Min
                          </p>
                        </div>
                        <div className="ship-white-cntr">
                          <div className="ship-white">
                            <img src={ShipWhite} alt="ship icon" />
                          </div>
                        </div>
                      </div>
                      <div className="track-details">
                        <div className="track-line-cntr active">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Booked} alt="booked icon" />
                            </div>
                          </div>
                          <p>
                            <span>Booked : </span>6 Oct 2019, 10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr active">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Departed} alt="departed icon" />
                            </div>
                          </div>
                          <p>
                            <span>Departed : </span>9 Oct 2019, 90:45:56
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Arrived} alt="arrived icon" />
                            </div>
                          </div>
                          <p>
                            <span>Arrived : </span>ETA 9 Oct 2019, 10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Inland} alt="inland icon" />
                            </div>
                          </div>
                          <p>
                            <span>Inland Transportation : </span>ETA 9 Oct 2019,
                            10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Delivery} alt="delivery icon" />
                            </div>
                          </div>
                          <p>
                            <span>Delivered : </span>ETA 9 Oct 2019, 10:45:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingDetailsTwo;

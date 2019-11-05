import React, { Component } from "react";
import Headers from "../component/header";
import PlaneBlue from "./../assets/img/plane-blue.svg";
import PlaneWhite from "./../assets/img/plane-white.svg";
import TruckBlue from "./../assets/img/truck-blue.svg";
import { Bar, Doughnut } from "react-chartjs-2";
import TruckWhite from "./../assets/img/truck-white.svg";
import ShipBlue from "./../assets/img/ship-blue.svg";
import ShipWhite from "./../assets/img/ship-white.svg";
import SideMenu from "../component/sidemenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var volumeOptions = {
  title: {
    display: true,
    text: "Total Freight Spend",
    fontSize: 16,
    fontFamily: "Bold Font",
    fontColor: "#000",
    padding: 20
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 7,
      fontFamily: "Medium Font",
      fontSize: 14,
      fontColor: "#000",
      usePointStyle: true,
      padding: 20
    }
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "#999",
          fontSize: 14,
          callback: function(value) {
            return value + "k";
          }
        },
        scaleLabel: {
          display: true,
          labelString: "USD",
          fontFamily: "Medium Font",
          fontSize: 14,
          fontColor: "#777"
        },
        stacked: true
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "#999",
          fontSize: 14
        },
        stacked: true,
        gridLines: {
          display: false
        }
      }
    ]
  }
};

var greencounterOption = {
  title: {
    display: true,
    text: "Total: $455k",
    fontSize: 16,
    fontFamily: "Bold Font",
    fontColor: "#000",
    padding: 20
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  rotation: 0.5 * Math.PI,
  cutoutPercentage: 0
};

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      toggleShipShip: false,
      toggleRoadShip: false,
      toggleShipInv: false,
      toggleRoadInv: false
    };
  }

  handleChangeStart = e => {
    this.setState({
      startDate: e
    });
  };
  handleChangeEnd = e => {
    this.setState({
      endDate: e
    });
  };

  toggleBtnsShip = e => {
    console.log(e.target.id);
    if (e.target.id === "ship-ship") {
      this.setState({
        toggleShipShip: true,
        toggleRoadShip: false
      });
    } else if (e.target.id === "road-ship") {
      this.setState({
        toggleRoadShip: true,
        toggleShipShip: false
      });
    } else if (e.target.id === "plane-ship") {
      this.setState({
        toggleRoadShip: false,
        toggleShipShip: false
      });
    }
  };
  toggleBtnsInv = e => {
    console.log(e.target.id);
    if (e.target.id === "ship-inv") {
      this.setState({
        toggleShipInv: true,
        toggleRoadInv: false
      });
    } else if (e.target.id === "road-inv") {
      this.setState({
        toggleRoadInv: true,
        toggleShipInv: false
      });
    } else if (e.target.id === "plane-inv") {
      this.setState({
        toggleRoadInv: false,
        toggleShipInv: false
      });
    }
  };

  render() {
    var buyerData = {
      labels: [
        "Apr, 2017",
        "May, 2017",
        "Jun, 2017",
        "Jul, 2017",
        "Aug, 2017",
        "Sep, 2017",
        "Oct, 2017",
        "Nov, 2017",
        "Dec, 2017",
        "Jan, 2018",
        "Feb, 2018",
        "Mar, 2018"
      ],
      datasets: [
        {
          fillColor: "rgba(172,194,132,0.4)",
          strokeColor: "#ACC26D",
          pointColor: "#fff",
          pointStrokeColor: "#9DB86D",
          label: "Ocean",
          data: [0, 0, 50, 35, 20, 0, 10, 5, 5, 80, 0, 0],
          backgroundColor: "#4a99e7"
        },
        {
          label: "Truck",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0],
          backgroundColor: "#50ad84"
        },
        {
          label: "Air",
          data: [2, 15, 15, 10, 8, 40, 20, 10, 18, 40, 40, 17],
          backgroundColor: "#3357ac"
        }
      ]
    };
    let greenCounterdata = {
      labels: ["Green", "Red"],
      datasets: [
        {
          data: [40, 10, 50],
          backgroundColor: ["#4a99e7", "#50ad84", "#3357ac"]
          // hoverBackgroundColor: ["#63CD16", "#EF1617"]
          // borderWidth: 0
        }
      ],
      text: "23%"
    };

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <ul className="nav cust-tabs pt-2" role="tablist">
              <li>
                <a
                  className="active"
                  id="shipments-tab"
                  data-toggle="tab"
                  href="#shipments"
                  role="tab"
                  aria-controls="shipments"
                  aria-selected="true"
                >
                  Shipments
                </a>
              </li>
              <li>
                <a
                  id="invoices-tab"
                  data-toggle="tab"
                  href="#invoices"
                  role="tab"
                  aria-controls="invoices"
                  aria-selected="false"
                >
                  Invoices
                </a>
              </li>
            </ul>
            <div className="tab-content cust-tabs-content">
              <div
                className="tab-pane fade show active"
                id="shipments"
                role="tabpanel"
                aria-labelledby="shipments-tab"
              >
                <div className="ana-radio-cntr">
                  <div className="analy-radio new-radio-rate-cntr radio-light-blue">
                    <div>
                      <input type="radio" name="ship-type" id="active-ship" />
                      <label htmlFor="active-ship">Active</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="ship-type"
                        id="delivered-ship"
                      />
                      <label htmlFor="delivered-ship">Delivered</label>
                    </div>
                  </div>
                  <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="plane-ship"
                        onClick={this.toggleBtnsShip}
                      />
                      <label htmlFor="plane-ship">
                        <img
                          className="ana-icon-blue"
                          src={PlaneBlue}
                          alt="plane icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={PlaneWhite}
                          alt="plane icon"
                        />
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="ship-ship"
                        onClick={this.toggleBtnsShip}
                      />
                      <label htmlFor="ship-ship">
                        <img
                          className="ana-icon-blue"
                          src={ShipBlue}
                          alt="ship icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={ShipWhite}
                          alt="ship icon"
                        />
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="road-ship"
                        onClick={this.toggleBtnsShip}
                      />
                      <label htmlFor="road-ship">
                        <img
                          className="ana-icon-blue"
                          src={TruckBlue}
                          alt="truck icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={TruckWhite}
                          alt="truck icon"
                        />
                      </label>
                    </div>
                  </div>
                  {this.state.toggleShipShip && (
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input type="radio" name="sea-opt" id="fcl-ship" />
                        <label htmlFor="fcl-ship">FCL</label>
                      </div>
                      <div>
                        <input type="radio" name="sea-opt" id="lcl-ship" />
                        <label htmlFor="lcl-ship">LCL</label>
                      </div>
                    </div>
                  )}
                  {this.state.toggleRoadShip && (
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input type="radio" name="road-opt" id="ftl-ship" />
                        <label htmlFor="ftl-ship">FTL</label>
                      </div>
                      <div>
                        <input type="radio" name="road-opt" id="ltl-ship" />
                        <label htmlFor="ltl-ship">LTL</label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0">
                    <select>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  {/* <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Supplier </span>
                    <select>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                    </select>
                  </div> */}
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Segregated&nbsp;by </span>
                    <select>
                      <option>Volume Chart</option>
                      <option>Count Chart</option>
                      <option>Value Chart</option>
                    </select>
                  </div>
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Dated&nbsp;by </span>
                    <select>
                      <option>Delivery Date</option>
                      <option>Booking Date</option>
                      <option>Dispatched Date</option>
                    </select>
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>From </span>
                    <DatePicker
                      className="ana-to"
                      selected={this.state.startDate}
                      onChange={this.handleChangeStart}
                    />
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>To </span>
                    <DatePicker
                      className="ana-to"
                      selected={this.state.endDate}
                      onChange={this.handleChangeEnd}
                    />
                  </div>
                  {/* <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Values </span>
                    <select>
                      <option>$1 - $100</option>
                      <option>$101 - $200</option>
                      <option>$201 - $300</option>
                    </select>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-9">
                    <Bar
                      data={buyerData}
                      width={100}
                      height={50}
                      options={volumeOptions}
                    />
                  </div>
                  <div className="col-md-3">
                    <Doughnut
                      data={greenCounterdata}
                      width={700}
                      height={600}
                      options={greencounterOption}
                    />
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="invoices"
                role="tabpanel"
                aria-labelledby="invoices-tab"
              >
                <div className="ana-radio-cntr">
                  <div className="analy-radio new-radio-rate-cntr radio-light-blue">
                    <div>
                      <input type="radio" name="ship-type" id="active-inv" />
                      <label htmlFor="active-inv">Active</label>
                    </div>
                    <div>
                      <input type="radio" name="ship-type" id="delivered-inv" />
                      <label htmlFor="delivered-inv">Delivered</label>
                    </div>
                  </div>
                  <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="plane-inv"
                        onClick={this.toggleBtnsInv}
                      />
                      <label htmlFor="plane-inv">
                        <img
                          className="ana-icon-blue"
                          src={PlaneBlue}
                          alt="plane icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={PlaneWhite}
                          alt="plane icon"
                        />
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="ship-inv"
                        onClick={this.toggleBtnsInv}
                      />
                      <label htmlFor="ship-inv">
                        <img
                          className="ana-icon-blue"
                          src={ShipBlue}
                          alt="ship icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={ShipWhite}
                          alt="ship icon"
                        />
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="ship-way"
                        id="road-inv"
                        onClick={this.toggleBtnsInv}
                      />
                      <label htmlFor="road-inv">
                        <img
                          className="ana-icon-blue"
                          src={TruckBlue}
                          alt="truck icon"
                        />
                        <img
                          className="ana-icon-white"
                          src={TruckWhite}
                          alt="truck icon"
                        />
                      </label>
                    </div>
                  </div>
                  {this.state.toggleShipInv && (
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input type="radio" name="sea-opt" id="fcl-inv" />
                        <label htmlFor="fcl-inv">FCL</label>
                      </div>
                      <div>
                        <input type="radio" name="sea-opt" id="lcl-inv" />
                        <label htmlFor="lcl-inv">LCL</label>
                      </div>
                    </div>
                  )}
                  {this.state.toggleRoadInv && (
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input type="radio" name="road-opt" id="ftl-inv" />
                        <label htmlFor="ftl-inv">FTL</label>
                      </div>
                      <div>
                        <input type="radio" name="road-opt" id="ltl-inv" />
                        <label htmlFor="ltl-inv">LTL</label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0">
                    <select>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Supplier </span>
                    <select>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                    </select>
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>From </span>
                    <DatePicker
                      className="ana-to"
                      selected={this.state.startDate}
                      onChange={this.handleChangeStart}
                    />
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>To </span>
                    <DatePicker
                      className="ana-to"
                      selected={this.state.endDate}
                      onChange={this.handleChangeEnd}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Bar
                      data={buyerData}
                      width={100}
                      height={50}
                      options={volumeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Analytics;

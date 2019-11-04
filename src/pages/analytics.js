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
var pieOptions = {
  cutoutPercentage: 0
  // title: {
  //   display: true,
  //   text: "Total Freight Spend",
  //   fontSize: 16,
  //   fontFamily: "Bold Font",
  //   fontColor: "#000",
  //   padding: 20
  // },
  // legend: {
  //   display: true,
  //   position: "bottom",
  //   labels: {
  //     boxWidth: 7,
  //     fontFamily: "Medium Font",
  //     fontSize: 14,
  //     fontColor: "#000",
  //     usePointStyle: true,
  //     padding: 20
  //   }
  // },
  // scales: {
  //   yAxes: [
  //     {
  //       ticks: {
  //         fontColor: "#999",
  //         fontSize: 14,
  //         callback: function(value) {
  //           return value + "k";
  //         }
  //       },
  //       scaleLabel: {
  //         display: true,
  //         labelString: "USD",
  //         fontFamily: "Medium Font",
  //         fontSize: 14,
  //         fontColor: "#777"
  //       },
  //       stacked: true
  //     }
  //   ],
  //   xAxes: [
  //     {
  //       ticks: {
  //         fontColor: "#999",
  //         fontSize: 14
  //       },
  //       stacked: true,
  //       gridLines: {
  //         display: false
  //       }
  //     }
  //   ]
  // }
};

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    var pieData = {
      // labels: ["Red", "Yellow", "Blue"],
      // datasets: [
      //   {
      //     data: [10, 20, 30]
      //   }
      // ]
      // datasets: [
      //   {
      //     fillColor: "rgba(172,194,132,0.4)",
      //     strokeColor: "#ACC26D",
      //     pointColor: "#fff",
      //     pointStrokeColor: "#9DB86D",
      //     label: "Ocean",
      //     data: [0, 0, 50, 35, 20, 0, 10, 5, 5, 80, 0, 0],
      //     backgroundColor: "#4a99e7"
      //   },
      //   {
      //     label: "Truck",
      //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0],
      //     backgroundColor: "#50ad84"
      //   },
      //   {
      //     label: "Air",
      //     data: [2, 15, 15, 10, 8, 40, 20, 10, 18, 40, 40, 17],
      //     backgroundColor: "#3357ac"
      //   }
      // ]
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
                      <input type="radio" name="ship-type" id="active" />
                      <label htmlFor="active">Active</label>
                    </div>
                    <div>
                      <input type="radio" name="ship-type" id="delivered" />
                      <label htmlFor="delivered">Delivered</label>
                    </div>
                  </div>
                  <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                    <div>
                      <input type="radio" name="ship-way" id="plane" />
                      <label htmlFor="plane">
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
                      <input type="radio" name="ship-way" id="ship" />
                      <label htmlFor="ship">
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
                      <input type="radio" name="ship-way" id="road" />
                      <label htmlFor="road">
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
                    <span>Segregated&nbsp;by </span>
                    <select>
                      <option>Main Transit Mode</option>
                      <option>Main Transit Mode</option>
                      <option>Main Transit Mode</option>
                      <option>Main Transit Mode</option>
                    </select>
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Dated&nbsp;by </span>
                    <select>
                      <option>Delivery Date</option>
                      <option>Booking Date</option>
                      <option>Dispatched Date</option>
                    </select>
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
                      data={pieData}
                      options={pieOptions}
                      width={100}
                      height={50}
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
                Invoices
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Analytics;

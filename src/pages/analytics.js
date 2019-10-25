import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";

class Analytics extends Component {
  render() {
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
                  id="products-tab"
                  data-toggle="tab"
                  href="#products"
                  role="tab"
                  aria-controls="products"
                  aria-selected="false"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  id="containers-tab"
                  data-toggle="tab"
                  href="#containers"
                  role="tab"
                  aria-controls="containers"
                  aria-selected="false"
                >
                  Containers
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
              </div>
              <div
                className="tab-pane fade"
                id="products"
                role="tabpanel"
                aria-labelledby="products-tab"
              >
                87 7
              </div>
              <div
                className="tab-pane fade"
                id="containers"
                role="tabpanel"
                aria-labelledby="containers-tab"
              >
                3
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Analytics;

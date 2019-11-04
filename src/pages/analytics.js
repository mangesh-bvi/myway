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
                <div className="analy-radio new-radio-rate-cntr radio-light-blue">
                  <div>
                    <input type="radio" name="ship-way" id="plane" />
                    <label htmlFor="plane">Plane</label>
                  </div>
                  <div>
                    <input type="radio" name="ship-way" id="ship" />
                    <label htmlFor="ship">Ship</label>
                  </div>
                  <div>
                    <input type="radio" name="ship-way" id="road" />
                    <label htmlFor="road">Road</label>
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

import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";

class NewRateSearch extends Component {
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
          <div className="cls-rt text-center">
            <div className="new-rate-cntr">
              <h3>Shipment Type</h3>
              <div className="new-radio-rate-cntr radio-blue">
                <div>
                  <input type="radio" name="ship-type" id="export" />
                  <label htmlFor="export">Export</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    id="import"
                    defaultChecked
                  />
                  <label htmlFor="import">Import</label>
                </div>
                <div>
                  <input type="radio" name="ship-type" id="cross" />
                  <label htmlFor="cross">Cross Trade</label>
                </div>
                <div>
                  <input type="radio" name="ship-type" id="domestic" />
                  <label htmlFor="domestic">Domestic</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Mode of Transport</h3>
              <div className="new-radio-rate-cntr radio-green">
                <div>
                  <input type="radio" name="mode-transport" id="sea" />
                  <label htmlFor="sea">Sea</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="mode-transport"
                    id="air"
                    defaultChecked
                  />
                  <label htmlFor="air">Air</label>
                </div>
                <div>
                  <input type="radio" name="mode-transport" id="road" />
                  <label htmlFor="road">Road</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Container Load</h3>
              <div className="new-radio-rate-cntr radio-light-blue">
                <div>
                  <input
                    type="radio"
                    name="cntr-load"
                    id="fcl"
                    defaultChecked
                  />
                  <label htmlFor="fcl">FCL</label>
                </div>
                <div>
                  <input type="radio" name="cntr-load" id="lcl" />
                  <label htmlFor="lcl">LCL</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Dimensions</h3>
              <div className="new-radio-rate-cntr radio-brown">
                <div>
                  <input type="checkbox" name="dimensions" id="dc-20" />
                  <label htmlFor="dc-20">20 DC</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="dimensions"
                    id="dc-30"
                    defaultChecked
                  />
                  <label htmlFor="dc-30">30 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-40" />
                  <label htmlFor="dc-40">40 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-50" />
                  <label htmlFor="dc-50">50 DC</label>
                </div>
              </div>
            </div>
            <a href="#!" className="butn blue-butn rate-search">
              Search
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewRateSearch;

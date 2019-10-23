import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

class NewRateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];
    const optionsSpeEqu = [
      { value: "Refer Type", label: "Refer Type" },
      { value: "abc", label: "abc" },
      { value: "def", label: "def" }
    ];
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
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
              <h3>Equipment Types</h3>
              <Select
                className="rate-dropdown"
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={options}
              />
              <div className="remember-forgot">
                <input
                  id="spe-equip"
                  type="checkbox"
                  name={"special equipment"}
                />
                <label htmlFor="spe-equip">Special Equipment</label>
              </div>
              <div className="spe-equ">
                <label>Kind of Special Equipment</label>
                <Select
                  className="rate-dropdown"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={optionsSpeEqu}
                />
              </div>
              <div className="spe-equ">
                <label>Temperature of Special Equipment</label>
                <input type="text" placeholder="Enter temperature in Celcius" />
              </div>
              <div className="remember-forgot">
                <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                <label htmlFor="haz-mat">HazMat</label>
              </div>
              {/* <div className="new-radio-rate-cntr radio-brown">
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
              </div> */}
            </div>
            <div className="new-rate-cntr">
              <h3>Inco Terms</h3>
              <div className="spe-equ">
                <label>Inco Terms</label>
                <input type="text" placeholder="Inco Terms" />
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Type of Move</h3>
              <div className="new-radio-rate-cntr radio-blue">
                <div>
                  <input type="radio" name="type-move" id="p2p" />
                  <label htmlFor="p2p">Port2Port</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="d2p"
                    defaultChecked
                  />
                  <label htmlFor="d2p">Door2Port</label>
                </div>
                <div>
                  <input type="radio" name="type-move" id="d2d" />
                  <label htmlFor="d2d">Door2Door</label>
                </div>
                <div>
                  <input type="radio" name="type-move" id="p2d" />
                  <label htmlFor="p2d">Port2Door</label>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a href="rate-table" className="butn blue-butn rate-search">
                Search
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewRateSearch;

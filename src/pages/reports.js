import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import "react-input-range/lib/css/index.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalEdit: false,
      modalQuant: false,
      value: 50,
      RateDetails: [],
      values: [],
      RateSubDetails: [],
      checkSelection: []
    };
  }

  render() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="rate-fin-tit title-border title-sect mb-4">
              <h2>Scheduler Report</h2>
            </div>
            <div className="report-cntr">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Report Name</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        components={animatedComponents}
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Mode Of Transport</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        components={animatedComponents}
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Origin Country</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Destination Country</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Port Of Loading</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Port Of Departure</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Product ID</label>
                      <input />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>PO Number</label>
                      <input />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Invoice Number</label>
                      <input />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Reg. Company</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <a href="/report-details" className="butn mt-3">
                      View
                    </a>
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

export default Reports;

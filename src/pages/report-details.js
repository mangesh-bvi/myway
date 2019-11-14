import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

class ReportDetails extends Component {
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
              <h2>Active Shipments - With Invoice</h2>
              <div>
                <a href="/" download className="butn more-padd">
                  Download
                </a>
                <a href="/reports" className="butn cancel-butn">
                  Back
                </a>
              </div>
            </div>
            <div className="report-cntr">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <ReactTable
                      //   data={quotesData}
                      filterable
                      minRows={1}
                      columns={[
                        {
                          Header: "Quote No",
                          accessor: "Quote#"
                        },
                        {
                          Header: "Company",
                          accessor: "Company"
                        },
                        {
                          Header: "Contact",
                          accessor: "Contact"
                        },
                        {
                          Header: "Type",
                          accessor: "type"
                        },
                        {
                          Header: "POD",
                          accessor: "POD"
                        },
                        {
                          Header: "Notes",
                          accessor: "Notes"
                        }
                      ]}
                      className="-striped -highlight"
                      defaultPageSize={5}
                      minRows={1}
                    />
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

export default ReportDetails;

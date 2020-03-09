import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import { encryption } from "../helpers/encryption";
import makeAnimated from "react-select/animated";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
export const ExportCSV = ({ csvData, fileName }) => {
  
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <a
      onClick={e => exportToCSV(csvData, fileName)}
      download
      className="butn more-padd cusbtn"
    >
      Download
    </a>
   
  );
};
const animatedComponents = makeAnimated();

class ReportDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reportdetails: [],
      lableofreport: ""
    };
  }

  componentWillMount() {
    if (typeof this.props.location.state != "undefined") {
      var ReportDetails = this.props.location.state.detail;
      this.BindReportDetailsData(ReportDetails);
    }
  }
////Bind Report Details Data
  BindReportDetailsData(ReportDetails) {
    let self = this;
    this.setState({ lableofreport: ReportDetails.TextReportName });
    var POL = "";
    var POD = "";

    if (ReportDetails.valModeOfTransport == "Air") {
      POL = ReportDetails.valOriginAirport;
      POD = ReportDetails.valDestinationAirport;
    }
    if (ReportDetails.valModeOfTransport == "Ocean") {
      POL = ReportDetails.valPortOfLoading;
      POD = ReportDetails.valPortOfDeparture;
    }

    var axiosdata = {
      UserID: encryption(window.localStorage.getItem("userid"), "desc"),
      ReportID: ReportDetails.valReportName,
      RegCompID: ReportDetails.valRegCompany,
      OriginCntry: ReportDetails.valOriginCountry,
      DestCntry: ReportDetails.valDestinationCountry,
      PONumber: ReportDetails.valPONumber,
      ModeTransport: ReportDetails.valModeOfTransport,
      POL: POL,
      POL: POL,
      POD: POD,
      ProductId: ReportDetails.valProductID,
      InvoiceNo: ReportDetails.valInvoiceNumber
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/ReportGridAPI`,
      data: axiosdata,
      headers: authHeader()
    })
      .then(function(response) {
        self.setState({ reportdetails: response.data.Table });
      })
      .catch(error => {
        
        var temperror = error.response.data;
        var err = temperror.split(":");
        var actData = [];
        actData.push({
          POLCountry: "No Data Found"
        });
        self.setState({ reportdetails: actData });
      });
  }

  render() {
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="rate-fin-tit title-border title-sect mb-4">
              <h2>{this.state.lableofreport}</h2>
              <div>
                <ExportCSV
                  csvData={this.state.reportdetails}
                  fileName={this.state.lableofreport}
                />
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
                      id="test-table-xls-button"
                      data={this.state.reportdetails}
                      filterable
                      noDataText=""
                      columns={[
                        {
                          Header: "ModeOfTransport",
                          accessor: "ModeOfTransport"
                        },
                        {
                          Header: "Shipper",
                          accessor: "Shipper"
                        },
                        {
                          Header: "Consignee",
                          accessor: "Consignee"
                        },
                        {
                          Header: "POL",
                          accessor: "POL"
                        },
                        {
                          Header: "POLCountry",
                          accessor: "POLCountry"
                        },
                        {
                          Header: "POD",
                          accessor: "POD"
                        },
                        {
                          Header: "PODCountry",
                          accessor: "PODCountry"
                        },
                        {
                          Header: "Type",
                          accessor: "Type"
                        },
                        {
                          Header: "20'",
                          accessor: "20"
                        },
                        {
                          Header: "40'",
                          accessor: "40'"
                        },
                        {
                          Header: "40HC",
                          accessor: "40HC"
                        },
                        {
                          Header: "TEU",
                          accessor: "TEU"
                        },
                        {
                          Header: "CBM",
                          accessor: "CBM"
                        },
                        {
                          Header: "KGS",
                          accessor: "KGS"
                        }
                      ]}
                      className="-striped -highlight"
                      defaultPageSize={10}
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

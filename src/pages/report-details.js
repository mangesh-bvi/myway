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
      reportdetails :[],lableofreport:""
    };
  }

  componentWillMount(){
    if (typeof this.props.location.state != "undefined") {
      debugger;
      var ReportDetails = this.props.location.state.detail;
      this.setReportDetails(ReportDetails);
    }
  }

  setReportDetails(ReportDetails)
  {
    let self = this;
    this.setState({lableofreport:ReportDetails.TextReportName})
    var POL = "";
    var POD = "";

    if(ReportDetails.valModeOfTransport == "Air")
    {
      POL = ReportDetails.valOriginAirport;
      POD = ReportDetails.valDestinationAirport;
    }
    if(ReportDetails.valModeOfTransport == "Ocean")
    {
      POL = ReportDetails.valPortOfLoading;
      POD = ReportDetails.valPortOfDeparture;
    }
    
    var axiosdata = {
      // UserID: encryption(window.localStorage.getItem("userid"), "desc")
      UserID: 341,
      ReportID:  ReportDetails.valReportName,
      RegCompID: ReportDetails.valRegCompany,
      OriginCntry:  ReportDetails.valOriginCountry,
      DestCntry:  ReportDetails.valDestinationCountry,
      PONumber:  ReportDetails.valPONumber,
      ModeTransport:  ReportDetails.valModeOfTransport,
      POL: POL,//ReportDetails.valReportName,
      POD: POD,//ReportDetails.valReportName,
      ProductId: ReportDetails.valProductID,
      InvoiceNo: ReportDetails.valInvoiceNumber
     }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/ReportGridAPI`,
      data: axiosdata,
      headers: authHeader()
    }).then(function(response) {
      
     debugger;
     self.setState({reportdetails:response.data.Table})
    }).catch(error => {
      debugger;
      var temperror = error.response.data;
      var err = temperror.split(":");
      alert(err[1].replace("}", ""))
      
      var actData = [];
      actData.push({
        ModeOfTransport: "No Data Found"
      });
      self.setState({ reportdetails: actData });
    });
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
            <div className="rate-fin-tit title-border title-sect mb-4">
              <h2>{this.state.lableofreport}</h2>
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

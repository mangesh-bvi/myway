import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
// import { Button, Modal, ModalBody } from "reactstrap";
// import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
// import ReactTable from "react-table";
// import maersk from "./../assets/img/maersk.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";
// import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

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
      checkSelection: [],
      reportName:[],
      ModeOfTransport:[],
      OriginCountry:[],
      DestinationCountry:[],
      OriginAirport:[],
      acctualOriginAirport:[],
      DestinationAirport:[],
      acctualDestinationAirport:[],
      PortOfLoading:[],
      acctualPortOfLoading:[],
      PortOfDeparture:[],
      acctualPortOfDeparture:[],
      RegCompany:[],
      toggleExtraModeofAirFilter: false,
      toggleExtraModeofOceanFilter: false,
      toggleExtraInvoiceNoFilter: false,
      toggleExtraModeTransportFilter: false,

      valReportName:"",
      valRegCompany:"",
      TextReportName:"",
      valModeOfTransport:"",
      valOriginCountry:"",
      valDestinationCountry:"",
      valOriginAirport:"",
      valDestinationAirport:"",
      valPortOfLoading:"",
      valPortOfDeparture:""
    };
  }

  componentDidMount() {
    this.setReportName();
  }

  setReportName()
  {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/ReportListAPI`,
      data: {
       // UserID: encryption(window.localStorage.getItem("userid"), "desc")
       UserID: 341
      },
      headers: authHeader()
    }).then(function(response) {

      var optionItems = [];
      if(response != null)
      {
        if(response.data != null)
        {
          if(response.data.Table != null)
          {
            if(response.data.Table.length > 0)
            {
              response.data.Table.map(comp => (
                optionItems.push({value: comp.ReportID, label: comp.ReportName})
              ));
            }
          }
          else
          {
            optionItems.push({value: 0, label: "No Data Found"})
          }
        }
      }
      self.setState({reportName: optionItems});

    }).catch(error => {
      debugger;
      var temperror = error.response.data;
      var err = temperror.split(":");
      //alert(err[1].replace("}", ""))
      var optionItems = [];
      optionItems.push({value: 0, label: "No Data Found"})
      self.setState({
        reportName: optionItems
      });
    });
  }

  changesReportName(val)
  {
    let self = this;

    this.setState({valReportName : val.value})
    this.setState({TextReportName : val.label})


    this.setState({toggleExtraModeofAirFilter : false})
    this.setState({toggleExtraModeofOceanFilter : false})
    this.setState({toggleExtraInvoiceNoFilter : false})
    this.setState({toggleExtraModeTransportFilter : false})


    axios({
      method: "post",
      url: `${appSettings.APIURL}/ReportFiltersAPI`,
      data: {
       // UserID: encryption(window.localStorage.getItem("userid"), "desc")
       UserID: 341,
       ReportID:val.value
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;


      var ModeOfTransport = [];
      var OriginCountry = [];
      var DestinationCountry = [];
      var OriginAirport = [];
      var  DestinationAirport = [];
      var RegCompany = [];
      var PortOfLoading = [];
      var PortOfDeparture = [];

      var InvoiceNo = false;
      var ModeTransport = false;

      if(response != null)
      {
        if(response.data != null)
        {
          if(response.data.Table != null)
          {
            if(response.data.Table.length > 0)
            {
              var Table = response.data.Table;

              for(var i = 0; i < Table.length; i++)
              {
                if(Table[i].ColumnName == "InvoiceNo")
                {
                  InvoiceNo = true;
                }
                if(Table[i].ColumnName == "ModeTransport")
                {
                  ModeTransport = true;
                }
              }
            }

            if(!InvoiceNo)
            {//For those who don't have Invoice No
              if(!ModeTransport)
              {//For those who don't have Mode Of Transport
                if(response.data.Table1 != null)
                {//Reg. Company

                  if(response.data.Table1.length > 0)
                  {
                    response.data.Table1.map(comp => (
                      RegCompany.push({value: comp.ID, label: comp.Name})
                    ));
                  }
                  else
                  {
                    RegCompany.push({value: 0, label: "No Data Found"})
                  }
                  self.setState({RegCompany: RegCompany});
                }
              }

            }

            if(ModeTransport)
            {//For those who have Mode Of Transport
              if(response.data.Table4 != null)
              {//Reg. Company
                self.setState({RegCompany: []});
                if(response.data.Table4.length > 0)
                {
                  response.data.Table4.map(comp => (
                    RegCompany.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  RegCompany.push({value: 0, label: "No Data Found"})
                }
                self.setState({RegCompany: RegCompany});
              }

              if(response.data.Table2 != null)
              {//Mode Of Transport
                self.setState({ModeOfTransport: []});
                if(response.data.Table2.length > 0)
                {
                  response.data.Table2.map(comp => (
                    ModeOfTransport.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  ModeOfTransport.push({value: 0, label: "No Data Found"})
                }
                self.setState({ModeOfTransport: ModeOfTransport});
              }

              if(response.data.Table1 != null)
              {//Destination Country

                if(response.data.Table1.length > 0)
                {
                  response.data.Table1.map(comp => (
                    DestinationCountry.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  DestinationCountry.push({value: 0, label: "No Data Found"})
                }
                self.setState({DestinationCountry: DestinationCountry});
              }

              if(response.data.Table3 != null)
              {//Origin Country
                self.setState({OriginCountry: []});
                if(response.data.Table3.length > 0)
                {
                  response.data.Table3.map(comp => (
                    OriginCountry.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  OriginCountry.push({value: 0, label: "No Data Found"})
                }
                self.setState({OriginCountry: OriginCountry});
              }
            }

            if(InvoiceNo)
            {//For those who have Invoice No
              if(response.data.Table5 != null)
              {//Port Of Loading (ocean)
                self.setState({acctualPortOfLoading: []});
                if(response.data.Table5.length > 0)
                {
                  response.data.Table5.map(comp => (
                    PortOfLoading.push({value: comp.ID, label: comp.Name, compcode: comp.CountryCode})
                  ));
                }
                else
                {
                  PortOfLoading.push({value: 0, label: "No Data Found", compcode: "Null"})
                }
                self.setState({acctualPortOfLoading: PortOfLoading});
              }

              if(response.data.Table6 != null)
              {//Port Of Departure (ocean)
                self.setState({acctualPortOfDeparture: []});
                if(response.data.Table6.length > 0)
                {
                  response.data.Table6.map(comp => (
                    PortOfDeparture.push({value: comp.ID, label: comp.Name, compcode: comp.CountryCode})
                  ));
                }
                else
                {
                  PortOfDeparture.push({value: 0, label: "No Data Found", compcode: "Null"})
                }
                self.setState({acctualPortOfDeparture: PortOfDeparture});
              }

              if(response.data.Table7 != null)
              {//Origin Airport
                self.setState({acctualOriginAirport: []});
                if(response.data.Table7.length > 0)
                {
                  response.data.Table7.map(comp => (
                      OriginAirport.push({value: comp.ID, label: comp.Name, compcode: comp.CountryCode})
                  ));
                }
                else
                {
                  OriginAirport.push({value: 0, label: "No Data Found"})
                }
                self.setState({acctualOriginAirport: OriginAirport, compcode: "Null"});
              }

              if(response.data.Table8 != null)
              {//Destination Airport
                self.setState({acctualDestinationAirport: []});
                if(response.data.Table8.length > 0)
                {
                  response.data.Table8.map(comp => (
                     DestinationAirport.push({value: comp.ID, label: comp.Name, compcode: comp.CountryCode})
                  ));
                }
                else
                {
                  DestinationAirport.push({value: 0, label: "No Data Found", compcode: "Null"})
                }
                self.setState({acctualDestinationAirport : DestinationAirport});
              }
            }
          }
        }
      }


      self.setState({toggleExtraInvoiceNoFilter: InvoiceNo});
      self.setState({toggleExtraModeTransportFilter : ModeTransport})


     // alert(ModeTransport)
    }).catch(error => {
      debugger;
      var temperror = error.response.data;
      var err = temperror.split(":");
      //alert(err[1].replace("}", ""))
      var optionItems = [];

    });
  }

  changesModeOfTransport(val)
  {
    debugger;

    this.setState({valModeOfTransport:val.value})

    var oceanPortDepature = false;
    var airPortDepature = false;

    if(this.state.toggleExtraInvoiceNoFilter)
    {
        if(val.value == "Air")
        {
          airPortDepature = true;
        }
        if(val.value == "Ocean")
        {
          oceanPortDepature = true;

        }
        if(val.value == "Land")
        {
          this.setState({toggleExtraInvoiceNoFilter: false});
          this.setState({toggleExtraModeTransportFilter : false})
        }
    }

    this.setState({toggleExtraModeofAirFilter: airPortDepature});
    this.setState({toggleExtraModeofOceanFilter: oceanPortDepature});

  }

  changesRegCompany(val)
  {
    this.setState({valRegCompany : val.value})
  }

  changesOriginCountry(val)
  {
    debugger;
    var OriginCountryarr = ""
    var filterpo = [];
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          OriginCountryarr +=  val[i].value + ",";

          if(this.state.toggleExtraModeofAirFilter)
          {
            filterpo = filterpo.concat(
              this.state.acctualOriginAirport.filter(item => item.compcode == val[i].value)
            );
          }
          if(this.state.toggleExtraModeofOceanFilter)
          {
            filterpo = filterpo.concat(
              this.state.acctualPortOfLoading.filter(item => item.compcode == val[i].value)
            );
          }
        }

      }
    }
    if(this.state.toggleExtraModeofAirFilter)
    {
      this.setState({OriginAirport : filterpo})
    }
    if(this.state.toggleExtraModeofOceanFilter)
    {
      this.setState({PortOfLoading : filterpo})
    }
    this.setState({valOriginCountry : OriginCountryarr.replace(/,\s*$/, "")})
  }

  changesDestinationCountry(val)
  {
    var DestinationCountryryarr = "";
    var filterpo = [];
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          DestinationCountryryarr +=  val[i].value + ",";

          if(this.state.toggleExtraModeofAirFilter)
          {
            filterpo = filterpo.concat(
              this.state.acctualDestinationAirport.filter(item => item.compcode == val[i].value)
            );
          }
          if(this.state.toggleExtraModeofOceanFilter)
          {
            filterpo = filterpo.concat(
              this.state.acctualPortOfDeparture.filter(item => item.compcode == val[i].value)
            );
          }
        }
      }
    }
    if(this.state.toggleExtraModeofAirFilter)
    {
      this.setState({DestinationAirport : filterpo})
    }
    if(this.state.toggleExtraModeofOceanFilter)
    {
      this.setState({PortOfDeparture : filterpo})
    }
    this.setState({valDestinationCountry : DestinationCountryryarr.replace(/,\s*$/, "")})
  }

  changesDestinationAirport(val)
  {
    var DestinationAirportarr = "";
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          DestinationAirportarr +=  val[i].value + ",";
        }
      }
    }
    this.setState({valDestinationAirport : DestinationAirportarr.replace(/,\s*$/, "")})
  }
  changesOriginAirport(val)
  {
    var OriginAirportarr = "";
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          OriginAirportarr +=  val[i].value + ",";
        }
      }
    }
    this.setState({valOriginAirport : OriginAirportarr.replace(/,\s*$/, "")})
  }
  changesPortOfDeparture(val)
  {
    var PortOfDeparturearr = "";
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          PortOfDeparturearr +=  val[i].value + ",";
        }
      }
    }
    this.setState({valPortOfDeparture : PortOfDeparturearr.replace(/,\s*$/, "")})
  }
  changesPortOfLoading(val)
  {
    var PortOfLoadingearr = "";
    if(val != null)
    {
      if(val.length > 0)
      {
        for(var i = 0; i < val.length; i++)
        {
          PortOfLoadingearr +=  val[i].value + ",";
        }
      }
    }
    this.setState({valPortOfLoading : PortOfLoadingearr.replace(/,\s*$/, "")})
  }

  handleSubmit = () => {

    if(this.state.valReportName == null || this.state.valReportName == "")
    {
      //alert("Select Report Name")
      NotificationManager.error("Select Report Name");
      return false;
    }
    if(this.state.valRegCompany == null || this.state.valRegCompany == "")
    {
      //alert("Select Reg. Company")
      NotificationManager.error("Select Reg. Company");
      return false;
    }

    var valProductID = "";
    var valPONumber = "";
    var valInvoiceNumber = "";

    if(document.getElementById("txtProductID") != undefined)
    {
      valProductID = document.getElementById("txtProductID").value;
    }
    if(document.getElementById("txtPONumber") != undefined)
    {
      valPONumber = document.getElementById("txtPONumber").value;
    }
    if(document.getElementById("txtInvoiceNumber") != undefined)
    {
      valInvoiceNumber = document.getElementById("txtInvoiceNumber").value;
    }


    var detailid = {valReportName:this.state.valReportName,
                    valRegCompany:this.state.valRegCompany,
                    TextReportName:this.state.TextReportName,
                    ModeTransportFilter:this.state.toggleExtraModeTransportFilter,
                    InvoiceNoFilter:this.state.toggleExtraInvoiceNoFilter,
                    valModeOfTransport:this.state.valModeOfTransport,
                    valOriginCountry:this.state.valOriginCountry,
                    valDestinationCountry:this.state.valDestinationCountry,
                    valOriginAirport:this.state.valOriginAirport,
                    valDestinationAirport:this.state.valDestinationAirport,
                    valPortOfLoading:this.state.valPortOfLoading,
                    valPortOfDeparture:this.state.valPortOfDeparture,
                    valProductID:valProductID,
                    valPONumber:valPONumber,
                    valInvoiceNumber:valInvoiceNumber};


    this.props.history.push({
      pathname: "report-details",
      state: { detail: detailid }
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
                        options={this.state.reportName}
                        onChange={this.changesReportName.bind(this)}
                        ref="drpReportName"
                      />
                    </div>
                  </div>
                  {this.state.toggleExtraModeTransportFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Mode Of Transport</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        components={animatedComponents}
                        options={this.state.ModeOfTransport}
                        onChange={this.changesModeOfTransport.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeTransportFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Origin Country</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.OriginCountry}
                        onChange={this.changesOriginCountry.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeTransportFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Destination Country</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.DestinationCountry}
                        onChange={this.changesDestinationCountry.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeofOceanFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Port Of Loading</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.PortOfLoading}
                        onChange={this.changesPortOfLoading.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeofOceanFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Port Of Departure</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.PortOfDeparture}
                        onChange={this.changesPortOfDeparture.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeofAirFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Origin Airport</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.OriginAirport}
                        onChange={this.changesOriginAirport.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraModeofAirFilter && (
                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Destination Airport</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.state.DestinationAirport}
                        onChange={this.changesDestinationAirport.bind(this)}
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Product ID</label>
                      <input type="text" id="txtProductID" />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>PO Number</label>
                      <input type="text" id="txtPONumber" />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Invoice Number</label>
                      <input type="text" id="txtInvoiceNumber" />
                    </div>
                  </div>
                  )}

                  <div className="col-md-6">
                    <div className="login-fields">
                      <label>Reg. Company</label>
                      <Select
                        className="rate-dropdown w-100 m-0"
                        //closeMenuOnSelect={false}
                        components={animatedComponents}
                        //isMulti
                        options={this.state.RegCompany}
                        onChange={this.changesRegCompany.bind(this)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {/* <a href="#!" onClick={this.handleView}  className="butn mt-3">
                      View
                    </a> */}
                    <button
                        onClick={this.handleSubmit}
                        className="butn mt-3"
                      >
                        View
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default Reports;

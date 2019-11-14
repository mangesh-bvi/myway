import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Button, Modal, ModalBody } from "reactstrap";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import maersk from "./../assets/img/maersk.png";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { encryption } from "../helpers/encryption";


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
      DestinationAirport:[],
      PortOfLoading:[],
      PortOfDeparture:[],
      RegCompany:[],
      toggleExtraModeofAirFilter: false,
      toggleExtraModeofOceanFilter: false,
      toggleExtraInvoiceNoFilter: false,
      toggleExtraModeTransportFilter: false,

      valReportName:"",
      valRegCompany:""
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
      alert(err[1].replace("}", ""))
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
                self.setState({PortOfLoading: []});
                if(response.data.Table5.length > 0)
                {
                  response.data.Table5.map(comp => (
                    PortOfLoading.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  PortOfLoading.push({value: 0, label: "No Data Found"})
                }
                self.setState({PortOfLoading: PortOfLoading});
              }

              if(response.data.Table6 != null)
              {//Port Of Departure (ocean)
                self.setState({PortOfDeparture: []});
                if(response.data.Table6.length > 0)
                {
                  response.data.Table6.map(comp => (
                    PortOfDeparture.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  PortOfDeparture.push({value: 0, label: "No Data Found"})
                }
                self.setState({PortOfDeparture: PortOfDeparture});
              }
             
              if(response.data.Table7 != null)
              {//Origin Airport
                self.setState({OriginAirport: []});
                if(response.data.Table7.length > 0)
                {
                  response.data.Table7.map(comp => (
                     OriginAirport.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  OriginAirport.push({value: 0, label: "No Data Found"})
                }
                self.setState({OriginAirport: OriginAirport});
              }

              if(response.data.Table8 != null)
              {//Destination Airport
                self.setState({DestinationAirport: []});
                if(response.data.Table8.length > 0)
                {
                  response.data.Table8.map(comp => (
                     DestinationAirport.push({value: comp.ID, label: comp.Name})
                  ));
                }
                else
                {
                  DestinationAirport.push({value: 0, label: "No Data Found"})
                }
                self.setState({DestinationAirport: DestinationAirport});
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
      alert(err[1].replace("}", ""))
      var optionItems = [];
      
    });
  }

  changesModeOfTransport(val)
  {
    debugger;

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

  handleSubmit = () => {

    // valReportName:"",
    // valRegCompany:""

    var detailid = [{valReportName:this.state.valReportName},
                    {valRegCompany:this.state.valRegCompany}];

    this.props.history.push({
      pathname: "spot-rate-details",
      state: { detail: detailid }
    });
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
                      />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Product ID</label>
                      <input />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>PO Number</label>
                      <input />
                    </div>
                  </div>
                  )}
                  {this.state.toggleExtraInvoiceNoFilter && (
                  <div className="col-md-4">
                    <div className="login-fields">
                      <label>Invoice Number</label>
                      <input />
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
                    <a href="#!" onClick={this.handleView}  className="butn mt-3">
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

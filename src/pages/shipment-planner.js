import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { Button, Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import DatePicker from "react-datepicker";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-datepicker/dist/react-datepicker.css";
// import {GoogleMapReact,Polyline} from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Truck from "./../assets/img/truck.png";
import Ship from "./../assets/img/ship.png";
import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Edit from "./../assets/img/pencil.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
import { de } from "date-fns/esm/locale";
import YellowFlag from "./../assets/img/yellow-flag.png";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from "react-google-maps";
import { object } from "prop-types";
const { compose } = require("recompose");

const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={3}
  >
    {props.markers.map(marker => {
      const onClick = props.onClick.bind(this, marker);
      return (
        <Marker
          key={marker.id}
          onClick={onClick}
          position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
        >
          {props.selectedMarker === marker && (
            <InfoWindow>
              <div>
                <h4>{marker.RegCompanyName}</h4>
                <br />
                <b>{marker.locationName}</b>
              </div>
            </InfoWindow>
          )}
          }
        </Marker>
      );
    })}
  </GoogleMap>
));

const MapWithAMakredInfoWindowLine = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={3}
  >
    {
      
      props.markers.map(marker => {
      debugger;
       
      // const onClick = props.onClick.bind(this, marker);
     
        var start=marker.StartLatLng;
        var end=marker.EndLatLng;
        
        return (
          <div>
            <Polyline
              path={marker.Rounting}
              options={{
                strokeColor: "#ff2527",
                strokeOpacity: 2,
                strokeWeight: 3
              }}
            />
            {/* <StartPing /> */}
             
                <Marker
                 
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              />
          
          </div>
        );
      
    })}
   
  </GoogleMap>
));

class ShipmentPlanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalTransit: false,
      modalEdit: false,
      startDate: new Date(),
      companydrp: [],
      consigneedrp: [],
      transportModedrp: [],
      linerdrp: [],
      supConsId: "",
      linerId: "",
      modeofTransport: "",
      sailingDate: "",
      transitModeId: "",
      totalAvgDays: "",
      totalMinDays: "",
      totalMaxDays: "",
      transitpopup: [],
      zoom: 4,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: [],
      MapsDetailsData: [],
      showingMaps: false,
      selectedMarker: false,
      mappingId:0
    };

    this.toggleTransit = this.toggleTransit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.HandleOnPageLoad = this.HandleOnPageLoad.bind(this);
    this.HandleSubmitDetailsData=this.HandleSubmitDetailsData.bind(this);
  }

  handleClick = (marker, event) => {
    debugger;
    this.setState({ selectedMarker: marker });
  };
  HandleSubmitDetailsData(submitdata) {
    debugger;
    
    var DetailsData = submitdata.data.Table;
    
    var FinalData=[];
    for (let i=0;i<DetailsData.length;i++)
    {
      var finalList=new Object()
      finalList.ORDERID=DetailsData[i].ORDERID
      finalList.CModeOfTransport=DetailsData[i].CModeOfTransport;
      finalList.StartLocation=DetailsData[i].StartLocation;
      finalList.ShipperName=DetailsData[i].ShipperName;
      finalList.EndLocation=DetailsData[i].EndLocation;
      finalList.ConsigneeName=DetailsData[i].ConsigneeName;
      

// Start Location Lat lng
      var CStLatLong=DetailsData[i].CStLatLong;
      var startlatlng=[]
      var startlatlnglst=new Object();
      startlatlnglst.lat=Number(CStLatLong.split(",")[0]);
      startlatlnglst.lng=Number(CStLatLong.split(",")[1]);
      startlatlng.push(startlatlnglst);
      finalList.StartLatLng=startlatlng;

// End Location Lat Lng 
      var CEdLatLong=DetailsData[i].CEdLatLong;
      var endlatlng=[]
      var endlatlnglst=new Object();
      endlatlnglst.lat=Number(CEdLatLong.split(",")[0]);
      endlatlnglst.lng=Number(CEdLatLong.split(",")[1]);
      endlatlng.push(endlatlnglst);
      finalList.EndLatLng=endlatlng;
      
// Rounting line      
     var RouteLatLong = DetailsData[i].RouteLatLong;
     var RouteArray = [];
     var ComplexData = [];
     RouteArray.push(RouteLatLong.split(";"));
      
     var routlen=RouteArray[0];
     for(let k=0;k<routlen.length;k++)
     {
       var routelatlng=new Object();
       var latlngvar=routlen[k];
       routelatlng.lat=Number(latlngvar.split(",")[0]);
       routelatlng.lng=Number(latlngvar.split(",")[1]);
       ComplexData.push(routelatlng);    
     }
     finalList.Rounting =ComplexData;
     FinalData.push(finalList);
     
    }
    console.log(FinalData);
    this.setState({ MapsDetailsData: FinalData });
     
     
  }
  HandleOnPageLoad() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RegCompanyLocation`,
      data: {
        UserID: window.localStorage.getItem("userid")
      },
      headers: authHeader()
    }).then(function(response) {
      var resdata = response.data;
      var jDataArry = [];
      var aDataArry = [];
      var CompanyData = [];
      var LatLng = resdata[0].Location;
      var locationName = resdata[0].LocationName;
      var CompanyName = resdata[0].RegCompanyName;
      jDataArry.push(LatLng.split(";"));
      aDataArry.push(locationName.split(";"));
      CompanyData.push(CompanyName.split(";"));
      var finalDataForMap = [];
      var jDataArryLen = jDataArry[0].length;
      var jCheck = 0;
      for (let i = 0; i < jDataArryLen; i++) {
        var temp = jDataArry[0][i].split(",");
        var latData = temp[0].trim();
        var longData = jDataArry[0][i].split(",")[1].trim();
        var locName = aDataArry[0][i];
        var compName = CompanyData[0][i];
        var jData = new Object();
        jData.lat = latData;
        jData.lng = longData;
        jData.locationName = locName;
        jData.RegCompanyName = compName;       
        debugger; 
        if (jCheck > 0) {
          if (
            !finalDataForMap[jCheck - 1]["lat"].includes(latData) &&
            !finalDataForMap[jCheck - 1]["lng"].includes(latData)
          ) {
            finalDataForMap.push(jData);

            jCheck = jCheck + 1;
          } else {
            var index = finalDataForMap.findIndex(x => x.lat ===latData && x.lng=== longData);
            if (index >= 0) {
              var tempCompData = finalDataForMap[index]["RegCompanyName"];
              //finalDataForMap[index]["RegCompanyName"] //=finalDataForMap[index]["RegCompanyName"] + "," + 
              finalDataForMap[index]["RegCompanyName"]= tempCompData + "," + compName;
            }
          }
        } else {
          finalDataForMap.push(jData);
          jCheck = jCheck + 1;
        }
      }
      self.setState({ mapsData: finalDataForMap });
    });
  }

  companyChange = e => {
    debugger;
    let self = this;
    let compArray = [];
 
    for (let index = 0; index < this.state.companydrp.length; index++) {
      if (this.state.companydrp[index].MyCompID == e.target.value) {
        compArray = this.state.companydrp[index];
        break;
      }
    }
debugger;
    self.setState({mappingId:compArray[0].MappingID});
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchConsigneeCompany`,
      data: {
        UserID: window.localStorage.getItem("userid"),
        MyCompID: compArray.MyCompID,
        MyCompLocationID: compArray.MyCompLocationID,
        MyCompLocationType: compArray.MyCompLocationType
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      let optionItems = response.data.map(comp => (
        <option value={comp.MappedCompID}>{comp.MappedCompName}</option>
      ));
      self.setState({ consigneedrp: optionItems });
    });
  };

  consigneeChange = e => {
    debugger;
    let self = this;
    let supconsid = self.state.mappingId;
    self.setState({ supConsId: supconsid });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchTransportMode`,
      data: {
        SupConsID: supconsid
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      let optionItems = response.data.map(comp => (
        <option value={comp.CModeOfTransport}>{comp.CModeOfTransport}</option>
      ));
      self.setState({ transportModedrp: optionItems });
    });
  };

  transportModeChange = e => {
    debugger;
    let self = this;
    let transportmode = e.target.value;
    self.setState({ modeofTransport: transportmode });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchLiners`,
      data: {
        Type: 2,
        SupConsID: self.state.supConsId,
        ModeType: transportmode
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      let optionItems = response.data.map(comp => (
        <option value={comp.TransitModeID}>{comp.TransitMode}</option>
      ));
      self.setState({ linerdrp: optionItems });
    });
  };

  fetchLinerChange = e => {
    debugger;
    let self = this;
    self.setState({ transitModeId: e.target.value });
  };

  handleChange = e => {
    debugger;
    this.setState({
      sailingDate: e
    });
  };

  handleSubmit = () => {
    var supConsId = this.state.supConsId;
    var sailingDate = document.getElementById("saleDate").value;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipmentPlannerMapData`,
      data: {
        SupConsID: this.state.supConsId,
        LinerID: this.state.transitModeId,
        ModeOfTransport: this.state.modeofTransport,
        SailingDate: sailingDate
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response.data);
      // self.setState({ showingMaps: true });
      var totalAvg = 0;
      var totalMin = 0;
      var totalMax = 0;
      for (let index = 0; index < response.data.length; index++) {
        totalAvg += parseInt(response.data[index].NTransit_Time);
        totalMin += parseInt(response.data[index].NMin_Transit_Time);
        totalMax += parseInt(response.data[index].NMax_Transit_Time);
      }
      self.setState({ transitpopup: response.data });
      self.setState({ totalAvgDays: totalAvg });
      self.setState({ totalMinDays: totalMin });
      self.setState({ totalMaxDays: totalMax });
      debugger;
      var submitdata=response;
      self.HandleSubmitDetailsData(submitdata); 
    });
  };
  toggleTransit() {
    this.setState(prevState => ({
      modalTransit: !prevState.modalTransit
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  componentDidMount() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipperCompany`,
      data: {
        UserID: window.localStorage.getItem("userid")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({ companydrp: response.data });
    });
    this.HandleOnPageLoad();
  }

  render() {
    const { mapsData,MapsDetailsData} = this.state;

    let optionItems = this.state.companydrp.map((planet, i) => (
      <option
        onChange={this.companyChange}
        atrCompLocType={planet.MyCompLocationType}
        atrCompLocId={planet.MyCompLocationID}
        key={i}
        value={planet.MyCompID}
      >
        {planet.MyCompName}
      </option>
    ));

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-5 pl-0">
                  <div className="title-sect title-border">
                    <h2>My Suppliers</h2>
                  </div>
                  <div className="planner-cntr">
                    <div className="login-input-cntr">
                      <div className="login-fields">
                        <label>Select Company</label>
                        <select onChange={this.companyChange} id="drpCompany">
                          <option>Select</option>
                          {optionItems}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Consignee Company</label>
                        <select
                          onChange={this.consigneeChange}
                          id="drpConsigneeCompany"
                        >
                          <option>Select</option>
                          {this.state.consigneedrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Mode</label>
                        <select onChange={this.transportModeChange}>
                          <option>Select</option>
                          {this.state.transportModedrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Liner</label>
                        <select onChange={this.fetchLinerChange}>
                          <option>select</option>
                          {this.state.linerdrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Date</label>
                        <DatePicker
                          id="saleDate"
                          selected={this.state.startDate}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button onClick={this.handleSubmit} className="butn">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="planner-top-butns">
                    <button className="butn cancel-butn">Delivery Date</button>
                    <button className="butn cancel-butn">Visual Summary</button>
                    <button
                      onClick={this.toggleTransit}
                      className="butn cancel-butn"
                    >
                      Transit Time
                    </button>
                  </div>
                  <div className="full-map-cntr">
                    <div className="ship-detail-maps full-map mt-0">
                      <div className="ship-detail-map">
                        {this.state.showingMaps ? (
                          <MapWithAMakredInfoWindow
                            markers={mapsData}
                            onClick={this.handleClick}
                            selectedMarker={this.state.selectedMarker}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                            containerElement={
                              <div style={{ height: `100%`, width: "100%" }} />
                            }
                            mapElement={<div style={{ height: `100%` }} />}
                            loadingElement={<div style={{ height: `100%` }} />}
                          ></MapWithAMakredInfoWindow>
                        ) : (
                          <MapWithAMakredInfoWindowLine
                            markers={MapsDetailsData}
                            onClick={this.handleClick}
                            selectedMarker={this.state.selectedMarker}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                            containerElement={
                              <div style={{ height: `100%`, width: "100%" }} />
                            }
                            mapElement={<div style={{ height: `100%` }} />}
                            loadingElement={<div style={{ height: `100%` }} />}
                          ></MapWithAMakredInfoWindowLine>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  className="transit-popup"
                  isOpen={this.state.modalTransit}
                  toggle={this.toggleTransit}
                  centered={true}
                >
                  <ModalBody className="p-0">
                    <div className="container-fluid p-0">
                      <div className="transit-sect">
                        <div className="row">
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Average Days</p>
                              <p class="details-para">
                                {this.state.totalAvgDays}
                              </p>
                            </div>
                          </div>
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Minimum Days</p>
                              <p class="details-para">
                                {this.state.totalMinDays}
                              </p>
                            </div>
                          </div>
                          <div class="col-md-4 details-border">
                            <div>
                              <p class="details-title">Total Maximum Days</p>
                              <p class="details-para">
                                {this.state.totalMaxDays}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transit-sect-overflow">
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Truck} alt="truck icon" />
                              </div>
                              <div>
                                <p className="desti-name">Istanbul</p>
                                <p className="desti-route">
                                  to Istanbul, Istanbul, Turkey
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Ship} alt="ship icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Istanbul, Istanbul, Turkey
                                </p>
                                <p className="desti-route">
                                  to Sines, Setúbal, Portugal
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">24</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">22</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">26</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Ship} alt="ship icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Sines, Setúbal, Portugal
                                </p>
                                <p className="desti-route">
                                  to Baltimore, Maryland, United States
                                </p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">11</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">10</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">14</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="transit-sect">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="shipment-img mr-3">
                                <img src={Truck} alt="truck icon" />
                              </div>
                              <div>
                                <p className="desti-name">
                                  Baltimore, Maryland, United States
                                </p>
                                <p className="desti-route">to New York</p>
                              </div>
                            </div>
                            <button className="butn cancel-butn">View</button>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Average Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Minimum Days</p>
                                <span className="days-count">1</span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="days-cntr">
                                <p className="days-title">Maximum Days</p>
                                <span className="days-count">2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
                {/* <Modal
                  className="delete-popup"
                  isOpen={this.state.modalEdit}
                  toggle={this.toggleEdit}
                  centered={true}
                >
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                      <label>Rename your document</label>
                      <input type="text" placeholder="Rename here..." />
                    </div>
                    <Button className="butn" onClick={this.toggleEdit}>
                      Done
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleEdit}
                    >
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShipmentPlanner;

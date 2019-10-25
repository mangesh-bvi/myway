import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { Button, Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import DatePicker from "react-datepicker";
import Moment from "react-moment";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import "react-datepicker/dist/react-datepicker.css";
// import {GoogleMapReact,Polyline} from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Truck from "./../assets/img/truck.png";
import Plane from "./../assets/img/plane.png";
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
  Polyline,
  google
} from "react-google-maps";

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
    {props.markers.map(marker => {
      debugger;

      const onClick = props.onClick.bind(this, marker);

      var start = marker.StartLatLng;
      var end = marker.EndLatLng;
      var OID = marker.ORDERID;
      let iconMarker = new window.google.maps.MarkerImage(
        YellowFlag,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );
      var lineSymbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: "#393"
      };
      // function animateCircle(line) {
      //   var count = 0;
      //   window.setInterval(function() {
      //     count = (count + 1) % 200;

      //     var icons = line.get("icons");
      //     icons[0].offset = count / 2 + "%";
      //     line.set("icons", icons);
      //   }, 20);
      // }

      return (
        <div>
          <Polyline
            path={marker.Rounting}
            geodesic={true}
            options={{
              strokeColor: "#ff2527",
              strokeOpacity: 0.75,
              strokeWeight: 2,
              icons: [
                {
                  // icon: lineSymbol,
                  offset: "100%",
                  repeat: "20px"
                }
              ]
            }}
          />
          {OID === 1 && (
            <>
              <Marker
                key={1}
                onClick={onClick}
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ShipperName}</h4>
                      <br />
                      <b>{marker.StartLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              <Marker
                key={2}
                onClick={onClick}
                icon={iconMarker}
                position={{
                  lat: end[0].lat,
                  lng: end[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ShipperName}</h4>
                      <br />
                      <b>{marker.StartLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
          {OID === 2 && (
            <>
              <Marker
                key={3}
                onClick={onClick}
                icon={iconMarker}
                position={{
                  lat: end[0].lat,
                  lng: end[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ShipperName}</h4>
                      <br />
                      <b>{marker.StartLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              <Marker
                key={4}
                onClick={onClick}
                icon={iconMarker}
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ConsigneeName}</h4>
                      <br />
                      <b>{marker.EndLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
          {OID === 3 && (
            <>
              <Marker
                key={5}
                onClick={onClick}
                icon={iconMarker}
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ShipperName}</h4>
                      <br />
                      <b>{marker.StartLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              <Marker
                key={6}
                onClick={onClick}
                position={{
                  lat: end[0].lat,
                  lng: end[0].lng
                }}
              >
                {props.selectedMarker === marker && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ConsigneeName}</h4>
                      <br />
                      <b>{marker.EndLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
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
      modalDelivery: false,
      modalVisual: false,
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
      deliveryPopup: [],
      firstAvg: "",
      firstmgmt: "",
      secondAvg: "",
      secondmgmt: "",
      visualCarrier: "",
      thirdAvg: "",
      thirdmgmt: "",
      zoom: 4,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: [],
      MapsDetailsData: [],
      showingMaps: true,
      selectedMarker: false,
      mappingId: 0
    };

    this.toggleTransit = this.toggleTransit.bind(this);
    this.toggleDelivery = this.toggleDelivery.bind(this);
    this.toggleVisual = this.toggleVisual.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.HandleOnPageLoad = this.HandleOnPageLoad.bind(this);
    this.HandleSubmitDetailsData = this.HandleSubmitDetailsData.bind(this);
  }

  handleClick = (marker, event) => {
    debugger;
    this.setState({ selectedMarker: marker });
  };
  HandleSubmitDetailsData(submitdata) {
    debugger;

    var DetailsData = submitdata.data.Table;

    var FinalData = [];
    for (let i = 0; i < DetailsData.length; i++) {
      var finalList = new Object();
      finalList.ORDERID = DetailsData[i].ORDERID;
      finalList.CModeOfTransport = DetailsData[i].CModeOfTransport;
      finalList.StartLocation = DetailsData[i].StartLocation;
      finalList.ShipperName = DetailsData[i].ShipperName;
      finalList.EndLocation = DetailsData[i].EndLocation;
      finalList.ConsigneeName = DetailsData[i].ConsigneeName;

      // Start Location Lat lng
      var CStLatLong = DetailsData[i].CStLatLong;
      var startlatlng = [];
      var startlatlnglst = new Object();
      startlatlnglst.lat = Number(CStLatLong.split(",")[0]);
      startlatlnglst.lng = Number(CStLatLong.split(",")[1]);
      startlatlng.push(startlatlnglst);
      finalList.StartLatLng = startlatlng;

      // End Location Lat Lng
      var CEdLatLong = DetailsData[i].CEdLatLong;
      var endlatlng = [];
      var endlatlnglst = new Object();
      endlatlnglst.lat = Number(CEdLatLong.split(",")[0]);
      endlatlnglst.lng = Number(CEdLatLong.split(",")[1]);
      endlatlng.push(endlatlnglst);
      finalList.EndLatLng = endlatlng;

      // Rounting line
      var RouteLatLong = DetailsData[i].RouteLatLong;
      var RouteArray = [];
      var ComplexData = [];
      RouteArray.push(RouteLatLong.split(";"));

      var routlen = RouteArray[0];
      for (let k = 0; k < routlen.length; k++) {
        var routelatlng = new Object();
        var latlngvar = routlen[k];
        routelatlng.lat = Number(latlngvar.split(",")[0]);
        routelatlng.lng = Number(latlngvar.split(",")[1]);
        ComplexData.push(routelatlng);
      }
      finalList.Rounting = ComplexData;
      FinalData.push(finalList);
    }
    console.log(FinalData);
    this.setState({ MapsDetailsData: FinalData, showingMaps: false });
  }
  HandleOnPageLoad() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RegCompanyLocation`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
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
            var index = finalDataForMap.findIndex(
              x => x.lat === latData && x.lng === longData
            );
            if (index >= 0) {
              var tempCompData = finalDataForMap[index]["RegCompanyName"];
              //finalDataForMap[index]["RegCompanyName"] //=finalDataForMap[index]["RegCompanyName"] + "," +
              finalDataForMap[index]["RegCompanyName"] =
                tempCompData + "," + compName;
            }
          }
        } else {
          finalDataForMap.push(jData);
          jCheck = jCheck + 1;
        }
      }
      console.log(finalDataForMap);

      self.setState({ mapsData: finalDataForMap });
      console.log(self.state.mapsData);
    });
  }

  companyChange = e => {
    let self = this;
    let compArray = [];

    for (let index = 0; index < this.state.companydrp.length; index++) {
      if (this.state.companydrp[index].MyCompID == e.target.value) {
        compArray = this.state.companydrp[index];
        break;
      }
    }
    debugger;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchConsigneeCompany`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        MyCompID: compArray.MyCompID,
        MyCompLocationID: compArray.MyCompLocationID,
        MyCompLocationType: compArray.MyCompLocationType
      },
      headers: authHeader()
    }).then(function(response) {
      let optionItems = response.data.map(comp => (
        <option value={comp.MappingID}>{comp.MappedCompName}</option>
      ));
      self.setState({ consigneedrp: optionItems });
    });
  };

  consigneeChange = e => {
    let self = this;
    let supconsid = e.target.value;
    self.setState({ supConsId: supconsid });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchTransportMode`,
      data: {
        SupConsID: supconsid
      },
      headers: authHeader()
    }).then(function(response) {
      let optionItems = response.data.map(comp => (
        <option value={comp.CModeOfTransport}>{comp.CModeOfTransport}</option>
      ));
      self.setState({ transportModedrp: optionItems });
    });
  };

  transportModeChange = e => {
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
      let optionItems = response.data.map(comp => (
        <option value={comp.TransitModeID}>{comp.TransitMode}</option>
      ));
      self.setState({ linerdrp: optionItems });
    });
  };

  fetchLinerChange = e => {
    let self = this;
    self.setState({ transitModeId: e.target.value });
  };

  handleChange = e => {
    this.setState({
      startDate: e
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
      for (let index = 0; index < response.data.Table.length; index++) {
        if (index == 0) {
          self.setState({ firstAvg: response.data.Table[index].NTransit_Time });
        } else if (index == 1) {
          self.setState({
            secondAvg: response.data.Table[index].NTransit_Time
          });
        } else {
          self.setState({ thirdAvg: response.data.Table[index].NTransit_Time });
        }
        totalAvg += parseInt(response.data.Table[index].NTransit_Time);
        totalMin += parseInt(response.data.Table[index].NMin_Transit_Time);
        totalMax += parseInt(response.data.Table[index].NMax_Transit_Time);
      }
      var deliveryData = response.data.Table1;
      if (deliveryData != "undefined" && deliveryData != null) {
        self.setState({ deliveryPopup: deliveryData });
      }
      var transitData = response.data.Table;
      if (transitData !== "undefined" && transitData != null) {
        self.setState({ transitpopup: transitData });
      }

      self.setState({ totalAvgDays: totalAvg });
      self.setState({ totalMinDays: totalMin });
      self.setState({ totalMaxDays: totalMax });

      var submitdata = response;
      console.log(self.state.deliveryPopup);
      self.HandleSubmitDetailsData(submitdata);
    });
  };
  toggleTransit() {
    this.setState(prevState => ({
      modalTransit: !prevState.modalTransit
    }));
  }
  toggleDelivery() {
    this.setState(prevState => ({
      modalDelivery: !prevState.modalDelivery
    }));
  }
  toggleVisual() {
    this.setState(prevState => ({
      modalVisual: !prevState.modalVisual
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  componentDidMount() {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipperCompany`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      self.setState({ companydrp: response.data });
    });
    this.HandleOnPageLoad();
  }

  renderTableHeader() {
    return (
      <div>
        <div>1223333</div>
      </div>
    );
  }

  render() {
    const {
      mapsData,
      transitpopup,
      deliveryPopup,
      firstAvg,
      secondAvg,
      thirdAvg,
      carriar,
      MapsDetailsData
    } = this.state;

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

    function TransitionImage(props) {
      const imgType = props.imgType;
      if (imgType == "Road") {
        return <img src={Truck}></img>;
      } else if (imgType == "Air-Midnight Wonder") {
        return <img src={Plane}></img>;
      } else {
        return <img src={Ship}></img>;
      }
    }

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
                    <button
                      onClick={this.toggleDelivery}
                      className="butn cancel-butn"
                    >
                      Delivery Date
                    </button>
                    <button
                      onClick={this.toggleVisual}
                      className="butn cancel-butn"
                    >
                      Visual Summary
                    </button>
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
                  className="visual-popup"
                  isOpen={this.state.modalVisual}
                  toggle={this.toggleVisual}
                  centered={true}
                >
                  <ModalBody className="p-0">
                    <table
                      width="100%"
                      border="0"
                      align="center"
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tbody>
                        <tr>
                          <td id="ContentPlaceHolder1_td_bg" className="water">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                <div className="manage-txt">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lbloriginmangedby">
                                    Ata Freight Line
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-6 text-center">
                                <div className="avarage-day supplier-avarage-day">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_header">
                                    {this.state.firstAvg}
                                  </span>
                                  &nbsp;Days Avarage
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12 col-sm-12">
                                <div className="avarage-day avrage-time">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_center">
                                    {this.state.secondAvg}
                                  </span>
                                  &nbsp;Days AVERAGE
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-9 col-sm-12 col-sm-12">
                                <div className="manage-txt origin-port">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lblMiddleManagedBy">
                                    Ata Freight Line Via Cma Cgm
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12">
                                <div className="avarage-day destination-port">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_footer">
                                    {this.state.thirdAvg}
                                  </span>
                                  &nbsp; Days Avarage
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12">
                                <div className="manage-txt footer-manage">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lblDeliveryManagedBy">
                                    Ata Freight Line
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delivery-popup"
                  isOpen={this.state.modalDelivery}
                  toggle={this.toggleDelivery}
                  centered={true}
                >
                  <ModalBody className="p-0">
                    {deliveryPopup.length > 0 &&
                      deliveryPopup.map((cell, i) => {
                        debugger;
                        return (
                          <div className="container-fluid p-0">
                            <div className="transit-sect">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="shipment-img mr-3">
                                    <TransitionImage imgType={cell.Mode} />
                                  </div>
                                  <div>
                                    <p className="desti-name">
                                      {cell.POLLocation}
                                    </p>
                                    <p className="desti-route">
                                      to {cell.DestinationPort}
                                      ,Carrier {cell.Carrier}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="delivery-inner">
                              <div className="row">
                                <div className="col-md-4 text-center">
                                  <p className="details-title">
                                    Departure Date
                                  </p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.SailingDate}
                                    </Moment>
                                  </p>
                                </div>
                                <div className="col-md-4 text-center">
                                  <p className="details-title">ETA</p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.ETA}
                                    </Moment>
                                  </p>
                                </div>
                                <div className="col-md-4 text-center">
                                  <p className="details-title">
                                    Estimated Delivery Date
                                  </p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.CargoArrivalDate}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </ModalBody>
                </Modal>
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
                          <div className="col-md-4 details-border">
                            <div>
                              <p className="details-title">
                                Total Average Days
                              </p>
                              <p className="details-para">
                                {this.state.totalAvgDays}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 details-border">
                            <div>
                              <p className="details-title">
                                Total Minimum Days
                              </p>
                              <p className="details-para">
                                {this.state.totalMinDays}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 details-border">
                            <div>
                              <p className="details-title">
                                Total Maximum Days
                              </p>
                              <p className="details-para">
                                {this.state.totalMaxDays}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transit-sect-overflow">
                        {transitpopup.map((cell, i) => {
                          debugger;
                          var imgSrc = "";

                          return (
                            <div className="transit-sect">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="shipment-img mr-3">
                                    <TransitionImage
                                      imgType={cell.CModeOfTransport}
                                    />
                                  </div>
                                  <div>
                                    <p className="desti-name">
                                      {cell.StartLocation}
                                    </p>
                                    <p className="desti-route">
                                      to {cell.EndLocation}
                                    </p>
                                  </div>
                                </div>
                                <button className="butn cancel-butn">
                                  View
                                </button>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Average Days</p>
                                    <span className="days-count">
                                      {cell.NTransit_Time}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Minimum Days</p>
                                    <span className="days-count">
                                      {cell.NMin_Transit_Time}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Maximum Days</p>
                                    <span className="days-count">
                                      {cell.NMax_Transit_Time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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

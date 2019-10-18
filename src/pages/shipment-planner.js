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
  Polyline
} from "react-google-maps";

const SourceIcon = () => (
  <div className="google-icon-div" id="source-circ">
    <UncontrolledTooltip placement="auto" target="source-circ" trigger="hover">
      Istanbul
    </UncontrolledTooltip>
  </div>
);
const DestiIcon = () => (
  <div className="map-circ desti-circ" id="desti-circ">
    <UncontrolledTooltip show placement="right" target="desti-circ">
      New York
    </UncontrolledTooltip>
  </div>
);

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
      zoom: 4,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: []
    };

    this.toggleTransit = this.toggleTransit.bind(this);
    this.toggleDelivery = this.toggleDelivery.bind(this);
    this.toggleVisual = this.toggleVisual.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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
      let optionItems = response.data.map(comp => (
        <option value={comp.MappedCompID}>{comp.MappedCompName}</option>
      ));
      self.setState({ consigneedrp: optionItems });
    });
  };

  consigneeChange = e => {
    let self = this;
    let supconsid = 1250; //e.target.value;
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
      var totalAvg = 0;
      var totalMin = 0;
      var totalMax = 0;
      for (let index = 0; index < response.data.length; index++) {
        totalAvg += parseInt(response.data[index].NTransit_Time);
        totalMin += parseInt(response.data[index].NMin_Transit_Time);
        totalMax += parseInt(response.data[index].NMax_Transit_Time);
      }
      var Data = response.data;
      self.setState({ transitpopup: response.data });
      self.setState({ totalAvgDays: totalAvg });
      self.setState({ totalMinDays: totalMin });
      self.setState({ totalMaxDays: totalMax });
      self.setState({ mapsData: Data.Table });
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
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipperCompany`,
      data: {
        UserID: window.localStorage.getItem("userid")
      },
      headers: authHeader()
    }).then(function(response) {
      self.setState({ companydrp: response.data });
    });
  }

  render() {
    const { mapsData } = this.state;
    let iconMarker = new window.google.maps.MarkerImage(
      YellowFlag,
      null /* size is determined at runtime */,
      null /* origin is 0,0 */,
      null /* anchor is bottom center of the scaled image */,
      new window.google.maps.Size(32, 32)
    );

    var startendData = new Object();
    startendData.lat = 0;
    startendData.lng = 0;
    var latlan = [];
    const places = [
      {
        lat: 19.09824118,
        lng: 72.82493592,
        latitude1: 55.8103146,
        longitude1: -80.1751609
      }

      // {lat: 49.24859, lng: 8.887826},
      // {lat: 19.090405, lng: 72.86875},
    ];
    mapsData.map(mdata => {
      var abc = mdata.CStLatLong;
      latlan.push(abc.split(","));
    });
    latlan.map(ldata => {
      startendData = new Object();
      startendData.lat = Number(ldata[0]);
      startendData.lng = Number(ldata[1]);
      // places.push(startendData);
    });
    console.log(places);
    const pathCoordinates = [
      { lat: 25.8103146, lng: -80.1751609 },
      { lat: 35.8103146, lng: -90.1751609 }
    ];

    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
        defaultZoom={3}
      >
        <Polyline
          path={pathCoordinates}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 0.75,
            strokeWeight: 2
          }}
        />
        {places.map(function(mid, i) {
          return (
            <Marker
              position={{
                lat: mid.lat,
                lng: mid.lat
              }}
            />
          );
        })}
      </GoogleMap>
    ));

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
                        <GoogleMapExample
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></GoogleMapExample>
                        {/* <MyMapComponent isMarkerShown /> */}

                        {/* <GoogleMapReact
                          bootstrapURLKeys={{
                            key: appSettings.Keys
                          }}
                          defaultCenter={this.state.center}
                          defaultZoom={this.state.zoom}
                        >
                          <SourceIcon lat={21.1500964} lng={79.0127049} />
                          <DestiIcon lat={59.9} lng={30.3} />
                        </GoogleMapReact> */}
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
                                    1
                                  </span>
                                  Days Avarage
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12 col-sm-12">
                                <div className="avarage-day avrage-time">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_center">
                                    42 DAYS{" "}
                                  </span>
                                  AVERAGE
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
                                    1
                                  </span>
                                  Days Avarage
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
                    <div className="container-fluid p-0">
                      <div className="transit-sect">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="shipment-img mr-3">
                              <img src={Truck} alt="truck icon" />
                            </div>
                            <div>
                              <p className="desti-name">
                                Frankfurt am Main, Hessen, Germany
                              </p>
                              <p className="desti-route">
                                to Mumbai (ex Bombay), Maharashtra, India
                                Carrier Air France
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delivery-inner">
                        <div className="row">
                          <div className="col-md-4 text-center">
                            <p class="details-title">Departure Date</p>
                            <p class="details-para">10/18/2019</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <p class="details-title">ETA</p>
                            <p class="details-para">10/19/2019</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <p class="details-title">Estimated Delivery Date</p>
                            <p class="details-para">10/23/2019</p>
                          </div>
                        </div>
                      </div>
                    </div>
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

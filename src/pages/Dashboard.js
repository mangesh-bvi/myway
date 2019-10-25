import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import GoogleMapReact from "google-map-react";
import ShipWhite from "./../assets/img/ship-white.png";
import PlaneWhite from "./../assets/img/plane-white.png";
import BlueShip from "./../assets/img/ship_blue.png";
import BluePlane from "./../assets/img/blue_plane.png";
import BookingBlue from "./../assets/img/booking_blue.png";

// import TruckWhite from "./../assets/img/truck-white.png";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import GreenPlus from "./../assets/img/green-plus.png";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
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
      // const pageRediract = hblno => {
      //   debugger;
      //   <Redirect
      //     to={{
      //       pathname: "shipment-details",
      //       state: { detail: hblno }
      //     }}
      //   />;
      //   // this.props.history.push({ pathname: "", detail: hblno });
      // };
      let blueShip = new window.google.maps.MarkerImage(
        BlueShip,
        new window.google.maps.Size(32, 32)
      );
      let bluePlane = new window.google.maps.MarkerImage(
        BluePlane,
        new window.google.maps.Size(32, 32)
      );
      let bookingBlue = new window.google.maps.MarkerImage(
        BookingBlue,
        new window.google.maps.Size(32, 32)
      );

      if (marker.Pin == "Ocean") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            title={marker.Vessel}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={blueShip}
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    let Hblno= mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    return (
                      <>
                        <div
                          style={{
                            borderBottom: "1px solid #F1F2F2;",
                            overflow: "auto"
                          }}
                        >
                          <img src={GreenPlus} className="greenicon" />
                          <a href={shipmentdetails}><p
                            className="mapcontainerno"
                            
                          >
                            {mdata.ContainerNo}
                          </p></a>
                        </div>
                      </>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
      if (marker.Pin == "Air") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={bluePlane}
            title={marker.Vessel}
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    return (
                      <>
                        <p className="mapcontainerno">{mdata.ContainerNo}</p>
                      </>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
      if (marker.Pin == "Booking") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={bookingBlue}
            style={{ width: "32px" }}
            title={marker.Vessel}
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    return (
                      <>
                        <p className="mapcontainerno">{mdata.ContainerNo}</p>
                      </>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
    })}
  </GoogleMap>
));
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: [],
      zoom: 0,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: [],
      selectedMarker: "",
      ActiveShipmentData: [],
      QuotesData: [],
      InvoicesData: [],
      ModalData: []
    };
    this.BindMapData = this.BindMapData.bind(this);
    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);
    this.HandleQuotesData = this.HandleQuotesData.bind(this);
    this.HandleRediractPageShipmentDetails = this.HandleRediractPageShipmentDetails.bind(
      this
    );
  }

  handelrediract=(e)=>{

    alert("yes");
  }
  componentDidMount() {
    this.BindMapData();
    this.HandleQuotesData();
    this.HandleActiveShipmentData();
  }

  HandleRediractPageShipmentDetails(hblno) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: hblno }
    });
  }
  HandleActiveShipmentData() {
    let selt = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ActiveShipementData`,
      data: {
        UserID: 874588
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var activeshipment = response.data.Table;
      var invoicesData = response.data.Table2;
      selt.setState({
        ActiveShipmentData: activeshipment,
        InvoicesData: invoicesData
      });
    });
  }

  HandleQuotesData() {
    let selt = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DashboardQuotesData`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var quotesdata = response.data.Table;
      selt.setState({ QuotesData: quotesdata });
    });
  }
  handleClick = (marker, event) => {
    debugger;
    let selt = this;
    var userID = marker.ID;
    var latitude = marker.LastLocation_Lat;
    var longitude = marker.LastLocation_Lon;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentIConAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        lat: latitude,
        lng: longitude
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;

      selt.setState({
        selectedMarker: marker,
        ModalData: response.data.Table1
      });
    });
  };

  BindMapData() {
    let self = this;
    var mdata;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      console.log(response.data);
      mdata = response.data;
      self.setState({ mapsData: mdata });
    });
  }

  render() {
    const {
      mapsData,
      selectedMarker,
      ActiveShipmentData,
      InvoicesData,
      ModalData
    } = this.state;
    let self = this;
    const ActiveShipment = ActiveShipmentData.map(function(addkey, i) {
      return (
        <>
          <p>
            Shipment ID:
            <span>{addkey.ShipmentID}</span>
          </p>
          <p>
            HBL No :{" "}
            <span
              onClick={() =>
                self.HandleRediractPageShipmentDetails(addkey["HBL#"])
              }
              style={{ cursor: "pointer" }}
            >
              {addkey["HBL#"]}
            </span>
          </p>
          <p>
            Status :<span>{addkey.ShipmentStatus}</span>
          </p>
          <p>
            Mode of Transport :<span>{addkey.ModeOfTransport}</span>
          </p>
        </>
      );
    });

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="dash-outer">
              <div className="dash-map">
                <div className="full-map">
                  <MapWithAMakredInfoWindow
                    markers={mapsData}
                    onClick={this.handleClick}
                    selectedMarker={selectedMarker}
                    ModalData={ModalData}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                    containerElement={
                      <div style={{ height: `100%`, width: "100%" }} />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                    loadingElement={<div style={{ height: `100%` }} />}
                  ></MapWithAMakredInfoWindow>
                </div>
              </div>
              <div className="container-fluid p-0">
                <div className="row dash-sects-cntr">
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Active Shipments</h3>
                      <div className="dash-sects-dtls">
                        <div className="dash-sects-dtls-inner">
                          {ActiveShipment}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Booking</h3>
                      <div className="dash-sects-dtls">
                        {/* <i className="fa fa-refresh fa-spin"></i> */}
                        <div className="dash-sects-dtls-inner">
                          <p>
                            Booking Ref. :{" "}
                            {/* {this.state.bookingData.map(team => ( */}
                            <span></span>
                            {/* ))} */}
                          </p>
                          <p>
                            ETD : <span>12 Oct 2019, 20:30</span>
                          </p>
                          <p>
                            POL : <span>Ambarli, Istanbul, Turkey</span>
                          </p>
                          <p>
                            POD : <span>Baltimore, Maryland, USA</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Quotes</h3>
                      <div className="dash-sects-dtls">
                        {/* <i className="fa fa-refresh fa-spin"></i> */}
                        <div className="dash-sects-dtls-inner">
                          <p>
                            Customer Name : <span>David Robinson</span>
                          </p>
                          <p>
                            Shipment Type : <span>Air</span>
                          </p>
                          <p>
                            Expected Date : <span>09 - 12 -2019</span>
                          </p>
                          <p>
                            Status : <span>Accepted</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Invoices</h3>
                      <div className="dash-sects-dtls">
                        {/* <i className="fa fa-refresh fa-spin"></i> */}
                        <div className="dash-sects-dtls-inner">
                          <p>
                            Shipment No : <span>SH 01</span>
                          </p>
                          <p>
                            Customer Name : <span>BLUEGROUND US INC</span>
                          </p>
                        </div>
                      </div>
                    </div>
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

export default Dashboard;

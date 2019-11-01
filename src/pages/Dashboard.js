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
import LoadingImg from "./../assets/img/loading.gif";

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
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno = mdata["InvoiceNumber/Productid"].split(":");
                    var finalinvocearr=[];
                    for (let index = 0; index < inovceno.length; index++) {
                      var finalinvoce = inovceno[index].split("|")[0];  
                      finalinvocearr.push(finalinvoce);
                    }
                    
                    var C_colid="#" +mdata.ContainerNo;
                    var C_HblNO="#"+mdata["HBL#"]
                     
                    return (
                      <div className="pinmodal">
                        {/* <div id="accordion" class="accordion">
                          <div class="card mb-0">
                            <div
                              class="card-header collapsed"
                              data-toggle="collapse"
                              href={C_colid}
                            >
                              <a href={shipmentdetails}>
                                <p className="mapcontainerno">
                                  {mdata.ContainerNo}
                                </p>
                              </a>
                            </div>

                            <div
                              id={mdata.ContainerNo}
                              class="card-body collapse"
                              data-parent="#accordion"
                            > */}
                        {/* ---------------------------------HBL NO-------------------------- */}
                        {/* <div id="accordion-1" class="accordion">
                                <div class="card mb-0">
                                  <div
                                    class="card-header collapsed"
                                    data-toggle="collapse"
                                    href={C_HblNO}
                                  >
                                    <p className="mapcontainerno">
                                      {mdata["HBL#"]}
                                    </p>
                                  </div>
                                  <div
                                    id={mdata.ContainerNo}
                                    class="card-body collapse"
                                    data-parent="#accordion-1"
                                  >
                                    abc
                                  </div>
                                </div>
                              </div> */}
                        {/* -------------------------------------End Hbl No --------------------------- */}
                        {/* </div>
                          </div>
                        </div> */}
                        <div id="accordion">
                          <div class="card">
                            <div class="card-header" id="heading-1">
                              <h5 class="mb-0">
                                 
                                <div
                                  role="button"
                                  data-toggle="collapse"
                                  href={C_colid}
                                  aria-expanded="false"
                                  aria-controls={mdata.ContainerNo}
                                >
                                  <a href={shipmentdetails}>
                                    <p className="mapcontainerno">
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo}
                              class="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div class="card-body">
                                <div id="accordion-1">
                                  <div class="card">
                                    <div class="card-header" id="heading-1-1">
                                      <h5 class="mb-0">
                                        <div
                                          class="collapsed"
                                          role="button"
                                          data-toggle="collapse"
                                          href={C_HblNO}
                                          aria-expanded="false"
                                          aria-controls={mdata["HBL#"]}
                                        >
                                          <p className="mapcontainerno">
                                            {mdata["HBL#"]}
                                          </p>
                                        </div>
                                      </h5>
                                    </div>
                                    <div
                                      id={mdata["HBL#"]}
                                      class="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div class="card-body">
                                        {finalinvocearr.map(function(idata, i) {
                                          return (
                                            <div>
                                              <p className="mapinvoice">
                                                {idata}
                                              </p>
                                            </div>
                                          );
                                        })}
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
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno = mdata["InvoiceNumber/Productid"].split(":");
                    var finalinvoce = inovceno[i].split("|")[0];
                    return (
                      <>
                        <div
                          style={{
                            borderBottom: "1px solid #F1F2F2",
                            overflow: "auto"
                          }}
                        >
                          <img src={GreenPlus} className="greenicon" />
                          <a href={shipmentdetails}>
                            <p className="mapcontainerno">
                              {mdata.ContainerNo}
                            </p>
                          </a>
                          <p>{mdata["HBL#"]}</p>
                          <p>{finalinvoce}</p>
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
                    debugger;
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno = mdata["InvoiceNumber/Productid"].split(":");
                    var finalinvoce = inovceno[i].split("|")[0];
                    return (
                      <>
                        <div
                          style={{
                            borderBottom: "1px solid #F1F2F2",
                            overflow: "auto"
                          }}
                        >
                          <img src={GreenPlus} className="greenicon" />
                          <a href={shipmentdetails}>
                            <p className="mapcontainerno">
                              {mdata.ContainerNo}
                            </p>
                          </a>
                          <p>{mdata["HBL#"]}</p>
                          <p>{finalinvoce}</p>
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
    })}
  </GoogleMap>
));
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      BookingData: [],
      ModalData: [],
      checkMapview: true,
      loading:true
    };
    this.BindMapData = this.BindMapData.bind(this);
    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);
    this.HandleQuotesData = this.HandleQuotesData.bind(this);
    this.HandleRediractPageShipmentDetails = this.HandleRediractPageShipmentDetails.bind(
      this
    );
    this.HandleShipmentPage = this.HandleShipmentPage.bind(this);
    this.HandleBookingTablePage = this.HandleBookingTablePage.bind(this);
    this.HandleQuotesTablePage = this.HandleQuotesTablePage.bind(this);
    this.HandleBookingCardApi = this.HandleBookingCardApi.bind(this);
  }

  componentDidMount() {
    debugger;
    let self=this;
    this.BindMapData();
    this.HandleQuotesData();
    this.HandleActiveShipmentData();
    this.HandleBookingCardApi();
    
    var checkMapview = this.props.location.state;
    if(typeof(checkMapview)!="undefined"){
      var mapviewHow=this.props.location.state.detail;
      self.setState({ checkMapview: mapviewHow });
    }
     
  }
  // Active Shipment Card on ...View More click to rediract Shipment-summary page
  HandleShipmentPage() {
    this.props.history.push({ pathname: "shipment-summary" });
  }

  // Booking Card on ...View More click to rediract booking page
  HandleBookingTablePage() {
    this.props.history.push({ pathname: "booking-table" });
  }

  // Quotes Card on ...View More click to rediract Quotes page
  HandleQuotesTablePage() {
    this.props.history.push({ pathname: "quote-table" });
  }
  // Invoices Card on ...View More click to rediract Quotes page
  // HandleShipmentPage()
  // {
  //   this.props.history.push({pathname: "shipment-summary"});
  // }

  //Booking Card Bind Api Call
  HandleBookingCardApi() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchNewbooking`,
      data: {
        UserID: 874588
      },
      headers: authHeader()
    }).then(function(response) {
      var bookData = response.data.Table;
      self.setState({ BookingData: bookData });
    });
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
      var invoicesData = response.data.Table1;
      console.log(invoicesData);
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
      var quotesdata = response.data.Table;
      selt.setState({ QuotesData: quotesdata });
    });
  }
  handleClick = (marker, event) => {
    debugger;
    let selt = this;
    selt.setState({ selectedMarker: "" });
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
      console.log(response);
     
      selt.setState({
        selectedMarker: marker,
        ModalData: response.data.Table1
      });
    });
  };

  BindMapData() {
    let self = this;
    var mdata;
    debugger;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      mdata = response.data;
      self.setState({loading:false});
      self.setState({ mapsData: mdata });
    });
  }

  render() {
    const {
      mapsData,
      selectedMarker,
      ActiveShipmentData,
      InvoicesData,
      ModalData,
      BookingData,
      QuotesData,
      loading
    } = this.state;
    let self = this;

    const ActiveShipment = ActiveShipmentData.map(function(addkey, i) {
      if (i < 5) {
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
      }
    });
    const Booking = BookingData.map(function(book, i) {
      if (i < 5) {
        return (
          <>
            <p>
              Booking Ref. :<span>{book.BookingNo}</span>
            </p>
            <p>
              ETD : <span>{book.ETD}</span>
            </p>
            <p>
              POL : <span>{book.POL}</span>
            </p>
            <p>
              POD : <span>{book.POD}</span>
            </p>
          </>
        );
      }
    });

    const Quotes = QuotesData.map(function(quotes, i) {
      if (i < 5) {
        return (
          <>
            <p>
              Customer Name : <span>{quotes.CompanyName}</span>
            </p>
            <p>
              Shipment Type : <span>{quotes.type}</span>
            </p>
            <p>
              Expected Date : <span>{quotes.ExpiryDate}</span>
            </p>
            <p>
              Status : <span>{quotes.CurrentStatus}</span>
            </p>
          </>
        );
      } else {
        return;
      }
    });

    const Invoices = InvoicesData.map(function(invoice, i) {
      if (i < 5) {
        return (
          <>
            <p>
              Shipment No : <span>{invoice.InvoiceNumber}</span>
            </p>
            <p>
              Customer Name : <span>{invoice.BillToName}</span>
            </p>
          </>
        );
      } else {
        return;
      }
    });
    return (
      <div>
        {/* {loading == true ? (
          <img src={LoadingImg} width="50" height="50" />
        ) : null} */}

        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="dash-outer">
              {this.state.checkMapview == true ? (
                <>
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
                          <span
                            className="viewmore-span"
                            onClick={this.HandleShipmentPage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Booking</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Booking}
                            </div>
                          </div>
                          <span
                            className="viewmore-span"
                            onClick={this.HandleBookingTablePage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Quotes</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Quotes}
                            </div>
                          </div>
                          <span
                            className="viewmore-span"
                            onClick={this.HandleQuotesTablePage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Invoices</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Invoices}
                            </div>
                          </div>
                          <span className="viewmore-span">...View More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="dash-map"
                  style={{ minHeight: "calc(137vh - 332px)" }}
                >
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

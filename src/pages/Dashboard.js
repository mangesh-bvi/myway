import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";

import ShipBlue from "./../assets/img/blue-ship.png";
import PlaneBlue from "./../assets/img/blue-plane.png";
import DelayBlue from "./../assets/img/blue-delay.png";
import WL from "./../assets/img/wl.png";
import BookBlue from "./../assets/img/blue-booking.png";

import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Ship from "./../assets/img/ship.png";
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";
import Plane from "./../assets/img/plane.png";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 3,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      searchData: { index: 1, lat: 17.69265, lng: 83.299995 },
      mapsData: [],
      selectedMarker: "",
      ActiveShipmentData: [],
      QuotesData: [],
      InvoicesData: [],
      BookingData: [],
      ModalData: [],
      ModalTotalMapData: [],
      SelectPin: [],
      checkMapview: true,
      loading: true,
      watchlistLoading: true,
      bookingLoading: true,
      quotesLoading: true,
      invoicesLoading: true,
      IsWidgets: false,
      mapPosition: {
        lat: 32.24165126,
        lng: 77.78319374
      },
      iframeKey: 0
    };

    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);

    this.HandleQuotesTablePage = this.HandleQuotesTablePage.bind(this);
    this.HandleBookingCardApi = this.HandleBookingCardApi.bind(this);
    this.HandleWatchListData = this.HandleWatchListData.bind(this);
  }

  componentDidMount() {
    //debugger;
    let self = this;
    this.HandleQuotesData();
    this.HandleActiveShipmentData();
    this.HandleBookingCardApi();
    this.HandleWatchListData();
    self.setState({ iframeKey: self.state.iframeKey + 1 });
    var checkMapview = this.props.location.state;
    if (typeof checkMapview != "undefined") {
      var mapviewHow = this.props.location.state.detail;
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
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchNewbooking`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    }).then(function(response) {
      // debugger;
      var bookData = response.data.Table;
      self.setState({
        BookingData: bookData,
        bookingLoading: false
      });
    });
  }

  HandleRediractPageShipmentDetails(hblno) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: hblno, pageName: "ShipmentPage" }
    });
  }
  HandleActiveShipmentData() {
    let selt = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ActiveShipementData`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    }).then(function(response) {
      var invoicesData = response.data.Table1;
      selt.setState({
        InvoicesData: invoicesData,
        invoicesLoading: false
      });
    });
  }

  HandleWatchListData() {
    //debugger;
    let selt = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchWatchListDashBoard`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    }).then(function(response) {
      // debugger;
      var activeshipment = response.data.Table;
      selt.setState({
        ActiveShipmentData: activeshipment,
        watchlistLoading: false
      });
    });
  }

  HandleQuotesData() {
    //debugger
    let selt = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DashboardQuotesData`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      //debugger;
      var quotesdata = response.data.Table;
      selt.setState({
        QuotesData: quotesdata,
        quotesLoading: false
      });
    });
  }
  handleClick = (marker, event) => {
    //debugger;
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
      //debugger;

      selt.setState({
        selectedMarker: marker.LastLocation,
        ModalData: response.data.Table1
      });
    });
  };

  HandleShipmentPin(BindingID) {
    this.BindMapData(BindingID);
  }

  BindMapData(BindingID) {
    //debugger;
    let self = this;
    var mdata;
    var arraModalMapData = [];
    //debugger;

    if (self.ModalTotalMapData == null || self.ModalTotalMapData.length < 1) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc")
        },
        headers: authHeader()
      }).then(function(response) {
        //debugger;
        mdata = response.data;
        if (BindingID != "All") {
          mdata = mdata.filter(map => map.Pin == BindingID);
        }
        if (mdata.length > 0) {
          self.setState({ loading: false });
        }
        self.setState({ mapsData: mdata });
        self.ModalTotalMapData = mdata;
        var arrarSelectPin = ["Ocean", "Air", "Booking-Ocean", "Delay-Ocean"];

        self.SelectPin = arrarSelectPin;

        var element = !!document.getElementById("shipmentfilterdiv");
        if (element) {
          document.getElementById("shipmentfilterdiv").style.display = "block";
        }
      });
    } else {
      if (BindingID != "All") {
        var index = self.SelectPin.indexOf(BindingID);
        const div = document.getElementById(BindingID);
        if (index > -1) {
          self.SelectPin.splice(index, 1);

          div.classList.add("cancel-btn");
        } else {
          div.classList.remove("cancel-btn");
          self.SelectPin.push(BindingID);
        }

        for (var rray in self.SelectPin) {
          arraModalMapData = arraModalMapData.concat(
            self.ModalTotalMapData.filter(e => e.Pin == self.SelectPin[rray])
          );
        }

        //self.ModalTotalMapData = self.ModalTotalMapData.filter(function(e) { e.Pin == BindingID},self.SelectPin)
      }
      // if (mdata.length > 0) {
      //   self.setState({ loading: false });
      // }
      self.setState({ mapsData: arraModalMapData });
    }
  }

  handleHamb() {
    if (document.getElementById("Ocean").classList.contains("rem-icon")) {
      document.getElementById("Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Ocean").classList.add("rem-icon");
    }
    if (document.getElementById("Air").classList.contains("rem-icon")) {
      document.getElementById("Air").classList.remove("rem-icon");
    } else {
      document.getElementById("Air").classList.add("rem-icon");
    }
    if (document.getElementById("Delay-Ocean").classList.contains("rem-icon")) {
      document.getElementById("Delay-Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Delay-Ocean").classList.add("rem-icon");
    }
    if (
      document.getElementById("Booking-Ocean").classList.contains("rem-icon")
    ) {
      document.getElementById("Booking-Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Booking-Ocean").classList.add("rem-icon");
    }
  }

  handleBooking(bookingNo, mode) {
    // debugger;
    var bookingNo = bookingNo;
    var Mode = mode;
    this.props.history.push({
      pathname: "booking-view",
      state: { bookingNo: bookingNo, Mode: Mode }
    });
  }
  handleQuote(qnumber, type, status) {
    // debugger;
    var type = type;
    var qnumber = qnumber;
    var Status = status;
    var detail = { Quotes: qnumber, Type: type, Status: Status };
    this.props.history.push({
      pathname: "rate-finalizing-still",
      state: { detail: detail }
    });
  }
  render() {
    let className = "dash-map1";
    if (
      encryption(window.localStorage.getItem("usertype"), "desc") ==
      "Sales User"
    ) {
      this.state.IsWidgets = true;
      className = "dash-map";
    }
    const {
      ActiveShipmentData,
      InvoicesData,

      BookingData,
      QuotesData
    } = this.state;
    let self = this;

    const ActiveShipment = ActiveShipmentData.map(function(addkey, i) {
      if (i < 4) {
        return (
          <div key={i}>
            {/* <p>
              Shipment ID:
              <span>{addkey.ShipmentID}</span>
            </p> */}
            <p>
              {/* HBL No :{" "} */}
              <span
                onClick={() =>
                  self.HandleRediractPageShipmentDetails(addkey["HBL#"])
                }
                style={{ cursor: "pointer", color: "#000" }}
                title="HBL No"
              >
                {addkey["HBL#"]}
              </span>
              {(() => {
                if (addkey.ShipemntType == "Ocean") {
                  return (
                    <img src={Ship} className="modeoftrans-img" title="Ocean" />
                  );
                } else if (addkey.ShipemntType == "Air") {
                  return (
                    <img src={Plane} className="modeoftrans-img" title="Air" />
                  );
                } else if (addkey.ShipemntType == "Inland") {
                  return (
                    <img
                      src={Truck}
                      className="modeoftrans-img"
                      title="Inland"
                    />
                  );
                } else if (addkey.ShipemntType == "Railway") {
                  return (
                    <img
                      src={Rail}
                      className="modeoftrans-img"
                      title="Railway"
                    />
                  );
                }
                // <span>{addkey.ModeOfTransport}</span>
              })()}
            </p>
            <div className="d-flex justify-content-between">
              <p>
                <span className="shipment-status" title="Status">
                  {addkey.Status}
                </span>
              </p>
              {addkey.DataFor === "W" ? (
                <div className="wl-cntr">
                  <img src={WL} alt="wl-icon" />
                </div>
              ) : (
                ""
              )}
            </div>
            <hr className="horizontal-line" />
            {/* <p>
              Mode of Transport :<span>{addkey.ModeOfTransport}</span>
            </p> */}
          </div>
        );
      }
    });
    const Booking = BookingData.map(function(book, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span
                title={"Booking No"}
                style={{ color: "#000", cursor: "pointer" }}
                // onClick={() => this.handleBooking.bind(this)}
                onClick={() =>
                  self.handleBooking(book.BookingID, book.BookingType)
                }
              >
                {book.BookingNo}
              </span>
              <span style={{ float: "right" }}>
                {book.ETD !== "" || undefined || null
                  ? new Date(book.ETD).toLocaleDateString("en-US")
                  : ""}
              </span>
            </p>
            <p>
              POL : <span>{book.POL}</span>
            </p>

            <p>
              POD : <span>{book.POD}</span>
            </p>
            <p>
              <span className="shipment-status" title="Status">
                {book.Status}
              </span>
            </p>
            <hr className="horizontal-line" />
          </div>
        );
      }
    });

    const Quotes = QuotesData.map(function(quotes, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span
                title={"Quotetion No"}
                style={{
                  color: "#000",
                  fontFamily: "Bold Font",
                  cursor: "pointer"
                }}
                onClick={() => {
                  self.handleQuote(
                    quotes.SalesQuoteNumber,
                    quotes.type,
                    quotes.CurrentStatus
                  );
                }}
              >
                {quotes.SalesQuoteNumber}
              </span>
            </p>
            <p>
              <span title="Customer Name">{quotes.CompanyName}</span>
            </p>
            <p>
              <span title="Shipment Type">{quotes.type}</span>
              <span
                className="shipment-status"
                title="Status"
                style={{ float: "right" }}
              >
                {quotes.CurrentStatus}
              </span>
            </p>
            <p>
              <span title="Expected Date">{quotes.ExpiryDate}</span>
            </p>
            <hr className="horizontal-line" />
          </div>
        );
      } else {
        return;
      }
    });

    const Invoices = InvoicesData.map(function(invoice, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span style={{ color: "#000" }} title="Shipment No">
                {invoice.InvoiceNumber}
              </span>
            </p>
            <p>
              <span title="Customer Name">{invoice.BillToName}</span>
            </p>
            <hr className="horizontal-line" />
          </div>
        );
      } else {
        return;
      }
    });
    var colClassName = "";
    if (localStorage.getItem("isColepse")==="true") {
      
      colClassName = "cls-flside colap";
    } else {
             colClassName = "cls-flside";
           }
    return (
      <div>
        {}

        <Headers />

        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="dash-outer">
              {}
              {this.state.checkMapview == true ? (
                ""
              ) : (
                <div className="text-right">
                  <a href="/shipment-summary" className="butn mt-0 mb-2">
                    List View
                  </a>
                </div>
              )}
              {this.state.checkMapview == true ? (
                <>
                  <div className="dash-map">
                    <div className="full-map">
                      <iframe
                        key={this.state.iframeKey}
                        src="/MapMarkerDashboard.html"
                        className="mapIframe"
                        //sandbox="allow-top-navigation"
                      />
                    </div>
                  </div>
                  {}
                  <div className="row dash-sects-cntr">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                      <div className="dash-sects">
                        <div className="dashboard-loader">
                          <h3>Active Shipments</h3>
                          {this.state.watchlistLoading === true ? (
                            <div className="loader-icon"></div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="dash-sects-dtls">
                          <div className="dash-sects-dtls-inner">
                            {ActiveShipment}
                          </div>
                        </div>

                        <span
                          className="viewmore-span"
                          onClick={self.HandleShipmentPage.bind(this)}
                        >
                          ...View More
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                      <div className="dash-sects">
                        <div className="dashboard-loader">
                          <h3>Booking</h3>
                          {this.state.bookingLoading === true ? (
                            <div className="loader-icon"></div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="dash-sects-dtls">
                          {/* <i className="fa fa-refresh fa-spin"></i> */}
                          <div className="dash-sects-dtls-inner">{Booking}</div>
                        </div>
                        <span
                          className="viewmore-span"
                          onClick={self.HandleBookingTablePage.bind(this)}
                        >
                          ...View More
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                      <div className="dash-sects">
                        <div className="dashboard-loader">
                          <h3>Quotes</h3>
                          {this.state.quotesLoading === true ? (
                            <div className="loader-icon"></div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="dash-sects-dtls">
                          {/* <i className="fa fa-refresh fa-spin"></i> */}
                          <div className="dash-sects-dtls-inner">{Quotes}</div>
                        </div>
                        <span
                          className="viewmore-span"
                          onClick={self.HandleQuotesTablePage.bind(this)}
                        >
                          ...View More
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                      <div className="dash-sects">
                        <div className="dashboard-loader">
                          <h3>Invoices</h3>
                          {this.state.invoicesLoading === true ? (
                            <div className="loader-icon"></div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="dash-sects-dtls">
                          {}
                          <div className="dash-sects-dtls-inner">
                            {Invoices}
                          </div>
                        </div>
                        {}
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
                    <iframe
                      key={this.state.iframeKey}
                      src="/MapMarkerDashboard.html"
                      className="mapIframe"
                    />
                    {}
                  </div>
                </div>
              )}

              {}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

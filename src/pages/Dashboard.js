import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import WL from "./../assets/img/wl.png";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Ship from "./../assets/img/ship.png";
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";
import Plane from "./../assets/img/plane.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActiveShipmentData: [],
      QuotesData: [],
      InvoicesData: [],
      BookingData: [],
      checkMapview: true,
      loading: true,
      watchlistLoading: true,
      bookingLoading: true,
      quotesLoading: true,
      invoicesLoading: true,
      IsWidgets: false,
      iframeKey: 0
    };
    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);
    this.HandleQuotesTablePage = this.HandleQuotesTablePage.bind(this);
    this.HandleBookingCardApi = this.HandleBookingCardApi.bind(this);
    this.HandleWatchListData = this.HandleWatchListData.bind(this);
  }
  componentDidMount() {
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
      // 
      var bookData = response.data.Table;
      self.setState({
        BookingData: bookData,
        bookingLoading: false
      });
    });
  }
  //active shipment card in click HBL#  to rediract to shipemnt page
  HandleRediractPageShipmentDetails(hblno) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: hblno, pageName: "ShipmentPage" }
    });
  }
  //Invoice Card Data API
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
  //Active Shipment Card Data API
  HandleWatchListData() {
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
      var activeshipment = response.data.Table;
      selt.setState({
        ActiveShipmentData: activeshipment,
        watchlistLoading: false
      });
    });
  }
  //Quote Card Data API
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
      //
      var quotesdata = response.data.Table;
      selt.setState({
        QuotesData: quotesdata,
        quotesLoading: false
      });
    });
  }
  //booking number to click view booking page
  handleBooking(bookingNo, mode, BookingNo) {
    var bookingNo = bookingNo;
    var Mode = mode;
    var BookingNostr = BookingNo;
    this.props.history.push({
      pathname: "booking-view",
      state: { bookingNo: bookingNo, Mode: Mode, BookingNostr: BookingNostr }
    });
  }
  //quote number to click view quote page
  handleQuote(qnumber, type, status) {
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
            <p>
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
                onClick={() =>
                  self.handleBooking(
                    book.BookingID,
                    book.BookingType,
                    book.BookingNo
                  )
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
    if (localStorage.getItem("isColepse") === "true") {
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

import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import GoogleMapReact from "google-map-react";
import ShipWhite from "./../assets/img/ship-white.png";
import PlaneWhite from "./../assets/img/plane-white.png";
import TruckWhite from "./../assets/img/truck-white.png";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";

const SourceIcon = () => (
  <div className="map-icon source-icon">
    <img src={ShipWhite} />
  </div>
);
const DestiIcon = () => (
  <div className="map-icon desti-icon">
    <img src={PlaneWhite} />
  </div>
);
const TruckIcon = () => (
  <div className="map-icon desti-icon">
    <img src={TruckWhite} />
  </div>
);
const Dots = () => <div className="map-icon desti-icon three-dots"></div>;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: []
    };
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchNewbooking`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({ bookingData: response.data.Table });
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
            <div className="dash-outer">
              <div className="dash-map">
                <div className="full-map">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: appSettings.Keys
                    }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                  >
                    <SourceIcon lat={59.955413} lng={30.337844} />
                    <DestiIcon lat={59.9} lng={30.3} />
                    <TruckIcon lat={59.89} lng={30.23} />
                    <Dots lat={59.8} lng={30.2} />
                  </GoogleMapReact>
                </div>
              </div>
              <div className="container-fluid p-0">
                <div className="row dash-sects-cntr">
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Active Shipments</h3>
                      <div className="dash-sects-dtls">
                        {/* <i className="fa fa-refresh fa-spin"></i> */}
                        <div className="dash-sects-dtls-inner">
                          <p>
                            Shipment ID : <span>SH132F32</span>
                          </p>
                          <p>
                            HBL No : <span>3DGF54RT54363</span>
                          </p>
                          <p>
                            Status : <span>Transshiped</span>
                          </p>
                          <p>
                            Mode of Transport : <span>Ocean</span>
                          </p>
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

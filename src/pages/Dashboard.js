import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import GoogleMapReact from "google-map-react";
import ShipWhite from "./../assets/img/ship-white.png";
import PlaneWhite from "./../assets/img/plane-white.png";
import TruckWhite from "./../assets/img/truck-white.png";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { encryption } from "../helpers/encryption";

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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount()
  {
     this.BindMapData();
  }
  BindMapData()
  {
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"),"desc")
      },
      headers: authHeader()
    }).then(function(response) {
       debugger;
       console.log(response);
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
              <div className="map-tab">
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
                  </GoogleMapReact>
                </div>
              </div>
              <div className="container-fluid p-0">
                <div className="row dash-sects-cntr">
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Active Shipments</h3>
                      <div className="dash-sects-dtls">
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
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Booking</h3>
                      <div className="dash-sects-dtls">
                        <p>
                          Booking Ref. : <span>BNIST-006203</span>
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
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Quotes</h3>
                      <div className="dash-sects-dtls">
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
                  <div className="col-md-3">
                    <div className="dash-sects">
                      <h3>Invoices</h3>
                      <div className="dash-sects-dtls">
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
    );
  }
}

export default Dashboard;

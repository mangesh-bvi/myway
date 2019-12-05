import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import GoogleMapReact from "google-map-react";
import { Button, Modal, ModalBody } from "reactstrap";
import InputRange from "react-input-range";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import "react-input-range/lib/css/index.css";
import "react-table/react-table.css";

const SourceIcon = () => <div className="map-circ source-circ" />;
const DestiIcon = () => <div className="map-circ desti-circ" />;

class SpotRate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalEdit: false,
      modalSpot: false,
      value: 50
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleSpot = this.toggleSpot.bind(this);
    // this.spotRateMsg = this.spotRateMsg.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  toggleSpot() {
    this.setState(prevState => ({
      modalSpot: !prevState.modalSpot
    }));
  }
  spotRateMsg() {
    NotificationManager.success(
      "Request for Spot Rate is successfully submitted."
    );
  }

  render() {
    return (
      <div>
        <NotificationContainer />
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
            <div className="rate-table-header">
              <div className="title-sect">
                <h2>Rate Table</h2>
              </div>
              <div className="login-fields mb-0 rate-tab-drop">
                <select>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                </select>
              </div>
              <div className="rate-table-range">
                <span className="cust-labl clr-green">Faster</span>
                <span className="cust-labl clr-red">Cheaper</span>
                <InputRange
                  formatLabel={value => `${value} DAYS`}
                  maxValue={75}
                  minValue={32}
                  value={this.state.value}
                  onChange={value => this.setState({ value })}
                />
              </div>
              <div className="rate-table-butn">
                <a href="#!" className="blue-butn butn m-0">
                  Proceed
                </a>
              </div>
            </div>
            <div className="rate-table-below">
              <div className="row">
                <div className="col-md-4">
                  <div className="rate-table-left">
                    <div className="top-select d-flex justify-content-between">
                      <a href="new-rate-search" className="butn">
                        Export
                      </a>
                      <a href="new-rate-search" className="butn">
                        Sea
                      </a>
                      <a href="new-rate-search" className="butn">
                        FCL
                      </a>
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="door"
                              type="checkbox"
                              name={"cont-cost"}
                            />
                            <label htmlFor="door">Door to Door</label>
                          </div>
                          <span>100$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="insu"
                              type="checkbox"
                              name={"cont-cost"}
                            />
                            <label htmlFor="insu">Insurance</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-trak"
                              type="checkbox"
                              name={"cont-cost"}
                            />
                            <label htmlFor="cont-trak">
                              Container Tracking
                            </label>
                          </div>
                          <span>150$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name={"cont-cost"}
                            />
                            <label htmlFor="cust-clear">Custom Clearance</label>
                          </div>
                          <span>900$</span>
                        </div>
                      </div>
                    </div>
                    <div className="pol-pod-maps-cntr">
                      <div className="pol-pod-maps">
                        <span className="rate-map-ovrly">POL</span>
                        <span
                          onClick={this.toggleEdit}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                          }}
                          defaultCenter={this.props.center}
                          defaultZoom={this.props.zoom}
                        >
                          <SourceIcon lat={59.955413} lng={30.337844} />
                        </GoogleMapReact>
                      </div>
                      <div className="pol-pod-maps pod-maps">
                        <span className="rate-map-ovrly">POD</span>
                        <span
                          onClick={this.toggleEdit}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                          }}
                          defaultCenter={this.props.center}
                          defaultZoom={this.props.zoom}
                        >
                          <DestiIcon lat={59.955413} lng={30.337844} />
                        </GoogleMapReact>
                      </div>
                    </div>
                    <a href="#!" className="butn white-butn w-100 mt-0">
                      Quantity
                    </a>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="spot-rate">
                    <div className="no-rate">
                      <p>No Rates Found, Ask for Spot Rates</p>
                    </div>
                    <button onClick={this.toggleSpot} className="butn">
                      Spot Rate
                    </button>
                  </div>
                  <p className="bottom-profit">
                    Profit -------$ Customer Segment A Profit Margin %15
                  </p>
                </div>
              </div>
            </div>
            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalEdit}
              toggle={this.toggleEdit}
              centered={true}
            >
              <ModalBody>
                <div className="rename-cntr login-fields">
                  <label>Enter Latitude</label>
                  <input type="text" placeholder="Latitude" />
                </div>
                <div className="rename-cntr login-fields">
                  <label>Enter Longitude</label>
                  <input type="text" placeholder="Longitude" />
                </div>
                <Button className="butn" onClick={this.toggleEdit}>
                  Done
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleEdit}>
                  Cancel
                </Button>
              </ModalBody>
            </Modal>
            <Modal
              className="delete-popup spot-rate-popup pol-pod-popup"
              isOpen={this.state.modalSpot}
              toggle={this.toggleSpot}
              centered={true}
            >
              {/* <h3>Add Below Details</h3> */}
              <ModalBody>
              <button type="button" className="close" data-dismiss="modal" onClick={this.toggleSpot}>
                <span>&times;</span>
              </button>
                <div style={{background:"#fff" , borderRadius:"15px" , padding:"15px"}}>
                <div className="rename-cntr login-fields">
                  <label>Commodity</label>
                  <select>
                    <option>Select</option>
                    <option>Select</option>
                    <option>Select</option>
                  </select>
                </div>
                <div className="rename-cntr login-fields">
                  <label>Cargo</label>
                  <select>
                    <option>Select</option>
                    <option>Select</option>
                    <option>Select</option>
                  </select>
                </div>
                <Button
                  className="butn"
                  onClick={() => {
                    this.spotRateMsg();
                    this.toggleSpot();
                  }}
                >
                  Send
                </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default SpotRate;

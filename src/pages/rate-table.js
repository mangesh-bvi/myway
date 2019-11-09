import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Button, Modal, ModalBody } from "reactstrap";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import maersk from "./../assets/img/maersk.png";
import Select from "react-select";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import GreenIcon from "./../assets/img/green-circle.png";
import RedIcon from "./../assets/img/red-circle.png";

const { compose } = require("recompose");
const POLMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: 59.955413, lng: 30.337844 }}>
    <Marker
      position={{
        lat: 59.955413,
        lng: 30.337844
      }}
      icon={GreenIcon}
    ></Marker>
  </GoogleMap>
));
const PODMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: 29.955413, lng: 50.337844 }}>
    <Marker
      position={{
        lat: 29.955413,
        lng: 50.337844
      }}
      icon={RedIcon}
    ></Marker>
  </GoogleMap>
));

class RateTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalEdit: false,
      modalQuant: false,
      value: 50,
      RateDetails: [],
      values: []
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleQuant = this.toggleQuant.bind(this);
    this.HandleRateDetails = this.HandleRateDetails.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    this.HandleRateDetails();
  }

  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  toggleQuant() {
    this.setState(prevState => ({
      modalQuant: !prevState.modalQuant
    }));
  }

  HandleRateDetails() {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: {
        //UserID: 874588,
        QuoteType: "FCL",
        ModeOfTransport: "Ocean",
        Type: "Export",
        TypeOfMove: 1,
        PortOfDischargeCode: "TRPAM",
        PortOfLoadingCode: "INNSA",
        Containerdetails: [
          {
            ProfileCodeID: 16,
            ContainerCode: "40HC",
            Type: "40 High Cube",
            ContainerQuantity: 2
          }
        ]
      },
      headers: authHeader()
    }).then(function(response) {
      console.log(response);
      var ratetable = response.data.Table;
      self.setState({ RateDetails: ratetable });
    });
  }

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, ""]
    }));
  }

  createUI() {
    return this.state.values.map((el, index) => {
      return (
        <div>
          <div className="rename-cntr login-fields position-relative">
            <input type="text" />
            <i
              className="fa fa-minus equip-plus"
              id={"remove" + (index + 1)}
              onClick={this.removeClick.bind(this, index)}
            ></i>
          </div>
          <div className="rename-cntr login-fields">
            <textarea className="txt-add" placeholder="Enter POL"></textarea>
          </div>
        </div>
      );
    });
  }

  removeClick(i) {
    debugger;
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  render() {
    let self = this;
    var data1 = [
      { validUntil: "Valid Until : JANUARY", tt: "TT", price: "$43.00" },
      { validUntil: "Valid Until : MARCH", tt: "TT", price: "$88.00" },
      { validUntil: "Valid Until : AUGUST", tt: "TT", price: "$150.00" },
      { validUntil: "Valid Until : OCTOBER", tt: "TT", price: "$135.00" },
      { validUntil: "Valid Until : DECEMBER", tt: "TT", price: "$155.00" }
    ];
    var data2 = [
      {
        chargeCode: "A23435",
        chargeName: "Lorem",
        units: "43",
        unitPrice: "$134.00",
        finalPayment: "$45,986.00"
      },
      {
        chargeCode: "B45678",
        chargeName: "Lorem",
        units: "23",
        unitPrice: "$56.45",
        finalPayment: "$1200.00"
      },
      {
        chargeCode: "C54545",
        chargeName: "Lorem",
        units: "56",
        unitPrice: "$50.00",
        finalPayment: "$3456.00"
      }
    ];
    var i = 0;
    return (
      <div>
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
              <div>
                <a href="rate-finalizing" className="blue-butn butn m-0">
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
                        {/* <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                          }}
                          defaultCenter={this.props.center}
                          defaultZoom={this.props.zoom}
                        >
                          <SourceIcon lat={59.955413} lng={30.337844} />
                        </GoogleMapReact> */}
                        <POLMaps
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></POLMaps>
                      </div>
                      <div className="pol-pod-maps pod-maps">
                        <span className="rate-map-ovrly">POD</span>
                        <span
                          onClick={this.toggleEdit}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        <PODMaps
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></PODMaps>
                      </div>
                    </div>
                    <a
                      href="#!"
                      onClick={this.toggleQuant}
                      className="butn white-butn w-100 mt-0"
                    >
                      Quantity
                    </a>
                  </div>
                </div>

                <div className="col-md-8 react-rate-table">
                  <ReactTable
                    columns={[
                      {
                        columns: [
                          {
                            Cell: row => {
                              i++;
                              return (
                                <React.Fragment>
                                  <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                    <div className="remember-forgot d-block m-0">
                                      <input
                                        id={"maersk-logo" + i}
                                        type="checkbox"
                                        name={"rate-tab-check"}
                                      />
                                      <label
                                        htmlFor={"maersk-logo" + i}
                                      ></label>
                                    </div>
                                  </div>
                                  <div className="rate-tab-img">
                                    <img src={maersk} alt="maersk icon" />
                                  </div>
                                </React.Fragment>
                              );
                            },
                            minWidth: 200
                          },
                          {
                            accessor: "validUntil",
                            minWidth: 175
                          },
                          {
                            accessor: "tt",
                            minWidth: 80
                          },
                          {
                            accessor: "price",
                            minWidth: 80
                          }
                        ]
                      }
                    ]}
                    data={data1}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    SubComponent={row => {
                      return (
                        <div style={{ padding: "20px 0" }}>
                          <ReactTable
                            data={data2}
                            columns={[
                              {
                                columns: [
                                  {
                                    Header: "Charge Code",
                                    accessor: "chargeCode"
                                  },
                                  {
                                    Header: "Charge Name",
                                    accessor: "chargeName"
                                  },
                                  {
                                    Header: "Units",
                                    accessor: "units"
                                  },
                                  {
                                    Header: "Unit Price",
                                    accessor: "unitPrice"
                                  },
                                  {
                                    Header: "Final Payment",
                                    accessor: "finalPayment"
                                  }
                                ]
                              }
                            ]}
                            defaultPageSize={3}
                            showPagination={false}
                          />
                        </div>
                      );
                    }}
                  />
                  <p className="bottom-profit">
                    Profit -------$ Customer Segment A Profit Margin %15
                  </p>
                </div>
              </div>
            </div>
            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalQuant}
              toggle={this.toggleQuant}
              centered={true}
            >
              <ModalBody>
                <h3 className="mb-4">Equipment Types</h3>
                <div className="equip-plus-cntr w-100 mt-0">
                  <Select
                    className="rate-dropdown"
                    // getOptionLabel={option => option.StandardContainerCode}
                    // getOptionValue={option => option.StandardContainerCode}
                    isMulti
                    // options={self.state.StandardContainerCode}
                    // onChange={this.equipChange.bind(this)}
                    // value={self.state.selected}
                    // showNewOptionAtTop={false}
                  />
                </div>
                <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                  <input
                    id="Special-equType"
                    type="checkbox"
                    className="d-none"
                    name={"Special-equType"}
                    // onChange={this.HandleSpecialEqtCheck.bind(this)}
                  />
                  <label htmlFor="Special-equType">Special Equipment</label>
                </div>
                <div className="spe-equ mt-0">
                  <div className="equip-plus-cntr w-100">
                    <Select
                      // isDisabled={self.state.isSpacialEqt}
                      className="rate-dropdown"
                      // getOptionLabel={option => option.SpecialContainerCode}
                      isMulti
                      // getOptionValue={option => option.SpecialContainerCode}
                      // components={animatedComponents}
                      // options={self.state.SpacialEqmt}
                      placeholder="Select Kind of Special Equipment"
                      // onChange={this.specEquipChange}
                      // value={self.state.spEqtSelect}
                      showNewOptionAtTop={false}
                    />
                  </div>
                </div>
                <Button className="butn" onClick={this.toggleQuant}>
                  Done
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleQuant}>
                  Cancel
                </Button>
              </ModalBody>
            </Modal>
            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalEdit}
              toggle={this.toggleEdit}
              centered={true}
            >
              <ModalBody>
                <div className="pol-mar">
                  <div>
                    <div className="rename-cntr login-fields position-relative">
                      <input type="text" />
                      <i
                        className="fa fa-plus equip-plus"
                        onClick={this.addClick.bind(this)}
                      ></i>
                    </div>
                    <div className="rename-cntr login-fields">
                      <textarea
                        className="txt-add"
                        placeholder="Enter POL"
                      ></textarea>
                    </div>
                  </div>
                  {this.createUI()}
                </div>
                <Button className="butn" onClick={this.toggleEdit}>
                  Done
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleEdit}>
                  Cancel
                </Button>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default RateTable;

import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Button, Modal, ModalBody } from "reactstrap";
import Pencil from "./../assets/img/pencil.png";
import { de } from "date-fns/esm/locale";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";

const animatedComponents = makeAnimated();
const { compose } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");

const Map1WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
  ></GoogleMap>
));
const Map2WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
  ></GoogleMap>
));

class NewRateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      equipmentType: "",
      isSpecialEquipment: "0",
      specialEquipment: "",
      tempratureEquipment: "",
      isHazMat: "",
      incoTerms: "",
      typesofMove: "d2p",
      POL: "",
      POD: "",
      PUAddress: "",
      PDAddress: "",
      modalPuAdd: false,
      cbmLength: "",
      cbmWidth: "",
      cbmHeight: "",
      cbmQuantity: "",
      cbmVal: "",
      PODData: [],
      POLData: []
    };

    this.togglePuAdd = this.togglePuAdd.bind(this);
    this.HandleTypeofMove = this.HandleTypeofMove.bind(this);
    this.HandleBindPOLPODData = this.HandleBindPOLPODData.bind(this);
  }

  togglePuAdd() {
    this.setState(prevState => ({
      modalPuAdd: !prevState.modalPuAdd
    }));
  }

  componentDidMount() {
    this.HandleBindPOLPODData();
  }

  HandleBindPOLPODData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,
      // data: {
      //   Mode: "O",
      //   Search: "nhav",
      //   CountryCode: ""
      // },
      headers: authHeader()
    }).then(function(response) {
      debugger;

      // var bookData = response.data.Table;
      // self.setState({ BookingData: bookData });
    });
  }

  HandleTypeofMove(e) {
    this.setState({ typesofMove: e.target.id });
  }
  HandlePOLChange = POL => {
    debugger;

    this.setState({ POL });
  };
  HandlePODChange = POD => {
    this.setState({ POD });
  };
  ShipmentTypeClick = e => {
    let type = e.target.value;
    this.setState({ shipmentType: type });

    document.getElementById("shipmentType").classList.add("shipmentType");
  };
  shipmentTypePlusClick = e => {
    document
      .getElementById("shipmentTypeInner")
      .classList.remove("remShipmentType");
    document.getElementById("shipmentTypePlusClick").classList.add("d-none");
    document.getElementById("shipmentTypeName").classList.add("d-none");
    document
      .getElementById("shipmentTypeMinusClick")
      .classList.remove("d-none");
  };
  shipmentTypeMinusClick = e => {
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
  };
  modeofTransportClick = e => {
    let type = e.target.value;
    debugger;
    this.setState({ modeoftransport: type });
    document.getElementById("dvroad").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvair").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvsea").classList.add("new-radio-rate-cntr-hide");
    if (type == "air") {
      document
        .getElementById("dvair")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "sea") {
      this.setState({ containerLoadType: "fcl" });
      document
        .getElementById("dvsea")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "road") {
      document
        .getElementById("dvroad")
        .classList.remove("new-radio-rate-cntr-hide");
    }

    // next
    document.getElementById("modeTransport").classList.add("modeTransport");
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document
      .getElementById("shipmentTypeIconCntr")
      .classList.add("shipmentTypeIconCntr");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");
  };
  modeTransPlusClick = e => {
    document.getElementById("modeTransInner").classList.remove("modeTransType");
    document.getElementById("modeTransPlusClick").classList.add("d-none");
    document.getElementById("modeTransName").classList.add("d-none");
    document.getElementById("modeTransMinusClick").classList.remove("d-none");
  };
  modeTransMinusClick = e => {
    document.getElementById("modeTransInner").classList.add("modeTransType");
    document.getElementById("modeTransPlusClick").classList.remove("d-none");
    document.getElementById("modeTransName").classList.remove("d-none");
    document.getElementById("modeTransMinusClick").classList.add("d-none");
  };
  ContainerLoadTypeClick = e => {
    let type = e.target.value;
    this.setState({ containerLoadType: type });

    // next
    document.getElementById("containerLoad").classList.add("containerLoad");
    document.getElementById("modeTransInner").classList.add("modeTransType");
    document
      .getElementById("modeTransIconCntr")
      .classList.add("modeTransIconCntr");
    document.getElementById("modeTransName").classList.remove("d-none");
    document.getElementById("modeTransMinusClick").classList.add("d-none");
    document.getElementById("modeTransPlusClick").classList.remove("d-none");
  };
  cntrLoadPlusClick = e => {
    document.getElementById("cntrLoadInner").classList.remove("cntrLoadType");
    document.getElementById("cntrLoadPlusClick").classList.add("d-none");
    document.getElementById("cntrLoadName").classList.add("d-none");
    document.getElementById("cntrLoadMinusClick").classList.remove("d-none");
  };
  cntrLoadMinusClick = e => {
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
  };
  cbmChange = e => {
    debugger;
    let type = e.target.value;
    let nme = e.target.name;
    if (nme === "length") {
      this.setState({ cbmLength: type });
    } else if (nme === "width") {
      this.setState({ cbmWidth: type });
    } else if (nme === "height") {
      this.setState({ cbmHeight: type });
    } else if (nme === "qnty") {
      this.setState({ cbmQuantity: type });
    }

    if (
      this.state.cbmLength !== "" &&
      this.state.cbmWidth !== "" &&
      this.state.cmbHeight !== "" &&
      this.state.cmbQuantity !== ""
    ) {
      let cbmVal =
        parseFloat(this.state.cbmLength) +
        parseFloat(this.state.cbmWidth) +
        parseFloat(this.state.cbmHeight);
      this.setState({ cbmVal });

      // next
      document.getElementById("cbm").classList.add("cbm");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };
  cbmPlusClick = e => {
    document.getElementById("cbmInner").classList.remove("cbmType");
    document.getElementById("cbmPlusClick").classList.add("d-none");
    document.getElementById("cbmName").classList.add("d-none");
    document.getElementById("cbmMinusClick").classList.remove("d-none");
  };
  cbmMinusClick = e => {
    document.getElementById("cbmInner").classList.add("cbmType");
    document.getElementById("cbmPlusClick").classList.remove("d-none");
    document.getElementById("cbmName").classList.remove("d-none");
    document.getElementById("cbmMinusClick").classList.add("d-none");
  };

  equipChange = e => {
    console.log("change");
  };

  render() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];
    const optionsSpeEqu = [
      { value: "Refer Type", label: "Refer Type" },
      { value: "abc", label: "abc" },
      { value: "def", label: "def" }
    ];
    const optionsPOL = [
      { value: "10.5736", label: "10.5736" },
      { value: "20.6987", label: "20.6987" },
      { value: "30.0369", label: "30.0369" }
    ];
    const optionsPOD = [
      { value: "35.5736", label: "35.5736" },
      { value: "69.6987", label: "69.6987" },
      { value: "60.0369", label: "60.0369" }
    ];
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="new-rate-cntr" id="shipmentType">
              <div className="rate-title-cntr">
                <h3>Shipment Type</h3>
                <div className="iconSelection" id="shipmentTypeIconCntr">
                  <p className="side-selection" id="shipmentTypeName">
                    {this.state.shipmentType}
                  </p>
                  <i
                    className="fa fa-plus"
                    id="shipmentTypePlusClick"
                    onClick={this.shipmentTypePlusClick}
                  ></i>
                  <i
                    className="fa fa-minus d-none"
                    id="shipmentTypeMinusClick"
                    onClick={this.shipmentTypeMinusClick}
                  ></i>
                </div>
              </div>
              <div
                className="new-radio-rate-cntr radio-blue"
                id="shipmentTypeInner"
              >
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    value="Export"
                    onClick={this.ShipmentTypeClick}
                    id="export"
                  />
                  <label htmlFor="export">Export</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    value="Import"
                    id="import"
                    onClick={this.ShipmentTypeClick}
                  />
                  <label htmlFor="import">Import</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    value="Cross Trade"
                    onClick={this.ShipmentTypeClick}
                    id="cross"
                  />
                  <label htmlFor="cross">Cross Trade</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    value="Domestic"
                    onClick={this.ShipmentTypeClick}
                    id="domestic"
                  />
                  <label htmlFor="domestic">Domestic</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr" id="modeTransport">
              <div className="rate-title-cntr">
                <h3>Mode of Transport</h3>
                <div className="iconSelection" id="modeTransIconCntr">
                  <p className="side-selection" id="modeTransName">
                    {this.state.modeoftransport}
                  </p>
                  <i
                    className="fa fa-plus"
                    id="modeTransPlusClick"
                    onClick={this.modeTransPlusClick}
                  ></i>
                  <i
                    className="fa fa-minus d-none"
                    id="modeTransMinusClick"
                    onClick={this.modeTransMinusClick}
                  ></i>
                </div>
              </div>
              <div
                className="new-radio-rate-cntr  radio-green"
                id="modeTransInner"
              >
                <div>
                  <input
                    type="radio"
                    name="mode-transport"
                    value="sea"
                    onClick={this.modeofTransportClick}
                    id="sea"
                  />
                  <label htmlFor="sea">Sea</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="mode-transport"
                    value="air"
                    onClick={this.modeofTransportClick}
                    id="air"
                  />
                  <label htmlFor="air">Air</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="mode-transport"
                    name="mode-transport"
                    value="road"
                    onClick={this.modeofTransportClick}
                    id="road"
                  />
                  <label htmlFor="road">Road</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr" id="containerLoad">
              <div className="rate-title-cntr">
                <h3>Container Load</h3>
                <div className="iconSelection" id="cntrLoadIconCntr">
                  <p className="side-selection" id="cntrLoadName">
                    {this.state.containerLoadType}
                  </p>
                  <i
                    className="fa fa-plus"
                    id="cntrLoadPlusClick"
                    onClick={this.cntrLoadPlusClick}
                  ></i>
                  <i
                    className="fa fa-minus d-none"
                    id="cntrLoadMinusClick"
                    onClick={this.cntrLoadMinusClick}
                  ></i>
                </div>
              </div>
              <div id="cntrLoadInner">
                <div
                  id="dvsea"
                  className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-sea radio-light-blue"
                >
                  <div>
                    <input
                      type="radio"
                      name="cntr-load"
                      value="fcl"
                      onClick={this.ContainerLoadTypeClick}
                      id="fcl"
                    />
                    <label htmlFor="fcl">FCL</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="lcl"
                      onClick={this.ContainerLoadTypeClick}
                      name="cntr-load"
                      id="lcl"
                    />
                    <label htmlFor="lcl">LCL</label>
                  </div>
                </div>
                <div
                  id="dvair"
                  className="new-radio-rate-cntr cls-air radio-light-blue"
                >
                  <div>
                    <input
                      type="radio"
                      name="cntr-load-air"
                      value="air"
                      onClick={this.ContainerLoadTypeClick}
                      id="Air"
                    />
                    <label htmlFor="Air">AIR</label>
                  </div>
                </div>
                <div
                  id="dvroad"
                  className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-road radio-light-blue"
                >
                  <div>
                    <input
                      type="radio"
                      name="cntr-load-road"
                      value="ftl"
                      onClick={this.ContainerLoadTypeClick}
                      id="ftl"
                    />
                    <label htmlFor="ftl">FTL</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      value="ltl"
                      onClick={this.ContainerLoadTypeClick}
                      name="cntr-load-road"
                      id="ltl"
                    />
                    <label htmlFor="ltl">LTL</label>
                  </div>
                </div>
              </div>
            </div>
            {this.state.containerLoadType != "fcl" ? (
              <div className="new-rate-cntr" id="cbm">
                <h3>CBM / Dimensions</h3>
                <div className="rate-title-cntr">
                  <div className="iconSelection" id="cbmIconCntr">
                    <p className="side-selection" id="cbmName">
                      {this.state.modeoftransport}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="cbmPlusClick"
                      onClick={this.cntrLoadPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="cbmMinusClick"
                      onClick={this.cntrLoadMinusClick}
                    ></i>
                  </div>
                </div>
                <div id="cbmInner">
                  <div className="row">
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder="Length (cm)"
                          className="w-100"
                          name="length"
                          onBlur={this.cbmChange}
                        />
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder="Width (cm)"
                          className="w-100"
                          name="width"
                          onBlur={this.cbmChange}
                        />
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder="Height (cm)"
                          className="w-100"
                          name="height"
                          onBlur={this.cbmChange}
                        />
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder="Quantity"
                          className="w-100"
                          name="qnty"
                          onBlur={this.cbmChange}
                        />
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder="Gross Weight"
                          className="w-100"
                        />
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="spe-equ">
                        <input
                          type="text"
                          placeholder={
                            this.state.modeoftransport != "air" ? "CBM" : "KG"
                          }
                          className="w-100"
                          value={this.state.cbmVal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="new-rate-cntr">
              {this.state.containerLoadType != "lcl" ? (
                <div>
                  <h3>Equipment Types</h3>
                  <Select
                    className="rate-dropdown"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={options}
                    onChange={this.equipChange}
                  />
                  <div className="remember-forgot">
                    <input
                      id="spe-equip"
                      type="checkbox"
                      name={"special equipment"}
                    />
                    <label htmlFor="spe-equip" className="m-auto">
                      Special Equipment
                    </label>
                  </div>
                  <div className="spe-equ">
                    {/* <label>Kind of Special Equipment</label> */}
                    <Select
                      className="rate-dropdown m-auto"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={optionsSpeEqu}
                      placeholder="Select Kind of Special Equipment"
                    />
                  </div>
                  <div className="spe-equ">
                    {/* <label>Temperature of Equipment</label> */}
                    <input
                      type="text"
                      className="m-auto w-50"
                      placeholder="Enter Temperature of Equipment"
                    />
                  </div>
                </div>
              ) : null}
              <div className="remember-forgot justify-content-center">
                <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                <label htmlFor="haz-mat">HazMat</label>
                <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                <label htmlFor="haz-mat">Unstackable</label>
                <input id="cust-clear" type="checkbox" name={"haz-mat"} />
                <label htmlFor="cust-clear">Custom Clearance</label>
              </div>
              <div className="spe-equ">
                <input
                  type="text"
                  placeholder="Inco Terms"
                  className="m-auto w-50"
                  disabled
                  value="auto populated data will come"
                />
              </div>
              {/* <div className="new-radio-rate-cntr radio-brown">
                <div>
                  <input type="checkbox" name="dimensions" id="dc-20" />
                  <label htmlFor="dc-20">20 DC</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="dimensions"
                    id="dc-30"
                    defaultChecked
                  />
                  <label htmlFor="dc-30">30 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-40" />
                  <label htmlFor="dc-40">40 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-50" />
                  <label htmlFor="dc-50">50 DC</label>
                </div>
              </div> */}
            </div>
            <div className="new-rate-cntr">
              <h3>Type of Move</h3>
              <div className="new-radio-rate-cntr radio-blue">
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="p2p"
                    onChange={this.HandleTypeofMove}
                  />
                  <label htmlFor="p2p">Port2Port</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="d2p"
                    defaultChecked
                    onChange={this.HandleTypeofMove}
                  />
                  <label htmlFor="d2p">Door2Port</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="d2d"
                    onChange={this.HandleTypeofMove}
                  />
                  <label htmlFor="d2d">Door2Door</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="p2d"
                    onChange={this.HandleTypeofMove}
                  />
                  <label htmlFor="p2d">Port2Door</label>
                </div>
              </div>
            </div>

            {/* {this.state.typesofMove == "p2p" ? null : this.state.typesofMove ==
              "d2p" ? (
              <>ss</>
            ) : this.state.typesofMove == "d2d" ? (
              <>sss</>
            ) : this.state.typesofMove == "p2d" ? (
              <>wew</>
            ) : this.state.typesofMove == "d2p" ? (
              <></>
            ) : null} */}

            {this.state.typesofMove == "p2p" ? null : this.state.typesofMove ==
              "d2p" ? (
              <div className="new-rate-cntr">
                <h3 className="mb-3">Enter Addresses</h3>
                <div className="row" style={{ paddingLeft: "243px" }}>
                  <div className="col-md-8">
                    <textarea
                      className="rate-address"
                      placeholder="Enter PU Address"
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : this.state.typesofMove == "d2d" ? (
              <div className="new-rate-cntr">
                <h3>Enter Addresses</h3>
                <div className="row">
                  <div className="col-md-6">
                    <textarea
                      className="rate-address"
                      placeholder="Enter PU Address"
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <textarea
                      className="rate-address"
                      placeholder="Enter Delivery Address"
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : this.state.typesofMove == "p2d" ? (
              <div className="new-rate-cntr">
                <h3>Enter Addresses</h3>
                <div className="row" style={{ paddingLeft: "243px" }}>
                  <div className="col-md-8">
                    <textarea
                      className="rate-address"
                      placeholder="Enter Delivery Address"
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="new-rate-cntr">
              <h3>Select Location</h3>
              <div className="row polpodcls">
                <div className="col-md-6 ">
                  <Select
                    className="rate-dropdown w-100"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsSpeEqu}
                    placeholder="Select Country"
                  />
                  <Select
                    className="rate-dropdown w-100 mb-4"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsPOL}
                    placeholder="Select POL"
                    onChange={this.HandlePOLChange}
                    value={this.state.POl}
                  />
                  <Map1WithAMakredInfoWindow
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    className="rate-dropdown w-100"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsSpeEqu}
                    placeholder="Select Country"
                  />
                  <Select
                    className="rate-dropdown w-100 mb-4"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsPOD}
                    placeholder="Select POD"
                    onChange={this.HandlePODChange}
                    value={this.state.POD}
                  />
                  <Map2WithAMakredInfoWindow
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                </div>
              </div>
            </div>
            <div className="text-center d-none">
              <a href="rate-table" className="butn blue-butn rate-search">
                Search
              </a>
            </div>
          </div>
        </div>
        <Modal
          className="amnt-popup"
          isOpen={this.state.modalPuAdd}
          toggle={this.togglePuAdd}
          centered={true}
        >
          <ModalBody>
            <div className="txt-cntr">
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Street</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <textarea class="rate-address"></textarea>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Country</p>
                <div class="spe-equ d-block m-0 flex-grow-1 login-fields">
                  <select>
                    <option>bkj</option>
                    <option>bkj</option>
                    <option>bkj</option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Consignee Name</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" class="w-100" />
                </div>
              </div>

              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Notification Person</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" class="w-100" />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Email Id</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" class="w-100" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button className="butn" onClick={this.togglePuAdd}>
                Create
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default NewRateSearch;

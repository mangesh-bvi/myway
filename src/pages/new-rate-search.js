import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Select from "react-select";

import makeAnimated from "react-select/animated";
import { Button, Modal, ModalBody } from "reactstrap";
import Pencil from "./../assets/img/pencil.png";
import Weight from "./../assets/img/weight.png";

import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import Autocomplete from "react-google-autocomplete";

import ReactAutocomplete from "react-autocomplete";

var i = 0;
const animatedComponents = makeAnimated();
const { compose } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} = require("react-google-maps");

const Map1WithAMakredInfoWindowSearchBooks = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap>
    <Autocomplete
      placeholder="Enter PU Address"
      className="w-100"
      name=""
      type="text"
      onPlaceSelected={props.onPlaceSelected}
      types={["(regions)"]}
    />
  </GoogleMap>
));

const GoogleMapPODSearchBox = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap>
    <Autocomplete
      placeholder="Enter PD Address"
      type="text"
      className="w-100"
      onPlaceSelected={props.onPlaceSelected}
      types={["(regions)"]}
    />
  </GoogleMap>
));

const Map1WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    center={
      props.mapPositionPOL
        ? props.mapPositionPOL
        : { lat: parseFloat(32.24165126), lng: parseFloat(77.78319374) }
    }
    defaultZoom={9}
    zoom={props.zomePOL}
    zoom={9}
  >
    <Marker key={1} position={props.mapPositionPOL}></Marker>
  </GoogleMap>
));
const Map2WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    center={
      props.mapPositionPOD
        ? props.mapPositionPOD
        : { lat: 32.24165126, lng: 77.78319374 }
    }
    defaultZoom={9}
    //zoom={props.zomePOL}
  >
    {/* {this.props.mapPositionPOD === null ? alert(1) : null} */}
    <Marker position={props.mapPositionPOD} />
  </GoogleMap>
));

class NewRateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //For API Paramater:-

      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      typesofMove: "",
      PickupCity: "",
      DeliveryCity: "",
      OriginGeoCordinates: "",
      DestGeoCordinate: "",
      companyId: 0,

      Containerdetails: [],
      PortOfDischargeCode: "",
      PortOfLoadingCode: "",
      Currency: "",
      //-----
      Custom_Clearance: false,
      NonStackable: false,
      HazMat: false,
      multiCBM: [
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ],
      users: [],
      referType: [],
      flattack_openTop: [],
      spacEqmtType: [],
      TruckTypeSelect: [],
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ],
      fieldspol: {},
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      refertypeSelect: false,
      isTypeofMove: "",
      cmbTypeRadio: "",
      specialEquipment: false,
      equipmentType: "",
      isSpecialEquipment: "0",
      tempratureEquipment: "",
      fields: {},
      poladdress: "",
      polpodData: [],
      polpodDataAdd: [],
      isHazMat: "",
      incoTerms: "",
      POL: "",
      POD: "",
      PUAddress: "",
      PDAddress: "",
      modalPuAdd: false,
      cbmLength: "",
      cbmWidth: "",
      cbmHeight: "",
      cbmQuantity: "1",
      cbmVal: "",
      PODData: [],
      POLData: [],
      puAdd: "",
      deliAdd: "",
      values: [],
      values1: [],
      equQuan: "",
      polCountry: "",
      pol: "",
      podCountry: "",
      pod: "",
      equipDrop: [],
      country: [],
      StandardContainerCode: [],
      multi: true,
      selected: [],
      isSpacialEqt: true,
      SpacialEqmt: [],
      spEqtSelect: [],
      searchTextPOD: "",
      zoomPOL: 0,
      zoomPOD: 0,
      markerPositionPOL: {},
      mapPositionPOL: {},
      markerPositionPOD: {},
      mapPositionPOD: {},
      fullAddressPOL: [],
      fullAddressPOD: [],
      totalQuantity: 0,
      isCustomClear: "No",
      polfullAddData: {},
      podfullAddData: {},
      commodityData: [],
      packageTypeData: [],
      isSearch: false,
      currencyData: [],
      currencyCode: "",
      TruckType: [],
      showCurr: false
      testSelection: false
    };

    this.togglePuAdd = this.togglePuAdd.bind(this);
    this.HandleTypeofMove = this.HandleTypeofMove.bind(this);
    this.HandleBindIncoTeamData = this.HandleBindIncoTeamData.bind(this);
    this.HandleCounterListBind = this.HandleCounterListBind.bind(this);
    this.HandleShipmentStages = this.HandleShipmentStages.bind(this);
    // this.HandleCommodityData = this.HandleCommodityData.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.HandleTruckTypeData = this.HandleTruckTypeData.bind(this);
  }

  componentDidMount() {
    debugger;
    if (typeof this.props.history.location.state !== "undefined") {
      var compId = this.props.history.location.state;
      if (compId !== null) {
        this.setState({ companyId: compId.companyId });
      }
    }
    this.HandleCounterListBind();
    // this.HandleCommodityData();
    this.HandlePackgeTypeData();
    this.HandleTruckTypeData();
  }

  // HandleStateValue(pValues) {
  //   this.setState({
  //     shipmentType: paramData.shipmentType,
  //     modeoftransport: paramData.modeoftransport,
  //     containerLoadType: paramData.containerLoadType,
  //     typeofMove: rTypeofMove,
  //     selectaddress: selectedPOLPOD,
  //     HazMat: paramData.HazMat,
  //     NonStackable: paramData.NonStackable,
  //     Custom_Clearance: paramData.Custom_Clearance,
  //     SpacialEqmt: paramData.SpacialEqmt,
  //     EquipmentType: paramData.StandardContainerCode,
  //     spacEqmtType: paramData.spacEqmtType,
  //     referType: paramData.referType,
  //     flattack_openTop: paramData.flattack_openTop,
  //     spacEqmtTypeSelect: paramData.spacEqmtTypeSelect,
  //     specialEqtSelect: paramData.specialEqtSelect,
  //     refertypeSelect: paramData.refertypeSelect
  //   });
  // }

  HandleSearchButton() {
    let self = this;
    if (this.state.currencyCode === "") {
      this.setState({
        showCurr: true
      });
    }
    if (this.state.currencyCode !== "") {
      this.props.history.push({ pathname: "rate-table", state: this.state });
    }
  }

  HandleCMBtextChange(e) {
    debugger;
    var Textvalue = e.target.value;

    this.setState({ cbmVal: Textvalue });
    document.getElementById("cbm").classList.add("cbm");
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("containerLoad").classList.add("less-padd");

    document
      .getElementById("cntrLoadIconCntr")
      .classList.add("cntrLoadIconCntr");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
  }
  toggleNonStackable() {
    this.setState({ NonStackable: !this.state.NonStackable });
  }
  toggleHazMat() {
    this.setState({ HazMat: !this.state.HazMat });
  }

  cmbTypeRadioChange(e) {
    var value = e.target.value;
    this.setState({ cmbTypeRadio: value });
  }
  //// Handle Truck Type Method

  HandleTruckTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/TruckTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ TruckType: data });
    });
  }
  ////

  //// Create Trcuk Type dropdown dynamic element UI

  addClickTruckType() {
    this.setState(prevState => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ]
    }));
  }

  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr">
          <div className="spe-equ">
            <select
              className="select-text mr-3"
              name="TruckName"
              onChange={this.UITruckTypeChange.bind(this, i)}
            >
              <option>Select</option>
              {this.state.TruckType.map((item, i) => (
                <option key={i} value={item.TruckID}>
                  {item.TruckName}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="Quantity"
              placeholder="Quantity"
              onChange={this.UITruckTypeChange.bind(this, i)}
            />
          </div>
          {i === 0 ? (
            <div className="col-md">
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
          {this.state.TruckTypeData.length > 1 ? (
            <div className="col-md">
              <div className="spe-equ mt-2">
                <i
                  className="fa fa-minus"
                  aria-hidden="true"
                  onClick={this.removeClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
  }

  UITruckTypeChange(i, e) {
    const { name, value } = e.target;

    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData[i] = {
      ...TruckTypeData[i],
      [name]: name === "Quantity" ? parseInt(value) : value,
      ["TruckDesc"]:
        name === "TruckName"
          ? e.target.options[e.target.selectedIndex].text
          : TruckTypeData[i].TruckDesc
    };
    this.setState({ TruckTypeData });
    document.getElementById("cbm").classList.add("cbm");
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("containerLoad").classList.add("less-padd");

    document
      .getElementById("cntrLoadIconCntr")
      .classList.add("cntrLoadIconCntr");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
  }
  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
  }

  //// End Truck Tyep Dynamic element

  ////Package Type Dropdata DataBind Methos

  HandlePackgeTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/PackageTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ packageTypeData: data });
    });
  }

  HandleCurrencyChange(e) {
    this.setState({ currencyCode: e.CurrencyCode, isSearch: true, showCurr: false });
  }

  //// end package type method

  //// POL POD Autosearch Data
  HandleAddressDropdownPolSelect(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;

    if (field === "pol") {
      if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
        var geoCoordinate = id.GeoCoordinate.split(",");
        var mapPositionPOL = new Object();
        mapPositionPOL.lat = parseFloat(geoCoordinate[0]);
        mapPositionPOL.lng = parseFloat(geoCoordinate[1]);
        this.setState({
          polfullAddData: id,
          fields,
          mapPositionPOL: mapPositionPOL
        });
      }
    } else {
      if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
        var geoCoordinate = id.GeoCoordinate.split(",");
        var mapPositionPOD = this.state.mapPositionPOD;
        mapPositionPOD.lat = parseFloat(geoCoordinate[0]);
        mapPositionPOD.lng = parseFloat(geoCoordinate[1]);
        this.setState({
          podfullAddData: id,
          fields,
          markerPositionPOD: mapPositionPOD
        });
      }
    }
    debugger;
    document.getElementById("address").classList.add("address");
    document.getElementById("typeMoveInner").classList.add("typeMoveType");
    document.getElementById("typeMove").classList.add("less-padd");
    document
      .getElementById("typeMoveIconCntr")
      .classList.add("typeMoveIconCntr");
    document.getElementById("typeMoveName").classList.remove("d-none");
    document.getElementById("typeMoveMinusClick").classList.add("d-none");
    document.getElementById("typeMovePlusClick").classList.remove("d-none");

    document.getElementById("location").classList.add("location");
    if (document.getElementById("addressInner") == null) {
      document.getElementById("typeMoveInner").classList.add("typeMoveType");
      document.getElementById("typeMove").classList.add("less-padd");
    } else {
      // document.getElementById("addressInner").classList.add("addressType");
      // document.getElementById("address").classList.add("less-padd");
    }

    if (document.getElementById("addressInner") == null)
      document
        .getElementById("typeMoveIconCntr")
        .classList.add("typeMoveIconCntr");
    else
      document
        .getElementById("addressIconCntr")
        .classList.add("addressIconCntr");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMoveName").classList.remove("d-none");
    else document.getElementById("addressName").classList.remove("d-none");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMoveMinusClick").classList.add("d-none");
    else document.getElementById("addressMinusClick").classList.add("d-none");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMovePlusClick").classList.remove("d-none");
    else document.getElementById("addressPlusClick").classList.remove("d-none");
  }

  HandlePOLPODAutosearch(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;

    var type = this.state.modeoftransport;
    if (fields[field].length > 3) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/PolPodByCountry`,
        data: {
          Mode:
            type === "SEA"
              ? "O"
              : type === "AIR"
              ? "A"
              : type === "ROAD"
              ? "I"
              : "",
          Search: fields[field],
          CountryCode: ""
        },
        headers: authHeader()
      })
        .then(function(response) {
          if (field === "pol") {
            self.setState({
              polpodData: response.data.Table,
              fields
            });
          } else {
            self.setState({
              polpodDataAdd: response.data.Table,
              fields
            });
          }
        })
        .catch(error => {
          debugger;
          // var errorData = error.response.data;
          // var err = errorData.split(":");
          // var data = [{ OceanPortLongName: err[1].replace("}", "") }];
          // this.setState({ polpodData: data });
          console.log(error);
        });
    } else {
      self.setState({
        fields,
        polpodData: []
      });
    }
  }

  //// start dynamic element for LCL-AIR-LTL

  CreateMultiCBM() {
    return this.state.multiCBM.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <select
              className="select-text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              name="PackageType"
              value={el.PackageType}
            >
              <option selected>Select</option>
              {this.state.packageTypeData.map((item, i) => (
                <option key={i} value={item.PackageName}>
                  {item.PackageName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="QTY"
              className="w-100"
              name="Quantity"
              value={el.Quantity || ""}
              //onKeyUp={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="Lengths"
              value={el.Lengths || ""}
              // onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"W (cm)"}
              className="w-100"
              name="Width"
              value={el.Width || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="Height"
              value={el.Height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="GrossWt"
              value={el.GrossWt || ""}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              disabled
              name={
                this.state.containerLoadType === "LCL"
                  ? "Volume"
                  : "VolumeWeight"
              }
              // onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={
                this.state.containerLoadType === "LCL"
                  ? "KG"
                  : this.state.containerLoadType === "AIR"
                  ? "CW"
                  : "VW"
              }
              value={
                this.state.containerLoadType === "LCL"
                  ? el.Volume
                  : el.VolumeWeight || ""
              }
              className="w-100 weight-icon"
            />
          </div>
        </div>
        {i === 0 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-plus mt-2"
                aria-hidden="true"
                onClick={this.addMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
        {this.state.multiCBM.length > 1 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
      </div>
    ));
  }

  HandleChangeMultiCBM(i, e) {
    debugger;
    const { name, value } = e.target;

    let multiCBM = [...this.state.multiCBM];

    if ("PackageType" === name) {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value
      };
    } else {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: parseFloat(value)
      };
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (multiCBM[i].Quantity *
          (multiCBM[i].Lengths * multiCBM[i].Width * multiCBM[i].Height)) /
        6000;
        if (multiCBM[i].GrossWt > parseFloat(decVolumeWeight)) {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: multiCBM[i].GrossWt
        };
      }
        else{
      multiCBM[i] = {
        ...multiCBM[i],
        ["VolumeWeight"]: parseFloat(decVolumeWeight)
      };}
    } else {
      var decVolume =
        multiCBM[i].Quantity *
        ((multiCBM[i].Lengths / 100) *
          (multiCBM[i].Width / 100) *
          (multiCBM[i].Height / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: parseFloat(decVolume)
      };
    }

    this.setState({ multiCBM });

    // next
    document.getElementById("cbm").classList.add("cbm");
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("containerLoad").classList.add("less-padd");

    document
      .getElementById("cntrLoadIconCntr")
      .classList.add("cntrLoadIconCntr");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
  }
  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          Weight: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
  }
  removeMultiCBM(i) {
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
  }

  ////End dynamic element

  //// start  spacEqmtType dyamanic element

  addSpacEqmtType(optionVal) {
    this.setState(prevState => ({
      spacEqmtType: [
        ...prevState.spacEqmtType,
        {
          TypeName: optionVal[0].SpecialContainerCode,
          Quantity: 0
        }
      ]
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spec-inner-cntr w-auto">
          <label name="TypeName">
            {el.TypeName} <span className="into-quant">X</span>
          </label>
          {/* <div className="spe-equ"> */}
          <input
            type="number"
            name="Quantity"
            min={1}
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.Quantity || ""}
          />
          {/* </div> */}
          <i
            className="fa fa-times"
            onClick={this.removeClickSpacEqmtType.bind(this, i)}
          ></i>
        </div>
      );
    });
  }

  HandleChangeSpacEqmtType(i, e) {
    const { name, value } = e.target;

    let spacEqmtType = [...this.state.spacEqmtType];
    spacEqmtType[i] = {
      ...spacEqmtType[i],
      [name]: parseFloat(value)
    };
    this.setState({ spacEqmtType });
  }

  removeClickSpacEqmtType(i) {
    let spacEqmtType = [...this.state.spacEqmtType];
    spacEqmtType.splice(i, 1);
    this.setState({ spacEqmtType });
  }

  //// end spacEqmtType dyamanic element

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState(prevState => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          ContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 0,
          Temperature: 0,
          TemperatureType: ""
        }
      ]
    }));
  }

  createUISpecial() {
    return this.state.referType.map((el, i) => {
      return (
        <div key={i} className="row cbm-space">
          <div className="col-md">
            <div className="spe-equ">
              <label className="mt-2" name="ContainerCode">
                {el.ContainerCode}
              </label>
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="ContainerQuantity"
                placeholder="Quantity"
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="Temperature"
                placeholder="Temp"
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md mt-2">
            <div className="rate-radio-cntr">
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="exist-cust"
                  value="C"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="exist-cust"
                >
                  Celcius
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="new-cust"
                  value="F"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="new-cust"
                >
                  Farenheit
                </label>
              </div>
            </div>
          </div>
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              onClick={this.removeClickSpecial.bind(this, i)}
            ></i>
          </div>
        </div>
      );
    });
  }

  UISpecialChange(i, e) {
    const { name, value } = e.target;

    let referType = [...this.state.referType];
    referType[i] = {
      ...referType[i],
      [name]: name === "TemperatureType" ? value : parseFloat(value)
    };
    this.setState({ referType });
  }
  removeClickSpecial(i) {
    let referType = [...this.state.referType];
    referType.splice(i, 1);
    this.setState({ referType });
  }

  //// refer type end to dynamic element

  //// start flattack type and openTop type dynamic elememnt

  MultiCreateCBM() {
    debugger;
    return this.state.flattack_openTop.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <label className="mr-0 mt-2" name="SpecialContainerCode">
              {el.SpecialContainerCode}
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <select
              className="select-text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              name="PackageType"
              value={el.PackageType}
            >
              <option selected>Select</option>
              {this.state.packageTypeData.map((item, i) => (
                <option key={i} value={item.PackageName}>
                  {item.PackageName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder="Quantity"
              className="w-100"
              name="Quantity"
              value={el.Quantity}
              //onKeyUp={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="length"
              value={el.length || ""}
              // onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={"W (cm)"}
              className="w-100"
              name="width"
              value={el.width || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="height"
              value={el.height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="Gross_Weight"
              value={el.Gross_Weight}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              name="total"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={this.state.modeoftransport != "AIR" ? "VW" : "KG"}
              value={el.total || ""}
              className="w-100"
            />
          </div>
        </div>

        <div className="">
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              aria-hidden="true"
              onClick={this.removeClickMultiCBM.bind(this)}
            ></i>
          </div>
        </div>
      </div>
    ));
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;
    debugger;
    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value)
      };
    }

    this.setState({ flattack_openTop });
    var decVolumeWeight =
      (flattack_openTop[i].Quantity *
        (flattack_openTop[i].length *
          flattack_openTop[i].width *
          flattack_openTop[i].height)) /
      6000;
    if (decVolumeWeight > parseFloat(flattack_openTop[i].Gross_Weight)) {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(decVolumeWeight)
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(flattack_openTop[i].Gross_Weight)
      };
    }

    this.setState({ flattack_openTop });
  }
  addClickMultiCBM(optionsVal) {
    debugger;
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: optionsVal[0].SpecialContainerCode,
          PackageType: "",
          length: "",
          width: "",
          height: "",
          Quantity: "",
          Gross_Weight: "",
          total: ""
        }
      ]
    }));
  }
  removeClickMultiCBM(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }

  ////end for flattack and openTop dynamic create elements

  ////this for Equipment Type Dynamice Create Element
  NewcreateUI() {
    return this.state.users.map((el, i) => (
      <div className="equip-plus-cntr spec-inner-cntr w-auto" key={i}>
        <label>
          {el.StandardContainerCode} <span className="into-quant">X</span>
        </label>
        <div className="spe-equ">
          <input
            type="number"
            min={1}
            placeholder="QTY"
            name="ContainerQuantity"
            value={el.ContainerQuantity || ""}
            onChange={this.newhandleChange.bind(this, i)}
          />
        </div>
        <span onClick={this.newremoveClick.bind(this, i)}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
      </div>
    ));
  }

  newaddClick(e, option) {
    if (e.length > 0) {
      if (this.state.users.length == 0) {
        if (option.option.ContainerName === "Special Equipment") {
          this.setState({ specialEquipment: true, isSpacialEqt: false });
        } else {
          this.setState({ selected: e });
          this.setState(prevState => ({
            users: [
              ...prevState.users,
              {
                ContainerName: option.option.ContainerName,
                ProfileCodeID: option.option.ProfileCodeID,
                StandardContainerCode: option.option.StandardContainerCode,
                ContainerQuantity: 0,
                Temperature: 0,
                TemperatureType: ""
              }
            ]
          }));
        }
      } else {
        let difference = this.state.selected.filter(x => !e.includes(x));
        if (difference.length === 0) {
          if (option.option.ContainerName === "Special Equipment") {
            this.setState({
              specialEquipment: true,
              isSpacialEqt: false
            });
          } else {
            this.setState({ selected: e });
            this.setState(prevState => ({
              users: [
                ...prevState.users,
                {
                  ContainerName: option.option.ContainerName,
                  ProfileCodeID: option.option.ProfileCodeID,
                  StandardContainerCode: option.option.StandardContainerCode,
                  ContainerQuantity: 0
                }
              ]
            }));
          }
        } else {
        }
      }
    } else {
      this.setState({
        specialEquipment: false,
        isSpacialEqt: true,
        selected: [],
        users: []
      });
    }

    if (this.state.selected !== null) {
      // next
      document.getElementById("equipType").classList.add("equipType");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");

      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  }

  newhandleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = {
      ...users[i],
      [name]: name === "ContainerQuantity" ? parseFloat(value) : 0
    };
    this.setState({ users });
  }

  newremoveClick(i) {
    let users = [...this.state.users];
    if (users[i].ContainerName === "Special Equipment") {
      this.setState({ specialEquipment: false, isSpacialEqt: true });
    }
    users.splice(i, 1);

    let selected = [...this.state.selected];
    selected.splice(i, 1);

    this.setState({ users, selected });
  }
  //// end For Equipment to create element
  togglePuAdd() {
    this.setState(prevState => ({
      modalPuAdd: !prevState.modalPuAdd
    }));
  }

  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
      }
    }
    return city;
  };

  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
          }
        }
      }
    }
    return area;
  };

  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
        }
      }
    }
    return state;
  };

  getZipCode = addressArray => {
    let zipcode = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if ("postal_code" === addressArray[i].types[j]) {
            zipcode = addressArray[i].long_name;
          }
        }
      }
    }
    return zipcode;
  };

  getCountry = addressArray => {
    let country = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if ("country" === addressArray[i].types[j]) {
            country = addressArray[i].long_name;
          }
        }
      }
    }
    return country;
  };

  onPlaceSelected = place => {
    console.log("plc", place);
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      zipcode = this.getZipCode(addressArray),
      country = this.getCountry(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    if (addressArray.length > 4) {
      this.setState({ zoomPOL: 15 });
    } else if (addressArray.length > 2 && addressArray.length <= 4) {
      this.setState({ zoomPOL: 10 });
    } else {
      this.setState({ zoomPOL: 6 });
    }
    this.state.fullAddressPOL.push({
      Area: area,
      City: city,
      State: state,
      ZipCode: zipcode,
      Country: country
    });

    var originGeoCordinates = latValue + "," + lngValue;
    this.setState({
      fullAddressPOL: this.state.fullAddressPOL,
      PickupCity: city,
      OriginGeoCordinates: originGeoCordinates
    });

    this.setState({
      markerPositionPOL: {
        lat: Number(latValue),
        lng: Number(lngValue)
      },
      mapPositionPOL: {
        lat: Number(latValue),
        lng: Number(lngValue)
      }
    });
    this.addressChange("puAdd", address);
  };
  onPlaceSelectedPOD = place => {
    console.log("plc", place);
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      zipcode = this.getZipCode(addressArray),
      country = this.getCountry(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    if (addressArray.length > 4) {
      this.setState({ zoomPOD: 15 });
    } else if (addressArray.length > 2 && addressArray.length <= 4) {
      this.setState({ zoomPOD: 10 });
    } else {
      this.setState({ zoomPOD: 6 });
    }
    var destGeoCordinate = latValue + "," + lngValue;
    this.state.fullAddressPOD.push({
      Area: area,
      City: city,
      State: state,
      ZipCode: zipcode,
      Country: country
    });
    this.setState({
      fullAddressPOD: this.state.fullAddressPOD,
      DeliveryCity: city,
      DestGeoCordinate: destGeoCordinate
    });

    this.setState({
      markerPositionPOD: {
        lat: Number(latValue),
        lng: Number(lngValue)
      },
      mapPositionPOD: {
        lat: Number(latValue),
        lng: Number(lngValue)
      }
    });
    this.addressChange("", address);
  };

  //this Method For ShipmentStages Data Bind
  HandleShipmentStages(type) {
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentStages`,
      data: {
        Mode:
          type == "SEA" ? "O" : type == "AIR" ? "A" : type == "ROAD" ? "I" : ""
      },
      headers: authHeader()
    }).then(function(response) {});
  }
  //this Method for Bind Country Dropdown
  HandleCounterListBind() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchCountryList`,
      headers: authHeader()
    }).then(function(response) {
      var countryData = response.data.Table;
      if (countryData.length > 0) {
        self.setState({ country: countryData });
      }
    });
  }

  HandleBindIncoTeamData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,

      headers: authHeader()
    }).then(function(response) {
      var table1 = response.data.Table1;
      var table2 = response.data.Table2;
      var table4 = response.data.Table4;
      var finalArray = [];
      debugger;
      var standerEquipment = new Object();
      standerEquipment.StandardContainerCode = "Special Equipment";
      standerEquipment.ProfileCodeID = "Special Equipment";
      standerEquipment.ContainerName = "Special Equipment";

      for (let index = 0; index < table1.length; index++) {
        finalArray.push(table1[index]);
      }

      finalArray.push(standerEquipment);

      self.setState({
        StandardContainerCode: finalArray,
        SpacialEqmt: table2,
        currencyData: table4
      });
    });
  }

  HandleTypeofMove(e) {
    var type = e.target.value;
    // debugger;
    if (type === "p2p") {
      this.setState(
        {
          typesofMove: "p2p"
        },
        function() {
          this.setState({ typesofMove: "p2p" });
          this.HandleGetIncoTerms();
        }
      );
    } else if (type === "p2d") {
      this.setState(
        {
          typesofMove: "p2d"
        },
        function() {
          this.setState({ typesofMove: "p2d" });
          this.HandleGetIncoTerms();
        }
      );
    } else if (type === "d2d") {
      this.setState(
        {
          typesofMove: "d2d"
        },
        function() {
          this.setState({ typesofMove: "d2d" });
          this.HandleGetIncoTerms();
        }
      );
    } else if (type === "d2p") {
      this.setState(
        {
          typesofMove: "d2p"
        },
        function() {
          this.setState({ typesofMove: "d2p" });
          this.HandleGetIncoTerms();
        }
      );
    } else {
    }
    debugger;
    // next
    document.getElementById("typeMove").classList.add("typeMove");
    if (document.getElementById("cbmInner") == null) {
      document.getElementById("equipTypeInner").classList.add("equipTypeType");
      document.getElementById("equipType").classList.add("less-padd");
    } else document.getElementById("cbmInner").classList.add("cbmType");

    if (document.getElementById("cbmIconCntr") == null)
      document
        .getElementById("equipTypeIconCntr")
        .classList.add("equipTypeIconCntr");
    else document.getElementById("cbmIconCntr").classList.add("cbmIconCntr");
    // document.getElementById("cbmIconCntr").classList.add("cbmIconCntr");

    if (document.getElementById("cbmName") == null)
      document.getElementById("equipTypeName").classList.remove("d-none");
    else document.getElementById("cbmName").classList.remove("d-none");

    // document.getElementById("cbmName").classList.remove("d-none");

    if (document.getElementById("cbmMinusClick") == null) {
      document.getElementById("equipTypeMinusClick").classList.add("d-none");
      document.getElementById("equipTypePlusClick").classList.remove("d-none");
    } else document.getElementById("cbmMinusClick").classList.add("d-none");

    // document.getElementById("cbmMinusClick").classList.add("d-none");
    // -------------------------------------Comment By Deepak Savani--------------------------
    // if (document.getElementById("cbmInner") == null)
    //   document.getElementById("equipTypePlusClick").classList.remove("d-none");
    // else document.getElementById("cbmPlusClick").classList.remove("d-none");
    // ----------------------------------------------------------------------------------------

    // document.getElementById("cbmPlusClick").classList.remove("d-none");
  }

  //// check cutome clearnce is check()

  HandleCustomeClear(e) {
    let self = this;
    var icheck = e.target.checked;
    self.setState({ Custom_Clearance: !self.state.Custom_Clearance });
    if (icheck === true) {
      self.setState({
        isCustomClear: "Yes"
      });
      setTimeout(function() {
        self.HandleGetIncoTerms();
      }, 100);
    } else {
      self.setState({ isCustomClear: "No" });
      setTimeout(function() {
        self.HandleGetIncoTerms();
      }, 100);
    }
  }

  //this Method For Get Inco Team base on condition.
  HandleGetIncoTerms() {
    let self = this;

    var shipmentType = self.state.shipmentType;
    var typeofMove = self.state.typesofMove;
    var HasCustomClear = self.state.isCustomClear;

    if (shipmentType === "Export" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "DAP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Export" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "DDP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "FOB" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({
          incoTerms: "FOB"
        });
      }
    }
  }
  typeMovePlusClick = e => {
    document.getElementById("typeMoveInner").classList.remove("typeMoveType");
    document.getElementById("typeMove").classList.remove("less-padd");
    document.getElementById("typeMovePlusClick").classList.add("d-none");
    document.getElementById("typeMoveName").classList.add("d-none");
    document.getElementById("typeMoveMinusClick").classList.remove("d-none");
  };
  typeMoveMinusClick = e => {
    document.getElementById("typeMoveInner").classList.add("typeMoveType");
    document.getElementById("typeMove").classList.add("less-padd");
    document.getElementById("typeMovePlusClick").classList.remove("d-none");
    document.getElementById("typeMoveName").classList.remove("d-none");
    document.getElementById("typeMoveMinusClick").classList.add("d-none");
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
    document.getElementById("shipmentType").classList.remove("less-padd");
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
    document.getElementById("shipmentType").classList.add("less-padd");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
  };
  modeofTransportClick(e) {
    let type = e.target.value;

    this.setState({ modeoftransport: type });
    document.getElementById("dvroad").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvair").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvsea").classList.add("new-radio-rate-cntr-hide");
    if (type == "AIR") {
      document
        .getElementById("dvair")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "SEA") {
      this.setState({ containerLoadType: "FCL" });
      document
        .getElementById("dvsea")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "ROAD") {
      document
        .getElementById("dvroad")
        .classList.remove("new-radio-rate-cntr-hide");
    }

    // next
    document.getElementById("modeTransport").classList.add("modeTransport");
    document.getElementById("shipmentType").classList.add("less-padd");
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document
      .getElementById("shipmentTypeIconCntr")
      .classList.add("shipmentTypeIconCntr");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");

    this.HandleShipmentStages(type);
    // this.HandlePOLPODAutosearch(type);
  }
  modeTransPlusClick = e => {
    document.getElementById("modeTransInner").classList.remove("modeTransType");
    document.getElementById("modeTransport").classList.remove("less-padd");
    document.getElementById("modeTransPlusClick").classList.add("d-none");
    document.getElementById("modeTransName").classList.add("d-none");
    document.getElementById("modeTransMinusClick").classList.remove("d-none");
  };
  modeTransMinusClick = e => {
    document.getElementById("modeTransInner").classList.add("modeTransType");
    document.getElementById("modeTransport").classList.add("less-padd");
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
    document.getElementById("modeTransport").classList.add("less-padd");
    document
      .getElementById("modeTransIconCntr")
      .classList.add("modeTransIconCntr");
    document.getElementById("modeTransName").classList.remove("d-none");
    document.getElementById("modeTransMinusClick").classList.add("d-none");
    document.getElementById("modeTransPlusClick").classList.remove("d-none");

    this.HandleBindIncoTeamData();

    //Remove State

    //this.setState({ selected: []});
    if (
      type === "FCL" ||
      type === "LCL" ||
      type === "AIR" ||
      type === "FTL" ||
      type === "LTL"
    ) {
      this.setState({
        typesofMove: "",
        PickupCity: "",
        DeliveryCity: "",
        OriginGeoCordinates: "",
        DestGeoCordinate: "",
        companyId: 0,
        Containerdetails: [],
        PortOfDischargeCode: "",
        PortOfLoadingCode: "",
        Currency: "",
        //-----
        Custom_Clearance: false,
        NonStackable: false,
        HazMat: false,
        multiCBM: [
          {
            PackageType: "",
            Quantity: 0,
            Lengths: 0,
            Width: 0,
            Height: 0,
            GrossWt: 0,
            VolumeWeight: 0,
            Volume: 0
          }
        ],
        users: [],
        referType: [],
        flattack_openTop: [],
        spacEqmtType: [],

        TruckTypeData: [
          {
            TruckID: "",
            TruckName: "",
            Quantity: ""
          }
        ],
        fieldspol: {},
        spacEqmtTypeSelect: false,
        specialEqtSelect: false,
        refertypeSelect: false,
        isTypeofMove: "",
        cmbTypeRadio: "",
        specialEquipment: false,
        equipmentType: "",
        isSpecialEquipment: "0",
        tempratureEquipment: "",
        fields: {},
        poladdress: "",
        polpodData: [],
        polpodDataAdd: [],
        isHazMat: "",
        incoTerms: "",
        POL: "",
        POD: "",
        PUAddress: "",
        PDAddress: "",
        modalPuAdd: false,
        cbmLength: "",
        cbmWidth: "",
        cbmHeight: "",
        cbmQuantity: "1",
        cbmVal: "",
        PODData: [],
        POLData: [],
        puAdd: "",
        deliAdd: "",
        values: [],
        values1: [],
        equQuan: "",
        polCountry: "",
        pol: "",
        podCountry: "",
        pod: "",
        equipDrop: [],
        country: [],
        StandardContainerCode: [],
        multi: true,
        selected: [],
        isSpacialEqt: true,
        SpacialEqmt: [],
        spEqtSelect: [],
        searchTextPOD: "",
        zoomPOL: 0,
        zoomPOD: 0,
        markerPositionPOL: {},
        mapPositionPOL: {},
        markerPositionPOD: {},
        mapPositionPOD: {},
        fullAddressPOL: "",
        fullAddressPOD: "",
        totalQuantity: 0,
        isCustomClear: "No",
        polfullAddData: {},
        podfullAddData: {},
        commodityData: [],
        // packageTypeData: [],
        isSearch: false,
        currencyData: [],
        currencyCode: "",
        testSelection: true
      });
    }
  };
  cntrLoadPlusClick = e => {
    document.getElementById("cntrLoadInner").classList.remove("cntrLoadType");
    document.getElementById("containerLoad").classList.remove("less-padd");
    document.getElementById("cntrLoadPlusClick").classList.add("d-none");
    document.getElementById("cntrLoadName").classList.add("d-none");
    document.getElementById("cntrLoadMinusClick").classList.remove("d-none");
  };
  cntrLoadMinusClick = e => {
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("containerLoad").classList.add("less-padd");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
  };
  cbmChange = e => {
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
      this.state.cbmHeight !== "" &&
      this.state.cbmQuantity !== ""
    ) {
      var decVolumeWeight =
        (this.state.cbmQuantity *
          (this.state.cbmLength * this.state.cbmWidth * this.state.cbmHeight)) /
        6000;

      // var decVolume =
      // this.state.cbmQuantity *
      // ((this.state.cbmLength / 100)(this.state.cbmWidth / 100) *
      //   (this.state.cbmHeight / 100));

      this.setState({ cbmVal: decVolumeWeight });

      // next
      document.getElementById("cbm").classList.add("cbm");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");
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

  locationChange = (e, action) => {
    let type = e.value;
    let nme = action.name;
    if (nme === "polCountry") {
      this.setState({ polCountry: type });
    } else if (nme === "pol") {
      this.setState({ pol: type });
    } else if (nme === "podCountry") {
      this.setState({ podCountry: type });
    } else if (nme === "pod") {
      this.setState({ pod: type });
    }

    if (
      this.state.polCountry !== "" &&
      this.state.pol !== "" &&
      this.state.podCountry !== "" &&
      this.state.pod !== ""
    ) {
      // next
      document.getElementById("location").classList.add("location");
      if (document.getElementById("addressInner") == null) {
        document.getElementById("typeMoveInner").classList.add("typeMoveType");
        document.getElementById("typeMove").classList.add("less-padd");
      } else {
        // document.getElementById("addressInner").classList.add("addressType");
        // document.getElementById("address").classList.add("less-padd");
      }

      if (document.getElementById("addressInner") == null)
        document
          .getElementById("typeMoveIconCntr")
          .classList.add("typeMoveIconCntr");
      else
        document
          .getElementById("addressIconCntr")
          .classList.add("addressIconCntr");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMoveName").classList.remove("d-none");
      else document.getElementById("addressName").classList.remove("d-none");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMoveMinusClick").classList.add("d-none");
      else document.getElementById("addressMinusClick").classList.add("d-none");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMovePlusClick").classList.remove("d-none");
      else
        document.getElementById("addressPlusClick").classList.remove("d-none");
    }
  };
  locationPlusClick = e => {
    document.getElementById("locationInner").classList.remove("locationType");
    document.getElementById("locationPlusClick").classList.add("d-none");
    document.getElementById("locationName").classList.add("d-none");
    document.getElementById("locationMinusClick").classList.remove("d-none");
  };
  locationMinusClick = e => {
    document.getElementById("locationInner").classList.add("locationType");
    document.getElementById("locationPlusClick").classList.remove("d-none");
    document.getElementById("locationName").classList.remove("d-none");
    document.getElementById("locationMinusClick").classList.add("d-none");
  };

  addressChange = (e, values) => {
    let type = values;
    let nme = e;
    if (nme === "puAdd") {
      this.setState({ puAdd: type });
    } else if (nme === "deliAdd") {
      this.setState({ deliAdd: type });
    }

    if (this.state.puAdd !== "" || this.state.deliAdd !== "") {
      // next
      document.getElementById("address").classList.add("address");
      document.getElementById("typeMoveInner").classList.add("typeMoveType");
      document.getElementById("typeMove").classList.add("less-padd");
      document
        .getElementById("typeMoveIconCntr")
        .classList.add("typeMoveIconCntr");
      document.getElementById("typeMoveName").classList.remove("d-none");
      document.getElementById("typeMoveMinusClick").classList.add("d-none");
      document.getElementById("typeMovePlusClick").classList.remove("d-none");
    }

    // next
    document.getElementById("location").classList.add("location");
    // if (document.getElementById("addressInner") == null)
    //   document.getElementById("typeMoveInner").classList.add("typeMoveType");
    // else document.getElementById("addressInner").classList.add("addressType");

    // if (document.getElementById("addressInner") == null)
    //   document
    //     .getElementById("typeMoveIconCntr")
    //     .classList.add("typeMoveIconCntr");
    // else
    //   document
    //     .getElementById("addressIconCntr")
    //     .classList.add("addressIconCntr");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMoveName").classList.remove("d-none");
    else document.getElementById("addressName").classList.remove("d-none");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMoveMinusClick").classList.add("d-none");
    else document.getElementById("addressMinusClick").classList.add("d-none");

    if (document.getElementById("addressInner") == null)
      document.getElementById("typeMovePlusClick").classList.remove("d-none");
    else document.getElementById("addressPlusClick").classList.remove("d-none");
  };
  addressPlusClick = e => {
    // document.getElementById("addressInner").classList.remove("addressType");
    document.getElementById("address").classList.remove("less-padd");
    // document.getElementById("addressPlusClick").classList.add("d-none");
    document.getElementById("addressName").classList.add("d-none");
    // document.getElementById("addressMinusClick").classList.remove("d-none");
  };
  addressMinusClick = e => {
    // document.getElementById("addressInner").classList.add("addressType");
    document.getElementById("address").classList.add("less-padd");
    // document.getElementById("addressPlusClick").classList.remove("d-none");
    document.getElementById("addressName").classList.remove("d-none");
    // document.getElementById("addressMinusClick").classList.add("d-none");
  };

  quantityChange = e => {
    let type = e.target.value;
    this.setState({ equQuan: type });

    if (this.state.equQuan !== "") {
      // next
      document.getElementById("equipType").classList.add("equipType");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");
      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };
  equipTypePlusClick = e => {
    document.getElementById("equipTypeInner").classList.remove("equipTypeType");
    document.getElementById("equipTypePlusClick").classList.add("d-none");
    document.getElementById("equipType").classList.remove("less-padd");
    document.getElementById("equipTypeName").classList.add("d-none");
    document.getElementById("equipTypeMinusClick").classList.remove("d-none");
  };
  equipTypeMinusClick = e => {
    document.getElementById("equipTypeInner").classList.add("equipTypeType");
    document.getElementById("equipTypePlusClick").classList.remove("d-none");
    document.getElementById("equipType").classList.add("less-padd");
    document.getElementById("equipTypeName").classList.remove("d-none");
    document.getElementById("equipTypeMinusClick").classList.add("d-none");
  };

  equipChange = (value, option) => {
    if (value.length > 0) {
      let iCount = value.length;

      let difference = this.state.selected.filter(x => !value.includes(x));
      if (difference.length > 0) {
        this.setState({ selected: value });

        if (difference[0].StandardContainerCode == "Special Equipment") {
          this.setState({ isSpacialEqt: true });
          var elmnt1 = document.getElementsByName("spequType");
          var elemnt1Len = elmnt1.length;
          for (let index = 0; index < elemnt1Len; index++) {
            if (elmnt1 != null && elmnt1 != "undefined") {
              elmnt1[0].remove();
              this.setState({
                spEqtSelect: []
              });
            }
          }
        }

        var elmnt = document.getElementById(
          difference[0].StandardContainerCode
        );
        if (elmnt != null && elmnt != "undefined") {
          elmnt.remove();
        }
      } else {
        this.setState({ selected: value });
        let dropVal =
          iCount == 1
            ? value[0].StandardContainerCode
            : value[iCount - 1].StandardContainerCode;
        if (dropVal == "Special Equipment") {
          this.setState({ isSpacialEqt: false });
        }
        let div = document.createElement("div");
        let clas = document.createAttribute("class");
        clas.value = "spec-inner-cntr";
        div.setAttributeNode(clas);

        let name = document.createAttribute("name");
        name.value = "equType";
        div.setAttributeNode(name);

        let ids = document.createAttribute("id");
        ids.value =
          iCount == 1
            ? value[0].StandardContainerCode
            : value[iCount - 1].StandardContainerCode;
        div.setAttributeNode(ids);

        let cont = document.createElement("p");
        cont.innerHTML = dropVal;
        let into = document.createElement("b");
        into.innerHTML = "X";

        let inpNum = document.createElement("input");
        let typ = document.createAttribute("type");
        typ.value = "number";

        let nameEqt = document.createAttribute("name");
        nameEqt.value =
          iCount == 1
            ? value[0].StandardContainerCode
            : value[iCount - 1].StandardContainerCode;
        inpNum.setAttributeNode(nameEqt);

        inpNum.setAttributeNode(typ);
        inpNum.value = 1;

        let cross = document.createElement("i");
        let crsCls = document.createAttribute("class");
        crsCls.value = "fa fa-times";
        cross.setAttributeNode(crsCls);
        div.appendChild(cont);
        div.appendChild(into);
        div.appendChild(inpNum);
        div.appendChild(cross);
        document.getElementById("equipAppend").appendChild(div);
      }
    } else {
      var elmnt = document.getElementsByName("equType");
      var elmntlen = elmnt.length;

      for (let index = 0; index < elmntlen; index++) {
        if (elmnt != null && elmnt != "undefined") {
          elmnt[0].remove();
          this.setState({
            selected: [],
            isSpacialEqt: true
          });
        }
      }

      var lastSelectVal = this.state.selected[0];
      if (lastSelectVal.StandardContainerCode == "Special Equipment") {
        this.setState({ selected: [] });
      }
      var elmnt1 = document.getElementsByName("spequType");
      var elmnt1Len = elmnt1.length;
      for (let index = 0; index < elmnt1Len; index++) {
        if (elmnt1 != null && elmnt1 != "undefined") {
          elmnt1[0].remove();
          this.setState({ spEqtSelect: [] });
        }
      }

      this.setState({ selected: [] });
    }

    let type = option.value;
    this.setState({ equQuan: type });

    if (this.state.equQuan !== "") {
      // next
      document.getElementById("equipType").classList.add("equipType");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");

      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };

  specEquipChange = (value, option) => {
    // let difference = this.state.referType.filter(x => !value.includes(x));
    // let difference1 = this.state.flattack_openTop.filter(
    //   x => !value.includes(x)
    // );

    // // let difference2 = this.state.spacEqmtType.filter(x => !value.includes(x));
    // let difference2 = this.state.spacEqmtType.filter(
    //   vendor => vendor.TypeName === value[0].SpecialContainerCode
    // );

    var difference = false;
    for (var i = 0; i < this.state.referType.length; i++) {
      if (
        this.state.referType[i].referTypeName === value[0].SpecialContainerCode
      ) {
        difference = true;
        break;
      }
    }

    var difference1 = false;
    for (var i = 0; i < this.state.flattack_openTop.length; i++) {
      if (
        this.state.flattack_openTop[i].SpecialContainerCode ===
        value[0].SpecialContainerCode
      ) {
        difference1 = true;
        break;
      }
    }

    var difference2 = false;
    for (var i = 0; i < this.state.spacEqmtType.length; i++) {
      if (
        this.state.spacEqmtType[i].TypeName === value[0].SpecialContainerCode
      ) {
        difference2 = true;
        break;
      }
    }

    if (option.option.IsVolumeRequired === 1) {
      if (difference1 === false) {
        this.setState({
          specialEqtSelect: true
        });
        this.addClickMultiCBM(value);
      }
    }
    if (option.option.IsTemperatureRequired === 1) {
      if (difference === false) {
        this.setState({
          refertypeSelect: true
        });
        this.addClickSpecial(value);
      }
    }

    if (
      option.option.IsTemperatureRequired === 0 &&
      option.option.IsVolumeRequired === 0
    ) {
      if (difference2 === false) {
        this.setState({
          spacEqmtTypeSelect: true
        });

        this.addSpacEqmtType(value);
      }
    }

    // if (value1 != null && value1 != "") {
    //   let iCount = value1.length;
    //   let difference = this.state.spEqtSelect.filter(x => !value1.includes(x));

    //   if (difference.length > 0) {
    //     this.setState({ spEqtSelect: value1 });
    //     var elmnt = document.getElementById(difference[0].SpecialContainerCode);
    //     if (elmnt != null && elmnt != "undefined") {
    //       elmnt.remove();
    //     }
    //   } else {
    //     this.setState({ spEqtSelect: value1 });
    //     i++;

    //     let dropVal =
    //       iCount == 1
    //         ? value1[0].SpecialContainerCode
    //         : value1[iCount - 1].SpecialContainerCode;
    //     let div = document.createElement("div");
    //     let clas = document.createAttribute("class");
    //     clas.value = "spec-inner-cntr";
    //     div.setAttributeNode(clas);

    //     let ids = document.createAttribute("id");
    //     ids.value =
    //       iCount == 1
    //         ? value1[0].SpecialContainerCode
    //         : value1[iCount - 1].SpecialContainerCode;
    //     div.setAttributeNode(ids);

    //     let name = document.createAttribute("name");
    //     name.value = "spequType";
    //     div.setAttributeNode(name);

    //     let cont = document.createElement("p");
    //     cont.innerHTML = dropVal;
    //     let into = document.createElement("b");
    //     into.innerHTML = "X";

    //     // let quan = document.createElement("span");
    //     // quan.innerHTML = "Quan :";
    //     let inpNum = document.createElement("input");
    //     let typ = document.createAttribute("type");
    //     typ.value = "number";
    //     inpNum.setAttributeNode(typ);
    //     inpNum.value = 1;

    //     let temp = document.createElement("span");
    //     let tempClas = document.createAttribute("class");
    //     tempClas.value = "temp-mar";
    //     temp.setAttributeNode(tempClas);
    //     temp.innerHTML = "Temp :";
    //     let inpTemp = document.createElement("input");
    //     let typTemp = document.createAttribute("type");
    //     typTemp.value = "number";
    //     inpTemp.setAttributeNode(typTemp);
    //     inpTemp.value = 1;
    //     let faren = document.createElement("span");
    //     faren.innerHTML = "F";

    //     let divFC = document.createElement("div");
    //     let clasFC = document.createAttribute("class");
    //     clasFC.value = "new-radio-rate-cntr fc-radio";
    //     divFC.setAttributeNode(clasFC);
    //     let divF = document.createElement("div");
    //     let inputF = document.createElement("input");
    //     let typeF = document.createAttribute("type");
    //     typeF.value = "radio";
    //     inputF.setAttributeNode(typeF);
    //     let nameF = document.createAttribute("name");
    //     nameF.value = "fc" + i;
    //     inputF.setAttributeNode(nameF);
    //     let idF = document.createAttribute("id");
    //     idF.value = "f" + i;
    //     inputF.setAttributeNode(idF);
    //     let labelF = document.createElement("label");
    //     let forF = document.createAttribute("for");
    //     forF.value = "f" + i;
    //     labelF.innerHTML = "F";
    //     labelF.setAttributeNode(forF);
    //     divF.appendChild(inputF);
    //     divF.appendChild(labelF);
    //     divFC.appendChild(divF);
    //     let divC = document.createElement("div");
    //     let inputC = document.createElement("input");
    //     let typeC = document.createAttribute("type");
    //     typeC.value = "radio";
    //     inputC.setAttributeNode(typeC);
    //     let nameC = document.createAttribute("name");
    //     nameC.value = "fc" + i;
    //     inputC.setAttributeNode(nameC);
    //     let idC = document.createAttribute("id");
    //     idC.value = "c" + i;
    //     inputC.setAttributeNode(idC);
    //     let labelC = document.createElement("label");
    //     let forC = document.createAttribute("for");
    //     forC.value = "c" + i;
    //     labelC.innerHTML = "C";
    //     labelC.setAttributeNode(forC);
    //     divC.appendChild(inputC);
    //     divC.appendChild(labelC);
    //     divFC.appendChild(divC);

    //     let cross = document.createElement("i");
    //     let crsCls = document.createAttribute("class");
    //     crsCls.value = "fa fa-times";
    //     cross.setAttributeNode(crsCls);

    //     div.appendChild(cont);
    //     div.appendChild(into);
    //     // div.appendChild(quan);
    //     div.appendChild(inpNum);
    //     div.appendChild(temp);
    //     div.appendChild(inpTemp);
    //     div.appendChild(divFC); // faren
    //     div.appendChild(cross);
    //     document.getElementById("specEquipAppend").appendChild(div);
    //   }
    // } else {
    //   var elmnt = document.getElementsByName("spequType");
    //   if (elmnt != null && elmnt != "undefined") {
    //     elmnt[0].remove();
    //   }
    //   this.setState({ spEqtSelect: [] });
    // }

    //
  };

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, ""]
    }));
  }

  createUI() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];

    return this.state.values.map((el, index) => {
      return (
        <div className="equip-plus-cntr">
          <Select
            className="rate-dropdown"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={this.equipChange}
          />
          <div className="spe-equ">
            <input type="text" placeholder="Quantity" />
          </div>
          <i
            className="fa fa-minus equip-plus"
            id={"remove" + (index + 1)}
            onClick={this.removeClick.bind(this, index)}
          ></i>
        </div>
      );
    });
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }
  // removeClickSpecial(i) {
  //
  //   let values1 = [...this.state.values1];
  //   values1.splice(i, 1);
  //   this.setState({ values1 });
  // }

  render() {
    console.log(this.state.typesofMove, "--------------state--------------");
    let self = this;

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
    let unStack = "";
    if (
      this.state.containerLoadType === "ltl" ||
      this.state.containerLoadType === "lcl" ||
      this.state.containerLoadType === "air"
    ) {
      unStack = (
        <>
          <input id="unstack" type="checkbox" name={"haz-mat"} />
          <label htmlFor="unstack">Unstackable</label>
        </>
      );
    }

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt rate-bg">
            <div className="">
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
                  {this.state.shipmentType !== "Domestic" ? (
                    <>
                      <div>
                        <input
                          type="radio"
                          name="mode-transport"
                          value="SEA"
                          onClick={this.modeofTransportClick.bind(this)}
                          id="sea"
                        />
                        <label htmlFor="sea">Sea</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="mode-transport"
                          value="AIR"
                          onClick={this.modeofTransportClick.bind(this)}
                          id="air"
                        />
                        <label htmlFor="air">Air</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="mode-transport"
                          name="mode-transport"
                          value="ROAD"
                          onClick={this.modeofTransportClick.bind(this)}
                          id="road"
                        />
                        <label htmlFor="road">Road</label>
                      </div>
                    </>
                  ) : (
                    <div>
                      <input
                        type="radio"
                        name="mode-transport"
                        name="mode-transport"
                        value="ROAD"
                        onClick={this.modeofTransportClick.bind(this)}
                        id="road"
                      />
                      <label htmlFor="road">Road</label>
                    </div>
                  )}
                </div>
              </div>
              <div className="new-rate-cntr" id="containerLoad">
                <div className="rate-title-cntr">
                  <h3>Cargo Load</h3>
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
                        value="FCL"
                        onClick={this.ContainerLoadTypeClick}
                        id="fcl"
                      />
                      <label htmlFor="fcl">FCL</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="LCL"
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
                        value="AIR"
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
                        value="FTL"
                        onClick={this.ContainerLoadTypeClick}
                        id="ftl"
                      />
                      <label htmlFor="ftl">FTL</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="LTL"
                        onClick={this.ContainerLoadTypeClick}
                        name="cntr-load-road"
                        id="ltl"
                      />
                      <label htmlFor="ltl">LTL</label>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.containerLoadType !== "FCL" ? (
                <>
                  <div className="new-rate-cntr" id="cbm">
                    <div className="rate-title-cntr">
                      <h3>
                        {this.state.containerLoadType !== "LCL"
                          ? "Dimensions"
                          : "CBM"}
                      </h3>
                      <div className="iconSelection" id="cbmIconCntr">
                        <p className="side-selection" id="cbmName">
                          {/* {this.state.modeoftransport} */}
                        </p>
                        <i
                          className="fa fa-plus"
                          id="cbmPlusClick"
                          onClick={this.cbmPlusClick}
                        ></i>
                        <i
                          className="fa fa-minus d-none"
                          id="cbmMinusClick"
                          onClick={this.cbmMinusClick}
                        ></i>
                      </div>
                    </div>
                    <div>
                      <div className="rate-radio-cntr justify-content-center">
                        <div>
                          <input
                            type="radio"
                            name="cmbTypeRadio"
                            id="exist-cust"
                            value="ALL"
                            // onChange={
                            //   this.state.containerLoadType !== "FTL"
                            //     ? this.cmbTypeRadioChange.bind(this)
                            //     : null
                            // }
                            onChange={this.cmbTypeRadioChange.bind(this)}
                          />
                          <label
                            className="d-flex flex-column align-items-center"
                            htmlFor="exist-cust"
                          >
                            ALL
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="cmbTypeRadio"
                            id="new-cust"
                            value="CBM"
                            onChange={this.cmbTypeRadioChange.bind(this)}
                          />
                          <label
                            className="d-flex flex-column align-items-center"
                            htmlFor="new-cust"
                          >
                            {this.state.containerLoadType === "AIR"
                              ? "Chargable Weight"
                              : "CBM"}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div id="cbmInner">
                      <div className="">
                      {this.state.cmbTypeRadio === "ALL" ? (
                        <>
                          {this.state.containerLoadType === "FTL"
                            ? this.createUITruckType()
                            : this.CreateMultiCBM()}
                        </>
                        ) : this.state.cmbTypeRadio === "CBM" ? (
                          <div className="col-md-4 m-auto">
                            <div className="spe-equ">
                              <input
                                type="text"
                                onChange={this.HandleCMBtextChange.bind(this)}
                                placeholder={
                                  this.state.modeoftransport != "AIR"
                                    ? "CBM"
                                    : "KG"
                                }
                                className="w-100"
                                value={this.state.cbmVal}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="remember-forgot flex-column rate-checkbox justify-content-center">
                        <input
                          id="HazMat"
                          type="checkbox"
                          name="HazMat"
                          onChange={this.toggleHazMat.bind(this)}
                          checked={this.state.HazMat}
                        />
                        <label htmlFor="HazMat">HazMat</label>
                        {this.state.containerLoadType === "LCL" ||
                        this.state.containerLoadType === "AIR" ||
                        this.state.containerLoadType === "LTL" ? (
                          <>
                            <input
                              id="unstack"
                              type="checkbox"
                              name="NonStackable"
                              onChange={this.toggleNonStackable.bind(this)}
                              checked={this.state.NonStackable}
                            />
                            <label htmlFor="unstack">NonStackable</label>
                          </>
                        ) : null}

                        {unStack}
                        <input
                          id="cust-clear"
                          type="checkbox"
                          name="Custom_Clearance"
                          onChange={this.HandleCustomeClear.bind(this)}
                          checked={this.state.Custom_Clearance}
                        />
                        <label htmlFor="cust-clear">Custom Clearance</label>
                      </div>
                      {/* <div className="spe-equ justify-content-center">
                        <label>Inco Terms :</label>
                        <input
                          type="text"
                          placeholder="Inco Terms"
                          className="w-25"
                          disabled
                          name="incoTerms"
                          value={self.state.incoTerms}
                        />
                      </div> */}
                    </div>
                  </div>
                </>
              ) : null}

              {this.state.containerLoadType == "FCL" ? (
                <div className="new-rate-cntr" id="equipType">
                  <div className="rate-title-cntr">
                    <h3>Equipment Types</h3>
                    <div className="iconSelection" id="equipTypeIconCntr">
                      <p className="side-selection" id="equipTypeName">
                        {/* {this.state.modeoftransport} */}
                      </p>
                      <i
                        className="fa fa-plus"
                        id="equipTypePlusClick"
                        onClick={this.equipTypePlusClick}
                      ></i>
                      <i
                        className="fa fa-minus d-none"
                        id="equipTypeMinusClick"
                        onClick={this.equipTypeMinusClick}
                      ></i>
                    </div>
                  </div>
                  <div id="equipTypeInner">
                    <div className="equip-plus-cntr mt-0">
                      <Select
                        className="rate-dropdown"
                        getOptionLabel={option => option.StandardContainerCode}
                        getOptionValue={option => option.StandardContainerCode}
                        isMulti
                        options={self.state.StandardContainerCode}
                        // onChange={this.equipChange.bind(this)}
                        onChange={this.newaddClick.bind(this)}
                        value={self.state.selected}
                        showNewOptionAtTop={false}
                      />

                      {/* <div className="spe-equ">
                      <input
                        type="text"
                        onChange={this.quantityChange}
                        placeholder="Quantity"
                      />
                    </div> */}
                      {/* <i
                      className="fa fa-plus equip-plus"
                      onClick={this.addClick.bind(this)}
                    ></i> */}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      {this.NewcreateUI()}
                    </div>
                    <div id="equipAppend"></div>

                    {self.state.specialEquipment === true ? (
                      <div className="spe-equ mt-0">
                        <div className="equip-plus-cntr">
                          <Select
                            isDisabled={self.state.isSpacialEqt}
                            className="rate-dropdown"
                            getOptionLabel={option =>
                              option.SpecialContainerCode
                            }
                            isMulti
                            getOptionValue={option =>
                              option.SpecialContainerCode
                            }
                            components={animatedComponents}
                            options={self.state.SpacialEqmt}
                            placeholder="Select Kind of Special Equipment"
                            onChange={this.specEquipChange}
                            value={self.state.spEqtSelect}
                            showNewOptionAtTop={false}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div>
                      {/*  id="cbmInner" */}
                      {self.state.specialEquipment === true &&
                      self.state.specialEqtSelect === true ? (
                        self.state.flattack_openTop.length > 0 ? (
                          <>{this.MultiCreateCBM()}</>
                        ) : null
                      ) : null}
                      <div id="specEquipAppend"></div>
                      {self.state.specialEquipment === true &&
                      self.state.refertypeSelect === true ? (
                        self.state.referType.length > 0 ? (
                          <>{this.createUISpecial()}</>
                        ) : null
                      ) : null}
                      {self.state.specialEquipment === true &&
                      self.state.spacEqmtTypeSelect === true ? (
                        self.state.spacEqmtType.length > 0 ? (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              {this.createUIspacEqmtType()}
                            </div>
                          </>
                        ) : null
                      ) : null}
                    </div>
                    <div className="remember-forgot flex-column rate-checkbox justify-content-center">
                      <input
                        id="haz-mat"
                        type="checkbox"
                        name="HazMat"
                        checked={this.state.HazMat}
                        onChange={this.toggleHazMat.bind(this)}
                      />
                      <label htmlFor="haz-mat">HazMat</label>
                      {/* <input id="unstack" type="checkbox" name={"haz-mat"} />
                      <label htmlFor="unstack">Unstackable</label> */}
                      {this.unStack}
                      <input
                        id="cust-clear"
                        type="checkbox"
                        name={"haz-mat"}
                        onChange={this.HandleCustomeClear.bind(this)}
                      />
                      <label htmlFor="cust-clear">Custom Clearance</label>
                    </div>
                    {/* <div className="spe-equ justify-content-center">
                      <label>Inco Terms :</label>
                      <input
                        type="text"
                        placeholder="Inco Terms"
                        className="w-25"
                        disabled
                        name="incoTerms"
                        value={self.state.incoTerms}
                      />
                    </div> */}
                  </div>
                </div>
              ) : null}
              <div className="new-rate-cntr" id="typeMove">
                <div className="rate-title-cntr">
                  <h3>Type of Move</h3>
                  <div className="iconSelection" id="typeMoveIconCntr">
                    <p className="side-selection" id="typeMoveName">
                      {this.state.typesofMove}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="typeMovePlusClick"
                      onClick={this.typeMovePlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="typeMoveMinusClick"
                      onClick={this.typeMoveMinusClick}
                    ></i>
                  </div>
                </div>
                <div id="typeMoveInner">
                  <div className="new-radio-rate-cntr radio-blue">
                  {/* <div style={{display:"none"}}>
                      <input
                        type="radio"
                        name="type-move"
                        id="testId"
                        value={"test"}
                        checked={this.state.testSelection}
                      />
                      <label htmlFor="testId">Test</label>
                    </div> */}
                    {this.state.containerLoadType === "LCL" ||
                    this.state.containerLoadType === "AIR" ||
                    this.state.containerLoadType === "FCL" ? (
                      <>
                      
                        <div>
                          <input
                            type="radio"
                            name="type-move"
                            id="p2p"
                            value={"p2p"}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="p2p">Port2Port</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="type-move"
                            id="d2p"
                            value={"d2p"}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="d2p">Door2Port</label>
                        </div>
                      </>
                    ) : null}
                    <div>
                      <input
                        type="radio"
                        name="type-move"
                        id="d2d"
                        value={"d2d"}
                        onChange={this.HandleTypeofMove}
                      />
                      <label htmlFor="d2d">Door2Door</label>
                    </div>
                    {this.state.containerLoadType === "LCL" ||
                    this.state.containerLoadType === "AIR" ||
                    this.state.containerLoadType === "FCL" ? (
                      <>
                        <div>
                          <input
                            type="radio"
                            name="type-move"
                            id="p2d"
                            value={"p2d"}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="p2d">Port2Door</label>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="spe-equ justify-content-center">
                    <label>Inco Terms :</label>
                    <input
                      type="text"
                      placeholder="Inco Terms"
                      className="w-25"
                      disabled
                      name="incoTerms"
                      value={self.state.incoTerms}
                    />
                  </div>
                </div>
              </div>

              <div className="new-rate-cntr" id="address">
                <div className="rate-title-cntr">
                  <h3>Enter Addresses</h3>
                  <div className="iconSelection" id="addressIconCntr">
                    <p className="side-selection" id="addressName">
                      {/* {this.state.typesofMove} */}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="addressPlusClick"
                      onClick={this.addressPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="addressMinusClick"
                      onClick={this.addressMinusClick}
                    ></i>
                  </div>
                </div>
                <div className="row justify-content-center" id="addressInner">
                  <div className="col-md-6">
                    <div className="spe-equ address-full">
                      {this.state.typesofMove == "p2p" ||
                      this.state.typesofMove === "p2d" ? (
                        <ReactAutocomplete
                          getItemValue={item => item.OceanPortLongName}
                          items={this.state.polpodData}
                          renderItem={(item, isHighlighted) => (
                            <div
                              style={{
                                background: isHighlighted
                                  ? "lightgray"
                                  : "white"
                              }}
                              value={item.AirPortID}
                            >
                              {item.OceanPortLongName}
                            </div>
                          )}
                          renderInput={function(props) {
                            return (
                              <input
                                placeholder="Enter POL"
                                className="w-100 sticky-dropdown"
                                type="text"
                                {...props}
                              />
                            );
                          }}
                          onChange={this.HandlePOLPODAutosearch.bind(
                            this,
                            "pol"
                          )}
                          //menuStyle={this.state.menuStyle}
                          onSelect={this.HandleAddressDropdownPolSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "pol"
                          )}
                          value={this.state.fields["pol"]}
                        />
                      ) : (
                        <Map1WithAMakredInfoWindowSearchBooks
                          onPlaceSelected={this.onPlaceSelected}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div />}
                          containerElement={<div />}
                          mapElement={<div />}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="spe-equ address-full">
                      {this.state.typesofMove === "p2p" ||
                      this.state.typesofMove === "d2p" ? (
                        <ReactAutocomplete
                          getItemValue={item => item.OceanPortLongName}
                          items={this.state.polpodDataAdd}
                          renderItem={(item, isHighlighted) => (
                            <div
                              style={{
                                background: isHighlighted
                                  ? "lightgray"
                                  : "white"
                              }}
                              value={item.AirPortID}
                            >
                              {item.OceanPortLongName}
                            </div>
                          )}
                          renderInput={function(props) {
                            return (
                              <input
                                placeholder="Enter POD"
                                className="w-100 sticky-dropdown"
                                type="text"
                                {...props}
                              />
                            );
                          }}
                          onChange={this.HandlePOLPODAutosearch.bind(
                            this,
                            "pod"
                          )}
                          //menuStyle={this.state.menuStyle}
                          onSelect={this.HandleAddressDropdownPolSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "pod"
                          )}
                          value={this.state.fields["pod"]}
                        />
                      ) : (
                        <GoogleMapPODSearchBox
                          onPlaceSelected={this.onPlaceSelectedPOD}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div />}
                          containerElement={<div />}
                          mapElement={<div />}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="new-rate-cntr" id="location">
                <div className="rate-title-cntr">
                  <h3 className="mb-3">Select Location</h3>
                  <div className="iconSelection" id="locationIconCntr">
                    <p className="side-selection" id="locationName">
                      {/* {this.state.typesofMove} */}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="locationPlusClick"
                      onClick={this.locationPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="locationMinusClick"
                      onClick={this.locationMinusClick}
                    ></i>
                  </div>
                </div>
                <div className="row polpodcls" id="locationInner">
                  <div className="col-md-6 ">
                    {this.state.zoomPOL !== "" &&
                    this.state.zomePOL !== null ? (
                      <>
                        <Map1WithAMakredInfoWindow
                          zomePOL={this.state.zoomPOL}
                          mapPositionPOL={this.state.mapPositionPOL}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={
                            <div style={{ height: `200px` /*width: `50%`*/ }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                        />
                      </>
                    ) : null}
                  </div>
                  <div className="col-md-6">
                    {this.state.zoomPOD !== "" &&
                    this.state.zomePOD !== null ? (
                      <Map2WithAMakredInfoWindow
                        zomePOL={this.state.zoomPOD}
                        mapPositionPOD={this.state.markerPositionPOD}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={
                          <div style={{ height: `200px` /*width: `50%`*/ }} />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                      />
                    ) : (
                      alert(1)
                    )}
                  </div>
                </div>
              </div>
              <div className="new-rate-cntr border-0">
                <Select
                  className="rate-dropdown mt-0"
                  closeMenuOnSelect={true}
                  getOptionLabel={option => option.BaseCurrencyName}
                  getOptionValue={option => option.CurrencyCode}
                  // components={animatedComponents}
                  options={this.state.currencyData}
                  onChange={this.HandleCurrencyChange.bind(this)}
                />
                {this.state.showCurr && (
                  <p
                    style={{
                      color: "red",
                      textAlign: "center",
                      marginTop: "5px"
                    }}
                  >
                    Enter Value
                  </p>
                )}
                <div className="text-center">
                  <button
                    onClick={this.HandleSearchButton.bind(this)}
                    className="butn blue-butn rate-search mb-0"
                  >
                    Search
                  </button>
                </div>
              </div>
              {/* <div className="text-center new-rate-cntr p-0 border-0">
                <a href="rate-table" className="butn blue-butn rate-search">
                  Search
                </a>
              </div> */}
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
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <textarea className="rate-address"></textarea>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Country</p>
                <div className="spe-equ d-block m-0 flex-grow-1 login-fields">
                  <select>
                    <option>bkj</option>
                    <option>bkj</option>
                    <option>bkj</option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Consignee Name</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
                </div>
              </div>

              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Notification Person</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Email Id</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
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

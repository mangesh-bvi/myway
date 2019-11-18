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
import { Link } from "react-router-dom";
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
  <GoogleMap defaultZoom={8} defaultCenter={props.markerPOLData}>
    <Marker position={props.markerPOLData} icon={GreenIcon}></Marker>
  </GoogleMap>
));
const PODMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={props.markerPODData}>
    <Marker position={props.markerPODData} icon={RedIcon}></Marker>
  </GoogleMap>
));

class RateTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      typeofMove: "",
      HazMat: false,
      NonStackable: false,
      Custom_Clearance: false,

      modalEdit: false,
      modalQuant: false,
      value: 50,
      RateDetails: [],
      values: [],
      RateSubDetails: [],
      checkSelection: [],
      polLatLng: {},
      podmapData: {},
      cSelectedRow: {},
      selectedDataRow: [],
      selectAll: 0,
      selectaddress: "",
      EquipmentType: [],
      SpacialEqmt: [],
      selected: [],
      users: [],
      spacEqmtType: [],
      referType:[],
      flattack_openTop:[],
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      refertypeSelect: false,

    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleQuant = this.toggleQuant.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.checkSelection = this.checkSelection.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    debugger;
    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state !== null) {
        var isSearch = this.props.location.state.isSearch;
        if (isSearch) {
          var paramData = this.props.location.state;
          // var modeofTransport = this.props.location.state.containerLoadType;
          this.HandleRateDetailsFCL(paramData);

           
        }
      }
    } else {
      this.props.history.push("rate-search");
    }
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

  handleCheck() {
    debugger;
    // this.props.history.push({
    //   pathname: "rate-finalizing",
    //   //state: { rateDetail: this.state.RateDetails }
    // });
  }

  toggleRow(rateID, rowData) {
    debugger;

    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[rateID] = !this.state.cSelectedRow[rateID];
    this.setState({
      cSelectedRow: rateID ? newSelected : false
    });
    var selectedRow = [];

    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData._original);
      this.setState({
        selectedDataRow: selectedRow
      });
    } else {
      if (newSelected[rateID] === true) {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].rateID === rowData._original.rateID
          ) {
            selectedRow.splice(i, 1);

            break;
          } else {
            selectedRow = this.state.selectedDataRow;
            selectedRow.push(rowData._original);
            break;
          }
        }
      } else {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].rateID === rowData._original.rateID
          ) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.splice(i, 1);
            break;
          }
        }
      }
    }
    this.setState({
      selectedDataRow: selectedRow
    });
  }

  checkSelection(evt, row) {
    console.log(row.index);
    let tempRate = this.state.RateDetails;
    tempRate[row.index].checkbx = evt.target.checked;
    this.setState({ RateDetails: tempRate });
    console.log(this.state.RateDetails[row.index]);
  }

  HandleRateDetailsFCL(paramData) {
    var dataParameter = {};
    if (paramData.isSearch) {
      debugger;
      var rTypeofMove =
        paramData.typesofMove === "p2p"
          ? 1
          : paramData.typesofMove === "d2p"
          ? 2
          : paramData.typesofMove === "d2d"
          ? 4
          : paramData.typesofMove === "p2d"
          ? 3
          : 0;

      var rModeofTransport =
        paramData.modeoftransport === "SEA"
          ? "Ocean"
          : paramData.modeoftransport === "AIR"
          ? "Air"
          : paramData.modeoftransport === "ROAD"
          ? "inland"
          : "";
      var polAddress = paramData.polfullAddData;
      var podAddress = paramData.podfullAddData;
      var rateQueryDim = [];
      var containerdetails = paramData.users;
      debugger;
      var polLatLng = new Object();
      var podLatLng = new Object();

      var polmapData = polAddress.GeoCoordinate;
      polLatLng.lat = Number(polmapData.split(",")[0]);
      polLatLng.lng = Number(polmapData.split(",")[1]);
      var podmapData = podAddress.GeoCoordinate;
      podLatLng.lat = Number(podmapData.split(",")[0]);
      podLatLng.lng = Number(podmapData.split(",")[1]);

      this.setState({
        polLatLng: polLatLng,
        podmapData: podLatLng,
        users: paramData.users,
        selected: paramData.selected
      });
      var selectedPOLPOD = paramData.fields.pol + " , " + paramData.fields.pod;

      dataParameter = {
        QuoteType: paramData.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: paramData.shipmentType,
        TypeOfMove: rTypeofMove,

        PortOfDischargeCode:
          podAddress.UNECECode !== "" ? podAddress.UNECECode : "",
        PortOfLoadingCode:
          polAddress.UNECECode !== "" ? polAddress.UNECECode : "",
        Containerdetails: containerdetails,
        OriginGeoCordinates:
          polAddress.GeoCoordinate !== "" ? polAddress.GeoCoordinate : "",
        DestGeoCordinate:
          podAddress.GeoCoordinate !== "" ? podAddress.GeoCoordinate : "",
        PickupCity:
          polAddress.NameWoDiacritics !== "" ? polAddress.NameWoDiacritics : "",
        DeliveryCity:
          podAddress.NameWoDiacritics !== "" ? podAddress.NameWoDiacritics : "",
        Currency: paramData.currencyCode,
        ChargeableWeight: 0,
        RateQueryDim: paramData.multiCBM
      };

      this.setState({
        shipmentType: paramData.shipmentType,
        modeoftransport: paramData.modeoftransport,
        containerLoadType: paramData.containerLoadType,
        typeofMove: rTypeofMove,
        selectaddress: selectedPOLPOD,
        HazMat: paramData.HazMat,
        NonStackable: paramData.NonStackable,
        Custom_Clearance: paramData.Custom_Clearance,
        SpacialEqmt: paramData.SpacialEqmt,
        EquipmentType: paramData.StandardContainerCode,
        spacEqmtType:paramData.spacEqmtType,
        referType:paramData.referType,
        flattack_openTop:paramData.flattack_openTop,
        spacEqmtTypeSelect: paramData.spacEqmtTypeSelect,
        specialEqtSelect: paramData.specialEqtSelect,
        refertypeSelect: paramData.refertypeSelect,

        
      });
    }

    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: dataParameter,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response);
      var ratetable = response.data.Table;
      var ratetable1 = response.data.Table1;
      if (ratetable != null) {
        self.setState({
          RateDetails: ratetable
        });
      }
      if (ratetable1 != null) {
        self.setState({
          RateSubDetails: ratetable1
        });
      }
    });
  }

  

  HandleDocumentView(evt, row) {
    debugger;
    var rowDataAry = [];
    var rowDataObj = row.original;
    rowDataAry.push(rowDataObj);

    this.setState({ checkSelection: rowDataAry });
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
    return this.state.flattack_openTop.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            {/* <select
              className="w-100 cmd-select"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
            >
              <option>select</option>
            </select> */}
            <label className="mr-0 mt-2" name="SpecialContainerCode">
              {el.SpecialContainerCode}
            </label>
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
              value={el.Quantity || ""}
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
    debugger  
    const { name, value } = e.target;

    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop[i] = {
      ...flattack_openTop[i],
      [name]: parseFloat(value)
    };

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
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: optionsVal[0].SpecialContainerCode,
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
            min="1"
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
        selected: [],
        users: []
      });
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
  specEquipChange = (value, option) => {
     

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
 
  };


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
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.Quantity||""}
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
  render() {
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
                {/* <button
                  onClick={this.handleCheck}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </button> */}
                <Link
                  to={{
                    pathname: "/rate-finalizing"
                  }}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </Link>
              </div>
            </div>
            <div className="rate-table-below">
              <div className="row">
                <div className="col-md-4">
                  <div className="rate-table-left">
                    <div className="top-select d-flex justify-content-between">
                      <a href="new-rate-search" className="butn">
                        {this.state.shipmentType}
                      </a>
                      <a href="new-rate-search" className="butn">
                        {this.state.modeoftransport}
                      </a>
                      <a href="new-rate-search" className="butn">
                        {this.state.containerLoadType}
                      </a>
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="door"
                              type="checkbox"
                              name="typeofMove"
                              checked={true}
                            />
                            <label htmlFor="door">
                              {this.state.typeofMove === 1
                                ? "Port 2 Port"
                                : this.state.typeofMove === 2
                                ? "Door 2 Port"
                                : this.state.typeofMove === 4
                                ? "Port 2 Door"
                                : this.state.typeofMove === 3
                                ? "Door 2 Door"
                                : ""}
                            </label>
                          </div>
                          <span>100$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="insu"
                              type="checkbox"
                              name="HazMat"
                              checked={this.state.HazMat}
                            />
                            <label htmlFor="insu">HazMat</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-trak"
                              type="checkbox"
                              name="NonStackable"
                              checked={this.state.NonStackable}
                            />
                            <label htmlFor="cont-trak">NonStackable</label>
                          </div>
                          <span>150$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name="Custom_Clearance"
                              checked={this.state.Custom_Clearance}
                            />
                            <label htmlFor="cust-clear">Custom Clearance</label>
                          </div>
                          <span>900$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name="address"
                            />
                            <label htmlFor="cust-clear">
                              {this.state.selectaddress}
                            </label>
                          </div>
                          {/* <span>900$</span> */}
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
                          markerPOLData={this.state.polLatLng}
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
                          markerPODData={this.state.podmapData}
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
                            Cell: ({ original, row }) => {
                              i++;
                              return (
                                <React.Fragment>
                                  <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                    <div className="remember-forgot d-block m-0">
                                      <input
                                        id={"maersk-logo" + i}
                                        type="checkbox"
                                        name={"rate-tab-check"}
                                        // checked={
                                        //   this.state.RateDetails[i - 1].checkbx
                                        //     ? this.state.RateDetails[i - 1]
                                        //         .checkbx
                                        //     : false
                                        // }
                                        checked={
                                          this.state.cSelectedRow[
                                            original.rateID
                                          ] === true
                                        }
                                        onChange={e =>
                                          this.toggleRow(original.rateID, row)
                                        }
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
                            accessor: "lineName",
                            minWidth: 200
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">Valid Until</p>
                                  <p className="details-para">
                                    {new Date(
                                      row.original.expiryDate ||
                                        row.original.ExpiryDate
                                    ).toLocaleDateString("en-US")}
                                  </p>
                                </>
                              );
                            },
                            accessor: "expiryDate" || "ExpiryDate",
                            minWidth: 175
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">TT</p>
                                  <p className="details-para">
                                    {row.original.transitTime ||
                                      row.original.TransitTimeTo}
                                  </p>
                                </>
                              );
                            },
                            accessor: "transitTime" || "TransitTimeTo",
                            minWidth: 120
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">Price</p>
                                  <p className="details-para">
                                    {row.original.TotalAmount !== "" &&
                                    row.original.TotalAmount !== null
                                      ? row.original.TotalAmount +
                                        " " +
                                        row.original.BaseCurrency
                                      : ""}
                                  </p>
                                </>
                              );
                            },
                            accessor: "baseFreightFee",
                            minWidth: 120
                          }
                        ]
                      }
                    ]}
                    data={this.state.RateDetails}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    SubComponent={row => {
                      return (
                        <div style={{ padding: "20px 0" }}>
                          <ReactTable
                            minRows={1}
                            data={this.state.RateSubDetails}
                            columns={[
                              {
                                columns: [
                                  {
                                    Header: "Charge Name",
                                    accessor: "ChargeCode"
                                  },
                                  {
                                    Header: "Tax",
                                    accessor: "Tax"
                                  },
                                  {
                                    Header: "Units",
                                    accessor: "ChargeItem"
                                  },
                                  {
                                    Header: "Exrate",
                                    accessor: "Exrate"
                                  },
                                  {
                                    Header: "Charge Type",
                                    accessor: "ChargeType"
                                  },
                                  {
                                    Header: "Unit Price",
                                    accessor: "Rate",
                                    Cell: props => (
                                      <React.Fragment>
                                        {props.original.Rate}
                                        &nbsp;
                                        {props.original.Currency}
                                      </React.Fragment>
                                    )
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          {row.original.TotalAmount !== "" &&
                                          row.original.TotalAmount !== null
                                            ? row.original.TotalAmount +
                                              " " +
                                              row.original.BaseCurrency
                                            : ""}
                                        </>
                                      );
                                    },
                                    Header: "Final Payment",
                                    accessor: "TotalAmount"
                                  }
                                ]
                              }
                            ]}
                            showPagination={true}
                            defaultPageSize={5}
                          />
                        </div>
                      );
                    }}
                  />
                  {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
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
                <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                  <Select
                    className="rate-dropdown"
                    getOptionLabel={option => option.StandardContainerCode}
                    getOptionValue={option => option.StandardContainerCode}
                    isMulti
                    options={this.state.EquipmentType}
                    // onChange={this.equipChange.bind(this)}
                    value={this.state.selected}
                    showNewOptionAtTop={false}
                  />
                </div>
                <div>{this.NewcreateUI()}</div>
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
                      className="rate-dropdown"
                      getOptionLabel={option => option.SpecialContainerCode}
                      isMulti
                      getOptionValue={option => option.SpecialContainerCode}
                      options={this.state.SpacialEqmt}
                      placeholder="Select Kind of Special Equipment"
                      onChange={this.specEquipChange}
                      // value={thi.state.spEqtSelect}
                      showNewOptionAtTop={false}
                    />
                  </div>
                  <div id="cbmInner">
                      { 
                      this.state.specialEqtSelect === true ? (
                        this.state.flattack_openTop.length > 0 ? (
                          <>{this.MultiCreateCBM()}</>
                        ) : null
                      ) : null}

                      
                      { 
                      this.state.refertypeSelect === true ? (
                        this.state.referType.length > 0 ? (
                          <>{this.createUISpecial()}</>
                        ) : null
                      ) : null}

                      { 
                      this.state.spacEqmtTypeSelect === true ? (
                        this.state.spacEqmtType.length > 0 ? (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              {this.createUIspacEqmtType()}
                            </div>
                          </>
                        ) : null
                      ) : null}
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

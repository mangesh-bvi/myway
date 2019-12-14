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
import CancelImg from "./../assets/img/close.png";
import Select from "react-select";
// import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
// import GreenIcon from "./../assets/img/green-circle.png";
// import RedIcon from "./../assets/img/red-circle.png";
import ReactAutocomplete from "react-autocomplete";
import matchSorter from "match-sorter";
// import $ from "jquery";
import { encryption } from "../helpers/encryption";
// import { parse } from "path";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const { compose } = require("recompose");
const POLMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    center={
      props.markerPOLData
        ? props.markerPOLData[props.markerPOLData.length - 1]
        : { lat: parseFloat(32.24165126), lng: parseFloat(77.78319374) }
    }
    // defaultZoom={9}
    // zoom={props.zomePOL}
    // zoom={9}
  >
    {props.markerPOLData.map((marker, i) => {
      {
        /* {(() => { */
      }
      return (
        <Marker
          key={i}
          //position={{ lat: Number(props.markerPOLData.lat), lng: Number(props.markerPOLData.lng) }}
          position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
        ></Marker>
      );
      // })()}
    })}
  </GoogleMap>
));
const PODMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={2}
    center={
      props.markerPODData
        ? props.markerPODData[props.markerPODData.length - 1]
        : { lat: 32.24165126, lng: 77.78319374 }
    }
  >
    {props.markerPODData.map((marker, i) => {
      {
        /* {(() => { */
      }
      return (
        <Marker
          key={i}
          position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
        ></Marker>
      );
      // })()}
    })}
  </GoogleMap>
));

const AutoCompletePOLMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={2}
  >
    <Autocomplete
      placeholder="Enter POL"
      className="w-100"
      name=""
      type="text"
      onPlaceSelected={props.onPlaceSelected}
      types={["(regions)"]}
    />
  </GoogleMap>
));

const AutoCompletePODMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={2}
  >
    <Autocomplete
      placeholder="Enter POD"
      className="w-100"
      name=""
      type="text"
      onPlaceSelected={props.onPlaceSelected}
      types={["(regions)"]}
    />
  </GoogleMap>
));

class RateTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalSpot: false,
      loading: true,
      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      typeofMove: "",
      commodityData: [],
      HazMat: false,
      NonStackable: false,
      Custom_Clearance: false,
      typeofMoveCheck: true,
      incoTeam: "",
      modalPOL: false,
      modalPOD: false,
      modalQuant: false,
      value: 0,
      RateDetails: [],
      expanded: {},
      RateSubDetails: [],
      valuesPOL: [{ pol: "" }],
      valuesPOD: [{ pod: "" }],
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
      referType: [],
      flattack_openTop: [],
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      refertypeSelect: false,
      specialEquipment: false,
      polpodDataAdd: [],
      fields: {},
      polfullAddData: {},
      podfullAddData: {},
      mapPositionPOL: [],
      markerPositionPOD: [],
      zoomPOL: 0,
      zoomPOD: 0,
      filterAll: "",
      filtered: [],
      incoTerms: "",
      selectedCommodity: "",
      tempRateDetails: [],
      polpodData: [],
      currencyCode: "",
      TruckType: [],
      TruckTypeData: [],
      CommodityID: 49,
      OriginGeoCordinates: "",
      DestGeoCordinate: "",
      pickUpAddress: [],
      destAddress: [],
      multiCBM: [],
      paramData: [],
      fields: [],
      puAdd: "",
      DeliveryCity: "",
      typesofMove: "",
      polArray: [],
      podArray: [],
      multiFields: {},
      polFilterArray: [],
      podFilterArray: [],
      enablePOL: true,
      enablePOD: true,
      ModeOfTransport: "",
      Type: "",
      TypeOfMove: "",
      PortOfDischargeCode: "",
      PortOfLoadingCode: "",
      Containerdetails: [],
      OriginGeoCordinates: "",
      DestGeoCordinate: "",
      PickupCity: "",
      DeliveryCity: "",
      Currency: "",
      ChargeableWeight: 0,
      RateQueryDim: [],
      cbmVal: "",
      errorPOL: "",
      errorPOD: "",
      companyId: 0,
      companyName: "",
      companyAddress: "",
      contactName: "",
      contactEmail: "",
      profitLossAmt: 0,
      profitLossPer: 0,
      MinTT: 0,
      MaxTT: 0
    };

    this.togglePODModal = this.togglePODModal.bind(this);
    this.togglePOLModal = this.togglePOLModal.bind(this);
    this.toggleQuant = this.toggleQuant.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.checkSelection = this.checkSelection.bind(this);
    this.HandleCommodityData = this.HandleCommodityData.bind(this);
    this.toggleSpot = this.toggleSpot.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
    this.custClearToggle = this.custClearToggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.spotRateSubmit = this.spotRateSubmit.bind(this);
    this.toggleQuantPOLSave = this.toggleQuantPOLSave.bind(this);
    this.toggleQuantPODSave = this.toggleQuantPODSave.bind(this);
    this.toggleQuantQuantity = this.toggleQuantQuantity.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    setTimeout(() => {
      this.HandleCommodityData();
    }, 100);

    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state !== null) {
        var isSearch = this.props.location.state.isSearch;
        if (isSearch) {
          var paramData = this.props.location.state;
          // var modeofTransport = this.props.location.state.containerLoadType;
          if (paramData.typesofMove === "p2p") {
            this.state.polArray.push({
              POL:
                paramData.containerLoadType == "AIR"
                  ? paramData.polfullAddData.Location !== "" &&
                    paramData.polfullAddData.Location !== undefined
                    ? paramData.polfullAddData.Location
                    : ""
                  : paramData.polfullAddData.UNECECode !== "" &&
                    paramData.polfullAddData.UNECECode !== undefined
                  ? paramData.polfullAddData.UNECECode
                  : "",
              POLGeoCordinate: paramData.polfullAddData.GeoCoordinate,
              Address: paramData.fields.pol,
              IsFilter: true
            });
            this.state.podArray.push({
              POD:
                paramData.containerLoadType == "AIR"
                  ? paramData.podfullAddData.Location !== "" &&
                    paramData.podfullAddData.Location !== undefined
                    ? paramData.podfullAddData.Location
                    : ""
                  : paramData.podfullAddData.UNECECode !== "" &&
                    paramData.podfullAddData.UNECECode !== undefined
                  ? paramData.podfullAddData.UNECECode
                  : "",
              PODGeoCordinate: paramData.podfullAddData.GeoCoordinate,
              Address: paramData.fields.pod,
              IsFilter: true
            });
            this.state.polFilterArray.push({
              POL:
                paramData.containerLoadType == "AIR"
                  ? paramData.polfullAddData.Location !== "" &&
                    paramData.polfullAddData.Location !== undefined
                    ? paramData.polfullAddData.Location
                    : ""
                  : paramData.polfullAddData.UNECECode !== "" &&
                    paramData.polfullAddData.UNECECode !== undefined
                  ? paramData.polfullAddData.UNECECode
                  : "",
              POLGeoCordinate: paramData.polfullAddData.GeoCoordinate,
              Address: paramData.fields.pol,
              IsFilter: true
            });
            this.state.podFilterArray.push({
              POD:
                paramData.containerLoadType == "AIR"
                  ? paramData.podfullAddData.Location !== "" &&
                    paramData.podfullAddData.Location !== undefined
                    ? paramData.podfullAddData.Location
                    : ""
                  : paramData.podfullAddData.UNECECode !== "" &&
                    paramData.podfullAddData.UNECECode !== undefined
                  ? paramData.podfullAddData.UNECECode
                  : "",
              PODGeoCordinate: paramData.podfullAddData.GeoCoordinate,
              Address: paramData.fields.pod,
              IsFilter: true
            });
          }
          if (paramData.typesofMove === "d2p") {
            this.state.polArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true
            });
            this.state.podArray.push({
              POD:
                paramData.containerLoadType == "AIR"
                  ? paramData.podfullAddData.Location !== "" &&
                    paramData.podfullAddData.Location !== undefined
                    ? paramData.podfullAddData.Location
                    : ""
                  : paramData.podfullAddData.UNECECode !== "" &&
                    paramData.podfullAddData.UNECECode !== undefined
                  ? paramData.podfullAddData.UNECECode
                  : "",
              PODGeoCordinate: paramData.podfullAddData.GeoCoordinate,
              Address: paramData.fields.pod,
              IsFilter: true
            });
            this.state.polFilterArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true
            });
            this.state.podFilterArray.push({
              POD:
                paramData.containerLoadType == "AIR"
                  ? paramData.podfullAddData.Location !== "" &&
                    paramData.podfullAddData.Location !== undefined
                    ? paramData.podfullAddData.Location
                    : ""
                  : paramData.podfullAddData.UNECECode !== "" &&
                    paramData.podfullAddData.UNECECode !== undefined
                  ? paramData.podfullAddData.UNECECode
                  : "",
              PODGeoCordinate: paramData.podfullAddData.GeoCoordinate,
              Address: paramData.fields.pod,
              IsFilter: true
            });
          }
          if (paramData.typesofMove === "d2d") {
            this.state.polArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true
            });
            this.state.podArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true
            });
            this.state.polFilterArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true
            });
            this.state.podFilterArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true
            });
          }
          if (paramData.typesofMove === "p2d") {
            this.state.polArray.push({
              POL:
                paramData.containerLoadType == "AIR"
                  ? paramData.polfullAddData.Location !== "" &&
                    paramData.polfullAddData.Location !== undefined
                    ? paramData.polfullAddData.Location
                    : ""
                  : paramData.polfullAddData.UNECECode !== "" &&
                    paramData.polfullAddData.UNECECode !== undefined
                  ? paramData.polfullAddData.UNECECode
                  : "",
              POLGeoCordinate: paramData.polfullAddData.GeoCoordinate,
              Address: paramData.fields.pol,
              IsFilter: true
            });
            this.state.podArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true
            });
            this.state.polFilterArray.push({
              POL:
                paramData.containerLoadType == "AIR"
                  ? paramData.polfullAddData.Location !== "" &&
                    paramData.polfullAddData.Location !== undefined
                    ? paramData.polfullAddData.Location
                    : ""
                  : paramData.polfullAddData.UNECECode !== "" &&
                    paramData.polfullAddData.UNECECode !== undefined
                  ? paramData.polfullAddData.UNECECode
                  : "",
              POLGeoCordinate: paramData.polfullAddData.GeoCoordinate,
              Address: paramData.fields.pol,
              IsFilter: true
            });
            this.state.podFilterArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true
            });
          }
          this.state.flattack_openTop = paramData.flattack_openTop;
          this.setState({
            polArray: this.state.polArray,
            podArray: this.state.podArray,
            polFilterArray: this.state.polFilterArray,
            podFilterArray: this.state.podFilterArray,
            flattack_openTop: this.state.flattack_openTop
          });
          this.HandleRateDetailsFCL(paramData);
        }
      }
    } else {
      this.props.history.push("new-rate-search");
    }
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    // alert(1);
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      //   this.props.toggle();
    }
  }
  togglePODModal() {
    this.setState({
      modalPOD: !this.state.modalPOD,
      multiFields: {}
    });
  }
  togglePOLModal() {
    debugger;
    this.setState({
      modalPOL: !this.state.modalPOL,
      multiFields: {}
    });
  }
  toggleQuant() {
    this.setState(prevState => ({
      modalQuant: !prevState.modalQuant
    }));
  }

  toggleQuantQuantity(paramData) {
    this.setState(prevState => ({
      modalQuant: !prevState.modalQuant
    }));
    this.HandleRateDetailsFCL(paramData);
  }

  toggleQuantPOLSave() {
    debugger;
    this.state.polFilterArray = this.state.polArray;
    this.setState(prevState => ({
      polFilterArray: this.state.polFilterArray,
      modalPOL: !this.state.modalPOL
      //modalQuant: !prevState.modalQuant
    }));
    this.HandleMultiPOLPODFilter();
  }

  toggleQuantPODSave() {
    debugger;
    this.state.podFilterArray = this.state.podArray;
    this.setState(prevState => ({
      podFilterArray: this.state.podFilterArray,
      modalPOD: !this.state.modalPOD
      //modalQuant: !prevState.modalQuant
    }));

    this.HandleMultiPOLPODFilter();
  }

  HandleMultiPOLPODFilter() {
    this.setState({
      loading: true
    });
    let self = this;
    var rModeofTransport =
      this.state.modeoftransport === "SEA"
        ? "Ocean"
        : this.state.modeoftransport === "AIR"
        ? "Air"
        : this.state.modeoftransport === "ROAD"
        ? "inland"
        : "";
    var multiPOL = [];
    var multiPOD = [];
    var containerdetails = [];
    for (var i = 0; i < this.state.polFilterArray.length; i++) {
      if (this.state.polFilterArray[i].IsFilter == true) {
        multiPOL.push({
          POL: this.state.polFilterArray[i].POL,
          POLGeoCordinate: this.state.polFilterArray[i].POLGeoCordinate
        });
      }
    }
    for (var i = 0; i < this.state.podFilterArray.length; i++) {
      if (this.state.podFilterArray[i].IsFilter == true) {
        multiPOD.push({
          POD: this.state.podFilterArray[i].POD,
          PODGeoCordinate: this.state.podFilterArray[i].PODGeoCordinate
        });
      }
    }

    if (this.state.users.length != 0) {
      for (var i = 0; i < this.state.users.length; i++) {
        containerdetails.push({
          ProfileCodeID: this.state.users[i].ProfileCodeID,
          ContainerCode: this.state.users[i].StandardContainerCode,
          Type: this.state.users[i].ContainerName,
          ContainerQuantity: this.state.users[i].ContainerQuantity,
          Temperature: this.state.users[i].Temperature
        });
      }
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQueryMutiplePOD`,
      data: {
        QuoteType: this.state.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: this.state.shipmentType,
        TypeOfMove: this.state.typeofMove,
        Containerdetails: containerdetails,
        Currency: this.state.currencyCode,
        MultiplePOL: multiPOL,
        MultiplePOD: multiPOD,
        MyWayUserID: 874588,
        RateQueryDim: [
          {
            Quantity: 0,
            Lengths: 0,
            Width: 0,
            Height: 0,
            GrossWt: 0,
            VolumeWeight: 0,
            Volume: 0
          }
        ]
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response);
      var ratetable = response.data.Table;
      var ratetable1 = response.data.Table1;

      if (ratetable != null) {
        self.setState({
          RateDetails: ratetable,
          tempRateDetails: ratetable,
          loading: false
        });
      }
      if (ratetable1 != null) {
        self.setState({
          RateSubDetails: ratetable1
        });
      }
    });
  }

  handleCheck() {
    if (this.state.selectedDataRow.length != 0) {
      this.props.history.push({
        pathname: "rate-finalizing",
        state: this.state
      });
    } else {
      //NotificationManager.error("Please select atleast one Rate");
      alert("Please select atleast one Rate");
    }
  }

  toggleRow(RateLineID, rowData) {
    debugger;
    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[RateLineID] = !this.state.cSelectedRow[RateLineID];
    var BuyRate = 0;
    this.setState({
      cSelectedRow: RateLineID ? newSelected : false
    });
    var selectedRow = [];
    var rateSubDetails = this.state.RateSubDetails.filter(
      d => d.RateLineID === RateLineID
    );
    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData._original);
      for (let j = 0; j < rateSubDetails.length; j++) {
        this.state.profitLossAmt +=
          rateSubDetails[j].Rate - rateSubDetails[j].BuyRate;
        BuyRate += rateSubDetails[j].BuyRate;
      }
      this.state.profitLossPer += (this.state.profitLossAmt * 100) / BuyRate;

      this.setState({
        selectedDataRow: selectedRow,
        profitLossAmt: this.state.profitLossAmt,
        profitLossPer: this.state.profitLossPer
      });
    } else {
      if (newSelected[RateLineID] === true) {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          var thisrateid = this.state.selectedDataRow[i].RateLineID;
          var _originalrateid = rowData._original.RateLineID;
          if (
            this.state.containerLoadType == "FCL" ||
            this.state.containerLoadType == "LCL" ||
            this.state.containerLoadType == "AIR"
          ) {
            thisrateid = this.state.selectedDataRow[i].RateLineId;
            _originalrateid = rowData._original.RateLineId;
          }

          if (
            thisrateid == _originalrateid //== undefined ? rowData._original.RateLineId : rowData._original.RateLineID
          ) {
            selectedRow.splice(i, 1);

            break;
          } else {
            selectedRow = this.state.selectedDataRow;
            selectedRow.push(rowData._original);
            break;
          }
        }
        for (let j = 0; j < rateSubDetails.length; j++) {
          this.state.profitLossAmt +=
            rateSubDetails[j].Rate - rateSubDetails[j].BuyRate;
          BuyRate += rateSubDetails[j].BuyRate;
        }
        this.state.profitLossPer = (this.state.profitLossAmt * 100) / BuyRate;
      } else {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].RateLineID ===
            rowData._original.RateLineID
          ) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.splice(i, 1);
            break;
          }
        }
        for (let j = 0; j < rateSubDetails.length; j++) {
          this.state.profitLossAmt -=
            rateSubDetails[j].Rate - rateSubDetails[j].BuyRate;
          BuyRate -= rateSubDetails[j].BuyRate;
        }

        this.state.profitLossPer = (this.state.profitLossAmt * 100) / BuyRate;
      }
    }
    this.setState({
      selectedDataRow: selectedRow,
      profitLossAmt: this.state.profitLossAmt,
      profitLossPer: this.state.profitLossPer
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
    debugger;
    var dataParameter = {};
    var pickUpAddress = {
      Street: "",
      Country: "",
      State: "",
      City: "",
      ZipCode: ""
    };
    var destUpAddress = {
      Street: "",
      Country: "",
      State: "",
      City: "",
      ZipCode: ""
    };
    if (paramData.isSearch) {
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

      var containerdetails = paramData.users;

      var polLatLng = new Object();
      var podLatLng = new Object();

      var polmapData = polAddress.GeoCoordinate;
      var polmarkerData = [];
      if (typeof polmapData !== "undefined" && polmapData !== null) {
        polLatLng.lat = Number(polmapData.split(",")[0]);
        polLatLng.lng = Number(polmapData.split(",")[1]);

        polmarkerData.push(polLatLng);
      } else {
        var mapPositionPOL = paramData.mapPositionPOL;
        if (mapPositionPOL !== null && typeof mapPositionPOL !== "undefined") {
          polmarkerData.push(mapPositionPOL);
        }
      }
      var podmapData = podAddress.GeoCoordinate;
      var podmarkerData = [];
      if (typeof podmapData !== "undefined" && podmapData !== null) {
        podLatLng.lat = Number(podmapData.split(",")[0]);
        podLatLng.lng = Number(podmapData.split(",")[1]);

        podmarkerData.push(podLatLng);
      } else {
        var mapPositionPOD = paramData.mapPositionPOD;
        if (mapPositionPOD !== null && typeof mapPositionPOD !== "undefined") {
          podmarkerData.push(mapPositionPOD);
        }
      }
      debugger;
      this.setState({
        mapPositionPOL: polmarkerData,
        markerPositionPOD: podmarkerData,
        users: paramData.users,
        selected: paramData.selected
      });
      debugger;

      var selectedPOL =
        paramData.polfullAddData.NameWoDiacritics || paramData.PickupCity;
      var SelectPOD =
        paramData.podfullAddData.NameWoDiacritics || paramData.DeliveryCity;
      var selectedPOLPOD = selectedPOL + " To " + SelectPOD;

      var cmbvalue = paramData.cbmVal;
      if (cmbvalue != "") {
        cmbvalue = parseInt(cmbvalue);
      } else {
        cmbvalue = 0;
      }

      if (paramData.typesofMove === "d2p") {
        pickUpAddress = paramData.fullAddressPOL[0];
      } else if (paramData.typesofMove === "p2d") {
        destUpAddress = paramData.fullAddressPOD[0];
      } else if (paramData.typesofMove === "d2d") {
        pickUpAddress = paramData.fullAddressPOL[0];
        destUpAddress = paramData.fullAddressPOD[0];
      }

      dataParameter = {
        QuoteType: paramData.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: paramData.shipmentType,
        TypeOfMove: rTypeofMove,

        PortOfDischargeCode:
          paramData.containerLoadType == "AIR"
            ? podAddress.Location !== "" && podAddress.Location !== undefined
              ? podAddress.Location
              : ""
            : podAddress.UNECECode !== "" && podAddress.UNECECode !== undefined
            ? podAddress.UNECECode
            : "",
        PortOfLoadingCode:
          paramData.containerLoadType == "AIR"
            ? polAddress.Location !== "" && polAddress.Location !== undefined
              ? polAddress.Location
              : ""
            : polAddress.UNECECode !== "" && polAddress.UNECECode !== undefined
            ? polAddress.UNECECode
            : "",
        Containerdetails: containerdetails,
        OriginGeoCordinates:
          polAddress.GeoCoordinate !== "" &&
          polAddress.GeoCoordinate !== undefined
            ? polAddress.GeoCoordinate
            : paramData.OriginGeoCordinates,
        DestGeoCordinate:
          podAddress.GeoCoordinate !== "" &&
          podAddress.GeoCoordinate !== undefined
            ? podAddress.GeoCoordinate
            : paramData.DestGeoCordinate,
        PickupCity:
          polAddress.NameWoDiacritics !== "" &&
          polAddress.NameWoDiacritics !== undefined
            ? polAddress.NameWoDiacritics
            : paramData.fullAddressPOL[0].City,
        DeliveryCity:
          podAddress.NameWoDiacritics !== "" &&
          podAddress.NameWoDiacritics !== undefined
            ? podAddress.NameWoDiacritics
            : paramData.fullAddressPOD[0].City,
        Currency: paramData.currencyCode,
        //ChargeableWeight: cmbvalue,
        //RateQueryDim: paramData.multiCBM,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc")
      };

      if (
        cmbvalue != null &&
        cmbvalue != 0 &&
        cmbvalue != undefined &&
        cmbvalue != ""
      ) {
        dataParameter.ChargeableWeight = cmbvalue;
      } else {
        dataParameter.ChargeableWeight = cmbvalue;
        dataParameter.RateQueryDim = paramData.multiCBM;
      }

      if (
        encryption(window.localStorage.getItem("usertype"), "desc") ===
        "Customer"
      ) {
        paramData.companyId = encryption(
          window.localStorage.getItem("companyid"),
          "desc"
        );
      }

      dataParameter.Commodity = this.state.CommodityID;
      dataParameter.CustomerId = parseInt(paramData.companyId);
      dataParameter.PickUpAddressDetails = pickUpAddress;
      dataParameter.DestinationAddressDetails = destUpAddress;
      dataParameter.HazMat = paramData.HazMat;
      dataParameter.CustomClearance = paramData.Custom_Clearance;
      dataParameter.NonStackable = paramData.NonStackable;

      var EquipmentType = [];
      if (paramData.StandardContainerCode != undefined) {
        EquipmentType = paramData.StandardContainerCode;
      } else {
        EquipmentType = paramData.EquipmentType;
      }

      // if(paramData.typesofMove === "p2p")
      // {this.state.polArray.push({POL:paramData.polfullAddData.UNECECode,POLGeoCordinate:paramData.polfullAddData.GeoCoordinate,Address:paramData.fields.pol, IsFilter:true});
      // this.state.podArray.push({POD:paramData.podfullAddData.UNECECode,PODGeoCordinate:paramData.podfullAddData.GeoCoordinate,Address:paramData.fields.pod, IsFilter:true});
      // this.state.polFilterArray.push({POL:paramData.polfullAddData.UNECECode,POLGeoCordinate:paramData.polfullAddData.GeoCoordinate,Address:paramData.fields.pol, IsFilter:true});
      // this.state.podFilterArray.push({POD:paramData.podfullAddData.UNECECode,PODGeoCordinate:paramData.podfullAddData.GeoCoordinate,Address:paramData.fields.pod, IsFilter:true});
      // }
      // if (paramData.typesofMove === "d2p") {
      //   this.state.polArray.push({POL:'',POLGeoCordinate:paramData.OriginGeoCordinates,Address:paramData.puAdd, IsFilter:true});
      //   this.state.podArray.push({POD:paramData.podfullAddData.UNECECode,PODGeoCordinate:paramData.podfullAddData.GeoCoordinate,Address:paramData.fields.pod, IsFilter:true});
      //   this.state.polFilterArray.push({POL:'',POLGeoCordinate:paramData.OriginGeoCordinates,Address:paramData.puAdd, IsFilter:true});
      //   this.state.podFilterArray.push({POD:paramData.podfullAddData.UNECECode,PODGeoCordinate:paramData.podfullAddData.GeoCoordinate,Address:paramData.fields.pod, IsFilter:true});
      // }
      // if (paramData.typesofMove === "d2d") {
      //   this.state.polArray.push({POL:'',POLGeoCordinate:paramData.OriginGeoCordinates,Address:paramData.puAdd, IsFilter:true});
      //   this.state.podArray.push({POD:'',PODGeoCordinate:paramData.DestGeoCordinate,Address:paramData.DeliveryCity, IsFilter:true});
      //   this.state.polFilterArray.push({POL:'',POLGeoCordinate:paramData.OriginGeoCordinates,Address:paramData.puAdd, IsFilter:true});
      //   this.state.podFilterArray.push({POD:'',PODGeoCordinate:paramData.DestGeoCordinate,Address:paramData.DeliveryCity, IsFilter:true});
      // }
      // if (paramData.typesofMove === "p2d") {
      //   this.state.polArray.push({POL:paramData.polfullAddData.UNECECode,POLGeoCordinate:paramData.polfullAddData.GeoCoordinate,Address:paramData.fields.pol, IsFilter:true});
      //   this.state.podArray.push({POD:'',PODGeoCordinate:paramData.DestGeoCordinate,Address:paramData.DeliveryCity, IsFilter:true});
      //   this.state.polFilterArray.push({POL:paramData.polfullAddData.UNECECode,POLGeoCordinate:paramData.polfullAddData.GeoCoordinate,Address:paramData.fields.pol, IsFilter:true});
      //   this.state.podFilterArray.push({POD:'',PODGeoCordinate:paramData.DestGeoCordinate,Address:paramData.DeliveryCity, IsFilter:true});
      // }
      var incoTerms = paramData.incoTerms;
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
        EquipmentType: EquipmentType,
        spacEqmtType: paramData.spacEqmtType,
        referType: paramData.referType,
        flattack_openTop: paramData.flattack_openTop,
        spacEqmtTypeSelect: paramData.spacEqmtTypeSelect,
        specialEqtSelect: paramData.specialEqtSelect,
        refertypeSelect: paramData.refertypeSelect,
        specialEquipment: paramData.specialEquipment,
        incoTerms,
        polfullAddData: paramData.polfullAddData,
        podfullAddData: paramData.podfullAddData,
        currencyCode: paramData.currencyCode,
        TruckType: paramData.TruckType,
        TruckTypeData: paramData.TruckTypeData,
        // OriginGeoCordinates: paramData.OriginGeoCordinates,
        // DestGeoCordinate: paramData.DestGeoCordinate,
        pickUpAddress: paramData.fullAddressPOL,
        destAddress: paramData.fullAddressPOD,
        multiCBM: paramData.multiCBM,
        packageTypeData: paramData.packageTypeData,
        fields: paramData.fields,
        puAdd: paramData.puAdd,
        DeliveryCity: paramData.DeliveryCity,
        typesofMove: paramData.typesofMove,
        // polArray:this.state.polArray,
        // podArray:this.state.podArray,
        // polFilterArray:this.state.polFilterArray,
        // podFilterArray:this.state.podFilterArray,
        ChargeableWeight: cmbvalue,
        ModeOfTransport: rModeofTransport,
        TypeOfMove: rTypeofMove,
        PortOfDischargeCode:
          paramData.containerLoadType == "AIR"
            ? podAddress.Location !== "" && podAddress.Location !== undefined
              ? podAddress.Location
              : ""
            : podAddress.UNECECode !== "" && podAddress.UNECECode !== undefined
            ? podAddress.UNECECode
            : "",
        PortOfLoadingCode:
          paramData.containerLoadType == "AIR"
            ? polAddress.Location !== "" && polAddress.Location !== undefined
              ? polAddress.Location
              : ""
            : polAddress.UNECECode !== "" && polAddress.UNECECode !== undefined
            ? polAddress.UNECECode
            : "",
        Containerdetails: containerdetails,
        OriginGeoCordinates:
          polAddress.GeoCoordinate !== "" &&
          polAddress.GeoCoordinate !== undefined
            ? polAddress.GeoCoordinate
            : paramData.OriginGeoCordinates,
        DestGeoCordinate:
          podAddress.GeoCoordinate !== "" &&
          podAddress.GeoCoordinate !== undefined
            ? podAddress.GeoCoordinate
            : paramData.DestGeoCordinate,
        PickupCity:
          polAddress.NameWoDiacritics !== "" &&
          polAddress.NameWoDiacritics !== undefined
            ? polAddress.NameWoDiacritics
            : "",
        DeliveryCity:
          podAddress.NameWoDiacritics !== "" &&
          podAddress.NameWoDiacritics !== undefined
            ? podAddress.NameWoDiacritics
            : paramData.DeliveryCity,
        Currency: paramData.currencyCode,
        isSearch: paramData.isSearch,
        cbmVal: paramData.cbmVal,
        companyId: paramData.companyId,
        companyName: paramData.companyName,
        companyAddress: paramData.companyAddress,
        contactName: paramData.contactName,
        contactEmail: paramData.contactEmail
      });
    }

    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: dataParameter,
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        //console.log(response);
        var ratetable = response.data.Table;
        var ratetable1 = response.data.Table1;
        var ratetable2 = response.data.Table2;

        if (ratetable.length > 0) {
          if (ratetable != null) {
            var MinTTArray = [];
            var MaxTTArray = [];
            for (let i = 0; i < ratetable.length; i++) {
              MinTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[0]));
              MaxTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[1]));
            }
            self.setState({
              RateDetails: ratetable,
              tempRateDetails: ratetable,
              loading: false,
              commodityData: ratetable2,
              MinTT: Math.min(...MinTTArray),
              MaxTT: Math.max(...MaxTTArray),
              value: Math.max(...MaxTTArray)
            });
          }
          if (ratetable1 != null) {
            self.setState({
              RateSubDetails: ratetable1
            });
          }
        } else {
          self.setState({
            loading: false
          });
        }
      })
      .catch(error => {
        debugger;
        console.log(error.response);
      });
  }

  toggleChangePOLPOD(i, field, geoCoordinate, e) {
    debugger;
    if (field == "POL") {
      this.state.polFilterArray[i].IsFilter = !this.state.polFilterArray[i]
        .IsFilter;
      if (this.state.polFilterArray[i].IsFilter == true) {
        this.state.mapPositionPOL.push({
          lat: Number(geoCoordinate.split(",")[0]),
          lng: Number(geoCoordinate.split(",")[1])
        });
      } else {
        for (var j = 0; j < this.state.mapPositionPOL.length; j++) {
          var geocordinates =
            this.state.mapPositionPOL[j].lat +
            "," +
            this.state.mapPositionPOL[j].lng;
          var cordinates =
            Number(geoCoordinate.split(",")[0]) +
            "," +
            Number(geoCoordinate.split(",")[1]);
          if (geocordinates == cordinates) {
            this.state.mapPositionPOL.splice(j, 1);
          }
        }
      }
      this.setState({
        polFilterArray: this.state.polFilterArray,
        enablePOL: !this.state.enablePOL,
        mapPositionPOL: this.state.mapPositionPOL
      });
    } else {
      this.state.podFilterArray[i].IsFilter = !this.state.podFilterArray[i]
        .IsFilter;
      if (this.state.podFilterArray[i].IsFilter == true) {
        this.state.markerPositionPOD.push({
          lat: Number(geoCoordinate.split(",")[0]),
          lng: Number(geoCoordinate.split(",")[1])
        });
      } else {
        for (var j = 0; j < this.state.markerPositionPOD.length; j++) {
          var geocordinates =
            this.state.markerPositionPOD[j].lat +
            "," +
            this.state.markerPositionPOD[j].lng;
          var cordinates =
            Number(geoCoordinate.split(",")[0]) +
            "," +
            Number(geoCoordinate.split(",")[1]);
          if (geocordinates == cordinates) {
            this.state.markerPositionPOD.splice(j, 1);
          }
        }
      }
      this.setState({
        podFilterArray: this.state.podFilterArray,
        enablePOD: !this.state.enablePOD,
        markerPositionPOD: this.state.markerPositionPOD
      });
    }

    this.HandleMultiPOLPODFilter();
  }

  HandleDocumentView(evt, row) {
    debugger;
    var rowDataAry = [];
    var rowDataObj = row.original;
    rowDataAry.push(rowDataObj);

    this.setState({ checkSelection: rowDataAry });
  }

  addClickPOL() {
    this.setState(prevState => ({
      valuesPOL: [
        ...prevState.valuesPOL,
        {
          POL: ""
        }
      ]
    }));
    console.log(this.state.valuesPOL, "--------------POL Values");
  }
  addClickPOD() {
    this.setState(prevState => ({
      valuesPOD: [
        ...prevState.valuesPOD,
        {
          POD: ""
        }
      ]
    }));
  }

  createUIPOL() {
    return this.state.valuesPOL.map((el, index) => {
      return this.state.modeoftransport === "AIR" ? (
        <div key={index + 1} className="row">
          <div
            className={
              this.state.typeofMove === 1 || this.state.typeofMove === 3
                ? "rename-cntr login-fields position-relative"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 3 ? (
              <ReactAutocomplete
                key={index}
                name={"POL" + (index + 1)}
                getItemValue={item => item.AirportLongName}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white"
                    }}
                    value={item.AirPortID}
                  >
                    {item.AirportLongName}
                  </div>
                )}
                renderInput={function(props) {
                  return (
                    <input
                      id={"POLid" + (index + 1)}
                      placeholder="Enter POL"
                      className="w-100"
                      type="text"
                      {...props}
                      //onChange={this.HandlePOLPODAutosearch.bind(this, "pod")}
                    />
                  );
                }}
                onChange={this.HandlePOLPODAutosearch.bind(
                  this,
                  "pol" + (index + 1),
                  index + 1
                )}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownPolSelect.bind(
                  this,
                  item => item.NameWoDiacritics,
                  "pol" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pol" + (index + 1)]}
              />
            ) : (
              <AutoCompletePOLMaps
                zomePOL={this.state.zoomPOL}
                onPlaceSelected={this.onPlaceSelected}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                containerElement={
                  <div style={{ height: `100%`, width: "100%" }} />
                }
                mapElement={<div />}
                loadingElement={<div style={{ height: `100%` }} />}
                id={"POL" + (index + 1)}
              ></AutoCompletePOLMaps>
            )}

            {index === 0 ? (
              <i
                className="fa fa-plus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.addClickPOL.bind(this, index)}
              ></i>
            ) : (
              <i
                className="fa fa-minus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.removeClickPOL.bind(this, index)}
              ></i>
            )}

            {/* <div className="rename-cntr login-fields">
            <textarea className="txt-add" placeholder="Enter POL"></textarea>
          </div> */}
          </div>
        </div>
      ) : (
        <div key={index + 1} className="row">
          <div
            className={
              this.state.typeofMove === 1 || this.state.typeofMove === 3
                ? "rename-cntr login-fields position-relative"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 3 ? (
              <ReactAutocomplete
                key={index}
                name={"POL" + (index + 1)}
                getItemValue={item => item.OceanPortLongName}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white"
                    }}
                    value={item.AirPortID}
                  >
                    {item.OceanPortLongName}
                  </div>
                )}
                renderInput={function(props) {
                  return (
                    <input
                      id={"POLid" + (index + 1)}
                      placeholder="Enter POL"
                      className="w-100"
                      type="text"
                      {...props}
                      //onChange={this.HandlePOLPODAutosearch.bind(this, "pod")}
                    />
                  );
                }}
                onChange={this.HandlePOLPODAutosearch.bind(
                  this,
                  "pol" + (index + 1),
                  index + 1
                )}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownPolSelect.bind(
                  this,
                  item => item.NameWoDiacritics,
                  "pol" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pol" + (index + 1)]}
              />
            ) : (
              <AutoCompletePOLMaps
                zomePOL={this.state.zoomPOL}
                onPlaceSelected={this.onPlaceSelected}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                containerElement={
                  <div style={{ height: `100%`, width: "100%" }} />
                }
                mapElement={<div />}
                loadingElement={<div style={{ height: `100%` }} />}
                id={"POL" + (index + 1)}
              ></AutoCompletePOLMaps>
            )}

            {index === 0 ? (
              <i
                className="fa fa-plus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.addClickPOL.bind(this, index)}
              ></i>
            ) : (
              <i
                className="fa fa-minus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.removeClickPOL.bind(this, index)}
              ></i>
            )}

            {/* <div className="rename-cntr login-fields">
            <textarea className="txt-add" placeholder="Enter POL"></textarea>
          </div> */}
          </div>
        </div>
      );
    });
  }

  createUIPOD() {
    return this.state.valuesPOD.map((el, index) => {
      return this.state.modeoftransport === "AIR" ? (
        <div key={index + 1} className="row">
          <div
            className={
              this.state.typeofMove === 1 || this.state.typeofMove === 2
                ? "rename-cntr login-fields position-relative"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 2 ? (
              <ReactAutocomplete
                key={index + 1}
                name={"POD" + (index + 1)}
                getItemValue={item => item.AirportLongName}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white"
                    }}
                    value={item.AirPortID}
                  >
                    {item.AirportLongName}
                  </div>
                )}
                renderInput={function(props) {
                  return (
                    <input
                      placeholder="Enter POD"
                      className="w-100"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePOLPODAutosearch.bind(
                  this,
                  "pod" + (index + 1),
                  index + 1
                )}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownPolSelect.bind(
                  this,
                  item => item.NameWoDiacritics,
                  "pod" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pod" + (index + 1)]}
              />
            ) : (
              <AutoCompletePODMaps
                onPlaceSelected={this.onPlaceSelectedPOD}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                containerElement={<div />}
                mapElement={<div />}
                loadingElement={<div />}
              ></AutoCompletePODMaps>
            )}

            {index === 0 ? (
              <i
                className="fa fa-plus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.addClickPOD.bind(this, index)}
              ></i>
            ) : (
              <i
                className="fa fa-minus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.removeClickPOD.bind(this, index)}
              ></i>
            )}
          </div>
        </div>
      ) : (
        <div key={index + 1} className="row">
          <div
            className={
              this.state.typeofMove === 1 || this.state.typeofMove === 2
                ? "rename-cntr login-fields position-relative"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 2 ? (
              <ReactAutocomplete
                key={index + 1}
                name={"POD" + (index + 1)}
                getItemValue={item => item.OceanPortLongName}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white"
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
                      className="w-100"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePOLPODAutosearch.bind(
                  this,
                  "pod" + (index + 1),
                  index + 1
                )}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownPolSelect.bind(
                  this,
                  item => item.NameWoDiacritics,
                  "pod" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pod" + (index + 1)]}
              />
            ) : (
              <AutoCompletePODMaps
                onPlaceSelected={this.onPlaceSelectedPOD}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                containerElement={<div />}
                mapElement={<div />}
                loadingElement={<div />}
              ></AutoCompletePODMaps>
            )}

            {index === 0 ? (
              <i
                className="fa fa-plus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.addClickPOD.bind(this, index)}
              ></i>
            ) : (
              <i
                className="fa fa-minus equip-plus"
                id={"remove" + (index + 1)}
                onClick={this.removeClickPOD.bind(this, index)}
              ></i>
            )}
          </div>
        </div>
      );
    });
  }

  removeClickPOL(i) {
    debugger;
    let valuesPOL = [...this.state.valuesPOL];
    valuesPOL.splice(i, 1);
    this.setState({ valuesPOL });
  }
  removeClickPOD(i) {
    debugger;
    let valuesPOD = [...this.state.valuesPOD];
    valuesPOD.splice(i, 1);
    this.setState({ valuesPOD });
  }

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState(prevState => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal.ContainerName,
          ProfileCodeID: optionVal.ProfileCodeID,
          ContainerCode: optionVal.SpecialContainerCode,
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
                value={el.ContainerQuantity}
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
                value={el.Temperature}
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
                  checked={el.TemperatureType === "C" ? true : false}
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
                  checked={el.TemperatureType === "F" ? true : false}
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
    debugger;
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
        {/* <div className="col-md">
          <div className="spe-equ">
            <label className="mr-0 mt-2" name="SpecialContainerCode">
              {el.SpecialContainerCode}
            </label>
          </div>
        </div> */}
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
        {/* <div className="col-md">
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
        </div> */}
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
              placeholder={el.Gross_Weight === 0 ? "GW (kg)" : "GW (kg)"}
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
    debugger;
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
          SpecialContainerCode: optionsVal.SpecialContainerCode,
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
      <div
        className="equip-plus-cntr rate-tab-spot spec-inner-cntr w-auto"
        key={i}
      >
        <label>
          {el.StandardContainerCode} <span className="into-quant">X</span>
        </label>
        <div className="spe-equ">
          <input
            type="number"
            min="1"
            placeholder="QTY"
            name="ContainerQuantity"
            value={el.ContainerQuantity || 1}
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
    debugger;
    var difference = false;
    for (var i = 0; i < this.state.referType.length; i++) {
      if (
        this.state.referType[i].referTypeName === value.SpecialContainerCode
      ) {
        difference = true;
        break;
      }
    }

    var difference1 = false;
    for (var i = 0; i < this.state.flattack_openTop.length; i++) {
      if (
        this.state.flattack_openTop[i].SpecialContainerCode ===
        value.SpecialContainerCode
      ) {
        difference1 = true;
        break;
      }
    }

    var difference2 = false;
    for (var i = 0; i < this.state.spacEqmtType.length; i++) {
      if (this.state.spacEqmtType[i].TypeName === value.SpecialContainerCode) {
        difference2 = true;
        break;
      }
    }

    if (value.IsVolumeRequired === 1) {
      if (difference1 === false) {
        this.setState({
          specialEqtSelect: true
        });
        this.addClickMultiCBM(value);
      }
    }
    if (value.IsTemperatureRequired === 1) {
      if (difference === false) {
        this.setState({
          refertypeSelect: true
        });
        this.addClickSpecial(value);
      }
    }

    if (value.IsTemperatureRequired === 0 && value.IsVolumeRequired === 0) {
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
          ContainerName: optionVal.ContainerName,
          ProfileCodeID: optionVal.ProfileCodeID,
          StandardContainerCode: optionVal.SpecialContainerCode,
          Quantity: 1,
          Temperature: 0,
          TemperatureType: ""
        }
      ]
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div
          key={i}
          className="equip-plus-cntr rate-tab-spot spec-inner-cntr w-auto"
        >
          <label name="TypeName">
            {el.StandardContainerCode} <span className="into-quant">X</span>
          </label>
          {/* <div className="spe-equ"> */}
          <input
            type="number"
            min="1"
            name="Quantity"
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.Quantity || 1}
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

  //// Commodity dropdown methods

  HandleCommodityData() {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,

      headers: authHeader()
    }).then(function(response) {
      debugger;
      var data = response.data.Table;
      self.setState({ commodityData: data });
    });
  }

  //// end Commodity drop-down
  toggleSpot() {
    this.setState(prevState => ({
      modalSpot: !prevState.modalSpot
    }));
  }
  toggleSpotCloseModal() {
    this.setState({ modalSpot: false });
  }

  HandlePOLPODAutosearch(field, i, e) {
    let self = this;
    let multiFields = this.state.multiFields;
    multiFields[field] = e.target.value;

    var type = this.state.modeoftransport;
    if (multiFields[field].length > 2) {
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
          Search: multiFields[field],
          CountryCode: ""
        },
        headers: authHeader()
      })
        .then(function(response) {
          if (field === "pol" + i) {
            self.setState({
              polpodData: response.data.Table,
              multiFields
            });
          } else {
            self.setState({
              polpodDataAdd: response.data.Table,
              multiFields
            });
          }
        })
        .catch(error => {
          debugger;
          multiFields[field] = "";
          var errorData = error.response.data;
          var err = errorData.split(":");
          var data = [{ OceanPortLongName: err[1].replace("}", "") }];
          this.setState({ polpodData: data });
          console.log(error);
        });
    } else {
      self.setState({
        multiFields,
        polpodData: []
      });
    }
  }

  HandleAddressDropdownPolSelect(e, field, i, value, id) {
    let multiFields = this.state.multiFields;
    multiFields[field] = value;
    var arrPOL = "";
    var arrPOD = "";

    if (field === "pol" + i) {
      for (let i = 0; i < this.state.polArray.length; i++) {
        arrPOL += this.state.polArray[i].Address + ",";
      }
      if (!arrPOL.includes(value)) {
        if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
          var geoCoordinate = id.GeoCoordinate.split(",");
          var PositionPOL = new Object();
          PositionPOL.lat = parseFloat(geoCoordinate[0]);
          PositionPOL.lng = parseFloat(geoCoordinate[1]);
          this.state.mapPositionPOL.push({
            lat: PositionPOL.lat,
            lng: PositionPOL.lng
          });
          this.state.polArray.push({
            POL:
              this.state.containerLoadType == "AIR"
                ? id.Location !== "" && id.Location !== undefined
                  ? id.Location
                  : ""
                : id.UNECECode !== "" && id.UNECECode !== undefined
                ? id.UNECECode
                : "",
            POLGeoCordinate: id.GeoCoordinate,
            Address: value,
            IsFilter: true
          });
          this.setState({
            polfullAddData: id,
            multiFields,
            mapPositionPOL: this.state.mapPositionPOL,
            polArray: this.state.polArray
          });
        }
      } else {
        multiFields[field] = "";
        this.state.errorPOL = value + " already exist";
        this.setState({
          multiFields,
          errorPOL: this.state.errorPOL
        });
      }
    } else {
      for (let i = 0; i < this.state.podArray.length; i++) {
        arrPOD += this.state.podArray[i].Address + ",";
      }
      if (!arrPOD.includes(value)) {
        if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
          var PositionPOD = [];
          var geoCoordinate = id.GeoCoordinate.split(",");
          var mapPositionPOD = new Object();
          mapPositionPOD.lat = parseFloat(geoCoordinate[0]);
          mapPositionPOD.lng = parseFloat(geoCoordinate[1]);
          this.state.markerPositionPOD.push({
            lat: mapPositionPOD.lat,
            lng: mapPositionPOD.lng
          });
          this.state.podArray.push({
            POD:
              this.state.containerLoadType == "AIR"
                ? id.Location !== "" && id.Location !== undefined
                  ? id.Location
                  : ""
                : id.UNECECode !== "" && id.UNECECode !== undefined
                ? id.UNECECode
                : "",
            PODGeoCordinate: id.GeoCoordinate,
            Address: value,
            IsFilter: true
          });

          this.setState({
            podfullAddData: id,
            multiFields,
            markerPositionPOD: this.state.markerPositionPOD,
            podArray: this.state.podArray
          });
        }
      } else {
        multiFields[field] = "";
        this.state.errorPOD = value + " already exist";
        this.setState({
          multiFields,
          errorPOD: this.state.errorPOD
        });
      }
    }
  }

  onPlaceSelected = place => {
    console.log("plc", place);
    var arrPOL = "";
    for (let i = 0; i < this.state.polArray.length; i++) {
      arrPOL += this.state.polArray[i].Address + ",";
    }
    if (!arrPOL.includes(place.formatted_address)) {
      const address = place.formatted_address,
        addressArray = place.address_components,
        // city = this.getCity(addressArray),
        // area = this.getArea(addressArray),
        // state = this.getState(addressArray),
        // zipcode = this.getZipCode(addressArray),
        // country = this.getCountry(addressArray),
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();
      if (addressArray.length > 4) {
        this.setState({ zoomPOL: 15 });
      } else if (addressArray.length > 2 && addressArray.length <= 4) {
        this.setState({ zoomPOL: 10 });
      } else {
        this.setState({ zoomPOL: 6 });
      }
      // this.state.fullAddressPOL.push({
      //   Area: area,
      //   City: city,
      //   State: state,
      //   ZipCode: zipcode,
      //   Country: country
      // });
      var originGeoCordinates = latValue + "," + lngValue;
      this.state.polArray.push({
        POL: "",
        POLGeoCordinate: originGeoCordinates,
        Address: address,
        IsFilter: true
      });
      this.setState({
        // fullAddressPOL: this.state.fullAddressPOL,
        // PickupCity: city,
        // OriginGeoCordinates: originGeoCordinates
        polArray: this.state.polArray
      });
      this.state.mapPositionPOL.push({
        lat: Number(latValue),
        lng: Number(lngValue)
      });
      this.setState({
        markerPositionPOL: {
          lat: Number(latValue),
          lng: Number(lngValue)
        }
        // mapPositionPOL: {
        //   lat: Number(latValue),
        //   lng: Number(lngValue)
        // }
      });
      //this.addressChange("puAdd", address);
    } else {
      //multiFields[field] = "";
      this.state.errorPOL = place.formatted_address + " already exist";
      this.setState({
        errorPOL: this.state.errorPOL
      });
    }
  };

  onPlaceSelectedPOD = place => {
    console.log("plc", place);
    var arrPOD = "";
    for (let i = 0; i < this.state.podArray.length; i++) {
      arrPOD += this.state.podArray[i].Address + ",";
    }
    if (!arrPOD.includes(place.formatted_address)) {
      const address = place.formatted_address,
        addressArray = place.address_components,
        // city = this.getCity(addressArray),
        // area = this.getArea(addressArray),
        // state = this.getState(addressArray),
        // zipcode = this.getZipCode(addressArray),
        // country = this.getCountry(addressArray),
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
      this.state.podArray.push({
        POD: "",
        PODGeoCordinate: destGeoCordinate,
        Address: address,
        IsFilter: true
      });
      // this.state.fullAddressPOD.push({
      //   Area: area,
      //   City: city,
      //   State: state,
      //   ZipCode: zipcode,
      //   Country: country
      // });
      // this.setState({
      //   fullAddressPOD: this.state.fullAddressPOD,
      //   DeliveryCity: city,
      //   DestGeoCordinate: destGeoCordinate
      // });
      this.state.markerPositionPOD.push({
        lat: Number(latValue),
        lng: Number(lngValue)
      });
      this.setState({
        // markerPositionPOD: {
        //   lat: Number(latValue),
        //   lng: Number(lngValue)
        // },
        podArray: this.state.podArray
        // mapPositionPOD: {
        //   lat: Number(latValue),
        //   lng: Number(lngValue)
        // }
      });
    } else {
      this.state.errorPOD = place.formatted_address + " already exist";
      this.setState({
        errorPOD: this.state.errorPOD
      });
    }
    //this.addressChange("", address);
  };

  onFilteredChange(filtered) {
    debugger;
    if (filtered.length > 1 && this.state.filterAll.length) {
      // NOTE: this removes any FILTER ALL filter
      const filterAll = "";
      this.setState({
        filtered: filtered.filter(item => item.id != "all"),
        filterAll
      });
    } else this.setState({ filtered });
  }
  filterAll(e, type) {
    debugger;
    // const { value } = e.target;
    // var filteval = e.target.selectedOptions[0].innerText;
    // if (typeof type !== "undefined" && type !== "" && type !== null) {
    // } else {
    //   if (value !== "All") {
    //     var filterData = this.state.RateDetails.filter(
    //       x => x.commodities === filteval
    //     );
    //     if (filterData.length > 0) {
    //       this.setState({
    //         tempRateDetails: filterData,
    //         Commodity: value,
    //         CommodityID: value
    //       });
    //     } else {
    //       this.setState({
    //         tempRateDetails: [{ lineName: "No Record Found" }],
    //         RateSubDetails: [{ ChargeType: "No Record Found" }]
    //       });
    //     }
    //   } else {
    //     this.setState({ tempRateDetails: this.state.RateDetails });
    //   }
    // }
    this.state.CommodityID = parseInt(e.target.value);
    this.setState({
      CommodityID: this.state.CommodityID
    });
    this.HandleRateDetailsFCL(this.state);
  }

  custClearToggle() {
    this.setState({
      Custom_Clearance: !this.state.Custom_Clearance
    });
  }

  HandleRangeSlider(value) {
    this.setState({ value });
    debugger;
    // this.filterAll(value, "R");
    var filteredData = [];
    // var actualData = [
    //   { test1: "20-22" },
    //   { test1: "22-28" },
    //   { test1: "25-28" }
    // ];

    var actualData = this.state.RateDetails;
    var checkingValue = value;

    for (var j = 0; j < actualData.length; j++) {
      var colData = actualData[j].TransitTime; //0-5
      var tempData = colData.split("-");

      if (
        parseInt(tempData[0]) <= parseInt(checkingValue) ||
        parseInt(tempData[1]) <= parseInt(checkingValue)
      ) {
        filteredData.push(actualData[j]);
      }
    }

    if (filteredData.length > 0) {
      this.setState({ tempRateDetails: filteredData });
    } else {
      this.setState({
        tempRateDetails: [{ lineName: "No Record Found" }],
        RateSubDetails: [{ ChargeType: "No Record Found" }]
      });
    }
  }

  addClickTruckType() {
    this.setState(prevState => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: ""
        }
      ]
    }));
  }

  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
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
  }

  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spot-pop">
          <div className="spe-equ">
            <select
              className="select-text mr-3"
              name="TruckName"
              onChange={this.UITruckTypeChange.bind(this, i)}
              value={el.TruckName}
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
              value={el.Quantity}
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
                  onClick={this.removeClickTruckType.bind(this, i)}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
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

  CreateMultiCBM() {
    return this.state.cbmVal == "" ? (
      this.state.multiCBM.map((el, i) => (
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
                placeholder={el.Gross_Weight === 0 ? "GW (kg)" : "GW (kg)"}
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
                  onClick={this.removeMultiCBM.bind(this, i)}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
      ))
    ) : (
      <div className="col-md-4 m-auto">
        <div className="spe-equ">
          <input
            type="number"
            minLength={1}
            //onChange={this.HandleCMBtextChange.bind(this)}
            placeholder={this.state.modeoftransport != "AIR" ? "CBM" : "KG"}
            className="w-100"
            value={this.state.cbmVal}
          />
        </div>
      </div>
    );
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
    } else if (
      name === "Lengths" ||
      name === "Width" ||
      name === "Height" ||
      name === "GrossWt"
    ) {
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (value === "" || validNumber.test(value)) {
        if ((parseFloat(value) * 100) % 1 > 0) {
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            [name]: value
          };
        }
      }
    } else {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value === "" ? 0 : parseFloat(value)
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
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: parseFloat(decVolumeWeight.toFixed(2))
        };
      }
    } else {
      var decVolume =
        multiCBM[i].Quantity *
        ((multiCBM[i].Lengths / 100) *
          (multiCBM[i].Width / 100) *
          (multiCBM[i].Height / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: parseFloat(decVolume.toFixed(2))
      };
    }

    this.setState({ multiCBM });
  }

  HandleCMBtextChange(e) {
    var Textvalue = e.target.value;

    this.setState({ cbmVal: Textvalue });
  }

  spotRateSubmit(param) {
    debugger;
    let self = this;
    var truckTypeData = [];
    var MultiCBM = [];
    var containerdetails = [];
    var pickUpAddressDetails = [];
    var destUpAddressDetails = [];
    var dataParameter = {};
    var pickUpAddress = "";
    var destinationAddress = "";
    var originPort_ID = "";
    var destinationPort_ID = "";

    for (var i = 0; i < param.TruckTypeData.length; i++) {
      truckTypeData.push({
        TruckTypeID: parseInt(param.TruckTypeData[i].TruckName),
        TruckQty: param.TruckTypeData[i].Quantity,
        TruckDesc: param.TruckTypeData[i].TruckDesc
      });
    }
    if (param.flattack_openTop.length != 0) {
      for (var i = 0; i < param.flattack_openTop.length; i++) {
        MultiCBM.push({
          PackageType: param.flattack_openTop[i].PackageType,
          Quantity: param.flattack_openTop[i].Quantity,
          Lengths: param.flattack_openTop[i].length,
          Width: param.flattack_openTop[i].width,
          Height: param.flattack_openTop[i].height,
          GrossWt: param.flattack_openTop[i].Gross_Weight,
          VolumeWeight: param.flattack_openTop[i].total,
          Volume: 0
        });
      }
    } else {
      for (var i = 0; i < param.multiCBM.length; i++) {
        MultiCBM.push({
          PackageType: param.multiCBM[i].PackageType,
          Quantity: param.multiCBM[i].Quantity,
          Lengths: param.multiCBM[i].Lengths,
          Width: param.multiCBM[i].Width,
          Height: param.multiCBM[i].Height,
          GrossWt: param.multiCBM[i].GrossWt,
          VolumeWeight: param.multiCBM[i].VolumeWeight,
          Volume: param.multiCBM[i].Volume
        });
      }
    }

    if (param.users.length != 0) {
      for (var i = 0; i < param.users.length; i++) {
        containerdetails.push({
          ProfileCodeID: param.users[i].ProfileCodeID,
          ContainerCode: param.users[i].StandardContainerCode,
          Type: param.users[i].ContainerName,
          ContainerQuantity: param.users[i].ContainerQuantity,
          Temperature: param.users[i].Temperature,
          isSpecialEquipment: false
        });
      }
    }

    if (param.spacEqmtType.length != 0) {
      for (var i = 0; i < param.spacEqmtType.length; i++) {
        containerdetails.push({
          ProfileCodeID: param.spacEqmtType[i].ProfileCodeID,
          ContainerCode: param.spacEqmtType[i].StandardContainerCode,
          Type: param.spacEqmtType[i].ContainerName,
          ContainerQuantity: param.spacEqmtType[i].Quantity,
          Temperature: param.spacEqmtType[i].Temperature,
          isSpecialEquipment: true
        });
      }
    }

    if (param.typesofMove == "p2p") {
      // if(param.polfullAddData.length != 0)
      // {
      pickUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: ""
      });
      destUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: ""
      });
      pickUpAddress = param.fields.pol;
      destinationAddress = param.fields.pod;
      originPort_ID = param.polfullAddData.UNECECode;
      destinationPort_ID = param.podfullAddData.UNECECode;
      //   pickUpAddress
      // }
      // else{
      // pickUpAddressDetails.push({Street:param.pickUpAddress[0].Area,Country:param.pickUpAddress[0].Country,State:param.pickUpAddress[0].State,City:param.pickUpAddress[0].City,ZipCode:param.pickUpAddress[0].ZipCode})
    }
    if (param.typesofMove == "d2d") {
      pickUpAddressDetails.push({
        Street: param.pickUpAddress[0].Area,
        Country: param.pickUpAddress[0].Country,
        State: param.pickUpAddress[0].State,
        City: param.pickUpAddress[0].City,
        ZipCode: param.pickUpAddress[0].ZipCode
      });
      destUpAddressDetails.push({
        Street: param.destAddress[0].Area,
        Country: param.destAddress[0].Country,
        State: param.destAddress[0].State,
        City: param.destAddress[0].City,
        ZipCode: param.destAddress[0].ZipCode
      });
      pickUpAddress = param.puAdd;
      destinationAddress = param.DeliveryCity;
    }

    if (param.typesofMove == "d2p") {
      pickUpAddressDetails.push({
        Street: param.pickUpAddress[0].Area,
        Country: param.pickUpAddress[0].Country,
        State: param.pickUpAddress[0].State,
        City: param.pickUpAddress[0].City,
        ZipCode: param.pickUpAddress[0].ZipCode
      });
      destUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: ""
      });
      pickUpAddress = param.puAdd;
      destinationAddress = param.fields.pod;
      destinationPort_ID = param.podfullAddData.UNECECode;
    }

    if (param.typesofMove == "p2d") {
      pickUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: ""
      });
      destUpAddressDetails.push({
        Street: param.destAddress[0].Area,
        Country: param.destAddress[0].Country,
        State: param.destAddress[0].State,
        City: param.destAddress[0].City,
        ZipCode: param.destAddress[0].ZipCode
      });
      pickUpAddress = param.fields.pol;
      destinationAddress = param.DeliveryCity;
      originPort_ID = param.polfullAddData.UNECECode;
    }

    // if(param.podfullAddData.length != 0)
    // {
    //   destUpAddressDetails.push({Street:'',Country:'',State:'',City:'',ZipCode:''})
    // }
    // else
    // {
    //   destUpAddressDetails.push({Street:param.destAddress[0].Area,Country:param.destAddress[0].Country,State:param.destAddress[0].State,City:param.destAddress[0].City,ZipCode:param.destAddress[0].ZipCode})
    // }

    if (param.containerLoadType == "AIR" || param.containerLoadType == "FCL") {
      dataParameter = {
        Mode: param.containerLoadType,
        ShipmentType: param.shipmentType,
        Inco_terms: param.incoTerms,
        TypesOfMove: param.typeofMove,
        OriginPort_ID: originPort_ID,
        DestinationPort_ID: destinationPort_ID,
        PickUpAddress: pickUpAddress,
        DestinationAddress: destinationAddress,
        Total_Weight_Unit: "Kgs",
        SalesPerson: 1452494145,
        HazMat: param.HazMat,
        ChargeableWt: param.ChargeableWeight,
        Containerdetails: containerdetails,
        // PickUpAddressDetails:{
        //   Street:'',Country:'',State:'',City:'',ZipCode:''

        //   },

        PickUpAddressDetails: pickUpAddressDetails[0],
        // DestinationAddressDetails:{Street:'',Country:'',State:'',City:'',ZipCode:''},
        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: MultiCBM,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: 1457295703,
        CommodityID: parseInt(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        BaseCurrency: param.currencyCode,
        NonStackable: 0
      };
    }
    if (param.containerLoadType == "LTL" || param.containerLoadType == "LCL") {
      dataParameter = {
        Mode: param.containerLoadType,
        ShipmentType: param.shipmentType,
        Inco_terms: param.incoTerms,
        TypesOfMove: param.typeofMove,
        OriginPort_ID: originPort_ID,
        DestinationPort_ID: destinationPort_ID,
        PickUpAddress: pickUpAddress,
        DestinationAddress: destinationAddress,
        Total_Weight_Unit: "Kgs",
        SalesPerson: 1452494145,
        HazMat: param.HazMat,
        ChargeableWt: param.ChargeableWeight,
        PickUpAddressDetails: pickUpAddressDetails[0],
        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: MultiCBM,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: 1457295703,
        CommodityID: parseInt(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        BaseCurrency: param.currencyCode,
        NonStackable: 1
      };
    }
    if (param.containerLoadType == "FTL") {
      dataParameter = {
        Mode: param.containerLoadType,
        ShipmentType: param.shipmentType,
        Inco_terms: param.incoTerms,
        TypesOfMove: param.typeofMove,
        OriginPort_ID: originPort_ID,
        DestinationPort_ID: destinationPort_ID,
        PickUpAddress: pickUpAddress,
        DestinationAddress: destinationAddress,
        Total_Weight_Unit: "Kgs",
        SalesPerson: 1452494145,
        HazMat: param.HazMat,
        ChargeableWt: param.ChargeableWeight,
        PickUpAddressDetails: pickUpAddressDetails[0],
        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: MultiCBM,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: 1457295703,
        CommodityID: parseInt(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        FTLTruckDetails: truckTypeData,
        BaseCurrency: param.currencyCode,
        NonStackable: 0
      };
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SpotRateInsertion`,
      data: dataParameter,
      // data: {
      //   Mode :param.containerLoadType,
      //   ShipmentType : param.shipmentType,
      //   Inco_terms : 'EXW',
      //   TypesOfMove : param.typeofMove,
      //   OriginPort_ID :'',
      //   DestinationPort_ID : '',
      //   PickUpAddress :param.pickUpAddress[0].City,
      //   DestinationAddress : param.destAddress[0].City,
      //   Total_Weight_Unit : 'Kgs',
      //   SalesPerson : 1452494145,
      //   HazMat  : param.HazMat,
      //   ChargeableWt : 0,

      //   PickUpAddressDetails:{
      //     Street:param.pickUpAddress[0].Area,Country:param.pickUpAddress[0].Country,State:param.pickUpAddress[0].State,City:param.pickUpAddress[0].City,ZipCode:param.pickUpAddress[0].ZipCode

      //     },
      //   DestinationAddressDetails:{Street:param.destAddress[0].Area,Country:param.destAddress[0].Country,State:param.destAddress[0].State,City:param.destAddress[0].City,ZipCode:param.destAddress[0].ZipCode}
      // ,
      // RateQueryDim:[{
      //   Quantity:0,Lengths:0,Width:0,Height:0,GrossWt:44000.00,VolumeWeight:0,Volume:0
      // }],
      // MyWayUserID:874588,
      // CompanyID:1457295703,
      // CommodityID:parseInt(param.CommodityID),
      // OriginGeoCordinates:param.OriginGeoCordinates,
      // DestGeoCordinate:param.DestGeoCordinate,
      // FTLTruckDetails:truckTypeData
      // },
      // data: {
      //   Mode :param.containerLoadType,
      //   ShipmentType : param.shipmentType,
      //   Inco_terms : 'EXW',
      //   TypesOfMove : param.typeofMove,
      //   OriginPort_ID :'',
      //   DestinationPort_ID : '',
      //   PickUpAddress :param.pickUpAddress[0].City,
      //   DestinationAddress : param.destAddress[0].City,
      //   Total_Weight_Unit : 'Kgs',
      //   SalesPerson : 1452494145,
      //   HazMat  : param.HazMat,
      //   ChargeableWt : 0,

      //   PickUpAddressDetails:{
      //     Street:param.pickUpAddress[0].Area,Country:param.pickUpAddress[0].Country,State:param.pickUpAddress[0].State,City:param.pickUpAddress[0].City,ZipCode:param.pickUpAddress[0].ZipCode

      //     },
      //   DestinationAddressDetails:{Street:param.destAddress[0].Area,Country:param.destAddress[0].Country,State:param.destAddress[0].State,City:param.destAddress[0].City,ZipCode:param.destAddress[0].ZipCode}
      // ,
      // RateQueryDim:MultiCBM,
      // MyWayUserID:874588,
      // CompanyID:1457295703,
      // CommodityID:parseInt(param.CommodityID),
      // OriginGeoCordinates:param.OriginGeoCordinates,
      // DestGeoCordinate:param.DestGeoCordinate,
      // //FTLTruckDetails:truckTypeData
      // },
      // data: {
      //   Mode :param.containerLoadType,
      //   ShipmentType : param.shipmentType,
      //   Inco_terms : param.incoTerms,
      //   TypesOfMove : param.typeofMove,
      //   OriginPort_ID :'',
      //   DestinationPort_ID : '',
      //   PickUpAddress :param.pickUpAddress[0].City,
      //   DestinationAddress : param.destAddress[0].City,
      //   Total_Weight_Unit : 'Kgs',
      //   SalesPerson : 1452494145,
      //   HazMat  : param.HazMat,
      //   ChargeableWt : 0,
      //   Containerdetails:containerdetails,

      //   PickUpAddressDetails:{
      //     Street:param.pickUpAddress[0].Area,Country:param.pickUpAddress[0].Country,State:param.pickUpAddress[0].State,City:param.pickUpAddress[0].City,ZipCode:param.pickUpAddress[0].ZipCode

      //     },
      //   DestinationAddressDetails:{Street:param.destAddress[0].Area,Country:param.destAddress[0].Country,State:param.destAddress[0].State,City:param.destAddress[0].City,ZipCode:param.destAddress[0].ZipCode}
      // ,
      // RateQueryDim:MultiCBM,
      // MyWayUserID:874588,
      // CompanyID:1457295703,
      // CommodityID:parseInt(param.CommodityID),
      // OriginGeoCordinates:param.OriginGeoCordinates,
      // DestGeoCordinate:param.DestGeoCordinate
      // //FTLTruckDetails:truckTypeData
      // },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        NotificationManager.success(response.data.Table[0].Message);

          setTimeout(function() {
              self.props.history.push("./spot-rate-table")
          }, 1000);
        // self.setState({
        //   arrLocalsCharges: response.data.Table,
        //   fltLocalCharges: response.data.Table
        // })

        // var data = [];
        // data = response.data;
        // self.setState({ bookingData: data }); ///problem not working setstat undefined
      })
      .catch(error => {
        debugger;
        console.log(error);
      });
  }
  render() {
    var i = 0;

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <NotificationContainer />
          {/* {this.state.loading === true ? (
            <div className="loader-icon"></div>
          ) : ( */}
          <div className="cls-rt no-bg min-hei-auto">
            <div className="rate-table-header">
              <div className="title-sect">
                <h2>Rate Table</h2>
              </div>
              <div className="login-fields m-0 rate-tab-drop">
                Commodity
                <select
                  className=""
                  onChange={this.filterAll}
                  style={{ marginLeft: "5px" }}
                >
                  {/* <option>Select</option> */}
                  {/* <option value="All">All</option> */}
                  {this.state.loading === true
                    ? ""
                    : this.state.commodityData.map((item, i) => (
                        <option
                          key={i}
                          value={item.id}
                          selected={item.Commodity === "FAK"}
                        >
                          {item.Commodity}
                        </option>
                      ))}
                </select>
              </div>
              <div className="rate-table-range">
                <p class="upto-days">Upto {this.state.value} days</p>
                <span className="cust-labl clr-green">Faster</span>
                <span className="cust-labl clr-red">Cheaper</span>
                <InputRange
                  formatLabel={value => `${value} DAYS`}
                  maxValue={this.state.MaxTT}
                  minValue={this.state.MinTT}
                  value={this.state.value}
                  onChange={this.HandleRangeSlider.bind(this)}
                />
              </div>
              <div className="rate-table-butn">
                <button
                  onClick={this.handleCheck.bind(this)}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </button>
                {/* <Link
                  to={{
                    pathname: "/rate-finalizing"
                  }}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </Link> */}
              </div>

              {/* {----------------------End Spot Rate Modal------------------} */}
            </div>
            <div className="rate-table-below cus-w">
              {/* cus-w */}
              <div className="row">
                <div className="col-12 col-md-5 col-lg-3 less-right-rate">
                  <div className="rate-table-left">
                    <div className="top-select d-flex justify-content-between disblo">
                      <a href="new-rate-search" className="butn btn-sizeRate">
                        {this.state.shipmentType}
                      </a>
                      <a href="new-rate-search" className="butn btn-sizeRate">
                        {this.state.modeoftransport}
                      </a>
                      <a href="new-rate-search" className="butn btn-sizeRate">
                        {this.state.containerLoadType}
                      </a>
                      <a href="new-rate-search" className="butn btn-sizeRate">
                        {this.state.typeofMove === 1
                          ? "P2P"
                          : this.state.typeofMove === 2
                          ? "D2P"
                          : this.state.typeofMove === 4
                          ? "D2D"
                          : this.state.typeofMove === 3
                          ? "P2D"
                          : ""}
                      </a>
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        {/* <div>
                          <div className="d-flex">
                            <input
                              id="door"
                              type="checkbox"
                              name="typeofMove"
                              checked={this.state.typeofMoveCheck}
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
                        </div> */}
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
                          {/* <span>50$</span> */}
                        </div>
                        {(() => {
                          if (
                            this.state.containerLoadType != "FCL" &&
                            this.state.containerLoadType != "FTL"
                          ) {
                            return (
                              <div>
                                <div className="d-flex">
                                  <input
                                    id="cont-trak"
                                    type="checkbox"
                                    name="NonStackable"
                                    checked={this.state.NonStackable}
                                  />
                                  <label htmlFor="cont-trak">
                                    NonStackable
                                  </label>
                                </div>
                                {/* <span>150$</span> */}
                              </div>
                            );
                          }
                        })()}
                        <div>
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name="Custom_Clearance"
                              checked={this.state.Custom_Clearance}
                              onChange={this.custClearToggle}
                            />
                            <label htmlFor="cust-clear">Custom Clearance</label>
                          </div>
                          {/* <span>900$</span> */}
                        </div>
                        <div className="pol-pod">
                          <span>POL</span>
                          {this.state.polFilterArray.map((mapPOL, index) => (
                            <div className="d-flex p-b-10" key={index}>
                              <input
                                id={"pol" + (index + 1)}
                                type="checkbox"
                                name="address"
                                defaultChecked={true}
                                onChange={this.toggleChangePOLPOD.bind(
                                  this,
                                  index,
                                  "POL",
                                  mapPOL.POLGeoCordinate
                                )}
                              />
                              <label htmlFor={"pol" + (index + 1)}></label>
                              <h5 htmlFor={"pol" + (index + 1)}>
                                {mapPOL.Address}
                              </h5>
                            </div>
                          ))}
                          <div className="pol-pod-maps">
                            <span className="rate-map-ovrly map-pol-lbl">
                              POL
                            </span>
                            <span
                              onClick={this.togglePOLModal}
                              className="rate-map-ovrly rate-map-plus plusImg-pdng"
                            >
                              +
                            </span>

                            <POLMaps
                              //zomePOL={this.state.zoomPOL}
                              markerPOLData={this.state.mapPositionPOL}
                              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                              containerElement={
                                <div
                                  style={{ height: `100%`, width: "100%" }}
                                />
                              }
                              mapElement={<div style={{ height: `100%` }} />}
                              loadingElement={
                                <div style={{ height: `100%` }} />
                              }
                            ></POLMaps>
                          </div>
                          {/* <div className="d-flex">
                            <input
                              id="pol-pod"
                              type="checkbox"
                              name="address"
                              checked={true}
                            />
                            <label htmlFor="pol-pod">
                              {this.state.selectaddress}
                            </label>
                          </div> */}
                          {/* <span>900$</span> */}
                        </div>
                        <div className="pol-pod">
                          <span>POD</span>

                          {this.state.podFilterArray.map((mapPOD, index) => (
                            <div className="d-flex">
                              <input
                                id={"pod" + (index + 1)}
                                type="checkbox"
                                name="address"
                                defaultChecked={true}
                                onChange={this.toggleChangePOLPOD.bind(
                                  this,
                                  index,
                                  "POD",
                                  mapPOD.PODGeoCordinate
                                )}
                              />
                              <label htmlFor={"pod" + (index + 1)}></label>
                              <h5 htmlFor={"pol" + (index + 1)}>
                                {mapPOD.Address}
                              </h5>
                            </div>
                          ))}
                          {/* <div className="d-flex">
                            <input
                              id="pol-pod"
                              type="checkbox"
                              name="address"
                              checked={true}
                            />
                            <label htmlFor="pol-pod">
                              {this.state.selectaddress}
                            </label>
                          </div> */}
                          {/* <span>900$</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="pol-pod-maps-cntr">
                      {/* <div className="pol-pod-maps">
                          <span className="rate-map-ovrly">POL</span>
                          <span
                            onClick={this.togglePOLModal}
                            className="rate-map-ovrly rate-map-plus"
                          >
                            +
                          </span>

                          <POLMaps
                            markerPOLData={this.state.mapPositionPOL}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                            containerElement={
                              <div style={{ height: `100%`, width: "100%" }} />
                            }
                            mapElement={<div style={{ height: `100%` }} />}
                            loadingElement={<div style={{ height: `100%` }} />}
                          ></POLMaps>
                        </div> */}
                      <div className="pol-pod-maps pod-maps">
                        <span className="rate-map-ovrly">POD</span>
                        <span
                          onClick={this.togglePODModal}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        <PODMaps
                          //zomePOL={this.state.zoomPOD}
                          markerPODData={this.state.markerPositionPOD}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></PODMaps>
                      </div>
                    </div>
                    <button
                      onClick={this.toggleQuant}
                      className="butn white-butn w-100 mt-0"
                    >
                      {this.state.containerLoadType === "FCL"
                        ? "Container Details"
                        : "Cargo Details"}
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-7 col-lg-9">
                  {this.state.loading === true ? (
                    <div className="position-relative h-100">
                      <div className="loader-icon"></div>
                    </div>
                  ) : this.state.RateDetails.length > 0 ? (
                    <div className="react-rate-table react-rate-tab">
                      <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Cell: ({ original, row }) => {
                                  i++;

                                  var mode = this.state.modeoftransport;
                                  var lname = "";

                                  if (row._original.lineName) {
                                    lname =
                                      row._original.lineName
                                        .replace(" ", "_")
                                        .replace("  ", "_") + ".png";
                                  }

                                  if (
                                    row._original.lineName !==
                                      "No Record Found" &&
                                    mode == "SEA" &&
                                    lname !== ""
                                  ) {
                                    return (
                                      <React.Fragment>
                                        <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                          <div className="remember-forgot rat-img d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                              checked={
                                                this.state.cSelectedRow[
                                                  original.RateLineID ==
                                                  undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID
                                                ] === true
                                              }
                                              onChange={e =>
                                                this.toggleRow(
                                                  original.RateLineID ==
                                                    undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID,
                                                  row
                                                )
                                              }
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div>
                                        <div className="rate-tab-img">
                                          <img
                                            title={row._original.lineName}
                                            src={
                                              "https://vizio.atafreight.com/MyWayFiles/OEAN_LINERS/" +
                                              lname
                                            }
                                            alt="maersk icon"
                                          />
                                        </div>
                                      </React.Fragment>
                                    );
                                  } else if (
                                    row._original.lineName !==
                                      "No Record Found" &&
                                    mode == "AIR" &&
                                    lname !== ""
                                  ) {
                                    return (
                                      <React.Fragment>
                                        <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                          <div className="remember-forgot rat-img d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                              checked={
                                                this.state.cSelectedRow[
                                                  original.RateLineID ==
                                                  undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID
                                                ] === true
                                              }
                                              onChange={e =>
                                                this.toggleRow(
                                                  original.RateLineID ==
                                                    undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID,
                                                  row
                                                )
                                              }
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div>
                                        <div className="rate-tab-img">
                                          <img
                                            title={row._original.lineName}
                                            src={
                                              "https://vizio.atafreight.com/MyWayFiles/AIR_LINERS/" +
                                              lname
                                            }
                                            alt={row._original.lineName}
                                          />
                                        </div>
                                      </React.Fragment>
                                    );
                                  } else if (
                                    row._original.lineName !==
                                      "No Record Found" &&
                                    lname === ""
                                  ) {
                                    return (
                                      <React.Fragment>
                                        <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                          <div className="remember-forgot rat-img d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                              checked={
                                                this.state.cSelectedRow[
                                                  original.RateLineID ==
                                                  undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID
                                                ] === true
                                              }
                                              onChange={e =>
                                                this.toggleRow(
                                                  original.RateLineID ==
                                                    undefined
                                                    ? original.RateLineId
                                                    : original.RateLineID,
                                                  row
                                                )
                                              }
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div>
                                        <div className="rate-tab-img">
                                          <img
                                            title={row._original.lineName}
                                            src={
                                              "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png"
                                            }
                                            alt={row._original.lineName}
                                          />
                                        </div>
                                      </React.Fragment>
                                    );
                                  } else {
                                    return (
                                      <React.Fragment>
                                        <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                          {row._original.lineName}
                                        </div>
                                      </React.Fragment>
                                    );
                                  }
                                },
                                accessor: "lineName"
                                // minWidth: 200
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POL</p>
                                      <p
                                        title={row.original.POLName}
                                        className="details-para max2"
                                      >
                                        {row.original.POLName}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "POLName",
                                //  minWidth: 175
                                filterable: true
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POD</p>
                                      <p
                                        title={row.original.PODName}
                                        className="details-para max2"
                                      >
                                        {row.original.PODName}
                                      </p>
                                    </>
                                  );
                                }
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">
                                        Transshipment Port
                                      </p>
                                      <p className="details-para">
                                        {row.original.TransshipmentPort}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "TransshipmentPort",
                                filterable: true,
                                minWidth: 114
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Free Time</p>
                                      <p className="details-para">
                                        {row.original.freeTime}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "freeTime",
                                filterable: true,
                                minWidth: 80
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Container</p>
                                      <p className="details-para">
                                        {row.original.ContainerType}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "ContainerType",
                                filterable: true
                                //minWidth: 175
                              },
                              {
                                Cell: row => {
                                  if (
                                    row.original.lineName !== "No Record Found"
                                  ) {
                                    return (
                                      <>
                                        <p className="details-title">Expiry</p>
                                        <p className="details-para">
                                          {new Date(
                                            row.original.expiryDate ||
                                              row.original.ExpiryDate
                                          ).toLocaleDateString("en-US")}
                                        </p>
                                      </>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                },
                                accessor: "expiryDate" || "ExpiryDate",
                                filterable: true,
                                minWidth: 90
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">TT (Days)</p>
                                      <p className="details-para">
                                        {row.original.TransitTime}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "TransitTime",
                                minWidth: 90
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
                                            (row.original.BaseCurrency !== null
                                              ? row.original.BaseCurrency
                                              : "")
                                          : ""}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "baseFreightFee",
                                filterable: true,
                                minWidth: 80
                              }
                            ]
                          },
                          {
                            show: false,
                            Header: "All",
                            id: "all",
                            width: 0,
                            resizable: false,
                            sortable: false,
                            filterAll: true,
                            Filter: () => {},
                            getProps: () => {
                              return {
                                // style: { padding: "0px"}
                              };
                            },
                            filterMethod: (filter, rows) => {
                              debugger;

                              const result = matchSorter(rows, filter.value, {
                                keys: ["commodities", "TransitTime"],
                                threshold: matchSorter.rankings.WORD_STARTS_WITH
                              });

                              return result;
                            }
                          }
                        ]}
                        onFilteredChange={this.onFilteredChange.bind(this)}
                        filtered={this.state.filtered}
                        defaultFilterMethod={(filter, row) =>
                          String(row[filter.RateLineID]) === filter.value
                        }
                        filterable
                        // expanded={this.state.expanded}
                        // onExpandedChange={(expand, event) => {
                        //   this.setState({
                        //     expanded: {
                        //       [event]: {}
                        //     }
                        //   });
                        // }}
                        data={this.state.tempRateDetails}
                        defaultPageSize={10}
                        className="-striped -highlight no-mid-align"
                        minRows={1}
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                minRows={1}
                                data={
                                  row.original.lineName !== "No Record Found"
                                    ? row.original.RateLineId === undefined
                                      ? this.state.RateSubDetails.filter(
                                          d =>
                                            d.RateLineID ===
                                            row.original.RateLineID
                                        )
                                      : this.state.RateSubDetails.filter(
                                          d =>
                                            d.RateLineID ===
                                            row.original.RateLineId
                                        )
                                    : this.state.RateSubDetails
                                }
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "C. Description",
                                        accessor: "ChargeDesc"
                                      },
                                      {
                                        Header: "C. Name",
                                        accessor: "ChargeCode"
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "Rate",
                                        minWidth: 70,
                                        Cell: props => (
                                          <React.Fragment>
                                            {props.original.Rate}
                                            &nbsp;
                                            {props.original.Currency}
                                          </React.Fragment>
                                        )
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "ChargeItem"
                                      },
                                      {
                                        Header: "Tax",
                                        accessor: "Tax",
                                        minWidth: 55,
                                        Cell: props => (
                                          <React.Fragment>
                                            {props.original.Tax !== 0
                                              ? props.original.Tax
                                              : ""}
                                          </React.Fragment>
                                        )
                                      },

                                      {
                                        Header: "Exrate",
                                        accessor: "Exrate"
                                      },

                                      {
                                        Cell: row => {
                                          return (
                                            <>
                                              {row.original.TotalAmount !==
                                                "" &&
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
                                showPagination={false}
                                defaultPageSize={20}
                              />
                            </div>
                          );
                        }}
                        expandedRows={true}
                      />
                      {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
                      {encryption(
                        window.localStorage.getItem("usertype"),
                        "desc"
                      ) !== "Customer" ? (
                        <p className="bottom-profit">
                          Profit -------{this.state.profitLossAmt}$ / Profit
                          Margin %{this.state.profitLossPer}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="less-left-rate">
                      <div className="spot-rate">
                        <div className="no-rate">
                          <p>No Rates Found, Ask for Spot Rates</p>
                        </div>
                        <button onClick={this.toggleSpot} className="butn">
                          Spot Rate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/*  --------------------------EquipmentType  Modal ---------------------*/}

            <Modal
              className={
                this.state.containerLoadType === "FTL"
                  ? "delete-popup text-left"
                  : "delete-popup text-left big-popup"
              }
              isOpen={this.state.modalQuant}
              centered={true}
            >
              <ModalBody>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.toggleQuant}
                >
                  <span>&times;</span>
                </button>
                <div
                  style={{
                    background: "#fff",
                    padding: "15px",
                    borderRadius: "15px"
                  }}
                >
                  {/* <img
                    src={CancelImg}
                    alt="Cancel"
                    className="cancelImgBtn"
                    onClick={this.c}
                  /> */}
                  <h3 className="mb-4 text-center">
                    {this.state.containerLoadType === "FCL"
                      ? "Equipment Types"
                      : "Cargo Details"}
                  </h3>
                  {/* <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                    <Select
                      className="rate-dropdown"
                      getOptionLabel={option => option.StandardContainerCode}
                      getOptionValue={option => option.StandardContainerCode}
                      isMulti
                      options={this.state.EquipmentType}
                      // onChange={this.equipChange.bind(this)}
                      onChange={this.newaddClick.bind(this)}
                      value={this.state.selected}
                      showNewOptionAtTop={false}
                    />
                  </div>
                  <div className="d-flex flex-wrap justify-content-center">
                    {this.NewcreateUI()}
                  </div>
                  <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                    <input
                      id="Special-equType"
                      type="checkbox"
                      className="d-none"
                      name={"Special-equType"}
                      // onChange={this.HandleSpecialEqtCheck.bind(this)}
                    />
                  </div>
                  {this.state.specialEquipment === true ? (
                    <div className="">

                      <div className="equip-plus-cntr w-100">
                        <Select
                          className="rate-dropdown"
                          getOptionLabel={option => option.SpecialContainerCode}
                          getOptionValue={option => option.SpecialContainerCode}
                          options={this.state.SpacialEqmt}
                          placeholder="Select Kind of Special Equipment"
                          onChange={this.specEquipChange}
                          // value={thi.state.spEqtSelect}
                          showNewOptionAtTop={false}
                        />
                      </div>
                      <div id="cbmInner">
                        {this.state.specialEqtSelect === true ? (
                          this.state.flattack_openTop.length > 0 ? (
                            <>{this.MultiCreateCBM()}</>
                          ) : null
                        ) : null}

                        {this.state.refertypeSelect === true ? (
                          this.state.referType.length > 0 ? (
                            <>{this.createUISpecial()}</>
                          ) : null
                        ) : null}

                        {this.state.spacEqmtTypeSelect === true ? (
                          this.state.spacEqmtType.length > 0 ? (
                            <>
                              <div className="d-flex flex-wrap justify-content-center align-items-center">
                                {this.createUIspacEqmtType()}
                              </div>
                            </>
                          ) : null
                        ) : null}
                      </div>
                    </div>
                  ) : null} */}
                  {this.state.containerLoadType === "FTL" ? (
                    this.createUITruckType()
                  ) : this.state.containerLoadType === "FCL" ? (
                    <>
                      {" "}
                      <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                        <Select
                          className="rate-dropdown"
                          getOptionLabel={option =>
                            option.StandardContainerCode
                          }
                          getOptionValue={option =>
                            option.StandardContainerCode
                          }
                          isMulti
                          options={this.state.EquipmentType}
                          // onChange={this.equipChange.bind(this)}
                          onChange={this.newaddClick.bind(this)}
                          value={this.state.selected}
                          showNewOptionAtTop={false}
                        />
                      </div>
                      <div className="d-flex flex-wrap justify-content-center">
                        {this.NewcreateUI()}
                      </div>
                      <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                        <input
                          id="Special-equType"
                          type="checkbox"
                          className="d-none"
                          name={"Special-equType"}
                          // onChange={this.HandleSpecialEqtCheck.bind(this)}
                        />
                        {/* <label htmlFor="Special-equType">Special Equipment</label> */}
                      </div>
                      {this.state.specialEquipment === true ? (
                        <div className="">
                          {/* spe-equ mt-0 */}
                          <div className="equip-plus-cntr w-100">
                            <Select
                              className="rate-dropdown"
                              getOptionLabel={option =>
                                option.SpecialContainerCode
                              }
                              getOptionValue={option =>
                                option.SpecialContainerCode
                              }
                              options={this.state.SpacialEqmt}
                              placeholder="Select Kind of Special Equipment"
                              onChange={this.specEquipChange}
                              // value={thi.state.spEqtSelect}
                              showNewOptionAtTop={false}
                            />
                          </div>
                          <div id="cbmInner">
                            {this.state.specialEqtSelect === true ? (
                              this.state.flattack_openTop.length > 0 ? (
                                <>{this.MultiCreateCBM()}</>
                              ) : null
                            ) : null}

                            {this.state.refertypeSelect === true ? (
                              this.state.referType.length > 0 ? (
                                <>{this.createUISpecial()}</>
                              ) : null
                            ) : null}

                            {this.state.spacEqmtTypeSelect === true ? (
                              this.state.spacEqmtType.length > 0 ? (
                                <>
                                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                                    {this.createUIspacEqmtType()}
                                  </div>
                                </>
                              ) : null
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    this.CreateMultiCBM()
                  )}
                  <div className="text-center">
                    <Button
                      className="butn"
                      onClick={() => {
                        this.toggleQuantQuantity(this.state);
                      }}
                    >
                      Done
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleQuant}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
            {/* {-------------------------End Equipment Type Modal---------------------------} */}
            {/* -----------------------Mutiple POL Modal  ------------------*/}

            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalPOL}
              toggle={this.togglePOLModal}
              centered={true}
            >
              <ModalBody>
                <div className="pol-mar">
                  <span style={{ color: "red" }}>{this.state.errorPOL}</span>

                  {/* <div className="rename-cntr login-fields position-relative"> */}
                  {this.createUIPOL()}

                  {/* </div> */}
                </div>
                <Button className="butn" onClick={this.toggleQuantPOLSave}>
                  Done
                </Button>
                <Button
                  className="butn cancel-butn"
                  onClick={this.togglePOLModal}
                >
                  Close
                </Button>
              </ModalBody>
            </Modal>
            {/* {----------------------End Mutiple POL Modal-----------------------} */}
            {/*-----------------------Mutiple POD Modal ------------------- */}

            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalPOD}
              toggle={this.togglePODModal}
              centered={true}
            >
              <ModalBody>
                <div className="pol-mar">
                  <span style={{ color: "red" }}>{this.state.errorPOD}</span>
                  <div>{this.createUIPOD()}</div>
                </div>
                <Button className="butn" onClick={this.toggleQuantPODSave}>
                  Done
                </Button>
                <Button
                  className="butn cancel-butn"
                  onClick={this.togglePODModal}
                >
                  Close
                </Button>
              </ModalBody>
            </Modal>
            {/* {------------------------------End Mutliple POD Modal----------------------} */}
            {/* {"-------------------------Spot Rate Modal-------------------"} */}
            <Modal
              className={
                this.state.containerLoadType === "FTL"
                  ? "delete-popup text-left spot-rate-popup pol-pod-popup"
                  : "delete-popup text-left spot-rate-popup big-popup pol-pod-popup"
              }
              isOpen={this.state.modalSpot}
              toggle={this.toggleSpot}
              centered={true}
            >
              {/* <h3 className="text-center">Add Below Details</h3> */}
              <ModalBody>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.toggleSpot}
                >
                  <span>&times;</span>
                </button>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "15px"
                  }}
                >
                  <div className="rename-cntr login-fields">
                    <label>Commodity</label>
                    <select onChange={this.filterAll}>
                      {/* <option>Select</option>
                    <option value="All">All</option> */}
                      {this.state.commodityData.map((item, i) => (
                        <option
                          key={i}
                          value={item.id}
                          selected={item.Commodity === "FAK"}
                        >
                          {item.Commodity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rename-cntr login-fields align-items-start">
                    <label>Cargo</label>
                    <div className="w-100">
                      {this.state.containerLoadType === "FTL" ? (
                        this.createUITruckType()
                      ) : this.state.containerLoadType === "FCL" ? (
                        <>
                          {" "}
                          <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                            <Select
                              className="rate-dropdown"
                              getOptionLabel={option =>
                                option.StandardContainerCode
                              }
                              getOptionValue={option =>
                                option.StandardContainerCode
                              }
                              isMulti
                              options={this.state.EquipmentType}
                              // onChange={this.equipChange.bind(this)}
                              onChange={this.newaddClick.bind(this)}
                              value={this.state.selected}
                              showNewOptionAtTop={false}
                            />
                          </div>
                          <div className="d-flex flex-wrap justify-content-center">
                            {this.NewcreateUI()}
                          </div>
                          <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                            <input
                              id="Special-equType"
                              type="checkbox"
                              className="d-none"
                              name={"Special-equType"}
                              // onChange={this.HandleSpecialEqtCheck.bind(this)}
                            />
                            {/* <label htmlFor="Special-equType">Special Equipment</label> */}
                          </div>
                          {this.state.specialEquipment === true ? (
                            <div className="">
                              {/* spe-equ mt-0 */}
                              <div className="equip-plus-cntr w-100">
                                <Select
                                  className="rate-dropdown"
                                  getOptionLabel={option =>
                                    option.SpecialContainerCode
                                  }
                                  getOptionValue={option =>
                                    option.SpecialContainerCode
                                  }
                                  options={this.state.SpacialEqmt}
                                  placeholder="Select Kind of Special Equipment"
                                  onChange={this.specEquipChange}
                                  // value={thi.state.spEqtSelect}
                                  showNewOptionAtTop={false}
                                />
                              </div>
                              <div id="cbmInner">
                                {this.state.specialEqtSelect === true ? (
                                  this.state.flattack_openTop.length > 0 ? (
                                    <>{this.MultiCreateCBM()}</>
                                  ) : null
                                ) : null}

                                {this.state.refertypeSelect === true ? (
                                  this.state.referType.length > 0 ? (
                                    <>{this.createUISpecial()}</>
                                  ) : null
                                ) : null}

                                {this.state.spacEqmtTypeSelect === true ? (
                                  this.state.spacEqmtType.length > 0 ? (
                                    <>
                                      <div className="d-flex flex-wrap justify-content-center align-items-center">
                                        {this.createUIspacEqmtType()}
                                      </div>
                                    </>
                                  ) : null
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        this.CreateMultiCBM()
                      )}
                      {/* {this.createUITruckType()} */}
                    </div>
                    {/* <select>
                    <option>Select</option>
                    <option>Select</option>
                    <option>Select</option>
                  </select> */}
                  </div>
                  <div className="text-center">
                    <Button
                      className="butn"
                      onClick={() => {
                        this.spotRateSubmit(this.state);
                        this.toggleSpot();
                      }}
                    >
                      Send
                    </Button>
                    <Button
                      className="butn"
                      onClick={this.toggleSpotCloseModal.bind(this)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
            {/* {-------------------------End Equipment Type Modal---------------------------} */}
            {/* -----------------------Mutiple POL Modal  ------------------*/}

            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalPOL}
              toggle={this.togglePOLModal}
              centered={true}
            >
              <ModalBody>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.togglePOLModal}
                >
                  <span>&times;</span>
                </button>
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "15px"
                  }}
                >
                  <div className="pol-mar">
                    <span style={{ color: "red" }}>{this.state.errorPOL}</span>

                    {/* <div className="rename-cntr login-fields position-relative"> */}
                    {this.createUIPOL()}

                    {/* </div> */}
                  </div>
                  <Button className="butn" onClick={this.toggleQuantPOLSave}>
                    Done
                  </Button>
                  <Button
                    className="butn cancel-butn"
                    onClick={this.togglePOLModal}
                  >
                    Close
                  </Button>
                </div>
              </ModalBody>
            </Modal>
            {/* {----------------------End Mutiple POL Modal-----------------------} */}
            {/*-----------------------Mutiple POD Modal ------------------- */}

            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalPOD}
              toggle={this.togglePODModal}
              centered={true}
            >
              <ModalBody>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.togglePODModal}
                >
                  <span>&times;</span>
                </button>
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "15px"
                  }}
                >
                  <div className="pol-mar">
                    <span style={{ color: "red" }}>{this.state.errorPOD}</span>
                    <div>{this.createUIPOD()}</div>
                  </div>
                  <Button className="butn" onClick={this.toggleQuantPODSave}>
                    Done
                  </Button>
                  <Button
                    className="butn cancel-butn"
                    onClick={this.togglePODModal}
                  >
                    Close
                  </Button>
                </div>
              </ModalBody>
            </Modal>
            {/* {------------------------------End Mutliple POD Modal----------------------} */}
            {/* {"-------------------------Spot Rate Modal-------------------"} */}
            <Modal
              className={
                this.state.containerLoadType === "FTL"
                  ? "delete-popup text-left spot-rate-popup pol-pod-popup"
                  : "delete-popup text-left spot-rate-popup big-popup pol-pod-popup"
              }
              isOpen={this.state.modalSpot}
              toggle={this.toggleSpot}
              centered={true}
            >
              {/* <h3 className="text-center">Add Below Details</h3> */}
              <ModalBody>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.toggleSpot}
                >
                  <span>&times;</span>
                </button>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "15px"
                  }}
                >
                  <div className="rename-cntr login-fields">
                    <label>Commodity</label>
                    <select onChange={this.filterAll}>
                      {/* <option>Select</option>
                    <option value="All">All</option> */}
                      {this.state.commodityData.map((item, i) => (
                        <option
                          key={i}
                          value={item.id}
                          selected={item.Commodity === "FAK"}
                        >
                          {item.Commodity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rename-cntr login-fields align-items-start">
                    <label>Cargo</label>
                    <div className="w-100">
                      {this.state.containerLoadType === "FTL" ? (
                        this.createUITruckType()
                      ) : this.state.containerLoadType === "FCL" ? (
                        <>
                          {" "}
                          <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                            <Select
                              className="rate-dropdown"
                              getOptionLabel={option =>
                                option.StandardContainerCode
                              }
                              getOptionValue={option =>
                                option.StandardContainerCode
                              }
                              isMulti
                              options={this.state.EquipmentType}
                              // onChange={this.equipChange.bind(this)}
                              onChange={this.newaddClick.bind(this)}
                              value={this.state.selected}
                              showNewOptionAtTop={false}
                            />
                          </div>
                          <div className="d-flex flex-wrap justify-content-center">
                            {this.NewcreateUI()}
                          </div>
                          <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                            <input
                              id="Special-equType"
                              type="checkbox"
                              className="d-none"
                              name={"Special-equType"}
                              // onChange={this.HandleSpecialEqtCheck.bind(this)}
                            />
                            {/* <label htmlFor="Special-equType">Special Equipment</label> */}
                          </div>
                          {this.state.specialEquipment === true ? (
                            <div className="">
                              {/* spe-equ mt-0 */}
                              <div className="equip-plus-cntr w-100">
                                <Select
                                  className="rate-dropdown"
                                  getOptionLabel={option =>
                                    option.SpecialContainerCode
                                  }
                                  getOptionValue={option =>
                                    option.SpecialContainerCode
                                  }
                                  options={this.state.SpacialEqmt}
                                  placeholder="Select Kind of Special Equipment"
                                  onChange={this.specEquipChange}
                                  // value={thi.state.spEqtSelect}
                                  showNewOptionAtTop={false}
                                />
                              </div>
                              <div id="cbmInner">
                                {this.state.specialEqtSelect === true ? (
                                  this.state.flattack_openTop.length > 0 ? (
                                    <>{this.MultiCreateCBM()}</>
                                  ) : null
                                ) : null}

                                {this.state.refertypeSelect === true ? (
                                  this.state.referType.length > 0 ? (
                                    <>{this.createUISpecial()}</>
                                  ) : null
                                ) : null}

                                {this.state.spacEqmtTypeSelect === true ? (
                                  this.state.spacEqmtType.length > 0 ? (
                                    <>
                                      <div className="d-flex flex-wrap justify-content-center align-items-center">
                                        {this.createUIspacEqmtType()}
                                      </div>
                                    </>
                                  ) : null
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        this.CreateMultiCBM()
                      )}
                      {/* {this.createUITruckType()} */}
                    </div>
                    {/* <select>
                    <option>Select</option>
                    <option>Select</option>
                    <option>Select</option>
                  </select> */}
                  </div>
                  <div className="text-center">
                    <Button
                      className="butn"
                      onClick={() => {
                        this.spotRateSubmit(this.state);
                        this.toggleSpot();
                      }}
                    >
                      Send
                    </Button>
                    <Button
                      className="butn"
                      onClick={this.toggleSpotCloseModal.bind(this)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </Modal>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}

export default RateTable;

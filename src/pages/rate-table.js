import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Button, Modal, ModalBody } from "reactstrap";
import ReactTable from "react-table";
import Select from "react-select";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import ReactAutocomplete from "react-autocomplete";
import matchSorter from "match-sorter";
import { encryption } from "../helpers/encryption";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Comman from "../helpers/Comman";

const { compose } = require("recompose");
const POLMaps = compose(
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    center={
      props.markerPOLData
        ? props.markerPOLData[props.markerPOLData.length - 1]
        : { lat: parseFloat(32.24165126), lng: parseFloat(77.78319374) }
    }
  >
    {props.markerPOLData.map((marker, i) => {
      return (
        <Marker
          key={i}
          position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
        ></Marker>
      );
    })}
  </GoogleMap>
));
const PODMaps = compose(
  withScriptjs,
  withGoogleMap
)((props) => (
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
      MaxTT: 0,
      isViewRate: false,
      RatequeryID: 0,
      IsSearchFromSpotRate: 0,
      MinAmt: 0,
      MaxAmt: 0,
      valueAmt: 0,
      minDays: 0,
      minamount: 0,
      spolAddress: "",
      spodAddress: "",
      cmbTypeRadio: "",
      packageTypeData: [],
      Company: "",
      selectedCurrency: "",
      usertype: "",
      customerData: [],
      error: "",
      fields: {},
      isNotData: "",
      sloding: false,
      commodityname: "",
      mywaycomment: "",
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
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.spotRateSubmit = this.spotRateSubmit.bind(this);
    this.toggleQuantPOLSave = this.toggleQuantPOLSave.bind(this);
    this.toggleQuantPODSave = this.toggleQuantPODSave.bind(this);
    this.toggleQuantQuantity = this.toggleQuantQuantity.bind(this);
    this.BindTruckTypeData = this.BindTruckTypeData.bind(this);
  }

  BindTruckTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/TruckTypeListDropdown`,

      headers: authHeader(),
    }).then(function (response) {
      var data = response.data.Table;
      self.setState({ TruckType: data });
    });
  }
  componentDidMount() {
    setTimeout(() => {
      this.BindTruckTypeData();
      this.HandleCommodityData();
      this.HandlePackgeTypeData();
    }, 100);

    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state !== null) {
        var isSearch = this.props.location.state.isSearch;
        if (isSearch) {
          var paramData = this.props.location.state;
          var spolAddress = paramData.POL;
          var spodAddress = paramData.POD;
          var multiCBM = paramData.multiCBM;
          var specialEquipment = paramData.specialEquipment;
          this.setState({ multiCBM, specialEquipment });

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
              IsFilter: true,
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
              IsFilter: true,
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
              Address:
                paramData.fields.pol == ""
                  ? paramData.polfullAddData.OceanPortLongName
                  : paramData.fields.pol,
              IsFilter: true,
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
              Address:
                paramData.fields.pod == ""
                  ? paramData.podfullAddData.OceanPortLongName
                  : paramData.fields.pod,
              IsFilter: true,
            });
          }
          if (paramData.typesofMove === "d2p") {
            this.state.polArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true,
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
              IsFilter: true,
            });
            this.state.polFilterArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true,
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
              IsFilter: true,
            });
          }
          if (paramData.typesofMove === "d2d") {
            this.state.polArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true,
            });
            this.state.podArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true,
            });
            this.state.polFilterArray.push({
              POL: "",
              POLGeoCordinate: paramData.OriginGeoCordinates,
              Address: paramData.puAdd,
              IsFilter: true,
            });
            this.state.podFilterArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true,
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
              IsFilter: true,
            });
            this.state.podArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true,
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
              IsFilter: true,
            });
            this.state.podFilterArray.push({
              POD: "",
              PODGeoCordinate: paramData.DestGeoCordinate,
              Address: paramData.DeliveryCity,
              IsFilter: true,
            });
          }

          this.state.flattack_openTop = paramData.flattack_openTop;
          this.state.CommodityID = paramData.CommodityID || 49;
          this.state.RatequeryID =
            paramData.isViewRate == true ? paramData.RatequeryID : 0;
          this.state.IsSearchFromSpotRate =
            paramData.isViewRate == true ? 1 : 0;
          this.state.typeofMove = paramData.typeofMove;
          this.state.modeoftransport = paramData.modeoftransport;
          this.state.shipmentType = paramData.shipmentType;
          this.state.HazMat = paramData.HazMat;
          this.state.NonStackable = paramData.NonStackable;
          this.state.Custom_Clearance =
            paramData.Custom_Clearance == undefined
              ? false
              : paramData.Custom_Clearance;
          this.state.containerLoadType = paramData.containerLoadType;
          this.state.users = paramData.users;
          var Customer = paramData.Customer;
          var cbmVal = paramData.cbmVal;

          this.setState({
            CommodityID: this.state.CommodityID,
            cbmVal,
            Customer,
            cmbTypeRadio: paramData.cmbTypeRadio,
            polArray: this.state.polArray,
            podArray: this.state.podArray,
            polFilterArray: this.state.polFilterArray,
            podFilterArray: this.state.podFilterArray,
            flattack_openTop: this.state.flattack_openTop,

            isViewRate: paramData.isViewRate,
            RatequeryID:
              paramData.isViewRate == true ? paramData.RatequeryID : 0,
            IsSearchFromSpotRate: paramData.isViewRate == true ? 1 : 0,
            typeofMove: paramData.typeofMove,
            modeoftransport: paramData.modeoftransport,
            shipmentType: paramData.shipmentType,
            HazMat: paramData.HazMat,
            NonStackable: paramData.NonStackable,
            Custom_Clearance:
              paramData.Custom_Clearance == undefined
                ? false
                : paramData.Custom_Clearance,
            containerLoadType: paramData.containerLoadType,
            users: paramData.users,
          });
          if (this.props.location.state.PageName) {
            var polAddress = paramData.polfullAddData;
            var podAddress = paramData.podfullAddData;

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
              if (
                mapPositionPOL !== null &&
                typeof mapPositionPOL !== "undefined"
              ) {
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
              if (
                mapPositionPOD !== null &&
                typeof mapPositionPOD !== "undefined"
              ) {
                podmarkerData.push(mapPositionPOD);
              }
            }

            var polFilterArray = [];
            polFilterArray.push(polAddress);
            var podFilterArray = [];
            podFilterArray.push(podAddress);

            // this.state.multiCBM = this.props.location.state.multiCBM;
            var currencyCode = paramData.currencyCode;
            var RatequeryID = this.props.location.state.RatequeryID;
            this.setState({
              polFilterArray,
              podFilterArray,
              RatequeryID,
              spolAddress,
              spodAddress,
              currencyCode,
              mapPositionPOL: polmarkerData,
              markerPositionPOD: podmarkerData,
              polfullAddData: paramData.polfullAddData,
              podfullAddData: paramData.podfullAddData,
            });
            this.HandleMultiPOLPODFilter();
          } else {
            this.HandleRateDetailsFCL(paramData);
          }
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
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
    }
  }
  togglePODModal() {
    this.setState({
      modalPOD: !this.state.modalPOD,
      multiFields: {},
      errorPOD: "",
      polpodDataAdd: [],
    });
  }
  togglePOLModal() {
    this.setState({
      modalPOL: !this.state.modalPOL,
      multiFields: {},
      errorPOL: "",
      polpodDataAdd: [],
    });
  }
  toggleQuant() {
    this.setState((prevState) => ({
      modalQuant: !prevState.modalQuant,
    }));
  }

  toggleQuantQuantity(paramData) {
    this.setState((prevState) => ({
      modalQuant: !prevState.modalQuant,
    }));
    this.HandleRateDetailsFCL(paramData);
  }

  toggleQuantPOLSave() {
    this.state.polFilterArray = this.state.polArray;
    this.setState(() => ({
      loading: true,
      polFilterArray: this.state.polFilterArray,
      modalPOL: !this.state.modalPOL,
      //modalQuant: !prevState.modalQuant
    }));
    // }

    this.HandleMultiPOLPODFilter();
  }

  toggleQuantPODSave() {
    this.state.podFilterArray = this.state.podArray;
    this.setState(() => ({
      loading: true,
      podFilterArray: this.state.podFilterArray,
      modalPOD: !this.state.modalPOD,
      //modalQuant: !prevState.modalQuant
    }));
    // }

    this.HandleMultiPOLPODFilter();
  }

  HandleMultiPOLPODFilter() {
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
    var polArray = "";
    var podArray = "";
    var usersArray = "";
    if (this.props.location.state.spotrateresponseTbl1 == undefined) {
      for (var i = 0; i < this.state.polFilterArray.length; i++) {
        if (this.state.polFilterArray[i].IsFilter == true) {
          multiPOL.push({
            POL: this.state.polFilterArray[i].POL,
            POLGeoCordinate: this.state.polFilterArray[i].POLGeoCordinate,
          });
        }
      }
      for (var i = 0; i < this.state.podFilterArray.length; i++) {
        if (this.state.podFilterArray[i].IsFilter == true) {
          multiPOD.push({
            POD: this.state.podFilterArray[i].POD,
            PODGeoCordinate: this.state.podFilterArray[i].PODGeoCordinate,
          });
        }
      }
    } else {
      var sdata = this.props.location.state.spotrateresponseTbl1;
      for (var i = 0; i < sdata.length; i++) {
        if (!polArray.includes(sdata[i].OriginPort_ID)) {
          polArray += sdata[i].OriginPort_ID + ",";
          multiPOL.push({
            POL: sdata[i].OriginPort_ID,
            POLGeoCordinate: sdata[i].POLGeoCordinate,
          });
        }
      }
      for (var i = 0; i < sdata.length; i++) {
        if (!podArray.includes(sdata[i].DestinationPort_ID)) {
          podArray += sdata[i].DestinationPort_ID + ",";
          multiPOD.push({
            POD: sdata[i].DestinationPort_ID,
            PODGeoCordinate: sdata[i].PODGeoCordinate,
          });
        }
      }
    }

    if (this.state.users.length != 0) {
      for (var i = 0; i < this.state.users.length; i++) {
        if (!usersArray.includes(this.state.users[i].StandardContainerCode)) {
          usersArray += this.state.users[i].StandardContainerCode + ",";
          containerdetails.push({
            ProfileCodeID: this.state.users[i].ProfileCodeID,
            ContainerCode: this.state.users[i].StandardContainerCode,
            Type: this.state.users[i].ContainerName,
            ContainerQuantity: this.state.users[i].ContainerQuantity,
            Temperature: this.state.users[i].Temperature,
            TemperatureType: "",
          });
        }
      }
    }

    var compID = 0;
    var baseCurrency = "";
    var multiCBM;
    var multiCBMData = [];

    if (this.props.location.state.isViewRate) {
      multiCBM = this.props.location.state.spotrateresponseTbl3;

      for (let i = 0; i < multiCBM.length; i++) {
        var ObjMultiCMB = new Object();
        ObjMultiCMB.PackageType = multiCBM[i].PackageType || "";
        ObjMultiCMB.Quantity = multiCBM[i].Quantity || 0;
        ObjMultiCMB.Lengths = multiCBM[i].Lengths || 0;
        ObjMultiCMB.Width = multiCBM[i].Width || 0;
        ObjMultiCMB.Height = multiCBM[i].Height || 0;
        ObjMultiCMB.GrossWt = multiCBM[i].GrossWt || 0;
        ObjMultiCMB.VolumeWeight = multiCBM[i].VolumeWT || 0;
        ObjMultiCMB.Volume = multiCBM[i].Volume || 0;
        multiCBMData.push(ObjMultiCMB);
      }
      this.setState({ multiCBM: multiCBMData });
    } else {
      multiCBMData = this.state.multiCBM;
      this.setState({ multiCBM: multiCBMData });
    }

    this.setState({ loading: true });
    var incoTerms = this.props.location.state.incoTerms;
    this.setState({ incoTerms });
    if (this.props.location.state.companyId) {
      compID = this.props.location.state.companyId;
      this.setState({ companyId: compID });
    } else {
      compID = this.props.location.state.CustomerID;
      this.setState({ companyId: compID });
    }
    if (this.state.currencyCode !== "") {
      baseCurrency = this.state.currencyCode;
      this.setState({ currencyCode: baseCurrency });
    } else {
      baseCurrency = this.props.location.state.currencyCode;
      this.setState({ currencyCode: baseCurrency });
    }
    
    var newcurrencyCode = window.localStorage.getItem("currencyCode");
    var NewselectedCurrency = "";

    if (newcurrencyCode) {
      if (this.state.currencyCode === newcurrencyCode) {
        NewselectedCurrency = this.state.currencyCode;
      } else {
        NewselectedCurrency = newcurrencyCode;
      }
    } else {
      NewselectedCurrency = this.state.currencyCode;
    }

    this.setState({ currencyCode: NewselectedCurrency });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQueryMutiplePOD`,
      data: {
        CustomerId: compID,
        BaseCurrency: NewselectedCurrency,
        QuoteType: this.state.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: this.state.shipmentType,
        TypeOfMove: this.state.typeofMove,
        Containerdetails: containerdetails,
        Currency: this.state.currencyCode,
        MultiplePOL: multiPOL,
        MultiplePOD: multiPOD,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        RateQueryDim: multiCBMData,
        Commodity: this.state.CommodityID,
        CustomerId: compID,
        Chargeableweight: parseFloat(this.state.cbmVal || 0),
        PickUpAddressDetails: {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0,
        },
        DestinationAddressDetails: {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0,
        },

        HazMat: this.state.HazMat == true ? 1 : 0,
        CustomClearance: this.state.Custom_Clearance == true ? 1 : 0,
        NonStackable: this.state.NonStackable == true ? 1 : 0,
        IsSearchFromSpotRate: this.state.IsSearchFromSpotRate,
        RatequeryID: this.state.RatequeryID,
      },
      headers: authHeader(),
    })
      .then(function (response) {
        var ratetable = response.data.Table;
        var ratetable1 = response.data.Table1;
        var commodityData = response.data.Table2;

        if (ratetable.length > 0) {
          if (commodityData.length > 0) {
            self.setState({ commodityData });
          }
          if (ratetable != null) {
            var commodityname = ratetable[0].Commodity;
            var MinTTArray = [];
            var MaxTTArray = [];
            var AmtArray = [];
            for (let i = 0; i < ratetable.length; i++) {
              MinTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[0]));
              MaxTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[1]));
              AmtArray.push(ratetable[i].TotalAmount);
              //MaxAmtArray.push(ratetable[i].TotalAmount);
            }

            self.setState({
              RateDetails: ratetable,
              tempRateDetails: ratetable,
              loading: false,
              // commodityData,
              MinTT: Math.min(...MinTTArray),
              MaxTT: Math.max(...MaxTTArray),
              MinAmt: Math.min(...AmtArray),
              MaxAmt: Math.max(...AmtArray),
              value: Math.max(...MaxTTArray),
              valueAmt: Math.max(...AmtArray),
            });
          }
          if (ratetable1 != null) {
            self.setState({
              RateSubDetails: ratetable1,
            });
          }
        } else {
          self.setState({
            // RateDetails:[],
            // RateSubDetails:[],
            loading: false,
          });
        }
      })
      .catch((response) => {
        // self.setState({ loading: false, RateDetails: [], RateSubDetails: [] });
        self.setState({ loading: false });
      });
    // // }
  }

  handleCheck() {
    
    if (this.state.selectedDataRow.length != 0) {
      
      if (this.state.isNotData !== "") {
        var data = this.state.isNotData.split(",");

        if (data.length > 0) {
          for (let j = 0; j < data.length; j++) {
            for (let k = 0; k < this.state.Containerdetails.length; k++) {
              if (
                this.state.Containerdetails[k].ContainerName === data[j].trim()
              ) {
                this.state.Containerdetails.splice(k, 1);
                break;
              }
            }
            if (this.state.referType.length > 0) {
              for (let k = 0; k < this.state.referType.length; k++) {
                if (this.state.referType[k].ContainerName === data[j].trim()) {
                  this.state.referType.splice(k, 1);
                  break;
                }
              }
            }
            // if (this.state.flattack_openTop.length > 0) {
            //   for (let k = 0; k < this.state.Containerdetails.length; k++) {
            //     for (let j = 0; j < this.state.flattack_openTop.length; j++) {
            //       if (
            //         this.state.flattack_openTop[j].ContainerName ===
            //         this.state.Containerdetails[k].ContainerName
            //       ) {
            //         this.setState({
            //           flattack_openTop: this.state.flattack_openTop,
            //         });
            //       } else {
            //         this.setState({
            //           // flattack_openTop: [],
            //         });
            //       }
            //     }
            //   }
            // }
          }
        }

        this.setState({
          Containerdetails: this.state.Containerdetails,
          referType: this.state.referType,
          // flattack_openTop: this.state.flattack_openTop,
        });
        setTimeout(() => {
          this.props.history.push({
            pathname: "rate-finalizing",
            state: this.state,
          });
        }, 1000);
      } else {
        this.props.history.push({
          pathname: "rate-finalizing",
          state: this.state,
        });
      }
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select atleast one Rate",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  toggleRow(RateLineID, rowData) {
    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[RateLineID] = !this.state.cSelectedRow[RateLineID];
    var BuyRate = 0;
    this.setState({
      cSelectedRow: RateLineID ? newSelected : false,
    });
    var selectedRow = [];
    var rateSubDetails = this.state.RateSubDetails.filter(
      (d) => d.RateLineID === RateLineID
    );
    var profitLossAmt = 0;
    var profitLossAmt1 = this.state.profitLossAmt;
    var profitLossPer = 0;
    var profitLossPer1 = this.state.profitLossPer;

    var aTotalAmount = 0;
    var nTotalAmount = 0;
    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData._original);

      for (let j = 0; j < rateSubDetails.length; j++) {
        profitLossAmt +=
          rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
        // BuyRate += rateSubDetails[j].BuyRate;
      }

      var total = rowData._original.TotalAmount;

      profitLossPer = (profitLossAmt * 100) / total;
      var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

      var finalprofitLossPer = profitLossPer;

      this.setState({
        selectedDataRow: selectedRow,
        profitLossAmt: finalprofitLossAmt,
        profitLossPer: finalprofitLossPer,
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

          selectedRow = this.state.selectedDataRow;
          selectedRow.push(rowData._original);

          for (let j = 0; j < rateSubDetails.length; j++) {
            profitLossAmt +=
              rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
            BuyRate += rateSubDetails[j].BuyRate;
          }
          break;
          // }
        }

        if (selectedRow.length > 0) {
          aTotalAmount = selectedRow.reduce(function (prev, cur) {
            return prev + cur.TotalAmount;
          }, 0);
        } else {
          aTotalAmount = 0;
        }

        nTotalAmount = aTotalAmount;
        var finalprofitLossAmt = profitLossAmt + profitLossAmt1;
        profitLossPer = (finalprofitLossAmt * 100) / nTotalAmount;
        var finalprofitLossPer = profitLossPer;
        this.setState({
          profitLossAmt: finalprofitLossAmt,
          profitLossPer: finalprofitLossPer,
        });
      } else {
        var RateLineID = 0;
        if (rowData._original.RateLineID) {
          RateLineID = rowData._original.RateLineID;
        } else {
          RateLineID = rowData._original.RateLineId;
        }
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (this.state.selectedDataRow[i].RateLineId === RateLineID) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.splice(i, 1);

            for (let j = 0; j < rateSubDetails.length; j++) {
              profitLossAmt +=
                rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
              BuyRate += rateSubDetails[j].BuyRate;
            }

            break;
          }
        }
        if (selectedRow.length > 0) {
          aTotalAmount = selectedRow.reduce(function (prev, cur) {
            return prev + cur.TotalAmount;
          }, 0);
        } else {
          aTotalAmount = 0;
        }
        nTotalAmount = aTotalAmount;
        var finalprofitLossAmt = profitLossAmt1 - profitLossAmt;
        if (nTotalAmount > 0) {
          profitLossPer = (finalprofitLossAmt * 100) / nTotalAmount;
        } else {
          profitLossPer = 0;
        }

        var finalprofitLossPer = profitLossPer;
        this.setState({
          profitLossAmt: finalprofitLossAmt,
          profitLossPer: finalprofitLossPer,
        });
      }
    }
    this.setState({
      selectedDataRow: selectedRow,
    });
  }

  checkSelection(evt, row) {
    let tempRate = this.state.RateDetails;
    tempRate[row.index].checkbx = evt.target.checked;
    this.setState({ RateDetails: tempRate });
  }

  HandleRateDetailsFCL(paramData) {
    var dataParameter = {};
    var pickUpAddress = {
      Street: "",
      Country: "",
      State: "",
      City: "",
      ZipCode: "",
    };
    var destUpAddress = {
      Street: "",
      Country: "",
      State: "",
      City: "",
      ZipCode: "",
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

      var containerdetails = [];
      /////Equipment
      if (paramData.users.length > 0) {
        for (let j = 0; j < paramData.users.length; j++) {
          containerdetails.push(paramData.users[j]);
        }
      }

      /////Equipment flattack_openTop RateQueryDIM

      var RateQueryData = [];
      if (paramData.containerLoadType === "FCL") {
        if (paramData.flattack_openTop.length > 0) {
          for (let j = 0; j < paramData.flattack_openTop.length; j++) {
            RateQueryData.push(paramData.flattack_openTop[j]);
          }
        } else {
          RateQueryData = paramData.multiCBM;
        }
      } else {
        RateQueryData = paramData.multiCBM;
      }

      /////Equipment referType
      if (paramData.referType.length > 0) {
        for (let j = 0; j < paramData.referType.length; j++) {
          containerdetails.push(paramData.referType[j]);
        }
      }

      /////Equipment spacEqmtType
      if (paramData.spacEqmtType.length > 0) {
        for (let j = 0; j < paramData.spacEqmtType.length; j++) {
          containerdetails.push(paramData.spacEqmtType[j]);
        }
      }

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

      this.setState({
        mapPositionPOL: polmarkerData,
        markerPositionPOD: podmarkerData,
        users: paramData.users,
        selected: paramData.selected,
      });

      var selectedPOL =
        paramData.polfullAddData.NameWoDiacritics || paramData.PickupCity;
      var SelectPOD =
        paramData.podfullAddData.NameWoDiacritics || paramData.DeliveryCity;
      var selectedPOLPOD = selectedPOL + " To " + SelectPOD;

      var cmbvalue = paramData.cbmVal;
      if (cmbvalue != "") {
        cmbvalue = parseFloat(cmbvalue);
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

      var currencyCode = this.state.currencyCode;
      var newcurrencyCode = window.localStorage.getItem("currencyCode");
      var NewselectedCurrency = "";

      if (newcurrencyCode) {
        if (currencyCode === newcurrencyCode) {
          NewselectedCurrency = this.state.currencyCode;
        } else {
          NewselectedCurrency = newcurrencyCode;
        }
      } else {
        NewselectedCurrency = this.state.currencyCode;
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
        Currency: NewselectedCurrency,

        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
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
        dataParameter.RateQueryDim = RateQueryData;
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
      dataParameter.CustomerId = parseInt(paramData.companyId) || 0;
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

      var incoTerms = paramData.incoTerms;

      this.setState({
        multiCBM: paramData.multiCBM,
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
        flattack_openTop: RateQueryData,
        spacEqmtTypeSelect: paramData.spacEqmtTypeSelect,
        specialEqtSelect: paramData.specialEqtSelect,
        refertypeSelect: paramData.refertypeSelect,
        specialEquipment: paramData.specialEquipment,
        incoTerms,
        polfullAddData: paramData.polfullAddData,
        podfullAddData: paramData.podfullAddData,
        currencyCode: NewselectedCurrency,
        TruckType: paramData.TruckType,
        TruckTypeData: paramData.TruckTypeData,

        pickUpAddress: paramData.fullAddressPOL,
        destAddress: paramData.fullAddressPOD,
        multiCBM: RateQueryData,
        packageTypeData: paramData.packageTypeData,
        fields: paramData.fields,
        puAdd: paramData.puAdd,
        DeliveryCity: paramData.DeliveryCity,
        typesofMove: paramData.typesofMove,

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
        contactEmail: paramData.contactEmail,
        loading: true,
      });
    }

    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: dataParameter,
      headers: authHeader(),
    })
      .then(function (response) {
        var ratetable = response.data.Table;
        var ratetable1 = response.data.Table1;
        var ratetable2 = response.data.Table2;

        if (response.data.Table3) {
          var isNotData = response.data.Table3[0].Message;
          self.setState({ isNotData });
          if (isNotData !== "") {
            store.addNotification({
              // title: "Error",
              message: "Record Not Found " + isNotData,
              type: "warning", // 'default', 'success', 'info', 'warning','danger'
              container: "top-right", // where to position the notifications
              dismiss: {
                duration: appSettings.NotficationTime,
              },
            });
          }
        }

        if (ratetable.length > 0) {
          if (ratetable2.length > 0) {
            self.setState({ commodityData: ratetable2 });
          }
          if (ratetable != null) {
            var MinTTArray = [];
            var MaxTTArray = [];
            var AmtArray = [];
            for (let i = 0; i < ratetable.length; i++) {
              MinTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[0]));
              MaxTTArray.push(parseInt(ratetable[i].TransitTime.split("-")[1]));
              AmtArray.push(ratetable[i].TotalAmount);
            }

            self.setState({
              RateDetails: ratetable,
              tempRateDetails: ratetable,
              MinTT: Math.min(...MinTTArray),
              MaxTT: Math.max(...MaxTTArray),
              MinAmt: Math.min(...AmtArray),
              MaxAmt: Math.max(...AmtArray),
              value: Math.max(...MaxTTArray),
              valueAmt: Math.max(...AmtArray),
            });
          }
          if (ratetable1 != null) {
            self.setState({
              RateSubDetails: ratetable1,
            });
          }
        } else {
          self.setState({
            tempRateDetails: [{ lineName: "No Record Found" }],
            RateSubDetails: [{ ChargeDesc: "No Record Found" }],
            loading: false,
            MinTT: 0,
            MaxTT: 0,
            MinAmt: 0,
            MaxAmt: 0,
            value: 0,
            valueAmt: 0,
          });
        }

        self.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response) {
          var temperror = error.response.data;
          var err = temperror.split(":");
          store.addNotification({
            // title: "Error",
            message: err[1].replace("}", ""),
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime,
            },
          });
        }

        self.setState({ loading: false });
      });
  }

  toggleChangePOLPOD(i, field, geoCoordinate) {
    if (field == "POL") {
      this.state.polFilterArray[i].IsFilter = !this.state.polFilterArray[i]
        .IsFilter;
      if (this.state.polFilterArray[i].IsFilter == true) {
        this.state.mapPositionPOL.push({
          lat: Number(geoCoordinate.split(",")[0]),
          lng: Number(geoCoordinate.split(",")[1]),
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
        mapPositionPOL: this.state.mapPositionPOL,
      });
    } else {
      this.state.podFilterArray[i].IsFilter = !this.state.podFilterArray[i]
        .IsFilter;
      if (this.state.podFilterArray[i].IsFilter == true) {
        this.state.markerPositionPOD.push({
          lat: Number(geoCoordinate.split(",")[0]),
          lng: Number(geoCoordinate.split(",")[1]),
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
        markerPositionPOD: this.state.markerPositionPOD,
      });
    }

    this.HandleMultiPOLPODFilter();
  }

  HandleDocumentView(row) {
    var rowDataAry = [];
    var rowDataObj = row.original;
    rowDataAry.push(rowDataObj);

    this.setState({ checkSelection: rowDataAry });
  }

  addClickPOL() {
    this.setState((prevState) => ({
      valuesPOL: [
        ...prevState.valuesPOL,
        {
          POL: "",
        },
      ],
    }));
  }
  addClickPOD() {
    this.setState((prevState) => ({
      valuesPOD: [
        ...prevState.valuesPOD,
        {
          POD: "",
        },
      ],
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
                getItemValue={(item) => item.AirportLongName}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.AirPortID}
                  >
                    {item.AirportLongName}
                  </div>
                )}
                renderInput={function (props) {
                  return (
                    <input
                      id={"POLid" + (index + 1)}
                      placeholder="Enter POL"
                      className="w-100"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePOLPODAutosearch.bind(
                  this,
                  "pol" + (index + 1),
                  index + 1
                )}
                onSelect={this.HandleAddressDropdownPolSelect.bind(
                  this,
                  (item) => item.NameWoDiacritics,
                  "pol" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pol" + (index + 1)]}
              />
            ) : (
              <ReactAutocomplete
                getItemValue={(item) => item.Address}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.Address}
                  >
                    {item.Address}
                  </div>
                )}
                renderInput={function (props) {
                  return (
                    <input
                      placeholder="Enter PU Address"
                      className="w-100 sticky-dropdown"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePUPDAddress.bind(this, "MultiPUAddress")}
                onSelect={this.HandleAddressDropdownSelect.bind(
                  this,
                  (item) => item.NameWoDiacritics,
                  "MultiPUAddress"
                )}
                value={this.state.fields["MultiPUAddress"]}
              />
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
          </div>
        </div>
      ) : (
        <div key={index + 1} className="row">
          <div
            className={
              this.state.typeofMove === 1 || this.state.typeofMove === 3
                ? "rename-cntr cusrename login-fields position-relative w-92"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 3 ? (
              <ReactAutocomplete
                key={index}
                name={"POL" + (index + 1)}
                getItemValue={(item) => item.OceanPortLongName}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.AirPortID}
                  >
                    {item.OceanPortLongName}
                  </div>
                )}
                renderInput={function (props) {
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
                  (item) => item.NameWoDiacritics,
                  "pol" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pol" + (index + 1)]}
              />
            ) : (
              <ReactAutocomplete
                getItemValue={(item) => item.Address}
                items={this.state.polpodData}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.Address}
                  >
                    {item.Address}
                  </div>
                )}
                renderInput={function (props) {
                  return (
                    <input
                      placeholder="Enter PU Address"
                      className="w-100 sticky-dropdown"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePUPDAddress.bind(this, "MultiPUAddress")}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownSelect.bind(
                  this,
                  (item) => item.NameWoDiacritics,
                  "MultiPUAddress"
                )}
                value={this.state.fields["MultiPUAddress"]}
              />
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
                ? "rename-cntr cusrename login-fields position-relative w-92"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 2 ? (
              <ReactAutocomplete
                key={index + 1}
                name={"POD" + (index + 1)}
                getItemValue={(item) => item.AirportLongName}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.AirPortID}
                  >
                    {item.AirportLongName}
                  </div>
                )}
                renderInput={function (props) {
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
                  (item) => item.NameWoDiacritics,
                  "pod" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pod" + (index + 1)]}
              />
            ) : (
              <ReactAutocomplete
                getItemValue={(item) => item.Address}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.Address}
                  >
                    {item.Address}
                  </div>
                )}
                renderInput={function (props) {
                  return (
                    <input
                      placeholder="Enter PD Address"
                      className="w-100 sticky-dropdown"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePUPDAddress.bind(this, "MultiPDAddress")}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownSelect.bind(
                  this,
                  (item) => item.NameWoDiacritics,
                  "MultiPDAddress"
                )}
                value={this.state.fields["MultiPDAddress"]}
              />
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
                ? "rename-cntr cusrename login-fields position-relative w-92"
                : ""
            }
          >
            {this.state.typeofMove === 1 || this.state.typeofMove === 2 ? (
              <ReactAutocomplete
                key={index + 1}
                name={"POD" + (index + 1)}
                getItemValue={(item) => item.OceanPortLongName}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.AirPortID}
                  >
                    {item.OceanPortLongName}
                  </div>
                )}
                renderInput={function (props) {
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
                  (item) => item.NameWoDiacritics,
                  "pod" + (index + 1),
                  index + 1
                )}
                value={this.state.multiFields["pod" + (index + 1)]}
              />
            ) : (
              <ReactAutocomplete
                getItemValue={(item) => item.Address}
                items={this.state.polpodDataAdd}
                renderItem={(item, isHighlighted) => (
                  <div
                    style={{
                      background: isHighlighted ? "lightgray" : "white",
                    }}
                    value={item.Address}
                  >
                    {item.Address}
                  </div>
                )}
                renderInput={function (props) {
                  return (
                    <input
                      placeholder="Enter PD Address"
                      className="w-100 sticky-dropdown"
                      type="text"
                      {...props}
                    />
                  );
                }}
                onChange={this.HandlePUPDAddress.bind(this, "MultiPDAddress")}
                //menuStyle={this.state.menuStyle}
                onSelect={this.HandleAddressDropdownSelect.bind(
                  this,
                  (item) => item.NameWoDiacritics,
                  "MultiPDAddress"
                )}
                value={this.state.fields["MultiPDAddress"]}
              />
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
    let valuesPOL = [...this.state.valuesPOL];
    valuesPOL.splice(i, 1);
    this.setState({ valuesPOL });
  }
  removeClickPOD(i) {
    let valuesPOD = [...this.state.valuesPOD];
    valuesPOD.splice(i, 1);
    this.setState({ valuesPOD });
  }

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState((prevState) => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal.ContainerName,
          ProfileCodeID: optionVal.ProfileCodeID,
          StandardContainerCode: optionVal.SpecialContainerCode,
          ContainerQuantity: 0,
          Temperature: 0,
          TemperatureType: "",
        },
      ],
    }));
  }

  createUISpecial() {
    return this.state.referType.map((el, i) => {
      return (
        <div key={i} className="row cbm-space">
          <div className="col-md">
            <div className="spe-equ">
              <label className="mt-2" name="StandardContainerCode">
                {el.StandardContainerCode}
              </label>
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="ContainerQuantity"
                placeholder="Quantity"
                value={el.ContainerQuantity || ""}
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
                value={el.Temperature || ""}
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md mt-2">
            <div className="rate-radio-cntr mt-3 mb-0">
              <div>
                <input
                  type="radio"
                  id={"exist-cust" + i}
                  name={"TemperatureTypeC"}
                  style={{ display: "none" }}
                  value={el.TemperatureType}
                  checked={el.TemperatureType === "C" ? true : false}
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor={"exist-cust" + i}
                >
                  Celcius
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id={"new-cust" + i}
                  name={"TemperatureTypeF"}
                  style={{ display: "none" }}
                  value={el.TemperatureType}
                  checked={el.TemperatureType === "F" ? true : false}
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor={"new-cust" + i}
                >
                  Farenheit
                </label>
              </div>
            </div>
          </div>
          <div className="spe-equ">
            <i
              className="fa fa-minus"
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

    if (name === "Temperature") {
      var validNumber = new RegExp(/^\d*\.?\d*$/);
      if (value === "" || validNumber.test(value)) {
        if ((parseFloat(value) * 100) % 1 > 0) {
        } else {
          referType[i] = {
            ...referType[i],
            [name]: value,
          };
        }
      }
    } else if (name === "TemperatureTypeC") {
      referType[i] = {
        ...referType[i],
        ["TemperatureType"]: "C",
      };
    } else if (name === "TemperatureTypeF") {
      referType[i] = {
        ...referType[i],
        ["TemperatureType"]: "F",
      };
    } else {
      referType[i] = {
        ...referType[i],
        [name]: parseFloat(value),
      };
    }
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
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
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
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
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
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={el.GrossWt === 0 ? "GW (kg)" : "GW (kg)"}
              name="Weight"
              value={el.GrossWt}
              className="w-100"
            />
          </div>
        </div>
        {i == 0 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-plus mt-2"
                aria-hidden="true"
                onClick={this.addClickMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeClickMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        )}
      </div>
    ));
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;

    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop[i] = {
      ...flattack_openTop[i],
      [name]: parseFloat(value),
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
        ["total"]: parseFloat(decVolumeWeight),
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(flattack_openTop[i].Gross_Weight),
      };
    }

    this.setState({ flattack_openTop });
  }
  addClickMultiCBM(optionsVal) {
    this.setState((prevState) => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: optionsVal.SpecialContainerCode,
          length: "",
          width: "",
          height: "",
          Quantity: "",
          Gross_Weight: "",
          total: "",
        },
      ],
    }));
    this.setState((prevState) => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: "",
          Lengths: "",
          Width: "",
          Height: "",
          GrossWt: "",
          VolumeWeight: "",
          Volume: "",
        },
      ],
    }));
  }
  removeClickMultiCBM(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);

    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
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
          this.setState((prevState) => ({
            users: [
              ...prevState.users,
              {
                ContainerName: option.option.ContainerName,
                ProfileCodeID: option.option.ProfileCodeID,
                StandardContainerCode: option.option.StandardContainerCode,
                ContainerQuantity: 1,
                Temperature: 0,
                TemperatureType: "",
              },
            ],
          }));
        }
      } else {
        let difference = this.state.selected.filter((x) => !e.includes(x));
        if (difference.length === 0) {
          if (option.option.ContainerName === "Special Equipment") {
            this.setState({
              specialEquipment: true,
              isSpacialEqt: false,
            });
          } else {
            this.setState({ selected: e });
            this.setState((prevState) => ({
              users: [
                ...prevState.users,
                {
                  ContainerName: option.option.ContainerName,
                  ProfileCodeID: option.option.ProfileCodeID,
                  StandardContainerCode: option.option.StandardContainerCode,
                  ContainerQuantity: 1,
                },
              ],
            }));
          }
        } else {
        }
      }
    } else {
      this.setState({
        selected: [],
        users: [],
      });
    }
  }

  newhandleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = {
      ...users[i],
      [name]: name === "ContainerQuantity" ? parseFloat(value) : 0,
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
  specEquipChange = (value) => {
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
          specialEqtSelect: true,
        });
        this.addClickMultiCBM(value);

        this.addSpacEqmtType(value);
      }
    }
    if (value.IsTemperatureRequired === 1) {
      if (difference === false) {
        this.setState({
          refertypeSelect: true,
        });
        this.addClickSpecial(value);
      }
    }

    if (value.IsTemperatureRequired === 0 && value.IsVolumeRequired === 0) {
      if (difference2 === false) {
        this.setState({
          spacEqmtTypeSelect: true,
        });

        this.addSpacEqmtType(value);
      }
    }
  };

  //// start  spacEqmtType dyamanic element

  addSpacEqmtType(optionVal) {
    this.setState((prevState) => ({
      spacEqmtType: [
        ...prevState.spacEqmtType,
        {
          ContainerName: optionVal.ContainerName,
          ProfileCodeID: optionVal.ProfileCodeID,
          StandardContainerCode: optionVal.SpecialContainerCode,
          Quantity: 1,
          Temperature: 0,
          TemperatureType: "",
        },
      ],
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
            name="ContainerQuantity"
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.ContainerQuantity || 1}
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
      [name]: parseFloat(value),
    };
    this.setState({ spacEqmtType });
  }

  removeClickSpacEqmtType(i) {
    let spacEqmtType = [...this.state.spacEqmtType];
    spacEqmtType.splice(i, 1);
    let flattack_openTop = [...this.state.flattack_openTop];
    if (this.state.flattack_openTop.length > 0) {
      flattack_openTop.splice(i - 1, 1);
    }

    let multiCBM = [...this.state.multiCBM];
    if (this.state.multiCBM.length > 0) {
      multiCBM.splice(i - 1, 1);
    }

    this.setState({ spacEqmtType, flattack_openTop, multiCBM });
  }

  //// end spacEqmtType dyamanic element

  //// Commodity dropdown methods

  HandleCommodityData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,

      headers: authHeader(),
    }).then(function (response) {
      var data = response.data.Table;
      self.setState({ commodityData: data });
    });
  }

  //// end Commodity drop-down
  toggleSpot() {
    var companyName = "";
    var companyAddress = "";
    var contactName = "";
    var usertype = encryption(window.localStorage.getItem("usertype"), "desc");
    if (usertype == "Customer") {
      companyName = encryption(
        window.localStorage.getItem("companyname"),
        "dec"
      );
      companyAddress = encryption(
        window.localStorage.getItem("companyaddress"),
        "dec"
      );
      contactName = encryption(
        window.localStorage.getItem("contactname"),
        "dec"
      );
      this.setState({ usertype, companyName, companyAddress, contactName });
    } else {
      usertype = "Sales User";
      this.setState({ usertype });
    }
    this.setState((prevState) => ({
      modalSpot: !prevState.modalSpot,
    }));
  }
  toggleSpotCloseModal() {
    this.setState({ modalSpot: false, sloding: false });
  }

  HandlePOLPODAutosearch(field, i, e) {
    let self = this;
    let multiFields = this.state.multiFields;
    multiFields[field] = e.target.value;

    var type = this.state.modeoftransport;
    if (multiFields[field].length > 2) {
      self.setState({ multiFields });
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
          CountryCode: "",
        },
        headers: authHeader(),
      })
        .then(function (response) {
          if (field === "pol" + i) {
            self.setState({
              polpodData: response.data.Table,
              multiFields,
            });
          } else {
            self.setState({
              polpodDataAdd: response.data.Table,
              multiFields,
            });
          }
        })
        .catch((error) => {
          multiFields[field] = "";
          var errorData = error.response.data;
          var err = errorData.split(":");
          var data = [{ OceanPortLongName: err[1].replace("}", "") }];
          this.setState({ polpodData: data });
        });
    } else {
      self.setState({
        multiFields,
        polpodData: [],
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
      // for (let i = 0; i < this.state.podArray.length; i++) {
      //   arrPOD += this.state.podArray[i].Address + ",";
      // }
      // if (!arrPOL.includes(value) && !arrPOD.includes(value)) {
      if (!arrPOL.includes(value)) {
        if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
          var geoCoordinate = id.GeoCoordinate.split(",");
          var PositionPOL = new Object();
          PositionPOL.lat = parseFloat(geoCoordinate[0]);
          PositionPOL.lng = parseFloat(geoCoordinate[1]);
          this.state.mapPositionPOL.push({
            lat: PositionPOL.lat,
            lng: PositionPOL.lng,
          });

          if (this.state.isViewRate == true) {
            this.props.location.state.spotrateresponseTbl1.push({
              OriginPort_ID:
                this.state.containerLoadType == "AIR"
                  ? id.Location !== "" && id.Location !== undefined
                    ? id.Location
                    : ""
                  : id.UNECECode !== "" && id.UNECECode !== undefined
                  ? id.UNECECode
                  : "",
              POLGeoCordinate: id.GeoCoordinate,
            });
          }
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
            IsFilter: true,
          });
          this.setState({
            polfullAddData: id,
            multiFields,
            errorPOL: "",
            mapPositionPOL: this.state.mapPositionPOL,
            polArray: this.state.polArray,
          });
        }
      } else {
        multiFields[field] = "";
        this.state.errorPOL = value + " already exist";
        this.setState({
          multiFields,
          errorPOL: this.state.errorPOL,
        });
      }
    } else {
      for (let i = 0; i < this.state.podArray.length; i++) {
        arrPOD += this.state.podArray[i].Address + ",";
      }
      // for (let j = 0; j < this.state.polArray.length; j++) {
      //   arrPOL += this.state.polArray[j].Address + ",";
      // }
      // if (!arrPOD.includes(value) && !arrPOL.includes(value)) {
      if (!arrPOD.includes(value)) {
        if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
          var PositionPOD = [];
          var geoCoordinate = id.GeoCoordinate.split(",");
          var mapPositionPOD = new Object();
          mapPositionPOD.lat = parseFloat(geoCoordinate[0]);
          mapPositionPOD.lng = parseFloat(geoCoordinate[1]);
          this.state.markerPositionPOD.push({
            lat: mapPositionPOD.lat,
            lng: mapPositionPOD.lng,
          });
          if (this.state.isViewRate == true) {
            this.props.location.state.spotrateresponseTbl1.push({
              DestinationPort_ID:
                this.state.containerLoadType == "AIR"
                  ? id.Location !== "" && id.Location !== undefined
                    ? id.Location
                    : ""
                  : id.UNECECode !== "" && id.UNECECode !== undefined
                  ? id.UNECECode
                  : "",
              PODGeoCordinate: id.GeoCoordinate,
            });
          }
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
            IsFilter: true,
          });

          this.setState({
            podfullAddData: id,
            multiFields,
            errorPOD: "",
            markerPositionPOD: this.state.markerPositionPOD,
            podArray: this.state.podArray,
          });
        }
      } else {
        multiFields[field] = "";
        this.state.errorPOD = value + " already exist";
        this.setState({
          multiFields,
          errorPOD: this.state.errorPOD,
        });
      }
    }
  }

  onPlaceSelected = (place) => {
    var arrPOL = "";
    var arrPOD = "";
    for (let i = 0; i < this.state.polArray.length; i++) {
      arrPOL += this.state.polArray[i].Address + ",";
      arrPOD += this.state.podArray[i].Address + ",";
    }
    if (
      !arrPOL.includes(place.formatted_address) &&
      !arrPOD.includes(place.formatted_address)
    ) {
      const address = place.formatted_address,
        addressArray = place.address_components,
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();
      if (addressArray.length > 4) {
        this.setState({ zoomPOL: 15 });
      } else if (addressArray.length > 2 && addressArray.length <= 4) {
        this.setState({ zoomPOL: 10 });
      } else {
        this.setState({ zoomPOL: 6 });
      }

      var originGeoCordinates = latValue + "," + lngValue;
      this.state.polArray.push({
        POL: "",
        POLGeoCordinate: originGeoCordinates,
        Address: address,
        IsFilter: true,
      });
      this.setState({
        polArray: this.state.polArray,
      });
      this.state.mapPositionPOL.push({
        lat: Number(latValue),
        lng: Number(lngValue),
      });
      this.setState({
        markerPositionPOL: {
          lat: Number(latValue),
          lng: Number(lngValue),
        },
      });
    } else {
      //multiFields[field] = "";
      this.state.errorPOL = place.formatted_address + " already exist";
      this.setState({
        errorPOL: this.state.errorPOL,
      });
    }
  };

  onPlaceSelectedPOD = (place) => {
    var arrPOD = "";
    var arrPOL = "";
    for (let i = 0; i < this.state.podArray.length; i++) {
      arrPOD += this.state.podArray[i].Address + ",";
      arrPOL += this.state.polArray[i].Address + ",";
    }
    if (
      !arrPOD.includes(place.formatted_address) &&
      !arrPOL.includes(place.formatted_address)
    ) {
      const address = place.formatted_address,
        addressArray = place.address_components,
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
        IsFilter: true,
      });

      this.state.markerPositionPOD.push({
        lat: Number(latValue),
        lng: Number(lngValue),
      });
      this.setState({
        podArray: this.state.podArray,
      });
    } else {
      this.state.errorPOD = place.formatted_address + " already exist";
      this.setState({
        errorPOD: this.state.errorPOD,
      });
    }
    //this.addressChange("", address);
  };

  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
      // NOTE: this removes any FILTER ALL filter
      const filterAll = "";
      this.setState({
        filtered: filtered.filter((item) => item.id != "all"),
        filterAll,
      });
    } else this.setState({ filtered });
  }
  filterAll(e) {
    var CommodityID = parseInt(e.target.value);
    this.setState({
      loading: true,
      CommodityID: CommodityID,
    });
    if (
      this.state.polFilterArray.length > 1 ||
      this.state.podFilterArray.length > 1
    ) {
      this.HandleMultiPOLPODFilter();
    } else {
      setTimeout(() => {
        this.HandleRateDetailsFCL(this.state);
      }, 100);
    }
  }

  custClearToggle() {
    this.setState({
      Custom_Clearance: !this.state.Custom_Clearance,
    });
  }

  HandleRangeSlider(event) {
    this.setState({
      value: parseInt(event.target.value),
      valueAmt: this.state.MaxAmt,
    });

    var filteredData = [];
    var filterMinday = [];
    var actualData = this.state.RateDetails;
    var checkingValue = parseInt(event.target.value);

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
      for (let i = 0; i < filteredData.length; i++) {
        var colData = filteredData[i].TransitTime;
        var tempData = colData.split("-");
        filterMinday.push(parseInt(tempData[0]));
        filterMinday.push(parseInt(tempData[1]));
      }

      var MinTT = Math.min.apply(null, filterMinday);

      this.setState({
        tempRateDetails: filteredData,
        MinTT,
      });
    } else {
      this.setState({
        tempRateDetails: [{ lineName: "No Record Found" }],
        RateSubDetails: [{ ChargeDesc: "No Record Found" }],
      });
    }
  }

  HandleRangeAmtSlider(event) {
    this.setState({
      valueAmt: parseFloat(event.target.value),
      value: this.state.MaxTT,
    });

    var filteredData = [];

    var actualData = this.state.RateDetails;
    var checkingValue = parseFloat(event.target.value);

    for (var j = 0; j < actualData.length; j++) {
      var colData = actualData[j].TotalAmount; //0-5
      var tempData = colData;

      if (tempData <= checkingValue) {
        filteredData.push(actualData[j]);
      }
    }

    if (filteredData.length > 0) {
      var MinAmt = Math.min.apply(
        null,
        filteredData.map(function (item) {
          return item.TotalAmount;
        })
      );

      this.setState({
        tempRateDetails: filteredData,
        MinAmt,
      });
    } else {
      this.setState({
        tempRateDetails: [{ lineName: "No Record Found" }],
        RateSubDetails: [{ ChargeDesc: "No Record Found" }],
      });
    }
  }

  HandleCMBtextChange(e) {
    var jiji = e.target.value;

    if (isNaN(jiji)) {
      return false;
    }
    var splitText = jiji.split(".");
    var index = jiji.indexOf(".");
    if (index != -1) {
      if (splitText) {
        if (splitText[1].length <= 2) {
          if (index != -1 && splitText.length === 2) {
            this.setState({ cbmVal: jiji });
          }
        } else {
          return false;
        }
      } else {
        this.setState({ cbmVal: jiji });
      }
    } else {
      this.setState({ cbmVal: jiji });
    }
  }

  spotRateSubmit(param) {
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
    var CompanyID = 0;
    if (
      encryption(window.localStorage.getItem("usertype"), "desc") !== "Customer"
    ) {
      if (this.state.companyId === 0) {
        store.addNotification({
          // title: "Error",
          message: "Please Select Customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
        return false;
      } else {
        CompanyID = this.state.companyId;
      }
    } else {
      CompanyID = encryption(window.localStorage.getItem("companyid"), "desc");
    }
    this.setState({ sloding: true });
    for (var i = 0; i < param.TruckTypeData.length; i++) {
      truckTypeData.push({
        TruckTypeID:
          param.TruckTypeData[i].TruckID === "others"
            ? 0
            : parseInt(param.TruckTypeData[i].TruckID),
        TruckQty: param.TruckTypeData[i].Quantity,
        TruckTypeDesc: param.TruckTypeData[i].TruckDesc,
      });
    }
    if (param.multiCBM.length != 0) {
      for (var i = 0; i < param.multiCBM.length; i++) {
        MultiCBM.push({
          PackageType: param.multiCBM[i].PackageType || "",
          Quantity: param.multiCBM[i].Quantity || 0,
          Lengths: param.multiCBM[i].Lengths || 0,
          Width: param.multiCBM[i].Width || 0,
          Height: param.multiCBM[i].Height || 0,
          GrossWt: param.multiCBM[i].GrossWt || 0,
          VolumeWeight: param.multiCBM[i].VolumeWeight || 0,
          Volume: param.multiCBM[i].Volume || 0,
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
          TempratureType: param.users[i].TemperatureType,
        });
      }
    }

    if (param.spacEqmtType.length != 0) {
      for (var i = 0; i < param.spacEqmtType.length; i++) {
        containerdetails.push({
          ProfileCodeID: param.spacEqmtType[i].ProfileCodeID,
          ContainerCode: param.spacEqmtType[i].StandardContainerCode,
          Type: param.spacEqmtType[i].ContainerName,
          ContainerQuantity: param.spacEqmtType[i].ContainerQuantity,
          Temperature: param.spacEqmtType[i].Temperature,
          TempratureType: param.spacEqmtType[i].TemperatureType,
        });
      }
    }
    if (this.state.referType.length > 0) {
      for (var i = 0; i < param.referType.length; i++) {
        containerdetails.push({
          ProfileCodeID: param.referType[i].ProfileCodeID,
          ContainerCode: param.referType[i].StandardContainerCode,
          Type: param.referType[i].ContainerName,
          ContainerQuantity: param.referType[i].ContainerQuantity,
          Temperature: param.referType[i].Temperature,
          TempratureType: param.referType[i].TemperatureType,
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
        ZipCode: "",
      });
      destUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: "",
      });
      pickUpAddress = param.fields.pol;
      destinationAddress = param.fields.pod;
      originPort_ID = param.polfullAddData.UNECECode;
      destinationPort_ID = param.podfullAddData.UNECECode;
    }
    if (param.typesofMove == "d2d") {
      pickUpAddressDetails.push({
        Street: param.pickUpAddress[0].Area,
        Country: param.pickUpAddress[0].Country,
        State: param.pickUpAddress[0].State,
        City: param.pickUpAddress[0].City,
        ZipCode: param.pickUpAddress[0].ZipCode,
      });
      destUpAddressDetails.push({
        Street: param.destAddress[0].Area,
        Country: param.destAddress[0].Country,
        State: param.destAddress[0].State,
        City: param.destAddress[0].City,
        ZipCode: param.destAddress[0].ZipCode,
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
        ZipCode: param.pickUpAddress[0].ZipCode,
      });
      destUpAddressDetails.push({
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: "",
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
        ZipCode: "",
      });
      destUpAddressDetails.push({
        Street: param.destAddress[0].Area,
        Country: param.destAddress[0].Country,
        State: param.destAddress[0].State,
        City: param.destAddress[0].City,
        ZipCode: param.destAddress[0].ZipCode,
      });
      pickUpAddress = param.fields.pol;
      destinationAddress = param.DeliveryCity;
      originPort_ID = param.polfullAddData.UNECECode;
    }

    if (param.containerLoadType == "AIR" || param.containerLoadType == "FCL") {
      var multiCBMData = [];
      if (this.state.cmbTypeRadio === "CBM") {
        multiCBMData.push({
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: parseFloat(this.state.cbmVal),
        });
      } else {
        multiCBMData = this.state.multiCBM;
      }
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
        HazMat: param.HazMat,
        ChargeableWt: parseFloat(param.cbmVal) || 0,
        Containerdetails: containerdetails,

        PickUpAddressDetails: pickUpAddressDetails[0],

        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: multiCBMData,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: CompanyID,
        CommodityID: Number(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        BaseCurrency: param.currencyCode,
        NonStackable: param.NonStackable == true ? 1 : 0,
        MyWayComments: this.state.mywaycomment,
      };
    }
    if (param.containerLoadType == "LTL" || param.containerLoadType == "LCL") {
      var multiCBMData = [];
      if (this.state.cmbTypeRadio === "CBM") {
        multiCBMData.push({
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: parseFloat(this.state.cbmVal),
        });
      } else {
        multiCBMData = this.state.multiCBM;
      }
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

        HazMat: param.HazMat,
        ChargeableWt: parseFloat(param.cbmVal) || 0,
        PickUpAddressDetails: pickUpAddressDetails[0],
        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: multiCBMData,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: CompanyID,
        CommodityID: parseInt(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        BaseCurrency: param.currencyCode,
        NonStackable: param.NonStackable == true ? 1 : 0,
        MyWayComments: this.state.mywaycomment,
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

        HazMat: param.HazMat,
        ChargeableWt: parseFloat(param.cbmVal) || 0,
        PickUpAddressDetails: pickUpAddressDetails[0],
        DestinationAddressDetails: destUpAddressDetails[0],
        RateQueryDim: MultiCBM,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: CompanyID,
        CommodityID: parseInt(param.CommodityID),
        OriginGeoCordinates: param.OriginGeoCordinates,
        DestGeoCordinate: param.DestGeoCordinate,
        FTLTruckDetails: truckTypeData,
        BaseCurrency: param.currencyCode,
        NonStackable: param.NonStackable == true ? 1 : 0,
        MyWayComments: this.state.mywaycomment,
      };
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SpotRateInsertion`,
      data: dataParameter,

      headers: authHeader(),
    })
      .then(function (response) {
        self.toggleSpot();
        store.addNotification({
          // title: "Success",
          message: response.data.Table[0].Message,
          type: "success", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
        self.setState({ sloding: false });
        setTimeout(() => {
          self.props.history.push("./spot-rate-table");
        }, 3000);
      })
      .catch((error) => {
        self.setState({ sloding: false });
      });
  }

  HandlePUPDAddress(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    var polpodData = [];
    var polpodDataAdd = [];

    self.setState({
      fields,
    });
    if (fields[field].length > 2) {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url =
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        e.target.value +
        "&key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&sessiontoken=2333"; // site that doesn’t send Access-Control-*
      fetch(proxyurl + url)
        .then((res) => res.json())
        .then((response) => {
          for (let i = 0; i < response.predictions.length; i++) {
            if (field == "MultiPUAddress") {
              polpodData.push({
                Address: response.predictions[i].description,
              });
            } else if (field == "MultiPDAddress") {
              polpodDataAdd.push({
                Address: response.predictions[i].description,
              });
            }
          }
          self.setState({
            polpodData: polpodData,
            polpodDataAdd: polpodDataAdd,
          });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      self.setState({
        fields,
      });
    }
  }

  HandleAddressDropdownSelect(e, field, value, id) {
    let fields = this.state.multiFields;
    fields[field] = value;
    this.setState({
      fields,
    });
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      value +
      "&key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url)
      .then((res) => res.json())
      .then((response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray),
          zipcode = this.getZipCode(addressArray),
          country = this.getCountry(addressArray),
          latValue = response.results[0].geometry.location.lat,
          lngValue = response.results[0].geometry.location.lng;

        if (addressArray.length > 4) {
          this.setState({ zoomPOL: 15 });
        } else if (addressArray.length > 2 && addressArray.length <= 4) {
          this.setState({ zoomPOL: 10 });
        } else {
          this.setState({ zoomPOL: 6 });
        }

        if (field == "MultiPUAddress") {
          var arrPOL = "";
          var arrPOD = "";
          for (let i = 0; i < this.state.polArray.length; i++) {
            arrPOL += this.state.polArray[i].Address + ",";
          }
          for (let i = 0; i < this.state.podArray.length; i++) {
            arrPOD += this.state.podArray[i].Address + ",";
          }
          if (!arrPOL.includes(address) && !arrPOD.includes(address)) {
            var originGeoCordinates = latValue + "," + lngValue;
            this.state.polArray.push({
              POL: "",
              POLGeoCordinate: originGeoCordinates,
              Address: address,
              IsFilter: true,
            });

            this.setState({
              polArray: this.state.polArray,
            });
            this.state.mapPositionPOL.push({
              lat: Number(latValue),
              lng: Number(lngValue),
            });
            this.setState({
              markerPositionPOL: {
                lat: Number(latValue),
                lng: Number(lngValue),
              },
            });
          } else {
            var error = address + " already exist";
            this.setState({
              errorPOL: error,
              fields: {},
            });
          }
        } else if (field == "MultiPDAddress") {
          var arrPOL = "";
          var arrPOD = "";
          for (let i = 0; i < this.state.polArray.length; i++) {
            arrPOL += this.state.polArray[i].Address + ",";
          }
          for (let i = 0; i < this.state.podArray.length; i++) {
            arrPOD += this.state.podArray[i].Address + ",";
          }
          if (!arrPOL.includes(address) && !arrPOD.includes(address)) {
            var destGeoCordinate = latValue + "," + lngValue;

            this.state.podArray.push({
              POD: "",
              PODGeoCordinate: destGeoCordinate,
              Address: address,
              IsFilter: true,
            });

            this.state.markerPositionPOD.push({
              lat: Number(latValue),
              lng: Number(lngValue),
            });
            this.setState({
              podArray: this.state.podArray,
            });
          } else {
            var error = address + " already exist";
            this.setState({
              errorPOD: error,
              fields: {},
            });
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  getCity = (addressArray) => {
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

  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j] ||
            "administrative_area_level_4" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
          }
        }
      }
    }
    return area;
  };

  getState = (addressArray) => {
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

  getZipCode = (addressArray) => {
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

  getCountry = (addressArray) => {
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

  cmbTypeRadioChange(e) {
    var value = e.target.value;

    this.setState({ cmbTypeRadio: value });
  }
  HandlePackgeTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/PackageTypeListDropdown`,

      headers: authHeader(),
    }).then(function (response) {
      var data = response.data.Table;
      self.setState({ packageTypeData: data });
    });
  }

  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }
  handleSelectCon(field, value, e) {
    let fields = this.state.fields;
    fields[field] = value;
    var compId = e.Company_ID;
    var compName = e.Company_Name;
    var companyAddress = e.CompanyAddress;
    var contactName = e.ContactName;

    this.setState({
      fields,
      companyId: compId,
      companyName: compName,
      companyAddress: companyAddress,
      contactName: contactName,
    });
    //document.getElementById("SearchRate").classList.remove("disableRates");
  }

  HandleChangeCon(field, e) {
    let self = this;
    self.state.error = "";
    var customertxtlen = e.target.value;
    // if (customertxtlen == "") {
    //   document.getElementById("SearchRate").classList.add("disableRates");
    // }

    let fields = this.state.fields;
    fields[field] = e.target.value;

    if (fields[field].length >= 3) {
      self.setState({ fields });
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerList`,
        data: {
          CustomerName: e.target.value,
          CustomerType: "Existing",
          MyWayUserID: encryption(
            window.localStorage.getItem("userid"),
            "desc"
          ),
        },
        headers: authHeader(),
      }).then(function (response) {
        if (response.data.Table.length != 0) {
          if (field == "CustomerList") {
            self.setState({
              customerData: response.data.Table,
              fields,
            });
          } else {
            self.setState({
              customerData: response.data.Table,
              fields,
            });
          }
        } else {
          self.state.error = "Please enter valid Consignee";
        }
        self.setState({
          error: self.state.error,
        });
      });
    } else {
      self.setState({
        customerData: [],
        fields,
      });
    }
  }

  newOpen() {
    window.open(
      "https://org242240bd.crm.dynamics.com/main.aspx?etn=lead&pagetype=entityrecord",
      "_blank"
    );
  }

  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }
  HandleBackStage(stageType, e) {
    if (this.state.isViewRate) {
      return false;
    }
    if (stageType == "shipmentType") {
      this.props.history.push({
        pathname: "new-rate-search",
        state: {
          shipmentType: this.state.shipmentType,
          companyId: this.state.companyId,
          companyName: this.state.companyName,
          companyAddress: this.state.companyAddress,
          contactName: this.state.contactName,
          contactEmail: this.state.contactEmail,
        },
      });
    }
    if (stageType == "modeoftransport") {
      this.props.history.push({
        pathname: "new-rate-search",
        state: {
          shipmentType: this.state.shipmentType,
          modeoftransport: this.state.modeoftransport,
          companyId: this.state.companyId,
          companyName: this.state.companyName,
          companyAddress: this.state.companyAddress,
          contactName: this.state.contactName,
          contactEmail: this.state.contactEmail,
        },
      });
    }

    if (stageType == "containerLoadType") {
      this.props.history.push({
        pathname: "new-rate-search",
        state: this.state,
      });
    }

    if (stageType == "typeofMove") {
      this.props.history.push({
        pathname: "new-rate-search",
        state: this.state,
      });
    }
  }

  callbackFunction = (callBackObj) => {
    if (
      this.state.containerLoadType === "LCL" ||
      this.state.containerLoadType === "AIR" ||
      this.state.containerLoadType === "LTL"
    ) {
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    }
    // if (this.state.containerLoadType === "FTL") {
    //   var TruckTypeData = callBackObj;
    //   this.setState({ TruckTypeData });
    // }
    if (this.state.containerLoadType === "FCL") {
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    }
  };

  callbackCurrencyFunction = (code) => {
    this.setState({
      currencyCode: code,
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

      TruckType: [],
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: 1,
          TruckDesc: "",
        },
      ],
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
      MaxTT: 0,
      isViewRate: false,
      RatequeryID: 0,
      IsSearchFromSpotRate: 0,
      MinAmt: 0,
      MaxAmt: 0,
      valueAmt: 0,
      minDays: 0,
      minamount: 0,
      spolAddress: "",
      spodAddress: "",
      cmbTypeRadio: "",
      packageTypeData: [],
      Company: "",
      selectedCurrency: "",
      usertype: "",
      customerData: [],
      error: "",
      fields: {},
      isNotData: "",
    });
    setTimeout(() => {
      this.componentDidMount();
    }, 200);
  };

  //// create dynamic truck type UI
  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr">
          <div className="spe-equ" style={{ margin: "auto" }}>
            <select
              className="select-text mr-3"
              name="TruckName"
              value={el.TruckID || 0}
              onChange={this.UITruckTypeChange.bind(this, i)}
            >
              <option selected value={"select"}>
                Select
              </option>
              {this.state.TruckType.map((item, i) => (
                <option key={i} value={item.TruckID}>
                  {item.TruckName}
                </option>
              ))}
              <option value={"others"}>Others</option>
            </select>
            <input
              className="mr-3"
              type="text"
              name="Quantity"
              value={el.Quantity || 1}
              placeholder="Quantity"
              onChange={this.UITruckTypeChange.bind(this, i)}
            />
            {el.TruckName === "others" ? (
              <input
                type="text"
                name="TruckDesc"
                placeholder="TruckDesc"
                value={el.TruckDesc || ""}
                onChange={this.UITruckTypeChange.bind(this, i)}
              />
            ) : null}

            {i === 0 ? (
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addClickTruckType.bind(this)}
                ></i>
              </div>
            ) : null}
            {this.state.TruckTypeData.length > 1 ? (
              <div className="spe-equ mt-2">
                <i
                  className="fa fa-minus"
                  aria-hidden="true"
                  onClick={this.removeClickTruckType.bind(this, i)}
                ></i>
              </div>
            ) : null}
          </div>
        </div>
      );
    });
  }

  addClickTruckType() {
    this.setState((prevState) => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: 1,
          TruckDesc: "",
        },
      ],
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

    if (name === "Quantity") {
      TruckTypeData[i] = {
        ...TruckTypeData[i],
        [name]: parseInt(value),
      };
    }

    if (name === "TruckDesc") {
      TruckTypeData[i] = {
        ...TruckTypeData[i],
        [name]: value,
      };
    }

    if (name === "TruckName") {
      if (value !== "others") {
        TruckTypeData[i] = {
          ...TruckTypeData[i],
          [name]: e.target.selectedOptions[0].innerText,
        };
        TruckTypeData[i] = {
          ...TruckTypeData[i],
          ["TruckID"]: value,
        };
      } else {
        TruckTypeData[i] = {
          ...TruckTypeData[i],
          [name]: value,
        };
        TruckTypeData[i] = {
          ...TruckTypeData[i],
          ["TruckID"]: "others",
        };
      }
    }

    // TruckTypeData[i] = {
    //   ...TruckTypeData[i],
    //   [name]: name === "Quantity" ? parseInt(value) : value,
    //   ["TruckDesc"]: name === "TruckName" ? value : TruckTypeData[i].TruckDesc
    // };
    this.setState({ TruckTypeData });

    var pathName = window.location.pathname;
    if (pathName === "/new-rate-search") {
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
  }

  handlechangemywaycomment(e) {
    this.setState({ mywaycomment: e.target.value });
  }
  render() {
    var i = 0;
    var classname = "";

    if (this.state.isViewRate) {
      if (
        this.state.commodityData.length > 0 &&
        this.state.commodityname !== ""
      ) {
        this.state.CommodityID = this.state.commodityData.filter(
          (x) => x.Commodity == this.state.commodityname
        )[0].id;
      }
    }

    if (this.state.isViewRate == true) {
      classname = "butn btn-sizeRate disabled";
    } else {
      classname = "butn btn-sizeRate";
    }
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      //
      colClassName = "cls-flside colap";
    } else {
      //
      colClassName = "cls-flside";
    }
    return (
      <div>
        <ReactNotification />
        <Headers parentCallback={this.callbackCurrencyFunction} />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>

          <div className="cls-rt no-bg min-hei-auto">
            {encryption(window.localStorage.getItem("usertype"), "desc") !==
            "Customer" ? (
              <p className="bottom-profit">
                Profit -------{this.state.profitLossAmt.toFixed(2)}
                {" " + this.state.currencyCode} / Profit Margin{" "}
                {this.state.profitLossPer.toFixed(2)}%
              </p>
            ) : null}
            <div className="rate-table-header">
              <div className="row rangerow">
                <div className="col-12 col-sm-12 col-md-2">
                  <div className="title-sect">
                    <h2>Rate Table</h2>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4">
                  <div className="login-fields rate-tab-drop">
                    Commodity
                    <select
                      className=""
                      onChange={this.filterAll}
                      style={{ marginLeft: "5px" }}
                      value={this.state.CommodityID}
                      disabled={this.state.isViewRate}
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
                </div>
                <div className="col-12 col-sm-12 col-md-4 p-0">
                  <div className="rate-table-range">
                    <p class="upto-days upto-days-btm">
                      Upto {this.state.value} days
                    </p>
                    <p class="upto-days upto-days-btm">{this.state.value}</p>
                    {/* <p class="upto-days">Upto {this.state.valueAmt} Amount</p> */}
                    <p class="upto-days">{this.state.valueAmt.toFixed(2)} </p>
                    <span className="cust-labl clr-green">Faster</span>
                    <span className="cust-labl clr-red">Cheaper</span>
                    <div className="dragbar" style={{ margin: "0" }}>
                      <span className="clr-green dragvalue">
                        {this.state.MinTT + " Days"}
                      </span>

                      <input
                        type="range"
                        min={this.state.MinTT}
                        max={this.state.MaxTT}
                        value={this.state.value}
                        onChange={this.HandleRangeSlider.bind(this)}
                      />
                      <input
                        type="range"
                        min={this.state.MinAmt}
                        max={this.state.MaxAmt}
                        step="0.01"
                        value={this.state.valueAmt}
                        id="reversedRange"
                        onChange={this.HandleRangeAmtSlider.bind(this)}
                      />
                      <span className="clr-red dragvalue2">
                        {this.state.MinAmt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-2 text-right">
                  <div className="rate-table-butn" style={{ padding: "0" }}>
                    <button
                      onClick={this.handleCheck.bind(this)}
                      className="blue-butn butn"
                      style={{ margin: "15px 0 0 0" }}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>

              {/* {----------------------End Spot Rate Modal------------------} */}
            </div>
            <div className="rate-table-below cus-w">
              {/* cus-w */}
              <div className="row">
                <div className="col-12 col-md-5 col-lg-3 less-right-rate">
                  <div className="rate-table-left">
                    <div
                      className="top-select d-flex justify-content-between disblo"
                      disabled={this.props.location.state.isViewRate || false}
                    >
                      <span
                        onClick={this.HandleBackStage.bind(
                          this,
                          "shipmentType"
                        )}
                        className={classname}
                      >
                        {this.state.shipmentType}
                      </span>
                      <span
                        name="modeoftransport"
                        onClick={this.HandleBackStage.bind(
                          this,
                          "modeoftransport"
                        )}
                        className={classname}
                      >
                        {this.state.modeoftransport}
                      </span>
                      <span
                        name="containerLoadType"
                        onClick={this.HandleBackStage.bind(
                          this,
                          "containerLoadType"
                        )}
                        className={classname}
                      >
                        {this.state.containerLoadType}
                      </span>
                      <span
                        name="typeofMove"
                        onClick={this.HandleBackStage.bind(this, "typeofMove")}
                        className={classname}
                      >
                        {this.state.typeofMove === 1
                          ? "P2P"
                          : this.state.typeofMove === 2
                          ? "D2P"
                          : this.state.typeofMove === 3
                          ? "P2D"
                          : this.state.typeofMove === 4
                          ? "D2D"
                          : ""}
                      </span>
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="insu"
                              type="checkbox"
                              name="HazMat"
                              checked={this.state.HazMat}
                              disabled={this.state.isViewRate}
                            />
                            <label htmlFor="insu">HazMat</label>
                          </div>
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
                                    disabled={this.state.isViewRate}
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
                        <div
                          disabled={
                            this.props.location.state.isViewRate || false
                          }
                        >
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name="Custom_Clearance"
                              checked={this.state.Custom_Clearance}
                              onChange={this.custClearToggle}
                              disabled={this.state.isViewRate}
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
                                disabled={this.props.location.state.isViewRate}
                                onChange={this.toggleChangePOLPOD.bind(
                                  this,
                                  index,
                                  "POL",
                                  mapPOL.POLGeoCordinate || mapPOL.GeoCordinate
                                )}
                              />
                              <label htmlFor={"pol" + (index + 1)}></label>
                              <h5 htmlFor={"pol" + (index + 1)}>
                                {mapPOL.Address !== ""
                                  ? mapPOL.Address || mapPOL.NameWoDiacritics
                                  : mapPOL.POL || mapPOL.NameWoDiacritics}
                                {/* {mapPOL.POL} */}
                              </h5>
                            </div>
                          ))}
                          <div className="pol-pod-maps">
                            <span className="rate-map-ovrly map-pol-lbl">
                              POL
                            </span>
                            {(!this.props.location.state.isViewRate &&
                              this.state.typeofMove === 1) ||
                            this.state.typeofMove === 2 ? (
                              <span
                                onClick={this.togglePOLModal}
                                className="rate-map-ovrly rate-map-plus plusImg-pdng"
                              >
                                +
                              </span>
                            ) : (
                              ""
                            )}

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
                                disabled={this.props.location.state.isViewRate}
                                onChange={this.toggleChangePOLPOD.bind(
                                  this,
                                  index,
                                  "POD",
                                  mapPOD.PODGeoCordinate || mapPOD.GeoCordinate
                                )}
                              />
                              <label htmlFor={"pod" + (index + 1)}></label>
                              <h5 htmlFor={"pol" + (index + 1)}>
                                {mapPOD.Address !== ""
                                  ? mapPOD.Address || mapPOD.NameWoDiacritics
                                  : mapPOD.POD || mapPOD.NameWoDiacritics}
                                {/* {mapPOD.POD} */}
                              </h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pol-pod-maps-cntr">
                      <div className="pol-pod-maps pod-maps">
                        <span className="rate-map-ovrly">POD</span>
                        {(!this.props.location.state.isViewRate &&
                          this.state.typeofMove === 1) ||
                        this.state.typeofMove === 2 ? (
                          <span
                            onClick={this.togglePODModal}
                            className="rate-map-ovrly rate-map-plus"
                          >
                            +
                          </span>
                        ) : (
                          ""
                        )}
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
                    {this.state.isViewRate == true ? (
                      <button
                        onClick={this.toggleQuant}
                        className="butn white-butn w-100 mt-0"
                        disabled
                      >
                        {this.state.containerLoadType === "FCL"
                          ? "Container Details"
                          : "Cargo Details"}
                      </button>
                    ) : (
                      <button
                        onClick={this.toggleQuant}
                        className="butn white-butn w-100 mt-0"
                      >
                        {this.state.containerLoadType === "FCL"
                          ? "Container Details"
                          : "Cargo Details"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-7 col-lg-9 ra-font">
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
                                  var type = this.state.containerLoadType;
                                  var lname = "";
                                  var olname = "";
                                  if (row._original.lineName) {
                                    olname = row._original.lineName;
                                    lname =
                                      row._original.lineName
                                        .replace(" ", "_")
                                        .replace("  ", "_") + ".png";
                                  }
                                  if (
                                    row._original.lineName !==
                                      "No Record Found" &&
                                    mode == "SEA" &&
                                    type != "LCL" &&
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
                                              onChange={() =>
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
                                              appSettings.imageURL +
                                              "OEAN_LINERS/" +
                                              lname
                                            }
                                            onError={this.onErrorImg.bind(this)}
                                            alt={olname}
                                          />
                                        </div>
                                      </React.Fragment>
                                    );
                                  } else if (
                                    row._original.lineName !==
                                      "No Record Found" &&
                                    type == "LCL" &&
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
                                              onChange={() =>
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
                                              appSettings.imageURL +
                                              "ATAFreight_console.png"
                                            }
                                            alt={row._original.lineName}
                                            onError={this.onErrorImg.bind(this)}
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
                                              onChange={() =>
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
                                              appSettings.imageURL +
                                              "AIR_LINERS/" +
                                              lname
                                            }
                                            alt={row._original.lineName}
                                            // ref={img => this.img = img} onError={
                                            //   () => this.img.src = 'appSettings.imageURL+"ATAFreight_console.png'
                                            // }
                                            onError={this.onErrorImg.bind(this)}
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
                                              onChange={() =>
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
                                              appSettings.imageURL +
                                              "ATAFreight_console.png"
                                            }
                                            onError={this.onErrorImg.bind(this)}
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
                                accessor: "lineName",
                                // minWidth: 200
                              },
                              {
                                Cell: (row) => {
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
                                filterable: true,
                              },
                              {
                                Cell: (row) => {
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
                                },
                                minWidth: 90,
                              },
                              {
                                Cell: (row) => {
                                  return (
                                    <>
                                      <p className="details-title">
                                        Transit Port
                                      </p>
                                      <p className="details-para">
                                        {row.original.TransshipmentPort}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "Transit Port",
                                filterable: true,
                                minWidth: 100,
                              },
                              {
                                Cell: (row) => {
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
                                minWidth: 90,
                              },
                              {
                                Cell: (row) => {
                                  var value = "";

                                  var header = "";
                                  if (this.state.containerLoadType == "FCL") {
                                    header = "Container";
                                    if (row.original.ContainerType) {
                                      value = row.original.ContainerType;
                                    }
                                    if (row.original.ContainerQuantity) {
                                      value +=
                                        " (" +
                                        row.original.ContainerQuantity +
                                        ")";
                                    }
                                  } else if (
                                    this.state.containerLoadType == "LCL"
                                  ) {
                                    header = "CBM";
                                    if (row.original.CBM) {
                                      value = row.original.CBM;
                                    }
                                  } else if (
                                    this.state.containerLoadType == "AIR"
                                  ) {
                                    header = "CW";
                                    if (row.original["Chargable Weight"]) {
                                      value = row.original["Chargable Weight"];
                                    }
                                  } else {
                                    header = "CW";
                                    if (row.original["Chargable Weight"]) {
                                      value = row.original["Chargable Weight"];
                                    }
                                  }

                                  return (
                                    <>
                                      <p className="details-title">{header}</p>
                                      <p className="details-para">{value}</p>
                                    </>
                                  );
                                },
                                accessor: "ContainerType",
                                filterable: true,
                                //minWidth: 175
                              },

                              {
                                Cell: (row) => {
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
                                minWidth: 90,
                              },
                              {
                                Cell: (row) => {
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
                                minWidth: 90,
                              },
                              {
                                Cell: (row) => {
                                  if (row.original.TotalAmount) {
                                    return (
                                      <>
                                        <p className="details-title">Price</p>
                                        <p className="details-para">
                                          {row.original.TotalAmount !== "" &&
                                          row.original.TotalAmount !== null
                                            ? row.original.TotalAmount.toFixed(
                                                2
                                              ) +
                                              " " +
                                              (row.original.BaseCurrency !==
                                              null
                                                ? row.original.BaseCurrency
                                                : "")
                                            : ""}
                                        </p>
                                      </>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                },
                                accessor: "baseFreightFee",
                                filterable: true,
                                minWidth: 80,
                              },
                            ],
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
                              const result = matchSorter(rows, filter.value, {
                                keys: ["commodities", "TransitTime"],
                                threshold:
                                  matchSorter.rankings.WORD_STARTS_WITH,
                              });

                              return result;
                            },
                          },
                        ]}
                        onFilteredChange={this.onFilteredChange.bind(this)}
                        filtered={this.state.filtered}
                        defaultFilterMethod={(filter, row) =>
                          String(row[filter.RateLineID]) === filter.value
                        }
                        filterable
                        expanded={this.state.expanded}
                        onExpandedChange={(newExpanded, index, event) => {
                          if (newExpanded[index[0]] === false) {
                            newExpanded = {};
                          } else {
                            Object.keys(newExpanded).map((k) => {
                              newExpanded[k] =
                                parseInt(k) === index[0] ? {} : false;
                            });
                          }
                          this.setState({
                            ...this.state,
                            expanded: newExpanded,
                          });
                        }}
                        data={this.state.tempRateDetails}
                        defaultPageSize={10}
                        className="-striped -highlight no-mid-align"
                        minRows={1}
                        SubComponent={(row) => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                minRows={1}
                                data={
                                  row.original.lineName !== "No Record Found"
                                    ? row.original.RateLineId === undefined
                                      ? this.state.RateSubDetails.filter(
                                          (d) =>
                                            d.RateLineID ===
                                            row.original.RateLineID
                                        )
                                      : this.state.RateSubDetails.filter(
                                          (d) =>
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
                                        accessor: "ChargeDesc",
                                      },
                                      {
                                        Header: "C. Name",
                                        accessor: "ChargeCode",
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "Rate",
                                        minWidth: 70,
                                        Cell: (props) => (
                                          <React.Fragment>
                                            {props.original.Rate}
                                            &nbsp;
                                            {props.original.Currency}
                                          </React.Fragment>
                                        ),
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "ChargeItem",
                                      },
                                      {
                                        Header: "Tax",
                                        accessor: "Tax",
                                        minWidth: 55,
                                        Cell: (props) => (
                                          <React.Fragment>
                                            {props.original.Tax !== 0
                                              ? props.original.Tax
                                              : ""}
                                          </React.Fragment>
                                        ),
                                      },

                                      {
                                        Header: "Exrate",
                                        accessor: "Exrate",
                                      },

                                      {
                                        Cell: (row) => {
                                          if (
                                            row.original.ChargeDesc !==
                                            "No Record Found"
                                          ) {
                                            return (
                                              <>
                                                {row.original.TotalAmount !==
                                                  "" &&
                                                row.original.TotalAmount !==
                                                  null
                                                  ? row.original.TotalAmount +
                                                    " " +
                                                    row.original.BaseCurrency
                                                  : 0 +
                                                    " " +
                                                    row.original.BaseCurrency}
                                              </>
                                            );
                                          } else {
                                            return <></>;
                                          }
                                        },
                                        Header: "Final Payment",
                                        accessor: "TotalAmount",
                                      },
                                    ],
                                  },
                                ]}
                                showPagination={false}
                                defaultPageSize={20}
                              />
                            </div>
                          );
                        }}
                        expandedRows={true}
                      />
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
                  : "delete-popup text-left big-popup big-popupka"
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
                    borderRadius: "15px",
                  }}
                >
                  <h3 className="mb-4 text-center">
                    {this.state.containerLoadType === "FCL"
                      ? "Equipment Types"
                      : "Cargo Details"}
                  </h3>

                  {this.state.containerLoadType === "FTL" ? (
                    this.createUITruckType()
                  ) : // <Comman
                  //   containerLoadType={this.state.containerLoadType}
                  //   TruckTypeData={this.state.TruckTypeData}
                  //   TruckType={this.state.TruckType}
                  //   parentCallback={this.callbackFunction}
                  // />
                  this.state.containerLoadType === "FCL" ? (
                    <>
                      {" "}
                      <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                        <Select
                          className="rate-dropdown"
                          getOptionLabel={(option) =>
                            option.StandardContainerCode
                          }
                          getOptionValue={(option) =>
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
                              getOptionLabel={(option) =>
                                option.SpecialContainerCode
                              }
                              getOptionValue={(option) =>
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
                                <>
                                  <Comman
                                    parentCallback={this.callbackFunction}
                                    multiCBM={this.state.multiCBM}
                                    packageTypeData={this.state.packageTypeData}
                                    containerLoadType={
                                      this.state.containerLoadType
                                    }
                                  />
                                </>
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
                    <>
                      {this.state.cmbTypeRadio === "ALL" ? (
                        <Comman
                          parentCallback={this.callbackFunction}
                          multiCBM={this.state.multiCBM}
                          packageTypeData={this.state.packageTypeData}
                          containerLoadType={this.state.containerLoadType}
                        />
                      ) : (
                        <div className="col-md-6 m-auto spe-equ">
                          <label>
                            {this.state.modeoftransport != "AIR"
                              ? "CMB"
                              : "Chargeable Weight"}
                          </label>
                          <div>
                            <input
                              type="text"
                              minLength={1}
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
                      )}
                    </>
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

                  {this.createUIPOL()}
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
                    borderRadius: "15px",
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
                    borderRadius: "15px",
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
                  ? "delete-popup text-left spot-rate-popup pol-pod-popup spmodwi"
                  : "delete-popup text-left spot-rate-popup big-popup pol-pod-popup big-popupka"
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
                    padding: "15px",
                  }}
                >
                  <div>
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="spotcustomer">Commodity</h3>
                    </div>

                    <div className="row rename-cntr login-fields">
                      <select
                        onChange={this.filterAll}
                        value={this.state.CommodityID}
                        disabled={this.state.isViewRate}
                      >
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
                  </div>

                  <div className="">
                    {/* <label>Cargo</label> */}
                    <div style={{ paddingBottom: "10px" }}>
                      <h3 className="spotcustomer">Cargo Details</h3>
                    </div>

                    <div className="w-100">
                      {this.state.containerLoadType === "FTL" ? (
                        this.createUITruckType()
                      ) : // <Comman
                      //   containerLoadType={this.state.containerLoadType}
                      //   TruckTypeData={this.state.TruckTypeData}
                      //   TruckType={this.state.TruckType}
                      //   parentCallback={this.callbackFunction}
                      // />
                      this.state.containerLoadType === "FCL" ? (
                        <>
                          {" "}
                          <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                            <Select
                              className="rate-dropdown"
                              getOptionLabel={(option) =>
                                option.StandardContainerCode
                              }
                              getOptionValue={(option) =>
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
                                  getOptionLabel={(option) =>
                                    option.SpecialContainerCode
                                  }
                                  getOptionValue={(option) =>
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
                                    <>
                                      <Comman
                                        parentCallback={this.callbackFunction}
                                        multiCBM={this.state.multiCBM}
                                        packageTypeData={
                                          this.state.packageTypeData
                                        }
                                        containerLoadType={
                                          this.state.containerLoadType
                                        }
                                      />
                                    </>
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
                      ) : this.state.cmbTypeRadio === "ALL" ? (
                        <>
                          <Comman
                            parentCallback={this.callbackFunction}
                            multiCBM={this.state.multiCBM}
                            packageTypeData={this.state.packageTypeData}
                            containerLoadType={this.state.containerLoadType}
                          />
                          {/* {

                          
                          
                          this.CreateMultiCBM()
                          
                          
                          } */}
                        </>
                      ) : (
                        <div>
                          <div className="spe-equ">
                            <label>
                              {this.state.modeoftransport != "AIR"
                                ? "CMB"
                                : "Chargeable Weight"}
                            </label>
                            <input
                              type="text"
                              minLength={1}
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
                          <span className="equip-error">
                            {/* {this.state.errors["CBM"]} */}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3
                      className="spotcustomer"
                      style={{ marginBottom: "10px" }}
                    >
                      Comments
                    </h3>
                    <textarea
                      onChange={this.handlechangemywaycomment.bind(this)}
                      values={this.state.mywaycomment}
                      className="txt-add-spot"
                      placeholder="Enter Comments"
                      id="txtRequestComments"
                    ></textarea>
                  </div>
                  <div>
                    <div style={{ paddingBottom: "15px" }}>
                      <h3 className="spotcustomer-cust">Customer Details</h3>
                      {this.state.usertype == "Sales User" ? (
                        this.state.companyName == "" ? (
                          <button
                            class="butn more-padd"
                            style={{ float: "right" }}
                            onClick={this.newOpen.bind(this)}
                          >
                            Create Customer
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 r-border">
                        <p className="details-title">Account/Customer</p>

                        <p className="details-para lbltxtclr">
                          {this.state.companyName == "" ? (
                            this.state.usertype == "Sales User" ? (
                              <div className="position-relative mt-2 spotcustdrop">
                                <ReactAutocomplete
                                  id="searchtxt"
                                  className="title-sect p-0 pt-2"
                                  getItemValue={(item) => item.Company_Name}
                                  items={this.state.customerData}
                                  renderItem={(item, isHighlighted) => (
                                    <div
                                      style={{
                                        background: isHighlighted
                                          ? "lightgray"
                                          : "white",
                                        padding: "5px",
                                      }}
                                    >
                                      {item.Company_Name}
                                    </div>
                                  )}
                                  value={this.state.fields["Company_Name"]}
                                  onChange={this.HandleChangeCon.bind(
                                    this,
                                    "Company_Name"
                                  )}
                                  onSelect={this.handleSelectCon.bind(
                                    this,
                                    "Company_Name"
                                  )}
                                  inputProps={{
                                    placeholder: "Search Account/Customer",
                                  }}
                                />
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            this.state.companyName
                          )}
                        </p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 r-border">
                        <p className="details-title">Address</p>
                        <p className="details-para">
                          {this.state.companyAddress}
                        </p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 r-border">
                        <p className="details-title">Notification Person</p>
                        <p className="details-para">{this.state.contactName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      disabled={this.state.sloding}
                      className="butn"
                      onClick={() => {
                        this.spotRateSubmit(this.state);
                      }}
                    >
                      {this.state.sloding === true ? (
                        <>
                          <i
                            style={{ marginRight: 15 }}
                            className="fa fa-refresh fa-spin"
                          ></i>
                          Please Wait ...
                        </>
                      ) : (
                        "Send"
                      )}
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
          </div>
        </div>
      </div>
    );
  }
}

export default RateTable;

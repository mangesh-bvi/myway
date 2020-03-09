import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Comman from "./../helpers/Comman";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import p2p from "./../assets/img/Port2Port.png";
import p2d from "./../assets/img/Port2Door.png";
import d2p from "./../assets/img/Door2Port.png";
import d2d from "./../assets/img/Door2Door.png";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import ReactAutocomplete from "react-autocomplete";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
var i = 0;
const animatedComponents = makeAnimated();
const { compose } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
  // InfoWindow
} = require("react-google-maps");

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
  >
    <Marker key={1} position={props.mapPositionPOD} />
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
      companyName: "",
      companyAddress: "",
      contactName: "",
      contactEmail: "",
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
          Quantity: 1,
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
      flattack_openTop: [
        {
          SpecialContainerCode: "",
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          Weight: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ],
      spacEqmtType: [],
      TruckTypeSelect: [],
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: 1,
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
      isSearch: true,
      currencyData: [],
      currencyCode: "USD",
      TruckType: [],
      showCurr: false,
      testSelection: false,
      errors: {},
      heightData: [],
      isViewRate: false,
      FCLCargoType: [],
      AIRLCLLTLType: []
    };

    this.HandleTypeofMove = this.HandleTypeofMove.bind(this);
    this.BindBindIncoTeamData = this.BindBindIncoTeamData.bind(this);
    this.HandleCounterListBind = this.HandleCounterListBind.bind(this);
    this.HandleShipmentStages = this.HandleShipmentStages.bind(this);
    this.BindPackgeTypeData = this.BindPackgeTypeData.bind(this);
    this.BindTruckTypeData = this.BindTruckTypeData.bind(this);
  }

  componentDidMount() {
    if (typeof this.props.history.location.state !== "undefined") {
      var state = this.props.history.location.state;
      if (state !== null) {
        this.HandleCounterListBind();
        this.BindPackgeTypeData();
        this.BindTruckTypeData();
        this.setState({
          companyId: state.companyId,
          companyName: state.companyName,
          companyAddress: state.companyAddress,
          contactName: state.contactName,
          contactEmail: state.contactEmail
        });

        if (state.shipmentType == "Export") {
          this.setState({
            shipmentType: state.shipmentType
          });
          document.getElementById("export").click();
        }
        if (state.shipmentType == "Import") {
          this.setState({
            shipmentType: state.shipmentType
          });
          document.getElementById("import").click();
        }
        if (state.shipmentType == "Cross Trade") {
          this.setState({
            shipmentType: state.shipmentType
          });
          document.getElementById("cross").click();
        }
        if (state.shipmentType == "Domestic") {
          this.setState({
            shipmentType: state.shipmentType
          });
          document.getElementById("domestic").click();
        }
        if (state.modeoftransport == "SEA") {
          document.getElementById("sea").click();
          this.setState({
            modeoftransport: state.modeoftransport
          });
        }

        if (state.modeoftransport == "AIR") {
          this.setState({
            modeoftransport: state.modeoftransport
          });
          document.getElementById("air").click();
        }

        if (state.modeoftransport == "ROAD") {
          this.setState({
            modeoftransport: state.modeoftransport
          });
          document.getElementById("road").click();
        }
        if (state.containerLoadType === "FCL") {
          document.getElementById("fcl").click();

          setTimeout(() => {
            this.setState({
              containerLoadType: state.containerLoadType,
              users: state.users,
              referType: state.referType,
              flattack_openTop: state.flattack_openTop,
              spacEqmtType: state.spacEqmtType,
              HazMat: state.HazMat,
              Custom_Clearance: state.Custom_Clearance,
              selected: state.users,
              specialEquipment: state.specialEquipment,
              isSpacialEqt: state.isSpacialEqt,
              refertypeSelect: state.refertypeSelect,
              specialEqtSelect: state.specialEqtSelect,
              spacEqmtTypeSelect: state.spacEqmtTypeSelect
            });
            if (state.users.length > 0) {
              document.getElementById("equipType").classList.add("equipType");
              document
                .getElementById("cntrLoadInner")
                .classList.add("cntrLoadType");
              document
                .getElementById("containerLoad")
                .classList.add("less-padd");

              document
                .getElementById("cntrLoadIconCntr")
                .classList.add("cntrLoadIconCntr");
              document
                .getElementById("cntrLoadName")
                .classList.remove("d-none");
              document
                .getElementById("cntrLoadMinusClick")
                .classList.add("d-none");
              document
                .getElementById("cntrLoadPlusClick")
                .classList.remove("d-none");
            }
          }, 1000);
        }
        if (state.containerLoadType === "LCL") {
          document.getElementById("lcl").click();
          this.setState({
            containerLoadType: state.containerLoadType,
            HazMat: state.HazMat,
            NonStackable: state.NonStackable,
            Custom_Clearance: state.Custom_Clearance,
            multiCBM: state.multiCBM,
            cmbTypeRadio: state.cmbTypeRadio,
            cbmVal: state.cbmVal
          });

          document.getElementById("cbm").classList.add("cbm");
          document
            .getElementById("cntrLoadInner")
            .classList.add("cntrLoadType");
          document.getElementById("containerLoad").classList.add("less-padd");

          document
            .getElementById("cntrLoadIconCntr")
            .classList.add("cntrLoadIconCntr");
          document.getElementById("cntrLoadName").classList.remove("d-none");
          document.getElementById("cntrLoadMinusClick").classList.add("d-none");
          document
            .getElementById("cntrLoadPlusClick")
            .classList.remove("d-none");
        }
        if (state.containerLoadType === "AIR") {
          document.getElementById("Air").click();
          this.setState({
            containerLoadType: state.containerLoadType,
            HazMat: state.HazMat,
            NonStackable: state.NonStackable,
            Custom_Clearance: state.Custom_Clearance,
            multiCBM: state.multiCBM,
            cmbTypeRadio: state.cmbTypeRadio,
            cbmVal: state.cbmVal
          });

          document.getElementById("cbm").classList.add("cbm");
          document
            .getElementById("cntrLoadInner")
            .classList.add("cntrLoadType");
          document.getElementById("containerLoad").classList.add("less-padd");

          document
            .getElementById("cntrLoadIconCntr")
            .classList.add("cntrLoadIconCntr");
          document.getElementById("cntrLoadName").classList.remove("d-none");
          document.getElementById("cntrLoadMinusClick").classList.add("d-none");
          document
            .getElementById("cntrLoadPlusClick")
            .classList.remove("d-none");
        }
        if (state.containerLoadType === "FTL") {
          document.getElementById("ftl").click();
          this.setState({
            containerLoadType: state.containerLoadType,
            HazMat: state.HazMat,
            NonStackable: state.NonStackable,
            Custom_Clearance: state.Custom_Clearance,
            TruckTypeData: state.TruckTypeData,
            cmbTypeRadio: state.cmbTypeRadio,
            cbmVal: state.cbmVal
          });

          document.getElementById("cbm").classList.add("cbm");
          document
            .getElementById("cntrLoadInner")
            .classList.add("cntrLoadType");
          document.getElementById("containerLoad").classList.add("less-padd");

          document
            .getElementById("cntrLoadIconCntr")
            .classList.add("cntrLoadIconCntr");
          document.getElementById("cntrLoadName").classList.remove("d-none");
          document.getElementById("cntrLoadMinusClick").classList.add("d-none");
          document
            .getElementById("cntrLoadPlusClick")
            .classList.remove("d-none");
        }
        if (state.containerLoadType === "LTL") {
          this.setState({
            containerLoadType: state.containerLoadType
          });
          document.getElementById("ltl").click();
        }
        if (state.typeofMove === 1) {
          // document.getElementsByName("type-move")[1].checked = true;

          this.setState({ typesofMove: "P2P", incoTerm: state.incoTerms });
          this.HandleTypeofMove("p2p");
          this.HandleGetIncoTerms();
          setTimeout(() => {
            document.getElementsByName("type-move")[0].checked = true;
          }, 500);
        }
        if (state.typeofMove === 2) {
          this.HandleTypeofMove("d2p");
          this.setState({ typesofMove: "D2P", incoTerm: state.incoTerms });
          setTimeout(() => {
            document.getElementsByName("type-move")[1].checked = true;
          }, 500);
        }
        if (state.typeofMove === 3) {
          this.HandleTypeofMove("p2d");
          this.setState({
            typesofMove: "P2D",
            incoTerm: state.incoTerms
          });

          setTimeout(() => {
            document.getElementsByName("type-move")[3].checked = true;
          }, 500);
        }
        if (state.typeofMove === 4) {
          this.HandleTypeofMove("d2d");
          this.setState({ typesofMove: "D2D", incoTerm: state.incoTerms });
          setTimeout(() => {
            document.getElementsByName("type-move")[0].checked = true;
          }, 500);
        }
      }
    } else {
      this.HandleCounterListBind();
      this.BindPackgeTypeData();
      this.BindTruckTypeData();
    }
  }

  ////Handle Check Validation
  HandleValidation() {
    let errors = this.state.errors;
    let formIsValid = true;

    if (
      this.state.specialEquipment === true &&
      this.state.flattack_openTop.length === 0 &&
      this.state.spacEqmtType.length === 0 &&
      this.state.referType === 0
    ) {
      formIsValid = false;
      errors["equipmenttype"] = "Please select equipment type";
    }

    if (
      Object.getOwnPropertyNames(this.state.polfullAddData).length == 0 &&
      this.state.fullAddressPOL.length == 0
    ) {
      formIsValid = false;
      errors["POLAddress"] = "Please select source";
    }

    if (
      Object.getOwnPropertyNames(this.state.podfullAddData).length == 0 &&
      this.state.fullAddressPOD.length == 0
    ) {
      formIsValid = false;
      errors["PODAddress"] = "Please select destination";
    }

    if (this.state.cmbTypeRadio == "ALL") {
      var multiCBM = this.state.multiCBM;

      for (let i = 0; i < multiCBM.length; i++) {
        if (
          multiCBM[i].PackageType == "" ||
          multiCBM[i].PackageType == "Select" ||
          multiCBM[i].Quantity == 0 ||
          multiCBM[i].Lengths == 0 ||
          multiCBM[i].Width == 0 ||
          multiCBM[i].Height == 0 ||
          multiCBM[i].GrossWt == 0
        ) {
          formIsValid = false;
          errors["Dimensions"] = "Please enter dimensions";
        }
      }
    }
    if (this.state.cmbTypeRadio == "CBM") {
      if (this.state.cbmVal == "") {
        formIsValid = false;
        errors["CBM"] = "Please enter CBM";
      }
    }
    if (this.state.cmbTypeRadio == "CBM") {
      if (this.state.cbmVal == "") {
        if (this.state.containerLoadType.toUpperCase() != "AIR") {
          formIsValid = false;
          errors["CBM"] = "Please enter CBM";
        } else {
          formIsValid = false;
          errors["CBM"] = "Please enter Chargable Weight";
        }
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  ////Handle Click Search Button
  HandleSearchButton() {
    if (this.HandleValidation()) {
      if (this.state.currencyCode !== "") {
        if (
          this.state.selected.length > 0 &&
          this.state.containerLoadType === "FCL"
        ) {
          this.props.history.push({
            pathname: "rate-table",
            state: this.state
          });
        } else if (
          this.state.selected.length > 0 ||
          this.state.referType.length > 0 ||
          this.state.flattack_openTop.length > 0 ||
          this.state.spacEqmtType.length > 0
        ) {
          this.props.history.push({
            pathname: "rate-table",
            state: this.state
          });
        } else if (
          this.state.selected.length == 0 &&
          this.state.containerLoadType !== "FCL"
        ) {
          this.props.history.push({
            pathname: "rate-table",
            state: this.state
          });
        } else {
          store.addNotification({
            // title: "Error",
            message: "Select Equipment Types",
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime
            }
          });
        }
      } else {
        store.addNotification({
          // title: "Error",
          message: "Select Equipment Types",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      }
    }
  }

  ////Handle Change CBM Text filed
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

  ////toggle Non Stackable Check box
  toggleNonStackable() {
    // for (var i = 0; i < this.state.heightData.length; i++) {
    //   if (
    //     this.state.heightData[i].Mode.toUpperCase() ==
    //     this.state.containerLoadType.toUpperCase()
    //   ) {
    //     for (var j = 0; j < this.state.multiCBM.length; j++) {
    //       if (!this.state.NonStackable) {
    //         this.state.multiCBM[j].Height = this.state.heightData[i].Height;
    //       } else {
    //         this.state.multiCBM[j].Height = 0;
    //       }
    //     }
    //   }
    // }
    this.setState({
      NonStackable: !this.state.NonStackable,
      multiCBM: this.state.multiCBM
    });
  }

  ////toggle HazMat Check Box
  toggleHazMat() {
    this.setState({ HazMat: !this.state.HazMat });
  }

  /////Handle set select type CBM or DIM
  cmbTypeRadioChange(e) {
    var value = e.target.value;
    if (value == "ALL") {
      this.setState({ cmbTypeRadio: value, cbmVal: "" });
    } else {
      this.setState({
        cmbTypeRadio: value,
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
        ]
      });
    }
  }

  //// Handle Truck Type Method
  BindTruckTypeData() {
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
  //// end method

  //// End Truck Tyep Dynamic element

  ////Package Type Dropdata DataBind Method
  BindPackgeTypeData() {
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

  ////Handle Change Currency Drop-down
  HandleCurrencyChange(e) {
    this.setState({
      currencyCode: e.CurrencyCode,
      isSearch: true,
      showCurr: false
    });
  }

  //// POL POD Autosearch Data
  HandleAddressDropdownPolSelect(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;

    if (field === "pol") {
      if (id.GeoCoordinate !== "" && id.GeoCoordinate !== null) {
        this.state.errors["POLAddress"] = "";
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
        this.state.errors["PODAddress"] = "";
        var geoCoordinate = id.GeoCoordinate.split(",");
        var mapPositionPOD = new Object();
        mapPositionPOD.lat = parseFloat(geoCoordinate[0]);
        mapPositionPOD.lng = parseFloat(geoCoordinate[1]);
        this.setState({
          podfullAddData: id,
          fields,
          markerPositionPOD: mapPositionPOD
        });
      }
    }

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
  ////Handle POL POD Autosearch Data
  HandlePOLPODAutosearch(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;

    var type = this.state.modeoftransport;
    self.setState({
      fields,
      polpodData: []
    });
    if (fields[field].length > 2) {
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
          self.setState({
            fields
          });
        });
    } else {
      self.setState({
        fields,
        polpodData: []
      });
    }
  }
  ////Handle UP Address Autosearch Data
  HandlePUPDAddress(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    var polpodData = [];
    var polpodDataAdd = [];

    self.setState({
      fields
    });
    if (fields[field].length > 2) {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url =
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        e.target.value +
        "&key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&sessiontoken=2333"; // site that doesn’t send Access-Control-*
      fetch(proxyurl + url)
        .then(res => res.json())
        .then(response => {
          for (let i = 0; i < response.predictions.length; i++) {
            if (field == "PUAddress") {
              polpodData.push({ Address: response.predictions[i].description });
            } else if (field == "PDAddress") {
              polpodDataAdd.push({
                Address: response.predictions[i].description
              });
            }
          }
          self.setState({
            polpodData: polpodData,
            polpodDataAdd: polpodDataAdd
          });
        })
        .catch(error => {});
    } else {
      self.setState({
        fields
      });
    }
  }

  ////Handle select Addess Drop-down
  HandleAddressDropdownSelect(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;
    this.setState({
      fields
    });
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      value +
      "&key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url)
      .then(res => res.json())
      .then(response => {
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

        if (field == "PUAddress") {
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
            PickupCity: address,
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
        } else if (field == "PDAddress") {
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
            DeliveryCity: address,
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
        }
      })
      .catch(error => {});
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
          {(this.state.containerLoadType.toUpperCase() == "LCL" ||
            "AIR" ||
            "LTL") &&
          this.state.NonStackable ? (
            <div className="spe-equ">
              <input
                type="text"
                onChange={this.HandleChangeMultiCBM.bind(this, i)}
                placeholder="H (cm)"
                className="w-100"
                name="Height"
                value={el.Height || ""}
                disabled
                //onBlur={this.cbmChange}
              />
            </div>
          ) : (
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
          )}
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "GW(Kg)" : "GW(Kg)"}
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

  ////Handle Change Muti CMB
  HandleChangeMultiCBM(i, e) {
    const { name, value } = e.target;

    let multiCBM = [...this.state.multiCBM];

    if ("PackageType" === name) {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value
      };
    } else {
      if (
        name === "Lengths" ||
        name === "Width" ||
        name === "Height" ||
        name === "GrossWt"
      ) {
        var jiji = value;

        if (isNaN(jiji)) {
          return false;
        }
        var splitText = jiji.split(".");
        var index = jiji.indexOf(".");
        if (index != -1) {
          if (splitText) {
            if (splitText[1].length <= 2) {
              if (index != -1 && splitText.length === 2) {
                multiCBM[i] = {
                  ...multiCBM[i],
                  [name]: value === "" ? 0 : value
                };
              }
            } else {
              return false;
            }
          } else {
            multiCBM[i] = {
              ...multiCBM[i],
              [name]: value === "" ? 0 : value
            };
          }
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            [name]: value === "" ? 0 : value
          };
        }
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          [name]: value === "" ? 0 : parseFloat(value)
        };
      }
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (multiCBM[i].Quantity *
          (parseFloat(multiCBM[i].Lengths) *
            parseFloat(multiCBM[i].Width) *
            parseFloat(multiCBM[i].Height))) /
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
        ((parseFloat(multiCBM[i].Lengths) / 100) *
          (parseFloat(multiCBM[i].Width) / 100) *
          (parseFloat(multiCBM[i].Height) / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: parseFloat(decVolume.toFixed(2))
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
    var Height = 0;
    for (var i = 0; i < this.state.heightData.length; i++) {
      if (
        this.state.heightData[i].Mode.toUpperCase() ==
        this.state.containerLoadType.toUpperCase()
      ) {
        if (this.state.NonStackable) {
          Height = this.state.heightData[i].Height;
        }
      }
    }
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 1,
          Lengths: 0,
          Width: 0,
          Height: Height,
          GrossWt: 0,
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
          ContainerName: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          StandardContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 1,
          Temperature: 0,
          TemperatureType: ""
        }
      ]
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spec-inner-cntr w-auto">
          <label name="TypeName">
            {el.StandardContainerCode} <span className="into-quant">X</span>
          </label>
          {/* <div className="spe-equ"> */}
          <input
            type="text"
            name="ContainerQuantity"
            min={1}
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.ContainerQuantity || ""}
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
    let flattack_openTop = [...this.state.flattack_openTop];
    if (this.state.flattack_openTop.length > 0) {
      flattack_openTop.splice(i - 1, 1);
    }
    this.setState({ spacEqmtType, flattack_openTop });
  }

  //// end spacEqmtType dyamanic element

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState(prevState => ({
      referType: [
        ...prevState.referType,
        {
          ContainerName: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          StandardContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 1,
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
          <div className="">
            <div className="spe-equ">
              <label className="mt-2" name="StandardContainerCode">
                {el.StandardContainerCode}
              </label>
            </div>
          </div>
          <div className="">
            <div className="spe-equ">
              <input
                type="text"
                name="ContainerQuantity"
                placeholder="Quantity"
                style={{ width: "40px" }}
                value={el.ContainerQuantity || ""}
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="">
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
          <div className="">
            <div className="rate-radio-cntr mt-4 mb-0">
              <div>
                <input
                  type="radio"
                  name={"TemperatureType"}
                  id={"exist-cust" + i}
                  value="C"
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
                  name={"TemperatureType"}
                  id={"new-cust" + i}
                  value="F"
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
            [name]: value
          };
        }
      }
    } else {
      referType[i] = {
        ...referType[i],
        [name]: name === "TemperatureType" ? value : parseFloat(value)
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
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder="Quantity"
              className="w-100"
              name="Quantity"
              value={el.Quantity || ""}
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
              name="Lengths"
              value={el.Lengths || ""}
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
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={el.GrossWt === 0 ? "GW (kg)" : "GW (kg)"}
              name="GrossWt"
              value={el.GrossWt || ""}
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
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
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
          flattack_openTop[i] = {
            ...flattack_openTop[i],
            [name]: parseFloat(value)
          };
        }
      }
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value)
      };
    }

    this.setState({ flattack_openTop });
  }
  addClickMultiCBM() {
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          // SpecialContainerCode: optionsVal[0].SpecialContainerCode,
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
  }
  removeClickMultiCBM(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }
  removeSpecEquip(i) {
    this.setState({
      specialEquipment: false,
      spacEqmtType: [],
      flattack_openTop: [],
      referType: []
    });
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
            type="text"
            min={1}
            l̥
            placeholder="QTY"
            name="ContainerQuantity"
            style={{ width: "40px" }}
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
                ContainerQuantity: 1,
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
                  ContainerQuantity: "1"
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
      [name]: name === "ContainerQuantity" ? parseInt(value) : 0
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

  ////get city by address
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
  ////get Area by address
  getArea = addressArray => {
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

  ////get State by address
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
  ////get ZipCode by address
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
  //// Bind Inco Team Data
  BindBindIncoTeamData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,

      headers: authHeader()
    }).then(function(response) {
      var table1 = response.data.Table1;
      var table2 = response.data.Table2;
      var table4 = response.data.Table4;
      var table5 = response.data.Table5;
      var finalArray = [];
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
        currencyData: table4,
        heightData: table5
      });
    });
  }

  HandleTypeofMove(e) {
    var type;
    if (e.target) {
      type = e.target.id;
    } else {
      type = e;
    }

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

    if (document.getElementById("cbmName") == null)
      document.getElementById("equipTypeName").classList.remove("d-none");
    else document.getElementById("cbmName").classList.remove("d-none");

    if (document.getElementById("cbmMinusClick") == null) {
      document.getElementById("equipTypeMinusClick").classList.add("d-none");
      document.getElementById("equipTypePlusClick").classList.remove("d-none");
    } else document.getElementById("cbmMinusClick").classList.add("d-none");
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
      if (typeofMove == "d2d" || typeofMove === "d2p") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "p2d" || typeofMove === "p2p") {
        self.setState({ incoTerms: "FOB" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "d2p") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "p2d" || typeofMove === "p2p") {
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
    document.getElementById("containerLoad").classList.remove("less-padd");
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document.getElementById("cntrLoadInner").classList.remove("cntrLoadType");
    document
      .getElementById("shipmentTypeIconCntr")
      .classList.add("shipmentTypeIconCntr");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("cntrLoadName").classList.add("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
    document.getElementById("cntrLoadMinusClick").classList.remove("d-none");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");
    document.getElementById("cntrLoadPlusClick").classList.add("d-none");

    this.HandleShipmentStages(type);
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

    this.BindBindIncoTeamData();

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
            Quantity: 1,
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
        currencyData: [],
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
    document.getElementById("address").classList.remove("less-padd");
    document.getElementById("addressName").classList.add("d-none");
  };
  addressMinusClick = e => {
    document.getElementById("address").classList.add("less-padd");
    document.getElementById("addressName").classList.remove("d-none");
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
          specialEqtSelect: true,
          spacEqmtTypeSelect: true
        });
        this.addClickMultiCBM(value);

        this.addSpacEqmtType(value);
        this.createUIspacEqmtType();
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

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, ""]
    }));
  }

  callbackFunction = callBackObj => {
    if (
      this.state.containerLoadType === "LCL" ||
      this.state.containerLoadType === "AIR" ||
      this.state.containerLoadType === "LTL"
    ) {
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    }
    if (this.state.containerLoadType === "FTL") {
      var TruckTypeData = callBackObj;
      this.setState({ TruckTypeData });
    }
    if (this.state.containerLoadType === "FCL") {
    }
  };
  render() {
    let self = this;

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
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }

    return (
      <div>
        <ReactNotification />
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt" style={{ background: "transparent" }}>
            <div className="rate-bg">
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
                        <p className="side-selection" id="cbmName"></p>
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
                    {this.state.containerLoadType !== "FTL" ? (
                      <div>
                        <div className="rate-radio-cntr justify-content-center">
                          <div>
                            <input
                              type="radio"
                              name="cmbTypeRadio"
                              id="exist-cust"
                              value="ALL"
                              checked={
                                this.state.cmbTypeRadio === "ALL" ? true : false
                              }
                              onChange={this.cmbTypeRadioChange.bind(this)}
                            />
                            <label
                              className="d-flex flex-column align-items-center"
                              htmlFor="exist-cust"
                            >
                              Dimensions
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              name="cmbTypeRadio"
                              id="new-cust"
                              value="CBM"
                              checked={
                                this.state.cmbTypeRadio === "CBM" ? true : false
                              }
                              onChange={this.cmbTypeRadioChange.bind(this)}
                            />
                            <label
                              className="d-flex flex-column align-items-center"
                              htmlFor="new-cust"
                            >
                              {this.state.containerLoadType === "AIR"
                                ? "Chargeable Weight"
                                : "CBM"}
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div id="cbmInner">
                      <div className="">
                        {this.state.containerLoadType !== "FTL" ? (
                          this.state.cmbTypeRadio === "ALL" ? (
                            // this.CreateMultiCBM()
                            <Comman
                              parentCallback={this.callbackFunction}
                              packageTypeData={this.state.packageTypeData}
                              containerLoadType={this.state.containerLoadType}
                              NonStackable={this.state.NonStackable}
                              multiCBM={this.state.multiCBM}
                              heightData={this.state.heightData}
                            />
                          ) : this.state.cmbTypeRadio === "CBM" ? (
                            <div className="col-md-4 m-auto">
                              <div className="spe-equ">
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
                                {this.state.errors["CBM"]}
                              </span>
                            </div>
                          ) : null
                        ) : (
                          // this.createUITruckType()
                          <Comman
                            containerLoadType={this.state.containerLoadType}
                            TruckTypeData={this.state.TruckTypeData}
                            TruckType={this.state.TruckType}
                            parentCallback={this.callbackFunction}
                          />
                        )}
                        {this.state.containerLoadType !== "FTL" ? (
                          this.state.cmbTypeRadio === "ALL" ? (
                            <span className="equip-error">
                              {this.state.errors["Dimensions"]}
                            </span>
                          ) : null
                        ) : null}
                      </div>
                      <div className="remember-forgot rate-checkbox justify-content-center">
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
                    </div>
                  </div>
                </>
              ) : null}

              {this.state.containerLoadType == "FCL" ? (
                <div className="new-rate-cntr" id="equipType">
                  <div className="rate-title-cntr">
                    <h3>Equipment Types</h3>
                    <div className="iconSelection" id="equipTypeIconCntr">
                      <p className="side-selection" id="equipTypeName"></p>
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
                        getOptionLabel={option => option.ContainerName}
                        getOptionValue={option => option.StandardContainerCode}
                        isMulti
                        options={self.state.StandardContainerCode}
                        onChange={this.newaddClick.bind(this)}
                        value={self.state.selected}
                        showNewOptionAtTop={false}
                      />
                    </div>
                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                      {this.NewcreateUI()}
                    </div>
                    <div id="equipAppend"></div>

                    {self.state.specialEquipment === true ? (
                      <>
                        <div className="spe-equ mt-0">
                          <div className="equip-plus-cntr">
                            <Select
                              isDisabled={self.state.isSpacialEqt}
                              className="rate-dropdown"
                              getOptionLabel={option => option.ContainerName}
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
                            <i
                              className="fa fa-times spec-cross"
                              aria-hidden="true"
                              onClick={this.removeSpecEquip.bind(this)}
                            ></i>
                          </div>
                        </div>
                        <div className="spe-equ mt-0">
                          <span className="equip-error">
                            {this.state.errors["equipmenttype"]}
                          </span>
                        </div>
                      </>
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
                            <div className="d-flex justify-content-center align-items-center flex-wrap">
                              {this.createUIspacEqmtType()}
                            </div>
                          </>
                        ) : null
                      ) : null}
                    </div>
                    <div className="remember-forgot rate-checkbox justify-content-center">
                      <input
                        id="haz-mat"
                        type="checkbox"
                        name="HazMat"
                        checked={this.state.HazMat}
                        onChange={this.toggleHazMat.bind(this)}
                      />
                      <label htmlFor="haz-mat">HazMat</label>

                      {this.unStack}
                      <input
                        id="cust-clear"
                        type="checkbox"
                        name={"haz-mat"}
                        onChange={this.HandleCustomeClear.bind(this)}
                      />
                      <label htmlFor="cust-clear">Custom Clearance</label>
                    </div>
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
                  <div className="new-radio-rate-cntr type-move-icons radio-border">
                    {this.state.containerLoadType === "LCL" ||
                    this.state.containerLoadType === "AIR" ||
                    this.state.containerLoadType === "FCL" ? (
                      <>
                        <div>
                          <input
                            type="radio"
                            name="type-move"
                            id="p2p"
                            value={this.state.typesofMove}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="p2p">
                            <img src={p2p} alt="Arrow" title="Port to Port" />
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="type-move"
                            id="d2p"
                            value={this.state.typesofMove}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="d2p">
                            <img src={d2p} alt="Arrow" title="Door to Port" />
                          </label>
                        </div>
                      </>
                    ) : null}
                    <div>
                      <input
                        type="radio"
                        name="type-move"
                        id="d2d"
                        value={this.state.typesofMove}
                        onChange={this.HandleTypeofMove}
                      />
                      <label htmlFor="d2d">
                        <img src={d2d} alt="Arrow" title="Door to Door" />
                      </label>
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
                            value={this.state.typesofMove}
                            onChange={this.HandleTypeofMove}
                          />
                          <label htmlFor="p2d">
                            <img src={p2d} alt="Arrow" title="Port to Door" />
                          </label>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {this.state.shipmentType.toLowerCase() != "domestic" ? (
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
                  ) : null}
                </div>
              </div>

              <div className="new-rate-cntr" id="address">
                <div className="rate-title-cntr">
                  <h3>Source - Destination</h3>
                  <div className="iconSelection" id="addressIconCntr">
                    <p className="side-selection" id="addressName"></p>
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
                      {this.state.modeoftransport === "AIR" ? (
                        this.state.typesofMove == "p2p" ||
                        this.state.typesofMove === "p2d" ? (
                          <ReactAutocomplete
                            getItemValue={item => item.AirportLongName}
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
                                {item.AirportLongName}
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
                            onSelect={this.HandleAddressDropdownPolSelect.bind(
                              this,
                              item => item.NameWoDiacritics,
                              "pol"
                            )}
                            value={this.state.fields["pol"]}
                          />
                        ) : (
                          <ReactAutocomplete
                            getItemValue={item => item.Address}
                            items={this.state.polpodData}
                            renderItem={(item, isHighlighted) => (
                              <div
                                style={{
                                  background: isHighlighted
                                    ? "lightgray"
                                    : "white"
                                }}
                                value={item.Address}
                              >
                                {item.Address}
                              </div>
                            )}
                            renderInput={function(props) {
                              return (
                                <input
                                  placeholder="Enter PU Address"
                                  className="w-100 sticky-dropdown"
                                  type="text"
                                  {...props}
                                />
                              );
                            }}
                            onChange={this.HandlePUPDAddress.bind(
                              this,
                              "PUAddress"
                            )}
                            onSelect={this.HandleAddressDropdownSelect.bind(
                              this,
                              item => item.NameWoDiacritics,
                              "PUAddress"
                            )}
                            value={this.state.fields["PUAddress"]}
                          />
                        )
                      ) : this.state.typesofMove == "p2p" ||
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
                          onSelect={this.HandleAddressDropdownPolSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "pol"
                          )}
                          value={this.state.fields["pol"]}
                        />
                      ) : (
                        <ReactAutocomplete
                          getItemValue={item => item.Address}
                          items={this.state.polpodData}
                          renderItem={(item, isHighlighted) => (
                            <div
                              style={{
                                background: isHighlighted
                                  ? "lightgray"
                                  : "white"
                              }}
                              value={item.Address}
                            >
                              {item.Address}
                            </div>
                          )}
                          renderInput={function(props) {
                            return (
                              <input
                                placeholder="Enter PU Address"
                                className="w-100 sticky-dropdown"
                                type="text"
                                {...props}
                              />
                            );
                          }}
                          onChange={this.HandlePUPDAddress.bind(
                            this,
                            "PUAddress"
                          )}
                          onSelect={this.HandleAddressDropdownSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "PUAddress"
                          )}
                          value={this.state.fields["PUAddress"]}
                        />
                      )}
                    </div>
                    {this.state.errors["POLAddress"] !== "" ? (
                      <span className="equip-error">
                        {this.state.errors["POLAddress"]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="col-md-6">
                    <div className="spe-equ address-full">
                      {this.state.modeoftransport === "AIR" ? (
                        this.state.typesofMove === "p2p" ||
                        this.state.typesofMove === "d2p" ? (
                          <ReactAutocomplete
                            getItemValue={item => item.AirportLongName}
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
                                {item.AirportLongName}
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
                            onSelect={this.HandleAddressDropdownPolSelect.bind(
                              this,
                              item => item.NameWoDiacritics,
                              "pod"
                            )}
                            value={this.state.fields["pod"]}
                          />
                        ) : (
                          <ReactAutocomplete
                            getItemValue={item => item.Address}
                            items={this.state.polpodDataAdd}
                            renderItem={(item, isHighlighted) => (
                              <div
                                style={{
                                  background: isHighlighted
                                    ? "lightgray"
                                    : "white"
                                }}
                                value={item.Address}
                              >
                                {item.Address}
                              </div>
                            )}
                            renderInput={function(props) {
                              return (
                                <input
                                  placeholder="Enter PD Address"
                                  className="w-100 sticky-dropdown"
                                  type="text"
                                  {...props}
                                />
                              );
                            }}
                            onChange={this.HandlePUPDAddress.bind(
                              this,
                              "PDAddress"
                            )}
                            onSelect={this.HandleAddressDropdownSelect.bind(
                              this,
                              item => item.NameWoDiacritics,
                              "PDAddress"
                            )}
                            value={this.state.fields["PDAddress"]}
                          />
                        )
                      ) : this.state.typesofMove === "p2p" ||
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
                          onSelect={this.HandleAddressDropdownPolSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "pod"
                          )}
                          value={this.state.fields["pod"]}
                        />
                      ) : (
                        <ReactAutocomplete
                          getItemValue={item => item.Address}
                          items={this.state.polpodDataAdd}
                          renderItem={(item, isHighlighted) => (
                            <div
                              style={{
                                background: isHighlighted
                                  ? "lightgray"
                                  : "white"
                              }}
                              value={item.Address}
                            >
                              {item.Address}
                            </div>
                          )}
                          renderInput={function(props) {
                            return (
                              <input
                                placeholder="Enter PD Address"
                                className="w-100 sticky-dropdown"
                                type="text"
                                {...props}
                              />
                            );
                          }}
                          onChange={this.HandlePUPDAddress.bind(
                            this,
                            "PDAddress"
                          )}
                          onSelect={this.HandleAddressDropdownSelect.bind(
                            this,
                            item => item.NameWoDiacritics,
                            "PDAddress"
                          )}
                          value={this.state.fields["PDAddress"]}
                        />
                      )}
                    </div>

                    {this.state.errors["PODAddress"] !== "" ? (
                      <span className="equip-error">
                        {this.state.errors["PODAddress"]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="new-rate-cntr" id="location">
                <div className="rate-title-cntr">
                  <h3 className="mb-3">Location</h3>
                  <div className="iconSelection" id="locationIconCntr">
                    <p className="side-selection" id="locationName"></p>
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
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="new-rate-cntr border-0 currncybtn">
                <div className="text-center">
                  <button
                    onClick={this.HandleSearchButton.bind(this)}
                    className="butn blue-butn rate-search mb-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewRateSearch;

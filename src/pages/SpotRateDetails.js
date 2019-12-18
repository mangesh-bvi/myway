import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import FileUpload from "./../assets/img/file.png";
import ReactTable from "react-table";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class SpotRateDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      spotrateresponseTbl: [],
      spotrateresponseTbl1: [],
      spotrateresponseTbl2: [],
      spotrateresponseTbl3: [],
      spotrateresponseTbl4: [],
      commodityData: [],
      historyModalData: [],
      historyModal: false,
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
      isSearch: true,
      currencyData: [],
      currencyCode: "",
      TruckType: [],
      testSelection: false,
      isViewRate: true,
      QuotationData: [],
      QuotationSubData: [],
      MyWayComments: "",
      MyWayDiscount: 0,
      MyWayFreeTime: 0,
      Mode: "",
      ModeOfTransport: "",
      PageName:"SportRateView"
    };
    //this.setratequery = this.setratequery.bind(this);
    this.toggleSpotHistory = this.toggleSpotHistory.bind(this);
    this.toggleViewRate = this.toggleViewRate.bind(this);
  }
  componentWillMount() {
    if (typeof this.props.location.state != "undefined") {
      var SpotRateID = this.props.location.state.detail[0];
      this.HandleShipmentDetails(SpotRateID);
      // setTimeout(() => {
      this.HandleCommodityDropdown();
      // }, 100);
    }

    this.HandlePackgeTypeData();
    this.HandleTruckTypeData();
    this.HandleGetIncoTerms();
  }

  toggleSpotHistory() {
    this.setState({ historyModal: !this.state.historyModal });
  }

  HandleShipmentDetails(SpotRateID) {
    debugger;
    var self = this;
    if (SpotRateID != undefined) {
      if (SpotRateID != null) {
        axios({
          method: "post",
          url: `${appSettings.APIURL}/SpotRateDetailsbyID`,
          data: {
            SpotRateID: SpotRateID
            //SpotRateID: '7753535'
          },
          headers: authHeader()
        })
          .then(function(response) {
            debugger;
            //alert("Success")
            //self.s .spotrateresponse = response.data;
            var spotrateresponseTbl1 = [];
            var spotrateresponseTbl1 = response.data.Table1;
            var QuotationData = response.data.Table1;
            var QuotationSubData = response.data.Table2;
            var RateQueryData = response.data.Table;

            if (response != null) {
              if (response.data != null) {
                if (QuotationData.length > 0) {
                  var POL = QuotationData[0].OriginPort_Name;
                  var POD = QuotationData[0].DestinationPort_Name;

                  setTimeout(() => {
                    self.setState({
                      QuotationData,

                      POL,
                      POD
                    });
                  }, 100);
                }
                if (QuotationSubData.length > 0) {
                  self.setState({ QuotationSubData });
                } else {
                  self.setState({
                    QuotationSubData: [{ ChargeType: "No Record Found" }]
                  });
                }
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    self.setState({
                      spotrateresponseTbl: response.data.Table[0]
                    });
                  }
                }
                if (RateQueryData.length > 0) {
                  var Mode = RateQueryData[0].Mode;
                  var MyWayComments = RateQueryData[0].MyWayComments;
                  var MyWayDiscount = RateQueryData[0].MyWayDiscount;
                  var MyWayFreeTime = RateQueryData[0].MyWayFreeTime;
                  var ModeOfTransport = RateQueryData[0].ModeOfTransport;
                  var shipmentType=RateQueryData[0].ShipmentType;
                  self.setState({
                    shipmentType,
                    Mode,
                    ModeOfTransport,
                    MyWayComments,
                    MyWayDiscount,
                    MyWayFreeTime
                  });
                }
                if (response.data.Table1 != null) {
                  if (response.data.Table1.length > 0) {
                    self.setState({
                      spotrateresponseTbl1: spotrateresponseTbl1
                    });
                  }
                }
                if (response.data.Table2 != null) {
                  if (response.data.Table2.length > 0) {
                    self.setState({
                      spotrateresponseTbl2: response.data.Table2
                    });
                  }
                }
                if (response.data.Table3 != null) {
                  if (response.data.Table3.length > 0) {
                    self.setState({
                      spotrateresponseTbl3: response.data.Table3
                    });
                  }
                }
                if (response.data.Table4 != null) {
                  if (response.data.Table4.length > 0) {
                    self.setState({
                      spotrateresponseTbl4: response.data.Table4,
                      historyModalData: response.data.Table4
                    });
                  }
                }
              }
            }
          })
          .catch(error => {
            debugger;
            var temperror = error.response.data;
            var err = temperror.split(":");
            NotificationManager.error(err[1].replace("}", ""));
          });
      }
    }
  }

  HandleCommodityDropdown() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,
      data: {},
      headers: authHeader()
    }).then(function(response) {
      

      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }

  onDocumentChangeHandler = event => {
    this.setState({
      selectedFileName: event.target.files[0].name
    });
  };

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

  toggleViewRate() {
    debugger;
    let self = this;
    let fields = this.state.fields;
    let mapPositionPOD = this.state.mapPositionPOD;
    let mapPositionPOL = this.state.mapPositionPOL;
    let markerPositionPOD = this.state.markerPositionPOD;
    let podfullAddData = this.state.podfullAddData;
    let polfullAddData = this.state.polfullAddData;
    var selected = [];
    var users = [];
    var multiCBM = [];
    fields["pod"] = this.state.spotrateresponseTbl.DestinationAddress;
    fields["pol"] = this.state.spotrateresponseTbl.PickUpAddress;
    if (this.state.spotrateresponseTbl.DeliveryGeoCordinate !== null) {
      mapPositionPOD["lat"] = parseFloat(
        this.state.spotrateresponseTbl.DeliveryGeoCordinate.split(",")[0]
      );
    }

    //mapPositionPOD["lat"] = 40.968456;
    if (this.state.spotrateresponseTbl.DeliveryGeoCordinate !== null) {
      mapPositionPOD["lng"] = parseFloat(
        this.state.spotrateresponseTbl.DeliveryGeoCordinate.split(",")[1]
      );
    }

    //mapPositionPOD["lng"] = 28.674417;
    if (this.state.spotrateresponseTbl.PickupGeoCordinate !== null) {
      mapPositionPOL["lat"] = parseFloat(
        this.state.spotrateresponseTbl.PickupGeoCordinate.split(",")[0]
      );
    }

    if (this.state.spotrateresponseTbl.PickupGeoCordinate !== null) {
      mapPositionPOL["lng"] = parseFloat(
        this.state.spotrateresponseTbl.PickupGeoCordinate.split(",")[1]
      );
    }
    //mapPositionPOL["lat"] = 18.950123;

    //mapPositionPOL["lng"] = 72.950055;
    if (this.state.spotrateresponseTbl.DeliveryGeoCordinate !== null) {
      markerPositionPOD["lat"] = parseFloat(
        this.state.spotrateresponseTbl.DeliveryGeoCordinate.split(",")[0]
      );
    }

    if (this.state.spotrateresponseTbl.DeliveryGeoCordinate !== null) {
      markerPositionPOD["lat"] = parseFloat(
        this.state.spotrateresponseTbl.DeliveryGeoCordinate.split(",")[0]
      );
    }

    if (this.state.spotrateresponseTbl.PickupGeoCordinate !== null) {
      markerPositionPOD["lng"] = parseFloat(
        this.state.spotrateresponseTbl.PickupGeoCordinate.split(",")[1]
      );
    }

    if (this.state.spotrateresponseTbl.PickupGeoCordinate !== null) {
      markerPositionPOD["lng"] = parseFloat(
        this.state.spotrateresponseTbl.PickupGeoCordinate.split(",")[1]
      );
    }
    //podfullAddData["GeoCoordinate"] = "40.968456,28.674417";
    podfullAddData[
      "GeoCoordinate"
    ] = this.state.spotrateresponseTbl1[0].PODGeoCordinate;
    podfullAddData["Location"] = "AMB";
    podfullAddData[
      "NameWoDiacritics"
    ] = this.state.spotrateresponseTbl1[0].DestinationPort_Name;
    podfullAddData["OceanPortID"] = 6302;
    podfullAddData[
      "OceanPortLongName"
    ] = this.state.spotrateresponseTbl.DestinationAddress;
    podfullAddData[
      "UNECECode"
    ] = this.state.spotrateresponseTbl1[0].DestinationPort_ID;

    //polfullAddData["GeoCoordinate"] = "18.950123,72.950055";
    polfullAddData[
      "GeoCoordinate"
    ] = this.state.spotrateresponseTbl1[0].POLGeoCordinate;
    polfullAddData["Location"] = "NSA";
    polfullAddData[
      "NameWoDiacritics"
    ] = this.state.spotrateresponseTbl1[0].OriginPort_Name;
    polfullAddData["OceanPortID"] = 1500;
    polfullAddData[
      "OceanPortLongName"
    ] = this.state.spotrateresponseTbl.PickUpAddress;
    polfullAddData[
      "UNECECode"
    ] = this.state.spotrateresponseTbl1[0].OriginPort_ID;

    if (this.state.spotrateresponseTbl.Mode == "FCL") {
      for (var i = 0; i < this.state.spotrateresponseTbl1.length; i++) {
        selected.push({
          ContainerName: this.state.spotrateresponseTbl1[i].Container,
          ProfileCodeID: this.state.spotrateresponseTbl1[i]
            .ContainerProfileCodeID,
          StandardContainerCode: this.state.spotrateresponseTbl1[i]
            .ContainerCode
        });
        users.push({
          ContainerName: this.state.spotrateresponseTbl1[i].Container,
          ContainerQuantity: this.state.spotrateresponseTbl1[i].ContainerQty,
          ProfileCodeID: this.state.spotrateresponseTbl1[i]
            .ContainerProfileCodeID,
          StandardContainerCode: this.state.spotrateresponseTbl1[i]
            .ContainerCode,
          Temperature: this.state.spotrateresponseTbl1[i].Container_Temperature,
          TemperatureType: ""
        });
      }
    }

    if (this.state.spotrateresponseTbl3.length != null) {
      if (this.state.spotrateresponseTbl3.length > 0) {
        for (var i = 0; i < this.state.spotrateresponseTbl3.length; i++) {
          multiCBM.push({
            PackageType:
              this.state.spotrateresponseTbl3[i].PackageType == null
                ? ""
                : this.state.spotrateresponseTbl3[i].PackageType,
            Quantity: this.state.spotrateresponseTbl3[i].Quantity,
            Lengths: this.state.spotrateresponseTbl3[i].Lengths,
            Width: this.state.spotrateresponseTbl3[i].Width,
            Height: this.state.spotrateresponseTbl3[i].Height,
            GrossWt: this.state.spotrateresponseTbl3[i].GrossWt,
            VolumeWeight: 0,
            Volume:
              this.state.spotrateresponseTbl3[i].Volume == null
                ? 0
                : this.state.spotrateresponseTbl3[i].Volume
          });
        }
      }
    }
    this.state.selected = selected;
    this.state.users = users;
    this.state.multiCBM = multiCBM;

    const { spotrateresponseTbl } = this.state;
    this.state.Custom_Clearance = spotrateresponseTbl.Custom_Clearance;
    this.state.puAdd = spotrateresponseTbl.PickUpAddress;
    this.state.DeliveryCity = spotrateresponseTbl.DestinationAddress;
    this.state.HazMat = spotrateresponseTbl.HAZMAT;
    this.state.containerLoadType = spotrateresponseTbl.Mode;
    this.state.shipmentType = spotrateresponseTbl.ShipmentType;
    this.state.incoTerms = spotrateresponseTbl.Trade_terms;
    if (
      spotrateresponseTbl.Mode == "FCL" ||
      spotrateresponseTbl.Mode == "LCL"
    ) {
      this.state.modeoftransport = "SEA";
    } else if (spotrateresponseTbl.Mode == "AIR") {
      this.state.modeoftransport = "AIR";
    } else {
      this.state.modeoftransport = "ROAD";
    }

    if (spotrateresponseTbl.TypeofMove == "Port To Port") {
      this.state.typeofMove = 1;
      this.state.typesofMove = "p2p";
    } else if (spotrateresponseTbl.TypeofMove == "Door To Port") {
      this.state.typeofMove = 2;
      this.state.typesofMove = "d2p";
    } else if (spotrateresponseTbl.TypeofMove == "Door To Door") {
      this.state.typeofMove = 3;
      this.state.typesofMove = "d2d";
    } else {
      this.state.typeofMove = 4;
      this.state.typesofMove = "p2d";
    }
    this.state.currencyCode = this.state.spotrateresponseTbl.BaseCurrency;
    this.state.NonStackable = this.state.spotrateresponseTbl.NonStackable;
    debugger;
    self.setState({
      Custom_Clearance: this.state.Custom_Clearance,
      DeliveryCity: this.state.DeliveryCity,
      DestGeoCordinate: "",
      HazMat: this.state.HazMat,
      NonStackable: this.state.NonStackable,
      OriginGeoCordinates: "",
      PDAddress: "",
      POD: "",
      PODData: [],
      POL: "",
      PUAddress: "",
      PickupCity: "",
      PortOfDischargeCode: "",
      PortOfLoadingCode: "",
      containerLoadType: this.state.containerLoadType,
      typeofMove: this.state.typeofMove,
      currencyCode: this.state.currencyCode,
      fields,
      incoTerms: this.state.incoTerms,
      isCustomClear: "No",
      isSpacialEqt: true,
      isSpecialEquipment: "0",
      isTypeofMove: "",
      mapPositionPOD,
      mapPositionPOL,
      markerPositionPOD,
      markerPositionPOL: {},
      modalPuAdd: false,
      modeoftransport: this.state.modeoftransport,
      multi: true,
      multiCBM: multiCBM,
      pod: "",
      podCountry: "",
      podfullAddData: podfullAddData,
      pol: "",
      polCountry: "",
      poladdress: "",
      polfullAddData: polfullAddData,
      polpodData: [],
      puAdd: "",
      referType: [],
      refertypeSelect: false,
      searchTextPOD: "",
      selected: selected,
      shipmentType: this.state.shipmentType,
      spEqtSelect: [],
      spacEqmtType: [],
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      specialEquipment: false,
      tempratureEquipment: "",
      testSelection: true,
      totalQuantity: 0,
      typesofMove: this.state.typesofMove,
      users: users,
      values: [],
      values1: [],
      zoomPOD: 0,
      zoomPOL: 0,
      RatequeryID: this.state.spotrateresponseTbl.RateQueryId
      
    });
    this.HandleViewRateData();
  }

  HandleViewRateData() {
    this.props.history.push({ pathname: "rate-table", state: this.state });
  }

  render() {
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    var i = 0;
    const { spotrateresponseTbl1, spotrateresponseTbl3 } = this.state;

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Spot Rate Details</h2>
              <div>
                <button
                  onClick={this.toggleViewRate}
                  className="butn more-padd"
                >
                  View Rate
                </button>
                <button
                  onClick={this.toggleSpotHistory}
                  className="butn more-padd"
                >
                  Rate Query History
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                  <div className="rate-final-contr">
                    <div>
                      <div className="title-border py-3">
                        <h3>
                          Rate Query -{" "}
                          {this.state.spotrateresponseTbl.RateQueryId}
                        </h3>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Shipment Type</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.ShipmentType}
                            {/* {this.state.shipmentType} */}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Mode of Transport</p>
                          <p className="details-para">
                            {this.state.ModeOfTransport}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Container Load</p>
                          <p className="details-para">
                            {/* {this.state.spotrateresponseTbl.Trade_terms} */}
                            {this.state.Mode}
                          </p>
                        </div>
                        {/* <div className="col-md-4">
                          <p className="details-title">Equipment Types</p>
                          <p className="details-para">
                          {spotrateresponseTbl1.length > 0 ?
                          spotrateresponseTbl1[0].ContainerCode : ""}
                          </p>
                        </div> */}
                        {/* <div className="col-md-4">
                          <p className="details-title">Special Equipment</p>
                          <p className="details-para"></p>
                        </div> */}
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                          <p className="details-title">
                            {/* HazMat &amp; Unstackable */}
                            HazMat
                          </p>

                          {this.state.spotrateresponseTbl.HAZMAT && (
                            <p className="details-para">Yes</p>
                          )}
                          {!this.state.spotrateresponseTbl.HAZMAT && (
                            <p className="details-para">No</p>
                          )}
                        </div>

                        <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                          <p className="details-title">NonStackable</p>

                          {this.state.spotrateresponseTbl.NonStackable && (
                            <p className="details-para">Yes</p>
                          )}
                          {!this.state.spotrateresponseTbl.NonStackable && (
                            <p className="details-para">No</p>
                          )}
                        </div>

                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Custom Clearance</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl
                              .Customs_Clearance && (
                              <p className="details-para">Yes</p>
                            )}
                            {!this.state.spotrateresponseTbl
                              .Customs_Clearance && (
                              <p className="details-para">No</p>
                            )}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Inco Terms</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Trade_terms}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">Type of Move</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.TypeofMove}
                          </p>
                        </div>

                        {this.state.spotrateresponseTbl.TypeofMove !=
                        undefined ? (
                          this.state.spotrateresponseTbl.TypeofMove.toLowerCase() ===
                          "port to port" ? (
                            <>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                <p className="details-title">POL</p>
                                <p className="details-para">
                                  {this.state.spotrateresponseTbl.PickUpAddress}
                                  {this.state.POL}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">POD</p>
                                <p className="details-para">
                                  {
                                    this.state.spotrateresponseTbl
                                      .DestinationAddress
                                  }
                                  {this.state.POD}
                                </p>
                              </div>
                            </>
                          ) : null
                        ) : (
                          ""
                        )}
                        {this.state.spotrateresponseTbl.TypeofMove !=
                        undefined ? (
                          this.state.spotrateresponseTbl.TypeofMove.toLowerCase() ===
                          "door to door" ? (
                            <>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">PU Address</p>
                                <p className="details-para">
                                  {this.state.spotrateresponseTbl.PickUpAddress}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">
                                  Delivery Address
                                </p>
                                <p className="details-para">
                                  {
                                    this.state.spotrateresponseTbl
                                      .DestinationAddress
                                  }
                                </p>
                              </div>
                            </>
                          ) : null
                        ) : (
                          ""
                        )}
                        {this.state.spotrateresponseTbl.TypeofMove !=
                        undefined ? (
                          this.state.spotrateresponseTbl.TypeofMove.toLowerCase() ===
                          "port to door" ? (
                            <>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                <p className="details-title">POL</p>
                                <p className="details-para">
                                  {this.state.spotrateresponseTbl.PickUpAddress}
                                  {this.state.POL}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">
                                  Delivery Address
                                </p>
                                <p className="details-para">
                                  {
                                    this.state.spotrateresponseTbl
                                      .DestinationAddress
                                  }
                                  {this.state.POD}
                                </p>
                              </div>
                            </>
                          ) : null
                        ) : (
                          ""
                        )}
                        {this.state.spotrateresponseTbl.TypeofMove !=
                        undefined ? (
                          this.state.spotrateresponseTbl.TypeofMove.toLowerCase() ===
                          "door to port" ? (
                            <>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">PU Address</p>
                                <p className="details-para">
                                  {this.state.spotrateresponseTbl.PickUpAddress}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">POD</p>
                                <p className="details-para">
                                  {
                                    this.state.spotrateresponseTbl
                                      .DestinationAddress
                                  }
                                </p>
                              </div>
                            </>
                          ) : null
                        ) : (
                          ""
                        )}

                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">MyWay Comments</p>
                          <p className="details-para">
                            {this.state.MyWayComments}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">MyWay Discount</p>
                          <p className="details-para">
                            {this.state.MyWayDiscount}
                          </p>
                        </div>
                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                          <p className="details-title">MyWay FreeTime</p>
                          <p className="details-para">
                            {this.state.MyWayFreeTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rate-final-contr">
                    <div className="title-border-t py-3">
                      <h3>Customer Details</h3>
                    </div>
                    <div className="">
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4">
                          <p className="details-title">Account/Customer</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Customer}
                          </p>
                        </div>
                        {/* <div className="col-md-4">
                          <p className="details-title">Address</p>
                          <p className="details-para">
                             
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Notification Person</p>
                          <p className="details-para"> </p>
                        </div> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4">
                        <p className="details-title">Commodity</p>
                        {/* <input type="text" value="Dummy" disabled /> */}
                        <select
                          value={this.state.spotrateresponseTbl.CommodityID}
                        >
                          <option>Select</option>
                          <option>All</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="col-md-12 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <div className="" style={{ width: "100%" }}>
                          <div className="ag-fresh">
                            {/* {(() => {
                              if (spotrateresponseTbl1.length>0) {
                          */}
                            {spotrateresponseTbl1.length > 0 ? (
                              <ReactTable
                                data={spotrateresponseTbl1}
                                noDataText="No Data Found"
                                filterable
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "Container",
                                        accessor: "Container"
                                      },
                                      {
                                        Header: "Quantity",
                                        accessor: "ContainerQty"
                                      },

                                      {
                                        Header: "Temperature",
                                        accessor: "Container_Temperature"
                                      }
                                    ]
                                  }
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={10}
                                minRows={1}
                                //getTrProps={this.HandleRowClickEvt}
                              />
                            ) : null}
                          </div>
                          <div className="ag-fresh">
                            <ReactTable
                              data={spotrateresponseTbl3}
                              noDataText="No Data Found"
                              filterable
                              columns={[
                                {
                                  columns: [
                                    // {
                                    //   Header: "Equipment Type",
                                    //   accessor: ""
                                    // },
                                    // {
                                    //   Header: "Package Type",
                                    //   accessor: ""
                                    // },
                                    {
                                      Header: "Quantity",
                                      accessor: "Quantity"
                                    },

                                    {
                                      Header: "Length",
                                      accessor: "Lengths"
                                    },
                                    {
                                      Header: "Height",
                                      accessor: "Height"
                                    },
                                    {
                                      Header: "Width",
                                      accessor: "Width"
                                    },

                                    {
                                      Header: "Gross Weight",
                                      accessor: "GrossWt"
                                    },

                                    {
                                      Header: "Volume Weight",
                                      accessor: "VolumeWT"
                                    }
                                  ]
                                }
                              ]}
                              className="-striped -highlight"
                              defaultPageSize={10}
                              minRows={1}
                              //getTrProps={this.HandleRowClickEvt}
                            />
                          </div>
                          {/* }})()} */}
                        </div>
                        {/* <input type="text" value="Dummy" disabled /> */}
                        <br />
                        <p className="details-title">Quotation Details</p>

                        <ReactTable
                          columns={[
                            {
                              columns: [
                                {
                                  Cell: ({ original, row }) => {
                                    i++;
                                    debugger;
                                    var lname = "";
                                    var olname = "";
                                    if (row._original.Linename) {
                                      olname = row._original.Linename;
                                      lname =
                                        row._original.Linename.replace(
                                          "  ",
                                          "_"
                                        ).replace(" ", "_") + ".png";
                                    }
                                    if (row._original.LineName) {
                                      olname = row._original.LineName;
                                      lname =
                                        row._original.LineName.replace(
                                          "  ",
                                          "_"
                                        ).replace(" ", "_") + ".png";
                                    }
                                    var mode = this.state.ModeofTransport;

                                    if (mode === "Ocean" && lname !== "") {
                                      return (
                                        <React.Fragment>
                                          <div className="rate-tab-img">
                                            <img
                                              title={olname}
                                              alt={olname}
                                              src={
                                                "https://vizio.atafreight.com/MyWayFiles/OEAN_LINERS/" +
                                                lname
                                              }
                                            />
                                          </div>
                                        </React.Fragment>
                                      );
                                    } else if (mode == "Air" && lname !== "") {
                                      return (
                                        <React.Fragment>
                                          <div className="rate-tab-img">
                                            <img
                                              title={olname}
                                              alt={olname}
                                              src={
                                                "https://vizio.atafreight.com/MyWayFiles/AIR_LINERS/" +
                                                lname
                                              }
                                            />
                                          </div>
                                        </React.Fragment>
                                      );
                                    } else {
                                      return (
                                        <React.Fragment>
                                          <div className="rate-tab-img">
                                            <img
                                              title={olname}
                                              src={
                                                "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png"
                                              }
                                              alt={olname}
                                            />
                                          </div>
                                        </React.Fragment>
                                      );
                                    }
                                  },
                                  accessor: "lineName",
                                  Header: "Line Name"
                                  // minWidth: 200
                                },
                                {
                                  Header: "POL",
                                  accessor: "POL",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">POL</p> */}
                                        <p className=" ">
                                          {row.original.OriginPort_Name}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },
                                {
                                  Header: "POD",
                                  accessor: "POD",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">POL</p> */}
                                        <p className=" ">
                                          {row.original.DestinationPort_Name}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },

                                {
                                  Header: "Transshipment Port",
                                  accessor: "TranshipmentPorts",
                                  Cell: row => {
                                    debugger;
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">
                                            Container
                                          </p> */}
                                        <p className=" ">
                                          {row.original.TranshipmentPorts}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },

                                {
                                  Header: "Free Time",
                                  accessor: "FreeTime",
                                  Cell: row => {
                                    debugger;
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">
                                            Container
                                          </p> */}
                                        <p className=" ">
                                          {row.original.FreeTime}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },

                                {
                                  Header: "Container Type",
                                  accessor: "Container",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">
                                            Container
                                          </p> */}
                                        <p className=" ">
                                          {row.original.Container}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },
                                {
                                  Header: "Transit Time",
                                  accessor: "TransitTime",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">
                                            Container
                                          </p> */}
                                        <p className=" ">
                                          {row.original.TransitTime}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },

                                {
                                  Header: "Expiry Date",
                                  accessor: "ExpiryDate",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        {/* <p className="details-title">
                                            Expiry
                                          </p> */}
                                        <p className=" ">
                                          {new Date(
                                            row.original.ExpiryDate
                                          ).toLocaleDateString("en-US")}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },

                                {
                                  Header: "Price",
                                  accessor: "Total",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        <p className=" ">
                                          {
                                            row.original
                                              .TotalAmountInBaseCureency
                                          }
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                }
                              ]
                            }
                          ]}
                          data={this.state.QuotationData}
                          minRows={0}
                          showPagination={false}
                          className="-striped -highlight no-mid-align"
                          SubComponent={row => {
                            return (
                              <div style={{ padding: "20px 0" }}>
                                <ReactTable
                                  data={this.state.QuotationSubData.filter(x=>x.RateLineID===row.original.RateLineID)}
                                  columns={[
                                    {
                                      columns: [
                                        {
                                          Header: "C. Description",
                                          accessor: "ChargeType"
                                        },
                                        {
                                          Header: "C.Name",
                                          accessor: "ChargeCode"
                                        },
                                        {
                                          Header: "Units",
                                          accessor: "ChargeItem"
                                        },
                                        {
                                          Header: "Unit Price",
                                          accessor: "Rate"
                                        },
                                        {
                                          Header: "Final Payment",
                                          accessor: "TotalAmount"
                                        }
                                      ]
                                    }
                                  ]}
                                  minRows={1}
                                  // defaultPageSize={3}
                                  showPagination={false}
                                />
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>

                    {/* <div>
                      <button
                        onClick={this.toggleViewRate}
                        className="butn more-padd"
                      >
                        View Rate
                      </button>
                    </div> */}
                    {/* <center>
                      <button
                        onClick={this.toggleBook}
                        className="butn more-padd mt-4"
                      >
                        Create Booking
                      </button>
                    </center> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------------Rate Query History Modal------------------- */}

          <Modal
            className="amnt-popup spitDesign"
            isOpen={this.state.historyModal}
            toggle={this.toggleSpotHistory}
            centered={true}
          >
            <ModalBody>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.toggleSpotHistory}
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
                <ReactTable
                  data={this.state.historyModalData}
                  columns={[
                    {
                      columns: [
                        {
                          Header: "Status",
                          accessor: "Status"
                        },
                        {
                          Header: "CreatedBy",
                          accessor: "CreatedBy"
                        },
                        // {
                        //   Header: "CreatedDate(GMT)",
                        //   accessor: "CreatedDate"
                        // },
                        {
                          Header: "CreatedDate",
                          accessor: "CreatedDate"
                        }
                      ]
                    }
                  ]}
                  defaultPageSize={3}
                  minRows={1}
                  showPagination={false}
                />

                <div className="text-center">
                  <Button className="butn" onClick={this.toggleSpotHistory}>
                    Close
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>

          {/* ----------------------End Rate Query History Modal------------------- */}
          <Modal
            className="amnt-popup"
            isOpen={this.state.modalProfit}
            toggle={this.toggleProfit}
            centered={true}
          >
            <ModalBody>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Amount</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" placeholder="Enter Amount" class="w-100" />
                </div>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.toggleProfit}>
                  Done
                </Button>
              </div>
            </ModalBody>
          </Modal>
          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalBook}
            toggle={this.toggleBook}
            centered={true}
          >
            <ModalBody>
              <h3 className="mb-4">Create Booking</h3>
              <div className="rename-cntr login-fields">
                <label>Quotation Price</label>
                <input type="text" value="5000" disabled />
              </div>
              <div className="rate-radio-cntr justify-content-center mb-3">
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="consignee"
                  />
                  <label className="m-0" htmlFor="consignee">
                    Consignee
                  </label>
                </div>
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="shipper"
                  />
                  <label className="m-0" htmlFor="shipper">
                    Shipper
                  </label>
                </div>
              </div>
              <div className="rename-cntr login-fields">
                <label>Consignee Details</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Notify Party</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Details</label>
                <input type="text" placeholder="Enter Cargo Details" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Length</label>
                <input type="text" placeholder="Enter Length" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Width</label>
                <input type="text" placeholder="Enter Width" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Height</label>
                <input type="text" placeholder="Enter Height" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Weight</label>
                <input type="text" placeholder="Enter Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Gross Weight</label>
                <input type="text" placeholder="Enter Gross Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>CBM</label>
                <input type="text" placeholder="Enter CBM" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Size</label>
                <input type="text" placeholder="Enter Cargo Size" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Weight</label>
                <input type="text" placeholder="Enter Cargo Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Buyer Name</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Address</label>
                <textarea className="txt-add"></textarea>
              </div>
              <a
                href="/booking-table"
                className="butn"
                onClick={this.toggleBook}
              >
                Create Booking
              </a>
            </ModalBody>
          </Modal>

          <Modal
            className=""
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>Popup will come</ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default SpotRateDetails;

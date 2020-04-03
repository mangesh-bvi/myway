import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import { Button, Modal, ModalBody } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
      cbmVal: "0",
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
      PageName: "SportRateView",
      RatequeryID: 0,
      Status: "",
      IsSpotRate: false,
      IsRequestForChange: false,
      CustomerID: 0,
      Company: "",
      CommodityID: 49
    };

    this.toggleSpotHistory = this.toggleSpotHistory.bind(this);
    this.toggleViewRate = this.toggleViewRate.bind(this);
  }
  componentWillMount() {
    if (typeof this.props.location.state != "undefined") {
      var SpotRateID = this.props.location.state.detail[0];
      var Status = this.props.location.state.Status;
      this.setState({ Status });
      setTimeout(() => {
        this.HandleSpotRateById(SpotRateID);
        this.BindCommodityDropdown();
      }, 200);
    }
  }
  ////toggle Spot rate history modal
  toggleSpotHistory() {
    this.setState({ historyModal: !this.state.historyModal });
  }
  ////Handle Spot Rate By Id Data
  HandleSpotRateById(SpotRateID) {
    var self = this;
    if (SpotRateID != undefined) {
      if (SpotRateID != null) {
        axios({
          method: "post",
          url: `${appSettings.APIURL}/SpotRateDetailsbyID`,
          data: {
            SpotRateID: SpotRateID
          },
          headers: authHeader()
        })
          .then(function(response) {
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
                      spotrateresponseTbl: response.data.Table[0],
                      CommodityID: response.data.Table[0].CommodityID
                    });
                  }
                }
                if (RateQueryData.length > 0) {
                  var Mode = RateQueryData[0].Mode;
                  var MyWayComments = RateQueryData[0].MyWayComments;
                  var MyWayDiscount = RateQueryData[0].MyWayDiscount;
                  var MyWayFreeTime = RateQueryData[0].MyWayFreeTime;
                  var ModeOfTransport = RateQueryData[0].ModeOfTransport;
                  var shipmentType = RateQueryData[0].ShipmentType;
                  var IsRequestForChange = RateQueryData[0].IsRequestForChange;
                  var IsSpotRate = RateQueryData[0].IsSpotRate;
                  var CustomerID = RateQueryData[0].CustomerID;
                  var Customer = RateQueryData[0].Customer;

                  self.setState({
                    CustomerID,
                    Customer,
                    IsRequestForChange,
                    IsSpotRate,
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
                    var cbmVal = spotrateresponseTbl1[0].CBM || "0";
                    self.setState({
                      cbmVal,
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
                  } else {
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
            var temperror = error.response.data;
            var err = temperror.split(":");

            store.addNotification({
              // title: "Error",
              message: err[1].replace("}", ""),
              type: "danger", // 'default', 'success', 'info', 'warning','danger'
              container: "top-right", // where to position the notifications
              dismiss: {
                duration: appSettings.NotficationTime
              }
            });
          });
      }
    }
  }
  ////Bind Commodity Dropdown Data
  BindCommodityDropdown() {
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

  /////Handle View Rate Button
  toggleViewRate() {
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

    if (this.state.spotrateresponseTbl.DeliveryGeoCordinate !== null) {
      mapPositionPOD["lng"] = parseFloat(
        this.state.spotrateresponseTbl.DeliveryGeoCordinate.split(",")[1]
      );
    }

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
    ] = this.state.spotrateresponseTbl1[0].DestinationPort_Name;
    podfullAddData[
      "UNECECode"
    ] = this.state.spotrateresponseTbl1[0].DestinationPort_ID;

    polfullAddData[
      "GeoCoordinate"
    ] = this.state.spotrateresponseTbl1[0].POLGeoCordinate;
    polfullAddData["Location"] = "";
    polfullAddData[
      "NameWoDiacritics"
    ] = this.state.spotrateresponseTbl1[0].OriginPort_Name;
    polfullAddData["OceanPortID"] = 0;
    polfullAddData[
      "OceanPortLongName"
    ] = this.state.spotrateresponseTbl1[0].OriginPort_Name;
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
            PackageType: this.state.spotrateresponseTbl3[i].PackageType || "",
            Quantity: this.state.spotrateresponseTbl3[i].Quantity || 0,
            Lengths: this.state.spotrateresponseTbl3[i].Lengths || 0,
            Width: this.state.spotrateresponseTbl3[i].Width || 0,
            Height: this.state.spotrateresponseTbl3[i].Height || 0,
            GrossWt: this.state.spotrateresponseTbl3[i].GrossWt || 0,
            VolumeWeight: this.state.spotrateresponseTbl3[i].VolumeWT || 0,
            Volume: this.state.spotrateresponseTbl3[i].Volume || 0
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
    } else if (spotrateresponseTbl.TypeofMove == "Door To Port") {
      this.state.typeofMove = 2;
    } else if (spotrateresponseTbl.TypeofMove == "Port To Door") {
      this.state.typeofMove = 3;
    } else {
      this.state.typeofMove = 4;
    }
    this.state.currencyCode = this.state.spotrateresponseTbl.BaseCurrency;
    this.state.NonStackable = this.state.spotrateresponseTbl.NonStackable;
    this.state.RatequeryID = this.state.spotrateresponseTbl.RateQueryId;

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
      RatequeryID: this.state.RatequeryID
    });
    this.HandleViewRateData();
  }
  /////Handle View Rate Button Click
  HandleViewRateData() {
    window.localStorage.setItem("isCopy", true);
    this.props.history.push({ pathname: "rate-table", state: this.state });
  }

  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }
  render() {
    const { spotrateresponseTbl1, spotrateresponseTbl3 } = this.state;
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    var i = 0;
    var equType = "";
    if (spotrateresponseTbl1.length > 0) {
      for (let j = 0; j < spotrateresponseTbl1.length; j++) {
        if (!equType.includes(spotrateresponseTbl1[j].Container)) {
          equType += spotrateresponseTbl1[j].Container;
        }
      }
    }
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }

    return (
      <React.Fragment>
        <ReactNotification />
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Spot Rate Details</h2>
              <div>
                {this.state.Status === "Rate added by Local Pricing" ? (
                  <button
                    onClick={this.toggleViewRate}
                    className="butn more-padd"
                  >
                    View Rate
                  </button>
                ) : (
                  ""
                )}
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
                      <div
                        style={{ marginBottom: "15px" }}
                        className="title-border py-3"
                      >
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
                        {this.state.Mode === "FCL" ? (
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para">{equType}</p>
                          </div>
                        ) : (
                          ""
                        )}
                        {this.state.Mode === "FCL" ? (
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para"></p>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
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

                        <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
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
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
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

                        {this.state.IsRequestForChange === true ? (
                          <>
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
                          </>
                        ) : (
                          ""
                        )}
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4">
                        <p className="details-title">Commodity</p>
                        <div class="login-fields">
                          <select
                            disabled={true}
                            value={this.state.CommodityID}
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
                    </div>
                    <div>
                      <div className="col-md-12 login-fields">
                        <div className="title-border py-3 d-flex align-items-center justify-content-between">
                          <p className="details-title">Cargo Details</p>
                          {this.state.Mode == "FCL" &&
                          this.state.Mode === "FTL" ? (
                            ""
                          ) : (
                            <p>CBM:{this.state.cbmVal}</p>
                          )}
                        </div>
                        {this.state.spotrateresponseTbl3.length > 0 ? (
                          <div className="" style={{ width: "100%" }}>
                            <div className="ag-fresh"></div>
                            <div className="ag-fresh">
                              <ReactTable
                                data={spotrateresponseTbl3}
                                noDataText="No Data Found"
                                filterable
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "Package Type",
                                        accessor: "PackageType"
                                      },
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
                                        Header:
                                          this.state.Mode != "LCL"
                                            ? "Volume Weight"
                                            : "Volume",
                                        accessor:
                                          this.state.Mode != "LCL"
                                            ? "VolumeWT"
                                            : "Volume"
                                      }
                                    ]
                                  }
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={10}
                                minRows={1}
                              />
                            </div>
                          </div>
                        ) : (
                          "No Cargo Details Available"
                        )}
                        <br />
                        {this.state.Status === "Rate added by Local Pricing" ? (
                          <>
                            <p className="details-title">Quotation Details</p>
                            <div style={{backgroundColor:"#f1f2f2"}}>
                              <ReactTable
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Cell: ({ original, row }) => {
                                          i++;

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
                                          if (row._original.lineName) {
                                            olname = row._original.lineName;
                                            lname =
                                              row._original.lineName
                                                .replace("  ", "_")
                                                .replace(" ", "_") + ".png";
                                          }
                                          var mode =
                                            this.state.ModeofTransport ||
                                            this.state.ModeOfTransport;

                                          if (
                                            mode === "Ocean" &&
                                            lname !== ""
                                          ) {
                                            var url = "";
                                            if (this.state.Mode == "FCL") {
                                              url =
                                                appSettings.imageURL +
                                                "OEAN_LINERS/" +
                                                lname;
                                            } else {
                                              url =
                                                appSettings.imageURL +
                                                "ATAFreight_console.png";
                                            }
                                            return (
                                              <React.Fragment>
                                                <div className="rate-tab-img">
                                                  <img
                                                    title={olname}
                                                    alt={olname}
                                                    src={url}
                                                    onError={this.onErrorImg.bind(
                                                      this
                                                    )}
                                                  />
                                                </div>
                                              </React.Fragment>
                                            );
                                          } else if (
                                            mode == "Air" &&
                                            lname !== ""
                                          ) {
                                            return (
                                              <React.Fragment>
                                                <div className="rate-tab-img">
                                                  <img
                                                    title={olname}
                                                    alt={olname}
                                                    onError={this.onErrorImg.bind(
                                                      this
                                                    )}
                                                    src={
                                                      appSettings.imageURL +
                                                      "AIR_LINERS/" +
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
                                                    onError={this.onErrorImg.bind(
                                                      this
                                                    )}
                                                    src={
                                                      appSettings.imageURL +
                                                      "ATAFreight_console.png"
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
                                              <p className=" ">
                                                {
                                                  row.original
                                                    .DestinationPort_Name
                                                }
                                              </p>
                                            </React.Fragment>
                                          );
                                        }
                                      },

                                      {
                                        Header: "Transshipment Port",
                                        accessor: "TranshipmentPorts",
                                        Cell: row => {
                                          return (
                                            <React.Fragment>
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
                                          return (
                                            <React.Fragment>
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
                                          var total = row.original.TotalAmountInBaseCureency.toFixed(
                                            2
                                          );
                                          return (
                                            <React.Fragment>
                                              <p className=" ">
                                                {total +
                                                  " " +
                                                  row.original.BaseCurrency}
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
                                        data={this.state.QuotationSubData.filter(
                                          x =>
                                            x.RateLineID ===
                                            row.original.RateLineID
                                        )}
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
                                                Header: "Tax",
                                                accessor: "Tax"
                                              },
                                              {
                                                Header: "Exrate",
                                                accessor: "Exrate"
                                              },

                                              {
                                                Header: "Final Payment",
                                                accessor: "TotalAmount",
                                                Cell: row => {
                                                  return (
                                                    <>
                                                      {row.original
                                                        .TotalAmount +
                                                        " " +
                                                        row.original.Currency}
                                                    </>
                                                  );
                                                }
                                              }
                                            ]
                                          }
                                        ]}
                                        minRows={1}
                                        showPagination={false}
                                      />
                                    </div>
                                  );
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
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

                        {
                          Header: "CreatedDate",
                          accessor: "CreatedDate"
                        }
                      ]
                    }
                  ]}
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
        </div>
      </React.Fragment>
    );
  }
}

export default SpotRateDetails;

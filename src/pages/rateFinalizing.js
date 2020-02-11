import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import ATA from "./../assets/img/ATAFreight_console.png";
import Moment from "react-moment";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { encryption } from "../helpers/encryption";
import matchSorter from "match-sorter";
import Autocomplete from "react-autocomplete";
import jsPDF from "jspdf";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class RateFinalizing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loding: false,
      modalProfit: false,
      modalRequest: false,
      modalRequestMsg: false,
      modalEdit: false,
      modalNewConsignee: false,
      commoditySelect: "select",
      cargoSelect: "select",
      rateQuery: true,
      rateDetails: [],
      newrateDetailsData: [],
      rateSubDetails: [],

      ////
      containerLoadType: "",
      modeoftransport: "",
      shipmentType: "",
      HazMat: false,
      incoTeam: "",
      NonStackable: false,
      typeofMove: "",
      incoTerm: "",
      commodityData: [],
      selected: [],
      flattack_openTop: [],
      spacEqmtType: [],
      polfullAddData: {},
      podfullAddData: {},
      arrLocalsCharges: [],
      fltLocalCharges: [],
      arrSurCharges: [],
      fltSurCharges: [],
      ProfitAmount: 0,
      currencyCode: "",
      count: 0,
      toggleProfitRemoveBtn: false,
      Addedprofit: "0",
      toggleAddProfitBtn: true,
      users: [],
      referType: [],
      CargoDetailsArr: [],
      equipmentTypeArr: [],
      PackageDetailsArr: [],
      containerDetailsArr: [],
      TruckDetailsArr: [],
      CommodityID: "49",
      destAddress: [],
      pickUpAddress: [],
      commodityData: [],
      modalPreview: false,
      packageTypeData: [],
      currentPackageType: "",
      valuequantity: "",
      valuelenght: "",
      valuewidth: "",
      valueheight: "",
      valueweight: "",
      valuecbm: "",
      filterrateSubDetails: [],
      selectedCommodity: "",
      accountcustname: "",
      toggleIsEdit: true,
      custNotification: "",
      isediting: false,
      isCopy: false,
      CustAddress: "",
      menuStyle: {
        textAlign: "left",
        borderRadius: "3px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "0px",
        fontSize: "90%",
        position: "absolute",
        top: "100%",
        left: "0",
        overflow: "auto",
        zIndex: "1",
        maxWidth: "300px",
        maxHeight: "100px" // TODO: don't cheat, let it flow to the bottom
      },
      customerData: [],
      fields: {},
      CompanyID: 0,
      companyName: "",
      CompanyAddress: "",
      RateLineName: "",
      ContactName: "",
      ContactEmail: "",
      isCopy: false,
      CustomClearance: 0,
      SalesQuoteNo: "",
      PickUpAddress: "",
      DestinationAddress: "",
      multiCBM: [],
      todayDate: new Date(),
      cSelectedRow: {},
      selectedDataRow: [],
      modalLoss: false,
      rateOrgDetails: [],
      discountval: 0.0,
      profitLossAmt: 0,
      profitLossPer: 0,
      newloding: false,
      cbmVal: "0",
      reloding: false,
      sendFile: null,
      showUpdate: false,
      BuyRate: 0,
      fCommodityID: 0,
      localsurAmount: 0,
      manProfitAmt: [],
      localProfitamt: [],
      expanded: {},
      currencyAmount: 0,
      sBaseCurrency: ""
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleNewConsignee = this.toggleNewConsignee.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.SendRequest = this.SendRequest.bind(this);
    this.SendRequestChange = this.SendRequestChange.bind(this);
    this.HandleLocalCharges = this.HandleLocalCharges.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.SubmitCargoDetails = this.SubmitCargoDetails.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.SendRequestCopy = this.SendRequestCopy.bind(this);
    this.RequestChangeMsgModal = this.RequestChangeMsgModal.bind(this);
    this.RequestChangeMsgModalClose = this.RequestChangeMsgModalClose.bind(
      this
    );
    this.toggleLoss = this.toggleLoss.bind(this);
  }

  componentDidMount() {
    ////debugger;;;

    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state.Quote == undefined) {
        var rateDetails = this.props.location.state.selectedDataRow;
        var newrateDetailsData = this.props.location.state.selectedDataRow;
        // var selectedDataRow = this.props.location.state.selectedDataRow;
        var rateOrgDetails = [];
        var rateSubDetails = this.props.location.state.RateSubDetails;
        var containerLoadType = this.props.location.state.containerLoadType;
        var modeoftransport = this.props.location.state.modeoftransport;
        var shipmentType = this.props.location.state.shipmentType;
        var HazMat = this.props.location.state.HazMat;
        var NonStackable = this.props.location.state.NonStackablel;
        var typeofMove = this.props.location.state.typeofMove;
        var incoTerms = this.props.location.state.incoTerms;
        var commodityData = this.props.location.state.commodityData;
        var selected = this.props.location.state.selected;
        var spacEqmtType = this.props.location.state.spacEqmtType;
        var flattack_openTop = this.props.location.state.flattack_openTop;
        var polfullAddData = this.props.location.state.polfullAddData;
        var podfullAddData = this.props.location.state.podfullAddData;
        var currencyCode = this.props.location.state.currencyCode;
        var users = this.props.location.state.users;
        var referType = this.props.location.state.referType;
        var CommodityID = this.props.location.state.CommodityID;
        var fCommodityID = this.props.location.state.CommodityID;
        var destAddress = this.props.location.state.destAddress;
        var pickUpAddress = this.props.location.state.pickUpAddress;
        var multiCBM = this.props.location.state.multiCBM;
        var TruckTypeData = this.props.location.state.TruckTypeData;
        var cbmVal = this.props.location.state.cbmVal;
        var packageTypeData = this.props.location.state.packageTypeData;
        var companyID = this.props.location.state.companyId;
        var companyName = this.props.location.state.companyName;
        var companyAddress = this.props.location.state.companyAddress;
        var contactName = this.props.location.state.contactName;
        var contactEmail = this.props.location.state.contactEmail;
        var customClearance = this.props.location.state.Custom_Clearance;
        var specialEqtSelect = this.props.location.state.specialEqtSelect;
        var specialEquipment = this.props.location.state.specialEquipment;
        var polArray = this.props.location.state.polArray;
        var podArray = this.props.location.state.podArray;

        var CargoDetailsArr = [];
        var equipmentTypeArr = [];
        var PackageDetailsArr = [];
        var TruckDetailsArr = [];
        var MultiCBM = [];

        ////debugger;;;
        if (containerLoadType == "FCL") {
          debugger;
          if (users != null) {
            if (users.length > 0) {
              for (var i = 0; i < users.length; i++) {
                CargoDetailsArr.push({
                  ContainerType: users[i].StandardContainerCode,
                  Packaging: "-",
                  Quantity: users[i].ContainerQuantity || users[i].Quantity,
                  Lenght: "-",
                  Width: "-",
                  Height: "-",
                  Weight: "-",
                  Gross_Weight: "-",
                  Temperature: "-",
                  CBM: "-",
                  Editable: false
                });

                equipmentTypeArr.push({
                  ContainerType: users[i].StandardContainerCode,
                  Quantity: users[i].ContainerQuantity
                });
              }
            }
          }

          if (spacEqmtType != null) {
            if (spacEqmtType.length > 0) {
              for (var i = 0; i < spacEqmtType.length; i++) {
                CargoDetailsArr.push({
                  ContainerType: spacEqmtType[i].StandardContainerCode,
                  Packaging: "-",
                  Quantity: spacEqmtType[i].Quantity,
                  Lenght: "-",
                  Width: "-",
                  Height: "-",
                  Weight: "-",
                  Gross_Weight: "-",
                  Temperature: "-",
                  CBM: "-",
                  Editable: false
                });
                equipmentTypeArr.push({
                  ContainerType: spacEqmtType[i].StandardContainerCode,
                  Quantity: spacEqmtType[i].Quantity
                });
              }
            }
          }
          if (referType != null) {
            if (referType.length > 0) {
              for (var i = 0; i < referType.length; i++) {
                CargoDetailsArr.push({
                  ContainerType: referType[i].ContainerCode,
                  Packaging: "-",
                  Quantity: referType[i].ContainerQuantity,
                  Lenght: "-",
                  Width: "-",
                  Height: "-",
                  Weight: "-",
                  Gross_Weight: "-",
                  Temperature:
                    referType[i].Temperature +
                    " " +
                    referType[i].TemperatureType,
                  CBM: "-",
                  Editable: false
                });
 
              }
            }
          }

          if (flattack_openTop != null) {
            if (flattack_openTop.length > 0) {
              for (var i = 0; i < flattack_openTop.length; i++) {
                CargoDetailsArr.push({
                  PackageType: flattack_openTop[i].PackageType,
                  SpecialContainerCode:
                    flattack_openTop[i].SpecialContainerCode,
                  ContainerType:
                    flattack_openTop[i].PackageType +
                    " (" +
                    flattack_openTop[i].SpecialContainerCode +
                    ")",
                  Packaging: "-",
                  Quantity: flattack_openTop[i].Quantity,
                  Lenght: flattack_openTop[i].length,
                  Width: flattack_openTop[i].width,
                  Height: flattack_openTop[i].height,
                  Weight: flattack_openTop[i].Gross_Weight,
                  Gross_Weight: "-",
                  Temperature: "-",
                  CBM: "-",
                  Editable: true
                });

                if (
                  (flattack_openTop[i].PackageType !== "" &&
                    flattack_openTop[i].SpecialContainerCode !== "" &&
                    flattack_openTop[i].Quantity !== 0) ||
                  ("" && flattack_openTop[i].length !== 0) ||
                  ("" && flattack_openTop[i].width !== 0) ||
                  ("" && flattack_openTop[i].height !== 0) ||
                  ("" && flattack_openTop[i].Gross_Weight !== 0) ||
                  ""
                ) {
                  PackageDetailsArr.push({
                    PackageType: flattack_openTop[i].PackageType,
                    SpecialContainerCode:
                      flattack_openTop[i].SpecialContainerCode,
                    ContainerType:
                      flattack_openTop[i].PackageType +
                      " (" +
                      flattack_openTop[i].SpecialContainerCode +
                      ")",
                    Quantity: flattack_openTop[i].Quantity,
                    Lenght: flattack_openTop[i].length,
                    Width: flattack_openTop[i].width,
                    Height: flattack_openTop[i].height,
                    Weight: flattack_openTop[i].Gross_Weight,
                    CBM: flattack_openTop[i].total,
                    Editable: true
                  });
                }
              }
            }
          }
        } else if (containerLoadType == "LCL" || containerLoadType == "LTL") {
          ////debugger;;;
          for (var i = 0; i < multiCBM.length; i++) {
            CargoDetailsArr.push({
              PackageType: multiCBM[i].PackageType,
              SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
              ContainerType: multiCBM[i].PackageType,
              Packaging: "-",
              Quantity: multiCBM[i].Quantity,
              Lenght: multiCBM[i].Lengths,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].Height,
              Weight: multiCBM[i].GrossWt,
              Gross_Weight: "-",
              Temperature: "-",
              CBM: multiCBM[i].Volume,
              Volume: multiCBM[i].Volume,
              VolumeWeight: multiCBM[i].VolumeWeight,
              Editable: true
            });

            PackageDetailsArr.push({
              PackageType: multiCBM[i].PackageType,
              SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
              ContainerType: multiCBM[i].PackageType,
              Packaging: "-",
              Quantity: multiCBM[i].Quantity,
              Lenght: multiCBM[i].Lengths,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].Height,
              Weight: multiCBM[i].GrossWt,
              CBM: multiCBM[i].Volume,
              Editable: true
            });
          }
        } else if (containerLoadType == "FTL") {
          if (TruckTypeData != null) {
            if (TruckTypeData.length > 0) {
              for (var i = 0; i < TruckTypeData.length; i++) {
                CargoDetailsArr.push({
                  PackageType: "",
                  SpecialContainerCode: "",
                  ContainerType: TruckTypeData[i].TruckDesc,
                  Packaging: "-",
                  Quantity: TruckTypeData[i].Quantity,
                  Lenght: "-",
                  Width: "-",
                  Height: "-",
                  Weight: "-",
                  Gross_Weight: "-",
                  Temperature: "-",
                  CBM: "-"
                });

                if (containerLoadType == "FTL") {
                  TruckDetailsArr.push({
                    TransportType: TruckTypeData[i].TruckDesc,
                    Quantity: TruckTypeData[i].Quantity
                  });
                }
              }
            }
          }
        } else if (containerLoadType == "AIR") {
          debugger;
          if (multiCBM != null) {
            if (multiCBM.length > 0) {
              for (var i = 0; i < multiCBM.length; i++) {
                if (
                  multiCBM[i].PackageType != "" &&
                  multiCBM[i].PackageType != null
                ) {
                  CargoDetailsArr.push({
                    PackageType: multiCBM[i].PackageType,
                    SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
                    ContainerType: multiCBM[i].PackageType,
                    Packaging: "-",
                    Quantity: multiCBM[i].Quantity,
                    Lenght: multiCBM[i].Lengths,
                    Width: multiCBM[i].Width,
                    Height: multiCBM[i].Height,
                    Weight: multiCBM[i].GrossWt,
                    Gross_Weight: "-",
                    Temperature: "-",
                    CBM: multiCBM[i].VolumeWeight,
                    Volume: multiCBM[i].Volume,
                    VolumeWeight: multiCBM[i].VolumeWeight,
                    Editable: true
                  });

                  PackageDetailsArr.push({
                    PackageType: multiCBM[i].PackageType,
                    SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
                    ContainerType: multiCBM[i].PackageType,
                    Packaging: "-",
                    Quantity: multiCBM[i].Quantity,
                    Lenght: multiCBM[i].Lengths,
                    Width: multiCBM[i].Width,
                    Height: multiCBM[i].Height,
                    Weight: multiCBM[i].GrossWt,
                    Volume: 0,
                    VolumeWeight:
                      multiCBM[i].VolumeWeight || multiCBM[i].VolumeWT,
                    Editable: true
                  });
                }
              }
            }
          }

          if (cbmVal != null) {
            if (cbmVal != "") {
              if (cbmVal != "0") {
                CargoDetailsArr.push({
                  PackageType: "",
                  SpecialContainerCode: "",
                  ContainerType: "-",
                  Packaging: "-",
                  Quantity: "-",
                  Lenght: "-",
                  Width: "-",
                  Height: "-",
                  Weight: "-",
                  Gross_Weight: "-",
                  Temperature: "-",
                  CBM: cbmVal
                });
              }
            }
          }
        }
        if (multiCBM != null) {
          if (multiCBM.length > 0) {
            for (var i = 0; i < multiCBM.length; i++) {
              MultiCBM.push({
                PackageType: multiCBM[i].PackageType,
                Quantity: multiCBM[i].Quantity,
                Length: multiCBM[i].Lengths,
                Width: multiCBM[i].Width,
                height: multiCBM[i].Height,
                Weight: multiCBM[i].GrossWt,
                GrossWeight: multiCBM[i].GrossWt,
                VolumeWeight:
                  containerLoadType.toUpperCase() === "AIR"
                    ? multiCBM[i].VolumeWeight
                    : 0,
                Volume:
                  containerLoadType.toUpperCase() === "LCL"
                    ? multiCBM[i].Volume
                    : 0
              });
            }
          }
        }
        const newSelected = Object.assign({}, this.state.cSelectedRow);
        debugger;
        var selectedRow = [];
        var manProfitAmt = [];
        var localProfitamt = [];
        for (let i = 0; i < rateDetails.length; i++) {
          ////debugger;;;
          var idrate = 0;
          if (rateDetails[i].RateLineId) {
            idrate = rateDetails[i].RateLineId;
            rateOrgDetails.push({
              RateLineId: idrate,
              Total: rateDetails[i].TotalAmount
            });

            manProfitAmt.push({ RateLineId: idrate, Total: 0 });
            localProfitamt.push({ RateLineId: idrate, Total: 0 });

            newSelected[rateDetails[i].RateLineId] = !this.state.cSelectedRow[
              rateDetails[i].RateLineId
            ];
            selectedRow.push(rateDetails[i]);

            this.setState({
              manProfitAmt,
              localProfitamt,
              cSelectedRow: rateDetails[i].RateLineId ? newSelected : false
            });
          }
          if (rateDetails[i].RateLineID) {
            idrate = rateDetails[i].RateLineID;
            rateOrgDetails.push({
              RateLineId: idrate,
              Total: rateDetails[i].TotalAmount
            });
            newSelected[rateDetails[i].RateLineID] = !this.state.cSelectedRow[
              rateDetails[i].RateLineID
            ];
            manProfitAmt.push({ RateLineId: idrate, Total: 0 });
            localProfitamt.push({ RateLineId: idrate, Total: 0 });
            selectedRow.push(rateDetails[i]);
            this.setState({
              manProfitAmt,
              localProfitamt,
              cSelectedRow: rateDetails[i].RateLineID ? newSelected : false
            });
          }
        }

        var custID = this.props.location.state.companyId;
        var Customer = this.props.location.state.Customer;
        var cbmVal = this.props.location.state.cbmVal;
        if (cbmVal == "") {
          cbmVal = "0";
        }
        if (Customer != "") {
          this.HandleChangeConNew(Customer);
        }

        this.handleGetBaseCurrency();
        this.setState({
          cbmVal,
          cmbTypeRadio: this.props.location.state.cmbTypeRadio,
          profitLossAmt: this.props.location.state.profitLossAmt,
          profitLossPer: this.props.location.state.profitLossPer,
          selectedDataRow: selectedRow,
          rateDetails: rateDetails,
          newrateDetailsData: newrateDetailsData,
          rateOrgDetails: rateOrgDetails,
          rateSubDetails: rateSubDetails,
          HazMat: HazMat,
          shipmentType: shipmentType,
          modeoftransport: modeoftransport,
          containerLoadType: containerLoadType,
          typeofMove: typeofMove,
          NonStackable: NonStackable,
          incoTerm: incoTerms,
          commodityData: commodityData,
          selected: selected,
          spacEqmtType: spacEqmtType,
          flattack_openTop:
            flattack_openTop.length == 0
              ? [
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
                ]
              : flattack_openTop,
          polfullAddData: polfullAddData,
          podfullAddData: podfullAddData,
          currencyCode: currencyCode,
          users: users,
          referType: referType,
          CargoDetailsArr: CargoDetailsArr,
          equipmentTypeArr: equipmentTypeArr,
          PackageDetailsArr: PackageDetailsArr,
          TruckDetailsArr: TruckDetailsArr,
          CommodityID: CommodityID,
          fCommodityID,
          destAddress: destAddress,
          pickUpAddress: pickUpAddress,
          multiCBM: MultiCBM,
          TruckTypeData: TruckTypeData,
          cbmVal: cbmVal,
          packageTypeData: packageTypeData,
          CompanyID: companyID,
          CompanyName: companyName,
          CompanyAddress: companyAddress,
          ContactName: contactName,
          ContactEmail: contactEmail,
          CustomClearance: customClearance,
          specialEqtSelect: specialEqtSelect,
          specialEquipment: specialEquipment,
          polArray: polArray,
          podArray: podArray
          // cSelectedRow: this.state.cSelectedRow
        });

        this.state.rateDetails = rateDetails;
        this.state.rateOrgDetails = rateOrgDetails;
        this.state.rateSubDetails = rateSubDetails;
        this.state.HazMat = HazMat;
        this.state.shipmentType = shipmentType;
        this.state.modeoftransport = modeoftransport;
        this.state.containerLoadType = containerLoadType;
        this.state.typeofMove = typeofMove;
        this.state.NonStackable = NonStackable;
        this.state.incoTerm = incoTerms;
        this.state.commodityData = commodityData;
        this.state.selected = selected;
        this.state.users = users;
        this.state.spacEqmtType = spacEqmtType;
        this.state.flattack_openTop = flattack_openTop;
        this.state.polfullAddData = polfullAddData;
        this.state.podfullAddData = podfullAddData;
        this.state.currencyCode = currencyCode;
        this.state.multiCBM = multiCBM;
        this.state.polArray = polArray;
        this.state.podArray = podArray;
        this.HandleLocalCharges();
        this.HandleSurCharges();
        this.HandlePackgeTypeData();
      } else {
        var qData = this.props.location.state;
        this.setState({
          isCopy: this.props.location.state.isCopy,
          containerLoadType: this.props.location.state.type
        });
        this.state.containerLoadType = this.props.location.state.type;
        this.HandleSalesQuoteView(qData);
        this.HandlePackgeTypeData();
      }

      this.HandleCommodityDropdown();

      this.HandleSalesQuoteConditions();
    }

    if (
      encryption(window.localStorage.getItem("usertype"), "desc") == "Customer"
    ) {
      this.setState({ toggleAddProfitBtn: false });
    }
  }

  handleGetBaseCurrency() {
    var selectedCurrency = window.localStorage.getItem("currencyCode");

    let self = this;
    var base = "";
    if (selectedCurrency === "TL") {
      base = "TRY";
    } else {
      base = selectedCurrency;
    }
    var url = "https://api.exchangeratesapi.io/latest?base=" + base;
    axios({
      method: "get",
      url: url
    }).then(function(response) {
      debugger;

      // currencyAmount: 0,
      var sBaseCurrency = selectedCurrency;
      self.setState({ sBaseCurrency });

      // window.location.reload(false);
    });
  }

  HandleSalesQuoteView(param) {
    ////debugger;;;
    var SalesQuoteNumber = param.Quote;
    var type = param.type;
    var isediting = param.isediting;
    var isCopy = param.isCopy;
    //alert(param.detail.Status)
    // "SHA-SQFCL-NOV19-05020"
    this.setState({
      toggleIsEdit: false,
      isediting: isediting,
      isCopy: isCopy,
      containerLoadType: type,
      newloding: true
    });
    var SalesQuoteViewdata = {
      Mode: type,
      //SalesQuoteNumber: param.Quotes,
      SalesQuoteNumber: SalesQuoteNumber
    };
    this.setState({
      QuoteNumber: SalesQuoteNumber
    });
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      // data:  {Mode:param.Type, SalesQuoteNumber:param.Quotes},
      data: SalesQuoteViewdata,
      headers: authHeader()
    })
      .then(function(response) {
        ////debugger;;;

        var TypeofMove = "";
        var IncoTerms = "";
        var CargoDetailsArr = [];
        var PackageDetailsArr = [];
        var containerDetailsArr = [];
        var equipmentTypeArr = [];
        var PickUpAddress = "";
        var DestinationAddress = "";
        var multiCBM = [];
        var flattack_openTop = [];
        var rateOrgDetails = [];
        var CompanyName = "";
        var companyID = 0;
        var Company_Address = "";
        var Company_AddressID = 0;
        //accountcustname
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                TypeofMove = response.data.Table[0].TypeOfMove;
                IncoTerms = response.data.Table[0].IncoTerm;
                CompanyName = response.data.Table[0].company_name;
                companyID = response.data.Table[0].companyID;
                Company_Address = response.data.Table[0].Company_Address;
                Company_AddressID = response.data.Table[0].Company_AddressID;
                self.setState({
                  newloding: false,
                  CompanyName,
                  companyID,
                  Company_Address,
                  Company_AddressID,
                  accountcustname:
                    response.data.Table[0].CompanyName == undefined
                      ? response.data.Table[0].company_name
                      : response.data.Table[0].CompanyName,
                  CustAddress: response.data.Table[0].Company_Address,
                  custNotification:
                    response.data.Table[0].ContactName == undefined
                      ? response.data.Table[0].contact_name
                      : response.data.Table[0].ContactName,
                  ModeOfTransport: response.data.Table[0].ModeOfTransport,
                  shipmentType:
                    response.data.Table[0].ShipmentType == null
                      ? param.type == "LCL" || param.type == "FCL"
                        ? "Ocean"
                        : param.type == "AIR"
                        ? "AIR"
                        : param.type == "Inland"
                        ? "Inland"
                        : param.type
                      : response.data.Table[0].ShipmentType,
                  containerLoadType: param.type,
                  StandardContainerCode: ".20 DC",
                  SpecialContainerCode: ".Refer Type (20 degrees)",
                  HazMat: false,
                  modeoftransport: response.data.Table[0].ModeOfTransport,
                  incoTerms: IncoTerms,
                  incoTerm: IncoTerms,
                  currencyCode: "USD",
                  PickUpAddress:
                    response.data.Table[0].TypeOfMove == "Door To Door"
                      ? response.data.Table[0].PickUpStreet +
                        ", " +
                        response.data.Table[0].PickUpState +
                        ", " +
                        response.data.Table[0].PickUpCountry
                      : response.data.Table[0].pickupAddress,
                  DestinationAddress:
                    response.data.Table[0].TypeOfMove == "Door To Door"
                      ? response.data.Table[0].DestStreet +
                        ", " +
                        response.data.Table[0].DestState +
                        ", " +
                        response.data.Table[0].DestCountry
                      : response.data.Table[0].deliveryAddress
                });
              }
            }
            var selectedRow = [];
            const newSelected = Object.assign({}, self.state.cSelectedRow);
            ////debugger;;;
            var rateDetails = response.data.Table1;
            var rateSubDetailsdata = response.data.Table2;
            var profitLossAmt = 0;

            var profitLossPer = 0;

            var finalprofitLossAmt = 0;
            var finalprofitLossPer = 0;
            var BuyRate = 0;
            debugger;
            var manProfitAmt = [];
            var localProfitamt = [];
            var aTotalAmount = 0;
            for (let i = 0; i < rateDetails.length; i++) {
              profitLossAmt = 0;
              BuyRate = 0;
              var idrate = 0;
              if (
                rateDetails[i].saleQuoteLineID &&
                rateDetails[i].saleQuoteLineID
              ) {
                idrate = rateDetails[i].saleQuoteLineID;
                rateOrgDetails.push({
                  RateLineId: idrate,
                  Total: rateDetails[i].Total
                });
                manProfitAmt.push({ RateLineId: idrate, Total: 0 });
                localProfitamt.push({ RateLineId: idrate, Total: 0 });

                newSelected[rateDetails[i].saleQuoteLineID] = !self.state
                  .cSelectedRow[rateDetails[i].saleQuoteLineID];
                selectedRow.push(rateDetails[i]);
                self.setState({
                  cSelectedRow: rateDetails[i].saleQuoteLineID
                    ? newSelected
                    : false,
                  selectedDataRow: selectedRow
                });

                var rateSubDetailsdata1 = rateSubDetailsdata.filter(
                  x => x.saleQuoteLineID == rateDetails[i].saleQuoteLineID
                );

                for (let j = 0; j < rateSubDetailsdata1.length; j++) {
                  var total = parseFloat(
                    rateSubDetailsdata1[j].Total.split(" ")[0]
                  );
                  profitLossAmt += total - rateSubDetailsdata1[j].BuyRate;
                  BuyRate += rateSubDetailsdata1[j].BuyRate;
                }
                profitLossAmt += rateDetails[i].Profit;

                finalprofitLossAmt = profitLossAmt + finalprofitLossAmt;
              }
            }

            if (selectedRow.length > 0) {
              aTotalAmount = selectedRow.reduce(function(prev, cur) {
                debugger;
                return (
                  prev + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
                );
              }, 0);

              finalprofitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
            }
            self.setState({
              BuyRate,
              manProfitAmt,
              localProfitamt,
              profitLossAmt: finalprofitLossAmt,
              profitLossPer: finalprofitLossPer
            });

            if (response.data.Table1 != null) {
              if (response.data.Table1.length > 0) {
                if (
                  TypeofMove == null ||
                  TypeofMove == "" ||
                  TypeofMove == undefined
                ) {
                  TypeofMove = response.data.Table1[0].TypeOfMove;
                }
                if (
                  IncoTerms == null ||
                  IncoTerms == "" ||
                  IncoTerms == undefined
                ) {
                  IncoTerms = response.data.Table1[0].IncoTerm;
                }

                if (
                  response.data.Table1[0].pickupAddress != undefined &&
                  response.data.Table1[0].deliveryAddress != undefined
                ) {
                  self.setState({
                    PickUpAddress: response.data.Table1[0].pickupAddress,
                    DestinationAddress: response.data.Table1[0].deliveryAddress
                  });
                }

                self.setState({
                  IncoTerms: IncoTerms,
                  incoTerms: IncoTerms,
                  incoTerm: IncoTerms,
                  //EquipmentTypes: response.data.Table1[0].ContainerCode,
                  Commodity: response.data.Table1[0].Commodity,
                  //CommodityID:response.data.Table1[0].Commodity,
                  selectedCommodity: response.data.Table1[0].Commodity
                });
              }
            }
            if (
              TypeofMove != null ||
              TypeofMove != "" ||
              TypeofMove != undefined
            ) {
              if (TypeofMove == "Port To Port") {
                self.setState({
                  typeofMove: 1
                });
              } else if (TypeofMove == "Door To Port") {
                self.setState({
                  typeofMove: 2
                });
              } else if (TypeofMove == "Port To Door") {
                self.setState({
                  typeofMove: 3
                });
              } else if (TypeofMove == "Door To Door") {
                self.setState({
                  typeofMove: 4
                });
              }
            }

            if (response.data.Table1 != null) {
              if (response.data.Table1.length > 0) {
                var table = response.data.Table1;
                var container = "";
                for (var i = 0; i < table.length; i++) {
                  if (param.type == "FCL") {
                    if (!container.includes(table[i].ContainerCode)) {
                      container += table[i].ContainerCode + ",";
                      containerDetailsArr.push({
                        ContainerName: table[i].ContainerType,
                        ContainerQuantity: table[i].ContainerQuantity,
                        ProfileCodeID: table[i].ContainerProfileID,
                        StandardContainerCode: table[i].ContainerCode,
                        Temperature: 0,
                        TemperatureType: ""
                      });

                      equipmentTypeArr.push({
                        ContainerType: table[i].ContainerCode,
                        Quantity: table[i].ContainerQuantity
                      });
                    }
                  }
                }
              }
            }

            if (response.data.Table3 != null) {
              if (response.data.Table3.length > 0) {
                var table = response.data.Table3;
                var cargoDetails = "";
                for (var i = 0; i < table.length; i++) {
                  if (!cargoDetails.includes(table[i].PackageType)) {
                    cargoDetails += table[i].PackageType + ",";
                    CargoDetailsArr.push({
                      PackageType: table[i].PackageType,
                      SpecialContainerCode: table[i].PackageType + "_" + i,
                      ContainerType: table[i].PackageType,
                      Packaging: "-",
                      Quantity: table[i].Quantity,
                      Lenght: table[i].Length,
                      Width: table[i].Width,
                      Height: table[i].height,
                      Weight: table[i].GrossWeight,
                      Gross_Weight: "-",
                      Temperature: "-",
                      CBM:
                        response.data.Table[0].ModeOfTransport.toUpperCase() ===
                        "AIR"
                          ? table[i].ChgWeight
                          : table[i].CBM === undefined
                          ? "-"
                          : table[i].CBM,
                      Volume: "-",
                      VolumeWeight: "-",
                      Editable: true
                    });

                    if (table[i].PackageType !== null) {
                      PackageDetailsArr.push({
                        PackageType: table[i].PackageType,
                        // SpecialContainerCode:
                        //   flattack_openTop[i].SpecialContainerCode,
                        ContainerType: table[i].PackageType,
                        Quantity: table[i].Quantity,
                        Lenght: table[i].Length,
                        Width: table[i].Width,
                        Height: table[i].height,
                        Weight: table[i].GrossWeight,
                        CBM:
                          response.data.Table[0].ModeOfTransport.toUpperCase() ===
                          "AIR"
                            ? table[i].ChgWeight
                            : table[i].CBM === undefined
                            ? "-"
                            : table[i].CBM,
                        Editable: true
                      });
                    }

                    multiCBM.push({
                      PackageType: table[i].PackageType,
                      Quantity: table[i].Quantity,
                      Length: table[i].Length,
                      Width: table[i].Width,
                      height: table[i].height,
                      Weight: table[i].GrossWeight,
                      GrossWeight: table[i].GrossWeight,
                      VolumeWeight:
                        param.type.toUpperCase() === "AIR"
                          ? table[i].ChgWeight
                          : 0,
                      Volume:
                        param.type.toUpperCase() === "LCL" ? table[i].CBM : 0
                    });

                    //multiCBM.push(table[i])

                    if (param.type == "FCL") {
                      flattack_openTop.push({
                        SpecialContainerCode: "",
                        PackageType: table[i].PackageType,
                        Quantity: table[i].Quantity,
                        length: table[i].Length,
                        width: table[i].Width,
                        height: table[i].height,
                        Weight: table[i].GrossWeight,
                        Gross_Weight: table[i].GrossWeight,
                        VolumeWeight: 0,
                        Volume: 0
                      });
                    }
                  }
                }
              }
            }
            self.setState({
              PackageDetailsArr: PackageDetailsArr,
              users: containerDetailsArr,
              equipmentTypeArr: equipmentTypeArr,
              CargoDetailsArr: CargoDetailsArr
            });
          }
        }
        var rateDetails = response.data.Table1;
        // for (let i = 0; i < rateDetails.length; i++) {
        //   rateOrgDetails.push({
        //     RateLineId: rateDetails[i].saleQuoteLineID,
        //     Total: rateDetails[i].Total
        //   });
        // }
        self.setState({
          rateDetails: rateDetails,
          rateOrgDetails: rateOrgDetails,
          rateSubDetails: response.data.Table2,
          multiCBM: multiCBM,
          flattack_openTop: flattack_openTop
          // specialEqtSelect: true,
          // specialEquipment:true
        });

        self.forceUpdate();
        self.HandleLocalCharges();
        self.HandleSurCharges();
        self.HandleSalesQuoteConditions();
        //console.log(response);
      })
      .catch(error => {
        ////debugger;;;
        console.log(error.response);
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

  HandleLocalCharges() {
    let self = this;
    var RoutingInformation = [];
    var rateDetails = this.state.rateDetails;
    var modeOfTransport = "";
    if (this.state.modeoftransport.toUpperCase() == "SEA") {
      modeOfTransport = "ocean";
    } else {
      modeOfTransport = this.state.modeoftransport;
    }

    var RoutingInformation = [];

    for (let i = 0; i < rateDetails.length; i++) {
      RoutingInformation.push({
        POL:
          this.state.isCopy == true
            ? rateDetails[i].POLCODE
            : rateDetails[i].POLCode,
        POD:
          this.state.isCopy == true
            ? rateDetails[i].PODCODE
            : rateDetails[i].PODCode,
        LineID:
          this.state.isCopy == true
            ? rateDetails[i].saleQuoteLineID
            : rateDetails[i].RateLineId,
        LineName:
          this.state.isCopy == true
            ? rateDetails[i].Linename
            : rateDetails[i].lineName,
        ContainerType: rateDetails[i].ContainerType,
        ContainerQty: rateDetails[i].ContainerQuantity
      });
    }
    var LocalChargeData = {
      QuoteType: this.state.containerLoadType,
      ModeOfTransport: modeOfTransport,
      Type: this.state.shipmentType,
      TypeOfMove: this.state.typeofMove,
      ChargeableWeight: 0,
      RoutingInformation: RoutingInformation,
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
      ],
      MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      BaseCurrency: self.state.currencyCode,
      PickupGeoCordinate: this.props.location.state.OriginGeoCordinates,
      DeliveryGeoCordinate: this.props.location.state.DestGeoCordinate
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/LocalChargesSalesQuote`,
      data: LocalChargeData,
      headers: authHeader()
    })
      .then(function(response) {
        ////debugger;;;
        for (var i = 0; i < response.data.Table.length; i++) {
          self.state.arrLocalsCharges.push({
            Amount: response.data.Table[i].Amount,
            AmountInBaseCurrency: response.data.Table[i].AmountInBaseCurrency,
            ChargeCode: response.data.Table[i].ChargeCode,
            ChargeDesc: response.data.Table[i].ChargeDesc,
            ChargeItem: response.data.Table[i].ChargeItem,
            ContainerType: response.data.Table[i].ContainerType,
            Currency: response.data.Table[i].Currency,
            Exrate: response.data.Table[i].Exrate,
            LineName: response.data.Table[i].LineName,
            IsChecked: false
          });

          self.state.fltLocalCharges.push({
            Amount: response.data.Table[i].Amount,
            AmountInBaseCurrency: response.data.Table[i].AmountInBaseCurrency,
            ChargeCode: response.data.Table[i].ChargeCode,
            ChargeDesc: response.data.Table[i].ChargeDesc,
            ChargeItem: response.data.Table[i].ChargeItem,
            ContainerType: response.data.Table[i].ContainerType,
            Currency: response.data.Table[i].Currency,
            Exrate: response.data.Table[i].Exrate,
            LineName: response.data.Table[i].LineName,
            IsChecked: false
          });
        }
        self.setState({
          arrLocalsCharges: response.data.Table,
          fltLocalCharges: response.data.Table
        });
      })
      .catch(error => {
        ////debugger;;;
        console.log(error.response);
      });
  }

  HandleSurCharges() {
    let self = this;
    var Containerdetails = [];
    var MultiplePOLPOD = [];
    var RoutingInformation = [];
    var rateDetails = this.state.rateDetails;
    var modeOfTransport = "";
    if (this.state.modeoftransport.toUpperCase() == "SEA") {
      modeOfTransport = "ocean";
    } else {
      modeOfTransport = this.state.modeoftransport;
    }

    for (let i = 0; i < rateDetails.length; i++) {
      RoutingInformation.push({
        POL:
          this.state.isCopy == true
            ? rateDetails[i].POLCODE
            : rateDetails[i].POLCode,
        POD:
          this.state.isCopy == true
            ? rateDetails[i].PODCODE
            : rateDetails[i].PODCode,
        LineID:
          this.state.isCopy == true
            ? rateDetails[i].saleQuoteLineID
            : rateDetails[i].RateLineId,
        LineName:
          this.state.isCopy == true
            ? rateDetails[i].Linename
            : rateDetails[i].lineName,
        ContainerType: rateDetails[i].ContainerType,
        ContainerQty: rateDetails[i].ContainerQuantity
      });
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SurChargesSalesQuote`,
      data: {
        QuoteType: this.state.containerLoadType,
        ModeOfTransport: modeOfTransport,
        Type: this.state.shipmentType,
        TypeOfMove: this.state.typeofMove,
        ChargeableWeight: 0,
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
        ],
        RoutingInformation: RoutingInformation,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        BaseCurrency: self.state.currencyCode,
        PickupGeoCordinate: this.props.location.state.OriginGeoCordinates,
        DeliveryGeoCordinate: this.props.location.state.DestGeoCordinate
      },
      headers: authHeader()
    }).then(function(response) {
      ////debugger;;;
      self.setState({
        arrSurCharges: response.data.Table,
        fltSurCharges: response.data.Table
      });

      // var data = [];
      // data = response.data;
      // self.setState({ bookingData: data }); ///problem not working setstat undefined
    });
  }

  toggleProfit() {
    debugger;
    if (this.state.selectedDataRow.length === 1) {
      var ProfitAmount = 0;
      var showUpdate = false;
      for (let i = 0; i < this.state.rateOrgDetails.length; i++) {
        if (this.state.isCopy) {
          if (this.state.rateOrgDetails[i].Total) {
            if (
              this.state.rateOrgDetails[i].RateLineId ===
              this.state.selectedDataRow[0].saleQuoteLineID
            ) {
              // var total = parseFloat(
              //   this.state.selectedDataRow[0].Total.split(" ")[0]
              // );
              // var total1 = parseFloat(
              //   this.state.rateOrgDetails[i].Total.split(" ")[0]
              // );
              ProfitAmount = this.state.manProfitAmt[i].Total;
              if (ProfitAmount > 0) {
                showUpdate = true;
              }
            }
          }
        } else {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            this.state.selectedDataRow[0].RateLineId
          ) {
            debugger;

            ProfitAmount = this.state.manProfitAmt[i].Total;

            if (this.state.manProfitAmt[i].Total > 0) {
              showUpdate = true;
            }
          }
        }
      }

      this.setState(prevState => ({
        modalProfit: !prevState.modalProfit,
        ProfitAmount: ProfitAmount,
        showUpdate
        //ProfitAmount: this.state.Addedprofit
      }));
    } else {
      NotificationManager.error("Please select only one rate to add profit");
    }
  }

  toggleLoss() {
    ////debugger;;;
    if (this.state.selectedDataRow.length === 1) {
      this.setState(prevState => ({
        modalLoss: !prevState.modalLoss,
        ProfitAmount: 0
        //ProfitAmount: this.state.Addedprofit
      }));
    } else {
      NotificationManager.error("Please select only one rate to remove profit");
    }
  }
  toggleNewConsignee() {
    // if(window.confirm('Are you sure to save this record?'))
    // {
    //   this.handleQuoteSubmit();

    // }
    this.setState(prevState => ({
      modalNewConsignee: !prevState.modalNewConsignee
    }));
  }

  newOpen() {
    window.open(
      "https://org242240bd.crm.dynamics.com/main.aspx?etn=lead&pagetype=entityrecord",
      "_blank"
    );
  }

  commoditySelect(e) {
    this.setState({
      commoditySelect: e.target.value,
      CommodityID: e.target.value
    });
  }
  cargoSelect(e) {
    this.setState({
      cargoSelect: e.target.value
    });
  }

  rateQuery() {
    this.setState({
      rateQuery: !this.state.rateQuery
    });
  }

  toggleRequest() {
    this.setState(prevState => ({
      modalRequest: !prevState.modalRequest
    }));
    this.setState({ discountval: 0 });
    this.RequestChangeMsgModalClose();
  }

  RequestChangeMsgModal() {
    if (this.state.selectedDataRow.length > 0) {
      if (this.state.CompanyName) {
        this.setState(prevState => ({
          modalRequestMsg: !prevState.modalRequestMsg
        }));
      } else {
        NotificationManager.error("please select customere");
      }
    } else {
      NotificationManager.error("Please select atleast one rate");
    }
  }
  RequestChangeMsgModalClose() {
    this.setState({
      modalRequestMsg: false
    });
  }

  togglePreview() {
    debugger;
    this.setState(prevState => ({
      modalPreview: !prevState.modalPreview
    }));
  }

  toggleEdit(e) {
    ////debugger;;;

    if (!this.state.modalEdit) {
      var valuetype = e.target.getAttribute("data-valuetype");
      var valuequantity = e.target.getAttribute("data-valuequantity");
      var valuelenght = e.target.getAttribute("data-valuelenght");
      var valuewidth = e.target.getAttribute("data-valuewidth");
      var valueheight = e.target.getAttribute("data-valueheight");
      var valueweight = e.target.getAttribute("data-valueweight");
      var valuecbm = e.target.getAttribute("data-valuecbm");
      var valuespecialsontainersode = e.target.getAttribute(
        "data-valuespecialsontainersode"
      );

      this.setState(prevState => ({
        currentPackageType: valuetype,
        valuequantity: valuequantity,
        valuelenght: valuelenght,
        valuewidth: valuewidth,
        valueheight: valueheight,
        valueweight: valueweight,
        valuecbm: valuecbm,
        valuespecialsontainersode: valuespecialsontainersode
      }));
      this.forceUpdate();
    }

    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  SendRequestChange() {
    debugger;

    if (this.state.selectedDataRow.length > 0) {
      if (this.state.CompanyID === 0) {
        NotificationManager.error("Please Select Customer");
        return false;
      }

      this.setState({ reloding: true });
      var txtRequestDiscount,
        txtRequestFreeTime,
        txtRequestComments = "";
      txtRequestDiscount = 0;
      txtRequestFreeTime = 0;
      var containerLoadType = this.state.containerLoadType;
      if (document.getElementById("txtRequestDiscount") != undefined) {
        txtRequestDiscount = document.getElementById("txtRequestDiscount")
          .value;
      }
      if (document.getElementById("txtRequestFreeTime") != undefined) {
        txtRequestFreeTime = document.getElementById("txtRequestFreeTime")
          .value;
      }

      if (document.getElementById("txtRequestComments") != undefined) {
        txtRequestComments = document.getElementById("txtRequestComments")
          .value;
      }

      //alert(txtRequestDiscount + " - " + txtRequestFreeTime + " - " + txtRequestComments)

      var FCLSQLocalChargesarr = [];
      var FCLSQSurChargesarr = [];

      var chkslocalcharge = document.getElementsByName("localCharge");
      for (var i = 0; i < chkslocalcharge.length; i++) {
        if (chkslocalcharge[i].checked) {
          FCLSQLocalChargesarr.push({
            LocalChargeID: 0,
            Description: chkslocalcharge[0].attributes["data-chargedesc"].value,
            Amount:
              chkslocalcharge[0].attributes["data-amountinbasecurrency"].value,
            Currency: chkslocalcharge[0].attributes["data-currency"].value,
            Minimum: 0,
            Tax: 0,
            ChargeItem: chkslocalcharge[0].attributes["data-chargeitem"].value,
            RateID: 0,
            Exrate: 0
          });
        }
      }
      ////debugger;;;
      // var rateDetailsarr = this.state.rateDetails;
      // var rateSubDetailsarr = this.state.rateSubDetails;

      var rateDetailsarr = this.state.selectedDataRow;

      var subratedetails = [];
      for (let i = 0; i < rateDetailsarr.length; i++) {
        if (this.state.isCopy === true) {
          var data = this.state.rateSubDetails.filter(
            x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
          );
          subratedetails.push(data);
        } else {
          var data = this.state.rateSubDetails.filter(
            x => x.RateLineID === rateDetailsarr[i].RateLineId
          );
          for (let i = 0; i < data.length; i++) {
            subratedetails.push(data[i]);
          }
          // subratedetails.push(data);
        }
      }
      var rateSubDetailsarr = subratedetails;
      var FCLSQBaseFreight = [];

      for (var i = 0; i < rateDetailsarr.length; i++) {
        if (containerLoadType == "FCL") {
          FCLSQBaseFreight.push({
            RateID: rateDetailsarr[i].RateLineId,
            RateType: rateDetailsarr[i].TypeOfRate
          });
        }
        if (containerLoadType == "LCL") {
          debugger;
          FCLSQBaseFreight.push({
            RateID:
              rateDetailsarr[i].RateLineID || rateDetailsarr[i].RateLineId,
            RateType: rateDetailsarr[i].TypeOfRate
          });
        } else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
          FCLSQBaseFreight.push({
            RateID: rateDetailsarr[i].RateLineID,
            RateType: rateDetailsarr[i].TypeOfRate
          });
        } else if (containerLoadType == "AIR") {
          FCLSQBaseFreight.push({
            RateID: rateDetailsarr[i].RateLineId,
            RateType: rateDetailsarr[i].TypeOfRate
          });
        }
      }

      var FCLSQCharges = [];

      for (var i = 0; i < rateDetailsarr.length; i++) {
        for (var j = 0; j < rateSubDetailsarr.length; j++) {
          if (containerLoadType == "FCL") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId
            ) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate: rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax:
                  rateSubDetailsarr[j].Tax == null
                    ? 0
                    : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount: rateSubDetailsarr[j].TotalAmount
              });
              // }
            }
          }

          if (containerLoadType == "LCL") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineID
            ) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate: rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax:
                  rateSubDetailsarr[j].Tax == null
                    ? 0
                    : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount: rateSubDetailsarr[j].TotalAmount
              });
            }
            // }
          }
          if (containerLoadType == "FTL" || containerLoadType == "LTL") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineID
            ) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate:
                  rateSubDetailsarr[j].Rate == null
                    ? 0
                    : rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax:
                  rateSubDetailsarr[j].Tax == null
                    ? 0
                    : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount:
                  rateSubDetailsarr[j].TotalAmount == null
                    ? 0
                    : rateSubDetailsarr[j].TotalAmount
              });
            }
          }
          if (containerLoadType == "AIR") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId
            ) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate:
                  rateSubDetailsarr[j].Rate == null
                    ? 0
                    : rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax:
                  rateSubDetailsarr[j].Tax == null
                    ? 0
                    : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount:
                  rateSubDetailsarr[j].TotalAmount == null
                    ? 0
                    : rateSubDetailsarr[j].TotalAmount
              });
            }
            // }
          }
        }
      }

      var chksurcharges = document.getElementsByName("surcharges");
      for (var i = 0; i < chksurcharges.length; i++) {
        if (chksurcharges[i].checked) {
          FCLSQSurChargesarr.push({
            SurchargeID: 0,
            ChargeCode: chksurcharges[0].attributes["data-chargedesc"].value,
            Amount:
              chksurcharges[0].attributes["data-amountinbasecurrency"].value,
            Currency: chksurcharges[0].attributes["data-currency"].value,
            Tax: 0,
            ChargeItem: chksurcharges[0].attributes["data-chargeitem"].value,
            RateID: 0,
            Exrate: 0
          });
        }
      }

      var Containerdetails = [];
      var RateQueryDim = [];
      // ProfileCodeID:23,ContainerCode:'40GP',Type:'40 Standard Dry',ContainerQuantity:3,Temperature:0
      var usesr = this.state.users;
      var spacEqmtType = this.state.spacEqmtType;
      var referType = this.state.referType;
      var flattack_openTop = this.state.flattack_openTop;

      if (containerLoadType == "FCL") {
        if (usesr != null) {
          if (usesr.length > 0) {
            for (var i = 0; i < usesr.length; i++) {
              Containerdetails.push({
                ProfileCodeID: usesr[i].ProfileCodeID,
                ContainerCode: usesr[i].StandardContainerCode,
                Type: usesr[i].ContainerName,
                ContainerQuantity: usesr[i].ContainerQuantity,
                Temperature:
                  usesr[i].Temperature == undefined ? 0 : usesr[i].Temperature
              });
            }
          }
        }

        if (spacEqmtType != null) {
          if (spacEqmtType.length > 0) {
            for (var i = 0; i < spacEqmtType.length; i++) {
              Containerdetails.push({
                ProfileCodeID: spacEqmtType[i].ProfileCodeID,
                ContainerCode: spacEqmtType[i].StandardContainerCode,
                Type: spacEqmtType[i].ContainerName,
                ContainerQuantity: spacEqmtType[i].Quantity,
                Temperature: 0
              });
            }
          }
        }

        if (referType != null) {
          if (referType.length > 0) {
            for (var i = 0; i < referType.length; i++) {
              Containerdetails.push({
                ProfileCodeID: referType[i].ProfileCodeID,
                ContainerCode: referType[i].ContainerCode,
                Type: referType[i].Type,
                ContainerQuantity: referType[i].ContainerQuantity,
                Temperature: referType[i].Temperature
              });
            }
          }
        }

        if (flattack_openTop != null) {
          if (flattack_openTop.length > 0) {
            for (var i = 0; i < flattack_openTop.length; i++) {
              RateQueryDim.push({
                Quantity: flattack_openTop[i].Quantity,
                Lengths: flattack_openTop[i].length,
                Width: flattack_openTop[i].width,
                Height: flattack_openTop[i].height,
                GrossWt: flattack_openTop[i].Gross_Weight,
                VolumeWeight: 0,
                Volume: 0,
                PackageType:
                  flattack_openTop[i].PackageType == undefined
                    ? ""
                    : flattack_openTop[i].PackageType
              });
            }
          }
        }
      } else if (containerLoadType == "LCL") {
        debugger;
        var multiCBM = this.state.multiCBM;
        if (this.state.isediting) {
          if (this.state.cmbTypeRadio === "ALL") {
            for (var i = 0; i < multiCBM.length; i++) {
              //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
              RateQueryDim.push({
                Quantity: parseFloat(multiCBM[i].Quantity),
                Lengths: parseFloat(multiCBM[i].Length),
                Width: parseFloat(multiCBM[i].Width),
                Height: parseFloat(multiCBM[i].height),
                GrossWt: parseFloat(multiCBM[i].GrossWeight),
                VolumeWeight: parseFloat(multiCBM[i].VolumeWeight),
                Volume: parseFloat(multiCBM[i].Volume),
                PackageType: multiCBM[i].PackageType
              });
            }
          } else {
            RateQueryDim.push({
              Quantity: 0,
              Lengths: 0,
              Width: 0,
              Height: 0,
              GrossWt: 0,
              VolumeWeight: 0,
              Volume: parseFloat(this.state.cbmVal) || 0,
              PackageType: ""
            });
          }
        } else {
          if (this.state.cmbTypeRadio === "ALL") {
            for (var i = 0; i < multiCBM.length; i++) {
              //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
              RateQueryDim.push({
                Quantity: multiCBM[i].Quantity,
                Lengths: multiCBM[i].Lengths,
                Width: multiCBM[i].Width,
                Height: multiCBM[i].Height,
                GrossWt: multiCBM[i].GrossWt,
                VolumeWeight: multiCBM[i].VolumeWeight,
                Volume: multiCBM[i].Volume,
                PackageType: multiCBM[i].PackageType
              });
            }
          } else {
            RateQueryDim.push({
              Quantity: 0,
              Lengths: 0,
              Width: 0,
              Height: 0,
              GrossWt: 0,
              VolumeWeight: 0,
              Volume: parseFloat(this.state.cbmVal) || 0,
              PackageType: ""
            });
          }
        }
      } else if (containerLoadType == "FTL") {
        var TruckTypeData = this.state.TruckTypeData;
        for (var i = 0; i < TruckTypeData.length; i++) {
          //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
          RateQueryDim.push({
            Quantity: TruckTypeData[i].Quantity,
            Lengths: 0,
            Width: 0,
            Height: 0,
            GrossWt: 0,
            VolumeWeight: 0,
            Volume: 0,
            PackageType: TruckTypeData[i].TruckDesc
          });
        }
        //
      } else if (containerLoadType == "AIR" || containerLoadType == "LTL") {
        var multiCBM = this.state.multiCBM;

        if (this.state.cmbTypeRadio === "ALL") {
          for (var i = 0; i < multiCBM.length; i++) {
            //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths:
                containerLoadType == "AIR"
                  ? multiCBM[i].Length
                  : multiCBM[i].Lengths,
              Width: multiCBM[i].Width,
              Height:
                containerLoadType == "AIR"
                  ? multiCBM[i].height
                  : multiCBM[i].Height,
              GrossWt:
                containerLoadType == "AIR"
                  ? multiCBM[i].GrossWeight
                  : multiCBM[i].GrossWt,
              VolumeWeight: multiCBM[i].VolumeWeight,
              Volume: containerLoadType == "AIR" ? 0 : multiCBM[i].Volume,
              PackageType: multiCBM[i].PackageType
            });
          }
        } else if (this.state.cmbTypeRadio === "CBM") {
          RateQueryDim.push({
            Quantity: 0,
            Lengths: 0,
            Width: 0,
            Height: 0,
            GrossWt: 0,
            VolumeWeight: 0,
            Volume: parseFloat(this.state.cbmVal) || 0,
            PackageType: ""
          });
        } else {
          for (var i = 0; i < multiCBM.length; i++) {
            //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Length,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].height,
              GrossWt: multiCBM[i].GrossWeight,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: multiCBM[i].PackageType
            });
          }
        }
      }

      var PickUpAddress = "";
      var DestinationAddress = "";
      var PickUpAddressDetails = {
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: 0
      };
      var DestinationAddressDetails = {
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: 0
      };

      if (this.state.typeofMove == 1) {
        if (this.state.isCopy === true) {
          PickUpAddress = this.state.PickUpAddress;
        } else {
          PickUpAddress =
            this.state.containerLoadType.toUpperCase() === "AIR"
              ? this.state.polfullAddData.AirportLongName
              : this.state.polfullAddData.OceanPortLongName;
        }
        if (this.state.isCopy === true) {
          DestinationAddress = this.state.DestinationAddress;
        } else {
          DestinationAddress =
            this.state.containerLoadType.toUpperCase() === "AIR"
              ? this.state.podfullAddData.AirportLongName ||
                this.state.podfullAddData.OceanPortLongName
              : this.state.podfullAddData.OceanPortLongName;
        }
      }
      if (this.state.typeofMove == 2) {
        PickUpAddressDetails = {
          Street: this.props.location.state.pickUpAddress[0].Area,
          Country: this.props.location.state.pickUpAddress[0].Country,
          State: this.props.location.state.pickUpAddress[0].State,
          City: this.props.location.state.pickUpAddress[0].City,
          ZipCode: this.props.location.state.pickUpAddress[0].ZipCode
        };

        DestinationAddress =
          this.state.isCopy === true
            ? this.state.DestinationAddress
            : this.state.containerLoadType.toUpperCase() === "AIR"
            ? this.state.podfullAddData.AirportLongName
            : this.state.podfullAddData.OceanPortLongName;
      }

      if (this.state.typeofMove == 4) {
        PickUpAddressDetails = {
          Street: this.props.location.state.pickUpAddress[0].Area,
          Country: this.props.location.state.pickUpAddress[0].Country,
          State: this.props.location.state.pickUpAddress[0].State,
          City: this.props.location.state.pickUpAddress[0].City,
          ZipCode: this.props.location.state.pickUpAddress[0].ZipCode
        };
        DestinationAddressDetails = {
          Street: this.props.location.state.destAddress[0].Area,
          Country: this.props.location.state.destAddress[0].Country,
          State: this.props.location.state.destAddress[0].State,
          City: this.props.location.state.destAddress[0].City,
          ZipCode: this.props.location.state.destAddress[0].ZipCode
        };
      }
      if (this.state.typeofMove == 3) {
        PickUpAddress =
          this.state.isCopy === true
            ? this.state.PickUpAddress
            : this.state.containerLoadType.toUpperCase() === "AIR"
            ? this.state.polfullAddData.AirportLongName
            : this.state.polfullAddData.OceanPortLongName;

        DestinationAddressDetails = {
          Street: this.props.location.state.destAddress[0].Area,
          Country: this.props.location.state.destAddress[0].Country,
          State: this.props.location.state.destAddress[0].State,
          City: this.props.location.state.destAddress[0].City,
          ZipCode: this.props.location.state.destAddress[0].ZipCode
        };
      }

      var RateDataArr = [];
      for (var i = 0; i < rateDetailsarr.length; i++) {
        var AIRObjdata = new Object();

        AIRObjdata.RateID = rateDetailsarr[i].RateLineId;
        AIRObjdata.RateType = rateDetailsarr[i].TypeOfRate;

        RateDataArr.push(AIRObjdata);
      }
      if (RateQueryDim.length == 0) {
        var RequestRateDim = new Object();

        RequestRateDim.PackageType = "";
        RequestRateDim.Quantity = 0;
        RequestRateDim.Lengths = 0;
        RequestRateDim.Width = 0;
        RequestRateDim.Height = 0;
        RequestRateDim.GrossWt = 0;
        RequestRateDim.VolumeWeight = 0;
        RequestRateDim.Volume = 0;
        RateQueryDim.push(RequestRateDim);
      }
      var SendRequestparaAIR = {
        Mode: this.state.containerLoadType.toUpperCase(),
        ShipmentType: this.state.shipmentType,
        Inco_terms: this.state.incoTerm,
        TypesOfMove: this.state.typeofMove,
        PickUpAddress: PickUpAddress,
        DestinationAddress: DestinationAddress,
        HazMat: this.state.HazMat == true ? 1 : 0,
        ChargeableWt: this.props.location.state.ChargeableWeight,
        Containerdetails: Containerdetails,
        PickUpAddressDetails: PickUpAddressDetails,
        DestinationAddressDetails: DestinationAddressDetails,
        RateQueryDim: RateQueryDim,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: this.state.CompanyID,
        CommodityID: this.state.CommodityID,
        OriginGeoCordinates: this.props.location.state.OriginGeoCordinates,
        DestGeoCordinate: this.props.location.state.DestGeoCordinate,
        BaseCurrency: rateSubDetailsarr[0].BaseCurrency,
        NonStackable: this.props.location.state.NonStackable == false ? 0 : 1,
        MyWayComments: txtRequestComments,
        MyWayDiscount: parseFloat(txtRequestDiscount),
        MyWayFreeTime: parseFloat(txtRequestFreeTime),
        IsRequestForChange: 1,
        SQCharges: FCLSQCharges,
        RateTypes: FCLSQBaseFreight
      };

      var url = "";

      var usertype = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      let self = this;
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SpotRateRequestChangesInsertion`,
        data: SendRequestparaAIR,
        headers: authHeader()
      })
        .then(function(response) {
          ////debugger;;;
          self.toggleRequest();
          if (response != null) {
            if (response.data != null) {
              if (response.data.Table != null) {
                if (response.data.Table.length > 0) {
                  NotificationManager.success(response.data.Table[0].Message);
                  var SalesQuoteNo = response.data.Table[0].SalesQuoteNo;
                  if (usertype !== "Sales User") {
                    if (SalesQuoteNo) {
                      self.setState({
                        SalesQuoteNo,
                        reloding: false
                      });

                      self.AcceptQuotes();
                    } else {
                      setTimeout(() => {
                        self.props.history.push("./spot-rate-table");
                      }, 4000);
                    }
                  } else {
                    setTimeout(() => {
                      self.props.history.push("./spot-rate-table");
                    }, 4000);
                  }
                }
              }
            }
          }
        })
        .catch(error => {
          ////debugger;;;
          console.log(error.response);
        });
    } else {
      NotificationManager.error("Please select atleast one Rate");
    }
  }

  SendRequest() {
    ////debugger;;;
    if (this.state.selectedDataRow.length > 0) {
      if (this.state.CompanyID !== 0) {
        var txtRequestDiscount,
          txtRequestFreeTime,
          txtRequestComments = "";
        txtRequestDiscount = 0;
        txtRequestFreeTime = 0;
        var containerLoadType = this.state.containerLoadType;
        if (document.getElementById("txtRequestDiscount") != undefined) {
          txtRequestDiscount = document.getElementById("txtRequestDiscount")
            .value;
        }
        if (document.getElementById("txtRequestFreeTime") != undefined) {
          txtRequestFreeTime = document.getElementById("txtRequestFreeTime")
            .value;
        }

        if (document.getElementById("txtRequestComments") != undefined) {
          txtRequestComments = document.getElementById("txtRequestComments")
            .value;
        }

        //alert(txtRequestDiscount + " - " + txtRequestFreeTime + " - " + txtRequestComments)

        var FCLSQLocalChargesarr = [];
        var FCLSQSurChargesarr = [];
        ////debugger;;;
        var chkslocalcharge = document.getElementsByName("localCharge");
        for (var i = 0; i < chkslocalcharge.length; i++) {
          if (chkslocalcharge[i].checked) {
            FCLSQLocalChargesarr.push({
              LocalChargeID: 0,
              Description:
                chkslocalcharge[0].attributes["data-chargedesc"].value,
              Amount:
                chkslocalcharge[0].attributes["data-amountinbasecurrency"]
                  .value,
              Currency: chkslocalcharge[0].attributes["data-currency"].value,
              Minimum: 0,
              Tax: 0,
              ChargeItem:
                chkslocalcharge[0].attributes["data-chargeitem"].value,
              RateID: 0,
              Exrate: 0
            });
          }
        }
        ////debugger;;;
        // var rateDetailsarr = this.state.rateDetails;
        // var rateSubDetailsarr = this.state.rateSubDetails;

        var rateDetailsarr = this.state.selectedDataRow;

        var subratedetails = [];
        for (let i = 0; i < rateDetailsarr.length; i++) {
          if (this.state.isCopy === true) {
            var data = this.state.rateSubDetails.filter(
              x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
            );
            subratedetails.push(data);
          } else {
            var data = this.state.rateSubDetails.filter(
              x =>
                x.RateLineID === rateDetailsarr[i].RateLineId ||
                rateDetailsarr[i].RateLineID
            );
            for (let i = 0; i < data.length; i++) {
              subratedetails.push(data[i]);
            }
          }
        }
        var rateSubDetailsarr = subratedetails;

        var FCLSQBaseFreight = [];

        for (var i = 0; i < rateDetailsarr.length; i++) {
          if (containerLoadType == "FCL") {
            FCLSQBaseFreight.push({
              RateID:
                this.state.isCopy === true
                  ? rateDetailsarr[i].saleQuoteLineID
                  : rateDetailsarr[i].RateLineId,
              RateType:
                this.state.isCopy === true
                  ? "BuyRate"
                  : rateDetailsarr[i].TypeOfRate
            });
          }
          if (containerLoadType == "LCL") {
            if (rateDetailsarr[i].RateLineID == undefined) {
              if (rateDetailsarr[i].saleQuoteLineID != undefined) {
                FCLSQBaseFreight.push({
                  RateID: rateDetailsarr[i].saleQuoteLineID,
                  RateType: rateDetailsarr[i].TypeOfRate
                });
              } else {
                FCLSQBaseFreight.push({
                  RateID: rateDetailsarr[i].RateLineId,
                  RateType: rateDetailsarr[i].TypeOfRate
                });
              }
            } else {
              FCLSQBaseFreight.push({
                RateID: rateDetailsarr[i].RateLineID,
                RateType: rateDetailsarr[i].TypeOfRate
              });
            }
          } else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
            FCLSQBaseFreight.push({
              RateID: rateDetailsarr[i].RateLineID,
              RateType: rateDetailsarr[i].TypeOfRate
            });
          } else if (containerLoadType == "AIR") {
            FCLSQBaseFreight.push({
              RateID:
                this.state.isCopy === true
                  ? rateDetailsarr[i].saleQuoteLineID
                  : rateDetailsarr[i].RateLineId,
              RateType:
                this.state.isCopy === true
                  ? rateDetailsarr[i].TypeOfRate
                  : rateDetailsarr[i].TypeOfRate
            });
          }
        }

        var FCLSQCharges = [];

        for (var i = 0; i < rateDetailsarr.length; i++) {
          for (var j = 0; j < rateSubDetailsarr.length; j++) {
            if (containerLoadType == "FCL") {
              if (rateDetailsarr[i].RateLineId == undefined) {
                if (rateSubDetailsarr[j].saleQuoteLineID !== undefined) {
                  if (
                    rateSubDetailsarr[j].saleQuoteLineID ==
                    rateDetailsarr[i].saleQuoteLineID
                  ) {
                    FCLSQCharges.push({
                      ChargeID: 0,
                      Rate: parseFloat(
                        rateSubDetailsarr[j].Amount.split("U")[0].trim()
                      ),
                      Currency: rateSubDetailsarr[j].BaseCurrency,
                      RateLineID: rateSubDetailsarr[j].saleQuoteLineID,
                      ChargeCode: rateSubDetailsarr[j].ChargeCode,
                      Tax: rateSubDetailsarr[j].Tax,
                      ChargeItem: rateSubDetailsarr[j].Chargeitem,
                      Exrate: rateSubDetailsarr[j].ExRate,
                      ChargeType: rateSubDetailsarr[j].Type,
                      TotalAmount: parseFloat(
                        rateSubDetailsarr[j].Total.split("U")[0].trim()
                      )
                    });
                  }
                }
              } else {
                if (
                  rateSubDetailsarr[j].RateLineID ==
                  rateDetailsarr[i].RateLineId
                ) {
                  FCLSQCharges.push({
                    ChargeID: rateSubDetailsarr[j].ChargeID,
                    Rate: rateSubDetailsarr[j].Rate,
                    Currency: rateSubDetailsarr[j].Currency,
                    RateLineID: rateSubDetailsarr[j].RateLineID,
                    ChargeCode: rateSubDetailsarr[j].ChargeCode,
                    Tax:
                      rateSubDetailsarr[j].Tax == null
                        ? 0
                        : rateSubDetailsarr[j].Tax,
                    ChargeItem: rateSubDetailsarr[j].ChargeItem,
                    Exrate: rateSubDetailsarr[j].Exrate,
                    ChargeType: rateSubDetailsarr[j].ChargeType,
                    TotalAmount: rateSubDetailsarr[j].TotalAmount
                  });
                }
              }
            }

            if (containerLoadType == "LCL") {
              if (rateDetailsarr[i].RateLineID == undefined) {
                if (rateSubDetailsarr[j].SaleQuoteIDLineID != undefined) {
                  if (
                    rateSubDetailsarr[j].SaleQuoteIDLineID ==
                    rateDetailsarr[i].saleQuoteLineID
                  ) {
                    FCLSQCharges.push({
                      ChargeID: 0, //rateSubDetailsarr[j].ChargeID,
                      Rate:
                        rateSubDetailsarr[j].Amount == null
                          ? 0
                          : rateSubDetailsarr[j].Amount,
                      Currency: "USD",
                      RateLineID: rateSubDetailsarr[j].SaleQuoteIDLineID,
                      ChargeCode: rateSubDetailsarr[j].ChargeCode,
                      Tax:
                        rateSubDetailsarr[j].Tax == null
                          ? 0
                          : rateSubDetailsarr[j].Tax,
                      ChargeItem: rateSubDetailsarr[j].ChargeItem,
                      Exrate:
                        rateSubDetailsarr[j].ExRate == undefined
                          ? ""
                          : rateSubDetailsarr[j].ExRate,
                      ChargeType: rateSubDetailsarr[j].Type,
                      TotalAmount: parseFloat(
                        rateSubDetailsarr[j].Total.split(" ")[0].trim()
                      )
                    });
                  }
                } else {
                  if (
                    rateSubDetailsarr[j].RateLineID ==
                    rateDetailsarr[i].RateLineId
                  ) {
                    FCLSQCharges.push({
                      ChargeID: rateSubDetailsarr[j].ChargeID,
                      Rate:
                        rateSubDetailsarr[j].Rate == null
                          ? 0
                          : rateSubDetailsarr[j].Rate,
                      Currency: rateSubDetailsarr[j].Currency,
                      RateLineID: rateSubDetailsarr[j].RateLineID,
                      ChargeCode: rateSubDetailsarr[j].ChargeCode,
                      Tax:
                        rateSubDetailsarr[j].Tax == null
                          ? 0
                          : rateSubDetailsarr[j].Tax,
                      ChargeItem: rateSubDetailsarr[j].ChargeItem,
                      Exrate: rateSubDetailsarr[j].Exrate,
                      ChargeType: rateSubDetailsarr[j].ChargeType,
                      TotalAmount:
                        rateSubDetailsarr[j].TotalAmount == null
                          ? 0
                          : rateSubDetailsarr[j].TotalAmount
                    });
                  }
                }
              } else {
                if (
                  rateSubDetailsarr[j].RateLineID ==
                  rateDetailsarr[i].RateLineID
                ) {
                  FCLSQCharges.push({
                    ChargeID: rateSubDetailsarr[j].ChargeID,
                    Rate: rateSubDetailsarr[j].Rate,
                    Currency: rateSubDetailsarr[j].Currency,
                    RateLineID: rateSubDetailsarr[j].RateLineID,
                    ChargeCode: rateSubDetailsarr[j].ChargeCode,
                    Tax:
                      rateSubDetailsarr[j].Tax == null
                        ? 0
                        : rateSubDetailsarr[j].Tax,
                    ChargeItem: rateSubDetailsarr[j].ChargeItem,
                    Exrate: rateSubDetailsarr[j].Exrate,
                    ChargeType: rateSubDetailsarr[j].ChargeType,
                    TotalAmount: rateSubDetailsarr[j].TotalAmount
                  });
                }
              }
            }
            if (containerLoadType == "FTL" || containerLoadType == "LTL") {
              if (
                rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineID
              ) {
                FCLSQCharges.push({
                  ChargeID: rateSubDetailsarr[j].ChargeID,
                  Rate:
                    rateSubDetailsarr[j].Rate == null
                      ? 0
                      : rateSubDetailsarr[j].Rate,
                  Currency: rateSubDetailsarr[j].Currency,
                  RateLineID: rateSubDetailsarr[j].RateLineID,
                  ChargeCode: rateSubDetailsarr[j].ChargeCode,
                  Tax:
                    rateSubDetailsarr[j].Tax == null
                      ? 0
                      : rateSubDetailsarr[j].Tax,
                  ChargeItem: rateSubDetailsarr[j].ChargeItem,
                  Exrate: rateSubDetailsarr[j].Exrate,
                  ChargeType: rateSubDetailsarr[j].ChargeType,
                  TotalAmount:
                    rateSubDetailsarr[j].TotalAmount == null
                      ? 0
                      : rateSubDetailsarr[j].TotalAmount
                });
              }
            }
            if (containerLoadType == "AIR") {
              if (rateDetailsarr[i].RateLineId == undefined) {
                if (rateSubDetailsarr[j].saleQuoteLineID !== undefined) {
                  if (
                    rateSubDetailsarr[j].saleQuoteLineID ==
                    rateDetailsarr[i].saleQuoteLineID
                  ) {
                    FCLSQCharges.push({
                      ChargeID: 0,
                      Rate: parseFloat(
                        rateSubDetailsarr[j].Amount.split(" ")[0].trim()
                      ),
                      Currency:
                        rateSubDetailsarr[j].BaseCurrency == undefined
                          ? "USD"
                          : rateSubDetailsarr[j].BaseCurrency,
                      RateLineID: rateSubDetailsarr[j].saleQuoteLineID,
                      ChargeCode: rateSubDetailsarr[j].ChargeCode,
                      Tax:
                        rateSubDetailsarr[j].Tax == undefined
                          ? 0
                          : rateSubDetailsarr[j].Tax,
                      ChargeItem: rateSubDetailsarr[j].ChargeItem || "",
                      Exrate: rateSubDetailsarr[j].Exrate || 1,
                      ChargeType: rateSubDetailsarr[j].ChargeType || "",
                      TotalAmount: parseFloat(
                        rateSubDetailsarr[j].Total.split(" ")[0].trim()
                      )
                    });
                  }
                }
              } else {
                if (
                  rateSubDetailsarr[j].RateLineID ==
                  rateDetailsarr[i].RateLineId
                ) {
                  FCLSQCharges.push({
                    ChargeID: rateSubDetailsarr[j].ChargeID,
                    Rate:
                      rateSubDetailsarr[j].Rate == null
                        ? 0
                        : rateSubDetailsarr[j].Rate,
                    Currency: rateSubDetailsarr[j].Currency,
                    RateLineID: rateSubDetailsarr[j].RateLineID,
                    ChargeCode: rateSubDetailsarr[j].ChargeCode,
                    Tax:
                      rateSubDetailsarr[j].Tax == null
                        ? 0
                        : rateSubDetailsarr[j].Tax,
                    ChargeItem: rateSubDetailsarr[j].ChargeItem || "",
                    Exrate: rateSubDetailsarr[j].Exrate || 1,
                    ChargeType: rateSubDetailsarr[j].ChargeType || "",
                    TotalAmount:
                      rateSubDetailsarr[j].TotalAmount == null
                        ? 0
                        : rateSubDetailsarr[j].TotalAmount
                  });
                }
              }
            }
          }
        }

        var chksurcharges = document.getElementsByName("surcharges");
        for (var i = 0; i < chksurcharges.length; i++) {
          if (chksurcharges[i].checked) {
            FCLSQSurChargesarr.push({
              SurchargeID: 0,
              ChargeCode: chksurcharges[0].attributes["data-chargedesc"].value,
              Amount:
                chksurcharges[0].attributes["data-amountinbasecurrency"].value,
              Currency: chksurcharges[0].attributes["data-currency"].value,
              Tax: 0,
              ChargeItem: chksurcharges[0].attributes["data-chargeitem"].value,
              RateID: 0,
              Exrate: 0
            });
          }
        }

        var Containerdetails = [];
        var RateQueryDim = [];
        // ProfileCodeID:23,ContainerCode:'40GP',Type:'40 Standard Dry',ContainerQuantity:3,Temperature:0
        var usesr = this.state.users;
        var spacEqmtType = this.state.spacEqmtType;
        var referType = this.state.referType;
        var flattack_openTop = this.state.flattack_openTop;

        if (containerLoadType == "FCL") {
          if (usesr != null) {
            if (usesr.length > 0) {
              for (var i = 0; i < usesr.length; i++) {
                Containerdetails.push({
                  ProfileCodeID: usesr[i].ProfileCodeID,
                  ContainerCode: usesr[i].StandardContainerCode,
                  Type: usesr[i].ContainerName,
                  ContainerQuantity: usesr[i].ContainerQuantity,
                  Temperature:
                    usesr[i].Temperature == undefined ? 0 : usesr[i].Temperature
                });
              }
            }
          }

          if (spacEqmtType != null) {
            if (spacEqmtType.length > 0) {
              for (var i = 0; i < spacEqmtType.length; i++) {
                Containerdetails.push({
                  ProfileCodeID: spacEqmtType[i].ProfileCodeID,
                  ContainerCode: spacEqmtType[i].StandardContainerCode,
                  Type: spacEqmtType[i].ContainerName,
                  ContainerQuantity: spacEqmtType[i].Quantity,
                  Temperature: 0
                });
              }
            }
          }

          if (referType != null) {
            if (referType.length > 0) {
              for (var i = 0; i < referType.length; i++) {
                Containerdetails.push({
                  ProfileCodeID: referType[i].ProfileCodeID,
                  ContainerCode: referType[i].ContainerCode,
                  Type: referType[i].Type,
                  ContainerQuantity: referType[i].ContainerQuantity,
                  Temperature: referType[i].Temperature
                });
              }
            }
          }

          if (flattack_openTop != null) {
            if (flattack_openTop.length > 0) {
              for (var i = 0; i < flattack_openTop.length; i++) {
                RateQueryDim.push({
                  Quantity: flattack_openTop[i].Quantity,
                  Lengths:
                    flattack_openTop[i].length == undefined
                      ? flattack_openTop[i].Lengths
                      : flattack_openTop[i].length,
                  Width:
                    flattack_openTop[i].width == undefined
                      ? flattack_openTop[i].Width
                      : flattack_openTop[i].width,
                  Height:
                    flattack_openTop[i].height == undefined
                      ? flattack_openTop[i].Height
                      : flattack_openTop[i].height,
                  GrossWt:
                    flattack_openTop[i].Gross_Weight == undefined
                      ? flattack_openTop[i].Weight
                      : flattack_openTop[i].Gross_Weight,
                  VolumeWeight: 0,
                  Volume: 0,
                  PackageType:
                    flattack_openTop[i].PackageType == undefined
                      ? ""
                      : flattack_openTop[i].PackageType
                });
              }
            }
          }
        } else if (containerLoadType == "LCL") {
          ////debugger;;;
          var multiCBM = this.state.multiCBM;
          if (this.state.isediting) {
            if (this.state.cmbTypeRadio === "ALL") {
              for (var i = 0; i < multiCBM.length; i++) {
                //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
                RateQueryDim.push({
                  Quantity: multiCBM[i].Quantity || 0,
                  Lengths: multiCBM[i].Length || 0,
                  Width: multiCBM[i].Width || 0,
                  Height: multiCBM[i].height || 0,
                  GrossWt: multiCBM[i].GrossWeight || 0,
                  VolumeWeight: multiCBM[i].VolumeWeight || 0,
                  Volume: multiCBM[i].Volume || 0,
                  PackageType: multiCBM[i].PackageType || ""
                });
              }
            } else if (this.state.cmbTypeRadio === "CBM") {
              // RateQueryDim.push({
              //   Quantity: 0,
              //   Lengths: 0,
              //   Width: 0,
              //   Height: 0,
              //   GrossWt: 0,
              //   VolumeWeight: 0,
              //   Volume: parseFloat(this.state.cbmVal) || 0,
              //   PackageType: ""
              // });
            } else {
              for (var i = 0; i < multiCBM.length; i++) {
                //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
                RateQueryDim.push({
                  Quantity: multiCBM[i].Quantity || 0,
                  Lengths: multiCBM[i].Length || 0,
                  Width: multiCBM[i].Width || 0,
                  Height: multiCBM[i].height || 0,
                  GrossWt: multiCBM[i].GrossWeight || 0,
                  VolumeWeight: multiCBM[i].VolumeWeight || 0,
                  Volume: multiCBM[i].Volume || 0,
                  PackageType: multiCBM[i].PackageType || ""
                });
              }
            }
          } else {
            if (this.state.cmbTypeRadio === "ALL") {
              for (var i = 0; i < multiCBM.length; i++) {
                //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
                RateQueryDim.push({
                  Quantity: multiCBM[i].Quantity || 0,
                  Lengths: multiCBM[i].Length || 0,
                  Width: multiCBM[i].Width || 0,
                  Height: multiCBM[i].height || 0,
                  GrossWt: multiCBM[i].GrossWeight || 0,
                  VolumeWeight: multiCBM[i].VolumeWeight || 0,
                  Volume: multiCBM[i].Volume || 0,
                  PackageType: multiCBM[i].PackageType || ""
                });
              }
            } else if (this.state.cmbTypeRadio === "CBM") {
              // RateQueryDim.push({
              //   Quantity: 0,
              //   Lengths: 0,
              //   Width: 0,
              //   Height: 0,
              //   GrossWt: 0,
              //   VolumeWeight: 0,
              //   Volume: parseFloat(this.state.cbmVal) || 0,
              //   PackageType: ""
              // });
            } else {
              for (var i = 0; i < multiCBM.length; i++) {
                //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
                RateQueryDim.push({
                  Quantity: multiCBM[i].Quantity || 0,
                  Lengths: multiCBM[i].Length || 0,
                  Width: multiCBM[i].Width || 0,
                  Height: multiCBM[i].height || 0,
                  GrossWt: multiCBM[i].GrossWeight || 0,
                  VolumeWeight: multiCBM[i].VolumeWeight || 0,
                  Volume: multiCBM[i].Volume || 0,
                  PackageType: multiCBM[i].PackageType || ""
                });
              }
            }
          }
        } else if (containerLoadType == "FTL") {
          var TruckTypeData = this.state.TruckTypeData;
          for (var i = 0; i < TruckTypeData.length; i++) {
            //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            RateQueryDim.push({
              Quantity: TruckTypeData[i].Quantity,
              Lengths: 0,
              Width: 0,
              Height: 0,
              GrossWt: 0,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: TruckTypeData[i].TruckDesc
            });
          }
          //
        } else if (containerLoadType == "AIR" || containerLoadType == "LTL") {
          var multiCBM = this.state.multiCBM;

          if (this.state.cmbTypeRadio === "ALL") {
            for (var i = 0; i < multiCBM.length; i++) {
              //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
              RateQueryDim.push({
                Quantity: multiCBM[i].Quantity,
                Lengths:
                  containerLoadType == "AIR"
                    ? multiCBM[i].Length
                    : multiCBM[i].Lengths,
                Width: multiCBM[i].Width,
                Height:
                  containerLoadType == "AIR"
                    ? multiCBM[i].height
                    : multiCBM[i].Height,
                GrossWt:
                  containerLoadType == "AIR"
                    ? multiCBM[i].GrossWeight
                    : multiCBM[i].GrossWt,
                VolumeWeight: multiCBM[i].VolumeWeight,
                Volume: containerLoadType == "AIR" ? 0 : multiCBM[i].Volume,
                PackageType: multiCBM[i].PackageType
              });
            }
          } else if (this.state.cmbTypeRadio === "CBM") {
          } else {
            for (var i = 0; i < multiCBM.length; i++) {
              //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
              RateQueryDim.push({
                Quantity: multiCBM[i].Quantity,
                Lengths: multiCBM[i].Length,
                Width: multiCBM[i].Width,
                Height: multiCBM[i].height,
                GrossWt: multiCBM[i].GrossWeight,
                VolumeWeight: 0,
                Volume: 0,
                PackageType: multiCBM[i].PackageType
              });
            }
          }
          var cbmVal = this.state.cbmVal;
          ////debugger;;;
          if (cbmVal != null) {
            if (cbmVal != "") {
              if (cbmVal != "0") {
                RateQueryDim.push({
                  Quantity: 0, //TruckTypeData[i].Quantity || 0,
                  Lengths: 0,
                  Width: 0,
                  Height: 0,
                  GrossWt: 0,
                  VolumeWeight: 0,
                  Volume: 0,
                  PackageType: "" //TruckTypeData[i].TruckDesc
                });
              }
            }
          }
        }

        var PickUpAddress = "";
        var DestinationAddress = "";
        var PickUpAddressDetails = {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0
        };
        var DestinationAddressDetails = {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0
        };

        if (this.state.typeofMove == 1) {
          if (this.state.isCopy === true) {
            PickUpAddress = this.state.PickUpAddress;
          } else {
            PickUpAddress =
              this.state.containerLoadType.toUpperCase() === "AIR"
                ? this.state.polfullAddData.AirportLongName
                : this.state.polfullAddData.OceanPortLongName;
          }
          if (this.state.isCopy === true) {
            DestinationAddress = this.state.DestinationAddress;
          } else {
            DestinationAddress =
              this.state.containerLoadType.toUpperCase() === "AIR"
                ? this.state.podfullAddData.AirportLongName ||
                  this.state.podfullAddData.OceanPortLongName
                : this.state.podfullAddData.OceanPortLongName;
          }
        }
        if (this.state.typeofMove == 2) {
          PickUpAddressDetails = {
            Street: this.props.location.state.pickUpAddress[0].Area,
            Country: this.props.location.state.pickUpAddress[0].Country,
            State: this.props.location.state.pickUpAddress[0].State,
            City: this.props.location.state.pickUpAddress[0].City,
            ZipCode: this.props.location.state.pickUpAddress[0].ZipCode
          };

          DestinationAddress =
            this.state.isCopy === true
              ? this.state.DestinationAddress
              : this.state.containerLoadType.toUpperCase() === "AIR"
              ? this.state.podfullAddData.AirportLongName
              : this.state.podfullAddData.OceanPortLongName;
        }

        if (this.state.typeofMove == 4) {
          PickUpAddressDetails = {
            Street: this.props.location.state.pickUpAddress[0].Area,
            Country: this.props.location.state.pickUpAddress[0].Country,
            State: this.props.location.state.pickUpAddress[0].State,
            City: this.props.location.state.pickUpAddress[0].City,
            ZipCode: this.props.location.state.pickUpAddress[0].ZipCode
          };
          DestinationAddressDetails = {
            Street: this.props.location.state.destAddress[0].Area,
            Country: this.props.location.state.destAddress[0].Country,
            State: this.props.location.state.destAddress[0].State,
            City: this.props.location.state.destAddress[0].City,
            ZipCode: this.props.location.state.destAddress[0].ZipCode
          };
        }
        if (this.state.typeofMove == 3) {
          PickUpAddress =
            this.state.isCopy === true
              ? this.state.PickUpAddress
              : this.state.containerLoadType.toUpperCase() === "AIR"
              ? this.state.polfullAddData.AirportLongName
              : this.state.polfullAddData.OceanPortLongName;

          if (this.props.location.state.destAddress.Length > 0) {
            DestinationAddressDetails = {
              Street: this.props.location.state.destAddress[0].Area,
              Country: this.props.location.state.destAddress[0].Country,
              State: this.props.location.state.destAddress[0].State,
              City: this.props.location.state.destAddress[0].City,
              ZipCode: this.props.location.state.destAddress[0].ZipCode
            };
          } else {
            DestinationAddressDetails = {
              Street: "",
              Country: "",
              State: "",
              City: "",
              ZipCode: 0
            };
          }
        }

        ////debugger;;;
        var senrequestpara = {
          ShipmentType: this.state.shipmentType,
          Inco_terms: this.state.incoTerm,
          TypesOfMove: this.state.typeofMove,
          PickUpAddress: PickUpAddress,
          DestinationAddress: DestinationAddress,
          HazMat: this.state.HazMat == true ? 1 : 0,
          ChargeableWt: parseFloat(cbmVal) || 0,
          //Containerdetails: Containerdetails,
          PickUpAddressDetails: PickUpAddressDetails,
          DestinationAddressDetails: DestinationAddressDetails,
          MyWayUserID: encryption(
            window.localStorage.getItem("userid"),
            "desc"
          ),
          CompanyID: this.state.CompanyID,
          BaseCurrency: this.state.currencyCode,
          MywayProfit: this.state.Addedprofit,
          MywayDiscount: txtRequestDiscount,
          // FCLSQBaseFreight:FCLSQBaseFreightarr,
          // FCLSQLocalCharges: FCLSQLocalChargesarr,
          // FCLSQSurCharges: FCLSQSurChargesarr,

          Comments: txtRequestComments,
          FreeTime: txtRequestFreeTime,
          RateQueryDim: RateQueryDim,
          MailBody:
            "Hello Customer Name,      Greetings!!    Quotation for your requirement is generated by our Sales Team. To view the Qutation and its details please click here",
          Commodity: Number(this.state.CommodityID)
        };

        var url = "";

        if (this.state.containerLoadType == "FCL") {
          senrequestpara.FCLSQBaseFreight = FCLSQBaseFreight;
          senrequestpara.FCLSQCharges = FCLSQCharges;
          senrequestpara.CustomClearance =
            this.state.CustomClearance == true ? 1 : 0;
          senrequestpara.Containerdetails = Containerdetails;

          debugger;
          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              x => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (
              data[0].RateLineId === this.state.rateOrgDetails[j].RateLineId &&
              data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
            ) {
              // aProfit =
              //   data[0].TotalAmount - this.state.rateOrgDetails[j].Total;
              aProfit = this.state.manProfitAmt[j].Total;

              rateid = this.state.rateOrgDetails[j].RateLineId;
            } else {
              aProfit = 0;
              rateid = data[0].RateLineId;
            }
            objProfitList.RateLineID = rateid;
            objProfitList.Profit = aProfit;
            ProfitListarr.push(objProfitList);
          }
          senrequestpara.ProfitList = ProfitListarr;
          //senrequestpara.NonStackable = 0;
          url = `${appSettings.APIURL}/FCLSalesQuoteInsertion`;
        } else if (this.state.containerLoadType == "LCL") {
          senrequestpara.LCLSQBaseFreight = FCLSQBaseFreight;
          senrequestpara.LCLSQCharges = FCLSQCharges;
          senrequestpara.CustomClearance =
            this.state.CustomClearance == true ? 1 : 0;
          senrequestpara.NonStackable = this.state.NonStackable == true ? 1 : 0;
          // senrequestpara.Containerdetails = Containerdetails;

          debugger;
          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};

            var data = this.state.selectedDataRow.filter(
              x => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (
              data[0].RateLineId === this.state.rateOrgDetails[j].RateLineId &&
              data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
            ) {
              aProfit =
                data[0].TotalAmount - this.state.rateOrgDetails[j].Total;
              rateid = this.state.rateOrgDetails[j].RateLineId;
            } else {
              aProfit = 0;
              rateid = data[0].RateLineId;
            }
            objProfitList.RateLineID = rateid;
            objProfitList.Profit = aProfit;
            ProfitListarr.push(objProfitList);
          }
          senrequestpara.ProfitList = ProfitListarr;

          url = `${appSettings.APIURL}/LCLSalesQuoteInsertion`;
        } else if (
          this.state.containerLoadType == "FTL" ||
          this.state.containerLoadType == "LTL"
        ) {
          senrequestpara.InlandSQBaseFreight = FCLSQBaseFreight;
          senrequestpara.InlandSQCharges = FCLSQCharges;
          senrequestpara.CustomClearance =
            this.state.CustomClearance == true ? 1 : 0;

          debugger;
          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              x => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (
              data[0].RateLineId === this.state.rateOrgDetails[j].RateLineId &&
              data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
            ) {
              aProfit =
                data[0].TotalAmount - this.state.rateOrgDetails[j].Total;
              rateid = this.state.rateOrgDetails[j].RateLineId;
            } else {
              aProfit = 0;
              rateid = data[0].RateLineId;
            }
            objProfitList.RateLineID = rateid;
            objProfitList.Profit = aProfit;
            ProfitListarr.push(objProfitList);
          }
          senrequestpara.ProfitList = ProfitListarr;
          url = `${appSettings.APIURL}/InlandSalesQuoteInsertion`;
        } else if (this.state.containerLoadType == "AIR") {
          senrequestpara.AirSQBaseFreight = FCLSQBaseFreight;
          senrequestpara.AirSQCharges = FCLSQCharges;
          senrequestpara.CustomClearance =
            this.state.CustomClearance == true ? 1 : 0;
          senrequestpara.NonStackable = this.state.NonStackable == true ? 1 : 0;
          senrequestpara.Containerdetails = Containerdetails;

          debugger;
          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              x => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (
              data[0].RateLineId === this.state.rateOrgDetails[j].RateLineId &&
              data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
            ) {
              aProfit =
                data[0].TotalAmount - this.state.rateOrgDetails[j].Total;
              rateid = this.state.rateOrgDetails[j].RateLineId;
            } else {
              aProfit = 0;
              rateid = data[0].RateLineId;
            }
            objProfitList.RateLineID = rateid;
            objProfitList.Profit = aProfit;
            ProfitListarr.push(objProfitList);
          }
          senrequestpara.ProfitList = ProfitListarr;
          url = `${appSettings.APIURL}/AirSalesQuoteInsertion`;
        }
        //return false;
        // usertype

        var usertype = encryption(
          window.localStorage.getItem("usertype"),
          "desc"
        );
        this.setState({ loding: true });
        let self = this;
        axios({
          method: "post",
          url: url,
          data: senrequestpara,
          headers: authHeader()
        })
          .then(function(response) {
            ////debugger;;;
            if (response != null) {
              if (response.data != null) {
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    NotificationManager.success(response.data.Table[0].Message);
                    var SalesQuoteNo = response.data.Table[0].SalesQuoteNo;
                    if (usertype !== "Sales User") {
                      self.setState({
                        SalesQuoteNo,
                        loding: false
                      });

                      self.AcceptQuotes();

                      setTimeout(function() {
                        window.location.href = "quote-table";
                      }, 1000);
                    } else {
                      setTimeout(function() {
                        window.location.href = "quote-table";
                      }, 1000);
                    }
                    // window.location.href = "quote-table";
                  }
                }
              }
            }
            //window.location.href = 'http://hrms.brainvire.com/BVESS/Account/LogOnEss'
          })
          .catch(error => {
            //debugger;;
            console.log(error.response);
          });
      } else {
        NotificationManager.error("Please select customer");
      }
    } else {
      NotificationManager.error("Please select atleast one Rate");
    }
  }

  SendRequestCopy() {
    if (this.state.selectedDataRow.length > 0) {
      //debugger;;
      if (this.state.CompanyID !== 0 || this.state.companyID !== 0) {
        var txtRequestDiscount,
          txtRequestFreeTime,
          txtRequestComments = "";
        txtRequestDiscount = 0;
        txtRequestFreeTime = 0;
        var containerLoadType = this.state.containerLoadType;

        var rateDetailsarr = this.state.rateDetails;
        var rateSubDetailsarr = this.state.rateSubDetails;

        var SQCopyChargesList = [];

        for (var j = 0; j < rateSubDetailsarr.length; j++) {
          if (containerLoadType == "FCL") {
            SQCopyChargesList.push({
              SaleQuoteID: rateSubDetailsarr[j].SaleQuoteID,
              SaleQuoteLineID: rateSubDetailsarr[j].saleQuoteLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              BaseCurrency: rateSubDetailsarr[j].BaseCurrency,
              Chargeitem: rateSubDetailsarr[j].Chargeitem,
              Tax: rateSubDetailsarr[j].Tax,
              ExRate: rateSubDetailsarr[j].ExRate,
              ChargeDesc: rateSubDetailsarr[j].ChargeDesc,
              Type: rateSubDetailsarr[j].Type,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency
            });
          } else if (containerLoadType == "LCL") {
            SQCopyChargesList.push({
              SaleQuoteID: rateSubDetailsarr[j].SaleQuoteID,
              SaleQuoteLineID: rateSubDetailsarr[j].SaleQuoteIDLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              BaseCurrency: rateSubDetailsarr[j].BaseCurrency,
              Chargeitem: rateSubDetailsarr[j].Chargeitem,
              Tax: rateSubDetailsarr[j].Tax,
              ExRate: rateSubDetailsarr[j].ExRate,
              ChargeDesc: rateSubDetailsarr[j].ChargeDesc,
              Type: rateSubDetailsarr[j].Type,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency
            });
          } else if (containerLoadType == "AIR") {
            SQCopyChargesList.push({
              SaleQuoteID: rateSubDetailsarr[j].SaleQuoteID,
              SaleQuoteLineID: rateSubDetailsarr[j].saleQuoteLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              BaseCurrency: rateSubDetailsarr[j].BaseCurrency,
              Chargeitem: rateSubDetailsarr[j].Chargeitem,
              Tax: rateSubDetailsarr[j].Tax,
              ExRate: rateSubDetailsarr[j].Exrate,
              ChargeDesc: rateSubDetailsarr[j].ChargeDesc,
              Type: rateSubDetailsarr[j].Type,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency
            });
          } else if (containerLoadType == "INLAND") {
            SQCopyChargesList.push({
              SaleQuoteID: rateSubDetailsarr[j].SaleQuoteIDD,
              SaleQuoteLineID: rateSubDetailsarr[j].SaleQuoteIDLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              BaseCurrency: rateSubDetailsarr[j].BaseCurrency,
              Chargeitem: rateSubDetailsarr[j].Chargeitem,
              Tax: rateSubDetailsarr[j].Tax,
              ExRate: rateSubDetailsarr[j].ExRate,
              ChargeDesc: rateSubDetailsarr[j].ChargeDesc,
              Type: rateSubDetailsarr[j].Type,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency
            });
          }
        }

        var Containerdetails = [];
        var RateQueryDim = [];
        // ProfileCodeID:23,ContainerCode:'40GP',Type:'40 Standard Dry',ContainerQuantity:3,Temperature:0
        var usesr = this.state.users;
        var spacEqmtType = this.state.spacEqmtType;
        var referType = this.state.referType;
        var flattack_openTop = this.state.flattack_openTop;

        //debugger;;
        var multiCBM = this.state.multiCBM;

        for (var i = 0; i < multiCBM.length; i++) {
          if (this.state.containerLoadType == "FCL") {
            //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Length,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].height,
              GrossWt: multiCBM[i].GrossWeight,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: multiCBM[i].PackageType
            });
          }
          if (this.state.containerLoadType == "LCL") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Length,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].height,
              GrossWt: multiCBM[i].GrossWeight,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: multiCBM[i].PackageType
            });
          }
          if (this.state.containerLoadType == "AIR") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Length,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].height,
              GrossWt: multiCBM[i].GrossWeight,
              VolumeWeight: multiCBM[i].VolumeWeight,
              Volume: 0,
              PackageType: multiCBM[i].PackageType
            });
          }
          if (this.state.containerLoadType == "INLAND") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Length,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].height,
              GrossWt: multiCBM[i].GrossWeight,
              VolumeWeight: multiCBM[i].VolumeWeight,
              Volume: 0,
              PackageType:
                multiCBM[i].PackageType === null ? "" : multiCBM[i].PackageType
            });
          }
        }

        var RateQueryDimData = [];

        if (this.state.cmbTypeRadio === "ALL") {
          RateQueryDimData = RateQueryDim;
        } else {
          if (
            this.state.containerLoadType === "FCL" ||
            this.state.containerLoadType === "FTL"
          ) {
            RateQueryDimData = RateQueryDim;
          } else {
            RateQueryDimData = [
              {
                Quantity: 0,
                Lengths: 0,
                Width: 0,
                Height: 0,
                GrossWt: 0,
                VolumeWeight: 0,
                Volume: parseFloat(this.state.cbmVal) || 0,
                PackageType: ""
              }
            ];
          }
        }
        //debugger;;
        var senrequestpara = {
          Commodity: Number(this.state.CommodityID),
          OldSaleQuoteNumber: this.props.location.state.Quote,
          OldSaleQuoteID:
            rateSubDetailsarr[0].SaleQuoteID == undefined
              ? rateSubDetailsarr[0].SaleQuoteIDD
              : rateSubDetailsarr[0].SaleQuoteID,
          MailBody:
            "Hello Customer Name,      Greetings!!    Quotation for your requirement is generated by our Sales Team. To view the Qutation and its details please click here",
          RateQueryDim: RateQueryDimData,
          SQCopyChargesList: SQCopyChargesList,
          Mode: this.state.containerLoadType,
          MyWayUserID: encryption(
            window.localStorage.getItem("userid"),
            "desc"
          ),
          CompanyID: this.state.companyID
        };

        var url = "";

        url = `${appSettings.APIURL}/SalesQuoteCopy`;

        var usertype = encryption(
          window.localStorage.getItem("usertype"),
          "desc"
        );
        let self = this;
        axios({
          method: "post",
          url: url,
          data: senrequestpara,
          headers: authHeader()
        })
          .then(function(response) {
            //debugger;;
            if (response != null) {
              if (response.data != null) {
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    NotificationManager.success(response.data.Table[0].Message);
                    var SalesQuoteNo = response.data.Table[0].SalesQuoteNo;
                    if (usertype !== "Sales User") {
                      self.setState({
                        SalesQuoteNo
                      });

                      self.AcceptQuotes();

                      setTimeout(function() {
                        window.location.href = "quote-table";
                      }, 1000);
                    } else {
                      setTimeout(function() {
                        window.location.href = "quote-table";
                      }, 1000);
                    }
                    // window.location.href = "quote-table";
                  }
                }
              }
            }
            //window.location.href = 'http://hrms.brainvire.com/BVESS/Account/LogOnEss'
          })
          .catch(error => {
            //debugger;;
            console.log(error.response);
          });
      } else {
        NotificationManager.error("Please select customer");
      }
    } else {
      NotificationManager.error("Please select atleast one rate");
    }
  }

  filterLocAll = event => {
    var localcharge = event.target.value.toLowerCase();
    if (localcharge != "") {
      this.state.arrLocalsCharges = [];
      this.state.fltLocalCharges.map((item, index) => {
        if (item.ChargeDesc.toLowerCase().includes(localcharge)) {
          this.state.arrLocalsCharges.push(this.state.fltLocalCharges[index]);
        }
      });
    } else {
      this.state.arrLocalsCharges = [];
      this.state.arrLocalsCharges = this.state.fltLocalCharges;
    }
    this.setState({
      arrLocalsCharges: this.state.arrLocalsCharges
    });
  };

  filterSurAll = event => {
    var surcharge = event.target.value.toLowerCase();
    if (surcharge != "") {
      this.state.arrSurCharges = [];
      this.state.fltSurCharges.map((item, index) => {
        if (item.ChargeDesc.toLowerCase().includes(surcharge)) {
          this.state.arrSurCharges.push(this.state.fltSurCharges[index]);
        }
      });
    } else {
      this.state.arrSurCharges = [];
      this.state.arrSurCharges = this.state.fltSurCharges;
    }
    this.setState({
      arrSurCharges: this.state.arrSurCharges
    });
  };

  hanleProfitAmountChange(e) {
    const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({ ProfitAmount: e.target.value });
    }
  }

  hanleProfitAmountUpdateSubmit() {
    debugger;
    var rateDetailsarr = this.state.selectedDataRow;

    var alledProfitAmount = 0;
    var BuyRate = 0;
    var profitLossAmt = 0;
    if (this.state.selectedDataRow.length === 1) {
      var showUpdate = false;
      for (let i = 0; i < this.state.rateOrgDetails.length; i++) {
        if (this.state.isCopy) {
          if (this.state.rateOrgDetails[i].Total) {
            if (
              this.state.rateOrgDetails[i].RateLineId ===
              this.state.selectedDataRow[0].saleQuoteLineID
            ) {
              alledProfitAmount = this.state.manProfitAmt[i].Total;

              if (alledProfitAmount > 0) {
                showUpdate = true;
              }
            }
          }
        } else {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            this.state.selectedDataRow[0].RateLineId
          ) {
            alledProfitAmount = this.state.manProfitAmt[i].Total;
            if (alledProfitAmount > 0) {
              showUpdate = true;
            }
          }
        }
      }
    }

    var subratedetails = [];
    for (let i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy === true) {
        var data = this.state.rateSubDetails.filter(
          x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
        );
        subratedetails = data;
        debugger;
        var getindex = this.state.manProfitAmt.findIndex(
          x => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
        );
        this.state.manProfitAmt[getindex].Total = parseFloat(
          this.state.ProfitAmount
        );
      } else {
        var data = this.state.rateSubDetails.filter(
          x => x.RateLineID === rateDetailsarr[i].RateLineId
        );

        var getindex = this.state.manProfitAmt.findIndex(
          x => x.RateLineId == rateDetailsarr[i].RateLineId
        );
        this.state.manProfitAmt[getindex].Total = parseFloat(
          this.state.ProfitAmount
        );
        for (let i = 0; i < data.length; i++) {
          subratedetails.push(data[i]);
        }
        // subratedetails.push(data);
      }
    }
    var rateSubDetailsarr = subratedetails;

    for (var i = 0; i < rateDetailsarr.length; i++) {
      //debugger;;
      if (this.state.isCopy == true) {
        var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
          x => x.RateLineId === rateDetailsarr[i].saleQuoteLineID
        );
        for (let j = 0; j < rateOrgDetailsarr.length; j++) {
          if (rateOrgDetailsarr[j].Total) {
            if (
              parseFloat(rateDetailsarr[i].Total.split(" ")[0]) -
                parseFloat(alledProfitAmount) >=
              rateOrgDetailsarr[j].Total.split(" ")[0]
            ) {
              rateDetailsarr[i].Total =
                parseFloat(rateDetailsarr[i].Total.split(" ")[0]) -
                parseFloat(alledProfitAmount) +
                " " +
                rateDetailsarr[i].Total.split(" ")[1];
              this.state.manProfitAmt[i].Total = parseFloat(
                this.state.ProfitAmount
              );
              for (var i = 0; i <= rateSubDetailsarr.length; i++) {
                if (rateSubDetailsarr[i].ChargeCode == "Freight") {
                  rateSubDetailsarr[i].Total =
                    parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) -
                    parseFloat(alledProfitAmount) +
                    " " +
                    rateSubDetailsarr[i].Total.split(" ")[1];
                  //}
                  break;
                }
              }
            } else {
              NotificationManager.error(
                "Price should not be less than " + rateOrgDetailsarr[0].Total
              );
            }
          }
        }
      } else {
        var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
          x => x.RateLineId === rateDetailsarr[i].RateLineId
        );
        if (
          parseFloat(rateDetailsarr[i].TotalAmount) -
            parseFloat(alledProfitAmount) >=
          rateOrgDetailsarr[0].Total
        ) {
          rateDetailsarr[i].TotalAmount =
            parseFloat(rateDetailsarr[i].TotalAmount) -
            parseFloat(alledProfitAmount);

          for (var j = 0; j <= rateSubDetailsarr.length; j++) {
            if (rateSubDetailsarr[j].ChargeCode == "Freight") {
              rateSubDetailsarr[j].TotalAmount =
                parseFloat(rateSubDetailsarr[j].TotalAmount) -
                parseFloat(alledProfitAmount);
              break;
            }
          }
        } else {
          NotificationManager.error(
            "Price should not be less than " + rateOrgDetailsarr[0].Total
          );
        }
      }
    }

    for (let j = 0; j < rateSubDetailsarr.length; j++) {
      if (this.state.isCopy === true) {
        var total = parseFloat(rateSubDetailsarr[j].Total.split(" ")[0]);
        profitLossAmt += total - rateSubDetailsarr[j].BuyRate;
        BuyRate += rateSubDetailsarr[j].BuyRate;
      } else {
        profitLossAmt +=
          rateSubDetailsarr[j].TotalAmount - rateSubDetailsarr[j].BuyRate;

        BuyRate += rateSubDetailsarr[j].BuyRate;
      }
    }

    for (var i = 0; i <= rateSubDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        if (rateSubDetailsarr[i].ChargeCode == "Freight") {
          rateSubDetailsarr[i].Total =
            parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) +
            parseFloat(this.state.ProfitAmount) +
            " " +
            rateSubDetailsarr[i].Total.split(" ")[1];

          break;
        }
      } else {
        if (rateSubDetailsarr[i].ChargeCode == "Freight") {
          rateSubDetailsarr[i].TotalAmount =
            parseFloat(rateSubDetailsarr[i].TotalAmount) +
            parseFloat(this.state.ProfitAmount);

          break;
        }
      }
    }
    var finalprofitLossAmt =
      profitLossAmt + parseFloat(this.state.ProfitAmount);
    var finalprofitLossPer = 0;

    if (this.state.isCopy) {
      var finalprofitLossPer =
        (finalprofitLossAmt * 100) /
        parseFloat(this.state.selectedDataRow[0].Total.split(" ")[0]);
    } else {
      var finalprofitLossPer =
        (finalprofitLossAmt * 100) / this.state.selectedDataRow[0].TotalAmount;
    }

    this.setState({
      profitLossAmt: finalprofitLossAmt,
      profitLossPer: finalprofitLossPer
    });

    for (var i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        rateDetailsarr[i].Total =
          parseFloat(rateDetailsarr[i].Total.split(" ")[0]) +
          parseFloat(this.state.ProfitAmount) +
          " " +
          rateDetailsarr[i].Total.split(" ")[1];
      } else {
        rateDetailsarr[i].TotalAmount =
          parseFloat(rateDetailsarr[i].TotalAmount) +
          parseFloat(this.state.ProfitAmount);
      }
    }

    this.setState(prevState => ({
      modalProfit: false
    }));
    debugger;
    BuyRate = 0;
    profitLossAmt = 0;
    for (let j = 0; j < rateSubDetailsarr.length; j++) {
      if (this.state.isCopy === true) {
        var total = parseFloat(rateSubDetailsarr[j].Total.split(" ")[0]);
        profitLossAmt += total - rateSubDetailsarr[j].BuyRate;
        BuyRate += rateSubDetailsarr[j].BuyRate;
      } else {
        profitLossAmt +=
          rateSubDetailsarr[j].TotalAmount - rateSubDetailsarr[j].BuyRate;

        BuyRate += rateSubDetailsarr[j].BuyRate;
      }
    }

    this.setState({
      toggleProfitRemoveBtn: true,
      Addedprofit: this.state.ProfitAmount
    });
    this.forceUpdate();
  }

  hanleProfitAmountSubmit() {
    debugger;

    var rateDetailsarr = this.state.selectedDataRow;

    var subratedetails = [];
    var BuyRate = 0;
    for (let i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy === true) {
        var data = this.state.rateSubDetails.filter(
          x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
        );
        subratedetails.push(data);
      } else {
        var data = this.state.rateSubDetails.filter(
          x => x.RateLineID === rateDetailsarr[i].RateLineId
        );
        for (let i = 0; i < data.length; i++) {
          subratedetails.push(data[i]);
        }
        // subratedetails.push(data);
      }
    }
    var rateSubDetailsarr = subratedetails;

    for (var i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        rateDetailsarr[i].Total =
          parseFloat(rateDetailsarr[i].Total.split(" ")[0]) +
          parseFloat(this.state.ProfitAmount) +
          " " +
          rateDetailsarr[i].Total.split(" ")[1];

        var getindex = this.state.manProfitAmt.findIndex(
          x => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
        );
        this.state.manProfitAmt[getindex].Total += parseFloat(
          this.state.ProfitAmount
        );
      } else {
        rateDetailsarr[i].TotalAmount =
          parseFloat(rateDetailsarr[i].TotalAmount) +
          parseFloat(this.state.ProfitAmount);

        var getindex = this.state.manProfitAmt.findIndex(
          x => x.RateLineId == rateDetailsarr[i].RateLineId
        );
        this.state.manProfitAmt[getindex].Total += parseFloat(
          this.state.ProfitAmount
        );
      }
    }

    // if (this.state.isCopy == true) {
    //   for (let j = 0; j < rateSubDetailsarr[0].length; j++) {
    //     BuyRate += rateSubDetailsarr[0][j].BuyRate;
    //   }
    // } else {
    //   debugger;
    //   for (let j = 0; j < rateSubDetailsarr.length; j++) {
    //     BuyRate += rateSubDetailsarr[j].BuyRate;
    //   }
    // }

    for (var i = 0; i <= rateSubDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        if (rateSubDetailsarr[0][i].ChargeCode == "Freight") {
          rateSubDetailsarr[0][i].Total =
            parseFloat(rateSubDetailsarr[0][i].Total.split(" ")[0]) +
            parseFloat(this.state.ProfitAmount) +
            " " +
            rateSubDetailsarr[0][i].Total.split(" ")[1];
          break;
        }
      } else {
        if (rateSubDetailsarr[i].ChargeCode == "Freight") {
          rateSubDetailsarr[i].TotalAmount =
            parseFloat(rateSubDetailsarr[i].TotalAmount) +
            parseFloat(this.state.ProfitAmount);
          break;
        }
      }
    }

    // var BuyRate = this.state.BuyRate;
    var finalprofitLossAmt =
      parseFloat(this.state.ProfitAmount) + this.state.profitLossAmt;
    var finalprofitLossPer = 0;
    if (this.state.isCopy == true) {
      finalprofitLossPer =
        (finalprofitLossAmt * 100) /
        this.state.selectedDataRow[0].Total.split(" ")[0];
    } else {
      finalprofitLossPer =
        (finalprofitLossAmt * 100) / this.state.selectedDataRow[0].TotalAmount;
    }

    debugger;
    this.setState(prevState => ({
      modalProfit: false
    }));
    this.setState({
      toggleProfitRemoveBtn: true,
      Addedprofit: this.state.ProfitAmount,
      profitLossAmt: finalprofitLossAmt,
      profitLossPer: finalprofitLossPer
    });
    this.forceUpdate();
  }

  hanleProfitAmountRemove() {
    debugger;
    var alledProfitAmount = 0;
    var rateOrgDetailsarr = null;
    if (this.state.selectedDataRow.length === 1) {
      var showUpdate = false;
      debugger;
      for (let i = 0; i < this.state.rateOrgDetails.length; i++) {
        if (this.state.isCopy === true) {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            this.state.selectedDataRow[0].saleQuoteLineID
          ) {
            if (this.state.rateOrgDetails[i].Total) {
              var total = this.state.selectedDataRow[0].Total.split(" ")[0];
              var total1 = this.state.rateOrgDetails[i].Total.split(" ")[0];

              // alledProfitAmount = total - total1;
              alledProfitAmount = this.state.manProfitAmt[i].Total;
            }
          }
        } else {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            this.state.selectedDataRow[0].RateLineId
          ) {
            alledProfitAmount = this.state.manProfitAmt[i].Total;
            if (alledProfitAmount > 0) {
              showUpdate = true;
            }
          }
        }
      }
    }
    if (alledProfitAmount === parseFloat(this.state.ProfitAmount)) {
      var rateDetailsarr = this.state.selectedDataRow;

      var subratedetails = [];
      for (let i = 0; i < rateDetailsarr.length; i++) {
        if (this.state.isCopy === true) {
          var data = this.state.rateSubDetails.filter(
            x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
          );
          subratedetails = data;
        } else {
          var data = this.state.rateSubDetails.filter(
            x => x.RateLineID === rateDetailsarr[i].RateLineId
          );
          for (let i = 0; i < data.length; i++) {
            subratedetails.push(data[i]);
          }
          // subratedetails.push(data);
        }
      }
      var rateSubDetailsarr = subratedetails;

      for (var i = 0; i < rateDetailsarr.length; i++) {
        //debugger;;
        if (this.state.isCopy == true) {
          rateOrgDetailsarr = this.state.rateOrgDetails.filter(
            x => x.RateLineId === rateDetailsarr[i].saleQuoteLineID
          );
          if (
            parseFloat(rateDetailsarr[i].Total.split(" ")[0]) -
              parseFloat(this.state.ProfitAmount) >=
            rateOrgDetailsarr[0].Total.split(" ")[0]
          ) {
            rateDetailsarr[i].Total =
              parseFloat(rateDetailsarr[i].Total.split(" ")[0]) -
              parseFloat(this.state.ProfitAmount) +
              " " +
              rateDetailsarr[i].Total.split(" ")[1];

            var getindex = this.state.manProfitAmt.findIndex(
              x => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
            );
            this.state.manProfitAmt[getindex].Total -= parseFloat(
              this.state.ProfitAmount
            );
            for (var i = 0; i <= rateSubDetailsarr.length; i++) {
              if (rateSubDetailsarr[i].ChargeCode == "Freight") {
                rateSubDetailsarr[i].Total =
                  parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) -
                  parseFloat(this.state.ProfitAmount) +
                  " " +
                  rateSubDetailsarr[i].Total.split(" ")[1];
              }
              break;
            }
          } else {
            NotificationManager.error("Please enter valid profit amount.");
          }
        } else {
          var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
            x => x.RateLineId === rateDetailsarr[i].RateLineId
          );
          if (
            parseFloat(rateDetailsarr[i].TotalAmount) -
              parseFloat(this.state.ProfitAmount) >=
            rateOrgDetailsarr[0].Total
          ) {
            rateDetailsarr[i].TotalAmount =
              parseFloat(rateDetailsarr[i].TotalAmount) -
              parseFloat(this.state.ProfitAmount);
            var getindex = this.state.manProfitAmt.findIndex(
              x => x.RateLineId == rateDetailsarr[i].RateLineId
            );
            this.state.manProfitAmt[getindex].Total -= parseFloat(
              this.state.ProfitAmount
            );
            for (var j = 0; j <= rateSubDetailsarr.length; j++) {
              if (rateSubDetailsarr[j].ChargeCode == "Freight") {
                rateSubDetailsarr[j].TotalAmount =
                  parseFloat(rateSubDetailsarr[j].TotalAmount) -
                  parseFloat(this.state.ProfitAmount);
              }
              break;
            }
          } else {
            NotificationManager.error("Please enter valid profit amount.");
          }
        }
      }
      var BuyRate = 0;
      var profitLossAmt = 0;

      for (let j = 0; j < rateSubDetailsarr.length; j++) {
        if (this.state.isCopy === true) {
          var total = parseFloat(rateSubDetailsarr[j].Total.split(" ")[0]);
          profitLossAmt += total - rateSubDetailsarr[j].BuyRate;
          BuyRate += rateSubDetailsarr[j].BuyRate;
        } else {
          profitLossAmt +=
            rateSubDetailsarr[j].TotalAmount - rateSubDetailsarr[j].BuyRate;

          BuyRate += rateSubDetailsarr[j].BuyRate;
        }
      }

      var finalprofitLossAmt =
        this.state.profitLossAmt - parseFloat(this.state.ProfitAmount);
      var finalprofitLossPer = 0;
      if (this.state.isCopy) {
        finalprofitLossPer =
          (finalprofitLossAmt * 100) /
          parseFloat(this.state.selectedDataRow[0].Total.split(" ")[0]);
      } else {
        finalprofitLossPer =
          (finalprofitLossAmt * 100) /
          this.state.selectedDataRow[0].TotalAmount;
      }

      this.setState({
        profitLossAmt: finalprofitLossAmt,
        profitLossPer: finalprofitLossPer
      });

      this.toggleLoss();
      this.setState({
        toggleProfitRemoveBtn: false,
        modalProfit: false
        //Addedprofit: ""
      });
      this.forceUpdate();
    } else {
      NotificationManager.error("Please enter valid profit amount.");
    }
  }

  processText(inputText) {
    var output = [];
    var json = inputText.toString().split(" ");

    return json;
  }

  HandleLocalSearchCharges(element, e) {
    debugger;
    var rateDetailsarr = this.state.selectedDataRow;
    var getindex = 0;
    var BuyRate = 0;
    var profitLossAmt = this.state.profitLossAmt || 0;
    var profitLossPer = this.state.profitLossPer || 0;
    if (e.target.checked) {
      for (var i = 0; i < rateDetailsarr.length; i++) {
        var newrateSubDetails = {};

        if (this.state.isCopy === true) {
          var newLineName = "";
          if (rateDetailsarr[i].lineName) {
            newLineName = rateDetailsarr[i].lineName.toUpperCase();
          } else {
            newLineName = rateDetailsarr[i].Linename.toUpperCase();
          }
          if (element.LineName.toUpperCase() == newLineName) {
            getindex = this.state.rateDetails.findIndex(
              x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
            );

            if (
              this.state.containerLoadType === "FCL" &&
              rateDetailsarr[i].ContainerType == element.ContainerType
            ) {
              var total = 0;
              var currency = "";

              var data = this.state.rateDetails[getindex].Total.split(" ");
              total = data[0];
              currency = data[1];

              var final_sum = (
                parseFloat(total) + parseFloat(e.target.value)
              ).toFixed(2);

              this.state.rateDetails[getindex].Total =
                final_sum + " " + currency;

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.saleQuoteLineID ===
                  this.state.rateDetails[getindex].saleQuoteLineID
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;
              for (let j = 0; j < DatarateSubDetails.length; j++) {
                var newtotal = DatarateSubDetails[j].Total.split(" ")[0];
                newprofitLossAmt +=
                  parseFloat(newtotal) - DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt += finalAmountInBaseCurrency;
              BuyRate += element.Buying;
              finalprofitLossAmt += newprofitLossAmt;
              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              // var profitLossPer1 = (finalprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Rate: parseFloat(element.Amount),
                Currency: element.Currency,
                saleQuoteLineID: this.state.rateDetails[getindex]
                  .saleQuoteLineID,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                ChargeItem: element.ChargeItem,
                Exrate: element.Exrate,
                ChargeType: element.ChargeCode,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency
              };
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.RateLineID = this.state.rateDetails[
                  i
                ].RateLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            } else {
              debugger;
              var total = 0;
              var currency = "";

              var data = this.state.rateDetails[getindex].Total.split(" ");
              total = data[0];
              currency = data[1];

              var final_sum = parseFloat(total) + parseFloat(e.target.value);

              this.state.rateDetails[getindex].Total =
                final_sum + " " + currency;

              var calAmount = parseFloat(e.target.value);

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;
              for (let j = 0; j < DatarateSubDetails.length; j++) {
                var newtotal = DatarateSubDetails[j].Total.split(" ")[0];
                newprofitLossAmt +=
                  parseFloat(newtotal) - DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt += finalAmountInBaseCurrency;
              BuyRate += element.Buying;
              finalprofitLossAmt += newprofitLossAmt;
              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              // var profitLossPer1 = (finalprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });

              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Rate: parseFloat(element.Amount),
                Currency: element.Currency,
                saleQuoteLineID: this.state.rateDetails[getindex]
                  .saleQuoteLineID,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                ChargeItem: element.ChargeItem,
                Exrate: element.Exrate,
                ChargeType: element.ChargeCode,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency
              };
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.RateLineID = this.state.rateDetails[
                  i
                ].RateLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            }
          } else {
            if (
              this.state.containerLoadType == "FTL" ||
              this.state.containerLoadType == "LTL" ||
              this.state.containerLoadType == "LCL"
            ) {
              var total = 0;
              var currency = "";

              var data = this.state.rateDetails[i].Total.split(" ");
              total = data[0];
              currency = data[1];

              var final_sum = (
                parseFloat(total) + parseFloat(e.target.value)
              ).toFixed(2);

              this.state.rateDetails[i].Total = final_sum + " " + currency;

              var calAmount = parseFloat(e.target.value);
              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;
              for (let j = 0; j < DatarateSubDetails.length; j++) {
                var newtotal = DatarateSubDetails[j].Total.split(" ")[0];
                newprofitLossAmt +=
                  parseFloat(newtotal) - DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt += finalAmountInBaseCurrency;
              BuyRate += element.Buying;
              finalprofitLossAmt += newprofitLossAmt;
              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              // var profitLossPer1 = (finalprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });

              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Rate: parseFloat(element.Amount),
                Currency: element.Currency,
                saleQuoteLineID: this.state.rateDetails[getindex]
                  .saleQuoteLineID,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                ChargeItem: element.ChargeItem,
                Exrate: element.Exrate,
                ChargeType: element.ChargeCode,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency
              };
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.RateLineID = this.state.rateDetails[
                  i
                ].RateLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            }
          }
        } else {
          if (
            element.LineName ==
            (rateDetailsarr[i].lineName || rateDetailsarr[i].Linename)
          ) {
            if (this.state.containerLoadType === "FCL") {
              if (element.ContainerType === rateDetailsarr[i].ContainerType) {
                getindex = this.state.rateDetails.findIndex(
                  x => x.RateLineId === rateDetailsarr[i].RateLineId
                );

                this.state.rateDetails[getindex].TotalAmount =
                  parseFloat(
                    this.state.rateDetails[getindex].TotalAmount == null
                      ? 0
                      : this.state.rateDetails[getindex].TotalAmount
                  ) + parseFloat(e.target.value);

                var calAmount = parseFloat(e.target.value);
                var localsurAmount = this.state.localsurAmount + calAmount;

                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  x =>
                    x.RateLineID === this.state.rateDetails[getindex].RateLineId
                );

                debugger;
                var newprofitLossAmt = 0;
                var BuyRate = 0;
                var finalAmountInBaseCurrency =
                  element.AmountInBaseCurrency - element.Buying;
                for (let j = 0; j < DatarateSubDetails.length; j++) {
                  newprofitLossAmt +=
                    DatarateSubDetails[j].TotalAmount -
                    DatarateSubDetails[j].BuyRate;
                  BuyRate += DatarateSubDetails[j].BuyRate;
                }

                var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
                var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
                var finalprofitLossPer = profitLossPer - profitLossPer1;

                newprofitLossAmt += finalAmountInBaseCurrency;
                BuyRate += element.Buying;
                finalprofitLossAmt += newprofitLossAmt;
                var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
                finalprofitLossPer += profitLossPer;

                this.setState({
                  profitLossAmt: finalprofitLossAmt,
                  profitLossPer: finalprofitLossPer
                });

                this.setState({ localsurAmount });
                var newrateSubDetails = {
                  ChargeID: element.ChargeID,
                  BuyRate: element.Buying,
                  Rate: parseFloat(element.Amount),
                  Currency: element.Currency,
                  RateLineID: this.state.rateDetails[getindex].RateLineId,
                  ChargeCode: element.ChargeCode,
                  ChargeDesc: element.ChargeDesc,
                  Tax: 0,
                  ChargeItem: element.ChargeItem,
                  Exrate: element.Exrate,
                  ChargeType: element.ChargeCode,
                  TotalAmount: parseFloat(element.AmountInBaseCurrency),
                  BaseCurrency:element.BaseCurrency
                };
                if (
                  this.state.containerLoadType == "FTL" ||
                  this.state.containerLoadType == "LTL"
                ) {
                  newrateSubDetails.RateLineID = this.state.rateDetails[
                    getindex
                  ].RateLineID;
                }

                this.state.rateSubDetails = this.state.rateSubDetails.concat(
                  newrateSubDetails
                );
              }
            } else {
              getindex = this.state.rateDetails.findIndex(
                x => x.RateLineId === rateDetailsarr[i].RateLineId
              );

              this.state.rateDetails[getindex].TotalAmount =
                parseFloat(
                  this.state.rateDetails[getindex].TotalAmount == null
                    ? 0
                    : this.state.rateDetails[getindex].TotalAmount
                ) + parseFloat(e.target.value);

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;
              for (let j = 0; j < DatarateSubDetails.length; j++) {
                newprofitLossAmt +=
                  DatarateSubDetails[j].TotalAmount -
                  DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt += finalAmountInBaseCurrency;
              BuyRate += element.Buying;
              finalprofitLossAmt += newprofitLossAmt;

              var profitLossPer = (finalprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Rate: parseFloat(element.Amount),
                Currency: element.Currency,
                RateLineID: this.state.rateDetails[getindex].RateLineId,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                ChargeItem: element.ChargeItem,
                Exrate: element.Exrate,
                ChargeType: element.ChargeCode,
                TotalAmount: parseFloat(element.AmountInBaseCurrency),
                BaseCurrency:element.BaseCurrency
              };
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.RateLineID = this.state.rateDetails[
                  getindex
                ].RateLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            }
          } else {
            if (
              this.state.containerLoadType == "FTL" ||
              this.state.containerLoadType == "LTL" ||
              this.state.containerLoadType == "LCL"
            ) {
              this.state.rateDetails[i].TotalAmount = (
                parseFloat(
                  this.state.rateDetails[i].TotalAmount == null
                    ? 0
                    : this.state.rateDetails[i].TotalAmount
                ) + parseFloat(e.target.value)
              ).toFixed(2);

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;
              for (let j = 0; j < DatarateSubDetails.length; j++) {
                newprofitLossAmt +=
                  DatarateSubDetails[j].TotalAmount -
                  DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var finalprofitLossAmt = profitLossAmt - newprofitLossAmt;
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt += finalAmountInBaseCurrency;
              BuyRate += element.Buying;
              finalprofitLossAmt += newprofitLossAmt;
              var profitLossPer = (finalprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Rate: parseFloat(element.Amount),
                Currency: element.Currency,
                RateLineID: this.state.rateDetails[getindex].RateLineId,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                ChargeItem: element.ChargeItem,
                Exrate: element.Exrate,
                ChargeType: element.ChargeCode,
                TotalAmount: parseFloat(element.AmountInBaseCurrency),
                BaseCurrency: element.BaseCurrency
              };
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.RateLineID = this.state.rateDetails[
                  i
                ].RateLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            }
          }
        }
      }

      debugger;
      var finalval = this.state.profitLossAmt;
      // }
      var aTotalAmount = 0;
      if (this.state.selectedDataRow.length > 0) {
        if (this.state.isCopy) {
          aTotalAmount = this.state.selectedDataRow.reduce(function(prev, cur) {
            debugger;
            return prev + parseFloat(cur.Total.split(" ")[0]);
          }, 0);
        } else {
          aTotalAmount = this.state.selectedDataRow.reduce(function(prev, cur) {
            debugger;
            return prev + cur.TotalAmount;
          }, 0);
        }
      }

      var finalprofitval = (finalval * 100) / aTotalAmount;
      this.setState({ profitLossPer: finalprofitval });
      this.forceUpdate();
    }
    if (!e.target.checked) {
      debugger;
      var getindex = 0;
      for (var i = 0; i < rateDetailsarr.length; i++) {
        //debugger;;
        var linename = "";
        if (rateDetailsarr[i].lineName) {
          linename = rateDetailsarr[i].lineName;
        } else {
          linename = rateDetailsarr[i].Linename;
        }

        if (element.LineName.toUpperCase() == linename.toUpperCase()) {
          if (this.state.isCopy === true) {
            getindex = this.state.rateDetails.findIndex(
              x => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
            );
            if (
              this.state.containerLoadType === "FCL" &&
              element.ContainerType ===
                this.state.rateDetails[getindex].ContainerType
            ) {
              var amount = this.processText(
                this.state.rateDetails[getindex].Total
              );

              this.state.rateDetails[getindex].Total =
                parseFloat(amount[0]) -
                parseFloat(e.target.value) +
                " " +
                amount[1];

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount - calAmount;
              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.saleQuoteLineID ===
                  this.state.rateDetails[getindex].saleQuoteLineID
              );

              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;

              for (let j = 0; j < DatarateSubDetails.length; j++) {
                var newtotal = DatarateSubDetails[j].Total.split(" ")[0];
                newprofitLossAmt += newtotal - DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }
              debugger;

              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt -= finalAmountInBaseCurrency;
              BuyRate -= element.Buying;

              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });

              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                  element.ChargeCode
                ) {
                  this.state.rateSubDetails.splice(j, 1);
                  break;
                }
              }
            } else {
              if (this.state.containerLoadType === "AIR") {
                var amount = this.processText(
                  this.state.rateDetails[getindex].Total
                );
                this.state.rateDetails[getindex].Total =
                  (parseFloat(amount[0]) - parseFloat(e.target.value)).toFixed(
                    2
                  ) +
                  " " +
                  amount[1];
                var calAmount = parseFloat(e.target.value);
                var localsurAmount = this.state.localsurAmount - calAmount;
                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  x =>
                    x.saleQuoteLineID ===
                    this.state.rateDetails[getindex].saleQuoteLineID
                );

                var newprofitLossAmt = 0;
                var BuyRate = 0;
                var finalAmountInBaseCurrency =
                  element.AmountInBaseCurrency - element.Buying;

                for (let j = 0; j < DatarateSubDetails.length; j++) {
                  newprofitLossAmt +=
                    DatarateSubDetails[j].TotalAmount -
                    DatarateSubDetails[j].BuyRate;
                  BuyRate += DatarateSubDetails[j].BuyRate;
                }
                var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
                var finalprofitLossPer = profitLossPer - profitLossPer1;

                newprofitLossAmt -= finalAmountInBaseCurrency;
                BuyRate -= element.Buying;

                var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
                finalprofitLossPer += profitLossPer;

                this.setState({
                  profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                  profitLossPer: finalprofitLossPer
                });

                this.setState({ localsurAmount });

                for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                  if (
                    this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode
                  ) {
                    this.state.rateSubDetails.splice(j, 1);
                    break;
                  }
                }
              }
            }
          } else {
            getindex = this.state.rateDetails.findIndex(
              x => x.RateLineId === rateDetailsarr[i].RateLineId
            );
            if (
              this.state.containerLoadType === "FCL" &&
              element.ContainerType ===
                this.state.rateDetails[getindex].ContainerType
            ) {
              this.state.rateDetails[getindex].TotalAmount =
                parseFloat(this.state.rateDetails[getindex].TotalAmount) -
                parseFloat(e.target.value);

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount - calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;

              for (let j = 0; j < DatarateSubDetails.length; j++) {
                newprofitLossAmt +=
                  DatarateSubDetails[j].TotalAmount -
                  DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt -= finalAmountInBaseCurrency;
              BuyRate -= element.Buying;

              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });

              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                  element.ChargeCode
                ) {
                  this.state.rateSubDetails.splice(j, 1);
                  break;
                }
              }
            } else {
              if (this.state.containerLoadType === "AIR") {
                this.state.rateDetails[getindex].TotalAmount =
                  parseFloat(this.state.rateDetails[getindex].TotalAmount) -
                  parseFloat(e.target.value);

                var calAmount = parseFloat(e.target.value);
                var localsurAmount = this.state.localsurAmount - calAmount;

                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  x =>
                    x.RateLineID === this.state.rateDetails[getindex].RateLineId
                );

                debugger;
                var newprofitLossAmt = 0;
                var BuyRate = 0;
                var finalAmountInBaseCurrency =
                  element.AmountInBaseCurrency - element.Buying;

                for (let j = 0; j < DatarateSubDetails.length; j++) {
                  newprofitLossAmt +=
                    DatarateSubDetails[j].TotalAmount -
                    DatarateSubDetails[j].BuyRate;
                  BuyRate += DatarateSubDetails[j].BuyRate;
                }

                var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
                var finalprofitLossPer = profitLossPer - profitLossPer1;

                newprofitLossAmt -= finalAmountInBaseCurrency;
                BuyRate -= element.Buying;

                var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
                finalprofitLossPer += profitLossPer;

                this.setState({
                  profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                  profitLossPer: finalprofitLossPer
                });

                this.setState({ localsurAmount });

                for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                  if (
                    this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode
                  ) {
                    this.state.rateSubDetails.splice(j, 1);
                    break;
                  }
                }
              }
            }
          }
        } else {
          if (
            this.state.containerLoadType == "FTL" ||
            this.state.containerLoadType == "LTL" ||
            this.state.containerLoadType == "LCL"
          ) {
            if (this.state.isCopy === true) {
              var amount = this.processText(this.state.rateDetails[i].Total);

              this.state.rateDetails[i].Total =
                parseFloat(amount[0]) -
                parseFloat(e.target.value) +
                " " +
                amount[1];

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount - calAmount;
              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.saleQuoteLineID ===
                  this.state.rateDetails[getindex].saleQuoteLineID
              );

              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;

              for (let j = 0; j < DatarateSubDetails.length; j++) {
                newprofitLossAmt +=
                  DatarateSubDetails[j].TotalAmount -
                  DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }
              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt -= finalAmountInBaseCurrency;
              BuyRate -= element.Buying;

              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                profitLossPer: finalprofitLossPer
              });

              this.setState({ localsurAmount });

              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                  element.ChargeCode
                ) {
                  this.state.rateSubDetails.splice(j, 1);
                  break;
                }
              }
            } else {
              this.state.rateDetails[i].TotalAmount =
                parseFloat(this.state.rateDetails[i].TotalAmount) -
                parseFloat(e.target.value);

              var calAmount = parseFloat(e.target.value);
              var localsurAmount = this.state.localsurAmount - calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                x =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

              debugger;
              var newprofitLossAmt = 0;
              var BuyRate = 0;
              var finalAmountInBaseCurrency =
                element.AmountInBaseCurrency - element.Buying;

              for (let j = 0; j < DatarateSubDetails.length; j++) {
                newprofitLossAmt +=
                  DatarateSubDetails[j].TotalAmount -
                  DatarateSubDetails[j].BuyRate;
                BuyRate += DatarateSubDetails[j].BuyRate;
              }

              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt -= finalAmountInBaseCurrency;
              BuyRate -= element.Buying;

              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                profitLossPer: finalprofitLossPer
              });
              this.setState({ localsurAmount });

              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                  element.ChargeCode
                ) {
                  this.state.rateSubDetails.splice(j, 1);
                  break;
                }
              }
            }
          }
        }
      }
      debugger;
      var finalval = this.state.profitLossAmt;
      // }
      var aTotalAmount = 0;
      if (this.state.selectedDataRow.length > 0) {
        if (this.state.isCopy) {
          aTotalAmount = this.state.selectedDataRow.reduce(function(prev, cur) {
            debugger;
            return prev + parseFloat(cur.Total.split(" ")[0]);
          }, 0);
        } else {
          aTotalAmount = this.state.selectedDataRow.reduce(function(prev, cur) {
            debugger;
            return prev + cur.TotalAmount;
          }, 0);
        }
      }
      var finalprofitval = (finalval * 100) / aTotalAmount;
      this.setState({ profitLossPer: finalprofitval });
      this.forceUpdate();
    }
  }
  ////this method for Commodity drop-down bind
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
  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;

    this.setState({
      currentPackageType: value
    });
    this.forceUpdate();
  }

  SubmitCargoDetails(e) {
    debugger;
    var PackageDetailsArr = [];
    let CargoDetailsArr = [];
    if (
      this.state.containerLoadType == "AIR" ||
      this.state.containerLoadType == "LCL" ||
      this.state.containerLoadType == "FTL"
    ) {
      let multiCBM = [...this.state.multiCBM];
      for (var i = 0; i < multiCBM.length; i++) {
        if (
          multiCBM[i].PackageType + "_" + i ==
          e.target.getAttribute("data-valuespecialsontainersode")
        ) {
          multiCBM[i].PackageType = this.state.currentPackageType;
        }

        PackageDetailsArr.push({
          PackageType: multiCBM[i].PackageType,
          SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
          ContainerType: multiCBM[i].PackageType,
          Packaging: "-",
          Quantity: multiCBM[i].Quantity,
          Lenght:
            this.state.isCopy == true
              ? multiCBM[i].Length || multiCBM[i].Lengths
              : multiCBM[i].Length,
          Width: multiCBM[i].Width,
          Height:
            this.state.isCopy == true ? multiCBM[i].height : multiCBM[i].height,
          Weight:
            this.state.isCopy == true
              ? multiCBM[i].GrossWeight
              : multiCBM[i].GrossWeight,
          CBM:
            this.state.containerLoadType == "LCL"
              ? multiCBM[i].Volume
              : multiCBM[i].VolumeWeight,
          Editable: true
        });

        CargoDetailsArr.push({
          PackageType: multiCBM[i].PackageType,
          SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
          ContainerType: multiCBM[i].PackageType,
          Packaging: "-",
          Quantity: multiCBM[i].Quantity,
          Lenght:
            this.state.isCopy == true
              ? multiCBM[i].Length || multiCBM[i].Lengths
              : multiCBM[i].Length,
          Width: multiCBM[i].Width,
          Height:
            this.state.isCopy == true ? multiCBM[i].height : multiCBM[i].height,
          Weight:
            this.state.isCopy == true
              ? multiCBM[i].GrossWeight
              : multiCBM[i].GrossWeight,
          Gross_Weight: "-",
          Temperature: "-",
          CBM:
            this.state.containerLoadType == "LCL"
              ? multiCBM[i].Volume
              : multiCBM[i].VolumeWeight,
          Volume: "-",
          VolumeWeight: "-",
          Editable: true
        });
      }

      this.setState({
        multiCBM: multiCBM
      });
    } else {
      debugger;
      let flattack_openTop = [...this.state.flattack_openTop];
      for (var i = 0; i < flattack_openTop.length; i++) {
        if (
          flattack_openTop[i].SpecialContainerCode ==
          e.target.getAttribute("data-valuespecialsontainersode")
        ) {
          flattack_openTop[i].PackageType = this.state.currentPackageType;
        }
        if (
          (flattack_openTop[i].PackageType !== "" &&
            flattack_openTop[i].SpecialContainerCode !== "" &&
            flattack_openTop[i].length !== 0) ||
          ("" && flattack_openTop[i].width !== 0) ||
          ("" && flattack_openTop[i].height !== 0) ||
          ("" && flattack_openTop[i].Gross_Weight !== 0) ||
          ""
        ) {
          PackageDetailsArr.push({
            PackageType: flattack_openTop[i].PackageType,
            SpecialContainerCode: flattack_openTop[i].SpecialContainerCode,
            ContainerType:
              flattack_openTop[i].PackageType +
              " (" +
              flattack_openTop[i].SpecialContainerCode +
              ")",
            Quantity: this.state.users[0].ContainerQuantity,
            Lenght: flattack_openTop[i].length,
            Width: flattack_openTop[i].width,
            Height: flattack_openTop[i].height,
            Weight: flattack_openTop[i].Gross_Weight,
            CBM: flattack_openTop[i].total,
            Editable: true
          });

          CargoDetailsArr.push({
            PackageType: flattack_openTop[i].PackageType,
            SpecialContainerCode:
              flattack_openTop[i].SpecialContainerCode + "_" + i,
            ContainerType:
              flattack_openTop[i].PackageType +
              " (" +
              flattack_openTop[i].SpecialContainerCode +
              ")",
            Packaging: "-",
            Quantity: flattack_openTop[i].Quantity,
            Lenght: flattack_openTop[i].length,
            Width: flattack_openTop[i].width,
            Height: flattack_openTop[i].height,
            Weight: flattack_openTop[i].Gross_Weight,
            Gross_Weight: "-",
            Temperature: "-",
            CBM: flattack_openTop[i].total,
            Volume: "-",
            VolumeWeight: "-",
            Editable: true
          });
        }
      }

      this.setState({
        flattack_openTop: flattack_openTop
      });
    }

    for (var i = 0; i < CargoDetailsArr.length; i++) {
      if (
        CargoDetailsArr[i].SpecialContainerCode ==
        e.target.getAttribute("data-valuespecialsontainersode")
      ) {
        CargoDetailsArr[i].PackageType = this.state.currentPackageType;
        if (
          this.state.containerLoadType == "AIR" ||
          this.state.containerLoadType == "LCL"
        ) {
          CargoDetailsArr[i].ContainerType = this.state.currentPackageType;
        } else {
          CargoDetailsArr[i].ContainerType =
            this.state.currentPackageType +
            " (" +
            CargoDetailsArr[i].SpecialContainerCode +
            ")";
        }
      }
    }

    this.setState({
      PackageDetailsArr: PackageDetailsArr,
      CargoDetailsArr: CargoDetailsArr
    });

    // this.props.location.state.flattack_openTop = flattack_openTop;

    this.forceUpdate();
    this.toggleEdit();
  }

  HandleChangeCon(field, e) {
    debugger;
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
          MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc")
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;

        if (response.data.Table.length != 0) {
          if (field == "CustomerList") {
            self.setState({
              customerData: response.data.Table,
              fields
            });
          } else {
            self.setState({
              customerData: response.data.Table,
              fields
            });
          }
        } else {
          self.state.error = "Please enter valid Consignee";
        }
        self.setState({
          error: self.state.error
        });
      });
    } else {
      self.setState({
        customerData: [],
        fields
      });
    }
  }

  handleSelectCon(field, value, e) {
    //debugger;;
    let fields = this.state.fields;
    fields[field] = value;
    var compId = e.Company_ID;
    var compName = e.Company_Name;
    var companyAddress = e.CompanyAddress;
    var contactName = e.ContactName;
    var contactEmail = e.ContactEmail;
    this.setState({
      fields,
      CompanyID: compId,
      CompanyName: compName,
      CompanyAddress: companyAddress,
      ContactName: contactName,
      ContactEmail: contactEmail
    });
    //document.getElementById("SearchRate").classList.remove("disableRates");
  }

  // --------------------------------------------------------------//

  AcceptQuotes() {
    //debugger;;
    let self = this;
    var SalesQuoteNumber = "";
    var QuoteType = "";

    SalesQuoteNumber = self.state.SalesQuoteNo;
    QuoteType = self.state.containerLoadType;

    var usertype = encryption(window.localStorage.getItem("usertype"), "desc");
    //debugger;;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteApprove`,
      data: {
        Mode: QuoteType,
        SalesQuoteNumber: SalesQuoteNumber,
        isApprove: 1,
        MyUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        //debugger;;
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                if (usertype !== "Sales User") {
                } else {
                  NotificationManager.success(response.data.Table[0].Message);
                }
              }
            }
          }
        }

        var Messagebody =
          "<html><body><table><tr><td>Hello Sir/Madam,</td><tr><tr><tr><tr><td>The Quotation is sent by our Sales Person Name.Request you to check the Quotation and share your approval for same.</td></tr><tr><td>To check and approve the quotation please click here.</td></tr></table></body></html>";
        // self.getFileData();
        setTimeout(() => {
          self.SendMail(SalesQuoteNumber, Messagebody);
        }, 100);
      })
      .catch(error => {
        //debugger;;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //alert(err[1].replace("}", ""))
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  getFileData() {
    debugger;
    this.togglePreview();
    var file = null;
    const input = document.getElementById("printDiv");
    const pdf = new jsPDF("portrait", "mm", "a4");

    // domtoimage.toPng(input).then(imgData => {
    //   this.togglePreview();
    //   pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    //   pdf.save("download.pdf");
    //   let obj = {};
    //   obj.pdfContent = pdf.output("datauristring");

    //   file = this.dataURLtoFile(obj.pdfContent);
    //   this.setState({ sendFile: file });
    //   debugger;
    //   this.SendMail(this.state.SalesQuoteNo,"");
    // });

    // pdf.fromHTML(document.getElementById('printDiv'),
    // margins.left, // x coord
    // margins.top,
    // {
    //   // y coord
    //   width: margins.width// max width of content on PDF
    // },function(dispose) {
    //   debugger
    //   headerFooterFormatting(pdf)
    //   pdf.save("download.pdf");
    // },
    // margins);
    var doc = new jsPDF();
    var elementHandler = {
      "#ignorePDF": function(element, renderer) {
        return true;
      }
    };
    doc.fromHTML(input, 15, 0.5, {
      width: 180,
      elementHandlers: elementHandler
    });
    doc.save("abc.pdf");
  }

  SendMail(SalesQuoteNumber, Messagebody) {
    debugger;

    // this.getFileData();
    var fd = new FormData();
    fd.append("CustomerID", 0);

    fd.append("SalesPersonID", 0);
    fd.append("SalesQuoteNumber", SalesQuoteNumber);
    fd.append(
      "MyWayUserID",
      encryption(window.localStorage.getItem("userid"), "desc")
    );
    fd.append("SalesQuotePreviewDoc", this.state.sendFile);

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteMailAPI`,
      data: fd,
      headers: authHeader()
    })
      .then(function(response) {
        //debugger;;
        if (response != null) {
          if (response.data != null) {
            if (response.data.length > 0) {
              NotificationManager.success(response.data[0].Result);
            }
          }
        }
      })
      .catch(error => {
        //debugger;;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //alert(err[1].replace("}", ""))
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  handleChangePage() {
    window.history.back();
  }

  HandleSalesQuoteConditions() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteConditions`,
      data: {
        Mode: this.state.containerLoadType,
        ShipmentType: this.state.shipmentType,
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      //debugger;;
      if (response.data.Table.length > 0) {
        self.setState({
          ConditionDesc: response.data.Table[0].conditionDesc
            .split("\n")
            .map((item, i) => <p key={i}>{item}</p>)
        });
      }
    });
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;
    //debugger;;
    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType" || name === "SpecialContainerCode") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value == "Select" ? "" : value
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value == "" ? 0 : parseFloat(value)
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

  addMultiDim() {
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: "",
          PackageType: "",
          Quantity: 0,
          length: 0,
          width: 0,
          height: 0,
          Gross_Weight: 0,
          total: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
  }

  removeMultiDim(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }

  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 0,
          Length: 0,
          Width: 0,
          height: 0,
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
              name="SpecialContainerCode"
              value={el.SpecialContainerCode}
            >
              <option selected>Select</option>
              {this.state.equipmentTypeArr.map((item, i) => (
                <option key={i} value={item.ContainerType}>
                  {item.ContainerType}
                </option>
              ))}
            </select>
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
              {this.state.packageTypeData !== undefined
                ? this.state.packageTypeData.map((item, i) => (
                    <option key={i} value={item.PackageName}>
                      {item.PackageName}
                    </option>
                  ))
                : null}
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
        {/* <div className="col-md">
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
        </div> */}
        {i === 0 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-plus mt-2"
                aria-hidden="true"
                onClick={this.addMultiDim.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
        {this.state.flattack_openTop.length > 1 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeMultiDim.bind(this, i)}
              ></i>
            </div>
          </div>
        ) : null}
        {/* <div className="">
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              aria-hidden="true"
              //onClick={this.removeClickMultiCBM.bind(this)}
            ></i>
          </div>
        </div> */}
      </div>
    ));
  }

  HandleChangeMultiCBM(i, e) {
    //debugger;;
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
        name === "Length" ||
        name === "Width" ||
        name === "Height" ||
        name === "height" ||
        name === "GrossWt" ||
        name === "GrossWeight"
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
          (parseFloat(multiCBM[i].Length) *
            parseFloat(multiCBM[i].Width) *
            parseFloat(multiCBM[i].height))) /
        6000;
      if (multiCBM[i].GrossWeight > parseFloat(decVolumeWeight)) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: multiCBM[i].GrossWeight
        };
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: parseFloat(decVolumeWeight)
        };
      }
    } else {
      var decVolume =
        multiCBM[i].Quantity *
        ((parseFloat(multiCBM[i].Length) / 100) *
          (parseFloat(multiCBM[i].Width) / 100) *
          (parseFloat(multiCBM[i].height) / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: parseFloat(decVolume)
      };
    }

    this.setState({ multiCBM });
  }

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
              name="Length"
              value={this.state.isCopy == true ? el.Length : el.Length || ""}
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
                name="height"
                value={this.state.isCopy == true ? el.height : el.height || ""}
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
                name="height"
                value={this.state.isCopy == true ? el.height : el.height || ""}
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
              name="GrossWeight"
              value={
                this.state.isCopy == true
                  ? el.GrossWeight
                  : el.GrossWeight || ""
              }
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

  toggleRow(rateID, rowData) {
    debugger;
    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[rateID] = !this.state.cSelectedRow[rateID];
    this.setState({
      cSelectedRow: rateID ? newSelected : false
    });
    var selectedRow = [];
    var BuyRate = 0;
    var rateSubDetails = [];
    var profitLossAmt = 0;
    var profitLossAmt1 = this.state.profitLossAmt;
    var profitLossPer = 0;
    var profitLossPer1 = this.state.profitLossPer;

    var aTotalAmount = 0;
    var nTotalAmount = 0;

    if (this.state.isCopy === true) {
      rateSubDetails = this.state.rateSubDetails.filter(
        d => d.saleQuoteLineID === rowData._original.saleQuoteLineID
      );
    } else {
      rateSubDetails = this.state.rateSubDetails.filter(
        d => d.RateLineID === rowData._original.RateLineId
      );
    }

    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData._original);

      if (this.state.isCopy === true) {
        for (let j = 0; j < rateSubDetails.length; j++) {
          var total = parseFloat(rateSubDetails[j].Total.split(" ")[0]);
          profitLossAmt += total - rateSubDetails[j].BuyRate;
          BuyRate += rateSubDetails[j].BuyRate;
        }
        profitLossPer = (profitLossAmt * 100) / BuyRate;
        var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

        var finalprofitLossPer = profitLossPer + profitLossPer1;
        this.setState({
          BuyRate,
          selectedDataRow: selectedRow,
          profitLossAmt: finalprofitLossAmt,
          profitLossPer: finalprofitLossPer
        });
      } else {
        for (let j = 0; j < rateSubDetails.length; j++) {
          profitLossAmt +=
            rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
          BuyRate += rateSubDetails[j].BuyRate;
        }

        var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

        // var finalprofitLossPer = profitLossPer + profitLossPer1;
        if (selectedRow.length > 0) {
          aTotalAmount = selectedRow.reduce(function(prev, cur) {
            debugger;
            return prev + cur.TotalAmount;
          }, 0);
        } else {
          aTotalAmount = 0;
        }
        // profitLossPer = (profitLossAmt * 100) / BuyRate;
        var finalprofitLossPer = (profitLossAmt * 100) / aTotalAmount;
        this.setState({
          BuyRate,
          selectedDataRow: selectedRow,
          profitLossAmt: finalprofitLossAmt,
          profitLossPer: finalprofitLossPer
        });
      }
    } else {
      if (this.state.isCopy === true) {
        if (newSelected[rateID] === true) {
          for (var i = 0; i < this.state.selectedDataRow.length; i++) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.push(rowData._original);

            for (let j = 0; j < rateSubDetails.length; j++) {
              var total = parseFloat(rateSubDetails[j].Total.split(" ")[0]);
              profitLossAmt += total - rateSubDetails[j].BuyRate;
              BuyRate += rateSubDetails[j].BuyRate;
            }
            profitLossPer += (profitLossAmt * 100) / BuyRate;
            var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

            if (selectedRow.length > 0) {
              aTotalAmount = selectedRow.reduce(function(prev, cur) {
                debugger;
                return (
                  prev + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
                );
              }, 0);
              finalprofitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
            }
            this.setState({
              BuyRate,
              profitLossAmt: finalprofitLossAmt,
              profitLossPer: finalprofitLossPer
            });
            break;
            // }
          }
        } else {
          for (var i = 0; i < this.state.selectedDataRow.length; i++) {
            selectedRow = this.state.selectedDataRow;
            if (this.state.isCopy === true) {
              if (
                this.state.selectedDataRow[i].saleQuoteLineID ===
                rowData._original.saleQuoteLineID
              ) {
                selectedRow.splice(i, 1);

                for (let j = 0; j < rateSubDetails.length; j++) {
                  var total = parseFloat(rateSubDetails[j].Total.split(" ")[0]);
                  profitLossAmt += total - rateSubDetails[j].BuyRate;
                  BuyRate += rateSubDetails[j].BuyRate;
                }
                profitLossPer += (profitLossAmt * 100) / BuyRate;
                var finalprofitLossAmt = profitLossAmt1 - profitLossAmt;

                var finalprofitLossPer = profitLossPer1 - profitLossPer;

                if (selectedRow.length > 0) {
                  aTotalAmount = selectedRow.reduce(function(prev, cur) {
                    debugger;
                    return (
                      prev + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
                    );
                  }, 0);
                  finalprofitLossPer =
                    (finalprofitLossAmt * 100) / aTotalAmount;
                  this.setState({
                    BuyRate,
                    profitLossAmt: finalprofitLossAmt,
                    profitLossPer: finalprofitLossPer
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0
                  });
                }
              }
            } else {
              if (
                this.state.selectedDataRow[i].RateLineId ===
                rowData._original.RateLineId
              ) {
                selectedRow = this.state.selectedDataRow;
                selectedRow.splice(i, 1);
                for (let j = 0; j < rateSubDetails.length; j++) {
                  var total = parseFloat(rateSubDetails[j].Total.split(" ")[0]);

                  profitLossAmt += total - rateSubDetails[j].BuyRate;
                  BuyRate += rateSubDetails[j].BuyRate;
                }
                profitLossPer = (profitLossAmt * 100) / BuyRate;
                var finalprofitLossAmt = profitLossAmt1 - profitLossAmt;

                var finalprofitLossPer = profitLossPer1 - profitLossPer;
                this.setState({
                  BuyRate,
                  profitLossAmt: finalprofitLossAmt,
                  profitLossPer: finalprofitLossPer
                });
                break;
              }
            }
          }
        }
      } else {
        if (newSelected[rateID] === true) {
          for (var i = 0; i < this.state.selectedDataRow.length; i++) {
            if (
              this.state.selectedDataRow[i].RateLineId ===
              rowData._original.RateLineId
            ) {
              selectedRow.splice(i, 1);

              break;
            } else {
              for (let j = 0; j < rateSubDetails.length; j++) {
                profitLossAmt +=
                  rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
                BuyRate += rateSubDetails[j].BuyRate;
              }
              //asd

              var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

              selectedRow = this.state.selectedDataRow;
              selectedRow.push(rowData._original);
              if (selectedRow.length > 0) {
                aTotalAmount = selectedRow.reduce(function(prev, cur) {
                  debugger;
                  return prev + cur.TotalAmount;
                }, 0);
              } else {
                aTotalAmount = 0;
              }

              // var finalprofitLossPer = profitLossPer + profitLossPer1;
              finalprofitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;

              this.setState({
                BuyRate,
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer
              });
              break;
            }
          }
        } else {
          for (var i = 0; i < this.state.selectedDataRow.length; i++) {
            if (this.state.isCopy === true) {
              if (
                this.state.selectedDataRow[i].saleQuoteLineID ===
                rowData._original.saleQuoteLineID
              ) {
                selectedRow = this.state.selectedDataRow;
                selectedRow.splice(i, 1);
                for (let j = 0; j < rateSubDetails.length; j++) {
                  var total = parseFloat(rateSubDetails[j].Total.split(" ")[0]);
                  profitLossAmt += total - rateSubDetails[j].BuyRate;
                  BuyRate += rateSubDetails[j].BuyRate;
                }
                profitLossPer = (profitLossAmt * 100) / BuyRate;
                var finalprofitLossAmt = profitLossAmt - profitLossAmt1;

                var finalprofitLossPer = profitLossPer - profitLossPer1;
                if (selectedRow.length > 0) {
                  this.setState({
                    BuyRate,
                    profitLossAmt: finalprofitLossAmt,
                    profitLossPer: finalprofitLossPer
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0
                  });
                }

                break;
              }
            } else {
              if (
                this.state.selectedDataRow[i].RateLineId ===
                rowData._original.RateLineId
              ) {
                selectedRow = this.state.selectedDataRow;
                selectedRow.splice(i, 1);
                for (let j = 0; j < rateSubDetails.length; j++) {
                  profitLossAmt +=
                    rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
                }

                aTotalAmount = selectedRow.reduce(function(prev, cur) {
                  debugger;
                  return prev + cur.TotalAmount;
                }, 0);

                var finalprofitLossAmt = profitLossAmt1 - profitLossAmt;

                if (selectedRow.length > 0) {
                  profitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
                  var finalprofitLossPer = profitLossPer;
                  this.setState({
                    BuyRate,
                    profitLossAmt: finalprofitLossAmt,
                    profitLossPer: finalprofitLossPer
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0
                  });
                }
                break;
              }
            }
          }
        }
      }
    }
    this.setState({
      selectedDataRow: selectedRow
    });
  }

  handleChangeDiscount(e) {
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
            this.setState({ discountval: jiji });
          }
        } else {
          return false;
        }
      } else {
        this.setState({ discountval: jiji });
      }
    } else {
      this.setState({ discountval: jiji });
    }
  }
  cmbTypeRadioChange(e) {
    var value = e.target.value;

    this.setState({ cmbTypeRadio: value });
  }
  HandleCMBtextChange(e) {
    var Textvalue = e.target.value;

    this.setState({ cbmVal: Textvalue });
  }

  printModalPopUp() {
    debugger;

    var w = document.getElementById("printDiv").offsetWidth;
    var h = document.getElementById("printDiv").offsetHeight;
  }

  dataURLtoFile(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], "generated.pdf", { type: mime });
  }

  onErrorImg(e) {
    return (e.target.src =
      "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png");
  }

  HandleChangeConNew(name) {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerList`,
      data: {
        CustomerName: name,
        CustomerType: "Existing",
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var data = response.data.Table;

      if (data.length === 1) {
        var companyID = data[0].Company_ID;
        var companyId = data[0].Company_ID;
        var CompanyName = data[0].Company_Name;

        var Company_Address = data[0].CompanyAddress;

        var CompanyAddress = data[0].CompanyAddress;
        var ContactName = data[0].ContactName;
        var custNotification = data[0].ContactName;
        self.setState({
          companyID,
          companyId,
          CompanyName,
          Company_Address,
          CompanyAddress,
          ContactName,
          custNotification
        });
      }
    });
  }

  render() {
    var i = 0;
    var equipVal = "";
    console.log(this.state.cbmVal);
    if (this.state.selected.length > 0) {
    } else {
      for (let j = 0; j < this.state.rateDetails.length; j++) {
        if (!equipVal.includes(this.state.rateDetails[j].ContainerType)) {
          equipVal += this.state.rateDetails[j].ContainerType;
        }
      }
    }

    const checkLocalCharges = this.state.arrLocalsCharges.map((item, index) => {
      let amtSign;
      if (item.Currency == "INR") {
        amtSign = " INR";
      } else if (item.Currency == "USD") {
        amtSign = "$";
      } else if (item.Currency == "TL") {
        amtSign = " TL";
      }

      if (
        this.state.modeoftransport === "SEA" ||
        this.state.modeoftransport == "Ocean"
      ) {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"local" + (index + 1)}
                value={item.Amount}
                type="checkbox"
                name={"localCharge"}
                data-ExRate={item.ExRate}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Localcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"local" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>{item.LineName}</span> */}
            {/* <span><img src={"./../assets/img/company_logos/OEAN_LINERS/" + item.LineName + '.png'} /></span> */}
            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/OEAN_LINERS/" +
                  item.LineName.replace(" ", "_") +
                  ".png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      } else if (this.state.modeoftransport === "AIR") {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"local" + (index + 1)}
                value={item.Amount}
                type="checkbox"
                name={"localCharge"}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Localcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"local" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>{item.LineName}</span> */}
            {/* <span><img src={"./../assets/img/company_logos/OEAN_LINERS/" + item.LineName + '.png'} /></span> */}
            <span className="line-img">
              <img
                alt={item.LineName}
                title={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/AIR_LINERS/" +
                  item.LineName.replace(" ", "_") +
                  ".png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"local" + (index + 1)}
                value={item.Amount}
                type="checkbox"
                name={"localCharge"}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Localcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"local" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>{item.LineName}</span> */}
            {/* <span><img src={"./../assets/img/company_logos/OEAN_LINERS/" + item.LineName + '.png'} /></span> */}
            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      }
    });

    const checkSurCharges = this.state.arrSurCharges.map((item, index) => {
      let amtSign;
      if (item.Currency == "INR") {
        amtSign = " INR";
      } else if (item.Currency == "USD") {
        amtSign = "$";
      } else if (item.Currency == "TL") {
        amtSign = " TL";
      }
      if (
        this.state.modeoftransport === "SEA" ||
        this.state.modeoftransport == "Ocean"
      ) {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"Sur" + (index + 1)}
                type="checkbox"
                name={"surcharges"}
                value={item.Amount}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Surcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>
            {item.LineName}
          </span> */}
            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/OEAN_LINERS/" +
                  item.LineName.replace(" ", "_") +
                  ".png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      } else if (this.state.modeoftransport === "AIR") {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"Sur" + (index + 1)}
                type="checkbox"
                name={"surcharges"}
                value={item.Amount}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Surcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>
                    {item.LineName}
                  </span> */}
            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/AIR_LINERS/" +
                  item.LineName.replace(" ", "_") +
                  ".png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <div className="d-flex line-first">
              <input
                id={"Sur" + (index + 1)}
                type="checkbox"
                name={"surcharges"}
                value={item.Amount}
                data-chargeitem={item.ChargeItem}
                data-chargedesc={item.ChargeDesc}
                data-currency={item.Currency}
                data-amountinbasecurrency={item.AmountInBaseCurrency}
                data-chargetype="Surcharge"
                onChange={this.HandleLocalSearchCharges.bind(this, item)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            {/* <span>
                    {item.LineName}
                  </span> */}
            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png"
                }
              />
            </span>
            <span>
              {item.Amount}
              {" " + item.Currency}
            </span>
          </div>
        );
      }
    });
    var self = this;

    var Commoditypresent = false;
    const commodityDatadrp = this.state.commodityData.map((item, i) => {
      if (item.id == self.state.CommodityID) {
        Commoditypresent = true;
        return (
          <option key={i} value={item.id} selected>
            {item.Commodity}
          </option>
        );
      } else {
        if (!Commoditypresent) {
          Commoditypresent = false;
        }

        return (
          <option key={i} value={item.id}>
            {item.Commodity}
          </option>
        );
      }
    });

    if (Commoditypresent) {
      this.state.commoditySelect = self.state.CommodityID;
    }

    var DocumentCharges = [];
    // var containerLoadType = this.props.location.state.containerLoadType
    const { PackageDetailsArr, TruckDetailsArr } = this.state;
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
            {encryption(window.localStorage.getItem("usertype"), "desc") !==
            "Customer" ? (
              <p className="bottom-profit">
                Profit -------{this.state.profitLossAmt.toFixed(2)}$ / Profit
                Margin {this.state.profitLossPer.toFixed(2)}%
              </p>
            ) : null}
            <div className="title-sect mb-4">
              {/* <h2>Rate Query Details</h2> */}
              <h2>
                {this.state.isCopy === true
                  ? "Copy Sales Quote"
                  : "Create Sales Quote"}
              </h2>
              <button
                onClick={this.handleChangePage.bind(this)}
                className="butn mt-0"
              >
                Back
              </button>
            </div>
            {this.state.newloding === true ? (
              <div className="loader-icon"></div>
            ) : (
              <>
                <div className="row cus-w">
                  <div className="col-md-3">
                    <div className="rate-table-left rate-final-left">
                      <div className="locawid">
                        <h3>Locals</h3>
                        <div className="title-sect p-0 pt-2">
                          <input
                            type="search"
                            // value={this.state.filterAll}
                            onChange={this.filterLocAll}
                            placeholder="Search here"
                            className="w-100"
                          />
                        </div>
                        <div className="cont-costs">
                          <div className="remember-forgot d-block m-0">
                            {checkLocalCharges}
                          </div>
                        </div>
                      </div>
                      <div className="locawid">
                        <h3>Surcharges</h3>
                        <div className="title-sect p-0 pt-2">
                          <input
                            type="search"
                            // value={this.state.filterAll}
                            onChange={this.filterSurAll}
                            placeholder="Search here"
                            className="w-100"
                          />
                        </div>
                        <div className="cont-costs">
                          <div className="remember-forgot d-block m-0">
                            {checkSurCharges}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9 ra-font">
                    <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                      <div className="rate-final-contr">
                        <div className="title-border py-3 d-flex align-items-center justify-content-between">
                          <h3>Quotation Price</h3>
                          <div className="d-flex">
                            <div className="align-center mr-3">
                              {this.state.toggleAddProfitBtn && (
                                <button
                                  onClick={this.toggleProfit}
                                  className="butn more-padd m-0"
                                >
                                  Manage Profit
                                </button>
                              )}
                            </div>
                            <div className="text-center">
                              {this.state.toggleIsEdit && (
                                <button
                                  onClick={this.RequestChangeMsgModal}
                                  className="butn more-padd m-0"
                                >
                                  Request Change
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="react-rate-table react-rate-tab">
                          <ReactTable
                            columns={[
                              {
                                columns: [
                                  {
                                    Cell: ({ original, row }) => {
                                      i++;
                                      ////debugger;;;
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
                                      var mode = this.state.ModeOfTransport;
                                      var mode = "";
                                      if (this.state.ModeOfTransport) {
                                        mode = this.state.ModeOfTransport;
                                      }
                                      if (this.state.modeoftransport) {
                                        mode =
                                          this.state.modeoftransport === "SEA"
                                            ? "Ocean"
                                            : this.state.modeoftransport ===
                                              "AIR"
                                            ? "Air"
                                            : "Inlande";
                                      }
                                      var mode = this.state.ModeOfTransport;
                                      if (row._original.lineName) {
                                        olname = row._original.lineName;
                                        lname =
                                          row._original.lineName
                                            .replace(" ", "_")
                                            .replace(" ", "_") + ".png";
                                      }
                                      var mode = "";
                                      if (this.state.ModeOfTransport) {
                                        mode = this.state.ModeOfTransport;
                                      }
                                      if (this.state.modeoftransport) {
                                        if (
                                          this.state.modeoftransport === "SEA"
                                        ) {
                                          mode = "Ocean";
                                        } else if (
                                          this.state.modeoftransport === "AIR"
                                        ) {
                                          mode = "Air";
                                        } else {
                                          mode = this.state.modeoftransport;
                                        }
                                        // mode =
                                        // this.state.modeoftransport === "SEA"
                                        // ? "Ocean"
                                        // : this.state.modeoftransport === "AIR"?"Air":"Inlande";
                                      }

                                      if (mode === "Ocean" && lname !== "") {
                                        ////debugger;;;
                                        var rateId = 0;
                                        if (row._original.RateLineID) {
                                          rateId = row._original.RateLineID;
                                        } else if (row._original.RateLineId) {
                                          rateId = row._original.RateLineId;
                                        } else {
                                          rateId =
                                            row._original.saleQuoteLineID;
                                        }
                                        var url = "";
                                        if (
                                          this.state.containerLoadType === "FCL"
                                        ) {
                                          url =
                                            "https://vizio.atafreight.com/MyWayFiles/OEAN_LINERS/" +
                                            lname;
                                        } else {
                                          url =
                                            "https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png";
                                        }

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
                                                      rateId
                                                    ] === true
                                                  }
                                                  onChange={e =>
                                                    this.toggleRow(rateId, row)
                                                  }
                                                />
                                                <label
                                                  htmlFor={"maersk-logo" + i}
                                                ></label>
                                              </div>
                                            </div>
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
                                        var rateId = 0;
                                        if (row._original.RateLineID) {
                                          rateId = row._original.RateLineID;
                                        } else if (row._original.RateLineId) {
                                          rateId = row._original.RateLineId;
                                        } else {
                                          rateId =
                                            row._original.saleQuoteLineID;
                                        }
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
                                                      rateId
                                                    ] === true
                                                  }
                                                  onChange={e =>
                                                    this.toggleRow(rateId, row)
                                                  }
                                                />
                                                <label
                                                  htmlFor={"maersk-logo" + i}
                                                ></label>
                                              </div>
                                            </div>
                                            <div className="rate-tab-img">
                                              <img
                                                title={olname}
                                                alt={olname}
                                                src={
                                                  "https://vizio.atafreight.com/MyWayFiles/AIR_LINERS/" +
                                                  lname
                                                }
                                                onError={this.onErrorImg.bind(
                                                  this
                                                )}
                                              />
                                            </div>
                                          </React.Fragment>
                                        );
                                      } else {
                                        var rateId = 0;
                                        if (row._original.RateLineID) {
                                          rateId = row._original.RateLineID;
                                        } else if (row._original.RateLineId) {
                                          rateId = row._original.RateLineId;
                                        } else {
                                          rateId =
                                            row._original.saleQuoteLineID;
                                        }
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
                                                      rateId
                                                    ] === true
                                                  }
                                                  onChange={e =>
                                                    this.toggleRow(rateId, row)
                                                  }
                                                />
                                                <label
                                                  htmlFor={"maersk-logo" + i}
                                                ></label>
                                              </div>
                                            </div>
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
                                    accessor: "lineName"
                                    // minWidth: 200
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">POL</p>
                                          {this.state.isCopy === true ? (
                                            this.state.containerLoadType ===
                                            "INLAND" ? (
                                              <p
                                                title={row.original.OriginName}
                                                className="details-para max2"
                                              >
                                                {row.original.OriginName}
                                              </p>
                                            ) : (
                                              <p
                                                title={
                                                  row.original.POLName ==
                                                  undefined
                                                    ? row.original.POL
                                                    : row.original.POLName
                                                }
                                                className="details-para max2"
                                              >
                                                {row.original.POLName ==
                                                undefined
                                                  ? row.original.POL
                                                  : row.original.POLName}
                                              </p>
                                            )
                                          ) : (
                                            <p
                                              title={
                                                row.original.POLName ==
                                                undefined
                                                  ? row.original.POL
                                                  : row.original.POLName
                                              }
                                              className="details-para max2"
                                            >
                                              {row.original.POLName == undefined
                                                ? row.original.POL
                                                : row.original.POLName}
                                            </p>
                                          )}
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
                                          {this.state.isCopy === true ? (
                                            this.state.containerLoadType ===
                                            "INLAND" ? (
                                              <p
                                                title={
                                                  row.original.DestinationName
                                                }
                                                className="details-para max2"
                                              >
                                                {row.original.DestinationName}
                                              </p>
                                            ) : (
                                              <p
                                                title={
                                                  row.original.PODName ==
                                                  undefined
                                                    ? row.original.POD
                                                    : row.original.PODName
                                                }
                                                className="details-para max2"
                                              >
                                                {row.original.PODName ==
                                                undefined
                                                  ? row.original.POD
                                                  : row.original.PODName}
                                              </p>
                                            )
                                          ) : (
                                            <p
                                              title={
                                                row.original.PODName ==
                                                undefined
                                                  ? row.original.POD
                                                  : row.original.PODName
                                              }
                                              className="details-para max2"
                                            >
                                              {row.original.PODName == undefined
                                                ? row.original.POD
                                                : row.original.PODName}
                                            </p>
                                          )}
                                        </>
                                      );
                                    },
                                    accessor: "PODName",
                                    filterable: true,
                                    minWidth: 90
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            Transit port
                                          </p>
                                          <p className="details-para">
                                            {row.original.TransshipmentPort}
                                          </p>
                                        </>
                                      );
                                    },
                                    accessor: "TransshipmentPort",
                                    filterable: true,
                                    minWidth: 100
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            Free Time
                                          </p>
                                          <p className="details-para">
                                            {row.original.freeTime}
                                          </p>
                                        </>
                                      );
                                    },
                                    accessor: "freeTime",
                                    filterable: true,
                                    minWidth: 90
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            Container
                                          </p>
                                          <p className="details-para">
                                            {row.original.ContainerType +
                                              " (" +
                                              row.original.ContainerQuantity +
                                              ")"}
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
                                      return (
                                        <>
                                          <p className="details-title">
                                            Expiry
                                          </p>
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
                                    filterable: true,
                                    minWidth: 90
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            TT (Days)
                                          </p>
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
                                      if (this.state.isCopy === true) {
                                        var total =
                                          parseFloat(
                                            row.original.Total.split(" ")[0]
                                          ) + row.original.Profit;

                                        return (
                                          <>
                                            <p className="details-title">
                                              Price
                                            </p>
                                            <p className="details-para">
                                              {total +
                                                " " +
                                                row.original.Total.split(
                                                  " "
                                                )[1]}
                                            </p>
                                          </>
                                        );
                                      } else {
                                        return (
                                          <>
                                            <p className="details-title">
                                              Price
                                            </p>
                                            <p className="details-para">
                                              {row.original.TotalAmount !==
                                              undefined
                                                ? row.original.TotalAmount !==
                                                    "" &&
                                                  row.original.TotalAmount !==
                                                    null
                                                  ? row.original.TotalAmount +
                                                    0 +
                                                    row.original.BaseCurrency
                                                  : 0
                                                : row.original.Total ===
                                                  undefined
                                                ? 0
                                                : row.original.Total}
                                            </p>
                                          </>
                                        );
                                      }
                                    },
                                    accessor: "Total",
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
                                  ////debugger;;;

                                  const result = matchSorter(
                                    rows,
                                    filter.value,
                                    {
                                      keys: ["commodities", "TransitTime"],
                                      threshold:
                                        matchSorter.rankings.WORD_STARTS_WITH
                                    }
                                  );

                                  return result;
                                }
                              }
                            ]}
                            // onFilteredChange={this.onFilteredChange.bind(this)}
                            // filtered={this.state.filtered}
                            // defaultFilterMethod={(filter, row) =>
                            //   String(row[filter.rateID]) === filter.value
                            // }
                            filterable
                            // expanded={this.state.expanded}
                            // onExpandedChange={(expand, event) => {
                            //   this.setState({
                            //     expanded: {
                            //       [event]: {}
                            //     }
                            //   });
                            // }}

                            expanded={this.state.expanded}
                            onExpandedChange={(newExpanded, index, event) => {
                              if (newExpanded[index[0]] === false) {
                                newExpanded = {};
                              } else {
                                Object.keys(newExpanded).map(k => {
                                  newExpanded[k] =
                                    parseInt(k) === index[0] ? {} : false;
                                });
                              }
                              this.setState({
                                ...this.state,
                                expanded: newExpanded
                              });
                            }}
                            data={this.state.rateDetails}
                            defaultPageSize={1000}
                            className="-striped -highlight no-mid-align"
                            minRows={1}
                            showPagination={false}
                            SubComponent={row => {
                              ////debugger;;;
                              return (
                                <div style={{ padding: "20px 0" }}>
                                  <ReactTable
                                    minRows={1}
                                    data={
                                      this.state.isCopy === true
                                        ? this.state.rateSubDetails.filter(
                                            this.state.containerLoadType !==
                                              "INLAND"
                                              ? this.state.containerLoadType ===
                                                "LCL"
                                                ? d =>
                                                    d.SaleQuoteIDLineID ===
                                                    row.original.saleQuoteLineID
                                                : d =>
                                                    d.saleQuoteLineID ===
                                                    row.original.saleQuoteLineID
                                              : // ||
                                                // d.SaleQuoteIDLineID

                                                d =>
                                                  d.SaleQuoteIDLineID ===
                                                  row.original.SaleQuoteIDLineID
                                          )
                                        : row.original.SaleQuoteIDLineID ==
                                          undefined
                                        ? row.original.RateLineId == undefined
                                          ? this.state.rateSubDetails.filter(
                                              d =>
                                                d.RateLineID ===
                                                row.original.RateLineID
                                            )
                                          : this.state.rateSubDetails.filter(
                                              d =>
                                                d.RateLineID ===
                                                row.original.RateLineId
                                            )
                                        : this.state.rateSubDetails.filter(
                                            d =>
                                              d.SaleQuoteIDLineID ===
                                              row.original.SaleQuoteIDLineID
                                          )
                                    }
                                    columns={[
                                      {
                                        columns: [
                                          {
                                            Header: "C. Description",
                                            accessor: "ChargeDesc",
                                            Cell: row => {
                                              return (
                                                <>
                                                  {row.original.ChargeDesc !=
                                                  undefined
                                                    ? row.original.ChargeDesc
                                                    : row.original.Type}
                                                </>
                                              );
                                            }
                                          },
                                          {
                                            Header: "C. Name",
                                            accessor: "ChargeCode"
                                          },
                                          {
                                            Header: "Unit Price",
                                            accessor: "Rate",
                                            Cell: props =>
                                              // <React.Fragment>
                                              //   {row.original.Rate != undefined
                                              //     ? props.original.Rate
                                              //     : props.original.Amount == null
                                              //     ? "0"
                                              //     : props.original.Amount}
                                              //   &nbsp;
                                              //   {row.original.Currency != undefined
                                              //     ? props.original.Currency
                                              //     : ""}
                                              // </React.Fragment>
                                              this.state.isCopy === true ? (
                                                <React.Fragment>
                                                  {props.original.Amount}
                                                </React.Fragment>
                                              ) : (
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
                                                  {row.original.TotalAmount !=
                                                  undefined
                                                    ? row.original
                                                        .TotalAmount !== " " &&
                                                      row.original
                                                        .TotalAmount !== null
                                                      ? row.original
                                                          .TotalAmount +
                                                        " " +
                                                        row.original
                                                          .BaseCurrency
                                                      : ""
                                                    : row.original.Total}
                                                </>
                                              );
                                            },
                                            Header: "Final Payment",
                                            accessor: "Total"
                                          }
                                        ]
                                      }
                                    ]}
                                    showPagination={false}
                                    defaultPageSize={1000}
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
                        </div>

                        <UncontrolledCollapse toggler="#toggler">
                          <div className="rate-final-contr p-0">
                            <div
                              className="d-flex justify-content-between align-items-center title-border py-3"
                              style={{ marginBottom: "15px" }}
                            >
                              <h3>Rate Query</h3>
                              {/* <a href="rate-table" className="rate-edit-icon">
                            <img src={Edit} alt="edit icon" />
                          </a> */}
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Shipment Type</p>
                                <p className="details-para">
                                  {this.state.shipmentType}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">
                                  Mode of Transport
                                </p>
                                <p className="details-para">
                                  {this.state.modeoftransport}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Container Load</p>
                                <p className="details-para">
                                  {this.state.containerLoadType}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Equipment Types</p>
                                {this.state.selected.length > 0 ? (
                                  <>
                                    {this.state.selected.map((item, i) => (
                                      <p className="details-para" key={i}>
                                        {item.StandardContainerCode}
                                      </p>
                                    ))}
                                  </>
                                ) : (
                                  <p className="details-para">{equipVal}</p>
                                )}
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">
                                  Special Equipment
                                </p>
                                {this.state.flattack_openTop.map((item, i) => (
                                  <p className="details-para" key={i}>
                                    {item.SpecialContainerCode}
                                  </p>
                                ))}
                                {this.state.spacEqmtType.map((item, i) => (
                                  <p className="details-para" key={i}>
                                    {item.TypeName}
                                  </p>
                                ))}
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">HazMat</p>
                                <p className="details-para">
                                  {this.state.HazMat === true ? "Yes " : "No"}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Non Stackable</p>
                                <p className="details-para">
                                  {this.state.NonStackable === true
                                    ? "Yes"
                                    : "No"}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Inco Terms</p>
                                <p className="details-para">
                                  {this.state.incoTerm}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                <p className="details-title">Type of Move</p>
                                <p className="details-para">
                                  {this.state.typeofMove === 1
                                    ? "Port 2 Port"
                                    : this.state.typeofMove === 2
                                    ? "Door 2 Port"
                                    : this.state.typeofMove === 3
                                    ? "Port 2 Door"
                                    : this.state.typeofMove === 4
                                    ? "Door 2 Door"
                                    : ""}
                                </p>
                              </div>
                              {this.state.isediting && (
                                <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                  <p className="details-title">POL</p>
                                  <p className="details-para">
                                    {this.state.polfullAddData.NameWoDiacritics}
                                  </p>
                                </div>
                              )}
                              {this.state.isediting && (
                                <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                  <p className="details-title">POD</p>
                                  <p className="details-para">
                                    {this.state.podfullAddData.NameWoDiacritics}
                                  </p>
                                </div>
                              )}
                              {this.state.isediting && (
                                <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                  <p className="details-title">PU Address</p>
                                  <p className="details-para">
                                    {/* Lotus Park, Goregaon (E), Mumbai : 400099 */}
                                    {
                                      this.state.polfullAddData
                                        .OceanPortLongName
                                    }
                                  </p>
                                </div>
                              )}
                              {this.state.isediting && (
                                <div className="col-12 col-sm-6 col-md-4 col-xl-3 r-border">
                                  <p className="details-title">
                                    Delivery Address
                                  </p>
                                  <p className="details-para">
                                    {
                                      this.state.podfullAddData
                                        .OceanPortLongName
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                            {/* <div className="row">
                          <div className="col-md-6 d-flex align-items-center">
                            {this.state.toggleAddProfitBtn && (
                              <button
                                onClick={this.toggleProfit}
                                className="butn more-padd m-0"
                              >
                                Add Profit
                              </button>
                            )}
                          </div>
                        </div> */}
                          </div>
                        </UncontrolledCollapse>

                        <div className="text-right">
                          <button
                            onClick={this.rateQuery.bind(this)}
                            className={
                              this.state.rateQuery
                                ? "butn m-0"
                                : "butn cancel-butn"
                            }
                            id="toggler"
                          >
                            {this.state.rateQuery ? "View More" : "View Less"}
                          </button>
                        </div>
                      </div>

                      <div className="rate-final-contr">
                        <div
                          className="title-border py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Customer Details</h3>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-12 col-sm-4 col-md-3 col-xl-3 login-fields divblock r-border login-fiel">
                              <p className="details-title">Account/Customer</p>
                              {this.state.toggleAddProfitBtn && (
                                <p className="details-para">
                                  {this.state.CompanyName}
                                </p>
                              )}
                              {!this.state.toggleAddProfitBtn && (
                                <p className="details-para">
                                  {encryption(
                                    window.localStorage.getItem("companyname"),
                                    "desc"
                                  )}
                                </p>
                              )}
                              {encryption(
                                window.localStorage.getItem("usertype"),
                                "desc"
                              ) != "Customer" ? (
                                this.state.CompanyName == "" &&
                                this.state.isCopy ? (
                                  <div className="position-relative mt-2">
                                    <Autocomplete
                                      id="searchtxt"
                                      className="title-sect p-0 pt-2"
                                      getItemValue={item => item.Company_Name}
                                      items={this.state.customerData}
                                      renderItem={(item, isHighlighted) => (
                                        <div
                                          style={{
                                            background: isHighlighted
                                              ? "lightgray"
                                              : "white",
                                            padding: "5px"
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
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.handleSelectCon.bind(
                                        this,
                                        "Company_Name"
                                      )}
                                      inputProps={{
                                        placeholder: "Search Account/Consignee"
                                      }}
                                    />
                                  </div>
                                ) : // ) : null
                                this.state.CompanyName == "" ? (
                                  <div className="position-relative mt-2">
                                    <Autocomplete
                                      id="searchtxt"
                                      className="title-sect p-0 pt-2"
                                      getItemValue={item => item.Company_Name}
                                      items={this.state.customerData}
                                      renderItem={(item, isHighlighted) => (
                                        <div
                                          style={{
                                            background: isHighlighted
                                              ? "lightgray"
                                              : "white",
                                            padding: "5px"
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
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.handleSelectCon.bind(
                                        this,
                                        "Company_Name"
                                      )}
                                      inputProps={{
                                        placeholder: "Search Account/Consignee"
                                      }}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )
                              ) : null}
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-6 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {/* Lotus Park, Goregaon (E), Mumbai : 400099 */}
                                {/* {this.state.CustAddress} */}
                                {encryption(
                                  window.localStorage.getItem("usertype"),
                                  "desc"
                                ) != "Customer"
                                  ? this.state.CompanyAddress ||
                                    this.state.Company_Address
                                  : encryption(
                                      window.localStorage.getItem(
                                        "companyaddress"
                                      ),
                                      "desc"
                                    )}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-xl-3">
                              <p className="details-title">
                                Notification Person
                              </p>
                              <p className="details-para">
                                {encryption(
                                  window.localStorage.getItem("usertype"),
                                  "desc"
                                ) != "Customer"
                                  ? this.state.ContactName ||
                                    this.state.custNotification
                                  : encryption(
                                      window.localStorage.getItem(
                                        "contactname"
                                      ),
                                      "desc"
                                    )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {this.state.CompanyName == "" ? (
                          <div className="text-right">
                            {this.state.toggleAddProfitBtn && (
                              <button
                                onClick={() => {
                                  // this.toggleNewConsignee();
                                  this.newOpen();
                                }}
                                //onClick={this.toggleNewConsignee}
                                className="butn more-padd"
                              >
                                Create Customer
                              </button>
                            )}
                          </div>
                        ) : null}

                        <div
                          className="title-border py-3 d-flex align-items-center justify-content-between"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Cargo Details</h3>
                          <div className="align-center">
                            <button
                              onClick={this.toggleEdit}
                              className="butn more-padd m-0"
                            >
                              Cargo Details
                            </button>
                          </div>
                          {this.state.containerLoadType === "AIR" ||
                          this.state.containerLoadType === "LCL" ||
                          this.state.containerLoadType === "LTL" ? (
                            <p>CMB:{this.state.cbmVal}</p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="rate-final-contr">
                        <div className="ag-fresh redirect-row">
                          {TruckDetailsArr.length !== 0 ? "" : null}

                          {PackageDetailsArr.length !== 0 ? (
                            <ReactTable
                              data={PackageDetailsArr}
                              filterable
                              minRows={1}
                              showPagination={false}
                              columns={[
                                {
                                  Header: "Pack.Type",
                                  accessor: "ContainerType",
                                  minWidth: 110
                                },
                                {
                                  Header: "Quantity",
                                  accessor: "Quantity",
                                  show:
                                    this.state.containerLoadType.toUpperCase() ==
                                    "FCL"
                                      ? false
                                      : true
                                },
                                {
                                  Header: "Lenght",
                                  accessor: "Lenght"
                                },
                                {
                                  Header: "Width",
                                  accessor: "Width"
                                },
                                {
                                  Header: "Height",
                                  accessor: "Height"
                                },
                                {
                                  Header: "Gross Weight",
                                  accessor: "Weight",
                                  minWidth: 140
                                  //editable: this.state.containerLoadType == "Air" ? true : false
                                },
                                // {
                                //   Header: "Temp.",
                                //   accessor: "Temperature"
                                // },
                                {
                                  Header:
                                    this.state.containerLoadType.toUpperCase() ==
                                    "LCL"
                                      ? "CBM"
                                      : "Chargable Weight",
                                  accessor: "VolumeWeight",
                                  show:
                                    this.state.containerLoadType.toUpperCase() ==
                                    "FCL"
                                      ? false
                                      : true
                                }
                              ]}
                              className="-striped -highlight"
                              defaultPageSize={2000}
                              //getTrProps={this.HandleRowClickEvt}
                              //minRows={1}
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="">
                        <div className="col-md-6 login-fields">
                          <p className="details-title">Commodity</p>
                          <select
                            disabled={
                              this.state.fCommodityID !== 49 ? true : false
                            }
                            value={this.state.CommodityID}
                            onChange={this.commoditySelect.bind(this)}
                          >
                            {/* <option value="select">Select</option> */}
                            {this.state.commodityData.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.Commodity}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <select onChange={this.cargoSelect.bind(this)}>
                          <option value="select">Select</option>
                          <option value="new">New</option>
                        </select>
                      </div> */}
                      </div>

                      <div className="text-right">
                        {/* <a href={Dummy} target="_blank" className="butn mr-3">
                        Preview
                      </a> */}
                        <button
                          onClick={this.togglePreview}
                          className="butn more-padd mr-3"
                        >
                          Preview
                        </button>
                        {/* <a
                        href="quote-table"
                        className={
                          this.state.commoditySelect == "select" ||
                          this.state.cargoSelect == "select"
                            ? "butn cancel-butn no-butn"
                            : "butn"
                        }
                      >
                        Send
                      </a> */}
                        <button
                          // onClick={this.SendQuote}
                          disabled={this.state.loding === true ? true : false}
                          onClick={
                            this.state.isCopy === true
                              ? this.SendRequestCopy
                              : this.SendRequest
                          }
                          className={
                            this.state.commoditySelect == "select" // ||
                              ? // this.state.cargoSelect == "select"
                                "butn cancel-butn no-butn"
                              : "butn"
                          }
                        >
                          {this.state.loding == true ? (
                            <>
                              <i
                                style={{ marginRight: 15 }}
                                className="fa fa-refresh fa-spin"
                              ></i>
                              {"Please Wait ..."}
                            </>
                          ) : (
                            <>
                              {encryption(
                                window.localStorage.getItem("usertype"),
                                "desc"
                              ) != "Customer"
                                ? "Send"
                                : "Confirm And Approve"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Modal
            className="amnt-popup"
            isOpen={this.state.modalProfit}
            toggle={this.toggleProfit}
            centered={true}
          >
            <ModalBody>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.toggleProfit}
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
                <div className="txt-cntr">
                  <div className="d-flex align-items-center">
                    <p className="details-title mr-3">
                      Amount ({this.state.currencyCode})
                    </p>
                    <div class="spe-equ d-block m-0 flex-grow-1">
                      <input
                        type="text"
                        placeholder={
                          this.state.ProfitAmount == 0
                            ? "Enter Amount in " + this.state.currencyCode
                            : this.state.ProfitAmount
                        }
                        class="w-100"
                        value={this.state.ProfitAmount}
                        onChange={this.hanleProfitAmountChange.bind(this)}
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  {/* {!this.state.toggleProfitRemoveBtn && ( */}
                  {/* <Button
                    className="butn"
                    onClick={this.hanleProfitAmountSubmit.bind(this)}
                  >
                     
                    Add
                  </Button> */}

                  {this.state.showUpdate == true ? (
                    <Button
                      className="butn"
                      onClick={this.hanleProfitAmountUpdateSubmit.bind(this)}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      className="butn"
                      onClick={this.hanleProfitAmountSubmit.bind(this)}
                    >
                      Add
                    </Button>
                  )}
                  {this.state.showUpdate == true ? (
                    <Button
                      className="butn"
                      onClick={this.hanleProfitAmountRemove.bind(this)}
                    >
                      Remove
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </ModalBody>
          </Modal>

          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalRequestMsg}
            toggle={this.RequestChangeMsgModal}
            centered={true}
          >
            <ModalBody>
              <p>
                This will discard the Sales Quote and will create a new Spot
                Rate Request.
              </p>
              <Button className="butn" onClick={this.toggleRequest}>
                Yes
              </Button>
              <Button
                className="butn cancel-butn"
                onClick={this.RequestChangeMsgModal}
              >
                No
              </Button>
            </ModalBody>
          </Modal>
          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.toggleRequest}
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
                <h3 className="mb-4">Request Changes</h3>
                {this.state.toggleAddProfitBtn && (
                  <div className="rename-cntr login-fields">
                    <label>Discount</label>
                    <input
                      type="text"
                      id="txtRequestDiscount"
                      placeholder="Enter Discount"
                      onChange={this.handleChangeDiscount.bind(this)}
                      value={this.state.discountval}
                    />
                  </div>
                )}
                {this.state.toggleAddProfitBtn && (
                  <div className="rename-cntr login-fields">
                    <label>Free Time</label>
                    <input
                      type="text"
                      id="txtRequestFreeTime"
                      placeholder="Enter Time"
                      maxLength="2"
                    />
                  </div>
                )}
                <div className="rename-cntr login-fields mb-0">
                  <label>Comments</label>
                  <textarea
                    className="txt-add"
                    placeholder="Enter Comments"
                    id="txtRequestComments"
                  ></textarea>
                </div>
                <div className="text-center">
                  <Button
                    className="butn"
                    disabled={this.state.reloding === true ? true : false}
                    onClick={this.SendRequestChange}
                  >
                    {this.state.reloding == true ? (
                      <>
                        <i
                          style={{ marginRight: 15 }}
                          className="fa fa-refresh fa-spin"
                        ></i>
                        {"Please Wait ..."}
                      </>
                    ) : (
                      "Request"
                    )}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>

          <Modal
            className="popupbox"
            isOpen={this.state.modalPreview}
            toggle={this.togglePreview}
          >
            <ModalBody>
              {/* <div className="modal popupbox" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-body"> */}
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.togglePreview}
              >
                <span>&times;</span>
              </button>
              {/* <button onClick={this.printModalPopUp.bind(this)}>Print</button> */}
              <div id="printDiv">
                <div className="row" style={{ margin: 0 }}>
                  <div className="logohheader">
                    <div
                      className="row align-items-center"
                      style={{ margin: 0 }}
                    >
                      <div className="col-12 col-md-6">
                        <img src={ATA} alt="ATAFreight Console" />
                      </div>
                      <div className="col-12 col-md-6 preview-date-num">
                        <p>
                          Date :{" "}
                          <span>
                            <Moment format="DD-MMM-YYYY">
                              {this.state.todayDate.toString()}
                            </Moment>
                          </span>
                        </p>
                        <p>Sales Quote No. :</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <div className="firstbox">
                      {/* <h3>
                      From,{" "}
                      <span>
                        {encryption(
                          window.localStorage.getItem("companyname"),
                          "desc"
                        )}
                      </span>
                    </h3> */}
                      <label>
                        Sales Person :{" "}
                        <span>
                          {encryption(
                            window.localStorage.getItem("username"),
                            "desc"
                          )}
                        </span>
                      </label>
                      <label>
                        E-Mail :{" "}
                        <span>
                          {encryption(
                            window.localStorage.getItem("emailid"),
                            "desc"
                          )}
                        </span>
                      </label>
                      <label>
                        Phone : <span></span>
                      </label>
                      <label>
                        Fax : <span></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="firstbox">
                      {/* <h3>
                      To, <span>{this.state.CompanyName}</span>
                    </h3> */}
                      <label>
                        ATNN : <span>{this.state.ContactName}</span>
                      </label>
                      <label>
                        E-Mail : <span>{this.state.ContactEmail}</span>
                      </label>
                      <label>
                        Phone : <span></span>
                      </label>
                      <label>
                        Fax : <span></span>
                      </label>
                      <label>
                        &nbsp;<span></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="thirdbox">
                      {this.state.containerLoadType === "LCL" ||
                      this.state.containerLoadType === "AIR" ||
                      this.state.containerLoadType === "LTL" ||
                      this.state.containerLoadType === "FCL" ? (
                        <>
                          <h3>Dimensions</h3>
                          <div className="table-responsive">
                            <table className="table table-responsive">
                              <thead>
                                <tr>
                                  <th>Package Type</th>
                                  <th>Quantity</th>
                                  <th>Length</th>
                                  <th>Width</th>
                                  <th>Height</th>
                                  <th>Gross Weight</th>
                                  {this.state.containerLoadType === "FCL" ||
                                  this.state.containerLoadType === "FTL" ? (
                                    ""
                                  ) : (
                                    <th>
                                      {this.state.containerLoadType === "AIR" ||
                                      this.state.containerLoadType === "LTL"
                                        ? "Volume Weight"
                                        : "CBM"}
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.CargoDetailsArr.map(item1 => (
                                  <tr>
                                    <td>{item1.PackageType}</td>
                                    <td>{item1.Quantity}</td>
                                    <td>{item1.Lenght}</td>
                                    <td>{item1.Width}</td>
                                    <td>{item1.Height}</td>
                                    <td>{item1.Weight}</td>
                                    {this.state.containerLoadType === "FCL" ||
                                    this.state.containerLoadType === "FTL" ? (
                                      ""
                                    ) : (
                                      <td>
                                        {this.state.containerLoadType === "AIR"
                                          ? item1.CBM
                                          : item1.CBM}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : this.state.containerLoadType === "FTL" ? (
                        <>
                          <h3>Dimensions</h3>
                          <div className="table-responsive">
                            <table className="table table-responsive">
                              <thead>
                                <tr>
                                  <th>Truck Type</th>
                                  <th>Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.TruckTypeData.map(item1 => (
                                  <tr>
                                    <td>{item1.TruckDesc}</td>
                                    <td>{item1.Quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {this.state.selectedDataRow.map(item => (
                  <>
                    <div className="row">
                      <div className="col-12">
                        <div className="secondbox">
                          <h3>Service Details</h3>
                          <hr />
                          <div className="row">
                            <div className="col-12 col-sm-4">
                              <label>
                                Type of Move :
                                <span>
                                  {this.state.typeofMove === 1
                                    ? "Port To Port"
                                    : this.state.typeofMove === 2
                                    ? "Door To Port"
                                    : this.state.typeofMove === 4
                                    ? "Door To Door"
                                    : this.state.typeofMove === 3
                                    ? "Port To Door"
                                    : ""}
                                </span>
                              </label>
                              <label>
                                POL :{" "}
                                <span>
                                  {this.state.isCopy == true
                                    ? this.state.PickUpAddress
                                    : item.POLName}
                                </span>
                              </label>
                              {/* <label>
                              POD :{" "}
                              <span>
                                {this.state.isCopy == true
                                  ? this.state.DestinationAddress
                                  : this.state.podfullAddData.OceanPortLongName}
                              </span>
                            </label> */}
                            </div>
                            <div className="col-12 col-sm-4">
                              <label>
                                Service Type :{" "}
                                <span>
                                  {item.TransshipmentPort === null ||
                                  item.TransshipmentPort === undefined
                                    ? "Direct"
                                    : "Transit"}
                                  {/* // : item.TransshipmentPort} */}
                                </span>
                              </label>
                              {/* <label>
                              Inco Terms : <span>{this.state.incoTerm}</span>
                            </label> */}
                              <label>
                                POD :{" "}
                                <span>
                                  {this.state.isCopy == true
                                    ? this.state.DestinationAddress
                                    : item.PODName}
                                </span>
                              </label>
                            </div>
                            <div className="col-12 col-sm-4">
                              <label>
                                Liner :{" "}
                                <span>
                                  {this.state.isCopy == true
                                    ? item.Linename
                                    : item.lineName}
                                </span>
                              </label>
                              <label>
                                Inco Terms : <span>{this.state.incoTerm}</span>
                              </label>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-12 col-sm-4">
                              <label>
                                Transit Time :{" "}
                                <span>{item.TransitTime + " Days"}</span>
                              </label>
                            </div>
                            {/* <div className="col-12 col-sm-4">
                                          <label>Transit Time To : <span>15</span></label>
                                      </div> */}
                            <div className="col-12 col-sm-4">
                              <label>
                                Free Time : <span>{item.freeTime}</span>
                              </label>
                            </div>
                          </div>
                          <hr />
                          <div class="row">
                            <div className="col-12">
                              <label>
                                Expiry Date : <span>{item.expiryDate}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="thirdbox">
                          <h3>
                            {item.Type === "FCL"
                              ? item.ContainerType
                              : //  item.Type === "LCL"?this.state.CargoDetailsArr.map(cargo => (
                                //    cargo.PackageType
                                //  )):
                                null}
                          </h3>

                          <div className="table-responsive">
                            <table className="table table-responsive">
                              {(() => {
                                this.state.isCopy !== true
                                  ? (this.state.filterrateSubDetails =
                                      this.state.containerLoadType == "FTL" ||
                                      this.state.containerLoadType == "LTL"
                                        ? this.state.rateSubDetails.filter(
                                            d =>
                                              d.RateLineID === item.RateLineID
                                          )
                                        : this.state.rateSubDetails.filter(
                                            d =>
                                              d.RateLineID === item.RateLineId
                                          ))
                                  : (this.state.filterrateSubDetails =
                                      this.state.containerLoadType !== "FCL" &&
                                      this.state.containerLoadType !== "AIR"
                                        ? this.state.containerLoadType !==
                                          "INLAND"
                                          ? this.state.rateSubDetails.filter(
                                              d =>
                                                d.saleQuoteLineID ===
                                                item.SaleQuoteIDLineID
                                            )
                                          : this.state.rateSubDetails.filter(
                                              d =>
                                                d.SaleQuoteIDLineID ===
                                                item.SaleQuoteIDLineID
                                            )
                                        : this.state.rateSubDetails.filter(
                                            d =>
                                              d.saleQuoteLineID ===
                                              item.saleQuoteLineID
                                          ));
                              })()}

                              {(() => {
                                DocumentCharges = this.state.filterrateSubDetails.filter(
                                  d =>
                                    (d.ChargeItem || d.Chargeitem) ===
                                      "Per HBL" ||
                                    (d.ChargeItem || d.Chargeitem) ===
                                      "Per BL" ||
                                    (d.ChargeItem || d.Chargeitem) ===
                                      "Per Shipment" ||
                                    (d.ChargeItem || d.Chargeitem) === "Per Set"
                                );
                              })()}

                              {(() => {
                                this.state.filterrateSubDetails = this.state.filterrateSubDetails.filter(
                                  d =>
                                    (d.ChargeItem || d.Chargeitem) !==
                                      "Per HBL" &&
                                    (d.ChargeItem || d.Chargeitem) !==
                                      "Per BL" &&
                                    (d.ChargeItem || d.Chargeitem) !==
                                      "Per Shipment" &&
                                    (d.ChargeItem || d.Chargeitem) !== "Per Set"
                                );
                              })()}

                              <thead>
                                <tr>
                                  <th>Description</th>
                                  <th>Price</th>
                                  <th>Units</th>
                                  <th>Tax</th>
                                  <th>Total(USD)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.isCopy !== true
                                  ? this.state.filterrateSubDetails.map(
                                      item1 => (
                                        <tr>
                                          <td>{item1.ChargeDesc}</td>
                                          <td>
                                            {(item1.Rate === null
                                              ? " "
                                              : item1.Rate + " ") +
                                              item1.Currency}
                                          </td>
                                          <td>{item1.ChargeItem}</td>
                                          <td>{item1.Tax}</td>
                                          <td>
                                            {(item1.TotalAmount === null
                                              ? " "
                                              : item1.TotalAmount + " ") +
                                              (item1.BaseCurrency === null
                                                ? ""
                                                : item1.BaseCurrency)}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  : this.state.filterrateSubDetails.map(
                                      item1 => (
                                        <tr>
                                          <td>{item1.ChargeDesc}</td>
                                          <td>{item1.Amount}</td>
                                          <td>{item1.Chargeitem}</td>
                                          <td>{item1.Tax}</td>
                                          <td>
                                            {item1.TotalAmount > 0
                                              ? item1.TotalAmount +
                                                " " +
                                                item1.BaseCurrency
                                              : "" || item1.Total}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                {/* {encryption(
                                  window.localStorage.getItem("usertype"),
                                  "desc"
                                ) == "Customer" &&
                                this.state.ProfitAmount !== "" ? (
                                  ""
                                ) : this.state.ProfitAmount > 0 ? (
                                  <tr>
                                    <td>Profit Amount </td>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>
                                      {" "}
                                      {this.state.ProfitAmount + " "}
                                      {item.BaseCurrency}{" "}
                                    </td>
                                  </tr>
                                ) : (
                                  ""
                                )} */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {encryption(
                      window.localStorage.getItem("usertype"),
                      "desc"
                    ) == "Customer" ? (
                      ""
                    ) : (
                      <div className="row">
                        <div className="col-12">
                          <div className="thirdbox">
                            <div className="table-responsive">
                              <table className="table table-responsive">
                                <thead>
                                  <tr>
                                    <th>Profit Amount</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className="total-align">
                                      {this.state.ProfitAmount}
                                      {item.BaseCurrency}{" "}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}

                    <div className="row">
                      <div className="col-12">
                        <div className="thirdbox">
                          <div className="table-responsive">
                            <table className="table table-responsive">
                              <thead>
                                <tr>
                                  <th>Total</th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th className="total-align">
                                    {/* {this.state.filterrateSubDetails.length !== 0
                                    ? this.state.filterrateSubDetails.reduce(
                                        (sum, filterrateSubDetails) =>
                                          this.state.isCopy == true
                                            ? sum +
                                              parseFloat(
                                                filterrateSubDetails.Total ||
                                                  filterrateSubDetails.TotalAmount
                                              )
                                            : sum +
                                              filterrateSubDetails.TotalAmount,
                                        0
                                      ) +
                                      " " +
                                      this.state.filterrateSubDetails[0]
                                        .BaseCurrency
                                    : null} */}
                                    {this.state.isCopy != true
                                      ? item.TotalAmount +
                                        " " +
                                        item.BaseCurrency
                                      : item.Total}
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {DocumentCharges.length !== 0 ? (
                      <div className="row">
                        <div className="col-12">
                          <div className="thirdbox">
                            <h3>Documentation Charges</h3>
                            <div className="table-responsive">
                              <table className="table table-responsive">
                                <thead>
                                  <tr>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Units</th>
                                    <th>Tax</th>
                                    <th>Total(USD)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {DocumentCharges.map(item => (
                                    <tr>
                                      <td>{item.ChargeDesc}</td>
                                      <td>
                                        {(item.Rate === null
                                          ? " "
                                          : item.Rate + " ") + item.Currency}
                                      </td>
                                      <td>{item.ChargeItem}</td>
                                      <td>{item.Tax}</td>
                                      <td>
                                        {(item.TotalAmount === null
                                          ? " "
                                          : item.TotalAmount + " ") +
                                          (item.BaseCurrency === null
                                            ? ""
                                            : item.BaseCurrency)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
                <div className="row">
                  <div className="col-12">
                    <div className="thirdbox">
                      <div className="table-responsive">
                        <table className="table table-responsive">
                          <thead>
                            <tr>
                              <th>Terms and Conditions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{this.state.ConditionDesc}</td>
                            </tr>
                            <tr>
                              <td>
                                <a
                                  href="http://www.atafreight.com/Document/terms.pdf"
                                  target="_blank"
                                  style={{ cursor: "pointer", color: "blue" }}
                                >
                                  terms and conditions
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>
          <Modal
            className="delete-popup pol-pod-popup large-popup large-popupka1"
            isOpen={this.state.modalEdit}
            toggle={this.toggleEdit}
            centered={true}
          >
            <ModalBody>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.toggleEdit}
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
                <h3 className="mb-4">Edit Cargo Details</h3>
                <>
                  {this.state.containerLoadType === "FCL" ? (
                    // this.state.specialEquipment === true ? (
                    this.state.flattack_openTop.length > 0 ? (
                      <div className="">
                        <div id="cbmInner">
                          <>{this.MultiCreateCBM()}</>
                        </div>
                      </div>
                    ) : (
                      <div className="row cbm-space" key={i}>
                        <div className="col-md">
                          <div className="spe-equ">
                            <select
                              className="select-text"
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              name="SpecialContainerCode"
                              //value={el.SpecialContainerCode}
                            >
                              <option selected>Select</option>
                              {this.state.equipmentTypeArr.map((item, i) => (
                                <option key={i} value={item.ContainerType}>
                                  {item.ContainerType}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <select
                              className="select-text"
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              name="PackageType"
                              //value={el.PackageType}
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
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              placeholder={"L (cm)"}
                              className="w-100"
                              name="length"
                              //value={el.length || ""}
                              // onBlur={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              placeholder={"W (cm)"}
                              className="w-100"
                              name="width"
                              //value={el.width || ""}
                              //onBlur={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              placeholder="H (cm)"
                              className="w-100"
                              name="height"
                              //value={el.height || ""}
                              //onBlur={this.cbmChange}
                            />
                          </div>
                        </div>

                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              onChange={this.newMultiCBMHandleChange.bind(
                                this,
                                i
                              )}
                              //placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
                              name="Gross_Weight"
                              //value={el.Gross_Weight}
                              className="w-100"
                            />
                          </div>
                        </div>

                        {i === 0 ? (
                          <div className="">
                            <div className="spe-equ">
                              <i
                                className="fa fa-plus mt-2"
                                aria-hidden="true"
                                onClick={this.addMultiDim.bind(this)}
                              ></i>
                            </div>
                          </div>
                        ) : null}
                        {this.state.flattack_openTop.length > 1 ? (
                          <div className="">
                            <div className="spe-equ">
                              <i
                                className="fa fa-minus mt-2"
                                aria-hidden="true"
                                onClick={this.removeMultiDim.bind(this, i)}
                              ></i>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  ) : this.state.TruckDetailsArr.length > 0 ? (
                    <div className="row cbm-space" key={i}>
                      <div className="col-md">
                        <div className="spe-equ">
                          <select
                            className="select-text"
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            name="SpecialContainerCode"
                            //value={el.SpecialContainerCode}
                          >
                            <option selected>Select</option>
                            {this.state.TruckDetailsArr.map((item, i) => (
                              <option key={i} value={item.TruckDesc}>
                                {item.TruckDesc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="spe-equ">
                          <select
                            className="select-text"
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            name="PackageType"
                            //value={el.PackageType}
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
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            placeholder={"L (cm)"}
                            className="w-100"
                            name="length"
                            //value={el.length || ""}
                            // onBlur={this.cbmChange}
                          />
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="spe-equ">
                          <input
                            type="text"
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            placeholder={"W (cm)"}
                            className="w-100"
                            name="width"
                            //value={el.width || ""}
                            //onBlur={this.cbmChange}
                          />
                        </div>
                      </div>
                      <div className="col-md">
                        <div className="spe-equ">
                          <input
                            type="text"
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            placeholder="H (cm)"
                            className="w-100"
                            name="height"
                            //value={el.height || ""}
                            //onBlur={this.cbmChange}
                          />
                        </div>
                      </div>

                      <div className="col-md">
                        <div className="spe-equ">
                          <input
                            type="text"
                            onChange={this.newMultiCBMHandleChange.bind(
                              this,
                              i
                            )}
                            //placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
                            name="Gross_Weight"
                            //value={el.Gross_Weight}
                            className="w-100"
                          />
                        </div>
                      </div>

                      {i === 0 ? (
                        <div className="">
                          <div className="spe-equ">
                            <i
                              className="fa fa-plus mt-2"
                              aria-hidden="true"
                              onClick={this.addMultiDim.bind(this)}
                            ></i>
                          </div>
                        </div>
                      ) : null}
                      {this.state.flattack_openTop.length > 1 ? (
                        <div className="">
                          <div className="spe-equ">
                            <i
                              className="fa fa-minus mt-2"
                              aria-hidden="true"
                              onClick={this.removeMultiDim.bind(this, i)}
                            ></i>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className="rate-radio-cntr justify-content-center">
                        <div>
                          <input
                            type="radio"
                            name="cmbTypeRadio"
                            id="exist-cust"
                            value="ALL"
                            style={{ display: "none" }}
                            checked={
                              this.state.cmbTypeRadio === "ALL" ? true : false
                            }
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
                            Dimensions
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="cmbTypeRadio"
                            id="new-cust"
                            value="CBM"
                            style={{ display: "none" }}
                            checked={
                              this.state.cmbTypeRadio !== "ALL" ? true : false
                            }
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
                      {this.state.cmbTypeRadio === "ALL" ? (
                        this.CreateMultiCBM()
                      ) : (
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
                            {/* {this.state.errors["CBM"]} */}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </>

                <div className="text-center">
                  <Button
                    className="butn"
                    data-valuespecialsontainersode={
                      this.state.valuespecialsontainersode
                    }
                    onClick={this.SubmitCargoDetails.bind()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
        <NotificationContainer leaveTimeout="3000" />
      </React.Fragment>
    );
  }
}

export default RateFinalizing;

import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { encryption } from "../helpers/encryption";
import matchSorter from "match-sorter";
import Autocomplete from "react-autocomplete";

import Comman from "./../helpers/Comman";

import moment from "moment";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
        maxHeight: "100px",
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
      todayDate: moment(new Date(), "DD-MM-YYYY"),
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
      sBaseCurrency: "",
      iscurrencyChnage: false,
      SurchargeLocalchargeID: [],
      cSelectChackBox: {},
      Contact_Phone: "",
      SalesPersonFax: "",
      SalesPersonPhone: "",
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
    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state.Quote == undefined) {
        var rateDetails = this.props.location.state.selectedDataRow;
        var newrateDetailsData = this.props.location.state.selectedDataRow;

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
        var currencyCode = localStorage.getItem("currencyCode");
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

        if (containerLoadType == "FCL") {
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
                  Editable: false,
                });

                equipmentTypeArr.push({
                  ContainerType: users[i].StandardContainerCode,
                  Quantity: users[i].ContainerQuantity,
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
                  Editable: false,
                });
                equipmentTypeArr.push({
                  ContainerType: spacEqmtType[i].StandardContainerCode,
                  Quantity: spacEqmtType[i].Quantity,
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
                  Editable: false,
                });
              }
            }
          }

          if (flattack_openTop != null) {
            if (flattack_openTop.length > 0) {
              for (var i = 0; i < flattack_openTop.length; i++) {
                CargoDetailsArr.push({
                  PackageType: flattack_openTop[i].PackageType,
                  Quantity: flattack_openTop[i].Quantity,
                  Lengths: flattack_openTop[i].Lengths,
                  Width: flattack_openTop[i].Width,
                  Height: flattack_openTop[i].Height,
                  GrossWt: flattack_openTop[i].GrossWt,
                  Volume: flattack_openTop[i].Volume,
                  VolumeWeight: flattack_openTop[i].VolumeWeight,
                  Editable: true,
                });

                PackageDetailsArr.push({
                  PackageType: flattack_openTop[i].PackageType,
                  Quantity: flattack_openTop[i].Quantity,
                  Lengths: flattack_openTop[i].Lengths,
                  Width: flattack_openTop[i].Width,
                  Height: flattack_openTop[i].Height,
                  GrossWt: flattack_openTop[i].GrossWt,
                  Volume: flattack_openTop[i].Volume,
                  VolumeWeight: flattack_openTop[i].VolumeWeight,
                  Editable: true,
                });
              }
            }
          }
        } else if (containerLoadType == "LCL" || containerLoadType == "LTL") {
          for (var i = 0; i < multiCBM.length; i++) {
            PackageDetailsArr.push({
              PackageType: multiCBM[i].PackageType,
              Quantity: multiCBM[i].Quantity,
              Lengths: multiCBM[i].Lengths,
              Width: multiCBM[i].Width,
              Height: multiCBM[i].Height,
              GrossWt: multiCBM[i].GrossWt,
              VolumeWeight: multiCBM[i].VolumeWeight,
              Volume: multiCBM[i].Volume,
            });
          }
        } else if (containerLoadType == "FTL") {
          // if (TruckTypeData != null) {
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
                CBM: "-",
              });

              if (containerLoadType == "FTL") {
                TruckDetailsArr.push({
                  TransportType: TruckTypeData[i].TruckDesc,
                  Quantity: TruckTypeData[i].Quantity,
                });
              }
            }
          } else {
            PackageDetailsArr = multiCBM;
          }
          // }
        } else if (containerLoadType == "AIR") {
          if (multiCBM != null) {
            if (multiCBM.length > 0) {
              for (var i = 0; i < multiCBM.length; i++) {
                PackageDetailsArr.push({
                  PackageType: multiCBM[i].PackageType,
                  Quantity: multiCBM[i].Quantity,
                  Lengths: multiCBM[i].Lengths,
                  Width: multiCBM[i].Width,
                  Height: multiCBM[i].Height,
                  GrossWt: multiCBM[i].GrossWt,
                  VolumeWeight: multiCBM[i].VolumeWeight,
                  Volume: multiCBM[i].Volume,
                });
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
                  CBM: cbmVal,
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
                Lengths: multiCBM[i].Lengths,
                Width: multiCBM[i].Width,
                Height: multiCBM[i].Height,
                GrossWt: multiCBM[i].GrossWt,
                VolumeWeight: multiCBM[i].VolumeWeight || 0,
                Volume: multiCBM[i].Volume || 0,
              });
            }
          }
        }
        if (
          multiCBM != null &&
          containerLoadType == "FCL" &&
          this.props.location.state.isViewRate
        ) {
          if (
            multiCBM.length > 0 &&
            containerLoadType == "FCL" &&
            this.props.location.state.isViewRate
          ) {
            PackageDetailsArr = MultiCBM;
          }
        }
        const newSelected = Object.assign({}, this.state.cSelectedRow);

        var selectedRow = [];
        var manProfitAmt = [];
        var localProfitamt = [];
        for (let i = 0; i < rateDetails.length; i++) {
          var idrate = 0;
          if (rateDetails[i].RateLineId) {
            idrate = rateDetails[i].RateLineId;
            rateOrgDetails.push({
              RateLineId: idrate,
              Total: rateDetails[i].TotalAmount,
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
              cSelectedRow: rateDetails[i].RateLineId ? newSelected : false,
            });
          }
          if (rateDetails[i].RateLineID) {
            idrate = rateDetails[i].RateLineID;
            rateOrgDetails.push({
              RateLineId: idrate,
              Total: rateDetails[i].TotalAmount,
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
              cSelectedRow: rateDetails[i].RateLineID ? newSelected : false,
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
                    PackageType: "",
                    Quantity: 0,
                    Lengths: 0,
                    Width: 0,
                    Height: 0,
                    Weight: 0,
                    VolumeWeight: 0,
                    Volume: 0,
                  },
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
          podArray: podArray,
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
        setTimeout(() => {
          this.HandleLocalCharges();
          this.HandleSurCharges();
          this.HandlePackgeTypeData();
        }, 100);
      } else {
        var qData = this.props.location.state;
        this.setState({
          isCopy: this.props.location.state.isCopy,
          containerLoadType: this.props.location.state.type,
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
      url: url,
    }).then(function (response) {
      var sBaseCurrency = selectedCurrency;
      self.setState({ sBaseCurrency });
    });
  }

  HandleSalesQuoteView(param) {
    var SalesQuoteNumber = param.Quote;
    var type = param.type;
    var isediting = param.isediting;
    var isCopy = param.isCopy;

    this.setState({
      toggleIsEdit: false,
      isediting: isediting,
      isCopy: isCopy,
      containerLoadType: type,
      newloding: true,
    });
    var SalesQuoteViewdata = {
      Mode: type,

      SalesQuoteNumber: SalesQuoteNumber,
    };
    this.setState({
      QuoteNumber: SalesQuoteNumber,
    });
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,

      data: SalesQuoteViewdata,
      headers: authHeader(),
    })
      .then(function (response) {
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
        var ContactName = "";
        var ContactEmail = "";
        var Contact_Phone = "";
        var SalesPersonFax = "";
        var SalesPersonPhone = "";

        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                TypeofMove = response.data.Table[0].TypeOfMove;
                IncoTerms = response.data.Table[0].IncoTerm;
                CompanyName =
                  response.data.Table[0].company_name ||
                  response.data.Table[0].CompanyName;
                companyID = response.data.Table[0].companyID;
                Company_Address = response.data.Table[0].Company_Address;
                Company_AddressID = response.data.Table[0].Company_AddressID;
                self.setState({
                  newloding: false,
                  CompanyName,
                  companyID,
                  Company_Address,
                  Company_AddressID,
                  ContactName: response.data.Table[0].contact_name,
                  ContactEmail: response.data.Table[0].Contact_Email,
                  Contact_Phone: response.data.Table[0].Contact_Phone,
                  SalesPersonFax: response.data.Table[0].SalesPersonPhone,
                  SalesPersonPhone: response.data.Table[0].SalesPersonFax,
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
                      : response.data.Table[0].deliveryAddress,
                });
              }
            }
            var selectedRow = [];
            const newSelected = Object.assign({}, self.state.cSelectedRow);
            ////;;
            var rateDetails = response.data.Table1;
            var rateSubDetailsdata = response.data.Table2;
            var profitLossAmt = 0;

            var profitLossPer = 0;

            var finalprofitLossAmt = 0;
            var finalprofitLossPer = 0;
            var BuyRate = 0;

            var manProfitAmt = [];
            var localProfitamt = [];
            var aTotalAmount = 0;

            for (let i = 0; i < rateDetails.length; i++) {
              profitLossAmt = 0;
              BuyRate = 0;
              var idrate = 0;

              idrate = rateDetails[i].saleQuoteLineID;
              rateOrgDetails.push({
                RateLineId: idrate,
                Total: rateDetails[i].Total,
              });
              manProfitAmt.push({
                RateLineId: idrate,
                Total: 0,
              });
              localProfitamt.push({
                RateLineId: idrate,
                Total: 0,
              });

              newSelected[rateDetails[i].saleQuoteLineID] = true;
              selectedRow.push(rateDetails[i]);
              self.setState({
                cSelectedRow: newSelected,
                selectedDataRow: selectedRow,
              });

              var rateSubDetailsdata1 = rateSubDetailsdata.filter(
                (x) => x.saleQuoteLineID == rateDetails[i].saleQuoteLineID
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

            if (selectedRow.length > 0) {
              aTotalAmount = selectedRow.reduce(function (prev, cur) {
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
              profitLossPer: finalprofitLossPer,
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
                    DestinationAddress: response.data.Table1[0].deliveryAddress,
                  });
                }

                self.setState({
                  IncoTerms: IncoTerms,
                  incoTerms: IncoTerms,
                  incoTerm: IncoTerms,

                  Commodity: response.data.Table1[0].Commodity,

                  selectedCommodity: response.data.Table1[0].Commodity,
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
                  typeofMove: 1,
                });
              } else if (TypeofMove == "Door To Port") {
                self.setState({
                  typeofMove: 2,
                });
              } else if (TypeofMove == "Port To Door") {
                self.setState({
                  typeofMove: 3,
                });
              } else if (TypeofMove == "Door To Door") {
                self.setState({
                  typeofMove: 4,
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
                        TemperatureType: "",
                      });

                      equipmentTypeArr.push({
                        ContainerType: table[i].ContainerCode,
                        Quantity: table[i].ContainerQuantity,
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
                      Editable: true,
                    });

                    // if (table[i].PackageType !== null) {
                    PackageDetailsArr.push({
                      PackageType: table[i].PackageType || "",
                      Quantity: table[i].Quantity || 0,
                      Lengths: table[i].Lengths || 0,
                      Width: table[i].Width || 0,
                      Height: table[i].Height || 0,
                      GrossWt: table[i].GrossWt || 0,
                      CBM:
                        response.data.Table[0].ModeOfTransport.toUpperCase() ===
                        "AIR"
                          ? table[i].ChgWeight
                          : table[i].CBM === undefined
                          ? "-"
                          : table[i].CBM,
                      VolumeWeight:
                        table[i].ChgWeight || table[i].VolumeWeight || 0,
                      Editable: true,
                    });
                    // }

                    multiCBM.push({
                      PackageType: table[i].PackageType || "",
                      Quantity: table[i].Quantity || 0,
                      Lengths: table[i].Lengths || 0,
                      Width: table[i].Width || 0,
                      Height: table[i].Height || 0,
                      GrossWt: table[i].GrossWt || 0,
                      VolumeWeight:
                        table[i].VolumeWeight || table[i].ChargeableWeight || 0,
                      Volume:
                        param.type.toUpperCase() === "LCL" ? table[i].CBM : 0,
                    });

                    if (param.type == "FCL") {
                      flattack_openTop.push({
                        PackageType: table[i].PackageType,
                        Quantity: table[i].Quantity,
                        Lengths: table[i].Lengths,
                        Width: table[i].Width,
                        Height: table[i].Height,
                        GrossWt: table[i].GrossWt,
                        VolumeWeight: table[i].VolumeWeight || 0,
                        Volume: table[i].Volume || table[i].CBM || 0,
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
              CargoDetailsArr: CargoDetailsArr,
            });
          }
        }
        var rateDetails = response.data.Table1;

        self.setState({
          rateDetails: rateDetails,
          rateOrgDetails: rateOrgDetails,
          rateSubDetails: response.data.Table2,
          multiCBM: multiCBM,
          flattack_openTop: flattack_openTop,
        });

        self.forceUpdate();
        self.HandleLocalCharges();
        self.HandleSurCharges();
        self.HandleSalesQuoteConditions();
      })
      .catch((error) => {});
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
        ContainerQty: rateDetails[i].ContainerQuantity,
      });
    }
    var LocalChargeData = {
      QuoteType: this.state.containerLoadType,
      ModeOfTransport: modeOfTransport,
      Type: this.state.shipmentType,
      TypeOfMove: this.state.typeofMove,
      ChargeableWeight: parseFloat(this.state.cbmVal),
      RoutingInformation: RoutingInformation,
      RateQueryDim: this.state.multiCBM,
      MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      BaseCurrency: self.state.currencyCode,
      PickupGeoCordinate: this.props.location.state.OriginGeoCordinates,
      DeliveryGeoCordinate: this.props.location.state.DestGeoCordinate,
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/LocalChargesSalesQuote`,
      data: LocalChargeData,
      headers: authHeader(),
    })
      .then(function (response) {
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
            IsChecked: false,
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
            IsChecked: false,
          });
        }
        self.setState({
          arrLocalsCharges: response.data.Table,
          fltLocalCharges: response.data.Table,
        });
      })
      .catch((error) => {});
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
        ContainerQty: rateDetails[i].ContainerQuantity,
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
        ChargeableWeight: parseFloat(this.state.cbmVal),
        RateQueryDim: this.state.multiCBM,
        RoutingInformation: RoutingInformation,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        BaseCurrency: self.state.currencyCode,
        PickupGeoCordinate: this.props.location.state.OriginGeoCordinates,
        DeliveryGeoCordinate: this.props.location.state.DestGeoCordinate,
      },
      headers: authHeader(),
    }).then(function (response) {
      self.setState({
        arrSurCharges: response.data.Table,
        fltSurCharges: response.data.Table,
      });
    });
  }

  toggleProfit() {
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
              ProfitAmount = this.state.manProfitAmt[i].Total;
              if (ProfitAmount > 0) {
                showUpdate = true;
              }
            }
          }
        } else {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            (this.state.selectedDataRow[0].RateLineId ||
              this.state.selectedDataRow[0].RateLineID)
          ) {
            ProfitAmount = this.state.manProfitAmt[i].Total;

            if (this.state.manProfitAmt[i].Total > 0) {
              showUpdate = true;
            }
          }
        }
      }

      this.setState((prevState) => ({
        modalProfit: !prevState.modalProfit,
        ProfitAmount: ProfitAmount,
        showUpdate,
      }));
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select only one rate to add profit",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  toggleLoss() {
    if (this.state.selectedDataRow.length === 1) {
      this.setState((prevState) => ({
        modalLoss: !prevState.modalLoss,
        ProfitAmount: 0,
      }));
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select only one rate to remove profit",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }
  toggleNewConsignee() {
    this.setState((prevState) => ({
      modalNewConsignee: !prevState.modalNewConsignee,
    }));
  }

  newOpen() {
    window.open(
      "https://org242240bd.crm.dynamics.com/main.aspx?etn=lead&pagetype=entityrecord",
      "_blank"
    );
  }

  commoditySelect(e) {
    var value = e.target.selectedOptions[0].innerText;
    this.setState({
      commoditySelect: e.target.value,
      CommodityID: e.target.value,
      Commodity: value,
    });
  }
  cargoSelect(e) {
    this.setState({
      cargoSelect: e.target.value,
    });
  }

  rateQuery() {
    this.setState({
      rateQuery: !this.state.rateQuery,
    });
  }

  toggleRequest() {
    this.setState((prevState) => ({
      modalRequest: !prevState.modalRequest,
    }));
    this.setState({ discountval: 0 });
    this.RequestChangeMsgModalClose();
  }

  RequestChangeMsgModal() {
    if (this.state.selectedDataRow.length > 0) {
      if (this.state.CompanyID) {
        this.setState((prevState) => ({
          modalRequestMsg: !prevState.modalRequestMsg,
        }));
      } else {
        store.addNotification({
          // title: "Error",
          message: "Please select Customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      }
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select Customer",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }
  RequestChangeMsgModalClose() {
    this.setState({
      modalRequestMsg: false,
    });
  }

  togglePreview() {
    this.setState((prevState) => ({
      modalPreview: !prevState.modalPreview,
    }));
  }

  toggleEdit(e) {
    // if (!this.state.modalEdit) {
    //   var valuetype = e.target.getAttribute("data-valuetype");
    //   var valuequantity = e.target.getAttribute("data-valuequantity");
    //   var valuelenght = e.target.getAttribute("data-valuelenght");
    //   var valuewidth = e.target.getAttribute("data-valuewidth");
    //   var valueheight = e.target.getAttribute("data-valueheight");
    //   var valueweight = e.target.getAttribute("data-valueweight");
    //   var valuecbm = e.target.getAttribute("data-valuecbm");
    //   var valuespecialsontainersode = e.target.getAttribute(
    //     "data-valuespecialsontainersode"
    //   );

    //   this.setState(prevState => ({
    //     currentPackageType: valuetype,
    //     valuequantity: valuequantity,
    //     valuelenght: valuelenght,
    //     valuewidth: valuewidth,
    //     valueheight: valueheight,
    //     valueweight: valueweight,
    //     valuecbm: valuecbm,
    //     valuespecialsontainersode: valuespecialsontainersode
    //   }));
    //   this.forceUpdate();
    // }

    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  }

  SendRequestChange() {
    if (this.state.selectedDataRow.length > 0) {
      if (this.state.CompanyID === 0) {
        store.addNotification({
          // title: "Error",
          message: "Please select Customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
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

      var FCLSQLocalChargesarr = [];
      var FCLSQSurChargesarr = [];

      if (this.state.SurchargeLocalchargeID.length > 0) {
        for (let j = 0; j < this.state.SurchargeLocalchargeID.length; j++) {
          var data = this.state.rateSubDetails.filter(
            (x) =>
              x.ChargeID == this.state.SurchargeLocalchargeID[j].SurchargeId &&
              x.RateLineID == this.state.SurchargeLocalchargeID[j].RateQueryid
          );
          if (data.length > 0) {
            for (let k = 0; k < data.length; k++) {
              FCLSQLocalChargesarr.push(data[k]);
            }
          }
        }
      }

      var rateDetailsarr = this.state.selectedDataRow;

      var subratedetails = [];
      for (let i = 0; i < rateDetailsarr.length; i++) {
        if (this.state.isCopy === true) {
          var data = this.state.rateSubDetails.filter(
            (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
          );
          subratedetails.push(data);
        } else {
          var data = this.state.rateSubDetails.filter(
            (x) =>
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
              rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID,
            RateType: rateDetailsarr[i].TypeOfRate,
          });
        }
        if (containerLoadType == "LCL") {
          FCLSQBaseFreight.push({
            RateID:
              rateDetailsarr[i].RateLineID || rateDetailsarr[i].RateLineId,
            RateType: rateDetailsarr[i].TypeOfRate,
          });
        } else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
          FCLSQBaseFreight.push({
            RateID: rateDetailsarr[i].RateLineID,
            RateType: rateDetailsarr[i].TypeOfRate,
          });
        } else if (containerLoadType == "AIR") {
          FCLSQBaseFreight.push({
            RateID:
              rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID,
            RateType: rateDetailsarr[i].TypeOfRate,
          });
        }
      }

      var FCLSQCharges = [];

      for (var i = 0; i < rateDetailsarr.length; i++) {
        for (var j = 0; j < rateSubDetailsarr.length; j++) {
          if (containerLoadType == "FCL") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId ||
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
                TotalAmount: rateSubDetailsarr[j].TotalAmount || 0,
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
                TotalAmount: rateSubDetailsarr[j].TotalAmount || 0,
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
                    : rateSubDetailsarr[j].TotalAmount,
              });
            }
          }
          if (containerLoadType == "AIR") {
            if (
              rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId ||
              rateDetailsarr[i].RateLineID
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
                    : rateSubDetailsarr[j].TotalAmount,
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
            Exrate: 0,
          });
        }
      }

      var Containerdetails = [];
      var RateQueryDim = [];

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
                  usesr[i].Temperature == undefined ? 0 : usesr[i].Temperature,
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
                Temperature: 0,
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
                Temperature: referType[i].Temperature,
              });
            }
          }
        }

        if (flattack_openTop != null && !this.props.location.state.isViewRate) {
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
                    ? flattack_openTop[i].GrossWt
                    : flattack_openTop[i].Gross_Weight,
                VolumeWeight: 0,
                Volume: 0,
                PackageType:
                  flattack_openTop[i].PackageType == undefined
                    ? ""
                    : flattack_openTop[i].PackageType,
              });
            }
          }
        }

        if (RateQueryDim.length == 0) {
          RateQueryDim = this.state.multiCBM;
        }
      } else if (containerLoadType == "LCL") {
        var RateQueryDim = this.state.multiCBM;
      } else if (containerLoadType == "FTL") {
        var TruckTypeData = this.state.TruckTypeData;
        if (TruckTypeData.length > 0) {
          for (var i = 0; i < TruckTypeData.length; i++) {
            RateQueryDim.push({
              Quantity: TruckTypeData[i].Quantity,
              Lengths: 0,
              Width: 0,
              Height: 0,
              GrossWt: 0,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: TruckTypeData[i].TruckDesc,
            });
          }
        } else {
          if (this.props.location.state.isViewRate) {
            RateQueryDim = this.state.multiCBM;
          }
          if (this.state.isCopy) {
            RateQueryDim = this.state.multiCBM;
          }
        }

        //
      } else if (containerLoadType == "AIR" || containerLoadType == "LTL") {
        var RateQueryDim = this.state.multiCBM;
      }

      var PickUpAddress = "";
      var DestinationAddress = "";
      var PickUpAddressDetails = {
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: 0,
      };
      var DestinationAddressDetails = {
        Street: "",
        Country: "",
        State: "",
        City: "",
        ZipCode: 0,
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
        if (this.props.location.state.pickUpAddress.length > 0) {
          PickUpAddressDetails = {
            Street: this.props.location.state.pickUpAddress[0].Area || "",
            Country: this.props.location.state.pickUpAddress[0].Country || "",
            State: this.props.location.state.pickUpAddress[0].State || "",
            City: this.props.location.state.pickUpAddress[0].City || "",
            ZipCode: this.props.location.state.pickUpAddress[0].ZipCode || 0,
          };
        } else {
          PickUpAddressDetails = {
            Street: "",
            Country: "",
            State: "",
            City: "",
            ZipCode: 0,
          };
        }

        DestinationAddress =
          this.state.isCopy === true
            ? this.state.DestinationAddress
            : this.state.containerLoadType.toUpperCase() === "AIR"
            ? this.state.podfullAddData.AirportLongName
            : this.state.podfullAddData.OceanPortLongName;
      }

      if (this.state.typeofMove == 4) {
        if (this.props.location.state.pickUpAddress.length > 0) {
          PickUpAddressDetails = {
            Street: this.props.location.state.pickUpAddress[0].Area || "",
            Country: this.props.location.state.pickUpAddress[0].Country || "",
            State: this.props.location.state.pickUpAddress[0].State || "",
            City: this.props.location.state.pickUpAddress[0].City || "",
            ZipCode: this.props.location.state.pickUpAddress[0].ZipCode || 0,
          };
        } else {
          PickUpAddressDetails = {
            Street: "",
            Country: "",
            State: "",
            City: "",
            ZipCode: 0,
          };
        }
        if (this.props.location.state.destAddress.length > 0) {
          DestinationAddressDetails = {
            Street: this.props.location.state.destAddress[0].Area || "",
            Country: this.props.location.state.destAddress[0].Country || "",
            State: this.props.location.state.destAddress[0].State || "",
            City: this.props.location.state.destAddress[0].City || "",
            ZipCode: this.props.location.state.destAddress[0].ZipCode || 0,
          };
        } else {
          DestinationAddressDetails = {
            Street: "",
            Country: "",
            State: "",
            City: "",
            ZipCode: 0,
          };
        }
      }

      if (this.state.typeofMove == 3) {
        PickUpAddress =
          this.state.isCopy === true
            ? this.state.PickUpAddress
            : this.state.containerLoadType.toUpperCase() === "AIR"
            ? this.state.polfullAddData.AirportLongName
            : this.state.polfullAddData.OceanPortLongName;

        if (this.props.location.state.destAddress.length > 0) {
          DestinationAddressDetails = {
            Street: this.props.location.state.destAddress[0].Area || "",
            Country: this.props.location.state.destAddress[0].Country || "",
            State: this.props.location.state.destAddress[0].State || "",
            City: this.props.location.state.destAddress[0].City || "",
            ZipCode: this.props.location.state.destAddress[0].ZipCode || 0,
          };
        } else {
          DestinationAddressDetails = {
            Street: "",
            Country: "",
            State: "",
            City: "",
            ZipCode: 0,
          };
        }
      }

      var RateDataArr = [];
      for (var i = 0; i < rateDetailsarr.length; i++) {
        var AIRObjdata = new Object();

        AIRObjdata.RateID =
          rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID;
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
        MyWayComments: txtRequestComments || "",
        MyWayDiscount: parseFloat(txtRequestDiscount) || 0,
        MyWayFreeTime: parseFloat(txtRequestFreeTime) || 0,
        IsRequestForChange: 0,
        SQCharges: FCLSQCharges,
        RateTypes: FCLSQBaseFreight,
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
        headers: authHeader(),
      })
        .then(function (response) {
          self.toggleRequest();
          if (response != null) {
            if (response.data != null) {
              if (response.data.Table != null) {
                if (response.data.Table.length > 0) {
                  store.addNotification({
                    // title: "Success",
                    message: response.data.Table[0].Message,
                    type: "success", // 'default', 'success', 'info', 'warning','danger'
                    container: "top-right", // where to position the notifications
                    dismiss: {
                      duration: appSettings.NotficationTime,
                    },
                  });

                  setTimeout(() => {
                    self.props.history.push("./spot-rate-table");
                  }, 4000);
                }
              }
            }
          }
        })
        .catch((error) => {});
    } else {
      store.addNotification({
        message: "Please select atleast one Rate",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  SendRequest() {
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

        var FCLSQLocalChargesarr = [];
        var FCLSQSurChargesarr = [];

        // var chkslocalcharge = document.getElementsByName("localCharge");
        // for (var i = 0; i < chkslocalcharge.length; i++) {
        //   if (chkslocalcharge[i].checked) {
        //     FCLSQLocalChargesarr.push({
        //       LocalChargeID: 0,
        //       Description:
        //         chkslocalcharge[0].attributes["data-chargedesc"].value,
        //       Amount:
        //         chkslocalcharge[0].attributes["data-amountinbasecurrency"]
        //           .value,
        //       Currency: chkslocalcharge[0].attributes["data-currency"].value,
        //       Minimum: 0,
        //       Tax: 0,
        //       ChargeItem:
        //         chkslocalcharge[0].attributes["data-chargeitem"].value,
        //       RateID: 0,
        //       Exrate: 0
        //     });
        //   }
        // }

        if (this.state.SurchargeLocalchargeID.length > 0) {
          for (let j = 0; j < this.state.SurchargeLocalchargeID.length; j++) {
            var data = this.state.rateSubDetails.filter(
              (x) =>
                x.ChargeID ==
                  this.state.SurchargeLocalchargeID[j].SurchargeId &&
                x.RateLineID == this.state.SurchargeLocalchargeID[j].RateQueryid
            );
            if (data.length > 0) {
              for (let k = 0; k < data.length; k++) {
                FCLSQLocalChargesarr.push(data[k]);
              }
            }
          }
        }
        var rateDetailsarr = this.state.selectedDataRow;

        var subratedetails = [];
        for (let i = 0; i < rateDetailsarr.length; i++) {
          if (this.state.isCopy === true) {
            var data = this.state.rateSubDetails.filter(
              (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
            );
            subratedetails.push(data);
          } else {
            var data = this.state.rateSubDetails.filter(
              (x) =>
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
                  : rateDetailsarr[i].TypeOfRate,
            });
          }
          if (containerLoadType == "LCL") {
            if (rateDetailsarr[i].RateLineID == undefined) {
              if (rateDetailsarr[i].saleQuoteLineID != undefined) {
                FCLSQBaseFreight.push({
                  RateID: rateDetailsarr[i].saleQuoteLineID,
                  RateType: rateDetailsarr[i].TypeOfRate,
                });
              } else {
                FCLSQBaseFreight.push({
                  RateID:
                    rateDetailsarr[i].RateLineId ||
                    rateDetailsarr[i].RateLineID,
                  RateType: rateDetailsarr[i].TypeOfRate,
                });
              }
            } else {
              FCLSQBaseFreight.push({
                RateID: rateDetailsarr[i].RateLineID,
                RateType: rateDetailsarr[i].TypeOfRate,
              });
            }
          } else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
            FCLSQBaseFreight.push({
              RateID:
                rateDetailsarr[i].RateLineID || rateDetailsarr[i].RateLineId,
              RateType: rateDetailsarr[i].TypeOfRate,
            });
          } else if (containerLoadType == "AIR") {
            FCLSQBaseFreight.push({
              RateID:
                this.state.isCopy === true
                  ? rateDetailsarr[i].saleQuoteLineID
                  : rateDetailsarr[i].RateLineId ||
                    rateDetailsarr[i].RateLineID,
              RateType:
                this.state.isCopy === true
                  ? rateDetailsarr[i].TypeOfRate
                  : rateDetailsarr[i].TypeOfRate,
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
                      TotalAmount:
                        parseFloat(
                          rateSubDetailsarr[j].Total.split("U")[0].trim()
                        ) || 0,
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
                    TotalAmount: rateSubDetailsarr[j].TotalAmount || 0,
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
                      TotalAmount:
                        parseFloat(
                          rateSubDetailsarr[j].Total.split(" ")[0].trim()
                        ) || 0,
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
                          : rateSubDetailsarr[j].TotalAmount,
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
                    TotalAmount: rateSubDetailsarr[j].TotalAmount || 0,
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
                      : rateSubDetailsarr[j].TotalAmount,
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
                      TotalAmount:
                        parseFloat(
                          rateSubDetailsarr[j].Total.split(" ")[0].trim()
                        ) || 0,
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
                        : rateSubDetailsarr[j].TotalAmount,
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
              Exrate: 0,
            });
          }
        }

        var Containerdetails = [];
        var RateQueryDim = [];

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
                    usesr[i].Temperature == undefined
                      ? 0
                      : usesr[i].Temperature,
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
                  Temperature: 0,
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
                  Temperature: referType[i].Temperature,
                });
              }
            }
          }

          if (
            flattack_openTop != null &&
            !this.props.location.state.isViewRate
          ) {
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
                      ? flattack_openTop[i].GrossWt
                      : flattack_openTop[i].Gross_Weight,
                  VolumeWeight: 0,
                  Volume: 0,
                  PackageType:
                    flattack_openTop[i].PackageType == undefined
                      ? ""
                      : flattack_openTop[i].PackageType,
                });
              }
            }
          }
          if (RateQueryDim.length == 0) {
            RateQueryDim = this.state.multiCBM;
          }
        } else if (containerLoadType == "LCL") {
          var RateQueryDim = this.state.multiCBM;
        } else if (containerLoadType == "FTL") {
          var TruckTypeData = this.state.TruckTypeData;
          if (
            TruckTypeData.length > 0 &&
            !this.props.location.state.isViewRate
          ) {
            for (var i = 0; i < TruckTypeData.length; i++) {
              RateQueryDim.push({
                Quantity: TruckTypeData[i].Quantity,
                Lengths: 0,
                Width: 0,
                Height: 0,
                GrossWt: 0,
                VolumeWeight: 0,
                Volume: 0,
                PackageType: TruckTypeData[i].TruckDesc,
              });
            }
          } else {
            if (this.props.location.state.isViewRate) {
              RateQueryDim = this.state.multiCBM;
            }
            if (this.state.isCopy) {
              RateQueryDim = this.state.multiCBM;
            }
          }
        } else if (containerLoadType == "AIR" || containerLoadType == "LTL") {
          var RateQueryDim = this.state.multiCBM;
        }

        var PickUpAddress = "";
        var DestinationAddress = "";
        var PickUpAddressDetails = {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0,
        };
        var DestinationAddressDetails = {
          Street: "",
          Country: "",
          State: "",
          City: "",
          ZipCode: 0,
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
          if (this.props.location.state.pickUpAddress.length > 0) {
            PickUpAddressDetails = {
              Street: this.props.location.state.pickUpAddress[0].Area || "",
              Country: this.props.location.state.pickUpAddress[0].Country || "",
              State: this.props.location.state.pickUpAddress[0].State || "",
              City: this.props.location.state.pickUpAddress[0].City || "",
              ZipCode: this.props.location.state.pickUpAddress[0].ZipCode || 0,
            };
          }
          DestinationAddress =
            this.state.isCopy === true
              ? this.state.DestinationAddress
              : this.state.containerLoadType.toUpperCase() === "AIR"
              ? this.state.podfullAddData.AirportLongName
              : this.state.podfullAddData.OceanPortLongName;
        }

        if (this.state.typeofMove == 4) {
          if (this.props.location.state.pickUpAddress.length > 0) {
            PickUpAddressDetails = {
              Street: this.props.location.state.pickUpAddress[0].Area || "",
              Country: this.props.location.state.pickUpAddress[0].Country || "",
              State: this.props.location.state.pickUpAddress[0].State || "",
              City: this.props.location.state.pickUpAddress[0].City || "",
              ZipCode: this.props.location.state.pickUpAddress[0].ZipCode || 0,
            };
          } else {
            PickUpAddressDetails = {
              Street: "",
              Country: "",
              State: "",
              City: "",
              ZipCode: 0,
            };
          }
          if (this.props.location.state.destAddress.length > 0) {
            DestinationAddressDetails = {
              Street: this.props.location.state.destAddress[0].Area || "",
              Country: this.props.location.state.destAddress[0].Country || "",
              State: this.props.location.state.destAddress[0].State || "",
              City: this.props.location.state.destAddress[0].City || "",
              ZipCode: this.props.location.state.destAddress[0].ZipCode || 0,
            };
          } else {
            DestinationAddressDetails = {
              Street: "",
              Country: "",
              State: "",
              City: "",
              ZipCode: 0,
            };
          }
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
              Street: this.props.location.state.destAddress[0].Area || "",
              Country: this.props.location.state.destAddress[0].Country || "",
              State: this.props.location.state.destAddress[0].State || "",
              City: this.props.location.state.destAddress[0].City || "",
              ZipCode: this.props.location.state.destAddress[0].ZipCode || 0,
            };
          } else {
            DestinationAddressDetails = {
              Street: "",
              Country: "",
              State: "",
              City: "",
              ZipCode: 0,
            };
          }
        }

        ////;;
        var senrequestpara = {
          ShipmentType: this.state.shipmentType,
          Inco_terms: this.state.incoTerm,
          TypesOfMove: this.state.typeofMove,
          PickUpAddress: PickUpAddress,
          DestinationAddress: DestinationAddress,
          HazMat: this.state.HazMat == true ? 1 : 0,

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

          Comments: txtRequestComments,
          FreeTime: txtRequestFreeTime,
          RateQueryDim: RateQueryDim,
          MailBody:
            "Hello Customer Name,      Greetings!!    Quotation for your requirement is generated by our Sales Team. To view the Qutation and its details please click here",
          Commodity: Number(this.state.CommodityID),
        };

        senrequestpara.ChargeableWt = parseFloat(this.state.cbmVal) || 0;

        var url = "";

        if (this.state.containerLoadType == "FCL") {
          senrequestpara.FCLSQBaseFreight = FCLSQBaseFreight;
          senrequestpara.FCLSQCharges = FCLSQCharges;
          senrequestpara.CustomClearance =
            this.state.CustomClearance == true ? 1 : 0;
          senrequestpara.Containerdetails = Containerdetails;

          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              (x) => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (data.length > 0) {
              if (
                data[0].RateLineId ===
                  this.state.rateOrgDetails[j].RateLineId &&
                data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
              ) {
                // aProfit =
                //   data[0].TotalAmount - this.state.rateOrgDetails[j].Total;
                aProfit = this.state.manProfitAmt[j].Total;

                rateid = this.state.rateOrgDetails[j].RateLineId;
                objProfitList.RateLineID = rateid;
                objProfitList.Profit = aProfit;
                ProfitListarr.push(objProfitList);
              }
            }
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

          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};

            var data = this.state.selectedDataRow.filter(
              (x) => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (data.length > 0) {
              if (
                data.length > 0 &&
                data[0].RateLineId ===
                  this.state.rateOrgDetails[j].RateLineId &&
                data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
              ) {
                aProfit = this.state.manProfitAmt[j].Total;
                rateid = this.state.rateOrgDetails[j].RateLineId;
                objProfitList.RateLineID = rateid;
                objProfitList.Profit = aProfit;
                ProfitListarr.push(objProfitList);
              }
            }
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

          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              (x) =>
                (x.RateLineId || x.RateLineID) ===
                (this.state.rateOrgDetails[j].RateLineId ||
                  this.state.rateOrgDetails[j].RateLineID)
            );
            var aProfit = 0;
            var rateid = 0;
            if (data.length > 0) {
              if (
                data.length > 0 &&
                (data[0].RateLineId || data[0].RateLineID) ===
                  (this.state.rateOrgDetails[j].RateLineId ||
                    this.state.rateOrgDetails[j].RateLineID) &&
                parseFloat(data[0].TotalAmount) >=
                  this.state.rateOrgDetails[j].Total
              ) {
                aProfit = this.state.manProfitAmt[j].Total;
                rateid = this.state.rateOrgDetails[j].RateLineId;
                objProfitList.RateLineID = rateid;
                objProfitList.Profit = aProfit;
                ProfitListarr.push(objProfitList);
              }
            }
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

          var ProfitListarr = [];

          for (let j = 0; j < this.state.rateOrgDetails.length; j++) {
            var objProfitList = {};
            var data = this.state.selectedDataRow.filter(
              (x) => x.RateLineId === this.state.rateOrgDetails[j].RateLineId
            );
            var aProfit = 0;
            var rateid = 0;
            if (data.length > 0) {
              if (
                data[0].RateLineId ===
                  this.state.rateOrgDetails[j].RateLineId &&
                data[0].TotalAmount >= this.state.rateOrgDetails[j].Total
              ) {
                aProfit = this.state.manProfitAmt[j].Total;
                rateid = this.state.rateOrgDetails[j].RateLineId;
                objProfitList.RateLineID = rateid;
                objProfitList.Profit = aProfit;
                ProfitListarr.push(objProfitList);
              }
            }
          }
          senrequestpara.ProfitList = ProfitListarr;
          url = `${appSettings.APIURL}/AirSalesQuoteInsertion`;
        }

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
          headers: authHeader(),
        })
          .then(function (response) {
            //
            if (response != null) {
              if (response.data != null) {
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    store.addNotification({
                      message:
                        "Sales Quote Created " +
                        response.data.Table[0].SalesQuoteNo,
                      type: "success", // 'default', 'success', 'info', 'warning','danger'
                      container: "top-right", // where to position the notifications
                      insert: "top",
                      dismiss: {
                        duration: appSettings.NotficationTime,
                      },
                    });
                    var SalesQuoteNo = response.data.Table[0].SalesQuoteNo;
                    if (usertype !== "Sales User") {
                      self.setState({
                        SalesQuoteNo,
                        loding: false,
                      });
                      self.AcceptQuotes();
                    } else {
                      self.setState({
                        SalesQuoteNo,
                      });
                      self.SendMail("Create");
                      // setTimeout(function() {
                      //   window.location.href = "quote-table";
                      // }, appSettings.NotficationTime);
                    }
                  }
                }
              }
            }
          })
          .catch((error) => {
            if (error.response.data) {
              var temperror = error.response.data;
              var err = temperror.split(":");
              store.addNotification({
                message: err[1].replace("}", ""),
                type: "danger", // 'default', 'success', 'info', 'warning','danger'
                container: "top-right", // where to position the notifications
                dismiss: {
                  duration: appSettings.NotficationTime,
                },
              });
            }

            self.setState({ loding: false });
          });
      } else {
        store.addNotification({
          message: "Please select customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      }
    } else {
      store.addNotification({
        message: "Please select atleast one Rate",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  SendRequestCopy() {
    if (this.state.selectedDataRow.length > 0) {
      //;
      if (this.state.CompanyID !== 0 || this.state.companyID !== 0) {
        var txtRequestDiscount,
          txtRequestFreeTime,
          txtRequestComments = "";
        txtRequestDiscount = 0;
        txtRequestFreeTime = 0;
        var containerLoadType = this.state.containerLoadType;

        var rateDetailsarr = this.state.selectedDataRow;
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
              Type:
                rateSubDetailsarr[j].Type || rateSubDetailsarr[j].ChargeType,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency,
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
              Type:
                rateSubDetailsarr[j].Type || rateSubDetailsarr[j].ChargeType,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency,
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
              Type:
                rateSubDetailsarr[j].Type || rateSubDetailsarr[j].ChargeType,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency,
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
              Type:
                rateSubDetailsarr[j].Type || rateSubDetailsarr[j].ChargeType,
              SellRate: rateSubDetailsarr[j].SellRate,
              BuyRate: rateSubDetailsarr[j].BuyRate,
              Currency: rateSubDetailsarr[j].BaseCurrency,
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

        //;
        var multiCBM = this.state.multiCBM;

        for (var i = 0; i < multiCBM.length; i++) {
          if (this.state.containerLoadType == "FCL") {
            //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity || 0,
              Lengths: multiCBM[i].Lengths || 0,
              Width: multiCBM[i].Width || 0,
              Height: multiCBM[i].Height || 0,
              GrossWt: multiCBM[i].GrossWt || 0,
              VolumeWeight: 0,
              Volume: 0,
              PackageType: multiCBM[i].PackageType || "",
            });
          }
          if (this.state.containerLoadType == "LCL") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity || 0,
              Lengths: multiCBM[i].Lengths || 0,
              Width: multiCBM[i].Width || 0,
              Height: multiCBM[i].Height || 0,
              GrossWt: multiCBM[i].GrossWt || 0,
              VolumeWeight: multiCBM[i].VolumeWeight || 0,
              Volume: multiCBM[i].CBM || multiCBM[i].Volume || 0,
              PackageType: multiCBM[i].PackageType || "",
            });
          }
          if (this.state.containerLoadType == "AIR") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity || 0,
              Lengths: multiCBM[i].Lengths || 0,
              Width: multiCBM[i].Width || 0,
              Height: multiCBM[i].Height || 0,
              GrossWt: multiCBM[i].GrossWt || 0,
              VolumeWeight: multiCBM[i].VolumeWeight || 0,
              Volume: 0,
              PackageType: multiCBM[i].PackageType || "",
            });
          }
          if (this.state.containerLoadType == "INLAND") {
            RateQueryDim.push({
              Quantity: multiCBM[i].Quantity || 0,
              Lengths: multiCBM[i].Lengths || 0,
              Width: multiCBM[i].Width || 0,
              Height: multiCBM[i].Height || 0,
              GrossWt: multiCBM[i].GrossWt || 0,
              VolumeWeight: multiCBM[i].VolumeWeight || 0,
              Volume: multiCBM[i].Volume || 0,
              PackageType: multiCBM[i].PackageType || "",
            });
          }
        }

        var RateQueryDimData = RateQueryDim;

        var ProfitListData = [];

        for (let k = 0; k < this.state.manProfitAmt.length; k++) {
          var obj = {};
          obj.RateLineID = this.state.manProfitAmt[k].RateLineId;
          obj.Profit = this.state.manProfitAmt[k].Total;
          ProfitListData.push(obj);
        }

        var senrequestpara = {
          ProfitList: ProfitListData,
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
          CompanyID: this.state.companyID,
        };

        var url = "";

        url = `${appSettings.APIURL}/SalesQuoteCopy`;

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
          headers: authHeader(),
        })
          .then(function (response) {
            //;
            if (response != null) {
              if (response.data != null) {
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    store.addNotification({
                      // title: "Success",
                      message: response.data.Table[0].Message,
                      type: "success", // 'default', 'success', 'info', 'warning','danger'
                      container: "top-right", // where to position the notifications
                      dismiss: {
                        duration: appSettings.NotficationTime,
                      },
                    });
                    var SalesQuoteNo = response.data.Table[0].SalesQuoteNo;
                    if (usertype !== "Sales User") {
                      self.setState({
                        SalesQuoteNo,
                      });

                      self.AcceptQuotes();

                      // setTimeout(function() {
                      //   window.location.href = "quote-table";
                      // }, 1000);
                    } else {
                      self.setState({ loding: false });
                      setTimeout(function () {
                        window.location.href = "quote-table";
                      }, 1000);
                    }
                    // window.location.href = "quote-table";
                  }
                }
              }
            }
          })
          .catch((error) => {
            //;
            self.setState({ loding: false });
          });
      } else {
        store.addNotification({
          // title: "Error",
          message: "Please select customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      }
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select atleast one rate",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  filterLocAll = (event) => {
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
      arrLocalsCharges: this.state.arrLocalsCharges,
    });
  };

  filterSurAll = (event) => {
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
      arrSurCharges: this.state.arrSurCharges,
    });
  };

  hanleProfitAmountChange(e) {
    const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({ ProfitAmount: e.target.value });
    }
  }

  ////handel profity update
  hanleProfitAmountUpdateSubmit() {
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
            (this.state.selectedDataRow[0].RateLineId ||
              this.state.selectedDataRow[0].RateLineID)
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
          (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
        );
        subratedetails = data;

        var getindex = this.state.manProfitAmt.findIndex(
          (x) => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
        );
        this.state.manProfitAmt[getindex].Total = parseFloat(
          this.state.ProfitAmount
        );
      } else {
        var data = this.state.rateSubDetails.filter(
          (x) =>
            x.RateLineID ===
            (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
        );

        var getindex = this.state.manProfitAmt.findIndex(
          (x) =>
            x.RateLineId ==
            (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
        );
        this.state.manProfitAmt[getindex].Total = parseFloat(
          this.state.ProfitAmount
        );

        subratedetails = data;

        // subratedetails.push(data);
      }
    }
    var rateSubDetailsarr = subratedetails;

    for (var i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
          (x) => x.RateLineId === rateDetailsarr[i].saleQuoteLineID
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

              for (var k = 0; k < rateSubDetailsarr.length; k++) {
                if (rateSubDetailsarr[k].Type == "Freight") {
                  rateSubDetailsarr[k].Total =
                    parseFloat(rateSubDetailsarr[k].Total.split(" ")[0]) -
                    parseFloat(alledProfitAmount) +
                    " " +
                    rateSubDetailsarr[k].Total.split(" ")[1];

                  rateSubDetailsarr[k].Amount =
                    parseFloat(rateSubDetailsarr[k].Amount.split(" ")[0]) -
                    parseFloat(alledProfitAmount) +
                    " " +
                    rateSubDetailsarr[k].Total.split(" ")[1];
                  var untiprice =
                    parseFloat(alledProfitAmount) /
                    parseFloat(
                      rateSubDetailsarr[k].Exrate || rateSubDetailsarr[k].ExRate
                    );
                  rateSubDetailsarr[k].BuyRate -= parseFloat(
                    untiprice.toFixed(2)
                  );
                  //}
                  break;
                }
              }
            } else {
              store.addNotification({
                // title: "Error",
                message:
                  "Price should not be less than " + rateOrgDetailsarr[0].Total,
                type: "danger", // 'default', 'success', 'info', 'warning','danger'
                container: "top-right", // where to position the notifications
                dismiss: {
                  duration: appSettings.NotficationTime,
                },
              });
            }
          }
        }
      } else {
        var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
          (x) =>
            x.RateLineId ===
            (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
        );
        var tAmount = (
          parseFloat(rateDetailsarr[i].TotalAmount) -
          parseFloat(alledProfitAmount)
        ).toFixed(2);
        if (parseFloat(tAmount) >= rateOrgDetailsarr[0].Total) {
          rateDetailsarr[i].TotalAmount =
            parseFloat(rateDetailsarr[i].TotalAmount) -
            parseFloat(alledProfitAmount);

          for (var j = 0; j <= rateSubDetailsarr.length; j++) {
            if (rateSubDetailsarr[j].ChargeType == "Freight") {
              rateSubDetailsarr[j].TotalAmount =
                parseFloat(rateSubDetailsarr[j].TotalAmount) -
                parseFloat(alledProfitAmount);

              var untiprice =
                parseFloat(alledProfitAmount) /
                parseFloat(rateSubDetailsarr[j].Exrate || 1);
              rateSubDetailsarr[j].Rate -= parseFloat(untiprice.toFixed(2));
              break;
            }
          }
        } else {
          store.addNotification({
            // title: "Error",
            message:
              "Price should not be less than " + rateOrgDetailsarr[0].Total,
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime,
            },
          });
        }
      }
    }

    for (let j = 0; j < rateSubDetailsarr.length; j++) {
      if (this.state.isCopy === true) {
        var total = parseFloat(rateSubDetailsarr[j].Total.split(" ")[0]);
        profitLossAmt += total - (rateSubDetailsarr[j].BuyRate || 0);
        BuyRate += rateSubDetailsarr[j].BuyRate;
      } else {
        profitLossAmt +=
          rateSubDetailsarr[j].TotalAmount - rateSubDetailsarr[j].BuyRate;

        BuyRate += rateSubDetailsarr[j].BuyRate;
      }
    }

    for (var i = 0; i <= rateSubDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        if (rateSubDetailsarr[i].Type == "Freight") {
          rateSubDetailsarr[i].Total =
            (
              parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) +
              parseFloat(this.state.ProfitAmount)
            ).toFixed(2) +
            " " +
            rateSubDetailsarr[i].Total.split(" ")[1];
          rateSubDetailsarr[i].Amount =
            (
              parseFloat(rateSubDetailsarr[i].Amount.split(" ")[0]) +
              parseFloat(this.state.ProfitAmount)
            ).toFixed(2) +
            " " +
            rateSubDetailsarr[i].Amount.split(" ")[1];
          var untiprice =
            parseFloat(this.state.ProfitAmount) /
            parseFloat(
              rateSubDetailsarr[i].Exrate || rateSubDetailsarr[i].ExRate
            );
          rateSubDetailsarr[i].BuyRate += parseFloat(untiprice.toFixed(2));
          break;
        }
      } else {
        if (rateSubDetailsarr[i].ChargeType == "Freight") {
          rateSubDetailsarr[i].TotalAmount = (
            parseFloat(rateSubDetailsarr[i].TotalAmount) +
            parseFloat(this.state.ProfitAmount)
          ).toFixed(2);
          var untiprice =
            parseFloat(this.state.ProfitAmount) /
            parseFloat(rateSubDetailsarr[i].Exrate);
          var NunitPrice =
            rateSubDetailsarr[i].Rate + parseFloat(untiprice.toFixed(2));
          rateSubDetailsarr[i].Rate = parseFloat(NunitPrice.toFixed(2));

          break;
        }
      }
    }
    for (var i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        rateDetailsarr[i].Total =
          (
            parseFloat(rateDetailsarr[i].Total.split(" ")[0]) +
            parseFloat(this.state.ProfitAmount)
          ).toFixed(2) +
          " " +
          rateDetailsarr[i].Total.split(" ")[1];
      } else {
        rateDetailsarr[i].TotalAmount = (
          parseFloat(rateDetailsarr[i].TotalAmount) +
          parseFloat(this.state.ProfitAmount)
        ).toFixed(2);
      }
    }

    if (this.state.isCopy) {
      // profitLossAmt = profitLossAmt - alledProfitAmount;
      var finalprofitLossAmt =
        profitLossAmt + parseFloat(this.state.ProfitAmount);
      var finalprofitLossPer = 0;
      var finalprofitLossPer =
        (finalprofitLossAmt * 100) /
        parseFloat(this.state.selectedDataRow[0].Total.split(" ")[0]);
    } else {
      // profitLossAmt = profitLossAmt - alledProfitAmount;
      var finalprofitLossAmt =
        profitLossAmt + parseFloat(this.state.ProfitAmount);
      var finalprofitLossPer = 0;
      var finalprofitLossPer =
        (finalprofitLossAmt * 100) /
        parseFloat(this.state.selectedDataRow[0].TotalAmount);
    }

    this.setState({
      profitLossAmt: finalprofitLossAmt,
      profitLossPer: finalprofitLossPer,
    });

    this.setState((prevState) => ({
      modalProfit: false,
    }));

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
      Addedprofit: this.state.ProfitAmount,
    });
    this.forceUpdate();
  }
  ////handle profity add
  hanleProfitAmountSubmit() {
    var rateDetailsarr = this.state.selectedDataRow;

    var subratedetails = [];
    var BuyRate = 0;
    for (let i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy === true) {
        var data = this.state.rateSubDetails.filter(
          (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
        );
        // this.state.rateSubDetails.filter(x=>x.SaleQuoteIDLineID===this.state.rateDetails[i].saleQuoteLineID)
        for (let k = 0; k < data.length; k++) {
          subratedetails.push(data[k]);
        }
      } else {
        var data = this.state.rateSubDetails.filter(
          (x) =>
            x.RateLineID === rateDetailsarr[i].RateLineId ||
            rateDetailsarr[i].RateLineID
        );
        for (let i = 0; i < data.length; i++) {
          subratedetails.push(data[i]);
        }
      }
    }
    var rateSubDetailsarr = subratedetails;

    for (let i = 0; i < rateDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        var totalval =
          parseFloat(rateDetailsarr[i].Total.split(" ")[0]) +
          parseFloat(this.state.ProfitAmount);
        rateDetailsarr[i].Total =
          totalval + " " + rateDetailsarr[i].Total.split(" ")[1];

        var getindex = this.state.manProfitAmt.findIndex(
          (x) => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
        );
        this.state.manProfitAmt[getindex].Total += parseFloat(
          this.state.ProfitAmount
        );
      } else {
        var totalval =
          parseFloat(rateDetailsarr[i].TotalAmount) +
          parseFloat(this.state.ProfitAmount);
        rateDetailsarr[i].TotalAmount = totalval.toFixed(2);

        var getindex = this.state.manProfitAmt.findIndex(
          (x) =>
            x.RateLineId == rateDetailsarr[i].RateLineId ||
            rateDetailsarr[i].RateLineID
        );
        this.state.manProfitAmt[getindex].Total += parseFloat(
          this.state.ProfitAmount
        );
      }
    }

    for (let i = 0; i <= rateSubDetailsarr.length; i++) {
      if (this.state.isCopy == true) {
        if (rateSubDetailsarr[i].Type == "Freight") {
          rateSubDetailsarr[i].Total =
            parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) +
            parseFloat(this.state.ProfitAmount) +
            " " +
            rateSubDetailsarr[i].Total.split(" ")[1];
          rateSubDetailsarr[i].Amount =
            parseFloat(rateSubDetailsarr[i].Amount.split(" ")[0]) +
            parseFloat(this.state.ProfitAmount) +
            " " +
            rateSubDetailsarr[i].Amount.split(" ")[1];
          var untiprice =
            parseFloat(this.state.ProfitAmount) /
            parseFloat(
              rateSubDetailsarr[i].ExRate || rateSubDetailsarr[i].Exrate
            );

          rateSubDetailsarr[i].BuyRate += parseFloat(untiprice.toFixed(2));

          break;
        }
      } else {
        if (rateSubDetailsarr[i].ChargeType == "Freight") {
          var totalVal =
            parseFloat(rateSubDetailsarr[i].TotalAmount) +
            parseFloat(this.state.ProfitAmount);
          rateSubDetailsarr[i].TotalAmount = totalVal.toFixed(2);

          var untiprice =
            parseFloat(this.state.ProfitAmount) /
            parseFloat(rateSubDetailsarr[i].Exrate);
          rateSubDetailsarr[i].Rate =
            parseFloat(rateSubDetailsarr[i].Rate) +
            parseFloat(untiprice.toFixed(2));

          break;
        }
      }
    }

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

    this.setState((prevState) => ({
      modalProfit: false,
    }));
    this.setState({
      toggleProfitRemoveBtn: true,
      Addedprofit: this.state.ProfitAmount,
      profitLossAmt: finalprofitLossAmt,
      profitLossPer: finalprofitLossPer,
    });
    this.forceUpdate();
  }
  ////Remove profit Button
  hanleProfitAmountRemove() {
    var alledProfitAmount = 0;
    var rateOrgDetailsarr = null;
    if (this.state.selectedDataRow.length === 1) {
      var showUpdate = false;

      for (let i = 0; i < this.state.rateOrgDetails.length; i++) {
        if (this.state.isCopy === true) {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            this.state.selectedDataRow[0].saleQuoteLineID
          ) {
            if (this.state.rateOrgDetails[i].Total) {
              var total = this.state.selectedDataRow[0].Total.split(" ")[0];
              var total1 = this.state.rateOrgDetails[i].Total.split(" ")[0];

              alledProfitAmount = this.state.manProfitAmt[i].Total;
            }
          }
        } else {
          if (
            this.state.rateOrgDetails[i].RateLineId ===
            (this.state.selectedDataRow[0].RateLineId ||
              this.state.selectedDataRow[0].RateLineID)
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
            (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
          );
          subratedetails = data;
        } else {
          var data = this.state.rateSubDetails.filter(
            (x) =>
              x.RateLineID ===
              (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
          );
          for (let i = 0; i < data.length; i++) {
            subratedetails.push(data[i]);
          }
        }
      }
      var rateSubDetailsarr = subratedetails;

      for (var i = 0; i < rateDetailsarr.length; i++) {
        if (this.state.isCopy == true) {
          rateOrgDetailsarr = this.state.rateOrgDetails.filter(
            (x) => x.RateLineId === rateDetailsarr[i].saleQuoteLineID
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
              (x) => x.RateLineId == rateDetailsarr[i].saleQuoteLineID
            );
            this.state.manProfitAmt[getindex].Total -= parseFloat(
              this.state.ProfitAmount
            );

            for (var i = 0; i <= rateSubDetailsarr.length; i++) {
              if (rateSubDetailsarr[i].Type == "Freight") {
                rateSubDetailsarr[i].Total =
                  parseFloat(rateSubDetailsarr[i].Total.split(" ")[0]) -
                  parseFloat(this.state.ProfitAmount) +
                  " " +
                  rateSubDetailsarr[i].Total.split(" ")[1];
                rateSubDetailsarr[i].Amount =
                  parseFloat(rateSubDetailsarr[i].Amount.split(" ")[0]) -
                  parseFloat(this.state.ProfitAmount) +
                  " " +
                  rateSubDetailsarr[i].Amount.split(" ")[1];

                var untiprice =
                  parseFloat(this.state.ProfitAmount) /
                  parseFloat(
                    rateSubDetailsarr[i].Exrate || rateSubDetailsarr[i].ExRate
                  );
                rateSubDetailsarr[i].BuyRate -= parseFloat(
                  untiprice.toFixed(2)
                );
                break;
              }
            }
          } else {
            store.addNotification({
              // title: "Error",
              message: "Please enter valid profit amount.",
              type: "danger", // 'default', 'success', 'info', 'warning','danger'
              container: "top-right", // where to position the notifications
              dismiss: {
                duration: appSettings.NotficationTime,
              },
            });
          }
        } else {
          var rateOrgDetailsarr = this.state.rateOrgDetails.filter(
            (x) =>
              x.RateLineId ===
              (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
          );

          var tAmount = (
            parseFloat(rateDetailsarr[i].TotalAmount) -
            parseFloat(this.state.ProfitAmount)
          ).toFixed(2);
          if (parseFloat(tAmount) >= rateOrgDetailsarr[0].Total) {
            rateDetailsarr[i].TotalAmount = (
              parseFloat(rateDetailsarr[i].TotalAmount) -
              parseFloat(this.state.ProfitAmount)
            ).toFixed(2);
            var getindex = this.state.manProfitAmt.findIndex(
              (x) =>
                x.RateLineId ==
                (rateDetailsarr[i].RateLineId || rateDetailsarr[i].RateLineID)
            );
            this.state.manProfitAmt[getindex].Total -= parseFloat(
              this.state.ProfitAmount
            );

            ////air
            for (var j = 0; j <= rateSubDetailsarr.length; j++) {
              if (rateSubDetailsarr[j].ChargeType == "Freight") {
                rateSubDetailsarr[j].TotalAmount = (
                  parseFloat(rateSubDetailsarr[j].TotalAmount) -
                  parseFloat(this.state.ProfitAmount)
                ).toFixed(2);

                var untiprice =
                  parseFloat(this.state.ProfitAmount) /
                  parseFloat(rateSubDetailsarr[j].Exrate || 1);
                var finalrate =
                  parseFloat(rateSubDetailsarr[j].Rate) -
                  parseFloat(untiprice.toFixed(2));
                rateSubDetailsarr[j].Rate = finalrate.toFixed(2);
                break;
              }
            }
          } else {
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
        profitLossPer: finalprofitLossPer,
      });

      this.toggleLoss();
      this.setState({
        toggleProfitRemoveBtn: false,
        modalProfit: false,
      });
      this.forceUpdate();
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please enter valid profit amount.",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });
    }
  }

  processText(inputText) {
    var json = inputText.toString().split(" ");

    return json;
  }
  ////toggle local and surcharge check box
  HandleLocalSearchCharges(element, index, e) {
    
    var rateDetailsarr = this.state.selectedDataRow;
    var getindex = 0;
    var BuyRate = 0;
    var profitLossAmt = this.state.profitLossAmt || 0;
    var profitLossPer = this.state.profitLossPer || 0;
    var SurchargeLocalchargeID = [];
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
          var newvalLine=element.LineName||"";
          if (
            newvalLine.toUpperCase() == newLineName &&
            element.ContainerType === rateDetailsarr[i].ContainerType
          ) {
            getindex = this.state.rateDetails.findIndex(
              (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
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
                parseFloat(total) + parseFloat(element.AmountInBaseCurrency)
              ).toFixed(2);

              this.state.rateDetails[getindex].Total =
                final_sum + " " + currency;

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.saleQuoteLineID ===
                  this.state.rateDetails[getindex].saleQuoteLineID
              );

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

              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer,
              });

              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];

              this.setState({
                localsurAmount,
                cSelectChackBox: newSelected,
              });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Amount: element.Amount + " " + element.Currency,
                Currency: element.Currency,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                Chargeitem: element.ChargeItem,
                ExRate: element.Exrate,
                ChargeType: e.target.name,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency,
              };
              if (this.state.containerLoadType == "LCL") {
                newrateSubDetails.SaleQuoteIDLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              } else {
                newrateSubDetails.saleQuoteLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              }
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
              var total = 0;
              var currency = "";

              var data = this.state.rateDetails[getindex].Total.split(" ");
              total = data[0];
              currency = data[1];

              var final_sum =
                parseFloat(total) + parseFloat(element.AmountInBaseCurrency);

              this.state.rateDetails[getindex].Total =
                final_sum + " " + currency;

              var calAmount = parseFloat(element.AmountInBaseCurrency);

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

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

              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer,
              });
              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];

              this.setState({
                localsurAmount,
                cSelectChackBox: newSelected,
              });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Amount: element.Amount + " " + element.Currency,
                Currency: element.Currency,
                SaleQuoteID: this.state.rateDetails[getindex].SaleQuoteID,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                Chargeitem: element.ChargeItem,
                ExRate: element.Exrate,
                ChargeType: e.target.name,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency,
              };
              if (this.state.containerLoadType == "LCL") {
                newrateSubDetails.SaleQuoteIDLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              } else {
                newrateSubDetails.saleQuoteLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              }
              if (
                this.state.containerLoadType == "FTL" ||
                this.state.containerLoadType == "LTL"
              ) {
                newrateSubDetails.saleQuoteLineID = this.state.rateDetails[
                  i
                ].saleQuoteLineID;
              }

              this.state.rateSubDetails = this.state.rateSubDetails.concat(
                newrateSubDetails
              );
            }
          } else {
            if (
              this.state.containerLoadType == "FTL" ||
              this.state.containerLoadType == "LTL" ||
              this.state.containerLoadType == "LCL"||
              this.state.containerLoadType == "AIR"
            ) {
              var total = 0;
              var currency = "";

              var data = this.state.rateDetails[i].Total.split(" ");
              total = data[0];
              currency = data[1];

              var final_sum = (
                parseFloat(total) + parseFloat(element.AmountInBaseCurrency)
              ).toFixed(2);

              this.state.rateDetails[i].Total = final_sum + " " + currency;

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
              );

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

              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer,
              });

              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];

              this.setState({
                localsurAmount,
                cSelectChackBox: newSelected,
              });
              var newrateSubDetails = {
                ChargeID: element.ChargeID,
                BuyRate: element.Buying,
                Amount: element.Amount + " " + element.Currency,
                Currency: element.Currency,
                SaleQuoteID: this.state.rateDetails[getindex].SaleQuoteID,
                ChargeCode: element.ChargeCode,
                ChargeDesc: element.ChargeDesc,
                Tax: 0,
                Chargeitem: element.ChargeItem,
                ExRate: element.Exrate,
                ChargeType: e.target.name,
                Total:
                  parseFloat(element.AmountInBaseCurrency) +
                  " " +
                  element.BaseCurrency,
                BaseCurrency: element.BaseCurrency,
              };
              if (this.state.containerLoadType == "LCL") {
                newrateSubDetails.SaleQuoteIDLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              } else {
                newrateSubDetails.saleQuoteLineID = this.state.rateDetails[
                  getindex
                ].saleQuoteLineID;
              }
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
                  (x) =>
                    x.RateLineId === rateDetailsarr[i].RateLineId ||
                    rateDetailsarr[i].RateLineID
                );

                this.state.rateDetails[getindex].TotalAmount =
                  parseFloat(
                    this.state.rateDetails[getindex].TotalAmount == null
                      ? 0
                      : this.state.rateDetails[getindex].TotalAmount
                  ) + parseFloat(element.AmountInBaseCurrency);

                var calAmount = parseFloat(element.AmountInBaseCurrency);
                var localsurAmount = this.state.localsurAmount + calAmount;

                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  (x) =>
                    x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                  profitLossPer: finalprofitLossPer,
                });

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
                  ChargeType: e.target.name,
                  TotalAmount: parseFloat(element.AmountInBaseCurrency),
                  BaseCurrency: element.BaseCurrency,
                };
                SurchargeLocalchargeID = this.state.SurchargeLocalchargeID;
                var objSurchargeLocal = {};
                objSurchargeLocal.RateQueryid = this.state.rateDetails[
                  getindex
                ].RateLineId;
                objSurchargeLocal.SurchargeId = element.ChargeID;
                objSurchargeLocal.ChargeType = e.target.name;
                SurchargeLocalchargeID.push(objSurchargeLocal);

                const newSelected = Object.assign(
                  {},
                  this.state.cSelectChackBox
                );
                newSelected[element.RowIndex + element.ChargeCode] = !this.state
                  .cSelectChackBox[element.RowIndex + element.ChargeCode];

                this.setState({
                  localsurAmount,
                  SurchargeLocalchargeID,
                  cSelectChackBox: newSelected,
                });
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
                (x) =>
                  x.RateLineId === rateDetailsarr[i].RateLineId ||
                  rateDetailsarr[i].RateLineID
              );

              this.state.rateDetails[getindex].TotalAmount =
                parseFloat(
                  this.state.rateDetails[getindex].TotalAmount == null
                    ? 0
                    : this.state.rateDetails[getindex].TotalAmount
                ) + parseFloat(element.AmountInBaseCurrency);

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                profitLossPer: finalprofitLossPer,
              });

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
                ChargeType: e.target.name,
                TotalAmount: parseFloat(element.AmountInBaseCurrency),
                BaseCurrency: element.BaseCurrency,
              };
              SurchargeLocalchargeID = this.state.SurchargeLocalchargeID;
              var objSurchargeLocal = {};
              objSurchargeLocal.RateQueryid = this.state.rateDetails[
                getindex
              ].RateLineId;
              objSurchargeLocal.SurchargeId = element.ChargeID;
              objSurchargeLocal.ChargeType = e.target.name;
              SurchargeLocalchargeID.push(objSurchargeLocal);

              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];
              this.setState({
                localsurAmount,
                SurchargeLocalchargeID,
                cSelectChackBox: newSelected,
              });
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
              this.state.containerLoadType == "LCL"||
              this.state.containerLoadType == "AIR"
            ) {
              getindex = this.state.rateDetails.findIndex(
                (x) =>
                  x.RateLineId === rateDetailsarr[i].RateLineId ||
                  rateDetailsarr[i].RateLineID
              );
              this.state.rateDetails[i].TotalAmount = (
                parseFloat(
                  this.state.rateDetails[i].TotalAmount == null
                    ? 0
                    : this.state.rateDetails[i].TotalAmount
                ) + parseFloat(element.AmountInBaseCurrency)
              ).toFixed(2);

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount + calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                profitLossPer: finalprofitLossPer,
              });

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
                ChargeType: e.target.name,
                TotalAmount: parseFloat(element.AmountInBaseCurrency),
                BaseCurrency: element.BaseCurrency,
              };
              SurchargeLocalchargeID = this.state.SurchargeLocalchargeID;
              var objSurchargeLocal = {};
              objSurchargeLocal.RateQueryid = this.state.rateDetails[
                getindex
              ].RateLineId;
              objSurchargeLocal.SurchargeId = element.ChargeID;
              objSurchargeLocal.ChargeType = e.target.name;
              SurchargeLocalchargeID.push(objSurchargeLocal);

              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];
              this.setState({
                localsurAmount,
                SurchargeLocalchargeID,
                cSelectChackBox: newSelected,
              });
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

      var finalval = this.state.profitLossAmt;

      var aTotalAmount = 0;
      if (this.state.selectedDataRow.length > 0) {
        if (this.state.isCopy) {
          aTotalAmount = this.state.selectedDataRow.reduce(function (
            prev,
            cur
          ) {
            return prev + parseFloat(cur.Total.split(" ")[0]);
          },
          0);
        } else {
          aTotalAmount = this.state.selectedDataRow.reduce(function (
            prev,
            cur
          ) {
            return prev + parseFloat(cur.TotalAmount);
          },
          0);
        }
      }

      var finalprofitval = (finalval * 100) / aTotalAmount;
      this.setState({ profitLossPer: finalprofitval });
      this.forceUpdate();
    }
    if (!e.target.checked) {
      var getindex = 0;
      for (var i = 0; i < rateDetailsarr.length; i++) {
        var linename = "";
        if (rateDetailsarr[i].lineName) {
          linename = rateDetailsarr[i].lineName;
        } else {
          linename = rateDetailsarr[i].Linename;
        }
        var newLineName=element.LineName||"";
        if (newLineName.toUpperCase() == linename.toUpperCase()) {
          if (this.state.isCopy === true) {
            getindex = this.state.rateDetails.findIndex(
              (x) => x.saleQuoteLineID === rateDetailsarr[i].saleQuoteLineID
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
                parseFloat(element.AmountInBaseCurrency) +
                " " +
                amount[1];

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount - calAmount;
              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
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

              var profitLossPer1 = (newprofitLossAmt * 100) / BuyRate;
              var finalprofitLossPer = profitLossPer - profitLossPer1;

              newprofitLossAmt -= finalAmountInBaseCurrency;
              BuyRate -= element.Buying;

              var profitLossPer = (newprofitLossAmt * 100) / BuyRate;
              finalprofitLossPer += profitLossPer;

              this.setState({
                profitLossAmt: profitLossAmt - finalAmountInBaseCurrency,
                profitLossPer: finalprofitLossPer,
              });

              this.setState({ localsurAmount });
              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];

              this.setState({
                localsurAmount,
                cSelectChackBox: newSelected,
              });
              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode &&
                  this.state.rateSubDetails[j]["ChargeType"] == e.target.name &&
                  this.state.rateDetails[getindex].saleQuoteLineID ===
                    this.state.rateSubDetails[j]["saleQuoteLineID"]
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
                  (
                    parseFloat(amount[0]) -
                    parseFloat(element.AmountInBaseCurrency)
                  ).toFixed(2) +
                  " " +
                  amount[1];
                var calAmount = parseFloat(element.AmountInBaseCurrency);
                var localsurAmount = this.state.localsurAmount - calAmount;
                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  (x) =>
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
                  profitLossPer: finalprofitLossPer,
                });

                this.setState({ localsurAmount });
                const newSelected = Object.assign(
                  {},
                  this.state.cSelectChackBox
                );
                newSelected[element.RowIndex + element.ChargeCode] = !this.state
                  .cSelectChackBox[element.RowIndex + element.ChargeCode];

                this.setState({
                  localsurAmount,
                  cSelectChackBox: newSelected,
                });
                for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                  if (
                    this.state.rateSubDetails[j]["ChargeCode"] ==
                      element.ChargeCode &&
                    this.state.rateSubDetails[j]["ChargeType"] ==
                      e.target.name &&
                    this.state.rateDetails[getindex].saleQuoteLineID ===
                      this.state.rateSubDetails[j]["saleQuoteLineID"]
                  ) {
                    this.state.rateSubDetails.splice(j, 1);
                    break;
                  }
                }
              } else {
                if (this.state.containerLoadType !== "FCL") {
                  var amount = this.processText(
                    this.state.rateDetails[getindex].Total
                  );
                  this.state.rateDetails[getindex].Total =
                    (
                      parseFloat(amount[0]) -
                      parseFloat(element.AmountInBaseCurrency)
                    ).toFixed(2) +
                    " " +
                    amount[1];
                  var calAmount = parseFloat(element.AmountInBaseCurrency);
                  var localsurAmount = this.state.localsurAmount - calAmount;
                  var DatarateSubDetails = this.state.rateSubDetails.filter(
                    (x) =>
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
                    profitLossPer: finalprofitLossPer,
                  });

                  this.setState({ localsurAmount });
                  const newSelected = Object.assign(
                    {},
                    this.state.cSelectChackBox
                  );
                  newSelected[element.RowIndex + element.ChargeCode] = !this
                    .state.cSelectChackBox[
                    element.RowIndex + element.ChargeCode
                  ];

                  this.setState({
                    localsurAmount,
                    cSelectChackBox: newSelected,
                  });
                  for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                    if ((this.state.containerLoadType = "LCL")) {
                      if (
                        this.state.rateSubDetails[j]["ChargeCode"] ==
                          element.ChargeCode &&
                        this.state.rateSubDetails[j]["ChargeType"] ==
                          e.target.name &&
                        this.state.rateDetails[getindex].saleQuoteLineID ===
                          this.state.rateSubDetails[j]["SaleQuoteIDLineID"]
                      ) {
                        this.state.rateSubDetails.splice(j, 1);
                        break;
                      }
                    } else {
                      if (
                        this.state.rateSubDetails[j]["ChargeCode"] ==
                          element.ChargeCode &&
                        this.state.rateSubDetails[j]["ChargeType"] ==
                          e.target.name &&
                        this.state.rateDetails[getindex].saleQuoteLineID ===
                          this.state.rateSubDetails[j]["saleQuoteLineID"]
                      ) {
                        this.state.rateSubDetails.splice(j, 1);
                        break;
                      }
                    }
                  }
                }
              }
            }
          } else {
            getindex = this.state.rateDetails.findIndex(
              (x) =>
                x.RateLineId === rateDetailsarr[i].RateLineId ||
                rateDetailsarr[i].RateLineID
            );
            if (
              this.state.containerLoadType === "FCL" &&
              element.ContainerType ===
                this.state.rateDetails[getindex].ContainerType
            ) {
              this.state.rateDetails[getindex].TotalAmount =
                parseFloat(this.state.rateDetails[getindex].TotalAmount) -
                parseFloat(element.AmountInBaseCurrency);

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount - calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                profitLossPer: finalprofitLossPer,
              });

              this.setState({ localsurAmount });
              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];
              this.setState({
                cSelectChackBox: newSelected,
              });

              var getindexLocal = this.state.SurchargeLocalchargeID.findIndex(
                (x) =>
                  x.RateQueryid ===
                    this.state.rateDetails[getindex].RateLineId &&
                  x.SurchargeId === element.ChargeID
              );
              this.state.SurchargeLocalchargeID.splice(getindexLocal, 1);
              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode &&
                  this.state.rateSubDetails[j]["ChargeType"] == e.target.name &&
                  this.state.rateDetails[getindex].RateLineId ===
                    this.state.rateSubDetails[j]["RateLineID"]
                ) {
                  this.state.rateSubDetails.splice(j, 1);

                  break;
                }
              }
            } else {
              if (this.state.containerLoadType === "AIR") {
                this.state.rateDetails[getindex].TotalAmount =
                  parseFloat(this.state.rateDetails[getindex].TotalAmount) -
                  parseFloat(element.AmountInBaseCurrency);

                var calAmount = parseFloat(element.AmountInBaseCurrency);
                var localsurAmount = this.state.localsurAmount - calAmount;

                var DatarateSubDetails = this.state.rateSubDetails.filter(
                  (x) =>
                    x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                  profitLossPer: finalprofitLossPer,
                });

                this.setState({ localsurAmount });
                const newSelected = Object.assign(
                  {},
                  this.state.cSelectChackBox
                );
                newSelected[element.RowIndex + element.ChargeCode] = !this.state
                  .cSelectChackBox[element.RowIndex + element.ChargeCode];
                this.setState({
                  cSelectChackBox: newSelected,
                });

                var getindexLocal = this.state.SurchargeLocalchargeID.findIndex(
                  (x) =>
                    x.RatequeryID ===
                      this.state.rateDetails[getindex].RateLineId &&
                    x.SurchargeId === element.ChargeID
                );
                this.state.SurchargeLocalchargeID.splice(getindexLocal, 1);

                for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                  if (
                    this.state.rateSubDetails[j]["ChargeCode"] ==
                      element.ChargeCode &&
                    this.state.rateSubDetails[j]["ChargeType"] ==
                      e.target.name &&
                    this.state.rateDetails[getindex].RateLineId ===
                      this.state.rateSubDetails[j]["RateLineID"]
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
            this.state.containerLoadType == "LCL"||
            this.state.containerLoadType == "AIR"
          ) {
            if (this.state.isCopy === true) {
              var amount = this.processText(this.state.rateDetails[i].Total);

              this.state.rateDetails[i].Total =
                parseFloat(amount[0]) -
                parseFloat(element.AmountInBaseCurrency) +
                " " +
                amount[1];

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount - calAmount;
              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
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
                profitLossPer: finalprofitLossPer,
              });

              this.setState({ localsurAmount });
              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];

              this.setState({
                localsurAmount,
                cSelectChackBox: newSelected,
              });
              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode &&
                  this.state.rateSubDetails[j]["ChargeType"] == e.target.name &&
                  this.state.rateDetails[getindex].saleQuoteLineID ===
                    this.state.rateSubDetails[j]["saleQuoteLineID"]
                ) {
                  this.state.rateSubDetails.splice(j, 1);
                  break;
                }
              }
            } else {
              this.state.rateDetails[i].TotalAmount =
                parseFloat(this.state.rateDetails[i].TotalAmount) -
                parseFloat(element.AmountInBaseCurrency);

              var calAmount = parseFloat(element.AmountInBaseCurrency);
              var localsurAmount = this.state.localsurAmount - calAmount;

              var DatarateSubDetails = this.state.rateSubDetails.filter(
                (x) =>
                  x.RateLineID === this.state.rateDetails[getindex].RateLineId
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
                profitLossPer: finalprofitLossPer,
              });
              this.setState({ localsurAmount });
              const newSelected = Object.assign({}, this.state.cSelectChackBox);
              newSelected[element.RowIndex + element.ChargeCode] = !this.state
                .cSelectChackBox[element.RowIndex + element.ChargeCode];
              this.setState({
                cSelectChackBox: newSelected,
              });

              var getindexLocal = this.state.SurchargeLocalchargeID.findIndex(
                (x) =>
                  x.RateQueryid ===
                    this.state.rateDetails[getindex].RateLineId &&
                  x.SurchargeId == element.ChargeID
              );
              this.state.SurchargeLocalchargeID.splice(getindexLocal, 1);
              for (var j = 0; j <= this.state.rateSubDetails.length; j++) {
                if (
                  this.state.rateSubDetails[j]["ChargeCode"] ==
                    element.ChargeCode &&
                  this.state.rateSubDetails[j]["ChargeType"] == e.target.name &&
                  this.state.rateDetails[i].RateLineId ===
                    this.state.rateSubDetails[j]["RateLineID"]
                ) {
                  this.state.rateSubDetails.splice(j, 1);

                  break;
                }
              }
            }
          }
        }
      }

      var finalval = this.state.profitLossAmt;

      var aTotalAmount = 0;
      if (this.state.selectedDataRow.length > 0) {
        if (this.state.isCopy) {
          aTotalAmount = this.state.selectedDataRow.reduce(function (
            prev,
            cur
          ) {
            return prev + parseFloat(cur.Total.split(" ")[0]);
          },
          0);
        } else {
          aTotalAmount = this.state.selectedDataRow.reduce(function (
            prev,
            cur
          ) {
            return prev + parseFloat(cur.TotalAmount);
          },
          0);
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
      headers: authHeader(),
    }).then(function (response) {
      var commodityData = response.data.Table;
      self.setState({ commodityData });
    });
  }

  SubmitCargoDetails(e) {
    var PackageDetailsArr = [];
    let CargoDetailsArr = [];
    var multiCBM = [];
    if (
      this.state.containerLoadType == "AIR" ||
      this.state.containerLoadType == "LCL" ||
      this.state.containerLoadType == "LTL" ||
      this.state.containerLoadType == "FTL" ||
      this.state.containerLoadType == "FCL" ||
      this.state.containerLoadType == "INLAND"
    ) {
      if (
        this.state.flattack_openTop.length > 0 &&
        !this.props.location.state.isViewRate
      ) {
        for (var i = 0; i < this.state.flattack_openTop.length; i++) {
          PackageDetailsArr.push({
            PackageType: this.state.flattack_openTop[i].PackageType,
            Quantity: this.state.flattack_openTop[i].Quantity,
            Lengths: this.state.flattack_openTop[i].Lengths,
            Width: this.state.flattack_openTop[i].Width,
            Height: this.state.flattack_openTop[i].Height,
            GrossWt: this.state.flattack_openTop[i].GrossWt,
            VolumeWeight: this.state.flattack_openTop[i].VolumeWeight,
            Volume: this.state.flattack_openTop[i].Volume,
          });
          multiCBM.push({
            PackageType: this.state.flattack_openTop[i].PackageType,
            Quantity: this.state.flattack_openTop[i].Quantity,
            Lengths: this.state.flattack_openTop[i].Lengths,
            Width: this.state.flattack_openTop[i].Width,
            Height: this.state.flattack_openTop[i].Height,
            GrossWt: this.state.flattack_openTop[i].GrossWt,
            VolumeWeight: this.state.flattack_openTop[i].VolumeWeight,
            Volume: this.state.flattack_openTop[i].Volume,
          });
        }
        this.setState({ multiCBM });
      } else {
        multiCBM = [...this.state.multiCBM];
        for (var i = 0; i < multiCBM.length; i++) {
          PackageDetailsArr.push({
            PackageType: multiCBM[i].PackageType,
            Quantity: multiCBM[i].Quantity,
            Lengths: multiCBM[i].Lengths,
            Width: multiCBM[i].Width,
            Height: multiCBM[i].Height,
            GrossWt: multiCBM[i].GrossWt,
            VolumeWeight: multiCBM[i].VolumeWeight,
            Volume: multiCBM[i].Volume,
          });
        }
      }

      this.setState({
        multiCBM: multiCBM,
      });
    } else {
      let flattack_openTop = [...this.state.flattack_openTop];
      for (var i = 0; i < flattack_openTop.length; i++) {
        PackageDetailsArr.push({
          PackageType: this.state.flattack_openTop[i].PackageType,
          Quantity: this.state.flattack_openTop[i].Quantity,
          Lengths: this.state.flattack_openTop[i].Lengths,
          Width: this.state.flattack_openTop[i].Width,
          Height: this.state.flattack_openTop[i].Height,
          GrossWt: this.state.flattack_openTop[i].GrossWt,
          VolumeWeight: this.state.flattack_openTop[i].VolumeWeight,
          Volume: this.state.flattack_openTop[i].Volume,
        });

        CargoDetailsArr.push({
          PackageType: this.state.flattack_openTop[i].PackageType,
          Quantity: this.state.flattack_openTop[i].Quantity,
          Lengths: this.state.flattack_openTop[i].Lengths,
          Width: this.state.flattack_openTop[i].Width,
          Height: this.state.flattack_openTop[i].Height,
          GrossWt: this.state.flattack_openTop[i].GrossWt,
          VolumeWeight: this.state.flattack_openTop[i].VolumeWeight,
          Volume: this.state.flattack_openTop[i].Volume,
        });
      }

      this.setState({
        flattack_openTop: flattack_openTop,
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
      CargoDetailsArr: CargoDetailsArr,
    });

    this.forceUpdate();
    this.toggleEdit();
  }

  HandleChangeCon(field, e) {
    let self = this;
    self.state.error = "";
    var customertxtlen = e.target.value;

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

  handleSelectCon(field, value, e) {
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
      ContactEmail: contactEmail,
    });
  }

  ////Handel Accept Accept Quotes
  AcceptQuotes() {
    let self = this;
    var SalesQuoteNumber = "";
    var QuoteType = "";

    SalesQuoteNumber = self.state.SalesQuoteNo;
    QuoteType = self.state.containerLoadType;

    var usertype = encryption(window.localStorage.getItem("usertype"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteApprove`,
      data: {
        Mode: QuoteType,
        SalesQuoteNumber: SalesQuoteNumber,
        isApprove: 1,
        MyUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      },
      headers: authHeader(),
    })
      .then(function (response) {
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                store.addNotification({
                  // title: "Success",
                  message: response.data.Table[0].Message,
                  type: "success", // 'default', 'success', 'info', 'warning','danger'
                  container: "top-right", // where to position the notifications
                  dismiss: {
                    duration: appSettings.NotficationTime,
                  },
                });

                self.SendMail("Create");
              }
            }
          }
        }

        // window.location.href = "quote-table";
      })
      .catch((error) => {
        var temperror = error.response.data;
        var err = temperror.split(":");
        self.setState({ loding: false });
        store.addNotification({
          // title: "Error",
          message: err[1].replace("}", ""),
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      });
  }

  SendMail(action) {
    let self = this;
    // this.togglePreview();

    var stringHtmlMain =
      "<!DOCTYPE html><html><head><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif}.row{display:flex;flex-wrap:wrap}.col-12{flex:0 0 100%;max-width:100 %}.col-md-6{flex: 0 0 50%;max-width:50%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.popupbox{background:#f1f2f2;padding: 20px;} .row {display: flex;} .col-md-6 {max-width: 50%;} .modal-body{background-color:#f1f2f2;padding:20px;position:relative;border-radius:0}.close{position:absolute;right:-8px;top:-12px;color:#333;font-weight:400;background:#fff !important;opacity:1 !important;border-radius:50%;width:25px;font-size:21px;font-weight:700}.logohheader{background:#fff;padding:5px;width:100%}.logohheader img{width:175px}.preview-date-num{}.preview-date-num p{font-size:14px;font-weight:600;color:#8f8f8f;margin:5px 0;padding:0 20px;white-space: nowrap;}.preview-date-num p span{color:#333}.firstbox{background:#fff;padding:0 20px 0px;}.firstbox label{display:block;color:#8f8f8f;font-weight:600;margin:5px 0;font-size:14px}.firstbox label span{color:#333}.thirdbox{background:#fff;margin-bottom:0}.thirdbox h3{font-size:18px;font-weight:bold;text-align:center;padding:20px 20px 0;margin:0;margin-bottom:15px;color:#333;background:transparent}.thirdbox .table-responsive{display:table}.table-responsive{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table{width:100%;font-size:14px;width:100%;border-spacing:inherit;margin-bottom:0;color:#212529}.thirdbox table thead{background:#cbcbcb;font-size:12px}.thirdbox table tbody{font-size:12px}table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6;text-align:left}.table td,.table th{padding: .75rem;vertical-align:top}table tbody tr:last-child{border-bottom:0}table td{color:#696969;background-color:#fff;padding:12px}.secondbox{background:#fff;padding:20px;margin-bottom:0}.secondbox h3{font-size:18px;margin:0;font-weight:bold;padding:0;margin-bottom:15px;text-align:center;background:transparent;color:#333}hr{margin-top:7px;margin-bottom:5px;border:0;border-top:1px solid rgba(0, 0, 0, .1)}table td{color:#696969;background-color:#fff;font-weight:600;padding:12px;font-size:14px}.table td,.table th{vertical-align:top}.secondbox label{display:block;color:#8f8f8f;margin:5px 0;font-weight:600;font-size:14px}.secondbox label span{color:#333}.mb-0{margin-bottom:0}.txt-right{text-align:right}</style></head><body> <div class='popupbox'>";
    var stringHtmlBody = document.getElementById("printdiv1").innerHTML;
    stringHtmlMain += stringHtmlBody;
    var stringHtmlEnd = "</div></body></html>";
    stringHtmlMain += stringHtmlEnd;
    stringHtmlMain = stringHtmlMain.replace("col-sm-6", "col-md-6");
    stringHtmlMain = stringHtmlMain.replace("col-sm-4", "col-md-4");

    // this.togglePreview();

    var inputParameter = {};
    inputParameter.SalesQuoteType = this.state.containerLoadType;
    inputParameter.SalesQuoteNo = self.state.SalesQuoteNo;
    inputParameter.HtmlPdfInput = stringHtmlMain.replace(/"/g, "'");
    inputParameter.SalesQuoteAction = action;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SendEmailWithPDF`,
      data: inputParameter,
      headers: authHeader(),
    })
      .then(function (response) {
        if (response != null) {
          if (response.data != null) {
            if (response.data) {
              store.addNotification({
                // title: "Success",
                message: response.data,
                type: "success", // 'default', 'success', 'info', 'warning'
                container: "top-right", // where to position the notifications
                dismiss: {
                  duration: appSettings.NotficationTime,
                },
              });
              self.setState({ loding: false });
              self.props.history.push("quote-table");
            }
          }
        }
      })
      .catch((error) => {
        self.setState({ loding: false });
        var temperror = error.response.data;
        // var err = temperror.split(":");
        self.props.history.push("quote-table");
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
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      },
      headers: authHeader(),
    }).then(function (response) {
      //;
      if (response.data.Table.length > 0) {
        self.setState({
          ConditionDesc: response.data.Table[0].conditionDesc
            .split("\n")
            .map((item, i) => <p key={i}>{item}</p>),
        });
      }
    });
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;

    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value == "Select" ? "" : value,
      };
    } else if (name === "Quantity") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value),
      };
    } else {
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
              flattack_openTop[i] = {
                ...flattack_openTop[i],
                [name]: value,
              };
            }
          } else {
            return false;
          }
        } else {
          flattack_openTop[i] = {
            ...flattack_openTop[i],
            [name]: value,
          };
        }
      } else {
        flattack_openTop[i] = {
          ...flattack_openTop[i],
          [name]: value,
        };
      }
    }
    this.setState({ flattack_openTop });
  }

  addMultiDim() {
    this.setState((prevState) => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          PackageType: "",
          Quantity: 0,
          length: 0,
          width: 0,
          height: 0,
          Gross_Weight: 0,
          total: 0,
          VolumeWeight: 0,
          Volume: 0,
        },
      ],
    }));
  }

  removeMultiDim(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }

  addMultiCBM() {
    this.setState((prevState) => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0,
        },
      ],
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
              placeholder={"QTY"}
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
              placeholder={el.Gross_Weight === 0 ? "GW (kg)" : "GW (kg)"}
              name="GrossWt"
              value={el.GrossWt || ""}
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
    ));
  }

  toggleRow(rateID, rowData) {
    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[rateID] = !this.state.cSelectedRow[rateID];
    this.setState({
      cSelectedRow: newSelected,
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
        (d) => d.saleQuoteLineID === rowData._original.saleQuoteLineID
      );
    } else {
      rateSubDetails = this.state.rateSubDetails.filter(
        (d) => d.RateLineID === rowData._original.RateLineId
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
          profitLossPer: finalprofitLossPer,
        });
      } else {
        for (let j = 0; j < rateSubDetails.length; j++) {
          profitLossAmt +=
            rateSubDetails[j].TotalAmount - rateSubDetails[j].BuyRate;
          BuyRate += rateSubDetails[j].BuyRate;
        }

        var finalprofitLossAmt = profitLossAmt + profitLossAmt1;

        if (selectedRow.length > 0) {
          aTotalAmount = selectedRow.reduce(function (prev, cur) {
            return prev + parseFloat(cur.TotalAmount);
          }, 0);
        } else {
          aTotalAmount = 0;
        }

        var finalprofitLossPer = (profitLossAmt * 100) / aTotalAmount;
        this.setState({
          BuyRate,
          selectedDataRow: selectedRow,
          profitLossAmt: finalprofitLossAmt,
          profitLossPer: finalprofitLossPer,
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
              aTotalAmount = selectedRow.reduce(function (prev, cur) {
                return (
                  prev + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
                );
              }, 0);
              finalprofitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
            }
            this.setState({
              BuyRate,
              profitLossAmt: finalprofitLossAmt,
              profitLossPer: finalprofitLossPer,
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
                  aTotalAmount = selectedRow.reduce(function (prev, cur) {
                    return (
                      prev + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
                    );
                  }, 0);
                  finalprofitLossPer =
                    (finalprofitLossAmt * 100) / aTotalAmount;
                  this.setState({
                    BuyRate,
                    profitLossAmt: finalprofitLossAmt,
                    profitLossPer: finalprofitLossPer,
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0,
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
                  profitLossPer: finalprofitLossPer,
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
              var finalprofitLossAmt = profitLossAmt + profitLossAmt1;
              selectedRow = this.state.selectedDataRow;
              selectedRow.push(rowData._original);
              if (selectedRow.length > 0) {
                aTotalAmount = selectedRow.reduce(function (prev, cur) {
                  return prev + parseFloat(cur.TotalAmount);
                }, 0);
              } else {
                aTotalAmount = 0;
              }
              finalprofitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
              this.setState({
                BuyRate,
                profitLossAmt: finalprofitLossAmt,
                profitLossPer: finalprofitLossPer,
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
                    profitLossPer: finalprofitLossPer,
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0,
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

                aTotalAmount = selectedRow.reduce(function (prev, cur) {
                  return prev + parseFloat(cur.TotalAmount);
                }, 0);

                var finalprofitLossAmt = profitLossAmt1 - profitLossAmt;

                if (selectedRow.length > 0) {
                  profitLossPer = (finalprofitLossAmt * 100) / aTotalAmount;
                  var finalprofitLossPer = profitLossPer;
                  this.setState({
                    BuyRate,
                    profitLossAmt: finalprofitLossAmt,
                    profitLossPer: finalprofitLossPer,
                  });
                } else {
                  this.setState({
                    BuyRate: 0,
                    profitLossAmt: 0,
                    profitLossPer: 0,
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
      selectedDataRow: selectedRow,
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
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }

  HandleChangeConNew(name) {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerList`,
      data: {
        CustomerName: name,
        CustomerType: "Existing",
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      },
      headers: authHeader(),
    }).then(function (response) {
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
          custNotification,
        });
      }
    });
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

    if (this.state.containerLoadType === "FTL" && this.state.TruckTypeData) {
      if (!this.props.location.state.isViewRate) {
        var TruckTypeData = callBackObj;
        this.setState({ TruckTypeData });
      }
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    } else {
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    }
    if (this.state.containerLoadType === "FCL") {
      var multiCBM = callBackObj;
      this.setState({ multiCBM });
    }
  };

  callbackCurrencyFunction = (code) => {
    this.HandleCurrencyChange(code);
  };

  HandleCurrencyChange(code) {
    this.setState({
      currencyCode: code,
      iscurrencyChnage: true,
      newloding: true,
    });
    var Containerdetails = [];
    var ModeOfTransport = "";
    var RateID = [];
    if (this.state.modeoftransport === "SEA") {
      // Containerdetails = this.state.users;
      for (let i = 0; i < this.state.users.length; i++) {
        var objContainer = {};
        objContainer.ProfileCodeID = this.state.users[i].ProfileCodeID;
        objContainer.ContainerCode = this.state.users[i].StandardContainerCode;
        objContainer.ContainerQuantity = this.state.users[i].ContainerQuantity;
        objContainer.Temperature = this.state.users[i].Temperature;
        objContainer.TemperatureType = this.state.users[i].TemperatureType;
        Containerdetails.push(objContainer);
      }
      ModeOfTransport = "ocean";
    } else {
      ModeOfTransport = this.state.modeoftransport;
    }
    for (let j = 0; j < this.state.rateDetails.length; j++) {
      var objRate = new Object();
      objRate.RateQueryid = this.state.rateDetails[j].RateLineId;
      objRate.RateQueryType = this.state.rateDetails[j].TypeOfRate;
      RateID.push(objRate);
    }
    var inputParameter = {};
    inputParameter.QuoteType = this.state.containerLoadType;
    inputParameter.ModeOfTransport = ModeOfTransport;
    inputParameter.Type = this.state.shipmentType;
    inputParameter.TypeOfMove = this.state.typeofMove;
    inputParameter.portOfDischargeUNECECode = this.state.podfullAddData.UNECECode;
    inputParameter.portOfLoadingUNECECode = this.state.polfullAddData.UNECECode;
    inputParameter.PickupGeoCordinate = this.state.polfullAddData.GeoCoordinate;
    inputParameter.DeliveryGeoCordinate = this.state.podfullAddData.GeoCoordinate;
    inputParameter.volume = parseFloat(this.state.cbmVal) || 0;
    inputParameter.PickupLocation = "";
    inputParameter.DeliveryLocation = "";
    inputParameter.BaseCurrency = code;
    inputParameter.MyWayUserid = encryption(
      window.localStorage.getItem("userid"),
      "desc"
    );
    inputParameter.IsSearchFromSpotRate = this.props.location.state.IsSearchFromSpotRate;
    inputParameter.RatequeryID = this.props.location.state.RatequeryID;
    inputParameter.Commodity = this.state.commoditySelect;
    inputParameter.CustomerId = this.state.CompanyID;
    inputParameter.RateID = RateID;
    inputParameter.RateQueryDim = this.state.multiCBM;
    inputParameter.Containerdetails = Containerdetails;
    inputParameter.SurchargeLocalchargeID = this.state.SurchargeLocalchargeID;
    this.setState({ profitLossAmt: 0, profitLossPer: 0 });
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchCurrencyChanges`,
      data: inputParameter,
      headers: authHeader(),
    })
      .then(function (response) {
        var rateDetails = response.data.Table;
        var rateSubDetails = response.data.Table1;
        var BuyRate = 0;
        var profitLossAmt = 0;
        var finalprofitLossPer = 0;
        self.setState({ rateDetails, rateSubDetails, newloding: false });
        for (let j = 0; j < rateSubDetails.length; j++) {
          var total = parseFloat(rateSubDetails[j].TotalAmount);
          profitLossAmt += total - rateSubDetails[j].BuyRate;
          BuyRate += rateSubDetails[j].BuyRate;
        }
        if (rateDetails.length > 0) {
          var aTotalAmount = rateDetails.reduce(function (prev, cur) {
            return prev + parseFloat(cur.TotalAmount);
          }, 0);

          finalprofitLossPer = (profitLossAmt * 100) / aTotalAmount;
        }
        self.setState({
          BuyRate,
          profitLossAmt: profitLossAmt,
          profitLossPer: finalprofitLossPer,
        });
      })
      .catch((response) => {
        if (response.message) {
          store.addNotification({
            // title: "Error",
            message: response.message,
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime,
            },
          });
        } else {
          store.addNotification({
            // title: "Error",
            message: response.data,
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime,
            },
          });
        }

        this.setState({ newloding: false });
      });
  }

  render() {
    var i = 0;
    var equipVal = "";
    var tDate = moment(this.state.todayDate).format("L");
    var finalTotal = 0;
    if (this.state.selectedDataRow.length > 0 && this.state.isCopy === true) {
      finalTotal = this.state.selectedDataRow.reduce(function (prev, cur) {
        return prev + parseFloat(cur.Total.split(" ")[0]);
      }, 0);
    } else {
      finalTotal = this.state.selectedDataRow.reduce(function (prev, cur) {
        return prev + parseFloat(cur.TotalAmount);
      }, 0);
    }

    if (this.state.selected.length > 0) {
    } else {
      for (let j = 0; j < this.state.rateDetails.length; j++) {
        if (!equipVal.includes(this.state.rateDetails[j].ContainerType)) {
          equipVal += this.state.rateDetails[j].ContainerType;
        }
      }
    }
    var selectedCommodity = 0;
    if (this.state.isCopy && this.state.commodityData.length > 0) {
      if (this.state.Commodity) {
        selectedCommodity = this.state.commodityData.filter(
          (x) => x.Commodity == this.state.Commodity
        )[0]["id"];
      }

      this.state.CommodityID = selectedCommodity;
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
                name={"LocalCharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label title={item.LineName} htmlFor={"local" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>

            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  appSettings.imageURL +
                  "OEAN_LINERS/" +
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
                name={"LocalCharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label
                title={item.LineName || ""}
                htmlFor={"local" + (index + 1)}
              >
                {item.ChargeDesc}
              </label>
            </div>

            <span className="line-img">
              <img
                alt={item.LineName || ""}
                title={item.LineName || ""}
                onError={this.onErrorImg.bind(this)}
                src={
                  item.LineName
                    ? appSettings.imageURL +
                      "AIR_LINERS/" +
                      item.LineName.replace(" ", "_") +
                      ".png"
                    : appSettings.imageURL + "ATAFreight_console.png"
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
                name={"LocalCharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label title={item.LineName} htmlFor={"local" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>

            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={appSettings.imageURL + "ATAFreight_console.png"}
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
                name={"Surcharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>

            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={
                  appSettings.imageURL +
                  "OEAN_LINERS/" +
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
                name={"Surcharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>
            <span className="line-img">
              <img
                title={item.LineName || ""}
                alt={item.LineName || ""}
                onError={this.onErrorImg.bind(this)}
                src={
                  item.LineName
                    ? appSettings.imageURL +
                      "AIR_LINERS/" +
                      item.LineName.replace(" ", "_") +
                      ".png"
                    : appSettings.imageURL + "ATAFreight_console.png"
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
                name={"Surcharge"}
                checked={
                  this.state.cSelectChackBox[
                    item.RowIndex + item.ChargeCode
                  ] === true
                }
                onChange={this.HandleLocalSearchCharges.bind(this, item, index)}
              />
              <label title={item.LineName} htmlFor={"Sur" + (index + 1)}>
                {item.ChargeDesc}
              </label>
            </div>

            <span className="line-img">
              <img
                title={item.LineName}
                alt={item.LineName}
                onError={this.onErrorImg.bind(this)}
                src={appSettings.imageURL + "ATAFreight_console.png"}
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

    const { PackageDetailsArr, TruckDetailsArr } = this.state;
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <React.Fragment>
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
            <div className="title-sect mb-4">
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
                                      }

                                      if (mode === "Ocean" && lname !== "") {
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
                                                  onChange={(e) =>
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
                                                  onChange={(e) =>
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
                                                  appSettings.imageURL +
                                                  "AIR_LINERS/" +
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
                                                  onChange={(e) =>
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
                                    // minWidth: 200
                                  },
                                  {
                                    Cell: (row) => {
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
                                    filterable: true,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 90,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 100,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 90,
                                  },
                                  {
                                    Cell: (row) => {
                                      var header = "";
                                      var value = "";
                                      if (
                                        this.state.containerLoadType == "FCL"
                                      ) {
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
                                          value =
                                            row.original["Chargable Weight"];
                                        }
                                      } else {
                                        header = "CW";
                                        if (row.original["Chargable Weight"]) {
                                          value =
                                            row.original["Chargable Weight"];
                                        }
                                      }

                                      return (
                                        <>
                                          <p className="details-title">
                                            {header}
                                          </p>
                                          <p className="details-para">
                                            {value}
                                          </p>
                                        </>
                                      );
                                    },
                                    accessor: "ContainerType",
                                    filterable: true,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 90,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 90,
                                  },
                                  {
                                    Cell: (row) => {
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
                                        var total;
                                        if (row.original.TotalAmount) {
                                          total =
                                            parseFloat(
                                              row.original.TotalAmount
                                            ).toFixed(2) +
                                            " " +
                                            row.original.BaseCurrency;
                                        } else {
                                          total =
                                            "0 " + row.original.BaseCurrency;
                                        }
                                        return (
                                          <>
                                            <p className="details-title">
                                              Price
                                            </p>
                                            <p className="details-para">
                                              {total}
                                            </p>
                                          </>
                                        );
                                      }
                                    },
                                    accessor: "Total",
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
                                  return {};
                                },
                                filterMethod: (filter, rows) => {
                                  const result = matchSorter(
                                    rows,
                                    filter.value,
                                    {
                                      keys: ["commodities", "TransitTime"],
                                      threshold:
                                        matchSorter.rankings.WORD_STARTS_WITH,
                                    }
                                  );

                                  return result;
                                },
                              },
                            ]}
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
                            data={this.state.rateDetails}
                            defaultPageSize={1000}
                            className="-striped -highlight no-mid-align"
                            minRows={1}
                            showPagination={false}
                            SubComponent={(row) => {
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
                                                ? (d) =>
                                                    d.SaleQuoteIDLineID ===
                                                    row.original.saleQuoteLineID
                                                : (d) =>
                                                    d.saleQuoteLineID ===
                                                    row.original.saleQuoteLineID
                                              : (d) =>
                                                  d.SaleQuoteIDLineID ===
                                                  row.original.SaleQuoteIDLineID
                                          )
                                        : row.original.SaleQuoteIDLineID ==
                                          undefined
                                        ? row.original.RateLineId == undefined
                                          ? this.state.rateSubDetails.filter(
                                              (d) =>
                                                d.RateLineID ===
                                                row.original.RateLineID
                                            )
                                          : this.state.rateSubDetails.filter(
                                              (d) =>
                                                d.RateLineID ===
                                                row.original.RateLineId
                                            )
                                        : this.state.rateSubDetails.filter(
                                            (d) =>
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
                                            Cell: (row) => {
                                              return (
                                                <>
                                                  {row.original.ChargeDesc !=
                                                  undefined
                                                    ? row.original.ChargeDesc
                                                    : row.original.Type}
                                                </>
                                              );
                                            },
                                          },
                                          {
                                            Header: "C. Name",
                                            accessor: "ChargeCode",
                                          },
                                          {
                                            Header: "Unit Price",
                                            accessor: "Rate",
                                            Cell: (props) =>
                                            
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
                                              ),
                                          },
                                          {
                                            Header: "Units",
                                            accessor:
                                              this.state.isCopy === true
                                                ? "Chargeitem"
                                                : "ChargeItem",
                                          },
                                          {
                                            Header: "Tax",
                                            accessor: "Tax",
                                            Cell: (props) => (
                                              <React.Fragment>
                                                {props.original.Tax !== 0
                                                  ? props.original.Tax
                                                  : props.original.Tax}
                                              </React.Fragment>
                                            ),
                                          },

                                          {
                                            Header: "Exrate",
                                            accessor: "Exrate" || "ExRate",
                                            Cell: (row) => {
                                              if (this.state.isCopy === true) {
                                                return (
                                                  <>{row.original.ExRate||row.original.Exrate}</>
                                                );
                                              } else {
                                                return (
                                                  <>{row.original.Exrate}</>
                                                );
                                              }
                                            },
                                          },

                                          {
                                            Cell: (row) => {
                                              var TotalAmount;
                                              if (this.state.isCopy === true) {
                                                TotalAmount =
                                                  row.original.Total;
                                              } else {
                                                var total = 0;
                                                if (row.original.TotalAmount) {
                                                  total =
                                                    row.original.TotalAmount;
                                                }
                                                TotalAmount =
                                                  total +
                                                  " " +
                                                  row.original.BaseCurrency;
                                              }

                                              return <>{TotalAmount}</>;
                                            },
                                            Header: "Final Payment",
                                            accessor: "Total",
                                          },
                                        ],
                                      },
                                    ]}
                                    showPagination={false}
                                    defaultPageSize={1000}
                                  />
                                </div>
                              );
                            }}
                          />
                        </div>

                        <UncontrolledCollapse toggler="#toggler">
                          <div className="rate-final-contr p-0">
                            <div
                              className="d-flex justify-content-between align-items-center title-border py-3"
                              style={{ marginBottom: "15px" }}
                            >
                              <h3>Rate Query</h3>
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
                                {this.state.containerLoadType == "FCL" &&
                                this.state.selected.length > 0 ? (
                                  <>
                                    {this.state.selected.map((item, i) => (
                                      <p className="details-para" key={i}>
                                        {item.StandardContainerCode}
                                      </p>
                                    ))}
                                  </>
                                ) : (
                                  <p className="details-para">
                                    {this.state.containerLoadType == "FCL"
                                      ? equipVal
                                      : ""}
                                  </p>
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
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.handleSelectCon.bind(
                                        this,
                                        "Company_Name"
                                      )}
                                      inputProps={{
                                        placeholder: "Search Account/Consignee",
                                      }}
                                    />
                                  </div>
                                ) : // ) : null
                                this.state.CompanyName == "" ? (
                                  <div className="position-relative mt-2">
                                    <Autocomplete
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
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.handleSelectCon.bind(
                                        this,
                                        "Company_Name"
                                      )}
                                      inputProps={{
                                        placeholder: "Search Account/Consignee",
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
                          this.state.containerLoadType === "LTL" ? (
                            <p>CW:{this.state.cbmVal}</p>
                          ) : this.state.containerLoadType === "LCL" ? (
                            <p>CBM:{this.state.cbmVal}</p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="rate-final-contr">
                        <div className="ag-fresh redirect-row">
                          {PackageDetailsArr.length !== 0 ? (
                            <ReactTable
                              data={PackageDetailsArr}
                              filterable
                              minRows={1}
                              showPagination={false}
                              columns={[
                                {
                                  Header: "Pack.Type",
                                  accessor: "PackageType",
                                  minWidth: 110,
                                },
                                {
                                  Header: "Quantity",
                                  accessor: "Quantity",
                                },

                                {
                                  Header: "Lenght",
                                  accessor: "Lengths",
                                },
                                {
                                  Header: "Width",
                                  accessor: "Width",
                                },
                                {
                                  Header: "Height",
                                  accessor: "Height",
                                },
                                {
                                  Header: "Gross Weight",
                                  accessor: "GrossWt",
                                  minWidth: 140,
                                },
                                {
                                  Header: "Volume Weight",
                                  accessor: "VolumeWeight",
                                  minWidth: 140,
                                  show:
                                    this.state.containerLoadType !== "LCL"
                                      ? true
                                      : false,
                                },
                                {
                                  Header:
                                    this.state.containerLoadType === "LCL" &&
                                    this.state.isCopy
                                      ? "CBM"
                                      : "Volume",
                                  accessor: "Volume",
                                  minWidth: 140,
                                  Cell: (row) => {
                                    if (
                                      this.state.containerLoadType === "LCL" &&
                                      this.state.isCopy
                                    ) {
                                      return (
                                        <>
                                          {row.original.CBM ||
                                            row.original.Volume}
                                        </>
                                      );
                                    } else {
                                      return <>{row.original.Volume}</>;
                                    }
                                  },
                                  show:
                                    this.state.containerLoadType === "LCL" &&
                                    this.state.containerLoadType !== "FCL"
                                      ? true
                                      : false,
                                },
                              ]}
                              className="-striped -highlight"
                              defaultPageSize={2000}
                              minRows={1}
                            />
                          ) : (
                            <span>No Cargo Details Available</span>
                          )}
                        </div>
                      </div>

                      <div className="">
                        <div className="col-md-6 login-fields">
                          <p className="details-title">Commodity</p>
                          <select
                            // disabled={
                            //   this.state.fCommodityID !== 49 ? true : false
                            // }
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
                  borderRadius: "15px",
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
                  borderRadius: "15px",
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
          {/*---------------------------------------- Priview Modal ------------------------------*/}
          <Modal
            className="popupbox"
            isOpen={this.state.modalPreview}
            toggle={this.togglePreview}
          >
            <ModalBody>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={this.togglePreview}
              >
                <span>&times;</span>
              </button>
              <div id="printdiv">
                <div class="">
                  <div className="row" style={{ margin: 0 }}>
                    <div className="logohheader">
                      <div
                        className="row align-items-center"
                        style={{ margin: 0 }}
                      >
                        <div className="col-12 col-md-6">
                          <img
                            src={
                              appSettings.imageURL + "ATAFreight_console.png"
                            }
                            alt="ATAFreight Console"
                          ></img>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="preview-date-num">
                            <p>
                              Date : <span>{tDate}</span>
                            </p>
                            <p>Sales Quote No. :{this.state.SalesQuoteNo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="firstbox">
                        <label>
                          Sales Person :
                          <span>
                            {encryption(
                              window.localStorage.getItem("username"),
                              "desc"
                            )}
                          </span>
                        </label>
                        <label>
                          E-Mail :
                          <span>
                            {encryption(
                              window.localStorage.getItem("emailid"),
                              "desc"
                            ).toString()}
                          </span>
                        </label>
                        <label>
                          Phone : <span>{this.state.SalesPersonPhone}</span>
                        </label>
                        <label>
                          Fax : <span>{this.state.SalesPersonFax}</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="firstbox">
                        <label>
                          ATNN : <span>{this.state.ContactName}</span>
                        </label>
                        <label>
                          E-Mail : <span>{this.state.ContactEmail}</span>
                        </label>
                        <label>
                          Phone : <span>{this.state.Contact_Phone}</span>
                        </label>
                        <label>
                          Fax : <span></span>
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
                              <table className="table table-responsive mb-0">
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
                                        {this.state.containerLoadType ===
                                          "AIR" ||
                                        this.state.containerLoadType === "LTL"
                                          ? "Volume Weight"
                                          : "CBM"}
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.PackageDetailsArr.map((item1) => (
                                    <tr>
                                      <td>{item1.PackageType || ""}</td>
                                      <td>{item1.Quantity || 0}</td>
                                      <td>{item1.Lengths || 0}</td>
                                      <td>{item1.Width || 0}</td>
                                      <td>{item1.Height || 0}</td>
                                      <td>{item1.GrossWt || 0}</td>

                                      {this.state.containerLoadType ===
                                      "LCL" ? (
                                        <td>{item1.Volume || 0}</td>
                                      ) : this.state.containerLoadType ===
                                        "FCL" ? null : (
                                        <td>{item1.VolumeWeight || 0}</td>
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
                              <table className="table table-responsive mb-0">
                                <thead>
                                  <tr>
                                    <th>Truck Type</th>
                                    <th>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.TruckTypeData.map((item1) => (
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

                  {this.state.selectedDataRow.map((item) => (
                    <>
                      <div className="row">
                        <div className="col-12">
                          <div className="secondbox">
                            <h3>Service Details</h3>
                            <hr></hr>
                            <div className="row">
                              <div className="col-12 col-md-4">
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
                                  POL :
                                  <span>
                                    {this.state.isCopy == true
                                      ? this.state.PickUpAddress || item.POL
                                      : item.POLName}
                                  </span>
                                </label>
                              </div>
                              <div className="col-12 col-md-4">
                                <label>
                                  Service Type :
                                  <span>
                                    {item.TransshipmentPort === null ||
                                    item.TransshipmentPort === undefined
                                      ? "Direct"
                                      : "Transit"}
                                  </span>
                                </label>

                                <label>
                                  POD :{" "}
                                  <span>
                                    {this.state.isCopy == true
                                      ? this.state.DestinationAddress ||
                                        item.POD
                                      : item.PODName}
                                  </span>
                                </label>
                              </div>
                              <div className="col-12 col-md-4">
                                <label>
                                  Liner :{" "}
                                  <span>
                                    {this.state.isCopy == true
                                      ? item.Linename
                                      : item.lineName}
                                  </span>
                                </label>
                                <label>
                                  Inco Terms :{" "}
                                  <span>{this.state.incoTerm}</span>
                                </label>
                              </div>
                            </div>
                            <hr></hr>
                            <div className="row">
                              <div className="col-12 col-md-4">
                                <label>
                                  Transit Time :{" "}
                                  <span>{item.TransitTime + " Days"}</span>
                                </label>
                              </div>

                              <div className="col-12 col-md-4">
                                <label>
                                  Free Time :{" "}
                                  <span>{item.freeTime || item.FreeTime}</span>
                                </label>
                              </div>
                            </div>
                            <hr></hr>
                            <div class="row">
                              <div className="col-12">
                                <label>
                                  Expiry Date :{" "}
                                  <span>
                                    {item.expiryDate || item.ExpiryDate}
                                  </span>
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
                              {this.state.containerLoadType === "FCL"
                                ? item.ContainerType +
                                  " (" +
                                  item.ContainerQuantity +
                                  ") "
                                : null}
                            </h3>

                            <div className="table-responsive">
                              <table className="table table-responsive mb-0">
                                {(() => {
                                  this.state.isCopy !== true
                                    ? (this.state.filterrateSubDetails =
                                        this.state.containerLoadType == "FTL" ||
                                        this.state.containerLoadType == "LTL"
                                          ? this.state.rateSubDetails.filter(
                                              (d) =>
                                                d.RateLineID === item.RateLineID
                                            )
                                          : this.state.rateSubDetails.filter(
                                              (d) =>
                                                d.RateLineID === item.RateLineId
                                            ))
                                    : (this.state.filterrateSubDetails =
                                        this.state.containerLoadType !==
                                          "FCL" &&
                                        this.state.containerLoadType !== "AIR"
                                          ? this.state.containerLoadType !==
                                            "INLAND"
                                            ? this.state.rateSubDetails.filter(
                                                (d) =>
                                                  d.saleQuoteLineID ===
                                                  item.SaleQuoteIDLineID
                                              )
                                            : this.state.rateSubDetails.filter(
                                                (d) =>
                                                  d.SaleQuoteIDLineID ===
                                                  item.SaleQuoteIDLineID
                                              )
                                          : this.state.rateSubDetails.filter(
                                              (d) =>
                                                d.saleQuoteLineID ===
                                                item.saleQuoteLineID
                                            ));
                                })()}

                                {(() => {
                                  DocumentCharges = this.state.filterrateSubDetails.filter(
                                    (d) =>
                                      (d.ChargeItem || d.Chargeitem) ===
                                        "Per HBL" ||
                                      (d.ChargeItem || d.Chargeitem) ===
                                        "Per BL" ||
                                      (d.ChargeItem || d.Chargeitem) ===
                                        "Per Shipment" ||
                                      (d.ChargeItem || d.Chargeitem) ===
                                        "Per Set"
                                  );
                                })()}

                                {(() => {
                                  this.state.filterrateSubDetails = this.state.filterrateSubDetails.filter(
                                    (d) =>
                                      (d.ChargeItem || d.Chargeitem) !==
                                        "Per HBL" &&
                                      (d.ChargeItem || d.Chargeitem) !==
                                        "Per BL" &&
                                      (d.ChargeItem || d.Chargeitem) !==
                                        "Per Shipment" &&
                                      (d.ChargeItem || d.Chargeitem) !==
                                        "Per Set"
                                  );
                                })()}

                                <thead>
                                  <tr>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Units</th>
                                    <th>Tax</th>
                                    <th className="txt-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.isCopy !== true
                                    ? this.state.filterrateSubDetails.map(
                                        (item1) => (
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
                                            <td className="txt-right">
                                              {item1.TotalAmount || 0}{" "}
                                              {item1.BaseCurrency}
                                            </td>
                                          </tr>
                                        )
                                      )
                                    : this.state.filterrateSubDetails.map(
                                        (item1) => (
                                          <tr>
                                            <td>{item1.ChargeDesc}</td>
                                            <td>{item1.Amount}</td>
                                            <td>{item1.Chargeitem}</td>
                                            <td>{item1.Tax}</td>
                                            <td className="txt-right">
                                              {/* {item1.TotalAmount > 0
                                                ? item1.TotalAmount +
                                                  " " +
                                                  item1.BaseCurrency
                                                : " " || item1.Total} */}
                                              {item1.Total}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className="thirdbox">
                            <div className="table-responsive">
                              <table className="table table-responsive mb-0">
                                <thead>
                                  <tr>
                                    <th>Total</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th className="total-align txt-right">
                                      {this.state.isCopy == true
                                        ? this.state.filterrateSubDetails.reduce(
                                            function (prev, cur) {
                                              return (
                                                prev +
                                                parseFloat(
                                                  cur.Total.split(" ")[0]
                                                )
                                              );
                                            },
                                            0
                                          )
                                        : this.state.filterrateSubDetails.reduce(
                                            function (prev, cur) {
                                              return (
                                                prev +
                                                parseFloat(cur.TotalAmount)
                                              );
                                            },
                                            0
                                          )}
                                      {" " + this.state.currencyCode}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {DocumentCharges.length > 0 ? (
                        <div className="row">
                          <div className="col-12">
                            <div className="thirdbox">
                              <h3>Documentation Charges</h3>
                              <div className="table-responsive">
                                <table className="table table-responsive mb-0">
                                  <thead>
                                    <tr>
                                      <th>Description</th>
                                      <th>Price</th>
                                      <th>Units</th>
                                      <th>Tax</th>
                                      <th className="txt-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.isCopy === false
                                      ? DocumentCharges.map((item) => (
                                          <tr>
                                            <td>{item.ChargeDesc}</td>
                                            <td>
                                              {(item.Rate === null
                                                ? " "
                                                : item.Rate + " ") +
                                                item.Currency}
                                            </td>
                                            <td>{item.ChargeItem}</td>
                                            <td>{item.Tax}</td>
                                            <td className="txt-right">
                                              {(item.TotalAmount === null
                                                ? " "
                                                : item.TotalAmount + " ") +
                                                (item.BaseCurrency === null
                                                  ? " "
                                                  : item.BaseCurrency)}
                                            </td>
                                          </tr>
                                        ))
                                      : DocumentCharges.map((item) => (
                                          <tr>
                                            <td>{item.ChargeDesc}</td>
                                            <td>{item.Amount}</td>
                                            <td>{item.Chargeitem}</td>
                                            <td>{item.Tax}</td>
                                            <td className="txt-right">
                                              {item.Total}
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
                          <table className="table table-responsive mb-0">
                            <thead>
                              <tr>
                                <th>Final Total</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                {this.state.isCopy ? (
                                  <th className="total-align txt-right">
                                    {finalTotal.toFixed(2)}
                                    {" " + this.state.currencyCode}
                                  </th>
                                ) : (
                                  <th className="total-align txt-right">
                                    {/* {this.state.selectedDataRow.reduce(function(
                                      prev,
                                      cur
                                    ) {
                                      return prev + parseFloat(cur.TotalAmount.toFixed(2));
                                    },
                                    0)} */}
                                    {finalTotal.toFixed(2)}
                                    {" " + this.state.currencyCode}
                                  </th>
                                )}
                              </tr>
                            </thead>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="thirdbox">
                        <div className="table-responsive">
                          <table className="table table-responsive mb-0">
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
                                    style={{
                                      cursor: "pointer",
                                      color: "blue",
                                    }}
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
              </div>
            </ModalBody>
          </Modal>

          {/* -----------------------containt Priview Modal--------------------- */}

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
                  borderRadius: "15px",
                }}
              >
                <h3 className="mb-4">Edit Cargo Details</h3>
                <>
                  {this.state.containerLoadType === "FCL" ? (
                    // this.state.specialEquipment === true ? (
                    this.state.flattack_openTop.length > 0 &&
                    !this.props.location.state.isViewRate ? (
                      <div className="">
                        <div id="cbmInner">
                          <>{this.MultiCreateCBM()}</>
                        </div>
                      </div>
                    ) : (
                      <Comman
                        parentCallback={this.callbackFunction}
                        packageTypeData={this.state.packageTypeData}
                        containerLoadType={this.state.containerLoadType}
                        multiCBM={this.state.multiCBM}
                      />
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
                      <Comman
                        parentCallback={this.callbackFunction}
                        packageTypeData={this.state.packageTypeData}
                        containerLoadType={this.state.containerLoadType}
                        NonStackable={this.state.NonStackable}
                        multiCBM={this.state.multiCBM}
                        heightData={this.state.heightData}
                      />
                    </>
                  )}
                </>

                <div className="text-center">
                  <Button
                    className="butn"
                    data-valuespecialsontainersode={
                      this.state.valuespecialsontainersode
                    }
                    onClick={this.SubmitCargoDetails.bind(this)}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
        <div style={{ display: "none" }}>
          <div id="printdiv1">
            <div className="row" style={{ margin: 0 }}>
              <div className="logohheader">
                <table className="table">
                  <tr>
                    <td
                      rowspan={"2"}
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <img
                        style={{ height: "50px", Width: "50px" }}
                        src="https://vizio.atafreight.com/MyWayFiles/ATAFreight_console.png"
                      />
                    </td>
                    <td
                      className="preview-date-num"
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <p>
                        Date : <span>{tDate}</span>
                      </p>
                      <p>
                        Sales Quote No. :<span>{this.state.SalesQuoteNo}</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <div
                className="row"
                style={{
                  paddingTop: "0",
                  paddingRight: "20px",
                  paddingLeft: "20px",
                  background: "#fff",
                }}
              >
                <table className="table firstbox bordernone">
                  <tr className="">
                    <td
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        Sales Person :{" "}
                        <span>
                          {encryption(
                            window.localStorage.getItem("username"),
                            "desc"
                          )}
                        </span>
                      </label>
                    </td>
                    <td
                      className="preview-date-num"
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        ATNN : <span>{this.state.ContactName}</span>
                      </label>
                    </td>
                  </tr>

                  <tr className="">
                    <td
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        E-Mail :
                        <span>
                          {" "}
                          {encryption(
                            window.localStorage.getItem("emailid"),
                            "desc"
                          ).toString()}
                        </span>
                      </label>
                    </td>
                    <td
                      className="preview-date-num"
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        E-Mail : <span>{this.state.ContactEmail}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        Phone : <span>{this.state.SalesPersonPhone}</span>
                      </label>
                    </td>
                    <td
                      className="preview-date-num"
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        Phone : <span>{this.state.Contact_Phone}</span>
                      </label>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        Fax : <span>{this.state.SalesPersonFax}</span>
                      </label>
                    </td>

                    <td
                      className="preview-date-num"
                      style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                    >
                      <label>
                        Fax : <span></span>
                      </label>
                    </td>
                  </tr>
                </table>
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
                          <table className="table table-responsive mb-0">
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
                              {this.state.PackageDetailsArr.map((item1) => (
                                <tr>
                                  <td>{item1.PackageType || ""}</td>
                                  <td>{item1.Quantity || 0}</td>
                                  <td>{item1.Lengths || 0}</td>
                                  <td>{item1.Width || 0}</td>
                                  <td>{item1.Height || 0}</td>
                                  <td>{item1.GrossWt || 0}</td>

                                  {this.state.containerLoadType === "LCL" ? (
                                    <td>{item1.Volume || 0}</td>
                                  ) : this.state.containerLoadType ===
                                    "FCL" ? null : (
                                    <td>{item1.VolumeWeight || 0}</td>
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
                          <table className="table table-responsive mb-0">
                            <thead>
                              <tr>
                                <th>Truck Type</th>
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.TruckTypeData.map((item1) => (
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
              <hr />
              {this.state.selectedDataRow.map((item) => (
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="secondbox">
                        <h3>Service Details</h3>
                        <hr></hr>
                        <div className="row">
                          <div className="col-12 col-md-4">
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
                              POL :
                              <span>
                                {this.state.isCopy == true
                                  ? this.state.PickUpAddress || item.POL
                                  : item.POLName}
                              </span>
                            </label>
                          </div>
                          <div className="col-12 col-md-4">
                            <label>
                              Service Type :
                              <span>
                                {item.TransshipmentPort === null ||
                                item.TransshipmentPort === undefined
                                  ? "Direct"
                                  : "Transit"}
                              </span>
                            </label>

                            <label>
                              POD :{" "}
                              <span>
                                {this.state.isCopy == true
                                  ? this.state.DestinationAddress || item.POD
                                  : item.PODName}
                              </span>
                            </label>
                          </div>
                          <div className="col-12 col-md-4">
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
                        <hr></hr>
                        <div className="row">
                          <div className="col-12 col-md-4">
                            <label>
                              Transit Time :{" "}
                              <span>{item.TransitTime + " Days"}</span>
                            </label>
                          </div>

                          <div className="col-12 col-md-4">
                            <label>
                              Free Time :{" "}
                              <span>{item.freeTime || item.FreeTime}</span>
                            </label>
                          </div>
                        </div>
                        <hr></hr>
                        <div class="row">
                          <div className="col-12">
                            <label>
                              Expiry Date :{" "}
                              <span>{item.expiryDate || item.ExpiryDate}</span>
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
                          {this.state.containerLoadType === "FCL"
                            ? item.ContainerType +
                              " (" +
                              item.ContainerQuantity +
                              ") "
                            : null}
                        </h3>

                        <div className="table-responsive">
                          <table className="table table-responsive mb-0">
                            {(() => {
                              this.state.isCopy !== true
                                ? (this.state.filterrateSubDetails =
                                    this.state.containerLoadType == "FTL" ||
                                    this.state.containerLoadType == "LTL"
                                      ? this.state.rateSubDetails.filter(
                                          (d) =>
                                            d.RateLineID === item.RateLineID
                                        )
                                      : this.state.rateSubDetails.filter(
                                          (d) =>
                                            d.RateLineID === item.RateLineId
                                        ))
                                : (this.state.filterrateSubDetails =
                                    this.state.containerLoadType !== "FCL" &&
                                    this.state.containerLoadType !== "AIR"
                                      ? this.state.containerLoadType !==
                                        "INLAND"
                                        ? this.state.rateSubDetails.filter(
                                            (d) =>
                                              d.saleQuoteLineID ===
                                              item.SaleQuoteIDLineID
                                          )
                                        : this.state.rateSubDetails.filter(
                                            (d) =>
                                              d.SaleQuoteIDLineID ===
                                              item.SaleQuoteIDLineID
                                          )
                                      : this.state.rateSubDetails.filter(
                                          (d) =>
                                            d.saleQuoteLineID ===
                                            item.saleQuoteLineID
                                        ));
                            })()}

                            {(() => {
                              DocumentCharges = this.state.filterrateSubDetails.filter(
                                (d) =>
                                  (d.ChargeItem || d.Chargeitem) ===
                                    "Per HBL" ||
                                  (d.ChargeItem || d.Chargeitem) === "Per BL" ||
                                  (d.ChargeItem || d.Chargeitem) ===
                                    "Per Shipment" ||
                                  (d.ChargeItem || d.Chargeitem) === "Per Set"
                              );
                            })()}

                            {(() => {
                              this.state.filterrateSubDetails = this.state.filterrateSubDetails.filter(
                                (d) =>
                                  (d.ChargeItem || d.Chargeitem) !==
                                    "Per HBL" &&
                                  (d.ChargeItem || d.Chargeitem) !== "Per BL" &&
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
                                <th className="txt-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.isCopy !== true
                                ? this.state.filterrateSubDetails.map(
                                    (item1) => (
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
                                        <td className="txt-right">
                                          {item1.TotalAmount || 0}{" "}
                                          {item1.BaseCurrency}
                                        </td>
                                      </tr>
                                    )
                                  )
                                : this.state.filterrateSubDetails.map(
                                    (item1) => (
                                      <tr>
                                        <td>{item1.ChargeDesc}</td>
                                        <td>{item1.Amount}</td>
                                        <td>{item1.Chargeitem}</td>
                                        <td>{item1.Tax}</td>
                                        <td className="txt-right">
                                          {/* {item1.TotalAmount > 0
                                                ? item1.TotalAmount +
                                                  " " +
                                                  item1.BaseCurrency
                                                : " " || item1.Total} */}
                                          {item1.Total}
                                        </td>
                                      </tr>
                                    )
                                  )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="thirdbox">
                        <div className="table-responsive">
                          <table className="table table-responsive mb-0">
                            <thead>
                              <tr>
                                <th>Total</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th className="total-align txt-right">
                                  {this.state.isCopy == true
                                    ? this.state.filterrateSubDetails.reduce(
                                        function (prev, cur) {
                                          return (
                                            prev +
                                            parseFloat(cur.Total.split(" ")[0])
                                          );
                                        },
                                        0
                                      )
                                    : this.state.filterrateSubDetails.reduce(
                                        function (prev, cur) {
                                          return (
                                            prev + parseFloat(cur.TotalAmount)
                                          );
                                        },
                                        0
                                      )}
                                  {" " + this.state.currencyCode}
                                </th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {DocumentCharges.length > 0 ? (
                    <div className="row">
                      <div className="col-12">
                        <div className="thirdbox">
                          <h3>Documentation Charges</h3>
                          <div className="table-responsive">
                            <table className="table table-responsive mb-0">
                              <thead>
                                <tr>
                                  <th>Description</th>
                                  <th>Price</th>
                                  <th>Units</th>
                                  <th>Tax</th>
                                  <th className="txt-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.isCopy === false
                                  ? DocumentCharges.map((item) => (
                                      <tr>
                                        <td>{item.ChargeDesc}</td>
                                        <td>
                                          {(item.Rate === null
                                            ? " "
                                            : item.Rate + " ") + item.Currency}
                                        </td>
                                        <td>{item.ChargeItem}</td>
                                        <td>{item.Tax}</td>
                                        <td className="txt-right">
                                          {(item.TotalAmount === null
                                            ? " "
                                            : item.TotalAmount + " ") +
                                            (item.BaseCurrency === null
                                              ? " "
                                              : item.BaseCurrency)}
                                        </td>
                                      </tr>
                                    ))
                                  : DocumentCharges.map((item) => (
                                      <tr>
                                        <td>{item.ChargeDesc}</td>
                                        <td>{item.Amount}</td>
                                        <td>{item.Chargeitem}</td>
                                        <td>{item.Tax}</td>
                                        <td className="txt-right">
                                          {item.Total}
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
                      <table className="table table-responsive mb-0">
                        <thead>
                          <tr>
                            <th>Final Total</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            {this.state.isCopy ? (
                              <th className="total-align txt-right">
                                {finalTotal.toFixed(2)}
                                {" " + this.state.currencyCode}
                              </th>
                            ) : (
                              <th className="total-align txt-right">
                                {this.state.selectedDataRow.reduce(function (
                                  prev,
                                  cur
                                ) {
                                  return prev + parseFloat(cur.TotalAmount);
                                },
                                0)}
                                {" " + this.state.currencyCode}
                              </th>
                            )}
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="thirdbox">
                    <div className="table-responsive">
                      <table className="table table-responsive mb-0">
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
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                }}
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RateFinalizing;

import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import FileUpload from "./../assets/img/file.png";
import ReactTable from "react-table";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import Autocomplete from "react-autocomplete";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { encryption } from "../helpers/encryption";
import { Button, Modal, ModalBody } from "reactstrap";
import Download from "./../assets/img/csv.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Comman from "../helpers/Comman";
class BookingInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cSelectedRow: {},
      copy: false,
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      BookingNo: "",
      shiperVal: "",
      consigneeval: "",
      commodityData: [],
      selectedCommodity: "",
      selectedFilePath: "",
      selectedType: "",
      ConsigneeID: 0,
      ShipperID: 0,
      fields: {},
      Consignee: [],
      Shipper: [],
      FileData: [],
      Notify: [],
      Buyer: [],
      packageTypeData: [],
      userType: "",
      NonCustomerData: [],
      QuotationData: [],
      QuotationSubData: [],
      typeofMove: "",
      cargoType: "",
      eqmtType: [],
      selectedFile: [],
      NotifyID: 0,
      Notify_AddressID: 0,
      Notify_Displayas: "",
      NotifyName: "",
      BuyerID: 0,
      Buyer_AddressID: 0,
      Buyer_Displayas: "",
      BuyerName: "",
      ConsineeID: 0,
      Consignee_AddressID: 0,
      Consinee_Displayas: "",
      ConsineeName: "",
      ShipperID: 0,
      Shipper_AddressID: 0,
      Shipper_Displayas: "",
      ShipperName: "",
      consineeData: {},
      shipperData: {},
      notifyData: {},
      buyerData: {},
      buyerId: 0,
      errormessage: "",
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
      addmultiCBM: [],
      ContainerLoad: "",
      salesQuotaNo: "",
      isInsert: false,
      nPartyID: 0,
      isView: false,
      EquipmentTypes: "",
      HazMat: "",
      Unstackable: "",
      ShipmentType: "",
      ModeofTransport: "",
      ContainerLoad: "",
      EquipmentTypes: "",
      SpecialEquipment: "",
      IncoTerms: "",
      TypeofMove: "",
      POL: "",
      POD: "",
      PUAddress: "",
      DeliveryAddress: "",
      ShipperID: 0,
      Shipper_AddressID: 0,
      Shipper_Displayas: "",
      Shipper_Name: "",
      CargoType: "",
      Commodity: "",
      companyID: 0,
      company_name: "",
      contact_name: "",
      Company_Address: "",
      FileDataArry: [],
      ContainerCode: "",
      HAZMAT: 0,
      NonStackable: 0,
      Customs_Clearance: 0,
      conshineeAddData: [],
      shipperAddData: [],
      buyerAddData: [],
      notifyAddData: [],
      Consinee_Displayas: "",
      cother: false,
      sother: false,
      nother: false,
      bother: false,
      isShipper: false,
      isConshinee: false,
      isBuyer: false,
      isNotify: false,
      currentPackageType: "",
      valuequantity: 0,
      valuelenght: 0,
      valuewidth: 0,
      valueheight: 0,
      valueweight: 0,
      valuecbm: 0,
      valuespecialsontainersode: "",
      modalEdit: false,
      FileData: [],
      checkList: "",
      Company_AddressID: 0,
      multiCargo: [],
      CargoDetails: [],
      selectedDataRow: [],
      loding: false,
      cmbTypeRadio: "",
      cbmVal: "",
      newloding: false
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
  }
  componentDidMount() {
    var rData = this.props.location.state;
    if (rData.ContainerLoad !== undefined && rData.salesQuotaNo !== undefined) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      this.setState({
        ContainerLoad: rData.ContainerLoad,
        salesQuotaNo: rData.salesQuotaNo,
        userType
      });
      if (rData.ContainerLoad.trim() === "LCL") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionLCL();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      } else if (rData.ContainerLoad.trim() === "FCL") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionFCL();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      } else if (rData.ContainerLoad.trim() === "AIR") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionAIR();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      } else {
        setTimeout(() => {
          this.HandleGetSalesQuotaionINLAND();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      }
    }
  }
  ////Handle Get Sales Quote Inland Details
  HandleGetSalesQuotaionINLAND() {
    this.setState({ newloding: true });
    let self = this;

    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var CargoDetails = response.data.Table3;
      var FileData = response.data.Table4;
      var ChgWeight = 0;
      var multiCargo = [];
      if (CargoDetails.length > 0) {
        for (let i = 0; i < CargoDetails.length; i++) {
          var objcargo = new Object();
          objcargo.BookingPackID = CargoDetails[i].BookingPackID || 0;
          objcargo.PackageType = CargoDetails[i].PackageType || "";
          objcargo.Quantity = CargoDetails[i].Quantity || 0;
          objcargo.Lengths = CargoDetails[i].Lengths || 0;
          objcargo.Width = CargoDetails[i].Width || 0;
          objcargo.Height = CargoDetails[i].Height || 0;
          objcargo.GrossWt = CargoDetails[i].GrossWt || 0;
          objcargo.VolumeWeight = CargoDetails[i].VolumeWeight || 0;
          objcargo.Volume = CargoDetails[i].Volume || 0;
          objcargo.TotalGrossWeight = CargoDetails[i].NetWeight || 0;
          multiCargo.push(objcargo);
        }
      }

      if (FileData.length > 0) {
        self.setState({ FileData });
      } else {
        self.setState({ FileData: [{ FileName: "No File Found" }] });
      }
      if (multiCargo.length > 0) {
      } else {
        multiCargo.push({ PackageType: "No Record Found" });
      }
      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].OriginName;
        var POD = QuotationData[0].DestinationName;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        ChgWeight = QuotationData[0].ChgWeight || 0;
        self.setState({
          cbmVal: ChgWeight,
          ChgWeight,
          multiCBM: multiCargo,
          multiCargo,
          CargoDetails,
          QuotationData,
          QuotationSubData,
          selectedCommodity,
          IncoTerms,
          POL,
          POD,
          SaleQuoteID,
          SaleQuoteIDLineID,
          TypeofMove
        });
      }
      if (Booking.length > 0) {
        var ModeofTransport = Booking[0].ModeOfTransport;
        var companyID = Booking[0].CompanyID;
        var company_name = Booking[0].CompanyName;
        var contact_name = Booking[0].ContactName;
        var Company_Address = Booking[0].Company_Address;
        var SaleQuoteNo = Booking[0].SaleQuoteID;
        var ShipmentType = Booking[0].ShipmentType;
        var Customs_Clearance = Booking[0].Customs_Clearance;
        var HAZMAT = Booking[0].HAZMAT;
        var TypeofMove = QuotationData[0].TypeOfMove;
        var Company_AddressID = Booking[0].Company_AddressID;
        self.setState({
          Company_AddressID,
          newloding: false,
          TypeofMove,
          HAZMAT,
          Customs_Clearance,
          ModeofTransport,
          companyID,
          company_name,
          contact_name,
          Company_Address,
          SaleQuoteNo,
          ShipmentType
        });
      }
      var selectedRow = [];
      const newSelected = Object.assign({}, self.state.cSelectedRow);

      for (let i = 0; i < QuotationData.length; i++) {
        if (!isNaN(QuotationData[i].saleQuoteLineID)) {
          newSelected[QuotationData[i].saleQuoteLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: newSelected,
            selectedDataRow: selectedRow
          });
        } else {
          newSelected[QuotationData[i].SaleQuoteIDLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: QuotationData[i].SaleQuoteIDLineID
              ? newSelected
              : false,
            selectedDataRow: selectedRow
          });
        }
      }
    });
  }
  ////Handle Get Sales Quote LCL Details
  HandleGetSalesQuotaionLCL() {
    this.setState({ newloding: true });
    let self = this;

    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var CargoDetails = response.data.Table3;
      var FileData = response.data.Table4;
      var multiCargo = [];
      if (CargoDetails.length > 0) {
        for (let i = 0; i < CargoDetails.length; i++) {
          var objcargo = new Object();
          objcargo.BookingPackID = CargoDetails[i].BookingPackID || 0;
          objcargo.PackageType = CargoDetails[i].PackageType || "";
          objcargo.Quantity = CargoDetails[i].Quantity || 0;
          objcargo.Lengths = CargoDetails[i].Lengths || 0;
          objcargo.Width = CargoDetails[i].Width || 0;
          objcargo.Height = CargoDetails[i].Height || 0;
          objcargo.GrossWt = CargoDetails[i].GrossWt || 0;
          objcargo.VolumeWeight = CargoDetails[i].VolumeWeight || 0;
          objcargo.Volume = CargoDetails[i].Volume || CargoDetails[i].CBM || 0;
          objcargo.CBM = CargoDetails[i].CBM || 0;
          objcargo.TotalGrossWeight = CargoDetails[i].NetWeight || 0;
          multiCargo.push(objcargo);
        }
      }
      if (FileData.length > 0) {
        self.setState({ FileData });
      } else {
        self.setState({ FileData: [{ FileName: "No File Found" }] });
      }
      if (multiCargo.length > 0) {
      } else {
        multiCargo.push({ PackageType: "No Record Found" });
      }
      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        var ChgWeight = QuotationData[0].ChgWeight || 0;
        self.setState({
          cbmVal: ChgWeight,
          ChgWeight,
          CargoDetails,
          multiCBM: multiCargo,
          multiCargo,
          QuotationData,
          QuotationSubData,
          selectedCommodity,
          IncoTerms,
          POL,
          POD,
          SaleQuoteID,
          SaleQuoteIDLineID,
          TypeofMove
        });
      }
      if (Booking.length > 0) {
        var ModeofTransport = Booking[0].ModeOfTransport;
        var companyID = Booking[0].companyID;
        var company_name = Booking[0].company_name;
        var contact_name = Booking[0].contact_name;
        var Company_Address = Booking[0].Company_Address;
        var SaleQuoteNo = Booking[0].SaleQuoteID;
        var ShipmentType = Booking[0].ShipmentType;
        var NonStackable = Booking[0].NonStackable;
        var HAZMAT = Booking[0].HAZMAT;
        var NonStackable = Booking[0].NonStackable;
        var Company_AddressID = Booking[0].Company_AddressID;
        self.setState({
          Company_AddressID,
          newloding: false,
          ModeofTransport,
          companyID,
          company_name,
          contact_name,
          Company_Address,
          SaleQuoteNo,
          ShipmentType,
          NonStackable,
          HAZMAT,
          NonStackable
        });
      }

      var selectedRow = [];
      const newSelected = Object.assign({}, self.state.cSelectedRow);

      for (let i = 0; i < QuotationData.length; i++) {
        if (!isNaN(QuotationData[i].saleQuoteLineID)) {
          newSelected[QuotationData[i].saleQuoteLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: newSelected,
            selectedDataRow: selectedRow
          });
        } else {
          newSelected[QuotationData[i].SaleQuoteIDLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: QuotationData[i].SaleQuoteIDLineID
              ? newSelected
              : false,
            selectedDataRow: selectedRow
          });
        }
      }
    });
  }
  ////Handle Get Sales Quote FCL Details
  HandleGetSalesQuotaionFCL() {
    this.setState({ newloding: true });
    let self = this;

    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var CargoDetails = response.data.Table3;
      var FileData = response.data.Table4;
      var addmultiCBM = response.data.Table3;
      var multiCargo = [];
      if (CargoDetails.length > 0) {
        for (let i = 0; i < CargoDetails.length; i++) {
          var objcargo = new Object();
          objcargo.BookingPackID = CargoDetails[i].BookingPackID || 0;
          objcargo.PackageType = CargoDetails[i].PackageType || "";
          objcargo.Quantity = CargoDetails[i].Quantity || 0;
          objcargo.Lengths = CargoDetails[i].Lengths || 0;
          objcargo.Width = CargoDetails[i].Width || 0;
          objcargo.Height = CargoDetails[i].Height || 0;
          objcargo.GrossWt = CargoDetails[i].GrossWt || 0;
          objcargo.VolumeWeight = CargoDetails[i].VolumeWeight || 0;
          objcargo.Volume = CargoDetails[i].Volume || 0;
          objcargo.TotalGrossWeight = CargoDetails[i].NetWeight || 0;
          multiCargo.push(objcargo);
        }
      }
      if (FileData.length > 0) {
        self.setState({ FileData });
      } else {
        self.setState({ FileData: [{ FileName: "No File Found" }] });
      }
      if (multiCargo.length > 0) {
      } else {
        multiCargo.push({ PackageType: "No Record Found" });
      }

      if (Booking.length > 0) {
        var ModeofTransport = Booking[0].ModeOfTransport;
        var companyID = Booking[0].companyID;
        var company_name = Booking[0].company_name;
        var contact_name = Booking[0].contact_name;
        var Company_Address = Booking[0].Company_Address;
        var Company_AddressID = Booking[0].Company_AddressID;
        var ShipmentType = Booking[0].ShipmentType;
        var TypeofMove = Booking[0].TypeOfMove;
        var IncoTerms = Booking[0].IncoTerm;
        var HAZMAT = Booking[0].HAZMAT;

        self.setState({
          newloding: false,
          selectedRow: QuotationData,
          Company_AddressID,
          multiCargo,
          multiCBM: multiCargo,
          Booking,
          HAZMAT,
          CargoDetails,
          ModeofTransport,
          companyID,
          company_name,
          Company_Address,
          contact_name,
          ShipmentType,
          TypeofMove,
          IncoTerms
        });
      }
      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var ContainerCode = QuotationData[0].ContainerCode;
        var ChgWeight = QuotationData[0].ChgWeight || 0;
        self.setState({
          cbmVal: ChgWeight,
          ChgWeight,
          QuotationData,
          QuotationSubData,
          selectedCommodity,
          POL,
          POD,
          SaleQuoteID,
          SaleQuoteIDLineID,
          ContainerCode
        });
      }
      var selectedRow = [];
      const newSelected = Object.assign({}, self.state.cSelectedRow);

      for (let i = 0; i < QuotationData.length; i++) {
        if (!isNaN(QuotationData[i].saleQuoteLineID)) {
          newSelected[QuotationData[i].saleQuoteLineID] = true;
          selectedRow.push(QuotationData[i]);
        } else {
          newSelected[QuotationData[i].SaleQuoteIDLineID] = true;
          selectedRow.push(QuotationData[i]);
        }
      }
      self.setState({
        cSelectedRow: newSelected,
        selectedDataRow: selectedRow
      });
    });
  }
  ////Handle Get Sales Quote AIR Details
  HandleGetSalesQuotaionAIR() {
    this.setState({ newloding: true });
    let self = this;

    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;
    var MyWayUserID = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: {
        Mode: ContainerLoad,
        SalesQuoteNumber: salesQuotaNo,
        MyWayUserID: MyWayUserID
      },
      headers: authHeader()
    }).then(function(response) {
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var CargoDetails = response.data.Table3;
      var FileData = response.data.Table4;
      var ChgWeight = 0;
      var multiCargo = [];
      if (CargoDetails.length > 0) {
        for (let i = 0; i < CargoDetails.length; i++) {
          var objcargo = new Object();
          objcargo.BookingPackID = CargoDetails[i].BookingPackID || 0;
          objcargo.PackageType = CargoDetails[i].PackageType || "";
          objcargo.Quantity = CargoDetails[i].Quantity || 0;
          objcargo.Lengths = CargoDetails[i].Lengths || 0;
          objcargo.Width = CargoDetails[i].Width || 0;
          objcargo.Height = CargoDetails[i].Height || 0;
          objcargo.GrossWt = CargoDetails[i].GrossWt || 0;
          objcargo.VolumeWeight = CargoDetails[i].VolumeWeight || 0;
          objcargo.Volume = CargoDetails[i].Volume || 0;
          objcargo.TotalGrossWeight = CargoDetails[i].NetWeight || 0;
          multiCargo.push(objcargo);
        }
      }
      if (multiCargo.length > 0) {
      } else {
        multiCargo.push({ PackageType: "No Record Found" });
      }
      if (FileData.length > 0) {
        self.setState({ FileData });
      } else {
        self.setState({ FileData: [{ FileName: "No File Found" }] });
      }
      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        ChgWeight = QuotationData[0].ChgWeight || 0;
        self.setState({
          cbmVal: ChgWeight,
          cmbTypeRadio: ChgWeight > 0 ? "CMB" : "ALL",
          ChgWeight,
          CargoDetails,
          QuotationData,
          multiCargo,
          multiCBM: multiCargo,
          QuotationSubData,
          selectedCommodity,
          IncoTerms,
          POL,
          POD,
          SaleQuoteID,
          SaleQuoteIDLineID,
          TypeofMove
        });
      }
      if (Booking.length > 0) {
        var ModeofTransport = Booking[0].ModeOfTransport;
        var companyID = Booking[0].companyID;
        var company_name = Booking[0].company_name;
        var contact_name = Booking[0].contact_name;
        var Company_Address = Booking[0].Company_Address;
        var Company_AddressID = Booking[0].Company_AddressID;
        var SaleQuoteNo = Booking[0].SaleQuoteID;
        var ShipmentType = Booking[0].ShipmentType;
        self.setState({
          newloding: false,
          Company_AddressID,
          ModeofTransport,
          companyID,
          company_name,
          contact_name,
          Company_Address,
          SaleQuoteNo,
          ShipmentType
        });
      }
      var selectedRow = [];
      const newSelected = Object.assign({}, self.state.cSelectedRow);

      for (let i = 0; i < QuotationData.length; i++) {
        if (!isNaN(QuotationData[i].saleQuoteLineID)) {
          newSelected[QuotationData[i].saleQuoteLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: newSelected,
            selectedDataRow: selectedRow
          });
        } else {
          newSelected[QuotationData[i].SaleQuoteIDLineID] = true;
          selectedRow.push(QuotationData[i]);
          self.setState({
            cSelectedRow: QuotationData[i].SaleQuoteIDLineID
              ? newSelected
              : false,
            selectedDataRow: selectedRow
          });
        }
      }
    });
  }

  ////booking insert
  HandleBookingInsert() {
    
    let self = this;
    if (this.state.selectedDataRow.length === 1) {
      if (
        this.state.isConshinee === true ||
        this.state.isShipper === true ||
        this.state.isBuyer === true ||
        this.state.isNotify === true
      ) {
        this.setState({ loding: true });
        var userId = encryption(window.localStorage.getItem("userid"), "desc");
        var MyWayUserID = Number(userId);
        var DefaultEntityTypeID = this.state.companyID;
        var ConsigneeID = 0;
        var ConsigneeName = "";
        var Consignee_AddressID = 0;
        var Consignee_Displayas = "";
        if (this.state.isConshinee === true) {
          ConsigneeID = DefaultEntityTypeID;
          ConsigneeName = this.state.company_name;
          Consignee_AddressID = this.state.Company_AddressID;
          Consignee_Displayas = this.state.Company_Address;
        } else {
          if (this.state.consineeData) {
            ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
            ConsigneeName = this.state.consineeData.Company_Name || "";
          } else {
            ConsigneeID = 0;
            ConsigneeName = this.state.ConsineeName;
          }
          Consignee_AddressID = Number(
            this.state.Consignee_AddressID == "Other"
              ? 0
              : this.state.Consignee_AddressID == "Select"
              ? 0
              : this.state.Consignee_AddressID || 0
          );
          Consignee_Displayas = this.state.Consinee_Displayas;
        }
        var ShipperID = 0;
        var ShipperName = "";
        var Shipper_AddressID = 0;
        var Shipper_Displayas = "";
        if (this.state.isShipper === true) {
          ShipperID = DefaultEntityTypeID;
          ShipperName = this.state.company_name;
          Shipper_AddressID = this.state.Company_AddressID;
          Shipper_Displayas = this.state.Company_Address;
        } else {
          if (this.state.shipperData) {
            ShipperID = Number(this.state.shipperData.Company_ID || 0);
            ShipperName = this.state.shipperData.Company_Name || "";
          } else {
            ShipperID = 0;
            ShipperName = this.state.ShipperName;
          }
          Shipper_AddressID = Number(
            this.state.Shipper_AddressID == "Other"
              ? 0
              : this.state.Shipper_AddressID == "Select"
              ? 0
              : this.state.Shipper_AddressID || 0
          );
          Shipper_Displayas = this.state.Shipper_Displayas || "";
        }
        var BuyerID = 0;
        var Buyer_AddressID = 0;
        var Buyer_Displayas = "";
        var BuyerName = "";
        if (this.state.isBuyer === true) {
          BuyerID = DefaultEntityTypeID;
          Buyer_AddressID = this.state.Company_AddressID;
          Buyer_Displayas = this.state.Company_Address;
          BuyerName = this.state.company_name;
        } else {
          if (this.state.buyerData) {
            BuyerID = Number(this.state.buyerData.Company_ID || 0);
            BuyerName = this.state.buyerData.Company_Name;
          } else {
            BuyerID = 0;
            BuyerName = this.state.BuyerName;
          }

          Buyer_AddressID =
            this.state.Buyer_AddressID == "Other"
              ? 0
              : this.state.Buyer_AddressID == "Select"
              ? 0
              : this.state.Buyer_AddressID || 0;
          Buyer_Displayas = this.state.Buyer_Displayas || "";
        }
        var NotifyID = 0;
        var Notify_AddressID = 0;
        var Notify_Displayas = "";
        var NotifyName = "";
        if (this.state.isNotify === true) {
          NotifyID = DefaultEntityTypeID;
          Notify_AddressID = this.state.this.state.Company_AddressID;
          Notify_Displayas = this.state.Company_Address;
          NotifyName = this.state.notifyData.company_name;
        } else {
          if (this.state.notifyData) {
            NotifyID = Number(this.state.notifyData.Company_ID || 0);
            NotifyName = this.state.notifyData.Company_Name || "";
          } else {
            NotifyID = 0;
            NotifyName = this.state.NotifyName;
          }

          Notify_AddressID = Number(
            this.state.Notify_AddressID == "Other"
              ? 0
              : this.state.Notify_AddressID == "Select"
              ? 0
              : this.state.Notify_AddressID || 0
          );
          Notify_Displayas = this.state.Notify_Displayas || "";
        }
        var Mode = this.state.ContainerLoad;
        var Commodity = 0;
        if (this.state.selectedCommodity) {
          Commodity = this.state.commodityData.filter(
            x => x.Commodity === this.state.selectedCommodity
          )[0].id;
        }
        var saleQuoteID = 0;
        var saleQuoteNo = this.state.salesQuotaNo || "";
        var saleQuoteLineID = 0;
        if (this.state.QuotationData) {
          if (this.state.ContainerLoad === "INLAND") {
            var qdata = this.state.QuotationData.filter(
              x =>
                x.SaleQuoteIDLineID ===
                Number(this.state.selectedDataRow[0].SaleQuoteIDLineID)
            );
            saleQuoteLineID = qdata[0].SaleQuoteIDLineID;
            saleQuoteID = qdata[0].SaleQuoteID;
          } else {
            var qdata = this.state.QuotationData.filter(
              x =>
                x.saleQuoteLineID ===
                Number(this.state.selectedDataRow[0].saleQuoteLineID)
            );
            saleQuoteLineID = qdata[0].saleQuoteLineID;
            saleQuoteID = qdata[0].SaleQuoteID;
          }
        }
        var BookingDim = [];

        if (this.state.multiCBM.length > 0) {
          for (let i = 0; i < this.state.multiCBM.length; i++) {
            var cargoData = new Object();
            cargoData.BookingPackID = 0;
            cargoData.PackageType = this.state.multiCBM[i].PackageType || "";
            cargoData.Quantity = this.state.multiCBM[i].Quantity || 0;
            cargoData.Lengths = this.state.multiCBM[i].Lengths || 0;
            cargoData.Width = this.state.multiCBM[i].Width || 0;
            cargoData.Height = this.state.multiCBM[i].Height || 0;
            cargoData.GrossWt = this.state.multiCBM[i].GrossWt || 0;
            cargoData.VolumeWeight = this.state.multiCBM[i].VolumeWeight || 0;
            cargoData.Volume =
              this.state.multiCBM[i].Volume || this.state.multiCBM[i].CBM || 0;
            BookingDim.push(cargoData);
          }
        }

        var BookingDocs = [];
        for (let i = 0; i < this.state.FileData.length; i++) {
          if (this.state.FileData[i].QuoteID) {
            var objFile = new Object();
            objFile.BookingID = 0;
            objFile.DocumentID = this.state.FileData[i].DocumentID;
            objFile.FTPFilePath = this.state.FileData[i].FilePath;
            BookingDocs.push(objFile);
          } else {
          }
        }
        var paramData = {
          MyWayUserID: MyWayUserID,
          ShipperID: ShipperID,
          Shipper_Displayas: Shipper_Displayas,
          Shipper_AddressID: Shipper_AddressID,
          ShipperName: ShipperName,
          ConsigneeID: ConsigneeID,
          ConsigneeName: ConsigneeName,
          Consignee_AddressID: Consignee_AddressID,
          Consignee_Displayas: Consignee_Displayas,
          BuyerID: BuyerID,
          Buyer_AddressID: Buyer_AddressID,
          Buyer_Displayas: Buyer_Displayas,
          BuyerName: BuyerName,
          Mode: Mode,
          Commodity: Commodity,
          saleQuoteID: saleQuoteID,
          saleQuoteNo: saleQuoteNo,
          saleQuoteLineID: saleQuoteLineID,
          DefaultEntityTypeID: DefaultEntityTypeID,
          NotifyID: NotifyID,
          Notify_AddressID: Notify_AddressID,
          Notify_Displayas: Notify_Displayas,
          NotifyName: NotifyName,
          BookingDim: BookingDim,
          BookingDocs: BookingDocs
        };

        axios({
          method: "post",
          url: `${appSettings.APIURL}/BookingInsertion`,
          data: paramData,

          headers: authHeader()
        })
          .then(function(response) {
            if (response.data.Table) {
              var BookingNo = response.data.Table[0].BookingID;

              store.addNotification({
                // title: "Success",
                message: response.data.Table[0].Message,
                type: "success", // 'default', 'success', 'info', 'warning','danger'
                container: "top-right", // where to position the notifications
                dismiss: {
                  duration: appSettings.NotficationTime
                }
              });
              self.setState({
                BookingNo,
                loding: false
              });
              setTimeout(() => {
                if (self.state.FileDataArry.length > 0) {
                  self.HandleFileUpload();
                } else {
                  self.props.history.push("booking-table");
                }
              }, 1000);
            }
          })
          .catch(response => {
            self.setState({ loding: false });
          });
      } else {
        store.addNotification({
          // title: "Error",
          message:
            "please select atleast one Customer has a Consinee,Shipper,Notify,Buyer",
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
        message: "Please select either one quotation.",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      return false;
    }
  }
  ////Hanlde File Booking File Upload
  HandleFileUpload() {
    var BookingID = this.state.BookingNo;
    var DocumentID = 0;
    var DocumnetFile = this.state.FileDataArry;
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var formdata = new FormData();
    formdata.append("BookingID", BookingID);
    formdata.append("DocumentID", DocumentID);
    formdata.append("BookingDoc", DocumnetFile[0]);
    formdata.append("MyWayUserID", userId);

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookigFileUpload`,

      data: formdata,
      headers: authHeader()
    }).then(function(response) {
      store.addNotification({
        // title: "Success",
        message: response.data.Table[0].Result,
        type: "success", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      // this.props.history.push("./booking-table");
      self.props.history.push("booking-table");
    });
  }
  ////toggle edit cargo details
  toggleEdit(e) {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

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
  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    if (e.target.value == "Select") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields,
      selectShipStage: []
    });
    this.BindShipmentStage();
  }
  //// Bind Non Customer List
  BindChangeNonCustomer(field, e) {
    
    let self = this;
    var customerName = "";
    let fields = this.state.fields;
    if (typeof e.target !== "undefined") {
      fields[field] = e.target.value;
      customerName = e.target.value;
    } else {
      fields[field] = e;
      customerName = e;
    }

    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    if (fields[field].length > 3) {
      self.setState({ fields });
      axios({
        method: "post",
        url: `${appSettings.APIURL}/NonCustomerList`,
        data: {
          CustomerName: customerName,

          MyWayUserID: userId
        },
        headers: authHeader()
      }).then(function(response) {
        if (response.data.Table.length > 1) {
          if (field == "Consignee") {
            self.setState({
              Consignee: response.data.Table,
              fields
            });
          }
          if (field == "Notify") {
            self.setState({
              Notify: response.data.Table,
              fields
            });
          }
          if (field == "Shipper") {
            self.setState({
              Shipper: response.data.Table,
              fields
            });
          }
          if (field == "Buyer") {
            self.setState({
              Buyer: response.data.Table,
              fields
            });
          }
        } else {
          if (response.data.Table.length == 1) {
            if (field == "Consignee") {
              self.setState({
                Consignee: response.data.Table,
                fields,
                consineeData: response.data.Table[0]
              });
            }
            if (field == "Shipper") {
              self.setState({
                Shipper: response.data.Table,
                fields,
                shipperData: response.data.Table[0]
              });
            }
            if (field == "Notify") {
              self.setState({
                Notify: response.data.Table,
                fields,
                notifyData: response.data.Table[0]
              });
            }
            if (field == "Buyer") {
              self.setState({
                Buyer: response.data.Table,
                fields,
                buyerData: response.data.Table[0]
              });
            }
          } else {
            if (field == "Consignee") {
              self.setState({
                ConsineeName: fields[field],
                ConsineeID: 0,
                Consignee: response.data.Table,
                fields,
                consineeData: response.data.Table[0]
              });
            }
            if (field == "Shipper") {
              self.setState({
                ShipperName: fields[field],
                SHipperID: 0,
                Shipper: response.data.Table,
                fields,
                shipperData: response.data.Table[0]
              });
            }
            if (field == "Notify") {
              self.setState({
                NotifyName: fields[field],
                NotifyID: 0,
                Notify: response.data.Table,
                fields,
                notifyData: response.data.Table[0]
              });
            }
            if (field == "Buyer") {
              self.setState({
                BuyerName: fields[field],
                BuyerID: 0,
                Buyer: response.data.Table,
                fields,
                buyerData: response.data.Table[0]
              });
            }
          }
        }
      });
    } else {
      if (field == "Consignee") {
        self.setState({
          Consignee: [],
          fields
        });
      }
      if (field == "Notify") {
        self.setState({
          Notify: [],
          fields
        });
      }
      if (field == "Shipper") {
        self.setState({
          Shipper: [],
          fields
        });
      }
      if (field == "Buyer") {
        self.setState({
          Buyer: [],
          fields
        });
      }
    }
  }

  handleSelectCon(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;
    if (field == "Consignee") {
      this.state.ConsigneeID = id.Company_ID;
      var Consignee_Displayas = id.Company_Address;
      this.setState({ consineeData: id, Consignee_Displayas });
      this.BindCompanyAddress(field, id.Company_ID);
    }
    if (field == "Shipper") {
      var Shipper_Displayas = id.Company_Address;
      this.setState({ shipperData: id, Shipper_Displayas });
      this.state.ShipperID = id.Company_ID;
      this.BindCompanyAddress(field, id.Company_ID);
    }
    if (field == "Notify") {
      var Notify_Displayas = id.Company_Address;
      this.setState({ notifyData: id, Notify_Displayas });
      this.state.NotifyID = id.Company_ID;
      this.BindCompanyAddress(field, id.Company_ID);
    } else {
      var Buyer_AddressID = id.Company_Address;
      this.setState({ buyerData: id, Buyer_AddressID });
      this.state.BuyerID = id.Company_ID;
      this.BindCompanyAddress(field, id.Company_ID);
    }

    this.setState({
      fields,
      ConsigneeID: this.state.ConsigneeID,
      ShipperID: this.state.ShipperID
    });
  }
  ////Bind Customer Address List
  BindCompanyAddress(type, cid) {
    var ctype = type;
    var compId = cid;
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerAddressList`,
      data: {
        UserID: userId,
        CustomerID: compId
      },
      headers: authHeader()
    }).then(function(response) {
      var AData = response.data.Table;
      if (ctype === "Consignee") {
        self.setState({ conshineeAddData: AData });
      }
      if (ctype === "Shipper") {
        self.setState({ shipperAddData: AData });
      }
      if (ctype === "Notify") {
        self.setState({ notifyAddData: AData });
      }
      if (ctype === "Buyer") {
        self.setState({ buyerAddData: AData });
      }
    });
  }

  AddressChange(type, e) {
    
    var companyID = e.target.value;
    if (e.target.selectedOptions[0].label === "Other") {
      if (type == "Consignee") {
        this.setState({
          Consignee_AddressID: "Other",
          conshineeother: true,
          Consinee_Displayas: ""
        });
      }
      if (type == "Shipper") {
        this.setState({
          Shipper_AddressID: "Other",
          shipperother: true,
          Shipper_Displayas: ""
        });
      }
      if (type == "Notify") {
        this.setState({
          Notify_AddressID: "Other",
          notiother: true,
          Notify_Displayas: ""
        });
      }
      if (type == "Buyer") {
        this.setState({
          Buyer_AddressID: "Other",
          buyerother: true,
          Buyer_Displayas: ""
        });
      }
    } else if (e.target.selectedOptions[0].label === "Select") {
      if (type == "Consignee") {
        this.setState({
          Consignee_AddressID: "Select",
          conshineeother: true,
          Consinee_Displayas: ""
        });
      }
      if (type == "Shipper") {
        this.setState({
          Shipper_AddressID: "Select",
          shipperother: true,
          Shipper_Displayas: ""
        });
      }
      if (type == "Notify") {
        this.setState({
          Notify_AddressID: "Select",
          notiother: true,
          Notify_Displayas: ""
        });
      }
      if (type == "Buyer") {
        this.setState({
          Buyer_AddressID: "Select",
          buyerother: true,
          Buyer_Displayas: ""
        });
      }
    } else {
      if (type == "Consignee") {
        this.setState({
          Consignee_AddressID: companyID,
          conshineeother: true,
          Consinee_Displayas: e.target.selectedOptions[0].label
        });
      }
      if (type == "Shipper") {
        this.setState({
          Shipper_AddressID: companyID,
          shipperother: true,
          Shipper_Displayas: e.target.selectedOptions[0].label
        });
      }
      if (type == "Notify") {
        this.setState({
          Notify_AddressID: companyID,
          notiother: true,
          Notify_Displayas: e.target.selectedOptions[0].label
        });
      }
      if (type == "Buyer") {
        this.setState({
          Buyer_AddressID: companyID,
          buyerother: true,
          Buyer_Displayas: e.target.selectedOptions[0].label
        });
      }
    }
  }
  ////this method for NonCustomerList bind
  NonCustomerList() {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/NonCustomerList`,
      data: {
        MyWayUserID: userId //2679
      },
      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ NonCustomerData: data });
    });
  }

  ////this method for Commodity drop-down bind
  HandleCommodityDropdown() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,
      headers: authHeader()
    }).then(function(response) {
      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }

  onDocumentChangeHandler = event => {
    if (event.target.files[0].type === "application/pdf") {
      if (this.state.FileData[0].FileName === "No File Found") {
        var Fdata = this.state.FileData.splice(0);

        this.setState({ FileData: Fdata });
      }
      var FileData = event.target.files;

      var f_data = this.state.FileData;
      var objFile = new Object();
      objFile.FileName = event.target.files[0].name;
      this.setState({ FileDataArry: FileData });

      f_data.push(objFile);
      this.setState({ FileData: f_data });
    } else {
      store.addNotification({
        // title: "Error",
        message: "Please select only PDF File",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      return false;
    }
  };

  ////Handle Sales Document Download
  HandleFileOpen(filePath) {
    if (filePath) {
      return false;
    } else {
      var FileName = filePath.substring(filePath.lastIndexOf("/") + 1);
      var userId = encryption(window.localStorage.getItem("userid"), "desc");

      axios({
        method: "post",
        url: `${appSettings.APIURL}/DownloadFTPFile`,
        data: {
          MywayUserID: userId,
          FilePath: filePath
        },
        responseType: "blob",
        headers: authHeader()
      }).then(function(response) {
        if (response.data) {
          var blob = new Blob([response.data], {
            type: "application/pdf"
          });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = FileName;
          link.click();
        }
      });
    }
  }

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
        {this.state.ContainerLoad !== "FCL" &&
        this.state.ContainerLoad !== "INLAND" ? (
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                onChange={this.HandleChangeMultiCBM.bind(this, i)}
                placeholder="Quantity"
                className="w-100"
                name="Quantity"
                value={el.Quantity || ""}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="Length"
              value={el.Length || ""}
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
              name="height"
              value={el.height || ""}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.GrossWeight === 0 ? "GW(Kg)" : "GW(Kg)"}
              name="GrossWeight"
              value={el.GrossWeight || ""}
              className="w-100"
            />
          </div>
        </div>
        {this.state.ContainerLoad !== "FCL" &&
        this.state.ContainerLoad !== "INLAND" ? (
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
        ) : (
          ""
        )}
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
    ));
  }
  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          BookingPackID: 0,
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          Weight: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0,
          height: 0,
          GrossWeight: 0,
          Length: 0
        }
      ]
    }));
  }

  removeMultiCBM(i) {
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
  }

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

    if (this.state.ContainerLoad !== "LCL") {
      if (
        this.state.ContainerLoad === "FCL" ||
        this.state.ContainerLoad === "INLAND"
      ) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: 0
        };
      } else {
        var decVolumeWeight =
          (multiCBM[i].Quantity *
            (parseFloat(multiCBM[i].Length) *
              parseFloat(multiCBM[i].Width) *
              parseFloat(multiCBM[i].height))) /
          6000;
        if (multiCBM[i].GrossWeight > parseFloat(decVolumeWeight)) {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: multiCBM[i].GrossWeight.toFixed(2)
          };
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: parseFloat(decVolumeWeight.toFixed(2))
          };
        }
      }
    } else {
      if (
        this.state.ContainerLoad === "FCL" ||
        this.state.ContainerLoad === "INLAND"
      ) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["Volume"]: 0
        };
      } else {
        var decVolume =
          multiCBM[i].Quantity *
          ((parseFloat(multiCBM[i].Length) / 100) *
            (parseFloat(multiCBM[i].Width) / 100) *
            (parseFloat(multiCBM[i].height) / 100));
        multiCBM[i] = {
          ...multiCBM[i],
          ["Volume"]: parseFloat(decVolume.toFixed(2))
        };
      }
    }

    this.setState({ multiCBM });
  }
  ////Handle Submit Cargo Details
  SubmitCargoDetails(e) {
    // this.callbackFunction()
    var data = this.state.multiCBM;
    var multiCBM = [];

    for (let i = 0; i < data.length; i++) {
      var objcargo = new Object();
      if (data[i].PackageType !== "") {
        objcargo.PackageType = data[i].PackageType || "";
        objcargo.Quantity = data[i].Quantity || 0;
        objcargo.Lengths = data[i].Lengths || 0;
        objcargo.Width = data[i].Width || 0;
        objcargo.Height = data[i].Height || 0;
        objcargo.GrossWt = data[i].GrossWt || 0;
        objcargo.VolumeWeight = data[i].VolumeWeight || 0;
        objcargo.Volume = data[i].Volume || 0;
        objcargo.CMB = data[i].CMB || 0;
        multiCBM.push(objcargo);
      }
    }

    this.setState({ multiCargo: multiCBM });
    this.toggleEdit();
  }

  HandleRadioBtn(type, e) {
    var selectedType = e.target.checked;

    if (type === "Conshinee") {
      if (
        this.state.isShipper === false &&
        this.state.isBuyer === false &&
        this.state.isNotify === false
      ) {
        this.setState({
          isConshinee: !this.state.isConshinee
        });
      } else {
        store.addNotification({
          // title: "Error",
          message: "Only 1 is check has customer ",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      }
    } else if (type === "Shipper") {
      if (
        this.state.isConshinee === false &&
        this.state.isBuyer === false &&
        this.state.isNotify === false
      ) {
        this.setState({
          isShipper: !this.state.isShipper
        });
      } else {
        store.addNotification({
          // title: "Error",
          message: "Only 1 is check has customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      }
    } else if (type === "Buyer") {
      if (
        this.state.isConshinee === false &&
        this.state.isNotify === false &&
        this.state.isShipper === false
      ) {
        this.setState({ isBuyer: !this.state.isBuyer });
      } else {
        store.addNotification({
          // title: "Error",
          message: "Only 1 is check has customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      }
    } else if (type === "Notify") {
      if (
        this.state.isConshinee === false &&
        this.state.isBuyer === false &&
        this.state.isShipper === false
      ) {
        this.setState({
          isNotify: !this.state.isNotify
        });
      } else {
        store.addNotification({
          // title: "Error",
          message: "Only 1 is check has customer",
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      }
    } else {
    }
  }

  ////this method for party change value

  HandleConsineeAddressChange(e) {
    var addval = e.target.value;

    this.setState({ Consinee_Displayas: addval });
  }
  HandleShipperAddressChange(e) {
    var addval = e.target.value;
    this.setState({ Shipper_Displayas: addval });
  }
  HandleNotifyAddressChange(e) {
    var addval = e.target.value;
    this.setState({ Notify_Displayas: addval });
  }
  HandleBuyerAddressChange(e) {
    var addval = e.target.value;
    this.setState({ Buyer_Displayas: addval });
  }
  ////create Dynamic file elememt
  CreateFileElement() {
    return this.state.FileData.map((el, i) => (
      <div key={i}>
        <span
          onClick={e => {
            this.HandleFileOpen(el.FilePath);
          }}
        >
          <p className="file-name w-100 text-center mt-1">{el.FileName}</p>
        </span>
      </div>
    ));
  }
  ////Handle Quote toggle check box
  toggleRow(rateID, rowData) {
    const newSelected = Object.assign({}, this.state.cSelectedRow);
    newSelected[rateID] = !this.state.cSelectedRow[rateID];

    var selectedRow = [];

    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData.original);
      this.setState({
        selectedDataRow: selectedRow
      });
    } else {
      if (newSelected[rateID] === true) {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].saleQuoteLineID ===
            rowData.original.saleQuoteLineID
          ) {
            selectedRow.splice(i, 1);

            break;
          } else {
            selectedRow = this.state.selectedDataRow;
            selectedRow.push(rowData.original);
            break;
          }
        }
      } else {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].saleQuoteLineID ===
            rowData.original.saleQuoteLineID
          ) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.splice(i, 1);
            break;
          }
        }
      }
    }
    this.setState({
      cSelectedRow: newSelected,
      selectedDataRow: selectedRow
    });
  }

  cmbTypeRadioChange(e) {
    var value = e.target.value;

    this.setState({ cmbTypeRadio: value });
  }
  HandleCMBtextChange(e) {
    var Textvalue = e.target.value;

    this.setState({ cbmVal: Textvalue });
  }

  ////Handle Sales Document Delete
  HandleDocumentDelete(e, row) {
    if (row.original.FilePath) {
      var MywayUserID = encryption(
        window.localStorage.getItem("userid"),
        "desc"
      );
      var documentData = {
        QuoteID: row.original.QuoteID,
        DocumentID: row.original.DocumentID,
        MyWayUserID: MywayUserID
      };

      let self = this;
      axios({
        method: "post",
        url: `${appSettings.APIURL}/DeleteSalesQuotedocument`,

        data: documentData,
        headers: authHeader()
      }).then(function(response) {
        store.addNotification({
          // title: "Success",
          message: response.data.Table[0].Result,
          type: "success", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime
          }
        });
      });
    } else {
      var FileData = this.state.FileData;
      var index = row.index;
      if (FileData.length == 0) {
        FileData = [{ FileName: "No File Found" }];
        this.setState({ FileData });
      } else {
        FileData.splice(index);
        if (FileData.length > 0) {
          this.setState({ FileData });
        } else {
          FileData = [{ FileName: "No File Found" }];
          this.setState({ FileData });
        }
      }
    }
  }
  ////Handle Click Back Button
  handleChangePage() {
    window.history.back();
  }
  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }

  callbackFunction = callBackObj => {
    var multiCBM = callBackObj;
    this.setState({ multiCBM });
  };
  render() {
    let i = 0;
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
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
              <h2>Booking Insert</h2>
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
              <div className="row">
                <div className="col-md-12">
                  <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                    <div className="rate-final-contr">
                      <div className="title-border d-flex align-items-center justify-content-between py-3">
                        <h3>Quotation Price</h3>
                      </div>
                      <div className="react-rate-table">
                        <ReactTable
                          columns={[
                            {
                              columns: [
                                {
                                  Cell: row => {
                                    i++;

                                    var olname = "";
                                    var lname = "";
                                    if (row.original.Linename) {
                                      olname = row.original.Linename;
                                      lname =
                                        row.original.Linename.replace(
                                          " ",
                                          "_"
                                        ).replace(" ", "_") + ".png";
                                    }
                                    var saleQuote = 0;
                                    if (row.original.saleQuoteLineID != null) {
                                      saleQuote = row.original.saleQuoteLineID;
                                    } else {
                                      saleQuote =
                                        row.original.SaleQuoteIDLineID;
                                    }

                                    var mode = "";
                                    if (this.state.ModeofTransport) {
                                      mode = this.state.ModeofTransport;
                                    }
                                    if (mode == "Ocean" && lname !== "") {
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
                                                    saleQuote
                                                  ]
                                                }
                                                onChange={e =>
                                                  this.toggleRow(saleQuote, row)
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
                                              onError={this.onErrorImg.bind(
                                                this
                                              )}
                                              src={
                                                appSettings.imageURL +
                                                "OEAN_LINERS/" +
                                                lname
                                              }
                                            />
                                          </div>
                                        </React.Fragment>
                                      );
                                    } else if (mode == "Air" && lname !== "") {
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
                                                    saleQuote
                                                  ] == true
                                                }
                                                onChange={e =>
                                                  this.toggleRow(saleQuote, row)
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
                                          <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                            <div className="remember-forgot rat-img d-block m-0">
                                              <input
                                                id={"maersk-logo" + i}
                                                type="checkbox"
                                                name={"rate-tab-check"}
                                                checked={
                                                  this.state.cSelectedRow[
                                                    saleQuote
                                                  ]
                                                }
                                                onChange={e =>
                                                  this.toggleRow(saleQuote, row)
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
                                  width: 120
                                },
                                {
                                  Cell: row => {
                                    return (
                                      <>
                                        <p className="details-title">POL</p>
                                        {this.state.ContainerLoad ===
                                        "INLAND" ? (
                                          <p
                                            title={row.original.OriginName}
                                            className="details-para max2"
                                          >
                                            {row.original.OriginName}
                                          </p>
                                        ) : (
                                          <p
                                            title={row.original.POL}
                                            className="details-para max2"
                                          >
                                            {row.original.POL}
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
                                        {this.state.ContainerLoad ===
                                        "INLAND" ? (
                                          <p
                                            title={row.original.DestinationName}
                                            className="details-para max2"
                                          >
                                            {row.original.DestinationName}
                                          </p>
                                        ) : (
                                          <p
                                            title={row.original.POD}
                                            className="details-para max2"
                                          >
                                            {row.original.POD}
                                          </p>
                                        )}
                                      </>
                                    );
                                  },
                                  accessor: "PODName",
                                  filterable: true
                                  // minWidth: 175
                                },
                                {
                                  minWidth: 120,
                                  Cell: row => {
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
                                  accessor: "TransshipmentPort",
                                  filterable: true
                                },
                                {
                                  Cell: row => {
                                    return (
                                      <>
                                        <p className="details-title">
                                          Free Time
                                        </p>
                                        <p className="details-para"></p>
                                      </>
                                    );
                                  },
                                  accessor: "freeTime",
                                  filterable: true,
                                  minWidth: 80
                                },

                                {
                                  Cell: row => {
                                    var header = "";
                                    var value = "";
                                    if (this.state.ContainerLoad == "FCL") {
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
                                      this.state.ContainerLoad == "LCL"
                                    ) {
                                      header = "CBM";
                                      if (row.original.CBM) {
                                        value = row.original.CBM;
                                      }
                                    } else if (
                                      this.state.ContainerLoad == "AIR"
                                    ) {
                                      header = "CW";
                                      if (row.original["ChgWeight"]) {
                                        value = row.original["ChgWeight"];
                                      }
                                    } else {
                                      header = "CW";
                                      if (row.original["ChgWeight"]) {
                                        value = row.original["ChgWeight"];
                                      }
                                    }

                                    return (
                                      <>
                                        <p className="details-title">
                                          {header}
                                        </p>
                                        <p className="details-para">{value}</p>
                                      </>
                                    );
                                  },
                                  accessor: "ContainerType",
                                  filterable: true
                                  //minWidth: 175
                                },
                                {
                                  minWidth: 90,
                                  accessor: "ExpiryDate",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">Expiry</p>
                                        <p className="details-para">
                                          {new Date(
                                            row.original.ExpiryDate
                                          ).toLocaleDateString("en-US")}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                },
                                {
                                  Cell: row => {
                                    return (
                                      <>
                                        <p className="details-title">
                                          TT (Days)
                                        </p>
                                        {this.state.ContainerLoad !==
                                        "INLAND" ? (
                                          <p className="details-para">
                                            {row.original.TransitTime}
                                          </p>
                                        ) : (
                                          <p className="details-para"></p>
                                        )}
                                      </>
                                    );
                                  },
                                  accessor: "TransitTime"
                                  // minWidth: 60
                                },

                                {
                                  minWidth: 80,
                                  accessor: "Total",
                                  Cell: row => {
                                    var Totalamount = parseFloat(
                                      row.original.Total.split(" ")[0]
                                    );
                                    var curency = row.original.Total.split(
                                      " "
                                    )[1];
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">Price</p>
                                        <p className="details-para">
                                          {Totalamount.toFixed(2) +
                                            " " +
                                            curency}
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
                                      x.saleQuoteLineID ===
                                        row.original.saleQuoteLineID ||
                                      row.original.SaleQuoteIDLineID ||
                                      row.original.SaleQuote_ID
                                  )}
                                  columns={[
                                    {
                                      columns: [
                                        {
                                          Header: "C. Description",
                                          accessor: "ChargeDesc"
                                        },
                                        {
                                          Header: "C.Name",
                                          accessor: "ChargeCode"
                                        },
                                        {
                                          Header: "Units",
                                          accessor: "Chargeitem"
                                        },
                                        {
                                          Header: "Unit Price",
                                          accessor: "Amount"
                                        },
                                        {
                                          Header: "Final Payment",
                                          accessor: "Total"
                                        }
                                      ]
                                    }
                                  ]}
                                  // defaultPageSize={3}
                                  minRows={1}
                                  showPagination={false}
                                />
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="rate-final-contr">
                      <Collapse in={this.state.showContent}>
                        <div>
                          <div
                            className="title-border py-3"
                            style={{ marginBottom: "15px" }}
                          >
                            <h3>Rate Query</h3>
                          </div>
                          <div className="row">
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Shipment Type</p>
                              <p className="details-para">
                                {this.state.ShipmentType}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Mode of Transport</p>
                              <p className="details-para">
                                {this.state.ModeofTransport}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Container Load</p>
                              <p className="details-para">
                                {this.state.ContainerLoad}
                              </p>
                            </div>
                            {this.state.ContainerLoad === "FCL" ? (
                              <>
                                <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                  <p className="details-title">
                                    Equipment Types
                                  </p>
                                  <p className="details-para">
                                    {this.state.ContainerCode}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                  <p className="details-title">
                                    Special Equipment
                                  </p>
                                  <p className="details-para"></p>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">HazMat</p>
                              <p className="details-para">
                                {this.state.HAZMAT === 1 ? "Yes" : "No"}
                              </p>
                            </div>
                            {this.state.ContainerLoad === "AIR" ||
                            this.state.ContainerLoad === "LCL" ? (
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">Unstackable</p>
                                <p className="details-para">
                                  {this.state.NonStackable === 1 ? "Yes" : "No"}
                                </p>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Customs Clearance</p>
                              <p className="details-para">
                                {this.state.Customs_Clearance === 1
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                              <p className="details-title">Inco Terms</p>
                              <p className="details-para">
                                {this.state.IncoTerms}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Type of Move</p>
                              <p className="details-para">
                                {this.state.TypeofMove}
                              </p>
                            </div>

                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">POL</p>
                              <p className="details-para">{this.state.POL}</p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                              <p className="details-title">POD</p>
                              <p className="details-para">{this.state.POD}</p>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                      <div
                        className="text-right"
                        style={{ marginBottom: "15px" }}
                      >
                        <button
                          className={className}
                          id="toggler"
                          onClick={() =>
                            this.setState({
                              showContent: !this.state.showContent
                            })
                          }
                        >
                          {this.state.showContent ? (
                            <span>VIEW LESS</span>
                          ) : (
                            <span>VIEW MORE</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rate-final-contr">
                      <div>
                        <div className="title-border-t py-3">
                          <h3>Customer Details</h3>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">Account/Customer</p>

                              <p className="details-para">
                                {this.state.company_name}
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.Company_Address}
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">
                                Notification Person
                              </p>
                              <p className="details-para">
                                {this.state.contact_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div>
                      <div className="remember-forgot rate-checkbox">
                      </div>
                    </div> */}
                      <div>
                        <div className="title-border-t py-3 remember-forgot book-ins-sect rate-checkbox">
                          <h3 style={{ display: "inline" }}>
                            Consignee Details
                          </h3>
                          <input
                            type="checkbox"
                            onChange={this.HandleRadioBtn.bind(
                              this,
                              "Conshinee"
                            )}
                            name="cust-select"
                            id="Conshinee"
                            checked={this.state.isConshinee}
                            value="Consignee"
                          />
                          <label className="d-flex" htmlFor="Conshinee">
                            Same as Customer
                          </label>
                        </div>
                        <div>
                          {this.state.isConshinee === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields insert-drpdwn divblock">
                                <p className="details-title">Consignee Name</p>
                                <Autocomplete
                                  getItemValue={item => item.Company_Name}
                                  items={this.state.Consignee}
                                  renderItem={(item, isHighlighted) => (
                                    <div
                                      style={{
                                        // width:"100%",
                                        background: isHighlighted
                                          ? "lightgray"
                                          : "white"
                                      }}
                                      value={item.Company_ID}
                                    >
                                      {item.Company_Name}
                                    </div>
                                  )}
                                  onChange={this.BindChangeNonCustomer.bind(
                                    this,
                                    "Consignee"
                                  )}
                                  // menuStyle={this.state.menuStyle}
                                  onSelect={this.handleSelectCon.bind(
                                    this,
                                    item => item.Company_ID,
                                    "Consignee"
                                  )}
                                  value={this.state.fields["Consignee"]}
                                />
                              </div>

                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Consignee"
                                  )}
                                  value={this.state.Consignee_AddressID}
                                >
                                  <option value="Select">Select</option>

                                  {this.state.conshineeAddData.length > 0
                                    ? this.state.conshineeAddData.map(
                                        (item, i) => (
                                          <option
                                            key={i}
                                            value={item.AddressID}
                                          >
                                            {item.Cust_Address}
                                          </option>
                                        )
                                      )
                                    : ""}
                                  <option value={"Other"}>Other</option>
                                </select>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">&nbsp;</p>
                                {this.state.conshineeother === true ? (
                                  <textarea
                                    className="form-control"
                                    style={{ width: "100%", resize: "none" }}
                                    value={this.state.Consinee_Displayas}
                                    onChange={this.HandleConsineeAddressChange.bind(
                                      this
                                    )}
                                  ></textarea>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">
                                    Consignee Name
                                  </p>

                                  <p className="details-para">
                                    {this.state.company_name}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Address</p>
                                  <p className="details-para">
                                    {this.state.Company_Address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="title-border-t py-3 remember-forgot book-ins-sect rate-checkbox">
                          <h3 style={{ display: "inline" }}>Shipper Details</h3>
                          <div style={{ display: "inline", float: "left" }}>
                            <input
                              type="checkbox"
                              onChange={this.HandleRadioBtn.bind(
                                this,
                                "Shipper"
                              )}
                              name="cust-select"
                              id="Shipper"
                              checked={this.state.isShipper}
                              value="Shipper"
                            />
                            <label
                              className="d-flex flex-column align-items-center"
                              htmlFor="Shipper"
                            >
                              Same as Customer
                            </label>
                          </div>
                        </div>
                        <div>
                          {this.state.isShipper === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields insert-drpdwn divblock">
                                <p className="details-title">Shipper Name</p>
                                <Autocomplete
                                  getItemValue={item => item.Company_Name}
                                  items={this.state.Shipper}
                                  renderItem={(item, isHighlighted) => (
                                    <div
                                      style={{
                                        background: isHighlighted
                                          ? "lightgray"
                                          : "white"
                                      }}
                                    >
                                      {item.Company_Name}
                                    </div>
                                  )}
                                  value={this.state.fields["Shipper"]}
                                  onChange={this.BindChangeNonCustomer.bind(
                                    this,
                                    "Shipper"
                                  )}
                                  // menuStyle={this.state.menuStyle}
                                  onSelect={this.handleSelectCon.bind(
                                    this,
                                    item => item.Company_ID,
                                    "Shipper"
                                  )}
                                />
                              </div>

                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Shipper"
                                  )}
                                  value={this.state.Shipper_AddressID}
                                >
                                  <option value="Select">Select</option>

                                  {this.state.shipperAddData.length > 0
                                    ? this.state.shipperAddData.map(
                                        (item, i) => (
                                          <option
                                            key={i}
                                            value={item.AddressID}
                                          >
                                            {item.Cust_Address}
                                          </option>
                                        )
                                      )
                                    : ""}
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">&nbsp;</p>
                                {this.state.shipperother === true ? (
                                  <textarea
                                    className="form-control"
                                    style={{ width: "100%", resize: "none" }}
                                    value={this.state.Shipper_Displayas}
                                    onChange={this.HandleShipperAddressChange.bind(
                                      this
                                    )}
                                  ></textarea>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Shipper Name</p>

                                  <p className="details-para">
                                    {this.state.company_name}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Address</p>
                                  <p className="details-para">
                                    {this.state.Company_Address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="">
                        <div className="title-border-t py-3 remember-forgot book-ins-sect rate-checkbox">
                          <h3 style={{ display: "inline" }}>Buyer Details</h3>
                          <input
                            type="checkbox"
                            onChange={this.HandleRadioBtn.bind(this, "Buyer")}
                            name="cust-select"
                            id="Buyer"
                            checked={this.state.isBuyer}
                            value="Buyer"
                          />
                          <label className="d-flex" htmlFor="Buyer">
                            Same as Customer
                          </label>
                        </div>
                        <div>
                          {this.state.isBuyer === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields insert-drpdwn divblock">
                                <p className="details-title">Buyer Name</p>
                                <p className="position-relative">
                                  <Autocomplete
                                    getItemValue={item => item.Company_Name}
                                    items={this.state.Buyer}
                                    renderItem={(item, isHighlighted) => (
                                      <div
                                        style={{
                                          background: isHighlighted
                                            ? "lightgray"
                                            : "white"
                                        }}
                                      >
                                        {item.Company_Name}
                                      </div>
                                    )}
                                    value={this.state.fields["Buyer"]}
                                    onChange={this.BindChangeNonCustomer.bind(
                                      this,
                                      "Buyer"
                                    )}
                                    // menuStyle={this.state.menuStyle}
                                    onSelect={this.handleSelectCon.bind(
                                      this,
                                      item => item.Company_ID,
                                      "Buyer"
                                    )}
                                  />
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">Address</p>

                                {/* {this.state.Buyer_Displayas !== ""
                                ? this.state.Buyer_Displayas
                                : null} */}
                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Buyer"
                                  )}
                                  value={this.state.Buyer_AddressID}
                                >
                                  <option value="Select">Select</option>

                                  {this.state.buyerAddData.length > 0
                                    ? this.state.buyerAddData.map((item, i) => (
                                        <option key={i} value={item.AddressID}>
                                          {item.Cust_Address}
                                        </option>
                                      ))
                                    : ""
                                  //<option>Other</option>
                                  }
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">&nbsp;</p>
                                {this.state.buyerother === true ? (
                                  <textarea
                                    className="form-control"
                                    style={{ width: "100%", resize: "none" }}
                                    value={this.state.Buyer_Displayas}
                                    onChange={this.HandleBuyerAddressChange.bind(
                                      this
                                    )}
                                  ></textarea>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Buyer Name</p>

                                  <p className="details-para">
                                    {this.state.company_name}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Address</p>
                                  <p className="details-para">
                                    {this.state.Company_Address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="">
                        <div className="title-border-t py-3 remember-forgot book-ins-sect rate-checkbox">
                          <h3 style={{ display: "inline" }}>Notify Details</h3>
                          <input
                            type="checkbox"
                            onChange={this.HandleRadioBtn.bind(this, "Notify")}
                            name="cust-select"
                            id="Notify"
                            checked={this.state.isNotify}
                            value="Notify"
                          />
                          <label className="d-flex" htmlFor="Notify">
                            Same as Customer
                          </label>
                        </div>
                        <div>
                          {this.state.isNotify === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields insert-drpdwn divblock">
                                <p className="details-title">
                                  Notify Party Name
                                </p>
                                <p className="position-relative">
                                  <Autocomplete
                                    getItemValue={item => item.Company_Name}
                                    items={this.state.Notify}
                                    renderItem={(item, isHighlighted) => (
                                      <div
                                        style={{
                                          background: isHighlighted
                                            ? "lightgray"
                                            : "white"
                                        }}
                                      >
                                        {item.Company_Name}
                                      </div>
                                    )}
                                    value={this.state.fields["Notify"]}
                                    onChange={this.BindChangeNonCustomer.bind(
                                      this,
                                      "Notify"
                                    )}
                                    // menuStyle={this.state.menuStyle}
                                    onSelect={this.handleSelectCon.bind(
                                      this,
                                      item => item.Company_ID,
                                      "Notify"
                                    )}
                                  />
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Notify"
                                  )}
                                  value={this.state.Notify_AddressID}
                                >
                                  <option value="Select">Select</option>

                                  {this.state.notifyAddData.length > 0
                                    ? this.state.notifyAddData.map(
                                        (item, i) => (
                                          <option
                                            key={i}
                                            value={item.AddressID}
                                          >
                                            {item.Cust_Address}
                                          </option>
                                        )
                                      )
                                    : ""}
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 login-fields">
                                <p className="details-title">&nbsp;</p>
                                {this.state.notiother === true ? (
                                  <textarea
                                    className="form-control"
                                    style={{ width: "100%", resize: "none" }}
                                    value={this.state.Notify_Displayas}
                                    onChange={this.HandleNotifyAddressChange.bind(
                                      this
                                    )}
                                  ></textarea>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">
                                    Notify Party Name
                                  </p>

                                  <p className="details-para">
                                    {this.state.company_name}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4">
                                  <p className="details-title">Address</p>
                                  <p className="details-para">
                                    {this.state.Company_Address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 login-fields">
                          <p className="details-title">Commodity</p>
                          <select
                            disabled={true}
                            value={this.state.selectedCommodity}
                          >
                            <option>Select</option>
                            {this.state.commodityData.map((item, i) => (
                              <option key={i} value={item.Commodity}>
                                {item.Commodity}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <div
                          className="title-border-t py-3"
                          style={{ width: "100%" }}
                        >
                          <h3 style={{ display: "inline" }}>Cargo Details</h3>

                          <button
                            onClick={this.toggleEdit}
                            style={{ margin: "0 0 15px 0", float: "right" }}
                            className="butn more-padd"
                          >
                            Cargo Details
                          </button>
                        </div>
                      </div>
                      <div
                        className="row ratefinalpgn"
                        style={{ display: "block" }}
                      >
                        <ReactTable
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
                                  Header: "Width",
                                  accessor: "Width"
                                },
                                {
                                  Header: "Height",
                                  accessor: "Height"
                                },
                                {
                                  Header: "Gross Weight",
                                  accessor: "GrossWt"
                                },
                                {
                                  Header:
                                    this.state.ChgWeight == 0
                                      ? "Volume Weight"
                                      : "ChgWeight",
                                  accessor: "VolumeWeight",
                                  show:
                                    this.state.ContainerLoad != "LCL"
                                      ? true
                                      : false
                                },
                                {
                                  Header: "CBM",
                                  accessor: "Volume",
                                  show:
                                    this.state.ContainerLoad == "LCL"
                                      ? true
                                      : false
                                }
                              ]
                            }
                          ]}
                          data={this.state.multiCargo}
                          minRows={0}
                          showPagination={false}
                          className="-striped -highlight"
                        />
                      </div>
                      <div className="row cargodetailsB"></div>

                      <div className="rename-cntr login-fields d-block">
                        <div className="d-flex w-100 mt-4 align-items-center">
                          <div className="w-100">
                            <input
                              id="file-upload"
                              className="file-upload d-none"
                              type="file"
                              onChange={this.onDocumentChangeHandler}
                            />
                            <label htmlFor="file-upload">
                              <div className="file-icon">
                                <img src={FileUpload} alt="file-upload" />
                              </div>
                              Add File
                            </label>
                          </div>
                        </div>
                        <br />
                        <ReactTable
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "File name",
                                  accessor: "FileName"
                                },

                                {
                                  Header: "Action",
                                  Cell: row => {
                                    if (
                                      row.original.FilePath !== undefined &&
                                      row.original.FileName !== "No File Found"
                                    ) {
                                      return (
                                        <div className="action-cntr">
                                          <a
                                            onClick={e =>
                                              // this.HandleDowloadFile(e, row)
                                              this.HandleFileOpen(
                                                e,
                                                row.original.FilePath
                                              )
                                            }
                                          >
                                            <img
                                              title={"Download"}
                                              style={{ cursor: "pointer" }}
                                              className="actionicon"
                                              src={Download}
                                              alt="download-icon"
                                            />
                                          </a>
                                          <a
                                            onClick={e =>
                                              this.HandleDocumentDelete(e, row)
                                            }
                                          >
                                            <img
                                              title={"Delete"}
                                              style={{ cursor: "pointer" }}
                                              className="actionicon"
                                              src={Delete}
                                              alt="download-icon"
                                            />
                                          </a>
                                        </div>
                                      );
                                    } else if (
                                      row.original.FilePath !== "" &&
                                      row.original.FileName !== "No File Found"
                                    ) {
                                      return (
                                        <div className="action-cntr">
                                          <a
                                            onClick={e =>
                                              this.HandleDocumentDelete(e, row)
                                            }
                                          >
                                            <img
                                              title={"Delete"}
                                              style={{ cursor: "pointer" }}
                                              className="actionicon"
                                              F
                                              src={Delete}
                                              alt="download-icon"
                                            />
                                          </a>
                                        </div>
                                      );
                                    } else {
                                      return <></>;
                                    }
                                  }
                                }
                              ]
                            }
                          ]}
                          data={this.state.FileData}
                          minRows={0}
                          showPagination={false}
                        />
                      </div>
                    </div>
                  </div>
                  <center>
                    <button
                      onClick={this.HandleBookingInsert.bind(this)}
                      className="butn more-padd mt-4"
                      disabled={this.state.loding === true ? true : false}
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
                        "Send Booking"
                      )}
                    </button>
                  </center>
                  <p>
                    {this.state.errormessage !== ""
                      ? this.state.errormessage
                      : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------Edit Cargo Details Modal----------------------------- */}
        <Modal
          className="delete-popup pol-pod-popup large-popup large-popupka"
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

              <Comman
                parentCallback={this.callbackFunction}
                multiCBM={this.state.multiCBM}
                packageTypeData={this.state.packageTypeData}
                containerLoadType={this.state.ContainerLoad}
              />

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
      </React.Fragment>
    );
  }
}

export default BookingInsert;

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
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import { encryption } from "../helpers/encryption";
import { Button, Modal, ModalBody } from "reactstrap";

class BookingInsert extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      Consinee_AddressID: 0,
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

      //---------------sales quotation details
      multiCBM: [],
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
      NonStackable:0,
      Customs_Clearance:0,
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
      currentPackageType: "",
      valuequantity: 0,
      valuelenght: 0,
      valuewidth: 0,
      valueheight: 0,
      valueweight: 0,
      valuecbm: 0,
      valuespecialsontainersode: "",
      modalEdit: false,
      
    };
    // this.HandleFileOpen = this.HandleFileOpen.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }
  componentDidMount() {
    debugger;
    var rData = this.props.location.state;
    if (
      // typeof rData.ContainerLoad !== "" &&
      // typeof rData.salesQuotaNo !== "" &&
      rData.ContainerLoad !== undefined &&
      rData.salesQuotaNo !== undefined
    ) {
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

  HandleGetSalesQuotaionINLAND() {
    let self = this;
    debugger;
    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var multiCBM = response.data.Table3;

      //   var EquipmentTypes = QuotationData[0].ContainerCode || "";

      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        self.setState({
          multiCBM,
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

        self.setState({
          ModeofTransport,
          companyID,
          company_name,
          contact_name,
          Company_Address,
          SaleQuoteNo,
          ShipmentType
        });
      }
    });
  }

  HandleGetSalesQuotaionLCL() {
    let self = this;
    debugger;
    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var multiCBM = response.data.Table3;

      //   var EquipmentTypes = QuotationData[0].ContainerCode || "";

      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        self.setState({
          multiCBM,
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
        var NonStackable=Booking[0].NonStackable;
        var HAZMAT=Booking[0].HAZMAT;
        var NonStackable=Booking[0].NonStackable;

        self.setState({
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
    });
  }

  HandleGetSalesQuotaionFCL() {
    let self = this;
    debugger;
    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var multiCBM = response.data.Table3;

      //   var EquipmentTypes = QuotationData[0].ContainerCode || "";

      if (Booking.length > 0) {
        var ModeofTransport = Booking[0].ModeOfTransport;
        var companyID = Booking[0].companyID;
        var company_name = Booking[0].company_name;
        var contact_name = Booking[0].contact_name;
        var Company_Address = Booking[0].Company_Address;

        var ShipmentType = Booking[0].ShipmentType;
        var TypeofMove = Booking[0].TypeOfMove;
        var IncoTerms = Booking[0].IncoTerm;
        var HAZMAT = Booking[0].HAZMAT;
        self.setState({
          Booking,
          HAZMAT,
          multiCBM,
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
        self.setState({
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
    });
  }

  HandleGetSalesQuotaionAIR() {
    let self = this;
    debugger;
    var ContainerLoad = this.state.ContainerLoad;
    var salesQuotaNo = this.state.salesQuotaNo;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var QuotationData = response.data.Table1;
      var QuotationSubData = response.data.Table2;
      var Booking = response.data.Table;
      var multiCBM = response.data.Table3;

      //   var EquipmentTypes = QuotationData[0].ContainerCode || "";

      if (QuotationData.length > 0) {
        var selectedCommodity = QuotationData[0].Commodity;
        var IncoTerms = QuotationData[0].IncoTerm;
        var POL = QuotationData[0].POL;
        var POD = QuotationData[0].POD;
        var SaleQuoteID = QuotationData[0].SaleQuoteID;
        var SaleQuoteIDLineID = QuotationData[0].SaleQuoteIDLineID;
        var TypeofMove = QuotationData[0].TypeOfMove;
        self.setState({
          multiCBM,
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

        self.setState({
          ModeofTransport,
          companyID,
          company_name,
          contact_name,
          Company_Address,
          SaleQuoteNo,
          ShipmentType
        });
      }
    });
  }

  ////booking insert

  HandleBookigInsert() {
    let self = this;
    debugger;

    var userId = encryption(window.localStorage.getItem("userid"), "desc");

    var MyWayUserID = Number(userId);

    var DefaultEntityTypeID = this.state.companyID; ////ask to way it give parameter

    var ConsigneeID = 0;
    var ConsigneeName = "";
    var Consignee_AddressID = 0;
    var Consignee_Displayas = "";
    if (this.state.isConshinee === true) {
      var ConsigneeID = DefaultEntityTypeID;
      var ConsigneeName = this.state.company_name;
      var Consignee_AddressID = 0;
      var Consignee_Displayas = this.state.Company_Address;
    } else {
      var ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
      var ConsigneeName = this.state.consineeData.Company_Name || "";
      var Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
      var Consignee_Displayas = this.state.Consinee_Displayas;
    }
    var ShipperID = 0;
    var ShipperName = "";
    var Shipper_AddressID = 0;
    var Shipper_Displayas = "";
    if (this.state.isShipper === true) {
      ShipperID = DefaultEntityTypeID;
      ShipperName = this.state.company_name;
      Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
      Shipper_Displayas = this.state.Company_Address;
    } else {
      ShipperID = Number(this.state.shipperData.Company_ID || 0);
      ShipperName = this.state.shipperData.Company_Name || "";
      Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
      Shipper_Displayas = this.state.Shipper_Displayas || "";
    }

    // var ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
    // var ConsigneeName = this.state.consineeData.Company_Name || "";
    // var Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
    // var Consignee_Displayas = this.state.Consinee_Displayas;

    var BuyerID = Number(this.state.buyerData.Company_ID || 0);
    var Buyer_AddressID = this.state.Buyer_AddressID;
    var Buyer_Displayas = this.state.Buyer_Displayas;
    var BuyerName = this.state.buyerData.Company_Name;

    var Mode = this.state.ContainerLoad;
    var Commodity = 0;
    if (this.state.selectedCommodity) {
      Commodity = this.state.commodityData.filter(
        x => x.Commodity === this.state.selectedCommodity
      )[0].id;
    }
    // var Commodity = Number(
    //   this.state.commodityData.filter(
    //     x => x.Commodity === this.state.Commodity
    //   )[0].id || 0
    // );
    // var Commodity = 49;

    var saleQuoteID = Number(this.state.QuotationData[0].SaleQuoteID || 0);
    var saleQuoteNo = this.state.salesQuotaNo || "";
    var saleQuoteLineID = Number(
      this.state.QuotationData[0].saleQuoteLineID || 0
    );

    var NotifyID = Number(this.state.notifyData.Company_ID || 0);
    var Notify_AddressID = Number(this.state.Notify_AddressID || 0);
    var Notify_Displayas = this.state.Notify_Displayas || "";
    var NotifyName = this.state.notifyData.Company_Name || "";

    var BookingDim = [];

    if (this.state.multiCBM.length > 0) {
      for (let i = 0; i < this.state.multiCBM.length; i++) {
        var cargoData = new Object();
        if (Mode === "AIR") {
          cargoData.BookingPackID = this.state.multiCBM[i].BookingPackID || 0;
          cargoData.PackageType = this.state.multiCBM[i].PackageType || "";
          cargoData.Quantity = this.state.multiCBM[i].Quantity || 0;
          cargoData.Lengths = this.state.multiCBM[i].Length || 0;
          cargoData.Width = this.state.multiCBM[i].Width || 0;
          cargoData.Height = this.state.multiCBM[i].height || 0;
          cargoData.GrossWt = this.state.multiCBM[i].GrossWeight || 0;
          cargoData.VolumeWeight = this.state.multiCBM[i].VolumeWeight || 0;
          cargoData.Volume = this.state.multiCBM[i].Volume || 0;
        } else {
          cargoData.BookingPackID = this.state.multiCBM[i].BookingPackID || 0;
          cargoData.PackageType = this.state.multiCBM[i].PackageType || "";
          cargoData.Quantity = this.state.multiCBM[i].QTY || 0;
          cargoData.Lengths = this.state.multiCBM[i].Length || 0;
          cargoData.Width = this.state.multiCBM[i].Width || 0;
          cargoData.Height = this.state.multiCBM[i].Height || 0;
          cargoData.GrossWt = this.state.multiCBM[i].GrossWeight || 0;
          cargoData.VolumeWeight = this.state.multiCBM[i].VolumeWeight || 0;
          cargoData.Volume = this.state.multiCBM[i].Volume || 0;
        }
        BookingDim.push(cargoData);
      }
    } else {
      var cargoData = new Object();

      cargoData.BookingPackID = 0;
      cargoData.PackageType = "";
      cargoData.Quantity = 0;
      cargoData.Lengths = 0;
      cargoData.Width = 0;
      cargoData.Height = 0;
      cargoData.GrossWt = 0;
      cargoData.VolumeWeight = 0;
      cargoData.Volume = 0;
      BookingDim.push(cargoData);
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
      BookingDocs: []
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingInsertion`,
      data: paramData,

      headers: authHeader()
    }).then(function(response) {
      debugger;
      if (response.data.Table) {
        var BookingNo = response.data.Table[0].BookingID;
        NotificationManager.success(response.data.Table[0].Message);
        self.setState({ BookingNo });
        self.HandleFileUpload();
      }
    });
  }

  HandleFileUpload() {
    debugger;
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
      // data: {
      //   BookingID: BookingID,
      //   DocumentID: DocumentID,
      //   BookingDoc: DocumnetFile,
      //   MyWayUserID: userId
      // },
      data: formdata,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data.Table[0].Result);
      // this.props.history.push("./booking-table");
      self.props.history.push("booking-table");
    });
  }

  toggleEdit(e) {
    debugger;

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

  ////file upload method for booking
  HandleFileUload() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookigFileUpload`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ packageTypeData: data });
    });
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

  HandleChangeCon(field, e) {
    debugger;
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
      axios({
        method: "post",
        url: `${appSettings.APIURL}/NonCustomerList`,
        data: {
          CustomerName: customerName,

          MyWayUserID: userId
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;

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
                ConsineeName:fields[field],
                ConsineeID:0,
                Consignee: response.data.Table,
                fields,
                consineeData: response.data.Table[0]
              });
            }
            if (field == "Shipper") {
              self.setState({
                ShipperName:fields[field],
                SHipperID:0,
                Shipper: response.data.Table,
                fields,
                shipperData: response.data.Table[0]
              });
            }
            if (field == "Notify") {
              self.setState({
                NotifyName:fields[field],
                NotifyID:0,
                Notify: response.data.Table,
                fields,
                notifyData: response.data.Table[0]
              });
            }
            if (field == "Buyer") {
              self.setState({
                BuyerName:fields[field],
                BuyerID:0,
                Buyer: response.data.Table,
                fields,
                buyerData: response.data.Table[0]
              });
            }

            // self.setState({
            //   fields
            // });
          }
        }
      });
    } else {
      self.setState({
        fields
      });
    }
  }

  handleSelectCon(e, field, value, id) {
    debugger;
    let fields = this.state.fields;
    fields[field] = value;
    if (field == "Consignee") {
      this.state.ConsigneeID = id.Company_ID;
      var Consignee_Displayas = id.Company_Address;
      this.setState({ consineeData: id, Consignee_Displayas });
      this.HandleCompanyAddress(field, id.Company_ID);
    }
    if (field == "Shipper") {
      var Shipper_Displayas = id.Company_Address;
      this.setState({ shipperData: id, Shipper_Displayas });
      this.state.ShipperID = id.Company_ID;
      this.HandleCompanyAddress(field, id.Company_ID);
    }
    if (field == "Notify") {
      var Notify_Displayas = id.Company_Address;
      this.setState({ notifyData: id, Notify_Displayas });
      this.state.NotifyID = id.Company_ID;
      this.HandleCompanyAddress(field, id.Company_ID);
    } else {
      var Buyer_AddressID = id.Company_Address;
      this.setState({ buyerData: id, Buyer_AddressID });
      this.state.BuyerID = id.Company_ID;
      this.HandleCompanyAddress(field, id.Company_ID);
    }

    this.setState({
      fields,
      ConsigneeID: this.state.ConsigneeID,
      ShipperID: this.state.ShipperID
    });
  }

  HandleCompanyAddress(type, cid) {
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
    debugger;
    var companyID = e.target.value;
    if (e.target.selectedOptions[0].label === "Other") {
      if (type == "Consignee") {
        this.setState({
          Consignee_AddressID: 0,
          conshineeother: true,
          Consinee_Displayas: ""
        });
      }
      if (type == "Shipper") {
        this.setState({
          Shipper_AddressID: 0,
          shipperother: true,
          Shipper_Displayas: ""
        });
      }
      if (type == "Notify") {
        this.setState({
          Notify_AddressID: 0,
          notiother: true,
          Notify_Displayas: ""
        });
      }
      if (type == "Buyer") {
        this.setState({
          Buyer_AddressID: 0,
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
    debugger;
    var FileData = event.target.files;
    var FileDataArry = [];
    var filesArr = this.state.selectedFile;
    for (let i = 0; i < FileData.length; i++) {
      var objeFile = new Object();
      objeFile.FileName = event.target.files[i].name;

      FileDataArry.push(event.target.files[i]);
      filesArr.push(objeFile);

      this.setState({
        selectedFile: filesArr,
        FileDataArry
      });
    }
    this.CreateFileElement();
  };

  ////this methos for bookig details BookigGridDetailsList

  HandleFileOpen(filePath) {
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

  ////this method for multiple file element create
  CreateFileElement() {
    return this.state.selectedFile.map((el, i) => (
      <div key={i}>
        <span
        //   onClick={e => {
        //     this.HandleFileOpen(el.FilePath);
        //   }}
        >
          <p className="file-name w-100 text-center mt-1">{el.FileName}</p>
        </span>
      </div>
    ));
  }
  ////end methos for multiple file element

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
        [name]: value === "" ? 0 : parseFloat(value)
      };
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (multiCBM[i].Quantity *
          (multiCBM[i].Length * multiCBM[i].Width * multiCBM[i].height)) /
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
        ((multiCBM[i].Length / 100) *
          (multiCBM[i].Width / 100) *
          (multiCBM[i].height / 100));
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
          {(this.state.ContainerLoad == "LCL" || "AIR" || "LTL") &&
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
        [name]: value === "" ? 0 : parseFloat(value)
      };
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (multiCBM[i].Quantity *
          (multiCBM[i].Length * multiCBM[i].Width * multiCBM[i].height)) /
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
        ((multiCBM[i].Length / 100) *
          (multiCBM[i].Width / 100) *
          (multiCBM[i].height / 100));
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
          {(this.state.ContainerLoad == "LCL" || "AIR" || "LTL") &&
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

  SubmitCargoDetails(e) {
    debugger;
    // var PackageDetailsArr = [];
    // if (
    //   this.state.ContainerLoad == "AIR" ||
    //   this.state.ContainerLoad == "LCL"
    // ) {
    //   let multiCBM = [...this.state.multiCBM];
    //   for (var i = 0; i < multiCBM.length; i++) {
    //     if (
    //       multiCBM[i].PackageType + "_" + i ==
    //       e.target.getAttribute("data-valuespecialsontainersode")
    //     ) {
    //       multiCBM[i].PackageType = this.state.currentPackageType;
    //     }

    //     PackageDetailsArr.push({
    //       PackageType: multiCBM[i].PackageType,
    //       SpecialContainerCode: multiCBM[i].PackageType + "_" + i,
    //       ContainerType: multiCBM[i].PackageType,
    //       Packaging: "-",
    //       Quantity: multiCBM[i].Quantity,
    //       Lenght:
    //         this.state.isCopy == true
    //           ? multiCBM[i].Length || multiCBM[i].Lengths
    //           : multiCBM[i].Length,
    //       Width: multiCBM[i].Width,
    //       Height:
    //         this.state.isCopy == true ? multiCBM[i].height : multiCBM[i].height,
    //       Weight:
    //         this.state.isCopy == true
    //           ? multiCBM[i].GrossWeight
    //           : multiCBM[i].GrossWeight,
    //       CBM:
    //         this.state.containerLoadType == "LCL"
    //           ? multiCBM[i].Volume
    //           : multiCBM[i].VolumeWeight,
    //       Editable: true
    //     });
    //   }

    //   this.setState({
    //     multiCBM: multiCBM
    //   });
    // } else {
    //   let flattack_openTop = [...this.state.flattack_openTop];
    //   for (var i = 0; i < flattack_openTop.length; i++) {
    //     if (
    //       flattack_openTop[i].SpecialContainerCode ==
    //       e.target.getAttribute("data-valuespecialsontainersode")
    //     ) {
    //       flattack_openTop[i].PackageType = this.state.currentPackageType;
    //     }

    //     PackageDetailsArr.push({
    //       PackageType: flattack_openTop[i].PackageType,
    //       SpecialContainerCode: flattack_openTop[i].SpecialContainerCode,
    //       ContainerType:
    //         flattack_openTop[i].PackageType +
    //         " (" +
    //         flattack_openTop[i].SpecialContainerCode +
    //         ")",
    //       Quantity: flattack_openTop[i].Quantity,
    //       Lenght: flattack_openTop[i].length,
    //       Width: flattack_openTop[i].width,
    //       Height: flattack_openTop[i].height,
    //       Weight: flattack_openTop[i].Gross_Weight,
    //       CBM: flattack_openTop[i].total,
    //       Editable: true
    //     });
    //   }

    //   this.setState({
    //     flattack_openTop: flattack_openTop
    //   });
    // }

    // let CargoDetailsArr = [...this.state.CargoDetailsArr];

    // for (var i = 0; i < CargoDetailsArr.length; i++) {
    //   if (
    //     CargoDetailsArr[i].SpecialContainerCode ==
    //     e.target.getAttribute("data-valuespecialsontainersode")
    //   ) {
    //     CargoDetailsArr[i].PackageType = this.state.currentPackageType;
    //     if (
    //       this.state.ContainerLoad == "AIR" ||
    //       this.state.ContainerLoad == "LCL"
    //     ) {
    //       CargoDetailsArr[i].ContainerType = this.state.currentPackageType;
    //     } else {
    //       CargoDetailsArr[i].ContainerType =
    //         this.state.currentPackageType +
    //         " (" +
    //         CargoDetailsArr[i].SpecialContainerCode +
    //         ")";
    //     }
    //   }
    // }

    // this.setState({
    //   PackageDetailsArr: PackageDetailsArr,
    //   CargoDetailsArr: CargoDetailsArr
    // });

    // this.props.location.state.flattack_openTop = flattack_openTop;

    this.forceUpdate();
    this.setState({ modalEdit: !this.state.modalEdit });
  }

  HandleRadioBtn(type, e) {
    debugger;
    var selectedType = e.target.checked;

    if (type === "Conshinee") {
      this.setState({ isConshinee: !this.state.isConshinee });
    } else {
      this.setState({ isShipper: !this.state.isShipper });
    }
    // this.setState({
    //   // fields:selectedType==="Consignee"?{ Shipper: "" }:{ Consignee: "" },
    //   fields: {},
    //   Consignee: [],
    //   Shipper: [],
    //   shipperData: {},
    //   consineeData: {}
    // });
    // setTimeout(() => {
    //   if (selectedType === "Consignee") {
    //     this.setState({
    //       selectedType,
    //       fields: { Consignee: this.state.company_name }
    //     });
    //     this.HandleChangeCon(selectedType, this.state.company_name);
    //   } else {
    //     this.setState({
    //       selectedType,
    //       fields: { Shipper: this.state.company_name }
    //     });
    //     this.HandleChangeCon(selectedType, this.state.company_name);
    //   }
    // }, 100);
  }

  ////this method for party change value

  HandleConsineeAddressChange(e) {
    debugger;
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

  render() {
    let i = 0;
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Booking Insert</h2>
            </div>
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

                                  var mode = "";
                                  if (this.state.ModeofTransport) {
                                    mode = this.state.ModeofTransport;
                                  }
                                  if (mode == "Ocean" && lname !== "") {
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
                                width: 200
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POL</p>
                                      {this.state.ContainerLoad === "INLAND" ? (
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
                                      {this.state.ContainerLoad === "INLAND" ? (
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
                                accessor: "ContainerType",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Container</p>
                                      <p className="details-para">
                                        {row.original.ContainerType}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
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
                                accessor: "Total",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Price</p>
                                      <p className="details-para">
                                        {row.original.Total}
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
                        className="-striped -highlight"
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                data={this.state.QuotationSubData}
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
                                defaultPageSize={3}
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
                                <p className="details-title">Equipment Types</p>
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
                            <p className="details-para">{this.state.HAZMAT}</p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Unstackable</p>
                          <p className="details-para">{this.state.NonStackable}</p>
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
                          {/* <div className="col-md-4">
                            <p className="details-title">PU Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Delivery Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div> */}
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
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Account/Customer</p>

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
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Notification Person</p>
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
                      <div className="title-border-t py-3 remember-forgot rate-checkbox">
                        <h3 style={{ display: "inline" }}>Consignee Details</h3>
                        <input
                          type="checkbox"
                          onChange={this.HandleRadioBtn.bind(this, "Conshinee")}
                          name="cust-select"
                          id="exist-cust"
                          checked={this.state.isConshinee}
                          value="Consignee"
                        />
                        <label className="d-flex" htmlFor="exist-cust">
                          Consignee
                        </label>
                      </div>
                      <div>
                        {this.state.isConshinee === false ? (
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
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
                                onChange={this.HandleChangeCon.bind(
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
                              >
                                <option>Select</option>

                                {this.state.conshineeAddData.length > 0
                                  ? this.state.conshineeAddData.map(
                                      (item, i) => (
                                        <option key={i} value={item.AddressID}>
                                          {item.Cust_Address}
                                        </option>
                                      )
                                    )
                                  : ""}
                                <option>Other</option>
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
                                <p className="details-title">Consignee Name</p>

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
                              {/* <div className="col-12 col-sm-6 col-md-4">
                                <p className="details-title">
                                  Notification Person
                                </p>
                                <p className="details-para">
                                  {this.state.contact_name}
                                </p>
                              </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="title-border-t py-3 remember-forgot rate-checkbox">
                        <h3 style={{ display: "inline" }}>Shipper Details</h3>
                        <div style={{ display: "inline", float: "left" }}>
                          <input
                            type="checkbox"
                            onChange={this.HandleRadioBtn.bind(this, "Shipper")}
                            name="cust-select"
                            id="new-cust"
                            checked={this.state.isShipper}
                            value="Shipper"
                          />
                          <label
                            className="d-flex flex-column align-items-center"
                            htmlFor="new-cust"
                          >
                            Shipper
                          </label>
                        </div>
                      </div>
                      <div>
                        {this.state.isShipper === false ? (
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
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
                                onChange={this.HandleChangeCon.bind(
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
                              >
                                <option>Select</option>

                                {this.state.shipperAddData.length > 0
                                  ? this.state.shipperAddData.map((item, i) => (
                                      <option key={i} value={item.AddressID}>
                                        {item.Cust_Address}
                                      </option>
                                    ))
                                  : ""}
                                <option>Other</option>
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
                              {/* <div className="col-12 col-sm-6 col-md-4">
                                <p className="details-title">
                                  Notification Person
                                </p>
                                <p className="details-para">
                                  {this.state.contact_name}
                                </p>
                              </div> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="title-border-t py-3">
                        <h3>Buyer Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
                            <p className="details-title">Buyer Name</p>
                            <p className="details-para">
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
                                onChange={this.HandleChangeCon.bind(
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
                              onChange={this.AddressChange.bind(this, "Buyer")}
                            >
                              <option>Select</option>

                              {this.state.buyerAddData.length > 0
                                ? this.state.buyerAddData.map((item, i) => (
                                    <option key={i} value={item.AddressID}>
                                      {item.Cust_Address}
                                    </option>
                                  ))
                                : ""
                              //<option>Other</option>
                              }
                              <option>Other</option>
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
                      </div>
                    </div>
                    <div>
                      <div className="title-border-t py-3">
                        <h3>Notify Party Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
                            <p className="details-title">Notify Party Name</p>
                            <p className="details-para">
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
                                onChange={this.HandleChangeCon.bind(
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
                              onChange={this.AddressChange.bind(this, "Notify")}
                            >
                              <option>Select</option>

                              {this.state.notifyAddData.length > 0
                                ? this.state.notifyAddData.map((item, i) => (
                                    <option key={i} value={item.AddressID}>
                                      {item.Cust_Address}
                                    </option>
                                  ))
                                : ""
                              //<option>Other</option>
                              }
                              <option>Other</option>
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
                        <h3>Cargo Details</h3>
                      </div>
                    </div>
                    <div className="align-center">
                      <button
                        onClick={this.toggleEdit}
                        style={{ margin: "0 0 15px 0" }}
                        className="butn more-padd"
                      >
                        Cargo Details
                      </button>
                    </div>
                    <div className="row ratefinalpgn">
                      {this.state.eqmtType.length > 0 ? (
                        <ReactTable
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "Container Name",
                                  accessor: "ContainerName"
                                },
                                {
                                  Header: "ContainerCode",
                                  accessor: "ContainerCode"
                                },

                                {
                                  Header: "Container Count",
                                  accessor: "ContainerCount"
                                }
                              ]
                            }
                          ]}
                          data={this.state.eqmtType}
                          minRows={0}
                          showPagination={false}
                        />
                      ) : null}

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
                                accessor: "Length"
                              },
                              {
                                Header: "Width",
                                accessor: "Width"
                              },
                              {
                                Header: "Height",
                                accessor: "height"
                              },
                              {
                                Header: "Gross Weight",
                                accessor: "GrossWeight"
                              },
                              {
                                Header: "Volume Weight",
                                accessor: "VolumeWeight"
                              }
                            ]
                          }
                        ]}
                        data={this.state.multiCBM}
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

                      {this.CreateFileElement()}
                    </div>
                  </div>
                </div>
                <center>
                  <button
                    onClick={this.HandleBookigInsert.bind(this)}
                    className="butn more-padd mt-4"
                  >
                    Send Booking
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />

        {/* -------------------------------------Edit Modal----------------------------- */}
        <Modal
          className="delete-popup pol-pod-popup large-popup"
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
                {this.state.ModeofTransport === "FCL" ? (
                  // this.state.specialEquipment === true ? (
                  this.state.flattack_openTop.length > 0 ? (
                    <div className="">
                      <div id="cbmInner"></div>
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
                ) : (
                  this.CreateMultiCBM()
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
      </React.Fragment>
    );
  }
}

export default BookingInsert;

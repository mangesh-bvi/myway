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
import { encryption, convertToPlain } from "../helpers/encryption";
import maersk from "./../assets/img/maersk.png";

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
      HAZMAT: "",
      conshineeAddData: [],
      shipperAddData: [],
      buyerAddData: [],
      notifyAddData: [],
      Consinee_Displayas: ""
    };
    // this.HandleFileOpen = this.HandleFileOpen.bind(this);
  }
  componentDidMount() {
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
      if (rData.ContainerLoad === "LCL") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionLCL();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      }
      if (rData.ContainerLoad === "FCL") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionFCL();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      }
      if (rData.ContainerLoad === "AIR") {
        setTimeout(() => {
          this.HandleGetSalesQuotaionAIR();
          this.NonCustomerList();
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
        }, 100);
      }
    }
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
    var ShipperID = Number(this.state.shipperData.Company_ID || 0);

    var DefaultEntityTypeID = this.state.companyID; ////ask to way it give parameter

    var Shipper_Displayas = this.state.Shipper_Displayas || "";
    var Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
    var ShipperName = this.state.shipperData.Company_Name || "";

    var ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
    var ConsigneeName = this.state.consineeData.Company_Name || "";
    var Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
    var Consignee_Displayas = this.state.Consinee_Displayas;

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

    var NotifyID = Number(this.state.buyerData.Company_ID || 0);
    var Notify_AddressID = Number(this.state.Notify_AddressID || 0);
    var Notify_Displayas = this.state.Notify_Displayas || "";
    var NotifyName = this.state.buyerData.Company_Name || "";

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
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookigFileUpload`,
      data: {
        BookingID: BookingID,
        DocumentID: DocumentID,
        BookingDoc: DocumnetFile,
        MyWayUserID: userId
      },

      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data.Table[0].Message);
    });
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
            self.setState({
              fields
            });
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
      var Shipper_Displayas = id.Company_Address;
      this.setState({ buyerData: id, Shipper_Displayas });
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

  HandleChangeConsinee(e) {
    debugger;
    var ConsineeName = e.target.selectedOptions[0].innerText;
    if (ConsineeName !== "select") {
      var ConsineeID = Number(e.target.selectedOptions[0].value);

      var cutomerdata = this.state.NonCustomerData.filter(
        x => x.Company_ID === ConsineeID
      );
      var Consinee_AddressID = cutomerdata[0].Consinee_AddressID;
      var Consinee_Displayas = cutomerdata[0].Consinee_Address;

      this.setState({
        ConsineeID,
        ConsineeName,
        Consinee_AddressID,
        Consinee_Displayas
      });
    }
  }

  HandleChangeShipper(e) {
    debugger;
    var ShipperName = e.target.selectedOptions[0].innerText;
    if (ShipperName !== "select") {
      var ShipperID = Number(e.target.selectedOptions[0].value);

      var cutomerdata = this.state.NonCustomerData.filter(
        x => x.Company_ID === ShipperID
      );
      var Shipper_AddressID = cutomerdata[0].Shipper_AddressID;
      var Shipper_Displayas = cutomerdata[0].Shipper_Address;

      this.setState({
        ShipperID,
        ShipperName,
        Shipper_AddressID,
        Shipper_Displayas
      });
    }
  }

  HandleChangeBuyer(e) {
    debugger;
    var BuyerName = e.target.selectedOptions[0].innerText;
    if (BuyerName !== "select") {
      var BuyerID = Number(e.target.selectedOptions[0].value);

      var cutomerdata = this.state.NonCustomerData.filter(
        x => x.Company_ID === BuyerID
      );
      var Buyer_AddressID = cutomerdata[0].Company_AddressID;
      var Buyer_Displayas = cutomerdata[0].Company_Address;

      this.setState({
        BuyerID,
        BuyerName,
        Buyer_AddressID,
        Buyer_Displayas
      });
    }
  }

  HandleRadioBtn = e => {
    debugger;
    var selectedType = e.target.value;
    this.setState({
      // fields:selectedType==="Consignee"?{ Shipper: "" }:{ Consignee: "" },
      fields: {},
      Consignee: [],
      Shipper: [],
      shipperData: {},
      consineeData: {}
    });
    setTimeout(() => {
      if (selectedType === "Consignee") {
        this.setState({
          selectedType,
          fields: { Consignee: this.state.company_name }
        });
        this.HandleChangeCon(selectedType, this.state.company_name);
      } else {
        this.setState({
          selectedType,
          fields: { Shipper: this.state.company_name }
        });
        this.HandleChangeCon(selectedType, this.state.company_name);
      }
    }, 100);
  };

  ////this method for party change value

  HandleChangeParty(e) {
    debugger;
    var NotifyName = e.target.selectedOptions[0].innerText;
    if (NotifyName !== "select") {
      var NotifyID = Number(e.target.selectedOptions[0].value);

      var cutomerdata = this.state.NonCustomerData.filter(
        x => x.Company_ID === NotifyID
      );
      var Notify_AddressID = cutomerdata[0].Company_AddressID;
      var Notify_Displayas = cutomerdata[0].Company_Address;

      this.setState({
        NotifyID,
        NotifyName,
        Notify_AddressID,
        Notify_Displayas
      });
    }
  }
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
                                accessor: "POL",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">POL</p>
                                      <p className="details-para">
                                        {row.original.POL}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "POD",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">POD</p>
                                      <p className="details-para">
                                        {row.original.POD}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
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
                        <div className="title-border py-3">
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
                            <p className="details-para"></p>
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
                    <div className="text-right">
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
                    <div>
                      <div className="rate-radio-cntr">
                        <div>
                          <input
                            type="radio"
                            onChange={this.HandleRadioBtn}
                            name="cust-select"
                            id="exist-cust"
                            checked={
                              this.state.selectedType === "Consignee"
                                ? true
                                : false
                            }
                            value="Consignee"
                          />
                          <label
                            className="d-flex flex-column align-items-center"
                            htmlFor="exist-cust"
                          >
                            Consignee
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            onChange={this.HandleRadioBtn}
                            name="cust-select"
                            id="new-cust"
                            checked={
                              this.state.selectedType === "Shipper"
                                ? true
                                : false
                            }
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
                    </div>
                    <div>
                      <div className="title-border-t py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields">
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
                                ? this.state.conshineeAddData.map((item, i) => (
                                    <option key={i} value={item.AddressID}>
                                      {item.Cust_Address}
                                    </option>
                                  ))
                                : ""}
                              <option>Other</option>
                            </select>
                            <br />
                            {this.state.conshineeother === true ? (
                              <textarea
                                value={this.state.Consinee_Displayas}
                                onChange={this.HandleConsineeAddressChange.bind(
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
                        <h3>Shipper Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields">
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
                            <br />
                            {this.state.shipperother === true ? (
                              <textarea
                                value={this.state.Shipper_Displayas}
                                onChange={this.HandleConsineeAddressChange.bind(
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
                        <h3>Buyer Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields">
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
                            <br />
                            {this.state.buyerother === true ? (
                              <textarea
                                value={this.state.Buyer_Displayas}
                                onChange={this.HandleConsineeAddressChange.bind(
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
                          <div className="col-12 col-sm-6 col-md-4 login-fields">
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
                            <br />
                            {this.state.notiother === true ? (
                              <textarea
                                value={this.state.Notify_Displayas}
                                onChange={this.HandleConsineeAddressChange.bind(
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
                    Booking Create
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </React.Fragment>
    );
  }
}

export default BookingInsert;

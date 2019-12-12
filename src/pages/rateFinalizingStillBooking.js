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
import Autocomplete from "react-autocomplete";
import { encryption, convertToPlain } from "../helpers/encryption";
import maersk from "./../assets/img/maersk.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
import Edit from "./../assets/img/pencil.png";

class RateFinalizingStillBooking extends Component {
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
      Booking: [],
      Booking1: [],
      Booking2: [],
      Booking3: [],
      Booking4: [],
      Booking5: [],
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
      FileData: [],
      packageTypeData: [],
      userType: "",
      NonCustomerData: [],
      QuotationData: [],
      QuotationSubData: [],
      typeofMove: "",
      cargoType: "",
      ModeofTransport: "",

      //dynamic element
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ],
      spacEqmtType: [],
      multiCBM: [],
      referType: [],
      flattack_openTop: [],
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

      consineeData: {},
      shipperData: {},
      buyerId: 0,

      //---------------sales quotation details
      ContainerLoad: "",
      salesQuotaNo: "",
      isInsert: false,
      nPartyID: 0,
      isView: false,
      EquipmentTypes: "",
      HazMat: "",
      Unstackable: "",
      conshineeAddData: [],
      shipperAddData: [],
      buyerAddData: [],
      notifyAddData: []
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);

    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.BookigGridDetailsList = this.BookigGridDetailsList.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);

    this.NonCustomerList = this.NonCustomerList.bind(this);
    this.HandleGetSalesQuotaion = this.HandleGetSalesQuotaion.bind(this);
  }
  componentDidMount() {
    var rData = this.props.location.state;
    debugger;
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
        isInsert: true,
        userType
      });
      setTimeout(() => {
        this.HandleGetSalesQuotaion();
        this.NonCustomerList();
        this.HandleCommodityDropdown();
        this.HandlePackgeTypeData();
      }, 100);
    }

    if (rData.Copy === true) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      var BookingNo = this.props.location.state.BookingNo;
      this.setState({ BookingNo, userType, copy: true });
      setTimeout(() => {
        this.HandleCommodityDropdown();
        this.HandlePackgeTypeData();
        this.BookigGridDetailsList();
        this.NonCustomerList();
      }, 300);
    }

    if (
      this.props.location.state.BookingNo != "" &&
      this.props.location.state.BookingNo != undefined
    ) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      var BookingNo = this.props.location.state.BookingNo;
      var isView = this.props.location.state.isView;
      if (isView) {
        this.setState({ BookingNo, userType, isView: true });
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
      } else {
        this.setState({ BookingNo, userType });
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
      }
    }
  }

  HandleDocumentView(evt, row) {
    debugger;
  }
  ////get sales quotation detsils

  HandleGetSalesQuotaion() {
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
      var typeofMove = "";
      if (Booking[0].TypeOfMove === "Port To Port") {
        typeofMove = "Port To Port";
      }
      if (Booking[0].TypeOfMove === "Door To Port") {
        typeofMove = "Door To Port";
      }
      if (Booking[0].TypeOfMove === "Port To Door") {
        typeofMove = "Port To Door";
      }
      if (Booking[0].TypeOfMove === "Door To Door") {
        typeofMove = "Door To Door";
      }
      var EquipmentTypes = QuotationData[0].ContainerCode || "";
      var selectedCommodity = QuotationData[0].Commodity;
      self.setState({
        QuotationData,
        QuotationSubData,
        Booking,
        typeofMove,
        selectedCommodity,
        EquipmentTypes
      });
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
  ////this method for NonCustomerList bind
  NonCustomerList() {
    debugger;
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/NonCustomerList`,
      data: {
        MyWayUserID: 2679
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
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
      data: {},
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }
  ////Handel Update Booking Details
  HandleBookingUpdate() {
    debugger;
    //const formData = new FormData();
    var fData = [];
    var cData = [];

    for (let j = 0; j < this.state.FileData.length; j++) {
      var fileObj = new Object();

      fileObj.BookingID = this.state.FileData[j].BookingID;
      fileObj.FTPFilePath = this.state.FileData[j].FilePath;
      fileObj.DocumentID = this.state.FileData[j].DocumentID;

      fData.push(fileObj);
    }
    for (let j = 0; j < this.state.multiCBM.length; j++) {
      var cargoObj = new Object();

      cargoObj.BookingPackID = this.state.multiCBM[j].BookingPackID;
      cargoObj.PackageType = this.state.multiCBM[j].PackageType;
      cargoObj.Quantity = this.state.multiCBM[j].QTY;
      cargoObj.Lengths = this.state.multiCBM[j].Lengths;
      cargoObj.Width = this.state.multiCBM[j].Width;
      cargoObj.Height = this.state.multiCBM[j].Height;
      cargoObj.GrossWt = this.state.multiCBM[j].GrossWeight;
      cargoObj.VolumeWeight = this.state.multiCBM[j].VolumeWeight;
      cargoObj.Volume = this.state.multiCBM[j].Volume;

      cData.push(cargoObj);
    }

    if (this.state.FileData.length > 0) {
      var BookingID = this.state.FileData[0].BookingID;
      var DocumentID = this.state.FileData[0].DocumentID;
      var BookingDoc = this.state.selectedFile;
      var userId = encryption(window.localStorage.getItem("userid"), "desc");
    } else {
      var BookingID = 0;
      var DocumentID = 0;
      var BookingDoc = null;
      var userId = encryption(window.localStorage.getItem("userid"), "desc");
    }
    var paramData = {
      BookingNo: this.state.Booking[0].strBooking_No,
      MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),

      ShipperID: parseInt(this.state.shipperData.Company_ID),
      Shipper_Displayas: this.state.shipperData.CompanyAddress,
      Shipper_AddressID: parseInt(this.state.shipperData.AddressID),
      ShipperName: this.state.shipperData.Company_Name,

      ConsigneeID: parseInt(this.state.consineeData.Company_ID),
      ConsigneeName: this.state.consineeData.Company_Name,
      Consignee_AddressID: parseInt(this.state.consineeData.AddressID),
      Consignee_Displayas: this.state.consineeData.Company_Name,

      BuyerID: parseInt(this.state.Booking[0].BuyerID),
      Buyer_AddressID: parseInt(this.state.Booking[0].Buyer_AddressID),
      Buyer_Displayas: this.state.Booking[0].Buyer_Displayas,
      BuyerName: this.state.Booking[0].BuyerName,

      Mode: this.state.Booking[0].CargoType,
      Commodity: parseInt(this.state.Booking[0].Commodity),

      saleQuoteID: parseInt(this.state.Booking[0].saleQuoteID),
      saleQuoteNo: this.state.Booking[0].saleQuoteNo,
      saleQuoteLineID: parseInt(this.state.Booking[0].saleQuoteLineID),

      NotifyID: parseInt(this.state.NotifyID),
      Notify_AddressID: this.state.Notify_AddressID,
      Notify_Displayas: this.state.Notify_Displayas,
      NotifyName: this.state.NotifyName,

      BookingDocs: fData,
      BookingDim: cData
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingUpdation`,

      headers: authHeader(),
      data: paramData
    }).then(function(response) {
      debugger;
    });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookigFileUpload`,
      data: {
        BookingID: BookingID,
        DocumentID: DocumentID,
        BookingDoc: BookingDoc,
        MyWayUserID: userId
      },

      headers: authHeader()
    }).then(function(response) {
      debugger;
    });
  }

  toggleProfit() {
    this.setState(prevState => ({
      modalProfit: !prevState.modalProfit
    }));
  }

  toggleRequest() {
    this.setState(prevState => ({
      modalRequest: !prevState.modalRequest
    }));
  }

  onDocumentChangeHandler = event => {
    debugger;
    var FileData = event.target.files;
    var filesArr = this.state.selectedFile;
    for (let i = 0; i < FileData.length; i++) {
      var selectedFile = event.target.files[i];
      filesArr.push(selectedFile);
      var fileName = event.target.files[i].name;
      this.setState({ selectedFile: filesArr });
      this.addClickTruckType(fileName);
    }
  };

  ////change value of SelectType methiod
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
          fields: { Consignee: this.state.Booking[0].company_name }
        });
        this.HandleChangeCon(selectedType, this.state.Booking[0].company_name);
      } else {
        this.setState({
          selectedType,
          fields: { Shipper: this.state.Booking[0].company_name }
        });
        this.HandleChangeCon(selectedType, this.state.Booking[0].company_name);
      }
    }, 100);
  };

  ////booking insert

  HandleBookigInsert() {
    //let self = this;
    debugger;
    var bookingDetails = this.state.Booking;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");

    var MyWayUserID = userId;
    var ShipperID = Number(this.state.shipperData.Company_ID || 0);

    var DefaultEntityTypeID = bookingDetails[0].companyID; ////ask to way it give parameter

    var Shipper_Displayas = this.state.shipperData.CompanyAddress || "";
    var Shipper_AddressID = Number(this.state.shipperData.AddressID || 0);
    var ShipperName = this.state.shipperData.Company_Name || "";

    var ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
    var ConsigneeName = this.state.consineeData.Company_Name || "";
    var Consignee_AddressID = Number(this.state.consineeData.AddressID || 0);
    var Consignee_Displayas = this.state.consineeData.CompanyAddress;

    var BuyerID = this.state.BuyerID;
    var Buyer_AddressID = this.state.Buyer_AddressID;
    var Buyer_Displayas = this.state.Buyer_Displayas;
    var BuyerName = this.state.BuyerName;

    var Mode = this.state.ContainerLoad;

    var Commodity = Number(
      this.state.commodityData.filter(
        x => x.Commodity === this.state.selectedCommodity
      )[0].id || 0
    );

    var saleQuoteID = Number(this.state.QuotationData[0].SaleQuoteID || 0);
    var saleQuoteNo = this.state.salesQuotaNo || "";
    var saleQuoteLineID = Number(
      this.state.QuotationData[0].saleQuoteLineID || 0
    );

    var NotifyID = Number(this.state.NotifyID || 0);
    var Notify_AddressID = Number(this.state.Notify_AddressID || 0);
    var Notify_Displayas = this.state.Notify_Displayas || "";
    var NotifyName = this.state.NotifyName || "";

    var BookingDim = [];

    if (this.state.multiCBM.length > 0) {
      for (let i = 0; i < this.state.multiCBM.length; i++) {
        var cargoData = new Object();

        cargoData.BookingPackID = this.state.multiCBM[i].BookingPackID || 0;
        cargoData.PackageType = this.state.multiCBM[i].PackageType || "";
        cargoData.Quantity = this.state.multiCBM[i].QTY || 0;
        cargoData.Lengths = this.state.multiCBM[i].Lengths || 0;
        cargoData.Width = this.state.multiCBM[i].Width || 0;
        cargoData.Height = this.state.multiCBM[i].Height || 0;
        cargoData.GrossWt = this.state.multiCBM[i].GrossWeight || 0;
        cargoData.VolumeWeight = this.state.multiCBM[i].VolumeWeight || 0;
        cargoData.Volume = this.state.multiCBM[i].Volume || 0;

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
    var BookingDocs = [];
    // if (this.state.FileData.length > 0) {
    //   for (let i = 0; i < this.state.FileData.length; i++) {
    //     var fileObj = new Object();
    //     fileObj.BookingID = bookingId;
    //     fileObj.DocumentID = this.state.FileData[i].DocumentID;
    //     fileObj.FTPFilePath = this.state.FileData[i].FilePath;
    //     BookingDocs.push(fileObj);
    //   }
    // }

    var BookingID = this.state.FileData.BookingID || 0;
    var DocumentID = this.state.FileData.DocumentID || 0;
    var BookingDoc = this.state.selectedFile;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");

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
      BookingDocs: BookingDocs,
      BookingDim: BookingDim
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingInsertion`,
      data: paramData,

      headers: authHeader()
    }).then(function(response) {
      debugger;
    });

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookigFileUpload`,
      data: {
        BookingID: BookingID,
        DocumentID: DocumentID,
        BookingDoc: BookingDoc,
        MyWayUserID: userId
      },

      headers: authHeader()
    }).then(function(response) {
      debugger;
    });
  }

  ////this methos for bookig details HandleBookigClone
  HandleBookigClone() {
    //let self = this;
    debugger;
    var bookingId = this.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var bookingDetails = this.state.Booking;

    var DefaultEntityTypeID = 1; ////ask to way it give parameter
    var MyWayUserID = userId;
    var ShipperID = Number(bookingDetails[0].ShipperID || 0);
    var Shipper_Displayas = bookingDetails[0].Shipper_Displayas || "";
    var Shipper_AddressID = Number(bookingDetails[0].Shipper_AddressID || 0);
    var ShipperName = bookingDetails[0].Shipper_Name || "";
    var ConsigneeID = Number(bookingDetails[0].Consignee || 0);
    var ConsigneeName = bookingDetails[0].Consignee_Name || "";
    var Consignee_AddressID = Number(
      bookingDetails[0].Consignee_AddressID || 0
    );
    var Consignee_Displayas = bookingDetails[0].Consignee_Displayas || "";
    var BuyerID = Number(bookingDetails[0].BuyerID || 0);
    var Buyer_AddressID = Number(bookingDetails[0].Buyer_AddressID || 0);
    var Buyer_Displayas = bookingDetails[0].Buyer_Displayas || "";
    var BuyerName = bookingDetails[0].Buyer_Name || "";
    var Mode = bookingDetails[0].CargoType;
    var Commodity = Number(bookingDetails[0].Commodity || 0);
    var saleQuoteID = Number(bookingDetails[0].saleQuoteID || 0);
    var saleQuoteNo = bookingDetails[0].saleQuoteNo || "";
    var saleQuoteLineID = Number(bookingDetails[0].saleQuoteLineID || 0);
    var NotifyID = Number(bookingDetails[0].NotifyID || 0);
    var Notify_AddressID = Number(bookingDetails[0].Notify_AddressID || 0);
    var Notify_Displayas = bookingDetails[0].Notify_Displayas || "";
    var NotifyName = bookingDetails[0].NotifyName || "";
    var BookingDocs = [];
    var BookingDim = [];
    if (this.state.FileData.length > 0) {
      for (let i = 0; i < this.state.FileData.length; i++) {
        var fileObj = new Object();
        fileObj.BookingID = bookingId;
        fileObj.DocumentID = this.state.FileData[i].DocumentID;
        fileObj.FTPFilePath = this.state.FileData[i].FilePath;
        BookingDocs.push(fileObj);
      }
    }
    if (this.state.multiCBM.length > 0) {
      for (let i = 0; i < this.state.multiCBM.length; i++) {
        var cargoData = new Object();

        cargoData.BookingPackID = this.state.multiCBM[i].BookingPackID || 0;
        cargoData.PackageType = this.state.multiCBM[i].PackageType || "";
        cargoData.Quantity = this.state.multiCBM[i].QTY || 0;
        cargoData.Lengths = this.state.multiCBM[i].Lengths || 0;
        cargoData.Width = this.state.multiCBM[i].Width || 0;
        cargoData.Height = this.state.multiCBM[i].Height || 0;
        cargoData.GrossWt = this.state.multiCBM[i].GrossWeight || 0;
        cargoData.VolumeWeight = this.state.multiCBM[i].VolumeWeight || 0;
        cargoData.Volume = this.state.multiCBM[i].Volume || 0;

        BookingDim.push(cargoData);
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
      BookingDocs: BookingDocs,
      BookingDim: BookingDim
    };

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingInsertion`,
      data: paramData,

      headers: authHeader()
    }).then(function(response) {
      debugger;
    });
  }

  ////this methos for bookig details BookigGridDetailsList
  BookigGridDetailsList() {
    let self = this;
    debugger;
    var bookingId = self.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    if (bookingId !== "" && bookingId !== null) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/BookigGridDetailsList`,
        data: {
          UserID: userId, //874654, //userId, //874654, ,
          BookingID: bookingId //830651 //bookingNo//830651 // 830651 // bookingNo
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        var QuotationData = response.data.Table4;
        var QuotationSubData = response.data.Table5;
        var Booking = response.data.Table;
        var CargoDetails = response.data.Table2;
        var FileData = response.data.Table3;
        var eqmtType = response.data.Table1;
        var ModeofTransport = response.data.Table[0].ModeofTransport;
        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            var nPartyID = QuotationData[0].NotifyID;

            self.setState({
              QuotationData,
              QuotationSubData,
              Booking,
              nPartyID,
              ModeofTransport
            });
          }
        }
        if (typeof eqmtType !== "undefined") {
          if (eqmtType.length > 0) {
            self.setState({ eqmtType });
          }
        }
        if (typeof Booking !== "undefined") {
          var typeofMove = "";
          if (Booking.length > 0) {
            if (Booking[0].typeofMove === 1) {
              typeofMove = "Port To Port";
            }
            if (Booking[0].typeofMove === 2) {
              typeofMove = "Door To Port";
            }
            if (Booking[0].typeofMove === 3) {
              typeofMove = "Port To Door";
            }
            if (Booking[0].typeofMove === 4) {
              typeofMove = "Door To Door";
            }

            var NotifyID = Booking[0].NotifyID;
            var Notify_AddressID = Booking[0].Notify_AddressID;
            var Notify_Displayas = Booking[0].Notify_Displayas;
            var NotifyName = Booking[0].NotifyName;
            self.setState({
              multiCBM: CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,
              NotifyID,
              Notify_AddressID,
              Notify_Displayas,
              NotifyName,
              fields: {
                Consignee: Booking[0].Consignee_Name,
                Shipper: Booking[0].Shipper_Name
              }
            });
          }

          if ((typeof FileData !== "undefined") | (FileData.length > 0)) {
            self.setState({ FileData });
          }
        }
      });
    }
  }
  //// this method for Handle Change values of Consignee and shipper

  HandleChangeCon_Ship = e => {
    var type = e.target.name;
    var value = e.target.name;
    if (type === "Consignee") {
      this.setState({ consigneeVal: value });
    } else {
      this.setState({ shiperVal: value });
    }
  };
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

  // file download
  HandleFileOpen(filePath) {
    var FileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    debugger;

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
      debugger;
      if (response.data) {
        console.log(response.data);

        var blob = new Blob([response.data], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = FileName;
        link.click();
      }
      //   window.open(
      //     "data:application/octet-stream;charset=utf-16le;base64," + response.data
      //   );
      //   window.open(response.data);
    });
  }

  ////this method for multiple file element create
  CreateFileElement() {
    debugger;
    return this.state.FileData.map((el, i) => (
      <div key={i}>
        {/* <a href={el.FilePath || ""}>
          <p className="file-name w-100 text-center mt-1">{el.FileName}</p>


        </a> */}
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
  ////end methos for multiple file element

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

  notifyPartyAddressList() {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = this.state.NotifyID;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerAddressList`,
      data: {
        UserID: userId,
        CustomerID: cusID
      },

      headers: authHeader()
    }).then(function(response) {
      var notifyAddData = response.data.Table;
      if (notifyAddData) {
        self.setState({ notifyAddData });
      }
    });
  }
  
  buyerAddressList() {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = this.state.BuyerID;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerAddressList`,
      data: {
        UserID: userId,
        CustomerID: cusID
      },

      headers: authHeader()
    }).then(function(response) {
      var buyerAddData = response.data.Table;
      if (buyerAddData) {
        self.setState({ buyerAddData });
      }
    });
  }

  conshineeAddressList() {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = this.state.BuyerID;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerAddressList`,
      data: {
        UserID: userId,
        CustomerID: cusID
      },

      headers: authHeader()
    }).then(function(response) {
      var conshineeAddData = response.data.Table;
      if (conshineeAddData) {
        self.setState({ conshineeAddData });
      }
    });
  }

  render() {
    const {
      Booking,

      selectedType
    } = this.state;
    var bNumber = "";
    if (Booking.length > 0) {
      bNumber = Booking[0].strBooking_No;
    }
    var selectedCommodity = "";
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    if (
      this.state.commodityData.length > 0 && this.state.salesQuotaNo === ""
        ? this.state.QuotationData.length > 0
        : this.state.Booking.length > 0
    ) {
      debugger;
      if (this.state.salesQuotaNo === "") {
        selectedCommodity = this.state.commodityData.filter(
          x => x.id === this.state.Booking[0].Commodity
        )[0].Commodity;
      } else {
        selectedCommodity = this.state.QuotationData[0].Commodity;
      }
    }

    let i = 0;

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>
                {this.state.copy === true
                  ? "Clone Booking "
                  : this.state.isInsert === true
                  ? "Create Booking"
                  : this.state.BookingNo !== "" && this.state.isView === false
                  ? "Update Booking"
                  : this.state.BookingNo !== "" && this.state.isView === true
                  ? "Booking Details " + bNumber
                  : ""}
              </h2>
            </div>
            <div className="row">
              {/* <div className="col-md-4">
                <div className="rate-table-left rate-final-left">
                  <div>
                    <h3>Locals</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input id="ugm" type="checkbox" name={"local"} />
                            <label htmlFor="ugm">UGM</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input id="bl" type="checkbox" name={"local"} />
                            <label htmlFor="bl">B/L</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="stuffing"
                              type="checkbox"
                              name={"local"}
                            />
                            <label htmlFor="stuffing">Stuffing</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>Subcharges</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-clean"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="cont-clean">Container Clean</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="fumi"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="fumi">Fumigation</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="tarpau"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="tarpau">Tarpaulin</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
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
                                  if (row._original.Linename) {
                                    olname = row._original.Linename;
                                    lname =
                                      row._original.Linename.replace(
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
                                accessor: "lineName"
                                // minWidth: 200
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
                        className="-striped -highlight no-mid-align"
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
                              {Booking.length > 0
                                ? Booking[0].ShipmentType
                                : null}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].ModeOfTransport
                                : null}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].CargoType : null}
                              {this.state.ContainerLoad !== ""
                                ? this.state.ContainerLoad
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para">
                              {this.state.EquipmentTypes}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                            <p className="details-para">
                              {/* {this.state.EquipmentTypes} */}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].Incoterm : ""}
                              {Booking.length > 0 ? Booking[0].IncoTerm : ""}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].IncoTerm
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {this.state.typeofMove}
                            </p>
                          </div>

                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">POL</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POL : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POL
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">POD</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POD : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POD
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                            <p className="details-title">PU Address</p>
                            {/* <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p> */}
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                            <p className="details-title">Delivery Address</p>
                            {/* <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p> */}
                          </div>
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
                              {/* {selectedType === "Shipper"
                                ? Booking[0].Shipper_Name
                                : selectedType === "Consignee"
                                ? Booking[0].Consignee_Name
                                : null} */}
                              {Booking.length > 0
                                ? Booking[0].company_name
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {this.state.selectedType === "Shipper"
                                ? Booking3.length > 0
                                  ? Booking3[0].ShipperAddress
                                  : null
                                : Booking3.length > 0
                                ? Booking3[0].ConsigneeAddress
                                : null} */}

                              {/* {selectedType === "Shipper"
                                ? Booking[0].Shipper_Displayas
                                : selectedType === "Consignee"
                                ? Booking[0].Consignee_Displayas
                                : null} */}
                              {Booking.length > 0
                                ? Booking[0].Company_Address
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].contact_name
                                : ""}
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
                            {this.state.userType !== "Customer" ? (
                              <input
                                type="text"
                                name="Consignee"
                                value={this.state.consigneeVal}
                              />
                            ) : (
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
                            )}
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
                                : ""
                              //<option>Other</option>
                              }
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
                            {this.state.userType !== "Customer" ? (
                              <input
                                type="text"
                                name="Shipper"
                                onChange={this.HandleChangeCon_Ship}
                                value={this.state.shipperval}
                              />
                            ) : (
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
                            )}
                            {/* <p className="details-para">
                              {Booking3.length > 0 ? Booking3[0].Shipper : null}
                            </p> */}
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
                                : ""}
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
                          value={
                            this.state.copy === false
                              ? selectedCommodity
                              : this.state.selectedCommodity
                          }
                        >
                          <option>Select</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.id}>
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
                                // {
                                //   Header: "Booking Pack",
                                //   accessor: "BookingPackID",
                                //   width:120
                                // },
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
                          // className="-striped -highlight"
                        />
                      ) : null}
                      {this.state.multiCBM.length > 0 ? (
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
                                  accessor: "QTY"
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
                      ) : null}
                    </div>
                    <div className="row cargodetailsB"></div>

                    <div className="rename-cntr login-fields d-block">
                      {/* <input
                        type="file"
                        onChange={this.onDocumentChangeHandler}
                      ></input> */}
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

                      {this.state.FileData.length > 0
                        ? this.CreateFileElement()
                        : null}
                    </div>
                    {this.state.isView === false ? (
                      <center>
                        <button
                          onClick={
                            this.state.copy === true
                              ? this.HandleBookigClone.bind(this)
                              : this.state.isInsert === true
                              ? this.HandleBookigInsert.bind(this)
                              : this.HandleBookingUpdate.bind(this)
                          }
                          className="butn more-padd mt-4"
                        >
                          {this.state.copy === true
                            ? "Booking Clone"
                            : this.state.isInsert === true
                            ? "Create Booking"
                            : this.state.BookingNo !== ""
                            ? "Update Booking"
                            : ""}
                          {/* {this.state.salesQuotaNo !== ""
                          ? "Create Booking"
                          : "Update Booking"} */}
                        </button>
                      </center>
                    ) : (
                      ""
                    )}
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

export default RateFinalizingStillBooking;

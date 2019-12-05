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
      packageTypeData: [],
      userType: "",
      NonCustomerData: [],
      QuotationData: [],
      QuotationSubData: [],
      typeofMove: "",
      cargoType: "",

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
      Unstackable: ""
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);

    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.BookigGridDetailsList = this.BookigGridDetailsList.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.HandleTruckTypeData = this.HandleTruckTypeData.bind(this);
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
          // CustomerName: customerName,
          // CustomerType: "Existing",
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
          } else {
            self.setState({
              Shipper: response.data.Table,
              fields
            });
          }
        } else {
          if (response.data.Table.length === 1) {
            if (field == "Consignee") {
              self.setState({
                Consignee: response.data.Table,
                fields,
                consineeData: response.data.Table[0]
              });
            } else {
              self.setState({
                Shipper: response.data.Table,
                fields,
                shipperData: response.data.Table[0]
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
      this.setState({
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
      this.setState({ consineeData: id });
    } else {
      this.setState({ shipperData: id });
      this.state.ShipperID = id.Company_ID;
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

        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            var nPartyID = QuotationData[0].NotifyID;

            self.setState({
              QuotationData,
              QuotationSubData,
              Booking,
              nPartyID
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
              name="QTY"
              value={"" + el.QTY || ""}
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
              value={"" + el.Lengths || ""}
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
              value={"" + el.Width || ""}
              //onBlur={this.cbmChange}
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
              name="Height"
              value={"" + el.Height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="GrossWeight"
              value={"" + el.GrossWeight || ""}
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
                  ? "" + el.Volume
                  : "" + el.VolumeWeight || ""
              }
              className="w-100 weight-icon"
            />
          </div>
        </div>
        {this.state.copy === false ? (
          i === 0 ? (
            <div className="">
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addMultiCBM.bind(this)}
                ></i>
              </div>
            </div>
          ) : (
            <div className="">
              <div className="spe-equ">
                <i
                  className="fa fa-minus mt-2"
                  aria-hidden="true"
                  onClick={this.removeMultiCBM.bind(this, i)}
                ></i>
              </div>
            </div>
          )
        ) : null}
        {/* {this.state.multiCBM.length > 1 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null} */}
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
        [name]: value !== "" ? Number(value) : ""
      };
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (Number(multiCBM[i].QTY || 0) *
          (Number(multiCBM[i].Lengths || 0) *
            Number(multiCBM[i].Width || 0) *
            Number(multiCBM[i].Height || 0))) /
        6000;
      if (Number(multiCBM[i].GrossWt || 0) > Number(decVolumeWeight)) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: Number(multiCBM[i].GrossWt)
        };
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: Number(decVolumeWeight).toFixed(2)
        };
      }
    } else {
      var decVolume =
        Number(multiCBM[i].QTY || 0) *
        ((Number(multiCBM[i].Lengths || 0) / 100) *
          (Number(multiCBM[i].Width || 0) / 100) *
          (Number(multiCBM[i].Height || 0) / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: Number(decVolume).toFixed(2)
      };
    }

    this.setState({ multiCBM });
  }
  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          BookingPackID: parseInt(this.state.multiCBM[0].BookingPackID),
          PackageType: "",
          QTY: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          Weight: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
  }
  removeMultiCBM(type, i) {
    debugger;
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(type, 1);
    this.setState({ multiCBM });
  }

  ////End dynamic element

  //// start  spacEqmtType dyamanic element

  addSpacEqmtType(optionVal) {
    this.setState(prevState => ({
      spacEqmtType: [
        ...prevState.spacEqmtType,
        {
          TypeName: optionVal[0].SpecialContainerCode,
          Quantity: 0
        }
      ]
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spec-inner-cntr w-auto">
          <label name="TypeName">
            {el.TypeName} <span className="into-quant">X</span>
          </label>
          {/* <div className="spe-equ"> */}
          <input
            type="number"
            name="Quantity"
            min={1}
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.Quantity || ""}
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
    this.setState({ spacEqmtType });
  }

  //// end spacEqmtType dyamanic element

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState(prevState => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          ContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 0,
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
          <div className="col-md">
            <div className="spe-equ">
              <label className="mt-2" name="ContainerCode">
                {el.ContainerCode}
              </label>
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="ContainerQuantity"
                placeholder="Quantity"
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
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md mt-2">
            <div className="rate-radio-cntr">
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="exist-cust"
                  value="C"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="exist-cust"
                >
                  Celcius
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="new-cust"
                  value="F"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="new-cust"
                >
                  Farenheit
                </label>
              </div>
            </div>
          </div>
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
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
    referType[i] = {
      ...referType[i],
      [name]: name === "TemperatureType" ? value : parseFloat(value)
    };
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
    debugger;
    return this.state.flattack_openTop.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <label className="mr-0 mt-2" name="SpecialContainerCode">
              {el.SpecialContainerCode}
            </label>
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
              placeholder="Quantity"
              className="w-100"
              name="Quantity"
              value={el.Quantity}
              //onKeyUp={this.cbmChange}
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
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="Gross_Weight"
              value={el.Gross_Weight}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md">
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
        </div>

        <div className="">
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              aria-hidden="true"
              onClick={this.removeClickMultiCBM.bind(this)}
            ></i>
          </div>
        </div>
      </div>
    ));
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;
    debugger;
    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value)
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
  addClickMultiCBM(optionsVal) {
    debugger;
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: optionsVal[0].SpecialContainerCode,
          PackageType: "",
          length: "",
          width: "",
          height: "",
          Quantity: "",
          Gross_Weight: "",
          total: ""
        }
      ]
    }));
  }
  removeClickMultiCBM(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }

  ////end for flattack and openTop dynamic create elements
  ////this for Equipment Type Dynamice Create Element
  NewcreateUI() {
    return this.state.eqmtType.map((el, i) => (
      <>
        {i === 0 ? (
          <div className="equip-plus-cntr spec-inner-cntr w-auto" key={i}>
            <input type="hidden" name="BookingID" value={el.BookingID} />
            <input
              type="hidden"
              name="ProfileCodeID"
              value={el.ProfileCodeID}
            />
            <label>
              {el.ContainerCode} <span className="into-quant">X</span>
            </label>
            <div className="spe-equ">
              <input
                type="number"
                min={1}
                placeholder="QTY"
                name="ContainerCount"
                value={el.ContainerCount || ""}
                onChange={this.newhandleChange.bind(this, i)}
              />
            </div>
            <span onClick={this.newremoveClick.bind(this, i)}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>
          </div>
        ) : null}
      </>
    ));
  }

  newhandleChange(i, e) {
    const { name, value } = e.target;
    let eqmtType = [...this.state.eqmtType];
    eqmtType[i] = {
      ...eqmtType[i],
      [name]: name === "ContainerCount" ? parseFloat(value) : 0
    };
    this.setState({ eqmtType });
  }

  newremoveClick(i) {
    let eqmtType = [...this.state.eqmtType];
    eqmtType.splice(i, 1);
    this.setState({ eqmtType });
  }
  //// end For Equipment to create element

  //// Create Trcuk Type dropdown dynamic element UI

  addClickTruckType() {
    this.setState(prevState => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ]
    }));
  }

  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr">
          <div className="spe-equ">
            <select
              className="select-text mr-3"
              name="TruckName"
              onChange={this.UITruckTypeChange.bind(this, i)}
            >
              <option>Select</option>
              {this.state.TruckType.map((item, i) => (
                <option key={i} value={item.TruckID}>
                  {item.TruckName}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="Quantity"
              placeholder="Quantity"
              onChange={this.UITruckTypeChange.bind(this, i)}
            />
          </div>
          {i === 0 ? (
            <div className="col-md">
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
          {this.state.TruckTypeData.length > 1 ? (
            <div className="col-md">
              <div className="spe-equ mt-2">
                <i
                  className="fa fa-minus"
                  aria-hidden="true"
                  onClick={this.removeClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
  }

  UITruckTypeChange(i, e) {
    const { name, value } = e.target;

    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData[i] = {
      ...TruckTypeData[i],
      [name]: name === "Quantity" ? parseInt(value) : value,
      ["TruckDesc"]:
        name === "TruckName"
          ? e.target.options[e.target.selectedIndex].text
          : TruckTypeData[i].TruckDesc
    };
    this.setState({ TruckTypeData });
  }
  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
  }

  //// End Truck Tyep Dynamic element

  //// Handle Truck Type Method

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
  //// end method

  ////this method for remove document
  HandleDocumentDelete(evt, row) {
    debugger;
    // var HblNo = row.original["HBL#"];
    // this.setState({ modalDel: true });
  }
  ////end method of remove documents

  //// this method for download file
  HandleDocumentDownloadFile(evt, row) {
    debugger;
    //var filePath = row.original["HBL#"];
  }

  //// end methos of download file

  ////Create File element method
  addClickTruckType(fileName) {
    debugger;
    if (this.state.FileData.length > 0) {
      this.setState(prevState => ({
        FileData: [
          ...prevState.FileData,
          {
            bookingID: parseInt(
              this.state.FileData[0].BookingID !== ""
                ? this.state.FileData[0].BookingID
                : 0
            ),
            FileName: fileName,
            DocumentID: parseInt(this.state.FileData[0].DocumentID || 0)
          }
        ]
      }));
    } else {
      this.setState(prevState => ({
        FileData: [
          ...prevState.FileData,
          {
            bookingID: 0,
            FileName: fileName,
            DocumentID: 0
          }
        ]
      }));
    }
  }

  /////

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
                                Cell: row => {
                                  i++;
                                  return (
                                    <React.Fragment>
                                      <div className="d-flex align-items-center">
                                        {/* <div className="cont-costs still-maersk rate-tab-check p-0">
                                          <div className="remember-forgot d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div> */}
                                        <div>
                                          <p className="details-title">
                                            <img
                                              src={maersk}
                                              alt="maersk icon"
                                            />
                                          </p>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                },
                                accessor: "lineName"
                                // width: 200
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
                                        Header: "C.Type",
                                        accessor: "Type"
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
                          <div className="col-md-4">
                            <p className="details-title">Shipment Type</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].ShipmentType
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].ModeOfTransport
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].CargoType : null}
                              {this.state.ContainerLoad !== ""
                                ? this.state.ContainerLoad
                                : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para">
                              {this.state.EquipmentTypes}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                            <p className="details-para">
                              {/* {this.state.EquipmentTypes} */}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].Incoterm : ""}
                              {Booking.length > 0 ? Booking[0].IncoTerm : ""}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].IncoTerm
                                : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {this.state.typeofMove}
                            </p>
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">POL</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POL : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POL
                                : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POD : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POD
                                : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">PU Address</p>
                            {/* <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p> */}
                          </div>
                          <div className="col-md-4">
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
                      <div className="title-border py-3">
                        <h3>Customer Details</h3>
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-md-4">
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
                          <div className="col-md-4">
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
                          <div className="col-md-4">
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
                      <div className="title-border py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
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

                          {/* <p className="details-para">
                              {Booking3.length > 0
                                ? Booking3[0].Consignee
                                : null}
                            </p> */}

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Consignee_Displayas
                                : null} */}
                              {this.state.consineeData !== null
                                ? this.state.consineeData.CompanyAddress
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Shipper Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
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
                                isMulti
                              />
                            )}
                            {/* <p className="details-para">
                              {Booking3.length > 0 ? Booking3[0].Shipper : null}
                            </p> */}
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Shipper_Displayas
                                : null} */}
                              {this.state.shipperData !== null
                                ? this.state.shipperData.CompanyAddress
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 login-fields">
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

                    {/* <div className="row">
                      <div className="col-md">
                        <div className="rename-cntr login-fields">
                          <label>Notify Party</label>
                          <select>
                            <option>Name</option>
                            <option>Name</option>
                            <option>Name</option>
                            <option>Name</option>
                          </select>
                        </div>
                      </div>
                      
                    </div> */}
                    <div>
                      <div className="title-border py-3">
                        <h3>Buyer Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Buyer Name</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Buyer_Name
                                : null} */}

                              <select
                                onChange={this.HandleChangeBuyer.bind(this)}
                                value={this.state.BuyerID}
                              >
                                <option selected>select</option>
                                {this.state.NonCustomerData.map((item, i) => (
                                  <option key={i} value={item.Company_ID}>
                                    {item.Company_Name}
                                  </option>
                                ))}
                              </select>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Buyer_Displayas
                                : null} */}
                              {this.state.Buyer_Displayas !== ""
                                ? this.state.Buyer_Displayas
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Notify Party Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Notify Party Name</p>
                            <p className="details-para">
                              <select
                                onChange={this.HandleChangeParty.bind(this)}
                                value={this.state.NotifyID}
                              >
                                <option selected>select</option>
                                {this.state.NonCustomerData.map((item, i) => (
                                  <option key={i} value={item.Company_ID}>
                                    {item.Company_Name}
                                  </option>
                                ))}
                              </select>
                              {/* {Booking.length > 0
                                ? Booking[0].NotifyName
                                : null} */}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Notify_Displayas
                                : null} */}
                              {this.state.Notify_Displayas !== ""
                                ? this.state.Notify_Displayas
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        className="title-border py-3"
                        style={{ width: "100%" }}
                      >
                        <h3>Cargo Details</h3>
                      </div>
                    </div>
                    <div className="row ratefinalpgn">
                      {/* <div>
                        {this.state.eqmtType.length > 0
                          ? this.NewcreateUI()
                          : null}
                      </div> */}
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

                                // {
                                //   Header: "Action",
                                //   Cell: row => {
                                //     return (
                                //       <div className="action-cntr">
                                //         <img
                                //           className="actionicon"
                                //           src={Edit}
                                //           alt="view-icon"
                                //           //onClick={e => this.HandleDocumentView(e, row)}
                                //         />
                                //       </div>
                                //     );
                                //   }
                                // }
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
                                // {
                                //   Header: "Booking Pack",
                                //   accessor: "BookingPackID",
                                //   width:120
                                // },
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
                                // {
                                //   Header: "Action",
                                //   Cell: row => {
                                //     return (
                                //       <div className="action-cntr">
                                //         <img
                                //           className="actionicon"
                                //           src={Edit}
                                //           alt="view-icon"
                                //           onClick={e =>
                                //             this.HandleDocumentView(e, row)
                                //           }
                                //         />
                                //       </div>
                                //     );
                                //   }
                                // }
                              ]
                            }
                          ]}
                          data={this.state.multiCBM}
                          minRows={0}
                          showPagination={false}
                          className="-striped -highlight"
                        />
                      ) : null}
                      {/* {this.state.multiCBM.length > 0
                          ? this.CreateMultiCBM()
                          : null} */}
                    </div>
                    <div className="row cargodetailsB">
                      {/* <ReactTable
                        data={Booking2}
                        columns={[
                          {
                            columns: [
                              {
                                Header: "Package Count",
                                accessor: "PackageCount"
                              },
                              {
                                Header: "Volume",
                                accessor: "Volume"
                              },
                              {
                                Header: "Weight",
                                accessor: "Weight"
                              }
                            ]
                          }
                        ]}
                        defaultPageSize={3}
                        minRows={1}
                        showPagination={false}
                      /> */}
                    </div>
                    {/* <div className="text-right">
                      <a href="quote-table" className="butn">
                        Send
                      </a>
                    </div> */}
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
                      {/* <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Header: "File Name",
                                accessor: "FileName"
                              },

                              {
                                Header: "Action",
                                sortable: false,
                                accessor: "DocumentDescription",
                                Cell: row => {
                                  if (row.value == "No Data Found") {
                                    return <div></div>;
                                  } else {
                                    return (
                                      <div>
                                        <img
                                          className="actionicon"
                                          src={Delete}
                                          alt="delete-icon"
                                          onClick={e =>
                                            this.HandleDocumentDelete(e, row)
                                          }
                                        />
                                        <img
                                          className="actionicon"
                                          src={Download}
                                          alt="download-icon"
                                          onClick={e =>
                                            this.HandleDownloadFile(e, row)
                                          }
                                        />
                                      </div>
                                    );
                                  }
                                }
                              }
                            ]
                          }
                        ]}
                        data={this.state.FileData}
                        minRows={0}
                        showPagination={false}
                      ></ReactTable> */}

                      {/* <a
                        href={
                          "https://vizio.atafreight.com/WebVizio_3_0/" +
                          this.state.selectedFilePath
                        }
                      >
                        <p className="file-name w-100 text-center mt-1">
                          {this.state.selectedFileName}
                        </p>
                      </a> */}
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

          {/* {------------------Create Booking Modal --------------} */}
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
          {/* {------------------End Booking Modal --------------} */}
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

export default RateFinalizingStillBooking;

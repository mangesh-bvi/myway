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

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

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

      ConshineeID: 0,
      Conshinee_AddressID: 0,
      Conshinee_Displayas: "",
      ConshineeName: "",

      ShipperID: 0,
      Shipper_AddressID: 0,
      Shipper_Displayas: "",
      ShipperName: "",

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
      HAZMAT: 0,
      Customs_Clearance: 0,
      Unstackable: 0,
      conshineeAddData: [],
      shipperAddData: [],
      buyerAddData: [],
      notifyAddData: [],
      Company_Name: "",
      ContactName: "",
      DefaultEntityTypeID: 0,
      CustomerID: 0,
      CustomerName: "",
      CustomerAddress: "",
      isConshinee: false,
      isShipper: false,

      currentPackageType: "",
      valuequantity: 0,
      valuelenght: 0,
      valuewidth: 0,
      valueheight: 0,
      valueweight: 0,
      valuecbm: 0,
      valuespecialsontainersode: "",
      modalEdit: false,
      companyID: 0,
      company_name: "",
      contact_name: "",
      Company_Address: "",
      ShipmentType: "",

      consineeData: {},
      shipperData: {},
      notifyData: {},
      buyerData: {},
      strBooking_No: ""
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.BookigGridDetailsList = this.BookigGridDetailsList.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.NonCustomerList = this.NonCustomerList.bind(this);
    // this.HandleGetSalesQuotaion = this.HandleGetSalesQuotaion.bind(this);
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
      var ModeofTransport = this.props.location.state.Mode;

      this.setState({ BookingNo, userType, copy: true, ModeofTransport });
      if (ModeofTransport === "AIR") {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsListAIR();
          this.NonCustomerList();
        }, 300);
      } else {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
      }
    }

    if (
      this.props.location.state.BookingNo != "" &&
      this.props.location.state.BookingNo != undefined &&
      this.props.location.state.Copy === undefined
    ) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      var BookingNo = this.props.location.state.BookingNo;
      var ModeofTransport = this.props.location.state.Mode;

      this.setState({ BookingNo, userType, isView: true, ModeofTransport });
      if (ModeofTransport === "AIR") {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsListAIR();
          this.NonCustomerList();
        }, 300);
      } else {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
      }
    }
  }

  ////get sales quotation detsils

  // HandleGetSalesQuotaion() {
  //   let self = this;
  //   debugger;
  //   var ContainerLoad = this.state.ContainerLoad;
  //   var salesQuotaNo = this.state.salesQuotaNo;

  //   axios({
  //     method: "post",
  //     url: `${appSettings.APIURL}/SalesQuoteView`,
  //     data: { Mode: ContainerLoad, SalesQuoteNumber: salesQuotaNo },
  //     headers: authHeader()
  //   }).then(function(response) {
  //     debugger;
  //     var QuotationData = response.data.Table1;
  //     var QuotationSubData = response.data.Table2;
  //     var Booking = response.data.Table;
  //     var typeofMove = "";
  //     if (Booking[0].TypeOfMove === "Port To Port") {
  //       typeofMove = "Port To Port";
  //     }
  //     if (Booking[0].TypeOfMove === "Door To Port") {
  //       typeofMove = "Door To Port";
  //     }
  //     if (Booking[0].TypeOfMove === "Port To Door") {
  //       typeofMove = "Port To Door";
  //     }
  //     if (Booking[0].TypeOfMove === "Door To Door") {
  //       typeofMove = "Door To Door";
  //     }
  //     var EquipmentTypes = QuotationData[0].ContainerCode || "";
  //     var selectedCommodity = QuotationData[0].Commodity;
  //     self.setState({
  //       QuotationData,
  //       QuotationSubData,
  //       Booking,
  //       typeofMove,
  //       selectedCommodity,
  //       EquipmentTypes
  //     });
  //   });
  // }

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
      var Buyer_Displayas = id.Company_Address;
      this.setState({ buyerData: id, Buyer_Displayas });
      this.state.BuyerID = id.Company_ID;
      this.HandleCompanyAddress(field, id.Company_ID);
    }

    this.setState({
      fields,
      ConsigneeID: this.state.ConsigneeID,
      ShipperID: this.state.ShipperID
    });
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

  ////this method for NonCustomerList bind

  NonCustomerList() {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/NonCustomerList`,
      data: {
        MyWayUserID: userId
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
      data: {},
      headers: authHeader()
    }).then(function(response) {
      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }
  ////Handel Update Booking Details
  HandleBookingUpdate() {
    //const formData = new FormData();
    debugger;
    var bookingId = this.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var bookingDetails = this.state.Booking;

    var DefaultEntityTypeID = this.state.DefaultEntityTypeID; ////ask to way it give parameter
    var MyWayUserID = userId;

    var ShipperID = 0;
    var Shipper_Displayas = "";
    var Shipper_AddressID = 0;
    var ShipperName = "";
    if (this.state.isShipper === true) {
      ShipperID = Number(this.state.shipperData.Company_ID || 0);
      Shipper_Displayas = this.state.Shipper_Displayas || "";
      Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
      ShipperName = this.state.shipperData.Company_Name || "";
    } else {
      if (this.state.shipperData.Company_ID) {
        ShipperName = this.state.shipperData.Company_Name || "";
        ShipperID = Number(this.state.shipperData.Company_ID || 0);
      } else {
        ShipperName = this.state.ShipperName;
        ShipperID = this.state.ShipperID;
      }

      Shipper_Displayas = this.state.Shipper_Displayas || "";
      Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
    }

    var ConsigneeID = 0;
    var ConsigneeName = "";
    var Consignee_AddressID = 0;
    var Consignee_Displayas = "";

    if (this.state.isConshinee === true) {
      ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
      ConsigneeName = this.state.consineeData.Company_Name || "";
      Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
      Consignee_Displayas = this.state.Consinee_Displayas;
    } else {
      if (this.state.consineeData.Company_ID) {
        ConsigneeID = Number(this.state.consineeData.Company_ID || 0);
        ConsigneeName = this.state.consineeData.Company_Name || "";
      } else {
        ConsigneeID = this.state.ConsigneeID;
        ConsigneeName = this.state.ConsigneeName;
      }

      Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
      Consignee_Displayas = this.state.Consignee_Displayas;
    }
    var BuyerID = Number(this.state.buyerData.Company_ID || 0);
    var Buyer_AddressID = this.state.Buyer_AddressID;
    var Buyer_Displayas = this.state.Buyer_Displayas;
    var BuyerName = this.state.buyerData.Company_Name;

    if (this.state.buyerData.Company_ID) {
      BuyerID = Number(this.state.buyerData.Company_ID || 0);
      BuyerName = this.state.buyerData.Company_Name;
    } else {
      BuyerID = this.state.BuyerID;
      BuyerName = this.state.BuyerName;
    }

    var NotifyID = Number(this.state.notifyData.Company_ID || 0);
    var Notify_AddressID = Number(this.state.Notify_AddressID || 0);
    var Notify_Displayas = this.state.Notify_Displayas || "";
    var NotifyName = this.state.notifyData.Company_Name || "";

    if (this.state.notifyData.Company_Name) {
      NotifyName = this.state.notifyData.Company_Name || "";
      NotifyID = Number(this.state.notifyData.Company_ID || 0);
    } else {
      NotifyName = this.state.NotifyName;
      NotifyID = this.state.NotifyID;
    }

    var Mode = bookingDetails[0].CargoType;
    var Commodity = Number(bookingDetails[0].Commodity || 0);
    var saleQuoteID = Number(bookingDetails[0].saleQuoteID || 0);
    var saleQuoteNo = bookingDetails[0].saleQuoteNo || "";
    var saleQuoteLineID = Number(bookingDetails[0].saleQuoteLineID || 0);

    var BookingDocs = [];
    var BookingDim = [];
    if (this.state.FileData.length > 0) {
      for (let i = 0; i < this.state.FileData.length; i++) {
        var fileObj = new Object();
        fileObj.BookingID = bookingId;
        fileObj.DocumentID = this.state.FileData[i].DocumentID;
        fileObj.FTPFilePath = this.state.FileData[i].FilePath;
        if (this.state.FileData[i].DocumentID) {
          BookingDocs.push(fileObj);
        }
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
      BookingNo: this.state.strBooking_No,
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
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingUpdation`,

      headers: authHeader(),
      data: paramData
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data.Table[0].Message);

      self.HandleFileUpload();
    });
  }

  HandleFileUpload() {
    debugger;
    let self = this;
    if (self.state.selectedFile.length > 0) {
      var BookingID = self.state.BookingNo;
      var DocumentID = 0;
      var DocumnetFile = self.state.selectedFile[0];

      var userId = encryption(window.localStorage.getItem("userid"), "desc");
      var formdata = new FormData();
      formdata.append("BookingID", BookingID);
      formdata.append("DocumentID", DocumentID);
      formdata.append("BookingDoc", DocumnetFile);
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
    } else {
      self.props.history.push("booking-table");
    }
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
    var FileData = event.target.files;
    // var filesArr = this.state.selectedFile;
    var f_data = this.state.FileData;
    var objFile = new Object();
    objFile.FileName = event.target.files[0].name;
    this.setState({ selectedFile: FileData });
    // for (let i = 0; i < FileData.length; i++) {
    //   var selectedFile = event.target.files[i];
    //   filesArr.push(selectedFile);
    //   var fileName = event.target.files[i].name;

    //   // this.addClickTruckType(fileName);
    // }
    f_data.push(objFile);
    this.setState({ FileData: f_data });
  };

  ////change value of SelectType methiod

  HandleRadioBtn(type, e) {
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

  ////this methos for bookig details HandleBookigClone
  HandleBookigClone() {
    let self = this;
    debugger;
    var bookingId = self.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var bookingDetails = self.state.Booking;

    var DefaultEntityTypeID = self.state.DefaultEntityTypeID; ////ask to way it give parameter
    var MyWayUserID = userId;

    var ShipperID = 0;
    var Shipper_Displayas = "";
    var Shipper_AddressID = 0;
    var ShipperName = "";
    if (self.state.isShipper === true) {
      ShipperID = Number(self.state.shipperData.Company_ID || 0);
      Shipper_Displayas = self.state.Shipper_Displayas || "";
      Shipper_AddressID = Number(self.state.Shipper_AddressID || 0);
      ShipperName = self.state.shipperData.Company_Name || "";
    } else {
      if (self.state.shipperData.Company_ID) {
        ShipperName = self.state.shipperData.Company_Name || "";
        ShipperID = Number(self.state.shipperData.Company_ID || 0);
      } else {
        ShipperName = self.state.ShipperName;
        ShipperID = self.state.ShipperID;
      }

      Shipper_Displayas = self.state.Shipper_Displayas || "";
      Shipper_AddressID = Number(self.state.Shipper_AddressID || 0);
    }

    var ConsigneeID = 0;
    var ConsigneeName = "";
    var Consignee_AddressID = 0;
    var Consignee_Displayas = "";

    if (self.state.isConshinee === true) {
      ConsigneeID = Number(self.state.consineeData.Company_ID || 0);
      ConsigneeName = self.state.consineeData.Company_Name || "";
      Consignee_AddressID = Number(self.state.Consignee_AddressID || 0);
      Consignee_Displayas = self.state.Consinee_Displayas;
    } else {
      if (self.state.consineeData.Company_ID) {
        ConsigneeID = Number(self.state.consineeData.Company_ID || 0);
        ConsigneeName = self.state.consineeData.Company_Name || "";
      } else {
        ConsigneeID = self.state.ConsigneeID;
        ConsigneeName = self.state.ConsigneeName;
      }

      Consignee_AddressID = Number(self.state.Consignee_AddressID || 0);
      Consignee_Displayas = self.state.Consignee_Displayas;
    }
    var BuyerID = Number(self.state.buyerData.Company_ID || 0);
    var Buyer_AddressID = self.state.Buyer_AddressID;
    var Buyer_Displayas = self.state.Buyer_Displayas;
    var BuyerName = self.state.buyerData.Company_Name;

    if (self.state.buyerData.Company_ID) {
      BuyerID = Number(self.state.buyerData.Company_ID || 0);
      BuyerName = self.state.buyerData.Company_Name;
    } else {
      BuyerID = self.state.BuyerID;
      BuyerName = self.state.BuyerName;
    }

    var NotifyID = Number(self.state.notifyData.Company_ID || 0);
    var Notify_AddressID = Number(self.state.Notify_AddressID || 0);
    var Notify_Displayas = self.state.Notify_Displayas || "";
    var NotifyName = self.state.notifyData.Company_Name || "";

    if (self.state.notifyData.Company_Name) {
      NotifyName = self.state.notifyData.Company_Name || "";
      NotifyID = Number(self.state.notifyData.Company_ID || 0);
    } else {
      NotifyName = self.state.NotifyName;
      NotifyID = self.state.NotifyID;
    }

    var Mode = bookingDetails[0].CargoType;
    var Commodity = Number(bookingDetails[0].Commodity || 0);
    var saleQuoteID = Number(bookingDetails[0].saleQuoteID || 0);
    var saleQuoteNo = bookingDetails[0].saleQuoteNo || "";
    var saleQuoteLineID = Number(bookingDetails[0].saleQuoteLineID || 0);

    var BookingDocs = [];
    var BookingDim = [];
    if (self.state.FileData.length > 0) {
      for (let i = 0; i < self.state.FileData.length; i++) {
        var fileObj = new Object();
        fileObj.BookingID = bookingId;
        fileObj.DocumentID = self.state.FileData[i].DocumentID;
        fileObj.FTPFilePath = self.state.FileData[i].FilePath;
        BookingDocs.push(fileObj);
      }
    }
    if (self.state.multiCBM.length > 0) {
      for (let i = 0; i < self.state.multiCBM.length; i++) {
        var cargoData = new Object();

        cargoData.BookingPackID = self.state.multiCBM[i].BookingPackID || 0;
        cargoData.PackageType = self.state.multiCBM[i].PackageType || "";
        cargoData.Quantity = self.state.multiCBM[i].QTY || 0;
        cargoData.Lengths = self.state.multiCBM[i].Lengths || 0;
        cargoData.Width = self.state.multiCBM[i].Width || 0;
        cargoData.Height = self.state.multiCBM[i].Height || 0;
        cargoData.GrossWt = self.state.multiCBM[i].GrossWeight || 0;
        cargoData.VolumeWeight = self.state.multiCBM[i].VolumeWeight || 0;
        cargoData.Volume = self.state.multiCBM[i].Volume || 0;

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
      NotificationManager.success(response.data.Table[0].Message);

      self.HandleFileUpload();
    });
  }

  BookigGridDetailsListAIR() {
    let self = this;

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

            var ConsigneeID = Booking[0].Consignee;
            var Consignee_AddressID = Booking[0].Consignee_AddressID;
            var Consignee_Displayas = Booking[0].Consignee_Displayas;
            var ConsigneeName = Booking[0].Consignee_Name;

            var BuyerID = Booking[0].BuyerID;
            var Buyer_AddressID = Booking[0].Buyer_AddressID;
            var Buyer_Displayas = Booking[0].Buyer_Displayas;
            var BuyerName = Booking[0].Buyer_Name;

            var ShipperID = Booking[0].ShipperID;
            var Shipper_AddressID = Booking[0].Shipper_AddressID;
            var Shipper_Displayas = Booking[0].Shipper_Displayas;
            var ShipperName = Booking[0].Shipper_Name;
            var DefaultEntityTypeID = Booking[0].DefaultEntityTypeID;

            // var DefaultEntityTypeID = Booking[0].DefaultEntityTypeID;
            var companyID = 0;
            var CompanyAddress = "";
            var Company_Name = "";
            var Company_AddressID = 0;
            if (DefaultEntityTypeID === ShipperID) {
              companyID = ShipperID;
              CompanyAddress = Shipper_Displayas;
              Company_Name = ShipperName;
              Company_AddressID = Shipper_AddressID;
            }
            if (DefaultEntityTypeID === BuyerID) {
              companyID = BuyerID;
              CompanyAddress = Buyer_Displayas;
              Company_Name = BuyerName;
              Company_AddressID = Buyer_AddressID;
            }

            if (DefaultEntityTypeID === ConsigneeID) {
              companyID = ConsigneeID;
              CompanyAddress = Consignee_Displayas;
              Company_Name = ConsigneeName;
              Company_AddressID = Consignee_AddressID;
            }

            if (DefaultEntityTypeID === NotifyID) {
              companyID = NotifyID;
              CompanyAddress = Notify_Displayas;
              Company_Name = NotifyName;
              Company_AddressID = Notify_AddressID;
            }
            self.setState({
              companyID,
              CompanyAddress,
              Company_Name,
              Company_AddressID,
              DefaultEntityTypeID,
              multiCBM: CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,

              NotifyID,
              Notify_AddressID,
              Notify_Displayas,
              NotifyName,

              ConsigneeName,
              ConsigneeID,
              Consignee_AddressID,
              Consignee_Displayas,

              ShipperID,
              Shipper_AddressID,
              Shipper_Displayas,
              ShipperName,

              BuyerID,
              Buyer_AddressID,
              Buyer_Displayas,
              BuyerName,
              fields: {
                Consignee: Booking[0].Consignee_Name,
                Shipper: Booking[0].Shipper_Name,
                Notify: NotifyName,
                Buyer: BuyerName
              }
            });

            if (Consignee_AddressID) {
              setTimeout(() => {
                self.conshineeAddressList(ConsigneeID, Consignee_AddressID);
              }, 200);
            }
            if (Shipper_AddressID) {
              setTimeout(() => {
                self.shipperAddressList(ShipperID, Shipper_AddressID);
              }, 400);
            }
            if (Buyer_AddressID) {
              setTimeout(() => {
                self.buyerAddressList(BuyerID, Buyer_AddressID);
              }, 600);
            }
            if (Notify_AddressID) {
              setTimeout(() => {
                self.notifyPartyAddressList(NotifyID, Notify_AddressID);
              }, 800);
            }
          }

          if ((typeof FileData !== "undefined") | (FileData.length > 0)) {
            self.setState({ FileData });
          }
        }
      });
    }
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
        var Table6 = response.data.Table6;
        var companyID = 0;
        var company_name = "";
        var contact_name = "";
        var Company_Address = "";
        var HAZMAT = 0;
        var Customs_Clearance = 0;
        var ShipmentType = "";
        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            var nPartyID = QuotationData[0].NotifyID;
            var company_name = QuotationData[0].company_name;
            var ContactName = QuotationData[0].ContactName;
            var EquipmentTypes = "";
            if (QuotationData.length == 1) {
              EquipmentTypes = QuotationData[0].ContainerType;
            } else {
              for (let i = 0; i < QuotationData.length; i++) {
                EquipmentTypes =
                  EquipmentTypes + QuotationData[i].ContainerType + ",";
              }
            }
            self.setState({
              company_name,
              EquipmentTypes,
              ContactName,
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

            var selectedCommodity = "";
            var strBooking_No = Booking[0].strBooking_No;
            var NotifyID = Booking[0].NotifyID;
            var Notify_AddressID = Booking[0].Notify_AddressID;
            var Notify_Displayas = Booking[0].Notify_Displayas;
            var NotifyName = Booking[0].NotifyName;

            var ConsigneeID = Booking[0].Consignee;
            var Consignee_AddressID = Booking[0].Consignee_AddressID;
            var Consignee_Displayas = Booking[0].Consignee_Displayas;
            var ConsigneeName = Booking[0].Consignee_Name;

            var BuyerID = Booking[0].BuyerID;
            var Buyer_AddressID = Booking[0].Buyer_AddressID;
            var Buyer_Displayas = Booking[0].Buyer_Displayas;
            var BuyerName = Booking[0].Buyer_Name;

            var ShipperID = Booking[0].ShipperID;
            var Shipper_AddressID = Booking[0].Shipper_AddressID;
            var Shipper_Displayas = Booking[0].Shipper_Displayas;
            var ShipperName = Booking[0].Shipper_Name;

            var DefaultEntityTypeID = Booking[0].DefaultEntityTypeID;
            var companyID = 0;
            var CompanyAddress = "";
            var Company_Name = "";
            var Company_AddressID = 0;
            if (DefaultEntityTypeID === ShipperID) {
              companyID = ShipperID;
              CompanyAddress = Shipper_Displayas;
              Company_Name = ShipperName;
              Company_AddressID = Shipper_AddressID;
            }
            if (DefaultEntityTypeID === BuyerID) {
              companyID = BuyerID;
              CompanyAddress = Buyer_Displayas;
              Company_Name = BuyerName;
              Company_AddressID = Buyer_AddressID;
            }

            if (DefaultEntityTypeID === ConsigneeID) {
              companyID = ConsigneeID;
              CompanyAddress = Consignee_Displayas;
              Company_Name = ConsigneeName;
              Company_AddressID = Consignee_AddressID;
            }

            if (DefaultEntityTypeID === NotifyID) {
              companyID = NotifyID;
              CompanyAddress = Notify_Displayas;
              Company_Name = NotifyName;
              Company_AddressID = Notify_AddressID;
            }

            self.setState({
              typeofMove,
              DefaultEntityTypeID,
              companyID,
              CompanyAddress,
              Company_Name,
              Company_AddressID,
              strBooking_No,
              multiCBM: CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,

              NotifyID,
              Notify_AddressID,
              Notify_Displayas,
              NotifyName,

              ConsigneeName,
              ConsigneeID,
              Consignee_AddressID,
              Consignee_Displayas,

              ShipperID,
              Shipper_AddressID,
              Shipper_Displayas,
              ShipperName,

              BuyerID,
              Buyer_AddressID,
              Buyer_Displayas,
              BuyerName,
              fields: {
                Consignee: ConsigneeName,
                Shipper: ShipperName,
                Notify: NotifyName,
                Buyer: BuyerName
              }
            });
          }
          if (Consignee_AddressID) {
            setTimeout(() => {
              self.conshineeAddressList(ConsigneeID, Consignee_AddressID);
            }, 200);
          }
          if (Shipper_AddressID) {
            setTimeout(() => {
              self.shipperAddressList(ShipperID, Shipper_AddressID);
            }, 400);
          }
          if (Buyer_AddressID) {
            setTimeout(() => {
              self.buyerAddressList(BuyerID, Buyer_AddressID);
            }, 600);
          }
          if (Notify_AddressID) {
            setTimeout(() => {
              self.notifyPartyAddressList(NotifyID, Notify_AddressID);
            }, 800);
          }

          if ((typeof FileData !== "undefined") | (FileData.length > 0)) {
            self.setState({ FileData });
          }
        }
        if (Table6.length > 0) {
          var companyID = 0;
          if (Table6[0].contact_name) {
            companyID = Table6[0].companyID;
            Company_Address = Table6[0].Company_Address;
            contact_name = Table6[0].contact_name;
            company_name = Table6[0].company_name;
          } else {
            companyID = Table6[0].CompanyID;
            Company_Address = Table6[0].Company_Address;
            contact_name = Table6[0].ContactName;
            company_name = Table6[0].CompanyName;
          }
          ShipmentType = Table6[0].ShipmentType;

          var HAZMAT = Table6[0].HAZMAT;
          var Customs_Clearance = Table6[0].Customs_Clearance;
          var ModeofTransport = Table6[0].ModeOfTransport;

          self.setState({
            ModeofTransport,
            HAZMAT,
            Customs_Clearance,
            ShipmentType,
            companyID,
            company_name,
            contact_name,
            Company_Address
          });
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

  notifyPartyAddressList(NotifyID, Notify_AddressID) {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = NotifyID;
    var n_AddressID = Notify_AddressID;
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
        var Notify_AddressID = n_AddressID;
        self.setState({ notifyAddData, Notify_AddressID, notiother: true });
      }
    });
  }

  buyerAddressList(BuyerID, Buyer_AddressID) {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = BuyerID;
    var b_AddressID = Buyer_AddressID;
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
        var Buyer_AddressID = b_AddressID;
        self.setState({ buyerAddData, Buyer_AddressID, buyerother: true });
      }
    });
  }

  conshineeAddressList(ConsigneeID, Conshinee_AddressID) {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = ConsigneeID;
    var c_AddressID = Conshinee_AddressID;

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
      if (conshineeAddData.length > 0) {
        var Conshinee_AddressID = c_AddressID;
        self.setState({
          conshineeAddData,
          Conshinee_AddressID,
          conshineeother: true
        });
      }
    });
  }

  shipperAddressList(ShipperID, Shipper_AddressID) {
    let self = this;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    var cusID = ShipperID;
    var s_AddressID = Shipper_AddressID;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerAddressList`,
      data: {
        UserID: userId,
        CustomerID: cusID
      },
      headers: authHeader()
    }).then(function(response) {
      var shipperAddData = response.data.Table;
      if (shipperAddData) {
        var Shipper_AddressID = s_AddressID;
        self.setState({
          shipperAddData,
          Shipper_AddressID,
          shipperother: true
        });
      }
    });
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

  SubmitCargoDetails(e) {
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

    // this.forceUpdate();
    // this.setState({ modalEdit: !this.state.modalEdit });
    // this.setState(prevState => ({
    //   modalEdit: !prevState.modalEdit
    // }));
    this.toggleEdit();
  }

  toggleEdit(e) {
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

  render() {
    const { Booking } = this.state;
    var bNumber = "";
    if (Booking.length > 0) {
      bNumber = Booking[0].strBooking_No;
    }
    // var selectedCommodity = "";
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
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
                                accessor: "lineName"
                                // minWidth: 200
                              },
                              {
                                accessor: "POL",

                                Cell: row => {
                                  if (
                                    this.state.Booking[0].CargoType === "LCL" ||
                                    this.state.Booking[0].CargoType === "FCL" ||
                                    this.state.Booking[0].CargoType === "AIR"
                                  ) {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">POL</p>
                                        <p className="details-para">
                                          {row.original.POL}
                                        </p>
                                      </React.Fragment>
                                    );
                                  } else {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">POL</p>
                                        <p className="details-para">
                                          {row.original.OriginName}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
                                }
                              },
                              {
                                accessor: "POD",
                                Cell: row => {
                                  debugger;
                                  if (
                                    this.state.Booking[0].CargoType === "LCL" ||
                                    this.state.Booking[0].CargoType === "FCL" ||
                                    this.state.Booking[0].CargoType === "AIR"
                                  ) {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">POD</p>
                                        <p className="details-para">
                                          {row.original.POD}
                                        </p>
                                      </React.Fragment>
                                    );
                                  } else {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">POD</p>
                                        <p className="details-para">
                                          {row.original.DestinationName}
                                        </p>
                                      </React.Fragment>
                                    );
                                  }
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
                        minRows={1}
                        showPagination={false}
                        className="-striped -highlight no-mid-align"
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                data={this.state.QuotationSubData.filter(
                                  x =>
                                    x.SaleQuoteID === row.original.SaleQuoteID1
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
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">Shipment Type</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].ShipmentType
                                : null} */}
                              {this.state.ShipmentType}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].ModeOfTransport
                                : null} */}
                              {this.state.ModeofTransport}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].CargoType : null}
                              {this.state.ContainerLoad !== ""
                                ? this.state.ContainerLoad
                                : ""}
                            </p>
                          </div>
                          {this.state.ContainerLoad == "FCL" ? (
                            <>
                              <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                                <p className="details-title">Equipment Types</p>
                                <p className="details-para">
                                  {this.state.EquipmentTypes}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                                <p className="details-title">
                                  Special Equipment
                                </p>
                                <p className="details-para"></p>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">HazMat</p>
                            <p className="details-para">
                              {/* {this.state.EquipmentTypes} */}
                              {this.state.HazMat === 0 ? "No" : "Yes"}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">Customs Clearance</p>
                            <p className="details-para">
                              {/* {this.state.EquipmentTypes} */}
                              {this.state.Customs_Clearance === 0
                                ? "No"
                                : "Yes"}
                            </p>
                          </div>
                          {this.state.ContainerLoad == "LCL" ||
                          this.state.ContainerLoad == "AIR" ? (
                            <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                              <p className="details-title">Unstackable</p>
                              <p className="details-para">
                                {/* {this.state.EquipmentTypes} */}
                                {this.state.Unstackable === 0
                                  ? "No"
                                  : "Yes"}
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].Incoterm : ""}
                              {Booking.length > 0 ? Booking[0].IncoTerm : ""}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].IncoTerm
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {this.state.typeofMove}
                            </p>
                          </div>

                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">POL</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POL : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POL
                                : ""}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">POD</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POD : null}
                              {this.state.QuotationData.length > 0
                                ? this.state.QuotationData[0].POD
                                : ""}
                            </p>
                          </div>
                          {/* <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                            <p className="details-title">PU Address</p>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                            <p className="details-title">Delivery Address</p>
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
                              {/* {selectedType === "Shipper"
                                ? Booking[0].Shipper_Name
                                : selectedType === "Consignee"
                                ? Booking[0].Consignee_Name
                                : null} */}
                              {/* {Booking.length > 0
                                ? Booking[0].company_name
                                : ""} */}

                              {this.state.company_name}
                            </p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].Company_Address
                                : ""} */}
                              {this.state.Company_Address}
                            </p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para">
                              {/* {Booking.length > 0
                                ? Booking[0].contact_name
                                : ""}
                               */}
                              {this.state.contact_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="remember-forgot rate-checkbox justify-content-center">
                        <input
                          type="checkbox"
                          onChange={this.HandleRadioBtn.bind(this, "Conshinee")}
                          name="cust-select"
                          id="exist-cust"
                          checked={this.state.isConshinee}
                          value="Consignee"
                        />
                        <label
                          className="d-flex flex-column align-items-center"
                          htmlFor="exist-cust"
                        >
                          Consignee
                        </label>

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
                      <div className="title-border-t py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
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
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 login-fields">
                            <p className="details-title">&nbsp;</p>
                            {this.state.conshineeother === true ? (
                              <textarea
                                className="form-control"
                                style={{ width: "100%", resize: "none" }}
                                value={this.state.Consignee_Displayas}
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
                          <div className="col-12 col-sm-6 col-md-4 login-fields divblock">
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
                          value={Number(this.state.selectedCommodity)}
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
                    {this.state.isView === true ? (
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
                {" "}
                {/* <div className="equip-plus-cntr w-100 mt-0 modelselecteqt">
                        <Select
                          className="rate-dropdown"
                          getOptionLabel={option =>
                            option.StandardContainerCode
                          }
                          getOptionValue={option =>
                            option.StandardContainerCode
                          }
                          isMulti
                          options={this.state.EquipmentType}
                          onChange={this.newaddClick.bind(this)}
                          value={this.state.selected}
                          showNewOptionAtTop={false}
                        />
                      </div> */}
                {/* <div className="d-flex flex-wrap justify-content-center">
                        {this.NewcreateUI()}
                      </div>
                      <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                        <input
                          id="Special-equType"
                          type="checkbox"
                          className="d-none"
                          name={"Special-equType"}
                          // onChange={this.HandleSpecialEqtCheck.bind(this)}
                        />
                      </div> */}
                {this.state.containerLoadType === "FCL" ? (
                  // this.state.specialEquipment === true ? (
                  this.state.flattack_openTop.length > 0 ? (
                    <div className="">
                      {/* spe-equ mt-0 */}
                      {/* <div className="equip-plus-cntr w-100">
                            <Select
                              className="rate-dropdown"
                              getOptionLabel={option =>
                                option.SpecialContainerCode
                              }
                              getOptionValue={option =>
                                option.SpecialContainerCode
                              }
                              options={this.state.SpacialEqmt}
                              placeholder="Select Kind of Special Equipment"
                              onChange={this.specEquipChange}
                              showNewOptionAtTop={false}
                            />
                          </div> */}
                      <div id="cbmInner">
                        {/* {this.state.specialEqtSelect === true ? ( */}
                        {/* {this.state.flattack_openTop.length > 0 ? ( */}
                        <>{this.MultiCreateCBM()}</>
                        {/* //) : null */}
                        {/* ) : null} */}
                      </div>
                    </div>
                  ) : (
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

export default RateFinalizingStillBooking;

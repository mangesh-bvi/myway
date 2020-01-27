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
import Download from "./../assets/img/csv.png";
import Delete from "./../assets/img/red-delete-icon.png";
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
      IncoTerm: "",
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
      multiCMBData: [],
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
      strBooking_No: "",
      isShipper: false,
      isConshinee: false,
      isBuyer: false,
      isNotify: false,
      multiCargo: [],
      CargoDetails: [],
      loding: false,
      newloding: false
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.BookigGridDetailsList = this.BookigGridDetailsList.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.NonCustomerList = this.NonCustomerList.bind(this);
  }
  componentDidMount() {
    var rData = this.props.location.state;
    debugger;
    if (rData) {
      if (rData.Copy === true) {
        var userType = encryption(
          window.localStorage.getItem("usertype"),
          "desc"
        );
        var BookingNo = this.props.location.state.BookingNo;
        var ModeofTransport = this.props.location.state.Mode;

        this.setState({
          BookingNo,
          userType,
          copy: true,
          ModeofTransport
        });
        // if (ModeofTransport === "AIR") {
        //   setTimeout(() => {
        //     this.HandleCommodityDropdown();
        //     this.HandlePackgeTypeData();
        //     this.BookigGridDetailsListAIR();
        //     this.NonCustomerList();
        //   }, 300);
        // } else {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
        // }
      } else if (
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

        this.setState({
          BookingNo,
          userType,
          isView: true,
          ModeofTransport
        });
        // if (ModeofTransport === "AIR") {
        //   setTimeout(() => {
        //     this.HandleCommodityDropdown();
        //     this.HandlePackgeTypeData();
        //     this.BookigGridDetailsListAIR();
        //     this.NonCustomerList();
        //   }, 300);
        // } else {
        setTimeout(() => {
          this.HandleCommodityDropdown();
          this.HandlePackgeTypeData();
          this.BookigGridDetailsList();
          this.NonCustomerList();
        }, 300);
        // }
      } else {
      }
    } else {
      this.props.history.push("booking-table");
    }
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
            self.setState({
              fields
            });
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

    if (
      this.state.isConshinee === true ||
      this.state.isShipper === true ||
      this.state.isBuyer === true ||
      this.state.isNotify === true
    ) {
      this.setState({ loding: true });
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
        ShipperID = Number(this.state.ShipperID || 0);
        Shipper_Displayas = this.state.Shipper_Displayas || "";
        Shipper_AddressID = Number(this.state.Shipper_AddressID || 0);
        ShipperName = this.state.ShipperName || "";
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
        ConsigneeID = Number(this.state.ConsigneeID || 0);
        ConsigneeName = this.state.ConsigneeName || "";
        Consignee_AddressID = Number(this.state.Consignee_AddressID || 0);
        Consignee_Displayas = this.state.Consignee_Displayas;
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

      var BuyerID = 0;
      var BuyerName = "";
      var Buyer_AddressID = 0;
      var Buyer_Displayas = "";

      if (this.state.isBuyer === true) {
        BuyerID = Number(this.state.BuyerID || 0);
        BuyerName = this.state.BuyerName || "";
        Buyer_AddressID = Number(this.state.Buyer_AddressID || 0);
        Buyer_Displayas = this.state.Buyer_Displayas;
      } else {
        if (this.state.buyerData.Company_ID) {
          BuyerID = Number(this.state.buyerData.Company_ID || 0);
          BuyerName = this.state.buyerData.Company_Name || "";
        } else {
          BuyerID = this.state.BuyerID;
          BuyerName = this.state.BuyerName;
        }
        Buyer_AddressID = Number(this.state.Buyer_AddressID || 0);
        Buyer_Displayas = this.state.Buyer_Displayas;
      }

      var NotifyID = 0;
      var NotifyName = "";

      var Notify_AddressID = 0;
      var Notify_Displayas = "";

      if (this.state.isNotify === true) {
        NotifyID = Number(this.state.NotifyID || 0);
        NotifyName = this.state.NotifyName || "";
        Notify_AddressID = Number(this.state.Notify_AddressID || 0);
        Notify_Displayas = this.state.Notify_Displayas;
      } else {
        if (this.state.notifyData.Company_ID) {
          NotifyID = Number(this.state.notifyData.Company_ID || 0);
          NotifyName = this.state.notifyData.Company_Name || "";
        } else {
          NotifyID = this.state.BuyerID;
          NotifyName = this.state.BuyerName;
        }
        Notify_AddressID = Number(this.state.Notify_AddressID || 0);
        Notify_Displayas = this.state.Notify_Displayas;
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

          cargoData.BookingPackID = self.state.multiCBM[i].BookingPackID || 0;
          cargoData.PackageType = self.state.multiCBM[i].PackageType || "";
          cargoData.Quantity = self.state.multiCBM[i].Quantity || 0;
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
        self.setState({ loding: false });
        self.HandleFileUpload();
      });
    } else {
      NotificationManager.error(
        "please select atleast one Customer has a Consinee,Shipper,Notify,Buyer"
      );
    }
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
    debugger;
    if (event.target.files[0].type === "application/pdf") {
      if (this.state.FileData[0].FileName === "File Not Found") {
        var Fdata = this.state.FileData.splice(0);

        this.setState({ FileData: Fdata });
      }
      var FileData = event.target.files;

      var f_data = this.state.FileData;
      var objFile = new Object();
      objFile.FileName = event.target.files[0].name;
      this.setState({
        selectedFile: FileData
      });

      f_data.push(objFile);
      this.setState({ FileData: f_data });
    } else {
      NotificationManager.error("Please select only PDF File");
      return false;
    }
  };

  ////change value of SelectType methiod

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
        NotificationManager.error("Only 1 is check has customer ");
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
        NotificationManager.error("Only 1 is check has customer ");
      }
    } else if (type === "Buyer") {
      if (
        this.state.isConshinee === false &&
        this.state.isNotify === false &&
        this.state.isShipper === false
      ) {
        this.setState({ isBuyer: !this.state.isBuyer });
      } else {
        NotificationManager.error("Only 1 is check has customer ");
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
        NotificationManager.error("Only 1 is check has customer ");
      }
    } else {
    }
  }

  ////this methos for bookig details HandleBookigClone
  HandleBookigClone() {
    let self = this;
    debugger;
    this.setState({ loding: true });
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
      ShipperID = Number(self.state.ShipperID || 0);
      Shipper_Displayas = self.state.Shipper_Displayas || "";
      Shipper_AddressID = Number(self.state.Shipper_AddressID || 0);
      ShipperName = self.state.ShipperName || "";
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
      ConsigneeID = Number(self.state.ConsigneeID || 0);
      ConsigneeName = self.state.ConsigneeName || "";
      Consignee_AddressID = Number(self.state.Consignee_AddressID || 0);
      Consignee_Displayas = self.state.Consignee_Displayas;
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

    var BuyerID = 0;
    var BuyerName = "";
    var Buyer_AddressID = 0;
    var Buyer_Displayas = "";

    if (self.state.isBuyer === true) {
      BuyerID = Number(self.state.BuyerID || 0);
      BuyerName = self.state.BuyerName || "";
      Buyer_AddressID = Number(self.state.Buyer_AddressID || 0);
      Buyer_Displayas = self.state.Buyer_Displayas;
    } else {
      if (self.state.buyerData.Company_ID) {
        BuyerID = Number(self.state.buyerData.Company_ID || 0);
        BuyerName = self.state.buyerData.Company_Name || "";
      } else {
        BuyerID = self.state.BuyerID;
        BuyerName = self.state.BuyerName;
      }
      Buyer_AddressID = Number(self.state.Buyer_AddressID || 0);
      Buyer_Displayas = self.state.Buyer_Displayas;
    }

    var NotifyID = 0;
    var NotifyName = "";

    var Notify_AddressID = 0;
    var Notify_Displayas = "";

    if (self.state.isNotify === true) {
      NotifyID = Number(self.state.NotifyID || 0);
      NotifyName = self.state.NotifyName || "";
      Notify_AddressID = Number(self.state.Notify_AddressID || 0);
      Notify_Displayas = self.state.Notify_Displayas;
    } else {
      if (self.state.notifyData.Company_ID) {
        NotifyID = Number(self.state.notifyData.Company_ID || 0);
        NotifyName = self.state.notifyData.Company_Name || "";
      } else {
        NotifyID = self.state.BuyerID;
        NotifyName = self.state.BuyerName;
      }
      Notify_AddressID = Number(self.state.Notify_AddressID || 0);
      Notify_Displayas = self.state.Notify_Displayas;
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
        cargoData.Quantity = self.state.multiCBM[i].Quantity || 0;
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
      self.setState({ loding: false });
      setTimeout(() => {
        self.HandleFileUpload();
      }, 1000);
    });
  }

  BookigGridDetailsListAIR() {
    this.setState({ newloding: true });
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
        var Table6 = response.data.Table6;
        var ModeofTransport = response.data.Table[0].ModeofTransport;
        var Company_Address = "";
        var contact_name = "";
        var company_name = "";
        var HAZMAT = 0;
        var ShipmentType = "";
        if (FileData.length > 0) {
          self.setState({ FileData });
        } else {
          self.setState({ FileData: [{ FileName: "File Not Found" }] });
        }
        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            self.setState({
              QuotationData,
              QuotationSubData,
              Booking,

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
            var isNotify = false;
            var isBuyer = false;
            var isConshinee = false;
            var isShipper = false;
            if (DefaultEntityTypeID === ShipperID || ShipperID === 0) {
              isShipper = true;
              companyID = Table6[0].companyID;
              CompanyAddress = Shipper_Displayas;
              Company_Name = Table6[0].company_name;
              Company_AddressID = Shipper_AddressID;
            }
            if (DefaultEntityTypeID === BuyerID || BuyerID === 0) {
              isBuyer = true;
              companyID = Table6[0].companyID;
              CompanyAddress = Buyer_Displayas;
              Company_Name = Table6[0].company_name;
              Company_AddressID = Buyer_AddressID;
            }

            if (DefaultEntityTypeID === ConsigneeID || ConsigneeID === 0) {
              isConshinee = true;
              companyID = Table6[0].companyID;
              CompanyAddress = Consignee_Displayas;
              Company_Name = Table6[0].company_name;
              Company_AddressID = Consignee_AddressID;
            }

            if (DefaultEntityTypeID === NotifyID || NotifyID === 0) {
              isNotify = true;
              companyID = Table6[0].companyID;
              CompanyAddress = Notify_Displayas;
              Company_Name = Table6[0].company_name;
              Company_AddressID = Notify_AddressID;
            }
            self.setState({
              typeofMove,
              isConshinee,
              isShipper,
              isBuyer,
              isNotify,
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
        }

        if (Table6.length > 0) {
          var Customs_Clearance = Table6[0].Customs_Clearance;
          Company_Address = Table6[0].Company_Address;
          contact_name = Table6[0].contact_name;
          company_name = Table6[0].company_name;
          ShipmentType = Table6[0].ShipmentType;
          HAZMAT = Table6[0].HAZMAT;
          var typeofMove = Table6[0].TypeOfMove;
          var NonStackable = Table6[0].NonStackable;
          var IncoTerm = Table6[0].IncoTerm;
          self.setState({
            IncoTerm,
            typeofMove,
            Customs_Clearance,
            NonStackable,
            Company_Address,
            contact_name,
            company_name,
            ShipmentType,
            HAZMAT
          });
        }
      });
    }
  }

  ////this methos for bookig details BookigGridDetailsList
  BookigGridDetailsList() {
    this.setState({ newloding: true });
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
        var multiCargo = [];
        debugger;

        if (Booking[0].Mode == "FCL") {
          var type = QuotationData[0].ContainerType;
        }
        if (Booking[0].Mode == "FTL") {
        } else {
          for (let i = 0; i < CargoDetails.length; i++) {
            var objcargo = new Object();

            objcargo.BookingPackID = CargoDetails[i].BookingPackID || 0;
            objcargo.PackageType = CargoDetails[i].PackageType || "";
            objcargo.Quantity = CargoDetails[i].QTY || 0;
            objcargo.Lengths = CargoDetails[i].Lengths || 0;
            objcargo.Width = CargoDetails[i].Width || 0;
            objcargo.Height = CargoDetails[i].Height || 0;
            objcargo.GrossWt = CargoDetails[i].GrossWeight || 0;
            objcargo.VolumeWeight = CargoDetails[i].VolumeWeight || 0;
            objcargo.Volume = CargoDetails[i].Volume || 0;
            objcargo.TotalGrossWeight = CargoDetails[i].TotalGrossWeight || 0;

            multiCargo.push(objcargo);
          }
        }

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
              newloding: false,
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
            var isNotify = false;
            var isBuyer = false;
            var isConshinee = false;
            var isShipper = false;
            if (DefaultEntityTypeID === ShipperID) {
              isShipper = true;
              companyID = ShipperID;
              CompanyAddress = Shipper_Displayas;
              Company_Name = ShipperName;
              Company_AddressID = Shipper_AddressID;
            }
            if (DefaultEntityTypeID === BuyerID) {
              isBuyer = true;
              companyID = BuyerID;
              CompanyAddress = Buyer_Displayas;
              Company_Name = BuyerName;
              Company_AddressID = Buyer_AddressID;
            }

            if (DefaultEntityTypeID === ConsigneeID) {
              isConshinee = true;
              companyID = ConsigneeID;
              CompanyAddress = Consignee_Displayas;
              Company_Name = ConsigneeName;
              Company_AddressID = Consignee_AddressID;
            }

            if (DefaultEntityTypeID === NotifyID) {
              isNotify = true;
              companyID = NotifyID;
              CompanyAddress = Notify_Displayas;
              Company_Name = NotifyName;
              Company_AddressID = Notify_AddressID;
            }

            var ContainerLoad = Booking[0].Mode;

            self.setState({
              ContainerLoad,
              isConshinee,
              isBuyer,
              isShipper,
              isNotify,
              typeofMove,
              DefaultEntityTypeID,
              companyID,
              CompanyAddress,
              Company_Name,
              Company_AddressID,
              strBooking_No,
              multiCargo,
              // multiCBM: multiCargo,
              CargoDetails,
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

          if (FileData.length > 0) {
            self.setState({ FileData });
          } else {
            self.setState({ FileData: [{ FileName: "File Not Found" }] });
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
          var NonStackable = Table6[0].NonStackable;
          var ModeofTransport = Table6[0].ModeOfTransport;
          var IncoTerm = Table6[0].IncoTerm;
          self.setState({
            NonStackable,
            IncoTerm,
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
  HandleFileOpen(e, filePath) {
    debugger;
    if (filePath === undefined) {
      NotificationManager.error("Invalid File Path");
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
    debugger;
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
      debugger;
      if (
        this.state.ContainerLoad === "FCL" ||
        this.state.ContainerLoad === "FTL"
      ) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: 0
        };
      } else {
        var decVolumeWeight =
          (multiCBM[i].Quantity *
            (parseFloat(multiCBM[i].Lengths) *
              parseFloat(multiCBM[i].Width) *
              parseFloat(multiCBM[i].Height))) /
          6000;
        if (multiCBM[i].GrossWt > parseFloat(decVolumeWeight)) {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: parseFloat(multiCBM[i].GrossWt).toFixed(2)
          };
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: parseFloat(decVolumeWeight.toFixed(2))
          };
        }
      }
    } else {
      debugger;
      if (
        this.state.ContainerLoad === "FCL" ||
        this.state.ContainerLoad === "FTL"
      ) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["Volume"]: 0
        };
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
    }

    this.setState({ multiCBM });
  }

  CreateMultiCBM() {
    debugger;
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
        this.state.ContainerLoad !== "FTL" ? (
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
              name="Lengths"
              value={this.state.isCopy == true ? el.Lengths : el.Lengths || ""}
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
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="Height"
              value={this.state.isCopy == true ? el.Height : el.Height || ""}
              //onBlur={this.cbmChange}
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
              value={
                this.state.isCopy == true
                  ? el.GrossWeight
                  : el.GrossWeight || ""
              }
              className="w-100"
            />
          </div>
        </div>
        {this.state.ContainerLoad !== "FCL" &&
        this.state.ContainerLoad !== "FTL" ? (
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
        ) : (
          ""
        )}{" "}
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
    debugger;
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
          Volume: 0
        }
      ]
    }));
  }

  removeMultiCBM(i) {
    debugger;
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
  }

  // ------------------------For FCL ----------------
  CreateFCLMultiCBM() {
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
              name="Lengths"
              value={this.state.isCopy == true ? el.Lengths : el.Lengths || ""}
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
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="Height"
              value={this.state.isCopy == true ? el.Height : el.Height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "GW(Kg)" : "GW(Kg)"}
              name="GrossWt"
              value={this.state.isCopy == true ? el.GrossWt : el.GrossWt || ""}
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
                onClick={this.removeMultiCBM.bind(this, i)}
              ></i>
            </div>
          </div>
        ) : null}
      </div>
    ));
  }

  removeFCLMultiCBM(i) {
    debugger;
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
  }

  addFCLMultiCBM() {
    debugger;
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
          Volume: 0
        }
      ]
    }));
  }
  SubmitCargoDetails(e) {
    var data = this.state.multiCBM;
    var multiCBM = [];
    debugger;
    for (let i = 0; i < data.length; i++) {
      var cargoData = new Object();
      if (data[i].PackageType !== "") {
        cargoData.BookingPackID = data[i].BookingPackID || 0;
        cargoData.PackageType = data[i].PackageType || "";
        cargoData.Quantity = data[i].Quantity || 0;
        cargoData.Lengths = data[i].Lengths || 0;
        cargoData.Width = data[i].Width || 0;
        cargoData.Height = data[i].Height || 0;
        cargoData.GrossWt = data[i].GrossWt || 0;
        cargoData.VolumeWeight = data[i].VolumeWeight || 0;
        cargoData.Volume = data[i].Volume || 0;

        multiCBM.push(cargoData);
      }
    }

    this.setState({ multiCargo: multiCBM });
    this.toggleEdit();
  }

  toggleEdit(e) {
    if (!this.state.modalEdit) {
      debugger;

      var multiCBM = this.state.multiCargo;

      this.setState({ multiCBM });
    } else {
    }

    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  HandleDocumentDelete(e, row) {
    debugger;
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
        // data:  {Mode:param.Type, SalesQuoteNumber:param.Quotes},
        data: documentData,
        headers: authHeader()
      }).then(function(response) {
        debugger;
        NotificationManager.success(response.data.Table[0].Result);
        if (
          response.data.Table[0].Result === "Docuement deleted successfully"
        ) {
          var FileData = self.state.FileData;
          FileData.splice(row.index);
        }
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
  handleChangePage() {
    window.history.back();
  }
  render() {
    const { Booking } = this.state;
    console.log(this.state.ContainerLoad);
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
    var colClassName = "";
    if (localStorage.getItem("isColepse")==="true") {
      debugger;
      colClassName = "cls-flside colap";
    } else {
      debugger;
      colClassName = "cls-flside";
    }
    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>
                {this.state.copy === true
                  ? "Booking Clone"
                  : this.state.BookingNo !== "" && this.state.isView === true
                  ? "Update Booking"
                  : this.state.BookingNo !== "" && this.state.isView === true
                  ? "Booking Details " + this.state.newloding === true
                    ? ""
                    : bNumber
                  : ""}
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
                                    } else if (
                                      mode == "Air" ||
                                      (mode == "AIR" && lname !== "")
                                    ) {
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
                                      this.state.Booking[0].CargoType ===
                                        "LCL" ||
                                      this.state.Booking[0].CargoType ===
                                        "FCL" ||
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
                                    if (
                                      this.state.Booking[0].CargoType ===
                                        "LCL" ||
                                      this.state.Booking[0].CargoType ===
                                        "FCL" ||
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
                                  filterable: true
                                  // minWidth: 80
                                },

                                {
                                  accessor: "ContainerType",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">
                                          Container
                                        </p>
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
                                          <p className="details-para">
                                            {row.original.TransitTime}
                                          </p>
                                        )}
                                      </>
                                    );
                                  },
                                  accessor: "TransitTime"
                                  // minWidth: 60
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
                                      x.SaleQuoteID ===
                                        row.original.SaleQuoteID1 ||
                                      row.original.SaleQuoteID
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
                                {/* {Booking.length > 0 ? Booking[0].CargoType : null} */}
                                {this.state.ContainerLoad !== ""
                                  ? this.state.ContainerLoad
                                  : ""}
                              </p>
                            </div>
                            {this.state.ContainerLoad == "FCL" ? (
                              <>
                                <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                                  <p className="details-title">
                                    Equipment Types
                                  </p>
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
                            {this.state.ContainerLoad === "LCL" ||
                            this.state.ContainerLoad === "AIR" ||
                            this.state.ContainerLoad === "LTL" ? (
                              <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                                <p className="details-title">Unstackable</p>
                                <p className="details-para">
                                  {/* {this.state.EquipmentTypes} */}
                                  {this.state.Unstackable === 0 ? "No" : "Yes"}
                                </p>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
                              <p className="details-title">Inco Terms</p>
                              <p className="details-para">
                                {this.state.IncoTerm}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-3 r-border">
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
                        <div
                          className="title-border title-border-t py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Customer Details</h3>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 r-border">
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
                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {/* {Booking.length > 0
                                ? Booking[0].Company_Address
                                : ""} */}
                                {this.state.Company_Address}
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">
                                Notification Person
                              </p>
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
                        <div
                          style={{ marginBottom: "15px" }}
                          className="title-border title-border-t py-3 remember-forgot book-ins-sect rate-checkbox"
                        >
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
                            Consignee
                          </label>
                        </div>
                        <div>
                          {this.state.isConshinee === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields divblock r-border">
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

                              <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                                <p className="details-title">Address</p>
                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Consignee"
                                  )}
                                  value={this.state.Conshinee_AddressID}
                                >
                                  <option>Select</option>

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
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 r-border">
                                  <p className="details-title">
                                    Consignee Name
                                  </p>

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
                        <div
                          style={{ marginBottom: "15px" }}
                          className="title-border title-border-t py-3 remember-forgot book-ins-sect rate-checkbox"
                        >
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
                              Shipper
                            </label>
                          </div>
                        </div>
                        <div>
                          {this.state.isShipper === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields divblock r-border">
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

                              <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Shipper"
                                  )}
                                  value={this.state.Shipper_AddressID}
                                >
                                  <option>Select</option>

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
                                <div className="col-12 col-sm-6 col-md-4 r-border">
                                  <p className="details-title">Shipper Name</p>

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
                          )}{" "}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{ marginBottom: "15px" }}
                          className="title-border title-border-t py-3 remember-forgot book-ins-sect rate-checkbox"
                        >
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
                            Buyer
                          </label>
                        </div>
                        <div>
                          {this.state.isBuyer === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields divblock r-border">
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
                              <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Buyer"
                                  )}
                                  value={this.state.Buyer_AddressID}
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
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 r-border">
                                  <p className="details-title">Buyer Name</p>

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
                        <div
                          style={{ marginBottom: "15px" }}
                          className="title-border title-border-t py-3 remember-forgot book-ins-sect rate-checkbox"
                        >
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
                            Notify
                          </label>
                        </div>
                        <div>
                          {this.state.isNotify === false ? (
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-4 login-fields divblock r-border">
                                <p className="details-title">
                                  Notify Party Name
                                </p>
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
                              <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                                <p className="details-title">Address</p>

                                <select
                                  onChange={this.AddressChange.bind(
                                    this,
                                    "Notify"
                                  )}
                                  value={this.state.Notify_AddressID}
                                >
                                  <option>Select</option>

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
                          ) : (
                            <div className="">
                              <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 r-border">
                                  <p className="details-title">
                                    Notify Party Name
                                  </p>

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
                          className="title-border title-border-t py-3"
                          style={{ width: "100%", marginBottom: "15px" }}
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
                        {this.state.eqmtType.length > 0 ? "" : null}
                        {this.state.multiCargo.length > 0 ? (
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
                                    Header: "Volume Weight",
                                    accessor: "VolumeWeight"
                                  }
                                ]
                              }
                            ]}
                            data={this.state.multiCargo}
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
                                              style={{
                                                cursor: "pointer"
                                              }}
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
                                              style={{
                                                cursor: "pointer"
                                              }}
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
                                        <></>
                                        // <div className="action-cntr">
                                        //   <a
                                        //     onClick={e =>
                                        //       this.HandleDocumentDelete(e, row)
                                        //     }
                                        //   >
                                        //     <img
                                        //       title={"Delete"}
                                        //       style={{
                                        //         cursor: "pointer"
                                        //       }}
                                        //       className="actionicon"
                                        //       F
                                        //       src={Delete}
                                        //       alt="download-icon"
                                        //     />
                                        //   </a>
                                        // </div>
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
                        {/* {this.state.FileData.length > 0
                        ? this.CreateFileElement()
                        : null} */}
                      </div>

                      <center>
                        <button
                          disabled={this.state.loding === true ? true : false}
                          onClick={
                            this.state.copy === true
                              ? this.HandleBookigClone.bind(this)
                              : this.HandleBookingUpdate.bind(this)
                          }
                          className="butn more-padd mt-4"
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
                              {this.state.copy === true
                                ? "Booking Clone"
                                : this.state.BookingNo !== ""
                                ? "Update Booking"
                                : ""}
                            </>
                          )}
                        </button>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            )}{" "}
          </div>
        </div>
        <NotificationContainer leaveTimeout="3000" />
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
                {this.state.containerLoadType === "FCL"
                  ? ""
                  : this.state.containerLoadType === "FTL"
                  ? ""
                  : this.CreateMultiCBM()}
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

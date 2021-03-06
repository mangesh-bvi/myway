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
import { withRouter } from "react-router";
import { encryption } from "../helpers/encryption";
import PDF from "./../assets/img/pdf.png";
const imageAsset = "./../assets/img";
const fetch = require("node-fetch");

var QuotationData = [];
class BookingView extends Component {
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
      selectedCommodity: 0,
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
      Incoterm: "",
      companyID: 0,
      contact_name: "",
      company_name: "",
      Company_Address: "",
      HAZMAT: 0,
      eqtType: "",
      NonStackable: 0,
      Customs_Clearance: 0,
      loding: false,
      BookingNostr: "",
      Status: ""
    };
  }

  componentDidUpdate() {
    if (this.props.location.state) {
      var status = this.props.location.state.status;
      if (status) {
        if (this.state.status !== status) {
          this.setState({ status });
          setTimeout(() => {
            this.HandleBookingList();
          }, 100);
        }
      }
    } else {
    }
  }

  componentDidMount() {
    if (this.props.location.state.BookingNo && this.props.location.state.Mode) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      var BookingNo = this.props.location.state.BookingNo;
      var ModeofTransport = this.props.location.state.Mode;
      var isView = this.props.location.state.isView;
      var BookingNostr = this.props.location.state.BookingNostr;
      var Status = this.props.location.state.Status;

      if (isView) {
        this.setState({
          BookingNostr,
          BookingNo,
          userType,
          isView: true,
          ModeofTransport: ModeofTransport,
          Status: Status
        });
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
    } else {
      if (this.props.location.state.bookingNo) {
        var userType = encryption(
          window.localStorage.getItem("usertype"),
          "desc"
        );
        var BookingNo = this.props.location.state.bookingNo;
        var ModeofTransport = this.props.location.state.Mode;
        var BookingNostr = this.props.location.state.BookingNostr;
        this.setState({
          BookingNo,
          userType,
          isView: true,
          BookingNostr
        });
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
      } else {
        this.props.history.push("/booking-table");
      }
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
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerList`,
        data: {
          CustomerName: customerName,
          CustomerType: "Existing",
          MyWayUserID: userId
        },
        headers: authHeader()
      }).then(function(response) {
        if (response.data.Table > 0) {
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
        }
      });
    } else {
      this.setState({
        fields
      });
    }
  }

  handleSelectCon(e, field, value, id) {
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
      self.setState({ commodityData });
    });
  }
  onDocumentChangeHandler = event => {
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

  ////this methos for bookig details BookigGridDetailsList
  BookigGridDetailsList() {
    this.setState({ loding: true });
    let self = this;
    var bookingId = self.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    if (bookingId !== "" && bookingId !== null) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/BookigGridDetailsList`,
        data: {
          UserID: userId,
          BookingID: bookingId
        },
        headers: authHeader()
      }).then(function(response) {
        QuotationData = response.data.Table4;
        var QuotationSubData = response.data.Table5;
        var Booking = response.data.Table;
        var CargoDetails = response.data.Table2;
        var FileData = response.data.Table3;
        var eqmtType = response.data.Table1;
        var Table6 = response.data.Table6;
        var Company_Address = "";
        var contact_name = "";
        var company_name = "";
        var HAZMAT = 0;
        var ShipmentType = "";
        var eqtType = "";
        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            ShipmentType = QuotationData[0].ShipmentType;
            Company_Address = QuotationData[0].Company_Address;
            contact_name = QuotationData[0].contact_name;
            company_name = QuotationData[0].company_name;
            HAZMAT = QuotationData[0].HAZMAT;
            if (QuotationData.length === 1) {
              eqtType = QuotationData[0].ContainerType;
            } else {
              for (let i = 0; i < QuotationData.length; i++) {
                eqtType = eqtType + QuotationData[i].ContainerType + ",";
              }
            }
            self.setState({
              loding: false,
              QuotationData,
              QuotationSubData,
              ShipmentType,
              Company_Address,
              contact_name,
              company_name,
              HAZMAT,
              eqtType
            });
          }
        }

        if (typeof eqmtType !== "undefined") {
          if (eqmtType.length > 0) {
            self.setState({ eqmtType });
          }
        }
        if (typeof Booking !== "undefined") {
          var TypeofMove = "";
          if (Booking.length > 0) {
            if (Booking[0].typeofMove === 1) {
              TypeofMove = "Port To Port";
            }
            if (Booking[0].typeofMove === 2) {
              TypeofMove = "Door To Port";
            }
            if (Booking[0].typeofMove === 3) {
              TypeofMove = "Port To Door";
            }
            if (Booking[0].typeofMove === 4) {
              TypeofMove = "Door To Door";
            }

            var NotifyID = Booking[0].NotifyID;
            var Notify_AddressID = Booking[0].Notify_AddressID;
            var Notify_Displayas = Booking[0].Notify_Displayas;
            var NotifyName = Booking[0].NotifyName;

            var BuyerID = Booking[0].BuyerID;
            var Buyer_AddressID = Booking[0].Buyer_AddressID;
            var Buyer_Displayas = Booking[0].Buyer_Displayas;
            var BuyerName = Booking[0].Buyer_Name;

            var ShipperID = Booking[0].ShipperID;
            var Shipper_AddressID = Booking[0].Shipper_AddressID;
            var Shipper_Displayas = Booking[0].Shipper_Displayas;
            var Shipper_Name = Booking[0].Shipper_Name;

            var Consignee = Booking[0].Consignee;
            var Consignee_AddressID = Booking[0].Consignee_AddressID;
            var Consignee_Displayas = Booking[0].Consignee_Displayas;
            var Consignee_Name = Booking[0].Consignee_Name;

            var CargoType = Booking[0].CargoType;

            var strBooking_No = Booking[0].strBooking_No;
            var ModeofTransport = Booking[0].ModeofTransport;

            var DefaultEntityTypeID = Booking[0].DefaultEntityTypeID;
            var companyID = 0;
            var CompanyAddress = "";
            var Company_Name = "";
            var Company_AddressID = 0;
            if (DefaultEntityTypeID === ShipperID) {
              companyID = ShipperID;
              CompanyAddress = Shipper_Displayas;
              Company_Name = Shipper_Name;
              Company_AddressID = Shipper_AddressID;
            }
            if (DefaultEntityTypeID === BuyerID) {
              companyID = BuyerID;
              CompanyAddress = Buyer_Displayas;
              Company_Name = BuyerName;
              Company_AddressID = Buyer_AddressID;
            }

            if (DefaultEntityTypeID === Consignee) {
              companyID = Consignee;
              CompanyAddress = Consignee_Displayas;
              Company_Name = Consignee_Name;
              Company_AddressID = Consignee_AddressID;
            }

            if (DefaultEntityTypeID === NotifyID) {
              companyID = NotifyID;
              CompanyAddress = Notify_Displayas;
              Company_Name = NotifyName;
              Company_AddressID = Notify_AddressID;
            }
            self.setState({
              loding: false,
              DefaultEntityTypeID,
              companyID,
              CompanyAddress,
              Company_Name,
              Company_AddressID,
              ModeofTransport,
              multiCBM: CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,
              NotifyID,
              Notify_AddressID,
              Notify_Displayas,
              NotifyName,
              BuyerID,
              Buyer_AddressID,
              Buyer_Displayas,
              BuyerName,
              TypeofMove,
              POL: Booking[0].POL,
              POD: Booking[0].POD,
              ShipperID,
              Shipper_AddressID,
              Shipper_Displayas,
              Shipper_Name,
              Consignee,
              Consignee_AddressID,
              Consignee_Displayas,
              Consignee_Name,
              CargoType,

              strBooking_No,
              fields: {
                Consignee: Booking[0].Consignee_Name,
                Shipper: Booking[0].Shipper_Name
              }
            });
          }

          if (FileData.length > 0) {
            self.setState({ FileData });
          } else {
            self.setState({ FileData: [{ FileName: "No File Found" }] });
          }
        }

        if (Table6.length > 0) {
          var companyID = 0;
          var Incoterm = "";
          var Customs_Clearance = Table6[0].Customs_Clearance;
          if (Table6[0].contact_name) {
            Company_Address = Table6[0].Company_Address;
            contact_name = Table6[0].contact_name;
            company_name = Table6[0].company_name;
          } else {
            var companyID = Table6[0].CompanyID;
            Company_Address = Table6[0].Company_Address;
            contact_name = Table6[0].ContactName;
            company_name = Table6[0].CompanyName;
          }
          ShipmentType = Table6[0].ShipmentType;
          HAZMAT = Table6[0].HAZMAT;
          Incoterm = Table6[0].IncoTerm;
          self.setState({
            Incoterm,
            Customs_Clearance,
            companyID,
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
  ////Get Booking Details list AIR
  BookigGridDetailsListAIR() {
    this.setState({ loding: true });
    let self = this;
    var bookingId = self.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    if (bookingId !== "" && bookingId !== null) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/BookigGridDetailsList`,
        data: {
          UserID: userId,
          BookingID: bookingId
        },
        headers: authHeader()
      }).then(function(response) {
        QuotationData = response.data.Table4;
        var QuotationSubData = response.data.Table5;
        var Booking = response.data.Table;
        var CargoDetails = response.data.Table2;
        var FileData = response.data.Table3;
        var eqmtType = response.data.Table1;
        var Table6 = response.data.Table6;
        var Company_Address = "";
        var contact_name = "";
        var company_name = "";
        var HAZMAT = 0;
        var ShipmentType = "";
        var eqtType = "";
        var NonStackable = 0;

        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            ShipmentType = QuotationData[0].ShipmentType;
            Company_Address = QuotationData[0].Company_Address;
            contact_name = QuotationData[0].contact_name;
            company_name = QuotationData[0].company_name;
            if (QuotationData.length === 1) {
              eqtType = QuotationData[0].ContainerType;
            } else {
              for (let i = 0; i < QuotationData.length; i++) {
                eqtType = eqtType + QuotationData[i].ContainerType + ",";
              }
            }
            self.setState({
              QuotationData,
              QuotationSubData,
              ShipmentType,
              Company_Address,
              contact_name,
              company_name,
              eqtType
            });
          }
        }

        if (typeof eqmtType !== "undefined") {
          if (eqmtType.length > 0) {
            self.setState({ eqmtType });
          }
        }
        if (typeof Booking !== "undefined") {
          var TypeofMove = "";
          if (Booking.length > 0) {
            if (Booking[0].typeofMove === 1) {
              TypeofMove = "Port To Port";
            }
            if (Booking[0].typeofMove === 2) {
              TypeofMove = "Door To Port";
            }
            if (Booking[0].typeofMove === 3) {
              TypeofMove = "Port To Door";
            }
            if (Booking[0].typeofMove === 4) {
              TypeofMove = "Door To Door";
            }

            var NotifyID = Booking[0].NotifyID;
            var Notify_AddressID = Booking[0].Notify_AddressID;
            var Notify_Displayas = Booking[0].Notify_Displayas;
            var NotifyName = Booking[0].NotifyName;

            var BuyerID = Booking[0].BuyerID;
            var Buyer_AddressID = Booking[0].Buyer_AddressID;
            var Buyer_Displayas = Booking[0].Buyer_Displayas;
            var BuyerName = Booking[0].Buyer_Name;

            var ShipperID = Booking[0].ShipperID;
            var Shipper_AddressID = Booking[0].Shipper_AddressID;
            var Shipper_Displayas = Booking[0].Shipper_Displayas;
            var Shipper_Name = Booking[0].Shipper_Name;

            var Consignee = Booking[0].Consignee;
            var Consignee_AddressID = Booking[0].Consignee_AddressID;
            var Consignee_Displayas = Booking[0].Consignee_Displayas;
            var Consignee_Name = Booking[0].Consignee_Name;
            var CargoType = Booking[0].CargoType;

            var strBooking_No = Booking[0].strBooking_No;
            var ModeofTransport = Booking[0].ModeofTransport;

            var DefaultEntityTypeID = Booking[0].DefaultEntityTypeID;

            self.setState({
              loding: false,
              DefaultEntityTypeID,
              ModeofTransport,
              multiCBM: CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,
              NotifyID,
              Notify_AddressID,
              Notify_Displayas,
              NotifyName,
              BuyerID,
              Buyer_AddressID,
              Buyer_Displayas,
              BuyerName,
              TypeofMove,
              POL: Booking[0].POL,
              POD: Booking[0].POD,
              ShipperID,
              Shipper_AddressID,
              Shipper_Displayas,
              Shipper_Name,
              Consignee,
              Consignee_AddressID,
              Consignee_Displayas,
              Consignee_Name,
              CargoType,

              strBooking_No,
              fields: {
                Consignee: Booking[0].Consignee_Name,
                Shipper: Booking[0].Shipper_Name
              }
            });
          }

          if (FileData.length > 0) {
            self.setState({ FileData });
          } else {
            self.setState({ FileData: [{ FileName: "No File Found" }] });
          }
        }
        if (Table6.length > 0) {
          var Customs_Clearance = Table6[0].Customs_Clearance;
          Company_Address = Table6[0].Company_Address;
          contact_name = Table6[0].contact_name;
          company_name = Table6[0].company_name;
          ShipmentType = Table6[0].ShipmentType;
          HAZMAT = Table6[0].HAZMAT;
          NonStackable = Table6[0].NonStackable;
          var Incoterm = Table6[0].IncoTerm;
          self.setState({
            Incoterm,
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
  ////Handle to Download Booking Document
  HandleBookingDocDwonload(filePath) {
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
    });
  }

  ////this method for multiple file element create
  CreateFileElement() {
    return this.state.FileData.map((el, i) => (
      <div key={i}>
        <span
          onClick={e => {
            this.HandleBookingDocDwonload(el.FilePath);
          }}
        >
          <p className="file-name book-view-file mt-2">{el.FileName}</p>
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
  ////Hanlde Click back button
  handleChangePage() {
    window.history.back();
  }

  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }

  render() {
    var commodityName = "";
    if (this.state.selectedCommodity !== 0) {
      commodityName = this.state.commodityData.filter(
        x => x.id === this.state.selectedCommodity
      )[0].Commodity;
    }
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
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>
                {this.state.loding === true
                  ? "Booking View"
                  : "Booking View " + this.state.BookingNostr + " "}
              </h2>
              <h2>{this.state.Status}</h2>
              <button
                onClick={this.handleChangePage.bind(this)}
                className="butn mt-0"
              >
                Back
              </button>
            </div>
            {this.state.loding === true ? (
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
                                  accessor: "lineName"
                                  // minWidth: 200
                                },
                                {
                                  accessor: "POL",
                                  Cell: row => {
                                    if (
                                      this.state.ModeofTransport === "inland"
                                    ) {
                                      return (
                                        <React.Fragment>
                                          <p className="details-title">POL</p>
                                          <p className="details-para max2">
                                            {row.original.OriginName}
                                          </p>
                                        </React.Fragment>
                                      );
                                    } else {
                                      return (
                                        <React.Fragment>
                                          <p className="details-title">POL</p>
                                          <p className="details-para max2">
                                            {row.original.POL}
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
                                      this.state.ModeofTransport === "inland"
                                    ) {
                                      return (
                                        <React.Fragment>
                                          <p className="details-title">POD</p>
                                          <p className="details-para max2">
                                            {row.original.DestinationName}
                                          </p>
                                        </React.Fragment>
                                      );
                                    } else {
                                      return (
                                        <React.Fragment>
                                          <p className="details-title">POD</p>
                                          <p className="details-para max2">
                                            {row.original.POD}
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
                                          Transit port
                                        </p>
                                        <p className="details-para max2">
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
                                        <p className="details-para max2"></p>
                                      </>
                                    );
                                  },
                                  accessor: "freeTime",
                                  filterable: true
                                  // minWidth: 80
                                },
                                {
                                  Cell: row => {
                                    var header = "";
                                    var value = "";
                                    if (this.state.CargoType == "FCL") {
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
                                    } else if (this.state.CargoType == "LCL") {
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
                                        <p className="details-para max2">{value}</p>
                                      </>
                                    );
                                  },
                                  accessor: "ContainerType",
                                  filterable: true
                                  //minWidth: 175
                                },
                                {
                                  accessor: "ExpiryDate",
                                  Cell: row => {
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">Expiry</p>
                                        <p className="details-para max2">
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
                                          <p className="details-para max2">
                                            {row.original.TransitTime}
                                          </p>
                                        ) : (
                                          <p className="details-para max2">
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
                                    var Totalamount = parseFloat(
                                      row.original.Total.split(" ")[0]
                                    );
                                    var curency = row.original.Total.split(
                                      " "
                                    )[1];
                                    return (
                                      <React.Fragment>
                                        <p className="details-title">Price</p>
                                        <p className="details-para max2">
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
                                          Header: "Tax",
                                          accessor: "Tax"
                                        },
                                        {
                                          Header: "ExRate",
                                          accessor: "ExRate"
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
                                {this.state.CargoType}
                              </p>
                            </div>
                            {this.state.CargoType === "FCL" ? (
                              <>
                                <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                  <p className="details-title">
                                    Equipment Types
                                  </p>
                                  <p className="details-para">
                                    {this.state.eqtType}
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
                                {this.state.HAZMAT === 1
                                  ? "Yes"
                                  : this.state.HAZMAT === 0
                                  ? "No"
                                  : ""}
                              </p>
                            </div>
                            {this.state.CargoType === "FCL" ||
                            this.state.CargoType === "FTL" ? (
                              ""
                            ) : (
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">Unstackable</p>
                                <p className="details-para">
                                  {this.state.NonStackable === 0 ? "No" : "Yes"}
                                </p>
                              </div>
                            )}
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Customs Clearance</p>
                              <p className="details-para">
                                {this.state.Customs_Clearance === 1
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Inco Terms</p>
                              <p className="details-para">
                                {this.state.Incoterm}
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

                      <div>
                        {this.state.isInsert === true ? (
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
                        ) : null}
                      </div>
                      <div>
                        <div
                          className="title-border title-border-t py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Consignee Details</h3>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Consignee Name</p>
                              <p className="details-para">
                                {this.state.fields["Consignee"]}
                              </p>
                            </div>

                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.Consignee_Displayas}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className="title-border title-border-t py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Shipper Details</h3>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Shipper Name</p>
                              <p className="details-para">
                                {this.state.fields["Shipper"]}
                              </p>
                            </div>

                            <div className="col-12 col-sm-6 col-md-4 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.Shipper_Displayas}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          className="title-border title-border-t py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Buyer Details</h3>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Buyer Name</p>
                              <p className="details-para">
                                {this.state.BuyerName}
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.Buyer_Displayas !== ""
                                  ? this.state.Buyer_Displayas
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          className="title-border title-border-t py-3"
                          style={{ marginBottom: "15px" }}
                        >
                          <h3>Notify Party Details</h3>
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Notify Party Name</p>
                              <p className="details-para">
                                {this.state.NotifyName}
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.Notify_Displayas !== ""
                                  ? this.state.Notify_Displayas
                                  : null}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 login-fields r-border">
                          <p className="details-title">Commodity</p>
                          <p className="details-para">{commodityName}</p>
                        </div>
                      </div>
                      <div>
                        <div
                          className="title-border title-border-t py-3"
                          style={{ width: "100%" }}
                        >
                          <h3>Cargo Details</h3>
                        </div>
                      </div>
                      <div className="row ratefinalpgn">
                        {this.state.eqmtType.length > 0 ? "" : null}
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
                                    accessor: "GrossWt"
                                  },
                                  {
                                    Header: "Volume Weight",
                                    accessor: "VolumeWeight",
                                    show:
                                      this.state.CargoType !== "LCL"
                                        ? true
                                        : false
                                  },
                                  {
                                    Header: "Volume",
                                    accessor: "Volume",
                                    show:
                                      this.state.CargoType == "LCL"
                                        ? true
                                        : false
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

                      <div>
                        <div
                          className="title-border-t py-3"
                          style={{ width: "100%" }}
                        >
                          <h3>Documents</h3>
                        </div>
                      </div>
                      <div className="rename-cntr login-fields d-block">
                        <ReactTable
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "File name",
                                  accessor: "FileName",
                                  Cell: row => {
                                    if (
                                      row.original.FileName !== "No File Found"
                                    ) {
                                      return (
                                        <div>
                                          <img
                                            src={PDF}
                                            alt="PDF icon"
                                            className="cls-pdf"
                                          />
                                          {row.original.FileName}
                                        </div>
                                      );
                                    } else {
                                      return <>{row.original.FileName}</>;
                                    }
                                  }
                                },

                                {
                                  Header: "Action",
                                  Cell: row => {
                                    if (
                                      row.original.FilePath !== "" &&
                                      row.original.FileName !== "No File Found"
                                    ) {
                                      return (
                                        <div className="action-cntr">
                                          <a
                                            onClick={e =>
                                              this.HandleBookingDocDwonload(
                                                row.original.FilePath
                                              )
                                            }
                                          >
                                            <img
                                              style={{
                                                cursor: "pointer"
                                              }}
                                              className="actionicon"
                                              src={Download}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(BookingView);

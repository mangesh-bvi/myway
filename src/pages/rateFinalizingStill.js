import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import FileUpload from "./../assets/img/file.png";
import ReactTable from "react-table";
import { Button, Modal, ModalBody } from "reactstrap";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { encryption } from "../helpers/encryption";
import ATA from "./../assets/img/ATAFreight_console.png";
import Download from "./../assets/img/csv.png";
import Delete from "./../assets/img/red-delete-icon.png";
import PDF from "./../assets/img/pdf.png";
import moment from "moment";

import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class RateFinalizingStill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      RateDetails: [],
      SubRateDetails: [],
      toggleCustomerType: true,
      QuoteStatus: true,
      Bookingcreation: false,
      QuoteNumber: "",
      accountcustname: "",
      custAddress: "",
      custNotification: "",
      Contact_Email: "",
      Contact_Phone: "",
      ModeOfTransport: "",
      ShipmentType: "",
      ContainerLoad: "",
      EquipmentTypes: "",
      SpecialEquipment: "",
      HazMatUnstackable: "",
      IncoTerms: "",
      TypeofMove: "",
      CargoDetails: "",
      Commodity: ".FAK",
      CargoDetailsArr: [],
      QuoteNumber: "",
      selectedCommodity: "",
      packageTypeData: [],
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: "",
        },
      ],
      spacEqmtType: [],
      commodityData: [],
      multiCBM: [],
      referType: [],
      flattack_openTop: [],
      eqmtType: [],
      selectedFile: [],
      modalRejectPop: false,
      HazMat: "",
      isAcceptModal: false,
      isRejectModal: false,
      CustomClearance: 0,
      errorRejReson: "",
      modalPreview: false,
      todayDate: new Date(),
      filterrateSubDetails: [],
      DocumentDetails: [],
      SaleQuoteID: "",
      loding: true,
      btnloding: false,
      rtnloding: false,
      cbmVal: 0,
      RejectedReason: "",
      SalesPersonName: "",
      SalesPersonEmail: "",
      SalesPersonPhone: "",
      SalesPersonFax: "",
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleBook = this.toggleBook.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
  }

  componentDidMount() {
    if (
      encryption(window.localStorage.getItem("usertype"), "desc") != "Customer"
    ) {
      this.setState({ toggleCustomerType: false });
    }
    if (typeof this.props.location.state.detail != undefined) {
      var qData = this.props.location.state;
      this.HandleSalesQuoteView(qData);
      this.HandlePackgeTypeData();
      this.HandleCommodityDropdown();
    } else {
      this.props.history.push("quote-table");
    }
  }

  componentDidUpdate() {
    var QuoteNumber = this.state.QuoteNumber;
    if (QuoteNumber !== this.props.location.state.detail.Quotes) {
      var qData = this.props.location.state;
      this.HandleSalesQuoteView(qData);
      this.HandlePackgeTypeData();
      this.HandleCommodityDropdown();
    }
  }

  //////toggleAcceptModal method

  toggleAcceptModal = () => {
    this.setState({ isAcceptModal: !this.state.isAcceptModal });
  };

  //////toggleRejectModal method
  toggleRejectModal = () => {
    this.setState({ isRejectModal: !this.state.isRejectModal });
  };

  HandleSalesQuoteView(param) {
    var SalesQuoteNumber = param.detail.Quotes;
    var type = param.detail.Type;
    if (param.detail.Status != "Pending") {
      this.setState({ QuoteStatus: false });
    }
    if (param.detail.Status == "Approved") {
      this.setState({ Bookingcreation: true });
    }

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
        var RateDetails = response.data.Table1;
        var SubRateDetails = response.data.Table2;
        var multiCBM = response.data.Table3;
        var DocumentDetails = response.data.Table4;
        var TypeofMove = "";
        var IncoTerms = "";
        var CargoDetailsArr = [];
        var SaleQuoteID = "";
        var RejectedReason = "";
        var SalesPersonName = "";
        var SalesPersonEmail = "";
        var SalesPersonPhone = "";
        var SalesPersonFax = "";
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                TypeofMove = response.data.Table[0].TypeOfMove;
                IncoTerms = response.data.Table[0].IncoTerm;
                SaleQuoteID = response.data.Table[0].SaleQuoteID;
                RejectedReason = response.data.Table[0].RejectedReason;
                SalesPersonName = response.data.Table[0].SalesPersonName || "";
                SalesPersonEmail =
                  response.data.Table[0].SalesPersonEmail || "";
                SalesPersonPhone =
                  response.data.Table[0].SalesPersonPhone || "";
                SalesPersonFax = response.data.Table[0].SalesPersonFax || "";

                self.setState({
                  SalesPersonName,
                  SalesPersonEmail,
                  SalesPersonPhone,
                  SalesPersonFax,
                  RejectedReason,
                  loding: false,
                  SaleQuoteID,
                  HazMat: response.data.Table[0].HAZMAT,
                  accountcustname:
                    response.data.Table[0].CompanyName == undefined
                      ? response.data.Table[0].company_name
                      : response.data.Table[0].CompanyName,
                  custAddress: response.data.Table[0].Company_Address,
                  custNotification:
                    response.data.Table[0].ContactName == undefined
                      ? response.data.Table[0].contact_name
                      : response.data.Table[0].ContactName,
                  Contact_Email: response.data.Table[0].Contact_Email,

                  Contact_Phone: response.data.Table[0].Contact_Phone,

                  ModeOfTransport: response.data.Table[0].ModeOfTransport,
                  ShipmentType:
                    response.data.Table[0].ShipmentType == null
                      ? param.type == "LCL" || param.type == "FCL"
                        ? "Ocean"
                        : param.type == "AIR"
                        ? "AIR"
                        : param.type == "Inland"
                        ? "Inland"
                        : param.type
                      : response.data.Table[0].ShipmentType,
                  ContainerLoad: param.detail.Type,

                  SpecialEquipment: "",
                  HazMatUnstackable: "",
                  TypeofMove: TypeofMove,
                  IncoTerms: IncoTerms,
                  CustomClearance: response.data.Table[0].Customs_Clearance,
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
                self.setState({
                  IncoTerms: IncoTerms,
                  EquipmentTypes: response.data.Table1[0].ContainerCode,
                  Commodity: response.data.Table1[0].Commodity,
                  selectedCommodity: response.data.Table1[0].Commodity,
                });
              }
            }
            if (response.data.Table3 != null) {
              if (response.data.Table3.length > 0) {
                var table = response.data.Table3;
                for (var i = 0; i < table.length; i++) {
                  CargoDetailsArr.push({
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
                        : table[i].CBM || 0,
                    Volume: table[i].Volume || 0,
                    VolumeWeight: table[i].VolumeWeight || 0,
                    Editable: true,
                  });
                }
              } else {
                CargoDetailsArr.push({ Width: "No Data Found" });
              }
            } else {
              CargoDetailsArr.push({ Width: "No Data Found" });
            }
            self.setState({
              CargoDetailsArr: CargoDetailsArr,
            });
          }
        }
        self.setState({
          RateDetails: RateDetails,
          SubRateDetails: SubRateDetails,
          multiCBM: multiCBM,
          DocumentDetails: DocumentDetails,
        });
        if (response.data.Table4.length === 0) {
          self.setState({
            DocumentDetails: [{ FileName: "No File Found" }],
          });
        }
        self.forceUpdate();
        self.HandleSalesQuoteConditions();
      })
      .catch((error) => {
        self.setState({ loding: false });
      });
  }

  toggleBook(e) {
    e.stopPropagation();

    this.props.history.push({
      pathname: "/booking-insert",
      state: {
        ContainerLoad: this.state.ContainerLoad,
        salesQuotaNo: this.state.QuoteNumber,
      },
    });
  }
  toggleProfit() {
    this.setState((prevState) => ({
      modalProfit: !prevState.modalProfit,
    }));
  }
  toggleRequest() {
    this.setState((prevState) => ({
      modalRequest: !prevState.modalRequest,
    }));
  }
  onDocumentChangeHandler = (event) => {
    setTimeout(() => {
      this.onDocumentSaleQuoteHandler();
    }, 200);

    this.setState({
      selectedFileName: event.target.files[0].name,
      selectedFile: event.target.files[0],
    });
  };

  SendMail(action) {
    let self = this;
    // self.togglePreview();

    var stringHtmlMain = "";

    stringHtmlMain =
      "<!DOCTYPE html><html><head>     <style > body{ font - family:-apple - system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans - serif}.row{ display: flex; flex - wrap:wrap}.col - 12{ flex: 0 0 100 %; max - width:100 %}.col - md - 6{ flex: 0 0 50 %; max - width:50 %}.col - md - 4{ flex: 0 0 33.333333 %; max - width:33.333333 %}.popupbox{background: #f1f2f2;padding: 20px;} .bordernone {border:none;} .row {display: flex;} .col-md-6 {max-width: 50%;} .modal-body{background-color:#f1f2f2;padding:20px;position:relative;border-radius:0}.close{position:absolute;right:-8px;top:-12px;color:#333;font-weight:400;background:#fff !important;opacity:1 !important;border-radius:50%;width:25px;font-size:21px;font-weight:700}.logohheader{background:#fff;padding:5px;width:100%}.logohheader img{width:175px}.preview-date-num{}.preview-date-num p{font-size:14px;font-weight:600;color:#8f8f8f;margin:5px 0;}.preview-date-num p span{color:#333}.firstbox{background:#fff;padding:0 20px 0px;}.firstbox label{display:block;color:#8f8f8f;font-weight:600;margin:5px 0;font-size:14px}.firstbox label span{color:#333}.thirdbox{background:#fff;margin-bottom:0}.thirdbox h3{font-size:18px;font-weight:bold;text-align:center;padding:20px 20px 0;margin:0;margin-bottom:15px;color:#333;background:transparent}.thirdbox .table-responsive{display:table}.table-responsive{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table{width:100%;font-size:14px;width:100%;border-spacing:inherit;margin-bottom:0;color:#212529}.thirdbox table thead{background:#cbcbcb;font-size:12px}.thirdbox table tbody{font-size:12px}table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6;text-align:left}.table td,.table th{padding: .75rem;vertical-align:top}table tbody tr:last-child{border-bottom:0}table td{color:#696969;background-color:#fff;padding:12px}.secondbox{background:#fff;padding:20px;margin-bottom:0}.secondbox h3{font-size:18px;margin:0;font-weight:bold;padding:0;margin-bottom:15px;text-align:center;background:transparent;color:#333}hr{margin-top:7px;margin-bottom:5px;border:0;border-top:1px solid #ddd}table td{color:#696969;background-color:#fff;font-weight:600;padding:12px;font-size:14px}.table td,.table th{vertical-align:top}.secondbox label{display:block;color:#8f8f8f;margin:5px 0;font-weight:600;font-size:14px}.secondbox label span{color:#333}.mb-0{margin-bottom:0}.txt-right{text-align:right}</style></head><body> <div class='popupbox'>";
    var stringHtmlBody = document.getElementById("printDiv1").innerHTML;
    stringHtmlMain += stringHtmlBody;
    var stringHtmlEnd = "</div></body></html>";
    stringHtmlMain += stringHtmlEnd;
    stringHtmlMain = stringHtmlMain.replace("col-sm-6", "col-md-6");
    stringHtmlMain = stringHtmlMain.replace("col-sm-4", "col-md-4");
    stringHtmlMain = stringHtmlMain.replace(
      "alt='ATAFreight Console'>",
      "alt='ATAFreight Console'></img>"
    );

    // self.togglePreview();

    var inputParameter = {};
    inputParameter.SalesQuoteType = this.state.ContainerLoad;
    inputParameter.SalesQuoteNo = this.state.QuoteNumber;
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
            if (response.data.length > 0) {
              store.addNotification({
                // title: "Success",
                message: response.data,
                type: "success", // 'default', 'success', 'info', 'warning','danger'
                container: "top-right", // where to position the notifications
                dismiss: {
                  duration: appSettings.NotficationTime,
                },
              });
              self.setState({ btnloding: false });
              self.setState({ rbtnloding: false });
              setTimeout(() => {
                self.props.history.push("quote-table");
              }, appSettings.NotficationTime + 1000);
            }
          }
        }
      })
      .catch((error) => {
        var temperror = error.response.data;
        // var err = temperror.split(":");
        self.setState({ btnloding: false });
        self.setState({ rbtnloding: false });
        self.props.history.push("quote-table");
      });
  }
  ////sales quote Accept
  AcceptQuotes() {
    this.setState({ btnloding: true });

    let self = this;
    var SalesQuoteNumber = "";
    var QuoteType = "";
    if (typeof this.props.location.state != "undefined") {
      SalesQuoteNumber = this.props.location.state.detail.Quotes;
      QuoteType = this.props.location.state.detail.Type;
    } else {
      return false;
    }

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
                self.toggleAcceptModal();
                self.SendMail("Approve");
                // setTimeout(function() {
                //   window.location.href = "quote-table";
                // }, 1000);
              }
            }
          }
        }

        var Messagebody =
          "<html><body><table><tr><td>Hello Sir/Madam,</td><tr><tr><tr><tr><td>The Quotation is sent by our Sales Person Name.Request you to check the Quotation and share your approval for same.</td></tr><tr><td>To check and approve the quotation please click here.</td></tr></table></body></html>";
      })
      .catch((error) => {});
  }

  RejectQuotes() {
    let self = this;
    var SalesQuoteNumber = "";
    var QuoteType = "";
    if (typeof this.props.location.state != "undefined") {
      SalesQuoteNumber = this.props.location.state.detail.Quotes;
      QuoteType = this.props.location.state.detail.Type;
    } else {
      return false;
    }
    var RejectResontxt = document.getElementById("RejectResontxt").value;

    if (RejectResontxt !== "") {
      this.setState({ rbtnloding: true });
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SalesQuoteReject`,
        data: {
          Mode: QuoteType,
          SalesQuoteNumber: SalesQuoteNumber,
          isReject: 1,
          RejectReason: RejectResontxt,
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
                  self.toggleRejectModal();
                  var Messagebody =
                    "<html><body><table><tr><td>Hello Sir/Madam,</td><tr><tr><tr><tr><td>The Quotation is sent has been rejected</td></tr></table></body></html>";

                  self.SendMail("Reject");
                  // setTimeout(function() {
                  //   window.location.href = "quote-table";
                  // }, 5000);
                }
              }
            }
          }
        })
        .catch((error) => {
          var temperror = error.response.data;
          var err = temperror.split(":");
        });
    } else {
      var errorRejReson = "Please enter rejection reason";
      self.setState({
        errorRejReson: errorRejReson,
      });
    }
  }

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
              value={"" + el.Quantity || ""}
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
              value={"" + el.Length || ""}
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
              value={"" + el.height || ""}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.GrossWeight === 0 ? "GW (kg)" : "GW (kg)"}
              name="GrossWeight"
              value={"" + el.GrossWeight || ""}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md"></div>
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
        )}
      </div>
    ));
  }

  HandleChangeMultiCBM(i, e) {
    const { name, value } = e.target;

    let multiCBM = [...this.state.multiCBM];

    if ("PackageType" === name) {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value,
      };
    } else {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value !== "" ? Number(value) : "",
      };
    }

    this.setState({ multiCBM });
  }
  addMultiCBM() {
    this.setState((prevState) => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          GrossWeight: 0,
          Length: 0,
          NetWeight: 0,
          PackageType: null,
          Quantity: 0,
          SaleQuoteID: 0,
          SaleQuoteIDLineID: 0,
          Unit: "",
          Width: 0,
          height: 0,
        },
      ],
    }));
  }
  removeMultiCBM(type, i) {
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(type, 1);
    this.setState({ multiCBM });
  }

  ////End dynamic element

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
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
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
  //// start  spacEqmtType dyamanic element

  addSpacEqmtType(optionVal) {
    this.setState((prevState) => ({
      spacEqmtType: [
        ...prevState.spacEqmtType,
        {
          TypeName: optionVal[0].SpecialContainerCode,
          Quantity: 0,
        },
      ],
    }));
  }

  toggleRejectPop() {
    this.setState((prevState) => ({
      modalRejectPop: !prevState.modalRejectPop,
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spec-inner-cntr w-auto">
          <label name="TypeName">
            {el.TypeName} <span className="into-quant">X</span>
          </label>

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
      [name]: parseFloat(value),
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
    this.setState((prevState) => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          ContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 0,
          Temperature: 0,
          TemperatureType: "",
        },
      ],
    }));
  }

  onDocumentSaleQuoteHandler = () => {
    const docData = new FormData();
    var docName = this.state.selectedFileName;

    if (docName == "") {
      store.addNotification({
        // title: "Success",
        message: "Select File",
        type: "success", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });

      return false;
    }

    docData.append("QuoteID", this.state.RateDetails[0].SaleQuoteID);
    docData.append("DocumentID", 0);
    docData.append(
      "MywayUserID",
      encryption(window.localStorage.getItem("userid"), "desc")
    );
    docData.append("Mode", this.state.ContainerLoad);
    docData.append("SalesQuoteDoc", this.state.selectedFile);
    // docData.append()

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteFileUpload`,
      data: docData,
      headers: authHeader(),
    })
      .then(function (response) {
        store.addNotification({
          // title: "Success",
          message: response.data.Table[0].Result,
          type: "success", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      })
      .catch((error) => {
        store.addNotification({
          // title: "Success",
          message: error.response.data.split("'")[1],
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      });

    var qData = this.props.location.state;
    this.HandleSalesQuoteView(qData);
  };

  HandleDowloadFile = (e, item) => {
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DownloadFTPFile`,
      data: {
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        FilePath: item.original.FilePath,
      },
      responseType: "blob",
      headers: authHeader(),
    })
      .then(function (response) {
        if (response.data) {
          var blob = new Blob([response.data], { type: "application/pdf" });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = item.original.FileName;
          link.click();
        }
      })
      .catch((error) => {
        store.addNotification({
          // title: "Success",
          message: error.response.data.split("'")[1],
          type: "danger", // 'default', 'success', 'info', 'warning','danger'
          container: "top-right", // where to position the notifications
          dismiss: {
            duration: appSettings.NotficationTime,
          },
        });
      });
  };

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
      [name]: name === "TemperatureType" ? value : parseFloat(value),
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
    return this.state.flattack_openTop.map((el, i) => (
      <div className="row cbm-space" key={i}>
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
              name="height"
              value={el.height || ""}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={el.GrossWeight === 0 ? "GW (kg)" : "GW (kg)"}
              name="Gross_Weight"
              value={el.GrossWeight}
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

    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value,
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value),
      };
    }

    this.setState({ flattack_openTop });
    var decVolumeWeight =
      (flattack_openTop[i].Quantity *
        (flattack_openTop[i].length *
          flattack_openTop[i].Width *
          flattack_openTop[i].height)) /
      6000;
    if (decVolumeWeight > parseFloat(flattack_openTop[i].GrossWeight)) {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(decVolumeWeight),
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(flattack_openTop[i].GrossWeight),
      };
    }

    this.setState({ flattack_openTop });
  }
  addClickMultiCBM(optionsVal) {
    this.setState((prevState) => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          // SpecialContainerCode: optionsVal[0].SpecialContainerCode,
          PackageType: "",
          length: "",
          Width: "",
          height: "",
          Quantity: "",
          GrossWeight: "",
          total: "",
        },
      ],
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
      [name]: name === "ContainerCount" ? parseFloat(value) : 0,
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
    this.setState((prevState) => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: "",
        },
      ],
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
          : TruckTypeData[i].TruckDesc,
    };
    this.setState({ TruckTypeData });
  }
  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
  }

  togglePreview() {
    this.setState({ modalPreview: !this.state.modalPreview });
  }

  HandleSalesQuoteConditions() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteConditions`,
      data: {
        Mode: this.state.ContainerLoad,
        ShipmentType: this.state.ShipmentType,
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      },
      headers: authHeader(),
    }).then(function (response) {
      if (response.data.Table.length > 0) {
        self.setState({
          ConditionDesc: response.data.Table[0].conditionDesc
            .split("\n")
            .map((item, i) => <p key={i}>{item}</p>),
        });
      }
    });
  }
  //// End Truck Tyep Dynamic element
  // Shlok End working

  HandleDocumentDelete(e, row) {
    var MywayUserID = encryption(window.localStorage.getItem("userid"), "desc");
    var documentData = {
      QuoteID: row.original.QuoteID,
      DocumentID: row.original.DocumentID,
      MyWayUserID: MywayUserID,
    };

    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DeleteSalesQuotedocument`,
      data: documentData,
      headers: authHeader(),
    }).then(function (response) {
      store.addNotification({
        // title: "Success",
        message: response.data.Table[0].Result,
        type: "success", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime,
        },
      });

      setTimeout(() => {
        self.componentDidMount();
      }, 1000);
    });
  }
  handleChangePage() {
    window.history.back();
  }

  printModalPopUp() {
    var divToPrint = document.getElementById("printDiv");
    var newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(
      '<html><body onload="window.print()">' +
        divToPrint.innerHTML +
        "</body></html>"
    );
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 10);
  }

  onErrorImg(e) {
    return (e.target.src = appSettings.imageURL + "ATAFreight_console.png");
  }

  render() {
    var final = 0;
    if (this.state.RateDetails.length > 0) {
      final = this.state.RateDetails.reduce(function (prev, cur) {
        return (
          parseFloat(prev) + (parseFloat(cur.Total.split(" ")[0]) + cur.Profit)
        );
      }, 0);
    }

    

    var tDate = moment(this.state.todayDate).format("L");
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }
    let status;
    if (this.props.location.state) {
      status = this.props.location.state.detail.Status;
    }
    var DocumentCharges = [];
    var i = 0;
    const { CargoDetailsArr, DocumentDetails } = this.state;

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
              {(() => {
                return (
                  <h2>
                    Quotes Details{" "}
                    {this.state.loding === true ? "" : this.state.QuoteNumber}
                  </h2>
                );
              })()}

              <h2>{this.state.loding === true ? "" : status}</h2>
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
              <>
                <div className="row">
                  <div className="col-md-12 ra-font">
                    <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                      <div className="rate-final-contr">
                        <div className="title-border d-flex align-items-center justify-content-between py-3">
                          <h3>Quotation Price</h3>
                          <div>
                            {this.state.QuoteStatus && (
                              <button
                                className="butn m-0 mr-3"
                                onClick={this.toggleAcceptModal}
                              >
                                Accept
                              </button>
                            )}

                            {this.state.QuoteStatus && (
                              <button
                                className="butn m-0"
                                onClick={this.toggleRejectModal}
                              >
                                Reject
                              </button>
                            )}
                          </div>
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
                                      var mode = this.state.ModeOfTransport;

                                      if (mode === "Ocean" && lname !== "") {
                                        var url = "";
                                        if (this.state.ContainerLoad == "LCL") {
                                          url =
                                            appSettings.imageURL +
                                            "ATAFreight_console.png";
                                        } else {
                                          url =
                                            appSettings.imageURL +
                                            "OEAN_LINERS/" +
                                            lname;
                                        }
                                        return (
                                          <React.Fragment>
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
                                    accessor: "lineName",
                                  },
                                  {
                                    Cell: (row) => {
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

                                    filterable: true,
                                  },
                                  {
                                    Cell: (row) => {
                                      return (
                                        <>
                                          <p className="details-title">POD</p>
                                          {this.state.ContainerLoad ===
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
                                    filterable: true,
                                  },
                                  {
                                    Cell: (row) => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            Transit Port
                                          </p>
                                          {this.state.ContainerLoad !==
                                          "INLAND" ? (
                                            <p className="details-para">
                                              {row.original.TransshipmentPort}
                                            </p>
                                          ) : (
                                            <p className="details-para"></p>
                                          )}
                                        </>
                                      );
                                    },
                                    accessor: "TransshipmentPort",
                                    filterable: true,
                                    minWidth: 160,
                                  },
                                  {
                                    Cell: (row) => {
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
                                    minWidth: 90,
                                  },

                                  {
                                    Cell: (row) => {
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
                                        header = "C.W";
                                        if (row.original["ChgWeight"]) {
                                          value = row.original["ChgWeight"];
                                        }
                                      } else {
                                        header = "C.W";
                                        if (row.original["ChgWeight"]) {
                                          value = row.original["ChgWeight"];
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
                                    accessor: "TransitTime",
                                  },
                                  {
                                    Cell: (row) => {
                                      if (
                                        row.original.Total !== "" &&
                                        row.original.Total !== null &&
                                        row.original.Total !== undefined
                                      ) {
                                        var total = row.original.Total;
                                        var remo = total.substring(
                                          total.indexOf(" ") + 1
                                        );
                                        var final =
                                          parseFloat(
                                            total.replace(remo, "")
                                          ).toFixed(2) +
                                          " " +
                                          remo;
                                      }
                                      var total =
                                        parseFloat(
                                          row.original.Total.split(" ")[0]
                                        );
                                      // var total =
                                      //   parseFloat(
                                      //     row.original.Total.split(" ")[0]
                                      //   ) + (row.original.Profit || 0);
                                      var base = row.original.Total.split(
                                        " "
                                      )[1];
                                      var totalAmount = total + " " + base;

                                      return (
                                        <>
                                          <p className="details-title">Price</p>
                                          <p className="details-para">
                                            {row.original.Total !== "" &&
                                            row.original.Total !== null
                                              ? totalAmount
                                              : ""}
                                          </p>
                                        </>
                                      );
                                    },
                                    accessor: "baseFreightFee",
                                    filterable: true,
                                    minWidth: 80,
                                  },
                                ],
                              },
                            ]}
                            filterable
                            data={this.state.RateDetails}
                            defaultPageSize={1000}
                            className="-striped -highlight no-mid-align"
                            minRows={1}
                            showPagination={false}
                            SubComponent={(row) => {
                              return (
                                <div style={{ padding: "20px 0" }}>
                                  <ReactTable
                                    minRows={1}
                                    data={this.state.SubRateDetails.filter(
                                      this.state.ContainerLoad !== "INLAND"
                                        ? this.state.ContainerLoad === "LCL"
                                          ? (d) =>
                                              d.SaleQuoteIDLineID ===
                                              row.original.saleQuoteLineID
                                          : (d) =>
                                              d.saleQuoteLineID ===
                                              row.original.saleQuoteLineID
                                        : (d) =>
                                            d.SaleQuoteIDLineID ===
                                            row.original.SaleQuoteIDLineID
                                    )}
                                    columns={[
                                      {
                                        columns: [
                                          {
                                            Header: "C. Description",
                                            accessor: "ChargeDesc",
                                          },
                                          {
                                            Header: "C. Name",
                                            accessor: "ChargeCode",
                                          },
                                          {
                                            Header: "Units",
                                            accessor: "ChargeItem",
                                            Cell: (row) => (
                                              <React.Fragment>
                                                {row.original.Amount}
                                              </React.Fragment>
                                            ),
                                          },
                                          {
                                            Header: "Unit Price",
                                            accessor: "Amount",
                                            Cell: (row) => {
                                              if (
                                                row.original.Chargeitem !== null
                                              ) {
                                                return (
                                                  <>{row.original.Chargeitem}</>
                                                );
                                              } else {
                                                return <>0</>;
                                              }
                                            },
                                          },
                                          {
                                            Header: "Tax",
                                            accessor: "Tax",
                                            Cell: (row) => (
                                              <React.Fragment>
                                                {row.original.Tax !== 0
                                                  ? row.original.Tax
                                                  : row.original.Tax}
                                              </React.Fragment>
                                            ),
                                          },

                                          {
                                            Header: "Exrate",
                                            accessor: "Exrate" || "ExRate",
                                            Cell: (row) => {
                                              return (
                                                <>
                                                  {row.original.Exrate ||
                                                    row.original.ExRate}
                                                </>
                                              );
                                            },
                                          },

                                          {
                                            Cell: (row) => {
                                              if (
                                                row.original.Total !== "" &&
                                                row.original.Total !== null &&
                                                row.original.Total !== undefined
                                              ) {
                                                var total = row.original.Total;
                                                var remo = total.substring(
                                                  total.indexOf(" ") + 1
                                                );
                                                var final =
                                                  parseFloat(
                                                    total.replace(remo, "")
                                                  ).toFixed(2) +
                                                  " " +
                                                  remo;
                                              }
                                              return (
                                                <>
                                                  {row.original.Total !== "" &&
                                                  row.original.Total !== null
                                                    ? final
                                                    : ""}
                                                </>
                                              );
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
                                <p className="details-title">
                                  Mode of Transport
                                </p>
                                <p className="details-para">
                                  {this.state.ModeOfTransport}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">Container Load</p>
                                <p className="details-para">
                                  {this.state.ContainerLoad}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                <p className="details-title">Equipment Types</p>
                                <p className="details-para">
                                  {this.state.EquipmentTypes}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">
                                  Special Equipment
                                </p>
                                <p className="details-para">
                                  {this.state.SpecialEquipment}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">HazMat</p>
                                <p className="details-para">
                                  {this.state.HazMat == 1 ? "Yes" : "No"}
                                </p>
                              </div>

                              {this.state.ContainerLoad !== "FCL" && "LTL" ? (
                                <>
                                  <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                    <p className="details-title">
                                      Non Stackable
                                    </p>
                                    <p className="details-para">
                                      {this.state.HazMatUnstackable == 1
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                  <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                                    <p className="details-title">
                                      CustomClearance
                                    </p>
                                    <p className="details-para">
                                      {this.state.CustomClearance == 1
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                  <p className="details-title">
                                    CustomClearance
                                  </p>
                                  <p className="details-para">
                                    {this.state.CustomClearance == 1
                                      ? "Yes"
                                      : "No"}
                                  </p>
                                </div>
                              )}

                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">Inco Terms</p>
                                <p className="details-para">
                                  {" "}
                                  {this.state.IncoTerms}
                                </p>
                              </div>
                              <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                <p className="details-title">Type of Move</p>
                                <p className="details-para">
                                  {this.state.TypeofMove}
                                </p>
                              </div>
                              {this.state.RejectedReason ? (
                                <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                                  <p className="details-title">
                                    Rejected Reasone
                                  </p>
                                  <p className="details-para">
                                    {this.state.RejectedReason}
                                  </p>
                                </div>
                              ) : (
                                ""
                              )}
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
                                showContent: !this.state.showContent,
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
                        <div className="title-border-t py-3">
                          <h3>Customer Details</h3>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Account/Customer</p>
                              <p className="details-para">
                                {this.state.accountcustname}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3 r-border">
                              <p className="details-title">Address</p>
                              <p className="details-para">
                                {this.state.custAddress}
                              </p>
                            </div>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                              <p className="details-title">
                                Notification Person
                              </p>
                              <p className="details-para">
                                {this.state.custNotification}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4 login-fields">
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
                        <div className="row">
                          {" "}
                          <div className="col-md-12 login-fields">
                            <div className="ag-fresh redirect-row">
                              <ReactTable
                                data={CargoDetailsArr}
                                filterable
                                minRows={1}
                                showPagination={false}
                                columns={[
                                  {
                                    Header: "Pack.Type",
                                    accessor: "PackageType",
                                  },
                                  {
                                    Header: "Quantity",
                                    accessor: "Quantity",
                                  },
                                  {
                                    Header: "Length",
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
                                  },
                                  {
                                    Header:
                                      this.state.ContainerLoad == "AIR" ||
                                      this.state.ContainerLoad == "LTL"
                                        ? "CW"
                                        : "CBM",
                                    accessor: "ChgWeight",
                                    Cell: (row) => {
                                      if (
                                        this.state.ContainerLoad === "AIR" ||
                                        this.state.ContainerLoad === "LTL"
                                      ) {
                                        return (
                                          <p>{row.original.VolumeWeight}</p>
                                        );
                                      } else {
                                        return <p>{row.original.CBM}</p>;
                                      }
                                    },
                                    show:
                                      this.state.ContainerLoad == "AIR" ||
                                      this.state.ContainerLoad == "LTL" ||
                                      this.state.ContainerLoad == "LCL"
                                        ? true
                                        : false,
                                  },

                                  {
                                    Header: "VolumeWeight",
                                    accessor: "VolumeWeight",
                                    show:
                                      this.state.ContainerLoad == "FCL" ||
                                      this.state.ContainerLoad == "FTL"
                                        ? true
                                        : false,
                                  },
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={2000}
                              />
                            </div>
                          </div>
                        </div>

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
                          <p className="file-name w-100 text-center mt-1"></p>
                        </div>

                        <div className="row">
                          {" "}
                          <div className="col-md-12 login-fields mt-3">
                            <p className="details-title">Documents</p>
                            <div className="ag-fresh redirect-row">
                              <ReactTable
                                data={DocumentDetails}
                                filterable
                                minRows={1}
                                showPagination={false}
                                columns={[
                                  {
                                    Header: "File Name",
                                    accessor: "FileName",
                                    Cell: (row) => {
                                      if (
                                        row.original.FileName !==
                                        "No File Found"
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
                                    },
                                  },
                                  {
                                    Header: "Action",
                                    sortable: false,
                                    Cell: (row) => {
                                      if (
                                        row.original.FileName !==
                                        "No File Found"
                                      ) {
                                        return (
                                          <div className="action-cntr">
                                            <a
                                              title="Download"
                                              onClick={(e) =>
                                                this.HandleDowloadFile(e, row)
                                              }
                                            >
                                              <img
                                                style={{ cursor: "pointer" }}
                                                className="actionicon"
                                                src={Download}
                                                alt="download-icon"
                                              />
                                            </a>
                                            <a
                                              title="Delete"
                                              onClick={(e) =>
                                                this.HandleDocumentDelete(
                                                  e,
                                                  row
                                                )
                                              }
                                            >
                                              <img
                                                className="actionicon"
                                                style={{ cursor: "pointer" }}
                                                src={Delete}
                                                alt="download-icon"
                                              />
                                            </a>
                                          </div>
                                        );
                                      } else {
                                        return <></>;
                                      }
                                    },
                                  },
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={2000}
                              />
                            </div>
                          </div>
                        </div>

                        <center>
                          {this.state.Bookingcreation && (
                            <>
                              <button
                                onClick={this.toggleBook}
                                className="butn more-padd mt-4 mr-3"
                              >
                                Create Booking
                              </button>

                              <button
                                onClick={this.togglePreview}
                                className="butn more-padd mr-3"
                              >
                                Preview
                              </button>
                            </>
                          )}
                        </center>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* -------------------------------------Manage Profit Modal---------------------------------------- */}
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
          {/* -------------------------------------Reject Modal---------------------------------------- */}
          <Modal
            className=""
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>Popup will come</ModalBody>
          </Modal>

          <Modal
            className="delete-popup package-popup"
            isOpen={this.state.modalRejectPop}
            toggle={this.toggleRejectPop.bind(this)}
          >
            <ModalBody>
              <h3 className="mb-4">Reject Reason</h3>
              <div className="rename-cntr login-fields">
                <input type="text" id="RejectResontxt" />
              </div>
              <Button className="butn" onClick={this.RejectQuotes.bind(this)}>
                Submit
              </Button>
              <Button
                className="butn cancel-butn"
                onClick={this.toggleRejectPop.bind(this)}
              >
                Close
              </Button>
            </ModalBody>
          </Modal>
        </div>
        {/* -------------------------------------Accept Modal---------------------------------------- */}
        <Modal
          className="amnt-popup"
          isOpen={this.state.isAcceptModal}
          toggle={this.toggleAcceptModal}
          centered={true}
        >
          <ModalBody>
            <p>Do you want Accept Quotation ?</p>
            <div className="text-center">
              <Button
                className="butn"
                onClick={this.AcceptQuotes.bind(this)}
                disabled={this.state.btnloding === true ? true : false}
              >
                {this.state.btnloding == true ? (
                  <>
                    <i
                      style={{ marginRight: "15" }}
                      className="fa fa-refresh fa-spin"
                    ></i>
                    {"Please Wait ..."}
                  </>
                ) : (
                  "Yes"
                )}
              </Button>

              <Button onClick={this.toggleAcceptModal} className="butn">
                No
              </Button>
            </div>
          </ModalBody>
        </Modal>
        {/* --------------------------------Reject Modal---------------------------------------- */}
        <Modal
          className="amnt-popup"
          isOpen={this.state.isRejectModal}
          toggle={this.toggleRejectModal}
          centered={true}
        >
          <ModalBody>
            <p>Do You Want to Reject Quotation ?</p>
            <div className="text-center">
              <div className="rename-cntr reject-popup login-fields">
                <label>Reject Reason</label>
                <input type="text" id="RejectResontxt" />
                <span style={{ color: "red" }}>{this.state.errorRejReson}</span>
              </div>
              <Button
                className="butn"
                onClick={this.RejectQuotes.bind(this)}
                disabled={this.state.rbtnloding === true ? true : false}
              >
                {this.state.rbtnloding == true ? (
                  <>
                    <i
                      style={{ marginRight: "15" }}
                      className="fa fa-refresh fa-spin"
                    ></i>
                    {"Please Wait ..."}
                  </>
                ) : (
                  "Yes"
                )}
              </Button>

              <Button className="butn" onClick={this.toggleRejectModal}>
                No
              </Button>
            </div>
          </ModalBody>
        </Modal>
        {/* -------------------------------------Preview quote Modal---------------------------------------- */}
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

            <div id="printDiv">
              <div className="row" style={{ margin: 0 }}>
                <div className="logohheader">
                  <div className="row align-items-center" style={{ margin: 0 }}>
                    <div className="col-12 col-md-6">
                      <img src={ATA} alt="ATAFreight Console" />
                    </div>
                    <div className="col-12 col-md-6 preview-date-num">
                      <p>
                        Date : <span>{tDate}</span>
                      </p>
                      <p>
                        Sales Quote No. :<span>{this.state.SaleQuoteID}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="firstbox">
                    <label>
                      Sales Person : <span>{this.state.SalesPersonName}</span>
                    </label>
                    <label>
                      E-Mail :{" "}
                      <span>
                        {/* {encryption(
                          window.localStorage.getItem("emailid"),
                          "desc"
                        )} */}
                        {this.state.SalesPersonEmail}
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
                <div className="col-12 col-sm-6">
                  <div className="firstbox">
                    <label>
                      ATNN : <span>{this.state.custNotification}</span>
                    </label>
                    <label>
                      E-Mail : <span>{this.state.Contact_Email}</span>
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
                    {this.state.ContainerLoad.toUpperCase() === "LCL" ||
                    this.state.ContainerLoad.toUpperCase() === "AIR" ||
                    this.state.ContainerLoad.toUpperCase() === "LTL" ||
                    this.state.ContainerLoad.toUpperCase() === "FCL" ? (
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
                                {this.state.ContainerLoad.toUpperCase() ===
                                  "FCL" ||
                                this.state.ContainerLoad.toUpperCase() ===
                                  "FTL" ? (
                                  ""
                                ) : (
                                  <th>
                                    {this.state.ContainerLoad.toUpperCase() ===
                                      "AIR" ||
                                    this.state.ContainerLoad.toUpperCase() ===
                                      "LTL"
                                      ? "Volume Weight"
                                      : "CBM"}
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.CargoDetailsArr.length > 0
                                ? this.state.CargoDetailsArr.map((item1) => (
                                    <tr>
                                      <td>{item1.PackageType}</td>
                                      <td>{item1.Quantity}</td>
                                      <td>{item1.Lengths}</td>
                                      <td>{item1.Width}</td>
                                      <td>{item1.Height}</td>
                                      <td>{item1.GrossWt}</td>
                                      {this.state.ContainerLoad.toUpperCase() ===
                                        "FCL" ||
                                      this.state.ContainerLoad.toUpperCase() ===
                                        "FTL" ? (
                                        ""
                                      ) : (
                                        <td>
                                          {this.state.ContainerLoad.toUpperCase() ===
                                          "AIR"
                                            ? item1.VolumeWeight
                                            : item1.Volume}
                                        </td>
                                      )}
                                    </tr>
                                  ))
                                : ""}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {this.state.RateDetails.map((item) => (
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="secondbox">
                        <h3>Service Details</h3>
                        <hr />
                        <div className="row">
                          <div className="col-12 col-sm-4">
                            <label>
                              Type of Move :<span>{this.state.TypeofMove}</span>
                            </label>
                            <label>
                              POL : <span>{item.POL}</span>
                            </label>
                            
                          </div>
                          <div className="col-12 col-sm-4">
                            <label>
                              Service Type :{" "}
                              <span>
                                {item.TransshipmentPort === null
                                  ? "Direct"
                                  : "Transit"}
                              </span>
                            </label>
                            <label>
                              POD : <span>{item.POD}</span>
                            </label>
                            
                          </div>
                          <div className="col-12 col-sm-4">
                            <label>
                              Liner : <span>{item.Linename}</span>
                            </label>
                            <label>
                              Inco Terms : <span>{this.state.IncoTerms}</span>
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
                          <div className="col-12 col-sm-4">
                            <label>
                              Free Time : <span>{item.FreeTime}</span>
                            </label>
                          </div>
                        </div>
                        <hr />
                        <div class="row">
                          <div className="col-12">
                            <label>
                              Expiry Date : <span>{item.ExpiryDate}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="thirdbox">
                        {this.state.ContainerLoad.toUpperCase() === "LCL" ||
                        this.state.ContainerLoad.toUpperCase() === "AIR" ||
                        this.state.ContainerLoad.toUpperCase() === "LTL" ? (
                          <>
                            <h3>Cargo Details</h3>
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
                                    <th>
                                      {this.state.ContainerLoad.toUpperCase() ===
                                        "AIR" ||
                                      this.state.ContainerLoad.toUpperCase() ===
                                        "LTL"
                                        ? "Volume Weight"
                                        : "CBM"}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.CargoDetailsArr.length > 0
                                    ? this.state.CargoDetailsArr.map(
                                        (item1) => (
                                          <tr>
                                            <td>{item1.PackageType}</td>
                                            <td>{item1.Quantity}</td>
                                            <td>{item1.Lengths}</td>
                                            <td>{item1.Width}</td>
                                            <td>{item1.Height}</td>
                                            <td>{item1.GrossWt}</td>
                                            <td>
                                              {this.state.ContainerLoad.toUpperCase() ===
                                              "AIR"
                                                ? item1.VolumeWeight
                                                : item1.Volume}
                                            </td>
                                          </tr>
                                        )
                                      )
                                    : ""}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="thirdbox">
                        <h3>
                          {this.state.ContainerLoad.toUpperCase() === "FCL"
                            ? item.ContainerType +
                              " (" +
                              item.ContainerQuantity +
                              ")"
                            : null}
                        </h3>

                        <div className="table-responsive">
                          <table className="table table-responsive">
                            {(() => {
                              this.state.filterrateSubDetails =
                                this.state.ContainerLoad !== "FCL" &&
                                this.state.ContainerLoad !== "AIR"
                                  ? this.state.ContainerLoad !== "INLAND"
                                    ? this.state.SubRateDetails.filter(
                                        (d) =>
                                          d.saleQuoteLineID ===
                                          item.SaleQuoteIDLineID
                                      )
                                    : this.state.SubRateDetails.filter(
                                        (d) =>
                                          d.SaleQuoteIDLineID ===
                                          item.SaleQuoteIDLineID
                                      )
                                  : this.state.SubRateDetails.filter(
                                      (d) =>
                                        d.saleQuoteLineID ===
                                        item.saleQuoteLineID
                                    );
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
                                <th>Total(USD)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.filterrateSubDetails.length > 0 &&
                              this.state.filterrateSubDetails !== undefined
                                ? this.state.filterrateSubDetails.map(
                                    (item1) => (
                                      <tr>
                                        <td>{item1.ChargeDesc}</td>
                                        <td>{item1.Amount}</td>
                                        <td>{item1.Chargeitem}</td>
                                        <td>{item1.Tax}</td>
                                        <td>{item1.Total}</td>
                                      </tr>
                                    )
                                  )
                                : ""}
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
                          <table className="table table-responsive">
                            <thead>
                              <tr>
                                <th>Total</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>

                                <th>
                                  {this.state.filterrateSubDetails.length > 0 &&
                                  this.state.filterrateSubDetails !== undefined
                                    ? this.state.filterrateSubDetails
                                        .reduce(function (prev, cur) {
                                          return (
                                            prev +
                                            parseFloat(cur.Total.split(" ")[0])
                                          );
                                        }, 0)
                                        .toFixed(2) +
                                      " " +
                                      this.state.filterrateSubDetails[0]
                                        .BaseCurrency
                                    : null}
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
                                {DocumentCharges.map((item) => (
                                  <tr>
                                    <td>{item.Type}</td>
                                    <td>
                                      {item.Amount === null ? " " : item.Amount}
                                    </td>
                                    <td>{item.Chargeitem}</td>
                                    <td>{item.Tax}</td>
                                    <td>
                                      {item.Total === null ? " " : item.Total}
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

                            <th className="total-align txt-right">
                              {/* {this.state.RateDetails.reduce(function(
                                prev,
                                cur
                              ) {
                                return (
                                  parseFloat(prev) +
                                  parseFloat(cur.Total.split(" ")[0])
                                );
                              },
                              0)} */}
                              {final.toFixed(2)}
                              {" " + this.state.RateDetails.length > 0
                                ? this.state.RateDetails[0].Total.split(" ")[1]
                                : null}
                            </th>
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
        {/* ---------------------------------print div start--------------------------------- */}
        <div style={{ display: "none" }}>
          <div id="printDiv1">
            <div className="row" style={{ margin: "0" }}>
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
                        Sales Quote No. :<span>{this.state.SaleQuoteID}</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
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
                      Sales Person : <span>{this.state.SalesPersonName}</span>
                    </label>
                  </td>
                  <td
                    className="preview-date-num"
                    style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                  >
                    <label>
                      ATNN : <span>{this.state.custNotification}</span>
                    </label>
                  </td>
                </tr>

                <tr className="">
                  <td
                    style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                  >
                    <label>
                      E-Mail :<span>{this.state.SalesPersonEmail}</span>
                    </label>
                  </td>
                  <td
                    className="preview-date-num"
                    style={{ width: "50%", minWidth: "50%", maxWidth: "50%" }}
                  >
                    <label>
                      E-Mail : <span>{this.state.Contact_Email}</span>
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
                  {this.state.ContainerLoad.toUpperCase() === "LCL" ||
                  this.state.ContainerLoad.toUpperCase() === "AIR" ||
                  this.state.ContainerLoad.toUpperCase() === "LTL" ||
                  this.state.ContainerLoad.toUpperCase() === "FCL" ? (
                    <>
                      <h3 style={{ marginTop: "15px" }}>Dimensions</h3>
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
                              {this.state.ContainerLoad.toUpperCase() ===
                                "FCL" ||
                              this.state.ContainerLoad.toUpperCase() ===
                                "FTL" ? (
                                ""
                              ) : (
                                <th>
                                  {this.state.ContainerLoad.toUpperCase() ===
                                    "AIR" ||
                                  this.state.ContainerLoad.toUpperCase() ===
                                    "LTL"
                                    ? "Volume Weight"
                                    : "CBM"}
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.CargoDetailsArr.length > 0
                              ? this.state.CargoDetailsArr.map((item1) => (
                                  <tr>
                                    <td>{item1.PackageType}</td>
                                    <td>{item1.Quantity}</td>
                                    <td>{item1.Lengths}</td>
                                    <td>{item1.Width}</td>
                                    <td>{item1.Height}</td>
                                    <td>{item1.GrossWt}</td>
                                    {this.state.ContainerLoad.toUpperCase() ===
                                      "FCL" ||
                                    this.state.ContainerLoad.toUpperCase() ===
                                      "FTL" ? (
                                      ""
                                    ) : (
                                      <td>
                                        {this.state.ContainerLoad.toUpperCase() ===
                                        "AIR"
                                          ? item1.VolumeWeight
                                          : item1.Volume}
                                      </td>
                                    )}
                                  </tr>
                                ))
                              : ""}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {this.state.RateDetails.map((item) => (
              <>
                <div className="row">
                  <div className="">
                    <div className="secondbox">
                      <h3>Service Details</h3>
                      <hr></hr>
                      <table class="table">
                        <tr class="secondbox">
                          <td
                            style={{
                              width: "46%",
                              minWidth: "46%",
                              maxWidth: "46%",
                            }}
                          >
                            <label>
                              Type of Move :<span>{this.state.TypeofMove}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              Service Type :
                              <span>
                                {item.TransshipmentPort === null
                                  ? "Direct"
                                  : "Transit"}
                              </span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              Liner : <span>{item.Linename}</span>
                            </label>
                          </td>
                        </tr>
                        <tr class="secondbox">
                          <td
                            style={{
                              width: "46%",
                              minWidth: "46%",
                              maxWidth: "46%",
                            }}
                          >
                            <label>
                              POL : <span>{item.POL}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              Inco Terms : <span>{this.state.IncoTerms}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              <span></span>
                            </label>
                          </td>
                        </tr>
                        <tr class="secondbox">
                          <td
                            style={{
                              width: "46%",
                              minWidth: "46%",
                              maxWidth: "46%",
                            }}
                          >
                            <label>
                              POD : <span>{item.POD}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              <span></span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              <span></span>
                            </label>
                          </td>
                        </tr>
                      </table>
                      <hr></hr>

                      <table class="table">
                        <tr class="secondbox">
                          <td
                            style={{
                              width: "46%",
                              minWidth: "46%",
                              maxWidth: "46%",
                            }}
                          >
                            <label>
                              Transit Time :{" "}
                              <span>{item.TransitTime + " Days"}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              Free Time : <span>{item.FreeTime}</span>
                            </label>
                          </td>
                          <td
                            style={{
                              width: "27%",
                              minWidth: "27%",
                              maxWidth: "27%",
                            }}
                          >
                            <label>
                              <span></span>
                            </label>
                          </td>
                        </tr>
                      </table>
                      <hr></hr>
                      <table class="table">
                        <tr class="secondbox">
                          <td
                            style={{
                              width: "100%",
                              minWidth: "100%",
                              maxWidth: "100%",
                            }}
                          >
                            <label>
                              Expiry Date : <span>{item.ExpiryDate}</span>
                            </label>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="thirdbox">
                      {this.state.ContainerLoad.toUpperCase() === "LCL" ||
                      this.state.ContainerLoad.toUpperCase() === "AIR" ||
                      this.state.ContainerLoad.toUpperCase() === "LTL" ? (
                        <>
                          <h3>Cargo Details</h3>
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
                                  <th>
                                    {this.state.ContainerLoad.toUpperCase() ===
                                      "AIR" ||
                                    this.state.ContainerLoad.toUpperCase() ===
                                      "LTL"
                                      ? "Volume Weight"
                                      : "CBM"}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.CargoDetailsArr.length > 0
                                  ? this.state.CargoDetailsArr.map((item1) => (
                                      <tr>
                                        <td>{item1.ContainerType}</td>
                                        <td>{item1.Quantity}</td>
                                        <td>{item1.Lengths}</td>
                                        <td>{item1.Width}</td>
                                        <td>{item1.Height}</td>
                                        <td>{item1.GrossWt}</td>
                                        <td>
                                          {this.state.ContainerLoad.toUpperCase() ===
                                          "AIR"
                                            ? item1.VolumeWeight
                                            : item1.Volume}
                                        </td>
                                      </tr>
                                    ))
                                  : ""}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="thirdbox">
                      <h3>
                        {this.state.ContainerLoad.toUpperCase() === "FCL"
                          ? item.ContainerType +
                            " (" +
                            item.ContainerQuantity +
                            ")"
                          : null}
                      </h3>

                      <div className="table-responsive">
                        <table className="table table-responsive">
                          {(() => {
                            this.state.filterrateSubDetails =
                              this.state.ContainerLoad !== "FCL" &&
                              this.state.ContainerLoad !== "AIR"
                                ? this.state.ContainerLoad !== "INLAND"
                                  ? this.state.SubRateDetails.filter(
                                      (d) =>
                                        d.saleQuoteLineID ===
                                        item.SaleQuoteIDLineID
                                    )
                                  : this.state.SubRateDetails.filter(
                                      (d) =>
                                        d.SaleQuoteIDLineID ===
                                        item.SaleQuoteIDLineID
                                    )
                                : this.state.SubRateDetails.filter(
                                    (d) =>
                                      d.saleQuoteLineID === item.saleQuoteLineID
                                  );
                          })()}

                          {(() => {
                            DocumentCharges = this.state.filterrateSubDetails.filter(
                              (d) =>
                                (d.ChargeItem || d.Chargeitem) === "Per HBL" ||
                                (d.ChargeItem || d.Chargeitem) === "Per BL" ||
                                (d.ChargeItem || d.Chargeitem) ===
                                  "Per Shipment" ||
                                (d.ChargeItem || d.Chargeitem) === "Per Set"
                            );
                          })()}

                          {(() => {
                            this.state.filterrateSubDetails = this.state.filterrateSubDetails.filter(
                              (d) =>
                                (d.ChargeItem || d.Chargeitem) !== "Per HBL" &&
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
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.filterrateSubDetails.length > 0 &&
                            this.state.filterrateSubDetails !== undefined
                              ? this.state.filterrateSubDetails.map((item1) => (
                                  <tr>
                                    <td>{item1.ChargeDesc}</td>
                                    <td>{item1.Amount}</td>
                                    <td>{item1.Chargeitem}</td>
                                    <td>{item1.Tax}</td>
                                    <td>{item1.Total}</td>
                                  </tr>
                                ))
                              : ""}
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
                        <table className="table table-responsive">
                          <thead>
                            <tr>
                              <th>Total</th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>

                              <th
                                style={{
                                  textAlign: "right",
                                  paddingRight: "105px",
                                }}
                              >
                                {this.state.filterrateSubDetails.length > 0 &&
                                this.state.filterrateSubDetails !== undefined
                                  ? this.state.filterrateSubDetails
                                      .reduce(function (prev, cur) {
                                        return (
                                          prev +
                                          parseFloat(cur.Total.split(" ")[0])
                                        );
                                      }, 0)
                                      .toFixed(2) +
                                    " " +
                                    this.state.filterrateSubDetails[0]
                                      .BaseCurrency
                                  : null}
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
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DocumentCharges.map((item) => (
                                <tr>
                                  <td>{item.Type}</td>
                                  <td>
                                    {item.Amount === null ? " " : item.Amount}
                                  </td>
                                  <td>{item.Chargeitem}</td>
                                  <td>{item.Tax}</td>
                                  <td>
                                    {item.Total === null ? " " : item.Total}
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

                          <th className="total-align txt-right">
                            {final.toFixed(2)}
                            {" " + this.state.RateDetails.length > 0
                              ? this.state.RateDetails[0].Total.split(" ")[1]
                              : null}
                          </th>
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
        </div>
      </React.Fragment>
    );
  }
}

export default RateFinalizingStill;

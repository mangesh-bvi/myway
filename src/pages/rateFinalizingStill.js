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
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { encryption } from "../helpers/encryption";

import Moment from "react-moment";
import ATA from "./../assets/img/ATAFreight_console.png";
import Download from "./../assets/img/csv.png";
import Delete from "./../assets/img/red-delete-icon.png";

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
          TruckDesc: ""
        }
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
      cbmVal: 0
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleBook = this.toggleBook.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    // this.isAcceptModal = this.isAcceptModal.bind(this);
    // this.isRejectModal = this.isRejectModal.bind(this);
  }

  componentDidMount() {
    // debugger;

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
      //this.HandleDowloadFile();
    } else {
      this.props.history.push("quote-table");
    }
  }

  componentDidUpdate() {
    // debugger;
    var QuoteNumber = this.state.QuoteNumber;
    if (QuoteNumber !== this.props.location.state.detail.Quotes) {
      var qData = this.props.location.state;
      this.HandleSalesQuoteView(qData);
      this.HandlePackgeTypeData();
      this.HandleCommodityDropdown();
      //this.HandleDowloadFile();
    }

    // if (typeof this.props.location.state.detail != undefined) {
    //   var qData = this.props.location.state;
    //   this.HandleSalesQuoteView(qData);
    //   this.HandlePackgeTypeData();
    //   this.HandleCommodityDropdown();
    //   //this.HandleDowloadFile();
    // } else {
    //   this.props.history.push("quote-table");
    // }
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
    debugger;
    var SalesQuoteNumber = param.detail.Quotes;
    var type = param.detail.Type;
    //alert(param.detail.Status)
    // "SHA-SQFCL-NOV19-05020"

    if (param.detail.Status != "Pending") {
      this.setState({ QuoteStatus: false });
    }
    if (param.detail.Status == "Approved") {
      this.setState({ Bookingcreation: true });
    }

    var SalesQuoteViewdata = {
      Mode: type,
      //SalesQuoteNumber: param.Quotes,
      SalesQuoteNumber: SalesQuoteNumber
    };
    this.setState({
      QuoteNumber: SalesQuoteNumber
    });
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteView`,
      // data:  {Mode:param.Type, SalesQuoteNumber:param.Quotes},
      data: SalesQuoteViewdata,
      headers: authHeader()
    })
      .then(function(response) {
        debugger;

        var TypeofMove = "";
        var IncoTerms = "";
        var CargoDetailsArr = [];
        var SaleQuoteID = "";
        //accountcustname
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                TypeofMove = response.data.Table[0].TypeOfMove;
                IncoTerms = response.data.Table[0].IncoTerm;
                SaleQuoteID = response.data.Table[0].SaleQuoteID;
                self.setState({
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
                      : response.data.Table[0].deliveryAddress
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
                  // TypeofMove: TypeofMove,
                  EquipmentTypes: response.data.Table1[0].ContainerCode,
                  Commodity: response.data.Table1[0].Commodity,
                  selectedCommodity: response.data.Table1[0].Commodity
                });
              }
            }
            if (response.data.Table3 != null) {
              if (response.data.Table3.length > 0) {
                var table = response.data.Table3;
                for (var i = 0; i < table.length; i++) {
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
                    Editable: true
                  });
                }
              } else {
                CargoDetailsArr.push({ Width: "No Data Found" });
              }
            } else {
              CargoDetailsArr.push({ Width: "No Data Found" });
            }
            self.setState({
              CargoDetailsArr: CargoDetailsArr
            });
          }
        }
        self.setState({
          RateDetails: response.data.Table1,
          SubRateDetails: response.data.Table2,
          multiCBM: response.data.Table3,
          DocumentDetails: response.data.Table4
        });
        if (response.data.Table4.length === 0) {
          self.setState({
            DocumentDetails: [{ FileName: "No File Found" }]
          });
        }
        self.forceUpdate();
        self.HandleSalesQuoteConditions();
        //console.log(response);
      })
      .catch(error => {
        debugger;
        console.log(error.response);
      });
  }

  toggleBook(e) {
    e.stopPropagation();
    // this.setState(prevState => ({
    //   modalBook: !prevState.modalBook
    // }));
    this.props.history.push({
      pathname: "/booking-insert",
      state: {
        ContainerLoad: this.state.ContainerLoad,
        salesQuotaNo: this.state.QuoteNumber
      }
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
    setTimeout(() => {
      this.onDocumentSaleQuoteHandler();
    }, 200);

    this.setState({
      selectedFileName: event.target.files[0].name,
      selectedFile: event.target.files[0]
    });
  };

  HandleShipmentDetails(bookingNo) {
    //alert(bookingNo)
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingShipmentSummaryDetails`,
      data: {
        BookingNo: bookingNo
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        var shipmentdata = response.data;
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //alert(err[1].replace("}", ""))

        NotificationManager.error(err[1].replace("}", ""));
      });
  }

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
    debugger;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteApprove`,
      data: {
        Mode: QuoteType,
        SalesQuoteNumber: SalesQuoteNumber,
        isApprove: 1,
        MyUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                NotificationManager.success(response.data.Table[0].Message);
                self.setState({ btnloding: false });
                self.toggleAcceptModal();
                setTimeout(function() {
                  window.location.href = "quote-table";
                }, 1000);
              }
            }
          }
        }

        var Messagebody =
          "<html><body><table><tr><td>Hello Sir/Madam,</td><tr><tr><tr><tr><td>The Quotation is sent by our Sales Person Name.Request you to check the Quotation and share your approval for same.</td></tr><tr><td>To check and approve the quotation please click here.</td></tr></table></body></html>";

        self.SendMail(SalesQuoteNumber, Messagebody);
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //alert(err[1].replace("}", ""))
        NotificationManager.error(err[1].replace("}", ""));
      });
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
    debugger;
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
          MyUserID: encryption(window.localStorage.getItem("userid"), "desc")
        },
        headers: authHeader()
      })
        .then(function(response) {
          debugger;

          //self.toggleRejectPop();

          if (response != null) {
            if (response.data != null) {
              if (response.data.Table != null) {
                if (response.data.Table.length > 0) {
                  self.setState({ rbtnloding: false });
                  NotificationManager.success(response.data.Table[0].Message);
                  self.toggleRejectModal();
                  setTimeout(function() {
                    window.location.href = "quote-table";
                  }, 1000);
                }
              }
            }
          }

          var Messagebody =
            "<html><body><table><tr><td>Hello Sir/Madam,</td><tr><tr><tr><tr><td>The Quotation is sent has been rejected</td></tr></table></body></html>";

          self.SendMail(SalesQuoteNumber, Messagebody);
        })
        .catch(error => {
          debugger;
          var temperror = error.response.data;
          var err = temperror.split(":");
          //alert(err[1].replace("}", ""))
          NotificationManager.error(err[1].replace("}", ""));
        });
    } else {
      var errorRejReson = "Please enter rejection reason";
      self.setState({
        errorRejReson: errorRejReson
      });
    }
  }

  SendMail(SalesQuoteNumber, Messagebody) {
    debugger;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteMailAPI`,
      data: {
        CustomerID: 0,
        SalesPersonID: 0,
        SalesQuoteNumber: SalesQuoteNumber,
        Body: Messagebody,
        MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        if (response != null) {
          if (response.data != null) {
            if (response.data.length > 0) {
              NotificationManager.success(response.data[0].Result);
            }
          }
        }
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //alert(err[1].replace("}", ""))
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  // Shlok Start workingf

  //// start dynamic element for LCL-AIR-LTL

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
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="QTY"
              className="w-100"
              name="QTY"
              value={"" + el.Quantity || ""}
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
              value={"" + el.Length || ""}
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
              value={"" + el.height || ""}
              //onBlur={this.cbmChange}
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
        <div className="col-md">
          {/* <div className="spe-equ">
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
          </div> */}
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
    // if (this.state.containerLoadType !== "LCL") {
    //   var decVolumeWeight =
    //     (multiCBM[i].Quantity *
    //       (multiCBM[i].Length * multiCBM[i].Width * multiCBM[i].height)) /
    //     6000;
    //   if (multiCBM[i].GrossWt > parseFloat(decVolumeWeight)) {
    //     multiCBM[i] = {
    //       ...multiCBM[i],
    //       ["VolumeWeight"]: multiCBM[i].GrossWt
    //     };
    //   } else {
    //     multiCBM[i] = {
    //       ...multiCBM[i],
    //       ["VolumeWeight"]: parseFloat(decVolumeWeight)
    //     };
    //   }
    // } else {
    //   var decVolume =
    //     multiCBM[i].Quantity *
    //     ((multiCBM[i].Length / 100) *
    //       (multiCBM[i].Width / 100) *
    //       (multiCBM[i].height / 100));
    //   multiCBM[i] = {
    //     ...multiCBM[i],
    //     ["Volume"]: parseFloat(decVolume)
    //   };
    // }

    // this.setState({ multiCBM });
  }
  addMultiCBM() {
    this.setState(prevState => ({
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
          height: 0
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

  toggleRejectPop() {
    debugger;

    this.setState(prevState => ({
      modalRejectPop: !prevState.modalRejectPop
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

  onDocumentSaleQuoteHandler = () => {
    debugger;
    const docData = new FormData();
    var docName = this.state.selectedFileName;

    if (docName == "") {
      NotificationManager.error("Select File");
      return false;
    }

    debugger;
    //docData.append();
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
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        NotificationManager.success(response.data.Table[0].Result);
      })
      .catch(error => {
        debugger;
        NotificationManager.error(error.response.data.split("'")[1]);
        console.log(error.response);
      });

    var qData = this.props.location.state;
    this.HandleSalesQuoteView(qData);
  };

  HandleDowloadFile = (e, item) => {
    debugger;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DownloadFTPFile`,
      data: {
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        FilePath: item.original.FilePath
      },
      responseType: "blob",
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        if (response.data) {
          var blob = new Blob([response.data], { type: "application/pdf" });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = item.original.FileName;
          link.click();
        }
        //NotificationManager.success(response.data.Table[0].Result);
      })
      .catch(error => {
        debugger;
        NotificationManager.error(error.response.data.split("'")[1]);
        console.log(error.response);
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
              value={el.Width || ""}
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
          flattack_openTop[i].Width *
          flattack_openTop[i].height)) /
      6000;
    if (decVolumeWeight > parseFloat(flattack_openTop[i].GrossWeight)) {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(decVolumeWeight)
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(flattack_openTop[i].GrossWeight)
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
          Width: "",
          height: "",
          Quantity: "",
          GrossWeight: "",
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

  togglePreview() {
    this.setState(prevState => ({
      modalPreview: !prevState.modalPreview
    }));
  }

  HandleSalesQuoteConditions() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteConditions`,
      data: {
        Mode: this.state.ContainerLoad,
        ShipmentType: this.state.ShipmentType,
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      if (response.data.Table.length > 0) {
        self.setState({
          ConditionDesc: response.data.Table[0].conditionDesc
            .split("\n")
            .map((item, i) => <p key={i}>{item}</p>)
        });
      }
    });
  }
  //// End Truck Tyep Dynamic element
  // Shlok End working

  HandleDocumentDelete(e, row) {
    debugger;
    var MywayUserID = encryption(window.localStorage.getItem("userid"), "desc");
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

      setTimeout(() => {
        self.componentDidMount();
      }, 1000);
    });
  }
  handleChangePage() {
    window.history.back();
  }

  render() {
    console.log(this.state.filterrateSubDetails);

    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }
    let status;
    if (this.props.location.state) {
      status = this.props.location.state.detail.Status;
      // this.HandleShipmentDetails(bookingNo);
    }
    var DocumentCharges = [];
    var i = 0;
    const { CargoDetailsArr, DocumentDetails } = this.state;
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
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
              {(() => {
                // debugger;
                // if (this.props.location.state.detail[1] == "Quotes") {
                return (
                  <h2>
                    Quotes Details{" "}
                    {this.state.loding === true ? "" : this.state.QuoteNumber}
                  </h2>
                );
                // } else {
                //   return <h2>Booking Details</h2>;
                //  }
              })()}
              {/* <h2>Rate Query Details</h2> */}{" "}
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
                          <div>
                            {/* {this.state.toggleCustomerType && */}
                            {this.state.QuoteStatus && (
                              //QuoteStatus
                              <button
                                className="butn m-0 mr-3"
                                onClick={this.toggleAcceptModal}
                              >
                                Accept
                              </button>
                            )}
                            {/* {this.state.toggleCustomerType && */}
                            {this.state.QuoteStatus && (
                              <button
                                className="butn m-0"
                                // onClick={this.RejectQuotes.bind(this)}
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
                                        mode == "Air" &&
                                        lname !== ""
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
                                    filterable: true
                                    // minWidth: 175
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            TransShipment Port
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
                                    minWidth: 160
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
                                    minWidth: 100
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          <p className="details-title">
                                            Container
                                          </p>
                                          {this.state.ContainerLoad !==
                                          "INLAND" ? (
                                            <p className="details-para">
                                              {row.original.ContainerType}
                                            </p>
                                          ) : (
                                            <p className="details-para"></p>
                                          )}
                                        </>
                                      );
                                    },
                                    accessor: "ContainerType",
                                    filterable: true
                                    //minWidth: 175
                                  },
                                  {
                                    Cell: row => {
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
                                    minWidth: 90
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
                                    Cell: row => {
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
                                          <p className="details-title">Price</p>
                                          <p className="details-para">
                                            {row.original.Total !== "" &&
                                            row.original.Total !== null
                                              ? final
                                              : ""}
                                          </p>
                                        </>
                                      );
                                    },
                                    accessor: "baseFreightFee",
                                    filterable: true,
                                    minWidth: 80
                                  }
                                ]
                              }
                            ]}
                            filterable
                            // expanded={this.state.expanded}
                            // onExpandedChange={(expand, event) => {
                            //   this.setState({
                            //     expanded: {
                            //       [event]: {}
                            //     }
                            //   });
                            // }}
                            data={this.state.RateDetails}
                            defaultPageSize={1000}
                            className="-striped -highlight no-mid-align"
                            minRows={1}
                            showPagination={false}
                            SubComponent={row => {
                              return (
                                <div style={{ padding: "20px 0" }}>
                                  <ReactTable
                                    minRows={1}
                                    data={this.state.SubRateDetails.filter(
                                      this.state.ContainerLoad !== "INLAND"
                                        ? this.state.ContainerLoad === "LCL"
                                          ? d =>
                                              d.SaleQuoteIDLineID ===
                                              row.original.saleQuoteLineID
                                          : d =>
                                              d.saleQuoteLineID ===
                                              row.original.saleQuoteLineID
                                        : // ||
                                          // d.SaleQuoteIDLineID

                                          d =>
                                            d.SaleQuoteIDLineID ===
                                            row.original.SaleQuoteIDLineID
                                    )}
                                    // data={this.state.SubRateDetails}
                                    columns={[
                                      {
                                        columns: [
                                          // {
                                          //   Header: "C. Description",
                                          //   accessor:
                                          //     this.state.ContainerLoad ===
                                          //     "INLAND"
                                          //       ? "ChargeDesc"
                                          //       : "Type",
                                          //   Cell: row => {
                                          //     debugger;
                                          //     if (
                                          //       row.original.Type !==
                                          //         undefined &&
                                          //       row.original.Type !== ""
                                          //     ) {
                                          //       return <>{row.original.Type}</>;
                                          //     }
                                          //     if (
                                          //       row.original.ChargeDesc !==
                                          //       undefined
                                          //     ) {
                                          //       return (
                                          //         <>{row.original.ChargeDesc}</>
                                          //       );
                                          //     }
                                          //   }
                                          // },
                                          {
                                            Header: "C. Description",
                                            accessor: "ChargeDesc"
                                          },
                                          {
                                            Header: "C. Name",
                                            accessor: "ChargeCode"
                                          },
                                          {
                                            Header: "Units",
                                            accessor: "ChargeItem",
                                            Cell: props => (
                                              <React.Fragment>
                                                {props.original.Chargeitem !==
                                                undefined
                                                  ? props.original.Chargeitem
                                                  : props.original.ChargeItem}
                                              </React.Fragment>
                                            )
                                          },
                                          {
                                            Header: "Unit Price",
                                            accessor: "Amount",
                                            Cell: row => {
                                              debugger;
                                              if (
                                                row.original.Amount !== null
                                              ) {
                                                return (
                                                  <>{row.original.Amount}</>
                                                );
                                              } else {
                                                return <>0</>;
                                              }
                                            }
                                          },

                                          // {
                                          //   Header: "Tax",
                                          //   accessor: 0
                                          // },

                                          // {
                                          //   Header: "Exrate",
                                          //   accessor: 1
                                          // },

                                          {
                                            Cell: row => {
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
                                            accessor: "Total"
                                          }
                                        ]
                                      }
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
                              {/* <div className="col-md-4">
                            <p className="details-title">POL</p>
                            <p className="details-para">Mumbai</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">Vadodra</p>
                          </div>
                          <div className="col-md-4">
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
                        {/* <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <input type="text" value="Dummy" disabled />
                      </div>
                      {/* <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <input type="text" value="Dummy" disabled />
                      </div>  
                    </div> */}
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
                            <div className="d-flex justify-content-between">
                              <p className="details-title">Cargo Details</p>
                            {this.state.ContainerLoad === "AIR" ||
                            this.state.ContainerLoad === "LCL" ||
                            this.state.ContainerLoad === "LTL" ? (
                              <p className="details-title">
                                CBM:-{this.state.cbmVal}
                              </p>
                            ) : (
                              ""
                            )}
                            </div>

                            <div className="ag-fresh redirect-row">
                              <ReactTable
                                data={CargoDetailsArr}
                                filterable
                                minRows={1}
                                showPagination={false}
                                columns={[
                                  {
                                    Header: "Pack.Type",
                                    accessor: "ContainerType"
                                  },
                                  {
                                    Header: "Quantity",
                                    accessor: "Quantity"
                                  },
                                  {
                                    Header: "Lenght",
                                    accessor: "Lenght"
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
                                    accessor: "Weight"
                                    //editable: this.state.containerLoadType == "Air" ? true : false
                                  }
                                  // {
                                  //   Header: "Temp.",
                                  //   accessor: "Temperature"
                                  // },
                                  // {
                                  //   Header: "CBM",
                                  //   accessor: "CBM"
                                  //   //show:  this.state.containerLoadType == "Air" ? false : true
                                  // },
                                  // {
                                  //   Header: "Action",
                                  //   sortable: false,
                                  //   accessor: "Editable"
                                  // }
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={2000}
                                //getTrProps={this.HandleRowClickEvt}
                                //minRows={1}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="text-right">
                      <a href="quote-table" className="butn">
                        Send
                      </a>
                    </div> */}
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
                          <p className="file-name w-100 text-center mt-1">
                            {/* {this.state.selectedFileName} */}
                          </p>
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
                                    accessor: "FileName"
                                  },
                                  {
                                    Header: "Action",
                                    sortable: false,
                                    Cell: row => {
                                      if (
                                        row.original.FileName !==
                                        "No File Found"
                                      ) {
                                        return (
                                          <div className="action-cntr">
                                            <a
                                              title="Download"
                                              onClick={e =>
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
                                              onClick={e =>
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
                                    }
                                  }
                                ]}
                                className="-striped -highlight"
                                defaultPageSize={2000}
                                //getTrProps={this.HandleRowClickEvt}
                                //minRows={1}
                              />
                            </div>
                          </div>
                        </div>

                        <center>
                          {/* <Button
                      className="butn"
                      onClick={() => {
                        this.onDocumentClickHandler();
                      }}
                    >
                      Save File
                    </Button> */}

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
            )}{" "}
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
                {/* <label>Reject Reason</label> */}
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
                //onClick={this.hanleProfitAmountSubmit.bind(this)}
              >
                {this.state.btnloding == true ? (
                  <>
                    <i
                      style={{ marginRight: 15 }}
                      className="fa fa-refresh fa-spin"
                    ></i>
                    {"Please Wait ..."}
                  </>
                ) : (
                  "Yes"
                )}
              </Button>

              <Button
                onClick={this.toggleAcceptModal}
                className="butn"
                //onClick={this.hanleProfitAmountRemove.bind(this)}
              >
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
                //onClick={this.hanleProfitAmountSubmit.bind(this)}
              >
                {this.state.rbtnloding == true ? (
                  <>
                    <i
                      style={{ marginRight: 15 }}
                      className="fa fa-refresh fa-spin"
                    ></i>
                    {"Please Wait ..."}
                  </>
                ) : (
                  "Yes"
                )}
              </Button>

              <Button
                className="butn"
                onClick={this.toggleRejectModal}
                //onClick={this.hanleProfitAmountRemove.bind(this)}
              >
                No
              </Button>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          className="popupbox"
          isOpen={this.state.modalPreview}
          toggle={this.togglePreview}
        >
          <ModalBody>
            {/* <div className="modal popupbox" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-body"> */}
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={this.togglePreview}
            >
              <span>&times;</span>
            </button>
            <div className="row" style={{ margin: 0 }}>
              <div className="logohheader">
                <div className="row align-items-center" style={{ margin: 0 }}>
                  <div className="col-12 col-md-6">
                    <img src={ATA} alt="ATAFreight Console" />
                  </div>
                  <div className="col-12 col-md-6 preview-date-num">
                    <p>
                      Date :{" "}
                      <span>
                        <Moment format="DD-MMM-YYYY">
                          {this.state.todayDate.toString()}
                        </Moment>
                      </span>
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
                  {/* <h3>
                    From,{" "}
                    <span>
                      {encryption(
                        window.localStorage.getItem("companyname"),
                        "desc"
                      )}
                    </span>
                  </h3> */}
                  <label>
                    Sales Person :{" "}
                    <span>
                      {encryption(
                        window.localStorage.getItem("username"),
                        "desc"
                      )}
                    </span>
                  </label>
                  <label>
                    E-Mail :{" "}
                    <span>
                      {encryption(
                        window.localStorage.getItem("emailid"),
                        "desc"
                      )}
                    </span>
                  </label>
                  <label>
                    Phone : <span></span>
                  </label>
                  <label>
                    Fax : <span></span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="firstbox">
                  {/* <h3>
                      To, <span>{this.state.CompanyName}</span>
                    </h3> */}
                  <label>
                    ATNN : <span>{this.state.ContactName}</span>
                  </label>
                  <label>
                    E-Mail : <span>{this.state.ContactEmail}</span>
                  </label>
                  <label>
                    Phone : <span></span>
                  </label>
                  <label>
                    Fax : <span></span>
                  </label>
                  <label>
                    &nbsp;<span></span>
                  </label>
                </div>
              </div>
            </div>
            {/* {(() => {
                  for (let i = 0; i< this.state.rateDetails.length ; i++) { */}

            {/* // return( */}

            {/* {(() => 
                { 
                  debugger;
                  if(filterDuplicateService.length == 0)
                  {
                    for (let i= 0; i < this.state.rateDetails.length; i++) {
                      if (filterDuplicateService.length == 0) {
                        filterDuplicateService.push(this.state.rateDetails[i])
                      }
                      else{
                      for (let j= 0; j < filterDuplicateService.length; j++) {
                        if (this.state.rateDetails[i].TransshipmentPort != filterDuplicateService[j].TransshipmentPort &&
                          this.state.rateDetails[i].lineName != filterDuplicateService[j].lineName &&
                          this.state.rateDetails[i].POLCode != filterDuplicateService[j].POLCode &&
                          this.state.rateDetails[i].PODCode	 != filterDuplicateService[j].PODCode	 &&
                          this.state.rateDetails[i].freeTime != filterDuplicateService[j].freeTime &&
                          this.state.rateDetails[i].TransitTime != filterDuplicateService[j].TransitTime &&
                          this.state.rateDetails[i].expiryDate != filterDuplicateService[j].expiryDate) 
                        {
                          filterDuplicateService.push(this.state.rateDetails[i])
                        }                    
                      }
                      
                    }
                       
                  }
                }})()} */}
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
                              ? this.state.CargoDetailsArr.map(item1 => (
                                  <tr>
                                    <td>{item1.ContainerType}</td>
                                    <td>{item1.Quantity}</td>
                                    <td>{item1.Lenght}</td>
                                    <td>{item1.Width}</td>
                                    <td>{item1.Height}</td>
                                    <td>{item1.Weight}</td>
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
                  {/* // this.state.containerLoadType === "FTL" ? (
                    //   <>
                    //     <h3>Dimensions</h3>
                    //     <div className="table-responsive">
                    //       <table className="table table-responsive">
                    //         <thead>
                    //           <tr>
                    //             <th>Truck Type</th>
                    //             <th>Quantity</th>
                    //           </tr>
                    //         </thead>
                    //         <tbody>
                    //           {this.state.TruckTypeData.map(item1 => (
                    //             <tr>
                    //               <td>{item1.TruckDesc}</td>
                    //               <td>{item1.Quantity}</td>
                    //             </tr>
                    //           ))}
                    //         </tbody>
                    //       </table>
                    //     </div>
                    //   </>
                    // ) : 
                    // null} */}
                </div>
              </div>
            </div>

            {this.state.RateDetails.map(item => (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="secondbox">
                      <h3>Service Details</h3>
                      <hr />
                      <div className="row">
                        <div className="col-12 col-sm-4">
                          <label>
                            Type of Move :
                            <span>
                              {this.state.TypeofMove}
                              {/* {this.state.typeofMove === 1
                                ? "Port To Port"
                                : this.state.typeofMove === 2
                                ? "Door To Port"
                                : this.state.typeofMove === 4
                                ? "Door To Door"
                                : this.state.typeofMove === 3
                                ? "Port To Door"
                                : ""} */}
                            </span>
                          </label>
                          <label>
                            POL : <span>{item.POL}</span>
                            {/* <span>{this.state.PickUpAddress}</span> */}
                          </label>
                          <label>
                            POD : <span>{item.POD}</span>
                            {/* <span>{this.state.DestinationAddress}</span> */}
                          </label>
                        </div>
                        <div className="col-12 col-sm-4">
                          <label>
                            Service Type :{" "}
                            <span>
                              {item.TransshipmentPort === null
                                ? "Direct"
                                : "Transit"}
                              {/* // : item.TransshipmentPort} */}
                            </span>
                          </label>
                          <label>
                            Inco Terms : <span>{this.state.IncoTerms}</span>
                          </label>
                        </div>
                        <div className="col-12 col-sm-4">
                          <label>
                            Liner : <span>{item.Linename}</span>
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
                                  ? this.state.CargoDetailsArr.map(item1 => (
                                      <tr>
                                        <td>{item1.PackageType}</td>
                                        <td>{item1.Quantity}</td>
                                        <td>{item1.Lenght}</td>
                                        <td>{item1.Width}</td>
                                        <td>{item1.Height}</td>
                                        <td>{item1.Weight}</td>
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
                          ? item.ContainerType
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
                                      d =>
                                        d.saleQuoteLineID ===
                                        item.SaleQuoteIDLineID
                                    )
                                  : this.state.SubRateDetails.filter(
                                      d =>
                                        d.SaleQuoteIDLineID ===
                                        item.SaleQuoteIDLineID
                                    )
                                : this.state.SubRateDetails.filter(
                                    d =>
                                      d.saleQuoteLineID === item.saleQuoteLineID
                                  );
                          })()}

                          {(() => {
                            DocumentCharges = this.state.filterrateSubDetails.filter(
                              d =>
                                (d.ChargeItem || d.Chargeitem) === "Per HBL" ||
                                (d.ChargeItem || d.Chargeitem) === "Per BL" ||
                                (d.ChargeItem || d.Chargeitem) ===
                                  "Per Shipment" ||
                                (d.ChargeItem || d.Chargeitem) === "Per Set"
                            );
                          })()}

                          {(() => {
                            this.state.filterrateSubDetails = this.state.filterrateSubDetails.filter(
                              d =>
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
                              <th>Total(USD)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.filterrateSubDetails.length>0 &&this.state.filterrateSubDetails!==undefined?this.state.filterrateSubDetails.map(item1 => (
                              <tr>
                                <td>{item1.ChargeDesc}</td>
                                <td>{item1.Amount}</td>
                                <td>{item1.Chargeitem}</td>
                                <td>{item1.Tax}</td>
                                <td>{item1.Total}</td>
                              </tr>
                            )):""}
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
                                {this.state.filterrateSubDetails.length > 0 &&this.state.filterrateSubDetails!==undefined
                                  ? this.state.filterrateSubDetails.reduce(
                                      (sum, filterrateSubDetails) =>
                                        sum +
                                        parseFloat(
                                          filterrateSubDetails.Total.split(
                                            " "
                                          )[0]
                                        ),
                                      0
                                    ) +
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
                              {DocumentCharges.map(item => (
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

            {/* }})()} */}
            {/* </div>
          </div>
        </div>
      </div> */}
            {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
          </ModalBody>
        </Modal>

        <NotificationContainer leaveTimeout="3000" />
      </React.Fragment>
    );
  }
}

export default RateFinalizingStill;

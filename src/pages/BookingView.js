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
const imageAsset = "./../assets/img";
var sizeOf = require("image-size");
var QuotationData =[];
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
      Incoterm: ""
    };
    // this.HandleFileOpen = this.HandleFileOpen.bind(this);
  }
  componentDidMount() {
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
      }
    } else {
      this.props.history.push("/booking-table");
    }
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
      self.setState({ commodityData }); ///problem not working setstat undefined
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

  GetImageURL(imageObj) {
    debugger;
    let URL = imageAsset + "/ATAFreight_console.png";
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        URL = imageAsset + "/" + imageObj.Linename + ".png";
        imageObj.preparedImageURl = URL;
        resolve({ status: "ok" });
      };
      img.onerror = () => {
        URL = imageAsset + "/ATAFreight_console.png";
        imageObj.preparedImageURl = URL;
        resolve({ status: "error" });
      };
      img.src = imageAsset + "/" + imageObj.Linename + ".png";
    });
  }

  ////this methos for bookig details BookigGridDetailsList
  BookigGridDetailsList() {
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
        QuotationData = response.data.Table4;
        var QuotationSubData = response.data.Table5;
        var Booking = response.data.Table;
        var CargoDetails = response.data.Table2;
        var FileData = response.data.Table3;
        var eqmtType = response.data.Table1;
        
console.log(QuotationData);

        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            var ShipmentType = QuotationData[0].ShipmentType;
            self.setState({
              QuotationData,
              QuotationSubData,
              ShipmentType
            });
          }
        }
        for (let qd of self.state.QuotationData) {
          if (qd.Linename) {
            self.GetImageURL(qd);
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
            var BuyerName = Booking[0].BuyerName;

            var ShipperID = Booking[0].ShipperID;
            var Shipper_AddressID = Booking[0].Shipper_AddressID;
            var Shipper_Displayas = Booking[0].Shipper_Displayas;
            var Shipper_Name = Booking[0].Shipper_Name;

            var Consignee = Booking[0].Consignee;
            var Consignee_AddressID = Booking[0].Consignee_AddressID;
            var Consignee_Displayas = Booking[0].Consignee_Displayas;
            var Consignee_Name = Booking[0].Consignee_Name;
            var CargoType = Booking[0].CargoType;
            var Incoterm = Booking[0].Incoterm;
            var strBooking_No = Booking[0].strBooking_No;

            self.setState({
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
              Incoterm,
              strBooking_No,
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
        self.setState({
          HazMat: "",
          Unstackable: ""
        });
      });
    }
  }

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
        <span
          onClick={e => {
            this.HandleFileOpen(el.FilePath);
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

    // var sizeOf = require("image-size");
    // var dimensions = sizeOf("./../assets/img/maersk.png");
    // console.log(dimensions.width, dimensions.height);
    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Booking Details</h2>
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
                                  // var urlLink = this.GetImageURL(
                                  //   row.original.Linename
                                  // );
                                  return (
                                    <React.Fragment>
                                      <div className="d-flex align-items-center">
                                        <div>
                                          <p className="details-title">
                                            {/* <img
                                              src={require(urlLink)}
                                              alt="maersk icon"
                                            /> */}
                                            {/* {this.GetImageURL(row.original.Linename)} */}
                                          </p>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
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
                              {this.state.ShipmentType}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {this.state.CargoType}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {this.state.Incoterm}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {this.state.TypeofMove}
                            </p>
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">POL</p>
                            <p className="details-para">{this.state.POL}</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">{this.state.POD}</p>
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
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para"></p>
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
                      <div className="title-border py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Consignee Name</p>
                            <p className="details-para">
                              {this.state.fields["Consignee"]}
                            </p>
                            {/* <Autocomplete
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
                              autoComplete="off"
                            /> */}
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {this.state.Consignee_Displayas}
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
                            <p className="details-para">
                              {this.state.fields["Shipper"]}
                            </p>
                            {/* <Autocomplete
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
                              autoComplete="off"
                            /> */}
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {this.state.Shipper_Displayas}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <p className="details-para">{commodityName}</p>
                        {/* <select
                          disabled={true}
                          value={this.state.selectedCommodity}
                        >
                          <option>Select</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select> */}
                      </div>
                    </div>

                    <div>
                      <div className="title-border py-3">
                        <h3>Buyer Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Buyer Name</p>
                            <p className="details-para">
                              {this.state.BuyerName}

                              {/* <select
                                onChange={this.HandleChangeBuyer.bind(this)}
                                value={this.state.BuyerID}
                              >
                                <option selected>select</option>
                                {this.state.NonCustomerData.map((item, i) => (
                                  <option key={i} value={item.Company_ID}>
                                    {item.Company_Name}
                                  </option>
                                ))}
                              </select> */}
                            </p>
                          </div>
                          <div className="col-md-6">
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
                      <div className="title-border py-3">
                        <h3>Notify Party Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Notify Party Name</p>
                            <p className="details-para">
                              {this.state.NotifyName}
                              {/* <select
                                onChange={this.HandleChangeParty.bind(this)}
                                value={this.state.NotifyID}
                              >
                                <option selected>select</option>
                                {this.state.NonCustomerData.map((item, i) => (
                                  <option key={i} value={item.Company_ID}>
                                    {item.Company_Name}
                                  </option>
                                ))}
                              </select> */}
                            </p>
                          </div>
                          <div className="col-md-6">
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
                    <div>
                      <div
                        className="title-border py-3"
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

                    <div>
                      <div
                        className="title-border py-3"
                        style={{ width: "100%" }}
                      >
                        <h3>Documents</h3>
                      </div>
                    </div>
                    <div className="rename-cntr login-fields d-block">
                      {/* <div className="d-flex w-100 mt-4 align-items-center">
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
                      <br /> */}

                      {this.state.FileData.length > 0
                        ? this.CreateFileElement()
                        : null}
                    </div>
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

export default BookingView;

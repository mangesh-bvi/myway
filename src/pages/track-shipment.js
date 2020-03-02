import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import { UncontrolledCollapse } from "reactstrap";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Transit from "./../assets/img/transit-small.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import ApprovedImg from "./../assets/img/approved-status.png";
import Delivery from "./../assets/img/delivery.png";
import Plane from "./../assets/img/plane.png";
import Truck from "./../assets/img/truck.png";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import "react-table/react-table.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class TrackShipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packageDetails: [],
      modalDel: false,
      modalPackage: false,
      modalDocu: false,
      modalEdit: false,
      detailsData: {},
      addressData: [],
      containerData: [],
      containerDetails: [],
      ShowCard: true,
      documentData: [],
      sr_no: 0,
      filtered: [],
      viewDocument: false,
      addWat: "",
      bookedStatus: [],
      selectedFile: "",
      selectedFileName: "",
      consigneeFileName: "",
      ConsigneeID: 0,
      ShipperID: 0,
      HblNo: "",
      MapsDetailsData: [],
      ShipmentExistsInWatchList: 0,
      showContent: false,
      packageViewMore: [],
      packageTable: [],
      MessagesActivityDetails: [],
      iframeKey: 0,
      modalShare: false,
      HBLNumber: "",
      showData: false,
      Table9: [],
      POLPODData: [],
      eve: "",
      DData: "",
      ModeType: "",
      loading: false
    };
    this.toggleDel = this.toggleDel.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.togglePackage = this.togglePackage.bind(this);
    this.handleActivityList = this.handleActivityList.bind(this);
  }

  componentDidMount() {
    
    localStorage.removeItem(
      "AllLineData",
      "FlagsData",
      "BaloonData",
      "GreenLineData"
    );
    let self = this;
    if (window.location.href.indexOf("?") > 0) {
      var url = window.location.href.slice(
        window.location.href.indexOf("?") + 1
      );

      if (url) {
        // if (url != "" && url != null) {

        self.setState({
          showData: true,
          addWat: url,
          HBLNumber: url.replace("%20", " ").trim(),
          loading: false
        });
        self.HandleShipmentDetails(url);
      }
    } else {
      self.setState({
        showData: false,
        addWat: "",
        HBLNumber: "",
        loading: false
      });
    }
  }

  HandleMapDetailsData(mdetails) {
    var mydata = mdetails.Table;
    let self = this;
    /////Baloon with First's Start
    //// and Last order's end address
    var balloons = [];
    var flags = [];
    //var mainLineData = [];

    var allLineData = [];
    for (var i = 0; i < mydata.length; i++) {
      
      var BlocationData = {};
      var flagsData = {};

      var startLatLong = mydata[i]["CStLatLong"];
      var endLatLong = mydata[i]["CEdLatLong"];

      ////Baloon with start
      ////Flag on First order's Ending Position
      if (i === 0) {
        var content =
          "<div> <h3>" +
          mydata[i]["ShipperName"] +
          "</h3><br/><b>" +
          mydata[i]["StartLocation"] +
          "</b></div>";
        BlocationData.title = "";
        BlocationData.lat = startLatLong.split(",")[0];
        BlocationData.long = startLatLong.split(",")[1];
        BlocationData.addr = content;
        ////balloons.push(startLatLong);

        var fcontent =
          "<div><h4>" +
          mydata[i]["EndLocation"] +
          "</h4><p>Transit time From " +
          mydata[i]["StartLocation"] +
          " To " +
          mydata[i]["EndLocation"] +
          " is:<b>" +
          mydata[i]["NTransit_Time"] +
          " ( Max " +
          mydata[i]["NMax_Transit_Time"] +
          ", Min" +
          mydata[i]["NMin_Transit_Time"] +
          " ) days</b></p></div>";

        flagsData.title = "";
        flagsData.Blat = endLatLong.split(",")[0];
        flagsData.Blong = endLatLong.split(",")[1];
        flagsData.baddr = fcontent;
        ////flags.push(endLatLong);

        balloons.push(BlocationData);
        flags.push(flagsData);
      }

      ////Ballon with last order's End address
      if (i === mydata.length - 1) {
        var Econtent =
          "<div><h4>" +
          mydata[i]["EndLocation"] +
          "</h4><p>Transit time From" +
          mydata[i]["StartLocation"] +
          "To" +
          mydata[i]["EndLocation"] +
          " is:<b>" +
          mydata[i]["NTransit_Time"] +
          " (Max " +
          mydata[i]["NMax_Transit_Time"] +
          " , Min " +
          mydata[i]["NMin_Transit_Time"] +
          ") days</b></p></div>";

        BlocationData.title = "";
        BlocationData.lat = endLatLong.split(",")[0];
        BlocationData.long = endLatLong.split(",")[1];
        BlocationData.addr = Econtent;
        ////balloons.push(endLatLong);

        balloons.push(BlocationData);
      }

      if (i != mydata.length - 1 && i != 0) {
        var gcontent =
          "<div><h4>" +
          mydata[i]["EndLocation"] +
          "</h4><p>Transit time From " +
          mydata[i]["StartLocation"] +
          " To " +
          mydata[i]["EndLocation"] +
          " is:<b>" +
          mydata[i]["NTransit_Time"] +
          " ( Max " +
          mydata[i]["NMax_Transit_Time"] +
          ", Min" +
          mydata[i]["NMin_Transit_Time"] +
          " ) days</b></p></div>";

        flagsData.title = "";
        flagsData.Blat = endLatLong.split(",")[0];
        flagsData.Blong = endLatLong.split(",")[1];
        flagsData.baddr = gcontent;

        flags.push(flagsData);
      }

      var CTransShipPort = mydata[i]["CTransShipPort"];
      if (CTransShipPort != "") {
        var mContent = mydata[i]["CTransShipPort"];
        var CRouteLatLong = mydata[i]["CRouteLatLong"];
        flagsData.title = mContent;
        flagsData.Blat = CRouteLatLong.split(",")[0];
        flagsData.Blong = CRouteLatLong.split(",")[1];
        flagsData.baddr = "";

        flags.push(flagsData);
      }

      ///Line data

      var RouteLatLong = mydata[i]["GeoCoord"];

      var Not_Data = 0;
      var VesselData = {};
      if (RouteLatLong) {
        var splitRouteLatLong = RouteLatLong.split(";");
        for (var j = 0; j < splitRouteLatLong.length; j++) {
          var lineData = {};
          var tempSData = splitRouteLatLong[j].split(",");
          if (tempSData.length > 1) {
            lineData.lat = Number(tempSData[0]);
            lineData.lng = Number(tempSData[1]);
            allLineData.push(lineData);
          }
        }
      } else {
        
        Not_Data = i;
        VesselData = allLineData[allLineData.length - 1];
      }

      //mainLineData = allLineData;
    }

    var imgType = "";
    if (this.state.ModeType.toUpperCase() === "AIR") {
      imgType = "AIR";
    } else if (this.state.ModeType.toUpperCase() === "OCEAN") {
      imgType = "OCEAN";
    } else {
      imgType = "ROAD";
    }
    

    localStorage.removeItem("BaloonData");
    localStorage.removeItem("FlagsData");
    localStorage.removeItem("AllLineData");
    localStorage.removeItem("imgType");
    localStorage.removeItem("VesselData");

    localStorage.setItem("imgType", JSON.stringify(imgType));
    localStorage.setItem("VesselData", JSON.stringify(VesselData));
    localStorage.setItem("BaloonData", JSON.stringify(balloons));
    localStorage.setItem("FlagsData", JSON.stringify(flags));
    localStorage.setItem("AllLineData", JSON.stringify(allLineData));
    self.setState({ iframeKey: self.state.iframeKey + 1 ,loading:false});
  }

  ////Handle Shipement Details Map Data
  HandleShipmentDetailsMap(Encodedhblno) {
    
    let self = this;

    axios({
      method: "get",
      url: `${appSettings.APIURL}/AnonymousBindShipmentSummaryMap`,
      params: {
        Token: Encodedhblno.replace("%20", " ")
      }
      
    }).then(function(response) {
      
      var resdata = response.data;
      self.setState({  showData: true });
      self.HandleMapDetailsData(resdata);
    });
  }
  ////Handle Shipment Details
  HandleShipmentDetails(Encodedhblno) {
    
    this.setState({ loading: true });
    let self = this;
    if (Encodedhblno) {
      axios({
        method: "get",
        url: `${appSettings.APIURL}/AnonymousShipmentSummaryDetailsAPI`,
        params: {
          Token: Encodedhblno.replace("%20", " ")
        }
      })
        .then(function(response) {
          
          var shipmentdata = response.data;
          var POLPODData = response.data.Table5;
          var eve = response.data.Table[0].Event;
          var ModeType = response.data.Table[0].ModeOfTransport;
          var Table9 = response.data.Table9;
          self.setState({
            POLPODData,
            Table9,
            eve,
            ModeType,
            addWat: shipmentdata.Table[0].HBLNO,
            detailsData: shipmentdata.Table[0],
            addressData: shipmentdata.Table1,
            containerData: shipmentdata.Table2,
            containerDetails: shipmentdata.Table3,
            bookedStatus: shipmentdata.Table4,
            packageDetails: shipmentdata.Table7,
            DData:
              shipmentdata.Table2[shipmentdata.Table2.length - 1][
                "Arrival Date"
              ],
            ShipmentExistsInWatchList:
              shipmentdata.Table6[0].ShipmentExistsInWatchList,
            packageViewMore: shipmentdata.Table8
          });

          var sid = shipmentdata.Table[0].ShipperId;
          var cid = shipmentdata.Table[0].ConsigneeID;
          self.HandleShipmentDetailsMap(Encodedhblno);
        })
        .catch(error => {
          
          var temperror = error.response.data;
          var err = temperror.split(":");

          NotificationManager.error(err[1].replace("}", ""));
          this.setState({ showData: false });
        });
    } else {
      NotificationManager.error("Please enter #HBL");
      this.setState({ loading: false, showData: false });
    }
  }
  onDocumentChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };
  onDocumentConsignee = event => {
    this.setState({
      consigneeFileName: event.target.files[0].name
    });
  };

  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
  togglePackage(cargoId) {
    
    let self = this;
    let packageTable = [];

    this.state.packageViewMore.forEach(function iterator(item) {
      if (item.CargoPackID === cargoId) {
        packageTable.push(item);
      }
    });

    self.setState(prevState => ({
      modalPackage: !prevState.modalPackage,
      packageTable
    }));
  }
  toggleDocu() {
    this.setState(prevState => ({
      modalDocu: !prevState.modalDocu
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  HandleShowHideFun() {
    this.setState({ ShowCard: !this.state.ShowCard });
  }

  onEntered() {
    // this.setState({ status: "Opened" });
    console.log(1);
  }
  handleChangePage() {
    window.history.back();
  }

  handleAddToWatchList = () => {
    
    let self = this;
    var hbll = "";
    if (self.state.addWat !== null && self.state.addWat !== "") {
      hbll = self.state.addWat;
    } else {
      hbll = self.state.HblNo;
    }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/AddToWatchListAPI`,
      data: {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        HBLNO: hbll
      },
      headers: authHeader()
    }).then(function(response) {
      
      NotificationManager.success(response.data[0].Result);
      self.setState({ ShipmentExistsInWatchList: 1 });
    });
  };

  handleActivityList() {
    
    let self = this;
    var HblNo = this.state.HblNo;
    if (typeof this.props.location.state != "undefined") {
      HblNo = this.props.location.state.detail;
    }
    // if (typeof this.props.location.state != "undefined") {

    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    

    axios({
      method: "post",
      url: `${appSettings.APIURL}/MessagesActivityDetails`,
      data: {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        HBLNO: HblNo
      },
      headers: authHeader()
    })
      .then(function(response) {
        
        
        self.setState({ MessagesActivityDetails: response.data });
        document.getElementById("addMess").value = "";
      })
      .catch(error => {
        
        var temperror = error.response.data;
        var err = temperror.split(":");
      });
    // }
  }

  HandleChangeHBL(e) {
    
    var HBLNumber = e.target.value;
    this.setState({ HBLNumber });
  }
  ////Handle Submit button
  HandleSubmit() {
    if (this.state.addWat.replace("%20", " ").trim() === this.state.HBLNumber) {
      
      var HBLNO = this.state.HBLNumber;

      this.HandleShipmentDetails(HBLNO);
    } else if (this.state.HBLNumber) {
      var HBLNO = this.state.HBLNumber;

      this.HandleShipmentDetails(HBLNO);
    } else {
      NotificationManager.error("Please enter Valid HBL#");
    }
  }

  render() {
    let self = this;
    const { detailsData, POLPODData, containerData, bookedStatus } = this.state;

    let approvedisActive = "";
    let approvedDate = "";
    let bookingIsActive = "";
    let bookDate = "";
    let departedIsActive = "";
    let departedDate = "";
    let arrivedIsActive = "";
    let arrivedDate = "";
    let inlandIsActive = "track-hide";
    let inlandDate = "";
    let deliveredIsActive = "";
    let deliverDate = "";
    for (let index = 0; index < bookedStatus.length; index++) {
      if (bookedStatus[index].Status == "Approved") {
        approvedisActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        approvedDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      } else if (bookedStatus[index].Status == "Booked") {
        bookingIsActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        bookDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      } else if (bookedStatus[index].Status == "Departed") {
        departedIsActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        departedDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      } else if (bookedStatus[index].Status == "Arrived") {
        arrivedIsActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        arrivedDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      } else if (bookedStatus[index].Status == "Inland") {
        inlandIsActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        inlandDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      } else if (bookedStatus[index].Status == "Delivered") {
        deliveredIsActive =
          bookedStatus[index].ActualDate == null ||
          bookedStatus[index].ActualDate == ""
            ? "track-line-cntr"
            : "track-line-cntr active";
        deliverDate =
          bookedStatus[index].ActualDate == null
            ? "ETA " + bookedStatus[index].EstimationDate
            : bookedStatus[index].ActualDate;
      }
    }
    var eventColor = "";
    if (this.state.eve !== "") {
      if (this.state.eve === "On Time") {
        eventColor = "green";
      } else if (this.state.eve === "Delay Risk") {
        eventColor = "yellow";
      } else if (this.state.eve === "Behind Schedule") {
        eventColor = "red";
      }
    }
    var perBooking = "0";
    var POLPODDatalen = this.state.POLPODData.length;

    if (this.state.Table9.length > 0) {
      var Transshipped = this.state.Table9.filter(
        x => x.Status === "Transshipped"
      ).length;

      var Bookedd = this.state.Table9.filter(x => x.Status === "Booked").length;
      var Departedd = this.state.Table9.filter(x => x.Status === "Departed")
        .length;
      var Arriveddata = this.state.Table9.filter(x => x.Status === "Arrived")
        .length;
      var Delivered = this.state.Table9.filter(x => x.Status === "Delivered")
        .length;
      if (Bookedd == 1) {
        perBooking = "0";
      }

      if (Transshipped > 0 && Arriveddata === 0 && Delivered === 0) {
        var total = parseInt(100 / (Transshipped + 1));
        var finalTotal = 0;
        if (Transshipped == 1) {
          finalTotal = total / this.state.POLPODData.length;
        }
        perBooking = (total + finalTotal) * Transshipped + "";
      }
      if (Transshipped > 0 && Arriveddata > 0 && Delivered === 0) {
        var total = parseInt(100 / (Transshipped + 1));
        var finalTotal = 0;
        if (Transshipped == 1) {
          finalTotal = total / this.state.POLPODData.length;
        }
        perBooking = (total + finalTotal) * Transshipped + "";
      }
      if (
        Departedd == 1 &&
        this.state.POLPODData.length == 2 &&
        Transshipped == 0 &&
        Arriveddata == 0 &&
        Delivered == 0
      ) {
        perBooking = "50";
      }
      if (
        Departedd == 1 &&
        this.state.POLPODData.length > 2 &&
        Transshipped == 0 &&
        Arriveddata == 0 &&
        Delivered == 0
      ) {
        var per = 100 / (this.state.POLPODData.length + 1);

        perBooking = per + per / 2 + "";

        
      }

      if (Transshipped >= 1 && Arriveddata >= 1) {
        perBooking = "100";
      }
      if (Transshipped >= 1 && Delivered >= 1) {
        perBooking = "100";
      }
      if (Transshipped == 0 && Arriveddata > 0) {
        perBooking = "100";
      }
      if (Transshipped == 0 && Delivered > 0) {
        perBooking = "100";
      }
    }
    let className = "butn view-btn less-btn";
    if (this.state.showContent == true) {
      className = "butn view-btn less-btn";
    } else {
      className = "butn view-btn";
    }

    return (
      <div>
        <div className="cls-ofl">
          <div className="cls-rt-ts">
            <div className="container-fluid">
              <div>
                <div className="title-sect ts-head">
                  {this.state.showData === false &&
                  this.state.loading === false ? (
                    <h2>Track Shipment</h2>
                  ) : (
                    <h2>Track Shipment - {detailsData.HBLNO}</h2>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <labal
                    className="details-title"
                    style={{ marginRight: "10px" }}
                  >
                    Enter HBL#
                  </labal>
                  <input
                    type="text"
                    name="HBLNO"
                    className="enterhbl"
                    value={this.state.HBLNumber}
                    onChange={this.HandleChangeHBL.bind(this)}
                  />
                  <button
                    onClick={this.HandleSubmit.bind(this)}
                    className="butn view-btn"
                  >
                    Submit
                  </button>
                </div>
                {this.state.showData === false ? (
                  this.state.loading == true ? (
                    <div className="loader-icon"></div>
                  ) : (
                    ""
                  )
                ) : (
                  // ""
                  <div className="row">
                    <div className="col-md-7">
                      <ul className="nav cust-tabs" role="tablist">
                        <li>
                          <a
                            className="active"
                            id="details-tab"
                            data-toggle="tab"
                            href="#details"
                            role="tab"
                            aria-controls="details"
                            aria-selected="true"
                          >
                            Details
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content cust-tabs-content">
                        <div
                          className="tab-pane fade show active p-0"
                          id="details"
                          role="tabpanel"
                          aria-labelledby="details-tab"
                        >
                          <div className="sect-padd">
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">HBL#</p>
                                <span className="details-para">
                                  {detailsData.HBLNO}
                                </span>
                                <input
                                  type="hidden"
                                  value={detailsData.HBLNO}
                                  id="popupHBLNO"
                                />
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">BL#</p>
                                <p className="details-para">
                                  {detailsData.BLNo}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">MyWay#</p>
                                <p className="details-para">
                                  {detailsData.MyWayNumber}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">Status</p>
                                <p className="details-para">
                                  {detailsData.Status}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">Last Update</p>
                                <p className="details-para">
                                  {detailsData["Status Date"]}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">Mode</p>
                                <p className="details-para">
                                  {detailsData.ModeOfTransport}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">Cargo Type</p>
                                <p className="details-para">
                                  {detailsData.CargoType}
                                </p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">ATA Booking#</p>
                                <p className="details-para">
                                  {detailsData.ATABookingNo}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                <p className="details-title">SRT#</p>
                                <p className="details-para">
                                  {detailsData["SRT No#"]}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="progress-sect">
                            <div className="d-flex align-items-center">
                              <div className="mobilenumber-resp"></div>

                              <span
                                className="clr-green"
                                style={{
                                  overflow: "initial",
                                  marginTop: "20px"
                                }}
                              >
                                POL
                              </span>
                              <div className="pol-pod-progress">
                                <div className="mobilenumber-resp">
                                  {this.state.POLPODData.map(function(id, i) {
                                    var wid = 100 / (POLPODDatalen - 1);
                                    var wid1 = 100 / POLPODDatalen;

                                    if (i === 0) {
                                      return (
                                        <label
                                          className="resol"
                                          style={{ width: wid1 + "%" }}
                                        >
                                          <span
                                            className="progspan"
                                            style={{
                                              display: "block",
                                              float:
                                                POLPODDatalen < 2
                                                  ? "left"
                                                  : "none"
                                            }}
                                          ></span>
                                        </label>
                                      );
                                    }
                                    if (i >= 1 && i < POLPODDatalen - 1) {
                                      var fwidth = wid * i;
                                      return (
                                        <label
                                          className="resol"
                                          style={{ width: wid1 + "%" }}
                                        >
                                          <span
                                            className="line-resol"
                                            style={{ left: fwidth + "%" }}
                                          ></span>
                                          <span
                                            className="progspan"
                                            style={{ display: "block" }}
                                          >
                                            {id["POL/POD"]}
                                          </span>
                                        </label>
                                      );
                                    }
                                    if (i === POLPODDatalen - 1) {
                                      return (
                                        <label
                                          className="resol"
                                          style={{
                                            width: wid1 + "%"
                                          }}
                                        >
                                          <span
                                            className="progspan"
                                            style={{
                                              display: "block",
                                              float:
                                                POLPODDatalen < 2
                                                  ? "right"
                                                  : "none"
                                            }}
                                          ></span>
                                        </label>
                                      );
                                    }
                                  })}
                                </div>

                                <progress
                                  className={
                                    "ticket-progress progress-" + eventColor
                                  }
                                  style={{
                                    width: "100%",
                                    "::-webkit-progress-value": {
                                      background: "#000000"
                                    }
                                  }}
                                  value={Number(perBooking)}
                                  max="100"
                                ></progress>
                              </div>
                              <span
                                className="clr-green"
                                style={{
                                  overflow: "initial",
                                  marginTop: "20px"
                                }}
                              >
                                POD
                              </span>
                            </div>
                            <div className="desti-places">
                              {POLPODData.length < 2 ? (
                                <>
                                  <span>
                                    {POLPODData.length > 0
                                      ? POLPODData[0]["POL/POD"]
                                      : ""}
                                  </span>
                                  <span>
                                    {POLPODData.length > 0
                                      ? POLPODData[1]["POL/POD"]
                                      : ""}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {POLPODData.length > 0
                                      ? POLPODData[0]["POL/POD"]
                                      : ""}
                                  </span>
                                  <span>
                                    {POLPODData.length > 0
                                      ? POLPODData[POLPODData.length - 1][
                                          "POL/POD"
                                        ]
                                      : ""}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {containerData.map(function(routedata, i = 0) {
                            i++;
                            return (
                              <div className="sect-padd">
                                <p className="details-heading title-border title-border-t">
                                  {containerData.length === 1
                                    ? "Routing Information"
                                    : "Routing Information -" + i}
                                </p>
                                <div className="row mid-border">
                                  <div
                                    className="col-md-6 details-border"
                                    style={{ border: "none" }}
                                  >
                                    <div className="row">
                                      <div
                                        className="col-md-6 details-border"
                                        style={{
                                          alignItems: "center"
                                        }}
                                      >
                                        <p className="details-title">
                                          Type Of Move
                                        </p>
                                        <p className="details-para">
                                          {routedata.TypeOfMove}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Vessel Name
                                        </p>
                                        <p className="details-para">
                                          {routedata.VesselName}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Departure Port
                                        </p>
                                        <p className="details-para">
                                          {routedata.DeparturePortName}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Destination Port
                                        </p>
                                        <p className="details-para">
                                          {routedata.DestinationPortName}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="col-md-6 details-border"
                                    style={{ border: "none" }}
                                  >
                                    <div className="row">
                                      <div
                                        className="col-md-6 details-border"
                                        style={{
                                          alignItems: "center"
                                        }}
                                      >
                                        <p className="details-title">
                                          Departure Date
                                        </p>
                                        <p className="details-para">
                                          {routedata.DepartureDate}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Arrival Date
                                        </p>
                                        <p className="details-para">
                                          {routedata["Arrival Date"]}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Booking Number
                                        </p>
                                        <p className="details-para">
                                          {routedata["Booking Number"]}
                                        </p>
                                      </div>
                                      <div className="col-md-6 details-border">
                                        <p className="details-title">
                                          Booking Date
                                        </p>
                                        <p className="details-para">
                                          {routedata.BookingDate}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <UncontrolledCollapse
                                  className="cont-deta"
                                  toggler={"#route" + i}
                                >
                                  <div className="collapse-sect">
                                    <div className="row">
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">
                                          Container Agents
                                        </p>
                                        <p className="details-para">
                                          {routedata["Container Agents"]}
                                        </p>
                                      </div>
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">Flag</p>
                                        <p className="details-para">
                                          {routedata.Flag}
                                        </p>
                                      </div>
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">
                                          Voyage Id
                                        </p>
                                        <p className="details-para">
                                          {routedata["Voyage Identification"]}
                                        </p>
                                      </div>
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">
                                          IMO Number
                                        </p>
                                        <p className="details-para">
                                          {routedata["IMO Number"]}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">
                                          Document Cutoff
                                        </p>
                                        <p className="details-para">
                                          {routedata["Document Cutoff"]}
                                        </p>
                                      </div>
                                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                        <p className="details-title">
                                          Port Cutoff
                                        </p>
                                        <p className="details-para">
                                          {routedata["Port Cutoff"]}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </UncontrolledCollapse>
                                <div className="row">
                                  <div className="col-md-12">
                                    <a
                                      href="#!"
                                      id={"route" + i}
                                      className="butn view-btn"
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="ship-detail-maps">
                        <div className="ship-detail-map">
                          <iframe
                            key={this.state.iframeKey}
                            src="/MapHtmlPage.html"
                            className="mapIframe"
                          />
                        </div>
                        <div className="shipment-track-cntr">
                          <div className="shipment-track">
                            <div className="flex-grow-1">
                              <p className="est-title">
                                Estimated Time of Arrival
                              </p>
                              <div className="d-flex justify-content-between">
                                <p className="est-time">{this.state.DData}</p>
                                <p
                                  className="est-time eve-clr"
                                  color={eventColor}
                                >
                                  {this.state.eve !== "N/A"
                                    ? this.state.eve
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="ship-white-cntr">
                              <div className="ship-white">
                                {this.state.ModeType === "Air" ? (
                                  <img src={Plane} alt="Air icon" />
                                ) : this.state.ModeType === "Ocean" ? (
                                  <img src={ShipWhite} alt="ship icon" />
                                ) : this.state.ModeType === "Inland" ? (
                                  <img src={Truck} alt="Truck icon" />
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {approvedDate == "" &&
                          bookDate == "" &&
                          departedDate === "" &&
                          arrivedDate === "" &&
                          deliverDate === "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Booked} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          ) : approvedDate !== "" &&
                            bookDate == "" &&
                            departedDate === "" &&
                            arrivedDate === "" &&
                            deliverDate === "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                  {approvedDate}
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Booked} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          ) : approvedDate !== "" &&
                            bookDate !== "" &&
                            departedDate === "" &&
                            arrivedDate === "" &&
                            deliverDate === "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                  {approvedDate}
                                </p>
                              </div>
                              <div class={bookingIsActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={Booked} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                  {bookDate}
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          ) : departedDate !== "" &&
                            arrivedDate === "" &&
                            deliverDate == "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                  {approvedDate}
                                </p>
                              </div>
                              <div class={bookingIsActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={Booked} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                  {bookDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                  {departedDate}
                                </p>
                              </div>
                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Transit} alt="departed icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>On the Way</span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          ) : arrivedDate !== "" && deliverDate === "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                  {approvedDate}
                                </p>
                              </div>
                              <div class={bookingIsActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={Booked} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                  {bookDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                  {departedDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                  {arrivedDate}
                                </p>
                              </div>
                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Transit} alt="departed icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>On the Way</span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          ) : deliverDate !== "" ? (
                            <div class="track-details">
                              <div class={approvedisActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={ApprovedImg} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Approved : </span>
                                  {approvedDate}
                                </p>
                              </div>
                              <div class={bookingIsActive}>
                                <div class="track-img-cntr">
                                  <div class="track-img ">
                                    <img src={Booked} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                  {bookDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                  {departedDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                  {arrivedDate}
                                </p>
                              </div>

                              <div class="track-line-cntr active">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                  {deliverDate}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div class="track-details">
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Booked} alt="booked icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Booked : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Departed} alt="transit icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Departed : </span>
                                </p>
                              </div>
                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Arrived} alt="arrived icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Arrived : </span>
                                </p>
                              </div>

                              <div class="track-line-cntr">
                                <div class="track-img-cntr">
                                  <div class="track-img">
                                    <img src={Delivery} alt="delivery icon" />
                                  </div>
                                </div>
                                <p>
                                  <span>Delivered : </span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <NotificationContainer leaveTimeout="3000" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackShipment;

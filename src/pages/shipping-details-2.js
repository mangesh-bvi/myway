import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import { UncontrolledCollapse, Button, Modal, ModalBody } from "reactstrap";

import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
// import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import FileUpload from "./../assets/img/file.png";
import Booked from "./../assets/img/booked.png";
import Transit from "./../assets/img/transit-small.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import ApprovedImg from "./../assets/img/approved-status.png";
import Delivery from "./../assets/img/delivery.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import Plane from "./../assets/img/plane.png";
import Truck from "./../assets/img/truck.png";
import PDF from "./../assets/img/pdf.png";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class ShippingDetailsTwo extends Component {
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
      DData: "",
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
      ModaType: "",
      eve: "",
      pageName: "",
      viewFilePath: "",
      delDocuId: "",
      delFileName: "",
      downloadFilePath: "",
      POLPODData: [],
      Table9: []
    };

    this.toggleDel = this.toggleDel.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.togglePackage = this.togglePackage.bind(this);
    this.handleActivityList = this.handleActivityList.bind(this);
    this.HandleShipmentDocument = this.HandleShipmentDocument.bind(this);
    this.HandleDownloadFile = this.HandleDownloadFile.bind(this);
    // this.HandleShowHideFun=this.HandleShowHideFun.bind(this);
    // this.HandleShipmentDetailsMap=this.HandleShipmentDetailsMap.bind(this);
  }

  componentDidMount() {
    localStorage.removeItem(
      "AllLineData",
      "FlagsData",
      "BaloonData",
      "GreenLineData"
    );
    let self = this;
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("=")[1];
    if (url != "" && url != null) {
      self.HandleShipmentDetails(url);
      self.setState({
        addWat: url,
        HblNo: hblno
      });
    } else if (typeof this.props.location.state != "undefined") {
      var hblno = this.props.location.state.detail;
      var event = this.props.location.state.event || "";
      var pageName = this.props.location.state.pageName || "";
      if (event !== "N/A") {
        self.setState({ eve: event });
      }
      self.setState({ HblNo: hblno, pageName });
      self.HandleShipmentDetails(hblno);
      //self.handleActivityList();
    } else {
      this.props.history.push("shipment-summary");
    }
  }

  SendMessage = () => {
    debugger;
    let self = this;
    var hbllNo = document.getElementById("popupHBLNO").value;
    var msgg = document.getElementById("addMess").value;
    if (msgg === "" || msgg === null) {
      NotificationManager.error("Please enter the message.");
    } else {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SendCommonMessage`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc"),
          ReferenceNo: hbllNo.trim(),
          // TypeOfMessage: drpshipment.value.trim(),
          Message: msgg
        },
        headers: authHeader()
      }).then(function(response) {
        if (response != null) {
          if (response.data != null) {
            if (response.data.length > 0) {
              if (response.data[0] != null) {
                var message = response.data[0].Result;
                // self.setState({ MessagesActivityDetails });
                if (response.data[0].Result === "Message Send Successfully") {
                  // setTimeout(() => {
                  // this.handleActivityList();
                  // }, 100);
                  NotificationManager.success(response.data[0].Result);
                }
                self.handleActivityList();
              }
            }
          }
        }
      });
    }
  };

  handleClick = (marker, event) => {
    debugger;
    this.setState({ selectedMarker: "" });
    this.setState({ selectedMarker: marker });
  };
  HandleMapDetailsData(mdetails) {
    var mydata = mdetails.Table;
    let self = this;
    /////Baloon with First's Start
    //// and Last order's end address
    var balloons = [];
    var flags = [];
    //var mainLineData = [];

    var allLineData = [];
    debugger;
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
        if (endLatLong) {
          flagsData.Blat = endLatLong.split(",")[0];
          flagsData.Blong = endLatLong.split(",")[1];
          flagsData.baddr = fcontent;
        }
        flags.push(flagsData);
        ////flags.push(endLatLong);

        balloons.push(BlocationData);
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
        if (endLatLong) {
          BlocationData.lat = endLatLong.split(",")[0];
          BlocationData.long = endLatLong.split(",")[1];
          BlocationData.addr = Econtent;
          ////balloons.push(endLatLong);
        }
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

    localStorage.setItem("BaloonData", JSON.stringify(balloons));
    localStorage.setItem("imgType", JSON.stringify(imgType));
    localStorage.setItem("VesselData", JSON.stringify(VesselData));
    localStorage.setItem("FlagsData", JSON.stringify(flags));
    localStorage.setItem("AllLineData", JSON.stringify(allLineData));
    self.setState({ iframeKey: self.state.iframeKey + 1 });
  }
  HandleShipmentDetailsMap(sid, cid) {
    localStorage.removeItem(
      "AllLineData",
      "FlagsData",
      "BaloonData",
      "GreenLineData"
    );
    debugger;
    let self = this;
    var shipperId = sid;
    var consigneeId = cid;
    var hblno =
      self.state.addWat.replace(/%20/g, " ") ||
      this.state.HblNo.replace(/%20/g, " ");
    var SwitchConsigneeID = 0;
    var SwitchShipperID = 0;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindShipmentSummaryMap`,
      data: {
        ShipperID: shipperId, //1340354108, //shipperId,  //shipperId,
        ConsigneeID: consigneeId, // 1340464123, //consigneeId,  //consigneeId,
        SwitchConsigneeID: 0,
        SwitchShipperID: 0,
        HBLNo: hblno //"BOM 237730" //hblno
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var resdata = response.data;

      self.HandleMapDetailsData(resdata);
    });
  }
  HandleDocumentDownloadFile(evt, row) {
    debugger;
    var filePath = row.original["HBL#"];
  }

  HandleDocumentView(evt, row) {
    debugger;
    var HblNo = row.original["HBL#"];
    var viewFilePath = row.original["FilePath"];
    this.setState({ modalEdit: true, viewFilePath });
  }
  HandleDownloadFile(evt, row) {
    debugger;
    let self = this;
    var HblNo = row.original["HBL#"];
    var downloadFilePath = row.original["FilePath"];
    var fileName = row.original["FileName"];

    axios({
      method: "post",
      url: `${appSettings.APIURL}/DownloadFTPFile`,
      data: {
        MywayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
        FilePath: downloadFilePath
      },
      responseType: "blob",
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        // var documentdata = [];
        // documentdata = response.config.data;
        // documentdata.forEach(function(file, i) {
        //   file.sr_no = i + 1;
        // });
        if (response.data) {
          var blob = new Blob([response.data], { type: "application/pdf" });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }

        // self.setState({ documentData: documentdata });
      })
      .catch(error => {
        debugger;
        // var temperror = error.response.data;
        // var err = temperror.split(":");
        // // NotificationManager.error("No Data Found");
        // var actData = [];
        // actData.push({ DocumentDescription: "No Data Found" });

        // self.setState({ documentData: actData });
      });
  }
  HandleDocumentDelete(evt, row) {
    debugger;
    var HblNo = row.original["HBL#"];
    var delDocuId = row.original["DocumentID"];
    var delFileName = row.original["FileName"];
    this.setState({ modalDel: true, delDocuId, delFileName });
  }

  HandleShipmentDocument() {
    debugger;
    let self = this;
    var HblNo;
    if (typeof this.props.location.state != "undefined") {
      HblNo = this.props.location.state.detail.trim();
    } else {
      HblNo = this.state.addWat || this.state.HblNo;
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/ViewUploadShipmentDocument`,
      data: {
        HBLNo: HblNo
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        var documentdata = [];
        documentdata = response.data;
        documentdata.forEach(function(file, i) {
          file.sr_no = i + 1;
        });

        self.setState({ documentData: documentdata });
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        // NotificationManager.error("No Data Found");
        var actData = [];
        actData.push({ DocumentDescription: "No Data Found" });

        self.setState({ documentData: actData });
      });
  }

  HandleShipmentDetails(hblno) {
    debugger;
    let self = this;
    localStorage.removeItem(
      "AllLineData",
      "FlagsData",
      "BaloonData",
      "GreenLineData"
    );
    localStorage.removeItem("GreenLineData");
    var HblNo = hblno.replace(/%20/g, " ");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentSummaryDetailsAPI`,
      data: {
        // UserId: encryption(window.localStorage.getItem("userid"), "desc"), //874588, // userid,
        // HBLNo: HblNo //HblNo
        UserId: parseFloat(
          encryption(window.localStorage.getItem("userid"), "desc")
        ),
        HBLNo: HblNo
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var shipmentdata = response.data;
      var ModeType = response.data.Table[0].ModeOfTransport;
      var POLPODData = response.data.Table5;
      var Table9 = response.data.Table9;
      var eve = response.data.Table[0].Event;

      self.setState({
        eve,
        detailsData: shipmentdata.Table[0],
        ShipperID: shipmentdata.Table[0].ShipperId,
        addressData: shipmentdata.Table1,
        containerData: shipmentdata.Table2,
        DData:
          shipmentdata.Table2[shipmentdata.Table2.length - 1]["Arrival Date"],
        containerDetails: shipmentdata.Table3,
        bookedStatus: shipmentdata.Table4,
        packageDetails: shipmentdata.Table7,
        ShipmentExistsInWatchList:
          shipmentdata.Table6[0].ShipmentExistsInWatchList,
        packageViewMore: shipmentdata.Table8,
        ModeType
      });
      if (POLPODData.length > 0) {
        self.setState({ POLPODData, Table9 });
      }
      var sid = shipmentdata.Table[0].ShipperId;
      var cid = shipmentdata.Table[0].ConsigneeID;
      self.HandleShipmentDetailsMap(sid, cid);
    });
  }
  onDocumentChangeHandler = event => {
    debugger;
    if (event.target.files[0].type === "application/pdf") {
      this.setState({
        selectedFile: event.target.files[0],
        selectedFileName: event.target.files[0].name
      });
    } else {
      NotificationManager.error("Please upload only PDF File");
    }
  };
  onDocumentConsignee = event => {
    this.setState({
      // selectedFile: event.target.files[0],
      consigneeFileName: event.target.files[0].name
    });
  };
  onDocumentClickHandler = () => {
    debugger;
    let self = this;
    const docData = new FormData();
    var docName = document.getElementById("docName").value;
    var docDesc = document.getElementById("docDesc").value;
    if (docName == "") {
      NotificationManager.error("Please enter document name");
      return false;
    }
    if (docDesc == "") {
      NotificationManager.error("Please enter document description");
      return false;
    }
    debugger;

    docData.append("HBLNo", this.state.HblNo.trim());
    docData.append("DocDescription", docDesc);
    docData.append("name", docName);
    docData.append("FileData", this.state.selectedFile);
    docData.append(
      "CreatedBy",
      encryption(window.localStorage.getItem("userid"), "desc")
    );
    // docData.append()

    axios({
      method: "post",
      url: `${appSettings.APIURL}/UploadShipmentDocument`,
      data: docData,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data[0].Result);
      self.setState({ selectedFileName: "" });
      self.toggleDocu();
      setTimeout(() => {
        self.HandleShipmentDocument();
      }, 100);
    });
  };

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }

  deleteDocument() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/DeleteShipmentDocument`,
      data: {
        DocumentId: self.state.delDocuId,
        FileName: self.state.delFileName,
        DeletedBy: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        NotificationManager.success(response.data[0].Result);
        self.HandleShipmentDocument();
      })
      .catch(error => {});
  }

  togglePackage(cargoId) {
    debugger;
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

  handleChangePage() {
    var pageName = this.state.pageName;

    if (pageName === "Dashboard") {
      this.props.history.push("/Dashboard");
    } else if (pageName === "ShipmentPage") {
      this.props.history.push("/shipment-summary");
    } else {
      this.props.history.push("/Dashboard");
    }
  }

  handleAddToWatchList = () => {
    debugger;
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
    debugger;
    let self = this;
    var HblNo = this.state.HblNo;
    if (typeof this.props.location.state != "undefined") {
      HblNo = this.props.location.state.detail;
    }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/MessagesActivityDetails`,
      data: {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        HBLNO: HblNo.trim()
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        //alert("Sucess")
        self.setState({ MessagesActivityDetails: response.data });
        document.getElementById("addMess").value = "";
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
      });
  }
  handleBackBtn = () => {
    window.history.back();
  };
  handleRemoveWatchList = () => {
    debugger;
    let self = this;
    var hbll = "";
    if (self.state.addWat !== null && self.state.addWat !== "") {
      hbll = self.state.addWat;
    } else {
      hbll = self.state.HblNo;
    }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RemoveFromWatchListAPI`,
      data: {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        HBLNO: hbll
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data[0].Result);
      self.setState({ ShipmentExistsInWatchList: 0 });
    });
  };

  render() {
    let self = this;
    console.log(this.state.POLPODData);

    const {
      detailsData,
      addressData,
      containerData,
      containerDetails,

      documentData,
      bookedStatus,

      packageDetails,

      packageTable,
      POLPODData
    } = this.state;
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
    let destinationPortName = "";

    if (containerData.length === 2) {
      destinationPortName =
        containerData[0].DestinationPortName ===
        containerData[1].DeparturePortName
          ? containerData[0].DestinationPortName.split(",")[0]
          : null;
      // console.log(destinationPortName, "-------------destinationPortName");
    }
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

    var perBooking = "0";

    var POLPODDatalen = POLPODData.length;
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

    if (this.state.Table9.length > 0) {
      debugger;
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
        var  

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

        // perBooking="50"
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
    let Watchlist = "";
    if (this.state.ShipmentExistsInWatchList == 0) {
      Watchlist = (
        <>
          <button
            onClick={this.handleChangePage.bind(this)}
            className="butn mt-0"
          >
            Back
          </button>
          <button onClick={this.handleAddToWatchList} className="butn mt-0">
            Add Watchlist
          </button>
        </>
      );
    } else {
      Watchlist = (
        <>
          <button onClick={this.handleBackBtn} className="butn mt-0">
            Back
          </button>
          <button onClick={this.handleRemoveWatchList} className="butn mt-0">
            Remove Watchlist
          </button>
        </>
      );
    }

    let MsgActivityTab = "";
    if (this.state.MessagesActivityDetails != null) {
      if (this.state.MessagesActivityDetails.length > 0) {
        MsgActivityTab = (
          <div class="d-flex flex-column-reverse">
            {this.state.MessagesActivityDetails.map(team => (
              <div class="p-2">
                <p>{team.Message}</p>
                <div class="d-flex justify-content-between">
                  {/* <div>
                    <span>
                      Created by:
                      {encryption(
                        window.localStorage.getItem("username"),
                        "desc"
                      )}
                    </span>
                  </div> */}
                  {team.MessageCreationTime}
                </div>
                <hr />
              </div>
            ))}
          </div>
        );
      }
    }

    let className = "butn view-btn less-btn";
    if (this.state.showContent == true) {
      className = "butn view-btn less-btn";
    } else {
      className = "butn view-btn";
    }
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-7 p-0 ship-dtls-ui">
                  <div className="title-sect d-block-xs">
                    <h2>Details View</h2>
                    <div>{Watchlist}</div>
                  </div>
                  <ul className="nav cust-tabs d-block-xs" role="tablist">
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
                    <li>
                      <a
                        id="documents-tab"
                        data-toggle="tab"
                        href="#documents"
                        role="tab"
                        aria-controls="documents"
                        aria-selected="false"
                        onClick={this.HandleShipmentDocument.bind(this)}
                      >
                        Documents
                      </a>
                    </li>
                    <li>
                      <a
                        id="activity-tab"
                        data-toggle="tab"
                        href="#activity"
                        role="tab"
                        aria-controls="activity"
                        aria-selected="false"
                        onClick={this.handleActivityList.bind(this)}
                      >
                        Activity
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
                            <span href="#!" className="details-para">
                              {detailsData.HBLNO}
                              <input
                                type="hidden"
                                value={detailsData.HBLNO}
                                id="popupHBLNO"
                              />
                            </span>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                            <p className="details-title">BL#</p>
                            <p className="details-para">{detailsData.BLNo}</p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                            <p className="details-title">MyWay#</p>
                            <p className="details-para">
                              {detailsData.MyWayNumber}
                            </p>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                            <p className="details-title">Status</p>
                            <p className="details-para">{detailsData.Status}</p>
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
                      <div className="sect-padd">
                        <div className="row">
                          {addressData.map(function(addkey, i) {
                            //  <p className="details-heading" key={i}>{addkey.EntityType}</p>

                            return (
                              <div
                                className="col-md-6 details-border shipper-details"
                                key={i}
                              >
                                <p className="details-heading">
                                  {addkey.EntityType}
                                </p>
                                <p className="details-title">
                                  {addkey.CustomerName}
                                </p>

                                {/* <p className="details-title">
                                  Blueground Turizm Ve Services Hizmetleri
                                  Ticaret A.S.
                                </p> */}
                                <p className="details-para">
                                  {addkey.Address1}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        {/* <div className="row">
                          <div className="col-md-12">
                            <a href="#!" className="butn view-btn">
                              View more
                            </a>
                          </div>
                        </div> */}
                      </div>
                      <div className="progress-sect">
                        <div className="d-flex align-items-center">
                          <div className="mobilenumber-resp"></div>

                          <span
                            className="clr-green"
                            style={{ overflow: "initial", marginTop: "20px" }}
                          >
                            POL
                          </span>
                          <div className="pol-pod-progress">
                            <div className="mobilenumber-resp">
                              {this.state.ModeOfTransport != "Inland" &&
                                this.state.POLPODData.map(function(id, i) {
                                  var wid = 100 / (POLPODDatalen - 1);
                                  var wid1 = 100 / POLPODDatalen;
                                  // var fwid = wid + wid / 2 + "%";

                                  if (i === 0) {
                                    return (
                                      <label
                                        className="resol"
                                        style={{ width: wid1 + "%" }}
                                      >
                                        {/* <span className="line-resol" style={{left: wid + "%"}}></span> */}
                                        <span
                                          className="progspan"
                                          style={{
                                            display: "block",
                                            float:
                                              POLPODDatalen < 2
                                                ? "left"
                                                : "none"
                                          }}
                                        >
                                          {/* {id["POL/POD"]} */}
                                        </span>
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
                                        {/* <span className="line-resol"></span> */}
                                        <span
                                          className="progspan"
                                          style={{
                                            display: "block",
                                            float:
                                              POLPODDatalen < 2
                                                ? "right"
                                                : "none"
                                          }}
                                        >
                                          {/* {id["POL/POD"]} */}
                                        </span>
                                      </label>
                                    );
                                  }
                                })}

                              {/* <label className="resol">
                                <span className="line-resol"></span>B
                              </label>
                              <label className="resol">
                                <span className="line-resol"></span>C
                              </label>
                              <label className="resol">
                                <span className="line-resol"></span>D
                                </label> */}
                            </div>
                            {/* <Progress className="ticket-progress" color={eventColor} value={perBooking} /> */}
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
                            style={{ overflow: "initial", marginTop: "20px" }}
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
                                  ? POLPODData[POLPODData.length - 1]["POL/POD"]
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
                            <p className="details-heading">
                              {containerData.length == 1
                                ? "Routing Information"
                                : "Routing Information -" + i}
                            </p>
                            <div className="row mid-border">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                                <div className="row">
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Type of Move
                                    </p>
                                    <p className="details-para">
                                      {routedata.TypeOfMove}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">Vessel Name</p>
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
                              <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                                <div className="row">
                                  <div className="col-md-6 details-border">
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
                                    <p className="details-title">Voyage Id</p>
                                    <p className="details-para">
                                      {routedata["Voyage Identification"]}
                                    </p>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                    <p className="details-title">IMO Number</p>
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
                                    <p className="details-title">Port Cutoff</p>
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
                                >
                                  {/* Show Less */}
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {this.state.ModeType === "Air" ? (
                        ""
                      ) : (
                        <div className="sect-padd">
                          <p className="details-heading">Container Details</p>
                          <div className="cont-det-outer">
                            {containerDetails.map(function(cntrDet, i = 0) {
                              i++;
                              return (
                                <div className="cont-det-cntr">
                                  <div className="row">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Container Number
                                      </p>
                                      <p className="details-para">
                                        {cntrDet["Container Number"]}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Container Code / Type
                                      </p>
                                      <p className="details-para">
                                        {cntrDet.ContainerCode} {"/"}
                                        {cntrDet.ContainerType}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Seal No.1</p>
                                      <p className="details-para">
                                        {cntrDet.SealNo1}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Seal No.2</p>
                                      <p className="details-para">
                                        {cntrDet.SealNo2}
                                      </p>
                                    </div>
                                  </div>
                                  <UncontrolledCollapse
                                    className="cont-deta"
                                    toggler={"#toggler" + i}
                                  >
                                    <div className="collapse-sect">
                                      <div className="row">
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">Unit</p>
                                          <p className="details-para">
                                            {cntrDet.Unit}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Height
                                          </p>
                                          <p className="details-para">
                                            {cntrDet.height}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">Width</p>
                                          <p className="details-para">
                                            {cntrDet.width}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Length
                                          </p>
                                          <p className="details-para">
                                            {cntrDet.length}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Gross Weight
                                          </p>
                                          <p className="details-para">
                                            {cntrDet["Gross Weight"]}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Net Weight
                                          </p>
                                          <p className="details-para">
                                            {cntrDet.NetWeight}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Volume Weight
                                          </p>
                                          <p className="details-para">
                                            {cntrDet.VolumeWeight}
                                          </p>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                          <p className="details-title">
                                            Description
                                          </p>
                                          <p className="details-para">
                                            {cntrDet.Description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </UncontrolledCollapse>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <a
                                        href="#!"
                                        id={"toggler" + i}
                                        className="butn view-btn"
                                        // onClick={() =>
                                        //   self.setState({
                                        //     showContent: !self.state.showContent
                                        //   })
                                        // }
                                      >
                                        {/* {self.state.showContent ? (
                                      <span>VIEW LESS</span>
                                    ) : (
                                      <span>VIEW MORE</span>
                                    )} */}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="sect-padd">
                        <p className="details-heading">Package Details</p>
                        {packageDetails.length === 0 ? (
                          <p className="text-center">No details found</p>
                        ) : (
                          ""
                        )}
                        {packageDetails.map(function(packData, i) {
                          return (
                            <>
                              <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-3 details-border">
                                  <p className="details-title">Package Type</p>
                                  <p className="details-para">
                                    {packData.PackageType}
                                  </p>
                                </div>
                              </div>
                              <UncontrolledCollapse
                                className="cont-deta"
                                toggler={"#package" + i}
                              >
                                <div className="collapse-sect">
                                  <div className="row">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Case Number
                                      </p>
                                      <p className="details-para">
                                        {packData.CaseNumber}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Units</p>
                                      <p className="details-para">
                                        {packData.UnitType}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Package Count
                                      </p>
                                      <p className="details-para">
                                        {packData.PackageCount}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Length</p>
                                      <p className="details-para">
                                        {/* {packData.Length} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.Length.toFixed(2) + " cm"
                                          : packData.Length.toFixed(2) + " in"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Width</p>
                                      <p className="details-para">
                                        {/* {packData.Width} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.Width.toFixed(2) + " cm"
                                          : packData.Width.toFixed(2) + " in"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Height</p>
                                      <p className="details-para">
                                        {/* {packData.Height} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.Height.toFixed(2) + " cm"
                                          : packData.Height.toFixed(2) + " in"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Net Weight
                                      </p>
                                      <p className="details-para">
                                        {/* {packData.NetWeight} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.NetWeight.toFixed(2) +
                                            " kgs"
                                          : packData.NetWeight.toFixed(2) +
                                            " lbs"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Gross Weight
                                      </p>
                                      <p className="details-para">
                                        {/* {packData.GrossWeight} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.GrossWeight.toFixed(2) +
                                            " kgs"
                                          : packData.GrossWeight.toFixed(2) +
                                            " lbs"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">Volume</p>
                                      <p className="details-para">
                                        {/* {packData.Volume} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.Volume.toFixed(2) + " cbm"
                                          : packData.Volume.toFixed(2) + " ft"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Volume Weight
                                      </p>
                                      <p className="details-para">
                                        {/* {packData.VolumeWeight} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.VolumeWeight.toFixed(2) +
                                            " kgs"
                                          : packData.VolumeWeight.toFixed(2) +
                                            " lbs"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Total Net Weight
                                      </p>
                                      <p className="details-para">
                                        {/* {packData.TotalNetWeight} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.TotalNetWeight.toFixed(2) +
                                            " kgs"
                                          : packData.TotalNetWeight.toFixed(2) +
                                            " lbs"}
                                      </p>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 details-border">
                                      <p className="details-title">
                                        Total Gross Weight
                                      </p>
                                      <p className="details-para">
                                        {/* {packData.TotalGrossWeight} */}
                                        {packData.UnitType === "Metric"
                                          ? packData.TotalGrossWeight.toFixed(
                                              2
                                            ) + " kgs"
                                          : packData.TotalGrossWeight.toFixed(
                                              2
                                            ) + " lbs"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </UncontrolledCollapse>
                              <div className="row">
                                <div className="col-md-12">
                                  <a
                                    href="#!"
                                    id={"package" + i}
                                    className="butn view-btn mr-2"
                                  >
                                    {/* Show Less */}
                                  </a>
                                  <button
                                    onClick={() =>
                                      self.togglePackage(packData.CargoPackID)
                                    }
                                    className="butn view-btn"
                                  >
                                    View Items
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="documents"
                      role="tabpanel"
                      aria-labelledby="documents-tab"
                    >
                      <div className="add-docu-btn">
                        <button onClick={this.toggleDocu} className="butn mt-0">
                          Add Document
                        </button>
                      </div>
                      <div className="table-scroll">
                        <ReactTable
                          data={documentData}
                          showPagination={true}
                          noDataText=""
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "Sr_No",
                                  accessor: "sr_no"
                                },

                                {
                                  Header: "Title",
                                  accessor: "DocumentDescription",
                                  Cell: row => {
                                    return (
                                      <div>
                                        {row.original["DocumentDescription"]}
                                        <img
                                          src={PDF}
                                          alt="PDF icon"
                                          className="cls-pdf"
                                        />
                                      </div>
                                    );
                                  }
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
                                          {/* <img
                                            className="actionicon"
                                            src={Eye}
                                            alt="view-icon"
                                            onClick={e =>
                                              this.HandleDocumentView(e, row)
                                            }
                                          /> */}
                                          {row.original["DocumentType"] ==
                                          "Uploaded" ? (
                                            <img
                                              className="actionicon"
                                              src={Delete}
                                              alt="delete-icon"
                                              onClick={e =>
                                                this.HandleDocumentDelete(
                                                  e,
                                                  row
                                                )
                                              }
                                            />
                                          ) : null}
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
                          // getTrProps={this.HandleDEDFile.bind(this)}
                          defaultPageSize={5}
                          className="-striped -highlight"
                          minRows={1}
                        />
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="activity"
                      role="tabpanel"
                      aria-labelledby="activity-tab"
                    >
                      <div className="mb-4">
                        <textarea
                          className="txt-add"
                          placeholder="Add Message"
                          id="addMess"
                        ></textarea>
                        <div className="text-right">
                          <a
                            href="#!"
                            onClick={this.SendMessage}
                            className="butn"
                          >
                            Post
                          </a>
                        </div>
                      </div>
                      {MsgActivityTab}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-5">
                  <div className="ship-detail-maps">
                    <div className="ship-detail-map">
                      {/* <MapWithAMakredInfoWindow
                        markers={MapsDetailsData}
                        onClick={this.handleClick}
                        selectedMarker={this.state.selectedMarker}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                        containerElement={
                          <div style={{ height: `100%`, width: "100%" }} />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                        loadingElement={<div style={{ height: `100%` }} />}
                      ></MapWithAMakredInfoWindow> */}
                      {/* <object
                        width="100%"
                        height="100%"
                        data="/MapHtmlPage.html"
                      ></object> */}
                      <iframe
                        key={this.state.iframeKey}
                        src="/MapHtmlPage.html"
                        className="mapIframe"
                      />
                    </div>
                    <div className="shipment-track-cntr">
                      <div className="shipment-track">
                        <div className="flex-grow-1">
                          <p className="est-title">Estimated Time of Arrival</p>
                          <div className="d-flex justify-content-between">
                            <p className="est-time">
                              {/* {this.state.containerData[0].DepartureDate} */}
                              {this.state.DData}
                              {/* 4545 */}
                            </p>
                            <p className="est-time eve-clr" color={eventColor}>
                              {this.state.eve !== "N/A" ? this.state.eve : ""}
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
                                <img src={Departed} alt="Departed" />
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
                                <img src={Departed} alt="Departed" />
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
                                <img src={Departed} alt="Departed" />
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
                          {/* <div class="track-hide">
                        <div class="track-img-cntr">
                          <div class="track-img">
                            <img src="" alt="inland icon" />
                          </div>
                        </div>
                        <p>
                          <span>Inland Transportation : </span>
                        </p>
                      </div> */}
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
                                <img src={Departed} alt="Departed" />
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
                                <img src={Departed} alt="Departed" />
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
                                <img src={Departed} alt="Departed" />
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
                                <img src={Departed} alt="Departed" />
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
                          {/* <div class="track-hide">
                        <div class="track-img-cntr">
                          <div class="track-img">
                            <img src="" alt="inland icon" />
                          </div>
                        </div>
                        <p>
                          <span>Inland Transportation : </span>
                        </p>
                      </div> */}
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
                <Modal
                  className="delete-popup package-popup"
                  isOpen={this.state.modalPackage}
                  toggle={this.togglePackage}
                >
                  <ModalBody>
                    <ReactTable
                      data={packageTable}
                      // noDataText="<i className='fa fa-refresh fa-spin'></i>"
                      noDataText=""
                      columns={[
                        {
                          columns: [
                            {
                              Header: "Type",
                              accessor: "Packagetype",
                              sortable: true
                            },
                            {
                              Header: "PO Number",
                              accessor: "Ponumber"
                            },
                            {
                              Header: "Product Id",
                              accessor: "Productid"
                            },
                            {
                              Header: "Description",
                              accessor: "Description"
                            },
                            {
                              Header: "Qty Ordered",
                              accessor: "Qtyordered"
                            },
                            {
                              Header: "Qty Shipped",
                              accessor: "Qtyshipped"
                            },
                            {
                              Header: "UOM",
                              accessor: "Uomeasurement"
                            },
                            {
                              Header: "Net Weight",
                              accessor: "Netwt"
                            },
                            {
                              Header: "Gross Weight",
                              accessor: "Grosswt"
                            }
                          ]
                        }
                      ]}
                      className="-striped -highlight"
                      defaultPageSize={10}
                      minRows={0}
                    />
                    <Button
                      className="butn cancel-butn"
                      onClick={this.togglePackage}
                    >
                      Close
                    </Button>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delete-popup"
                  isOpen={this.state.modalDel}
                  toggle={this.toggleDel}
                  centered={true}
                >
                  <ModalBody>
                    <p>Are you sure ?</p>
                    <Button
                      className="butn"
                      onClick={() => {
                        this.toggleDel();
                        this.deleteDocument();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleDel}
                    >
                      No
                    </Button>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delete-popup pol-pod-popup"
                  isOpen={this.state.modalDocu}
                  toggle={this.toggleDocu}
                  centered={true}
                >
                  <ModalBody>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      onClick={this.toggleDocu}
                    >
                      <span>&times;</span>
                    </button>
                    <div
                      style={{
                        background: "#fff",
                        padding: "15px",
                        borderRadius: "15px"
                      }}
                    >
                      <div className="rename-cntr login-fields">
                        <label>Document Name</label>
                        <input
                          id="docName"
                          type="text"
                          placeholder="Enter Document Name"
                        />
                      </div>
                      <div className="rename-cntr login-fields">
                        <label>Document Description</label>
                        <input
                          id="docDesc"
                          type="text"
                          placeholder="Enter Document Description"
                        />
                      </div>
                      <div className="rename-cntr login-fields d-block">
                        {/* <input
                        type="file"
                        onChange={this.onDocumentChangeHandler}
                      ></input> */}
                        <div className="d-flex w-100 align-items-center">
                          <label>Document File</label>
                          <div className="w-100">
                            <input
                              id="file-upload"
                              className="file-upload d-none"
                              type="file"
                              //accept="application/pdf"
                              onChange={this.onDocumentChangeHandler}
                            />
                            <label htmlFor="file-upload">
                              <div className="file-icon">
                                <img src={FileUpload} alt="file-upload" />
                              </div>
                              Add Document Files
                            </label>
                          </div>
                        </div>
                        <p className="file-name">
                          {this.state.selectedFileName}
                        </p>
                      </div>
                     
                      <Button
                        className="butn"
                        onClick={() => {
                          // this.toggleDocu();
                          this.onDocumentClickHandler();
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delete-popup"
                  isOpen={this.state.modalEdit}
                  toggle={this.toggleEdit}
                  centered={true}
                >
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                      <iframe
                        // src="https://vizio.atafreight.com/WebVizio_3_0/TAndC/ClickToAccept.pdf#toolbar=0&navpanes=0&scrollbar=0"
                        src={
                          this.state.viewFilePath +
                          "#toolbar=0&navpanes=0&scrollbar=0"
                        }
                        title="Document View"
                        className="agreement-pdf"
                      ></iframe>
                    </div>

                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleEdit}
                    >
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal>
              </div>
              <NotificationContainer leaveTimeout="3000" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingDetailsTwo;

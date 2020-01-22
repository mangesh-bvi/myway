import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import {
  UncontrolledCollapse,
  Progress,
  Button,
  Modal,
  ModalBody
} from "reactstrap";

// import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import FileUpload from "./../assets/img/file.png";
import Booked from "./../assets/img/booked.png";
import Transit from "./../assets/img/transit-small.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Plane from "./../assets/img/plane.png";
import Truck from "./../assets/img/truck.png";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import ReactTable from "react-table";

import "react-table/react-table.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
const { compose } = require("recompose");

const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 67.78319374 }}
    defaultZoom={2}
  >
    {props.markers.map((marker, i) => {
      debugger;

      var iCount = props.markers.length;
      var start = marker.StartLatLng;
      var end = marker.EndLatLng;
      var cRouteLatLong = marker.CRouteLatLong;
      // const onClick = props.onClick.bind(this, i);
      let iconMarker = new window.google.maps.MarkerImage(
        null,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );

      return (
        <>
          {marker.CTransShipPort !== "" ? (
            <Marker
              key={marker.CTransShipPort}
              title={marker.CTransShipPort}
              position={{
                lat: cRouteLatLong[0].lat,
                lng: cRouteLatLong[0].lng
              }}
            />
          ) : null}
          {marker.ORDERID === 1 ? (
            <>
              <Marker
                key={start[0].lat}
                icon={iconMarker}
                onClick={props.onClick.bind(this, start[0].lat)}
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              >
                {props.selectedMarker === start[0].lat && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.ShipperName}</h4>
                      <br />
                      <b>{marker.StartLocation}</b>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              <Marker
                key={end[0].lat}
                onClick={props.onClick.bind(this, end[0].lat)}
                position={{
                  lat: end[0].lat,
                  lng: end[0].lng
                }}
              >
                {props.selectedMarker === end[0].lat && (
                  <InfoWindow>
                    <div>
                      <h4>{marker.EndLocation}</h4>
                      <br />
                      <p>
                        Transit time From {marker.StartLocation} To{" "}
                        {marker.EndLocation} is:
                        <b>
                          {" "}
                          {marker.NTransit_Time} (Max {marker.NMax_Transit_Time}
                          , Min {marker.NMin_Transit_Time}) days
                        </b>
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          ) : null}
          {marker.EndLatLng[0].lat !== props.markers[i].StartLocation[0].lat &&
          marker.EndLatLng[0].lng !== props.markers[i].StartLocation[0].lng &&
          iCount !== marker.ORDERID ? (
            <Marker
              key={end[0].lat}
              onClick={props.onClick.bind(this, end[0].lat)}
              position={{
                lat: end[0].lat,
                lng: end[0].lng
              }}
            >
              {props.selectedMarker === end[0].lat && (
                <InfoWindow>
                  <div>
                    <h4>{marker.EndLocation}</h4>
                    <br />
                    <p>
                      Transit time From {marker.StartLocation} To{" "}
                      {marker.EndLocation} is:
                      <b>
                        {" "}
                        {marker.NTransit_Time} (Max {marker.NMax_Transit_Time},
                        Min {marker.NMin_Transit_Time}) days
                      </b>
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ) : (
            <Marker
              key={end[0].lat}
              //icon={iconMarker}
              onClick={props.onClick.bind(this, end[0].lat)}
              position={{
                lat: end[0].lat,
                lng: end[0].lng
              }}
            >
              {props.selectedMarker === end[0].lat && (
                <InfoWindow>
                  <div>
                    <h4>{marker.EndLocation}</h4>
                    <br />
                    <p>
                      Transit time From {marker.StartLocation} To{" "}
                      {marker.EndLocation} is:
                      <b>
                        {" "}
                        {marker.NTransit_Time} (Max {marker.NMax_Transit_Time},
                        Min {marker.NMin_Transit_Time}) days
                      </b>
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}
        </>
      );
    })}
  </GoogleMap>
));

class TrackShipment2 extends Component {
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
    // this.HandleDownloadFile=this.HandleDownloadFile.bind(this);
    // this.HandleShowHideFun=this.HandleShowHideFun.bind(this);
    // this.HandleShipmentDetailsMap=this.HandleShipmentDetailsMap.bind(this);
  }

  componentDidMount() {
    debugger;
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
          ReferenceNo: hbllNo,
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
    debugger;

    var mydata = mdetails.Table;
    let self = this;
    /////Baloon with First's Start
    //// and Last order's end address
    var balloons = [];
    var flags = [];
    //var mainLineData = [];

    var allLineData = [];
    for (var i = 0; i < mydata.length; i++) {
      debugger;
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
      // var splitRouteLatLong = RouteLatLong.split(";");
      // for (var j = 0; j < splitRouteLatLong.length; j++) {
      //   var lineData = {};
      //   var tempSData = splitRouteLatLong[j].split(",");
      //   lineData.lat = Number(tempSData[0]);
      //   lineData.lng = Number(tempSData[1]);
      //   allLineData.push(lineData);
      // }
      var Not_Data = 0;
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
        debugger;
        Not_Data = i;
      }

      //mainLineData = allLineData;
    }
    localStorage.removeItem("BaloonData");
    localStorage.removeItem("FlagsData");
    localStorage.removeItem("AllLineData");

    debugger;
    localStorage.setItem("BaloonData", JSON.stringify(balloons));
    localStorage.setItem("FlagsData", JSON.stringify(flags));
    localStorage.setItem("AllLineData", JSON.stringify(allLineData));
    self.setState({ iframeKey: self.state.iframeKey + 1 });
  }
  HandleShipmentDetailsMap(Encodedhblno) {
    debugger;
    let self = this;

    axios({
      method: "get",
      url: `${appSettings.APIURL}/AnonymousBindShipmentSummaryMap`,
      params: {
        Token: Encodedhblno.replace("%20", " ")
      }
      //headers: authHeader()
    }).then(function(response) {
      debugger;
      var resdata = response.data;
      self.setState({ loading: false ,showData:true});
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
    this.setState({ modalEdit: true });
  }
  HandleDocumentDelete(evt, row) {
    debugger;
    var HblNo = row.original["HBL#"];
    this.setState({ modalDel: true });
  }

  HandleShipmentDocument() {
    debugger;
    let self = this;
    var HblNo;
    if (typeof this.props.location.state != "undefined") {
      HblNo = this.props.location.state.detail;
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

  HandleShipmentDetails(Encodedhblno) {
    debugger;
    this.setState({ loading: true });
    let self = this;
    axios({
      method: "get",
      url: `${appSettings.APIURL}/AnonymousShipmentSummaryDetailsAPI`,
      params: {
        Token: Encodedhblno.replace("%20", " ")
        // UserId: encryption(window.localStorage.getItem("userid"), "desc"), //874588, // userid,
        // HBLNo: HblNo //HblNo
        // UserId: 874588,
        // HBLNo: hblno //HblNo
      }
      //headers: authHeader()
    }).then(function(response) {
      debugger;
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
          shipmentdata.Table2[shipmentdata.Table2.length - 1]["Arrival Date"],
        ShipmentExistsInWatchList:
          shipmentdata.Table6[0].ShipmentExistsInWatchList,
        packageViewMore: shipmentdata.Table8
      });

      var sid = shipmentdata.Table[0].ShipperId;
      var cid = shipmentdata.Table[0].ConsigneeID;
      self.HandleShipmentDetailsMap(Encodedhblno);
    });
  }
  onDocumentChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };
  onDocumentConsignee = event => {
    this.setState({
      // selectedFile: event.target.files[0],
      consigneeFileName: event.target.files[0].name
    });
  };
  onDocumentClickHandler = () => {
    debugger;
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
    //docData.append();
    docData.append("ShipmentNumber", "BCM2453770");
    docData.append("HBLNo", "BCM23770");
    docData.append("DocDescription", docDesc);
    docData.append("name", docName);
    docData.append("FileData", this.state.selectedFile);
    // docData.append()

    axios({
      method: "post",
      url: `${appSettings.APIURL}/UploadShipmentDocument`,
      data: docData,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.success(response.data[0].Result);
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

  onEntered() {
    // this.setState({ status: "Opened" });
    console.log(1);
  }
  handleChangePage() {
    window.history.back();
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
      debugger;
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
    // if (typeof this.props.location.state != "undefined") {

    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    //alert(HblNo)

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
        debugger;
        //alert("Sucess")
        self.setState({ MessagesActivityDetails: response.data });
        document.getElementById("addMess").value = "";
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        //NotificationManager.error(err[1].replace("}", ""));
      });
    // }
  }

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
      NotificationManager.error(response.data[0].Result);
      self.setState({ ShipmentExistsInWatchList: 0 });
    });
  };

  HandleChangeHBL(e) {
    debugger;
    var HBLNumber = e.target.value;
    this.setState({ HBLNumber });
  }
  HandleSubmit() {
    debugger;
    if (this.state.addWat.replace("%20", " ").trim() === this.state.HBLNumber) {
      // this.setState({ showData: true });
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
    const {
      detailsData,
      POLPODData,
      containerData,

      bookedStatus,

      packageTable
    } = this.state;

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
      if (bookedStatus[index].Status == "Booked") {
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
    debugger;
    if (this.state.Table9.length > 0) {
      debugger;
      var Transshipped = this.state.Table9.filter(
        x => x.Status === "Transshipped"
      ).length;

      var Arriveddata = this.state.Table9.filter(x => x.Status === "Arrived")
        .length;
      var Delivered = this.state.Table9.filter(x => x.Status === "Delivered")
        .length;
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
    console.log(this.state.showData, "----------showdata");
    console.log(this.state.loading, "----------loading");

    return (
      <div>
        {/* <Headers /> */}
        <div className="cls-ofl">
          {/* <div className="cls-flside">
            <SideMenu />
          </div> */}
          <div className="cls-rt-ts">
            <div className="container-fluid">
              <div>
                <div className="title-sect ts-head">
                  {this.state.showData === false &&
                  this.state.loading === true ? (
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
                                <span  className="details-para">
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
                              <p className="est-title">
                                Estimated Time of Arrival
                              </p>
                              <div className="d-flex justify-content-between">
                                <p className="est-time">
                                  {/* {this.state.containerData[0].DepartureDate} */}
                                  {this.state.DData}
                                  {/* 4545 */}
                                </p>
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
                          <div className="track-details">
                            <div className={bookingIsActive}>
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  <img src={Booked} alt="booked icon" />
                                </div>
                              </div>
                              <p>
                                <span>Booked : </span>
                                {bookDate}
                              </p>
                            </div>
                            <div className={departedIsActive + " active"}>
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  {/* <img src={Departed} alt="departed icon" /> */}
                                  <img
                                    src={
                                      departedDate === "" ||
                                      departedDate === null
                                        ? Transit
                                        : Departed
                                    }
                                    alt="departed icon"
                                  />
                                </div>
                              </div>
                              <p>
                                <span>
                                  {departedDate === "" || departedDate === null
                                    ? "On the way"
                                    : "Departed :"}
                                </span>
                                {departedDate}
                              </p>
                            </div>
                            <div
                              className={
                                departedDate === "" || departedDate === null
                                  ? "track-line-cntr"
                                  : "track-line-cntr active"
                              }
                            >
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  <img
                                    src={
                                      departedDate === "" ||
                                      departedDate === null
                                        ? Departed
                                        : arrivedDate !== null ||
                                          arrivedDate !== ""
                                        ? Arrived
                                        : Transit
                                    }
                                    alt="transit icon"
                                  />
                                </div>
                              </div>
                              <p>
                                <span>
                                  {departedDate === "" || departedDate === null
                                    ? "Departed : "
                                    : arrivedDate !== null || arrivedDate !== ""
                                    ? "Arrived : "
                                    : "On the way"}
                                </span>
                                {arrivedDate !== null || arrivedDate !== ""
                                  ? arrivedDate
                                  : null}
                                {/* {arrivedDate} */}
                              </p>
                            </div>
                            <div className={arrivedIsActive}>
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  {/* <img src={Arrived} alt="arrived icon" /> */}
                                  <img
                                    src={
                                      deliverDate !== null || deliverDate !== ""
                                        ? Transit
                                        : Arrived
                                    }
                                    alt="arrived icon"
                                  />
                                </div>
                              </div>
                              <p>
                                <span>
                                  {arrivedDate === "" || arrivedDate === null
                                    ? "Arrived : "
                                    : deliverDate !== null || deliverDate !== ""
                                    ? "On the way"
                                    : "Delivered : "}
                                </span>
                                {/* {arrivedDate} */}
                                {deliverDate !== null || deliverDate !== ""
                                  ? deliverDate
                                  : null}
                              </p>
                            </div>
                            <div className={inlandIsActive}>
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  <img src={Inland} alt="inland icon" />
                                </div>
                              </div>
                              <p>
                                <span>Inland Transportation : </span>
                                {inlandDate}
                              </p>
                            </div>
                            {/* {deliverDate !== null || deliverDate !== "" ? null : (
                          <div className={deliveredIsActive}>
                            <div className="track-img-cntr">
                              <div className="track-img">
                                <img src={Delivery} alt="delivery icon" />
                              </div>
                            </div>
                            <p>
                              <span>Delivered : </span>
                              {deliverDate}
                            </p>
                          </div>
                        )} */}
                            <div className={deliveredIsActive}>
                              <div className="track-img-cntr">
                                <div className="track-img">
                                  <img src={Delivery} alt="delivery icon" />
                                </div>
                              </div>
                              <p>
                                <span>Delivered : </span>
                                {deliverDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    <Button className="butn" onClick={this.toggleDel}>
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
                      <p className="file-name">{this.state.selectedFileName}</p>
                    </div>
                    <div className="rename-cntr login-fields d-block">
                      <div className="d-flex w-100 align-items-center">
                        <label>Consignee Document</label>
                        <div className="w-100">
                          <input
                            id="docu-upload"
                            className="file-upload d-none"
                            type="file"
                            onChange={this.onDocumentConsignee}
                          />
                          <label htmlFor="docu-upload">
                            <div className="file-icon">
                              <img src={FileUpload} alt="file-upload" />
                            </div>
                            Add Consignee Files
                          </label>
                        </div>
                      </div>
                      <p className="file-name">
                        {this.state.consigneeFileName}
                      </p>
                    </div>
                    {/* <div>
                      <input
                        type="button"
                        onClick={this.onDocumentClickHandler}
                        value="Save"
                      ></input>
                    </div> */}
                    <Button
                      className="butn"
                      onClick={() => {
                        this.toggleDocu();
                        this.onDocumentClickHandler();
                      }}
                    >
                      Add
                    </Button>
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
                        src="https://vizio.atafreight.com/WebVizio_3_0/TAndC/ClickToAccept.pdf#toolbar=0&navpanes=0&scrollbar=0"
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

export default TrackShipment2;

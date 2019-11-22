import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import {
  UncontrolledCollapse,
  Progress,
  Button,
  Modal,
  ModalBody
} from "reactstrap";
import GoogleMapReact from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
// import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import FileUpload from "./../assets/img/file.png";
import Booked from "./../assets/img/booked.png";
import Transit from "./../assets/img/transit-small.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Eye from "./../assets/img/eye.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
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
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
const { compose } = require("recompose");

var docuemntFileName = "";

const SourceIcon = () => (
  <div className="map-icon source-icon">
    <img src={ShipWhite} />
  </div>
);
const DestiIcon = () => (
  <div className="map-icon desti-icon">
    <img src={ShipWhite} />
  </div>
);
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
      containerDetails: [],
      ShowCard: true,
      documentData: [],
      sr_no: 0,
      filtered: [],
      viewDocument: false,
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
      MessagesActivityDetails: [],
      iframeKey: 0
    };

    this.toggleDel = this.toggleDel.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.togglePackage = this.togglePackage.bind(this);
    //this.handleActivityList = this.handleActivityList.bind(this);
    // this.HandleDownloadFile=this.HandleDownloadFile.bind(this);
    // this.HandleShowHideFun=this.HandleShowHideFun.bind(this);
    // this.HandleShipmentDetailsMap=this.HandleShipmentDetailsMap.bind(this);
  }

  componentDidMount() {
    debugger;
    let self = this;
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("=")[1];
    if (url != "" && url != null) {
      self.HandleShipmentDetails(url);
    } else if (typeof this.props.location.state != "undefined") {
      var hblno = this.props.location.state.detail;
      self.HandleShipmentDetails(hblno);
      //self.handleActivityList();
      self.setState({ HblNo: hblno });
    } else {
      this.props.history.push("shipment-summary");
    }
  }

  handleClick = (marker, event) => {
    debugger;
    this.setState({ selectedMarker: "" });
    this.setState({ selectedMarker: marker });
  };
  HandleMapDetailsData(mdetails) {
    debugger;

    // var PinModalData = [];
    // var RouteData = [];

    // for (let i = 0; i < DetailsData.length; i++) {
    //   var finalList = new Object();

    //   // var orderId = DetailsData[i].ORDERID;
    //   finalList.ORDERID = DetailsData[i].ORDERID;
    //   finalList.CModeOfTransport = DetailsData[i].CModeOfTransport;
    //   finalList.StartLocation = DetailsData[i].StartLocation;
    //   finalList.ShipperName = DetailsData[i].ShipperName;
    //   finalList.EndLocation = DetailsData[i].EndLocation;
    //   finalList.ConsigneeName = DetailsData[i].ConsigneeName;
    //   finalList.NTransit_Time = DetailsData[i].NTransit_Time;
    //   finalList.NMax_Transit_Time = DetailsData[i].NMax_Transit_Time;
    //   finalList.NMin_Transit_Time = DetailsData[i].NMin_Transit_Time;
    //   finalList.CTransShipPort = DetailsData[i].CTransShipPort;
    //   finalList.CType = DetailsData[i].CType;
    //   finalList.Line = DetailsData[i].Line;
    //   finalList.NEdLocationID = DetailsData[i].NEdLocationID;
    //   finalList.NStLocationID = DetailsData[i].NStLocationID;
    //   finalList.NTransRouteID = DetailsData[i].NTransRouteID;
    //   finalList.SLinerID = DetailsData[i].SLinerID;
    //   finalList.TransitType = DetailsData[i].TransitType;

    //   //Start Location Lat lng
    //   var CStLatLong = DetailsData[i].CStLatLong;
    //   var startlatlng = [];
    //   var startlatlnglst = new Object();
    //   startlatlnglst.lat = Number(CStLatLong.split(",")[0]);
    //   startlatlnglst.lng = Number(CStLatLong.split(",")[1]);
    //   startlatlng.push(startlatlnglst);

    //   finalList.StartLatLng = startlatlng;

    //   // End Location Lat Lng
    //   var CEdLatLong = DetailsData[i].CEdLatLong;
    //   var endlatlng = [];
    //   var endlatlnglst = new Object();
    //   endlatlnglst.lat = Number(CEdLatLong.split(",")[0]);
    //   endlatlnglst.lng = Number(CEdLatLong.split(",")[1]);
    //   endlatlng.push(endlatlnglst);
    //   finalList.EndLatLng = endlatlng;

    //   //CRouteLatLong Lat Lng
    //   // Rounting line
    //   var cRouteLatLong = DetailsData[i].CRouteLatLong;
    //   if (cRouteLatLong.length > 0) {
    //     var routeArray = [];
    //     var ComplexData = [];
    //     routeArray.push(cRouteLatLong.split(";"));

    //     var routlen = routeArray[0];
    //     for (let k = 0; k < routlen.length; k++) {
    //       var routelatlng = new Object();
    //       var latlngvar = routlen[k];
    //       routelatlng.lat = Number(latlngvar.split(",")[0]);
    //       routelatlng.lng = Number(latlngvar.split(",")[1]);
    //       ComplexData.push(routelatlng);
    //     }
    //     finalList.CRouteLatLong = ComplexData;
    //   } else {
    //     finalList.CRouteLatLong = null;
    //   }

    //   PinModalData.push(finalList);

    //   // Rounting line
    //   var RouteLatLong = DetailsData[i].RouteLatLong;
    //   var RouteArray = [];
    //   // var ComplexData = [];
    //   RouteArray.push(RouteLatLong.split(";"));

    //   var routlen = RouteArray[0];
    //   for (let k = 0; k < routlen.length; k++) {
    //     var routelatlng = new Object();
    //     var latlngvar = routlen[k];
    //     routelatlng.lat = Number(latlngvar.split(",")[0]);
    //     routelatlng.lng = Number(latlngvar.split(",")[1]);
    //     RouteData.push(routelatlng);
    //   }
    // }

    // self.setState({ MapsDetailsData: PinModalData });

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

      var RouteLatLong = mydata[i]["RouteLatLong"];
      var splitRouteLatLong = RouteLatLong.split(";");
      for (var j = 0; j < splitRouteLatLong.length; j++) {
        var lineData = {};
        var tempSData = splitRouteLatLong[j].split(",");
        lineData.lat = Number(tempSData[0]);
        lineData.lng = Number(tempSData[1]);
        allLineData.push(lineData);
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
  HandleShipmentDetailsMap(sid, cid) {
    debugger;
    let self = this;
    var shipperId = sid;
    var consigneeId = cid;
    var hblno = this.state.HblNo;
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
        NotificationManager.error("No Data Found");
        var actData = [];
        actData.push({ DocumentDescription: "No Data Found" });

        self.setState({ documentData: actData });
      });
  }

  HandleShipmentDetails(hblno) {
    debugger;
    let self = this;

    var HblNo = hblno;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentSummaryDetailsAPI`,
      data: {
        // UserId: encryption(window.localStorage.getItem("userid"), "desc"), //874588, // userid,
        // HBLNo: HblNo //HblNo
        UserId: 874588,
        HBLNo: hblno //HblNo
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var shipmentdata = response.data;
      self.setState({
        detailsData: shipmentdata.Table[0],
        addressData: shipmentdata.Table1,
        containerData: shipmentdata.Table2,
        containerDetails: shipmentdata.Table3,
        bookedStatus: shipmentdata.Table4,
        packageDetails: shipmentdata.Table7,
        ShipmentExistsInWatchList:
          shipmentdata.Table6[0].ShipmentExistsInWatchList,
        packageViewMore: shipmentdata.Table8
      });
      var sid = shipmentdata.Table[0].ShipperId;
      var cid = shipmentdata.Table[0].ConsigneeID;
      self.HandleShipmentDetailsMap(sid, cid);
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
      alert(response.data[0].Result);
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
  togglePackage() {
    debugger;
    let self = this;
    self.setState(prevState => ({
      modalPackage: !prevState.modalPackage
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

  handleAddToWatchList = () => {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/AddToWatchListAPI`,
      data: {
        UserId: 874588,
        HBLNO: this.props.location.state.detail
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
    var HblNo;
    if (typeof this.props.location.state != "undefined") {
      HblNo = this.props.location.state.detail;
    }
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
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  handleRemoveWatchList = () => {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RemoveFromWatchListAPI`,
      data: {
        UserId: 874588,
        HBLNO: this.props.location.state.detail
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      NotificationManager.error(response.data[0].Result);
      self.setState({ ShipmentExistsInWatchList: 0 });
    });
  };

  render() {
    let self = this;
    const {
      detailsData,
      addressData,
      containerData,
      containerDetails,
      ShowCard,
      documentData,
      bookedStatus,
      MapsDetailsData,
      packageDetails,
      packageViewMore
    } = this.state;
    debugger;
    console.log(bookedStatus);
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
    console.log(bookDate, "book");
    console.log(departedDate, "departure");
    console.log(arrivedDate, "arrived");
    console.log(deliverDate, "deliver");
    let Watchlist = "";
    if (this.state.ShipmentExistsInWatchList == 0) {
      Watchlist = (
        <>
          <button onClick={this.handleAddToWatchList} className="butn mt-0">
            Add Watchlist
          </button>
        </>
      );
    } else {
      Watchlist = (
        <>
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
                <b>{team.Message}</b>
                <div class="d-flex justify-content-end">
                  {" "}
                  ({team.MessageCreationTime})
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
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-7 p-0">
                  <div className="title-sect">
                    <h2>Details View</h2>

                    {Watchlist}
                  </div>
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
                      {/* <div className="sect-padd">
                        <p className="details-heading">Booking Details</p>
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">Mode Of Transport</p>
                            <p className="details-para">Ocean</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Cargo Type</p>
                            <p className="details-para">FCL</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">EXW</p>
                          </div>
                        </div>
                      </div> */}
                      <div className="sect-padd">
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">HBL#</p>
                            <a href="#!" className="details-para">
                              {detailsData.HBLNO}
                              <input
                                type="hidden"
                                value={detailsData.HBLNO}
                                id="popupHBLNO"
                              />
                            </a>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-para">{detailsData.HBLNO}</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Status</p>
                            <p className="details-para">{detailsData.Status}</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Last Update</p>
                            <p className="details-para">
                              {detailsData["Status Date"]}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">Mode</p>
                            <p className="details-para">
                              {detailsData.ModeOfTransport}
                            </p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Cargo Type</p>
                            <p className="details-para">
                              {detailsData.CargoType}
                            </p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">ATA Booking No#</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">SRT No#</p>
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
                                {/* <p className="details-title">
                                  Blueground Turizm Ve Services Hizmetleri
                                  Ticaret A.S.
                                </p> */}
                                <p className="details-para">{addkey.Address}</p>
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
                          <span className="clr-green">POL</span>
                          <div className="pol-pod-progress">
                            <Progress
                              value={
                                deliverDate !== ""
                                  ? "100"
                                  : arrivedDate !== ""
                                  ? "90"
                                  : departedDate !== ""
                                  ? "50"
                                  : bookDate !== ""
                                  ? "0"
                                  : "0"
                              }
                            />
                            <span
                              className="pol-pod-percent"
                              style={{ left: "50%" }}
                            >
                              {deliverDate !== ""
                                ? "100%"
                                : arrivedDate !== ""
                                ? "90%"
                                : departedDate !== ""
                                ? "50%"
                                : bookDate !== ""
                                ? "0%"
                                : "0%"}
                            </span>
                          </div>
                          <span className="clr-green">POD</span>
                        </div>
                        <div className="desti-places">
                          <span>
                            {containerData.length > 0
                              ? containerData[0].DeparturePortName
                              : ""}
                          </span>
                          <span>
                            {containerData.length > 0
                              ? containerData[0].DestinationPortName
                              : ""}
                          </span>
                        </div>
                      </div>
                      {containerData.map(function(routedata, i) {
                        return (
                          <div className="sect-padd">
                            <p className="details-heading">
                              Routing Information - {i + 1}
                            </p>
                            <div className="row mid-border">
                              <div className="col-md-6 details-border">
                                <div className="row">
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Type Of Move
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
                              <div className="col-md-6 details-border">
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
                            {ShowCard ? (
                              <div className="collapse-sect">
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Container Agents
                                    </p>
                                    <p className="details-para">
                                      {routedata["Container Agents"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Flag</p>
                                    <p className="details-para">
                                      {routedata.Flag}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Voyage Id</p>
                                    <p className="details-para">
                                      {routedata["Voyage Identification"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">IMO Number</p>
                                    <p className="details-para">
                                      {routedata["IMO Number"]}
                                    </p>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Document Cutoff
                                    </p>
                                    <p className="details-para">
                                      {routedata["Document Cutoff"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Port Cutoff</p>
                                    <p className="details-para">
                                      {routedata["Port Cutoff"]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {
                              <div className="row">
                                <div className="col-md-12">
                                  <a
                                    href="#!"
                                    className="butn view-btn less-btn"
                                  >
                                    Show Less
                                  </a>
                                </div>
                              </div>
                            }
                          </div>
                        );
                      })}
                      <div className="sect-padd">
                        <p className="details-heading">Container Details</p>
                        <div className="cont-det-outer">
                          {containerDetails.map(function(cntrDet, i = 0) {
                            i++;
                            return (
                              <div className="cont-det-cntr">
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Container Number
                                    </p>
                                    <p className="details-para">
                                      {cntrDet["Container Number"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Container Code / Type
                                    </p>
                                    <p className="details-para">
                                      {cntrDet.ContainerCode} {"/"}
                                      {cntrDet.ContainerType}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Seal NO.1</p>
                                    <p className="details-para">
                                      {cntrDet.SealNo1}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Seal NO.2</p>
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
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">Unit</p>
                                        <p className="details-para">
                                          {cntrDet.Unit}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">Height</p>
                                        <p className="details-para">
                                          {cntrDet.height}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">Width</p>
                                        <p className="details-para">
                                          {cntrDet.width}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">Length</p>
                                        <p className="details-para">
                                          {cntrDet.length}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">
                                          Gross Weight
                                        </p>
                                        <p className="details-para">
                                          {cntrDet["Gross Weight"]}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">
                                          Net Weight
                                        </p>
                                        <p className="details-para">
                                          {cntrDet.NetWeight}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
                                        <p className="details-title">
                                          Volume Weight
                                        </p>
                                        <p className="details-para">
                                          {cntrDet.VolumeWeight}
                                        </p>
                                      </div>
                                      <div className="col-md-3 details-border">
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
                                <div className="col-md-3 details-border">
                                  <p className="details-title">Package Type</p>
                                  <p className="details-para">
                                    {packData.PackageType}
                                  </p>
                                </div>
                              </div>

                              <div className="collapse-sect">
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Case Number</p>
                                    <p className="details-para">
                                      {packData.CaseNumber}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Units</p>
                                    <p className="details-para">
                                      {packData.UnitType}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Package Count
                                    </p>
                                    <p className="details-para">
                                      {packData.PackageCount}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Length</p>
                                    <p className="details-para">
                                      {packData.Length}
                                    </p>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Width</p>
                                    <p className="details-para">
                                      {packData.Width}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Height</p>
                                    <p className="details-para">
                                      {packData.Height}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Net Weight</p>
                                    <p className="details-para">
                                      {packData.NetWeight} Kgs.
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Gross Weight
                                    </p>
                                    <p className="details-para">
                                      {packData.GrossWeight} Kgs.
                                    </p>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Volume</p>
                                    <p className="details-para">
                                      {packData.Volume}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Volume Weight
                                    </p>
                                    <p className="details-para">
                                      {packData.VolumeWeight} Kgs.
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Total Net Weight
                                    </p>
                                    <p className="details-para">
                                      {packData.TotalNetWeight} Kgs.
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Total Gross Weight
                                    </p>
                                    <p className="details-para">
                                      {packData.TotalGrossWeight} Kgs.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <a
                                    href="#!"
                                    className="butn view-btn less-btn mr-2"
                                  >
                                    Show Less
                                  </a>
                                  <button
                                    onClick={() => self.togglePackage()}
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
                          showPagination={false}
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
                                  accessor: "DocumentDescription"
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
                                            src={Eye}
                                            alt="view-icon"
                                            onClick={e =>
                                              this.HandleDocumentView(e, row)
                                            }
                                          />
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
                        ></textarea>
                        <div className="text-right">
                          <a href="#!" className="butn">
                            Post
                          </a>
                        </div>
                      </div>
                      {MsgActivityTab}
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
                        <div>
                          <p className="est-title">Estimated Time of Arrival</p>
                          <p className="est-time">
                            9 October 2019, 90:45:56 Min
                          </p>
                        </div>
                        <div className="ship-white-cntr">
                          <div className="ship-white">
                            <img src={ShipWhite} alt="ship icon" />
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
                        <div className={departedIsActive}>
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Departed} alt="departed icon" />
                            </div>
                          </div>
                          <p>
                            <span>Departed : </span>
                            {departedDate}
                          </p>
                        </div>
                        <div className="track-line-cntr active">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Transit} alt="transit icon" />
                            </div>
                          </div>
                          <p>
                            <span>On the way</span>
                          </p>
                        </div>
                        <div className={arrivedIsActive}>
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Arrived} alt="arrived icon" />
                            </div>
                          </div>
                          <p>
                            <span>Arrived : </span>
                            {arrivedDate}
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
                <Modal
                  className="delete-popup package-popup"
                  isOpen={this.state.modalPackage}
                  toggle={this.togglePackage}
                >
                  <ModalBody>
                    <ReactTable
                      data={packageViewMore}
                      // noDataText="<i className='fa fa-refresh fa-spin'></i>"
                      noDataText=""
                      columns={[
                        {
                          columns: [
                            {
                              Header: "Package Type",
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
                              Header: "Quantity Ordered",
                              accessor: "Qtyordered"
                            },
                            {
                              Header: "Quantity Shipped",
                              accessor: "Qtyshipped"
                            },
                            {
                              Header: "UOM (Unit of Measurement)",
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
              <NotificationContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingDetailsTwo;

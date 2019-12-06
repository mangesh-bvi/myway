import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { Button, Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import DatePicker from "react-datepicker";
import Moment from "react-moment";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import { Capitalize } from "../helpers/Capitalize";
import "react-datepicker/dist/react-datepicker.css";
// import {GoogleMapReact,Polyline} from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Truck from "./../assets/img/truck.png";
import Plane from "./../assets/img/plane.png";
import Ship from "./../assets/img/ship.png";
import GreenCircle from "./../assets/img/green-circle.png";
import RedCircle from "./../assets/img/red-circle.png";
import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Edit from "./../assets/img/pencil.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Calen from "./../assets/img/calendar.png";
import Download from "./../assets/img/csv.png";

import YellowFlag from "./../assets/img/yellow-flag.png";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
  google
} from "react-google-maps";

const { compose } = require("recompose");

const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={2}
  >
    {props.markers.map((marker, i) => {
      const onClick = props.onClick.bind(this, marker);
      return (
        <Marker
          key={i}
          onClick={onClick}
          position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
        >
          {props.selectedMarker === marker && (
            <InfoWindow>
              <div>
                <h4>{marker.RegCompanyName}</h4>
                <br />
                <b>{marker.locationName}</b>
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    })}
  </GoogleMap>
));
function animateCircle(line) {
  var count = 0;
  window.setInterval(function() {
    count = (count + 1) % 200;

    // var icons = line.props.options.icons[0].icon;
    var icons = line.props.options.icons[0];
    line.props.options.icons[0].offset = count / 2 + "%";
    // line.set("options", icons);
    line.props.options.icons[0] = icons;
  }, 20);
}

const MapWithAMakredInfoWindowLine = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={3}
  >
    {props.transitpopupData.length > 0 ? (
      <Polyline
        path={props.transitpopupData}
        geodesic={true}
        style={{ zIndex: 2 }}
        className="overlay"
        options={{
          strokeColor: "#39b54a",
          strokeOpacity: 0.75,
          strokeWeight: 5
        }}
      />
    ) : null}

    {props.markers.map((marker, i) => {
      var map = GoogleMap;

      var iCount = props.markers.length;
      var start = marker.StartLatLng;
      var end = marker.EndLatLng;
      var cRouteLatLong = marker.CRouteLatLong;
      const onClick = props.onClick.bind(this, i);

      var lineSymbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: "#393"
      };
      var line = new window.google.maps.Polyline({
        strokeColor: "#FF0000",
        strokeWeight: 3,
        icons: [
          {
            icon: lineSymbol,
            offset: "0",
            repeat: "20px"
          }
        ]
      });
      line.set("icons", [
        {
          icon: line.icons[0].icon,
          offset: line.icons[0].offset,
          repeat: "50px"
        }
      ]);

      let iconMarker = new window.google.maps.MarkerImage(
        YellowFlag,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );

      var line2 = (
        <Polyline
          path={props.routerData}
          geodesic={true}
          style={{ zIndex: 1 }}
          options={{
            strokeColor: "#ff0022",
            strokeOpacity: 1.75,
            strokeWeight: 2,
            icons: [
              {
                icon: lineSymbol,
                offset: "0%",
                repeat: "20px"
              }
            ]
          }}
        />
      );

      animateCircle(line2);
      return (
        <>
          {line2}
          {marker.CTransShipPort != "" ? (
            <Marker
              icon={iconMarker}
              key={marker.CTransShipPort}
              title={marker.CTransShipPort}
              position={{
                lat: cRouteLatLong[0].lat,
                lng: cRouteLatLong[0].lng
              }}
            />
          ) : null}
          {marker.ORDERID == 1 ? (
            <>
              <Marker
                key={start[0].lat}
                title={marker.StartLocation}
                //icon={GreenCircle}
                onClick={props.onClick.bind(this, start[0].lat)}
                position={{
                  lat: start[0].lat,
                  lng: start[0].lng
                }}
              >
                {props.selectedMarker == start[0].lat && (
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
                icon={iconMarker}
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
          {marker.EndLatLng[0].lat != props.markers[i].StartLocation[0].lat &&
          marker.EndLatLng[0].lng != props.markers[i].StartLocation[0].lng &&
          iCount != marker.ORDERID ? (
            <Marker
              key={end[0].lat}
              icon={iconMarker}
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
              //icon={RedCircle}
              title={marker.EndLocation}
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

class ShipmentPlanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalTransit: false,
      modalDelivery: false,
      modalVisual: false,
      modalEdit: false,
      startDate: new Date(),
      companydrp: [],
      consigneedrp: [],
      transportModedrp: [],
      linerdrp: [],
      supConsId: "",
      linerId: "",
      modeofTransport: "",
      sailingDate: "",
      transitModeId: "",
      totalAvgDays: "",
      totalMinDays: "",
      totalMaxDays: "",
      transitpopup: [],
      deliveryPopup: [],
      firstAvg: "",
      firstmgmt: "",
      secondAvg: "",
      secondmgmt: "",
      via: "",
      visualCarrier: "",
      imageClass: "air",
      thirdAvg: "",
      zoom: 4,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: [],
      MapsDetailsData: [],
      showingMaps: true,
      selectedMarker: false,
      mappingId: 0,
      transitpopupData: [],
      routerMapData: [],
      iframeKey: 0
    };

    this.toggleTransit = this.toggleTransit.bind(this);
    this.toggleDelivery = this.toggleDelivery.bind(this);
    this.toggleVisual = this.toggleVisual.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.HandleOnPageLoad = this.HandleOnPageLoad.bind(this);
    this.HandleSubmitDetailsData = this.HandleSubmitDetailsData.bind(this);
    this.HandleTransitTimeVIew = this.HandleTransitTimeVIew.bind(this);
  }

  HandleTransitTimeVIew(rountlatlng) {
    let self = this;
    var rountData = rountlatlng;
    var finalRouteData = [];

    var startlatlng = rountData.split(";");
    for (let index = 0; index < startlatlng.length; index++) {
      var startlatlnglst = new Object();
      startlatlnglst.lat = Number(startlatlng[index].split(",")[0]);
      startlatlnglst.lng = Number(startlatlng[index].split(",")[1]);
      finalRouteData.push(startlatlnglst);
    }

    localStorage.removeItem("GreenLineData"); //Green Line
    localStorage.setItem("GreenLineData", JSON.stringify(finalRouteData)); //Green Line
    self.setState({ iframeKey: self.state.iframeKey + 1 });
    self.setState({ modalTransit: false, transitpopupData: finalRouteData });
  }

  handleClick = (marker, event) => {
    debugger;
    this.setState({ selectedMarker: "" });
    this.setState({ selectedMarker: marker });
  };
  HandleSubmitDetailsData(submitdata) {
    // let self = this;
    // var DetailsData = submitdata.data.Table;

    // var PinModalData = [];
    // var RouteData = [];

    // for (let i = 0; i < DetailsData.length; i++) {
    //   var finalList = new Object();
    //   var cRoute = new Object();
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

    //   // if (orderId == 1) {
    //   //   PinModalData.push(finalList);
    //   //   PinModalData.push(finalList);
    //   // } else {
    //   //   PinModalData.push(finalList);
    //   // }
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
    // localStorage.removeItem("finalDataMap");
    // localStorage.removeItem("routeData");
    // // var redPinData=[];
    // // var flagPinData=[];
    // // var cTransShipPortPin=[];

    // // var orderCount=PinModalData.length;
    // // for (var i = 0; i < orderCount; i++) {
    // //    var oDetails=PinModalData[i];
    // //    if(oDetails.ORDERID===1)
    // //    {

    // //    }

    // // }

    // localStorage.setItem("finalDataMap", JSON.stringify(PinModalData));
    // localStorage.setItem("routeData", JSON.stringify(RouteData));
    // self.setState({
    //   MapsDetailsData: PinModalData,
    //   showingMaps: false,
    //   routerMapData: RouteData
    // });

    debugger;
    var mydata = submitdata.data.Table;
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
    self.setState({
      showingMaps: false
    });
  }

  HandleOnPageLoad() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RegCompanyLocation`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      var resdata = response.data;
      var jDataArry = [];
      var aDataArry = [];
      var CompanyData = [];
      var LatLng = resdata[0].Location;
      var locationName = resdata[0].LocationName;
      var CompanyName = resdata[0].RegCompanyName;
      jDataArry.push(LatLng.split(";"));
      aDataArry.push(locationName.split(";"));
      CompanyData.push(CompanyName.split(";"));
      var finalDataForMap = [];
      var jDataArryLen = jDataArry[0].length;
      var jCheck = 0;
      for (let i = 0; i < jDataArryLen; i++) {
        var temp = jDataArry[0][i].split(",");
        var latData = temp[0].trim();
        var longData = jDataArry[0][i].split(",")[1].trim();
        var locName = aDataArry[0][i];
        var compName = CompanyData[0][i];
        var jData = new Object();
        jData.lat = latData;
        jData.lng = longData;
        jData.locationName = locName;
        jData.RegCompanyName = compName;

        if (jCheck > 0) {
          if (
            !finalDataForMap[jCheck - 1]["lat"].includes(latData) &&
            !finalDataForMap[jCheck - 1]["lng"].includes(latData)
          ) {
            finalDataForMap.push(jData);

            jCheck = jCheck + 1;
          } else {
            var index = finalDataForMap.findIndex(
              x => x.lat === latData && x.lng === longData
            );
            if (index >= 0) {
              var tempCompData = finalDataForMap[index]["RegCompanyName"];
              //finalDataForMap[index]["RegCompanyName"] //=finalDataForMap[index]["RegCompanyName"] + "," +
              finalDataForMap[index]["RegCompanyName"] =
                tempCompData + "," + compName;
            }
          }
        } else {
          finalDataForMap.push(jData);
          jCheck = jCheck + 1;
        }
      }

      self.setState({ mapsData: finalDataForMap });
    });
  }

  companyChange = e => {
    debugger;
    let self = this;
    var selectComp = document.getElementById("drpCompany").selectedIndex;
    let compArray = this.state.companydrp[selectComp];

    // for (let index = 0; index < this.state.companydrp.length; index++) {
    //   if (this.state.companydrp[index].MyCompID == e.target.value) {
    //     compArray = this.state.companydrp[index];
    //     break;
    //   }
    // }
    if (compArray!==null) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/FetchConsigneeCompany`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc"),
          MyCompID: compArray.MyCompID,
          MyCompLocationID: compArray.MyCompLocationID,
          MyCompLocationType: compArray.MyCompLocationType
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        let optionItems = response.data.map(comp => (
          <option value={comp.MappingID}>{comp.MappedCompName}</option>
        ));
        self.setState({
          consigneedrp: optionItems,
          markerposition: { lat: 32.24165126, lng: 77.78319374 }
        });
      });
    }
  };

  consigneeChange = e => {
    let self = this;
    let supconsid = e.target.value;
    document.getElementById("drpMode").selectedIndex = "0";
    self.setState({ supConsId: supconsid });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchTransportMode`,
      data: {
        SupConsID: supconsid
      },
      headers: authHeader()
    }).then(function(response) {
      let optionItems = response.data.map(comp => (
        <option value={comp.CModeOfTransport}>{comp.CModeOfTransport}</option>
      ));
      self.setState({ transportModedrp: optionItems });
    });
  };

  transportModeChange = e => {
    let self = this;
    let transportmode = e.target.value;
    document.getElementById("drpLiner").selectedIndex = "0";
    self.setState({ modeofTransport: transportmode });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchLiners`,
      data: {
        Type: 2,
        SupConsID: self.state.supConsId,
        ModeType: transportmode
      },
      headers: authHeader()
    }).then(function(response) {
      let optionItems = response.data.map(comp => (
        <option value={comp.TransitModeID}>{comp.TransitMode}</option>
      ));
      self.setState({ linerdrp: optionItems });
    });
  };

  fetchLinerChange = e => {
    let self = this;
    self.setState({ transitModeId: e.target.value });
  };

  handleChange = e => {
    this.setState({
      startDate: e
    });
  };

  handleSubmit = () => {
    var supConsId = this.state.supConsId;
    var sailingDate = document.getElementById("saleDate").value;
    let self = this;
    self.setState({ transitpopupData: [] });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipmentPlannerMapData`,
      data: {
        SupConsID: this.state.supConsId,
        LinerID: this.state.transitModeId,
        ModeOfTransport: this.state.modeofTransport,
        SailingDate: sailingDate
      },
      headers: authHeader()
    }).then(function(response) {
      // self.setState({ showingMaps: true });
      var totalAvg = 0;
      var totalMin = 0;
      var totalMax = 0;
      for (let index = 0; index < response.data.Table.length; index++) {
        if (index == 0) {
          self.setState({ firstAvg: response.data.Table[index].NTransit_Time });
          self.setState({ firstmgmt: response.data.Table[index].ManagedBy });
        } else if (index == 1) {
          self.setState({
            secondAvg: response.data.Table[index].NTransit_Time
          });
          var mode = response.data.Table[index].RouteMode.split("-");
          if (mode[0].toLowerCase() == "sea") {
            self.setState({ imageClass: "water" });
          } else {
            self.setState({ imageClass: "air" });
          }
          self.setState({
            secondmgmt: response.data.Table[index].ManagedBy
          });
          self.setState({
            via: response.data.Table[index].Line
          });
        } else {
          self.setState({ thirdAvg: response.data.Table[index].NTransit_Time });
          self.setState({ thirdmgmt: response.data.Table[index].ManagedBy });
        }
        totalAvg += parseInt(response.data.Table[index].NTransit_Time);
        totalMin += parseInt(response.data.Table[index].NMin_Transit_Time);
        totalMax += parseInt(response.data.Table[index].NMax_Transit_Time);
      }
      debugger
      var deliveryData = response.data.Table1;
      if (deliveryData != "undefined" && deliveryData != null) {
        self.setState({ deliveryPopup: deliveryData });
      } else {
        var data = [{ POLLocation: "" }];

        self.setState({ deliveryPopup: data });
      }
      var transitData = response.data.Table;

      if (transitData !== "undefined" && transitData != null) {
        self.setState({ transitpopup: transitData });
      }

      self.setState({ totalAvgDays: totalAvg });
      self.setState({ totalMinDays: totalMin });
      self.setState({ totalMaxDays: totalMax });
      self.setState({ iframeKey: self.state.iframeKey + 1 });

      var submitdata = response;
      localStorage.removeItem("GreenLineData");
      self.HandleSubmitDetailsData(submitdata);
    });
  };
  toggleTransit() {
    if (this.state.transitpopup != null) {
      if (this.state.transitpopup.length > 0) {
        this.setState(prevState => ({
          modalTransit: !prevState.modalTransit
        }));
      }
    }
  }
  toggleDelivery() {
    debugger;
    if (this.state.deliveryPopup != null) {
      if (this.state.deliveryPopup.length > 0) {
        this.setState(prevState => ({
          modalDelivery: !prevState.modalDelivery
        }));
      }
    }
  }
  toggleVisual() {
    this.setState(prevState => ({
      modalVisual: !prevState.modalVisual
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  componentDidMount() {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchShipperCompany`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      self.setState({ companydrp: response.data });
    });
    this.HandleOnPageLoad();
  }

  renderTableHeader() {
    return (
      <div>
        <div>1223333</div>
      </div>
    );
  }

  render() {
    const {
      mapsData,
      transitpopup,
      deliveryPopup,
      firstAvg,
      secondAvg,
      thirdAvg,
      carriar,
      MapsDetailsData,
      transitpopupData,
      routerMapData
    } = this.state;

    let optionItems = this.state.companydrp.map((planet, i) => (
      <option
        onChange={this.companyChange}
        atrCompLocType={planet.MyCompLocationType}
        atrCompLocId={planet.MyCompLocationID}
        key={i}
        value={planet.MyCompID}
      >
        {planet.Column1}
      </option>
    ));

    function TransitionImage(props) {
      const imgType = props.imgType;
      if (imgType === "Road") {
        return <img src={Truck}></img>;
      } else if (imgType === "Air-Midnight Wonder" ||imgType === "Air-Flash") {
        return <img src={Plane}></img>;
      } else {
        return <img src={Ship}></img>;
      }
    }

    function DeliveryPopupCheck(props) {
      const data = props.noData;
      if (data == "nodata") {
        return "No schedule available";
      }
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
                <div className="col-md-5 pl-0">
                  <div className="title-sect title-border">
                    <h2>My Suppliers</h2>
                  </div>
                  <div className="planner-cntr">
                    <div className="login-input-cntr">
                      <div className="login-fields">
                        <label>Select Company</label>
                        <select onChange={this.companyChange} id="drpCompany">
                          <option>Select</option>
                          {optionItems}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Sub Company</label>
                        <select
                          onChange={this.consigneeChange}
                          id="drpConsigneeCompany"
                        >
                          <option value={0}>Select</option>
                          {this.state.consigneedrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Mode</label>
                        <select
                          id="drpMode"
                          onChange={this.transportModeChange}
                        >
                          <option value={0}>Select</option>
                          {this.state.transportModedrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Liner</label>
                        <select id="drpLiner" onChange={this.fetchLinerChange}>
                          <option value={0}>Select</option>
                          {this.state.linerdrp}
                        </select>
                      </div>
                      <div className="login-fields">
                        <label>Select Date</label>
                        <DatePicker
                          id="saleDate"
                          selected={this.state.startDate}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button onClick={this.handleSubmit} className="butn">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="planner-top-butns">
                    <button onClick={this.toggleDelivery} className="butn">
                      Delivery Date
                    </button>
                    <button onClick={this.toggleVisual} className="butn">
                      Visual Summary
                    </button>
                    <button onClick={this.toggleTransit} className="butn">
                      Transit Time
                    </button>
                  </div>
                  <div className="full-map-cntr">
                    <div className="ship-detail-maps full-map mt-0">
                      <div className="ship-detail-map">
                        {this.state.showingMaps ? (
                          <MapWithAMakredInfoWindow
                            markerposition={this.state.markerposition}
                            markers={mapsData}
                            onClick={this.handleClick}
                            selectedMarker={this.state.selectedMarker}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                            containerElement={
                              <div style={{ height: `100%`, width: "100%" }} />
                            }
                            mapElement={<div style={{ height: `100%` }} />}
                            loadingElement={<div style={{ height: `100%` }} />}
                          ></MapWithAMakredInfoWindow>
                        ) : (
                          // <MapWithAMakredInfoWindowLine
                          //   markers={MapsDetailsData}
                          //   routerData={routerMapData}
                          //   onClick={this.handleClick}
                          //   transitpopupData={transitpopupData}
                          //   selectedMarker={this.state.selectedMarker}
                          //   googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          //   containerElement={
                          //     <div style={{ height: `100%`, width: "100%" }} />
                          //   }
                          //   mapElement={<div style={{ height: `100%` }} />}
                          //   loadingElement={<div style={{ height: `100%` }} />}
                          // ></MapWithAMakredInfoWindowLine>

                          <iframe
                            key={this.state.iframeKey}
                            src="/MapHtmlPage.html"
                            className="mapIframe"
                          />
                          // <object
                          //   width="100%"
                          //   height="100%"
                          //   data="/MapHtmlPage.html"
                          // ></object>
                          // <link rel="import" href="/MapHtmlPage.htm"></link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  className="visual-popup"
                  isOpen={this.state.modalVisual}
                  toggle={this.toggleVisual}
                  centered={true}
                >
                  <ModalBody className="p-0">
              <button type="button" style={{top:"-20px" , right:"-20px"}} className="close" data-dismiss="modal" onClick={this.toggleVisual}>
                <span>&times;</span>
              </button>
                    <table
                      width="100%"
                      border="0"
                      align="center"
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tbody>
                        <tr>
                          <td
                            id="ContentPlaceHolder1_td_bg"
                            style={{borderRadius: "15px"}}
                            className={this.state.imageClass}
                          >
                            <div className="row">
                              <div className="col-xs-12 col-sm-6">
                                <div className="manage-txt">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lbloriginmangedby">
                                    &nbsp;{this.state.firstmgmt}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-6 text-center">
                                <div className="avarage-day supplier-avarage-day">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_header">
                                    {this.state.firstAvg}
                                  </span>
                                  &nbsp;Days Average
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12 col-sm-12">
                                <div className="avarage-day avrage-time">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_center">
                                    {this.state.secondAvg}
                                  </span>
                                  &nbsp;Days AVERAGE
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-9 col-sm-12 col-sm-12">
                                <div className="manage-txt origin-port">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lblMiddleManagedBy">
                                    &nbsp;{this.state.secondmgmt} via{" "}
                                    {this.state.via}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12">
                                <div className="avarage-day destination-port">
                                  <span id="ContentPlaceHolder1_lbl_avg_days_footer">
                                    {this.state.thirdAvg}
                                  </span>
                                  &nbsp; Days Average
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12 col-sm-12">
                                <div className="manage-txt footer-manage">
                                  Managed by
                                  <span id="ContentPlaceHolder1_lblDeliveryManagedBy">
                                    &nbsp;{this.state.thirdmgmt}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delivery-popup"
                  isOpen={this.state.modalDelivery}
                  toggle={this.toggleDelivery}
                  centered={true}
                >
                  <ModalBody>
              <button type="button" className="close" data-dismiss="modal" onClick={this.toggleDelivery}>
                <span>&times;</span>
              </button>
                <div style={{background:"#fff" , borderRadius:"15px" , padding:"15px"}}>
                      {deliveryPopup.map((cell, i) => {
                      if (cell.POLLocation == "") {
                        return (
                          <div className="container-fluid p-0 no-sched-avail">
                            No Schedule Available
                          </div>
                        );
                      } else {
                        return (
                          <div className="container-fluid p-0">
                            <div className="transit-sect">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="shipment-img mr-3">
                                    <TransitionImage imgType={cell.Mode} />
                                  </div>
                                  <div>
                                    <p className="desti-name">
                                      {cell.POLLocation}
                                    </p>
                                    <p className="desti-route">
                                      to {cell.DestinationPort}
                                      ,Carrier {cell.Carrier}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="delivery-inner">
                              <div className="row">
                                <div className="col-md-4 text-center">
                                  <p className="details-title">
                                    Departure Date
                                  </p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.SailingDate}
                                    </Moment>
                                  </p>
                                </div>
                                <div className="col-md-4 text-center">
                                  <p className="details-title">ETA</p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.ETA}
                                    </Moment>
                                  </p>
                                </div>
                                <div className="col-md-4 text-center">
                                  <p className="details-title">
                                    Estimated Delivery Date
                                  </p>
                                  <p className="details-para">
                                    <Moment format="DD/MM/YYYY">
                                      {cell.CargoArrivalDate}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                    </div>
                  </ModalBody>
                </Modal>
                <Modal
                  className="transit-popup"
                  isOpen={this.state.modalTransit}
                  toggle={this.toggleTransit}
                  centered={true}
                >
                  <ModalBody>
              <button type="button" className="close" data-dismiss="modal" onClick={this.toggleTransit}>
                <span>&times;</span>
              </button>
                <div style={{backgroundColor:"#fff",padding:"15",borderRadius:"0"}}>
                    <div className="container-fluid p-0">
{/* <div class="row">
  <div class="column-a">
    <div class="card-a">
      <label className="total-label">Total Average Days</label>
      <div className="mt-5">
        <img src={Calen} alt="" className="calendar" />
        <span className="total-span">37</span>
      </div>
    </div>
  </div>

  <div class="column-a">
    <div class="card-a">
      <label className="total-label">Total Minimum Days</label>
      <div className="mt-5">
        <img src={Calen} alt="" className="calendar" />
        <span className="total-span">34</span>
      </div>
    </div>
  </div>
  
  <div class="column-a">
    <div class="card-a">
      <label className="total-label">Total Maximum Days</label>
      <div className="mt-5">
        <img src={Calen} alt="" className="calendar" />
        <span className="total-span">45</span>
      </div>
    </div>
  </div>
</div> */}
                      <div className="transit-sect">
                        <div className="row" style={{margin:"0"}}>
                          <div className="col-md-4 details-border card-a">
                            <div>
                              <p className="details-title">
                                Total Average Days
                              </p>
                              <p className="details-para">
                                {this.state.totalAvgDays}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 details-border card-a">
                            <div>
                              <p className="details-title">
                                Total Minimum Days
                              </p>
                              <p className="details-para">
                                {this.state.totalMinDays}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 details-border card-a">
                            <div>
                              <p className="details-title">
                                Total Maximum Days
                              </p>
                              <p className="details-para">
                                {this.state.totalMaxDays}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transit-sect-overflow">
                        {transitpopup.map((cell, i) => {
                          var imgSrc = "";

                          return (
                            <div className="transit-sect">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <div className="shipment-img mr-3">
                                    <TransitionImage
                                      imgType={cell.CModeOfTransport}
                                    />
                                  </div>
                                  <div>
                                    <p className="desti-name">
                                      {cell.StartLocation}
                                    </p>
                                    <p className="desti-route">
                                      to {cell.EndLocation}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className="butn cancel-butn"
                                  onClick={() => {
                                    this.HandleTransitTimeVIew(
                                      cell.RouteLatLong
                                    );
                                  }}
                                >
                                  View
                                </button>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Average Days</p>
                                    <span className="days-count">
                                      {cell.NTransit_Time}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Minimum Days</p>
                                    <span className="days-count">
                                      {cell.NMin_Transit_Time}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="days-cntr">
                                    <p className="days-title">Maximum Days</p>
                                    <span className="days-count">
                                      {cell.NMax_Transit_Time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </div>
                  </ModalBody>
                </Modal>
                {/* <Modal
                  className="delete-popup"
                  isOpen={this.state.modalEdit}
                  toggle={this.toggleEdit}
                  centered={true}
                >
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                      <label>Rename your document</label>
                      <input type="text" placeholder="Rename here..." />
                    </div>
                    <Button className="butn" onClick={this.toggleEdit}>
                      Done
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleEdit}
                    >
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShipmentPlanner;

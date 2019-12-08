import React, { Component } from "react";
import Headers from "../component/header";
import PlaneBlue from "./../assets/img/plane-blue.svg";
import PlaneWhite from "./../assets/img/plane-white.svg";
import TruckBlue from "./../assets/img/truck-blue.svg";
import { Bar, Doughnut } from "react-chartjs-2";
import TruckWhite from "./../assets/img/truck-white.svg";
import ShipBlue from "./../assets/img/ship-blue.svg";
import ShipWhite from "./../assets/img/ship-white.svg";
import SideMenu from "../component/sidemenu";
import DatePicker from "react-datepicker";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-datepicker/dist/react-datepicker.css";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";

var volumeOptions = {
  title: {
    display: true,
    text: "Total Freight Spend",
    fontSize: 16,
    fontFamily: "Bold Font",
    fontColor: "#000",
    padding: 20
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 7,
      fontFamily: "Medium Font",
      fontSize: 14,
      fontColor: "#000",
      usePointStyle: true,
      padding: 20
    }
  },
  scales: {
    //volumeOptions.scales.yAxes.scaleLabel.labelString
    yAxes: [
      {
        ticks: {
          fontColor: "#999",
          fontSize: 14,
          callback: function(value) {
            return value;
          }
        },
        scaleLabel: {
          display: true,
          labelString: "USD",
          fontFamily: "Medium Font",
          fontSize: 14,
          fontColor: "#777"
        },
        stacked: true
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "#999",
          fontSize: 14
        },
        stacked: true,
        gridLines: {
          display: false
        }
      }
    ]
  }
};

var greencounterOption = {
  title: {
    display: true,
    text: "Total: $455k",
    fontSize: 16,
    fontFamily: "Bold Font",
    fontColor: "#000",
    padding: 20
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  rotation: 0.5 * Math.PI,
  cutoutPercentage: 0
};

class Analytics extends Component {
  constructor(props) {
    var someDate = new Date();

    super(props);
    this.state = {
      startDate: someDate.setMonth(someDate.getMonth() - 6),
      endDate: new Date(),
      toggleShipShip: false,
      toggleRoadShip: false,
      toggleShipInv: false,
      toggleRoadInv: false,
      toggleWeekDate: false,
      toggleMonthDate: true,
      toggleYearDate: false,
      graflabels: [],
      graphdataset: [],
      grafShipmentlabels: [],
      graphShipmentdataset: [],
      toggleShipmentWeekDate: false,
      toggleShipmentMonthDate: true,
      toggleShipmentYearDate: false,
      setSupplierdrop: [],
      toggleFclLcl: false,
      toggleFtlLtl: false,
      toggleInvFclLcl: false,
      toggleInvFtlLtl: false
    };
    this.handleAnalyticsShipment = this.handleAnalyticsShipment.bind(this);
  }

  componentDidMount() {
    this.handleAnalyticsShipment(null);
  }

  handleAnalyticsShipment(event) {
    let self = this;

    if (
      this.state.toggleShipShip === true &&
      this.state.toggleFclLcl === false
    ) {
      NotificationManager.error("Please select FCL or LCL");
    } else if (
      this.state.toggleRoadShip === true &&
      this.state.toggleFtlLtl === false
    ) {
      NotificationManager.error("Please select FTL or LTL");
    } else {
      // var FromDate = "2019-01-01";
      // var ToDate = "2019-06-30";
      var FromDate = "";
      var ToDate = "";
      var ActiveFlag = "D";
      //var Mode = "A,O,I";
      var Mode = "A,FCL,LCL,FTL,LTL";
      var period = document.getElementById("drp-period-shipment").value;
      var DatedBy = document.getElementById("Datedbydrp").value;

      if (event != null) {
        // alert(event.target.id)

        if (event.target.id == "shipment-view-btn") {
          var ActiveFlagele = document.getElementsByName("ship-type");
          for (var i = 0; i < ActiveFlagele.length; i++) {
            if (ActiveFlagele[i].checked) ActiveFlag = ActiveFlagele[i].value;
          }

          var Modeele = document.getElementsByName("ship-way");
          var modegetElementsByName = "";
          if (Modeele.length > 0) {
            for (var i = 0; i < Modeele.length; i++) {
              if (Modeele[i].checked) Mode = Modeele[i].value;

              if (Mode == "O") {
                Mode = "FCL,LCL";
                modegetElementsByName = "sea-opt";
              }

              if (Mode == "I") {
                Mode = "FTL,LTL";
                modegetElementsByName = "road-opt";
              }
            }
          }
          //sea-opt
          var ModeeleOther = document.getElementsByName(modegetElementsByName);
          if (ModeeleOther.length > 0) {
            for (var i = 0; i < ModeeleOther.length; i++) {
              if (ModeeleOther[i].checked) Mode = ModeeleOther[i].value;
            }
          }
        }
      } else {
        //All
        document.getElementById("active-ship").click();
      }

      if (period == "M") {
        var tempfromdate = document
          .getElementById("datpicker-from-shipment")
          .value.split("/"); //05/12/2019
        var temptodate = document
          .getElementById("datpicker-to-shipment")
          .value.split("/");
        FromDate = tempfromdate[1] + "-" + tempfromdate[0] + "-01";
        ToDate = temptodate[1] + "-" + temptodate[0] + "-01";
      } else if (period == "W") {
        var tempfromdate = document
          .getElementById("datpicker-from-shipment")
          .value.split("/"); //05/12/2019
        var temptodate = document
          .getElementById("datpicker-to-shipment")
          .value.split("/");
        FromDate =
          tempfromdate[2] + "-" + tempfromdate[0] + "-" + tempfromdate[1];
        ToDate = temptodate[2] + "-" + temptodate[0] + "-" + temptodate[1];
      } else if (period == "Y") {
        var tempfromdate = document.getElementById("date-year-shipment").value;
        FromDate = tempfromdate + "-01-01";
        ToDate = tempfromdate + "-12-31";
      }
      var g1 = new Date(FromDate);
      var g2 = new Date(ToDate);

      if (g1.getTime() > g2.getTime()) {
        NotificationManager.error("To date should be greater then From date.");
        document.getElementById("datpicker-to-shipment").focus();
        return false;
      }

      var axiosdata = {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        FromDate: FromDate,
        ToDate: ToDate,
        ActiveFlag: ActiveFlag,
        Mode: Mode,
        period: period,
        //ShipperID:1340354108
        DatedBy: DatedBy
      };

      this.setShipmentGraph(axiosdata);
    }
  }

  setShipmentGraph(axiosdata) {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentAnalyticsAPI`,
      data: axiosdata,
      headers: authHeader()
    })
      .then(function(response) {
        debugger;

        self.setState({ graphShipmentdataset: [] });
        var Segregatedby = document.getElementById("SegregatedBydrp").value;
        //ValueChart
        var Table = [];
        var graphdataset = [];
        var arrayAir = [];
        var arrayOcean = [];
        var arrayTruck = [];

        function compare(a, b) {
          // Use toUpperCase() to ignore character casing
          const bandA = a.ShipmentPeriod.toUpperCase();
          const bandB = b.ShipmentPeriod.toUpperCase();

          let comparison = 0;
          if (bandA > bandB) {
            comparison = 1;
          } else if (bandA < bandB) {
            comparison = -1;
          }
          return comparison;
        }

        if (Segregatedby == "CountChart") {
          Table = response.data.Table.sort(compare);
          arrayAir = Table.filter(item => item.Modeoftransport == "Air");
          // arrayOcean = Table.filter(item => item.Modeoftransport == "Ocean");
          // arrayTruck = Table.filter(item => item.Modeoftransport == "Inland");
          arrayOcean = Table.filter(
            item =>
              item.Modeoftransport == "Fcl" || item.Modeoftransport == "Lcl"
          );
          arrayTruck = Table.filter(
            item =>
              item.Modeoftransport == "Ftl" || item.Modeoftransport == "Ltl"
          );
          volumeOptions.title.text = "Total number of Shipments";
          volumeOptions.scales.yAxes[0].scaleLabel.labelString = "Count";
        } else if (Segregatedby == "VolumeChart") {
          Table = response.data.Table1;
          arrayAir = Table.filter(item => item.ModeOfTransport == "Air");
          // arrayOcean = Table.filter(item => item.ModeOfTransport == "Ocean");
          // arrayTruck = Table.filter(item => item.ModeOfTransport == "Inland");
          arrayOcean = Table.filter(
            item =>
              item.ModeOfTransport == "Fcl" || item.ModeOfTransport == "Lcl"
          );
          arrayTruck = Table.filter(
            item =>
              item.ModeOfTransport == "Ftl" || item.ModeOfTransport == "Ltl"
          );
          volumeOptions.title.text = "Total volume of shipment";
          volumeOptions.scales.yAxes[0].scaleLabel.labelString = "KGS";
        }

        var arraylabel = [];
        var arrayAirdata = [];
        var arrayOceandata = [];
        var arrayTruckdata = [];

        for (var i = 0; i < Table.length; i++) {
          var index = arraylabel.indexOf(Table[i].ShipmentPeriod);
          if (index > -1) {
          } else {
            arraylabel.push(Table[i].ShipmentPeriod);
          }
          self.setState({ grafShipmentlabels: arraylabel });
        }

        if (arrayAir != null) {
          if (arrayAir.length > 0) {
            for (var i = 0; i < arrayAir.length; i++) {
              if (Segregatedby == "VolumeChart") {
                arrayAirdata.push(arrayAir[i].Volume);
              } else if (Segregatedby == "CountChart") {
                arrayAirdata.push(arrayAir[i].NoOfShipment);
              }
            }
            graphdataset.push({
              label: "Air",
              data: arrayAirdata,
              backgroundColor: "#3357ac"
            });
          }
        }

        if (arrayOcean != null) {
          debugger;
          if (arrayOcean.length > 0) {
            for (var i = 0; i < arrayOcean.length; i++) {
              if (Segregatedby == "VolumeChart") {
                arrayOceandata.push(arrayOcean[i].Volume);
              } else if (Segregatedby == "CountChart") {
                arrayOceandata.push(arrayOcean[i].NoOfShipment);
              }
            }
            graphdataset.push({
              fillColor: "rgba(172,194,132,0.4)",
              strokeColor: "#ACC26D",
              pointColor: "#fff",
              pointStrokeColor: "#9DB86D",
              label: arrayOcean[0].Modeoftransport,
              data: arrayOceandata,
              backgroundColor: "#4a99e7"
            });
          }
        }

        if (arrayTruck != null) {
          if (arrayTruck.length > 0) {
            for (var i = 0; i < arrayTruck.length; i++) {
              if (Segregatedby == "VolumeChart") {
                arrayTruckdata.push(arrayTruck[i].Volume);
              } else if (Segregatedby == "CountChart") {
                arrayTruckdata.push(arrayTruck[i].NoOfShipment);
              }
            }
            graphdataset.push({
              label: "Inland",
              data: arrayTruckdata,
              backgroundColor: "#50ad84"
            });
          }
        }

        self.setState({ graphShipmentdataset: graphdataset });
      })
      .catch(error => {
        debugger;
        var temperror = "";
        var err = "";
        if (error.response != undefined) {
          temperror = error.response.data;
          err = temperror.split(":")[1].replace("}", "");
        } else {
          temperror = error.message;
          err = temperror;
        }

        // alert(err);
        //  volumeOptions.title.text = "No Data Found";
        //  volumeOptions.scales.yAxes[0].scaleLabel.labelString = "";
        NotificationManager.error(err);
        self.setState({ graphShipmentdataset: [] });
      });
  }

  handleChangeStart = e => {
    this.setState({
      startDate: e
    });
  };

  handleChangeEnd = e => {
    this.setState({
      endDate: e
    });
  };

  handleChangePerion = e => {
    if (e.target.value == "W") {
      this.setState({
        toggleWeekDate: true,
        toggleMonthDate: false,
        toggleYearDate: false
      });
    }
    if (e.target.value == "M") {
      this.setState({
        toggleWeekDate: false,
        toggleMonthDate: true,
        toggleYearDate: false
      });
    }
    if (e.target.value == "Y") {
      this.setState({
        toggleWeekDate: false,
        toggleMonthDate: false,
        toggleYearDate: true
      });
    }
  };

  handleShipmentChangePerion = e => {
    if (e.target.value == "W") {
      this.setState({
        toggleShipmentWeekDate: true,
        toggleShipmentMonthDate: false,
        toggleShipmentYearDate: false
      });
    }
    if (e.target.value == "M") {
      this.setState({
        toggleShipmentWeekDate: false,
        toggleShipmentMonthDate: true,
        toggleShipmentYearDate: false
      });
    }
    if (e.target.value == "Y") {
      this.setState({
        toggleShipmentWeekDate: false,
        toggleShipmentMonthDate: false,
        toggleShipmentYearDate: true
      });
    }
  };

  toggleBtnsShip = e => {
    console.log(e.target.id);
    if (e.target.id === "ship-ship") {
      this.setState({
        toggleShipShip: true,
        toggleRoadShip: false,
        toggleFtlLtl: false
      });
    } else if (e.target.id === "road-ship") {
      this.setState({
        toggleRoadShip: true,
        toggleShipShip: false,
        toggleFclLcl: false
      });
    } else if (e.target.id === "plane-ship") {
      this.setState({
        toggleRoadShip: false,
        toggleShipShip: false,
        toggleFtlLtl: false,
        toggleFclLcl: false
      });
    }
  };
  toggleFclLcl = e => {
    this.setState({
      toggleFclLcl: true
    });
  };
  toggleFtlLtl = e => {
    this.setState({
      toggleFtlLtl: true
    });
  };
  toggleInvFclLcl = e => {
    this.setState({
      toggleInvFclLcl: true
    });
  };
  toggleInvFtlLtl = e => {
    this.setState({
      toggleInvFtlLtl: true
    });
  };

  toggleBtnsInv = e => {
    console.log(e.target.id);
    if (e.target.id === "ship-inv") {
      this.setState({
        toggleShipInv: true,
        toggleRoadInv: false,
        toggleInvFtlLtl: false
      });
    } else if (e.target.id === "road-inv") {
      this.setState({
        toggleRoadInv: true,
        toggleShipInv: false,
        toggleInvFclLcl: false
      });
    } else if (e.target.id === "plane-inv") {
      this.setState({
        toggleRoadInv: false,
        toggleShipInv: false,
        toggleInvFtlLtl: false,
        toggleInvFclLcl: false
      });
    }
  };

  handleAnalyticsInvoice(event) {
    let self = this;

    if (
      this.state.toggleShipInv === true &&
      this.state.toggleInvFclLcl === false
    ) {
      NotificationManager.error("Please select FCL or LCL");
    } else if (
      this.state.toggleRoadInv === true &&
      this.state.toggleInvFtlLtl === false
    ) {
      NotificationManager.error("Please select FTL or LTL");
    } else {
      var ActiveFlag = "D";
      //var Mode = "A,O,I";
      var Mode = "A,FCL,LCL,FTL,LTL";
      var period = document.getElementById("drp-period-invoice").value;

      var FromDate = "";
      var ToDate = "";
      if (period == "M") {
        var tempfromdate = document
          .getElementById("datpicker-from-invoice")
          .value.split("/"); //05/12/2019
        var temptodate = document
          .getElementById("datpicker-to-invoice")
          .value.split("/");
        FromDate = tempfromdate[1] + "-" + tempfromdate[0] + "-01";
        ToDate = temptodate[1] + "-" + temptodate[0] + "-01";
      } else if (period == "W") {
        var tempfromdate = document
          .getElementById("datpicker-from-invoice")
          .value.split("/"); //05/12/2019
        var temptodate = document
          .getElementById("datpicker-to-invoice")
          .value.split("/");
        FromDate =
          tempfromdate[2] + "-" + tempfromdate[0] + "-" + tempfromdate[1];
        ToDate = temptodate[2] + "-" + temptodate[0] + "-" + temptodate[1];
      } else if (period == "Y") {
        var tempfromdate = document.getElementById("date-year-invoice").value;
        FromDate = tempfromdate + "-01-01";
        ToDate = tempfromdate + "-12-31";
      }
      var g1 = new Date(FromDate);
      var g2 = new Date(ToDate);

      if (g1.getTime() > g2.getTime()) {
        NotificationManager.error("To date should be greater then From date.");
        document.getElementById("datpicker-to-invoice").focus();
        return false;
      }
      if (event.target.id == "invoices-view-btn") {
        var ActiveFlagele = document.getElementsByName("ship-type-invoice");
        for (var i = 0; i < ActiveFlagele.length; i++) {
          if (ActiveFlagele[i].checked) ActiveFlag = ActiveFlagele[i].value;
        }

        var Modeele = document.getElementsByName("ship-way-invoice");
        if (Modeele.length > 0) {
          for (var i = 0; i < Modeele.length; i++) {
            if (Modeele[i].checked) Mode = Modeele[i].value;
          }
        }
        var modegetElementsByName = "";
        if (Mode == "O") {
          Mode = "FCL,LCL";
          //sea-opt
          modegetElementsByName = "sea-opt-invoice";
        }

        if (Mode == "I") {
          //road-opt
          Mode = "FTL,LTL";
          modegetElementsByName = "road-opt-invoice";
        }

        var ModeeleOther = document.getElementsByName(modegetElementsByName);
        if (ModeeleOther.length > 0) {
          for (var i = 0; i < ModeeleOther.length; i++) {
            if (ModeeleOther[i].checked) Mode = ModeeleOther[i].value;
          }
        }
      } else {
        document.getElementById("active-inv").click();
      }

      var axiosdata = {
        UserId: encryption(window.localStorage.getItem("userid"), "desc"),
        FromDate: FromDate,
        ToDate: ToDate,
        ActiveFlag: ActiveFlag,
        Mode: Mode,
        period: period
        //ShipperID:1340354108
      };

      if (event.target.id == "invoices-view-btn") {
        axiosdata.ShipperID = document.getElementById(
          "drp-supplie-invoice"
        ).value;
        self.setgrafval(axiosdata);
      } else {
        this.setSupplierdrop(axiosdata);
      }
    }
  }

  setSupplierdrop(axiosdata) {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipperDropdownListAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        self.setState({ setSupplierdrop: response.data.Table });

        if (response != null) {
          if (response.data != null) {
            if (response.data.Table != null) {
              if (response.data.Table.length > 0) {
                axiosdata.ShipperID = response.data.Table[0].ShipperID;
              }
            }
          }
        }

        self.setgrafval(axiosdata);
      })
      .catch(error => {
        var temperror = error.response.data;
        var err = temperror.split(":");
        // alert(err[1].replace("}", ""));
        self.setState({ setSupplierdrop: [] });
      });
  }

  setgrafval(axiosdata) {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/InvoiceAnalyticsAPI`,
      data: axiosdata,
      headers: authHeader()
    })
      .then(function(response) {
        self.setState({ graphdataset: [] });

        var arraylabel = [];
        var arrayAirdata = [];
        var arrayOceandata = [];
        var arrayTruckdata = [];

        for (var i = 0; i < response.data.Table.length; i++) {
          var index = arraylabel.indexOf(response.data.Table[i].ShipmentPeriod);
          if (index > -1) {
          } else {
            arraylabel.push(response.data.Table[i].ShipmentPeriod);
          }
          self.setState({ graflabels: arraylabel });
        }

        var graphdataset = [];

        var arrayAir = response.data.Table.filter(
          item => item.ModeOfTransport == "Air"
        );
        var arrayOcean = response.data.Table.filter(
          item => item.ModeOfTransport == "Fcl" || item.ModeOfTransport == "Lcl"
        );
        var arrayTruck = response.data.Table.filter(
          item => item.ModeOfTransport == "Ftl" || item.ModeOfTransport == "Ltl"
        );

        if (arrayAir != null) {
          if (arrayAir.length > 0) {
            for (var i = 0; i < arrayAir.length; i++) {
              arrayAirdata.push(arrayAir[i].InvoiceUSDAmount);
            }
            graphdataset.push({
              label: "Air",
              data: arrayAirdata,
              backgroundColor: "#3357ac"
            });
          }
        }

        if (arrayOcean != null) {
          if (arrayOcean.length > 0) {
            for (var i = 0; i < arrayOcean.length; i++) {
              arrayOceandata.push(arrayOcean[i].InvoiceUSDAmount);
            }
            graphdataset.push({
              fillColor: "rgba(172,194,132,0.4)",
              strokeColor: "#ACC26D",
              pointColor: "#fff",
              pointStrokeColor: "#9DB86D",
              label: "Ocean",
              data: arrayOceandata,
              backgroundColor: "#4a99e7"
            });
          }
        }

        if (arrayTruck != null) {
          if (arrayTruck.length > 0) {
            for (var i = 0; i < arrayTruck.length; i++) {
              arrayTruckdata.push(arrayTruck[i].InvoiceUSDAmount);
            }
            graphdataset.push({
              label: "Truck",
              data: arrayTruckdata,
              backgroundColor: "#50ad84"
            });
          }
        }

        self.setState({ graphdataset: graphdataset });
      })
      .catch(error => {
        var temperror = error;
        // var err = temperror.split(":");
        // alert(err[1].replace("}", ""));
        self.setState({ graphdataset: [] });
      });
  }

  buildOptions() {
    var arr = [];
    var currentdate = new Date();
    for (let i = 2018; i <= currentdate.getFullYear(); i++) {
      if (i == currentdate.getFullYear()) {
        arr.push(
          <option value={i} selected>
            {i}
          </option>
        );
      } else {
        arr.push(<option value={i}>{i}</option>);
      }
    }
    return arr;
  }

  render() {
    var buyerShipmentData = {
      labels: this.state.grafShipmentlabels,
      datasets: this.state.graphShipmentdataset
    };
    var buyerData = {
      labels: this.state.graflabels,
      datasets: this.state.graphdataset
    };
    let greenCounterdata = {
      labels: ["Green", "Red"],
      datasets: [
        {
          data: [40, 10, 50],
          backgroundColor: ["#4a99e7", "#50ad84", "#3357ac"]
          // hoverBackgroundColor: ["#63CD16", "#EF1617"]
          // borderWidth: 0
        }
      ],
      text: "23%"
    };

    let optionSupplierName = this.state.setSupplierdrop.map((item, i) => (
      <option value={item.ShipperID}>{item.ShipperName}</option>
    ));

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <NotificationContainer />
            <ul className="nav cust-tabs pt-2" role="tablist">
              <li>
                <a
                  className="active"
                  id="shipments-tab"
                  data-toggle="tab"
                  href="#shipments"
                  role="tab"
                  aria-controls="shipments"
                  aria-selected="true"
                  onClick={this.handleAnalyticsShipment.bind(this)}
                >
                  Shipments
                </a>
              </li>
              <li>
                <a
                  id="invoices-tab"
                  data-toggle="tab"
                  href="#invoices"
                  role="tab"
                  aria-controls="invoices"
                  aria-selected="false"
                  onClick={this.handleAnalyticsInvoice.bind(this)}
                >
                  Invoices
                </a>
              </li>
            </ul>
            <div className="tab-content cust-tabs-content">
              <div
                className="tab-pane fade show active"
                id="shipments"
                role="tabpanel"
                aria-labelledby="shipments-tab"
              >
                <div className="ana-radio-cntr align-items-center justify-content-between">
                  <div className="ana-viw">
                    <div className="analy-radio new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input
                          type="radio"
                          name="ship-type"
                          id="active-ship"
                          value="A"
                        />
                        <label htmlFor="active-ship">Active</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-type"
                          id="delivered-ship"
                          value="D"
                        />
                        <label htmlFor="delivered-ship">Delivered</label>
                      </div>
                    </div>
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input
                          type="radio"
                          name="ship-way"
                          id="plane-ship"
                          value="A"
                          onClick={this.toggleBtnsShip}
                        />
                        <label htmlFor="plane-ship">
                          <img
                            className="ana-icon-blue"
                            src={PlaneBlue}
                            alt="plane icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={PlaneWhite}
                            alt="plane icon"
                          />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-way"
                          id="ship-ship"
                          value="O"
                          onClick={this.toggleBtnsShip}
                        />
                        <label htmlFor="ship-ship">
                          <img
                            className="ana-icon-blue"
                            src={ShipBlue}
                            alt="ship icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={ShipWhite}
                            alt="ship icon"
                          />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-way"
                          id="road-ship"
                          value="I"
                          onClick={this.toggleBtnsShip}
                        />
                        <label htmlFor="road-ship">
                          <img
                            className="ana-icon-blue"
                            src={TruckBlue}
                            alt="truck icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={TruckWhite}
                            alt="truck icon"
                          />
                        </label>
                      </div>
                    </div>
                    {this.state.toggleShipShip && (
                      <div className="fix-width-label analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                        <div>
                          <input
                            type="radio"
                            name="sea-opt"
                            value="FCL"
                            id="fcl-ship"
                            onClick={this.toggleFclLcl}
                          />
                          <label htmlFor="fcl-ship">FCL</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="sea-opt"
                            value="LCL"
                            id="lcl-ship"
                            onClick={this.toggleFclLcl}
                          />
                          <label htmlFor="lcl-ship">LCL</label>
                        </div>
                      </div>
                    )}
                    {this.state.toggleRoadShip && (
                      <div className="fix-width-label analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                        <div>
                          <input
                            type="radio"
                            name="road-opt"
                            value="FTL"
                            id="ftl-ship"
                            onClick={this.toggleFtlLtl}
                          />
                          <label htmlFor="ftl-ship">FTL</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="road-opt"
                            value="LTL"
                            id="ltl-ship"
                            onClick={this.toggleFtlLtl}
                          />
                          <label htmlFor="ltl-ship">LTL</label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ana-rep">
                    <button
                      className="butn mt-0"
                      onClick={this.handleAnalyticsShipment.bind(this)}
                      id="shipment-view-btn"
                    >
                      view
                    </button>
                    <a href="/reports" className="butn mt-0 blue-butn">
                      Reports
                    </a>
                  </div>
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0">
                    <select
                      onChange={this.handleShipmentChangePerion}
                      id="drp-period-shipment"
                    >
                      <option value="W">Weekly</option>
                      <option selected value="M">
                        Monthly
                      </option>
                      <option value="Y">Yearly</option>
                    </select>
                  </div>
                  {/* <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Supplier </span>
                    <select>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                      <option>Supplier Name</option>
                    </select>
                  </div> */}
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Segregated&nbsp;by </span>
                    <select id="SegregatedBydrp">
                      <option value="CountChart">Count Chart</option>
                      <option value="VolumeChart">Volume Chart</option>
                      {/* <option value="ValueChart">Value Chart</option> */}
                    </select>
                  </div>
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Dated&nbsp;by </span>
                    <select id="Datedbydrp">
                      <option value="Delivery Date" seected>
                        Delivery Date
                      </option>
                      <option value="Booking Date">Booking Date</option>
                      <option value="Dispatched Date">Dispatched Date</option>
                    </select>
                  </div>
                  {this.state.toggleShipmentYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>Year</span>
                      <select id="date-year-shipment">
                        {this.buildOptions()}
                      </select>
                    </div>
                  )}
                  {!this.state.toggleShipmentYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>From </span>

                      {this.state.toggleShipmentWeekDate && (
                        <DatePicker
                          id="datpicker-from-shipment"
                          className="ana-to"
                          selected={this.state.startDate}
                          onChange={this.handleChangeStart}
                          maxDate={new Date()}
                          showWeekNumbers
                        />
                      )}
                      {this.state.toggleShipmentMonthDate && (
                        <DatePicker
                          id="datpicker-from-shipment"
                          className="ana-to"
                          selected={this.state.startDate}
                          onChange={this.handleChangeStart}
                          dateFormat="MM/yyyy"
                          maxDate={new Date()}
                          showMonthYearPicker
                        />
                      )}
                    </div>
                  )}
                  {!this.state.toggleShipmentYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>To </span>
                      {this.state.toggleShipmentWeekDate && (
                        <DatePicker
                          id="datpicker-to-shipment"
                          className="ana-to"
                          selected={this.state.endDate}
                          onChange={this.handleChangeEnd}
                          maxDate={new Date()}
                          showWeekNumbers
                        />
                      )}
                      {this.state.toggleShipmentMonthDate && (
                        <DatePicker
                          id="datpicker-to-shipment"
                          className="ana-to"
                          selected={this.state.endDate}
                          onChange={this.handleChangeEnd}
                          dateFormat="MM/yyyy"
                          maxDate={new Date()}
                          showMonthYearPicker
                        />
                      )}
                    </div>
                  )}
                  {/* <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Values </span>
                    <select>
                      <option>$1 - $100</option>
                      <option>$101 - $200</option>
                      <option>$201 - $300</option>
                    </select>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-9">
                    <Bar
                      data={buyerShipmentData}
                      width={100}
                      height={50}
                      options={volumeOptions}
                    />
                  </div>
                  {/* <div className="col-md-3">
                    <Doughnut
                      data={greenCounterdata}
                      width={700}
                      height={600}
                      options={greencounterOption}
                    />
                  </div> */}
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="invoices"
                role="tabpanel"
                aria-labelledby="invoices-tab"
              >
                <div className="ana-radio-cntr align-items-center justify-content-between">
                  <div className="ana-viw">
                    <div className="analy-radio new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input
                          type="radio"
                          name="ship-type-invoice"
                          id="active-inv"
                          value="A"
                        />
                        <label htmlFor="active-inv">Active</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-type-invoice"
                          id="delivered-inv"
                          value="D"
                        />
                        <label htmlFor="delivered-inv">Delivered</label>
                      </div>
                    </div>
                    <div className="analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                      <div>
                        <input
                          type="radio"
                          name="ship-way-invoice"
                          id="plane-inv"
                          onClick={this.toggleBtnsInv}
                          value="A"
                        />
                        <label htmlFor="plane-inv">
                          <img
                            className="ana-icon-blue"
                            src={PlaneBlue}
                            alt="plane icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={PlaneWhite}
                            alt="plane icon"
                          />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-way-invoice"
                          id="ship-inv"
                          onClick={this.toggleBtnsInv}
                          value="O"
                        />
                        <label htmlFor="ship-inv">
                          <img
                            className="ana-icon-blue"
                            src={ShipBlue}
                            alt="ship icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={ShipWhite}
                            alt="ship icon"
                          />
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="ship-way-invoice"
                          id="road-inv"
                          onClick={this.toggleBtnsInv}
                          value="I"
                        />
                        <label htmlFor="road-inv">
                          <img
                            className="ana-icon-blue"
                            src={TruckBlue}
                            alt="truck icon"
                          />
                          <img
                            className="ana-icon-white"
                            src={TruckWhite}
                            alt="truck icon"
                          />
                        </label>
                      </div>
                    </div>
                    {this.state.toggleShipInv && (
                      <div className="fix-width-label analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                        <div>
                          <input
                            type="radio"
                            name="sea-opt-invoice"
                            id="fcl-inv"
                            value="FCL"
                            onClick={this.toggleInvFclLcl}
                          />
                          <label htmlFor="fcl-inv">FCL</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="sea-opt-invoice"
                            id="lcl-inv"
                            value="LCL"
                            onClick={this.toggleInvFclLcl}
                          />
                          <label htmlFor="lcl-inv">LCL</label>
                        </div>
                      </div>
                    )}
                    {this.state.toggleRoadInv && (
                      <div className="fix-width-label analy-radio analy-radio-icons new-radio-rate-cntr radio-light-blue">
                        <div>
                          <input
                            type="radio"
                            name="road-opt-invoice"
                            id="ftl-inv"
                            value="FTL"
                            onClick={this.toggleInvFtlLtl}
                          />
                          <label htmlFor="ftl-inv">FTL</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            name="road-opt-invoice"
                            id="ltl-inv"
                            value="LTL"
                            onClick={this.toggleInvFtlLtl}
                          />
                          <label htmlFor="ltl-inv">LTL</label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ana-rep">
                    <button
                      className="butn mt-0"
                      onClick={this.handleAnalyticsInvoice.bind(this)}
                      id="invoices-view-btn"
                    >
                      view
                    </button>
                    <a href="/reports" className="butn mt-0 blue-butn">
                      Reports
                    </a>
                  </div>
                </div>
                <div className="ana-radio-cntr">
                  <div className="login-fields mb-0">
                    <select
                      id="drp-period-invoice"
                      onChange={this.handleChangePerion}
                    >
                      <option value="W">Weekly</option>
                      <option selected value="M">
                        Monthly
                      </option>
                      <option value="Y">Yearly</option>
                    </select>
                  </div>
                  <div className="login-fields mb-0 d-flex align-items-center">
                    <span>Supplier </span>
                    <select id="drp-supplie-invoice">
                      {optionSupplierName}
                    </select>
                  </div>

                  {this.state.toggleYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>Year</span>
                      <select id="date-year-invoice">
                        {this.buildOptions()}
                      </select>
                    </div>
                  )}
                  {!this.state.toggleYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>From </span>
                      {this.state.toggleWeekDate && (
                        <DatePicker
                          id="datpicker-from-invoice"
                          className="ana-to"
                          selected={this.state.startDate}
                          onChange={this.handleChangeStart}
                          maxDate={new Date()}
                          showWeekNumbers
                        />
                      )}
                      {this.state.toggleMonthDate && (
                        <DatePicker
                          id="datpicker-from-invoice"
                          className="ana-to"
                          selected={this.state.startDate}
                          onChange={this.handleChangeStart}
                          dateFormat="MM/yyyy"
                          maxDate={new Date()}
                          showMonthYearPicker
                        />
                      )}
                    </div>
                  )}
                  {!this.state.toggleYearDate && (
                    <div className="login-fields mb-0 d-flex align-items-center">
                      <span>To </span>
                      {this.state.toggleWeekDate && (
                        <DatePicker
                          id="datpicker-to-invoice"
                          className="ana-to"
                          selected={this.state.endDate}
                          onChange={this.handleChangeEnd}
                          maxDate={new Date()}
                          showWeekNumbers
                        />
                      )}
                      {this.state.toggleMonthDate && (
                        <DatePicker
                          id="datpicker-to-invoice"
                          className="ana-to"
                          selected={this.state.endDate}
                          onChange={this.handleChangeEnd}
                          dateFormat="MM/yyyy"
                          maxDate={new Date()}
                          showMonthYearPicker
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Bar
                      data={buyerData}
                      width={100}
                      height={50}
                      options={volumeOptions}
                    />
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

export default Analytics;

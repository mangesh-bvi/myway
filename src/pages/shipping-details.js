import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import { Button, Modal, ModalBody } from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Rail from "./../assets/img/rail.png";
import PlaneColor from "./../assets/img/AirShipment-color.png";
import OceanColor from "./../assets/img/OceanShipment-color.png";
import TruckColor from "./../assets/img/DelayShipment-color.png";
import { encryption } from "../helpers/encryption";
import Delivered from "./../assets/img/delivered.png";
import ArrivedStatusColor from "./../assets/img/Arrived-b.png";
import InlandTransportStatusColor from "./../assets/img/InlandTransportation-b.png";
import TransshippedStatus from "./../assets/img/transshipped-status.png";
import InTransitStatus from "./../assets/img/in-transit-status.png";
import GateInStatus from "./../assets/img/gate-in-status.png";
import DepartedStatusColor from "./../assets/img/Departed-b.png";
import DeliveredStatusColor from "./../assets/img/Delivered-b.png";
import BookedStatusColor from "./../assets/img/Booked-b.png";
import ApprovedStatusColor from "./../assets/img/Approved-b.png";
import "font-awesome/css/font-awesome.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import Autocomplete from "react-autocomplete";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import moment from "moment";

class ShippingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentSummary: [],
      listDis: "none",
      mapDis: "block",
      copied: false,
      shareLink: "http://mywayqa.demo.brainvire.net/track-shipment?",
      filterAll: "",
      filtered: [],
      modalAdvSearch: false,
      selectMOT: [
        { key: 0, value: "Select Mode" },
        { key: "A", value: "Air" },
        { key: "O", value: "Ocean" },
        { key: "I", value: "Inland" }
      ],
      selectShipStage: [],
      fields: {},
      value: "",
      Consignee: [],
      Shipper: [],
      POL: [],
      POD: [],
      menuStyle: {
        borderRadius: "3px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "2px 0",
        fontSize: "90%",
        position: "absolute",
        overflow: "auto",
        zIndex: "1",
        maxWidth: "300px",
        maxHeight: "50%"
      },
      optionsOrigin: [],
      FrDepDate: null,
      ToDepDate: null,
      FrArrDate: null,
      ToArrDate: null,
      originCountry: [],
      destCountry: [],
      ConsigneeID: 0,
      ShipperID: 0,
      modalShare: false,
      loading: false
    };
    this.BindListShipmentSummey = this.BindListShipmentSummey.bind(this);
    this.MapButn = this.MapButn.bind(this);
    this.listButn = this.listButn.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
    this.toggleAdvSearch = this.toggleAdvSearch.bind(this);
    this.BindShipmentStageData = this.BindShipmentStageData.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
  }

  componentDidMount() {
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("=")[1];
    var shiptype = "";
    if (url !== undefined) {
      shiptype = url;
    }
    this.BindListShipmentSummey(shiptype);
    this.BindCountryDropDownData();
  }
  //// toggle share modal popup
  toggleShare(e) {
    e.stopPropagation();

    var URL = window.location.host;
    this.setState(prevState => ({
      modalShare: !prevState.modalShare,
      copied: false,
      shareLink: URL + "/track-shipment?hblno="
    }));
  }
  //// Handle Click to Share Icon
  HandleClickShareIcon(evt, row) {
    evt.stopPropagation();
    var URL = window.location.host;
    var shareLink = URL + "/track-shipment?";
    var hblNo = row.original["Encoding_HBl#"];
    this.setState(prevState => ({
      modalShare: !prevState.modalShare,
      shareLink: shareLink + hblNo
    }));
  }
  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
      const filterAll = "";
      this.setState({
        filtered: filtered.filter(item => item.id !== "all"),
        filterAll
      });
    } else this.setState({ filtered });
  }
  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: "all", value: filterAll }];
    this.setState({ filterAll, filtered });
  }

  //// Bind Shipment summey data
  BindListShipmentSummey(shiptype) {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/shipmentsummaryAPI`,
      data: {
        UserId: userid,
        PageNo: 1
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var data = response.data.Table1;
      var inland = data.filter(x => x.ModeOfTransport === "Inland").length;
      var air = data.filter(x => x.ModeOfTransport === "Air").length;
      var ocean = data.filter(x => x.ModeOfTransport === "Ocean").length;

      if (shiptype !== "") {
        data = data.filter(item => item.ModeOfTransport === shiptype);
        if (data.length === 0) {
          data = [{ POL: "No record found" }];
        }
      } else {
      }

      self.setState({ shipmentSummary: data });

      window.localStorage.setItem("aircount", air);
      window.localStorage.setItem("oceancount", ocean);
      window.localStorage.setItem("inlandcount", inland);
    });
  }
  ////Handle Change Shipment Details
  HandleChangeShipmentDetails(HblNo, eventManage) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: HblNo, event: eventManage, pageName: "ShipmentPage" }
    });
  }
  ////Handle Row click
  HandleRowClickEvt = (rowInfo, column) => {
    return {
      onClick: e => {
        if (column.row.POL === "No Record Found") {
          return false;
        } else {
          var pol = column.original["POL"];
          if (pol !== "No record found" && pol !== "No Record Found") {
            var hblNo = column.original["HBL#"];
            var eventManage = column.original["Event"];
            if (hblNo) {
              this.HandleChangeShipmentDetails(hblNo, eventManage);
            } else {
              NotificationManager.error("HBL No not Found");
              return false;
            }
          }
        }
      }
    };
  };
  ////map button click to redirect dashboard page
  MapButn() {
    this.setState({ listDis: "block", mapDis: "none" });
    this.props.history.push({
      pathname: "dashboard",
      state: { detail: false }
    });
  }
  listButn() {
    this.setState({ listDis: "none", mapDis: "block" });
  }
  ////toggle AdvSearch modal popup
  toggleAdvSearch() {
    this.setState(prevState => ({
      modalAdvSearch: !prevState.modalAdvSearch
    }));
  }
  HandleAdvanceSearchModalClose() {
    this.setState({
      FrDepDate: null,
      ToDepDate: null,
      FrArrDate: null,
      ToArrDate: null,
      modalAdvSearch: false,
      fields: {},
      originCountry: "",
      destCountry: "",
      ConsigneeID: 0,
      ShipperID: 0
    });
  }

  //// Handle select mode of transport data
  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    if (e.target.value === "Select") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields,
      selectShipStage: []
    });
    this.BindShipmentStageData();
  }
  ////Bind Change consignee and shipper data
  BindChangeCon(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    self.setState({
      fields
    });
    if (fields[field].length >= 3) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerAutoSearchMessage`,
        data: {
          CompanyName: fields[field],
          
          UserID: encryption(window.localStorage.getItem("userid"), "desc")
        },
        headers: authHeader()
      })
        .then(function(response) {
          debugger;
          if (field === "Consignee") {
            self.setState({
              Consignee: response.data,
              fields
            });
          } else {
            self.setState({
              Shipper: response.data,
              fields
            });
          }
        })
        .catch(error => {
          debugger;
          var temperror = error.response.data;
          var err = temperror.split(":");
        });
    } else {
      if (field === "Consignee") {
        self.setState({
          Consignee: [],
          fields
        });
      } else {
        self.setState({
          Shipper: [],
          fields
        });
      }
    }
  }

  ////Handle Select consignee and shipper data
  HandleSelectCon(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;
    if (field === "Consignee") {
      this.state.ConsigneeID = id.Company_ID;
    } else {
      this.state.ShipperID = id.Company_ID;
    }

    this.setState({
      fields,
      ConsigneeID: this.state.ConsigneeID,
      ShipperID: this.state.ShipperID
    });
  }

  onCopy = () => {
    this.setState({ copied: true });
  };

  ////Bind country drop-down data
  BindCountryDropDownData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchCountryList`,
      headers: authHeader()
    }).then(function(response) {
      for (let i = 0; i < response.data.Table.length; i++) {
        self.state.optionsOrigin.push({
          value: response.data.Table[i].SUCountry,
          label: response.data.Table[i].CountryName
        });
      }

      self.setState({
        optionsOrigin: self.state.optionsOrigin
      });
    });
  }

  ////Bind pol pod drop-down data
  BindChangePOLPODData(field, e) {
    if (this.state.fields["ModeOfTransport"]) {
      let self = this;
      let fields = this.state.fields;
      fields[field] = e.target.value;
      if (fields[field].length >= 3) {
        self.setState({
          fields,
          POL: []
        });
        axios({
          method: "post",
          url: `${appSettings.APIURL}/PolPodByCountry`,
          data: {
            Mode: this.state.fields["ModeOfTransport"],
            Search: fields[field]
          },
          headers: authHeader()
        }).then(function(response) {
          if (field === "POL") {
            self.setState({
              POL: response.data.Table
            });
          } else {
            self.setState({
              POD: response.data.Table
            });
          }
        });
        this.setState({
          fields
        });
      } else {
        if (field === "POL") {
          this.setState({
            fields,
            POL: []
          });
        } else {
          this.setState({
            fields,
            POD: []
          });
        }
      }
    } else {
      NotificationManager.error("Please select Mode of Transport");
      return false;
    }
  }
  ///// Handle select pol pod data
  HandleSelectPOLPOD(field, value) {
    let fields = this.state.fields;
    fields[field] = value;
    this.setState({
      fields
    });
  }
  /////Bind shipment stages data
  BindShipmentStageData() {
    let self = this;
    var Mode = this.state.fields["ModeOfTransport"];
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentStages`,
      data: {
        Mode: Mode
      },
      headers: authHeader()
    }).then(function(response) {
      self.setState({ selectShipStage: response.data.Table });
    });
  }
  ////Handle Change Date Picker
  HandleChangeDatePicker(field, e) {
    if (field === "FromDeparture") {
      this.setState({
        FrDepDate: e
      });
    } else if (field === "ToDeparture") {
      this.setState({
        ToDepDate: e
      });
    } else if (field === "FromArrival") {
      this.setState({
        FrArrDate: e
      });
    } else {
      this.setState({
        ToArrDate: e
      });
    }
  }
  //// Handle change country drop-down
  HandleChangeCountry(text, e) {
    var value = e.target.value;
    if (text === "OriginCountry") {
      this.setState({
        originCountry: value
      });
    } else {
      this.setState({
        destCountry: value
      });
    }
  }
  ////Handle Submit advance serach modal popup
  HandleSubmit = () => {
    if (this.state.fields["ModeOfTransport"]) {
      let self = this;

      var FromETDDate = "";

      if (document.getElementById("FrDepDate").value !== "") {
        var date = new Date(document.getElementById("FrDepDate").value);
        FromETDDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();
      } else {
        FromETDDate = "";
      }
      var ToETDDate = "";
      if (document.getElementById("ToDepDate").value !== "") {
        var date1 = new Date(document.getElementById("ToDepDate").value);

        ToETDDate =
          date1.getFullYear() +
          "-" +
          (date1.getMonth() + 1) +
          "-" +
          date1.getDate();
      } else {
        ToETDDate = "";
      }

      var FromETADate = "";
      if (document.getElementById("FrArrDate").value !== "") {
        var date2 = new Date(document.getElementById("FrArrDate").value);

        FromETADate =
          date2.getFullYear() +
          "-" +
          (date2.getMonth() + 1) +
          "-" +
          date2.getDate();
      } else {
        FromETADate = "";
      }
      var ToETADate = "";
      if (document.getElementById("ToArrDate").value !== "") {
        var date3 = new Date(document.getElementById("ToArrDate").value);
        var ToETADate =
          date3.getFullYear() +
          "-" +
          (date3.getMonth() + 1) +
          "-" +
          date3.getDate();
      } else {
        ToETADate = "";
      }

      var OriginCountry = "";
      if (this.state.originCountry.length > 0) {
        OriginCountry =
          this.state.originCountry !== "Select" ? this.state.originCountry : "";
      }

      var DestCntry = "";
      if (this.state.destCountry.length > 0) {
        DestCntry =
          this.state.destCountry !== "Select" ? this.state.destCountry : "";
      }

      var Consignee = this.state.ConsigneeID;
      var Shipper = this.state.ShipperID;
      var pol = this.state.fields["POL"] || "";
      var pod = this.state.fields["POD"] || "";
      var ShipmentStage = Number(this.state.fields["ShipmentStage"]) || 0;
      var ModeOfTransport = this.state.fields["ModeOfTransport"] || "";
      var userid = encryption(window.localStorage.getItem("userid"), "desc");

      axios({
        method: "post",
        url: `${appSettings.APIURL}/TrackShipmentSearch`,
        data: {
          StageID: ShipmentStage,
          ModeofTransport: ModeOfTransport,
          UserID: userid,
          FromETADate: FromETADate,
          ToETADate: ToETADate,
          FromETDDate: FromETDDate,
          ToETDDate: ToETDDate,
          OriginCntry: OriginCountry,
          DestCntry: DestCntry,
          POL: pol,
          POD: pod,
          ShipperID: Shipper,
          ConsigneeID: Consignee
        },
        headers: authHeader()
      })
        .then(function(response) {
          self.setState({
            shipmentSummary: [],
            loading: false
          });
          for (let i = 0; i < response.data.Table.length; i++) {
            self.state.shipmentSummary.push({
              "BL/HBL": response.data.Table[0]["BL#/HBL#"],
              Consignee: response.data.Table[i]["Consignee"],
              ConsigneeID: response.data.Table[i]["ConsigneeID"],
              ETA: response.data.Table[i]["ETA"],
              ETD: response.data.Table[i]["ETD"],
              Event: response.data.Table[i]["Event"],
              "HBL#": response.data.Table[i]["HBL#"],
              ModeOfTransport: response.data.Table[i]["ModeOfTransport"],
              POD: response.data.Table[i]["POD"],
              POL: response.data.Table[i]["POL"],
              SR_No: i + 1,
              Shipper: response.data.Table[i]["Shipper"],
              ShipperID: response.data.Table[i]["ShipperID"],
              Status: response.data.Table[i]["Current_Status"]
            });
          }
          // self.setState({  });
          self.setState(prevState => ({
            shipmentSummary: self.state.shipmentSummary
          }));
        })
        .catch(error => {
          var data = error.response.data;
          if (data) {
            self.setState({
              shipmentSummary: [
                {
                  POL: "No Record Found"
                }
              ]
            });
          }
        });

      this.setState({
        shipmentSummary: []
      });
      this.HandleAdvanceSearchModalClose();
    } else {
      NotificationManager.error("Please select Mode of transport");
    }
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = this.state.errors;
    let formIsValid = true;

    if (!fields["ModeOfTransport"]) {
      formIsValid = false;
    }
    if (!fields["ShipmentStage"]) {
      formIsValid = false;
    }
    return formIsValid;
  }

  HandleClearSearch() {
    // let self = this;
    // this.setState({shipmentSummary:[]})
    // var userid = encryption(window.localStorage.getItem("userid"), "desc");
    // axios({
    //   method: "post",
    //   url: `${appSettings.APIURL}/shipmentsummaryAPI`,
    //   data: {
    //     UserId: userid,
    //     PageNo: 1
    //   },
    //   headers: authHeader()
    // }).then(function(response) {
    //   debugger;
    //   var data = response.data.Table1;
    //   self.setState({ shipmentSummary: data });

    //   var inland = data.filter(x => x.ModeOfTransport === "Inland").length;
    //   var air = data.filter(x => x.ModeOfTransport === "Air").length;
    //   var ocean = data.filter(x => x.ModeOfTransport === "Ocean").length;
    //   window.localStorage.setItem("aircount", air);
    //   window.localStorage.setItem("oceancount", ocean);
    //   window.localStorage.setItem("inlandcount", inland);
    // });
    window.location.href = "shipment-summary";
    // this.props.history.push("shipment-summary")
  }

  render() {
    const { shipmentSummary } = this.state;

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
          {this.state.loading === true ? (
            <div className="position-relative h-100">
              <div className="loader-icon"></div>
            </div>
          ) : (
            <div className="cls-rt">
              <div className="title-sect d-block-xs btnxs">
                <div className="clearSearch">
                  <h2>Shipments</h2>
                  <span onClick={this.HandleClearSearch.bind(this)}>
                    Clear Search
                  </span>
                </div>
                <div className="d-flex d-block-xs align-items-center">
                  <input
                    type="search"
                    value={this.state.filterAll}
                    onChange={this.filterAll}
                    placeholder="Search here"
                  />

                  <a
                    href="#!"
                    onClick={this.listButn}
                    style={{ display: this.state.listDis }}
                    className="butn light-blue-butn mr-0"
                  >
                    List View
                  </a>
                  <button
                    onClick={this.toggleAdvSearch}
                    style={{ marginLeft: "15px" }}
                    className="butn"
                  >
                    Advance Search
                  </button>
                  <button
                    onClick={this.MapButn}
                    style={{ display: this.state.mapDis }}
                    className="butn"
                  >
                    Map View
                  </button>
                </div>
              </div>
              <div style={{ display: this.state.listDis }} className="map-tab">
                <div className="full-map"></div>
              </div>
              <div
                style={{ display: this.state.mapDis }}
                className="ag-fresh redirect-row"
              >
                <ReactTable
                  data={shipmentSummary}
                  noDataText=""
                  onFilteredChange={this.onFilteredChange.bind(this)}
                  filtered={this.state.filtered}
                  defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value
                  }
                  columns={[
                    {
                      columns: [
                        {
                          Header: "BL/HBL",
                          accessor: "BL/HBL",
                          sortable: true
                        },
                        {
                          Header: "HBL",
                          accessor: "HBL#",
                          sortable: true,
                          show: false,
                          Cell: row => {
                            return row.value.trim();
                          }
                        },
                        {
                          Cell: row => {
                            if (row.value === "Air") {
                              return (
                                <>
                                  <div
                                    title="Plane"
                                    id="transit"
                                    className="shipment-img"
                                  >
                                    <img src={PlaneColor} />
                                  </div>
                                </>
                              );
                            } else if (row.value === "Ocean") {
                              return (
                                <div title="Ship" className="shipment-img">
                                  <img src={OceanColor} />
                                </div>
                              );
                            } else if (row.value === "Inland") {
                              return (
                                <div title="Truck" className="shipment-img">
                                  <img src={TruckColor} />
                                </div>
                              );
                            } else if (row.value === "Railway") {
                              return (
                                <div title="Rail" className="shipment-img">
                                  <img src={Rail} />
                                </div>
                              );
                            } else {
                              return row.value || "";
                            }
                          },
                          Header: "Mode",
                          accessor: "ModeOfTransport",
                          sortable: true
                        },
                        {
                          Header: "Consignee",
                          accessor: "Consignee",
                          Cell: row => {
                            return (
                              <span title={row.value} className="max3">
                                {row.value || ""}
                              </span>
                            );
                          }
                        },
                        {
                          Header: "Shipper",
                          accessor: "Shipper",
                          Cell: row => {
                            return (
                              <span title={row.value} className="max3">
                                {row.value || ""}
                              </span>
                            );
                          }
                        },
                        {
                          Header: "POL",
                          accessor: "POL",
                          Cell: row => {
                            return (
                              <span title={row.value} className="max3">
                                {row.value || ""}
                              </span>
                            );
                          }
                        },

                        {
                          Header: "POD",
                          accessor: "POD",
                          Cell: row => {
                            return (
                              <span title={row.value} className="max3">
                                {row.value || ""}
                              </span>
                            );
                          }
                        },
                        {
                          Cell: row => {
                            if (row.value == "Planning in Progress") {
                              return (
                                <div
                                  title="Planning in Progress"
                                  className="status-img"
                                >
                                  <img src={Delivered} />
                                </div>
                              );
                            } else if (row.value === "Departed") {
                              return (
                                <div title="Departed" className="status-img">
                                  <img src={DepartedStatusColor} />
                                </div>
                              );
                            } else if (row.value === "Transshipped") {
                              return (
                                <div
                                  title="Transshipped"
                                  className="status-img"
                                >
                                  <img src={TransshippedStatus} />
                                </div>
                              );
                            } else if (row.value === "Arrived") {
                              return (
                                <div title="Arrived" className="status-img">
                                  <img src={ArrivedStatusColor} />
                                </div>
                              );
                            } else if (row.value === "Booked") {
                              return (
                                <div title="Booked" className="status-img">
                                  <img src={BookedStatusColor} />
                                </div>
                              );
                            } else if (row.value === "Gate In") {
                              return (
                                <div title="Gate In" className="status-img">
                                  <img src={GateInStatus} />
                                </div>
                              );
                            } else if (row.value === "Approved") {
                              return (
                                <div title="Approved" className="status-img">
                                  <img src={ApprovedStatusColor} />
                                </div>
                              );
                            } else if (row.value === "In Transit") {
                              return (
                                <div title="In Transit" className="status-img">
                                  <img src={InTransitStatus} />
                                </div>
                              );
                            } else if (row.value === "Inland Transportation") {
                              return (
                                <div
                                  title="Inland Transportation"
                                  className="status-img"
                                >
                                  <img src={InlandTransportStatusColor} />
                                </div>
                              );
                            } else if (row.value === "Delivered") {
                              return (
                                <div title="Delivered" className="status-img">
                                  <img src={DeliveredStatusColor} />
                                </div>
                              );
                            } else if (row.value === "DO Issued") {
                              return <div title="DO Issued">{row.value}</div>;
                            } else {
                              return row.value || "";
                            }
                          },
                          Header: "Status",
                          accessor: "Status"
                        },
                        {
                          Header: "ETA",
                          accessor: "ETA",
                          sortMethod: (a, b) => {
                            var a1 = new Date(a).getTime();
                            var b1 = new Date(b).getTime();
                            if (a1 < b1) return 1;
                            else if (a1 > b1) return -1;
                            else return 0;
                          }
                        },
                        {
                          Header: "Event",
                          accessor: "Event",
                          Cell: row => {
                            if (row.value == "N/A") {
                              return (
                                <div>
                                  <label className="">{row.value}</label>
                                </div>
                              );
                            } else if (row.value === "On Time") {
                              return (
                                <div>
                                  <label className="girdevtgreen">
                                    {row.value}
                                  </label>
                                </div>
                              );
                            } else if (row.value === "Behind Schedule") {
                              return (
                                <div>
                                  <label className="girdevtred">
                                    {row.value}
                                  </label>
                                </div>
                              );
                            } else if (row.value === "Delay Risk") {
                              return (
                                <div>
                                  <label className="girdevtyellow">
                                    {row.value}
                                  </label>
                                </div>
                              );
                            } else {
                              return row.value || "";
                            }
                          }
                        },
                        {
                          Cell: row => {
                            if (row.row.POL === "No Record Found") {
                              return <></>;
                            } else {
                              if (
                                row.original.POL !== "No record found" &&
                                row.original.POL !== "No Record Found"
                              ) {
                                return (
                                  <i
                                    className="fa fa-share-alt shareicon"
                                    onClick={e =>
                                      this.HandleClickShareIcon(e, row)
                                    }
                                    aria-hidden="true"
                                  ></i>
                                );
                              } else {
                                return <div></div>;
                              }
                            }
                          },
                          Header: row => {
                            return <span>&nbsp;</span>;
                          },
                          width: 40
                        }
                      ]
                    },
                    {
                      show: false,
                      Header: "All",
                      id: "all",
                      width: 0,
                      resizable: false,
                      sortable: false,
                      Filter: () => {},
                      getProps: () => {
                        return {
                          // style: { padding: "0px"}
                        };
                      },
                      filterMethod: (filter, rows) => {
                        var result = matchSorter(rows, filter.value, {
                          keys: [
                            "BL/HBL",
                            "HBL#",
                            "Consignee",
                            "ConsigneeID",
                            "Event",
                            "ETA",
                            "Status",
                            "POD",
                            "POL",
                            "Shipper",
                            "ModeOfTransport"
                          ],
                          threshold: matchSorter.rankings.WORD_STARTS_WITH
                        });
                        if (result.length > 0) {
                          return result;
                        } else {
                          result = [{ POL: "No Record Found" }];
                          return result;
                        }
                      },
                      filterAll: true
                    }
                  ]}
                  className="ship-summ-table -striped -highlight"
                  defaultPageSize={10}
                  getTrProps={this.HandleRowClickEvt}
                  minRows={1}
                />
              </div>

              {/* --------------------------- start advance search modal popup------------------------ */}

              <Modal
                className="advsearch-popup"
                isOpen={this.state.modalAdvSearch}
                toggle={this.toggleAdvSearch}
                centered={true}
              >
                <ModalBody className="p-0">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.toggleAdvSearch}
                  >
                    <span>&times;</span>
                  </button>
                  <div className="container-fluid p-0">
                    <div className="advsearch-sect">
                      <div
                        style={{
                          background: "#fff",
                          padding: "15px",
                          borderRadius: "15px"
                        }}
                      >
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <label>Mode Of Transport</label>
                              <select
                                onChange={this.HandleChangeSelect.bind(
                                  this,
                                  "ModeOfTransport"
                                )}
                                name={"ModeOfTransport"}
                                value={this.state.fields["ModeOfTransport"]}
                              >
                                {this.state.selectMOT.map(team => (
                                  <option key={team.key} value={team.key}>
                                    {team.value}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <label>Shipment Stage</label>
                              <select
                                onChange={this.HandleChangeSelect.bind(
                                  this,
                                  "ShipmentStage"
                                )}
                                name={"ShipmentStage"}
                                value={this.state.fields["ShipmentStage"]}
                              >
                                <option value="Select">Select Stage</option>
                                {this.state.selectShipStage.map(team => (
                                  <option
                                    key={team.StageId}
                                    value={team.StageId}
                                  >
                                    {team.StageName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                            {/* <div class="rate-radio-cntr"> */}
                            <div
                              className="login-fields"
                              style={{ width: "100%" }}
                            >
                              <label
                                className="auto-cmp"
                                style={{ padding: "0" }}
                              >
                                Consignee
                              </label>

                              <div className="position-relative">
                                <div className="auto-comp-drp-dwn auto-comp-drp-dwn-adv">
                                  <Autocomplete
                                    getItemValue={item => item.Company_Name}
                                    items={this.state.Consignee}
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
                                    onChange={this.BindChangeCon.bind(
                                      this,
                                      "Consignee"
                                    )}
                                    onSelect={this.HandleSelectCon.bind(
                                      this,
                                      item => item.Company_ID,
                                      "Consignee"
                                    )}
                                    value={this.state.fields["Consignee"]}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>            
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <div>
                                <label>From Date Of Departure</label>
                                <DatePicker
                                  id="FrDepDate"
                                  selected={this.state.FrDepDate}
                                  showMonthDropdown
                                  showYearDropdown
                                  onChange={this.HandleChangeDatePicker.bind(
                                    this,
                                    "FromDeparture"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <div>
                                <label>To Date Of Departure</label>
                                <DatePicker
                                  id="ToDepDate"
                                  selected={this.state.ToDepDate}
                                  showMonthDropdown
                                  showYearDropdown
                                  onChange={this.HandleChangeDatePicker.bind(
                                    this,
                                    "ToDeparture"
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                            <div
                              className="login-fields"
                              style={{ width: "100%" }}
                            >
                              <label
                                className="auto-cmp"
                                style={{ padding: "0" }}
                              >
                                Shipper
                              </label>

                              <div className="position-relative">
                                <div className="auto-comp-drp-dwn auto-comp-drp-dwn-adv">
                                  <Autocomplete
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
                                    onChange={this.BindChangeCon.bind(
                                      this,
                                      "Shipper"
                                    )}
                                    onSelect={this.HandleSelectCon.bind(
                                      this,
                                      item => item.Company_ID,
                                      "Shipper"
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                          {/* </div> */}
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <div>
                                <label>From Date Of Arrival</label>
                                <DatePicker
                                  id="FrArrDate"
                                  selected={this.state.FrArrDate}
                                  showMonthDropdown
                                  showYearDropdown
                                  onChange={this.HandleChangeDatePicker.bind(
                                    this,
                                    "FromArrival"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              <div>
                                <label>To Date Of Arrival</label>
                                <DatePicker
                                  id="ToArrDate"
                                  selected={this.state.ToArrDate}
                                  showMonthDropdown
                                  showYearDropdown
                                  onChange={this.HandleChangeDatePicker.bind(
                                    this,
                                    "ToArrival"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              {/* <div class="rate-radio-cntr"> */}
                              <div
                                className="login-fields"
                                style={{ width: "100%" }}
                              >
                                <label style={{ padding: "0" }}>
                                  Origin Country
                                </label>

                                <select
                                  onChange={this.HandleChangeCountry.bind(
                                    this,
                                    "OriginCountry"
                                  )}
                                  name={"originCountry"}
                                  value={this.state.fields["OriginCountry"]}
                                >
                                  <option value="Select">Select Country</option>
                                  {this.state.optionsOrigin.map(team => (
                                    <option key={team.value} value={team.label}>
                                      {team.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* </div> */}
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields">
                              {/* <div class="rate-radio-cntr"> */}
                              <div
                                className="login-fields"
                                style={{ width: "100%" }}
                              >
                                <label style={{ padding: "0" }}>
                                  Destination Country
                                </label>

                                <select
                                  onChange={this.HandleChangeCountry.bind(
                                    this,
                                    "DestinationCountry"
                                  )}
                                  name={"destinCountry"}
                                  value={
                                    this.state.fields["DestinationCountry"]
                                  }
                                >
                                  <option value="Select">Select Country</option>
                                  {this.state.optionsOrigin.map(team => (
                                    <option key={team.value} value={team.label}>
                                      {team.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                        </div>
                        {/* </div> */}

                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields divwd">
                              {/* <div class="rate-radio-cntr"> */}
                              <div style={{ width: "100%" }}>
                                <label style={{ padding: "0" }}>POL</label>
                                <div className="position-relative">
                                  <div className="auto-comp-drp-dwn auto-comp-drp-dwn-adv">
                                    <Autocomplete
                                      getItemValue={item =>
                                        item.NameWoDiacritics
                                      }
                                      items={this.state.POL}
                                      renderItem={(item, isHighlighted) => (
                                        <div
                                          style={{
                                            background: isHighlighted
                                              ? "lightgray"
                                              : "white"
                                          }}
                                        >
                                          {item.NameWoDiacritics}
                                        </div>
                                      )}
                                      value={this.state.fields["POL"]}
                                      onChange={this.BindChangePOLPODData.bind(
                                        this,
                                        "POL"
                                      )}
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.HandleSelectPOLPOD.bind(
                                        this,
                                        "POL"
                                      )}
                                      isMulti={true}
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                            <div className="login-fields divwd">
                              {/* <div class="rate-radio-cntr"> */}
                              <div style={{ width: "100%" }}>
                                <label style={{ padding: "0" }}>POD</label>

                                <div className="position-relative">
                                  <div className="auto-comp-drp-dwn auto-comp-drp-dwn-adv">
                                    <Autocomplete
                                      getItemValue={item =>
                                        item.NameWoDiacritics
                                      }
                                      items={this.state.POD}
                                      renderItem={(item, isHighlighted) => (
                                        <div
                                          style={{
                                            background: isHighlighted
                                              ? "lightgray"
                                              : "white"
                                          }}
                                        >
                                          {item.NameWoDiacritics}
                                        </div>
                                      )}
                                      value={this.state.fields["POD"]}
                                      onChange={this.BindChangePOLPODData.bind(
                                        this,
                                        "POD"
                                      )}
                                      menuStyle={this.state.menuStyle}
                                      onSelect={this.HandleSelectPOLPOD.bind(
                                        this,
                                        "POD"
                                      )}
                                      isMulti
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-5">
                            <div className="login-fields divwd">
                              <div>
                                <label
                                  className="hidden-xs"
                                  style={{ padding: "11px" }}
                                ></label>
                                <button
                                  type="button"
                                  className="butn mr-3"
                                  onClick={this.HandleSubmit}
                                >
                                  Submit
                                </button>

                                <button
                                  type="button"
                                  className="butn cancel-butn"
                                  onClick={this.HandleAdvanceSearchModalClose.bind(
                                    this
                                  )}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              {/* ---------------------------end advance search modal popup------------------------ */}
              {/*---------------------------- start share modal pop------------------------------  */}

              <Modal
                className="amnt-popup"
                isOpen={this.state.modalShare}
                toggle={this.toggleShare}
                centered={true}
              >
                <ModalBody>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.toggleShare}
                  >
                    <span>&times;</span>
                  </button>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "15px",
                      padding: "15px"
                    }}
                  >
                    <h3 className="mb-4 text-center">Share</h3>
                    <div className="txt-cntr">
                      <div className="d-flex align-items-center">
                        <p className="col-12 col-sm-12 details-title mr-3">
                          Shareable Link
                        </p>
                        <div class="spe-equ d-block m-0 flex-grow-1">
                          <input
                            type="text"
                            disabled
                            class="w-100"
                            style={{ border: "none" }}
                            value={this.state.shareLink}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right d-flex justify-content-end mb-0">
                      <Button
                        className="butn cancel-butn"
                        onClick={this.toggleShare}
                      >
                        Cancel
                      </Button>
                      <a
                        href={
                          "mailto:username@example.com?subject=Shipment Details&body=Check the link :" +
                          this.state.shareLink
                        }
                        className="butn mx-3"
                        onClick={this.onShare}
                      >
                        Share
                      </a>
                      <CopyToClipboard
                        onCopy={this.onCopy}
                        text={this.state.shareLink}
                      >
                        <Button className="butn blue-butn">Copy</Button>
                      </CopyToClipboard>
                    </div>
                    <div className="text-right">
                      {this.state.copied ? (
                        <span
                          style={{
                            color: "#39b54a",
                            marginTop: "5px",
                            display: "block"
                          }}
                        >
                          Copied.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              {/*---------------------------- end share modal pop------------------------------  */}
            </div>
          )}
        </div>
        <NotificationContainer leaveTimeout={appSettings.NotficationTime} />
      </div>
    );
  }
}

export default ShippingDetails;

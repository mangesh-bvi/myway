import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import GoogleMapReact from "google-map-react";
import ShipWhite from "./../assets/img/ship-white.png";
import { Modal, ModalBody, UncontrolledTooltip } from "reactstrap";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { encryption } from "../helpers/encryption";
import "font-awesome/css/font-awesome.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const animatedComponents = makeAnimated();
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

class SalesActivityLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actLog: [],
      gridData: [],
      mapDis: "block",
      filterAll: "",
      filtered: [],
      modalAdvSearch: false,
      selectMOT: [
        { key: 0, value: "Select Mode" },
        { key: 1, value: "Air" },
        { key: 2, value: "Ocean" }
      ],
      selectShipStage: [
        { key: 0, value: "SELECT STAGE" },
        { key: 1, value: "NOT BOOKED YET" },
        { key: 3, value: "NEW SHIPMENTS" },
        { key: 4, value: "DEPARTED" },
        { key: 5, value: "ARRIVED" }
      ]
    };
    this.HandleListShipmentSummey = this.HandleListShipmentSummey.bind(this);
    this.HandleListSalesActivityLog = this.HandleListSalesActivityLog.bind(
      this
    );
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
    this.toggleAdvSearch = this.toggleAdvSearch.bind(this);
  }

  componentDidMount() {
    this.HandleListShipmentSummey();
    this.HandleListSalesActivityLog();
  }

  onFilteredChange(filtered) {
    debugger;
    if (filtered.length > 1 && this.state.filterAll.length) {
      // NOTE: this removes any FILTER ALL filter
      const filterAll = "";
      this.setState({
        filtered: filtered.filter(item => item.id != "all"),
        filterAll
      });
    } else this.setState({ filtered });
  }
  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: "all", value: filterAll }];
    // NOTE: this completely clears any COLUMN filters
    this.setState({ filterAll, filtered });
  }
  HandleListShipmentSummey() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesActivityLogdropdown`,
      data: {
        // UserId: userid
        UserId: 2679
        // PageNo: 1
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      //   var air = response.data.Table[0].Count;
      //   var ocean = response.data.Table[1].Count;
      //   var inland = response.data.Table[2].Count;
      //   window.localStorage.setItem("aircount", air);
      //   window.localStorage.setItem("oceancount", ocean);
      //   window.localStorage.setItem("inlandcount", inland);
      var actData = [];
      actData = response.data;
      self.setState({ actLog: actData }); ///problem not working setstat undefined
    });
  }
  HandleListSalesActivityLog() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesActivityLogGrid`,
      data: {
        UserID: 2679,
        PageNo: 0,
        PageSize: 10,
        MyWayUserID: 0
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var actData = [];
      actData = response.data;
      self.setState({ gridData: actData }); ///problem not working setstat undefined
    });
  }

  HandleChangeShipmentDetails(HblNo) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: HblNo }
    });
  }

  HandleRowClickEvt = (rowInfo, column) => {
    return {
      onClick: e => {
        var hblNo = column.original["HBL#"];
        this.HandleChangeShipmentDetails(hblNo);
      }
    };
  };

  toggleAdvSearch() {
    this.setState(prevState => ({
      modalAdvSearch: !prevState.modalAdvSearch
    }));
  }

  render() {
    const { gridData } = this.state;

    const optionsOrigin = [
      { value: "AFGHANISTAN", label: "AFGHANISTAN" },
      { value: "ALGERIA", label: "ALGERIA" },
      { value: "ANGOLA", label: "ANGOLA" },
      { value: "ARGENTINA", label: "ARGENTINA" },
      { value: "AUSTRALIA", label: "AUSTRALIA" },
      { value: "AUSTRIA", label: "AUSTRIA" },
      { value: "BAHAMAS", label: "BAHAMAS" },
      { value: "BAHRAIN", label: "BAHRAIN" },
      { value: "BANGLADESH", label: "BANGLADESH" },
      { value: "BELGIUM", label: "BELGIUM" },
      { value: "BELIZE", label: "BELIZE" }
    ];

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="title-sect">
              <h2>Activity Log</h2>
              <div className="d-flex align-items-center">
                {/* <input
                  type="search"
                  value={this.state.filterAll}
                  onChange={this.filterAll}
                  placeholder="Search here"
                /> */}
                {/* <button
                  onClick={this.toggleAdvSearch}
                  className="fa fa-search-plus advsearchicon"
                ></button> */}
                <div className="login-fields sales-act-dropdown">
                  <select>
                    {/* {this.state.actLog.map() = e => {
                        <option value={e.UserId}>{e.UserName}</option>
                    }} */}
                    {this.state.actLog.map(team => (
                      <option key={team.UserId} value={team.UserName}>
                        {team.UserName}
                      </option>
                    ))}
                  </select>
                </div>
                <a href="#!" className="butn light-blue-butn">
                  Download
                </a>
                <a href="#!" className="butn">
                  Refresh
                </a>
              </div>
            </div>
            <div style={{ display: this.state.mapDis }} className="ag-fresh">
              <ReactTable
                data={gridData}
                // noDataText="<i className='fa fa-refresh fa-spin'></i>"
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
                        Header: "User Name",
                        accessor: "UserName",
                        sortable: true
                      },
                      {
                        Header: "Company Name",
                        accessor: "RegCompName"
                      },
                      {
                        Header: "Activity Type",
                        accessor: "ActivityType"
                      },
                      {
                        Header: "Private IP",
                        accessor: "PrivateIP"
                      },

                      {
                        Header: "Public IP",
                        accessor: "PublicIP"
                      },
                      {
                        Header: "Activity Date",
                        accessor: "CreatedDate"
                      }
                    ]
                  },
                  {
                    // NOTE - this is a "filter all" DUMMY column
                    // you can't HIDE it because then it wont FILTER
                    // but it has a size of ZERO with no RESIZE and the
                    // FILTER component is NULL (it adds a little to the front)
                    // You culd possibly move it to the end
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
                      // using match-sorter
                      // it will take the content entered into the "filter"
                      // and search for it in EITHER the firstName or lastName
                      const result = matchSorter(rows, filter.value, {
                        keys: ["BL/HBL", "Consignee", "ConsigneeID"],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });

                      return result;
                    },
                    filterAll: true
                  }
                ]}
                className="-striped -highlight"
                defaultPageSize={10}
                getTrProps={this.HandleRowClickEvt}
              />
            </div>
            <Modal
              className="transit-popup"
              isOpen={this.state.modalAdvSearch}
              toggle={this.toggleAdvSearch}
              centered={true}
            >
              <ModalBody className="p-0">
                <div className="container-fluid p-0">
                  <div className="transit-sect">
                    <div className="row">
                      <div className="login-fields col-md-4">
                        <label>Mode Of Transport</label>
                        <select name={"ModeOfTransport"}>
                          {this.state.selectMOT.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="login-fields col-md-4">
                        <label>Shipment Stage</label>
                        <select name={"ShipmentStage"}>
                          {this.state.selectShipStage.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        {/* <div class="rate-radio-cntr"> */}
                        <div className="login-fields" style={{ width: "100%" }}>
                          <label style={{ padding: "0" }}>Consignee</label>
                          <Select
                            className="rate-dropdown track-dropdown"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsOrigin}
                          />
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="row">
                      <div className=" login-fields col-md-4">
                        {/* <label>SELECT</label> */}
                        {/* <div>
                            <input type="radio" name="cust-select" id="exist-cust"/>
                            <label for="exist-cust">ETD</label>
                          </div>
                          <div>
                            <input type="radio" name="cust-select" id="new-cust" />
                            <label for="new-cust">ATD</label>
                        </div> */}
                        <div>
                          <label>From Time Of Departure</label>
                          <DatePicker
                            id="saleDate"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="login-fields col-md-4">
                        <div>
                          <label>To Time Of Departure</label>
                          <DatePicker
                            id="saleDate"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      {/* <div class=" login-fields col-md-4"> */}
                      <div className="col-md-4">
                        {/* <div class="rate-radio-cntr"> */}
                        <div className="login-fields" style={{ width: "100%" }}>
                          <label style={{ padding: "0" }}>Shipper</label>
                          <Select
                            className="rate-dropdown track-dropdown"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsOrigin}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="row">
                      <div className="login-fields col-md-4">
                        {/* <label>SELECT PARAMETER</label>
                          <div>
                            <input type="radio" name="cust-select" id="exist-cust"/>
                            <label for="exist-cust">ETA</label>
                          </div>
                          <div>
                            <input type="radio" name="cust-select" id="new-cust" />
                            <label for="new-cust">ATA</label>
                        </div> */}
                        <div>
                          <label>From Time Of Arrival</label>
                          <DatePicker
                            id="saleDate"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="login-fields col-md-4">
                        <div>
                          <label>To Time Of Arrival</label>
                          <DatePicker
                            id="saleDate"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        {/* <div class="rate-radio-cntr"> */}
                        <div className="login-fields" style={{ width: "100%" }}>
                          <label style={{ padding: "0" }}>Origin Country</label>
                          <Select
                            className="rate-dropdown track-dropdown"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsOrigin}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="login-fields col-md-4">
                        {/* <div class="rate-radio-cntr"> */}
                        <div style={{ width: "100%" }}>
                          <label style={{ padding: "0" }}>POL</label>
                          <Select
                            className="rate-dropdown track-dropdown"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsOrigin}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                      <div className="login-fields col-md-4">
                        {/* <div class="rate-radio-cntr"> */}
                        <div style={{ width: "100%" }}>
                          <label style={{ padding: "0" }}>POD</label>
                          <Select
                            className="rate-dropdown track-dropdown"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={optionsOrigin}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                      <div className="login-fields col-md-4">
                        <div>
                          <label style={{ padding: "11px" }}></label>
                          <button type="button" className="butn">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

function formatDate(date) {
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " /" + monthIndex + "/" + year;
}

function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export default SalesActivityLog;

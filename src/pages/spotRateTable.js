import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import { Button, Modal, ModalBody } from "reactstrap";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Eye from "./../assets/img/eye.png";
import matchSorter from "match-sorter";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { encryption } from "../helpers/encryption";
import DatePicker from "react-datepicker";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
class SpotRateTable extends Component {
  constructor(props) {
    var someDate = new Date();
    super(props);
    this.state = {
      modalDel: false,
      filterAll: "",
      spotRateGrid: [],
      pageNo: 10,
      startDate: someDate.setMonth(someDate.getMonth() - 1),
      endDate: new Date().setHours(0, 0, 0, 0)
    };
    this.HandleListSpotRateGrid = this.HandleListSpotRateGrid.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
  }

  toggleDel(Data, Status) {
    var detailid = [Data, "SpotRateID"];
    var Status = Status;
    this.props.history.push({
      pathname: "spot-rate-details",
      state: { detail: detailid, Status: Status }
    });
  }

  componentDidMount() {
    this.HandleListSpotRateGrid();
  }
  ////Handle List Spot rate grid data
  HandleListSpotRateGrid() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    var date = new Date();
    var fromDate = "01/01/" + date.getFullYear();
    var currentDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SpotRateGridAPI`,
      data: {
        UserId: userid,
        Fromdate: "01/01/2010",
        ToDate: currentDate
      },
      headers: authHeader()
    })
      .then(function(response) {
        var data = [];
        data = response.data.Table;
        if (data != null && data != "") {
          self.setState({ spotRateGrid: data });
        } else {
          self.setState({ pageNo: 1 });
        }
      })
      // .catch();
      .catch(error => {
        var actData = [];
        actData.push({
          OriginPort_Name: "No Data Found"
        });
        self.setState({ spotRateGrid: actData });
      });
  }

  HandleChangeSpotRateDetails(RateQueryId) {}
  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
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

    this.setState({ filterAll, filtered });
  }
  ////Handle Click View Icon
  HandleClickViewIcon = (rowInfo, column) => {
    return {
      onClick: e => {
        var RateQueryId = column.original["RateQueryId"];
        this.HandleChangeSpotRateDetails(RateQueryId);
      }
    };
  };
  ////Handle Change Start Date
  HandleChangeStartDate = e => {
    var strt = this.state.startDate;
    var thisE = e;
    this.setState({
      startDate: e
    });
    if (
      thisE.setHours(0, 0, 0, 0) >
      new Date(this.state.endDate).setHours(0, 0, 0, 0)
    ) {
      store.addNotification({
        // title: "Error",
        message: "From Date needs to be smaller than To Date",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      this.setState({
        startDate: strt
      });
    }
  };
  ////Handle Change End Date
  HandleChangeEndDate = e => {
    var ennd = this.state.endDate;
    var thisE = e;
    this.setState({
      endDate: e
    });
    if (
      new Date(this.state.startDate).setHours(0, 0, 0, 0) >
      thisE.setHours(0, 0, 0, 0)
    ) {
      store.addNotification({
        // title: "Error",
        message: "To Date needs to be greater than From Date",
        type: "danger", // 'default', 'success', 'info', 'warning','danger'
        container: "top-right", // where to position the notifications
        dismiss: {
          duration: appSettings.NotficationTime
        }
      });
      this.setState({
        endDate: ennd
      });
    }
  };
  render() {
    var dataQuote = [];
    var { spotRateGrid } = this.state;

    const Moment = require("moment");

    dataQuote = spotRateGrid.sort(
      (a, b) =>
        new Moment(b.CreatedDate).format("YYYYMMDD") -
        new Moment(a.CreatedDate).format("YYYYMMDD")
    );
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <div>
        <ReactNotification />
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="d-flex justify-content-between align-items-center">
              <div className="title-sect">
                <h2>Spot Rate</h2>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="login-fields quote-to-from col-12 col-sm-4">
                  <span>From</span>
                  <DatePicker
                    id="datpicker-from-shipment"
                    className="ana-to"
                    selected={this.state.startDate}
                    onChange={this.HandleChangeStartDate}
                    showYearDropdown
                    showMonthDropdown
                    maxDate={new Date()}
                    showWeekNumbers
                  />
                </div>
                <div className="login-fields quote-to-from col-12 col-sm-4">
                  <span>To</span>
                  <DatePicker
                    id="datpicker-to-shipment"
                    className="ana-to"
                    selected={this.state.endDate}
                    onChange={this.HandleChangeEndDate}
                    showYearDropdown
                    showMonthDropdown
                    maxDate={new Date()}
                    showWeekNumbers
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <input
                    type="search"
                    className="quote-txt-srch"
                    placeholder="Search here"
                    value={this.state.filterAll}
                    onChange={this.filterAll}
                  />
                </div>
              </div>
            </div>
            <div className="ag-fresh">
              <ReactTable
                data={dataQuote.filter(
                  d =>
                    new Date(d.CreatedDate) >=
                      new Date(this.state.startDate).setHours(0, 0, 0, 0) &&
                    new Date(d.CreatedDate) <=
                      new Date(this.state.endDate).setHours(0, 0, 0, 0)
                )}
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
                        Header: "Rate Query ID",
                        accessor: "RateQueryId"
                      },
                      {
                        Header: "Customer Name",
                        accessor: "ShipperName"
                      },

                      {
                        Header: "Shipment Type",
                        accessor: "ShipmentType",
                        filterable: true
                      },
                      {
                        Header: "POL",
                        accessor: "OriginPort_Name"
                      },

                      {
                        Header: "POD",
                        accessor: "DestinationPort_Name"
                      },
                      {
                        Header: "Expiry Date",
                        accessor: "ExpiryDate"
                      },
                      {
                        Header: "Created Date",
                        accessor: "CreatedDate"
                      },
                      {
                        Header: "Status",
                        accessor: "STATUS"
                      },
                      {
                        Cell: row => {
                          var noData = row.original["OriginPort_Name"];
                          var RateQueryId = row.original["RateQueryId"];
                          var Status = row.original["STATUS"];

                          if (noData != "No Data Found") {
                            return (
                              <div
                                onClick={e =>
                                  this.toggleDel(RateQueryId, Status)
                                }
                                className="tab-icon-view"
                              >
                                <img src={Eye} alt="eye icon" />
                              </div>
                            );
                          } else {
                            return <div></div>;
                          }
                        },
                        Header: "Action",
                        sortable: false
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
                      const result = matchSorter(rows, filter.value, {
                        keys: [
                          "RateQueryId",
                          "ShipperName",
                          "ShipmentType",
                          "PickUpAddress",
                          "DestinationAddress",
                          "ExpiryDate",
                          "Status"
                        ],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });

                      return result;
                    },
                    filterAll: true
                  }
                ]}
                className="-striped -highlight"
                defaultPageSize={this.state.pageNo}
                minRows={1}
                getTrProps={this.HandleClickViewIcon}
              />
            </div>
          </div>
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
              <Button className="butn cancel-butn" onClick={this.toggleDel}>
                No
              </Button>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}

export default SpotRateTable;

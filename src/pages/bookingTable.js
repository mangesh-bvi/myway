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
import Copy from "./../assets/img/copy.png";
import Edit from "./../assets/img/pencil.png";
import matchSorter from "match-sorter";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { encryption } from "../helpers/encryption";
import { NotificationManager } from "react-notifications";
import DatePicker from "react-datepicker";

class BookingTable extends Component {
  constructor(props) {
    var someDate = new Date();
    super(props);
    this.state = {
      modalDel: false,
      filterAll: "",
      bookingData: [],
      startDate: someDate.setMonth(someDate.getMonth() - 1),
      endDate: new Date().setHours(0, 0, 0, 0),
      status: ""
    };
    this.BindBookingListData = this.BindBookingListData.bind(this);
    this.toggleDel = this.toggleDel.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
  }

  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
  componentDidUpdate() {
    
    if (this.props.location.state) {
      var status = this.props.location.state.status;
      if (this.state.status !== status) {
        this.setState({ status });
        setTimeout(() => {
          this.BindBookingListData();
        }, 100);
      }
    } else {
      
    }
  }

  componentDidMount() {
    
    if (this.props.location.state) {
      var status = this.props.location.state.status;
      this.setState({ status });
      setTimeout(() => {
        this.BindBookingListData();
      }, 100);
    } else {
      this.BindBookingListData();
    }
  }
  ////Bind Booking List Data
  BindBookingListData() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingGridAPI`,
      data: {
        UserId: userid
      },
      headers: authHeader()
    }).then(function(response) {
      
      var data = [];
      var pending = 0,
        approved = 0,
        rejected = 0;
      data = response.data;
      if (data.length > 0) {
        if (self.state.status === "Approved") {
          var filterData = data.filter(x => x.Status === self.state.status);
          if (filterData.length > 0) {
            self.setState({ bookingData: filterData });
          } else {
            self.setState({ bookingData: filterData });
          }
        } else if (self.state.status === "Pending") {
          var filterData = data.filter(x => x.Status === self.state.status);
          if (filterData.length > 0) {
            self.setState({ bookingData: filterData });
          } else {
            self.setState({ bookingData: filterData });
          }
        } else if (self.state.status === "Rejected") {
          var filterData = data.filter(x => x.Status === self.state.status);
          if (filterData.length > 0) {
            self.setState({ bookingData: filterData });
          } else {
            self.setState({ bookingData: filterData });
          }
        } else {
          self.setState({ bookingData: data }); ///problem not working setstat undefined
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].Status === "Approved") {
          approved = approved + 1;
        } else if (data[i].Status === "Pending") {
          pending = pending + 1;
        } else if (data[i].Status === "Rejected") {
          rejected = rejected + 1;
        }
      }
      window.localStorage.setItem("bookpending", pending);
      window.localStorage.setItem("bookapproved", approved);
      window.localStorage.setItem("bookrejected", rejected);
    });
  }

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

  ////Handle Copy Click icon
  HandleCopyClick(evt, row) {
    var BookingNo = row.original["BookingID"];
    var Mode = row.original["Mode"];
    this.props.history.push({
      pathname: "rate-finalizing-still-booking",
      state: { BookingNo: BookingNo, Copy: true, Mode: Mode }
    });
  }
  //// Handle View click icon
  HandleViewClickIcon(evt, row) {
    
    var BookingNo = row.original["BookingID"];
    var BookingNostr = row.original["BookingNo"];
    var Status = row.original["Status"];

    var Mode = row.original["Mode"];
    this.props.history.push({
      pathname: "booking-view",
      state: {
        BookingNo: BookingNo,
        isView: true,
        Mode: Mode,
        BookingNostr: BookingNostr,
        Status: Status
      }
    });
  }

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
      NotificationManager.error("From Date needs to be smaller than To Date");
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
      NotificationManager.error("To Date needs to be greater than From Date");
      this.setState({
        endDate: ennd
      });
    }
  };

  render() {
    const { bookingData } = this.state;
    
    var dataQuote = [];
    var finalFilterData = [];
    const Moment = require("moment");
    dataQuote = bookingData.sort(
      (a, b) =>
        new Moment(b.CreatedDate).format("YYYYMMDD") -
        new Moment(a.CreatedDate).format("YYYYMMDD")
    );
    
    if (dataQuote.length > 0) {
      finalFilterData = dataQuote.filter(
        d =>
          new Date(d.CreatedDate) >=
            new Date(this.state.startDate).setHours(0, 0, 0, 0) &&
          new Date(d.CreatedDate) <=
            new Date(this.state.endDate).setHours(0, 0, 0, 0)
      );
    } else {
      finalFilterData = [{ POL: "No Record Found" }];
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
            <div className="d-flex d-block-xs justify-content-between align-items-center">
              <div className="title-sect">
                <h2>Booking Table</h2>
              </div>
              <div className="d-flex d-block-xs justify-content-between align-items-center">
                <div className="login-fields quote-to-from col-12 col-sm-4">
                  <span>From</span>
                  <DatePicker
                    id="datpicker-from-shipment"
                    className="ana-to"
                    selected={this.state.startDate}
                    onChange={this.HandleChangeStartDate}
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
                data={finalFilterData}
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
                        Header: "Booking No.",
                        accessor: "BookingNo"
                      },
                      {
                        Header: "Consignee",
                        accessor: "Consignee_Name"
                      },
                      {
                        Header: "Shipper",
                        accessor: "Shipper_Name",
                        filterable: true
                      },
                      {
                        Header: "POL",
                        accessor: "POL"
                      },
                      {
                        Header: "POD",
                        accessor: "POD"
                      },
                      {
                        Header: "Commodity",
                        accessor: "Commodity"
                      },
                      {
                        Header: "Status",
                        accessor: "Status"
                      },
                      {
                        Header: "Action",
                        sortable: false,
                        Cell: row => {
                          
                          if (row.row.POL !== "No Record Found") {
                            return (
                              <div className="action-cntr">
                                {/* <a> */}
                                <img
                                  className="actionicon"
                                  src={Eye}
                                  alt="view-icon"
                                  onClick={e =>
                                    this.HandleViewClickIcon(e, row)
                                  }
                                />

                                <img
                                  className="actionicon"
                                  src={Copy}
                                  alt="view-icon"
                                  onClick={e => this.HandleCopyClick(e, row)}
                                />
                              </div>
                            );
                          } else {
                            return <></>;
                          }
                        }
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
                          "BookingNo",
                          "Consignee_Name",
                          "Shipper_Name",
                          "POL",
                          "POD",
                          "Commodity",
                          "Status"
                        ],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });
                      if (result.length > 0) {
                        return result;
                      } else {
                        result = [
                          {
                            POL: "No Record Found"
                          }
                        ];
                        return result;
                      }
                    },
                    filterAll: true
                  }
                ]}
                className="-striped -highlight"
                defaultPageSize={5}
                minRows={1}
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

export default BookingTable;

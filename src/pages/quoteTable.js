import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import { encryption } from "../helpers/encryption";
import { Button, Modal, ModalBody } from "reactstrap";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Copy from "./../assets/img/copy.png";
import Eye from "./../assets/img/eye.png";
import matchSorter from "match-sorter";
import ReactTable from "react-table";
import "react-table/react-table.css";
import DatePicker from "react-datepicker";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class QuoteTable extends Component {
  constructor(props) {
    var someDate = new Date();
    super(props);
    this.state = {
      modalDel: false,
      modalBook: false,
      filterAll: "",
      quotesData: [],
      startDate: someDate.setMonth(someDate.getMonth() - 1),
      endDate: new Date().setHours(0, 0, 0, 0)
    };
    this.HandleListShipmentSummey = this.HandleListShipmentSummey.bind(this);
    this.toggleDel = this.toggleDel.bind(this);
    this.toggleBook = this.toggleBook.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
  }

  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
  toggleBook(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      modalBook: !prevState.modalBook
    }));
  }

  componentDidMount() {
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("=")[1];
    var quetype = "";
    if (url != undefined) {
      quetype = url;
    }
    this.HandleListShipmentSummey(quetype);
  }

  HandleListShipmentSummey(quetype) {
    let self = this;

    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesQuoteGridAPI`,
      data: {
        UserId: userid,
        fromDate: "2010-01-01",
        Todate: "2021-12-26"
      },
      headers: authHeader()
    }).then(function(response) {
      var data = [];

      var resData = response.data.Table;
      var pending = resData.filter(x => x.Status == "Pending").length;
      var current = resData.filter(x => x.Status == "Current").length;
      var expired = resData.filter(x => x.Status == "Expired").length;
      var rejected = resData.filter(x => x.Status == "Rejected").length;
      var approved = resData.filter(x => x.Status == "Approved").length;

      if (quetype != "") {
        resData = resData.filter(item => item.Status === quetype);
        if (resData.length === 0) {
          resData = [{ type: "No record found" }];
        }
      }

      self.setState({ quotesData: resData });
      window.localStorage.setItem("quotepending", pending);
      window.localStorage.setItem("quotecurrent", current);
      window.localStorage.setItem("quoteexpired", expired);
      window.localStorage.setItem("quoterejected", rejected);
      window.localStorage.setItem("quoteapproved", approved);
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

  HandleChangeShipmentDetails(QuoteNo, Type, Status) {
    var data = { Quotes: QuoteNo, Type: Type, Status: Status };
    this.props.history.push({
      pathname: "rate-finalizing-still",
      state: { detail: data }
    });
  }

  HandleRowClickEvt = (rowInfo, column) => {
    var QuoteNo = column.original["Quote#"];
    var Type = column.original["type"];
    var Status = column.original["Status"];
    this.HandleChangeShipmentDetails(QuoteNo, Type, Status);
  };

  Editfinalizing(e) {
    var Quote = e.target.getAttribute("data-Quote");
    var type = e.target.getAttribute("data-type");
    this.props.history.push({
      pathname: "rate-finalizing",
      state: { Quote: Quote, type: type, isediting: true }
    });
  }

  Copyfinalizing(e) {
    window.localStorage.setItem("isCopy", false);
    var Quote = e.target.getAttribute("data-Quote");
    var type = e.target.getAttribute("data-type");
    this.props.history.push({
      pathname: "rate-finalizing",
      state: { Quote: Quote, type: type, isediting: true, isCopy: true }
    });
  }

  handleChangeStart = e => {
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
  handleChangeEnd = e => {
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
    var { quotesData } = this.state;
    var NewdataQuote = [];
    const Moment = require("moment");

    dataQuote = quotesData.sort(
      (a, b) =>
        new Moment(b.CreatedDate).format("YYYYMMDD") -
        new Moment(a.CreatedDate).format("YYYYMMDD")
    );
    if (dataQuote.length > 0) {
      NewdataQuote = dataQuote.filter(
        d =>
          new Date(d.CreatedDate) >=
            new Date(this.state.startDate).setHours(0, 0, 0, 0) &&
          new Date(d.CreatedDate) <=
            new Date(this.state.endDate).setHours(0, 0, 0, 0)
      );
    } else {
    }

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
            <div className="d-flex d-block-xs justify-content-between align-items-center">
              <div className="title-sect">
                <h2>Quote Table</h2>
              </div>
              <div className="d-flex d-block-xs justify-content-between align-items-center">
                <div className="login-fields quote-to-from col-12 col-sm-4">
                  <span>From</span>
                  <DatePicker
                    id="datpicker-from-shipment"
                    className="ana-to"
                    selected={this.state.startDate}
                    onChange={this.handleChangeStart}
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
                    onChange={this.handleChangeEnd}
                    maxDate={new Date()}
                    showWeekNumbers
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <input
                    type="search"
                    className="quote-txt-srch mt-0"
                    placeholder="Search here"
                    value={this.state.filterAll}
                    onChange={this.filterAll}
                  />
                </div>
              </div>
            </div>
            <div className="ag-fresh redirect-row">
              <ReactTable
                data={NewdataQuote}
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
                        Header: "Quote No",
                        accessor: "Quote#"
                      },
                      {
                        Header: "Company",
                        accessor: "Company",
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
                        Header: "Type",
                        accessor: "type"
                      },
                      // {
                      //   Header: "Notes",
                      //   accessor: "Notes"
                      // },
                      {
                        Header: "Created Date",
                        accessor: "CreatedDate"
                      },
                      {
                        Header: "Status",
                        accessor: "Status"
                      },
                      {
                        Header: "Action",
                        sortable: false,
                        Cell: row => {
                          if (row.row.POD === "No Record Found") {
                            return <></>;
                          } else {
                            if (row.original.type !== "No record found") {
                              if (row.original.Status === "Pending") {
                                return (
                                  <div className="action-cntr">
                                    <a
                                      onClick={e =>
                                        this.HandleRowClickEvt(e, row)
                                      }
                                    >
                                      <img
                                        className="actionicon"
                                        src={Eye}
                                        title={"View"}
                                        alt="view-icon"
                                      />
                                    </a>

                                    <a onClick={this.Copyfinalizing.bind(this)}>
                                      <img
                                        className="actionicon"
                                        src={Copy}
                                        title={"Copy"}
                                        alt="view-icon"
                                        data-Quote={
                                          row.original.QUOTE_ID_Revisions
                                        }
                                        data-type={row.original.type}
                                      />
                                    </a>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="action-cntr">
                                    <a
                                      onClick={e =>
                                        this.HandleRowClickEvt(e, row)
                                      }
                                    >
                                      <img
                                        className="actionicon"
                                        src={Eye}
                                        title={"View"}
                                        alt="view-icon"
                                      />
                                    </a>

                                    <a onClick={this.Copyfinalizing.bind(this)}>
                                      <img
                                        className="actionicon"
                                        src={Copy}
                                        title={"Copy"}
                                        alt="view-icon"
                                        data-Quote={
                                          row.original.QUOTE_ID_Revisions
                                        }
                                        data-type={row.original.type}
                                      />
                                    </a>
                                  </div>
                                );
                              }
                            } else {
                              return <div></div>;
                            }
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
                          "Quote#",
                          "Company",
                          "Contact",
                          "type",
                          "POL",
                          "POD",
                          "Notes",
                          "Status"
                        ],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });
                      if (result.length > 0) {
                        return result;
                      } else {
                        result = [
                          {
                            POD: "No Record Found"
                          }
                        ];
                        return result;
                      }
                      return result;
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
export default QuoteTable;

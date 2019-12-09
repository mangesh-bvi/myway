import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import { encryption } from "../helpers/encryption";
import { UncontrolledTooltip } from "reactstrap";
import { Button, Modal, ModalBody } from "reactstrap";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import LoginActore from "./../assets/img/login-actore.jfif";
import DownArrow from "./../assets/img/down-arrow.png";
import Copy from "./../assets/img/copy.png";
import Edit from "./../assets/img/pencil.png";
import Book from "./../assets/img/calendar.svg";
import Ship from "./../assets/img/ship.png";
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";
import Plane from "./../assets/img/plane.png";
import Transit from "./../assets/img/transit.png";
import Box from "./../assets/img/box.png";
import Delivered from "./../assets/img/delivered.png";
import InPlane from "./../assets/img/in-plane.png";
import Arrived from "./../assets/img/arrived.png";
import Eye from "./../assets/img/eye.png";
import matchSorter from "match-sorter";
import ReactTable from "react-table";
import "react-table/react-table.css";
import DatePicker from "react-datepicker";
import { NotificationManager } from "react-notifications";

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
    // localStorage.removeItem(
    //   "quotepending",
    //   "quotecurrent",
    //   "quoteexpired",
    //   "quoterejected",
    //   "quoteapproved"
    // );
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
      debugger;
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
    debugger;

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
    var Quote = e.target.getAttribute("data-Quote");
    var type = e.target.getAttribute("data-type");
    this.props.history.push({
      pathname: "rate-finalizing",
      state: { Quote: Quote, type: type, isediting: true, isCopy: true }
    });
  }

  handleChangeStart = e => {
    debugger;
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
  handleChangeEnd = e => {
    debugger;
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
    var dataQuote = [];
    var { quotesData } = this.state;

    const Moment = require("moment");
    const array = [
      { date: "2018-05-11" },
      { date: "2018-05-12" },
      { date: "2018-05-10" }
    ];
    dataQuote = quotesData.sort(
      (a, b) =>
        new Moment(b.CreatedDate).format("YYYYMMDD") -
        new Moment(a.CreatedDate).format("YYYYMMDD")
    );
    console.log(quotesData);

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="d-flex justify-content-between align-items-center">
              <div className="title-sect">
                <h2>Quote Table</h2>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="login-fields quote-to-from mb-0">
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
                <div className="login-fields quote-to-from mb-0">
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
                <div className="">
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
                      {
                        Header: "Notes",
                        accessor: "Notes"
                      },
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
                          // var abc = new Date(row.original.CreatedDate);
                          // var current = new Date();
                          // var x = abc.getTime();
                          // var y = current.getTime();
                          // console.log(x);
                          // console.log(y);
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
                                      alt="view-icon"
                                    />
                                  </a>

                                  {/* <span
                              title="Create Booking"
                              onClick={this.toggleBook} 
                            > */}
                                  <a
                                    title="Create Booking"
                                    onClick={this.Editfinalizing.bind(this)}
                                  >
                                    <img
                                      className="actionicon"
                                      src={Edit}
                                      alt="booking-icon"
                                      data-Quote={
                                        row.original.QUOTE_ID_Revisions
                                      }
                                      data-type={row.original.type}
                                    />
                                  </a>
                                  {/* </span> */}
                                  <a onClick={this.Copyfinalizing.bind(this)}>
                                    <img
                                      className="actionicon"
                                      src={Copy}
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
                                      alt="view-icon"
                                    />
                                  </a>
                                  <a
                                    title={"It has been " + row.original.Status}
                                    onClick={this.Editfinalizing.bind(this)}
                                  >
                                    <img
                                      className="actionicon"
                                      src={Edit}
                                      alt="booking-icon"
                                      data-Quote={
                                        row.original.QUOTE_ID_Revisions
                                      }
                                      data-type={row.original.type}
                                    />
                                  </a>
                                  {/* </span> */}
                                  <a onClick={this.Copyfinalizing.bind(this)}>
                                    <img
                                      className="actionicon"
                                      src={Copy}
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
                          "Quote#",
                          "Company",
                          "Contact",
                          "type",
                          "POD",
                          "Notes",
                          "Status"
                        ],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });

                      return result;
                    },
                    filterAll: true
                  }
                ]}
                // defaultSorted={[
                //   {
                //     id: "CreatedDate",
                //     Cell: data => {
                //       debugger;
                //       var abc = new Date(data.CreatedDate);
                //       var current = new Date();
                //       var x = abc.getTime();
                //       var y = current.getTime();
                //       var z = y - x;
                //       console.log(x);
                //       console.log(y);
                //       console.log(z);
                //       // var date = new Date(data.CreatedDate);
                //       return z;
                //     },
                //     desc: false
                //   }
                // ]}
                // defaultSorted={[
                //   {
                //     id: "CreatedDate",
                //     desc: true
                //   }
                // ]}
                className="-striped -highlight"
                defaultPageSize={5}
                // getTrProps={this.HandleRowClickEvt}
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
          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalBook}
            toggle={this.toggleBook}
            centered={true}
          >
            <ModalBody>
              <h3 className="mb-4">Create Booking</h3>
              <div className="rename-cntr login-fields">
                <label>Quotation Price</label>
                <input type="text" value="5000" disabled />
              </div>
              <div className="rename-cntr login-fields">
                <label>Consignee Details</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Notification Person</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Details</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <a
                href="/booking-table"
                className="butn"
                onClick={this.toggleBook}
              >
                Create Booking
              </a>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
function transportMode(params) {
  var element = document.createElement("span");
  var imageElement = document.createElement("img");
  switch (params.value) {
    case "Air": {
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAoCAYAAAChDJfXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABOVJREFUeNrsmm1oHVUQhjcxNcRqDSopWmskhlQJosZYajT4VaWoUPxTRGqLiAqKtegPtUp/Cv7yA/EDFUFFtIIiogSp1rQ2aomxRUpjCEGRejGGGAwx3iYmzuBz6HDYvR8n2b3X6MDL2ezdm7PnPTPvzJmkZn5+PvqvW51/o7PjUh1OEzwuWG4+mhU8Lzi8FBbeP/BNMgnYGR4B7tkbA0lQUncKGjxS3xN8WmlCahPuTzMeEdwjuE/wu6BVsCpgnjlBfQypm0BVkjDJeJLZtb1cXxMwz4RggOu3IfYpQV5wHT/XVRsJU4w2JHrZ0bWeW5dqzu2vZd5BwZN4WIfggZgQrCgJM+AUQbOgkZcdwK3XBcw1IhgWNAku5t5RwcuQ3iZ4CP2oChKcN+iCd5gQ6F1ASKh9wni9uddtPED15tFA3UmNBLdbE1wP8fNKwfkB830nGBW0ALUxwY/gF8EKwcOBvz81El4S7DH33fXVgVnCecMGxg8ET4CdaId64P2BYZcKCeehC81oxAFS6EVoRbn2FdnnQvTBmnrY1zyj2eIOQ1ZFSPiDcSu6sAMV17TWx3evCphTBXcf31/vfbaFeawH3CK4tci7pu4JQ7y0Ise9zxmvDMzvn0FGF97l7JCZy2EKIb5bsCyTs0NMwXQwprQdpXxuJ931lznvJC7fDT72skfkadA2wSWCBwXPmQ1KnYQ84wWCYwVIuiGweMqbdDtZ5Nk+tEEzyiMeWTlIyYWSUOMfpTlF6g7fFbi4StoEKfwwoTUWeoqsh4B63Hy6yha6gsykIfk9hdbpZJpG0M7BTAnZTejNlRMOZ+IBQ5S01WatkPCD4M2Y9Wj4dvLMKrLbTYJdeEdJJNSZw1N3iS82sNhiVYI1FXi/YUhqB9ofuReR3eV7RSFhVBY3l3E4yooEt4BzQTmmInwqHj5XCglHvXK5mCBlZSMsIkS0b6bg04zWU4iEWVMs7avSLNAf8J0GU+qvLUZCjhyuAnQnB5yx6N9rusbLBRupTqfobhXUhDyquxXGNBV9GPNcC2XvLKFjSZzh+jeaMZWwZly/i7Qacfh7XzBeijAeoEztQGV9a6OULaeWV2J+9jRnGoKnF2G3z8F7W3m/Bk9H3klYSyIJerBag4IOxuRpR4B2mn7CzVxb7ASvM3QWzy5jd+xORRQ8h4oc8tabY7fOc7LJYElrGCd193meWjIJLdQJw8a13X1HQA+uVY41kqJ0l7Sx+lcMyb7djksXO5D9ymK1Q3WkHB1LIqHdtMMik5e3UU7vDiDApdIJipxawi5f4PnbIEAX+RH6k/M2ZnSh4ZREQhvjoHHd7eygHqvfXWAMd5kuk99UOZvrEynhdYHPEHappQ/flkfHm6Cb0YUmCOil7FyIreT3j6MH/mdWN5SAp9MkIKmzZP9ctpqXUgL2C95ahDnXGS/wT3avG5HUMHk2SdHT9gTdoce8ttef0T/t8MUg3YXClzGfX0ZVNwMBI1lVU0npZTyF+daQIUYQtA3UIo6g1YaA4SxLyizNecEXJuc3e+eWF+hlZGa1Gc7VQBU6Ex3/C3UPWuMIeDGqwD+BZElCJ0XWtyavaxfoCgh4xatLliQJLhT6TJZwKfhVyKnYMTOrVpirPbZ7XaLXTHhES9kTjsWUxxoSb1A6V9Rq/v8Xvij6W4ABAHWlLKncQ6K0AAAAAElFTkSuQmCC";
      imageElement.style.width = "65px";
      element.append(imageElement);
      break;
    }
    case "Ocean": {
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAoCAYAAAChDJfXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABNtJREFUeNrsWktIFWEUHmVKwrxJyO0hlYlYJvbOSokoS3riImohQkS0aBXRql1E9Fi0ibbtIoKIkCjsYVKWmVghIkpIJBWhiEhxEUuunVPfH4fhn3/+uV6te/PA54wz53+d//zndSdjfHzc+d8p05mmaSEwufxn/dp1unc5hLma598JX9JFAO1vXv8Wgg9tJ+zRPI8TjqedJgQclRhhkDCfkJXAEdoEgSabHvJGTrYQ/mgM4QZhHuFsAmMUEpZMghDypkITvPQD17EEx2ojPDa8308oI7QSnljwTdpxYFWvxH0xrssJWwmlok01oZ/QEWKsIUJfwHumYUu+SRNChFDnecbHoNbz7ACu17DDaWUYpdFrNrRbRCiA92iHxwgi1qwtAbZDaZ6JrwjXUhjtIOoNcukmm3CdsEAMOioWnE24gPerCG8tDWShBV8BYCPUYgu+GxMRgpp4nec89mIHmgi7CLsthcBtuwzvlxGihM+E90ngK/UJ9kILoQsaoWhE3LOl3wb3V0LotvAOdwzvj2JxnZZ8rYgVTHzlyRDCHI+PV/efoQlsN3ZAI7qTZKd+THXeEySEIh8jFcexeAD3uRzn+IOhL5NqZsHOBPFlCr5IAF/ORIWgdqMFi9XRN8JXwjNCFWEf4aphrHJL9awUsYqJqoCkaQJL9zBhFv6fQTiFgMi7m7M9z9TOcBR3mvCRcAvexEu6IGghxgtLcYw14f5ckSTF4O7CuiCde8vVaAUbsduGtrwJFSH46gkNBr5jXCUIexzuQl1dWP5EIkEWwEFoRbXHesctDaItn42mhLYJQ7D27PYWQ6XDUh8G59iiBvYkM+ykkrxINyzDfahaMYINFdwcgae4hDPH/z9CtncS1v0iJtYMb7EedkXt3BaRhOkoKvhKLPh2Bqi74uNgbqMPD7v1O14hsLVvRE5QI4SQDaPp4hoRRnSWeB8TIfdiTMQV5Tobt5UtjK2JIgFu0rEYt95PVR7C93NgtAYh8VXPsZHltXOaPjiyPC9241+iQ9DqHrXJrs8CGpAu16BmkMh5HgmoC/wNiookrj4o9HyK4sYC2/g7RWgv1twhky8/IYzCSKpylpsGAsjHhsalFgQlIS8IA87vgmZlGghhP9bbhgTQSghjCKAceIusFBZAAYw8r+le2ECiHYkR1xnPIGlKRcrzaHcoIeQKDZhrW6n5R0naOWshRBEN5iKbvO+k5m+QJxB8KY8XSgi12Hl2JVc8pbVUIRV9jpgyTpMQGhBVNfnUBlKBOIy/DCHETGUoWTCRYW4PUuoVjr5Uzr89rNUUMHLgj3M1Y5X51CgiSLp0cf8mjS1SfZUY4gGV27xD8UW5etekCafA2IyIqgiNckSa/BJupkIIhj3GK6TNKwnrYEw5KOlEG57YZmGl+9AmhkWWiASuDRNfTdgAIau+XkD4si/2+S1oWyH6iqGvLuRB1ZhXv+MpGWbwN0v4SKMKyYVOpVxNnDCGgXUeY8AneWKBzdT0FUdipvuledDn+TeR1XrnNezTho3jTZkLeT/SaISEKiHtQRjF5xhIZZaZ2EllbcuhmlE8b0W7fPS1BHy92DEXhZsC3PfB7gzjeK1BXPIJfb0TfS2FsHrwzsW8CiHYD6KvcmhFPna/xfH5WSBj+uu16Q+3ftFPAQYA5/saaEeazjMAAAAASUVORK5CYII=";
      imageElement.style.width = "65px";
      element.append(imageElement);
      break;
    }
    case "Truck": {
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAoCAYAAAChDJfXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FJREFUeNrsmm9IE2Ecx7dmiQwjpD9ERDNGBBHhHEJlmNQLexNIJRERSSlRYRBIFL3qXUQS0Yt6EUFIbyIkighjhNSLCLMXMsIYokgkYRKtEFtrfX/5PXg4zu1uu7ut7X7w4Xbe4/ncd8/z+3f6M5mMr9Jtic8zX1WuAdFIo5l7+EGqlB90eORd/iLksDXgPFdUH/hclishi60HPWA5z3vBE/Dbhnl9ADOlLsIGcA4EwUMg3rUDHLZpXiLCjVIWIcwVUA36wSv+/Bc4wq3xBiTyuPcyirm0lLfDZnAWBMBd8Fa5JmLMg07QyGtxi/evoQiumj9XnoDoIBO7ANYWyW99BzfBVDGjwzoK8NNNZ0WrBXVgY6Ei2LUd4twCbloL/YyXMXoilFh0CIGjFsYPgjmwD/wAzwqYZxOTs1w2DYaspvBWRFhNzJrkCZ/AHnr4wQKyyTAxYw3gOvjjlGN8bHKsGkl6mT8Ukk4/ByMmxnVQLFm1427UDjN8WDNxvlCbBZO6usXIn32hCEGntsMWopnsu4sg6bIfOw225RjTBUbBUzOVrRURROUx5TxJx+e2rVTSdPnGI7q5VbPAi1IsyW3e2yXCBAumUrF+ZrORReYmIhwHJ8AVClVxecIweMSKdG8lJ0uvGSrDlSxCiuG5xkubHcwTim0SAVbxc5DneX3R/6MIWuZ5KUsOY5TBlpUID8AOC1t5ezmuhAli1qJeP8EFxyhvoFp9Cz1A6dh+BC+UokmuH+OevM2kJWrh/rU8toGdWcZJGJR3FTF+dk0Eqdu7uZokHgdYwkpfsI9LNs3raSYtaZu+PLWKTDEr3EShroFvboggzZWTnMA9pUCRBspBcAZcZrl9Vfm9GDFrWqNV+glDSiToYXl9h2KLCIc4votCOCKCPPguZSLyuwO6Ci3GLSCTafctdJYKsbBy1DpFzTzeVxxkilEjxLFtSlisskMErVwOEb2nNvLeLfQVdlkTUc3oNV+CSVP7Is+Qtwjybd4CK3TJSQNF0U9GE+qlDSvByJr5N+rpiFWr53FAlyAl7NgOo7pz8cRbwX7wVdkSrdwySU5k3gERZukTOhlxJukTDjBKjdOHOOYYZb9pL0zT7OKc4sMGeL8UV47dAkiWuJufxT/UMXWeU6pEzVk6GiLVfv60wfUxXZ5gp6kt9CmDecXzzRP83n+veWnzP/srwACl7smbzjqnDwAAAABJRU5ErkJggg==";
      imageElement.style.width = "65px";
      element.append(imageElement);
      break;
    }
    case "rail": {
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAoCAYAAAChDJfXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7VJREFUeNrsWltLVFEUnpm8UKMhocVgZolGEmbpJEZEWBA+KBZB9A+i6DUM6il6CIKCHqIrIb10gx6UyaLLgxVRKoiIJiKmRRdkiEpEFKe16Du1PMzsfS4zBLoXfMw5ns0+a397rW/tvY/BRCIRWOoWChgzJBgSDAn/LEveRGtq5e0+wsFFNt4pwiXCGN909/ZoI6F6EU56mFCqjIQU9onwwuNLtxE2E2YJdz32UUxowHUH4buHPnIIhxylQwqLE7o8DqAQJMz56KNKkNCLSXFry1UkGGF0GAnSmglNmjY8W1cVzzkyjhKyFW0mCecIPxURdpKQr+hjGn4MprtEljtoU6F5XqYhwBrkCs3zfAcpsCoTkXANVWOZos2Apo9HyOuwos0E4avi+RDhIqFI0eYHoT8TJHCdfe0zBeeQMn5tCDArxv8hjE0QR5V1E64vZmGscNBmo+b5hjQIY5FDYSzMRCTcIGzRkPde08djwhc4mco+a4RxEHsAlfr/IvRlggQOz1c+U3AWKePXBtKlCUYYPURCI+GAps1bwk2NMB4h5CrafIMwTik04wShQFPOrxCG0x0JlQ7abHIgjLmaNqsJeRphLHCwbV5jhNEIoxFGVxaUH1+iNbUcoq2EyBIY+9Pu3p77ySIhvEQIWLD6zUqyZj8PIgpREq08fgNNqBPLUc5LPvPbKdbr1jHaDrG05a1zsUdnp1HurHeO4r3sY1TsTB9gXxMW4jmCM5BKUTYf4rpPJYwjQAvu5wkX8HK2TsIplB8uVTP4O/+eBZFsfDh7Gk7FsbdvdEnADDZjx4Xjl22+HsY48gQBzwj3RDs+X9yL56MB2zmlShitmRsWBFiOvRT1fJ1wcFK0iwu2I5iBdkSVE4ujDE4LP+2n3l2IArZ6me/2/BfXJW5K5Dx+czSlNUtBaML2rANwY2VJ+vsr7Cl8CimqYMhNiRwTTsgPMSsJu0WuW8vSrTaWi6EfVth6tQkRPc22bXijGLyMkhYxtpBIbbYPbiKBQ60By9NjCG0OzSqRe51Y3UXRV6tIgWo4zOEa87m4imEgLHJnhDCWC5Kf4L4K5JcIYbQqXn8gyXeLkGYDcgsDtwZVLwiIYbPEM3UbzmaDkKgg4A6I8mNMtnUuyUvlXYKASfjJ6dsmIjiCdhER2W1OFkvJ2hSIWeDF1Dicsu/OuFrsJ6wXYdce8PbFKJXVYWClGPwANGbGNrF7CNsJawkfCe8Iz4XO/TkHxAfZoPl3HbN3MCQYEgwJC+23AAMANuThyCefxrQAAAAASUVORK5CYII=";
      imageElement.style.width = "65px";
      element.append(imageElement);
      break;
    }
  }
  return element;
}

function statusImage(parameter) {
  var element = document.createElement("span");
  var imageElement = document.createElement("img");
  switch (parameter.value) {
    case "Departed": {
      //delivered
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAoCAYAAAChDJfXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABOVJREFUeNrsmm1oHVUQhjcxNcRqDSopWmskhlQJosZYajT4VaWoUPxTRGqLiAqKtegPtUp/Cv7yA/EDFUFFtIIiogSp1rQ2aomxRUpjCEGRejGGGAwx3iYmzuBz6HDYvR8n2b3X6MDL2ezdm7PnPTPvzJmkZn5+PvqvW51/o7PjUh1OEzwuWG4+mhU8Lzi8FBbeP/BNMgnYGR4B7tkbA0lQUncKGjxS3xN8WmlCahPuTzMeEdwjuE/wu6BVsCpgnjlBfQypm0BVkjDJeJLZtb1cXxMwz4RggOu3IfYpQV5wHT/XVRsJU4w2JHrZ0bWeW5dqzu2vZd5BwZN4WIfggZgQrCgJM+AUQbOgkZcdwK3XBcw1IhgWNAku5t5RwcuQ3iZ4CP2oChKcN+iCd5gQ6F1ASKh9wni9uddtPED15tFA3UmNBLdbE1wP8fNKwfkB830nGBW0ALUxwY/gF8EKwcOBvz81El4S7DH33fXVgVnCecMGxg8ET4CdaId64P2BYZcKCeehC81oxAFS6EVoRbn2FdnnQvTBmnrY1zyj2eIOQ1ZFSPiDcSu6sAMV17TWx3evCphTBXcf31/vfbaFeawH3CK4tci7pu4JQ7y0Ise9zxmvDMzvn0FGF97l7JCZy2EKIb5bsCyTs0NMwXQwprQdpXxuJ931lznvJC7fDT72skfkadA2wSWCBwXPmQ1KnYQ84wWCYwVIuiGweMqbdDtZ5Nk+tEEzyiMeWTlIyYWSUOMfpTlF6g7fFbi4StoEKfwwoTUWeoqsh4B63Hy6yha6gsykIfk9hdbpZJpG0M7BTAnZTejNlRMOZ+IBQ5S01WatkPCD4M2Y9Wj4dvLMKrLbTYJdeEdJJNSZw1N3iS82sNhiVYI1FXi/YUhqB9ofuReR3eV7RSFhVBY3l3E4yooEt4BzQTmmInwqHj5XCglHvXK5mCBlZSMsIkS0b6bg04zWU4iEWVMs7avSLNAf8J0GU+qvLUZCjhyuAnQnB5yx6N9rusbLBRupTqfobhXUhDyquxXGNBV9GPNcC2XvLKFjSZzh+jeaMZWwZly/i7Qacfh7XzBeijAeoEztQGV9a6OULaeWV2J+9jRnGoKnF2G3z8F7W3m/Bk9H3klYSyIJerBag4IOxuRpR4B2mn7CzVxb7ASvM3QWzy5jd+xORRQ8h4oc8tabY7fOc7LJYElrGCd193meWjIJLdQJw8a13X1HQA+uVY41kqJ0l7Sx+lcMyb7djksXO5D9ymK1Q3WkHB1LIqHdtMMik5e3UU7vDiDApdIJipxawi5f4PnbIEAX+RH6k/M2ZnSh4ZREQhvjoHHd7eygHqvfXWAMd5kuk99UOZvrEynhdYHPEHappQ/flkfHm6Cb0YUmCOil7FyIreT3j6MH/mdWN5SAp9MkIKmzZP9ctpqXUgL2C95ahDnXGS/wT3avG5HUMHk2SdHT9gTdoce8ttef0T/t8MUg3YXClzGfX0ZVNwMBI1lVU0npZTyF+daQIUYQtA3UIo6g1YaA4SxLyizNecEXJuc3e+eWF+hlZGa1Gc7VQBU6Ex3/C3UPWuMIeDGqwD+BZElCJ0XWtyavaxfoCgh4xatLliQJLhT6TJZwKfhVyKnYMTOrVpirPbZ7XaLXTHhES9kTjsWUxxoSb1A6V9Rq/v8Xvij6W4ABAHWlLKncQ6K0AAAAAElFTkSuQmCC";
      imageElement.style.width = "45px";
      element.append(imageElement);
      break;
    }
    case "Transshipped": {
      //box
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABR1JREFUeNrkmVtoHGUUx6cxIYTYEEq0DTEo8YKxtTXtGmuLSKGWsFSK1NuDL0UQhaKCFHyQ6oMIpUSxiuKFij6IUkFQCKEGpFRrG9KmS21WpSwJ0gfjojEa1pCYeI78PjkdvtmZ3R00oQf+zGaZ/eZ/7udMViwuLgbLTeqCZSj17kPbVVendWa34HbBNYI1gkbBhCAvOCb4pZbDiz9PBitceKRAulWwR3Azf18UTAqaId8imBccFXwuWKiWdH1K1lWN90Hsa8GAnh+65zrBA4KsoF3wdrXE61LKi8cEVwreF3zgIawyLugXjAp6BPf+n4l4l6BT8IngRMy9atl3BQXBDo3K/5J0I9Z6VLCb2P0y5jcZwTbi+mOKQNYWg4qrRwLReN0AukO/PRMTn0r2YcE5lBsnhLaizBhnnBfM1Ep6tWCT4FZBF9/NcfhZwRWCRyARJTvwxgXBO+b7i4THBQzRw/d5o0QxKekuSG6CdID2JzloDOIqvVz/DMX494SMun+X4DvB6+Z3gbHoIUETpXKjYC2eVEV/EpzGQwUfabXIPYRBQBMYEnyL9j6Zcr3JxPpuyOVQQL3yZoiwyirBNJ9LVJVR06DWoUQWTBNaA5b0Fgj/IPgI98XJBGTUK8cFs4JXBE9BOEc9ng/9ThvO9XjNJ3lwRNAheBBP3KmkbfU4hHVv4MYkMov7umkeTpF+Hugj7LzaIPgmwTNWw0m9+lq45Cnhg1z3mHj1STOe2Wvu0/K30iTZUAThtZBeoCE1l3nORs79A26aJ97ZQ2PtGa7vCYYN0Q0mWeoglSdhtnM9XKaa3E0rnyefGiCfx2NnTYI6wtN4rhg3MFnig3Q8S1STa4SsLpmq8RBE8sTzJMm5Bo+08526+VeS7Q6uVoEJvHEJ4SRTnk5t+0PuU5d/RixHDU5a4m7zlFOX/V94Kokq1keVsPISCiQeTdWyT+LqFqzuYn8Ed0aFQRNW1YT+S/AjCMu1KLg5dH6BTqmEX7VdshxptdLzJNYLZG7UA4apr+MJK07UOa55OeW2E/+XEC9HWl11n+BDto2wdJIovaaxuAfnPAokJRo1AvxLPIp0G7E8SUzFDepOgQwxbQkFVRANizPgP8SF9IyP9F5mj366YyXSiUV7PQpUQtSKVpUnyLGCkD5Q75mv3TT3OK52I2OS1cglXD0WcoPRgKdilJOVGE4NcAvEVX6Lai6tWKrHKDBD4R9NoIBa+1mIL2CIkdBY6pNVhJiSvcmMwWM8W3vC70m2cafALlN34xTYh7KzhMYELf8IdT6coOsxUIeZZxrx8OGwh5Js41Os/FkqwjkesBWEFcgw3BzjGlCBOqgCbnJcx72tpvEcN6XzZbVqVEhVsm6VaOmDPCzjUaAORT/F4s7FbwieEzxtjcZZOTvg05hS2xHDHhgCLczTOkzdyCuEkud+Jb6T9eo0w1Vtr8VqEDdTxG3jBWb2y/MF5GVHus/U8WVDOkMjCWgI22JWp/TfT1chL5rPWax+P+/qRpcq6TZqc4nhaj2lr7iULb2f8MqZKe7MUguPJmYCtx++RRxnwDSveo8meYlYRtrTIl1kljhIvJ5k1jhPR9wC+lBqoIo5PLxITNVK+gBzxmYDPfQrwSkzk7RXENNRG89g3M6ZlPQcC+xwyLI7QYHQGIkZ9qsmaqXW/251QT5DzM8xvp5grwt4S+UjWukWn+i9R6V7XA8KdEfcU25br4h0Wv+SiwqfhjSIRobHcpK/BRgADKHKUh1T7dEAAAAASUVORK5CYII=";
      imageElement.style.width = "45px";
      element.append(imageElement);
      break;
    }
    case "Planning in Progress": {
      //transit
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABIJJREFUeNrsmX1olVUcx6/mHBfNN25e1liIDmmMEZYvYyLhCxWaiKjjKkEvotmIJYn4h2ISVn8EvmSUL4Uo/mGmiExGDUJkvcgIS8YgRMQUW7uuVcq4Tq93fn/0eeB4vc9d2dXnueCBD/e5e549+55zfuf3+56zQf39/ZFia4MjRdiGeBexx8YGraVUvCieNjnimmgXTaLHHui+krxTdMBtnHhDlIjT4lcxUkwXU8QuOhAa0TbCK8Tv4jORFjbtf4qvxWvidfGuSIZF9AsiKnaLSrGcjpj4g+Jz8Q7P7Q/LQqwhJG6Il0WH+ED8IBJ0oE1UhSk8hom/WHx2fUJcEFfFDFEu/hCjwiS6W8T5NPHzxCOiTvSJy6LayyBhCY/ziLpF/FaI1WKSOCB6CaFz/2Wka5imH4mtQrdTLLIq4vlthNsIZ0QZIdL0b0RbjNWLp0QXq3o6K7qzgKLtXWfFbERbu+Tcf5awac8XHiVUpk308GOxUWwl4W8Qi1jVhWpfESKVWT+vYJaPkwJziq5BoE3XdVZzjOd+EZvFMXpvyX5ygUR3ENsJR5N9vsQC/M7PML0q3iSWbJTXi1ZCZAOjYL1toWPnqWQNBRK+n/idz/eZ4gnCMeMnupbPKCnH0s0RRjQl1tKxR8VQwihCzEdJWxP52ZNiDO+fRCjFeDbCPS8UqsnBnSw2m+VlYqE47MS5rzW1aRjNSC5AmL3sQ7GXP/AeZTVOIYg4I7OQ62Us2uFiFbFp2WEl921NzOX6FfGME9tNhN03cFcb5G0CZE13kSetpM7hpWYPD4kzCE7QqWbCpIqQWs1s3N8qlMeapumx5eQlxGwS52Xit1O9gt8E5Gg9+NhaYvlgVjiEert1KUfCf7hH/L+io/dgKwON6QsUkhhlsy/P71kqfJ6c2jXAs/dVtOXiWfiOqeJLnF0u11dPgWgh/WWCEu2VaC/VrcCstHLfUt5zVDWrUjtIhXMpIodwgh34lAY2qnEc3DaKT5oC0kg26iY7fUKVrOUdp/xyf66UZzZwD2ITiI+wf7M0uFP8lPV8r3P9NyN/EdOVws94afSmY0lTfL9IiKXQtICq+T1Wos+vIvp1ahauro1QuPmAImAaM57EFqe8ijiQ6KCb+fk1bBJ2eqLDnqctrPbhFKuLqbic4Zisrtgq4s+OVy8a0ZZ1RhSb6BI3Z/uJHkExCUurcHL9XcVlXOSfo9U433vx0W0BCh6GrWjOJbqMzavtsr+gCtVRmiMBCk+g5WQu0QmmYLtzMHKOklyPeco84DheyiZ3t1vKXdETqPPprF/+FuNUhl/IDPCHbt1D50odUeNxknUYsT1ZXueOhZj22QQMdTYIn3KmMYNr75Cnkev3cYJx9pfesdYW7q9yDNhH3Kvk2nOR6ziOaOeo4nS+I4TlJPDNHB14nXqLY4NNiPiNjoxh3ziKGevGK1wlPZUTbqU8c5kNRoa8W44rtP8APM79KCTzHSG4omP0MoMtvc6qLcfrdgSd9/xcnh15LWbES8kkR90cGSrRxbwbL4p2W4ABAMe3OG5D9/DzAAAAAElFTkSuQmCC"; //transit
      imageElement.style.width = "45px";
      element.append(imageElement);
      break;
    }
    case "Arrived": {
      //plane
      imageElement.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4lJREFUeNrUmUloU1EUhtOSGoNYRNpqrFoV0booIkoRq0jFhdSAiogiWHTh0oW4EF2IiOBSnBYiIqgIdmMRFXFhkSIOFAfEkTg1tjZprEMdqIbE/8AfuFzee3lJ3pAc+Ej6kvvy33vPPcNrVTabDVSaVVWs6Lr6Bq9/NwSOgAkgA46Dl3YGpoaTgWqfFusfGAf6KLaTE7FlfomW1R0Co+AsqAGby1202GcwFfwCl0AbWFAJoiN8/4jYchM/RQ+ASTyMAa62CN7kt2gRsRfsB1GDlRabwlfx7y6wAjT7KVpWcQ5IgLVgoxq9GEUalWv3wVOwzcpN3I7TkxmPE3SFEFf4Lz8XwT/Bd2VMGIigJPijXB+TnUCcjgdt/HATmFmg2JSWLCS8vTH4Xr/J+NcG12aBHeCQlWjZ1q1ghnJw0jZFxzTRsuWfHIjtS+WNmeglnJX8+FHwlv5XrHU6lJC6zESLn20HD8B5h3z7DlhGN7kIclXaHtALHirfXQUWg1Pgt3J9hBHGUPQ68BVcdqjGEFsJPoJjzIBitTyYL/hZgMlGdvmKVQEVNAhRLeAcT2upJitzAIznKqv3nKbF62rusPj+baub6qIjHBxzMOwlTK5HOIkR/r0aTAeH6b+2k0tIiYluW4QRKZcVxS2vKytvW/QPJSl4IXpIcQuZwM1iqjwZ+A20eiC6kavazuR1IZ9bmPm0DOoBHawDBlwSHOahz9Ui10C8lB5RJrIb1DFOP3dJeAvrEakvntjNttIjmhVMYabwVop+pxU1bpjE7y9g0Cr7WonO2SLWt/MtUr4bTa9kyKs8XwWL9toa2Ceu4SKdVLKl748QzCzJOuUgg8Aupvuy6RGtTJLbabrK+koRHWBUucVgUGMUp/exMyhmRc6AZy4Jl8i1hYnogy5aBN8F75UByznDHj79eWzQMm3gDd0SPcrXiWYZ8ZVWjM9jDdLPTBljwa5ah8suUqvVRHl9WoL9XD6zCGmdsVe2kDriVrWHatKP3eP7tIt1iFXMjnJ3M3ZFZ/TA7qFJfb2TpcONfFWeE+VmKfesB7PZU8rOnlB6SldEtzM8lWoitpt9YsZOPV2K9bIaLMUG7TxfCZrUuKr12Ywcaa/OgC46qmVGmfUwY3jZmC66mx1Lhis8FihDCxqk5SZudcLh5x+uiG7mYepVWvxInvEhP0XL8+Q2UqilvBZdkf9m/i/AANKv82bJ/oh9AAAAAElFTkSuQmCC"; //in-plane
      imageElement.style.width = "45px";
      element.append(imageElement);
      break;
    }
  }
  return element;
}
function etaDate(params) {
  if (params.value != undefined && params.value != "") {
    return formatDate(params.value);
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
  debugger;
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
export default QuoteTable;

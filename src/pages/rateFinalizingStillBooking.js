import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import FileUpload from "./../assets/img/file.png";
import ReactTable from "react-table";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";

class RateFinalizingStillBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      BookingNo: "",
      Booking: [],
      Booking1: [],
      Booking2: [],
      Booking3: [],
      Booking4: [],
      Booking5: [],
      commodityData: [],
      selectedCommodity: "",
      selectedFilePath: ""
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleBook = this.toggleBook.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
  }
  componentDidMount() {
    debugger;
    if (
      typeof this.props.location.state.BookingNo != "undefined" &&
      typeof this.props.location.state.BookingNo != ""
    ) {
      var BookingNo = this.props.location.state.BookingNo;
      this.setState({ BookingNo });
      setTimeout(() => {
        this.HandleShipmentDetails();
        this.HandleCommodityDropdown();
      }, 100);
    }
  }

  HandleCommodityDropdown() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,
      data: {},
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }
  toggleBook(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      modalBook: !prevState.modalBook
    }));
  }
  toggleProfit() {
    this.setState(prevState => ({
      modalProfit: !prevState.modalProfit
    }));
  }
  toggleRequest() {
    this.setState(prevState => ({
      modalRequest: !prevState.modalRequest
    }));
  }
  onDocumentChangeHandler = event => {
    this.setState({
      selectedFileName: event.target.files[0].name
    });
  };

  HandleShipmentDetails() {
    let self = this;
    var BookingNo = this.state.BookingNo;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BookingShipmentSummaryDetails`,
      data: {
        BookingNo: BookingNo
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var Booking = response.data.Table;
      var Booking1 = response.data.Table1;
      var Booking2 = response.data.Table2;
      var Booking3 = response.data.Table3;
      var Booking4 = response.data.Table4;
      var Booking5 = response.data.Table5;
      self.setState({
        Booking,
        Booking1,
        Booking2,
        Booking3,
        Booking4,
        Booking5,
        selectedCommodity: Booking2[0].Commodity,
        selectedFilePath: Booking4[0].FTPLink,
        selectedFileName: Booking4[0].DocumentName
      });
    });
  }

  render() {
    const {
      Booking,
      Booking1,
      Booking2,
      Booking3,
      Booking4,
      Booking5
    } = this.state;

    // Booking2.length > 0
    //   ? this.setState({ selectedCommodity: Booking2[0].Commodity })
    //   : null;

    var data1 = [
      {
        validUntil: "Valid Until : JANUARY",
        tt: "TT",
        price: "$43.00"
      }
    ];
    var data2 = [
      {
        chargeCode: "A23435",
        chargeName: "Lorem",
        units: "43",
        unitPrice: "$134.00",
        finalPayment: "$45,986.00"
      },
      {
        chargeCode: "B45678",
        chargeName: "Lorem",
        units: "23",
        unitPrice: "$56.45",
        finalPayment: "$1200.00"
      },
      {
        chargeCode: "C54545",
        chargeName: "Lorem",
        units: "56",
        unitPrice: "$50.00",
        finalPayment: "$3456.00"
      }
    ];
    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    var i = 0;

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Booking Details</h2>
            </div>
            <div className="row">
              {/* <div className="col-md-4">
                <div className="rate-table-left rate-final-left">
                  <div>
                    <h3>Locals</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input id="ugm" type="checkbox" name={"local"} />
                            <label htmlFor="ugm">UGM</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input id="bl" type="checkbox" name={"local"} />
                            <label htmlFor="bl">B/L</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="stuffing"
                              type="checkbox"
                              name={"local"}
                            />
                            <label htmlFor="stuffing">Stuffing</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>Subcharges</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-clean"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="cont-clean">Container Clean</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="fumi"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="fumi">Fumigation</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="tarpau"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="tarpau">Tarpaulin</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="col-md-12">
                <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                  <div className="rate-final-contr">
                    <div className="title-border d-flex align-items-center justify-content-between py-3">
                      <h3>Quotation Price</h3>
                    </div>
                    <div className="react-rate-table">
                      <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Cell: row => {
                                  i++;
                                  return (
                                    <React.Fragment>
                                      <div className="d-flex align-items-center">
                                        <div className="cont-costs still-maersk rate-tab-check p-0">
                                          <div className="remember-forgot d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="details-title">
                                            Supplier Name
                                          </p>
                                          <p className="details-para">Maersk</p>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "validUntil",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">
                                        Valid Until
                                      </p>
                                      <p className="details-para">January</p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "tt",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">TT</p>
                                      <p className="details-para">23</p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "price",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Price</p>
                                      <p className="details-para">$43.00</p>
                                    </React.Fragment>
                                  );
                                }
                              }
                            ]
                          }
                        ]}
                        data={data1}
                        minRows={0}
                        showPagination={false}
                        className="-striped -highlight"
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                data={data2}
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "Charge Code",
                                        accessor: "chargeCode"
                                      },
                                      {
                                        Header: "Charge Name",
                                        accessor: "chargeName"
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "units"
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "unitPrice"
                                      },
                                      {
                                        Header: "Final Payment",
                                        accessor: "finalPayment"
                                      }
                                    ]
                                  }
                                ]}
                                defaultPageSize={3}
                                showPagination={false}
                              />
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="rate-final-contr">
                    <Collapse in={this.state.showContent}>
                      <div>
                        <div className="title-border py-3">
                          <h3>Rate Query</h3>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Shipment Type</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {Booking5.length > 0
                                ? Booking5[0].ModeOfTransport
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {Booking5.length > 0
                                ? Booking5[0].CargoType
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para">20 DC</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para">
                              Refer Type (20 degrees)
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {Booking5.length > 0
                                ? Booking5[0].Incoterm
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">Port2Port</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POL</p>
                            <p className="details-para">Mumbai</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">Vadodra</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">PU Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Delivery Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                    <div className="text-right">
                      <button
                        className={className}
                        id="toggler"
                        onClick={() =>
                          this.setState({
                            showContent: !this.state.showContent
                          })
                        }
                      >
                        {this.state.showContent ? (
                          <span>VIEW LESS</span>
                        ) : (
                          <span>VIEW MORE</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rate-final-contr">
                    <div>
                      <div className="title-border py-3">
                        <h3>Customer Details</h3>
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Account/Customer</p>
                            <p className="details-para">abcd</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para">Raj Mahlotra</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Consignee Name</p>
                            <p className="details-para">
                              {Booking3.length > 0
                                ? Booking3[0].Consignee
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {Booking3.length > 0
                                ? Booking3[0].ConsigneeAddress
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Shipper Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Shipper Name</p>
                            <p className="details-para">
                              {Booking3.length > 0 ? Booking3[0].Shipper : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {Booking3.length > 0
                                ? Booking3[0].ShipperAddress
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <select value={this.state.selectedCommodity}>
                          <option>Select</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.Commodity}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <input type="text" value="Dummy" disabled />
                      </div> */}
                    </div>
                    <div className="row">
                      <div className="col-md login-fields">
                        <p className="details-title">Cargo Details</p>
                      </div>
                    </div>
                    <div className="row cargodetailsB">
                      <ReactTable
                        data={Booking2}
                        columns={[
                          {
                            columns: [
                              {
                                Header: "Package Count",
                                accessor: "PackageCount"
                              },
                              {
                                Header: "Volume",
                                accessor: "Volume"
                              },
                              {
                                Header: "Weight",
                                accessor: "Weight"
                              }
                            ]
                          }
                        ]}
                        defaultPageSize={3}
                        minRows={1}
                        showPagination={false}
                      />
                    </div>
                    {/* <div className="text-right">
                      <a href="quote-table" className="butn">
                        Send
                      </a>
                    </div> */}
                    <div className="rename-cntr login-fields d-block">
                      {/* <input
                        type="file"
                        onChange={this.onDocumentChangeHandler}
                      ></input> */}
                      <div className="d-flex w-100 mt-4 align-items-center">
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
                            Add File
                          </label>
                        </div>
                      </div>
                      <a href={this.state.selectedFilePath}>
                        <p className="file-name w-100 text-center mt-1">
                          {this.state.selectedFileName}
                        </p>
                      </a>
                    </div>
                    <center>
                      <button
                        onClick={this.toggleBook}
                        className="butn more-padd mt-4"
                      >
                        Update Booking
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            className="amnt-popup"
            isOpen={this.state.modalProfit}
            toggle={this.toggleProfit}
            centered={true}
          >
            <ModalBody>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Amount</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" placeholder="Enter Amount" class="w-100" />
                </div>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.toggleProfit}>
                  Done
                </Button>
              </div>
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
              <div className="rate-radio-cntr justify-content-center mb-3">
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="consignee"
                  />
                  <label className="m-0" htmlFor="consignee">
                    Consignee
                  </label>
                </div>
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="shipper"
                  />
                  <label className="m-0" htmlFor="shipper">
                    Shipper
                  </label>
                </div>
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
                <label>Notify Party</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Details</label>
                <input type="text" placeholder="Enter Cargo Details" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Length</label>
                <input type="text" placeholder="Enter Length" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Width</label>
                <input type="text" placeholder="Enter Width" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Height</label>
                <input type="text" placeholder="Enter Height" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Weight</label>
                <input type="text" placeholder="Enter Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Gross Weight</label>
                <input type="text" placeholder="Enter Gross Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>CBM</label>
                <input type="text" placeholder="Enter CBM" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Size</label>
                <input type="text" placeholder="Enter Cargo Size" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Weight</label>
                <input type="text" placeholder="Enter Cargo Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Buyer Name</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Address</label>
                <textarea className="txt-add"></textarea>
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

          <Modal
            className=""
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>Popup will come</ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default RateFinalizingStillBooking;

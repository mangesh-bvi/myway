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

class SpotRateDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      spotrateresponseTbl: {},
      spotrateresponseTbl1: {},
      spotrateresponseTbl2: {},
      spotrateresponseTbl3: {},
      spotrateresponseTbl4: {},
      commodityData: [],
      historyModalData: [],
      historyModal: false
    };
    //this.setratequery = this.setratequery.bind(this);
    this.toggleSpotHistory = this.toggleSpotHistory.bind(this);
  }
  componentWillMount() {
    if (typeof this.props.location.state != "undefined") {
      var SpotRateID = this.props.location.state.detail[0];
      this.HandleShipmentDetails(SpotRateID);
      setTimeout(() => {
        this.HandleCommodityDropdown();
      }, 100);
    }
  }

  toggleSpotHistory() {
    this.setState({ historyModal: !this.state.historyModal });
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

  onDocumentChangeHandler = event => {
    this.setState({
      selectedFileName: event.target.files[0].name
    });
  };

  HandleShipmentDetails(SpotRateID) {
    var self = this;
    if (SpotRateID != undefined) {
      if (SpotRateID != null) {
        axios({
          method: "post",
          url: `${appSettings.APIURL}/SpotRateDetailsbyID`,
          data: {
            SpotRateID: SpotRateID
            //SpotRateID: '7753535'
          },
          headers: authHeader()
        })
          .then(function(response) {
            debugger;
            //alert("Success")
            //self.s .spotrateresponse = response.data;
            if (response != null) {
              if (response.data != null) {
                if (response.data.Table != null) {
                  if (response.data.Table.length > 0) {
                    self.setState({
                      spotrateresponseTbl: response.data.Table[0]
                    });
                  }
                }
                if (response.data.Table1 != null) {
                  if (response.data.Table1.length > 0) {
                    self.setState({
                      spotrateresponseTbl1: response.data.Table1[0]
                    });
                  }
                }
                if (response.data.Table2 != null) {
                  if (response.data.Table2.length > 0) {
                    self.setState({
                      spotrateresponseTbl2: response.data.Table2
                    });
                  }
                }
                if (response.data.Table3 != null) {
                  if (response.data.Table3.length > 0) {
                    self.setState({
                      spotrateresponseTbl3: response.data.Table3
                    });
                  }
                }
                if (response.data.Table4 != null) {
                  if (response.data.Table4.length > 0) {
                    self.setState({
                      spotrateresponseTbl4: response.data.Table4,
                      historyModalData: response.data.Table4
                    });
                  }
                }
              }
            }
          })
          .catch(error => {
            debugger;
            var temperror = error.response.data;
            var err = temperror.split(":");
            alert(err[1].replace("}", ""));
          });
      }
    }
  }

  render() {
    var data1 = [
      { validUntil: "Valid Until : JANUARY", tt: "TT", price: "$43.00" },
      { validUntil: "Valid Until : MARCH", tt: "TT", price: "$88.00" }
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
              <h2>Spot Rate Details</h2>
              <button
                onClick={this.toggleSpotHistory}
                className="butn more-padd"
              >
                Rate Query History
              </button>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                  <div className="rate-final-contr">
                    <div>
                      <div className="title-border py-3">
                        <h3>
                          Rate Query -{" "}
                          {this.state.spotrateresponseTbl.RateQueryId}
                        </h3>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <p className="details-title">Shipment Type</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.ShipmentType}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Mode of Transport</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Mode}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Container Load</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Trade_terms}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Equipment Types</p>
                          <p className="details-para"></p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Special Equipment</p>
                          <p className="details-para"></p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">
                            HazMat &amp; Unstackable
                          </p>

                          {this.state.spotrateresponseTbl.HAZMAT && (
                            <p className="details-para">Yes</p>
                          )}
                          {!this.state.spotrateresponseTbl.HAZMAT && (
                            <p className="details-para">No</p>
                          )}
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Custom Clearance</p>
                          <p className="details-para">
                            {" "}
                            {this.state.spotrateresponseTbl
                              .Customs_Clearance && (
                              <p className="details-para">Yes</p>
                            )}
                            {!this.state.spotrateresponseTbl
                              .Customs_Clearance && (
                              <p className="details-para">No</p>
                            )}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Inco Terms</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Trade_terms}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Type of Move</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.TypeofMove}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">POL</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl1.OriginPort_Name}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">POD</p>
                          <p className="details-para">
                            {
                              this.state.spotrateresponseTbl1
                                .DestinationPort_Name
                            }
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">PU Address</p>
                          <p className="details-para"></p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Delivery Address</p>
                          <p className="details-para"></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rate-final-contr">
                    <div className="title-border py-3">
                      <h3>Customer Details</h3>
                    </div>
                    <div className="">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="details-title">Account/Customer</p>
                          <p className="details-para">
                            {this.state.spotrateresponseTbl.Customer}
                          </p>
                        </div>
                        {/* <div className="col-md-4">
                          <p className="details-title">Address</p>
                          <p className="details-para">
                             
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Notification Person</p>
                          <p className="details-para"> </p>
                        </div> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        {/* <input type="text" value="Dummy" disabled /> */}
                        <select>
                          <option>Select</option>
                          <option>All</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.Commodity}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <input type="text" value="Dummy" disabled />
                      </div>
                    </div>

                    {/* <center>
                      <button
                        onClick={this.toggleBook}
                        className="butn more-padd mt-4"
                      >
                        Create Booking
                      </button>
                    </center> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------------Rate Query History Modal------------------- */}

          <Modal
            className="amnt-popup"
            isOpen={this.state.historyModal}
            toggle={this.toggleSpotHistory}
            centered={true}
          >
            <ModalBody>
              <ReactTable
                data={this.state.historyModalData}
                columns={[
                  {
                    columns: [
                      {
                        Header: "Status",
                        accessor: "Status"
                      },
                      {
                        Header: "CreatedBy",
                        accessor: "CreatedBy"
                      },
                      {
                        Header: "CreatedDate(GMT)",
                        accessor: "CreatedDate"
                      },
                      {
                        Header: "CreatedDate (Local)",
                        accessor: "CreatedDateLocal"
                      }
                    ]
                  }
                ]}
                defaultPageSize={3}
                minRows={1}
                showPagination={false}
              />

              <div className="text-center">
                <Button className="butn" onClick={this.toggleSpotHistory}>
                  Close
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* ----------------------End Rate Query History Modal------------------- */}
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

export default SpotRateDetails;

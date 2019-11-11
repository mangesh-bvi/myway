import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import {authHeader} from "../helpers/authHeader";

class RateFinalizing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      modalNewConsignee: false
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleNewConsignee = this.toggleNewConsignee.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
  }

  toggleProfit() {
    this.setState(prevState => ({
      modalProfit: !prevState.modalProfit
    }));
  }
  // toggleNewConsignee() {

  //   if(window.confirm('Are you sure to save this record?'))
  //   {
  //     this.handleQuoteSubmit();

  //   }
  //   this.setState(prevState => ({
  //     modalNewConsignee: !prevState.modalNewConsignee
  //   }));
  // }

  // handleQuoteSubmit()
  // {
  //   debugger;
  //   axios({
  //     method: "post",
  //     url: `${appSettings.APIURL}/FCLSalesQuoteInsertion`,
  //     data: {ShipmentType : 'Export',
  //     Inco_terms : 'CIF',
  //     TypesOfMove : 2,
  //     PickUpAddress :'Sakinaka Mumbai',
  //     DestinationAddress : '',
  //     HazMat  : 1,
  //     ChargeableWt : 29000,
  //      Containerdetails:[{
  //     ProfileCodeID:23,ContainerCode:'40GP',Type:'40 Standard Dry',ContainerQuantity:3,Temperature:0
  //   }],
  //   PickUpAddressDetails:{
  //       Street:'Sakinaka Mumbai',Country:'INDIA',State:'Maharashtra',City:'Mumbai',ZipCode:4135100
    
  //       },
  //       DestinationAddressDetails:{Street:'',Country:'',State:'',City:'',ZipCode:0}
  //   ,
  //   MyWayUserID:874588,
  //   CompanyID:1457295703,
  //   BaseCurrency:'USD',
  //   MywayProfit:1000,
  //   MywayDiscount:100,
  //   FCLSQBaseFreight:[{RateID:8539206,Freight:1200,FreightCurr:'USD',RateType:'RateQuery',Exrate :500  }],
  //   FCLSQLocalCharges:[{LocalChargeID :7547003,Description :'TEST',Amount:1000,Currency :'USD',Minimum :900,Tax :100,ChargeItem :'At Actual',RateID :8539206,Exrate :100 }],
  //   FCLSQSurCharges:[{SurchargeID :0,RateID :0,ChargeCode :'',Tax:0,Amount:0,Currency:'',ChargeItem:'',Exrate :0 }]
    
  //   },
  //   headers: authHeader()
  //   }).then(function(response){
  //      debugger;
  //      window.location.href = 'http://hrms.brainvire.com/BVESS/Account/LogOnEss'
  //   }).catch(error => {
  //     debugger;
  //     console.log(error.response)
  //   })
  // }

  toggleRequest() {
    this.setState(prevState => ({
      modalRequest: !prevState.modalRequest
    }));
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

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Rate Query Details</h2>
            </div>
            <div className="row">
              <div className="col-md-4">
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
              </div>
              <div className="col-md-8">
                <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                  <div className="rate-final-contr">
                    <div className="title-border py-3">
                      <h3>Quotation Price</h3>
                    </div>
                    <div className="react-rate-table">
                      <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">
                                        Supplier Name
                                      </p>
                                      <p className="details-para">Maersk</p>
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
                                      <p className="details-title">Valid</p>
                                      <p className="details-para">TT</p>
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
                    <div className="text-right">
                      <button className="butn m-0" id="toggler">
                        View More
                      </button>
                    </div>
                  </div>
                  <UncontrolledCollapse toggler="#toggler">
                    <div className="rate-final-contr">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="details-title">Shipment Type</p>
                          <p className="details-para">Import</p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Mode of Transport</p>
                          <p className="details-para">Air</p>
                        </div>
                        <div className="col-md-4">
                          <p className="details-title">Container Load</p>
                          <p className="details-para">FCL</p>
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
                          <p className="details-para">Populated Data</p>
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
                      <div className="row">
                        <div className="col-md-6 d-flex align-items-center">
                          <button
                            onClick={this.toggleProfit}
                            className="butn more-padd m-0"
                          >
                            Add Profit
                          </button>
                        </div>
                        <div className="col-md-6 text-right">
                          <button
                            onClick={this.toggleRequest}
                            className="butn more-padd m-0"
                          >
                            Request Change
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <a href="rate-table" className="butn">
                          Edit
                        </a>
                      </div>
                    </div>
                  </UncontrolledCollapse>

                  <div className="rate-final-contr">
                    <div className="title-border py-3">
                      <h3>Contact Details</h3>
                    </div>
                    <div className="">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="details-title">Account/Consignee</p>
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
                    <div className="text-right">
                      <button
                        onClick={this.toggleNewConsignee}
                        className="butn more-padd"
                      >
                        Add New Customer
                      </button>
                    </div>
                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <select>
                          <option>Select</option>
                        </select>
                      </div>
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <select>
                          <option>Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-right">
                      <a href="quote-table" className="butn">
                        Send
                      </a>
                    </div>
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
              <div className="txt-cntr">
                <div className="d-flex align-items-center">
                  <p className="details-title mr-3">Amount</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      class="w-100"
                    />
                  </div>
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
            className="amnt-popup"
            isOpen={this.state.modalNewConsignee}
            toggle={this.toggleNewConsignee}
            centered={true}
          >
            <ModalBody>
              <div className="txt-cntr">
                <div className="d-flex align-items-center">
                  <p className="details-title mr-3">Consignee Name</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <input type="text" class="w-100" />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <p className="details-title mr-3">Address</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <textarea class="rate-address"></textarea>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <p className="details-title mr-3">Notification Person</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <input type="text" class="w-100" />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <p className="details-title mr-3">Email Id</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <input type="text" class="w-100" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.toggleNewConsignee}>
                  Create
                </Button>
              </div>
            </ModalBody>
          </Modal>
          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>
              <h3 className="mb-4">Request Changes</h3>
              <div className="rename-cntr login-fields">
                <label>Discount</label>
                <input type="text" placeholder="Enter Discount" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Free Time</label>
                <input type="text" placeholder="Enter Time" maxLength="2" />
              </div>
              <div className="rename-cntr login-fields mb-0">
                <label>Comments</label>
                <textarea
                  className="txt-add"
                  placeholder="Enter Comments"
                ></textarea>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.toggleRequest}>
                  Request
                </Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default RateFinalizing;

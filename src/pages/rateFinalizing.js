import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import ReactTable from "react-table";
import Edit from "./../assets/img/pencil.png";
import Dummy from "./../assets/dummy.pdf";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { encryption } from "../helpers/encryption";

class RateFinalizing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      modalNewConsignee: false,
      commoditySelect: "select",
      cargoSelect: "select",
      rateQuery: true,
      rateDetails: [],
      rateSubDetails: [],

      ////
      containerLoadType: "",
      modeoftransport: "",
      shipmentType: "",
      HazMat: false,
      incoTeam: "",
      NonStackable: false,
      typeofMove: "",
      incoTerm: "",
      commodityData: [],
      selected:[],
      flattack_openTop:[],
      spacEqmtType:[],
      polfullAddData:{},
      podfullAddData:{},
      arrLocalsCharges: [],
      fltLocalCharges: [],
      arrSurCharges: [],
      fltSurCharges: [],
      ProfitAmount:0
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleNewConsignee = this.toggleNewConsignee.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.SendRequest = this.SendRequest.bind(this);
  }

  componentDidMount() {
    debugger;

    if (typeof this.props.location.state !== "undefined") {
      var rateDetails = this.props.location.state.selectedDataRow;
      var rateSubDetails = this.props.location.state.RateSubDetails;
      var containerLoadType = this.props.location.state.containerLoadType;
      var modeoftransport = this.props.location.state.modeoftransport;
      var shipmentType = this.props.location.state.shipmentType;
      var HazMat = this.props.location.state.HazMat;
      var NonStackable = this.props.location.state.NonStackablel;
      var typeofMove = this.props.location.state.typeofMove;
      var incoTerms = this.props.location.state.incoTerms;
      var commodityData = this.props.location.state.commodityData;
      var selected=this.props.location.state.selected;
      var spacEqmtType=this.props.location.state.spacEqmtType;
      var flattack_openTop=this.props.location.state.flattack_openTop;
      var polfullAddData=this.props.location.state.polfullAddData;
      var podfullAddData=this.props.location.state.podfullAddData;

      this.setState({
        rateDetails:rateDetails,
        rateSubDetails:rateSubDetails,
        HazMat:HazMat,
        shipmentType:shipmentType,
        modeoftransport:modeoftransport,
        containerLoadType:containerLoadType,
        typeofMove:typeofMove,
        NonStackable:NonStackable,
        incoTerm:incoTerms,
        commodityData:commodityData,
        selected:selected,
        spacEqmtType:spacEqmtType,
        flattack_openTop:flattack_openTop,
        polfullAddData:polfullAddData,
        podfullAddData:podfullAddData
      });

      this.HandleLocalCharges();
      this.HandleSurCharges();
    }
    // var rateSubDetails = JSON.parse(localStorage.getItem("rateSubDetails"));
    // var rateDetails = JSON.parse(localStorage.getItem("rateDetails"));
    // this.setState({
    //   rateDetails: rateDetails,
    //   rateSubDetails: rateSubDetails
    // });
  //   this.SendMail();
  }

  HandleLocalCharges() {
    let self = this;
    //var userid = encryption(window.localStorage.getItem("userid"), "desc");
    // var MultiplePOLPOD = [];
    // for(var i=0; i < polfullAddData.length; i++)
    // {
    //   for(var j=i; j< podfullAddData.length;)
    //   {
    //     MultiplePOLPOD.push([{POL: polfullAddData[i].UNECECode, POD: podfullAddData}])
    //   }
    // }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/LocalChargesSalesQuote`,
      data: {
        QuoteType:this.state.containerLoadType,
        ModeOfTransport:this.state.modeoftransport,
        Type:this.state.shipmentType,
        TypeOfMove:this.state.typeofMove,
        ChargeableWeight:0,
        Containerdetails:[{   
	          ProfileCodeID:this.state.selected.ProfileCodeID,ContainerCode:this.state.selected.StandardContainerCode,Type:'',ContainerQuantity:2,Temperature:0,TemperatureType:''
        }],
        Currency:'INR',
        MultiplePOLPOD:[{POL:'INNSA',POD:'TRPAM',POLGeoCordinate:'18.950123,72.950055',PODGeoCordinate:'40.968456,28.674417'},
        {POL:'INBOM',POD:'TRPAM',POLGeoCordinate:'19.078682,72.879144',
        PODGeoCordinate:'40.968456,28.674417'}],
        RateQueryDim:[{
          Quantity:0,Lengths:0,Width:0,Height:0,GrossWt:0,
          VolumeWeight:0,Volume:0
        }],MyWayUserID:874588

      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({
        arrLocalsCharges: response.data.Table,
        fltLocalCharges: response.data.Table
      })

      // var data = [];
      // data = response.data;
      // self.setState({ bookingData: data }); ///problem not working setstat undefined
    });
  }

  HandleSurCharges() {
    let self = this;
    //var userid = encryption(window.localStorage.getItem("userid"), "desc");
    // var MultiplePOLPOD = [];
    // for(var i=0; i < polfullAddData.length; i++)
    // {
    //   for(var j=i; j< podfullAddData.length;)
    //   {
    //     MultiplePOLPOD.push([{POL: polfullAddData[i].UNECECode, POD: podfullAddData}])
    //   }
    // }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SurChargesSalesQuote`,
      data: {
        QuoteType:this.state.containerLoadType,
        ModeOfTransport:this.state.modeoftransport,
        Type:this.state.shipmentType,
        TypeOfMove:this.state.typeofMove,
        ChargeableWeight:0,
        Containerdetails:[{   
	          ProfileCodeID:this.state.selected.ProfileCodeID,ContainerCode:this.state.selected.StandardContainerCode,Type:'',ContainerQuantity:2,Temperature:0,TemperatureType:''
        }],
        Currency:'INR',
        MultiplePOLPOD:[{POL:'INNSA',POD:'TRPAM',POLGeoCordinate:'18.950123,72.950055',PODGeoCordinate:'40.968456,28.674417'},
        {POL:'INBOM',POD:'TRPAM',POLGeoCordinate:'19.078682,72.879144',
        PODGeoCordinate:'40.968456,28.674417'}],
        RateQueryDim:[{
          Quantity:0,Lengths:0,Width:0,Height:0,GrossWt:0,
          VolumeWeight:0,Volume:0
        }],MyWayUserID:874588

      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({
        arrSurCharges: response.data.Table,
        fltSurCharges: response.data.Table
      })

      // var data = [];
      // data = response.data;
      // self.setState({ bookingData: data }); ///problem not working setstat undefined
    });
  }

  toggleProfit() {
    this.setState(prevState => ({
      modalProfit: !prevState.modalProfit
    }));
  }
  toggleNewConsignee() {
    // if(window.confirm('Are you sure to save this record?'))
    // {
    //   this.handleQuoteSubmit();

    // }
    this.setState(prevState => ({
      modalNewConsignee: !prevState.modalNewConsignee
    }));
  }

  newOpen() {
    window.open("http://www.google.com", "_blank");
  }

  commoditySelect(e) {
    this.setState({
      commoditySelect: e.target.value
    });
  }
  cargoSelect(e) {
    this.setState({
      cargoSelect: e.target.value
    });
  }

  rateQuery() {
    this.setState({
      rateQuery: !this.state.rateQuery
    });
  }

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

  SendRequest()
  {
    var txtRequestDiscount , txtRequestFreeTime, txtRequestComments = "";

    txtRequestDiscount = document.getElementById("txtRequestDiscount").value;
    txtRequestFreeTime = document.getElementById("txtRequestFreeTime").value;
    txtRequestComments = document.getElementById("txtRequestComments").value;

    alert(txtRequestDiscount + " - " + txtRequestFreeTime + " - " + txtRequestComments)
    

  }

  SendQuote()
  {

  }

  // SendMail()
  // {
  //   debugger;
  //   let self = this;
  //   axios({
  //     method: "post",
  //     url: `${appSettings.APIURL}/MyWayMessage`,
  //     data: {
  //       UserID:encryption(window.localStorage.getItem("userid"), "desc")
  //     },
  //     headers: authHeader()
  //   }).then(function(response) {
      
     
  //    self.bindMyWayMessageById();
  //   }).catch(error => {
  //     debugger;
  //     var temperror = error.response.data;
  //     var err = temperror.split(":");
  //     alert(err[1].replace("}", ""))
  //   });
  // }

  filterLocAll = event => {   
    var localcharge = event.target.value.toLowerCase();
    if(localcharge!="")
    {
      this.state.arrLocalsCharges = [];
    this.state.fltLocalCharges.map((item,index) => {
      
       if(item.ChargeDesc.toLowerCase().includes(localcharge)){      
        this.state.arrLocalsCharges.push(this.state.fltLocalCharges[index])
       }   
    })
   }
   else
   {
    this.state.arrLocalsCharges = [];
    this.state.arrLocalsCharges = this.state.fltLocalCharges
   }
    this.setState({
      arrLocalsCharges:this.state.arrLocalsCharges
    });
  };

  filterSurAll = event => {   
    var surcharge = event.target.value.toLowerCase();
    if(surcharge!="")
    {
      this.state.arrSurCharges = [];
      this.state.fltSurCharges.map((item,index) => {
      
       if(item.ChargeDesc.toLowerCase().includes(surcharge)){      
        this.state.arrSurCharges.push(this.state.fltSurCharges[index])
       }   
    })
   }
   else
   {
    this.state.arrSurCharges = [];
    this.state.arrSurCharges = this.state.fltSurCharges
   }
    this.setState({
      arrSurCharges:this.state.arrSurCharges
    });
  };
  

  hanleProfitAmountChange(e){
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
       this.setState({ProfitAmount: e.target.value})
    }
 }

 hanleProfitAmountSubmit(){
  
  alert(this.state.ProfitAmount)
 // this.setState({ProfitAmount: e.target.value})
  

}

  render() {
    // var data1 = [
    //   { validUntil: "Valid Until : JANUARY", tt: "TT", price: "$43.00" },
    //   { validUntil: "Valid Until : MARCH", tt: "TT", price: "$88.00" }
    // ];
    // var data2 = [
    //   {
    //     chargeCode: "A23435",
    //     chargeName: "Lorem",
    //     units: "43",
    //     unitPrice: "$134.00",
    //     finalPayment: "$45,986.00"
    //   },
    //   {
    //     chargeCode: "B45678",
    //     chargeName: "Lorem",
    //     units: "23",
    //     unitPrice: "$56.45",
    //     finalPayment: "$1200.00"
    //   },
    //   {
    //     chargeCode: "C54545",
    //     chargeName: "Lorem",
    //     units: "56",
    //     unitPrice: "$50.00",
    //     finalPayment: "$3456.00"
    //   }
    // ];
    const checkLocalCharges = this.state.arrLocalsCharges.map((item,index) => {
      let amtSign;
      if(item.Currency == 'INR')
      {
        amtSign = ''
      }
      else if(item.Currency == 'USD'){amtSign = '$'}
      return(
        <div>
          <div className="d-flex">
            <input id={"local"+(index+1)} type="checkbox" name={"local"} />
            <label htmlFor={"local"+(index+1)}>{item.ChargeDesc}</label>
          </div>
          <span>{item.Amount}{amtSign}</span>
        </div>
        )
    })

    const checkSurCharges = this.state.arrSurCharges.map((item,index) => {
      let amtSign;
      if(item.Currency == 'INR')
      {
        amtSign = ''
      }
      else if(item.Currency == 'USD'){amtSign = '$'}
      return(
        <div>
          <div className="d-flex">
            <input id={"Sur"+(index+1)} type="checkbox" name={"local"} />
            <label htmlFor={"Sur"+(index+1)}>{item.ChargeDesc}</label>
          </div>
          <span>{item.Amount}{amtSign}</span>
        </div>
        )
    })
    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              {/* <h2>Rate Query Details</h2> */}
              <h2>Create Sales Quote</h2>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="rate-table-left rate-final-left">
                  <div>
                    <h3>Locals</h3>
                    <div className="title-sect p-0 pt-2">
                      <input
                        type="search"
                        // value={this.state.filterAll}
                        onChange={this.filterLocAll}
                        placeholder="Search here"
                        className="w-100"
                      />
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        {checkLocalCharges}
                        {/* <div>
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>Surcharges</h3>
                    <div className="title-sect p-0 pt-2">
                      <input
                        type="search"
                        // value={this.state.filterAll}
                        onChange={this.filterSurAll}
                        placeholder="Search here"
                        className="w-100"
                      />
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        {checkSurCharges}
                        {/* <div>
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
                        </div> */}
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
                                  debugger;
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">
                                        Supplier Name
                                      </p>
                                      <p className="details-para">
                                        {row.original.lineName}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "expiryDate",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">
                                        Valid Until
                                      </p>
                                      <p className="details-para">
                                        {new Date(
                                          row.original.expiryDate ||
                                            row.original.ExpiryDate
                                        ).toLocaleDateString("en-US")}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "TransitTime",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">TT</p>
                                      <p className="details-para">
                                        {" "}
                                        {row.original.TransitTime}
                                      </p>
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
                                      <p className="details-para">
                                        {row.original.baseFreightFee !== "" &&
                                        row.original.baseFreightFee !== null
                                          ? row.original.baseFreightFee +
                                            " " +
                                            row.original.baseFreightCurr
                                          : ""}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              }
                            ]
                          }
                        ]}
                        data={this.state.rateDetails}
                        minRows={0}
                        showPagination={false}
                        className="-striped -highlight"
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                data={this.state.rateSubDetails}
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "Charge Code",
                                        accessor: "ChargeCode"
                                      },
                                      {
                                        Header: "Charge Name",
                                        accessor: "ChargeType"
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "ChargeItem"
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "Rate"
                                      },
                                      {
                                        Cell: row => {
                                          return (
                                            <>
                                              {row.original.TotalAmount !==
                                                "" &&
                                              row.original.TotalAmount !== null
                                                ? row.original.TotalAmount +
                                                  " " +
                                                  row.original.BaseCurrency
                                                : ""}
                                            </>
                                          );
                                        },
                                        Header: "Final Payment",
                                        accessor: "TotalAmount"
                                      }
                                    ]
                                  }
                                ]}
                                defaultPageSize={5}
                                showPagination={true}
                              />
                            </div>
                          );
                        }}
                      />
                    </div>
                    <UncontrolledCollapse toggler="#toggler">
                      <div className="rate-final-contr p-0">
                        <div className="d-flex justify-content-between align-items-center title-border py-3">
                          <h3>Rate Query</h3>
                          <a href="rate-table" className="rate-edit-icon">
                            <img src={Edit} alt="edit icon" />
                          </a>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Shipment Type</p>
                            <p className="details-para">
                              {this.state.shipmentType}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {this.state.modeoftransport}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {this.state.containerLoadType}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Equipment Types</p>
                            {this.state.selected.map((item, i) => (
                              <p className="details-para" key={i}>
                                {item.StandardContainerCode}
                              </p>
                            ))}
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Special Equipment</p>
                            {this.state.flattack_openTop.map((item, i) => (
                              <p className="details-para" key={i}>
                                {item.SpecialContainerCode}
                              </p>
                            ))}
                            {this.state.spacEqmtType.map((item, i) => (
                              <p className="details-para" key={i}>
                                {item.TypeName}
                              </p>
                            ))}
                             
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                            <p className="details-para">
                              {this.state.HazMat === true ? "True " : "False "}&{" "}
                              {this.state.NonStackable === true
                                ? "True"
                                : "False"}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {this.state.incoTerms}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {this.state.typeofMove === 1
                                ? "Port 2 Port"
                                : this.state.typeofMove === 2
                                ? "Door 2 Port"
                                : this.state.typeofMove === 3
                                ? "Port 2 Door"
                                : this.state.typeofMove === 4
                                ? "Door 2 Door"
                                : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POL</p>
                              <p className="details-para">{this.state.polfullAddData.NameWoDiacritics}</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">{this.state.podfullAddData.NameWoDiacritics}</p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">PU Address</p>
                            <p className="details-para">
                              {/* Lotus Park, Goregaon (E), Mumbai : 400099 */}
                              {this.state.polfullAddData.OceanPortLongName}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Delivery Address</p>
                            <p className="details-para">
                            {this.state.podfullAddData.OceanPortLongName}
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
                      </div>
                    </UncontrolledCollapse>

                    <div className="text-right">
                      <button
                        onClick={this.rateQuery.bind(this)}
                        className={
                          this.state.rateQuery ? "butn m-0" : "butn cancel-butn"
                        }
                        id="toggler"
                      >
                        {this.state.rateQuery ? "View More" : "View Less"}
                      </button>
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
                        Create Customer
                      </button>
                    </div>
                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <select onChange={this.commoditySelect.bind(this)}>
                          <option value="select">Select</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.Commodity}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <select onChange={this.cargoSelect.bind(this)}>
                          <option value="select">Select</option>
                          <option value="new">New</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-right">
                      <a href={Dummy} target="_blank" className="butn mr-3">
                        Preview
                      </a>
                      {/* <a
                        href="quote-table"
                        className={
                          this.state.commoditySelect == "select" ||
                          this.state.cargoSelect == "select"
                            ? "butn cancel-butn no-butn"
                            : "butn"
                        }
                      >
                        Send
                      </a> */}
                      <button
                              onClick={this.SendQuote}
                              className={
                                this.state.commoditySelect == "select" ||
                                this.state.cargoSelect == "select"
                                  ? "butn cancel-butn no-butn"
                                  : "butn"
                              }
                            >
                             Send
                            </button>
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
                      value={this.state.ProfitAmount} 
                      onChange={this.hanleProfitAmountChange.bind(this)}
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.hanleProfitAmountSubmit.bind(this)}>
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
              <div className="txt-cntr text-center">
                {/* <div className="d-flex align-items-center">
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
                </div> */}
                <p>Do you want to save the Quote ?</p>
              </div>
              <div className="text-center">
                <a
                  href="/quote-table"
                  className="butn mx-2"
                  onClick={() => {
                    this.toggleNewConsignee();
                    this.newOpen();
                  }}
                >
                  Yes
                </a>
                <a
                  href="#!"
                  className="butn cancel-butn mx-2"
                  onClick={this.toggleNewConsignee}
                >
                  No
                </a>
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
                <input type="text" id="txtRequestDiscount" placeholder="Enter Discount" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Free Time</label>
                <input type="text" id="txtRequestFreeTime" placeholder="Enter Time" maxLength="2" />
              </div>
              <div className="rename-cntr login-fields mb-0">
                <label>Comments</label>
                <textarea
                  className="txt-add"
                  placeholder="Enter Comments"
                  id="txtRequestComments"
                ></textarea>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.SendRequest}>
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

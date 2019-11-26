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
      spotrateresponseTbl: [],
      spotrateresponseTbl1: [],
      spotrateresponseTbl2: [],
      spotrateresponseTbl3: [],
      spotrateresponseTbl4: [],
      commodityData: [],
      historyModalData: [],
      historyModal: false,
      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      typesofMove: "",
      PickupCity: "",
      DeliveryCity: "",
      OriginGeoCordinates: "",
      DestGeoCordinate: "",
      companyId: 0,

      Containerdetails: [],
      PortOfDischargeCode: "",
      PortOfLoadingCode: "",
      Currency: "",
      //-----
      Custom_Clearance: false,
      NonStackable: false,
      HazMat: false,
      multiCBM: [
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ],
      users: [],
      referType: [],
      flattack_openTop: [],
      spacEqmtType: [],
      TruckTypeSelect: [],
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ],
      fieldspol: {},
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      refertypeSelect: false,
      isTypeofMove: "",
      cmbTypeRadio: "",
      specialEquipment: false,
      equipmentType: "",
      isSpecialEquipment: "0",
      tempratureEquipment: "",
      fields: {},
      poladdress: "",
      polpodData: [],
      polpodDataAdd: [],
      isHazMat: "",
      incoTerms: "",
      POL: "",
      POD: "",
      PUAddress: "",
      PDAddress: "",
      modalPuAdd: false,
      cbmLength: "",
      cbmWidth: "",
      cbmHeight: "",
      cbmQuantity: "1",
      cbmVal: "",
      PODData: [],
      POLData: [],
      puAdd: "",
      deliAdd: "",
      values: [],
      values1: [],
      equQuan: "",
      polCountry: "",
      pol: "",
      podCountry: "",
      pod: "",
      equipDrop: [],
      country: [],
      StandardContainerCode: [],
      multi: true,
      selected: [],
      isSpacialEqt: true,
      SpacialEqmt: [],
      spEqtSelect: [],
      searchTextPOD: "",
      zoomPOL: 0,
      zoomPOD: 0,
      markerPositionPOL: {},
      mapPositionPOL: {},
      markerPositionPOD: {},
      mapPositionPOD: {},
      fullAddressPOL: [],
      fullAddressPOD: [],
      totalQuantity: 0,
      isCustomClear: "No",
      polfullAddData: {},
      podfullAddData: {},
      commodityData: [],
      packageTypeData: [],
      isSearch: true,
      currencyData: [],
      currencyCode: "",
      TruckType: [],
      testSelection: false
    };
    //this.setratequery = this.setratequery.bind(this);
    this.toggleSpotHistory = this.toggleSpotHistory.bind(this);
    this.toggleViewRate = this.toggleViewRate.bind(this);
  }
  componentWillMount() {
    if (typeof this.props.location.state != "undefined") {
      var SpotRateID = this.props.location.state.detail[0];
      this.HandleShipmentDetails(SpotRateID);
      // setTimeout(() => {
        this.HandleCommodityDropdown();
      // }, 100);
    }

    this.HandlePackgeTypeData();
    this.HandleTruckTypeData();
    this.HandleGetIncoTerms();
  }

  toggleSpotHistory() {
    this.setState({ historyModal: !this.state.historyModal });
  }

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
            var spotrateresponseTbl1 = [];
            spotrateresponseTbl1 = response.data.Table1
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
                      spotrateresponseTbl1: spotrateresponseTbl1
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

  
  HandleBindIncoTeamData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,

      headers: authHeader()
    }).then(function(response) {
      var table1 = response.data.Table1;
      var table2 = response.data.Table2;
      var table4 = response.data.Table4;
      var finalArray = [];
      debugger;
      var standerEquipment = new Object();
      standerEquipment.StandardContainerCode = "Special Equipment";
      standerEquipment.ProfileCodeID = "Special Equipment";
      standerEquipment.ContainerName = "Special Equipment";

      for (let index = 0; index < table1.length; index++) {
        finalArray.push(table1[index]);
      }

      finalArray.push(standerEquipment);

      self.setState({
        StandardContainerCode: finalArray,
        SpacialEqmt: table2,
        currencyData: table4
      });
    });
  }

  HandleTruckTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/TruckTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ TruckType: data });
    });
  }

  HandlePackgeTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/PackageTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ packageTypeData: data });
    });
  }

  HandleGetIncoTerms() {
    let self = this;

    var shipmentType = self.state.shipmentType;
    var typeofMove = self.state.typesofMove;
    var HasCustomClear = self.state.isCustomClear;

    if (shipmentType === "Export" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "DAP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Export" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "DDP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({ incoTerms: "FOB" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        self.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        self.setState({
          incoTerms: "FOB"
        });
      }
    }
  }

  toggleViewRate(){
    let self = this;
    let fields = this.state.fields;
    let mapPositionPOD = this.state.mapPositionPOD;
    let mapPositionPOL = this.state.mapPositionPOL;
    let markerPositionPOD = this.state.markerPositionPOD;
    let podfullAddData = this.state.podfullAddData;
    let polfullAddData = this.state.polfullAddData;
    var selected = [];
    var users = [];
    fields["pod"] = this.state.spotrateresponseTbl.DestinationAddress;
    fields["pol"] = this.state.spotrateresponseTbl.PickUpAddress;
    mapPositionPOD["lat"] = 40.968456; mapPositionPOD["lng"] = 28.674417;
    mapPositionPOL["lat"] = 18.950123; mapPositionPOL["lng"] = 72.950055;
    markerPositionPOD["lat"] = 40.968456; markerPositionPOD["lng"] = 28.674417
    podfullAddData["GeoCoordinate"] = "40.968456,28.674417";
    podfullAddData["Location"] = "AMB";
    podfullAddData["NameWoDiacritics"] = "Ambarli";
    podfullAddData["OceanPortID"] = 6302;
    podfullAddData["OceanPortLongName"] = "Ambarli, Istanbul, Turkey";
    podfullAddData["UNECECode"] = "TRPAM";

    polfullAddData["GeoCoordinate"] = "18.950123,72.950055";
    polfullAddData["Location"] = "NSA";
    polfullAddData["NameWoDiacritics"] = "Nhava Sheva (Jawaharlal Nehru)";
    polfullAddData["OceanPortID"] = 1500;
    polfullAddData["OceanPortLongName"] = "Nhava Sheva (Jawaharlal Nehru), Mahārāshtra, India";
    podfullAddData["UNECECode"] = "INNSA";
    
    for(var i=0; i<this.state.spotrateresponseTbl1.length; i++)
    {
    selected.push({ContainerName:this.state.spotrateresponseTbl1[i].Container, ProfileCodeID:this.state.spotrateresponseTbl1[i].ContainerProfileCodeID,
       StandardContainerCode:this.state.spotrateresponseTbl1[i].ContainerCode})
    users.push({ContainerName:this.state.spotrateresponseTbl1[i].Container, ContainerQuantity:this.state.spotrateresponseTbl1[i].ContainerQty, 
      ProfileCodeID:this.state.spotrateresponseTbl1[i].ContainerProfileCodeID, StandardContainerCode:this.state.spotrateresponseTbl1[i].ContainerCode, Temperature:this.state.spotrateresponseTbl1[i].Container_Temperature, TemperatureType:""})
    }
    this.state.selected = selected;
    this.state.users = users;

    const {spotrateresponseTbl} = this.state;
    this.state.Custom_Clearance = spotrateresponseTbl.Custom_Clearance;
    this.state.DeliveryCity = spotrateresponseTbl.DestinationAddress;
    this.state.HazMat = spotrateresponseTbl.HAZMAT;
    this.state.containerLoadType = spotrateresponseTbl.Trade_terms;
    this.state.shipmentType = spotrateresponseTbl.ShipmentType;
    this.state.incoTerms = spotrateresponseTbl.Trade_terms;
    this.state.modeoftransport = "SEA";
    this.state.typeofMove = 1;
    this.state.typesofMove = "p2p";
    self.setState({
      Custom_Clearance: this.state.Custom_Clearance,
      DeliveryCity: this.state.DeliveryCity,
      DestGeoCordinate:"",
      HazMat: this.state.HazMat,
      NonStackable: false,
      OriginGeoCordinates:"",
      PDAddress:"",
      POD: "",
      PODData:[],
      POL:"",
      PUAddress: "",
      PickupCity: "",
      PortOfDischargeCode: "",
      PortOfLoadingCode: "",
      containerLoadType: this.state.containerLoadType,
      typeofMove: this.state.typeofMove,
      currencyCode: 'INR',
      fields,
      incoTerms:this.state.incoTerms,
      isCustomClear: "No",
      isSpacialEqt: true,
      isSpecialEquipment: "0",
      isTypeofMove: "",
      mapPositionPOD,
      mapPositionPOL,
      markerPositionPOD,
      markerPositionPOL: {},
      modalPuAdd: false,
      modeoftransport: this.state.modeoftransport,
      multi: true,
     // multiCBM: [{…}]
      pod: "",
      podCountry: "",
      podfullAddData:podfullAddData,
      pol: "",
      polCountry: "",
      poladdress: "",
      polfullAddData: polfullAddData,
      polpodData: [],
      puAdd: "",
      referType: [],
      refertypeSelect: false,
      searchTextPOD: "",
      selected: selected,
      shipmentType: this.state.shipmentType,
      spEqtSelect: [],
      spacEqmtType: [],
      spacEqmtTypeSelect: false,
      specialEqtSelect: false,
      specialEquipment: false,
      tempratureEquipment: "",
      testSelection: true,
      totalQuantity: 0,
      typesofMove: "p2p",
      users: users,
      values: [],
      values1: [],
      zoomPOD: 0,
      zoomPOL: 0   
    })
    this.HandleViewRateData();
    
  }

  HandleViewRateData()
  {
    this.props.history.push({ pathname: "rate-table", state: this.state });
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
    const { spotrateresponseTbl1, spotrateresponseTbl3 } = this.state;

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
                      <div className="col-md-7 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <div className="cls-rt">
                          <div className="ag-fresh">
                        {/* {(() => {
                        if (spotrateresponseTbl1.length>0) {
                 */}
                        <ReactTable
                          data={spotrateresponseTbl1}
                          noDataText="No Data Found"
                          filterable
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "Container",
                                  accessor: "Container"
                                },
                                {
                                  Header: "Quantity",
                                  accessor: "ContainerQty"
                                },

                                {
                                  Header: "Temperature",
                                  accessor: "Container_Temperature"
                                }
                              ]
                            }
                          ]}
                          className="-striped -highlight"
                          defaultPageSize={10}
                          minRows={1}
                          //getTrProps={this.HandleRowClickEvt}
                        />
                        </div>
                        <div className="ag-fresh">
                        <ReactTable
                          data={spotrateresponseTbl3}
                          noDataText="No Data Found"
                          filterable
                          columns={[
                            {
                              columns: [
                                // {
                                //   Header: "Equipment Type",
                                //   accessor: ""
                                // },
                                // {
                                //   Header: "Package Type",
                                //   accessor: ""
                                // },
                                {
                                  Header: "Quantity",
                                  accessor: "Quantity"
                                },

                                {
                                  Header: "Length",
                                  accessor: "Lengths"
                                },

                                {
                                  Header: "Width",
                                  accessor: "Width"
                                },

                                {
                                  Header: "Gross Weight",
                                  accessor: "GrossWt"
                                },

                                {
                                  Header: "Volume Weight",
                                  accessor: "VolumeWT"
                                }
                              ]
                            }
                          ]}
                          className="-striped -highlight"
                          defaultPageSize={10}
                          minRows={1}
                          //getTrProps={this.HandleRowClickEvt}
                        />
                        </div>
                        {/* }})()} */}
                        </div>
                        {/* <input type="text" value="Dummy" disabled /> */}
                      </div>
                    </div>
                    <div>
                    <button
                    onClick={this.toggleViewRate}
                    className="butn more-padd"
                    >
                    View Rate
                     </button>
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

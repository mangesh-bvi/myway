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
import maersk from "./../assets/img/maersk.png";
import matchSorter from "match-sorter";
import Copy from "./../assets/img/copy.png";

class RateFinalizing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      modalEdit: false,
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
      selected: [],
      flattack_openTop: [],
      spacEqmtType: [],
      polfullAddData: {},
      podfullAddData: {},
      arrLocalsCharges: [],
      fltLocalCharges: [],
      arrSurCharges: [],
      fltSurCharges: [],
      ProfitAmount: "",
      currencyCode: "",
      count: 0,
      toggleProfitRemoveBtn: false,
      Addedprofit: "0",
      toggleAddProfitBtn: true,
      users: [],
      referType: [],
      CargoDetailsArr: [],
      CommodityID: "",
      destAddress: [],
      pickUpAddress: [],
      modalPreview: false
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleNewConsignee = this.toggleNewConsignee.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.SendRequest = this.SendRequest.bind(this);
    this.HandleLocalCharges = this.HandleLocalCharges.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
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
      var selected = this.props.location.state.selected;
      var spacEqmtType = this.props.location.state.spacEqmtType;
      var flattack_openTop = this.props.location.state.flattack_openTop;
      var polfullAddData = this.props.location.state.polfullAddData;
      var podfullAddData = this.props.location.state.podfullAddData;
      var currencyCode = this.props.location.state.currencyCode;
      var users = this.props.location.state.users;
      var referType = this.props.location.state.referType;
      var CommodityID = this.props.location.state.CommodityID;
      var destAddress = this.props.location.state.destAddress;
      var pickUpAddress = this.props.location.state.pickUpAddress;
      var multiCBM = this.props.location.state.multiCBM;
      var TruckTypeData = this.props.location.state.TruckTypeData;
      var cbmVal = this.props.location.state.cbmVal;

      var CargoDetailsArr = [];
      if (containerLoadType == "FCL") {
        if (users != null) {
          if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
              CargoDetailsArr.push({ ContainerType: users[i].StandardContainerCode, "Packaging": "-", Quantity: users[i].ContainerQuantity, Lenght: "-", Width: "-", Height: "-", Weight: "-", Gross_Weight: "-", Temperature: "-" })
            }
          }
        }

      if(spacEqmtType != null)
      {
        if(spacEqmtType.length > 0)
        {
          for(var i = 0; i < spacEqmtType.length; i++)
          {
            CargoDetailsArr.push({ContainerType: spacEqmtType[i].StandardContainerCode, "Packaging":"-", Quantity: spacEqmtType[i].Quantity, Lenght:"-",Width:"-",Height:"-",Weight:"-",Gross_Weight: "-",Temperature:"-"})
          }
        }

        if (referType != null) {
          if (referType.length > 0) {
            for (var i = 0; i < referType.length; i++) {
              CargoDetailsArr.push({ ContainerType: referType[i].ContainerCode, "Packaging": "-", Quantity: referType[i].ContainerQuantity, Lenght: "-", Width: "-", Height: "-", Weight: "-", Gross_Weight: "-", Temperature: referType[i].Temperature + " " + referType[i].TemperatureType })
            }
          }
        }

        if (flattack_openTop != null) {
          if (flattack_openTop.length > 0) {
            for (var i = 0; i < flattack_openTop.length; i++) {
              CargoDetailsArr.push({ ContainerType: flattack_openTop[i].SpecialContainerCode, "Packaging": "-", Quantity: flattack_openTop[i].Quantity, Lenght: flattack_openTop[i].length, Width: flattack_openTop[i].width, Height: flattack_openTop[i].height, Weight: flattack_openTop[i].Gross_Weight, Gross_Weight: "-", Temperature: "-" })
            }
          }
        }
      }
      else if (containerLoadType == "LCL") {
        for (var i = 0; i < multiCBM.length; i++) {
          CargoDetailsArr.push({ ContainerType: multiCBM[i].PackageType, "Packaging": "-", Quantity: multiCBM[i].Quantity, Lenght: multiCBM[i].Lengths, Width: multiCBM[i].Width, Height: multiCBM[i].Height, Weight: multiCBM[i].GrossWt, Gross_Weight: "-", Temperature: "-", Volume: multiCBM[i].Volume, VolumeWeight: multiCBM[i].VolumeWeight })
        }
      }
      else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
        // var cSelectedRow = this.props.location.state.selectedDataRow;

        // var AllrateDetails = this.props.location.state.RateDetails;

        // for(var i = 0; i < cSelectedRow.length; i++)
        // {
        //   rateDetails = rateDetails.concat(AllrateDetails.filter(item => item.RateLineID == cSelectedRow[i].RateLineID))
        // }
        if (TruckTypeData != null) {
          if (TruckTypeData.length > 0) {
            for (var i = 0; i < TruckTypeData.length; i++) {
              CargoDetailsArr.push({ ContainerType: TruckTypeData[i].TruckDesc, "Packaging": "-", Quantity: TruckTypeData[i].Quantity, Lenght: "-", Width: "-", Height: "-", Weight: "-", Gross_Weight: "-", Temperature: "-" })
            }
          }
        }
      }
    }
    else if(containerLoadType == "AIR" )
    {
      if(multiCBM != null)
      {
        if(multiCBM.length > 0)
        {
          for(var i =0; i< multiCBM.length; i++)
          {
            if(multiCBM[i].PackageType != "" && multiCBM[i].PackageType != null)
            {
              CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
            }
          }
        }
      }

      if(cbmVal != null)
      {
        if(cbmVal != "")
        {
          if(cbmVal != "0")
          {
            CargoDetailsArr.push({ContainerType: '-', "Packaging":"-", Quantity: '-', Lenght:"-", Width:"-", Height:"-", Weight:"-" , Gross_Weight: "-", Temperature: cbmVal})
          }
        }
      }
    }

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
        podfullAddData:podfullAddData,
        currencyCode:currencyCode,
        users:users,
        referType:referType,
        CargoDetailsArr:CargoDetailsArr,
        CommodityID:CommodityID,
        destAddress:destAddress,
        pickUpAddress:pickUpAddress,
        multiCBM:multiCBM,
        TruckTypeData: TruckTypeData,
        cbmVal:cbmVal
      });


      this.state.rateDetails = rateDetails;
      this.state.rateSubDetails = rateSubDetails;
      this.state.HazMat = HazMat;
      this.state.shipmentType = shipmentType;
      this.state.modeoftransport = modeoftransport;
      this.state.containerLoadType = containerLoadType;
      this.state.typeofMove = typeofMove;
      this.state.NonStackable = NonStackable;
      this.state.incoTerm = incoTerms;
      this.state.commodityData = commodityData;
      this.state.selected = selected;
      this.state.spacEqmtType = spacEqmtType;
      this.state.flattack_openTop = flattack_openTop;
      this.state.polfullAddData = polfullAddData;
      this.state.podfullAddData = podfullAddData;
      this.state.currencyCode = currencyCode;
      this.state.currencyCode = currencyCode;

      this.HandleLocalCharges();
      this.HandleSurCharges();



      if (encryption(window.localStorage.getItem("usertype"), "desc") == "Customer") {
        this.setState({ toggleAddProfitBtn: false });
      }
    }
    // var rateSubDetails = JSON.parse(localStorage.getItem("rateSubDetails"));
    // var rateDetails = JSON.parse(localStorage.getItem("rateDetails"));
    // this.setState({
    //   rateDetails: rateDetails,
    //   rateSubDetails: rateSubDetails
    // });

  }


  HandleLocalCharges() {
    let self = this;

    var LocalChargeData = {
      QuoteType: this.state.containerLoadType,
      ModeOfTransport: this.state.modeoftransport,
      Type: this.state.shipmentType,
      TypeOfMove: this.state.typeofMove,
      ChargeableWeight: 0,
      Containerdetails: [{
        ProfileCodeID: this.state.selected.ProfileCodeID,
        ContainerCode: this.state.selected.StandardContainerCode,
        Type: '', ContainerQuantity: 2,
        Temperature: 0,
        TemperatureType: ''
      }],
      Currency: self.state.currencyCode,
      // MultiplePOLPOD:[
      // {POL:'INNSA',POD:'TRPAM',POLGeoCordinate:'18.950123,72.950055',PODGeoCordinate:'40.968456,28.674417'},
      // {POL:'INBOM',POD:'TRPAM',POLGeoCordinate:'19.078682,72.879144',PODGeoCordinate:'40.968456,28.674417'}],
      MultiplePOLPOD:
        [
          {
            POL: this.state.polfullAddData.UNECECode,
            POD: this.state.podfullAddData.UNECECode,
            POLGeoCordinate: this.state.polfullAddData.GeoCoordinate,
            PODGeoCordinate: this.state.podfullAddData.GeoCoordinate
          }
        ],
      RateQueryDim: [{
        Quantity: 0, Lengths: 0, Width: 0, Height: 0, GrossWt: 0,
        VolumeWeight: 0, Volume: 0
      }],
      MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc")

    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/LocalChargesSalesQuote`,
      data: LocalChargeData,
      headers: authHeader()
    }).then(function (response) {
      for (var i = 0; i < response.data.Table.length; i++) {
        self.state.arrLocalsCharges.push({
          Amount: response.data.Table[i].Amount, AmountInBaseCurrency: response.data.Table[i].AmountInBaseCurrency,
          ChargeCode: response.data.Table[i].ChargeCode, ChargeDesc: response.data.Table[i].ChargeDesc,
          ChargeItem: response.data.Table[i].ChargeItem, ContainerType: response.data.Table[i].ContainerType,
          Currency: response.data.Table[i].Currency, Exrate: response.data.Table[i].Exrate, LineName: response.data.Table[i].LineName, IsChecked: false
        })

        self.state.fltLocalCharges.push({
          Amount: response.data.Table[i].Amount, AmountInBaseCurrency: response.data.Table[i].AmountInBaseCurrency,
          ChargeCode: response.data.Table[i].ChargeCode, ChargeDesc: response.data.Table[i].ChargeDesc,
          ChargeItem: response.data.Table[i].ChargeItem, ContainerType: response.data.Table[i].ContainerType,
          Currency: response.data.Table[i].Currency, Exrate: response.data.Table[i].Exrate, LineName: response.data.Table[i].LineName, IsChecked: false
        })
      }
      self.setState({
        arrLocalsCharges: response.data.Table,
        fltLocalCharges: response.data.Table
      })
    }).catch(error => {
      debugger;
      console.log(error.response)
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
        QuoteType: this.state.containerLoadType,
        ModeOfTransport: this.state.modeoftransport,
        Type: this.state.shipmentType,
        TypeOfMove: this.state.typeofMove,
        ChargeableWeight: 0,
        Containerdetails: [{
          ProfileCodeID: this.state.selected.ProfileCodeID, ContainerCode: this.state.selected.StandardContainerCode, Type: '', ContainerQuantity: 2, Temperature: 0, TemperatureType: ''
        }],
        Currency: 'INR',
        MultiplePOLPOD: [{ POL: 'INNSA', POD: 'TRPAM', POLGeoCordinate: '18.950123,72.950055', PODGeoCordinate: '40.968456,28.674417' },
        {
          POL: 'INBOM', POD: 'TRPAM', POLGeoCordinate: '19.078682,72.879144',
          PODGeoCordinate: '40.968456,28.674417'
        }],
        RateQueryDim: [{
          Quantity: 0, Lengths: 0, Width: 0, Height: 0, GrossWt: 0,
          VolumeWeight: 0, Volume: 0
        }], MyWayUserID: 874588

      },
      headers: authHeader()
    }).then(function (response) {
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
      modalProfit: !prevState.modalProfit,
      ProfitAmount: this.state.Addedprofit
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
    window.open("https://org242240bd.crm.dynamics.com/main.aspx?etn=lead&pagetype=entityrecord", "_blank");
  }

  commoditySelect(e) {
    this.setState({
      commoditySelect: e.target.value,
      CommodityID: ""
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

  togglePreview() {
    this.setState(prevState => ({
      modalPreview: !prevState.modalPreview
    }));
  }


  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  SendRequest()
  {
    var txtRequestDiscount , txtRequestFreeTime, txtRequestComments = "";
    txtRequestDiscount = 0;
    txtRequestFreeTime = 0;
    var containerLoadType = this.state.containerLoadType;
    if (document.getElementById("txtRequestDiscount") != undefined) {
      txtRequestDiscount = document.getElementById("txtRequestDiscount").value;
    }
    if (document.getElementById("txtRequestFreeTime") != undefined) {
      txtRequestFreeTime = document.getElementById("txtRequestFreeTime").value;
    }

    if (document.getElementById("txtRequestComments") != undefined) {
      txtRequestComments = document.getElementById("txtRequestComments").value;

    }

    //alert(txtRequestDiscount + " - " + txtRequestFreeTime + " - " + txtRequestComments)

    var FCLSQLocalChargesarr = [];
    var FCLSQSurChargesarr = [];

    var chkslocalcharge = document.getElementsByName("localCharge");
    for (var i = 0; i < chkslocalcharge.length; i++) {
      if (chkslocalcharge[i].checked) {
        FCLSQLocalChargesarr.push({
          LocalChargeID: 0,
          Description: chkslocalcharge[0].attributes["data-chargedesc"].value,
          Amount: chkslocalcharge[0].attributes["data-amountinbasecurrency"].value,
          Currency: chkslocalcharge[0].attributes["data-currency"].value,
          Minimum: 0,
          Tax: 0,
          ChargeItem: chkslocalcharge[0].attributes["data-chargeitem"].value,
          RateID: 0,
          Exrate: 0
        });
      }
    }
    debugger;
    var rateDetailsarr = this.state.rateDetails;
    var rateSubDetailsarr = this.state.rateSubDetails;
    var FCLSQBaseFreight = [];

    for (var i = 0; i < rateDetailsarr.length; i++) {
      if (containerLoadType == "FCL") {
        FCLSQBaseFreight.push({ RateID: rateDetailsarr[i].RateLineId, RateType: rateDetailsarr[i].TypeOfRate });
      }
      if (containerLoadType == "LCL") {
        if (rateDetailsarr[i].RateLineID == undefined) {
          FCLSQBaseFreight.push({ RateID: rateDetailsarr[i].RateLineId, RateType: rateDetailsarr[i].TypeOfRate });
        }
        else {
          FCLSQBaseFreight.push({ RateID: rateDetailsarr[i].RateLineID, RateType: rateDetailsarr[i].TypeOfRate });
        }
      }
      else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
        FCLSQBaseFreight.push({ RateID: rateDetailsarr[i].RateLineID, RateType: rateDetailsarr[i].TypeOfRate });
      }
      else if(containerLoadType == "AIR")
      {
        FCLSQBaseFreight.push({RateID:rateDetailsarr[i].RateLineId,RateType:rateDetailsarr[i].TypeOfRate });
      }
    }

    var FCLSQCharges = [];

    for (var i = 0; i < rateDetailsarr.length; i++) {
      for (var j = 0; j < rateSubDetailsarr.length; j++) {
        if (containerLoadType == "FCL") {
          if (rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId) {
            FCLSQCharges.push({
              ChargeID: rateSubDetailsarr[j].ChargeID,
              Rate: rateSubDetailsarr[j].Rate,
              Currency: rateSubDetailsarr[j].Currency,
              RateLineID: rateSubDetailsarr[j].RateLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              Tax: rateSubDetailsarr[j].Tax == null ? 0 : rateSubDetailsarr[j].Tax,
              ChargeItem: rateSubDetailsarr[j].ChargeItem,
              Exrate: rateSubDetailsarr[j].Exrate,
              ChargeType: rateSubDetailsarr[j].ChargeType,
              TotalAmount: rateSubDetailsarr[j].TotalAmount
            });
          }
        }
        if (containerLoadType == "LCL") {
          if (rateDetailsarr[i].RateLineID == undefined) {
            if (rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate: rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax: rateSubDetailsarr[j].Tax == null ? 0 : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount: rateSubDetailsarr[j].TotalAmount
              });
            }

          }
          else {
            if (rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineID) {
              FCLSQCharges.push({
                ChargeID: rateSubDetailsarr[j].ChargeID,
                Rate: rateSubDetailsarr[j].Rate,
                Currency: rateSubDetailsarr[j].Currency,
                RateLineID: rateSubDetailsarr[j].RateLineID,
                ChargeCode: rateSubDetailsarr[j].ChargeCode,
                Tax: rateSubDetailsarr[j].Tax == null ? 0 : rateSubDetailsarr[j].Tax,
                ChargeItem: rateSubDetailsarr[j].ChargeItem,
                Exrate: rateSubDetailsarr[j].Exrate,
                ChargeType: rateSubDetailsarr[j].ChargeType,
                TotalAmount: rateSubDetailsarr[j].TotalAmount
              });
            }
          }

        }
        if (containerLoadType == "FTL" || containerLoadType == "LTL") {
          if (rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineID) {
            FCLSQCharges.push({
              ChargeID: rateSubDetailsarr[j].ChargeID,
              Rate: rateSubDetailsarr[j].Rate,
              Currency: rateSubDetailsarr[j].Currency,
              RateLineID: rateSubDetailsarr[j].RateLineID,
              ChargeCode: rateSubDetailsarr[j].ChargeCode,
              Tax: rateSubDetailsarr[j].Tax == null ? 0 : rateSubDetailsarr[j].Tax,
              ChargeItem: rateSubDetailsarr[j].ChargeItem,
              Exrate: rateSubDetailsarr[j].Exrate,
              ChargeType: rateSubDetailsarr[j].ChargeType,
              TotalAmount: rateSubDetailsarr[j].TotalAmount
            });
          }
          if(containerLoadType == "AIR")
          {
          if(rateSubDetailsarr[j].RateLineID == rateDetailsarr[i].RateLineId){
            FCLSQCharges.push({
              ChargeID: rateSubDetailsarr[j].ChargeID ,
              Rate :rateSubDetailsarr[j].Rate ,
              Currency :rateSubDetailsarr[j].Currency ,
              RateLineID:rateSubDetailsarr[j].RateLineID ,
              ChargeCode :rateSubDetailsarr[j].ChargeCode ,
              Tax:rateSubDetailsarr[j].Tax == null ? 0 : rateSubDetailsarr[j].Tax,
              ChargeItem :rateSubDetailsarr[j].ChargeItem ,
              Exrate:rateSubDetailsarr[j].Exrate ,
              ChargeType: rateSubDetailsarr[j].ChargeType ,
              TotalAmount:rateSubDetailsarr[j].TotalAmount
              });
            }
          }
        }
      }
    }



    var chksurcharges = document.getElementsByName("surcharges");
    for (var i = 0; i < chksurcharges.length; i++) {
      if (chksurcharges[i].checked) {
        FCLSQSurChargesarr.push({
          SurchargeID: 0,
          ChargeCode: chksurcharges[0].attributes["data-chargedesc"].value,
          Amount: chksurcharges[0].attributes["data-amountinbasecurrency"].value,
          Currency: chksurcharges[0].attributes["data-currency"].value,
          Tax: 0,
          ChargeItem: chksurcharges[0].attributes["data-chargeitem"].value,
          RateID: 0,
          Exrate: 0
        });
      }
    }

    var Containerdetails = [];
    var RateQueryDim = [];
    // ProfileCodeID:23,ContainerCode:'40GP',Type:'40 Standard Dry',ContainerQuantity:3,Temperature:0
    var usesr = this.state.users;
    var spacEqmtType = this.state.spacEqmtType;
    var referType = this.state.referType;
    var flattack_openTop = this.state.flattack_openTop;

    if (containerLoadType == "FCL") {
      if (usesr != null) {
        if (usesr.length > 0) {
          for (var i = 0; i < usesr.length; i++) {
            Containerdetails.push({ ProfileCodeID: usesr[i].ProfileCodeID, ContainerCode: usesr[i].StandardContainerCode, Type: usesr[i].ContainerName, ContainerQuantity: usesr[i].ContainerQuantity, Temperature: usesr[i].Temperature == undefined ? 0 : usesr[i].Temperature })
          }
        }
      }

      if(spacEqmtType != null)
      {
        if(spacEqmtType.length > 0)
        {
          for(var i = 0; i < spacEqmtType.length; i++)
          {
            Containerdetails.push({ProfileCodeID:spacEqmtType[i].ProfileCodeID, ContainerCode:spacEqmtType[i].StandardContainerCode, Type:spacEqmtType[i].ContainerName,ContainerQuantity:spacEqmtType[i].Quantity, Temperature:0})
          }
        }
      }

      if (referType != null) {
        if (referType.length > 0) {
          for (var i = 0; i < referType.length; i++) {
            Containerdetails.push({ ProfileCodeID: referType[i].ProfileCodeID, ContainerCode: referType[i].ContainerCode, Type: referType[i].Type, ContainerQuantity: referType[i].ContainerQuantity, Temperature: referType[i].Temperature })
          }
        }
      }

      if (flattack_openTop != null) {
        if (flattack_openTop.length > 0) {
          for (var i = 0; i < flattack_openTop.length; i++) {
            RateQueryDim.push({ Quantity: flattack_openTop[i].Quantity, Lengths: flattack_openTop[i].length, Width: flattack_openTop[i].width, Height: flattack_openTop[i].height, GrossWt: flattack_openTop[i].Gross_Weight, VolumeWeight: 0, Volume: 0, PackageType: flattack_openTop[i].PackageType == undefined ? "" : flattack_openTop[i].PackageType })
          }
        }
      }
    }
    else if (containerLoadType == "LCL") {
      var multiCBM = this.state.multiCBM;
      for (var i = 0; i < multiCBM.length; i++) {
        //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
        RateQueryDim.push({ Quantity: multiCBM[i].Quantity, Lengths: multiCBM[i].Lengths, Width: multiCBM[i].Width, Height: multiCBM[i].Height, GrossWt: multiCBM[i].GrossWt, VolumeWeight: multiCBM[i].VolumeWeight, Volume: multiCBM[i].Volume, PackageType: multiCBM[i].PackageType })
      }
    }
    else if (containerLoadType == "FTL" || containerLoadType == "LTL") {
      var TruckTypeData = this.state.TruckTypeData;
      for (var i = 0; i < TruckTypeData.length; i++) {
        //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
        RateQueryDim.push({ Quantity: TruckTypeData[i].Quantity, Lengths: 0, Width: 0, Height: 0, GrossWt: 0, VolumeWeight: 0, Volume: 0, PackageType: TruckTypeData[i].TruckDesc })
      }
      //
    }
    else if(containerLoadType == "AIR")
    {
      var multiCBM = this.state.multiCBM;
      for(var i =0; i< multiCBM.length; i++)
      {
        //CargoDetailsArr.push({ContainerType: multiCBM[i].PackageType, "Packaging":"-", Quantity: multiCBM[i].Quantity, Lenght:multiCBM[i].Lengths,Width:multiCBM[i].Width,Height:multiCBM[i].Height,Weight:multiCBM[i].GrossWt,Gross_Weight: "-",Temperature:"-",Volume:multiCBM[i].Volume,VolumeWeight:multiCBM[i].VolumeWeight})
        RateQueryDim.push({Quantity:multiCBM[i].Quantity ,Lengths:multiCBM[i].Lengths ,Width:multiCBM[i].Width ,Height:multiCBM[i].Height ,GrossWt:multiCBM[i].GrossWt, VolumeWeight:multiCBM[i].VolumeWeight, Volume:multiCBM[i].Volume, PackageType:multiCBM[i].PackageType})
      }
    var cbmVal = this.state.cbmVal;

      if(cbmVal != null)
      {
        if(cbmVal != "")
        {
          if(cbmVal != "0")
          {
            RateQueryDim.push({Quantity:TruckTypeData[i].Quantity ,Lengths:0 ,Width:0 ,Height:0 ,GrossWt:0, VolumeWeight:0, Volume:0, PackageType:TruckTypeData[i].TruckDesc})
          }
        }
      }
    }

    var PickUpAddress = "";
    var DestinationAddress = "";
    var PickUpAddressDetails = { Street: '', Country: '', State: '', City: '', ZipCode: 0 }
    var DestinationAddressDetails = { Street: '', Country: '', State: '', City: '', ZipCode: 0 };


    if (this.state.typeofMove == 2 || this.state.typeofMove == 4) {
      PickUpAddress = this.props.location.state.pickUpAddress[0].City
      PickUpAddressDetails = {
        Street: this.props.location.state.pickUpAddress[0].Area,
        Country: this.props.location.state.pickUpAddress[0].Country,
        State: this.props.location.state.pickUpAddress[0].State,
        City: this.props.location.state.pickUpAddress[0].City,
        ZipCode: this.props.location.state.pickUpAddress[0].ZipCode
      }
    }

    if (this.state.typeofMove == 3 || this.state.typeofMove == 4) {
      DestinationAddress = this.props.location.state.destAddress[0].City
      DestinationAddressDetails = {
        Street: this.props.location.state.destAddress[0].Area,
        Country: this.props.location.state.destAddress[0].Country,
        State: this.props.location.state.destAddress[0].State,
        City: this.props.location.state.destAddress[0].City,
        ZipCode: this.props.location.state.destAddress[0].ZipCode
      }
    }



    debugger;
    var senrequestpara = {
      ShipmentType: this.state.shipmentType,
      Inco_terms: this.state.incoTerm,
      TypesOfMove: this.state.typeofMove,
      PickUpAddress: PickUpAddress,
      DestinationAddress: DestinationAddress,
      HazMat: this.state.HazMat == true ? 1 : 0,
      ChargeableWt: 0,
      Containerdetails: Containerdetails,
      PickUpAddressDetails: PickUpAddressDetails,
      DestinationAddressDetails: DestinationAddressDetails,
      MyWayUserID: encryption(window.localStorage.getItem("userid"), "desc"),
      CompanyID: 1457295703,
      BaseCurrency: this.state.currencyCode,
      MywayProfit: this.state.Addedprofit,
      MywayDiscount: txtRequestDiscount,
      // FCLSQBaseFreight:FCLSQBaseFreightarr,
      // FCLSQLocalCharges: FCLSQLocalChargesarr,
      // FCLSQSurCharges: FCLSQSurChargesarr,

      Comments: txtRequestComments,
      FreeTime: txtRequestFreeTime,
      RateQueryDim: RateQueryDim,
      MailBody: "Hello Customer Name,      Greetings!!    Quotation for your requirement is generated by our Sales Team. To view the Qutation and its details please click here",
      Commodity: this.state.CommodityID
  }

  var url = "";

  if(this.state.containerLoadType == "FCL")
  {
    senrequestpara.FCLSQBaseFreight = FCLSQBaseFreight;
    senrequestpara.FCLSQCharges = FCLSQCharges;
    url = `${appSettings.APIURL}/FCLSalesQuoteInsertion`;
  }
  else if(this.state.containerLoadType == "LCL")
  {
    senrequestpara.LCLSQBaseFreight = FCLSQBaseFreight;
    senrequestpara.LCLSQCharges = FCLSQCharges;
    url = `${appSettings.APIURL}/LCLSalesQuoteInsertion`;
  }
  else if(this.state.containerLoadType == "FTL" || this.state.containerLoadType == "LTL")
  {
    senrequestpara.InlandSQBaseFreight = FCLSQBaseFreight;
    senrequestpara.InlandSQCharges = FCLSQCharges;
    url = `${appSettings.APIURL}/InlandSalesQuoteInsertion`;
  }
  else if(this.state.containerLoadType == "AIR")
  {
    senrequestpara.AirSQBaseFreight = FCLSQBaseFreight;
    senrequestpara.AirSQCharges = FCLSQCharges;
    url = `${appSettings.APIURL}/AirSalesQuoteInsertion`;
  }
  //return false;


    axios({
      method: "post",
      url: url,
      data: senrequestpara,
      headers: authHeader()
    }).then(function (response) {
      debugger;
      if (response != null) {
        if (response.data != null) {
          if (response.data.Table != null) {
            if (response.data.Table.length > 0) {
              alert(response.data.Table[0].Message)
              window.location.href = "quote-table";
            }
          }
        }
      }
      //window.location.href = 'http://hrms.brainvire.com/BVESS/Account/LogOnEss'
    }).catch(error => {
      debugger;
      console.log(error.response)
    })

  }

  SendQuote() {

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
    if (localcharge != "") {
      this.state.arrLocalsCharges = [];
      this.state.fltLocalCharges.map((item, index) => {

        if (item.ChargeDesc.toLowerCase().includes(localcharge)) {
          this.state.arrLocalsCharges.push(this.state.fltLocalCharges[index])
        }
      })
    }
    else {
      this.state.arrLocalsCharges = [];
      this.state.arrLocalsCharges = this.state.fltLocalCharges
    }
    this.setState({
      arrLocalsCharges: this.state.arrLocalsCharges
    });
  };

  filterSurAll = event => {
    var surcharge = event.target.value.toLowerCase();
    if (surcharge != "") {
      this.state.arrSurCharges = [];
      this.state.fltSurCharges.map((item, index) => {

        if (item.ChargeDesc.toLowerCase().includes(surcharge)) {
          this.state.arrSurCharges.push(this.state.fltSurCharges[index])
        }
      })
    }
    else {
      this.state.arrSurCharges = [];
      this.state.arrSurCharges = this.state.fltSurCharges
    }
    this.setState({
      arrSurCharges: this.state.arrSurCharges
    });
  };


  hanleProfitAmountChange(e) {
    const re = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({ ProfitAmount: e.target.value })
    }
  }

  hanleProfitAmountSubmit() {

    var rateDetailsarr = this.state.rateDetails;

    for (var i = 0; i < rateDetailsarr.length; i++) {
      rateDetailsarr[i].TotalAmount = parseFloat(rateDetailsarr[i].TotalAmount) + parseFloat(this.state.ProfitAmount)

    }
    this.setState(prevState => ({
      modalProfit: false
    }));

    var rateSubDetailsarr = this.state.rateSubDetails;

    for (var i = 0; i <= rateSubDetailsarr.length - 1; i++) {
      if (rateSubDetailsarr[i].ChargeCode == "Freight") {

        rateSubDetailsarr[i].TotalAmount = parseFloat(rateSubDetailsarr[i].TotalAmount) + parseFloat(this.state.ProfitAmount)

      }
    }

    this.setState({
      toggleProfitRemoveBtn: true,
      Addedprofit: this.state.ProfitAmount
    });
    this.forceUpdate()
  }

  hanleProfitAmountRemove() {
    var rateDetailsarr = this.state.rateDetails;

    for (var i = 0; i < rateDetailsarr.length; i++) {
      rateDetailsarr[i].TotalAmount = parseFloat(rateDetailsarr[i].TotalAmount) - parseFloat(this.state.Addedprofit)

    }
    this.setState(prevState => ({
      modalProfit: false
    }));

    var rateSubDetailsarr = this.state.rateSubDetails;

    for (var i = 0; i <= rateSubDetailsarr.length - 1; i++) {
      if (rateSubDetailsarr[i].ChargeCode == "Freight") {
        rateSubDetailsarr[i].TotalAmount = parseFloat(rateSubDetailsarr[i].TotalAmount) - parseFloat(this.state.Addedprofit)
      }
    }

    this.setState({
      toggleProfitRemoveBtn: false,
      Addedprofit: ""
    });
    this.forceUpdate()
  }

  HandleLocalSearchCharges(e) {
    debugger;
    var rateDetailsarr = this.state.rateDetails;
    if (e.target.checked) {

      for (var i = 0; i < rateDetailsarr.length; i++) {
        this.state.rateDetails[i].TotalAmount = parseFloat(this.state.rateDetails[i].TotalAmount) + parseFloat(e.target.value)

        var newrateSubDetails = {
          BaseCurrency: e.target.getAttribute('data-currency'),
          ChargeCode: e.target.getAttribute('data-chargedesc'),
          ChargeID: 0,
          ChargeItem: e.target.getAttribute('data-chargeitem'),
          ChargeType: e.target.getAttribute('data-chargetype'),
          Currency: e.target.getAttribute('data-currency'),
          Exrate: 0,
          Rate: parseFloat(e.target.value),
          RateLineID: this.state.rateDetails[i].RateLineId,
          Tax: 0,
          TotalAmount: parseFloat(e.target.getAttribute('data-amountinbasecurrency')),
          Extracharge: true
        }

        if (this.state.containerLoadType == "FTL" || this.state.containerLoadType == "LTL") {
          newrateSubDetails.RateLineID = this.state.rateDetails[i].RateLineID;
        }

        this.state.rateSubDetails = this.state.rateSubDetails.concat(
          newrateSubDetails
        );
      }
      this.forceUpdate()
    }
    if (!e.target.checked) {

      for (var i = 0; i < rateDetailsarr.length; i++) {
        this.state.rateDetails[i].TotalAmount = parseFloat(this.state.rateDetails[i].TotalAmount) - parseFloat(e.target.value)

        for (var i = 0; i <= this.state.rateSubDetails.length - 1; i++) {
          if (this.state.rateSubDetails[i]["ChargeCode"] == e.target.getAttribute('data-chargedesc')) {
            this.state.rateSubDetails.splice(i--, 1);
          }
        }
      }
      this.forceUpdate()
    }

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

    var i = 0;
    const checkLocalCharges = this.state.arrLocalsCharges.map((item, index) => {
      let amtSign;
      if (item.Currency == 'INR') {
        amtSign = ''
      }
      else if (item.Currency == 'USD') { amtSign = '$' }
      return (
        <div>
          <div className="d-flex">
            <input id={"local" + (index + 1)} value={item.Amount} type="checkbox" name={"localCharge"} data-chargeitem={item.ChargeItem} data-chargedesc={item.ChargeDesc} data-currency={item.Currency} data-amountinbasecurrency={item.AmountInBaseCurrency} data-chargetype="Localcharge" onChange={this.HandleLocalSearchCharges.bind(this)} />
            <label htmlFor={"local" + (index + 1)}>{item.ChargeDesc}</label>
          </div>
          <span>{item.Amount}{amtSign}</span>
        </div>
      )
    })

    const checkSurCharges = this.state.arrSurCharges.map((item, index) => {
      let amtSign;
      if (item.Currency == 'INR') {
        amtSign = ''
      }
      else if (item.Currency == 'USD') { amtSign = '$' }
      return (
        <div>
          <div className="d-flex">
            <input id={"Sur" + (index + 1)} type="checkbox" name={"surcharges"} value={item.Amount} data-chargeitem={item.ChargeItem} data-chargedesc={item.ChargeDesc} data-currency={item.Currency} data-amountinbasecurrency={item.AmountInBaseCurrency} data-chargetype="surcharge" onChange={this.HandleLocalSearchCharges.bind(this)} />
            <label htmlFor={"Sur" + (index + 1)}>{item.ChargeDesc}</label>
          </div>
          <span>{item.Amount}{amtSign}</span>
        </div>
      )
    })
    var self = this;

    var Commoditypresent = false;
    const commodityDatadrp = this.state.commodityData.map((item, i) => {

      if (item.id == self.state.CommodityID) {
        Commoditypresent = true;
        return (<option key={i} value={item.id} selected>
          {item.Commodity}
        </option>)
      }
      else {
        if (!Commoditypresent) {
          Commoditypresent = false;
        }

        return (<option key={i} value={item.id} >
          {item.Commodity}
        </option>)
      }

    })

    if (Commoditypresent) {
      this.state.commoditySelect = self.state.CommodityID

    }

    var containerLoadType = this.props.location.state.containerLoadType
    const { CargoDetailsArr } = this.state;
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
                    {/* <div className="react-rate-table">
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
                                      <p className="details-para">
                                        {row.original.lineName}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POL</p>
                                      <p title={row.original.POLName} className="details-para">
                                        {row.original.POLName}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "POLName",
                                //  minWidth: 175
                                filterable: true
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POD</p>
                                      <p title={row.original.PODName} className="details-para">
                                        {row.original.PODName}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "PODName",
                                filterable: true
                                // minWidth: 175
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">
                                        S.Port
                                      </p>
                                      <p className="details-para">
                                        {row.original.TransshipmentPort}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "TransshipmentPort",
                                filterable: true
                                // minWidth: 175
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">F.Time</p>
                                      <p className="details-para">
                                        {row.original.freeTime}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "freeTime",
                                filterable: true,
                                minWidth: 80
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Container</p>
                                      <p className="details-para">
                                        {row.original.ContainerType}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "ContainerType",
                                filterable: true
                                //minWidth: 175
                              },
                              {
                                accessor: "expiryDate",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">
                                      Expiry
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
                                        {row.original.TotalAmount !== "" &&
                                        row.original.TotalAmount !== null
                                          ? row.original.TotalAmount +
                                            " " +
                                            row.original.BaseCurrency
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
                                data={this.props.location.state.containerLoadType == "LCL" ? this.state.rateSubDetails.filter(
                                  item => item.RateLineID ==  row.original.RateLineID
                                  ) :  this.state.rateSubDetails.filter(
                                    item => item.RateLineID ==  row.original.rateID
                                    )
                                }
                                columns={[
                                  {
                                    columns: [
                                      // {
                                      //   Header: "Charge Code",
                                      //   accessor: "ChargeCode"
                                      // },
                                      {
                                        Header: "Charge Name",
                                        accessor: "ChargeCode"
                                      },
                                      {
                                        Header: "Tax",
                                        accessor: "Tax"
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "ChargeItem"
                                      },
                                      {
                                        Header: "Exrate",
                                        accessor: "Exrate"
                                      },
                                      {
                                        Cell: row => {

                                          return (
                                            <>
                                              {row.original.Rate !==
                                                "" &&
                                              row.original.Rate !== null
                                                ? row.original.Rate +
                                                  " " +
                                                  row.original.Currency
                                                : ""}
                                            </>
                                          );
                                        },
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
                                minRows={1}
                              />
                            </div>
                          );
                        }}
                      />
                    </div> */}
                    <div className="react-rate-table react-rate-tab">
                      <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Cell: ({ original, row }) => {
                                  i++;
                                  return (
                                    <React.Fragment>
                                      <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                        <div className="remember-forgot rat-img d-block m-0">
                                          {/* <input
                                          id={"maersk-logo" + i}
                                          type="checkbox"
                                          name={"rate-tab-check"}
                                          // checked={
                                          //   this.state.RateDetails[i - 1].checkbx
                                          //     ? this.state.RateDetails[i - 1]
                                          //         .checkbx
                                          //     : false
                                          // }
                                          // checked={
                                          //   this.state.cSelectedRow[
                                          //     original.rateID
                                          //   ] === true
                                          // }
                                          // onChange={e =>
                                          //   this.toggleRow(original.rateID, row)
                                          // }
                                        /> */}
                                          <label
                                            htmlFor={"maersk-logo" + i}
                                          ></label>
                                        </div>
                                      </div>
                                      <div className="rate-tab-img">
                                        <img src={maersk} alt="maersk icon" />
                                      </div>
                                    </React.Fragment>
                                  );
                                },
                                accessor: "lineName"
                                // minWidth: 200
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POL</p>
                                      <p
                                        title={row.original.POLName}
                                        className="details-para max2"
                                      >
                                        {row.original.POLName}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "POLName",
                                //  minWidth: 175
                                filterable: true
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">POD</p>
                                      <p
                                        title={row.original.PODName}
                                        className="details-para max2"
                                      >
                                        {row.original.PODName}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "PODName",
                                filterable: true
                                // minWidth: 175
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">S. Port</p>
                                      <p className="details-para">
                                        {row.original.TransshipmentPort}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "TransshipmentPort",
                                filterable: true
                                // minWidth: 175
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">F. Time</p>
                                      <p className="details-para">
                                        {row.original.freeTime}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "freeTime",
                                filterable: true,
                                minWidth: 80
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Container</p>
                                      <p className="details-para">
                                        {row.original.ContainerType}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "ContainerType",
                                filterable: true
                                //minWidth: 175
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Expiry</p>
                                      <p className="details-para">
                                        {new Date(
                                          row.original.expiryDate ||
                                          row.original.ExpiryDate
                                        ).toLocaleDateString("en-US")}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "expiryDate" || "ExpiryDate",
                                filterable: true,
                                minWidth: 90
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">TT</p>
                                      <p className="details-para">
                                        {row.original.TransitTime}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "TransitTime",
                                minWidth: 60
                              },
                              {
                                Cell: row => {
                                  return (
                                    <>
                                      <p className="details-title">Price</p>
                                      <p className="details-para">
                                        {row.original.TotalAmount !== "" &&
                                          row.original.TotalAmount !== null
                                          ? row.original.TotalAmount +
                                          " " +
                                          row.original.BaseCurrency
                                          : ""}
                                      </p>
                                    </>
                                  );
                                },
                                accessor: "baseFreightFee",
                                filterable: true,
                                minWidth: 80
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
                            filterAll: true,
                            Filter: () => { },
                            getProps: () => {
                              return {
                                // style: { padding: "0px"}
                              };
                            },
                            filterMethod: (filter, rows) => {
                              debugger;

                              const result = matchSorter(rows, filter.value, {
                                keys: ["commodities", "TransitTime"],
                                threshold: matchSorter.rankings.WORD_STARTS_WITH
                              });
                              console.log(
                                result,
                                "---------------result---------------"
                              );
                              return result;
                            }
                          }
                        ]}
                        // onFilteredChange={this.onFilteredChange.bind(this)}
                        // filtered={this.state.filtered}
                        // defaultFilterMethod={(filter, row) =>
                        //   String(row[filter.rateID]) === filter.value
                        // }
                        filterable
                        // expanded={this.state.expanded}
                        // onExpandedChange={(expand, event) => {
                        //   this.setState({
                        //     expanded: {
                        //       [event]: {}
                        //     }
                        //   });
                        // }}
                        data={this.state.rateDetails}
                        defaultPageSize={10}
                        className="-striped -highlight"
                        minRows={1}
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                minRows={1}
                                data={row.original.RateLineId == undefined ? this.state.rateSubDetails.filter(
                                  d =>
                                    d.RateLineID === row.original.RateLineID
                                ) :
                                  this.state.rateSubDetails.filter(
                                    d =>
                                      d.RateLineID === row.original.RateLineId
                                  )
                                }
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "C. Type",
                                        accessor: "ChargeType"
                                      },
                                      {
                                        Header: "C. Name",
                                        accessor: "ChargeCode"
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "Rate",
                                        Cell: props => (
                                          <React.Fragment>
                                            {props.original.Rate}
                                            &nbsp;
                                          {props.original.Currency}
                                          </React.Fragment>
                                        )
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "ChargeItem"
                                      },
                                      {
                                        Header: "Tax",
                                        accessor: "Tax"
                                      },

                                      {
                                        Header: "Exrate",
                                        accessor: "Exrate"
                                      },

                                      {
                                        Cell: row => {
                                          return (
                                            <>
                                              {row.original.TotalAmount !== "" &&
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
                                showPagination={true}
                                defaultPageSize={5}
                              />
                            </div>
                          );
                        }}
                      />
                      {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
                    </div>

                    <UncontrolledCollapse toggler="#toggler">
                      <div className="rate-final-contr p-0">
                        <div className="d-flex justify-content-between align-items-center title-border py-3">
                          <h3>Rate Query</h3>
                          {/* <a href="rate-table" className="rate-edit-icon">
                            <img src={Edit} alt="edit icon" />
                          </a> */}
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
                            {this.state.toggleAddProfitBtn && (
                              <button
                                onClick={this.toggleProfit}
                                className="butn more-padd m-0"
                              >
                                Add Profit
                            </button>
                            )}
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
                    <div className="text-center">
                            <button
                              onClick={this.toggleRequest}
                              className="butn more-padd m-0"
                            >
                              Request Change
                            </button>
                    </div>

                    <div className="title-border py-3">
                      <h3>Cargo Details</h3>
                    </div>
                    <div className="ag-fresh redirect-row">

                      <ReactTable
                        data={CargoDetailsArr}
                        filterable
                        minRows={1}

                        columns={[
                          {
                            Header: "Cont.Type",
                            accessor: "ContainerType"
                          },
                          {
                            Header: "Quantity",
                            accessor: "Quantity"
                          },
                          {
                            Header: "Lenght",
                            accessor: "Lenght"
                          },
                          {
                            Header: "Width",
                            accessor: "Width"
                          },
                          {
                            Header: "Height",
                            accessor: "Height"
                          },
                          {
                            Header: "Weight",
                            accessor: "Weight",
                            //editable: this.state.containerLoadType == "Air" ? true : false
                          },
                          {

                            Header: containerLoadType == "AIR" ? "CBM" : "Temssp.",
                            accessor: "Temperature",
                            //show:  this.state.containerLoadType == "Air" ? false : true
                          },
                          {
                            Header: "Action",
                            sortable: false,
                            Cell: row => {

                                return (
                                  <div className="action-cntr">
                                    {/* actionicon */}
                                    <button  onClick={this.toggleEdit}>
                                      <img
                                        className=""
                                        src={Edit}
                                        alt="booking-icon"
                                      />

                                    </button>


                                  </div>
                                );

                            }
                          }
                        ]}
                        className="-striped -highlight"
                        defaultPageSize={5}
                      //getTrProps={this.HandleRowClickEvt}
                      //minRows={1}
                      />
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
                          {this.state.toggleAddProfitBtn && (
                            <p className="details-para">abcd</p>
                          )}
                          {!this.state.toggleAddProfitBtn && (
                            <p className="details-para">{encryption(window.localStorage.getItem("username"), "desc")}</p>
                          )}
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
                      {this.state.toggleAddProfitBtn && (
                        <button
                          onClick={this.toggleNewConsignee}
                          className="butn more-padd"
                        >
                          Create Customer
                      </button>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <select onChange={this.commoditySelect.bind(this)}>
                          <option value="select">Select</option>
                          {/* {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.Commodity} >
                              {item.Commodity}
                            </option>
                          ))} */}
                          {commodityDatadrp}
                        </select>
                      </div>
                      {/* <div className="col-md-6 login-fields">
                        <p className="details-title">Cargo Details</p>
                        <select onChange={this.cargoSelect.bind(this)}>
                          <option value="select">Select</option>
                          <option value="new">New</option>
                        </select>
                      </div> */}
                    </div>
                    <div className="text-right">
                      {/* <a href={Dummy} target="_blank" className="butn mr-3">
                        Preview
                      </a> */}
                      <button
                        onClick={this.togglePreview}
                        className="butn more-padd m-0"
                      >
                        Preview
                      </button>
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
                        // onClick={this.SendQuote}
                        onClick={this.SendRequest}
                        className={
                          this.state.commoditySelect == "select"// ||
                            // this.state.cargoSelect == "select"
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
                  <p className="details-title mr-3">Amount ({this.state.currencyCode})</p>
                  <div class="spe-equ d-block m-0 flex-grow-1">
                    <input
                      type="text"
                      placeholder={"Enter Amount in " + this.state.currencyCode}
                      class="w-100"
                      value={this.state.ProfitAmount}
                      onChange={this.hanleProfitAmountChange.bind(this)}
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                {!this.state.toggleProfitRemoveBtn && (
                  <Button className="butn" onClick={this.hanleProfitAmountSubmit.bind(this)}>
                    Add
                </Button>
                )}
                {this.state.toggleProfitRemoveBtn && (
                  <Button className="butn" onClick={this.hanleProfitAmountRemove.bind(this)}>
                    Remove
                </Button>
                )}
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
              {this.state.toggleAddProfitBtn && (
                <div className="rename-cntr login-fields">
                  <label>Discount</label>
                  <input type="text" id="txtRequestDiscount" placeholder="Enter Discount" />
                </div>
              )}
              {this.state.toggleAddProfitBtn && (
                <div className="rename-cntr login-fields">
                  <label>Free Time</label>
                  <input type="text" id="txtRequestFreeTime" placeholder="Enter Time" maxLength="2" />
                </div>
              )}
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
          <Modal
            className="delete-popup preview-popup"
            isOpen={this.state.modalPreview}
            toggle={this.togglePreview}
          >

            <ModalBody>
              <h3 className="mb-4">Preview</h3>
              <div className="row title-border">
                <div className="col-sm-6">
                  <div className="dv-sales" style={{float:"left"}}>

                    <div className="rename-cntr login-fields">
                      <p className="preview-title">From</p>
                      <p className="preview-para">ATA Freight Line</p>
                    </div>
                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Sale Quote No</p>
                      <p className="preview-para"></p>
                    </div>
                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Email</p>
                      <p className="preview-para">abc@gmail.com</p>
                    </div>
                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Sales Person</p>
                      <p className="preview-para">demouser</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="dv-sales" style={{float:"right"}}>

                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Customer Name</p>
                      <p className="preview-para">ATA Freight Line</p>
                    </div>
                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Address</p>
                      <p className="preview-para"></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row title-border">
                <div className="col-sm-12">
                  <div className="dv-cust">
                    <div className="rename-cntr login-fields">
                      <p className="preview-title">Container Details</p>
                    </div>
                    <div className="row" style={{ marginBottom: "10px" }}>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Shipment Type</p>
                        <p className="preview-para-con">{this.state.shipmentType}</p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Mode Of Transport</p>
                        <p className="preview-para-con">{this.state.modeoftransport}</p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Container Load</p>
                        <p className="preview-para-con">{this.state.containerLoadType}</p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">HazMat</p>
                        <p className="preview-para-con">
                          {this.state.HazMat === true ? "True " : "False "}
                        </p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Non Stackable</p>
                        <p className="preview-para-con">{this.state.NonStackable === true
                                ? "True"
                                : "False"}</p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Type Of Move</p>
                        <p className="preview-para-con">{this.state.typeofMove === 1
                                ? "Port 2 Port"
                                : this.state.typeofMove === 2
                                  ? "Door 2 Port"
                                  : this.state.typeofMove === 3
                                    ? "Port 2 Door"
                                    : this.state.typeofMove === 4
                                      ? "Door 2 Door"
                                      : ""}</p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">POL</p>
                        <p className="preview-para-con">
                          {this.state.polfullAddData.NameWoDiacritics}
                        </p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">POD</p>
                        <p className="preview-para-con">
                          {this.state.podfullAddData.NameWoDiacritics}
                        </p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">PU Address</p>
                        <p className="preview-para-con">
                          {this.state.polfullAddData.OceanPortLongName}
                        </p>
                      </div>
                      <div className="col-md-2" style={{ marginBottom: "20px" }}>
                        <p className="preview-title-con">Delivery Address</p>
                        <p className="preview-para-con">
                          {this.state.podfullAddData.OceanPortLongName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row"> */}
              <div className="rename-cntr login-fields">
                <p className="preview-title">Quote Details</p>
              </div>
              <div className="react-rate-table react-rate-tab">
                <ReactTable
                  columns={[
                    {
                      columns: [
                        {
                          Cell: ({ original, row }) => {
                            i++;
                            return (
                              <React.Fragment>
                                <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                  <div className="remember-forgot rat-img d-block m-0">
                                    {/* <input
                                          id={"maersk-logo" + i}
                                          type="checkbox"
                                          name={"rate-tab-check"}
                                          // checked={
                                          //   this.state.RateDetails[i - 1].checkbx
                                          //     ? this.state.RateDetails[i - 1]
                                          //         .checkbx
                                          //     : false
                                          // }
                                          // checked={
                                          //   this.state.cSelectedRow[
                                          //     original.rateID
                                          //   ] === true
                                          // }
                                          // onChange={e =>
                                          //   this.toggleRow(original.rateID, row)
                                          // }
                                        /> */}
                                    <label
                                      htmlFor={"maersk-logo" + i}
                                    ></label>
                                  </div>
                                </div>
                                <div className="rate-tab-img">
                                  <img src={maersk} alt="maersk icon" />
                                </div>
                              </React.Fragment>
                            );
                          },
                          accessor: "lineName"
                          // minWidth: 200
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">POL</p>
                                <p
                                  title={row.original.POLName}
                                  className="details-para max2"
                                >
                                  {row.original.POLName}
                                </p>
                              </>
                            );
                          },
                          accessor: "POLName",
                          //  minWidth: 175
                          filterable: true
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">POD</p>
                                <p
                                  title={row.original.PODName}
                                  className="details-para max2"
                                >
                                  {row.original.PODName}
                                </p>
                              </>
                            );
                          },
                          accessor: "PODName",
                          filterable: true
                          // minWidth: 175
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">S. Port</p>
                                <p className="details-para">
                                  {row.original.TransshipmentPort}
                                </p>
                              </>
                            );
                          },
                          accessor: "TransshipmentPort",
                          filterable: true
                          // minWidth: 175
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">F. Time</p>
                                <p className="details-para">
                                  {row.original.freeTime}
                                </p>
                              </>
                            );
                          },
                          accessor: "freeTime",
                          filterable: true,
                          minWidth: 80
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">Container</p>
                                <p className="details-para">
                                  {row.original.ContainerType}
                                </p>
                              </>
                            );
                          },
                          accessor: "ContainerType",
                          filterable: true
                          //minWidth: 175
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">Expiry</p>
                                <p className="details-para">
                                  {new Date(
                                    row.original.expiryDate ||
                                    row.original.ExpiryDate
                                  ).toLocaleDateString("en-US")}
                                </p>
                              </>
                            );
                          },
                          accessor: "expiryDate" || "ExpiryDate",
                          filterable: true,
                          minWidth: 90
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">TT</p>
                                <p className="details-para">
                                  {row.original.TransitTime}
                                </p>
                              </>
                            );
                          },
                          accessor: "TransitTime",
                          minWidth: 60
                        },
                        {
                          Cell: row => {
                            return (
                              <>
                                <p className="details-title">Price</p>
                                <p className="details-para">
                                  {row.original.TotalAmount !== "" &&
                                    row.original.TotalAmount !== null
                                    ? row.original.TotalAmount +
                                    " " +
                                    row.original.BaseCurrency
                                    : ""}
                                </p>
                              </>
                            );
                          },
                          accessor: "baseFreightFee",
                          filterable: true,
                          minWidth: 80
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
                      filterAll: true,
                      Filter: () => { },
                      getProps: () => {
                        return {
                          // style: { padding: "0px"}
                        };
                      },
                      filterMethod: (filter, rows) => {
                        debugger;

                        const result = matchSorter(rows, filter.value, {
                          keys: ["commodities", "TransitTime"],
                          threshold: matchSorter.rankings.WORD_STARTS_WITH
                        });
                        console.log(
                          result,
                          "---------------result---------------"
                        );
                        return result;
                      }
                    }
                  ]}
                  // onFilteredChange={this.onFilteredChange.bind(this)}
                  // filtered={this.state.filtered}
                  // defaultFilterMethod={(filter, row) =>
                  //   String(row[filter.rateID]) === filter.value
                  // }
                  filterable
                  // expanded={this.state.expanded}
                  // onExpandedChange={(expand, event) => {
                  //   this.setState({
                  //     expanded: {
                  //       [event]: {}
                  //     }
                  //   });
                  // }}
                  data={this.state.rateDetails}
                  defaultPageSize={20}
                  className="-striped -highlight"
                  minRows={1}
                  showPagination={false}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "20px 0" }}>
                        <ReactTable
                          minRows={1}
                          data={row.original.RateLineId == undefined ? this.state.rateSubDetails.filter(
                            d =>
                              d.RateLineID === row.original.RateLineID
                          ) :
                            this.state.rateSubDetails.filter(
                              d =>
                                d.RateLineID === row.original.RateLineId
                            )
                          }
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "C. Type",
                                  accessor: "ChargeType"
                                },
                                {
                                  Header: "C. Name",
                                  accessor: "ChargeCode"
                                },
                                {
                                  Header: "Unit Price",
                                  accessor: "Rate",
                                  Cell: props => (
                                    <React.Fragment>
                                      {props.original.Rate}
                                      &nbsp;
                                          {props.original.Currency}
                                    </React.Fragment>
                                  )
                                },
                                {
                                  Header: "Units",
                                  accessor: "ChargeItem"
                                },
                                {
                                  Header: "Tax",
                                  accessor: "Tax"
                                },

                                {
                                  Header: "Exrate",
                                  accessor: "Exrate"
                                },

                                {
                                  Cell: row => {
                                    return (
                                      <>
                                        {row.original.TotalAmount !== "" &&
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
                          showPagination={false}
                          defaultPageSize={20}
                        />
                      </div>
                    );
                  }}
                  
                />
                <div className="title-border" style={{ marginBottom: "20px" }}>
                  <div>
                        <p className="preview-title-con" style={{float:"left"}}>Total Price</p>
                        <p className="preview-para-con" style={{float:"right"}}>
                        {this.state.rateDetails.reduce(
                          (sum, rateDetails) => sum + rateDetails.TotalAmount,
                             0
                          )}
                        </p>
                        </div>
                      </div>
                </div>
              {/* </div> */}
                </ModalBody>
          </Modal>
                {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
                  <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalEdit}
            toggle={this.toggleEdit}
            centered={true}
          >
                   <ModalBody>
              <h3 className="mb-4">Request Edit Changes</h3>
              {this.state.toggleAddProfitBtn && (
              <div className="rename-cntr login-fields">
                <label>Discount</label>
                <input type="text" id="txtRequestDiscount" placeholder="Enter Discount" />
              </div>
              )}
              {this.state.toggleAddProfitBtn && (
              <div className="rename-cntr login-fields">
                <label>Free Time</label>
                <input type="text" id="txtRequestFreeTime" placeholder="Enter Time" maxLength="2" />
              </div>
              )}
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

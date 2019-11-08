import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Select from "react-select";

import makeAnimated from "react-select/animated";
import { Button, Modal, ModalBody } from "reactstrap";
import Pencil from "./../assets/img/pencil.png";
import { de } from "date-fns/esm/locale";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";

var i = 0;
const animatedComponents = makeAnimated();
const { compose } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");

const Map1WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
  ></GoogleMap>
));
const Map2WithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
  ></GoogleMap>
));

class NewRateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      equipmentType: "",
      isSpecialEquipment: "0",
      specialEquipment: "",
      tempratureEquipment: "",
      isHazMat: "",
      incoTerms: "",
      typesofMove: "",
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
      spEqtSelect: []
    };

    this.togglePuAdd = this.togglePuAdd.bind(this);
    this.HandleTypeofMove = this.HandleTypeofMove.bind(this);
    this.HandleBindIncoTeamData = this.HandleBindIncoTeamData.bind(this);
    this.HandleCounterListBind = this.HandleCounterListBind.bind(this);
    this.HandlePOLPODListBind = this.HandlePOLPODListBind.bind(this);
  }

  componentDidMount() {
    this.HandleCounterListBind();
  }

  togglePuAdd() {
    this.setState(prevState => ({
      modalPuAdd: !prevState.modalPuAdd
    }));
  }

  HandleSpecialEqtCheck(e) {
    debugger;
    let self = this;
    if (e.target.checked) {
      self.setState({ isSpacialEqt: false });
    } else {
      var elmnt1 = document.getElementsByName("spequType");
      var elmnt1Len = elmnt1.length;
      for (let index = 0; index < elmnt1Len; index++) {
        if (elmnt1 != null && elmnt1 != "undefined") {
          elmnt1[0].remove();
          this.setState({
            spEqtSelect: []
          });
        }
      }
      self.setState({ isSpacialEqt: true, spEqtSelect: [] });
    }
  }

  //this Method For POD And POD Data Bind
  HandlePOLPODListBind(type) {
    debugger;

    var shipmentType =
      type == "sea" ? "O" : type == "air" ? "A" : type == "road" ? "I" : "";
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentStages`,
      data: {
        Mode: shipmentType
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
    });
  }
  //this Method for Bind Country Dropdown
  HandleCounterListBind() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchCountryList`,
      headers: authHeader()
    }).then(function(response) {
      var countryData = response.data.Table;
      if (countryData.length > 0) {
        self.setState({ country: countryData });
      }
    });
  }
  //this Method For Get Inco Team base on condition.
  HandleGetIncoTerms() {
    debugger;
    let self = this;
    var shipmentType = self.state.shipmentType;
    var typeofMove = self.state.typesofMove;
    var HasCustomClear = "No";

    if (shipmentType === "Export" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        this.setState({ incoTerms: "DAP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        this.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Export" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        this.setState({ incoTerms: "DDP" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        this.setState({ incoTerms: "CIF" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "No") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        this.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        this.setState({ incoTerms: "FOB" });
      }
    }
    if (shipmentType === "Import" && HasCustomClear === "Yes") {
      if (typeofMove == "d2d" || typeofMove === "p2d") {
        this.setState({ incoTerms: "ExWorks" });
      }

      if (typeofMove === "d2p" || typeofMove === "p2p") {
        this.setState({ incoTerms: "FOB" });
      }
    }
  }

  HandleBindIncoTeamData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/IncoTermsAPI`,

      headers: authHeader()
    }).then(function(response) {
      debugger;
      var table1 = response.data.Table1;
      var table2 = response.data.Table2;
      // var finalArray = [];

      // var standerEquipment = new Object();
      // standerEquipment.StandardContainerCode = "Special Equipment";
      // standerEquipment.ProfileCodeID = "Special Equipment";
      // standerEquipment.ContainerName = "Special Equipment";

      // for (let index = 0; index < table1.length; index++) {
      //   finalArray.push(table1[index]);
      // }

      // finalArray.push(standerEquipment);

      self.setState({
        StandardContainerCode: table1,
        SpacialEqmt: table2
      });
    });
  }

  HandleTypeofMove(e) {
    this.setState({ typesofMove: e.target.id });
    this.HandleGetIncoTerms();
    // next
    document.getElementById("typeMove").classList.add("typeMove");
    if (document.getElementById("cbmInner") == null)
      document.getElementById("equipTypeInner").classList.add("equipTypeType");
    else document.getElementById("cbmInner").classList.add("cbmType");

    if (document.getElementById("cbmIconCntr") == null)
      document
        .getElementById("equipTypeIconCntr")
        .classList.add("equipTypeIconCntr");
    else document.getElementById("cbmIconCntr").classList.add("cbmIconCntr");
    // document.getElementById("cbmIconCntr").classList.add("cbmIconCntr");

    if (document.getElementById("cbmName") == null)
      document.getElementById("equipTypeName").classList.remove("d-none");
    else document.getElementById("cbmName").classList.remove("d-none");

    // document.getElementById("cbmName").classList.remove("d-none");

    if (document.getElementById("cbmMinusClick") == null)
      document.getElementById("equipTypeMinusClick").classList.add("d-none");
    else document.getElementById("cbmMinusClick").classList.add("d-none");

    // document.getElementById("cbmMinusClick").classList.add("d-none");

    if (document.getElementById("cbmInner") == null)
      document.getElementById("equipTypePlusClick").classList.remove("d-none");
    else document.getElementById("cbmPlusClick").classList.remove("d-none");

    // document.getElementById("cbmPlusClick").classList.remove("d-none");
  }
  typeMovePlusClick = e => {
    document.getElementById("typeMoveInner").classList.remove("typeMoveType");
    document.getElementById("typeMovePlusClick").classList.add("d-none");
    document.getElementById("typeMoveName").classList.add("d-none");
    document.getElementById("typeMoveMinusClick").classList.remove("d-none");
  };
  typeMoveMinusClick = e => {
    document.getElementById("typeMoveInner").classList.add("typeMoveType");
    document.getElementById("typeMovePlusClick").classList.remove("d-none");
    document.getElementById("typeMoveName").classList.remove("d-none");
    document.getElementById("typeMoveMinusClick").classList.add("d-none");
  };

  ShipmentTypeClick = e => {
    let type = e.target.value;
    this.setState({ shipmentType: type });

    document.getElementById("shipmentType").classList.add("shipmentType");
  };
  shipmentTypePlusClick = e => {
    document
      .getElementById("shipmentTypeInner")
      .classList.remove("remShipmentType");
    document.getElementById("shipmentTypePlusClick").classList.add("d-none");
    document.getElementById("shipmentTypeName").classList.add("d-none");
    document
      .getElementById("shipmentTypeMinusClick")
      .classList.remove("d-none");
  };
  shipmentTypeMinusClick = e => {
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
  };
  modeofTransportClick = e => {
    let type = e.target.value;

    this.setState({ modeoftransport: type });
    document.getElementById("dvroad").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvair").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvsea").classList.add("new-radio-rate-cntr-hide");
    if (type == "AIR") {
      document
        .getElementById("dvair")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "SEA") {
      this.setState({ containerLoadType: "FCL" });
      document
        .getElementById("dvsea")
        .classList.remove("new-radio-rate-cntr-hide");
    } else if (type == "ROAD") {
      document
        .getElementById("dvroad")
        .classList.remove("new-radio-rate-cntr-hide");
    }

    // next
    document.getElementById("modeTransport").classList.add("modeTransport");
    document
      .getElementById("shipmentTypeInner")
      .classList.add("remShipmentType");
    document
      .getElementById("shipmentTypeIconCntr")
      .classList.add("shipmentTypeIconCntr");
    document.getElementById("shipmentTypeName").classList.remove("d-none");
    document.getElementById("shipmentTypeMinusClick").classList.add("d-none");
    document.getElementById("shipmentTypePlusClick").classList.remove("d-none");

    this.HandlePOLPODListBind(type);
  };
  modeTransPlusClick = e => {
    document.getElementById("modeTransInner").classList.remove("modeTransType");
    document.getElementById("modeTransPlusClick").classList.add("d-none");
    document.getElementById("modeTransName").classList.add("d-none");
    document.getElementById("modeTransMinusClick").classList.remove("d-none");
  };
  modeTransMinusClick = e => {
    document.getElementById("modeTransInner").classList.add("modeTransType");
    document.getElementById("modeTransPlusClick").classList.remove("d-none");
    document.getElementById("modeTransName").classList.remove("d-none");
    document.getElementById("modeTransMinusClick").classList.add("d-none");
  };
  ContainerLoadTypeClick = e => {
    let type = e.target.value;
    this.setState({ containerLoadType: type });

    // next
    document.getElementById("containerLoad").classList.add("containerLoad");
    document.getElementById("modeTransInner").classList.add("modeTransType");
    document
      .getElementById("modeTransIconCntr")
      .classList.add("modeTransIconCntr");
    document.getElementById("modeTransName").classList.remove("d-none");
    document.getElementById("modeTransMinusClick").classList.add("d-none");
    document.getElementById("modeTransPlusClick").classList.remove("d-none");
    if (type == "FCL") {
      this.HandleBindIncoTeamData();
    }
  };
  cntrLoadPlusClick = e => {
    document.getElementById("cntrLoadInner").classList.remove("cntrLoadType");
    document.getElementById("cntrLoadPlusClick").classList.add("d-none");
    document.getElementById("cntrLoadName").classList.add("d-none");
    document.getElementById("cntrLoadMinusClick").classList.remove("d-none");
  };
  cntrLoadMinusClick = e => {
    document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
    document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    document.getElementById("cntrLoadName").classList.remove("d-none");
    document.getElementById("cntrLoadMinusClick").classList.add("d-none");
  };
  cbmChange = e => {
    debugger;
    let type = e.target.value;
    let nme = e.target.name;
    if (nme === "length") {
      this.setState({ cbmLength: type });
    } else if (nme === "width") {
      this.setState({ cbmWidth: type });
    } else if (nme === "height") {
      this.setState({ cbmHeight: type });
    } else if (nme === "qnty") {
      this.setState({ cbmQuantity: type });
    }

    if (
      this.state.cbmLength !== "" &&
      this.state.cbmWidth !== "" &&
      this.state.cbmHeight !== "" &&
      this.state.cbmQuantity !== ""
    ) {
      let cbmVal =
        parseFloat(this.state.cbmLength) +
        parseFloat(this.state.cbmWidth) +
        parseFloat(this.state.cbmHeight);
      this.setState({ cbmVal });

      // next
      document.getElementById("cbm").classList.add("cbm");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };
  cbmPlusClick = e => {
    document.getElementById("cbmInner").classList.remove("cbmType");
    document.getElementById("cbmPlusClick").classList.add("d-none");
    document.getElementById("cbmName").classList.add("d-none");
    document.getElementById("cbmMinusClick").classList.remove("d-none");
  };
  cbmMinusClick = e => {
    document.getElementById("cbmInner").classList.add("cbmType");
    document.getElementById("cbmPlusClick").classList.remove("d-none");
    document.getElementById("cbmName").classList.remove("d-none");
    document.getElementById("cbmMinusClick").classList.add("d-none");
  };

  locationChange = (e, action) => {
    debugger;
    let type = e.value;
    let nme = action.name;
    if (nme === "polCountry") {
      this.setState({ polCountry: type });
    } else if (nme === "pol") {
      this.setState({ pol: type });
    } else if (nme === "podCountry") {
      this.setState({ podCountry: type });
    } else if (nme === "pod") {
      this.setState({ pod: type });
    }

    if (
      this.state.polCountry !== "" &&
      this.state.pol !== "" &&
      this.state.podCountry !== "" &&
      this.state.pod !== ""
    ) {
      // next
      document.getElementById("location").classList.add("location");
      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMoveInner").classList.add("typeMoveType");
      else document.getElementById("addressInner").classList.add("addressType");

      if (document.getElementById("addressInner") == null)
        document
          .getElementById("typeMoveIconCntr")
          .classList.add("typeMoveIconCntr");
      else
        document
          .getElementById("addressIconCntr")
          .classList.add("addressIconCntr");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMoveName").classList.remove("d-none");
      else document.getElementById("addressName").classList.remove("d-none");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMoveMinusClick").classList.add("d-none");
      else document.getElementById("addressMinusClick").classList.add("d-none");

      if (document.getElementById("addressInner") == null)
        document.getElementById("typeMovePlusClick").classList.remove("d-none");
      else
        document.getElementById("addressPlusClick").classList.remove("d-none");
    }
  };
  locationPlusClick = e => {
    document.getElementById("locationInner").classList.remove("locationType");
    document.getElementById("locationPlusClick").classList.add("d-none");
    document.getElementById("locationName").classList.add("d-none");
    document.getElementById("locationMinusClick").classList.remove("d-none");
  };
  locationMinusClick = e => {
    document.getElementById("locationInner").classList.add("locationType");
    document.getElementById("locationPlusClick").classList.remove("d-none");
    document.getElementById("locationName").classList.remove("d-none");
    document.getElementById("locationMinusClick").classList.add("d-none");
  };

  addressChange = e => {
    debugger;
    let type = e.target.value;
    let nme = e.target.name;
    if (nme === "puAdd") {
      this.setState({ puAdd: type });
    } else if (nme === "deliAdd") {
      this.setState({ deliAdd: type });
    }

    if (this.state.puAdd !== "" || this.state.deliAdd !== "") {
      // next
      document.getElementById("address").classList.add("address");
      document.getElementById("typeMoveInner").classList.add("typeMoveType");
      document
        .getElementById("typeMoveIconCntr")
        .classList.add("typeMoveIconCntr");
      document.getElementById("typeMoveName").classList.remove("d-none");
      document.getElementById("typeMoveMinusClick").classList.add("d-none");
      document.getElementById("typeMovePlusClick").classList.remove("d-none");
    }
  };
  addressPlusClick = e => {
    document.getElementById("addressInner").classList.remove("addressType");
    document.getElementById("addressPlusClick").classList.add("d-none");
    document.getElementById("addressName").classList.add("d-none");
    document.getElementById("addressMinusClick").classList.remove("d-none");
  };
  addressMinusClick = e => {
    document.getElementById("addressInner").classList.add("addressType");
    document.getElementById("addressPlusClick").classList.remove("d-none");
    document.getElementById("addressName").classList.remove("d-none");
    document.getElementById("addressMinusClick").classList.add("d-none");
  };

  quantityChange = e => {
    let type = e.target.value;
    this.setState({ equQuan: type });

    if (this.state.equQuan !== "") {
      // next
      document.getElementById("equipType").classList.add("equipType");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };
  equipTypePlusClick = e => {
    document.getElementById("equipTypeInner").classList.remove("equipTypeType");
    document.getElementById("equipTypePlusClick").classList.add("d-none");
    document.getElementById("equipTypeName").classList.add("d-none");
    document.getElementById("equipTypeMinusClick").classList.remove("d-none");
  };
  equipTypeMinusClick = e => {
    document.getElementById("equipTypeInner").classList.add("equipTypeType");
    document.getElementById("equipTypePlusClick").classList.remove("d-none");
    document.getElementById("equipTypeName").classList.remove("d-none");
    document.getElementById("equipTypeMinusClick").classList.add("d-none");
  };

  equipChange = (value, option) => {
    debugger;

    if (value !== null) {
      let iCount = value.length;

      let difference = this.state.selected.filter(x => !value.includes(x));
      if (difference.length > 0) {
        this.setState({ selected: value });

        if (difference[0].StandardContainerCode == "Special Equipment") {
          this.setState({ isSpacialEqt: true });
          var elmnt1 = document.getElementsByName("spequType");
          var elemnt1Len = elmnt1.length;
          for (let index = 0; index < elemnt1Len; index++) {
            if (elmnt1 != null && elmnt1 != "undefined") {
              elmnt1[0].remove();
              this.setState({
                spEqtSelect: []
              });
            }
          }
        }

        var elmnt = document.getElementById(
          difference[0].StandardContainerCode
        );
        if (elmnt != null && elmnt != "undefined") {
          elmnt.remove();
        }
      } else {
        this.setState({ selected: value });
        let dropVal =
          iCount == 1
            ? value[0].StandardContainerCode
            : value[iCount - 1].StandardContainerCode;
        if (dropVal == "Special Equipment") {
          this.setState({ isSpacialEqt: false });
        }
        let div = document.createElement("div");
        let clas = document.createAttribute("class");
        clas.value = "spec-inner-cntr";
        div.setAttributeNode(clas);

        let name = document.createAttribute("name");
        name.value = "equType";
        div.setAttributeNode(name);

        let ids = document.createAttribute("id");
        ids.value =
          iCount == 1
            ? value[0].StandardContainerCode
            : value[iCount - 1].StandardContainerCode;
        div.setAttributeNode(ids);

        let cont = document.createElement("p");
        cont.innerHTML = dropVal;
        let into = document.createElement("b");
        into.innerHTML = "X";
        let inpNum = document.createElement("input");
        let typ = document.createAttribute("type");
        typ.value = "number";
        inpNum.setAttributeNode(typ);
        inpNum.value = 1;
        let cross = document.createElement("i");
        let crsCls = document.createAttribute("class");
        crsCls.value = "fa fa-times";
        cross.setAttributeNode(crsCls);
        div.appendChild(cont);
        div.appendChild(into);
        div.appendChild(inpNum);
        div.appendChild(cross);
        document.getElementById("equipAppend").appendChild(div);
      }
    } else {
      debugger;
      var elmnt = document.getElementsByName("equType");
      if (elmnt != null && elmnt != "undefined") {
        elmnt[0].remove();
      }
      var lastSelectVal = this.state.selected[0];
      if (lastSelectVal.StandardContainerCode == "Special Equipment") {
        this.setState({ isSpacialEqt: true });
      }
      var elmnt1 = document.getElementsByName("spequType");
      var elmnt1Len = elmnt1.length;
      for (let index = 0; index < elmnt1Len; index++) {
        if (elmnt1 != null && elmnt1 != "undefined") {
          elmnt1[0].remove();
          this.setState({ spEqtSelect: [] });
        }
      }

      this.setState({ selected: [] });
    }

    let type = option.value;
    this.setState({ equQuan: type });

    if (this.state.equQuan !== "") {
      // next
      document.getElementById("equipType").classList.add("equipType");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  };
  specEquipChange = value1 => {
    if (value1 != null && value1 != "") {
      let iCount = value1.length;
      let difference = this.state.spEqtSelect.filter(x => !value1.includes(x));

      if (difference.length > 0) {
        this.setState({ spEqtSelect: value1 });
        var elmnt = document.getElementById(difference[0].SpecialContainerCode);
        if (elmnt != null && elmnt != "undefined") {
          elmnt.remove();
        }
      } else {
        this.setState({ spEqtSelect: value1 });
        i++;

        let dropVal =
          iCount == 1
            ? value1[0].SpecialContainerCode
            : value1[iCount - 1].SpecialContainerCode;
        let div = document.createElement("div");
        let clas = document.createAttribute("class");
        clas.value = "spec-inner-cntr";
        div.setAttributeNode(clas);

        let ids = document.createAttribute("id");
        ids.value =
          iCount == 1
            ? value1[0].SpecialContainerCode
            : value1[iCount - 1].SpecialContainerCode;
        div.setAttributeNode(ids);

        let name = document.createAttribute("name");
        name.value = "spequType";
        div.setAttributeNode(name);

        let cont = document.createElement("p");
        cont.innerHTML = dropVal;
        let into = document.createElement("b");
        into.innerHTML = "X";

        // let quan = document.createElement("span");
        // quan.innerHTML = "Quan :";
        let inpNum = document.createElement("input");
        let typ = document.createAttribute("type");
        typ.value = "number";
        inpNum.setAttributeNode(typ);
        inpNum.value = 1;

        let temp = document.createElement("span");
        let tempClas = document.createAttribute("class");
        tempClas.value = "temp-mar";
        temp.setAttributeNode(tempClas);
        temp.innerHTML = "Temp :";
        let inpTemp = document.createElement("input");
        let typTemp = document.createAttribute("type");
        typTemp.value = "number";
        inpTemp.setAttributeNode(typTemp);
        inpTemp.value = 1;
        let faren = document.createElement("span");
        faren.innerHTML = "F";

        let divFC = document.createElement("div");
        let clasFC = document.createAttribute("class");
        clasFC.value = "new-radio-rate-cntr fc-radio";
        divFC.setAttributeNode(clasFC);
        let divF = document.createElement("div");
        let inputF = document.createElement("input");
        let typeF = document.createAttribute("type");
        typeF.value = "radio";
        inputF.setAttributeNode(typeF);
        let nameF = document.createAttribute("name");
        nameF.value = "fc" + i;
        inputF.setAttributeNode(nameF);
        let idF = document.createAttribute("id");
        idF.value = "f" + i;
        inputF.setAttributeNode(idF);
        let labelF = document.createElement("label");
        let forF = document.createAttribute("for");
        forF.value = "f" + i;
        labelF.innerHTML = "F";
        labelF.setAttributeNode(forF);
        divF.appendChild(inputF);
        divF.appendChild(labelF);
        divFC.appendChild(divF);
        let divC = document.createElement("div");
        let inputC = document.createElement("input");
        let typeC = document.createAttribute("type");
        typeC.value = "radio";
        inputC.setAttributeNode(typeC);
        let nameC = document.createAttribute("name");
        nameC.value = "fc" + i;
        inputC.setAttributeNode(nameC);
        let idC = document.createAttribute("id");
        idC.value = "c" + i;
        inputC.setAttributeNode(idC);
        let labelC = document.createElement("label");
        let forC = document.createAttribute("for");
        forC.value = "c" + i;
        labelC.innerHTML = "C";
        labelC.setAttributeNode(forC);
        divC.appendChild(inputC);
        divC.appendChild(labelC);
        divFC.appendChild(divC);

        let cross = document.createElement("i");
        let crsCls = document.createAttribute("class");
        crsCls.value = "fa fa-times";
        cross.setAttributeNode(crsCls);

        div.appendChild(cont);
        div.appendChild(into);
        // div.appendChild(quan);
        div.appendChild(inpNum);
        div.appendChild(temp);
        div.appendChild(inpTemp);
        div.appendChild(divFC); // faren
        div.appendChild(cross);
        document.getElementById("specEquipAppend").appendChild(div);
      }
    } else {
      var elmnt = document.getElementsByName("spequType");
      if (elmnt != null && elmnt != "undefined") {
        elmnt[0].remove();
      }
      this.setState({ spEqtSelect: [] });
    }

    debugger;
  };

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, ""]
    }));
  }
  addClickSpecial() {
    this.setState(prevState => ({
      values1: [...prevState.values1, ""]
    }));
  }

  createUI() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];

    return this.state.values.map((el, index) => {
      return (
        <div className="equip-plus-cntr">
          <Select
            className="rate-dropdown"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={this.equipChange}
          />
          <div className="spe-equ">
            <input type="text" placeholder="Quantity" />
          </div>
          <i
            className="fa fa-minus equip-plus"
            id={"remove" + (index + 1)}
            onClick={this.removeClick.bind(this, index)}
          ></i>
        </div>
      );
    });
  }
  createUISpecial() {
    const optionsSpeEqu = [
      { value: "Refer Type", label: "Refer Type" },
      { value: "abc", label: "abc" },
      { value: "def", label: "def" }
    ];
    return this.state.values1.map((el, index) => {
      return (
        <div className="equip-plus-cntr">
          <Select
            className="rate-dropdown"
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={optionsSpeEqu}
            placeholder="Select Kind of Special Equipment"
          />
          <div className="spe-equ">
            <input type="text" placeholder="Quantity" />
            <input type="text" placeholder="Temp" />
          </div>
          <i
            className="fa fa-minus equip-plus"
            id={"remove" + (index + 1)}
            onClick={this.removeClickSpecial.bind(this, index)}
          ></i>
        </div>
      );
    });
  }

  removeClick(i) {
    debugger;
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }
  removeClickSpecial(i) {
    debugger;
    let values1 = [...this.state.values1];
    values1.splice(i, 1);
    this.setState({ values1 });
  }

  render() {
    let self = this;

    const optionsSpeEqu = [
      { value: "Refer Type", label: "Refer Type" },
      { value: "abc", label: "abc" },
      { value: "def", label: "def" }
    ];
    const optionsPOL = [
      { value: "10.5736", label: "10.5736" },
      { value: "20.6987", label: "20.6987" },
      { value: "30.0369", label: "30.0369" }
    ];
    const optionsPOD = [
      { value: "35.5736", label: "35.5736" },
      { value: "69.6987", label: "69.6987" },
      { value: "60.0369", label: "60.0369" }
    ];
    let unStack = "";
    if (
      this.state.containerLoadType === "ltl" ||
      this.state.containerLoadType === "lcl" ||
      this.state.containerLoadType === "air"
    ) {
      unStack = (
        <>
          <input id="unstack" type="checkbox" name={"haz-mat"} />
          <label htmlFor="unstack">Unstackable</label>
        </>
      );
    }

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div>
              <div className="new-rate-cntr" id="shipmentType">
                <div className="rate-title-cntr">
                  <h3>Shipment Type</h3>
                  <div className="iconSelection" id="shipmentTypeIconCntr">
                    <p className="side-selection" id="shipmentTypeName">
                      {this.state.shipmentType}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="shipmentTypePlusClick"
                      onClick={this.shipmentTypePlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="shipmentTypeMinusClick"
                      onClick={this.shipmentTypeMinusClick}
                    ></i>
                  </div>
                </div>
                <div
                  className="new-radio-rate-cntr radio-blue"
                  id="shipmentTypeInner"
                >
                  <div>
                    <input
                      type="radio"
                      name="ship-type"
                      value="Export"
                      onClick={this.ShipmentTypeClick}
                      id="export"
                    />
                    <label htmlFor="export">Export</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="ship-type"
                      value="Import"
                      id="import"
                      onClick={this.ShipmentTypeClick}
                    />
                    <label htmlFor="import">Import</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="ship-type"
                      value="Cross Trade"
                      onClick={this.ShipmentTypeClick}
                      id="cross"
                    />
                    <label htmlFor="cross">Cross Trade</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="ship-type"
                      value="Domestic"
                      onClick={this.ShipmentTypeClick}
                      id="domestic"
                    />
                    <label htmlFor="domestic">Domestic</label>
                  </div>
                </div>
              </div>
              <div className="new-rate-cntr" id="modeTransport">
                <div className="rate-title-cntr">
                  <h3>Mode of Transport</h3>
                  <div className="iconSelection" id="modeTransIconCntr">
                    <p className="side-selection" id="modeTransName">
                      {this.state.modeoftransport}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="modeTransPlusClick"
                      onClick={this.modeTransPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="modeTransMinusClick"
                      onClick={this.modeTransMinusClick}
                    ></i>
                  </div>
                </div>
                <div
                  className="new-radio-rate-cntr  radio-green"
                  id="modeTransInner"
                >
                  <div>
                    <input
                      type="radio"
                      name="mode-transport"
                      value="SEA"
                      onClick={this.modeofTransportClick}
                      id="sea"
                    />
                    <label htmlFor="sea">Sea</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="mode-transport"
                      value="AIR"
                      onClick={this.modeofTransportClick}
                      id="air"
                    />
                    <label htmlFor="air">Air</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="mode-transport"
                      name="mode-transport"
                      value="ROAD"
                      onClick={this.modeofTransportClick}
                      id="road"
                    />
                    <label htmlFor="road">Road</label>
                  </div>
                </div>
              </div>
              <div className="new-rate-cntr" id="containerLoad">
                <div className="rate-title-cntr">
                  <h3>Container Load</h3>
                  <div className="iconSelection" id="cntrLoadIconCntr">
                    <p className="side-selection" id="cntrLoadName">
                      {this.state.containerLoadType}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="cntrLoadPlusClick"
                      onClick={this.cntrLoadPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="cntrLoadMinusClick"
                      onClick={this.cntrLoadMinusClick}
                    ></i>
                  </div>
                </div>
                <div id="cntrLoadInner">
                  <div
                    id="dvsea"
                    className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-sea radio-light-blue"
                  >
                    <div>
                      <input
                        type="radio"
                        name="cntr-load"
                        value="FCL"
                        onClick={this.ContainerLoadTypeClick}
                        id="fcl"
                      />
                      <label htmlFor="fcl">FCL</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="LCL"
                        onClick={this.ContainerLoadTypeClick}
                        name="cntr-load"
                        id="lcl"
                      />
                      <label htmlFor="lcl">LCL</label>
                    </div>
                  </div>
                  <div
                    id="dvair"
                    className="new-radio-rate-cntr cls-air radio-light-blue"
                  >
                    <div>
                      <input
                        type="radio"
                        name="cntr-load-air"
                        value="AIR"
                        onClick={this.ContainerLoadTypeClick}
                        id="Air"
                      />
                      <label htmlFor="Air">AIR</label>
                    </div>
                  </div>
                  <div
                    id="dvroad"
                    className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-road radio-light-blue"
                  >
                    <div>
                      <input
                        type="radio"
                        name="cntr-load-road"
                        value="FTL"
                        onClick={this.ContainerLoadTypeClick}
                        id="ftl"
                      />
                      <label htmlFor="ftl">FTL</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="LTL"
                        onClick={this.ContainerLoadTypeClick}
                        name="cntr-load-road"
                        id="ltl"
                      />
                      <label htmlFor="ltl">LTL</label>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.containerLoadType != "FCL" ? (
                <>
                  <div className="new-rate-cntr" id="cbm">
                    <div className="rate-title-cntr">
                      <h3>CBM / Dimensions</h3>
                      <div className="iconSelection" id="cbmIconCntr">
                        <p className="side-selection" id="cbmName">
                          {/* {this.state.modeoftransport} */}
                        </p>
                        <i
                          className="fa fa-plus"
                          id="cbmPlusClick"
                          onClick={this.cbmPlusClick}
                        ></i>
                        <i
                          className="fa fa-minus d-none"
                          id="cbmMinusClick"
                          onClick={this.cbmMinusClick}
                        ></i>
                      </div>
                    </div>
                    <div id="cbmInner">
                      <div className="row">
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder="Length (cm)"
                              className="w-100"
                              name="length"
                              onBlur={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder="Width (cm)"
                              className="w-100"
                              name="width"
                              onBlur={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder="Height (cm)"
                              className="w-100"
                              name="height"
                              onBlur={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder="Quantity"
                              className="w-100"
                              name="qnty"
                              onKeyDown={this.cbmChange}
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder="Gross Weight"
                              className="w-100"
                            />
                          </div>
                        </div>
                        <div className="col-md">
                          <div className="spe-equ">
                            <input
                              type="text"
                              placeholder={
                                this.state.modeoftransport != "AIR"
                                  ? "CBM"
                                  : "KG"
                              }
                              className="w-100"
                              value={this.state.cbmVal}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="remember-forgot flex-column rate-checkbox justify-content-center">
                        <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                        <label htmlFor="haz-mat">HazMat</label>
                        {/* <input id="unstack" type="checkbox" name={"haz-mat"} />
                        <label htmlFor="unstack">Unstackable</label> */}
                        {unStack}
                        <input
                          id="cust-clear"
                          type="checkbox"
                          name={"haz-mat"}
                          onChange={this.HandleGetIncoTerms.bind(this)}
                        />
                        <label htmlFor="cust-clear">Custom Clearance</label>
                      </div>
                      <div className="spe-equ justify-content-center">
                        <label>Inco Terms :</label>
                        <input
                          type="text"
                          placeholder="Inco Terms"
                          className="w-50"
                          disabled
                          name="incoTerms"
                          value={self.state.incoTerms}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {this.state.containerLoadType == "FCL" ? (
                <div className="new-rate-cntr" id="equipType">
                  <div className="rate-title-cntr">
                    <h3>Equipment Types</h3>
                    <div className="iconSelection" id="equipTypeIconCntr">
                      <p className="side-selection" id="equipTypeName">
                        {/* {this.state.modeoftransport} */}
                      </p>
                      <i
                        className="fa fa-plus"
                        id="equipTypePlusClick"
                        onClick={this.equipTypePlusClick}
                      ></i>
                      <i
                        className="fa fa-minus d-none"
                        id="equipTypeMinusClick"
                        onClick={this.equipTypeMinusClick}
                      ></i>
                    </div>
                  </div>
                  <div id="equipTypeInner">
                    <div className="equip-plus-cntr mt-0">
                      <Select
                        className="rate-dropdown"
                        getOptionLabel={option => option.StandardContainerCode}
                        getOptionValue={option => option.StandardContainerCode}
                        isMulti
                        options={self.state.StandardContainerCode}
                        onChange={this.equipChange.bind(this)}
                        value={self.state.selected}
                        showNewOptionAtTop={false}
                      />

                      {/* <div className="spe-equ">
                      <input
                        type="text"
                        onChange={this.quantityChange}
                        placeholder="Quantity"
                      />
                    </div> */}
                      {/* <i
                      className="fa fa-plus equip-plus"
                      onClick={this.addClick.bind(this)}
                    ></i> */}
                    </div>

                    <div id="equipAppend"></div>
                    <div className="remember-forgot flex-column rate-checkbox justify-content-center">
                      <input
                        id="Special-equType"
                        type="checkbox"
                        name={"Special-equType"}
                        onChange={this.HandleSpecialEqtCheck.bind(this)}
                      />
                      <label htmlFor="Special-equType">Special Equipment</label>
                    </div>
                    {this.createUI()}
                    {/* <div className="remember-forgot">
                    <input
                      id="spe-equip"
                      type="checkbox"
                      name={"special equipment"}
                    />
                    <label htmlFor="spe-equip" className="m-auto">
                      Special Equipment
                    </label>
                  </div> */}
                    <div className="spe-equ mt-0">
                      <div className="equip-plus-cntr">
                        <Select
                          isDisabled={self.state.isSpacialEqt}
                          className="rate-dropdown"
                          getOptionLabel={option => option.SpecialContainerCode}
                          isMulti
                          getOptionValue={option => option.SpecialContainerCode}
                          components={animatedComponents}
                          options={self.state.SpacialEqmt}
                          placeholder="Select Kind of Special Equipment"
                          onChange={this.specEquipChange}
                          value={self.state.spEqtSelect}
                          showNewOptionAtTop={false}
                        />
                      </div>
                    </div>
                    <div id="specEquipAppend"></div>
                    {this.createUISpecial()}

                    <div className="remember-forgot flex-column rate-checkbox justify-content-center">
                      <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                      <label htmlFor="haz-mat">HazMat</label>
                      {/* <input id="unstack" type="checkbox" name={"haz-mat"} />
                      <label htmlFor="unstack">Unstackable</label> */}
                      {this.unStack}
                      <input
                        id="cust-clear"
                        type="checkbox"
                        name={"haz-mat"}
                        onChange={this.HandleGetIncoTerms.bind(this)}
                      />
                      <label htmlFor="cust-clear">Custom Clearance</label>
                    </div>
                    <div className="spe-equ justify-content-center">
                      <label>Inco Terms :</label>
                      <input
                        type="text"
                        placeholder="Inco Terms"
                        className="w-50"
                        disabled
                        name="incoTerms"
                        value={self.state.incoTerms}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="new-rate-cntr" id="typeMove">
                <div className="rate-title-cntr">
                  <h3>Type of Move</h3>
                  <div className="iconSelection" id="typeMoveIconCntr">
                    <p className="side-selection" id="typeMoveName">
                      {this.state.typesofMove}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="typeMovePlusClick"
                      onClick={this.typeMovePlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="typeMoveMinusClick"
                      onClick={this.typeMoveMinusClick}
                    ></i>
                  </div>
                </div>
                <div
                  className="new-radio-rate-cntr radio-blue"
                  id="typeMoveInner"
                >
                  <div>
                    <input
                      type="radio"
                      name="type-move"
                      id="p2p"
                      onChange={this.HandleTypeofMove}
                    />
                    <label htmlFor="p2p">Port2Port</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="type-move"
                      id="d2p"
                      onChange={this.HandleTypeofMove}
                    />
                    <label htmlFor="d2p">Door2Port</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="type-move"
                      id="d2d"
                      onChange={this.HandleTypeofMove}
                    />
                    <label htmlFor="d2d">Door2Door</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="type-move"
                      id="p2d"
                      onChange={this.HandleTypeofMove}
                    />
                    <label htmlFor="p2d">Port2Door</label>
                  </div>
                </div>
              </div>

              {this.state.typesofMove == "p2p" ? null : (
                <div className="new-rate-cntr" id="address">
                  <div className="rate-title-cntr">
                    <h3>Enter Addresses</h3>
                    <div className="iconSelection" id="addressIconCntr">
                      <p className="side-selection" id="addressName">
                        {/* {this.state.typesofMove} */}
                      </p>
                      <i
                        className="fa fa-plus"
                        id="addressPlusClick"
                        onClick={this.addressPlusClick}
                      ></i>
                      <i
                        className="fa fa-minus d-none"
                        id="addressMinusClick"
                        onClick={this.addressMinusClick}
                      ></i>
                    </div>
                  </div>
                  <div className="row justify-content-center" id="addressInner">
                    {this.state.typesofMove == "p2p" ? null : this.state
                        .typesofMove == "d2p" ? (
                      <>
                        <div className="col-md-6">
                          <div className="spe-equ">
                            <input className="w-100" type="text" />
                          </div>
                          <textarea
                            className="rate-address"
                            placeholder="Enter PU Address"
                            onChange={this.addressChange}
                            name="puAdd"
                          ></textarea>
                        </div>
                      </>
                    ) : this.state.typesofMove == "d2d" ? (
                      <>
                        <div className="col-md-6">
                          <div className="spe-equ">
                            <input className="w-100" type="text" />
                          </div>
                          <textarea
                            className="rate-address"
                            placeholder="Enter PU Address"
                            onChange={this.addressChange}
                            name="puAdd"
                          ></textarea>
                        </div>
                        <div className="col-md-6">
                          <div className="spe-equ">
                            <input className="w-100" type="text" />
                          </div>
                          <textarea
                            className="rate-address"
                            placeholder="Enter Delivery Address"
                            onChange={this.addressChange}
                            name="deliAdd"
                          ></textarea>
                        </div>
                      </>
                    ) : this.state.typesofMove == "p2d" ? (
                      <>
                        <div className="col-md-6">
                          <div className="spe-equ">
                            <input className="w-100" type="text" />
                          </div>
                          <textarea
                            className="rate-address"
                            placeholder="Enter Delivery Address"
                            onChange={this.addressChange}
                            name="deliAdd"
                          ></textarea>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="new-rate-cntr" id="location">
                <div className="rate-title-cntr">
                  <h3>Select Location</h3>
                  <div className="iconSelection" id="locationIconCntr">
                    <p className="side-selection" id="locationName">
                      {/* {this.state.typesofMove} */}
                    </p>
                    <i
                      className="fa fa-plus"
                      id="locationPlusClick"
                      onClick={this.locationPlusClick}
                    ></i>
                    <i
                      className="fa fa-minus d-none"
                      id="locationMinusClick"
                      onClick={this.locationMinusClick}
                    ></i>
                  </div>
                </div>
                <div className="row polpodcls" id="locationInner">
                  <div className="col-md-6 ">
                    {/* <Select
                      className="rate-dropdown w-100 mb-4"
                      getOptionLabel={option => option.CountryName}
                      getOptionValue={option => option.SUCountry}
                      components={animatedComponents}
                      options={self.state.country}
                      placeholder="Select Country"
                      onChange={this.locationChange}
                      name="polCountry"
                      id="yooo"
                    />
                    <Select
                      className="rate-dropdown w-100 mb-4"
                      components={animatedComponents}
                      options={optionsPOD}
                      placeholder="Select POD"
                      // value={this.state.pod}
                      onChange={this.locationChange}
                      name="pol"
                    /> */}
                    <Map1WithAMakredInfoWindow
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={
                        <div
                          style={{
                            height: `200px`
                            // width: `50%`,
                            // marginLeft: `auto`
                          }}
                        />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                    />
                    {/* <GoogleMapReactPage
                      google={this.props.google}
                      center={{ lat: 18.5204, lng: 73.8567 }}
                      height="300px"
                      zoom={15}
                    /> */}
                  </div>
                  <div className="col-md-6">
                    {/* <Select
                      className="rate-dropdown w-100 mb-4"
                      closeMenuOnSelect={false}
                      getOptionLabel={option => option.CountryName}
                      getOptionValue={option => option.SUCountry}
                      components={animatedComponents}
                      options={self.state.country}
                      placeholder="Select POL"
                      onChange={this.locationChange}
                      // value={this.state.pol}
                      name="podCountry"
                    />
                    <Select
                      className="rate-dropdown w-100 mb-4"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={optionsPOD}
                      placeholder="Select POD"
                      // value={this.state.pod}
                      onChange={this.locationChange}
                      name="pod"
                    /> */}
                    <Map2WithAMakredInfoWindow
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={
                        <div style={{ height: `200px` /*width: `50%`*/ }} />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center new-rate-cntr p-0 border-0">
                <a href="rate-table" className="butn blue-butn rate-search">
                  Search
                </a>
              </div>
            </div>
          </div>
        </div>
        <Modal
          className="amnt-popup"
          isOpen={this.state.modalPuAdd}
          toggle={this.togglePuAdd}
          centered={true}
        >
          <ModalBody>
            <div className="txt-cntr">
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Street</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <textarea className="rate-address"></textarea>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Country</p>
                <div className="spe-equ d-block m-0 flex-grow-1 login-fields">
                  <select>
                    <option>bkj</option>
                    <option>bkj</option>
                    <option>bkj</option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Consignee Name</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
                </div>
              </div>

              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Notification Person</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Email Id</p>
                <div className="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" className="w-100" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button className="butn" onClick={this.togglePuAdd}>
                Create
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default NewRateSearch;

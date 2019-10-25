import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { de } from "date-fns/esm/locale";

const animatedComponents = makeAnimated();

class NewRateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipmentType:'',
      modeoftransport:'',
      containerLoadType:'',
      equipmentType:'',
      isSpecialEquipment:'0',
      specialEquipment:'',
      tempratureEquipment:'',
      isHazMat:'',
      incoTerms:'',
      typesofMove:'',
      POL:'',
      POD:'',
      PUAddress:'',
      PDAddress:''
    };
  }
  
  ShipmentTypeClick=(e)=>{
   let type=e.target.value;
   this.setState({shipmentType:type});
  }
  modeofTransportClick=(e)=>{
    debugger;
    let type=e.target.value;
    debugger;
    this.setState({modeoftransport:type});
    document.getElementById("dvroad").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvair").classList.add("new-radio-rate-cntr-hide");
    document.getElementById("dvsea").classList.add("new-radio-rate-cntr-hide");
    if(type=="air")
    {
      document.getElementById("dvair").classList.remove("new-radio-rate-cntr-hide");
    }
    else if(type=="sea")
    {
      document.getElementById("dvsea").classList.remove("new-radio-rate-cntr-hide");
    }
    else if(type=="road")
    {
      document.getElementById("dvroad").classList.remove("new-radio-rate-cntr-hide");
    }
   }
   ContainerLoadTypeClick=(e)=>{
    let type=e.target.value;
    this.setState({containerLoadType:type});
   }

  render() {
    const options = [
      { value: "20 DC", label: "20 DC" },
      { value: "30 DC", label: "30 DC" },
      { value: "40 DC", label: "40 DC" },
      { value: "50 DC", label: "50 DC" }
    ];
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
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="new-rate-cntr">
              <h3>Shipment Type</h3>
              <div className="new-radio-rate-cntr radio-blue">
                <div>
                  <input type="radio" name="ship-type" value="export" onClick={this.ShipmentTypeClick} id="export" />
                  <label htmlFor="export">Export</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="ship-type"
                    id="import"
                    defaultChecked
                  />
                  <label htmlFor="import">Import</label>
                </div>
                <div>
                  <input type="radio" name="ship-type" value="cross" onClick={this.ShipmentTypeClick} id="cross" />
                  <label htmlFor="cross">Cross Trade</label>
                </div>
                <div>
                  <input type="radio" name="ship-type" value="domestic" onClick={this.ShipmentTypeClick} id="domestic" />
                  <label htmlFor="domestic">Domestic</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Mode of Transport</h3>
              <div className="new-radio-rate-cntr  radio-green">
                <div>
                  <input type="radio" name="mode-transport" value="sea" onClick={this.modeofTransportClick} id="sea" />
                  <label htmlFor="sea">Sea</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="mode-transport"
                    value="air" onClick={this.modeofTransportClick} 
                    id="air"
                    defaultChecked
                  />
                  <label htmlFor="air">Air</label>
                </div>
                <div>
                  <input type="radio" name="mode-transport" name="mode-transport"
                    value="road" onClick={this.modeofTransportClick}  id="road" />
                  <label htmlFor="road">Road</label>
                </div>
              </div>
            </div>

            <div className="new-rate-cntr">
              <h3>Container Load</h3>
              <div id="dvsea" className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-sea radio-light-blue">
                <div>
                  <input
                    type="radio"
                    name="cntr-load"
                    value="fcl"
                    onClick={this.ContainerLoadTypeClick}
                    id="fcl"
                    defaultChecked
                  />
                  <label htmlFor="fcl">FCL</label>
                </div>
                <div>
                  <input type="radio" value="lcl"  onClick={this.ContainerLoadTypeClick} name="cntr-load" id="lcl" />
                  <label htmlFor="lcl">LCL</label>
                </div>
              </div>
              <div id="dvair" className="new-radio-rate-cntr cls-air radio-light-blue">
                <div>
                  <input
                    type="radio"
                    name="cntr-load-air"
                    value="air"
                    onClick={this.ContainerLoadTypeClick}
                    id="fcl"
                    defaultChecked
                  />
                  <label htmlFor="fcl">AIR</label>
                </div>              
              </div>
              <div id="dvroad" className="new-radio-rate-cntr new-radio-rate-cntr-hide cls-road radio-light-blue">
                <div>
                  <input
                    type="radio"
                    name="cntr-load-road"
                    value="ftl"
                    onClick={this.ContainerLoadTypeClick}
                    id="fcl"
                    defaultChecked
                  />
                  <label htmlFor="fcl">FTL</label>
                </div>
                <div>
                  <input type="radio" value="ltl"  onClick={this.ContainerLoadTypeClick} name="cntr-load-road" id="lcl" />
                  <label htmlFor="lcl">LTL</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>CBM / Dimensions</h3>
              <div className="row">
                <div className="col-md-3">
                  <div className="spe-equ">
                    <input
                      type="text"
                      placeholder="Enter Length"
                      className="w-100"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="spe-equ">
                    <input
                      type="text"
                      placeholder="Enter Width"
                      className="w-100"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="spe-equ">
                    <input
                      type="text"
                      placeholder="Enter Height"
                      className="w-100"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="spe-equ">
                    <input
                      type="text"
                      placeholder="CBM"
                      className="w-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="new-rate-cntr">
              <h3>Equipment Types</h3>
              <Select
                className="rate-dropdown"
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={options}
              />
              <div className="remember-forgot">
                <input
                  id="spe-equip"
                  type="checkbox"
                  name={"special equipment"}
                />
                <label htmlFor="spe-equip" className="m-auto">
                  Special Equipment
                </label>
              </div>
              <div className="spe-equ">
                {/* <label>Kind of Special Equipment</label> */}
                <Select
                  className="rate-dropdown m-auto"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={optionsSpeEqu}
                  placeholder="Select Kind of Special Equipment"
                />
              </div>
              <div className="spe-equ">
                {/* <label>Temperature of Equipment</label> */}
                <input
                  type="text"
                  className="m-auto w-50"
                  placeholder="Enter Temperature of Equipment"
                />
              </div>
              <div className="remember-forgot">
                <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                <label htmlFor="haz-mat" className="m-auto">
                  HazMat
                </label>
                <input id="haz-mat" type="checkbox" name={"haz-mat"} />
                <label htmlFor="haz-mat" className="m-auto">
                  Unstackable
                </label>
              </div>
              {/* <div className="new-radio-rate-cntr radio-brown">
                <div>
                  <input type="checkbox" name="dimensions" id="dc-20" />
                  <label htmlFor="dc-20">20 DC</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="dimensions"
                    id="dc-30"
                    defaultChecked
                  />
                  <label htmlFor="dc-30">30 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-40" />
                  <label htmlFor="dc-40">40 DC</label>
                </div>
                <div>
                  <input type="checkbox" name="dimensions" id="dc-50" />
                  <label htmlFor="dc-50">50 DC</label>
                </div>
              </div> */}
            </div>
            <div className="new-rate-cntr">
              <h3>Inco Terms</h3>
              <div className="spe-equ">
                <input
                  type="text"
                  placeholder="Inco Terms"
                  className="m-auto w-50"
                />
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Type of Move</h3>
              <div className="new-radio-rate-cntr radio-blue">
                <div>
                  <input type="radio" name="type-move" id="p2p" />
                  <label htmlFor="p2p">Port2Port</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="type-move"
                    id="d2p"
                    defaultChecked
                  />
                  <label htmlFor="d2p">Door2Port</label>
                </div>
                <div>
                  <input type="radio" name="type-move" id="d2d" />
                  <label htmlFor="d2d">Door2Door</label>
                </div>
                <div>
                  <input type="radio" name="type-move" id="p2d" />
                  <label htmlFor="p2d">Port2Door</label>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Enter Addresses</h3>
              <div className="row">
                <div className="col-md-6">
                  <textarea
                    className="rate-address"
                    placeholder="Enter PU Address"
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <textarea
                    className="rate-address"
                    placeholder="Enter Delivery Address"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Countries</h3>
              <div className="spe-equ">
                {/* <label>Kind of Special Equipment</label> */}
                <Select
                  className="rate-dropdown m-auto"
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={optionsSpeEqu}
                  placeholder="Select Country"
                />
              </div>
            </div>
            <div className="new-rate-cntr">
              <h3>Select Location</h3>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    className="rate-dropdown w-100"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsPOL}
                    placeholder="Select POL"
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    className="rate-dropdown w-100"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={optionsPOD}
                    placeholder="Select POD"
                  />
                </div>
              </div>
            </div>
           
            <div className="text-center">
              <a href="rate-table" className="butn blue-butn rate-search">
                Search
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewRateSearch;

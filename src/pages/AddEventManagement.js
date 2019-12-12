import React, { Component } from "react";
import appSettings from "../helpers/appSetting";
// import Logo from "./../assets/img/logo.png";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import { is } from "@babel/types";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class AddEventManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      selectStatus: [
        { key: "SELECTED", value: "SELECTED" },
        { key: "RED", value: "RED" },
        { key: "YELLOW", value: "YELLOW" },
        { key: "GREEN", value: "GREEN" }
      ],
      disabled: false,
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    debugger
    // const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    var ActionModes = 0;
    if (this.props.location.state == undefined) {
      ActionModes = 1;
    }
    // docData.append("ContainerNo",this.state.fields["ContainerNo"]);
    // docData.append("Status",this.state.fields["Status"]);
    // docData.append("Differenceindays",this.state.fields["DiffInDays"]);
    // docData.append("PTTP",this.state.fields["PTTP"]);
    // docData.append("ActionModes",ActionModes)
    // docData.append("UserID",userid)
    if (this.handleValidation()) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SaveEventManagementData`,
        data: {
          ContainerNo: this.state.fields["ContainerNo"],
          Status: this.state.fields["Status"],
          Differenceindays: this.state.fields["DiffInDays"],
          PTTP: this.state.fields["PTTP"],
          ActionModes: ActionModes,
          UserID: userid
        },
        headers: authHeader()
      })
        .then(function(response) {
          debugger;
          NotificationManager.success(response.data[0].Column1);
          window.location.href = "event-management";
          //    setTimeout(function(){ window.location.href="/add-event" }, 1000);
        })
        .catch(error => {
          //   alert(error.response.data.split("'")[1]);
          console.log(error.response);
        });
    }
  }

  componentDidMount() {
    debugger;
    if (this.props.location.state != undefined) {
      var data = this.props.location.state.detail;
      let fields = this.state.fields;
      fields["ContainerNo"] = data.ContainerNo;
      fields["Status"] = data.EventmanagementStatus;
      fields["DiffInDays"] = data.EventmanagementDayStatus;
      fields["PTTP"] = data.AvgTransitDays_PTTP;
      fields["POL"] = data.POL;
      fields["POD"] = data.POD;
      fields["Shipper/Consignee"] = data.Shipper_Consignee;
      this.state.disabled = true;
      this.setState({ fields, disabled: this.state.disabled });
    }
  }

  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    if (e.target.value == "SELECTED") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields
    });
  }

  handlechange(field, e) {
    debugger;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
  }

  handleValidation() {
    debugger;
    let fields = this.state.fields;
    let errors = this.state.errors;
    let formIsValid = true;

    if (!fields["ContainerNo"]) {
      formIsValid = false;
      errors["ContainerNo"] = "Enter Container No";
    }

    if (!fields["Status"]) {
      formIsValid = false;
      errors["Status"] = "Select Status";
    }
    if (!fields["DiffInDays"]) {
      formIsValid = false;
      errors["DiffInDays"] = "Enter delay diffrence in days";
    }
    if (!fields["PTTP"]) {
      formIsValid = false;
      errors["PTTP"] = "enter PTTP details";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleBlurContNo(field, e) {
    let self = this;
    let IsExists = false;
    let errors = this.state.errors;
    let fields = this.state.fields;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindEventManagementData`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        ContainerNo: this.state.fields["ContainerNo"]
      },

      headers: authHeader()
    }).then(function(response) {
      debugger;
      IsExists = true;
      fields["ContainerNo"] = response.data[0].ContainerNo;
      fields["Status"] = response.data[0].EventmanagementStatus;
      fields["DiffInDays"] = response.data[0].EventmanagementDayStatus;
      fields["PTTP"] = response.data[0].AvgTransitDays_PTTP;
      fields["POL"] = response.data[0].POL;
      fields["POD"] = response.data[0].POD;
      fields["Shipper/Consignee"] = response.data[0].Shipper_Consignee;
      errors["ContainerNo"] = "Container entry already exists";
      self.setState({ errors: errors });
    });

    return IsExists;
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <AdminSideMenu />
          </div>
          <div className="cls-rt">
            <div class="title-sect title-border">
              <h2>Manage Event</h2>
            </div>
            <div className="container add-user-cntr">
              <div className="row mt-3">
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>Container No</label>
                  <input
                    type="text"
                    name={"ContainerNo"}
                    onChange={this.handlechange.bind(this, "ContainerNo")}
                    placeholder="Container No"
                    value={this.state.fields["ContainerNo"]}
                    // disabled={this.state.disabled}
                    onBlur={this.handleBlurContNo.bind(this, "username")}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.errors["ContainerNo"]}
                  </span>
                </div>
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>Status</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this, "Status")}
                    name={"Status"}
                    value={this.state.fields["Status"]}
                  >
                    {this.state.selectStatus.map(team => (
                      <option key={team.key} value={team.key}>
                        {team.value}
                      </option>
                    ))}
                  </select>
                  <span style={{ color: "red" }}>
                    {this.state.errors["Status"]}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>Diff</label>
                  <input
                    type="text"
                    name={"DiffInDays"}
                    onChange={this.handlechange.bind(this, "DiffInDays")}
                    placeholder="Diff in days"
                    value={this.state.fields["DiffInDays"]}
                    //onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.errors["DiffInDays"]}
                  </span>
                </div>
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>PTTP</label>
                  <input
                    type="text"
                    name={"PTTP"}
                    onChange={this.handlechange.bind(this, "PTTP")}
                    placeholder="PTTP"
                    value={this.state.fields["PTTP"]}
                    //onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  <span style={{ color: "red" }}>
                    {this.state.errors["PTTP"]}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>POL</label>
                  <input
                    type="text"
                    name={"POL"}
                    // onChange={this.handlechange.bind(this, "POL")}
                    placeholder="POL"
                    value={this.state.fields["POL"]}
                    disabled="true"
                    //onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  {/* <span style={{color: "red"}}>{this.state.errors["username"]}</span> */}
                </div>
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>POD</label>
                  <input
                    type="text"
                    name={"POD"}
                    // onChange={this.handlechange.bind(this, "POD")}
                    placeholder="POD"
                    value={this.state.fields["POD"]}
                    disabled="true"
                    //onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  {/* <span style={{color: "red"}}>{this.state.errors["username"]}</span> */}
                </div>
              </div>
              <div className="row">
                <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4">
                  <label>Shipper/Consignee</label>
                  <input
                    type="text"
                    name={"Shipper/Consignee"}
                    //onChange={this.handlechange.bind(this, "username")}
                    placeholder="Shipper/Consignee"
                    value={this.state.fields["Shipper/Consignee"]}
                    disabled="true"
                    //onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  {/* <span style={{color: "red"}}>{this.state.errors["username"]}</span> */}
                </div>
              </div>
              <div className="text-center pb-4">
                <button
                  type="button"
                  className="butn my-2"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default AddEventManagement;

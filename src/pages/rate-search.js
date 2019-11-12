import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import Headers from "../component/header";
import ExistCust from "./../assets/img/exist-cust.png";
import NewCust from "./../assets/img/new-cust.png";
import SideMenu from "../component/sidemenu";
import Autocomplete from "react-autocomplete";

class RateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      IsSearchRate: false,
      customerData: [],
      customerName: "",
      customerType: true,
      companyId:0,
      menuStyle: {
        textAlign: "left",
        borderRadius: "3px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "2px 0 0 10px",
        fontSize: "90%",
        position: "fixed",
        overflow: "auto",
        zIndex: "1",
        maxWidth: "300px",
        maxHeight: "50%" // TODO: don't cheat, let it flow to the bottom
      },
      fields: {}
    };
    this.HandleRadioBtn = this.HandleRadioBtn.bind(this);
  }

  componentDidMount() {
    // document.getElementById("SearchRate").classList.add("disableRates");

    document.getElementById("SearchRate").classList.add("disableRates");
  }

  HandelPageredireact() {
    this.props.history.push({
      pathname: "new-rate-search",
      state: { companyId: this.state.companyId }
    });
  }
  HandleChangeCon(field, e) {
    debugger;
    let self = this;
    var customertxtlen = e.target.value;
    if (customertxtlen == "") {
      document.getElementById("SearchRate").classList.add("disableRates");
    }

    let fields = this.state.fields;
    fields[field] = e.target.value;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CustomerList`,
      data: {
        CustomerName: e.target.value,
        CustomerType: "Existing"
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      if (field == "CustomerList") {
        self.setState({
          customerData: response.data.Table,
          fields
        });
      } else {
        self.setState({
          customerData: response.data.Table,
          fields
        });
      }
    });
  }
  HandleChangeSelect(field, e) {
    debugger;
    let fields = this.state.fields;
    if (e.target.value == "Select") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields
    });
  }
  handleSelectCon(field, value,e) {
    debugger;
    let fields = this.state.fields;
    fields[field] = value;
    var compId=e.Company_ID;
    this.setState({
      fields,companyId:compId
    });
    document.getElementById("SearchRate").classList.remove("disableRates");
  }

  EnableRates = e => {
    debugger;
    this.HandleCustomerList(e);
    if (e.target.value == "") {
      document.getElementById("SearchRate").classList.add("disableRates");
    } else {
      document.getElementById("SearchRate").classList.remove("disableRates");
    }
  };
  HandleRadioBtn(e) {
    debugger;
    var cType = e.target.value;
    if (cType == "Existing Customer") {
      document.getElementById("SearchRate").classList.add("disableRates");
      this.setState({ customerType: true, fields: {} });
    } else {
      document.getElementById("SearchRate").classList.remove("disableRates");
      this.setState({ customerType: false });
    }
  }

  HideSearchText() {
    // document.getElementById("searchtxt").style.display = "none";
    // document.getElementById("SearchRate").classList.remove("disableRates");
  }
  ShowSearchText() {
    // document.getElementById("SearchRate").classList.add("disableRates");
    // document.getElementById("searchtxt").style.display = "block";
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt d-flex align-items-center justify-content-center text-center">
            <div className="rate-search">
              <h2>Rate Search For?</h2>
              <div>
                <div className="rate-radio-cntr">
                  <div>
                    <input
                      type="radio"
                      onClick={this.HandleRadioBtn}
                      name="cust-select"
                      id="exist-cust"
                      value="Existing Customer"
                      defaultChecked
                    />
                    <label
                      className="d-flex flex-column align-items-center"
                      htmlFor="exist-cust"
                    >
                      <img className="cust-img" src={ExistCust} />
                      Existing Customer
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      onClick={this.HandleRadioBtn}
                      name="cust-select"
                      id="new-cust"
                      value="New Customer"
                    />
                    <label
                      className="d-flex flex-column align-items-center"
                      htmlFor="new-cust"
                    >
                      <img className="cust-img" src={NewCust} />
                      New Customer
                    </label>
                  </div>
                </div>
              </div>
              <div className="login-fields mt-5 mb-0">
                {/* <input
                  id="searchtxt"
                  type="text"
                  onChange={this.EnableRates}
                  placeholder="Search Account/Consignee"
                  name="search-rate"
                /> */}
                <div className="autocom">
                  {this.state.customerType == true ? (
                    <Autocomplete
                      id="searchtxt"
                      getItemValue={item => item.Company_Name}
                      items={this.state.customerData}
                      renderItem={(item, isHighlighted) => (
                        <div
                          style={{
                            background: isHighlighted ? "lightgray" : "white"
                          }}
                        >
                          {item.Company_Name}
                        </div>
                      )}
                      value={this.state.fields["Company_Name"]}
                      onChange={this.HandleChangeCon.bind(this, "Company_Name")}
                      menuStyle={this.state.menuStyle}
                      onSelect={this.handleSelectCon.bind(this, "Company_Name")}
                       
                      inputProps={{ placeholder: "Search Account/Consignee" }}
                    />
                  ) : null}
                </div>
              </div>
              <button
         
                id="SearchRate"
                className="butn blue-butn"
                onClick={this.HandelPageredireact.bind(this)}
              >
                Search Rates
              </button>
              {/* <Link id="SearchRate" className="butn blue-butn" to="new-rate-search" params={ {companyId: this.state.companyId }}>Search Rates</Link> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RateSearch;

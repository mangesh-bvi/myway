import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import Headers from "../component/header";
import ExistCust from "./../assets/img/exist-cust.png";
import NewCust from "./../assets/img/new-cust.png";
import SideMenu from "../component/sidemenu";

class RateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      IsSearchRate: false,
      customerData: [],
      customerName: ""
    };
    this.HandleCustomerList = this.HandleCustomerList.bind(this);
  }

  componentDidMount() {
    debugger;
    this.HandleCustomerList();
  }
  HandleCustomerList(e) {
    let self = this;
    var customer_Name = e.target.value;
    debugger;
    if (customer_Name.length >= 3) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerList`,
        data: {
          CustomerName: customer_Name != "" ? customer_Name : "",
          CustomerType: "Existing"
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        var data = [];
        data = response.data.Table;
        if (data != null && data != "") {
          self.setState({ customerData: data });
        }
      });
    }
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

  HideSearchText() {
    document.getElementById("searchtxt").style.display = "none";
    document.getElementById("SearchRate").classList.remove("disableRates");
  }
  ShowSearchText() {
    document.getElementById("SearchRate").classList.add("disableRates");
    document.getElementById("searchtxt").style.display = "block";
  }

  componentDidMount() {
    // document.getElementById("SearchRate").classList.add("disableRates");
    document.getElementById("SearchRate").classList.add("disableRates");
  }
  render() {
    const { IsSearchRate } = this.state;
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
                      onClick={this.ShowSearchText}
                      name="customerName"
                      id="exist-cust"
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
                      onClick={this.HideSearchText}
                      name="cust-select"
                      id="new-cust"
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
                <input
                  id="searchtxt"
                  type="text"
                  onChange={this.EnableRates}
                  placeholder="Search Account/Consignee"
                  name="search-rate"
                />
              </div>
              <a
                href="new-rate-search"
                id="SearchRate"
                className="butn blue-butn"
              >
                Search Rates
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RateSearch;

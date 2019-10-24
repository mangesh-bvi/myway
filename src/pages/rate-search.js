import React, { Component } from "react";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";

class RateSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      IsSearchRate: false
    };
  }
  EnableRates = e => {
    debugger;
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
                      name="cust-select"
                      id="exist-cust"
                      defaultChecked
                    />
                    <label htmlFor="exist-cust">Existing Customer</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      onClick={this.HideSearchText}
                      name="cust-select"
                      id="new-cust"
                    />
                    <label htmlFor="new-cust">New Customer</label>
                  </div>
                </div>
              </div>
              <div className="login-fields mt-5 mb-0">
                <input
                  id="searchtxt"
                  type="text"
                  onChange={this.EnableRates}
                  placeholder="Search Account/Customer"
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

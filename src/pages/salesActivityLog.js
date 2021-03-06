import React, { Component } from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import "../assets/css/react-table.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { encryption } from "../helpers/encryption";
import "font-awesome/css/font-awesome.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import "react-datepicker/dist/react-datepicker.css";

class SalesActivityLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actLog: [],
      gridData: [],
      mapDis: "block",
      filterAll: "",
      filtered: []
    };
    this.HandleListShipmentSummey = this.HandleListShipmentSummey.bind(this);
    this.HandleListSalesActivityLog = this.HandleListSalesActivityLog.bind(
      this
    );
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
  }

  componentDidMount() {
    this.HandleListShipmentSummey();
  }

  onFilteredChange(filtered) {
    
    if (filtered.length > 1 && this.state.filterAll.length) {
      const filterAll = "";
      this.setState({
        filtered: filtered.filter(item => item.id != "all"),
        filterAll
      });
    } else this.setState({ filtered });
  }
  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: "all", value: filterAll }];

    this.setState({ filterAll, filtered });
  }
  ////Handle List Shipment Summey Data
  HandleListShipmentSummey() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesActivityLogdropdown`,
      data: {
        UserId: userid
      },
      headers: authHeader()
    })
      .then(function(response) {
        var actData = [];
        actData = response.data;
        self.setState({ actLog: actData });
        if (actData.length > 0) {
          self.HandleListSalesActivityLog(actData[0].UserId);
        }
      })
      .catch(error => {
        var actData = [];
        actData.push({
          ActivityType: "",
          CreatedDate: "",
          PrivateIP: "",
          PublicIP: "",
          RegCompName: " ",
          UserName: "No Data Found"
        });
        self.setState({ gridData: actData });

        actData = [];
        actData.push({ UserName: "No User", UserId: "" });
        self.setState({ actLog: actData });

        var temperror = error.response.data;
        var err = temperror.split(":");
      });
  }
  HandleListSalesActivityLog(fileruserid) {
    
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SalesActivityLogGrid`,
      data: {
        UserID: 2679,
        // UserID:userid,
        PageNo: 0,
        PageSize: 10,
        MyWayUserID: 0
      },
      headers: authHeader()
    })
      .then(function(response) {
        var actData = [];
        actData = response.data;
        actData = actData.filter(item => item.UserId == fileruserid);
        //
        self.setState({ gridData: actData }); ///problem not working setstat undefined
      })
      .catch(error => {
        var actData = [];
        actData.push({
          ActivityType: "",
          CreatedDate: "",
          PrivateIP: "",
          PublicIP: "",
          RegCompName: " ",
          UserName: "No Data Found"
        });
        self.setState({ gridData: actData });
        var temperror = error.response.data;
        var err = temperror.split(":");
        
      });
  }

  selectLogChange = e => {
    let self = this;

    self.HandleListSalesActivityLog(e.target.value);
  };

  render() {
    const { gridData } = this.state;

    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="title-sect">
              <h2>Activity Log</h2>
              <div className="d-flex align-items-center">
                <div className="login-fields sales-act-dropdown">
                  <select onChange={this.selectLogChange}>
                    {this.state.actLog.map(team => (
                      <option key={team.UserId} value={team.UserId}>
                        {team.UserName}
                      </option>
                    ))}
                  </select>
                </div>
                <a href="#!" className="butn light-blue-butn">
                  Download
                </a>
                <a href="#!" className="butn">
                  Refresh
                </a>
              </div>
            </div>
            <div style={{ display: this.state.mapDis }} className="ag-fresh">
              <ReactTable
                data={gridData}
                noDataText="No Data"
                onFilteredChange={this.onFilteredChange.bind(this)}
                filtered={this.state.filtered}
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value
                }
                columns={[
                  {
                    columns: [
                      {
                        Header: "User Name",
                        accessor: "UserName",
                        sortable: true
                      },
                      {
                        Header: "Company Name",
                        accessor: "RegCompName"
                      },
                      {
                        Header: "Activity Type",
                        accessor: "ActivityType"
                      },
                      {
                        Header: "Private IP",
                        accessor: "PrivateIP"
                      },

                      {
                        Header: "Public IP",
                        accessor: "PublicIP"
                      },
                      {
                        Header: "Activity Date",
                        accessor: "CreatedDate"
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
                    Filter: () => {},
                    getProps: () => {
                      return {
                        // style: { padding: "0px"}
                      };
                    },
                    filterMethod: (filter, rows) => {
                      const result = matchSorter(rows, filter.value, {
                        keys: ["BL/HBL", "Consignee", "ConsigneeID"],
                        threshold: matchSorter.rankings.WORD_STARTS_WITH
                      });

                      return result;
                    },
                    filterAll: true
                  }
                ]}
                className="-striped -highlight"
                defaultPageSize={10}
                minRows={1}
                // getTrProps={this.HandleRowClickEvt}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SalesActivityLog;

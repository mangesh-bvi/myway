import React, { Component } from "react";
import axios from "axios";
import Moment from "react-moment";
import appSettings from "../helpers/appSetting";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import "../styles/custom.css";
import { authHeader } from "../helpers/authHeader";

class MyOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrderList: [],
      dropdownData: [],
      dropdownData1: []
    };

    this.HandleMyOrderListing = this.HandleMyOrderListing.bind(this);
    this.HandleDropDownBind = this.HandleDropDownBind.bind(this);
  }
  componentDidMount() {
    this.HandleDropDownBind();
    this.HandleMyOrderListing();
  }

  HandleDropDownBind() {
    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/Mywayorderdropdown`,
      data: {},
      headers: authHeader()
    }).then(function(response) {
      var orderData = response.data.Table;
      var DropDownData1 = response.data.Table1;
      self.setState({ dropdownData: orderData, dropdownData1: DropDownData1 });
    });
  }

  HandleMyOrderListing() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchMywayOrderGrid`,
      data: {
        Type: 1,
        UserID: 874588,
        GridColumn: 10,
        SearchText: "AQTYPSE193268",
        PageNumber: 1
      },
      headers: authHeader()
    }).then(function(response) {
      var orderData = response.data.Table;

      self.setState({
        myOrderList: orderData
      });
    }).catch()
    {
      var actData = [];
      actData.push({
        
        Ponumber: "No Data Found"
      });
      self.setState({ myOrderList: actData });
    };

    };
  

  MapButn() {
    this.setState({ listDis: "block", mapDis: "none" });
  }
  listButn() {
    this.setState({ listDis: "none", mapDis: "block" });
  }

  render() {
    let optionItems = this.state.dropdownData.map((planet, i) => (
      <option key={planet.ID} value={planet.ID}>
        {planet.Value}
      </option>
    ));
    let optionItems1 = this.state.dropdownData1.map((gid, i) => (
      <option key={gid.ID} value={gid.ID}>
        {gid.GridColumn}
      </option>
    ));

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg myorder">
            <div className="title-sect">
              <h2>My Order</h2>
            </div>
            <div className="row title-sect" style={{ marginLeft: 0 }}>
              <div className="login-fields-1">
                <select className="myorderdropdown">{optionItems}</select>
              </div>
              <div className="login-fields-1">
                <select className="myorderdropdown">{optionItems1}</select>
              </div>

              <div className="d-flex align-items-center">
                <input
                  type="search"
                  value={this.state.filterAll}
                  onChange={this.filterAll}
                  placeholder="Search here"
                />

                <a
                  href="#!"
                  onClick={this.MapButn}
                  style={{ display: this.state.mapDis }}
                  className="butn"
                >
                  Map View
                </a>
              </div>
            </div>
            <div className="view-user-table">
              <ReactTable
                data={this.state.myOrderList}
                minRows={1}
                columns={[
                  {
                    columns: [
                      {
                        Header: "Supplier Name",
                        accessor: "SupplierName",
                        sortable: true
                      },
                      {
                        Header: "Mode",
                        accessor: "TYPE",
                        sortable: true
                      },
                      {
                        Header: "Purchase Order",
                        accessor: "Ponumber",
                        sortable: true
                      },
                      {
                        Header: "Invoice Number",
                        accessor: "InvoiceNumber",
                        sortable: true
                      },
                      {
                        Header: "Part Id",
                        accessor: "PartNo",
                        sortable: true
                      },
                      {
                        Header: "Expected of Arrival",
                        accessor: "ETA",
                        sortable: true
                      }
                    ]
                  }
                ]}
                noDataText=""
                className="-striped -highlight"
                defaultPageSize={10}
                SubComponent={row => {
                  return (
                    <div style={{ padding: "20px 0" }}>
                      <div className="view-user-inner pt-0">
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="view-user-title">Consignee Name:</p>
                              <p className="view-user-desc">
                                {row.original["ConsigneeName"]}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="view-user-title">QTY:</p>
                              <p className="view-user-desc">
                                {row.original["QTY"]}
                              </p>
                            </div>

                            <div className="col-md-6">
                              <p className="view-user-title">Invoice Date:</p>
                              <p className="view-user-desc">
                                <Moment format="DD-MMM-YYYY">
                                  {row.original["InvoiceDate"]}
                                </Moment>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MyOrder;

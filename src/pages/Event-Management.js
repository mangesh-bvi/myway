import React, { Component } from "react";
import "react-table/react-table.css";
import "../styles/custom.css";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import Pencil from "./../assets/img/pencil.png";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";

class EventManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalEdit: false,
      value: 50,
      viewData: []
    };

    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindEventManagementData`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({ viewData: response.data });
    });
  }

  HandleDocumentView(evt, row) {
    debugger;
    var data = row.original;
    this.props.history.push({
      pathname: "Add-Event-Management",
      state: { detail: data, page: "Edit" }
    });
  }

  handleAdd() {
    this.props.history.push({
      pathname: "add-Event-Management",
      state: { detail: false }
    });
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <AdminSideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
            <div className="view-user-table">
              <div className="title-sect">
                <h2>Event Management</h2>
                <button
                  type="button"
                  className="butn evt-add-btn"
                  onClick={this.handleAdd}
                >
                  Add
                </button>
              </div>
              <ReactTable
                noDataText=""
                columns={[
                  {
                    columns: [
                      {
                        Header: "No",
                        accessor: "ContainerNo"
                      },
                      {
                        Header: "Vessel",
                        accessor: "VesselName"
                      },
                      {
                        Header: "Carrier",
                        accessor: "Carrier"
                      },
                      {
                        Header: "ETA",
                        accessor: "ETA"
                      },
                      {
                        Header: "ETD",
                        accessor: "ETD"
                      },
                      {
                        Header: "ATD",
                        accessor: "ATD"
                      },
                      {
                        Header: "Eve Status",
                        accessor: "EventmanagementDayStatus"
                      },
                      {
                        Header: "PTTP",
                        accessor: "AvgTransitDays_PTTP"
                      },
                      {
                        Header: "Action",
                        sortable: false,
                        Cell: row => {
                          return (
                            <div>
                              <img
                                className="actionicon"
                                src={Pencil}
                                alt="view-icon"
                                onClick={e => this.HandleDocumentView(e, row)}
                              />
                            </div>
                          );
                        }
                      }
                    ]
                  }
                ]}
                data={this.state.viewData}
                defaultPageSize={10}
                minRows={1}
                className="-striped -highlight"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventManagement;

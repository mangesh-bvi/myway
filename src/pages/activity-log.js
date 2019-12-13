import React, { Component } from "react";
import "react-table/react-table.css";
import "../styles/custom.css";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";

class ActivityLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalEdit: false,
      value: 50,
      viewData: [],
      selectAction: [],
      fields: {}
    };
  }

  componentDidMount() {
    let self = this;
    let fields = this.state.fields;
    var searchValue = "";
    if (this.state.fields["action"] != undefined) {
      searchValue = this.state.fields["action"];
    }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindActivityLog`,
      data: {
        SearchValue: searchValue
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({ viewData: response.data.Table });
    });
  }

  componentWillMount() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindActivityLogDropdown`,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      self.setState({ selectAction: response.data.Table });
    });
  }

  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
  }

  handleSearch(e) {
    this.componentDidMount();
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
            <div className="title-sect d-block-xs">
              <div>
                <h2>Activity Log</h2>
              </div>

              <div className="login-fields m-0 col-md-2">
                <select
                  onChange={this.HandleChangeSelect.bind(this, "action")}
                  name={"action"}
                  value={this.state.fields["action"]}
                  style={{ "margin-left": "-190px", "margin-right": "70px" }}
                >
                  {this.state.selectAction.map(team => (
                    <option key={team.Value} value={team.Value}>
                      {team.ID}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="butn"
                  onClick={this.handleSearch.bind(this)}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="view-user-table">
              <ReactTable
                noDataText=""
                columns={[
                  {
                    columns: [
                      {
                        Header: "Sr. No.",
                        accessor: "srno"
                      },
                      {
                        Header: "User Name",
                        accessor: "UserName"
                      },
                      {
                        Header: "Title",
                        accessor: "log_title"
                      },
                      {
                        Header: "Description",
                        accessor: "description"
                      },
                      {
                        Header: "Doc",
                        accessor: "doc"
                      }
                    ]
                  }
                ]}
                data={this.state.viewData}
                defaultPageSize={10}
                className="-striped -highlight"
                minRows={1}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivityLog;

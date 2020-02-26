import React, { Component } from "react";
import "react-table/react-table.css";
import "../styles/custom.css";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import Moment from "react-moment";
import appSettings from "../helpers/appSetting";
import { encryption } from "../helpers/encryption";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import { Button, Modal, ModalBody } from "reactstrap";
import Pencil from "./../assets/img/pencil.png";
import Deactivate from "./../assets/img/deactivate.png";
import DeactivateGray from "./../assets/img/deactivate-gray.png";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import matchSorter from "match-sorter";
class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDel: false,
      modalEdit: false,
      value: 50,
      viewData: [],
      deactivateId: ""
    };
    this.toggleDel = this.toggleDel.bind(this);
    this.toggleDeactivate = this.toggleDeactivate.bind(this);
    this.BindViewUserData = this.BindViewUserData.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.onFilteredChange = this.onFilteredChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  } 
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
////toggle Details User
  toggleDeactivate() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DeactivateUser`,
      data: {
        Modifiedby: userid,
        UserID: self.state.deactivateId
      },
      headers: authHeader()
    }).then(function(response) {
      
      self.BindViewUserData();
      NotificationManager.success(response.data.Table[0].Result);
    });

    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
////Handle Detactive User
  HandleDeactiveUser(evt, row) {
    
    
    var UserId = row.original["UserId"];
    this.setState({ modalDel: true, deactivateId: UserId });
  }

  componentDidMount() {
    this.BindViewUserData();
  }
////Bind User Data List
  BindViewUserData() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindUserData`,
      data: {
        IsAdmin: 1,
        Search: "",
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {      
      self.setState({ viewData: response.data });
    });
  }
////Handle Edit User Detials
  HandleEditUserDetails(evt, row) {    
    var userId = row.original["UserId"];
    if (row.original["UserType"] === "Sales User") {
      this.props.history.push({
        pathname: "Add-sales-user",
        state: { detail: userId, page: "Edit" }
      });
    } else {
      this.props.history.push({
        pathname: "Add-user",
        state: { detail: userId, page: "Edit" }
      });
    }
  }

  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
      const filterAll = "";
      this.setState({
        filtered: filtered.filter(item => item.id !== "all"),
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

  render() {
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
            <AdminSideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
             <NotificationContainer leaveTimeout={appSettings.NotficationTime} />
            <div className="title-sect">
              <h2>View Users</h2>
              <div className="col-12 col-sm-4">
                <input
                  type="search"
                  className="quote-txt-srch"
                  placeholder="Search here"
                  value={this.state.filterAll}
                  onChange={this.filterAll}
                />
              </div>
            </div>
            <div className="view-user-table">
              <ReactTable
                onFilteredChange={this.onFilteredChange.bind(this)}
                filtered={this.state.filtered}
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value
                }
                minRows={1}
                columns={[
                  {
                    columns: [
                      {
                        Header: "Sr. No.",
                        accessor: "srno"
                      },
                      {
                        Header: "User Name",
                        accessor: "Username"
                      },
                      {
                        Header: "Is Enabled",
                        accessor: "IsEnabled",
                        Cell: row => {
                          
                          if (row.row.IsEnabled !== "No Record Found") {
                            return (
                              <>{row.original.IsEnabled ? "True" : "False"}</>
                            );
                          } else {
                            return <>{row.row.IsEnabled}</>;
                          }
                        }
                      },
                      {
                        Header: "User Type",
                        accessor: "UserType"
                      },
                      {
                        Header: "Action",
                        sortable: false,
                        Cell: row => {
                          if (row.row.IsEnabled !== "No Record Found") {
                            return (
                              <div>
                                <span title="Edit">
                                  <img
                                    className="actionicon"
                                    src={Pencil}
                                    alt="view-icon"
                                    onClick={e =>
                                      this.HandleEditUserDetails(e, row)
                                    }
                                  />
                                </span>
                                <span
                                  title={
                                    row.original.IsEnabled
                                      ? "Active"
                                      : "Inactive"
                                  }
                                >
                                  <img
                                    style={{
                                      pointerEvents: row.original.IsEnabled
                                        ? "initial"
                                        : "none"
                                    }}
                                    className="actionicon"
                                    src={
                                      row.original.IsEnabled
                                        ? Deactivate
                                        : DeactivateGray
                                    }
                                    alt="deactivate-icon"
                                    onClick={e =>
                                      this.HandleDeactiveUser(e, row)
                                    }
                                  />
                                </span>
                              </div>
                            );
                          } else {
                            return <></>;
                          }
                        }
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
                          var result = matchSorter(rows, filter.value, {
                            keys: ["UserType", "IsEnabled", "Username", "srno"],
                            threshold: matchSorter.rankings.WORD_STARTS_WITH
                          });
                          if (result.length > 0) {
                            return result;
                          } else {
                            result = [
                              {
                                IsEnabled: "No Record Found"
                              }
                            ];
                            return result;
                          }
                        },
                        filterAll: true
                      }
                    ]
                  }
                ]}
                data={this.state.viewData}
                defaultPageSize={10}
                className="-striped -highlight"
                SubComponent={row => {
                  if (row.row.IsEnabled !== "No Record Found") {
                    return (
                      <div style={{ padding: "20px 0" }}>
                        <div className="view-user-inner pt-0">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-md-4">
                                <p className="view-user-title">
                                  Last Login Date:
                                </p>
                                <p className="view-user-desc">
                                  {row.original["LastLoginDate"]}
                                </p>
                              </div>
                              <div className="col-md-4">
                                <p className="view-user-title">
                                  Mode Of Transport:
                                </p>
                                <p className="view-user-desc">
                                  {row.original["ModeOfTransport"]}
                                </p>
                              </div>
                              <div className="col-md-4">
                                <p className="view-user-title">
                                  Can Create User:
                                </p>
                                <p className="view-user-desc">
                                  {row.original["CanCreateUser"]
                                    ? "True"
                                    : "False"}
                                </p>
                              </div>
                              <div className="col-md-4">
                                <p className="view-user-title">Created Date:</p>
                                <p className="view-user-desc">
                                  <Moment format="DD-MMM-YYYY">
                                    {row.original["CreatedDate"]}
                                  </Moment>
                                </p>
                              </div>
                              <div className="col-md-4">
                                <p className="view-user-title">Created By:</p>
                                <p className="view-user-desc">
                                  {row.original["CreatedByName"]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                }}
              />
            </div>
          </div>
          <Modal
            className="delete-popup"
            isOpen={this.state.modalDel}
            toggle={this.toggleDel}
            centered={true}
          >
            <ModalBody>
              <button
                type="button"
                style={{ top: "-12px", right: "-15px" }}
                className="close"
                data-dismiss="modal"
                onClick={this.toggleDel}
              >
                <span>&times;</span>
              </button>
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "15px"
                }}
              >
                <p>Are you sure ?</p>
                <Button className="butn" onClick={this.toggleDeactivate}>
                  Yes
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleDel}>
                  No
                </Button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ViewUser;

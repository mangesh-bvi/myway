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
import GoogleMapReact from "google-map-react";
import { Button, Modal, ModalBody } from "reactstrap";
import Pencil from "./../assets/img/pencil.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Deactivate from "./../assets/img/deactivate.png";
import DeactivateGray from "./../assets/img/deactivate-gray.png";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import maersk from "./../assets/img/maersk.png";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const SourceIcon = () => <div className="map-circ source-circ" />;
const DestiIcon = () => <div className="map-circ desti-circ" />;

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
    this.handleViewUserData = this.handleViewUserData.bind(this);

    this.toggleEdit = this.toggleEdit.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

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
      debugger;
      self.handleViewUserData();
      NotificationManager.success(response.data.Table[0].Result);
    });

    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }

  HandleDocumentDelete(evt, row) {
    debugger;
    var HblNo = row.original["HBL#"];
    var UserId = row.original["UserId"];
    this.setState({ modalDel: true, deactivateId: UserId });
  }

  componentDidMount() {
    this.handleViewUserData();
  }

  handleViewUserData() {
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
      debugger;
      self.setState({ viewData: response.data });
    });
  }

  HandleDocumentView(evt, row) {
    debugger;
    var userId = row.original["UserId"];
    if (row.original["UserType"] == "Sales User") {
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

  render() {
    // var data1 = [
    //   {
    //     sr_no: 1,
    //     username: "Sangameshwar",
    //     isEnab: "True",
    //     userType: "Customer"
    //   },
    //   {
    //     sr_no: 2,
    //     username: "Sangameshwar",
    //     isEnab: "False",
    //     userType: "Customer"
    //   },
    //   {
    //     sr_no: 3,
    //     username: "Sangameshwar",
    //     isEnab: "True",
    //     userType: "Customer"
    //   },
    //   {
    //     sr_no: 4,
    //     username: "Sangameshwar",
    //     isEnab: "False",
    //     userType: "Customer"
    //   },
    //   {
    //     sr_no: 5,
    //     username: "Sangameshwar",
    //     isEnab: "True",
    //     userType: "Customer"
    //   }
    // ];
    // var data2 = [
    //   {
    //     chargeCode: "A23435",
    //     chargeName: "Lorem",
    //     units: "43",
    //     unitPrice: "$134.00",
    //     finalPayment: "$45,986.00"
    //   },
    //   {
    //     chargeCode: "B45678",
    //     chargeName: "Lorem",
    //     units: "23",
    //     unitPrice: "$56.45",
    //     finalPayment: "$1200.00"
    //   },
    //   {
    //     chargeCode: "C54545",
    //     chargeName: "Lorem",
    //     units: "56",
    //     unitPrice: "$50.00",
    //     finalPayment: "$3456.00"
    //   }
    // ];
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <AdminSideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
            <NotificationContainer />
            <div className="title-sect">
              <h2>View Users</h2>
            </div>
            <div className="view-user-table">
              <ReactTable
                noDataText=""
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
                        Cell: row => (row.original.IsEnabled ? "True" : "False")
                      },
                      {
                        Header: "User Type",
                        accessor: "UserType"
                      },
                      {
                        Header: "Action",
                        sortable: false,
                        Cell: row => {
                          return (
                            <div>
                              <span title="Edit">
                              <img
                                className="actionicon"
                                src={Pencil}
                                alt="view-icon"
                                onClick={e => this.HandleDocumentView(e, row)}
                              />
                              </span>
                              <span title={row.original.IsEnabled ? "Active": "Inactive"}>
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
                                onClick={e => this.HandleDocumentDelete(e, row)}
                              />
                              </span>
                            </div>
                          );
                        }
                      }
                    ]
                  }
                ]}
                data={this.state.viewData}
                defaultPageSize={10}
                className="-striped -highlight"
                SubComponent={row => {
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
              <p>Are you sure ?</p>
              <Button className="butn" onClick={this.toggleDeactivate}>
                Yes
              </Button>
              <Button className="butn cancel-butn" onClick={this.toggleDel}>
                No
              </Button>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ViewUser;

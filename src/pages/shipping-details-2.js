import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import { Progress, Button, Modal, ModalBody } from "reactstrap";
import GoogleMapReact from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
// import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import Booked from "./../assets/img/booked.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Eye from "./../assets/img/eye.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
 


import ReactTable from "react-table";
import "react-table/react-table.css";

const SourceIcon = () => (
  <div className="map-icon source-icon">
    <img src={ShipWhite} />
  </div>
);
const DestiIcon = () => (
  <div className="map-icon desti-icon">
    <img src={ShipWhite} />
  </div>
);
var docuemntFileName = "";

class ShippingDetailsTwo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalDel: false,
      modalEdit: false,
      detailsData: {},
      addressData: [],
      containerData: [],
      ShowCard: true,
      documentData: [],
      sr_no:0,
      filtered: [],
      viewDocument:false
    };

    this.toggleDel = this.toggleDel.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    // this.HandleDownloadFile=this.HandleDownloadFile.bind(this);
    // this.HandleShowHideFun=this.HandleShowHideFun.bind(this);
  }

  componentDidMount() {
    debugger;

    var HblNo = this.props.location.state.detail;

    this.HandleShipmentDetails(HblNo);
  }
  HandleDocumentDownloadFile(evt,row){    
     debugger;
     var filePath = row.original["HBL#"];
  }

  HandleDocumentView(evt,row){    
    
    debugger;
    var HblNo = row.original["HBL#"];
    this.setState({modalEdit:true});


 }
 HandleDocumentDelete(evt,row){    
  debugger;
  var HblNo = row.original["HBL#"];
  this.setState({modalDel:true});
}


   
   
  HandleShipmentDocument() {
    debugger;
    let self = this;
    var HblNo = this.props.location.state.detail;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ViewUploadShipmentDocument`,
      data: {
        HBLNo: HblNo
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var documentdata=[];
      documentdata=response.data;    
      documentdata.forEach(function(file,i) {
        file.sr_no = i+1; 
      })
       
      self.setState({ documentData: documentdata });
    });
  }

  HandleShipmentDetails(HblNo) {
    let self = this;

    var userid = window.localStorage.getItem("userid");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentSummaryDetailsAPI`,
      data: {
        UserId: userid,
        HBLNo: HblNo
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var shipmentdata = response.data;
      self.setState({
        detailsData: shipmentdata.Table[0],
        addressData: shipmentdata.Table1,
        containerData: shipmentdata.Table2
      });
    });
  }
  onDocumentChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };
  onDocumentClickHandler = () => {
    const docData = new FormData();
    var docName = document.getElementById("docName").value;
    var docDesc = document.getElementById("docDesc").value;
    if (docName == "") {
      alert("Please enter document name");
      return false;
    }
    if (docDesc == "") {
      alert("Please enter document description");
      return false;
    }
    debugger;
    //docData.append();
    docData.append("ShipmentNumber", "BCM2453770");
    docData.append("HBLNo", "BCM23770");
    docData.append("DocDescription", docDesc);
    docData.append("name", docName);
    docData.append("FileData", this.state.selectedFile);
    // docData.append()

    axios({
      method: "post",
      url: `${appSettings.APIURL}/UploadShipmentDocument`,
      data: docData,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      alert(response.data[0].Result);
    });
  };

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  toggleDel() {
    this.setState(prevState => ({
      modalDel: !prevState.modalDel
    }));
  }
  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  HandleShowHideFun() {
    this.setState({ ShowCard: !this.state.ShowCard });
  }

  render() {
    const {
      detailsData,
      addressData,
      containerData,
      ShowCard,
      documentData
    } = this.state;

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8 p-0">
                  <div className="title-sect">
                    <h2>Details View</h2>
                  </div>
                  <ul className="nav cust-tabs" role="tablist">
                    <li>
                      <a
                        className="active"
                        id="details-tab"
                        data-toggle="tab"
                        href="#details"
                        role="tab"
                        aria-controls="details"
                        aria-selected="true"
                      >
                        Details
                      </a>
                    </li>
                    <li>
                      <a
                        id="documents-tab"
                        data-toggle="tab"
                        href="#documents"
                        role="tab"
                        aria-controls="documents"
                        aria-selected="false"
                        onClick={this.HandleShipmentDocument.bind(this)}
                      >
                        Documents
                      </a>
                    </li>
                    <li>
                      <a
                        id="activity-tab"
                        data-toggle="tab"
                        href="#activity"
                        role="tab"
                        aria-controls="activity"
                        aria-selected="false"
                      >
                        Activity
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content cust-tabs-content">
                    <div
                      className="tab-pane fade show active p-0"
                      id="details"
                      role="tabpanel"
                      aria-labelledby="details-tab"
                    >
                      <div className="sect-padd">
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">HBL#</p>
                            <a href="#!" className="details-para">
                              {detailsData.HBLNO}
                            </a>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-para">{detailsData.HBLNO}</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Status</p>
                            <p className="details-para">{detailsData.Status}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {detailsData.ModeOfTransport}
                            </p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Cargo Type</p>
                            <p className="details-para">
                              {detailsData.CargoType}
                            </p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">ATA Booking No#</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">SRT No#</p>
                            <p className="details-para">
                              {detailsData["SRT No#"]}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">Status Date</p>

                            <p className="details-para">
                              {detailsData["Status Date"]}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="sect-padd">
                        <div className="row">
                          {addressData.map(function(addkey, i) {
                            //  <p className="details-heading" key={i}>{addkey.EntityType}</p>
                            return (
                              <div
                                className="col-md-6 details-border shipper-details"
                                key={i}
                              >
                                <p className="details-heading">
                                  {addkey.EntityType}
                                </p>
                                {/* <p className="details-title">
                                  Blueground Turizm Ve Services Hizmetleri
                                  Ticaret A.S.
                                </p> */}
                                <p className="details-para">{addkey.Address}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <a href="#!" className="butn view-btn">
                              View more
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="progress-sect">
                        <div className="d-flex align-items-center">
                          <span className="clr-green">POL</span>
                          <Progress value="30" />
                          <span className="clr-red">POD</span>
                        </div>
                        <div className="desti-places">
                          <span>Port of Houston</span>
                          <span>Western Cape</span>
                        </div>
                      </div>
                      {containerData.map(function(routedata, i) {
                        return (
                          <div className="sect-padd">
                            <p className="details-heading">
                              Routing Information - {i + 1}
                            </p>
                            <div className="row mid-border">
                              <div className="col-md-6 details-border">
                                <div className="row">
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Type Of Move
                                    </p>
                                    <p className="details-para">
                                      {routedata.TypeOfMove}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">Vessel Name</p>
                                    <p className="details-para">
                                      {routedata.VesselName}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Departure Port Name
                                    </p>
                                    <p className="details-para">
                                      {routedata.DeparturePortName}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Departure Date
                                    </p>
                                    <p className="details-para">
                                      {routedata.DepartureDate}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 details-border">
                                <div className="row">
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Destination Port Name
                                    </p>
                                    <p className="details-para">
                                      {routedata.DestinationPortName}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Arrival Date
                                    </p>
                                    <p className="details-para">
                                      {routedata["Arrival Date"]}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Booking Number
                                    </p>
                                    <p className="details-para">
                                      {routedata["Booking Number"]}
                                    </p>
                                  </div>
                                  <div className="col-md-6 details-border">
                                    <p className="details-title">
                                      Booking Date
                                    </p>
                                    <p className="details-para">
                                      {routedata.BookingDate}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {ShowCard ? (
                              <div className="collapse-sect">
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Container Agents
                                    </p>
                                    <p className="details-para">
                                      {routedata["Container Agents"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Flag</p>
                                    <p className="details-para">
                                      {routedata.Flag}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Voyage Identification
                                    </p>
                                    <p className="details-para">
                                      {routedata["Voyage Identification"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">IMO Number</p>
                                    <p className="details-para">
                                      {routedata["IMO Number"]}
                                    </p>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">
                                      Document Cutoff
                                    </p>
                                    <p className="details-para">
                                      {routedata["Document Cutoff"]}
                                    </p>
                                  </div>
                                  <div className="col-md-3 details-border">
                                    <p className="details-title">Port Cutoff</p>
                                    <p className="details-para">
                                      {routedata["Port Cutoff"]}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {
                              <div className="row">
                                <div className="col-md-12">
                                  <a
                                    href="#!"
                                    className="butn view-btn less-btn"
                                  >
                                    Show Less
                                  </a>
                                </div>
                              </div>
                            }
                          </div>
                        );
                      })}

                      <div className="sect-padd">
                        <p className="details-heading">Container Details</p>
                        <div className="row">
                          <div className="col-md-3 details-border">
                            <p className="details-title">Container Number</p>
                            <p className="details-para">HLBU-1725486</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">
                              Container Code / Type
                            </p>
                            <p className="details-para">20GP / Standard 20</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Seal NO.1</p>
                            <p className="details-para">2558156</p>
                          </div>
                          <div className="col-md-3 details-border">
                            <p className="details-title">Seal NO.2</p>
                          </div>
                        </div>
                        <div className="collapse-sect">
                          <div className="row">
                            <div className="col-md-3 details-border">
                              <p className="details-title">Unit</p>
                              <p className="details-para">Metric</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Height</p>
                              <p className="details-para">85.2</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Width</p>
                              <p className="details-para">93.6</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Length</p>
                              <p className="details-para">232.8</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 details-border">
                              <p className="details-title">Gross Weight</p>
                              <p className="details-para">0 Kgs</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Net Weight</p>
                              <p className="details-para">0 Kgs</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Volume Weight</p>
                              <p className="details-para">0.00 Kgs</p>
                            </div>
                            <div className="col-md-3 details-border">
                              <p className="details-title">Description</p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <a href="#!" className="butn view-btn less-btn">
                              Show Less
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="documents"
                      role="tabpanel"
                      aria-labelledby="documents-tab"
                    >
                      <div>
                        Enter documentName:
                        <input id="docName" type="text"></input>
                      </div>
                      <div>
                        Enter document Description:
                        <input id="docDesc" type="text"></input>
                      </div>
                      <div>
                        <input
                          type="file"
                          onChange={this.onDocumentChangeHandler}
                        ></input>
                      </div>
                      <div>
                        <input
                          type="button"
                          onClick={this.onDocumentClickHandler}
                          value="Save"
                        ></input>
                      </div>
                      <button className="butn">Add Document</button>
                      <div className="table-scroll">
                        <ReactTable
                          data={documentData}
                          showPagination={false}
                          columns={[
                            {
                              columns: [
                                {
                                  Header: "Sr_No",
                                  accessor: "sr_no"
                                },

                                {
                                  Header: "Title",
                                  accessor: "DocumentDescription"
                                },
                                {
                                  Header: "Action",
                                  Cell: row => {
                                    return (
                                      <div>
                                        <img
                                          className="actionicon"
                                          src={Eye}
                                          alt="view-icon"
                                          onClick={e =>
                                            this.HandleDocumentView(e, row)
                                          }
                                        />
                                        <img
                                          className="actionicon"
                                          src={Delete}
                                          alt="delete-icon"
                                          onClick={e =>
                                            this.HandleDocumentDelete(e, row)
                                          }
                                        />
                                        <img
                                          className="actionicon"
                                          src={Download}
                                          alt="download-icon"
                                          onClick={e =>
                                            this.HandleDownloadFile(e, row)
                                          }
                                        />
                                      </div>
                                    );
                                  }
                                }
                              ]
                            }
                          ]}
                          // getTrProps={this.HandleDEDFile.bind(this)}
                          defaultPageSize={5}
                          className="-striped -highlight"
                        />
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="activity"
                      role="tabpanel"
                      aria-labelledby="activity-tab"
                    >
                      3
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="ship-detail-maps">
                    <div className="ship-detail-map">
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                        }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                      >
                        <SourceIcon lat={59.955413} lng={30.337844} />
                        <DestiIcon lat={59.9} lng={30.3} />
                      </GoogleMapReact>
                    </div>
                    <div className="shipment-track-cntr">
                      <div className="shipment-track">
                        <div>
                          <p className="est-title">Estimated Time of Arrival</p>
                          <p className="est-time">
                            9 October 2019, 90:45:56 Min
                          </p>
                        </div>
                        <div className="ship-white-cntr">
                          <div className="ship-white">
                            <img src={ShipWhite} alt="ship icon" />
                          </div>
                        </div>
                      </div>
                      <div className="track-details">
                        <div className="track-line-cntr active">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Booked} alt="booked icon" />
                            </div>
                          </div>
                          <p>
                            <span>Booked : </span>6 Oct 2019, 10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr active">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Departed} alt="departed icon" />
                            </div>
                          </div>
                          <p>
                            <span>Departed : </span>9 Oct 2019, 90:45:56
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Arrived} alt="arrived icon" />
                            </div>
                          </div>
                          <p>
                            <span>Arrived : </span>ETA 9 Oct 2019, 10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Inland} alt="inland icon" />
                            </div>
                          </div>
                          <p>
                            <span>Inland Transportation : </span>ETA 9 Oct 2019,
                            10:45:00
                          </p>
                        </div>
                        <div className="track-line-cntr">
                          <div className="track-img-cntr">
                            <div className="track-img">
                              <img src={Delivery} alt="delivery icon" />
                            </div>
                          </div>
                          <p>
                            <span>Delivered : </span>ETA 9 Oct 2019, 10:45:00
                          </p>
                        </div>
                      </div>
                    </div>
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
                    <Button className="butn" onClick={this.toggleDel}>
                      Yes
                    </Button>
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleDel}
                    >
                      No
                    </Button>
                  </ModalBody>
                </Modal>
                <Modal
                  className="delete-popup"
                  isOpen={this.state.modalEdit}
                  toggle={this.toggleEdit}
                  centered={true}
                >
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                      <iframe
                        src="https://vizio.atafreight.com/WebVizio_3_0/TAndC/ClickToAccept.pdf#toolbar=0&navpanes=0&scrollbar=0"
                         
                        className="agreement-pdf"
                      ></iframe>
                    </div>
                     
                    <Button
                      className="butn cancel-butn"
                      onClick={this.toggleEdit}
                    >
                      Cancel
                    </Button>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingDetailsTwo;

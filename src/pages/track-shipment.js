import React, { Component, Fragment } from "react";
import "../styles/custom.css";
import {
  UncontrolledCollapse,
  Progress,
  Button,
  Modal,
  ModalBody
} from "reactstrap";
import GoogleMapReact from "google-map-react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
// import ShipBig from "./../assets/img/ship-big.png";
import ShipWhite from "./../assets/img/ship-white.png";
import FileUpload from "./../assets/img/file.png";
import Booked from "./../assets/img/booked.png";
import Transit from "./../assets/img/transit-small.png";
import Departed from "./../assets/img/departed.png";
import Arrived from "./../assets/img/arrived.png";
import Inland from "./../assets/img/inland.png";
import Delivery from "./../assets/img/delivery.png";
import Eye from "./../assets/img/eye.png";
import Delete from "./../assets/img/red-delete-icon.png";
import Download from "./../assets/img/csv.png";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
const { compose } = require("recompose");


class TrackShipment extends Component {
  constructor(props) {
    super(props);

    this.state = {     
      modalShare: false,
      HBLNo:""
    };
  }

  componentDidMount() {
    debugger;
    this.toggleShare()
  }

  toggleShare() {
    this.setState(prevState => ({
      modalShare: !prevState.modalShare
    }));
  }

  handleDetailView(){
    debugger;
    
    this.props.history.push({
      pathname: "track-shipment2",
      state: { detail: this.state.HBLNo }
    });
  }

  handleHBLNo(e){
     this.state.HBLNo = e.target.value;
     this.setState({HBLNo:this.state.HBLNo})
  }

  HandleListShipmentSummey(shiptype) {
    debugger;
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");

    axios({
      method: "post",
      url: `${appSettings.APIURL}/shipmentsummaryAPI`,
      data: {
        UserId: userid,
        PageNo: 1
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      // var air = 0,
      //   ocean = 0,
      //   inland = 0;
    
      //ModeOfTransport

      var data = response.data.Table1;
      var inland = data.filter(x=>x.ModeOfTransport==="Inland").length;
      var air = data.filter(x=>x.ModeOfTransport === "Air").length;
      var ocean =  data.filter(x=>x.ModeOfTransport === "Ocean").length;
      
      if (shiptype != "") {
        data = data.filter(item => item.ModeOfTransport == shiptype);
        if (data.length === 0) {
          data = [{ POL: "No record found" }];
        }
      }
      self.setState({ shipmentSummary: data });
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].ModeOfTransport === "Ocean") {
      //     ocean = ocean + 1;
      //   } else if (data[i].ModeOfTransport === "Air") {
      //     air = air + 1;
      //   } else if (data[i].ModeOfTransport === "Inland") {
      //     inland = inland + 1;
      //   }
      // }

      window.localStorage.setItem("aircount", air);
      window.localStorage.setItem("oceancount", ocean);
      window.localStorage.setItem("inlandcount", inland);

      ///problem not working setstat undefined
    });
  }
 
  render() {

    return (
      <div>
        {/* <Headers /> */}
        <div className="cls-ofl">
          {/* <div className="cls-flside">
            <SideMenu />
          </div> */}
          {/* <div className="cls-rt">
            <div className="container-fluid"> */}
              <div className="row">
              <Modal
              className="amnt-popup"
              isOpen={this.state.modalShare}
              toggle={this.toggleShare}
              centered={true}
            >
              <ModalBody>
                <button type="button" className="close" data-dismiss="modal" onClick={this.toggleShare}>
                <span>&times;</span>
              </button>
                <div style={{backgroundColor:"#fff",padding:"15",borderRadius:"15px"}}>
                <h3 className="mb-4 text-center">Track Shipment</h3>
                <div className="txt-cntr">
                  <div className="d-flex align-items-center">
                    <p className="details-title mr-3">HBL No</p>
                    <div class="spe-equ d-block m-0 flex-grow-1">
                      <input
                        type="text"
                        class="w-100"
                        onChange={this.handleHBLNo.bind(this)}
                        value={this.state.shareLink}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right d-flex justify-content-end mb-0">
                  <Button
                    className="butn cancel-butn"
                    onClick={this.handleDetailView.bind(this)}
                  >
                    Done
                  </Button>
                </div>
                {/* <div className="text-right">
                  {this.state.copied ? (
                    <span
                      style={{
                        color: "#39b54a",
                        marginTop: "5px",
                        display: "block"
                      }}
                    >
                      Copied.
                    </span>
                  ) : null}
                </div> */}
                </div>
              </ModalBody>
            </Modal>

              </div>
            </div>

      </div>
    );
  }
}

export default TrackShipment;

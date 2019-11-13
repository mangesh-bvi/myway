import React, { Component } from "react";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import Logo from "./../assets/img/logo.png";
import "../assets/css/custom.css";
import BellIcon from "./../assets/img/bell.png";
import ChatIcon from "./../assets/img/chat.png";
import LoginActore from "./../assets/img/login-actore.jfif";
import PhoneIcon from "./../assets/img/phone.png";
import QRCode from "../pages/QRCode";
import UserIcon from "./../assets/img/user.png";
import ActivityLogIcon from "./../assets/img/activity-log.png";
import ProfileSettingIcon from "./../assets/img/profilesetting.png";
import LogoutIcon from "./../assets/img/logout.png";
import { encryption } from "../helpers/encryption";
// import { OverlayTrigger, Popover ,Button} from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import { Progress, Button, Modal, ModalBody } from "reactstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { tooltipOpen: false, laslastlogintlogin: "", searchButn: true, notificationData :[] ,modalDocu: false,  DropdownCommonMessage: [], popupHBLNO:""};
    this.BindNotifiation = this.BindNotifiation.bind(this);
    this.toggleDocu = this.toggleDocu.bind(this);
  }

  componentDidMount() {
    if (encryption(window.localStorage.getItem("username"), "desc") == null) {
      window.location.href = "./login";
    } else {
      document.getElementById("spnUser").textContent = encryption(
        window.localStorage.getItem("username"),
        "desc"
      );
      document.getElementById("spnFirstName").textContent = encryption(
        window.localStorage.getItem("username"),
        "desc"
      );
      document.getElementById("spnLastLogin").textContent = encryption(
        window.localStorage.getItem("lastlogindate"),
        "desc"
      );
      this.setState({
        lastlogin: (document.getElementById(
          "spnLastLogin"
        ).textContent = encryption(
          window.localStorage.getItem("lastlogindate"),
          "desc"
        ))
      });
    }
    if (window.location.pathname === "/rate-search") {
      this.setState({ searchButn: false });
    }

    window.addEventListener('load', this.BindNotifiation);

    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindDropdownCommonMessage`,
      
      headers: authHeader()
    }).then(function(response) {
      self.setState({ DropdownCommonMessage: response.data });
    });

    
  }
  toggleDocu() {
    this.setState(prevState => ({
      modalDocu: !prevState.modalDocu
    }));


    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    //alert(sPage);
  
    if(sPage == "shipment-details")
    {
      this.setState({ popupHBLNO: document.getElementById("popupHBLNO").value });
      //alert(document.getElementById("popupHBLNO").value)
    }
    
  }
  

BindNotifiation()
{
  let self = this;

  axios({
    method: "post",
    url: `${appSettings.APIURL}/UserNotification`,
    data: {
      UserID: encryption(window.localStorage.getItem("userid"), "desc")
    },
    headers: authHeader()
  }).then(function(response) {
           // self.state.Notificationcount = response.data.Table.length;
           var today = new Date();   
           today.setDate(today.getDate() - 8 );

           if(response != null)
           {
             if(response.data != null)
             {
               if(response.data.Table != null)
               {
                 if(response.data.Table.length > 0)
                 {
                  self.setState({ notificationData : response.data.Table.filter(item =>
                    item.ActivityDate > today.toJSON())
                  });
                 if( self.state.notificationData != null)
                 {
                    var element = !!document.getElementById("Notificationcount"); 
                    if (element) { 
                      document.getElementById("Notificationcount").innerHTML  = self.state.notificationData.length;
                    }                  
                 }
                  
                 }
               }
             }
           }  
  });

}

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  closepopover() {
    this.setState({
      tooltipOpen: false
    });
  }
  onLogout() {
    localStorage.clear();
    window.location.href = "./login";
  }

  onSetting() {
    // document.getElementById("dvsetting").className.remove("cls-hide");
  }

  SendMessage = () => {
    var drpshipment = document.getElementById("drpshipment");
    var txtShipmentNo = document.getElementById("txtShipmentNo");
    var txtshipmentcomment = document.getElementById("txtshipmentcomment");

    if (drpshipment.value.trim() == "0") {
      alert("Please select shipment type");
      drpshipment.focus();
      return false;
    }
    if (txtShipmentNo.value.trim() == "") {
      alert("Please enter shipment no.");
      txtShipmentNo.focus();
      return false;
    }
    if (txtshipmentcomment.value.trim() == "") {
      alert("Please enter shipment comment.");
      txtshipmentcomment.focus();
      return false;
    }

    var month_names =["Jan","Feb","Mar",
    "Apr","May","Jun",
    "Jul","Aug","Sep",
    "Oct","Nov","Dec"];

    var today = new Date();   

    var day = today.getDate();
    var month_index = today.getMonth();
    var year = today.getFullYear();

//alert(txtshipmentcomment.value.trim() + " on " + day + " " + month_names[month_index] + " " + year);
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SendCommonMessage`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        ReferenceNo: txtShipmentNo.value.trim(),
        TypeOfMessage: drpshipment.value.trim(),
        Message : txtshipmentcomment.value.trim() + " on " + day + " " + month_names[month_index] + " " + year
      },
      headers: authHeader()
    }).then(function(response) {
      if(response != null)
      {
        if(response.data != null)
        {
          if(response.data.length > 0)
          {
            if(response.data[0] != null)
            {
              var message = response.data[0].Result;
              alert(response.data[0].Result);
            }
          }
        }
      }

      var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    //alert(sPage);
  
    if(sPage == "shipment-details")
    {
      document.getElementById("activity-tab").click();
    }

    });
    this.toggleDocu();

    

  }

 
  render() {

    let optionNotificationItems = this.state.notificationData.map((item, i) => (
      <div>
        <hr size="2" />
        <p >Shipment: <a class="font-weight-bold"> {item.Product}</a></p>
        <p >RefNo: <a class="font-weight-bold">{item.RefNo} </a></p>
        <p>Status : <a class="font-weight-bold"> {item.ProductStatus} 
       {/* - { new Date( item.ActivityDate).toLocaleDateString()}  */}
       </a></p>
       
      </div>
     
    ));

    let optionItems = this.state.DropdownCommonMessage.map((planet, i) => (
      
      (i ==  0) ? 
      (<option
        value={planet.ID}
        selected = "selected"
      >
        {planet.Value}
      </option>)
     :
     (<option
      value={planet.ID}
    >
      {planet.Value}
    </option>)

    ));

    let popupHBLNO = this.state.popupHBLNO;
 
    return (
      <div>
        <div className="cls-header-1">
          <div className="row">
            <div className="col-xs col-sm-6 col-md-3">
              <img src={Logo} alt="log-icon" className="header-log" />
            </div>
            <div className="col-xs col-sm-6 col-md-9">
              <ul className="header-ul">
                {this.state.searchButn && (
                  <li>
                    <a href="/rate-search" className="header-btn">
                      SEARCH RATES
                    </a>
                  </li>
                )}
                <li>
                  

                  <div className="dropdown">
                    <img
                      src={BellIcon}
                      alt="bell-icon"
                      className="header-bell-icon"
                      data-toggle="dropdown"
                    />
                   <a id="Notificationcount">0</a>
                    <div className="dropdown-menu">
                      {optionNotificationItems}
                {/*<p>yuguhyuyg</p>*/}
                    </div>
                  </div>
                </li>
                
                {/* <li style={{ padding: "10px 15px" }}>
                  <div className="dropdown">
                    <img
                      className="header-phone-icon dropdown-toggle"
                      data-toggle="dropdown"
                      id="qrCode"
                      src={PhoneIcon}
                      alt="mobile-icon"
                    />

                    <div className="dropdown-menu qr-code-dropdown">
                      <QRCode />
                    </div>
                  </div>
                </li> */}
                <li style={{ padding: "10px 15px" }}>
                 
                  
                  <img
                    src={ChatIcon}
                    alt="chat-icon"
                    className="header-chat-icon"  onClick={this.toggleDocu}
                  />
                       
                <Modal
                  className="delete-popup pol-pod-popup"
                  isOpen={this.state.modalDocu}
                  toggle={this.toggleDocu}
                  centered={true}
                  backdrop="static"
                >
                  <ModalHeader>Send Message</ModalHeader>
                  <ModalBody>
                    <div className="rename-cntr login-fields">
                     
                     <select id="drpshipment">
                       <option value="0">Select</option>
                       {/* <option value="Shipment">Shipment</option> */}
                       {optionItems}
                     </select>
                    </div>
                    <div className="rename-cntr login-fields">
                      
                      <input
                        id="txtShipmentNo"
                        type="text"
                        placeholder="Enter Shipment No."
                        value={popupHBLNO}
                      />
                    </div>
                    <div className="rename-cntr login-fields">
                      
                    <textarea id="txtshipmentcomment" name="comment" rows = "5" cols = "50" style={{resize:"none"}} placeholder="Enter Comment..."></textarea>
                    </div>
                   
                    <Button
                      className="butn"
                      onClick={() => {
                        this.SendMessage();
                      }}
                    >
                      Send
                    </Button>
                    <Button className="butn"  onClick={() => {
                        this.toggleDocu();
                      }}>Close</Button>
                  </ModalBody>
                </Modal>
                </li>

                <li id="activelog-open">
                  <ul className="header-ul-login-dtls">
                    <li>
                      <img
                        src={LoginActore}
                        alt="login-actore-icon"
                        className="rounded-circle header-login-actore-icon"
                      />
                    </li>

                    <li>
                      <div className="dropdown rmarrow">
                        <button
                          type="button"
                          className="dropdown-toggle rmstylebtn"
                          data-toggle="dropdown"
                          id="spnUser"
                        ></button>
                        <div className="dropdown-menu profile-dropdown">
                          <ul className="profile-ul">
                            <li>
                              <img
                                src={UserIcon}
                                className="drp-usericon"
                                alt="use-icon"
                              />
                              <label
                                id="spnFirstName"
                                className="lbl-cursor"
                              ></label>
                            </li>
                            <li className="lastlogin-li">
                              <ul className="lastlogin-ul">
                                <li>
                                  <img
                                    src={UserIcon}
                                    className="drp-usericon"
                                    alt="user-icon"
                                  />
                                </li>
                                <li>
                                  <label className="lbl-cursor">
                                    Last Login
                                    <span
                                      id="spnLastLogin"
                                      className="lastlogin-lbl lbl-cursor"
                                    ></span>
                                  </label>
                                </li>
                              </ul>
                            </li>
                            <li
                              className="activitylog-li"
                              onClick={this.toggle.bind(this)}
                              id="abcd"
                            >
                              <img
                                src={ActivityLogIcon}
                                alt="activity-log"
                                className="activitylog-icon"
                              />
                              Activity Log
                            </li>
                            <li className="profile-setting-li">
                              <a href="changePassword">
                                <img
                                  src={ProfileSettingIcon}
                                  alt="profile-icon"
                                  className="profilesetting-icon"
                                />
                                Profile Setting
                              </a>
                            </li>
                            <li className="profile-setting-li">
                              <a href="">
                                <img
                                  className="header-phone-icon dropdown-toggle"
                                  data-toggle="dropdown"
                                  id="qrCode"
                                  src={PhoneIcon}
                                  alt="mobile-icon"
                                />
                                Mobile App
                              </a>
                            </li>
                            <li
                              className="logout-li"
                              onClick={this.onLogout.bind(this)}
                            >
                              <img
                                src={LogoutIcon}
                                alt="logout-icon"
                                className="activitylog-icon"
                              />
                              Logout
                            </li>
                          </ul>
                        </div>
                      </div>

                      <p className="login-actore-text">LOREM IPSUM</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <UncontrolledPopover
          trigger="legacy"
          placement="top"
          target="abcd"
          // isOpen={this.state.tooltipOpen}
          rootClose={this.closepopover.bind(this)}
          className="popovercls"
        >
          <PopoverHeader>
            <img
              src={ActivityLogIcon}
              alt="activity-icon"
              className="activitylog-icon"
            />
            Activity Log
          </PopoverHeader>

          <PopoverBody>
            <label>Log-in</label>
            <br />
            <label>
              {encryption(window.localStorage.getItem("lastlogindate"), "desc")}
            </label>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    );
  }
}

export default Header;

import React from "react";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import Logo from "./../assets/img/logo.png";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import CheckboxTree from "react-checkbox-tree";
// import FontAwesomeIcon from 'font-awesome';

// import { connect } from 'react-redux'
// const nodes = [
//   {
//     value: "mars",
//     label: "Mars",
//     children: [
//       {
//         value: "phobos",
//         label: "Phobos",
//         children: [{ value: "phobos-chileden", label: "phobos-chileden" }]
//       },
//       { value: "deimos", label: "Deimos" }
//     ]
//   },
//   {
//     value: "mars1",
//     label: "Mars1",
//     children: [
//       {
//         value: "phobos",
//         label: "Phobos1",
//         children: [{ value: "phobos-chileden", label: "phobos-chileden-1" }]
//       },
//       { value: "deimos", label: "Deimos1" }
//     ]
//   }
//   {
//     value: 352200103,
//     label: "ATA MUMBAI",
//     children: [
//       {
//         value: 1337604146,
//         label: "Satish Gage",
//         children: [{ value: 0, label: 0 }]
//       },
//       {
//         value: 1337604158,
//         label: "Sanjana Bagwe",
//         children: [{ value: 1, label: 1 }]
//       }
//     ]
//   }
// ];

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      submitted: false,
      showLoginError: false,
      errorText: "",
      loading: false,
      modalSalesLogin: false,
      salesUserData: [],
      checked: ["/"],
      expanded: [],
      nodes: []
    };

    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSalesLogin = this.toggleSalesLogin.bind(this);
    this.toggleSalesLoginPage = this.toggleSalesLoginPage.bind(this);
    this.HandleDisplaySalesPersonData = this.HandleDisplaySalesPersonData.bind(
      this
    );
  }

  HandleDisplaySalesPersonData(sData) {
    //get Companies
    let self = this;
    var mydata = sData; //JSON.parse(data);
    //alert(mydata.length);

    //get Companies
    const finalNode = [];
    const checkedNode = [];
    const distinctOffice = [];
    const distinctContactDisName = [];
    const distinctAssociateComp = [];

    const Compmaps = new Map();
    const ContactDismap = new Map();
    const distinctAssociateCompmap = new Map();

    for (const item of mydata) {
      var officeName = item.OfficeShortName;
      var OfficeID = item.OfficeID;
      if (!Compmaps.has(officeName)) {
        Compmaps.set(officeName, true); // set any value to Map
        distinctOffice.push({
          OfficeShortName: officeName,
          OfficeID: OfficeID
        });
      }

      //Contact display

      var contactDName = item.ContactDisplayName;
      var ContactID = item.ContactID;
      if (!ContactDismap.has(contactDName)) {
        ContactDismap.set(contactDName, true); // set any value to Map
        distinctContactDisName.push({
          officeName: officeName,
          value: ContactID,
          label: contactDName,
          child: [
            { value: 1, label: 2 },
            { value: 1, label: 2 }
          ]
        });
      }

      //Contact Company data
      //officeName
      //Company_Name
      //Company_ID
      var Company_Name = item.Company_Name;
      var Company_ID = item.Company_ID;
      var Company_Name = item.Company_Name;
      var ContactDisplayName = item.ContactDisplayName;
      var ContactID = item.ContactID;
      var nOfficeID = item.OfficeID;
      var boolMap = item.ISCompMapped;
      if (
        !distinctAssociateCompmap.has(officeName) &&
        !distinctAssociateCompmap.has(Company_Name) &&
        !distinctAssociateCompmap.has(Company_ID)
      ) {
        distinctAssociateCompmap.set(contactDName, true); // set any value to Map
        distinctAssociateComp.push({
          officeName: officeName,
          Company_Name: Company_Name,
          Company_ID: Company_ID,
          ContactDisplayName: ContactDisplayName,
          ContactID: ContactID,
          OfficeID: nOfficeID,
          ISCompMapped: boolMap
        });
      }
    }

    var iCompanies = distinctOffice.length;
    var iContacts = distinctContactDisName.length;
    var iAssocCompany = distinctAssociateComp.length;

    ////Company
    for (var i = 0; i < iCompanies; i++) {
      var selectedoffId = distinctOffice[i]["OfficeID"];

      var salesPersonDataByComp = {};
      salesPersonDataByComp.value = distinctOffice[i]["OfficeID"];
      salesPersonDataByComp.label = distinctOffice[i]["OfficeShortName"];
      salesPersonDataByComp.children = [];

      var salesPersondata = [];

      for (var j = 0; j < distinctContactDisName.length; j++) {
        var salesPersonName = {};
        var salesPersonChildData = [];

        var iSelectedSalesPersonId = distinctContactDisName[j]["value"];
        salesPersonName.value = distinctContactDisName[j]["value"];
        salesPersonName.label = distinctContactDisName[j]["label"];

        ///////For loop for the Sales Person's ///////Company
        for (var k = 0; k < iAssocCompany; k++) {
          var associateCompData = {};

          var ofID = distinctAssociateComp[k]["OfficeID"];
          //var cnID = distinctAssociateComp[k]["ContactID"];
          //var cotName = distinctAssociateComp[k]["ContactDisplayName"];
          var cnID = distinctAssociateComp[k]["ContactID"];

          //Check same or not
          if (ofID === selectedoffId && iSelectedSalesPersonId == cnID) {
            //Inside

            var cvId = distinctAssociateComp[k]["Company_ID"];
            var cnName = distinctAssociateComp[k]["Company_Name"];
            var bMapped = distinctAssociateComp[k]["ISCompMapped"];

            associateCompData.value = cvId;
            associateCompData.label = cnName;
            salesPersonChildData.push(associateCompData);

            ///Set checked Node
            if (bMapped === true);
            {
              var tData = cvId.toString();
              checkedNode.push(tData);
            }
          }
        }

        //associateCompData.value = j;
        //associateCompData.label = j;
        //salesPersonChildData.push(associateCompData);

        salesPersonName.children = salesPersonChildData;
        salesPersondata.push(salesPersonName);
      }
      salesPersonDataByComp.children = salesPersondata;

      finalNode.push(salesPersonDataByComp);
    }

    //self.setState({ nodes: finalNode, checked: ["352200103, 1337604146"] });
    // self.setState({ nodes: finalNode, checked: ["1420702123"] });
    //self.setState({ nodes: finalNode, checked: ["1420702123"] });
    self.setState({ nodes: finalNode, checked: checkedNode });
  }
  toggleSalesLogin() {
    let self = this;
    self.setState({ modalSalesLogin: false, loading: false });
  }
  toggleSalesLoginPage() {
    var checkedCompData = this.state.checked;
    var finalselectedData = [];
    for (var i = 0; i < checkedCompData.length; i++) {
      finalselectedData.push(parseInt(checkedCompData[i]));
    }

    axios({
      method: "post",
      url: `${appSettings.APIURL}/SaveSalesUserCompanyList`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        //CompanyID: [1456412466, 1424312173, 1420702123]
        CompanyID: finalselectedData
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        window.location.href = "./rate-search";
      })
      .catch(error => {
        console.log(error);
      });
  }

  handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    let self = this;
    e.preventDefault();
    this.setState({ submitted: true, loading: true });
    const { username, password } = this.state;
    window.localStorage.setItem("password", encryption(password, "enc"));
    if (username !== "" && password !== "") {
      var ipaddress = window.localStorage.getItem("ipaddress");
      console.log("axios" + new Date());
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/mywayapi/Login",
        data: {
          UserName: username,
          Password: password,
          publicIPAddress: ipaddress,
          PrivateIPAddress: ""
        },
        headers: authHeader("no")
      })
        .then(function(response) {
          debugger;
          console.log(response.data, "--------------------login data");

          var data = response.data;
          window.localStorage.setItem("st", new Date());

          window.localStorage.setItem(
            "username",
            encryption(data.Table[0].UserName, "enc")
          );
          window.localStorage.setItem(
            "firstname",
            encryption(data.Table[0].FirstName, "enc")
          );
          window.localStorage.setItem(
            "lastlogindate",
            encryption(data.Table[0].LastLoginDate, "enc")
          );
          window.localStorage.setItem(
            "lastname",
            encryption(data.Table[0].LastName, "enc")
          );
          window.localStorage.setItem("qrcode", data.Table1[0].QRCode);
          window.localStorage.setItem(
            "modeoftransport",
            data.Table[0].ModeOfTransport
          );
          window.localStorage.setItem(
            "userid",
            encryption(data.Table[0].UserId, "enc")
          );
          window.localStorage.setItem(
            "usertype",
            encryption(data.Table[0].UserType, "enc")
          );
          window.localStorage.setItem(
            "dashboardrefreshtime",
            data.Table[0].DashboardRefreshTime
          );
          window.localStorage.setItem(
            "companyname",
            encryption(data.Table[0].Company_Name, "enc")
          );
          window.localStorage.setItem("IsEnabled", data.Table[0].IsEnabled);
          GenerateToken(username, password);

          var userType = response.data.Table;
          var userTypeName = userType[0].UserType;

          var ProfileTypen = userType[0].ProfileType;
          if (userTypeName === "Sales User" && ProfileTypen) {
            var sData = response.data.Table3;
            self.HandleDisplaySalesPersonData(sData);
            self.setState({
              modalSalesLogin: !self.state.modalSalesLogin
            });
          }

          //window.location.href = "./user-agreement";
        })
        .catch(error => {
          this.setState({ loading: false });
          var temperror = error.response.data;
          var err = temperror.split(":");
          NotificationManager.error(err[1].replace("}", ""));
          // this.state.usernamee = '';
          this.setState({ username: "", password: "" });
          setTimeout(5000);
        });
    } else {
      debugger;
      this.setState({ settoaste: true, loading: true });

      var error = username === "" ? "Please enter the username\n" : "";
      error += password === "" ? "Please enter the password" : "";
      // alert(error);
      //  window.location='./Dashboard'
      NotificationManager.error(error);
      setTimeout(function() {
        window.location.href = "./";
      }, 5000);
    }
  }

  componentDidMount() {
    localStorage.clear();
    const publicIp = require("public-ip");
    (async () => {
      console.log(await publicIp.v4());
      window.localStorage.setItem("ipaddress", await publicIp.v4());
    })();
  }
  render() {
    let self = this;
    //  const { username, password } = this.state;
    const { loading } = this.state;
    return (
      <section className="login-between">
        <div className="login-sect">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="login-cntr">
              <h2>
                Welcome <span>Login to get started!</span>
              </h2>
              <div className="login-fields-cntr">
                <div className="login-input-cntr">
                  <div className="login-fields">
                    <label>User Name</label>
                    <input
                      type="text"
                      name={"username"}
                      onChange={this.handlechange}
                      value={this.state.username}
                      placeholder="Enter Your User Name"
                    />
                  </div>
                  <div className="login-fields">
                    <label>Password</label>
                    <input
                      id="password"
                      name={"password"}
                      onChange={this.handlechange}
                      value={this.state.password}
                      placeholder="Enter Your Password"
                      type="password"
                    />
                  </div>
                </div>
                <div className="remember-forgot-1">
                  {/* <div>
                    <input id="remember" type="checkbox" name={"remember me"} />
                    <label htmlFor="remember">Remember Me</label>
                  </div> */}
                  <a href="./forgotPassword">Forgot Password?</a>
                </div>
                <div className="text-right">
                  {self.state.modalSalesLogin != true ? (
                    <button
                      onClick={this.handleSubmit}
                      type="submit"
                      className="butn login-butn"
                      //onClick={}
                      disabled={
                        self.state.modalSalesLogin != true ? loading : null
                      }
                    >
                      {self.state.modalSalesLogin != true
                        ? loading && (
                            <i
                              style={{ marginRight: 15 }}
                              className="fa fa-refresh fa-spin"
                            ></i>
                          )
                        : null}
                      {loading ? "Please Wait ..." : "Login"}
                    </button>
                  ) : (
                    <button
                      onClick={this.handleSubmit}
                      type="submit"
                      className="butn login-butn"
                      //onClick={}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="">
          <Modal
            className="delete-popup salesuserPopup"
            isOpen={this.state.modalSalesLogin}
            centered={true}
          >
            <ModalHeader>Sales customers</ModalHeader>
            <ModalBody>
              <div>
                <CheckboxTree
                  nodes={self.state.nodes}
                  checked={self.state.checked}
                  expanded={this.state.expanded}
                  onCheck={checked => this.setState({ checked })}
                  onExpand={expanded => this.setState({ expanded })}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="salesuserPopup">
                <Button className="butn" onClick={this.toggleSalesLoginPage}>
                  Proceed
                </Button>
                <Button
                  className="butn cancel-butn"
                  onClick={this.toggleSalesLogin}
                >
                  Cancel
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        </div>
        <NotificationContainer />
      </section>
    );
  }
}

function GenerateToken(username, password) {
  var details = {
    username: username,
    password: password,
    grant_type: "password"
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: formBody
  };
  return fetch(`${appSettings.APIURL}/token`, requestOptions)
    .then(TokenhandleResponse)
    .catch(error => {});
}

function TokenhandleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      //alert('oops!error occured');
    } else {
      window.localStorage.setItem(
        "token",
        encryption(data.access_token, "enc")
      );
      if (window.localStorage.getItem("IsEnabled") == "true") {
        if (
          encryption(window.localStorage.getItem("usertype"), "desc") ==
          "Sales User"
        ) {
        } else {
          window.location.href = "./Dashboard";
        }
      } else {
        window.location.href = "./user-agreement";
      }
    }

    // return data;
  });
}
export default Login;

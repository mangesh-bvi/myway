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
    this.HandleLoginSubmit = this.HandleLoginSubmit.bind(this);
    this.toggleSalesLogin = this.toggleSalesLogin.bind(this);
    this.toggleSalesLoginPage = this.toggleSalesLoginPage.bind(this);
    this.HandleDisplaySalesPersonData = this.HandleDisplaySalesPersonData.bind(
      this
    );
  }
  ////Handle Display Sales Person Data
  HandleDisplaySalesPersonData(sData) {
    //get Companies
    let self = this;
    var mydata = sData; //JSON.parse(data);

    //get Companies
    const finalNode = [];
    const checkedNode = [];

    for (let i = 0; i < mydata.length; i++) {
      var checkparenttempData = finalNode.filter(
        data => data.value == mydata[i].OfficeID
      );
      if (checkparenttempData.length == 0 || i == 0) {
        var OfficeIDData = mydata.filter(
          x => x.OfficeID === mydata[i].OfficeID
        );

        var parentTempObj = {};
        var child1tempData = [];

        for (let j = 0; j < OfficeIDData.length; j++) {
          var checkchild1tempData = child1tempData.filter(
            data => data.value == OfficeIDData[j].ContactID
          );
          if (checkchild1tempData.length == 0 || j == 0) {
            var child1tempObj = {};
            var ContactIDData = OfficeIDData.filter(
              x => x.ContactID === OfficeIDData[j].ContactID
            );
            var Company_IDTempData = [];
            for (let k = 0; k < ContactIDData.length; k++) {
              var CompanyDataObj = {};
              CompanyDataObj.label = ContactIDData[k].Company_Name;
              CompanyDataObj.value = ContactIDData[k].Company_ID;
              Company_IDTempData.push(CompanyDataObj);
              if (ContactIDData[k].ISCompMapped) {
                checkedNode.push(ContactIDData[k].Company_ID);
              }
            }
            child1tempObj.label = OfficeIDData[j].ContactDisplayName;
            child1tempObj.value = OfficeIDData[j].ContactID;
            child1tempObj.children = Company_IDTempData;
            child1tempData.push(child1tempObj);
          }
        }
        parentTempObj.label = mydata[i].OfficeShortName;
        parentTempObj.value = mydata[i].OfficeID;
        parentTempObj.children = child1tempData;
        finalNode.push(parentTempObj);
      }
    }

    self.setState({ nodes: finalNode, checked: checkedNode });
  }
  ////toggle sales person modal popup
  toggleSalesLogin() {
    let self = this;
    self.setState({ modalSalesLogin: false, loading: false });
  }

  ////Handle selected sales person to pass API
  toggleSalesLoginPage() {
    var checkedCompData = this.state.checked;
    var finalselectedData = [];
    let self = this;
    for (var i = 0; i < checkedCompData.length; i++) {
      finalselectedData.push(parseInt(checkedCompData[i]));
    }
    axios({
      method: "post",
      url: `${appSettings.APIURL}/SaveSalesUserCompanyList`,
      dl̥ata: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        CompanyID: finalselectedData
      },
      headers: authHeader()
    })
      .then(function(response) {
        self.props.history.push("/rate-search");
      })
      .catch(error => {});
  }

  handlechange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  ////Handle Login Button Click
  HandleLoginSubmit(e) {
    let self = this;
    e.preventDefault();
    this.setState({ submitted: true, loading: true });
    const { username, password } = this.state;
    window.localStorage.setItem("password", encryption(password, "enc"));
    if (username !== "" && password !== "") {
      var ipaddress = window.localStorage.getItem("ipaddress");
      axios({
        method: "post",
        url: `${appSettings.APIURL}/Login`,
        data: {
          UserName: username,
          Password: password,
          publicIPAddress: ipaddress,
          PrivateIPAddress: ""
        },
        headers: authHeader("no")
      })
        .then(function(response) {
          var data = response.data;
          window.localStorage.setItem("st", new Date());
          window.localStorage.setItem(
            "username",
            encryption(data.Table[0].UserName, "enc")
          );
          window.localStorage.setItem("isColepse", false);
          window.localStorage.setItem(
            "firstname",
            encryption(data.Table[0].FirstName, "enc")
          );
          window.localStorage.setItem(
            "isAdmin",
            encryption(data.Table[0].isAdmin, "enc")
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
          var obj = new Object();
          obj.CurrencyCode = "USD";
          obj.BaseCurrencyName = "US Dollars";
          window.localStorage.setItem("currencyObj", JSON.stringify(obj));
          window.localStorage.setItem("currencyCode", "USD");
          window.localStorage.removeItem("myUserId");
          window.localStorage.setItem("myUserId", data.Table[0].UserId);
          window.localStorage.removeItem("APIUrl");
          window.localStorage.setItem("APIUrl", `${appSettings.APIURL}`);
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
          if (data.Table[0].UserLogo) {
            window.localStorage.setItem(
              "UserLogo",
              encryption(data.Table[0].UserLogo, "enc")
            );
          }
          if (data.Table[0].UserType == "Customer") {
            window.localStorage.setItem(
              "contactname",
              encryption(data.Table[0].ContactName, "enc")
            );
            window.localStorage.setItem(
              "companyaddress",
              encryption(data.Table[0].CompanyAddress, "enc")
            );
            window.localStorage.setItem(
              "companyid",
              encryption(data.Table[0].CompanyID, "enc")
            );
          }
          window.localStorage.setItem(
            "emailid",
            encryption(data.Table[0].email_id, "enc")
          );
          ////
          window.localStorage.setItem("IsEnabled", data.Table[0].IsEnabled);
          GenerateToken(username, password);
          var userType = response.data.Table;
          var userTypeName = userType[0].UserType;
          var ProfileTypen = userType[0].ProfileType;
          var SalesCompanyPopupFlag = userType[0].SalesCompanyPopupFlag;
          if (userTypeName === "Sales User" && SalesCompanyPopupFlag === 1) {
            //
            if (
              userTypeName === "Sales User" &&
              ProfileTypen &&
              SalesCompanyPopupFlag === 1
            ) {
              var sData = response.data.Table3;
              //
              self.HandleDisplaySalesPersonData(sData);
              self.setState({
                modalSalesLogin: !self.state.modalSalesLogin
              });
            }
          } else if (
            userTypeName === "Sales User" &&
            SalesCompanyPopupFlag === 0
          ) {
            setTimeout(function() {
              window.location.href = "./rate-search";
            }, 300);
          } else {
            setTimeout(function() {
              window.location.href = "./dashboard";
            }, 300);
          }
        })
        .catch(error => {
          this.setState({ loading: false });
          var temperror = "";
          if (error.response == undefined) {
            temperror = error.message;
            NotificationManager.error(temperror);
          } else {
            temperror = error.response.data;
            var err = temperror.split(":");
            NotificationManager.error(err[1].replace("}", ""));
          }

          // this.state.usernamee = '';
          this.setState({ username: "", password: "" });
          setTimeout(5000);
        });
    } else {
      //
      this.setState({ settoaste: true, loading: true });

      var error = username === "" ? "Please enter the username\n" : "";
      error += password === "" ? "Please enter the password" : "";

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
      window.localStorage.setItem("ipaddress", await publicIp.v4());
    })();
  }
  render() {
    let self = this;
    const { loading } = this.state;
    return (
      <section className="login-between">
        <div className="login-sect">
          <div className="logo">
            <img src={Logo} alt="logo" />
            <br />
            <br />
          </div>
          <form onSubmit={this.HandleLoginSubmit}>
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
                  <a href="./forgotPassword">Forgot Password?</a>
                </div>
                <div className="text-right">
                  {self.state.modalSalesLogin != true ? (
                    <button
                      onClick={this.HandleLoginSubmit}
                      type="submit"
                      className="butn login-butn"
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
                      onClick={this.HandleLoginSubmit}
                      type="submit"
                      className="butn login-butn"
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
            <button
              type="button"
              style={{ top: "-12px", right: "-15px" }}
              className="close"
              data-dismiss="modal"
              onClick={this.toggleSalesLogin}
            >
              <span>&times;</span>
            </button>
            <ModalHeader>Sales User</ModalHeader>
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
        <NotificationContainer leaveTimeout={appSettings.NotficationTime} />
      </section>
    );
  }
}
////Generate Token
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
////Token Handle Response
function TokenhandleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
    } else {
      window.localStorage.removeItem("token");
      window.localStorage.setItem(
        "token",
        encryption(data.access_token, "enc")
      );
      window.localStorage.removeItem("myToken");
      window.localStorage.setItem("myToken", data.access_token);
      if (window.localStorage.getItem("IsEnabled") == "true") {
        if (
          encryption(window.localStorage.getItem("usertype"), "desc") ==
          "Sales User"
        ) {
        } else {
        }
      } else {
        window.location.href = "./user-agreement";
      }
    }
  });
}
export default Login;

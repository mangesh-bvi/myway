import React from "react";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import FileUpload from "./../assets/img/file.png";
import Delete from "./../assets/img/red-delete-icon.png";
import { encryption } from "../helpers/encryption";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

var string = "";
class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      values: [],
      selectCountry: [],
      selectIsEnable: [
        { key: false, value: "False" },
        { key: true, value: "True" }
      ],
      selectUserCreate: [
        { key: 0, value: "False" },
        { key: 1, value: "True" }
      ],
      selectUserType: [],
      selectIsAdmin: [
        { key: "N", value: "No" },
        { key: "Y", value: "Yes" }
      ],
      selectEnable: [
        { key: true, value: "True" },
        { key: false, value: "False" }
      ],
      selectImpExp: [],
      selectCompany: [],
      chkModeOfTrans: [],
      hideDocument: [],
      miscelleneous: [],
      accessrights: [],
      username: "",
      password: "",
      submitted: false,
      modeoftrans: "",
      companies: [],
      isConsignee: false,
      isShipper: false,
      isChecked: [],
      fields: {},
      errors: {},
      IsEmailExist: false,
      errorMessage: "",
      errorMessage1: "",
      IsUserExist: false,
      srnos: "",
      username: "",
      Documents: "",
      AccessIDs: "",
      RegCompany: [],
      editRegCompany: [],
      selectedFile: null,
      disabled: true,
      IsMobileEnabled: false,
      selectedFileName: ""
    };

    this.HandleChangeInput = this.HandleChangeInput.bind(this);
    this.HandleCreateUser = this.HandleCreateUser.bind(this);
    this.HandleUpdateUser = this.HandleUpdateUser.bind(this);
  }

  createUI() {
    let i = 0;
    return this.state.values.map((el, index) => {
      if (el.includes("e")) {
        if (!el.includes(index)) {
          i = index + 1;
        } else {
          i = index;
        }
        return (
          <div key={index + 1}>
            {
              <div>
                {
                  <select
                    onChange={el => this.HandleChangeCompany1(el, index)}
                    name={"Company" + (index + 1)}
                    value={this.state.editRegCompany[i].RegCompID}
                  >
                    <option key={"Select"} value={"Select"}>
                      --Select--
                    </option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
                  </select>
                }
                {(() => {
                  if (i > 0) {
                    return (
                      <button
                        id={"remove" + (index + 1)}
                        className="dynamic-remove"
                        onClick={this.removeClick.bind(this, index)}
                      >
                        <img src={Delete} alt="delete icon" />
                      </button>
                    );
                  }
                })()}
                {(() => {
                  if (
                    this.state.editRegCompany[i].CompType.includes("C,S") ||
                    this.state.editRegCompany[i].CompType.includes("S,C")
                  ) {
                    return (
                      <div className="remember-forgot">
                        <div>
                          <input
                            id={"Consignee" + (index + 1)}
                            type="checkbox"
                            name={"Consignee" + (index + 1)}
                            defaultChecked={true}
                            onChange={this.toggleChangeCon1.bind(
                              this,
                              index,
                              "C"
                            )}
                          />
                          <label htmlFor={"Consignee" + (index + 1)}>
                            Consignee
                          </label>
                        </div>
                        <div>
                          <input
                            id={"Shipper" + (index + 1)}
                            type="checkbox"
                            name={"Shipper" + (index + 1)}
                            defaultChecked={true}
                            onChange={this.toggleChangeShip1.bind(
                              this,
                              index,
                              "S"
                            )}
                          />
                          <label htmlFor={"Shipper" + (index + 1)}>
                            Shipper
                          </label>
                        </div>
                      </div>
                    );
                  } else if (
                    this.state.editRegCompany[i].CompType.includes("S")
                  ) {
                    return (
                      <div className="remember-forgot">
                        <div>
                          <input
                            id={"Consignee" + (index + 1)}
                            type="checkbox"
                            name={"Consignee" + (index + 1)}
                            onChange={this.toggleChangeCon1.bind(
                              this,
                              index,
                              "C"
                            )}
                          />
                          <label htmlFor={"Consignee" + (index + 1)}>
                            Consignee
                          </label>
                        </div>
                        <div>
                          <input
                            id={"Shipper" + (index + 1)}
                            type="checkbox"
                            name={"Shipper" + (index + 1)}
                            defaultChecked={true}
                            onChange={this.toggleChangeShip1.bind(
                              this,
                              index,
                              "S"
                            )}
                          />
                          <label htmlFor={"Shipper" + (index + 1)}>
                            Shipper
                          </label>
                        </div>
                      </div>
                    );
                  } else if (
                    this.state.editRegCompany[i].CompType.includes("C")
                  ) {
                    return (
                      <div className="remember-forgot">
                        <div>
                          <input
                            id={"Consignee" + (index + 1)}
                            type="checkbox"
                            name="Consignee"
                            defaultChecked={true}
                            onChange={this.toggleChangeCon1.bind(
                              this,
                              index,
                              "C"
                            )}
                          />
                          <label htmlFor={"Consignee" + (index + 1)}>
                            Consignee
                          </label>
                        </div>
                        <div>
                          <input
                            id={"Shipper" + (index + 1)}
                            type="checkbox"
                            name="Shipper"
                            onChange={this.toggleChangeShip1.bind(
                              this,
                              index,
                              "S"
                            )}
                          />
                          <label htmlFor={"Shipper" + (index + 1)}>
                            Shipper
                          </label>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="remember-forgot">
                        <div>
                          <input
                            id={"Consignee" + (index + 1)}
                            type="checkbox"
                            name="Consignee"
                            onChange={this.toggleChangeCon1.bind(
                              this,
                              index,
                              "C"
                            )}
                          />
                          <label htmlFor={"Consignee" + (index + 1)}>
                            Consignee
                          </label>
                        </div>
                        <div>
                          <input
                            id={"Shipper" + (index + 1)}
                            type="checkbox"
                            name="Shipper"
                            onChange={this.toggleChangeShip1.bind(
                              this,
                              index,
                              "S"
                            )}
                          />
                          <label htmlFor={"Shipper" + (index + 1)}>
                            Shipper
                          </label>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            }
          </div>
        );
      } else if (el.includes("d")) {
        return (
          <div>
            <select
              onChange={el => this.HandleChangeCompany1(el, index)}
              name={"Company"}
            >
              <option key={"Select"} value={"Select"}>
                --Select--
              </option>
              {this.state.selectCompany.map(team => (
                <option key={team.RegCompID} value={team.RegCompID}>
                  {team.RegCompName}
                </option>
              ))}
            </select>

            <div className="remember-forgot">
              <div>
                <input
                  id={"Consignee"}
                  type="checkbox"
                  name={"Consignee"}
                  onChange={this.toggleChangeCon.bind(this, "C")}
                />
                <label htmlFor={"Consignee"}>Consignee</label>
              </div>
              <div>
                <input
                  id={"Shipper"}
                  type="checkbox"
                  name={"Shipper"}
                  onChange={this.toggleChangeShip.bind(this, "S")}
                />
                <label htmlFor={"Shipper"}>Shipper</label>
              </div>
            </div>
          </div>
        );
      } else if (el.includes("a")) {
        return (
          <div>
            <select
              onChange={el => this.HandleChangeCompany1(el, index)}
              name={"Company"}
            >
              <option key={"Select"} value={"Select"}>
                --Select--
              </option>
              {this.state.selectCompany.map(team => (
                <option key={team.RegCompID} value={team.RegCompID}>
                  {team.RegCompName}
                </option>
              ))}
            </select>
            <div className="remember-forgot">
              <div>
                <input
                  id="Consignee"
                  type="checkbox"
                  name="Consignee"
                  disabled={this.state.disabled}
                  onChange={this.toggleChangeCon.bind(this, "C")}
                />
                <label htmlFor="Consignee">Consignee</label>
              </div>
              <div>
                <input
                  id="Shipper"
                  type="checkbox"
                  name="Shipper"
                  disabled={this.state.disabled}
                  onChange={this.toggleChangeShip.bind(this, "S")}
                />
                <label htmlFor="Shipper">Shipper</label>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index + 1}>
            <select
              onChange={el => this.HandleChangeCompany1(el, index)}
              name={"Company" + (index + 1)}
            >
              <option key={"Select"} value={"Select"}>
                --Select--
              </option>
              {this.state.selectCompany.map(team => (
                <option key={team.RegCompID} value={team.RegCompID}>
                  {team.RegCompName}
                </option>
              ))}
            </select>
            <button
              id={"remove" + (index + 1)}
              className="dynamic-remove"
              onClick={this.removeClick.bind(this, index)}
            >
              <img src={Delete} alt="delete icon" />
            </button>
            <div className="remember-forgot">
              <div>
                <input
                  id={"Consignee" + (index + 1)}
                  type="checkbox"
                  name={"Consignee" + (index + 1)}
                  onChange={this.toggleChangeCon1.bind(this, index, "C")}
                />
                <label htmlFor={"Consignee" + (index + 1)}>Consignee</label>
              </div>
              <div>
                <input
                  id={"Shipper" + (index + 1)}
                  type="checkbox"
                  name={"Shipper" + (index + 1)}
                  onChange={this.toggleChangeShip1.bind(this, index, "S")}
                />
                <label htmlFor={"Shipper" + (index + 1)}>Shipper</label>
              </div>
            </div>
          </div>
        );
      }
    });
  }

  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    if (e.target.value == "Select") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields
    });
  }

  HandleChangeCompany(e) {
    if (this.state.editRegCompany.length < 1) {
      this.state.companies[0] = e.target.value;
      this.state.editRegCompany.push({
        CompType: "",
        RegCompID: this.state.companies[0],
        IsEnable: true
      });
    } else {
      this.state.editRegCompany[0].RegCompID = e.target.value;
    }
    this.setState({
      disabled: !this.state.disabled
    });
    //this.setState({values: this.state.values})
  }

  HandleChangeCompany1(e, index) {
    if (e.target.value == "Select") {
      this.state.disabled = true;
      this.state.editRegCompany[index].CompType = "";
    } else {
      if (this.state.editRegCompany.length < index + 1) {
        this.state.editRegCompany.push({
          CompType: "",
          RegCompID: parseInt(e.target.value),
          IsEnable: true,
          IsDelete: false
        });
        // this.setState({values: this.state.values})
      } else {
        this.state.editRegCompany[index].RegCompID = e.target.value;
        this.state.editRegCompany[index].IsDelete = false;
      }
      this.state.disabled = false;
    }
    this.setState({
      editRegCompany: this.state.editRegCompany,
      disabled: this.state.disabled
    });
    //e.preventDefault();
  }

  componentWillMount() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindUserCreationDropdown`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    })
      .then(function(response) {
        let MOD = [];
        let arr = [];
        let arrDoc = [];
        let arrAcc = [];
        arr = self.state.modeoftrans.split(",");
        arrDoc = self.state.Documents;
        arrAcc = self.state.AccessIDs.slice(0, -1).split(",");
        for (const [index, value] of response.data.Table3.entries()) {
          if (arr.includes(value.ID)) {
            MOD.push({ ID: value.ID, Value: value.Value, IsSelected: 1 });
          } else {
            MOD.push({ ID: value.ID, Value: value.Value, IsSelected: 0 });
          }
        }
        for (const [index, value] of response.data.Table5.entries()) {
          if (arrDoc.includes(value.DocumentID)) {
            self.state.hideDocument.push({
              DocumentID: value.DocumentID,
              DocumentName: value.DocumentName,
              IsSelected: 1
            });
          } else {
            self.state.hideDocument.push({
              DocumentID: value.DocumentID,
              DocumentName: value.DocumentName,
              IsSelected: 0
            });
          }
        }

        for (const [index, value] of response.data.Table7.entries()) {
          if (arrAcc.includes(value.id.toString())) {
            self.state.accessrights.push({
              id: value.id,
              Value: value.Value,
              IsSelected: 1
            });
          } else {
            self.state.accessrights.push({
              id: value.id,
              Value: value.Value,
              IsSelected: 0
            });
          }
        }

        self.setState({
          selectCountry: response.data.Table,
          selectUserType: response.data.Table1,
          selectImpExp: response.data.Table2,
          selectCompany: response.data.Table4,
          chkModeOfTrans: MOD,
          hideDocument: self.state.hideDocument,
          miscelleneous: response.data.Table6,
          accessrights: self.state.accessrights
        });
      })
      .catch(response => {
        
      });
  }
  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ""] }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    if (this.state.editRegCompany.length > i) {
      this.state.editRegCompany[i].IsDelete = true;
    }
    this.setState({ values, editRegCompan: this.state.editRegCompany });
  }
  /////Handle Change Input Filed
  HandleChangeInput(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
  }
  ////Handle Check Mail Address exiest or not
  HandleCheckEmail(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
    let errors = this.state.errors;
    let formIsValid = true;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CheckEmailIDExists`,
      data: {
        EmailID: this.state.fields["emailid"],
        ProfileType: 1
      },
      headers: authHeader()
    }).then(function(response) {
      if (
        response.data[0].CanCreateUser == 1 &&
        response.data[0].Result == "User Not Found"
      ) {
        self.setState({
          IsEmailExist: false,
          errorMessage: ""
        });
      } else {
        self.setState({
          IsEmailExist: true,
          errorMessage: response.data[0].Result
        });
        formIsValid = false;
        errors["emailid"] = self.state.errorMessage;
        self.setState({ errors: errors });
      }

      return formIsValid;
    });
  }
  ////Handle Check User Name exists or not
  HandleCheckUserName(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
    let errors = this.state.errors;
    let formIsValid = true;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/CheckUserNameExists`,
      data: {
        UserName: this.state.fields["username"]
      },
      headers: authHeader()
    })
      .then(function(response) {
        self.setState({
          IsUserExist: true,
          errorMessage1: response.data[0].UserName + " already exists"
        });
        formIsValid = false;
        errors["username"] = self.state.errorMessage1;
        self.setState({ errors: errors });
      })
      .catch(error => {
        self.setState({
          IsUserExist: false,
          errorMessage1: ""
        });
        errors["username"] = "";
        self.setState({ errors: errors });
      });
    return formIsValid;
  }
  toggleChange(index, name, event) {
    if ([this.state.chkModeOfTrans[index].IsSelected] == 0) {
      this.setState({
        [this.state.chkModeOfTrans[index].IsSelected]: [
          (this.state.chkModeOfTrans[index].IsSelected = 1)
        ]
      });
    } else {
      this.setState({
        [this.state.chkModeOfTrans[index].IsSelected]: [
          (this.state.chkModeOfTrans[index].IsSelected = 0)
        ]
      });
    }
  }

  toggleMobileChange(field, e) {
    let fields = this.state.fields;
    fields[field] = !this.state.IsMobileEnabled;
    this.setState({
      IsMobileEnabled: !this.state.IsMobileEnabled,
      fields
    });
  }

  toggleChangeCon(name, event) {
    if (this.state.editRegCompany[0].CompType.includes("C") != true) {
      this.state.editRegCompany[0].CompType += "," + name;
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[0].CompType.includes("S")) {
        this.state.editRegCompany[0].CompType = ",S";
      } else {
        this.state.editRegCompany[0].CompType = "";
      }
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeCon1(index, name, event) {
    if (this.state.editRegCompany[index].CompType.includes("C") != true) {
      this.state.editRegCompany[index].CompType += "," + name;
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[index].CompType.includes("S")) {
        this.state.editRegCompany[index].CompType = ",S";
      } else {
        this.state.editRegCompany[index].CompType = "";
      }
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeShip(name, event) {
    if (this.state.editRegCompany[0].CompType.includes("S") != true) {
      this.state.editRegCompany[0].CompType += "," + name;
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[0].CompType.includes("C")) {
        this.state.editRegCompany[0].CompType = "C,";
      } else {
        this.state.editRegCompany[0].CompType = "";
      }
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeShip1(index, name, event) {
    if (this.state.editRegCompany[index].CompType.includes("S") != true) {
      this.state.editRegCompany[index].CompType += "," + name;
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[index].CompType.includes("C")) {
        this.state.editRegCompany[index].CompType = "C,";
      } else {
        this.state.editRegCompany[index].CompType = "";
      }
      this.setState({
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeAccRight(index, e) {
    if ([this.state.accessrights[index].IsSelected] == 0) {
      this.setState({
        [this.state.accessrights[index].IsSelected]: [
          (this.state.accessrights[index].IsSelected = 1)
        ]
      });
    } else {
      this.setState({
        [this.state.accessrights[index].IsSelected]: [
          (this.state.accessrights[index].IsSelected = 0)
        ]
      });
    }
  }

  toggleChangeHideDoc(index, e) {
    if ([this.state.hideDocument[index].IsSelected] == 0) {
      this.setState({
        [this.state.hideDocument[index].IsSelected]: [
          (this.state.hideDocument[index].IsSelected = 1)
        ]
      });
    } else {
      this.setState({
        [this.state.hideDocument[index].IsSelected]: [
          (this.state.hideDocument[index].IsSelected = 0)
        ]
      });
    }
  }
  handleValidation() {
    let fields = this.state.fields;
    let errors = this.state.errors;
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Enter user name";
    }

    if (this.props.location.state == undefined) {
      if (!fields["password"]) {
        formIsValid = false;
        errors["password"] = "Enter password";
      }
    }
    if (!fields["emailid"]) {
      formIsValid = false;
      errors["emailid"] = "Enter email id";
    }
    if (!fields["firstname"]) {
      formIsValid = false;
      errors["firstname"] = "Enter first name";
    }
    if (!fields["lastname"]) {
      formIsValid = false;
      errors["lastname"] = "Enter last name";
    }
    if (!fields["country"]) {
      formIsValid = false;
      errors["country"] = "Select country";
    }
    if (this.state.IsEmailExist == true) {
      formIsValid = false;
      errors["emailid"] = this.state.errorMessage;
    }
    if (this.state.IsUserExist == true) {
      formIsValid = false;
      errors["username"] = this.state.errorMessage1;
    }
    if (
      parseInt(fields["refreshtime"]) < 6 ||
      parseInt(fields["refreshtime"]) > 1440
    ) {
      formIsValid = false;
      errors["refreshtime"] = "Minutes Between 6 To 1440";
    }
    if (this.state.selectedFile == null) {
      formIsValid = false;
      errors["logoFile"] = "Select file";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }
  ////Handle Create User with Document
  HandleCreateUser(e) {
    debugger;
    const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    this.setState({ submitted: true });
    let ModeOfTransport = "";
    let Document = "";
    var RegisteredCompany = "";
    var Modules = "";
    this.setState({ loading: true });

    for (const [index, value] of this.state.chkModeOfTrans.entries()) {
      if (value.ID == "A" && value.IsSelected == 1) {
        ModeOfTransport += "A,";
      }
      if (value.ID == "O" && value.IsSelected == 1) {
        ModeOfTransport += "O,";
      }
      if (value.ID == "L" && value.IsSelected == 1) {
        ModeOfTransport += "L,";
      }
    }
    ModeOfTransport = ModeOfTransport.slice(0, -1);

    for (const [index, value] of this.state.editRegCompany.entries()) {
      if (value.IsDelete == false) {
        if (value.CompType.includes("C") && value.CompType.includes("S")) {
          this.state.RegCompany.push(value.RegCompID + ":C");
          this.state.RegCompany.push(value.RegCompID + ":S");
        } else if (value.CompType.includes("C")) {
          this.state.RegCompany.push(value.RegCompID + ":C");
        } else if (value.CompType.includes("S")) {
          this.state.RegCompany.push(value.RegCompID + ":S");
        }
      }
    }

    RegisteredCompany = this.state.RegCompany.toString();
    this.state.hideDocument.map((hideDocument, index) => {
      if (this.state.hideDocument[index].IsSelected == true) {
        Document += this.state.hideDocument[index].DocumentID + ",";
      }
    });
    Document = Document.slice(0, -1);

    this.state.accessrights.map((accessrights, index) => {
      if (this.state.accessrights[index].IsSelected == true) {
        Modules += this.state.accessrights[index].id + ",";
      }
    });

    Modules = Modules.slice(0, -1);
    if (
      this.state.fields["usertype"] == undefined ||
      this.state.fields["usertype"] == ""
    ) {
      this.state.fields["usertype"] = this.state.selectUserType[0].UserType;
    }
    if (
      this.state.fields["isenabled"] == undefined ||
      this.state.fields["isenabled"] == ""
    ) {
      this.state.fields["isenabled"] = this.state.selectEnable[0].key;
    }
    if (
      this.state.fields["isadmin"] == undefined ||
      this.state.fields["isadmin"] == ""
    ) {
      this.state.fields["isadmin"] = this.state.selectIsAdmin[0].key;
    }
    if (
      this.state.fields["ImpExp"] == undefined ||
      this.state.fields["ImpExp"] == ""
    ) {
      this.state.fields["ImpExp"] = this.state.selectImpExp[0].ID;
    }
    if (
      this.state.fields["displayShipper"] == undefined ||
      this.state.fields["displayShipper"] == ""
    ) {
      this.state.fields["displayShipper"] = this.state.selectIsEnable[0].key;
    }
    if (
      this.state.fields["displayConsignee"] == undefined ||
      this.state.fields["displayConsignee"] == ""
    ) {
      this.state.fields["displayConsignee"] = this.state.selectIsEnable[0].key;
    }
    if (
      this.state.fields["usercreation"] == undefined ||
      this.state.fields["usercreation"] == ""
    ) {
      this.state.fields["usercreation"] = this.state.selectUserCreate[0].key;
    }

    docData.append("UserName", this.state.fields["username"]);
    docData.append("Password", this.state.fields["password"]);
    docData.append("IsEnabled", this.state.fields["isenabled"]);
    docData.append("ClientAdminID", 0);
    docData.append("DisplayAsShipper", this.state.fields["displayShipper"]);
    docData.append("DisplayAsConsignee", this.state.fields["displayConsignee"]);
    docData.append("UserType", this.state.fields["usertype"]);
    docData.append("ModeOfTransport", ModeOfTransport);
    docData.append("CanCreateUser", this.state.fields["usercreation"]);
    docData.append("CreatedBy", userid);
    docData.append("EmailID", this.state.fields["emailid"]);
    docData.append("ImpExp", this.state.fields["ImpExp"]);
    docData.append("IsAdmin", this.state.fields["isadmin"]);
    docData.append("IsMywayUser", "Y");
    docData.append("MywayUserName", this.state.fields["username"]);
    docData.append("MywayPassword", "");
    docData.append("FirstName", this.state.fields["firstname"]);
    docData.append("LastName", this.state.fields["lastname"]);
    docData.append("CountryCode", this.state.fields["country"]);
    docData.append("RefreshTime", this.state.fields["refreshtime"]);
    docData.append("IsNew", true);
    docData.append("IsMobileEnabled", this.state.IsMobileEnabled);
    docData.append("ProfileType", 1);
    docData.append("ProfileSubType", 0);
    docData.append("HasMobileAccess", true);
    docData.append("ModuleID", Modules);
    docData.append("DocumentID", Document);
    docData.append("IsHideInvoiceDetails", true);
    docData.append("IsHideHBLShowMBLDocument", true);
    docData.append("Logo", this.state.selectedFile);
    docData.append("RegisteredCompany", RegisteredCompany);

    if (this.handleValidation()) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CreateUserWithDoc`,
        data: docData,

        headers: authHeader()
      })
        .then(function(response) {
          store.addNotification({
            // title: "Success",
            message: response.data[0].Message,
            type: "success", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime
            }
          });
          setTimeout(function() {
            window.location.href = "/add-user";
          }, appSettings.NotficationTime);
        })
        .catch(error => {
          store.addNotification({
            // title: "Error",
            message: error.response.data.split("'")[1],
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime
            }
          });
        });
    } else {
      this.setState({ settoaste: true, loading: false });
    }
  }
  ////Handle Update User With Document
  HandleUpdateUser(e) {
    const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    this.setState({ submitted: true });
    let ModeOfTransport = "";
    let Document = "";
    var RegisteredCompany = "";
    var Modules = "";

    for (const [index, value] of this.state.chkModeOfTrans.entries()) {
      if (value.ID == "A" && value.IsSelected == 1) {
        ModeOfTransport += "A,";
      }
      if (value.ID == "O" && value.IsSelected == 1) {
        ModeOfTransport += "O,";
      }
      if (value.ID == "L" && value.IsSelected == 1) {
        ModeOfTransport += "L,";
      }
    }
    ModeOfTransport = ModeOfTransport.slice(0, -1);

    for (const [index, value] of this.state.editRegCompany.entries()) {
      if (value.IsDelete == false) {
        if (value.CompType.includes("C") && value.CompType.includes("S")) {
          this.state.RegCompany.push(value.RegCompID + ":C");
          this.state.RegCompany.push(value.RegCompID + ":S");
        } else if (value.CompType.includes("C")) {
          this.state.RegCompany.push(value.RegCompID + ":C");
        } else if (value.CompType.includes("S")) {
          this.state.RegCompany.push(value.RegCompID + ":S");
        }
      }
    }

    RegisteredCompany = this.state.RegCompany.toString();
    this.state.hideDocument.map((hideDocument, index) => {
      if (this.state.hideDocument[index].IsSelected == true) {
        Document += this.state.hideDocument[index].DocumentID + ",";
      }
    });
    Document = Document.slice(0, -1);

    this.state.accessrights.map((accessrights, index) => {
      if (this.state.accessrights[index].IsSelected == true) {
        Modules += this.state.accessrights[index].id + ",";
      }
    });

    Modules = Modules.slice(0, -1);

    docData.append("UserID", this.props.location.state.detail);
    docData.append("UserName", this.state.fields["username"]);
    docData.append("Password", this.state.fields["password"]);
    docData.append("IsEnabled", this.state.fields["isenabled"]);
    docData.append("ClientAdminID", 0);
    docData.append("DisplayAsShipper", this.state.fields["displayShipper"]);
    docData.append("DisplayAsConsignee", this.state.fields["displayConsignee"]);
    docData.append("UserType", this.state.fields["usertype"]);
    docData.append("ModeOfTransport", ModeOfTransport);
    docData.append("CanCreateUser", this.state.fields["usercreation"]);
    docData.append("CreatedBy", userid);
    docData.append("EmailID", this.state.fields["emailid"]);
    docData.append("ImpExp", this.state.fields["ImpExp"]);
    docData.append("IsAdmin", this.state.fields["isadmin"]);
    docData.append("IsMywayUser", "Y");
    docData.append("MywayUserName", this.state.fields["username"]);
    docData.append("MywayPassword", "");
    docData.append("FirstName", this.state.fields["firstname"]);
    docData.append("LastName", this.state.fields["lastname"]);
    docData.append("CountryCode", this.state.fields["country"]);
    docData.append("RefreshTime", this.state.fields["refreshtime"]);
    docData.append("IsNew", true);
    docData.append("IsMobileEnabled", this.state.fields["MobileEnabled"]);
    docData.append("ProfileType", 1);
    docData.append("ProfileSubType", 0);
    docData.append("HasMobileAccess", true);
    docData.append("ModuleID", Modules);
    docData.append("DocumentID", Document);
    docData.append(
      "IsHideInvoiceDetails",
      this.state.miscelleneous[0].IsSelected
    );
    docData.append(
      "IsHideHBLShowMBLDocument",
      this.state.miscelleneous[1].IsSelected
    );
    docData.append("Logo", this.state.selectedFile);
    docData.append("RegisteredCompany", RegisteredCompany);
    if (this.handleValidation()) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/UpdateUserWithDoc`,
        data: docData,

        headers: authHeader()
      })
        .then(function(response) {
          store.addNotification({
            // title: "Success",
            message: response.data[0].Result,
            type: "success", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime
            }
          });

          setTimeout(function() {
            window.location.href = "/view-user";
          }, appSettings.NotficationTime);
        })
        .catch(error => {
          store.addNotification({
            // title: "Error",
            message: error.response.data.split("'")[1],
            type: "danger", // 'default', 'success', 'info', 'warning','danger'
            container: "top-right", // where to position the notifications
            dismiss: {
              duration: appSettings.NotficationTime
            }
          });
        });
    } else {
      this.setState({ settoaste: true, loading: true });
    }
  }

  componentDidMount() {
    if (this.props.location.state != undefined) {
      var userId = this.props.location.state.detail;
      let fields = this.state.fields;
      this.setState({ srnos: userId });

      let self = this;
      axios({
        method: "post",
        url: `${appSettings.APIURL}/UserDataForEdit`,
        data: {
          UserID: userId
        },
        headers: authHeader()
      }).then(function(response) {
        fields["username"] = response.data.Table[0].UserName;
        fields["emailid"] = response.data.Table[0].email_id;
        fields["firstname"] = response.data.Table[0].FirstName;
        fields["lastname"] = response.data.Table[0].LastName;
        fields["country"] = response.data.Table[0].CountryCode;
        fields["refreshtime"] = response.data.Table[0].DashboardRefreshTime;
        fields["isenabled"] = response.data.Table[0].IsEnabled;
        fields["usertype"] = response.data.Table[0].UserType;
        if (response.data.Table[0].CanCreateUser == true) {
          fields["usercreation"] = 1;
        } else {
          fields["usercreation"] = 0;
        }

        fields["isadmin"] = response.data.Table[0].IsAdmin;
        fields["ImpExp"] = response.data.Table[0].ImpExp;
        fields["displayShipper"] = response.data.Table[0].DisplayAsShipper;
        fields["displayConsignee"] = response.data.Table[0].DisplayAsConsignee;
        fields["MobileEnabled"] = response.data.Table[0].HasMobileAccess;

        for (const [index, value] of response.data.Table3.entries()) {
          self.state.Documents += value.DocumentID + ",";
        }

        for (const [index, value] of response.data.Table1.entries()) {
          self.state.AccessIDs += value.Module_id + ",";
        }

        var arr = "";
        var arrfinal = [];
        var arrCompany = [];
        var arrData = response.data.Table2;
        var i = 0;
        if (arrData.length > 0) {
          for (let k = 0; k < arrData.length; k++) {
            if (arr.includes(arrData[k].RegCompID)) {
              var final = "";

              for (let l = 0; l < arrfinal.length; l++) {
                final = arrfinal[l].RegCompID + ",";

                if (final.includes(arrData[k].RegCompID)) {
                  arrfinal[l].CompType =
                    arrfinal[l].CompType + "," + arrData[k].CompType;
                }
              }
            } else {
              arr += arrData[k].RegCompID + ",";
              arrfinal.push(arrData[k]);
              self.state.values.push("e" + i++);
            }
          }
        } else {
          self.state.values.push("d");
        }

        for (const [index, value] of arrfinal.entries()) {
          arrCompany.push({
            CompType: value.CompType,
            RegCompID: value.RegCompID,
            IsEnabled: true,
            IsDelete: false
          });
        }

        self.setState({
          fields,
          modeoftrans: response.data.Table[0].ModeOfTransport,
          editRegCompany: arrCompany
        });
      });
    } else {
      this.state.values.push("a");
    }
  }

  fileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };

  render() {
    var a = 1;
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <div>
        <ReactNotification />
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <AdminSideMenu />
          </div>
          <div className="cls-rt">
            <div>
              <div className="title-sect title-border title-secpad">
                {(() => {
                  if (this.props.location.state != undefined) {
                    return <h2>Edit User</h2>;
                  } else {
                    return <h2>Add User</h2>;
                  }
                })()}
              </div>

              <div className="container add-user-cntr">
                {" "}
                {/* login-input-cntr */}
                <div className="row mt-3 title-border">
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      User Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"username"}
                      onChange={this.HandleChangeInput.bind(this, "username")}
                      placeholder="Enter Your User Name"
                      value={this.state.fields["username"]}
                      onBlur={this.HandleCheckUserName.bind(this, "username")}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["username"]}
                    </span>
                  </div>
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      Password{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="password"
                      name={"password"}
                      onChange={this.HandleChangeInput.bind(this, "password")}
                      placeholder="Enter Your Password"
                      value={this.state.fields["password"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["password"]}
                    </span>
                  </div>
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      Email Id{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"emailid"}
                      onChange={this.HandleChangeInput.bind(this, "emailid")}
                      placeholder="Enter Your Email Id"
                      value={this.state.fields["emailid"]}
                      onBlur={this.HandleCheckEmail.bind(this, "emailid")}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["emailid"]}
                    </span>
                  </div>
                </div>
                <div className="row title-border">
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      First Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"firstname"}
                      onChange={this.HandleChangeInput.bind(this, "firstname")}
                      placeholder="Enter Your First Name"
                      value={this.state.fields["firstname"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["firstname"]}
                    </span>
                  </div>
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      Last Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"lastname"}
                      onChange={this.HandleChangeInput.bind(this, "lastname")}
                      placeholder="Enter Your Last Name"
                      value={this.state.fields["lastname"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["lastname"]}
                    </span>
                  </div>
                  <div className="login-fields col-12 col-sm-4 col-md-4">
                    <label>
                      Country{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>

                    <select
                      onChange={this.HandleChangeSelect.bind(this, "country")}
                      name={"country"}
                      value={this.state.fields["country"]}
                    >
                      <option value="select" selected>
                        select
                      </option>
                      {this.state.selectCountry.map(team => (
                        <option key={team.SUCountry} value={team.SUCountry}>
                          {team.CountryName}
                        </option>
                      ))}
                    </select>
                    <span style={{ color: "red" }}>
                      {this.state.errors["country"]}
                    </span>
                  </div>
                </div>
                <div className="row title-border">
                  <div className="login-fields col-12 col-sm-12 col-md-12 col-lg-3 r-border m0-p15">
                    <label>Dashboard Refresh Time</label>
                    <input
                      type="text"
                      name={"refreshtime"}
                      value={this.state.fields["refreshtime"]}
                      onChange={this.HandleChangeInput.bind(
                        this,
                        "refreshtime"
                      )}
                      placeholder="Enter Dashboard Refresh Time"
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["refreshtime"]}
                    </span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-9">
                    <div class="row">
                      <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-3 col-xl-2">
                        <label>Is Enabled</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "isenabled"
                          )}
                          name={"isenabled"}
                          value={this.state.fields["isenabled"]}
                        >
                          {this.state.selectEnable.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                        <label>User Type</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "usertype"
                          )}
                          name={"usertype"}
                          value={this.state.fields["usertype"]}
                        >
                          {this.state.selectUserType.map(team => (
                            <option key={team.UserType} value={team.UserType}>
                              {team.UserType}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-3 col-xl-2">
                        <label>User Creation</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "usercreation"
                          )}
                          name={"usercreation"}
                          value={this.state.fields["usercreation"]}
                        >
                          {this.state.selectUserCreate.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-3 col-xl-2">
                        <label>Is Admin</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "isadmin"
                          )}
                          name={"isadmin"}
                          value={this.state.fields["isadmin"]}
                        >
                          {this.state.selectIsAdmin.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                        <label>Imp. Exp.</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "ImpExp"
                          )}
                          name={"ImpExp"}
                          value={this.state.fields["ImpExp"]}
                        >
                          {this.state.selectImpExp.map(team => (
                            <option key={team.ID} value={team.ID}>
                              {team.Value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row title-border">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-5 r-border m0-p15">
                    <div className="row">
                      <div
                        className="login-fields col-12 col-sm-6 col-md-6 col-lg-6"
                        style={{ margin: 0 }}
                      >
                        <label>Display As Shipper</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "displayShipper"
                          )}
                          name={"displayShipper"}
                          value={this.state.fields["displayShipper"]}
                        >
                          {this.state.selectIsEnable.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        className="login-fields col-12 col-sm-6 col-md-6 col-lg-6"
                        style={{ margin: "0" }}
                      >
                        <label>Display As Consignee</label>
                        <select
                          onChange={this.HandleChangeSelect.bind(
                            this,
                            "displayConsignee"
                          )}
                          name={"displayConsignee"}
                          value={this.state.fields["displayConsignee"]}
                        >
                          {this.state.selectIsEnable.map(team => (
                            <option key={team.key} value={team.key}>
                              {team.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-4 r-border m0-p15">
                    <label>Mode Of Transport</label>
                    <div className="remember-forgot">
                      {this.state.chkModeOfTrans.map(
                        (chkModeOfTrans, index) => (
                          <div key={chkModeOfTrans.ID}>
                            <input
                              id={chkModeOfTrans.ID}
                              type="checkbox"
                              name={chkModeOfTrans.Value}
                              value={chkModeOfTrans.ID}
                              defaultChecked={chkModeOfTrans.IsSelected}
                              onChange={this.toggleChange.bind(
                                this,
                                index,
                                chkModeOfTrans.Value
                              )}
                            />
                            <label htmlFor={chkModeOfTrans.ID}>
                              {chkModeOfTrans.Value}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="login-fields col-12 col-sm-6 col-md-6 col-lg-3">
                    <label>Is Mobile Enabled?</label>
                    <div
                      className="remember-forgot"
                      style={{ paddingTop: "10px" }}
                    >
                      <div>
                        <input
                          id="MobileEnable"
                          type="checkbox"
                          name="MobileEnable"
                          defaultChecked={this.state.fields["MobileEnabled"]}
                          onChange={this.toggleMobileChange.bind(
                            this,
                            "MobileEnable"
                          )}
                        />
                        <label htmlFor="MobileEnable"></label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row title-border">
                  <div className="col-12 col-sm-6 col-md-9 col-lg-9 login-fields dynamic-fields m0-p15 r-border">
                    <label>Company Name</label>

                    {this.createUI()}
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                    <input
                      type="button"
                      className="butn"
                      style={{ margin: "50px auto 0", display: "block" }}
                      value="Add Company"
                      onClick={this.addClick.bind(this)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-12">
                    <div className="br1-pd15">
                      <label className="mb-0">Hide Document('S)</label>
                      <div className="row">
                        {this.state.hideDocument.map((hideDocument, index) => (
                          <div
                            className="remember-forgot col-12 col-sm-6 col-md-6 col-lg-4"
                            key={hideDocument.DocumentID}
                          >
                            <input
                              id={hideDocument.DocumentID}
                              type="checkbox"
                              name={hideDocument.DocumentName}
                              value={hideDocument.DocumentID}
                              defaultChecked={hideDocument.IsSelected}
                              onClick={this.toggleChangeHideDoc.bind(
                                this,
                                index
                              )}
                            />
                            <label
                              className="m-0"
                              htmlFor={hideDocument.DocumentID}
                            >
                              {hideDocument.DocumentName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-12">
                    <div className="br1-pd15">
                      <label className="mb-0">Miscelleneous</label>
                      <div className="remember-forgot justify-content-start">
                        {this.state.miscelleneous.map(
                          (miscelleneous, index) => (
                            <div key={miscelleneous.InvFlag}>
                              <input
                                id={miscelleneous.InvFlag}
                                type="checkbox"
                                value={miscelleneous.InvFlag}
                                defaultChecked={miscelleneous.IsSelected}
                              />
                              <label htmlFor={miscelleneous.InvFlag}>
                                {miscelleneous.InvFlag}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-12">
                    <div className="br1-pd15">
                      <label className="mb-0">Access Rights</label>
                      <div className="row">
                        {this.state.accessrights.map((accessrights, index) => (
                          <div
                            className="remember-forgot col-12 col-sm-6 col-md-6 col-lg-3"
                            key={accessrights.id}
                          >
                            <input
                              id={accessrights.id}
                              type="checkbox"
                              value={accessrights.Value}
                              onChange={this.toggleChangeAccRight.bind(
                                this,
                                index
                              )}
                              defaultChecked={accessrights.IsSelected}
                            />
                            <label className="m-0" htmlFor={accessrights.id}>
                              {accessrights.Value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields mb-0 col-md-12">
                    <input
                      id="file-upload"
                      className="file-upload d-none"
                      type="file"
                      onChange={this.fileChangedHandler}
                      accept=".jpg, .JPG, .jpeg, .png, .gif"
                    />
                    <label htmlFor="file-upload">
                      <div className="file-icon">
                        <img src={FileUpload} alt="file-upload" />
                      </div>
                      Add Image File{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <p className="file-name w-100 text-center mt-1">
                      {this.state.selectedFileName}
                    </p>
                    <span style={{ color: "red" }}>
                      {this.state.errors["logoFile"]}
                    </span>
                  </div>
                </div>
                <div className="text-right pb-4">
                  {(() => {
                    if (this.props.location.state != undefined) {
                      return (
                        <button
                          type="button"
                          className="butn mb-2"
                          onClick={this.HandleUpdateUser}
                        >
                          Update
                        </button>
                      );
                    } else {
                      return (
                        <button
                          type="button"
                          className="butn mb-2"
                          onClick={this.HandleCreateUser}
                        >
                          {this.state.loading != true
                            ? this.state.loading && (
                                <i
                                  style={{ marginRight: 15 }}
                                  className="fa fa-refresh fa-spin"
                                ></i>
                              )
                            : null}
                          {this.state.loading ? "Please Wait ..." : "Submit"}
                        </button>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUser;

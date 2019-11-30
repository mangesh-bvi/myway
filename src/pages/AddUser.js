import React from "react";
import appSettings from "../helpers/appSetting";
// import Logo from "./../assets/img/logo.png";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import FileUpload from "./../assets/img/file.png";
import Delete from "./../assets/img/red-delete-icon.png";
import { is } from "@babel/types";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { bool } from "prop-types";

var string = "";
class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      selectCountry: [
        // { key: "1", value: "India" },
        // { key: "2", value: "USA" },
        // { key: "3", value: "UK" },
        // { key: "4", value: "Russia" },
      ],
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
      // isAir: false,
      // isOcean: false,
      // isLand: false,
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

    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
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
                      <input
                        type="button"
                        value="remove"
                        id={"remove" + (index + 1)}
                        className="dynamic-remove"
                        onClick={this.removeClick.bind(this, index)}
                      />
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
            {/* <input type='button' value='remove' id={"remove" + (index+1)} className='dynamic-remove' onClick={this.removeClick.bind(this, index)}/> */}
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
    debugger;
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
    debugger;
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
    }).then(function(response) {
      debugger;
      console.log(response);
      let MOD = [];
      let arr = [];
      let arrDoc = [];
      let arrAcc = [];
      arr = self.state.modeoftrans.split(",");
      arrDoc = self.state.Documents;
      arrAcc = self.state.AccessIDs.slice(0, -1).split(",");
      for (const [index, value] of response.data.Table3.entries()) {
        debugger;
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
        debugger;
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
    });

    // axios
    //   .post("http://vizio.atafreight.com/MyWayAPI/BindUserCreationDropdown?UserID=41")
    //   .then(response => {
    //     console.log(response);
    //     this.setState({ data: response.data });
    //   })
    //   .catch(error => console.log(error.response));
  }
  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ""] }));
  }

  removeClick(i) {
    debugger;
    let values = [...this.state.values];
    values.splice(i, 1);
    if (this.state.editRegCompany.length > i) {
      this.state.editRegCompany[i].IsDelete = true;
    }
    this.setState({ values, editRegCompan: this.state.editRegCompany });
  }

  handlechange(field, e) {
    debugger;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({
      fields
    });
  }

  handleBlur(field, e) {
    debugger;
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
      debugger;
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
        // if(!fields["emailid"]){

        // }
      }

      return formIsValid;
    });
  }

  handleBlurUser(field, e) {
    debugger;
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
        debugger;
        self.setState({
          IsUserExist: true,
          errorMessage1: response.data[0].UserName + " already exists"
        });
        formIsValid = false;
        errors["username"] = self.state.errorMessage1;
        self.setState({ errors: errors });
      })
      .catch(error => {
        debugger;
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
    // if(name == "Air"){
    //   this.setState({isAir: !this.state.isAir});

    // }
    // if (name == "Ocean") {
    //   this.setState({isOcean: !this.state.isOcean});
    // }
    // if (name == "Land") {
    //   this.setState({isLand: !this.state.isLand});
    // }
  }

  toggleMobileChange(field, e) {
    debugger;
    let fields = this.state.fields;
    fields[field] = !this.state.IsMobileEnabled;
    this.setState({
      IsMobileEnabled: !this.state.IsMobileEnabled,
      fields
    });
  }

  toggleChangeCon(name, event) {
    debugger;
    if (this.state.editRegCompany[0].CompType.includes("C") != true) {
      this.state.editRegCompany[0].CompType += "," + name;
      this.setState({
        // [this.state.companies[0]]: this.state.companies[0]+=":"+name,
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[0].CompType.includes("S")) {
        // this.state.companies[0] =this.state.companies[0].split(':')[0]+":S"
        this.state.editRegCompany[0].CompType = ",S";
      } else {
        // this.state.companies[0] =this.state.companies[0].split(':')[0]
        this.state.editRegCompany[0].CompType = "";
      }
      this.setState({
        // [this.state .companies[0]]: this.state.companies[0],
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeCon1(index, name, event) {
    debugger;
    if (this.state.editRegCompany[index].CompType.includes("C") != true) {
      this.state.editRegCompany[index].CompType += "," + name;
      this.setState({
        // [this.state.companies[index]]: this.state.companies[index]+=":"+name,
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[index].CompType.includes("S")) {
        // this.state.companies[index] =this.state.companies[index+1].split(':')[0]+":S"
        // this.state.editRegCompany.push({CompType:"",RegCompID:parseInt(this.state.companies[index+1]),IsEnable:true})
        this.state.editRegCompany[index].CompType = ",S";
      } else {
        // this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]
        this.state.editRegCompany[index].CompType = "";
      }
      this.setState({
        // [this.state .companies[index+1]]: this.state.companies[index+1],
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
      // this.setState({
      //   [this.state.companies[index+1]]: this.state.companies[index+1],
      //   isConsignee: !this.state.isConsignee
      // })
    }
  }

  toggleChangeShip(name, event) {
    if (this.state.editRegCompany[0].CompType.includes("S") != true) {
      this.state.editRegCompany[0].CompType += "," + name;
      this.setState({
        // [this.state.companies[0]]: this.state.companies[0]+=":"+name,
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[0].CompType.includes("C")) {
        // this.state.companies[0] =this.state.companies[0].split(':')[0]+":C"
        this.state.editRegCompany[0].CompType = "C,";
      } else {
        // this.state.companies[0] =this.state.companies[0].split(':')[0]
        this.state.editRegCompany[0].CompType = "";
      }
      this.setState({
        // [this.state .companies[0]]: this.state.companies[0],
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    }
  }

  toggleChangeShip1(index, name, event) {
    debugger;
    if (this.state.editRegCompany[index].CompType.includes("S") != true) {
      this.state.editRegCompany[index].CompType += "," + name;
      this.setState({
        // [this.state.companies[index]]: this.state.companies[index]+=":"+name,
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
    } else {
      if (this.state.editRegCompany[index].CompType.includes("C")) {
        this.state.editRegCompany[index].CompType = "C,";
        // this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]+":C"
      } else {
        this.state.editRegCompany[index].CompType = "";
        // this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]
      }
      this.setState({
        // [this.state .companies[index+1]]: this.state.companies[index+1],
        isConsignee: !this.state.isConsignee,
        editRegCompany: this.state.editRegCompany
      });
      // this.setState({
      //   [this.state.companies[index+1]]: this.state.companies[index+1],
      //   isConsignee: !this.state.isConsignee
      // })
    }
  }

  toggleChangeAccRight(index, e) {
    debugger;
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
    debugger;
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
    debugger;
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

  handleSubmit(e) {
    debugger;
    const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    this.setState({ submitted: true });
    let ModeOfTransport = "";
    let Document = "";
    let HideInvoiceDetails = "";
    var RegisteredCompany = "";
    var Modules = "";
    // if (this.state.isAir === true) {
    //   ModeOfTransport+="A";
    // }
    // if (this.state.isOcean === true) {
    //   ModeOfTransport+=",O";
    // }
    // if (this.state.isLand === true) {
    //   ModeOfTransport+=",L";
    // }
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
      debugger;
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
    // for(const[index,value] of this.state.companies.entries())
    // {
    //   debugger;
    //   let arr = value.includes(":C")
    //   if(value.includes(":C") && value.includes(":S"))
    //   {
    //     this.state.RegCompany.push(value.split(':')[0]+":C")
    //     this.state.RegCompany.push(value.split(':')[0]+":S")
    //   }
    //   else
    //   {
    //     this.state.RegCompany.push(value)
    //   }
    // }
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
    // if (this.state.fields["isenabled"] == undefined || this.state.fields["isenabled"]=="") {
    //   this.state.fields["isenabled"] = this.state.selectIsEnable[0].value;
    // }

    // docData.append("UserName",this.state.fields["username"]);
    // docData.append("Password",this.state.fields["password"]);
    // docData.append("IsEnabled",this.state.fields["isenabled"]);
    // docData.append("ClientAdminID",0);
    // docData.append("DisplayAsShipper",this.state.fields["displayShipper"]);
    // docData.append("DisplayAsConsignee",this.state.fields["displayConsignee"]);
    // docData.append("UserType",this.state.fields["usertype"]);
    // docData.append("ModeOfTransport",ModeOfTransport);
    // docData.append("CanCreateUser",this.state.fields["usercreation"]);
    // docData.append("CreatedBy",userid);
    // docData.append("EmailID",this.state.fields["emailid"]);
    // docData.append("ImpExp",this.state.fields["ImpExp"]);
    // docData.append("IsAdmin",this.state.fields["isadmin"]);
    // docData.append("IsMywayUser","Y");
    // docData.append("MywayUserName",this.state.fields["username"]);
    // docData.append("MywayPassword","");
    // docData.append("FirstName",this.state.fields["firstname"]);
    // docData.append("LastName",this.state.fields["lastname"]);
    // docData.append("CountryCode",this.state.fields["country"]);
    // docData.append("RefreshTime",this.state.fields["refreshtime"]);
    // docData.append("IsNew",true);
    // docData.append("IsMobileEnabled",false);
    // docData.append("ProfileType",1);
    // docData.append("ProfileSubType",0);
    // docData.append("HasMobileAccess",true);
    // docData.append("ModuleID","1,2,3");
    // docData.append("DocumentID",Document);
    // docData.append("IsHideInvoiceDetails",this.state.miscelleneous[0].IsSelected);
    // docData.append("IsHideHBLShowMBLDocument",this.state.miscelleneous[1].IsSelected);
    // docData.append("Logo",this.state.selectedFile);
    // docData.append("RegisteredCompany",RegisteredCompany);
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
    // var docDesc = document.getElementById("docDesc").value;
    if (this.handleValidation()) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CreateUserWithDoc`,
        data: docData,
        // {
        //   UserName: this.state.fields["username"],
        //   Password: this.state.fields["password"],
        //   IsEnabled: this.state.fields["isenabled"],
        //   ClientAdminID: 0,
        //   DisplayAsShipper: this.state.fields["displayShipper"],
        //   DisplayAsConsignee: this.state.fields["displayConsignee"],
        //   UserType: this.state.fields["usertype"],
        //   ModeOfTransport: ModeOfTransport,
        //   CanCreateUser: this.state.fields["usercreation"],
        //   CreatedBy: userid,
        //   EmailID: this.state.fields["emailid"],
        //   ImpExp: this.state.fields["ImpExp"],
        //   IsAdmin: this.state.fields["isadmin"],
        //   IsMywayUser: "Y",
        //   MywayUserName: this.state.fields["username"],
        //   MywayPassword: "",
        //   FirstName: this.state.fields["firstname"],
        //   LastName: this.state.fields["lastname"],
        //   CountryCode: this.state.fields["country"],
        //   RefreshTime: this.state.fields["refreshtime"],
        //   IsNew: 1,
        //   IsMobileEnabled: 0,
        //   ProfileType: 1,
        //   ProfileSubType: 0,
        //   HasMobileAccess: 1,
        //   ModuleID: "1,2,3",
        //   DocumentID: Document,
        //   IsHideInvoiceDetails: this.state.miscelleneous[0].IsSelected,
        //   IsHideHBLShowMBLDocument: this.state.miscelleneous[1].IsSelected,
        //   RegisteredCompany: RegisteredCompany

        // },
        headers: authHeader()
      })
        .then(function(response) {
          debugger;
          NotificationManager.success(response.data[0].Message);
          setTimeout(function() {
            window.location.href = "/add-user";
          }, 1000);
        })
        .catch(error => {
          debugger;
          NotificationManager.error(error.response.data.split("'")[1]);
          console.log(error.response);
        });
    } else {
      debugger;
      this.setState({ settoaste: true, loading: true });
    }
  }

  handleUpdate(e) {
    const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    this.setState({ submitted: true });
    let ModeOfTransport = "";
    let Document = "";
    let HideInvoiceDetails = "";
    var RegisteredCompany = "";
    var Modules = "";
    // if (this.state.isAir === true) {
    //   ModeOfTransport+="A";
    // }
    // if (this.state.isOcean === true) {
    //   ModeOfTransport+=",O";
    // }
    // if (this.state.isLand === true) {
    //   ModeOfTransport+=",L";
    // }
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
    // for(const[index,value] of this.state.companies.entries())
    // {
    //   debugger;
    //   let arr = value.includes(":C")
    //   if(value.includes(":C") && value.includes(":S"))
    //   {
    //     this.state.RegCompany.push(value.split(':')[0]+":C")
    //     this.state.RegCompany.push(value.split(':')[0]+":S")
    //   }
    //   else
    //   {
    //     this.state.RegCompany.push(value)
    //   }
    // }
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
    // const { username, password, emailid, firstname,
    //   lastname, refreshtime, country, isenabled, usertype, usercreation,
    //   isadmin, ImpExp, displayShipper, displayConsignee, MobileEnable,
    //   Company, Consignee, Shipper} = this.state;
    // docData.append("UserID",874585);
    // docData.append("UserName",this.state.fields["username"]);
    // docData.append("Password",this.state.fields["password"]);
    // docData.append("IsEnabled",this.state.fields["isenabled"]);
    // docData.append("ClientAdminID",0);
    // docData.append("DisplayAsShipper",this.state.fields["displayShipper"]);
    // docData.append("DisplayAsConsignee",this.state.fields["displayConsignee"]);
    // docData.append("UserType",this.state.fields["usertype"]);
    // docData.append("ModeOfTransport",ModeOfTransport);
    // docData.append("CanCreateUser",this.state.fields["usercreation"]);
    // docData.append("CreatedBy",userid);
    // docData.append("EmailID",this.state.fields["emailid"]);
    // docData.append("ImpExp",this.state.fields["ImpExp"]);
    // docData.append("IsAdmin",this.state.fields["isadmin"]);
    // docData.append("IsMywayUser","Y");
    // docData.append("MywayUserName",this.state.fields["username"]);
    // docData.append("MywayPassword","");
    // docData.append("FirstName",this.state.fields["firstname"]);
    // docData.append("LastName",this.state.fields["lastname"]);
    // docData.append("CountryCode",this.state.fields["country"]);
    // docData.append("RefreshTime",this.state.fields["refreshtime"]);
    // docData.append("IsNew",true);
    // docData.append("IsMobileEnabled",false);
    // docData.append("ProfileType",1);
    // docData.append("ProfileSubType",0);
    // docData.append("HasMobileAccess",true);
    // docData.append("ModuleID","1,2,3");
    // docData.append("DocumentID",Document);
    // docData.append("IsHideInvoiceDetails",this.state.miscelleneous[0].IsSelected);
    // docData.append("IsHideHBLShowMBLDocument",this.state.miscelleneous[1].IsSelected);
    // docData.append("Logo",this.state.selectedFile);
    // docData.append("RegisteredCompany",RegisteredCompany);

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
        // {
        //   UserID:userid,
        //   UserName: this.state.fields["username"],
        //   Password: this.state.fields["password"],
        //   IsEnabled: this.state.fields["isenabled"],
        //   ClientAdminID: 0,
        //   DisplayAsShipper: this.state.fields["displayShipper"],
        //   DisplayAsConsignee: this.state.fields["displayConsignee"],
        //   UserType: this.state.fields["usertype"],
        //   ModeOfTransport: ModeOfTransport,
        //   CanCreateUser: this.state.fields["usercreation"],
        //   CreatedBy: userid,
        //   EmailID: this.state.fields["emailid"],
        //   ImpExp: this.state.fields["ImpExp"],
        //   IsAdmin: this.state.fields["isadmin"],
        //   IsMywayUser: "Y",
        //   MywayUserName: this.state.fields["username"],
        //   MywayPassword: "",
        //   FirstName: this.state.fields["firstname"],
        //   LastName: this.state.fields["lastname"],
        //   CountryCode: this.state.fields["country"],
        //   RefreshTime: this.state.fields["refreshtime"],
        //   IsNew: 1,
        //   IsMobileEnabled: 0,
        //   ProfileType: 1,
        //   ProfileSubType: 0,
        //   HasMobileAccess: 1,
        //   ModuleID: "1,2,3",
        //   DocumentID: Document,
        //   IsHideInvoiceDetails: this.state.miscelleneous[0].IsSelected,
        //   IsHideHBLShowMBLDocument: this.state.miscelleneous[1].IsSelected,
        //   RegisteredCompany: RegisteredCompany

        // },
        headers: authHeader()
      })
        .then(function(response) {
          debugger;
          NotificationManager.success(response.data[0].Result);
          // var tempsucc = response.data[0].Result;
          // NotificationManager.error(tempsucc);
          setTimeout(function() {
            window.location.href = "/view-user";
          }, 1000);
        })
        .catch(error => {
          debugger;
          NotificationManager.error(error.response.data.split("'")[1]);
          console.log(error.response);
        });
    } else {
      debugger;
      this.setState({ settoaste: true, loading: true });
    }
  }

  componentDidMount() {
    debugger;
    if (this.props.location.state != undefined) {
      var userId = this.props.location.state.detail;
      let fields = this.state.fields;
      this.setState({ srnos: userId });
      let errors = {};
      let formIsValid = true;

      let self = this;
      axios({
        method: "post",
        url: `${appSettings.APIURL}/UserDataForEdit`,
        data: {
          UserID: userId
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
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
        // fields["usercreation"] = response.data.Table[0].CanCreateUser;
        fields["isadmin"] = response.data.Table[0].IsAdmin;
        fields["ImpExp"] = response.data.Table[0].ImpExp;
        fields["displayShipper"] = response.data.Table[0].DisplayAsShipper;
        fields["displayConsignee"] = response.data.Table[0].DisplayAsConsignee;
        fields["MobileEnabled"] = response.data.Table[0].HasMobileAccess;
        // this.state.IsMobileEnabled = response.data.Table[0].HasMobileAccess;
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
        // self.state.hideDocument.push({"DocumentID":value.DocumentID, "DocumentName":value.DocumentName, "IsSelected":1})

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
    debugger;
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    });
  };

  render() {
    var a = 1;
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <AdminSideMenu />
          </div>
          <div className="cls-rt">
            <NotificationContainer />
            <div>
              <div className="title-sect title-border">
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
                <div className="row mt-3">
                  <div className="login-fields col-md-4">
                    <label>
                      User Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"username"}
                      onChange={this.handlechange.bind(this, "username")}
                      placeholder="Enter Your User Name"
                      value={this.state.fields["username"]}
                      onBlur={this.handleBlurUser.bind(this, "username")}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["username"]}
                    </span>
                  </div>
                  <div className="login-fields col-md-4">
                    <label>
                      Password{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="password"
                      name={"password"}
                      onChange={this.handlechange.bind(this, "password")}
                      placeholder="Enter Your Password"
                      value={this.state.fields["password"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["password"]}
                    </span>
                  </div>
                  <div className="login-fields col-md-4">
                    <label>
                      Email Id{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"emailid"}
                      onChange={this.handlechange.bind(this, "emailid")}
                      placeholder="Enter Your Email Id"
                      value={this.state.fields["emailid"]}
                      onBlur={this.handleBlur.bind(this, "emailid")}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["emailid"]}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-4">
                    <label>
                      First Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"firstname"}
                      onChange={this.handlechange.bind(this, "firstname")}
                      placeholder="Enter Your First Name"
                      value={this.state.fields["firstname"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["firstname"]}
                    </span>
                  </div>
                  <div className="login-fields col-md-4">
                    <label>
                      Last Name{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      name={"lastname"}
                      onChange={this.handlechange.bind(this, "lastname")}
                      placeholder="Enter Your Last Name"
                      value={this.state.fields["lastname"]}
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["lastname"]}
                    </span>
                  </div>
                  <div className="login-fields col-md-4">
                    <label>
                      Country{" "}
                      <sup style={{ color: "#f00", fontSize: "14px" }}>*</sup>
                    </label>

                    <select
                      onChange={this.HandleChangeSelect.bind(this, "country")}
                      name={"country"}
                      value={this.state.fields["country"]}
                    >
                      {" "}
                      <option key={"Select"} value={"Select"}>
                        --Select--
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
                    {/* <div>
                    Selected Value: {JSON.stringify(this.state.value)}
                </div> */}
                    {/* <input
                    type="text"
                    name={"username"}
                    onChange={this.handlechange}
                    placeholder="Select Country"
                  /> */}
                    {/* <DropDownList
                    data={this.Country}
                    textField="text"
                    dataItemKey="id"
                    value={this.state.value}
                    onChange={this.handleChange}
                   /> */}
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-4">
                    <label>Dashboard Refresh Time</label>
                    <input
                      type="text"
                      name={"refreshtime"}
                      value={this.state.fields["refreshtime"]}
                      onChange={this.handlechange.bind(this, "refreshtime")}
                      placeholder="Enter Dashboard Refresh Time"
                    />
                    <span style={{ color: "red" }}>
                      {this.state.errors["refreshtime"]}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-2">
                    <label>Is Enabled</label>
                    <select
                      onChange={this.HandleChangeSelect.bind(this, "isenabled")}
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
                  <div className="login-fields col-md-2">
                    <label>User Type</label>
                    <select
                      onChange={this.HandleChangeSelect.bind(this, "usertype")}
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
                  <div className="login-fields col-md-2">
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
                  <div className="login-fields col-md-2">
                    <label>Is Admin</label>
                    <select
                      onChange={this.HandleChangeSelect.bind(this, "isadmin")}
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
                  <div className="login-fields col-md-4">
                    <label>Imp. Exp.</label>
                    <select
                      onChange={this.HandleChangeSelect.bind(this, "ImpExp")}
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
                <div className="row">
                  <div className="login-fields col-md-2">
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
                  <div className="login-fields col-md-4">
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
                  <div className="login-fields col-md">
                    <label>Mode Of Transport</label>
                    <div className="remember-forgot mt-0">
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
                  <div className="login-fields col-md">
                    <label>Is Mobile Enabled?</label>
                    <div className="remember-forgot">
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
                <div className="row">
                  <div className="login-fields dynamic-fields col-md-6">
                    <label>Company Name</label>
                    {/* {(() => {
                    if (this.props.location.state == undefined) {
                  return <div>
                  <select
                    onChange={this.HandleChangeCompany.bind(this)}
                    name={"Companys"}
                  >
                    <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
                  </select>
                  <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Consignee" type="checkbox" name="Consignee" onChange={this.toggleChangeCon.bind(this, "C")}/>
                       <label htmlFor="Consignee">Consignee</label>
                   </div>
                   <div>
                     <input id="Shipper" type="checkbox" name="Shipper" onChange={this.toggleChangeShip.bind(this, "S")}/>
                       <label htmlFor="Shipper">Shipper</label>
                   </div>
                   
                 </div>
                  </div>
                  }
                  })()} */}
                    {/* {this.state.editRegCompany.map(team => (
                  <div>
                  <select
                    onChange={this.HandleChangeCompany.bind(this)}
                    name={"Company"}
                    value={team.RegCompID}
                  >
                    <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
                    
                  </select>
                  <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Consignee" type="checkbox" name="Consignee" defaultChecked={true} onChange={this.toggleChangeCon.bind(this, "C")}/>
                       <label htmlFor="Consignee">Consignee</label>
                   </div>
                   <div>
                     <input id="Shipper" type="checkbox" name="Shipper" onChange={this.toggleChangeShip.bind(this, "S")}/>
                       <label htmlFor="Shipper">Shipper</label>
                   </div>
                   
                 </div>
                  </div>
                  
                  ))} */}
                    {this.createUI()}
                    {/* {this.state.values} */}
                  </div>
                </div>
                <input
                  type="button"
                  className="butn mt-0 mb-4"
                  value="Add Company"
                  onClick={this.addClick.bind(this)}
                />
                <div className="row">
                  <div className="login-fields col-md-12">
                    <label className="mb-0">Hide Document('S)</label>
                    <div className="row">
                      {this.state.hideDocument.map((hideDocument, index) => (
                        <div
                          className="remember-forgot col-md-4"
                          key={hideDocument.DocumentID}
                        >
                          <input
                            id={hideDocument.DocumentID}
                            type="checkbox"
                            name={hideDocument.DocumentName}
                            value={hideDocument.DocumentID}
                            defaultChecked={hideDocument.IsSelected}
                            onClick={this.toggleChangeHideDoc.bind(this, index)}
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
                <div className="row">
                  <div className="login-fields col-md-12">
                    <label className="mb-0">Miscelleneous</label>
                    <div className="remember-forgot justify-content-start">
                      {this.state.miscelleneous.map((miscelleneous, index) => (
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
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="login-fields col-md-12">
                    <label className="mb-0">Access Rights</label>
                    <div className="row">
                      {this.state.accessrights.map((accessrights, index) => (
                        <div
                          className="remember-forgot col-md-3"
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
                <div className="row">
                  <div className="login-fields mb-0 col-md-12">
                    {/* <input type="file" onChange={this.fileChangedHandler}/> */}
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
                          onClick={this.handleUpdate}
                        >
                          Update
                        </button>
                      );
                    } else {
                      return (
                        <button
                          type="button"
                          className="butn mb-2"
                          onClick={this.handleSubmit}
                        >
                          Submit
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

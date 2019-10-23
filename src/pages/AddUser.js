import React from "react";
import appSettings from "../helpers/appSetting";
// import Logo from "./../assets/img/logo.png";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import axios from "axios";
import {authHeader} from "../helpers/authHeader";
import { is } from "@babel/types";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

var string = "";
class AddUser extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      values: [],
      selectCountry: [
        // { key: "1", value: "India" },
        // { key: "2", value: "USA" },
        // { key: "3", value: "UK" },
        // { key: "4", value: "Russia" },
      ],
      selectIsEnable: [
        { key: 1, value: "True" },
        { key: 0, value: "False" }
      ],
      selectUserType: [],
      selectIsAdmin: [
        { key: "Y", value: "Yes" },
        { key: "N", value: "No" }
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
      isAir: false,
      isOcean: false,
      isLand: false,
      modeoftrans: "",
      companies:[],
      isConsignee: false,
      isShipper: false,
      isChecked: [],
      fields: {},
      errors: {},
      IsEmailExist: false,
      errorMessage: "",
      IsUserExist: false,
      srnos: ''
      
    }

    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  createUI(){
    var i = 1
    return this.state.values.map((el, index) => 
        <div key={index}>
         <select
                    onChange={(el) => this.HandleChangeCompany1(el, index)}
                    name={"Company"+i}
                  >
                    <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.SuperCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
         </select>
         <input type='button' value='remove' className='dynamic-remove' onClick={this.removeClick.bind(this, i)}/>
         <div className="remember-forgot col-md-1">
            <div>
                <input id={"Consignee" + i} type="checkbox" name={"Consignee" + i} onChange={this.toggleChangeCon1.bind(this,index,"C")}/>
                <label htmlFor={"Consignee" + i}>Consignee</label>
            </div>
            <div>
                <input id={"Shipper" + i} type="checkbox" name={"Shipper" + i}/>
                <label htmlFor={"Shipper" + i}>Shipper</label>
            </div>
         </div>
         
        </div>          
    )
    i++;
 }


  HandleChangeSelect(field,e) {
    let fields = this.state.fields; 
    if (e.target.value == "Select") {
      fields[field] = ""
    }
    else
    {
    fields[field] = e.target.value;
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  HandleChangeCompany(e)
  {
       this.state.companies[0] = e.target.value
       //this.setState({values: this.state.values})
  }

  HandleChangeCompany1(e, index)
  {
    debugger;
    this.state.companies[index+1] = e.target.value
    // this.setState({values: this.state.values})
  }

  componentWillMount() {
    let self = this;
    var userid = encryption(window.localStorage.getItem("userid"),"desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/BindUserCreationDropdown`,
      data: {
        UserID:userid         
      },
      headers: authHeader()
    }).then(function (response) {
      debugger;
      console.log(response);
      self.setState({ selectCountry: response.data.Table, selectUserType: response.data.Table1,
        selectImpExp: response.data.Table2, selectCompany: response.data.Table4, 
        chkModeOfTrans: response.data.Table3, hideDocument: response.data.Table5,
        miscelleneous: response.data.Table6, accessrights: response.data.Table7
        });
    })

    // axios
    //   .post("http://vizio.atafreight.com/MyWayAPI/BindUserCreationDropdown?UserID=41")
    //   .then(response => {
    //     console.log(response);
    //     this.setState({ data: response.data });
    //   })
    //   .catch(error => console.log(error.response));
  }
  addClick(){
    this.setState(prevState => ({ values: [...prevState.values, '']}))
  }

  removeClick(i){
    let values = [...this.state.values];
    values.splice(i,1);
    this.setState({ values });
 }

 handlechange(field,e) {
   debugger;
  let fields = this.state.fields;
  fields[field] = e.target.value;        
  this.setState({
    [e.target.name]: e.target.value,
    fields
  });
}

handleBlur(field,e)
{
  debugger;
  let self = this;
  let fields = this.state.fields;
  fields[field] = e.target.value;
  this.setState({
    fields
  });
  let errors = {};
  let formIsValid = true;
  const {emailid} =this.state;
  axios({
    method: "post",
    url: "http://vizio.atafreight.com/MyWayAPI/CheckEmailIDExists",
    data: {
      EmailID:emailid,
      ProfileType: 1
    },
    headers: authHeader()
  }).then(function(response) {
    debugger;
    if(response.data[0].CanCreateUser == 1 && response.data[0].Result == "User Not Found")
    {
      self.setState({
        IsEmailExist: false,
        errorMessage: ""       
      });
    }
    else{
      self.setState({
        IsEmailExist: true,
        errorMessage: response.data[0].Result
      });
      // if(!fields["emailid"]){
        
      // }
    }
    formIsValid = false;
    errors["emailid"] = self.state.errorMessage;
    self.setState({errors: errors});
    return formIsValid
  })
}

handleBlurUser(field,e)
{
  debugger;
  let self = this;
  let fields = this.state.fields;
  fields[field] = e.target.value;
  this.setState({
    fields
  });
  let errors = {};
  let formIsValid = true;
  const {username} =this.state;
  axios({
    method: "post",
    url: "http://vizio.atafreight.com/MyWayAPI/CheckUserNameExists",
    data: {
      UserName:username
    },
    headers: authHeader()
  }).then(function(response) {
    debugger;
    self.setState({
      IsUserExist: true,
      errorMessage: response.data[0].UserName + " already exists"
    });
    formIsValid = false;
    errors["username"] = self.state.errorMessage;
    self.setState({errors: errors});
 
  }).catch(error => {
    debugger;
    self.setState({
      IsUserExist: false,
      errorMessage: ""
    });
    formIsValid = true;
    errors["username"] = "";
    self.setState({errors: errors});
  })
  return formIsValid
}
toggleChange(name, event) {
  
  if(name == "Air"){
    this.setState({isAir: !this.state.isAir});
    
  }
  if (name == "Ocean") {
    this.setState({isOcean: !this.state.isOcean});    
  }
  if (name == "Land") {
    this.setState({isLand: !this.state.isLand});
  }
  
}


toggleChangeCon(name, event) {
  debugger;
  if (this.state.companies[0].includes(":C") != true) {
    this.setState({
      [this.state.companies[0]]: this.state.companies[0]+=":"+name,
      isConsignee: !this.state.isConsignee
    });
  }
  else
  {
    this.state.companies[0] =this.state.companies[0].split(':')[0]
    this.setState({
      [this.state .companies[0]]: this.state.companies[0],
      isConsignee: !this.state.isConsignee
    })
  }
}

toggleChangeCon1(index, name, event) {
  debugger;
  if (this.state.companies[index+1].includes(":C") != true) {
    this.setState({
      [this.state.companies[index+1]]: this.state.companies[index+1]+=":"+name,
      isConsignee: !this.state.isConsignee
    });
  }
  else
  {
    this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]
    this.setState({
      [this.state.companies[index+1]]: this.state.companies[index+1],
      isConsignee: !this.state.isConsignee
    })
  }
}

toggleChangeShip(name,event)
{
  if (this.state.companies[0].includes(":S") != true) {
    this.setState({
      [this.state.companies[0]]: this.state.companies[0]+=":"+name,
      isConsignee: !this.state.isConsignee
    });
  }
  else
  {
    this.state.companies[0] =this.state.companies[0].split(':')[0]
    this.setState({
      [this.state .companies[0]]: this.state.companies[0],
      isConsignee: !this.state.isConsignee
    })
  }
}

toggleChangeAccRight(e,index,AccessID)
{
  debugger;
  // this.setState({
  //   [this.state.isChecked[index][index]]: !this.state.isChecked ,
  //   [this.state.isChecked[index][index+1]]: AccessID
  // })


}

toggleChangeHideDoc(index,e)
{
  debugger;
  if ([this.state.hideDocument[index].IsSelected] == 0) {
  this.setState({
    [this.state.hideDocument[index].IsSelected]: [this.state.hideDocument[index].IsSelected=1]
  })
}
else
{
  this.setState({
    [this.state.hideDocument[index].IsSelected]: [this.state.hideDocument[index].IsSelected=0]
  })
}
}
handleValidation(){
  debugger;
  let fields = this.state.fields;
  let errors = {};
  let formIsValid = true;

  if(!fields["username"]){
    formIsValid = false;
    errors["username"] = "Enter user name";
 }
 if(!fields["password"]){
  formIsValid = false;
  errors["password"] = "Enter password";
}
if(!fields["emailid"]){
  formIsValid = false;
  errors["emailid"] = "Enter email id";
}
if(!fields["firstname"]){
  formIsValid = false;
  errors["firstname"] = "Enter first name";
}
if(!fields["lastname"]){
  formIsValid = false;
  errors["lastname"] = "Enter last name";
}
if(!fields["country"]){
  formIsValid = false;
  errors["country"] = "Select country";
}
if (this.state.IsEmailExist == true) {
  formIsValid = false;
  errors["emailid"] = this.state.errorMessage;
}
if (this.state.IsUserExist == true) {
  formIsValid = false;
  errors["username"] = this.state.errorMessage;
}
 this.setState({errors: errors});
 return formIsValid;
}

 handleSubmit(e) {    
   debugger; 
   var userid = encryption(window.localStorage.getItem("userid"),"desc");
    this.setState({ submitted: true }); 
    let ModeOfTransport = "";  
    let Document = "";
    let HideInvoiceDetails = "";
    var RegisteredCompany = this.state.companies.toString();
    if (this.state.isAir === true) {
      ModeOfTransport+="A";
    }
    if (this.state.isOcean === true) {
      ModeOfTransport+=",O";
    }
    if (this.state.isLand === true) {
      ModeOfTransport+=",L";
    }
    
    this.state.hideDocument.map((hideDocument, index) => {
       if(this.state.hideDocument[index].IsSelected == true)
       {
        Document+=((this.state.hideDocument[index].DocumentID)+",");       
       }
    })
    Document = Document.slice(0, -1);
    const { username, password, emailid, firstname, 
      lastname, refreshtime, country, isenabled, usertype, usercreation,
      isadmin, ImpExp, displayShipper, displayConsignee, MobileEnable,
      Company, Consignee, Shipper} = this.state;
      if(this.handleValidation()){
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/MyWayAPI/CreateUser",
        data: {
          UserName: username,
          Password: password,
          IsEnabled: isenabled,
          ClientAdminID: 0,
          DisplayAsShipper: displayShipper,
          DisplayAsConsignee: displayConsignee,
          UserType: usertype,
          ModeOfTransport: ModeOfTransport,
          CanCreateUser: usercreation,
          CreatedBy: userid,
          EmailID: emailid,
          ImpExp: ImpExp,
          IsAdmin: isadmin,
          IsMywayUser: "Y",
          MywayUserName: username,
          MywayPassword: "",
          FirstName: firstname,
          LastName: lastname,
          CountryCode: country,
          RefreshTime: refreshtime,
          IsNew: 1,
          IsMobileEnabled: 0,
          ProfileType: 1,
          ProfileSubType: 0,
          HasMobileAccess: 1,
          ModuleID: "1,2,3",
          DocumentID: Document,
          IsHideInvoiceDetails: this.state.miscelleneous[0].IsSelected,
          IsHideHBLShowMBLDocument: this.state.miscelleneous[1].IsSelected,
          RegisteredCompany: RegisteredCompany

        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
      })
  }
  else {
    debugger;
    this.setState({ settoaste: true, loading: true });

    // var error = username === "" ? "Please enter the username\n" : "";
    // error += password === "" ? "Please enter the passowrd" : "";
    // alert(error);
    //  window.location='./Dashboard'
    // NotificationManager.error(error);
    
    }
  }

  componentDidMount() {
    debugger;
    var userId = this.props.location.state.detail;
    this.setState({ srnos: userId})

    // let self = this;
    // axios({
    //   method: "post",
    //   url: `${appSettings.APIURL}/UserDataForEdit`,
    //   data: {
    //     UserID: encryption(window.localStorage.getItem("userid"), "desc")
    //   },
    //   headers: authHeader()
    // }).then(function(response) {
    //   debugger;
    //   self.setState({ viewData: response.data });
    // });
  }
  

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
          <div>
          <h2>Add User</h2>
          <div className="login-input-cntr">
            <div className="row">
                <div className="login-fields col-md-4">
                  <label>User Name</label>
                  <input
                    type="text"
                    name={"username"}
                    onChange={this.handlechange.bind(this, "username")}
                    placeholder="Enter Your User Name"
                    value={this.state.fields["username"]}
                    onBlur={this.handleBlurUser.bind(this, "username")}
                  />
                  <span style={{color: "red"}}>{this.state.errors["username"]}</span>
               </div>
               <div className="login-fields col-md-4">
                  <label>Password</label>
                  <input
                    type="text"
                    name={"password"}
                    onChange={this.handlechange.bind(this, "password")}
                    placeholder="Enter Your Password"
                    value={this.state.fields["password"]}
                  />
                  <span style={{color: "red"}}>{this.state.errors["password"]}</span>
               </div>
               <div className="login-fields col-md-4">
                  <label>Email Id</label>
                  <input
                    type="text"
                    name={"emailid"}
                    onChange={this.handlechange.bind(this, "emailid")}
                    placeholder="Enter Your Email Id"
                    value={this.state.fields["emailid"]}
                    onBlur={this.handleBlur.bind(this, "emailid")}
                  />
                  <span style={{color: "red"}}>{this.state.errors["emailid"]}</span>
               </div>
               </div>
            <div className="row">
                <div className="login-fields col-md-4">
                  <label>First Name</label>
                  <input
                    type="text"
                    name={"firstname"}
                    onChange={this.handlechange.bind(this, "firstname")}
                    placeholder="Enter Your First Name"
                    value={this.state.fields["firstname"]}
                  />
                  <span style={{color: "red"}}>{this.state.errors["firstname"]}</span>
               </div>
               <div className="login-fields col-md-4">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name={"lastname"}
                    onChange={this.handlechange.bind(this, "lastname")}
                    placeholder="Enter Your Last Name"
                    value={this.state.fields["lastname"]}
                  />
                  <span style={{color: "red"}}>{this.state.errors["lastname"]}</span>
               </div>
               <div className="login-fields col-md-4">
               <label>Country</label>
               
               <select
                    onChange={this.HandleChangeSelect.bind(this, "country")}
                    name={"country"}
                    value={this.state.fields["country"]}
                  > <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCountry.map(team => (
                      <option key={team.SUCountry} value={team.SUCountry}>
                        {team.CountryName}
                      </option>
                    ))}
                  </select>
                  <span style={{color: "red"}}>{this.state.errors["country"]}</span>
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
                    onChange={this.handlechange}
                    placeholder="Enter Dashboard Refresh Time"
                  />
                  </div>
               </div>
               <div className="row">
                <div className="login-fields col-md-2">
                  <label>Is Enabled</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this, "isenabled")}
                    name={"isenabled"}
                  >
                    {this.state.selectIsEnable.map(team => (
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
                    onChange={this.HandleChangeSelect.bind(this,"usercreation")}
                    name={"usercreation"}
                  >
                    {this.state.selectIsEnable.map(team => (
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
                  >
                    {this.state.selectIsAdmin.map(team => (
                      <option key={team.key} value={team.key}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
                <div className="login-fields col-md-2">
                  <label>Imp. Exp.</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this, "ImpExp")}
                    name={"ImpExp"}
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
                    onChange={this.HandleChangeSelect.bind(this, "displayShipper")}
                    name={"displayShipper"}
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.key}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
               <div className="login-fields col-md-2">
                  <label>Display As Consignee</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this,"displayConsignee")}
                    name={"displayConsignee"}
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.key}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
               <div className="login-fields col-md-4">
                 <label>Mode Of Transport</label>
                 <div className="remember-forgot col-md-1">
         
                 {
                   
                this.state.chkModeOfTrans.map((chkModeOfTrans, index) =>
            <div key={chkModeOfTrans.ID}>
                    <input id={chkModeOfTrans.ID} type="checkbox" name={chkModeOfTrans.Value} value={chkModeOfTrans.ID} 
                    defaultChecked={this.state.chkModeOfTrans.Value} onChange={this.toggleChange.bind(this, chkModeOfTrans.Value)} />
                       <label htmlFor={chkModeOfTrans.ID}>{chkModeOfTrans.Value}</label> 
                                   
            </div>
        )
                }
                
                </div>
               </div>
               <div className="login-fields col-md-4">
                 <label>Is Mobile Enabled?</label>
                 <div className="remember-forgot col-md-1">
                   <div>
                     <input id="MobileEnable" type="checkbox" name="MobileEnable" onChange={this.toggleChange}/>
                     <label htmlFor="MobileEnable"></label>
                   </div>
                 </div>
               </div>
               </div>
               <div className="row">
                <div className="login-fields dynamic-fields col-md-4">
                  <label>Company Name</label>
                  <div>
                  <select
                    onChange={this.HandleChangeCompany.bind(this)}
                    name={"Company"}
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
                  {this.createUI()} 
                  {this.state.values}
                  </div>
                  
               </div>
               <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
               <div className="row">
               <div className="login-fields col-md-12">
                 <label>Mode Of Transport</label>
                 <div className="row">
         
                 {
                   
                this.state.hideDocument.map((hideDocument, index) =>
                <div className="remember-forgot col-md-4" key={hideDocument.DocumentID}>
                  <input id={hideDocument.DocumentID} type="checkbox" name={hideDocument.DocumentName} value={hideDocument.DocumentID} 
                   defaultChecked={hideDocument.IsSelected} onClick = {this.toggleChangeHideDoc.bind(this,  index)} />
                  <label htmlFor={hideDocument.DocumentID}>{hideDocument.DocumentName}</label> 
                </div>
               
            
        )
                }
                
                </div>
               </div>
               </div>
               <div className="row">
               <div className="login-fields col-md-4">
                 <label>Miscelleneous</label>
                 <div className="remember-forgot col-md-1">
         
                 {
                   
                this.state.miscelleneous.map((miscelleneous, index) =>
                <div key={miscelleneous.InvFlag}>
                    <input id={miscelleneous.InvFlag} type="checkbox" value={miscelleneous.InvFlag} 
                    defaultChecked={miscelleneous.IsSelected} />
                       <label htmlFor={miscelleneous.InvFlag}>{miscelleneous.InvFlag}</label> 
                                   
                </div>
                )
                }
                
                </div>
               </div>
               </div>
               <div className="row">
               <div className="login-fields col-md-12">
                 <label>Access Rights</label>                
                 <div className="row">
                 {
                this.state.accessrights.map((accessrights, index) =>
                <div className="remember-forgot col-md-3" key={accessrights.id}>
                    <input id={accessrights.id} type="checkbox" value={accessrights.Value} onChange={this.toggleChangeAccRight.bind(this, index, accessrights.id)}
                    checked={!this.state.isChecked}/>
                       <label htmlFor={accessrights.id}>{accessrights.Value}</label> 
                             
                </div>
                )
                }
                </div>
                
               </div>
               </div>
               <div className="text-right">
                <button
                  type="button"
                  className="butn"
                  onClick={this.handleSubmit}
                  // disabled={loading}
                >
                  {/* {loading && <i className="fa fa-refresh fa-spin"></i>} */}
                  Submit
                </button>
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
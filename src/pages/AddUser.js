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
import { bool } from "prop-types";

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
        { key: true, value: "True" },
        { key: false, value: "False" }
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
      // isAir: false,
      // isOcean: false,
      // isLand: false,
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
      srnos: '',
      username: '',
      Documents: '',
      RegCompany:[],
      editRegCompany:[],
      selectedFile: null
      
    }

    this.handlechange = this.handlechange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  
  createUI(){
    let i = 0;
   return this.state.values.map((el, index) => 
     {if (el.includes("e")) {
       if (!el.includes(index)) {
         i = index+1;  
       }
       else
       {
        i = index;
       }
      return (<div key={index+1}>
        {
                  <div>
                    {
           
                  <select
                    onChange={(el) => this.HandleChangeCompany1(el, index)}
                    name={"Company"+(index+1)}
                    value={this.state.editRegCompany[i].RegCompID}
                  >
                    <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
                    
                  </select>
                    }
                  <input type='button' value='remove' id={"remove" + (index+1)} className='dynamic-remove' onClick={this.removeClick.bind(this, index)}/>
                  {(() => {
                      if ((this.state.editRegCompany[i].CompType).includes('C,S') || (this.state.editRegCompany[i].CompType).includes('S,C')) {
                        return <div className="remember-forgot col-md-1">
                        <div>
                          <input id={"Consignee" + (index+1)} type="checkbox" name={"Consignee" + (index+1)} defaultChecked={true} onChange={this.toggleChangeCon1.bind(this,index, "C")}/>
                            <label htmlFor={"Consignee" + (index+1)}>Consignee</label>
                        </div>
                        <div>
                          <input id={"Shipper" + (index+1)} type="checkbox" name={"Shipper" + (index+1)} defaultChecked={true} onChange={this.toggleChangeShip1.bind(this,index, "S")}/>
                            <label htmlFor={"Shipper" + (index+1)}>Shipper</label>
                        </div>}
                        
                      </div>
                     } else if ((this.state.editRegCompany[i].CompType).includes('S')) {
                      return <div className="remember-forgot col-md-1">
                   <div>
                     <input id={"Consignee" + (index+1)} type="checkbox" name={"Consignee" + (index+1)}  onChange={this.toggleChangeCon1.bind(this, index, "C")}/>
                       <label htmlFor={"Consignee" + (index+1)}>Consignee</label>
                   </div>
                   <div>
                     <input id={"Shipper" + (index+1)} type="checkbox" name={"Shipper" + (index+1)} defaultChecked={true} onChange={this.toggleChangeShip1.bind(this,index, "S")}/>
                       <label htmlFor={"Shipper" + (index+1)}>Shipper</label>
                   </div>
                   
                 </div>
                } else {
                  return <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Consignee" type="checkbox" name="Consignee" defaultChecked={true} onChange={this.toggleChangeCon1.bind(this,index, "C")}/>
                       <label htmlFor="Consignee">Consignee</label>
                   </div>
                   <div>
                     <input id="Shipper" type="checkbox" name="Shipper" onChange={this.toggleChangeShip1.bind(this,index, "S")}/>
                       <label htmlFor="Shipper">Shipper</label>
                   </div>
                   
                 </div>
               }
              })()}
                
                  
                  
                  
                  </div>
                  
              
              }
         
      </div> ) 
    }
     else{
      return <div key={index+1}>
         <select
                    onChange={(el) => this.HandleChangeCompany1(el, index)}
                    name={"Company"+(index+1)}
                  >
                    <option key={"Select"} value={"Select"}>--Select--</option>
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.SuperCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
         </select>
         <input type='button' value='remove' id={"remove" + (index+1)} className='dynamic-remove' onClick={this.removeClick.bind(this, index)}/>
         <div className="remember-forgot col-md-1">
            <div>
                <input id={"Consignee" + (index+1)} type="checkbox" name={"Consignee" + (index+1)} onChange={this.toggleChangeCon1.bind(this,index,"C")}/>
                <label htmlFor={"Consignee" + (index+1)}>Consignee</label>
            </div>
            <div>
                <input id={"Shipper" + (index+1)} type="checkbox" name={"Shipper" + (index+1)} onChange={this.toggleChangeShip1.bind(this,index,"S")}/>
                <label htmlFor={"Shipper" + (index+1)}>Shipper</label>
            </div>
         </div>
         
        </div>    
     }
   }      
    )
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
      fields
    });
  }

  HandleChangeCompany(e)
  {
       this.state.companies[0] = e.target.value
      this.state.editRegCompany.push({CompType:"",RegCompID:this.state.companies[0],IsEnable:true})
       //this.setState({values: this.state.values})
  }

  HandleChangeCompany1(e, index)
  {
    debugger;
    this.state.companies[index+1] = e.target.value
    this.state.editRegCompany.push({CompType:"",RegCompID:parseInt(this.state.companies[index+1]),IsEnable:true})
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
      let MOD =[];
      let arr = [];
      let arrDoc = [];
      arr = self.state.modeoftrans.split(',') 
      arrDoc = self.state.Documents.slice(0, -1).split(',')
      for (const [index, value] of response.data.Table3.entries()) {
        debugger;
        if(arr.includes(value.ID))
        {
        MOD.push({"ID":value.ID, "Value":value.Value, "IsSelected":1});
        }
        else
        {
          MOD.push({"ID":value.ID, "Value":value.Value, "IsSelected":0});
        }
      }
      for (const [index, value] of response.data.Table5.entries()) {
        if (arrDoc.includes(value.DocumentID)) {
          self.state.hideDocument.push({"DocumentID":value.DocumentID, "DocumentName":value.DocumentName, "IsSelected":1})
        }
        else{
          self.state.hideDocument.push({"DocumentID":value.DocumentID, "DocumentName":value.DocumentName, "IsSelected":0})
        }
      }

      // for (const [index, value] of response.data.Table7.entries()) {
      //   if (arrDoc.includes(value.DocumentID)) {
      //     self.state.accessrights.push({"id":value.DocumentID, "Value":value.DocumentName, "IsSelected":1})
      //   }
      //   else{
      //     self.state.hideDocument.push({"DocumentID":value.DocumentID, "DocumentName":value.DocumentName, "IsSelected":0})
      //   }
      // }
      self.setState({ selectCountry: response.data.Table, selectUserType: response.data.Table1,
        selectImpExp: response.data.Table2, selectCompany: response.data.Table4, 
        chkModeOfTrans: MOD, 
        hideDocument: self.state.hideDocument,
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
    debugger;
    let values = [...this.state.values];
    values.splice(i,1);
    this.setState({ values });
 }

 handlechange(field,e) {
   debugger;
  let fields = this.state.fields;
  fields[field] = e.target.value;        
  this.setState({
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
toggleChange(index,name, event) {
  
  if ([this.state.chkModeOfTrans[index].IsSelected] == 0) {
    this.setState({
      [this.state.chkModeOfTrans[index].IsSelected]: [this.state.chkModeOfTrans[index].IsSelected=1]
    })
  }
  else
  {
  this.setState({
    [this.state.chkModeOfTrans[index].IsSelected]: [this.state.chkModeOfTrans[index].IsSelected=0]
  })
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
    if (this.state.companies[0].split(':').includes("S")) {
      this.state.companies[0] =this.state.companies[0].split(':')[0]+":S"
    }
    else{
      this.state.companies[0] =this.state.companies[0].split(':')[0]
    }   
    this.setState({
      [this.state .companies[0]]: this.state.companies[0],
      isConsignee: !this.state.isConsignee
    })
  }
}

toggleChangeCon1(index, name, event) {
  debugger;
  if (this.state.companies[index+1].includes(":C") != true) {
    this.state.editRegCompany[index].CompType += name+","
    this.setState({
      [this.state.companies[index+1]]: this.state.companies[index+1]+=":"+name,
      isConsignee: !this.state.isConsignee,
      editRegCompany: this.state.editRegCompany
    });
  }
  else
  {
    if (this.state.companies[index+1].split(':').includes("S")) {
      this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]+":S"
      // this.state.editRegCompany.push({CompType:"",RegCompID:parseInt(this.state.companies[index+1]),IsEnable:true})
      this.state.editRegCompany[index].CompType = 'S,'
    }
    else{
      this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]
      this.state.editRegCompany[index].CompType = ''
    }   
    this.setState({
      [this.state .companies[index+1]]: this.state.companies[index+1],
      isConsignee: !this.state.isConsignee,
      editRegCompany: this.state.editRegCompany
    })
    // this.setState({
    //   [this.state.companies[index+1]]: this.state.companies[index+1],
    //   isConsignee: !this.state.isConsignee
    // })
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
    if (this.state.companies[0].split(':').includes("C")) {
      this.state.companies[0] =this.state.companies[0].split(':')[0]+":C"
    }
    else{
      this.state.companies[0] =this.state.companies[0].split(':')[0]
    }   
    this.setState({
      [this.state .companies[0]]: this.state.companies[0],
      isConsignee: !this.state.isConsignee
    })
  }
}

toggleChangeShip1(index, name, event) {
  debugger;
  if (this.state.companies[index+1].includes(":S") != true) {
    this.state.editRegCompany[index].CompType += name+","
    this.setState({
      [this.state.companies[index+1]]: this.state.companies[index+1]+=":"+name,
      isConsignee: !this.state.isConsignee,
      editRegCompany: this.state.editRegCompany
    });
  }
  else
  {
    if (this.state.companies[index+1].split(':').includes("C")) {
      this.state.editRegCompany[index].CompType = 'C,'
      this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]+":C"
    }
    else{
      this.state.editRegCompany[index].CompType = ''
      this.state.companies[index+1] =this.state.companies[index+1].split(':')[0]
    }   
    this.setState({
      [this.state .companies[index+1]]: this.state.companies[index+1],
      isConsignee: !this.state.isConsignee,
      editRegCompany: this.state.editRegCompany
    })
    // this.setState({
    //   [this.state.companies[index+1]]: this.state.companies[index+1],
    //   isConsignee: !this.state.isConsignee
    // })
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
   const docData = new FormData();
   var userid = encryption(window.localStorage.getItem("userid"),"desc");
    this.setState({ submitted: true }); 
    let ModeOfTransport = "";  
    let Document = "";
    let HideInvoiceDetails = "";
    var RegisteredCompany = "";
    // if (this.state.isAir === true) {
    //   ModeOfTransport+="A";
    // }
    // if (this.state.isOcean === true) {
    //   ModeOfTransport+=",O";
    // }
    // if (this.state.isLand === true) {
    //   ModeOfTransport+=",L";
    // }
    for(const[index,value] of this.state.chkModeOfTrans.entries())
    {
       if (value.ID == 'A' && value.IsSelected==1) {
        ModeOfTransport+="A,";
       }
       if (value.ID == 'O' && value.IsSelected==1) {
        ModeOfTransport+="O,";
       }
       if (value.ID == 'L' && value.IsSelected==1) {
        ModeOfTransport+="L,";
       }
    }
    ModeOfTransport = ModeOfTransport.slice(0, -1)

    for(const[index,value] of this.state.editRegCompany.entries())
    {
      debugger;
      if (value.CompType.includes('C') && value.CompType.includes('S')) {
        this.state.RegCompany.push(value.RegCompID+":C")
        this.state.RegCompany.push(value.RegCompID+":S")
      }
      else if (value.CompType.includes('C')) {
        this.state.RegCompany.push(value.RegCompID+":C")
      }
      else if (value.CompType.includes('S')) {
        this.state.RegCompany.push(value.RegCompID+":S")
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
       if(this.state.hideDocument[index].IsSelected == true)
       {
        Document+=((this.state.hideDocument[index].DocumentID)+",");       
       }
    })
    Document = Document.slice(0, -1);
    // const { username, password, emailid, firstname, 
    //   lastname, refreshtime, country, isenabled, usertype, usercreation,
    //   isadmin, ImpExp, displayShipper, displayConsignee, MobileEnable,
    //   Company, Consignee, Shipper} = this.state;
    var username = this.state.fields["username"];
    var pW = this.state.fields["password"];
    var isenabled = this.state.fields["isenabled"]
    
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
    docData.append("UserName",this.state.fields["username"]);
    docData.append("Password",this.state.fields["password"]);
    docData.append("IsEnabled",this.state.fields["isenabled"]);
    docData.append("ClientAdminID",0);
    docData.append("DisplayAsShipper",this.state.fields["displayShipper"]);
    docData.append("DisplayAsConsignee",this.state.fields["displayConsignee"]);
    docData.append("UserType",this.state.fields["usertype"]);
    docData.append("ModeOfTransport",ModeOfTransport);
    docData.append("CanCreateUser",0);
    docData.append("CreatedBy",userid);
    docData.append("EmailID",this.state.fields["emailid"]);
    docData.append("ImpExp",this.state.fields["ImpExp"]);
    docData.append("IsAdmin",this.state.fields["isadmin"]);
    docData.append("IsMywayUser","Y");
    docData.append("MywayUserName",this.state.fields["username"]);
    docData.append("MywayPassword","");
    docData.append("FirstName",this.state.fields["firstname"]);
    docData.append("LastName",this.state.fields["lastname"]);
    docData.append("CountryCode",this.state.fields["country"]);
    docData.append("RefreshTime",this.state.fields["refreshtime"]);
    docData.append("IsNew",true);
    docData.append("IsMobileEnabled",false);
    docData.append("ProfileType",1);
    docData.append("ProfileSubType",0);
    docData.append("HasMobileAccess",true);
    docData.append("ModuleID","1,2,3");
    docData.append("DocumentID",Document);
    docData.append("IsHideInvoiceDetails",true);
    docData.append("IsHideHBLShowMBLDocument",true);
    docData.append("Logo",this.state.selectedFile);
    docData.append("RegisteredCompany",RegisteredCompany);
    // var docDesc = document.getElementById("docDesc").value;
      if(this.handleValidation()){
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/MyWayAPI/CreateUserWithDoc",
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
      }).then(function(response) {
        debugger;
        alert(response.data[0].Message)
      }).catch(error => console.log(error.response))
  }
  else {
    debugger;
    this.setState({ settoaste: true, loading: true });
    
    }
  }

  handleUpdate(e){
    const docData = new FormData();
    var userid = encryption(window.localStorage.getItem("userid"),"desc");
    this.setState({ submitted: true }); 
    let ModeOfTransport = "";  
    let Document = "";
    let HideInvoiceDetails = "";
    var RegisteredCompany = "";
    // if (this.state.isAir === true) {
    //   ModeOfTransport+="A";
    // }
    // if (this.state.isOcean === true) {
    //   ModeOfTransport+=",O";
    // }
    // if (this.state.isLand === true) {
    //   ModeOfTransport+=",L";
    // }
    for(const[index,value] of this.state.chkModeOfTrans.entries())
    {
       if (value.ID == 'A' && value.IsSelected==1) {
        ModeOfTransport+="A,";
       }
       if (value.ID == 'O' && value.IsSelected==1) {
        ModeOfTransport+="O,";
       }
       if (value.ID == 'L' && value.IsSelected==1) {
        ModeOfTransport+="L,";
       }
    }
    ModeOfTransport = ModeOfTransport.slice(0, -1)

    for(const[index,value] of this.state.editRegCompany.entries())
    {
      if (value.CompType.includes('C') && value.CompType.includes('S')) {
        this.state.RegCompany.push(value.RegCompID+":C")
        this.state.RegCompany.push(value.RegCompID+":S")
      }
      else if (value.CompType.includes('C')) {
        this.state.RegCompany.push(value.RegCompID+":C")
      }
      else if (value.CompType.includes('S')) {
        this.state.RegCompany.push(value.RegCompID+":S")
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
       if(this.state.hideDocument[index].IsSelected == true)
       {
        Document+=((this.state.hideDocument[index].DocumentID)+",");       
       }
    })
    Document = Document.slice(0, -1);
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

    docData.append("UserID",874585);
    docData.append("UserName",this.state.fields["username"]);
    docData.append("Password",this.state.fields["password"]);
    docData.append("IsEnabled",this.state.fields["isenabled"]);
    docData.append("ClientAdminID",0);
    docData.append("DisplayAsShipper",this.state.fields["displayShipper"]);
    docData.append("DisplayAsConsignee",this.state.fields["displayConsignee"]);
    docData.append("UserType",this.state.fields["usertype"]);
    docData.append("ModeOfTransport",ModeOfTransport);
    docData.append("CanCreateUser",0);
    docData.append("CreatedBy",userid);
    docData.append("EmailID",this.state.fields["emailid"]);
    docData.append("ImpExp",this.state.fields["ImpExp"]);
    docData.append("IsAdmin",this.state.fields["isadmin"]);
    docData.append("IsMywayUser","Y");
    docData.append("MywayUserName",this.state.fields["username"]);
    docData.append("MywayPassword","");
    docData.append("FirstName",this.state.fields["firstname"]);
    docData.append("LastName",this.state.fields["lastname"]);
    docData.append("CountryCode",this.state.fields["country"]);
    docData.append("RefreshTime",this.state.fields["refreshtime"]);
    docData.append("IsNew",true);
    docData.append("IsMobileEnabled",false);
    docData.append("ProfileType",1);
    docData.append("ProfileSubType",0);
    docData.append("HasMobileAccess",true);
    docData.append("ModuleID","1,2,3");
    docData.append("DocumentID",Document);
    docData.append("IsHideInvoiceDetails",this.state.miscelleneous[0].IsSelected);
    docData.append("IsHideHBLShowMBLDocument",this.state.miscelleneous[1].IsSelected);
    docData.append("Logo",this.state.selectedFile);
    docData.append("RegisteredCompany",RegisteredCompany);
      if(this.handleValidation()){
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/MyWayAPI/UpdateUserWithDoc",
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
      }).then(function(response) {
        debugger;
      }).catch(error => console.log(error.response))
  }
  else {
    debugger;
    this.setState({ settoaste: true, loading: true });
    
    }
  }

  componentDidMount() {
    debugger;
    if(this.props.location.state != undefined)
    {
    var userId = this.props.location.state.detail;
    let fields = this.state.fields;
    this.setState({ srnos: userId})
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
      fields["usercreation"] = response.data.Table[0].CanCreateUser;
      fields["isadmin"] = response.data.Table[0].IsAdmin;
      fields["ImpExp"] = response.data.Table[0].ImpExp;
      fields["displayShipper"] = response.data.Table[0].DisplayAsShipper;
      fields["displayConsignee"] = response.data.Table[0].DisplayAsConsignee;
      fields["MobileEnable"] = response.data.Table[0].HasMobileAccess;
      for (const [index, value] of response.data.Table3.entries()) {
        self.state.Documents +=  value.DocumentID + ","
      }
      var arr='';
      var arrfinal=[];
      var arrData=response.data.Table2;
      for(let k=0;k<arrData.length;k++)
      {     
            if(arr.includes(arrData[k].RegCompID))
            {
              var final='';
              
              for(let l=0;l<arrfinal.length;l++)
              {
                final=arrfinal[l].RegCompID+',';
                
                if(final.includes(arrData[k].RegCompID))
                {
                  arrfinal[l].CompType=arrfinal[l].CompType+','+arrData[k].CompType;
                }
              }
             
            }
            else{
              arr+=arrData[k].RegCompID+',';
              arrfinal.push(arrData[k]);
              self.state.values.push('e'+k)
            }
            
      }
      
      self.setState({ fields, modeoftrans: response.data.Table[0].ModeOfTransport, 
        editRegCompany:arrfinal});
       
    });
  }
  }
  
  fileChangedHandler = event => {
    debugger;
    this.setState({ selectedFile: event.target.files[0] })
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
                    value={this.state.fields["refreshtime"]}
                    onChange={this.handlechange.bind(this, "refreshtime")}
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
                    value={this.state.fields["isenabled"]}
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
                    onChange={this.HandleChangeSelect.bind(this,"usercreation")}
                    name={"usercreation"}
                    value={this.state.fields["usercreation"]}
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
                    value={this.state.fields["isadmin"]}
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
                    onChange={this.HandleChangeSelect.bind(this, "displayShipper")}
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
               <div className="login-fields col-md-2">
                  <label>Display As Consignee</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this,"displayConsignee")}
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
               <div className="login-fields col-md-4">
                 <label>Mode Of Transport</label>
                 <div className="remember-forgot col-md-1">
         
                 { 
                this.state.chkModeOfTrans.map((chkModeOfTrans, index) =>
            <div key={chkModeOfTrans.ID}>
                    <input id={chkModeOfTrans.ID} type="checkbox" name={chkModeOfTrans.Value} value={chkModeOfTrans.ID} 
                    defaultChecked={chkModeOfTrans.IsSelected} onChange={this.toggleChange.bind(this, index, chkModeOfTrans.Value)} />
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
                     <input id="MobileEnable" type="checkbox" name="MobileEnable" defaultChecked={this.state.fields["MobileEnable"]} onChange={this.toggleChange}/>
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
               <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
               <div className="row">
               <div className="login-fields col-md-12">
                 <label>Hide Document('S)</label>
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
                    />
                       <label htmlFor={accessrights.id}>{accessrights.Value}</label> 
                             
                </div>
                )
                }
                </div>
                
               </div>
               </div>
               <div className="row">
               <div className="login-fields col-md-12">
               <input type="file" onChange={this.fileChangedHandler}/>
               </div>
               </div>
               <div className="text-right">
                <button
                  type="button"
                  className="butn"
                  onClick={this.handleSubmit}
                  
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="butn"
                  onClick={this.handleUpdate}
                  // disabled={loading}
                >
                  {/* {loading && <i className="fa fa-refresh fa-spin"></i>} */}
                  Update
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
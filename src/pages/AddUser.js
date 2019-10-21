import React from "react";
import appSettings from "../helpers/appSetting";
// import Logo from "./../assets/img/logo.png";
// import {
//     NotificationContainer,
//     NotificationManager
//   } from "react-notifications";
import Headers from "../component/header";
import AdminSideMenu from "../component/adminSideMenu";
import axios from "axios";
import {authHeader} from "../helpers/authHeader";
import { is } from "@babel/types";

var string = "";
class AddUser extends React.Component{

  constructor() {
    super()
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
      isShipper: false
      
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
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.SuperCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
         </select>
         <input type='button' value='remove' className='dynamic-remove' onClick={this.removeClick.bind(this, i)}/>
         <div className="remember-forgot col-md-1">
            <div>
                <input id={"Consignee" + i} type="checkbox" name={"Consignee" + i} onChange={this.toggleChangeConShip1.bind(this,index,"C")}/>
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


  HandleChangeSelect(e) {
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
    var userid = window.localStorage.getItem("userid");
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

 handlechange(e) {
   debugger;
  this.setState({
    [e.target.name]: e.target.value
  });
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
  // this.setState({
  //   isLand: !this.state.isLand
    
  // });
  // this.setState({
  //   isAir: !this.state.isAir
    
  // });
  
}

toggleChangeConShip(name, event) {
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

toggleChangeConShip1(index, name, event) {
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
      [this.state .companies[index+1]]: this.state.companies[index+1],
      isConsignee: !this.state.isConsignee
    })
  }
}

 handleSubmit(e) {    
   debugger; 
   var userid = window.localStorage.getItem("userid");
    this.setState({ submitted: true }); 
    let ModeOfTransport = "";  
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
    const { username, password, emailid, firstname, 
      lastname, refreshtime, country, isenabled, usertype, usercreation,
      isadmin, ImpExp, displayShipper, displayConsignee, MobileEnable,
      Company, Consignee, Shipper} = this.state;
    
      axios({
        method: "post",
        url: "http://vizio.atafreight.com/mywayapi/Login",
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
          IsMobileEnabled: MobileEnable,
          ProfileType: 1,
          ProfileSubType: 0,
          HasMobileAccess: 1,
          ModuleID: "1,2,10,11,12",
          DocumentID: "377508114,377508116,377508115,359024115,459900134,459900135,401814122",
          IsHideInvoiceDetails: 1,
          IsHideHBLShowMBLDocument: 1,
          RegisteredCompany: RegisteredCompany

        },
        headers: authHeader("no")
      }).then(function(response) {
      })
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
                    onChange={this.handlechange}
                    placeholder="Enter Your User Name"
                  />
               </div>
               <div className="login-fields col-md-4">
                  <label>Password</label>
                  <input
                    type="text"
                    name={"password"}
                    onChange={this.handlechange}
                    placeholder="Enter Your Password"
                  />
               </div>
               <div className="login-fields col-md-4">
                  <label>Email Id</label>
                  <input
                    type="text"
                    name={"emailid"}
                    onChange={this.handlechange}
                    placeholder="Enter Your Email Id"
                  />
               </div>
               </div>
            <div className="row">
                <div className="login-fields col-md-4">
                  <label>First Name</label>
                  <input
                    type="text"
                    name={"firstname"}
                    onChange={this.handlechange}
                    placeholder="Enter Your First Name"
                  />
               </div>
               <div className="login-fields col-md-4">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name={"lastname"}
                    onChange={this.handlechange}
                    placeholder="Enter Your Last Name"
                  />
               </div>
               <div className="login-fields col-md-4">
               <label>Country</label>
               
               <select
                    onChange={this.HandleChangeSelect.bind(this)}
                    name={"country"}
                  >
                    {this.state.selectCountry.map(team => (
                      <option key={team.SUCountry} value={team.SUCountry}>
                        {team.CountryName}
                      </option>
                    ))}
                  </select>
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
                    onChange={this.HandleChangeSelect.bind(this)}
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
            <div>
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
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompID}>
                        {team.RegCompName}
                      </option>
                    ))}
                  </select>
                  <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Consignee" type="checkbox" name="Consignee" onChange={this.toggleChangeConShip.bind(this, "C")}/>
                       <label htmlFor="Consignee">Consignee</label>
                   </div>
                   <div>
                     <input id="Shipper" type="checkbox" name="Shipper" onChange={this.handlechangeConShip}/>
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
                <div className="remember-forgot col-md-4">
                  <input id={hideDocument.DocumentID} type="checkbox" name={hideDocument.DocumentName} value={hideDocument.DocumentID} 
                  checked={hideDocument.IsSelected}/>
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
                <div>
                    <input id={miscelleneous.InvFlag} type="checkbox" value={miscelleneous.InvFlag} 
                    checked={miscelleneous.IsSelected} />
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
                <div className="remember-forgot col-md-3">
                    <input id={accessrights.id} type="checkbox" value={accessrights.Value} />
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
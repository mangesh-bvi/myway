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
        { key: "1", value: "True" },
        { key: "2", value: "False" }
      ],
      selectUserType: [],
      selectIsAdmin: [
        { key: "1", value: "Yes" },
        { key: "2", value: "No" }
      ],
      selectImpExp: [],
      selectCompany: []
    }
  }
  
  createUI(){
    var i = 1
    return this.state.values.map((el, i) => 
        <div key={i}>
         <select
                    onChange={this.HandleChangeSelect.bind(this)}
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
                <input id={"Consignee" + i} type="checkbox"/>
                <label htmlFor={"Consignee" + i}>Consignee</label>
            </div>
            <div>
                <input id={"Shipper" + i} type="checkbox"/>
                <label htmlFor={"Shipper" + i}>Shipper</label>
            </div>
         </div>
         
        </div>          
    )
    i++;
 }


  HandleChangeSelect(event) {
    this.setState({
      value: event.target.value
  });
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
        selectImpExp: response.data.Table2, selectCompany: response.data.Table4
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
    render() {
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
                    name={"username"}
                    onChange={this.handlechange}
                    placeholder="Enter Your Password"
                  />
               </div>
               <div className="login-fields col-md-4">
                  <label>Email Id</label>
                  <input
                    type="text"
                    name={"username"}
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
                    name={"username"}
                    onChange={this.handlechange}
                    placeholder="Enter Your First Name"
                  />
               </div>
               <div className="login-fields col-md-4">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name={"username"}
                    onChange={this.handlechange}
                    placeholder="Enter Your Last Name"
                  />
               </div>
               <div className="login-fields col-md-4">
               <label>Country</label>
               
               <select
                    onChange={this.HandleChangeSelect.bind(this)}
                  >
                    {this.state.selectCountry.map(team => (
                      <option key={team.SUCountry} value={team.CountryName}>
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
                    name={"username"}
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
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
                <div className="login-fields col-md-2">
                  <label>User Type</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this)}
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
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
                <div className="login-fields col-md-2">
                  <label>Is Admin</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this)}
                  >
                    {this.state.selectIsAdmin.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
                <div className="login-fields col-md-2">
                  <label>Imp. Exp.</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this)}
                  >
                    {this.state.selectImpExp.map(team => (
                      <option key={team.ID} value={team.Value}>
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
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
               <div className="login-fields col-md-2">
                  <label>Display As Consignee</label>
                  <select
                    onChange={this.HandleChangeSelect.bind(this)}
                  >
                    {this.state.selectIsEnable.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
               </div>
               <div className="login-fields col-md-4">
                 <label>Mode Of Transport</label>
                 <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Air" type="checkbox"/>
                       <label htmlFor="Air">Air</label>
                   </div>
                   <div>
                     <input id="Ocean" type="checkbox"/>
                       <label htmlFor="Ocean">Ocean</label>
                   </div>
                   <div>
                     <input id="Land" type="checkbox"/>
                       <label htmlFor="Land">Land</label>
                   </div>
                 </div>
               </div>
               <div className="login-fields col-md-4">
                 <label>Is Mobile Enabled?</label>
                 <div className="remember-forgot col-md-1">
                   <div>
                     <input id="MobileEnable" type="checkbox"/>
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
                    onChange={this.HandleChangeSelect.bind(this)}
                  >
                    {this.state.selectCompany.map(team => (
                      <option key={team.RegCompID} value={team.RegCompName}>
                        {team.RegCompName}
                      </option>
                    ))}
                  </select>
                  <div className="remember-forgot col-md-1">
                   <div>
                     <input id="Consignee" type="checkbox"/>
                       <label htmlFor="Consignee">Consignee</label>
                   </div>
                   <div>
                     <input id="Shipper" type="checkbox"/>
                       <label htmlFor="Shipper">Shipper</label>
                   </div>
                   
                 </div>
                  </div>
                  {this.createUI()} 
                  {this.state.values}
                  </div>
                  
               </div>
               <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
            </div>
        </div>
          </div>
          </div>
        </div>
      );
    }
   
}

export default AddUser;
import React,{ Component } from "react";
import "../assets/css/custom.css"

class Header extends Component{
    constructor(props)
    {
        super(props);
        this.state={
         
        }
    }

    componentDidMount(){
        if(window.localStorage.getItem('username')==null)
        {
            window.location.href="./login";
        }
        else{
            document.getElementById('spnUser').textContent=window.localStorage.getItem('username');
            document.getElementById('spnFirstName').textContent=window.localStorage.getItem('username');
            document.getElementById('spnLastLogin').textContent=window.localStorage.getItem('lastlogindate');
          

        }
        
    }

    onLogout()
    {
        localStorage.clear();
        window.location.href='./login';
    }

    onSetting()
    {
        // document.getElementById("dvsetting").className.remove("cls-hide");
    }
    render(){
    return (
        <div>
            <div className="cls-header"><h3>My Way:- Welcome <span id="spnUser"></span>&nbsp;&nbsp;<a id="btnSetting"  onClick={this.onSetting.bind(this)} href="#/">Setting</a></h3>
             
            </div>     
            <div id="dvsetting" className="">
                <div>UserName:<span id='spnFirstName'></span></div>
                <div>LastLogin:<span id='spnLastLogin'></span></div>
                <div>Activity Log</div>
                <div><a href="/ChangePassword">Change Password</a></div>
                <div><a id='LogOut' onClick={this.onLogout.bind(this)} href={null}>Logout</a></div>
            </div>
           
        </div>
        );

    }
}

export default Header;
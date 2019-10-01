import React from 'react'
import { authHeader } from '../helpers/authHeader'
import appSettings from '../helpers/appSetting'


class ChangePassword extends React.Component {
    constructor(props)
    {
        super(props)
        this.state = {
          oldpassword: '',        
          password: '',
          newpassword: '',            
        };
        this.handlechange = this.handlechange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
      if(window.localStorage.getItem('username')==null)
      {
          window.location.href='./';
      }
  }
    handlechange (e) {   

      this.setState({
        [e.target.name]: e.target.value
      })
    }
    handleSubmit (e) {
        debugger;
      //  e.preventDefault();
       
        var oldpwd=window.localStorage.getItem('password');
        this.setState({ submitted: true });
        const { oldpassword, password,newpassword } = this.state;   
        if(oldpassword!==oldpwd)
        {
          alert('Please enter correct old password');
          return false;
        }    
        if (password===newpassword) {
            ChangePasswordCheck(oldpwd,newpassword);
        }
        else{
            alert('Confirmed password is not matched');
        }
    }
    render() {    
        return (
            <div>
                <div>Old Password&nbsp;<input type="password" name={'oldpassword'} onChange={this.handlechange}  placeholder="Old Password"></input></div>
                <div>Password:&nbsp;<input id="password" name={'password'} onChange={this.handlechange} placeholder="Password" type="password"></input></div>
                <div>New Password:&nbsp;<input id="newpassword" name={'newpassword'} onChange={this.handlechange} placeholder="Confirm Password" type="password"></input></div>
                <div>&nbsp;<button type="button" onClick={() => this.handleSubmit()}>Change Password</button></div>
            </div>
        );
    }
} 

function ChangePasswordCheck (password, newpassword) {    
    const requestOptions = {
      method: 'POST',
      headers:authHeader(),
      body: JSON.stringify({
        UserName:window.localStorage.getItem('username'),
        OldPassword:password,
        NewPassword:newpassword      
      })
    };
    return fetch(`${appSettings.APIURL}/ChangeUserPassword`, requestOptions).then(handleResponse)
    .catch((error) => {
        console.log(error)
      });
  }



  function handleResponse(response) {   
      debugger;
    console.log(response);
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        alert('oops error occured');
      }
      else{
        alert('Password change successfully');
      }
  
      return data;
    });
  }


export default ChangePassword;
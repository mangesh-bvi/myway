import React from 'react'
import { authHeader } from '../helpers/authHeader'
import appSettings from '../helpers/appSetting'

class Passcode extends React.Component {
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

    handlechange (e) {         
      this.setState({
        [e.target.name]: e.target.value
      })
    }
    handleSubmit (e) {
        debugger;
      //  e.preventDefault();
        var username=window.localStorage.getItem('username');
        this.setState({ submitted: true });
        const { oldpassword, password,newpassword } = this.state;       
        if (oldpassword!=='' && password!==''&&newpassword!==''&&password==newpassword) {
            ChangePasswordCheck(username,password,newpassword);
        }
        else{
            // var error= username===''?'Please enter the username\n':'';
            //     error+=password===''?'Please enter the passowrd':'';
                alert('error');
        }
    }
    render() {     
        return (
            <div>
                <div>UserName&nbsp;<input type="text" name={'oldpassword'} onChange={this.handlechange}  placeholder="UserName"></input></div>
                <div>Passcode:&nbsp;<input id="password" name={'password'} onChange={this.handlechange} placeholder="Passcode" type="text"></input></div>                
                <div>&nbsp;<button type="button" className="btn btn-primary" onClick={() => this.handleSubmit()}>Submit</button></div>
            </div>
        );
    }
} 

function ChangePasswordCheck (password, newpassword) {
    console.log("LOGGING IN 1");
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
        const error = (data && data.error) || response.statusText || data.status;
        console.log("%c>>>>>>> Error content:","color:red;font-weight:bold;");
        console.dir(error);
  
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          // logout();
         // location.reload(true);
        }
        if (response.status === 500) {
  
        }
        if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error('ERROR: Something went wrong.')
        }
      }
  
      return data;
    });
  }


export default Passcode;
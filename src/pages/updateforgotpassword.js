import React from 'react'
import { authHeader } from '../helpers/authHeader'
import appSettings from '../helpers/appSetting'

class Updateforgotpassword extends React.Component {
    constructor(props)
    {
        super(props)
        this.state = {
          password: '',        
          confirmPassword: ''
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
        this.setState({ submitted: true });
        const {emailaddress,passcode} = this.state;       
        if (emailaddress!=='' && passcode!=='') {
            ValidatePassCode(emailaddress,passcode);
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
                <div>Password&nbsp;<input type="text" name={'password'} onChange={this.handlechange}  placeholder="Password"></input></div>
                <div>Confirm Password:&nbsp;<input id="confirmpassword" name={'confirmPassword'} onChange={this.handlechange} placeholder="Passcode" type="text"></input></div>                
                <div>&nbsp;<button type="button" className="btn btn-primary" onClick={() => this.handleSubmit()}>Submit</button></div>
            </div>
        );
    }
} 

function ValidatePassCode (UserId, Password) {   
    const requestOptions = {
      method: 'POST',
      headers:authHeader('no'),
       body: JSON.stringify({       
        UserID:UserId,
        Password:Password      
      })
    };
    return fetch(`${appSettings.APIURL}/UpdatePassword`, requestOptions).then(handleResponse)
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
          alert('Oops! error occured');  
      }
      else{
         alert('Password has been updated successfully');
         window.location.href="./login";
      }
  
      return data;
    });
  }


export default Updateforgotpassword;
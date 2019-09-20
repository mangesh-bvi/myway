import React, { Component } from 'react'


class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state={
         alert:null
        };
    }

    deleteThisGoal() {
       alert("hello world");
      }
      hideAlert() {
        console.log('Hiding alert...');
        this.setState({
          alert: null
        });
      }
    render() {
        return (
            <div>
                <div>UserName:&nbsp;<input id="userName" type="text"></input></div>
                <div>Password:&nbsp;<input id="password" type="text"></input></div>
                <div>&nbsp;<button type="button" onClick={() => this.deleteThisGoal()}>Login1</button></div>
            </div>
        );
    }
} 



export default Login;

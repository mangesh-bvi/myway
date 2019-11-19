import React from 'react';
import './App.css';
import {connect} from 'react-redux';
function App(props) {
    console.log(props);
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div>UserName:<input type="text"></input></div>
        <div>Password:<input type="text"></input></div>
        <div><button type="button" >Login</button></div>
      </header>
    </div>
  );
}

const mapStateToProps=(state)=>{  
  debugger
    console.log(state);
    return {
      myname:state.username
    };
  }

export default connect(mapStateToProps)(App);

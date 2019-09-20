import React from 'react';
import './App.css';

function App() {
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

export default App;

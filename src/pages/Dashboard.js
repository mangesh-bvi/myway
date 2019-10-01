import React,{ Component } from "react";
import "../styles/custom.css"
import Headers from '../component/header'
import SideMenu  from '../component/sidemenu'
class Dashboard extends Component{
    constructor(props)
    {
        super(props);
        this.state={
         
        }
    }

    render(){
       
    return (
        <div>
            <Headers/>
            <div className="cls-ofl">
                <div className="cls-flside">
                  <SideMenu/>
                </div>
                <div className="cls-rt">                 
                </div>
            </div>

        </div>
        );
    }
}

export default Dashboard;
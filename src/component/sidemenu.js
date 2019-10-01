import React,{ Component } from "react";
import "../styles/custom.css"

class SideMenu extends Component{
    constructor(props)
    {
        super(props);
        this.state={
         
        }
    }

    render(){
    return (
        <div>
            <div>
            <ul>
                <li>World View</li>
                <li>Shipment Summary</li>
                <li>Track Shipment</li>
                <li>Event Management</li>
                <li>Metric</li>
                <li>Shipment Planner</li>
                <li>Green Counter</li>
            </ul>
            </div>           
        </div>
        );

    }
}

export default SideMenu;
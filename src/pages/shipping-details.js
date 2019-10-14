import React from 'react';
import { Table } from 'react-bootstrap';
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from 'axios';
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";

class ShippingDetails  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      products: []
    }
  }

  componentDidMount() {
    let self = this;
   var userid=window.localStorage.getItem("userid");
   console.log("ship date start"+new Date());
   axios({
     method: 'post',
     url: `${appSettings.APIURL}/shipmentsummaryAPI`,
     data: {
       UserId: userid,
       PageNo:1   
     },
     headers:authHeader()
   }).then(function (response) { 
     debugger;
    console.log("ship end date"+new Date());
        var data=[];
        data=response.data.Table1;  
     self.setState({products:data});///problem not working setstat undefined
   });
  }

  render() {
    const { error, products} = this.state;
    function Greeting(props) {
      debugger;
      const isLoggedIn = props.isLoggedIn;
      if (isLoggedIn==="NYCAI-SEP19-0001270") {
        return <img src={Truck}></img>;
      }
      else{
        return <img src={Rail}></img>;
      }
    
    }
    if(error) {
      return (
        <div>Error: {error.message}</div>
      )
    } else {
      return(
        <div>
          <h2>Product List</h2>
          <Table striped bordered hover>          
            <thead>
              <tr>
                <th>#ID</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.ShipmentNumber}>
                  <td>{product.ShipmentNumber}</td>   
                  <td> <Greeting isLoggedIn={product.ShipmentNumber} ></Greeting></td>     
                  <td>{product.ShipmentNumber}</td>
                  <td>{product.ShipmentNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )
    }
  }
}

export default ShippingDetails ;
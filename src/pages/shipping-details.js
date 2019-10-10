import React, { Component } from "react";
import "../styles/custom.css";
import { UncontrolledTooltip } from "reactstrap";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import DownArrow from "./../assets/img/down-arrow.png";
import Ship from "./../assets/img/ship.png";
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";
import Plane from "./../assets/img/plane.png";
import Transit from "./../assets/img/transit.png";
import Box from "./../assets/img/box.png";
import Delivered from "./../assets/img/delivered.png";
import InPlane from "./../assets/img/in-plane.png";

class ShippingDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="title-sect">
              <h2>Shipments</h2>
              <div className="d-flex align-items-center">
                <input type="search" placeholder="Search here" />
                <a href="#!" className="butn light-blue-butn">
                  List View
                </a>
                <a href="#!" className="butn">
                  Map
                </a>
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      No
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      Shipment Mode{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      Customer Name{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      Shipper Details{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      POL{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      POD{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      Status{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      ETA{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                    <th>
                      Event{" "}
                      <span className="down-arrow">
                        <img src={DownArrow} alt="down arrow icon" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td>
                      <span className="shipment-img">
                        <img src={Ship} alt="ship icon" />
                      </span>
                    </td>
                    <td>David Robinson</td>
                    <td>Abc Xyz</td>
                    <td>Port of Houston</td>
                    <td>Western Cape</td>
                    <td>
                      <span className="status-img" id="transit">
                        <img src={Transit} alt="transit icon" />
                      </span>
                      <UncontrolledTooltip placement="right" target="transit">
                        In Transit
                      </UncontrolledTooltip>
                    </td>
                    <td>19/08/2019</td>
                    <td className="clr-green">On Time</td>
                  </tr>
                  <tr>
                    <td className="text-center">2</td>
                    <td>
                      <span className="shipment-img">
                        <img src={Truck} alt="truck icon" />
                      </span>
                    </td>
                    <td>Scott Brown</td>
                    <td>Abc Xyz</td>
                    <td>New York</td>
                    <td>Virginia</td>
                    <td>
                      <span className="status-img" id="boxed">
                        <img src={Box} alt="box icon" />
                      </span>
                      <UncontrolledTooltip placement="right" target="boxed">
                        Boxed
                      </UncontrolledTooltip>
                    </td>
                    <td>12/05/2019</td>
                    <td className="clr-yellow">Dealy Risk</td>
                  </tr>
                  <tr>
                    <td className="text-center">3</td>
                    <td>
                      <span className="shipment-img">
                        <img src={Rail} alt="rail icon" />
                      </span>
                    </td>
                    <td>Robbin Miller</td>
                    <td>Abc Xyz</td>
                    <td>Nevada</td>
                    <td>Los Angeles</td>
                    <td>
                      <span className="status-img" id="delivered">
                        <img src={Delivered} alt="delivered icon" />
                      </span>
                      <UncontrolledTooltip placement="right" target="delivered">
                        Delivered
                      </UncontrolledTooltip>
                    </td>
                    <td>20/09/2019</td>
                    <td className="clr-green">On Time</td>
                  </tr>
                  <tr>
                    <td className="text-center">4</td>
                    <td>
                      <span className="shipment-img">
                        <img src={Plane} alt="plane icon" />
                      </span>
                    </td>
                    <td>Smith Johnson</td>
                    <td>Abc Xyz</td>
                    <td>Texas</td>
                    <td>Dubai</td>
                    <td>
                      <span className="status-img" id="in-plane">
                        <img src={InPlane} alt="in-plane icon" />
                      </span>
                      <UncontrolledTooltip placement="right" target="in-plane">
                        In Plane
                      </UncontrolledTooltip>
                    </td>
                    <td>12/06/2019</td>
                    <td className="clr-red">Behind Schedue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShippingDetails;

import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";

import ShipWhite from "./../assets/img/ship-white.png";
import PlaneWhite from "./../assets/img/plane-white.png";
import BlueShip from "./../assets/img/circle-ship.png";
import BluePlane from "./../assets/img/circle-plane.png";
import BookingBlue from "./../assets/img/circle-booked.png";
import LoadingImg from "./../assets/img/loading.gif";

// import TruckWhite from "./../assets/img/truck-white.png";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import GreenPlus from "./../assets/img/green-plus.png";
import Ship from "./../assets/img/ship.png";
import Truck from "./../assets/img/truck.png";
import Rail from "./../assets/img/rail.png";
import Plane from "./../assets/img/plane.png";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

const { compose } = require("recompose");
// const MapWithAMakredInfoWindow = compose(
//   withScriptjs,
//   withGoogleMap
// )(props => (
//   <GoogleMap
//     defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
//     defaultZoom={3}
//   >
//     {props.markers.map(marker => {
//       const onClick = props.onClick.bind(this, marker);
//       let blueShip = new window.google.maps.MarkerImage(
//         BlueShip,
//         new window.google.maps.Size(16, 16)
//       );
//       let bluePlane = new window.google.maps.MarkerImage(
//         BluePlane,
//         new window.google.maps.Size(16, 16)
//       );
//       let bookingBlue = new window.google.maps.MarkerImage(
//         BookingBlue,
//         new window.google.maps.Size(16, 16)
//       );

//       if (marker.Pin == "Ocean") {
//         return (
//           <Marker
//             key={marker.id}
//             onClick={onClick}
//             title={marker.Vessel}
//             position={{
//               lat: Number(marker.LastLocation_Lat),
//               lng: Number(marker.LastLocation_Lon)
//             }}
//             icon={blueShip}
//           >
//             {props.selectedMarker === marker && (
//               <InfoWindow>
//                 <div>
//                   {props.ModalData.map(function(mdata, i) {
//                     let Hblno = mdata["HBL#"];
//                     let shipmentdetails = "shipment-details?hblno=" + Hblno;
//                     var inovceno;
//                     var finalinvoce;
//                     var finalinvocearr = [];
//                     var C_colid = "#" + mdata.ContainerNo;
//                     var C_HblNO = "#" + mdata["HBL#"];

//                     if (
//                       (mdata["InvoiceNumber/Productid"] != "") &
//                       (mdata["InvoiceNumber/Productid"] != null)
//                     ) {
//                       inovceno = mdata["InvoiceNumber/Productid"].split(":");
//                       if (inovceno.length > 0) {
//                         for (let index = 0; index < inovceno.length; index++) {
//                           finalinvoce = inovceno[index].split("|")[0];
//                           finalinvocearr.push(finalinvoce);
//                         }
//                       }
//                     }
//                     return (
//                       <div className="pinmodal">
//                         <div id="accordion">
//                           <div class="card">
//                             <div class="card-header" id="heading-1">
//                               <h5 class="mb-0">
//                                 <div
//                                   role="button"
//                                   data-toggle="collapse"
//                                   href={C_colid.replace(/ +/g, "")}
//                                   aria-expanded="false"
//                                   aria-controls={mdata.ContainerNo.replace(
//                                     / +/g,
//                                     ""
//                                   )}
//                                 >
//                                   <a href={shipmentdetails}>
//                                     <p className="mapcontainerno">
//                                       {mdata.ContainerNo}
//                                     </p>
//                                   </a>
//                                 </div>
//                               </h5>
//                             </div>
//                             <div
//                               id={mdata.ContainerNo.replace(/ +/g, "")}
//                               class="collapse"
//                               data-parent="#accordion"
//                               aria-labelledby="heading-1"
//                             >
//                               <div class="card-body">
//                                 <div id="accordion-1">
//                                   <div class="card">
//                                     <div class="card-header" id="heading-1-1">
//                                       <h5 class="mb-0">
//                                         <div
//                                           class="collapsed"
//                                           role="button"
//                                           data-toggle="collapse"
//                                           href={C_HblNO.replace(/ +/g, "")}
//                                           aria-expanded="false"
//                                           aria-controls={mdata["HBL#"].replace(
//                                             / +/g,
//                                             ""
//                                           )}
//                                         >
//                                           <p className="mapcontainerno">
//                                             {mdata["HBL#"]}
//                                           </p>
//                                         </div>
//                                       </h5>
//                                     </div>
//                                     <div
//                                       id={mdata["HBL#"].replace(/ +/g, "")}
//                                       class="collapse"
//                                       data-parent="#accordion-1"
//                                       aria-labelledby="heading-1-1"
//                                     >
//                                       <div class="card-body">
//                                         {finalinvocearr.length > 0
//                                           ? finalinvocearr.map(function(
//                                               idata,
//                                               i
//                                             ) {
//                                               return (
//                                                 <div>
//                                                   <p className="mapinvoice">
//                                                     {idata}
//                                                   </p>
//                                                 </div>
//                                               );
//                                             })
//                                           : null}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         );
//       }
//       if (marker.Pin == "Air") {
//         return (
//           <Marker
//             key={marker.id}
//             onClick={onClick}
//             title={marker.Vessel}
//             position={{
//               lat: Number(marker.LastLocation_Lat),
//               lng: Number(marker.LastLocation_Lon)
//             }}
//             icon={bluePlane}
//           >
//             {props.selectedMarker === marker && (
//               <InfoWindow>
//                 <div>
//                   {props.ModalData.map(function(mdata, i) {
//                     let Hblno = mdata["HBL#"];
//                     let shipmentdetails = "shipment-details?hblno=" + Hblno;
//                     var inovceno;
//                     var finalinvoce;
//                     var finalinvocearr = [];
//                     var C_colid = "#" + mdata.ContainerNo;
//                     var C_HblNO = "#" + mdata["HBL#"];

//                     if (
//                       (mdata["InvoiceNumber/Productid"] != "") &
//                       (mdata["InvoiceNumber/Productid"] != null)
//                     ) {
//                       inovceno = mdata["InvoiceNumber/Productid"].split(":");
//                       if (inovceno.length > 0) {
//                         for (let index = 0; index < inovceno.length; index++) {
//                           finalinvoce = inovceno[index].split("|")[0];
//                           finalinvocearr.push(finalinvoce);
//                         }
//                       }
//                     }
//                     return (
//                       <div className="pinmodal">
//                         <div id="accordion">
//                           <div class="card">
//                             <div class="card-header" id="heading-1">
//                               <h5 class="mb-0">
//                                 <div
//                                   role="button"
//                                   data-toggle="collapse"
//                                   href={C_colid.replace(/ +/g, "")}
//                                   aria-expanded="false"
//                                   aria-controls={mdata.ContainerNo.replace(
//                                     / +/g,
//                                     ""
//                                   )}
//                                 >
//                                   <a href={shipmentdetails}>
//                                     <p className="mapcontainerno">
//                                       {mdata.ContainerNo}
//                                     </p>
//                                   </a>
//                                 </div>
//                               </h5>
//                             </div>
//                             <div
//                               id={mdata.ContainerNo.replace(/ +/g, "")}
//                               class="collapse"
//                               data-parent="#accordion"
//                               aria-labelledby="heading-1"
//                             >
//                               <div class="card-body">
//                                 <div id="accordion-1">
//                                   <div class="card">
//                                     <div class="card-header" id="heading-1-1">
//                                       <h5 class="mb-0">
//                                         <div
//                                           class="collapsed"
//                                           role="button"
//                                           data-toggle="collapse"
//                                           href={C_HblNO.replace(/ +/g, "")}
//                                           aria-expanded="false"
//                                           aria-controls={mdata["HBL#"].replace(
//                                             / +/g,
//                                             ""
//                                           )}
//                                         >
//                                           <p className="mapcontainerno">
//                                             {mdata["HBL#"]}
//                                           </p>
//                                         </div>
//                                       </h5>
//                                     </div>
//                                     <div
//                                       id={mdata["HBL#"].replace(/ +/g, "")}
//                                       class="collapse"
//                                       data-parent="#accordion-1"
//                                       aria-labelledby="heading-1-1"
//                                     >
//                                       <div class="card-body">
//                                         {finalinvocearr.length > 0
//                                           ? finalinvocearr.map(function(
//                                               idata,
//                                               i
//                                             ) {
//                                               return (
//                                                 <div>
//                                                   <p className="mapinvoice">
//                                                     {idata}
//                                                   </p>
//                                                 </div>
//                                               );
//                                             })
//                                           : null}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         );
//       }
//       if (marker.Pin == "Booking") {
//         return (
//           <Marker
//             key={marker.id}
//             onClick={onClick}
//             title={marker.Vessel}
//             position={{
//               lat: Number(marker.LastLocation_Lat),
//               lng: Number(marker.LastLocation_Lon)
//             }}
//             icon={bookingBlue}
//           >
//             {props.selectedMarker === marker && (
//               <InfoWindow>
//                 <div>
//                   {props.ModalData.map(function(mdata, i) {
//                     let Hblno = mdata["HBL#"];
//                     let shipmentdetails = "shipment-details?hblno=" + Hblno;
//                     var inovceno;
//                     var finalinvoce;
//                     var finalinvocearr = [];
//                     var C_colid = "#" + mdata.ContainerNo;
//                     var C_HblNO = "#" + mdata["HBL#"];

//                     if (
//                       (mdata["InvoiceNumber/Productid"] != "") &
//                       (mdata["InvoiceNumber/Productid"] != null)
//                     ) {
//                       inovceno = mdata["InvoiceNumber/Productid"].split(":");
//                       if (inovceno.length > 0) {
//                         for (let index = 0; index < inovceno.length; index++) {
//                           finalinvoce = inovceno[index].split("|")[0];
//                           finalinvocearr.push(finalinvoce);
//                         }
//                       }
//                     }
//                     return (
//                       <div className="pinmodal">
//                         <div id="accordion">
//                           <div class="card">
//                             <div class="card-header" id="heading-1">
//                               <h5 class="mb-0">
//                                 <div
//                                   role="button"
//                                   data-toggle="collapse"
//                                   href={C_colid.replace(/ +/g, "")}
//                                   aria-expanded="false"
//                                   aria-controls={mdata.ContainerNo.replace(
//                                     / +/g,
//                                     ""
//                                   )}
//                                 >
//                                   <a href={shipmentdetails}>
//                                     <p className="mapcontainerno">
//                                       {mdata.ContainerNo}
//                                     </p>
//                                   </a>
//                                 </div>
//                               </h5>
//                             </div>
//                             <div
//                               id={mdata.ContainerNo.replace(/ +/g, "")}
//                               class="collapse"
//                               data-parent="#accordion"
//                               aria-labelledby="heading-1"
//                             >
//                               <div class="card-body">
//                                 <div id="accordion-1">
//                                   <div class="card">
//                                     <div class="card-header" id="heading-1-1">
//                                       <h5 class="mb-0">
//                                         <div
//                                           class="collapsed"
//                                           role="button"
//                                           data-toggle="collapse"
//                                           href={C_HblNO.replace(/ +/g, "")}
//                                           aria-expanded="false"
//                                           aria-controls={mdata["HBL#"].replace(
//                                             / +/g,
//                                             ""
//                                           )}
//                                         >
//                                           <p className="mapcontainerno">
//                                             {mdata["HBL#"]}
//                                           </p>
//                                         </div>
//                                       </h5>
//                                     </div>
//                                     <div
//                                       id={mdata["HBL#"].replace(/ +/g, "")}
//                                       class="collapse"
//                                       data-parent="#accordion-1"
//                                       aria-labelledby="heading-1-1"
//                                     >
//                                       <div class="card-body">
//                                         {finalinvocearr.length > 0
//                                           ? finalinvocearr.map(function(
//                                               idata,
//                                               i
//                                             ) {
//                                               return (
//                                                 <div>
//                                                   <p className="mapinvoice">
//                                                     {idata}
//                                                   </p>
//                                                 </div>
//                                               );
//                                             })
//                                           : null}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         );
//       }
//     })}
//   </GoogleMap>
// ));
const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultCenter={{ lat: 32.24165126, lng: 77.78319374 }}
    defaultZoom={3}
  >
    {props.markers.map(marker => {
      debugger;
      const onClick = props.onClick.bind(this, marker);
      let blueShip = new window.google.maps.MarkerImage(
        BlueShip,
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new window.google.maps.Size(32, 32)
      );
      let bluePlane = new window.google.maps.MarkerImage(
        BluePlane,
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new window.google.maps.Size(32, 32)
      );
      let bookingBlue = new window.google.maps.MarkerImage(
        BookingBlue,
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new window.google.maps.Size(32, 32)
      );

      if (marker.Pin == "Ocean") {
        return (
          <Marker
          icon={blueShip}
            key={marker.id}
            onClick={onClick}
            title={marker.Vessel}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno;
                    var finalinvoce;
                    var finalinvocearr = [];
                    var C_colid = "#" + mdata.ContainerNo;
                    var C_HblNO = "#" + mdata["HBL#"];

                    if (
                      (mdata["InvoiceNumber/Productid"] != "") &
                      (mdata["InvoiceNumber/Productid"] != null)
                    ) {
                      inovceno = mdata["InvoiceNumber/Productid"].split(":");
                      if (inovceno.length > 0) {
                        for (let index = 0; index < inovceno.length; index++) {
                          finalinvoce = inovceno[index].split("|")[0];
                          finalinvocearr.push(finalinvoce);
                        }
                      }
                    }
                    return (
                      <div className="pinmodal">
                        <div id="accordion">
                          <div class="card">
                            <div class="card-header" id="heading-1">
                              <h5 class="mb-0">
                                <div
                                  role="button"
                                  data-toggle="collapse"
                                  href={C_colid.replace(/ +/g, "")}
                                  aria-expanded="false"
                                  aria-controls={mdata.ContainerNo.replace(
                                    / +/g,
                                    ""
                                  )}
                                >
                                  <a href={shipmentdetails}>
                                    <p className="mapcontainerno">
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              class="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div class="card-body">
                                <div id="accordion-1">
                                  <div class="card">
                                    <div class="card-header" id="heading-1-1">
                                      <h5 class="mb-0">
                                        <div
                                          class="collapsed"
                                          role="button"
                                          data-toggle="collapse"
                                          href={C_HblNO.replace(/ +/g, "")}
                                          aria-expanded="false"
                                          aria-controls={mdata["HBL#"].replace(
                                            / +/g,
                                            ""
                                          )}
                                        >
                                          <p className="mapcontainerno">
                                            {mdata["HBL#"]}
                                          </p>
                                        </div>
                                      </h5>
                                    </div>
                                    <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      class="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div class="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p className="mapinvoice">
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
      if (marker.Pin == "Air") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            title={marker.Vessel}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={bluePlane}
            
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno;
                    var finalinvoce;
                    var finalinvocearr = [];
                    var C_colid = "#" + mdata.ContainerNo;
                    var C_HblNO = "#" + mdata["HBL#"];

                    if (
                      (mdata["InvoiceNumber/Productid"] != "") &
                      (mdata["InvoiceNumber/Productid"] != null)
                    ) {
                      inovceno = mdata["InvoiceNumber/Productid"].split(":");
                      if (inovceno.length > 0) {
                        for (let index = 0; index < inovceno.length; index++) {
                          finalinvoce = inovceno[index].split("|")[0];
                          finalinvocearr.push(finalinvoce);
                        }
                      }
                    }
                    return (
                      <div className="pinmodal">
                        <div id="accordion">
                          <div class="card">
                            <div class="card-header" id="heading-1">
                              <h5 class="mb-0">
                                <div
                                  role="button"
                                  data-toggle="collapse"
                                  href={C_colid.replace(/ +/g, "")}
                                  aria-expanded="false"
                                  aria-controls={mdata.ContainerNo.replace(
                                    / +/g,
                                    ""
                                  )}
                                >
                                  <a href={shipmentdetails}>
                                    <p className="mapcontainerno">
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              class="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div class="card-body">
                                <div id="accordion-1">
                                  <div class="card">
                                    <div class="card-header" id="heading-1-1">
                                      <h5 class="mb-0">
                                        <div
                                          class="collapsed"
                                          role="button"
                                          data-toggle="collapse"
                                          href={C_HblNO.replace(/ +/g, "")}
                                          aria-expanded="false"
                                          aria-controls={mdata["HBL#"].replace(
                                            / +/g,
                                            ""
                                          )}
                                        >
                                          <p className="mapcontainerno">
                                            {mdata["HBL#"]}
                                          </p>
                                        </div>
                                      </h5>
                                    </div>
                                    <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      class="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div class="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p className="mapinvoice">
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
      if (marker.Pin == "Booking") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            title={marker.Vessel}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={bookingBlue}
            
          >
            {props.selectedMarker === marker && (
              <InfoWindow>
                <div>
                  {props.ModalData.map(function(mdata, i) {
                    let Hblno = mdata["HBL#"];
                    let shipmentdetails = "shipment-details?hblno=" + Hblno;
                    var inovceno;
                    var finalinvoce;
                    var finalinvocearr = [];
                    var C_colid = "#" + mdata.ContainerNo;
                    var C_HblNO = "#" + mdata["HBL#"];

                    if (
                      (mdata["InvoiceNumber/Productid"] != "") &
                      (mdata["InvoiceNumber/Productid"] != null)
                    ) {
                      inovceno = mdata["InvoiceNumber/Productid"].split(":");
                      if (inovceno.length > 0) {
                        for (let index = 0; index < inovceno.length; index++) {
                          finalinvoce = inovceno[index].split("|")[0];
                          finalinvocearr.push(finalinvoce);
                        }
                      }
                    }
                    return (
                      <div className="pinmodal">
                        <div id="accordion">
                          <div class="card">
                            <div class="card-header" id="heading-1">
                              <h5 class="mb-0">
                                <div
                                  role="button"
                                  data-toggle="collapse"
                                  href={C_colid.replace(/ +/g, "")}
                                  aria-expanded="false"
                                  aria-controls={mdata.ContainerNo.replace(
                                    / +/g,
                                    ""
                                  )}
                                >
                                  <a href={shipmentdetails}>
                                    <p className="mapcontainerno">
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              class="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div class="card-body">
                                <div id="accordion-1">
                                  <div class="card">
                                    <div class="card-header" id="heading-1-1">
                                      <h5 class="mb-0">
                                        <div
                                          class="collapsed"
                                          role="button"
                                          data-toggle="collapse"
                                          href={C_HblNO.replace(/ +/g, "")}
                                          aria-expanded="false"
                                          aria-controls={mdata["HBL#"].replace(
                                            / +/g,
                                            ""
                                          )}
                                        >
                                          <p className="mapcontainerno">
                                            {mdata["HBL#"]}
                                          </p>
                                        </div>
                                      </h5>
                                    </div>
                                    <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      class="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div class="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p className="mapinvoice">
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      }
    })}
  </GoogleMap>
));
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 0,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      mapsData: [],
      selectedMarker: "",
      ActiveShipmentData: [],
      QuotesData: [],
      InvoicesData: [],
      BookingData: [],
      ModalData: [],
      checkMapview: true,
      loading:true,
      IsWidgets:false
    };
    this.BindMapData = this.BindMapData.bind(this);
    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);
    this.HandleQuotesData = this.HandleQuotesData.bind(this);
    this.HandleRediractPageShipmentDetails = this.HandleRediractPageShipmentDetails.bind(
      this
    );
    this.HandleShipmentPage = this.HandleShipmentPage.bind(this);
    this.HandleBookingTablePage = this.HandleBookingTablePage.bind(this);
    this.HandleQuotesTablePage = this.HandleQuotesTablePage.bind(this);
    this.HandleBookingCardApi = this.HandleBookingCardApi.bind(this);
  }

  componentDidMount() {
    debugger;
    let self = this;
    this.BindMapData();
    this.HandleQuotesData();
    this.HandleActiveShipmentData();
    this.HandleBookingCardApi();

    var checkMapview = this.props.location.state;
    if (typeof checkMapview != "undefined") {
      var mapviewHow = this.props.location.state.detail;
      self.setState({ checkMapview: mapviewHow });
    }
  }
  // Active Shipment Card on ...View More click to rediract Shipment-summary page
  HandleShipmentPage() {
    this.props.history.push({ pathname: "shipment-summary" });
  }

  // Booking Card on ...View More click to rediract booking page
  HandleBookingTablePage() {
    this.props.history.push({ pathname: "booking-table" });
  }

  // Quotes Card on ...View More click to rediract Quotes page
  HandleQuotesTablePage() {
    this.props.history.push({ pathname: "quote-table" });
  }
  // Invoices Card on ...View More click to rediract Quotes page
  // HandleShipmentPage()
  // {
  //   this.props.history.push({pathname: "shipment-summary"});
  // }

  //Booking Card Bind Api Call
  HandleBookingCardApi() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchNewbooking`,
      data: {
        UserID: 874588
      },
      headers: authHeader()
    }).then(function(response) {
      var bookData = response.data.Table;
      self.setState({ BookingData: bookData });
    });
  }

  HandleRediractPageShipmentDetails(hblno) {
    this.props.history.push({
      pathname: "shipment-details",
      state: { detail: hblno }
    });
  }
  HandleActiveShipmentData() {
    let selt = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ActiveShipementData`,
      data: {
        UserID: 874588
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var activeshipment = response.data.Table;
      var invoicesData = response.data.Table1;

      selt.setState({
        ActiveShipmentData: activeshipment,
        InvoicesData: invoicesData
      });
    });
  }

  HandleQuotesData() {
    let selt = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/DashboardQuotesData`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      var quotesdata = response.data.Table;
      selt.setState({ QuotesData: quotesdata });
    });
  }
  handleClick = (marker, event) => {
    debugger;
    let selt = this;
    selt.setState({ selectedMarker: "" });
    var userID = marker.ID;
    var latitude = marker.LastLocation_Lat;
    var longitude = marker.LastLocation_Lon;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentIConAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        lat: latitude,
        lng: longitude
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response);

      selt.setState({
        selectedMarker: marker,
        ModalData: response.data.Table1
      });
    });
  };

  BindMapData() {
    let self = this;
    var mdata;
    debugger;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(function(response) {
      mdata = response.data;
      self.setState({ loading: false });
      self.setState({ mapsData: mdata });
    });
  }

  render() {
    // const divStyle ={}
    // if (encryption(window.localStorage.getItem("usertype"),"desc") == "Sales User") {
    //   divStyle = {
    //     "display": "none"
    //   }
    // }
    // else{divStyle = {
    //   "display": "none"
    // }}
    const {
      mapsData,
      selectedMarker,
      ActiveShipmentData,
      InvoicesData,
      ModalData,
      BookingData,
      QuotesData,
      loading
    } = this.state;
    let self = this;
    
    const ActiveShipment = ActiveShipmentData.map(function(addkey, i) {
      if (i < 4) {
        return (
          <>
            {/* <p>
              Shipment ID:
              <span>{addkey.ShipmentID}</span>
            </p> */}
            <p>
              {/* HBL No :{" "} */}
              <span
                onClick={() =>
                  self.HandleRediractPageShipmentDetails(addkey["HBL#"])
                }
                style={{ cursor: "pointer" }}
                title="HBL No"
              >
                {addkey["HBL#"]}
              </span>
              {(() => {
                if (addkey.ModeOfTransport == "Ocean") {
                  return (                    
                      <img src={Ship} className="modeoftrans-img" title="Ocean"/>
                  );
                }
                else if (addkey.ModeOfTransport == "Air") {
                  return (
                      <img src={Plane} className="modeoftrans-img" title="Air"/>
                  );
                }
                else if (addkey.ModeOfTransport == "Inland") {
                  return (
                      <img src={Truck} className="modeoftrans-img" title="Inland"/>
                  );
                }
                else if (addkey.ModeOfTransport == "Railway") {
                  return (
                      <img src={Rail} className="modeoftrans-img" title="Railway"/>
                  );
                }
              // <span>{addkey.ModeOfTransport}</span>
              })()}
            </p>
            <p>
              <span className="shipment-status" title="Status">{addkey.ShipmentStatus}</span>
            </p>
            <hr className="horizontal-line"/>
            {/* <p>
              Mode of Transport :<span>{addkey.ModeOfTransport}</span>
            </p> */}
          </>
        );
      }
    });
    const Booking = BookingData.map(function(book, i) {
      if (i < 4) {
        return (
          <>
            <p>
              <span>{book.BookingNo}</span>
              <span style={{"float":"right"}}>{(new Date(book.ETD)).toLocaleDateString('en-US')}</span>
            </p>
            <p>
              POL : <span>{book.POL}</span>
              {/* <HTMLEllipsis
              unsafeHTML='sad sanas dsaahsa said saabh 
              aihbd asa hsa siau sadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
              maxLine='5'
              ellipsis='...'
              basedOn='letters'
              // text='sad sanas dsaahsa said saabh 
              // aihbd asa hsa siau sadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
              // maxLine='3'
              // ellipsis='...'
              // trimLeft
              // basedOn='letters'
            />
              <text>sad sanas dsaahsa said saabh aihbd asa hsa siau</text> */}
            </p>
            
            <p>
              POD : <span>{book.POD}</span>
            </p>
            <hr className="horizontal-line"/>
          </>
        );
      }
    });

    const Quotes = QuotesData.map(function(quotes, i) {
      if (i < 4) {
        return (
          <>
            <p>
              <span title="Customer Name">{quotes.CompanyName}</span>
            </p>
            <p>
              <span title="Shipment Type">{quotes.type}</span>
              <span className="shipment-status" title="Status" style={{"float": "right"}}>{quotes.CurrentStatus}</span>
            </p>
            <p>
              <span title="Expected Date">{quotes.ExpiryDate}</span>
            </p>
            <hr className="horizontal-line"/>
          </>
        );
      } else {
        return;
      }
    });

    const Invoices = InvoicesData.map(function(invoice, i) {
      if (i < 4) {
        return (
          <>
            <p>
              <span title="Shipment No">{invoice.InvoiceNumber}</span>
            </p>
            <p>
              <span title="Customer Name">{invoice.BillToName}</span>
            </p>
            <hr className="horizontal-line"/>
          </>
        );
      } else {
        return;
      }
    });
    return (
      <div>
        {/* {loading == true ? (
          <img src={LoadingImg} width="50" height="50" />
        ) : null} */}

        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt">
            <div className="dash-outer" style={{}}>
              {this.state.checkMapview == true ? (
                <>
                  <div className="dash-map">
                    <div className="full-map">
                      <MapWithAMakredInfoWindow
                        markers={mapsData}
                        onClick={this.handleClick}
                        selectedMarker={selectedMarker}
                        ModalData={ModalData}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                        containerElement={
                          <div style={{ height: `100%`, width: "100%" }} />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                        loadingElement={<div style={{ height: `100%` }} />}
                      ></MapWithAMakredInfoWindow>
                    </div>
                  </div>
                  <div className="container-fluid p-0">
                    <div className="row dash-sects-cntr">
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Active Shipments</h3>
                          <div className="dash-sects-dtls">
                            <div className="dash-sects-dtls-inner">
                              {ActiveShipment}
                            </div>
                          </div>
                          <span
                            className="viewmore-span"
                            onClick={this.HandleShipmentPage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Booking</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Booking}
                            </div>
                          </div>
                          <span
                            className="viewmore-span"
                            onClick={this.HandleBookingTablePage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Quotes</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Quotes}
                            </div>
                          </div>
                          <span
                            className="viewmore-span"
                            onClick={this.HandleQuotesTablePage}
                          >
                            ...View More
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="dash-sects">
                          <h3>Invoices</h3>
                          <div className="dash-sects-dtls">
                            {/* <i className="fa fa-refresh fa-spin"></i> */}
                            <div className="dash-sects-dtls-inner">
                              {Invoices}
                            </div>
                          </div>
                          <span className="viewmore-span">...View More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="dash-map"
                  style={{ minHeight: "calc(137vh - 332px)" }}
                >
                  <div className="full-map">
                    <MapWithAMakredInfoWindow
                      markers={mapsData}
                      onClick={this.handleClick}
                      selectedMarker={selectedMarker}
                      ModalData={ModalData}
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                      containerElement={
                        <div style={{ height: `100%`, width: "100%" }} />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                      loadingElement={<div style={{ height: `100%` }} />}
                    ></MapWithAMakredInfoWindow>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

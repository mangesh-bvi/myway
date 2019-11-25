import React, { Component } from "react";
import "../styles/custom.css";
import axios from "axios";
import { encryption } from "../helpers/encryption";
import { authHeader } from "../helpers/authHeader";

import ShipWhite from "./../assets/img/ship-white.png";
import HambShip from "./../assets/img/hamb-ship.png";
import PlaneWhite from "./../assets/img/plane-white.png";
import DelayShip from "./../assets/img/delay-shipment.png";
import CurrBook from "./../assets/img/current-booking.png";
import HambPlane from "./../assets/img/hamb-plane.png";
import BlueShip from "./../assets/img/circle-ship.png";
import ShipBlue from "./../assets/img/blue-ship.png";
import BluePlane from "./../assets/img/circle-plane.png";
import PlaneBlue from "./../assets/img/blue-plane.png";
import BookingBlue from "./../assets/img/circle-booked.png";
import DelayBlue from "./../assets/img/blue-delay.png";
import BookBlue from "./../assets/img/blue-booking.png";
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

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";

const { compose } = require("recompose");

const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultCenter={props.mapPosition} defaultZoom={props.zoom}>
    {props.markers.map((marker,i) => {
      const onClick = props.onClick.bind(this, marker);
      let blueShip = new window.google.maps.MarkerImage(
        ShipBlue,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );
      let bluePlane = new window.google.maps.MarkerImage(
        PlaneBlue,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );
      let bookingBlue = new window.google.maps.MarkerImage(
        BookBlue,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );
      let delayBlue = new window.google.maps.MarkerImage(
        DelayBlue,
        null /* size is determined at runtime */,
        null /* origin is 0,0 */,
        null /* anchor is bottom center of the scaled image */,
        new window.google.maps.Size(32, 32)
      );

      if (marker.Pin == "Ocean") {
        return (
          <div key={i}>
             
             {/* <Marker
                  key={marker.index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                >
                  <InfoWindow key={marker.index}></InfoWindow>
                </Marker> */}
            {/* <Marker
                key={props.searchData.index}
                position={{
                  lat: props.searchData.lat,
                  lng: props.searchData.lng
                }}
              >
                <InfoWindow>
                  <div>
                    <div>nhà trọ cho thuê</div>
                    <div>1.500.000đ</div>
                  </div>
                </InfoWindow>
                }
              </Marker>; */}

            <Marker
              icon={blueShip}
              key={marker.id}
              onClick={onClick}
              title={marker.Vessel}
              position={{
                lat: Number(marker.LastLocation_Lat),
                lng: Number(marker.LastLocation_Lon)
              }}
              // position={{
              //   lat: this.state.mapPosition.lat,
              //   lng: this.state.mapPosition.lng
              // }}
            >
              {props.selectedMarker === marker.LastLocation && (
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
                          for (
                            let index = 0;
                            index < inovceno.length;
                            index++
                          ) {
                            finalinvoce = inovceno[index].split("|")[0];
                            finalinvocearr.push(finalinvoce);
                          }
                        }
                      }
                      return (
                        <div className="pinmodal">
                          <div id="accordion">
                            <div className="card">
                              <div className="card-header" id="heading-1">
                                <h5 className="mb-0">
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
                                      <p
                                        title="Container No."
                                        className="mapcontainerno"
                                      >
                                        {mdata.ContainerNo}
                                      </p>
                                    </a>
                                  </div>
                                </h5>
                              </div>
                              <div
                                id={mdata.ContainerNo.replace(/ +/g, "")}
                                className="collapse"
                                data-parent="#accordion"
                                aria-labelledby="heading-1"
                              >
                                <div
                                  className="card-header hbl-bor"
                                  id="heading-1-1"
                                >
                                  <h5>
                                    <div
                                      //className="collapsed"
                                      role="button"
                                      // data-toggle="collapse"
                                      href={C_HblNO.replace(/ +/g, "")}
                                      //aria-expanded="false"
                                      // aria-controls={mdata["HBL#"].replace(
                                      //   / +/g,
                                      //   ""
                                      // )}
                                    >
                                      <p
                                        title="HBL No."
                                        className="mapcontainerno dash-hbl"
                                      >
                                        <a
                                          className="dash-hbl"
                                          href={shipmentdetails}
                                        >
                                          {" "}
                                          {mdata["HBL#"]}
                                        </a>
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                    {","}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </p>
                                    </div>
                                  </h5>
                                </div>
                                {/* <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      className="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div className="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div> */}
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
          </div>
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
                          <div className="card">
                            <div className="card-header" id="heading-1">
                              <h5 className="mb-0">
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
                                    <p
                                      title="Container No."
                                      className="mapcontainerno"
                                    >
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              className="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div
                                className="card-header hbl-bor"
                                id="heading-1-1"
                              >
                                <h5>
                                  <div
                                    //className="collapsed"
                                    role="button"
                                    // data-toggle="collapse"
                                    href={C_HblNO.replace(/ +/g, "")}
                                    //aria-expanded="false"
                                    // aria-controls={mdata["HBL#"].replace(
                                    //   / +/g,
                                    //   ""
                                    // )}
                                  >
                                    <p
                                      title="HBL No."
                                      className="mapcontainerno dash-hbl"
                                    >
                                      <a
                                        className="dash-hbl"
                                        href={shipmentdetails}
                                      >
                                        {" "}
                                        {mdata["HBL#"]}
                                      </a>
                                      {finalinvocearr.length > 0
                                        ? finalinvocearr.map(function(
                                            idata,
                                            i
                                          ) {
                                            return (
                                              <div>
                                                <p
                                                  title="MyWay No."
                                                  className="mapinvoice ml-2"
                                                >
                                                  {idata}
                                                  {","}
                                                </p>
                                              </div>
                                            );
                                          })
                                        : null}
                                    </p>
                                  </div>
                                </h5>
                              </div>
                              {/* <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      className="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div className="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div> */}
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
      if (marker.Pin === "Booking") {
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
                          <div className="card">
                            <div className="card-header" id="heading-1">
                              <h5 className="mb-0">
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
                                    <p
                                      title="Container No."
                                      className="mapcontainerno"
                                    >
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              className="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div
                                className="card-header hbl-bor"
                                id="heading-1-1"
                              >
                                <h5>
                                  <div
                                    //className="collapsed"
                                    role="button"
                                    // data-toggle="collapse"
                                    href={C_HblNO.replace(/ +/g, "")}
                                    //aria-expanded="false"
                                    // aria-controls={mdata["HBL#"].replace(
                                    //   / +/g,
                                    //   ""
                                    // )}
                                  >
                                    <p
                                      title="HBL No."
                                      className="mapcontainerno dash-hbl"
                                    >
                                      <a
                                        className="dash-hbl"
                                        href={shipmentdetails}
                                      >
                                        {" "}
                                        {mdata["HBL#"]}
                                      </a>
                                      {finalinvocearr.length > 0
                                        ? finalinvocearr.map(function(
                                            idata,
                                            i
                                          ) {
                                            return (
                                              <div>
                                                <p
                                                  title="MyWay No."
                                                  className="mapinvoice ml-2"
                                                >
                                                  {idata}
                                                  {","}
                                                </p>
                                              </div>
                                            );
                                          })
                                        : null}
                                    </p>
                                  </div>
                                </h5>
                              </div>
                              {/* <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      className="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div className="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div> */}
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

      if (marker.Pin === "Booking-Ocean") {
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
                          <div className="card">
                            <div className="card-header" id="heading-1">
                              <h5 className="mb-0">
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
                                    <p
                                      title="Container No."
                                      className="mapcontainerno"
                                    >
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              className="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div
                                className="card-header hbl-bor"
                                id="heading-1-1"
                              >
                                <h5>
                                  <div
                                    //className="collapsed"
                                    role="button"
                                    // data-toggle="collapse"
                                    href={C_HblNO.replace(/ +/g, "")}
                                    //aria-expanded="false"
                                    // aria-controls={mdata["HBL#"].replace(
                                    //   / +/g,
                                    //   ""
                                    // )}
                                  >
                                    <p
                                      title="HBL No."
                                      className="mapcontainerno dash-hbl"
                                    >
                                      <a
                                        className="dash-hbl"
                                        href={shipmentdetails}
                                      >
                                        {" "}
                                        {mdata["HBL#"]}
                                      </a>
                                      {finalinvocearr.length > 0
                                        ? finalinvocearr.map(function(
                                            idata,
                                            i
                                          ) {
                                            return (
                                              <div>
                                                <p
                                                  title="MyWay No."
                                                  className="mapinvoice ml-2"
                                                >
                                                  {idata}
                                                  {","}
                                                </p>
                                              </div>
                                            );
                                          })
                                        : null}
                                    </p>
                                  </div>
                                </h5>
                              </div>
                              {/* <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      className="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div className="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div> */}
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

      if (marker.Pin === "Delay-Ocean") {
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            title={marker.Vessel}
            position={{
              lat: Number(marker.LastLocation_Lat),
              lng: Number(marker.LastLocation_Lon)
            }}
            icon={delayBlue}
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
                          <div className="card">
                            <div className="card-header" id="heading-1">
                              <h5 className="mb-0">
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
                                    <p
                                      title="Container No."
                                      className="mapcontainerno"
                                    >
                                      {mdata.ContainerNo}
                                    </p>
                                  </a>
                                </div>
                              </h5>
                            </div>
                            <div
                              id={mdata.ContainerNo.replace(/ +/g, "")}
                              className="collapse"
                              data-parent="#accordion"
                              aria-labelledby="heading-1"
                            >
                              <div
                                className="card-header hbl-bor"
                                id="heading-1-1"
                              >
                                <h5>
                                  <div
                                    //className="collapsed"
                                    role="button"
                                    // data-toggle="collapse"
                                    href={C_HblNO.replace(/ +/g, "")}
                                    //aria-expanded="false"
                                    // aria-controls={mdata["HBL#"].replace(
                                    //   / +/g,
                                    //   ""
                                    // )}
                                  >
                                    <p
                                      title="HBL No."
                                      className="mapcontainerno dash-hbl"
                                    >
                                      <a
                                        className="dash-hbl"
                                        href={shipmentdetails}
                                      >
                                        {" "}
                                        {mdata["HBL#"]}
                                      </a>
                                      {finalinvocearr.length > 0
                                        ? finalinvocearr.map(function(
                                            idata,
                                            i
                                          ) {
                                            return (
                                              <div>
                                                <p
                                                  title="MyWay No."
                                                  className="mapinvoice ml-2"
                                                >
                                                  {idata}
                                                  {","}
                                                </p>
                                              </div>
                                            );
                                          })
                                        : null}
                                    </p>
                                  </div>
                                </h5>
                              </div>
                              {/* <div
                                      id={mdata["HBL#"].replace(/ +/g, "")}
                                      className="collapse"
                                      data-parent="#accordion-1"
                                      aria-labelledby="heading-1-1"
                                    >
                                      <div className="card-body">
                                        {finalinvocearr.length > 0
                                          ? finalinvocearr.map(function(
                                              idata,
                                              i
                                            ) {
                                              return (
                                                <div>
                                                  <p
                                                    title="MyWay No."
                                                    className="mapinvoice ml-2"
                                                  >
                                                    {idata}
                                                  </p>
                                                </div>
                                              );
                                            })
                                          : null}
                                      </div>
                                    </div> */}
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
    <div className="dash-search-cntr">
      <Autocomplete
        style={{
          // width: "auto",
          height: "40px",
          paddingLeft: "16px",
          // marginTop: "2px",
          // marginBottom: "500px",
          // position: "absolute",
          // top: "60px",
          // left: "10px",
          border: "0",
          borderRadius: "50px",
          paddingRight: "45px"
        }}
        id="autocomplete"
        onPlaceSelected={props.onPlaceSelected}
        types={["(regions)"]}
      />
      <i
        className="fa fa-search"
        aria-hidden="true"
        onClick={props.onChangeSearchBox}
      ></i>
    </div>
  </GoogleMap>
));
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 3,
      center: {
        lat: 25.37852,
        lng: 75.02354
      },
      searchData: { index: 1, lat: 17.69265, lng: 83.299995 },
      mapsData: [],
      selectedMarker: "",
      ActiveShipmentData: [],
      QuotesData: [],
      InvoicesData: [],
      BookingData: [],
      ModalData: [],
      ModalTotalMapData: [],
      SelectPin: [],
      checkMapview: true,
      loading: true,
      IsWidgets: false,
      mapPosition: {
        lat: 32.24165126,
        lng: 77.78319374
      }
    };
    this.BindMapData = this.BindMapData.bind(this);
    this.HandleShipmentPin = this.HandleShipmentPin.bind(this);
    this.HandleActiveShipmentData = this.HandleActiveShipmentData.bind(this);
    this.HandleQuotesData = this.HandleQuotesData.bind(this);
    this.HandleRediractPageShipmentDetails = this.HandleRediractPageShipmentDetails.bind(
      this
    );
    this.HandleShipmentPage = this.HandleShipmentPage.bind(this);
    this.HandleBookingTablePage = this.HandleBookingTablePage.bind(this);
    this.HandleQuotesTablePage = this.HandleQuotesTablePage.bind(this);
    this.HandleBookingCardApi = this.HandleBookingCardApi.bind(this);
    this.HandleWatchListData = this.HandleWatchListData.bind(this);
  }

  /////this method for onChangeSearchBox for react google autocomplete box

  onChangeSearchBox = e => {
    debugger;
    var hblNoContinerNno = document.getElementById("autocomplete").value;
    if (hblNoContinerNno !== "" && hblNoContinerNno !== null) {
      let self = this;
      var userid = encryption(window.localStorage.getItem("userid"), "desc");
      axios({
        method: "post",
        url: `${appSettings.APIURL}/MyWaySearchGeoCoOrdinate`,
        data: {
          UserID: userid,
          Search: hblNoContinerNno
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        var data = response.data.Table;

        // self.setState({ packageTypeData: data });
      });
    }
  };

  //// end

  onPlaceSelected = place => {
    debugger;
    console.log("plc", place);
    const address = place.formatted_address,
      addressArray = place.address_components,
      // city = this.getCity( addressArray ),
      // area = this.getArea( addressArray ),
      // state = this.getState( addressArray ),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    if (addressArray.length > 4) {
      this.state.zoom = 15;
    } else if (addressArray.length > 2 && addressArray.length <= 4) {
      this.state.zoom = 10;
    } else {
      this.state.zoom = 4;
    }
    this.setState({ zoom: this.state.zoom });
    // Set these values in the state.
    this.setState({
      // address: ( address ) ? address : '',
      // area: ( area ) ? area : '',
      // city: ( city ) ? city : '',
      // state: ( state ) ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      }
    });
  };

  componentDidMount() {
    debugger;
    let self = this;
    this.BindMapData("All");
    this.HandleQuotesData();
    this.HandleActiveShipmentData();
    this.HandleBookingCardApi();
    this.HandleWatchListData();

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
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/ActiveShipementData`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var invoicesData = response.data.Table1;
      selt.setState({
        InvoicesData: invoicesData
      });
    });
  }

  HandleWatchListData() {
    let selt = this;
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/FetchWatchListDashBoard`,
      data: {
        UserID: userid
      },
      headers: authHeader()
    }).then(function(response) {
      debugger;
      var activeshipment = response.data.Table;
      selt.setState({
        ActiveShipmentData: activeshipment
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

      selt.setState({
        selectedMarker: marker.LastLocation,
        ModalData: response.data.Table1
      });
    });
  };

  HandleShipmentPin(BindingID) {
    this.BindMapData(BindingID);
  }

  BindMapData(BindingID) {
    debugger;
    let self = this;
    var mdata;
    var arraModalMapData = [];
    debugger;

    if (self.ModalTotalMapData == null || self.ModalTotalMapData.length < 1) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/ShipmentLatLongAPI`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc")
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        mdata = response.data;
        if (BindingID != "All") {
          mdata = mdata.filter(map => map.Pin == BindingID);
        }
        if (mdata.length > 0) {
          self.setState({ loading: false });
        }
        self.setState({ mapsData: mdata });
        self.ModalTotalMapData = mdata;
        var arrarSelectPin = ["Ocean", "Air", "Booking-Ocean", "Delay-Ocean"];

        self.SelectPin = arrarSelectPin;

        var element = !!document.getElementById("shipmentfilterdiv");
        if (element) {
          document.getElementById("shipmentfilterdiv").style.display = "block";
        }
      });
    } else {
      if (BindingID != "All") {
        var index = self.SelectPin.indexOf(BindingID);
        const div = document.getElementById(BindingID);
        if (index > -1) {
          self.SelectPin.splice(index, 1);

          div.classList.add("cancel-btn");
        } else {
          div.classList.remove("cancel-btn");
          self.SelectPin.push(BindingID);
        }

        for (var rray in self.SelectPin) {
          arraModalMapData = arraModalMapData.concat(
            self.ModalTotalMapData.filter(e => e.Pin == self.SelectPin[rray])
          );
        }

        //self.ModalTotalMapData = self.ModalTotalMapData.filter(function(e) { e.Pin == BindingID},self.SelectPin)
      }
      // if (mdata.length > 0) {
      //   self.setState({ loading: false });
      // }
      self.setState({ mapsData: arraModalMapData });
    }
  }

  handleHamb() {
    if (document.getElementById("Ocean").classList.contains("rem-icon")) {
      document.getElementById("Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Ocean").classList.add("rem-icon");
    }
    if (document.getElementById("Air").classList.contains("rem-icon")) {
      document.getElementById("Air").classList.remove("rem-icon");
    } else {
      document.getElementById("Air").classList.add("rem-icon");
    }
    if (document.getElementById("Delay-Ocean").classList.contains("rem-icon")) {
      document.getElementById("Delay-Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Delay-Ocean").classList.add("rem-icon");
    }
    if (
      document.getElementById("Booking-Ocean").classList.contains("rem-icon")
    ) {
      document.getElementById("Booking-Ocean").classList.remove("rem-icon");
    } else {
      document.getElementById("Booking-Ocean").classList.add("rem-icon");
    }
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
    let className = "dash-map1";
    if (
      encryption(window.localStorage.getItem("usertype"), "desc") ==
      "Sales User"
    ) {
      this.state.IsWidgets = true;
      className = "dash-map";
      // this.setState({IsWidgets: this.state.IsWidgets});
    }
    const {
      mapsData,
      ModalTotalMapData,
      SelectPin,
      selectedMarker,
      ActiveShipmentData,
      InvoicesData,
      ModalData,
      BookingData,
      QuotesData,
      loading,
      searchData
    } = this.state;
    let self = this;

    const ActiveShipment = ActiveShipmentData.map(function(addkey, i) {
      if (i < 4) {
        return (
          <div key={i}>
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
                if (addkey.ShipemntType == "Ocean") {
                  return (
                    <img src={Ship} className="modeoftrans-img" title="Ocean" />
                  );
                } else if (addkey.ShipemntType == "Air") {
                  return (
                    <img src={Plane} className="modeoftrans-img" title="Air" />
                  );
                } else if (addkey.ShipemntType == "Inland") {
                  return (
                    <img
                      src={Truck}
                      className="modeoftrans-img"
                      title="Inland"
                    />
                  );
                } else if (addkey.ShipemntType == "Railway") {
                  return (
                    <img
                      src={Rail}
                      className="modeoftrans-img"
                      title="Railway"
                    />
                  );
                }
                // <span>{addkey.ModeOfTransport}</span>
              })()}
            </p>
            <p>
              <span className="shipment-status" title="Status">
                {addkey.Status}
              </span>
            </p>
            <hr className="horizontal-line" />
            {/* <p>
              Mode of Transport :<span>{addkey.ModeOfTransport}</span>
            </p> */}
          </div>
        );
      }
    });
    const Booking = BookingData.map(function(book, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span>{book.BookingNo}</span>
              <span style={{ float: "right" }}>
                {new Date(book.ETD).toLocaleDateString("en-US")}
              </span>
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
            <hr className="horizontal-line" />
          </div>
        );
      }
    });

    const Quotes = QuotesData.map(function(quotes, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span title="Customer Name">{quotes.CompanyName}</span>
            </p>
            <p>
              <span title="Shipment Type">{quotes.type}</span>
              <span
                className="shipment-status"
                title="Status"
                style={{ float: "right" }}
              >
                {quotes.CurrentStatus}
              </span>
            </p>
            <p>
              <span title="Expected Date">{quotes.ExpiryDate}</span>
            </p>
            <hr className="horizontal-line" />
          </div>
        );
      } else {
        return;
      }
    });

    const Invoices = InvoicesData.map(function(invoice, i) {
      if (i < 4) {
        return (
          <div key={i}>
            <p>
              <span title="Shipment No">{invoice.InvoiceNumber}</span>
            </p>
            <p>
              <span title="Customer Name">{invoice.BillToName}</span>
            </p>
            <hr className="horizontal-line" />
          </div>
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
            <div className="dash-outer">
              {this.state.checkMapview == true ? (
                ""
              ) : (
                <div className="text-right">
                  <a href="/shipment-summary" className="butn mt-0 mb-2">
                    List View
                  </a>
                </div>
              )}
              {this.state.checkMapview == true ? (
                <>
                  <div className="dash-map">
                    <div className="full-map">
                      <MapWithAMakredInfoWindow
                        searchData={this.state.searchData}
                        markers={mapsData}
                        onClick={this.handleClick}
                        selectedMarker={selectedMarker}
                        ModalData={ModalData}
                        onPlaceSelected={this.onPlaceSelected}
                        onChangeSearchBox={() => {
                          this.onChangeSearchBox(this);
                        }}
                        mapPosition={this.state.mapPosition}
                        zoom={this.state.zoom}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                        containerElement={
                          <div style={{ height: `100%`, width: "100%" }} />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                        loadingElement={<div style={{ height: `100%` }} />}
                      ></MapWithAMakredInfoWindow>

                      {this.state.loading === true ? (
                        <div className="loader-icon"></div>
                      ) : (
                        ""
                      )}

                      <div className="map-filter">
                        <div
                          className="map-icon-cntr"
                          onClick={this.handleHamb.bind(this)}
                        >
                          <i className="fa fa-bars" aria-hidden="true"></i>
                        </div>
                        <div
                          className="map-icon-cntr rem-icon"
                          title="Ocean"
                          id="Ocean"
                          onClick={() => self.HandleShipmentPin("Ocean")}
                        >
                          {/* <input
                  id="Ocean"
                  class="header-btn"
                  type="button"
                  value="Ocean-Shipment"
                  name="search-rate"
                  onClick={() => self.HandleShipmentPin("Ocean")}
                /> */}
                          <img src={HambShip} alt="ship icon" />
                        </div>
                        <div
                          className="map-icon-cntr rem-icon"
                          title="Air"
                          id="Air"
                          onClick={() => self.HandleShipmentPin("Air")}
                        >
                          {/* <input
                id="Air"
                class="header-btn"
                type="button"
                value="Air-Shipment"
                name="search-rate"
                onClick={() => self.HandleShipmentPin("Air")}
              /> */}
                          <img src={HambPlane} alt="plane icon" />
                        </div>
                        <div
                          className="map-icon-cntr rem-icon"
                          id="Delay-Ocean"
                          title="Delay Shipment"
                          onClick={() => self.HandleShipmentPin("Delay-Ocean")}
                        >
                          {/* <input
                    id="Delay-Ocean"
                    class="header-btn"
                    type="button"
                    value="Delay-Ocean-Shipment"
                    name="search-rate"
                    onClick={() => self.HandleShipmentPin("Delay-Ocean")}
                  /> */}
                          <img src={DelayShip} alt="plane icon" />
                        </div>
                        <div
                          className="map-icon-cntr rem-icon"
                          id="Booking-Ocean"
                          title="New Booking"
                          onClick={() =>
                            self.HandleShipmentPin("Booking-Ocean")
                          }
                        >
                          {/* <input
                    id="Booking-Ocean"
                    class="header-btn"
                    type="button"
                    value="CurrentBooking-Shipment"
                    name="search-rate"
                    onClick={() => self.HandleShipmentPin("Booking-Ocean")}
                  /> */}
                          <img src={CurrBook} alt="plane icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div
                    className="container-fluid p-0"
                    style={{
                      display: this.state.IsWidgets != false ? "block" : "none"
                    }}
                  ></div> */}
                  <div className="row dash-sects-cntr">
                    <div className="col-md-3">
                      <div className="dash-sects">
                        <h3>Watchlist Shipments</h3>
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
                          <div className="dash-sects-dtls-inner">{Booking}</div>
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
                          <div className="dash-sects-dtls-inner">{Quotes}</div>
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
                        {/* <span className="viewmore-span">...View More</span> */}
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
                      searchData={this.state.searchData}
                      markers={mapsData}
                      onClick={this.handleClick}
                      selectedMarker={selectedMarker}
                      ModalData={ModalData}
                      onPlaceSelected={this.onPlaceSelected}
                      onChangeSearchBox={this.onChangeSearchBox}
                      mapPosition={this.state.mapPosition}
                      zoom={this.state.zoom}
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

              {/* <input
                id="Ocean"
                className="header-btn"
                type="button"
                value="Ocean-Shipment"
                name="search-rate"
                onClick={() => self.HandleShipmentPin("Ocean")}
              />
              <input
                id="Air"
                className="header-btn"
                type="button"
                value="Air-Shipment"
                name="search-rate"
                onClick={() => self.HandleShipmentPin("Air")}
              />
              <input
                id="Delay-Ocean"
                className="header-btn"
                type="button"
                value="Delay-Ocean-Shipment"
                name="search-rate"
                onClick={() => self.HandleShipmentPin("Delay-Ocean")}
              />
              <input
                id="Booking-Ocean"
                className="header-btn"
                type="button"
                value="CurrentBooking-Shipment"
                name="search-rate"
                onClick={() => self.HandleShipmentPin("Booking-Ocean")}
              /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import Headers from "../component/header";
import ExistCust from "./../assets/img/exist-cust.png";
import NewCust from "./../assets/img/new-cust.png";
import SideMenu from "../component/sidemenu";
import Autocomplete from "react-autocomplete";
import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class myWayMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.bindMyWayMessage = this.bindMyWayMessage.bind(this);
  }

  componentDidMount() {
    this.bindMyWayMessage();
  }

  bindMyWayMessage() {
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/MyWayMessage`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        self.bindMyWayMessageById();
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        NotificationManager.error(err[1].replace("}", ""));

        // var actData = [];
        // actData.push({
        //   ModeOfTransport: "No Data Found"
        // });
        // self.setState({ reportdetails: actData });
      });
  }

  bindMyWayMessageById() {
    axios({
      method: "post",
      url: `${appSettings.APIURL}/MessageDetailsbyID`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        MsgType: "User Message",
        MessageID: 8410010
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        NotificationManager.error(err[1].replace("}", ""));

        // var actData = [];
        // actData.push({
        //   ModeOfTransport: "No Data Found"
        // });
        // self.setState({ reportdetails: actData });
      });
  }

  render() {
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg text-center">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Chat</h2>
            </div>
            <div class="container p-0">
              <h3 class=" text-center"></h3>
              <div class="messaging">
                <div class="inbox_msg">
                  <div className="row">
                    <div className="col-md-4">
                      <div class="inbox_people">
                        <div class="inbox_chat">
                          <div class="chat_list active_chat">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat_list">
                            <div class="chat_people">
                              <div class="chat_ib">
                                <h5>
                                  Sunil Rajput{" "}
                                  <span class="chat_date">Dec 25</span>
                                </h5>
                                <p>
                                  Test, which is a new approach to have all
                                  solutions astrology under one roof.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div class="mesgs">
                        <p className="chat-name">Sunil Rajput</p>
                        <div class="msg_history">
                          <div class="outgoing_msg">
                            <div class="sent_msg">
                              <p>
                                Test which is a new approach to have all
                                solutions
                              </p>
                              <span class="time_date"> 11:01 AM | June 9</span>{" "}
                            </div>
                          </div>

                          <div class="outgoing_msg">
                            <div class="sent_msg">
                              <p>Apollo University, Delhi, India Test</p>
                              <span class="time_date">
                                {" "}
                                11:01 AM | Today
                              </span>{" "}
                            </div>
                          </div>
                        </div>
                        <div class="type_msg">
                          <div class="input_msg_write">
                            <input
                              type="text"
                              class="write_msg"
                              placeholder="Type a message"
                            />
                            <button class="msg_send_btn" type="button">
                              <i
                                class="fa fa-paper-plane-o"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default myWayMessage;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import axios from "axios";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";

import { encryption } from "../helpers/encryption";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

class myWayMessage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      MessageArr: [],
      MessageLogArr: [],
      CommunicationUser: "",
      ReferenceNo: "",
      msgg: "",
      selectedItem: {}
    };

    this.bindMyWayMessage = this.bindMyWayMessage.bind(this);
    this.handlechange = this.handlechange.bind(this);
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
        var Message = "";
        var MessageArr = [];

        self.setState({
          MessageArr: response.data.Table
        });
        self.bindMyWayMessageById(response.data.Table[0]);
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  bindMyWayMessageById(item, e) {
    debugger;
    let self = this;
    self.setState({ selectedItem: item });
    axios({
      method: "post",
      url: `${appSettings.APIURL}/MessageDetailsbyID`,
      data: {
        UserID: encryption(window.localStorage.getItem("userid"), "desc"),
        MsgType: item.MessageType,
        MessageID: item.MessageId
      },
      headers: authHeader()
    })
      .then(function(response) {
        debugger;
        self.setState({
          CommunicationUser: item.LastCommunicationUser,
          MessageLogArr: response.data,
          ReferenceNo: response.data[0].ReferenceNo
        });
      })
      .catch(error => {
        debugger;
        var temperror = error.response.data;
        var err = temperror.split(":");
        NotificationManager.error(err[1].replace("}", ""));
      });
  }

  SendMessage = () => {
    debugger;
    let self = this;
    var hbllNo = this.state.ReferenceNo;
    var msgg = this.state.msgg;
 
    var paramdata = {
      UserID: encryption(window.localStorage.getItem("userid"), "desc"),
      ReferenceNo: this.state.ReferenceNo,
      TypeOfMessage: this.state.selectedItem.MessageType,
      Message: this.state.msgg,
      SubjectMessage: this.state.selectedItem.MessageTitle||"",
      MessageID: this.state.selectedItem.MessageId
    };

    if (msgg === "" || msgg === null) {
      NotificationManager.error("Please enter the message.");
    } else {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SendReplyToCommonMessage`,
        data: paramdata,
        headers: authHeader()
      }).then(function(response) {
        debugger;
        if (response != null) {
          if (response.data != null) {
            if (response.data.length > 0) {
              if (response.data[0] != null) {
                var message = response.data[0].Result;

                if (response.data[0].Result === "Message Send Successfully") {
                  NotificationManager.success(response.data[0].Result);
                  
                }
                var item = self.state.selectedItem;
                  self.setState({ msgg: "" });
                  self.bindMyWayMessageById(item);
              }
            }
          }
        }
      });
    }
  };

  handlechange(e) {
    debugger;
    //let fields = this.state.fields;
    // msgg = e.target.value;
    this.setState({
      msgg: e.target.value
    });
  }

  render() {
    var colClassName = "";
    if (localStorage.getItem("isColepse")==="true") {
      debugger;
      colClassName = "cls-flside colap";
    } else {
      debugger;
      colClassName = "cls-flside";
    }
    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>
          <div className="cls-rt no-bg text-center">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Chat</h2>
            </div>
            <div class="">
              <h3 class=" text-center"></h3>
              <div class="messaging">
                <div class="inbox_msg">
                  <div className="row">
                    <div className="col-md-4">
                      <div class="inbox_people">
                        <div class="inbox_chat">
                          {this.state.MessageArr.map((item, i) => (
                            <div
                              class="chat_list active_chat"
                              onClick={this.bindMyWayMessageById.bind(
                                this,
                                item
                              )}
                            >
                              <div class="chat_people">
                                <div class="chat_ib">
                                  <h5>
                                    {item.LastCommunicationUser}
                                    <span class="chat_date">
                                      {item.MessageTitle !== null
                                        ? item.MessageTitle.split(":")[1] !==
                                          undefined
                                          ? item.MessageTitle.split(
                                              ":"
                                            )[1].trim()
                                          : item.MessageTitle
                                        : ""}
                                    </span>
                                  </h5>
                                  <p>{item.MessageDetail}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div class="mesgs">
                        <p className="chat-name">
                          {this.state.CommunicationUser}
                        </p>
                        <div class="msg_history">
                          {this.state.MessageLogArr.map((item, i) => (
                            <div class="outgoing_msg">
                              <div class="sent_msg">
                                <p>{item.Message}</p>
                                <span class="time_date">
                                  {item.MessageCreationTime}
                                </span>{" "}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div class="type_msg">
                          <div class="input_msg_write">
                            <input
                              type="text"
                              class="write_msg"
                              placeholder="Type a message"
                              value={this.state.msgg}
                              onChange={this.handlechange.bind(this)}
                            />
                            <button
                              class="msg_send_btn"
                              type="button"
                              onClick={this.SendMessage}
                            >
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

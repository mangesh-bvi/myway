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
      msgg: ""
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
        // for (let i = 0; i < response.data.Table.length; i++) {
        //   if (!Message.includes(response.data.Table[i].MessageTitle!==null?
        //                         (response.data.Table[i].MessageTitle.includes(':')==true?
        //                         response.data.Table[i].MessageTitle.split(':')[1].trim():
        //                         response.data.Table[i].MessageTitle):
        //                         response.data.Table[i].MessageTitle)) {

        //       Message += (response.data.Table[i].MessageTitle!==null?
        //                  (response.data.Table[i].MessageTitle.includes(':')==true?
        //                  response.data.Table[i].MessageTitle.split(':')[1].trim():
        //                  response.data.Table[i].MessageTitle):response.data.Table[i].MessageTitle)

        //       MessageArr.push(response.data.Table[i])
        //   }

        // }
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

        // var actData = [];
        // actData.push({
        //   ModeOfTransport: "No Data Found"
        // });
        // self.setState({ reportdetails: actData });
      });
  }

  bindMyWayMessageById(item, e) {
    debugger;
    let self = this;
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

        // var actData = [];
        // actData.push({
        //   ModeOfTransport: "No Data Found"
        // });
        // self.setState({ reportdetails: actData });
      });
  }

  SendMessage = () => {
    debugger;
    let self = this;
    var hbllNo = this.state.ReferenceNo;
    var msgg = this.state.msgg;
    if (msgg === "" || msgg === null) {
      NotificationManager.error("Please enter the message.");
    } else {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/SendCommonMessage`,
        data: {
          UserID: encryption(window.localStorage.getItem("userid"), "desc"),
          ReferenceNo: hbllNo.trim(),
          // TypeOfMessage: drpshipment.value.trim(),
          Message: msgg
        },
        headers: authHeader()
      }).then(function(response) {
        if (response != null) {
          if (response.data != null) {
            if (response.data.length > 0) {
              if (response.data[0] != null) {
                var message = response.data[0].Result;
                // self.setState({ MessagesActivityDetails });
                if (response.data[0].Result === "Message Send Successfully") {
                  // setTimeout(() => {
                  // this.handleActivityList();
                  // }, 100);
                  NotificationManager.success(response.data[0].Result);
                }
                // self.handleActivityList();
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

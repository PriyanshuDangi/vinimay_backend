import React, { Component } from "react";
import styleClasses from "./Chat.module.css";
import io from "./Socket";
import { connect } from "react-redux";
import Inbox from "../../components/Chat/Inbox/Inbox";
import Messages from "../../components/Chat/Messages/Messages";
import InputMessage from "../../components/Chat/InputMessage/InputMessage";
import * as actionCreators from "../../store/actions/index";
import axios from "axios";
let socket;
class Chat extends Component {
  state = {
    room: null,
    currentName: null,
    currentCount: null,
    messageInput: "",
    messages: [],
    peoples: [],
    peoplesLoaded: false,
    sendMesaageDisabled: false,
  };

  componentDidMount = () => {
    socket = io();
    socket.on("message", (message) => {
      if (String(message.room) === String(this.state.room)) {
        this.setState((prevState) => {
          return { messages: prevState.messages.concat(message) };
        });
        this.props.decreaseCount(1);
        axios.post(
          "/api/chat/messageReadWhileOn",
          {
            channelId: message.room,
          },
          {
            headers: {
              Authorization: "Bearer " + this.props.token,
            },
          }
        );
      }
    });
    if (this.props.location.state && this.props.location.state.channelId) {
      let room = this.props.location.state.channelId;
      this.setState({
        room: room,
      });
      this.socketJoin(room);
    }
    axios
      .get("/api/chat/peoples/get", {
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
      })
      .then((response) => {
        // console.log(response);
        this.setState({
          peoples: response.data.peoples,
          peoplesLoaded: true,
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.newMessageCount > prevProps.newMessageCount) {
      if (
        String(this.state.room) !== String(this.props.newMessageDetails.room)
      ) {
        console.log(prevProps.newMessageCount, "hey");
        let peoples = prevState.peoples.map((pep) => {
          if (
            String(pep.channelId) === String(this.props.newMessageDetails.room)
          ) {
            pep.newMessagesRecieved = pep.newMessagesRecieved + 1;
            pep.lastMessage = this.props.newMessageDetails.message;
          }
          return pep;
        });
        console.log(peoples);
        this.setState({
          peoples,
        });
      }
    }
  };

  socketJoin = (room) => {
    let details = {
      room: room || this.state.room,
      username: this.props.username,
      userId: this.props.userId,
    };
    socket.emit("join", details, (error) => {
      if (error) {
        alert(error);
      }
    });
    axios
      .post(
        "/api/chat/getChat",
        {
          channelId: room,
        },
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        this.setState((prevState) => {
          return {
            messages: response.data.messages.concat(prevState.messages),
          };
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  socketSendMessage = (event) => {
    event.preventDefault();
    const message = this.state.messageInput;
    if (message.length === 0) {
      return;
    }
    let details = {
      room: this.state.room,
      username: this.props.username,
      userId: this.props.userId,
    };
    this.setState({
      sendMesaageDisabled: true,
    });
    socket.emit("sendMessage", details, message, (error) => {
      this.setState({
        messageInput: "",
        sendMesaageDisabled: false,
      });

      if (error) {
        console.log(error);
      }
      console.log("message is delivered");
    });
  };

  inputChangeHandler = (event) => {
    this.setState({
      messageInput: event.target.value,
    });
  };

  changeChannel = (channelId, name, count) => {
    if (String(this.state.room) !== String(channelId)) {
      this.setState((prevState) => {
        let peoples = prevState.peoples.map((pep) => {
          if (String(pep.channelId) === String(channelId)) {
            pep.newMessagesRecieved = 0;
          }
          return pep;
        });
        return {
          room: channelId,
          currentName: name,
          currentCount: count,
          messages: [],
          messageInput: "",
          peoples,
        };
      });
      if (count > 0) {
        this.props.decreaseCount(count);
      }
      if (channelId !== null) {
        this.socketJoin(channelId);
      }
    }
  };

  render() {
    let inboxClassName = [styleClasses.Inbox_Box];
    let messageBoxClassName = [styleClasses.Message_Box, styleClasses.Hide];
    if (this.state.room) {
      inboxClassName.push(styleClasses.Hide);
      messageBoxClassName.pop();
    }
    return (
      <React.Fragment>
        <div className={styleClasses.Container}>
          {this.state.peoplesLoaded && this.state.peoples.length === 0 ? (
            <div className={styleClasses.No_Messages}>
              <div>"No messages, yet"</div>
              <p>
                Your messages with seller and item you are selling will be here
              </p>
            </div>
          ) : (
            <div className={styleClasses.Message}>
              <div className={inboxClassName.join(" ")}>
                <Inbox
                  changeChannel={this.changeChannel}
                  peoples={this.state.peoples}
                  room={this.state.room}
                />
              </div>
              <div className={messageBoxClassName.join(" ")}>
                {this.state.room ? (
                  <Messages
                    userId={this.props.userId}
                    messages={this.state.messages}
                    currentName={this.state.currentName}
                    goBack={this.changeChannel}
                  />
                ) : (
                  <div className={styleClasses.Message_Empty}>
                    <i className="fa fa-comments fa-3x" aria-hidden="true"></i>
                    <b>Tap a chat to view messages.</b>
                  </div>
                )}
                {this.state.room ? (
                  <InputMessage
                    value={this.state.messageInput}
                    changed={this.inputChangeHandler}
                    onSend={this.socketSendMessage}
                    sendMesaageDisabled={this.state.sendMesaageDisabled}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.name,
    userId: state.auth.userId,
    newMessageCount: state.auth.newMessageCount,
    newMessageDetails: state.auth.newMessageDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    decreaseCount: (count) => dispatch(actionCreators.decrementCount(count)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

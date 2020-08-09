import React, { Component } from "react";
import styleClasses from "./Chat.module.css";
import socket from "./Socket";
import { connect } from "react-redux";
import Inbox from "../../components/Chat/Inbox/Inbox";
import Messages from "../../components/Chat/Messages/Messages";
import InputMessage from "../../components/Chat/InputMessage/InputMessage";
import axios from "axios";

class Chat extends Component {
  state = {
    room: null,
    currentName: null,
    messageInput: "",
    messages: [],
    peoples: [],
    peoplesLoaded: false,
  };

  componentDidMount = () => {
    socket.on("message", (message) => {
      this.setState((prevState) => {
        return { messages: prevState.messages.concat(message) };
      });
      // console.log(message);
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

  // componentDidUpdate = (prevProps, prevState, snapshot) => {
  //   if (this.state.room !== prevState.room && prevState.room) {
  //     this.socketJoin(this.state.room);
  //   }
  // };

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
        // console.log(response);
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

  socketSendMessage = () => {
    let details = {
      room: this.state.room,
      username: this.props.username,
      userId: this.props.userId,
    };
    const message = this.state.messageInput;
    socket.emit("sendMessage", details, message, (error) => {
      console.log("message is delivered");
    });
    this.setState({
      messageInput: "",
    });
  };

  inputChangeHandler = (event) => {
    this.setState({
      messageInput: event.target.value,
    });
  };

  changeChannel = (channelId, name) => {
    // console.log(channelId);
    this.setState({
      room: channelId,
      currentName: name,
      messages: [],
      messageInput: "",
    });
    if (channelId !== null) {
      this.socketJoin(channelId);
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
  };
};

export default connect(mapStateToProps)(Chat);

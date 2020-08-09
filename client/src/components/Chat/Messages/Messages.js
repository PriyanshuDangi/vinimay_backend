import React from "react";
import styleClasses from "./Messages.module.css";
import IncomingMessage from "./Message/IncomingMessage/IncomingMessage";
import OutgoingMessage from "./Message/OutgoingMessage/OutgoingMessage";
import userImg from "../../../assets/images/user.jpg";

export default function Messages(props) {
  const messages = props.messages.map((message, index) => {
    if (String(message.userId) === String(props.userId)) {
      return (
        <OutgoingMessage
          message={message.message}
          key={index}
          time={message.time}
        />
      );
    } else {
      return (
        <IncomingMessage
          message={message.message}
          key={index}
          time={message.time}
        />
      );
    }
  });
  // console.log(messages);
  return (
    <React.Fragment>
      <div className={styleClasses.Messages_Heading}>
        <div
          onClick={props.goBack.bind(this, null, null)}
          className={styleClasses.GoBack}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div className={styleClasses.Name_Heading}>
          <div className={styleClasses.People_Img}>
            {" "}
            <img src={userImg} alt={props.currentName} />{" "}
          </div>
          <h4>{props.currentName}</h4>
        </div>
      </div>
      <div className={styleClasses.Message_History}>{messages}</div>
    </React.Fragment>
  );
}

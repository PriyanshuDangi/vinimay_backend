import React from "react";
import styleClasses from "./People.module.css";
import userImg from "../../../../assets/images/user.jpg";
import moment from "moment";

export default function People(props) {
  const peopleClass = [styleClasses.People_List];
  if (props.room) {
    if (props.room === props.people.channelId) {
      peopleClass.push(styleClasses.Active_List);
    }
  }
  return (
    <React.Fragment>
      <div
        className={peopleClass.join(" ")}
        onClick={props.changeChannel.bind(
          this,
          props.people.channelId,
          props.people.name
        )}>
        <div className={styleClasses.People_Info}>
          <div className={styleClasses.People_Img}>
            {" "}
            <img src={userImg} alt={props.people.name} />{" "}
          </div>
          <div className={styleClasses.People_Ib}>
            <h5>
              {props.people.name}{" "}
              <span className={styleClasses.Chat_Date}>
                {moment(props.people.time).format("MMM DD")}
              </span>
            </h5>
            <div className={styleClasses.Last_Message}>
              {props.people.lastMessage === null ? (
                <p>
                  <i className="fa fa-rocket" aria-hidden="true"></i> Tap To
                  Chat
                </p>
              ) : (
                <p>
                  {props.people.lastMessage}
                  {props.people.newMessagesRecieved ? (
                    <span>{props.people.newMessagesRecieved}</span>
                  ) : null}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

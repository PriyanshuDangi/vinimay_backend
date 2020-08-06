import React from "react";
import styleClasses from "./OutgoingMessage.module.css";
// import userImg from "../../../../../assets/images/user.jpg";
import moment from "moment";

export default function OutgoingMessage(props) {
  return (
    <React.Fragment>
      <div className={styleClasses.Outgoing_Message}>
        <div>
          <p>{props.message}</p>
          <span className={styleClasses.timeDate}>
            {" "}
            {moment(props.time).format("LT | MMM D")}
          </span>{" "}
        </div>
      </div>
    </React.Fragment>
  );
}

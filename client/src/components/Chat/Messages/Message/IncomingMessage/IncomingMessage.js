import React from "react";
import styleClasses from "./IncomingMessage.module.css";
// import userImg from "../../../../../assets/images/user.jpg";
import moment from "moment";

export default function IncomingMessage(props) {
  return (
    <React.Fragment>
      {/* <div className={styleClasses.Incoming_Message}> */}
      {/* <div className={styleClasses.Incoming_Messsage_Img}>
          {" "}
          <img src={userImg} alt="User Image" />{" "}
        </div> */}
      <div className={styleClasses.Received_Message}>
        <div>
          <p>{props.message}</p>
          <span className={styleClasses.timeDate}>
            {" "}
            {moment(props.time).format("LT | MMM D")}
          </span>
        </div>
      </div>
      {/* </div> */}
    </React.Fragment>
  );
}

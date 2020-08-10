import React from "react";
import styleClasses from "./InputMessage.module.css";

export default function InputMessage(props) {
  return (
    <React.Fragment>
      <form onSubmit={props.onSend} >
        <div className={styleClasses.type_msg}>
          <div className={styleClasses.input_msg_write}>
            <input
              type="text"
              className={styleClasses.write_msg}
              placeholder="Type a message"
              value={props.value}
              onChange={props.changed}
            />
            <button className={styleClasses.msg_send_btn} disabled={props.sendMesaageDisabled}>
              Send
          </button>
            {/* <button className={styleClasses.msg_send_btn} type="button"><i className={styleClasses.fa fa-paper-plane-o} aria-hidden="true"></i></button> */}
          </div>
        </div>
      </form>
    </React.Fragment>
  );
}

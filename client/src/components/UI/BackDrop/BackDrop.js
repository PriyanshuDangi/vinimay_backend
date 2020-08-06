import React from "react";

import styleClasses from "./BackDrop.module.css";

function BackDrop(props) {
  return props.show ? (
    <div className={styleClasses.BackDrop} onClick={props.clicked}></div>
  ) : null;
}

export default BackDrop;

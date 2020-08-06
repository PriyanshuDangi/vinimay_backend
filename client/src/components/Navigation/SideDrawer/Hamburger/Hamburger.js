import React from "react";
import styleClasses from "./Hamburger.module.css";

export default function Hamburger(props) {
  return (
    <div className={styleClasses.Hamburger} onClick={props.clicked}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

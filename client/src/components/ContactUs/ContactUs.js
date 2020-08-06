import React from "react";
import styleClasses from "./ContactUs.module.css";

export default function ContactUs() {
  return (
    <div className={styleClasses.Container}>
      <div>
        <div>Having trouble, query or suggestion.</div>{" "}
        <div>
          Please write us at{" "}
          <span>
            <b> priyanshudangipd@gmail.com </b>
          </span>
        </div>
        <div>And we will contact you shortly.</div>
      </div>
    </div>
  );
}

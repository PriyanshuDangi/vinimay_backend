import React from "react";
import styleClasses from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

function NavigationItems(props) {
  return (
    <ul className={styleClasses.NavigationItems}>
      {/* <NavigationItem link="/notification">
        <i className="fa fa-bell-o" aria-hidden="true"></i>
        <span> Notification</span>
      </NavigationItem> */}
      <NavigationItem link="/chat">
        <i className="fa fa-whatsapp" aria-hidden="true"></i>
        <span> Messages</span>
      </NavigationItem>
      <NavigationItem link="/post">
        <div className={styleClasses.Sell}>
          <i className="fa fa-camera" aria-hidden="true"></i> SELL
        </div>
      </NavigationItem>
    </ul>
  );
}
export default NavigationItems;

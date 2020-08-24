import React from "react";
import styleClasses from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import { connect } from "react-redux";

function NavigationItems(props) {
  return (
    <ul className={styleClasses.NavigationItems}>
      {/* <NavigationItem link="/notification">
        <i className="fa fa-bell-o" aria-hidden="true"></i>
        <span> Notification</span>
      </NavigationItem> */}
      <NavigationItem link="/chat">
        <div className={styleClasses.BadgeCover}>
          {/* <i className="fa fa-whatsapp " aria-hidden="true"></i> */}
          <svg
            aria-label="Direct"
            className="_8-yf5 "
            fill="#ffffff"
            height="24"
            viewBox="0 0 48 48"
            width="24"
            style={{ color: "white" }}>
            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l13.2 13c.5.4 1.1.6 1.7.3l16.6-8c.7-.3 1.6-.1 2 .5.4.7.2 1.6-.5 2l-15.6 9.9c-.5.3-.8 1-.7 1.6l4.6 19c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.5-.5.5-1.1.2-1.6z"></path>
          </svg>
          <span> Messages</span>
          {props.count > 0 ? <b>{props.count}</b> : null}
        </div>
      </NavigationItem>
      <NavigationItem link="/post">
        <div className={styleClasses.Sell}>
          <i className="fa fa-camera" aria-hidden="true"></i> SELL
        </div>
      </NavigationItem>
    </ul>
  );
}
const mapStateToProps = (state) => {
  return {
    count: state.auth.newMessageCount,
  };
};

export default connect(mapStateToProps)(NavigationItems);

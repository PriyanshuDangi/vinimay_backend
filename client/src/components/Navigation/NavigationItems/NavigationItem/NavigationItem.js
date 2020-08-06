import React from "react";
import styleClasses from "./NavigationItem.module.css";
import { NavLink } from "react-router-dom";

function NavigationItem(props) {
  let attachedClasses = [
    styleClasses.NavigationItem,
    styleClasses.NavbarNavigation,
  ];
  if (props.sideDrawer) {
    attachedClasses = [styleClasses.NavigationItem];
  }
  return (
    <li className={attachedClasses.join(" ")}>
      <NavLink
        exact={props.exact}
        activeClassName={styleClasses.active}
        to={props.link}>
        {props.children}
      </NavLink>
    </li>
  );
}

export default NavigationItem;

import React from "react";
import styleClasses from "./Logo.module.css";
import { NavLink } from "react-router-dom";

function Logo(props) {
  return (
    <div className={styleClasses.Logo}>
      <NavLink to="/">
        {/* <img
        src="https://getbootstrap.com/docs/4.5/assets/brand/bootstrap-solid.svg"
        alt="MyBurger"
      /> */}
        <h2>Vinimay</h2>
      </NavLink>
    </div>
  );
}

export default Logo;

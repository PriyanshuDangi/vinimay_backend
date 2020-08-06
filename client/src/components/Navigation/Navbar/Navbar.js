import React from "react";
import Logo from "../../Logo/Logo";
import styleClasses from "./Navbar.module.css";
import NavigationItems from "../NavigationItems/NavigationItems";
import Search from "./Search/Search";
import Hamburger from "../SideDrawer/Hamburger/Hamburger";

export default function Navbar(props) {
  return (
    <div className={styleClasses.DesktopOnly}>
      <header className={styleClasses.Toolbar}>
        <div className={styleClasses.NavbarLeft}>
          <Hamburger clicked={props.hamburger} />
          <div className={styleClasses.Logo}>
            <Logo />
          </div>
          <div className={styleClasses.SearchTop}>
            <Search />
          </div>
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </header>
      <div className={styleClasses.SearchBottom}>
        <Search />
      </div>
    </div>
  );
}

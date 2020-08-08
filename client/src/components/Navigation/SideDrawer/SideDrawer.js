import React from "react";
import styleClasses from "./SideDrawer.module.css";
import BackDrop from "../../UI/BackDrop/BackDrop";
import NavigationItem from "../NavigationItems/NavigationItem/NavigationItem";
import Logo from "../../Logo/Logo";

function SideDrawer(props) {
  let attachedClasses = [styleClasses.SideDrawer, styleClasses.Close];
  if (props.open) {
    attachedClasses = [styleClasses.SideDrawer, styleClasses.Open];
  }
  return (
    <React.Fragment>
      <BackDrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
        <div className={styleClasses.Logo}>
          <Logo />
        </div>
        <nav>
          <ul>
            <NavigationItem link="/" exact sideDrawer>
              <i className="fa fa-home" aria-hidden="true"></i>{" "}
              <span>Home</span>
            </NavigationItem>
            <NavigationItem link="/myprofile" exact sideDrawer>
              <i className="fa fa-user-circle-o" aria-hidden="true"></i>{" "}
              <span>My Profile</span>
            </NavigationItem>
            <NavigationItem link="/myproducts" exact sideDrawer>
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>{" "}
              <span>My Products</span>
            </NavigationItem>
            <NavigationItem link="/contactus" exact sideDrawer>
              <i className="fa fa-phone" aria-hidden="true"></i>{" "}
              <span>Contact Us</span>
            </NavigationItem>
            <NavigationItem link="/logout" exact sideDrawer>
              <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
              <span>Logout</span>
            </NavigationItem>
          </ul>
        </nav>
      </div>
    </React.Fragment>
  );
}

export default SideDrawer;

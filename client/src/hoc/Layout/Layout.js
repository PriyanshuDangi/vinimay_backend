import React, { Component } from "react";
import styleClasses from "./Layout.module.css";
import Navbar from "../../components/Navigation/Navbar/Navbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

export default class Layout extends Component {
  state = {
    showSideDrawer: false,
  };
  sideDrawerToggle = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <div>
        <Navbar hamburger={this.sideDrawerToggle} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerToggle}
        />
        <main className={styleClasses.Content}>{this.props.children}</main>
      </div>
    );
  }
}

import React, { Component } from "react";
import styleClasses from "./Layout.module.css";
import Navbar from "../../components/Navigation/Navbar/Navbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Layout extends Component {
  state = {
    showSideDrawer: false,
    searchInput: "",
  };
  inputChangeHandler = (event) => {
    this.setState({
      searchInput: event.target.value,
    });
    console.log(event.target.value);
  };
  onSearch = (event) => {
    event.preventDefault();
    if (this.state.searchInput !== "") {
      this.props.history.replace("/search?string=" + this.state.searchInput);
    }
  };
  sideDrawerToggle = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <div>
        <Navbar
          hamburger={this.sideDrawerToggle}
          onSearchInputChange={this.inputChangeHandler}
          searchInput={this.state.searchInput}
          onSearch={this.onSearch}
        />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerToggle}
        />
        <main className={styleClasses.Content}>{this.props.children}</main>
      </div>
    );
  }
}

export default withRouter(connect()(Layout));

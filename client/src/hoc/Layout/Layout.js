import React, { Component } from "react";
import styleClasses from "./Layout.module.css";
import Navbar from "../../components/Navigation/Navbar/Navbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actionCreators from "../../store/actions/index";
import io from "socket.io-client";
let socket;
class Layout extends Component {
  state = {
    showSideDrawer: false,
    searchInput: "",
    messageNotificationCount: null,
  };
  componentDidMount = () => {
    socket = io();
    let details = {
      home: true,
      user: this.props.userId,
      room: this.props.userId,
      username: this.props.username,
      userId: this.props.userId,
    };
    socket.emit("join", details, (error) => {
      if (error) {
        alert(error);
      }
    });
    socket.on("notification", (count, room, message, userId) => {
      console.log(count, room, message, userId);
      let details = {
        room,
        message,
        userId,
      };
      this.props.increaseCount(details);
    });
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

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.name,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    increaseCount: (details) =>
      dispatch(actionCreators.incrementCount(1, details)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));

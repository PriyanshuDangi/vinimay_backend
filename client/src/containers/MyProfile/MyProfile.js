import React, { Component } from "react";
import { connect } from "react-redux";
import styleClasses from "./MyProfile.module.css";

class MyProfile extends Component {
  render() {}
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(MyProfile);

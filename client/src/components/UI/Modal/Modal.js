import React, { Component } from "react";

import styleClasses from "./Modal.module.css";
import BackDrop from "../BackDrop/BackDrop";

class Modal extends Component {
  render() {
    return (
      <React.Fragment>
        <BackDrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={styleClasses.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(100vh)",
            opacity: this.props.show ? "1" : "0",
          }}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;

import React, { Component } from "react";
import styleClasses from "../Login/Login.module.css";
import Input from "../../../components/UI/Input/Input";

export default class Otp extends Component {
  state = {
    value: "",
    elementConfig: {
      required: true,
      minLength: 4,
      maxLength: 4,
    },
  };
  inputChangeHandler = (event) => {
    this.setState({
      value: event.target.value,
    });
  };
  render() {
    return (
      <div className={styleClasses.Login}>
        <form>
          <Input
            label="OTP"
            elementConfig={this.state.elementConfig}
            id="OTP"
            name="OTP"
            value={this.state.value}
            changed={this.inputChangeHandler}
            helper="This may take some time. Please check your spam folder also."
          />
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Check OTP
          </button>
        </form>
      </div>
    );
  }
}

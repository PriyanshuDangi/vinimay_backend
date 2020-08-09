import React, { Component } from "react";
import styleClasses from "../Login/Login.module.css";
import Input from "../../../components/UI/Input/Input";
import * as actionCreators from "../../../store/actions/index";
import { connect } from "react-redux";
import Logo from "../../../components/Logo/Logo";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from "axios";

class Otp extends Component {
  state = {
    value: "",
    elementConfig: {
      required: true,
      minLength: 4,
      maxLength: 4,
    },
    message: null,
    resendLoading: false,
  };
  inputChangeHandler = (event) => {
    this.setState({
      value: event.target.value,
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onVerification(this.props.webmail, this.state.value);
  };
  resendOtp = () => {
    this.setState({
      resendLoading: true,
    });
    axios
      .post("/api/user/regenrateOTP", {
        webmail: this.props.webmail,
      })
      .then((response) => {
        console.log(response);
        this.setState({
          message: response.data.message,
          resendLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        console.log(error.response.data);
        this.setState({
          message: error.response.data.error,
          resendLoading: false,
        });
      });
  };
  render() {
    let error;
    if (this.props.error) {
      error = (
        <div className="alert alert-warning text-center" role="alert">
          {this.props.error}
        </div>
      );
    }
    let message;
    if (this.state.message) {
      message = (
        <div className="alert alert-primary text-center" role="alert">
          {this.state.message}
        </div>
      );
    }
    let resendButton = (
      <button
        type="button"
        className="btn btn-link btn-block"
        onClick={this.resendOtp}>
        Didn't get the OTP. We can resend it.
      </button>
    );
    if (this.state.resendLoading) {
      resendButton = (
        <div style={{ textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
        </div>
      );
    }
    let formContent = (
      <form onSubmit={this.submitHandler}>
        {error}
        {message}
        <div className="alert alert-light" role="alert">
          Please Verify.
          <br></br>Otp is sent to your registered webmail id.
        </div>
        <Input
          label="OTP"
          elementConfig={this.state.elementConfig}
          id="OTP"
          name="OTP"
          value={this.state.value}
          changed={this.inputChangeHandler}
          helper="OTP may take some time to reach. Please check your spam folder also."
        />

        <div
          style={{ display: "flex", justifyContent: "center", clear: "both" }}>
          <div>
            <button className="btn btn-primary" type="submit">
              Check OTP
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={this.props.goBack}>
              Go Back
            </button>
          </div>
        </div>
        {resendButton}
      </form>
    );
    if (this.props.loading) {
      formContent = <Spinner />;
    }
    return (
      <div className={styleClasses.Login}>
        <div className="text-center mb-4">
          <Logo />
        </div>
        {formContent}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    webmail: state.auth.webmail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVerification: (webmail, otp) =>
      dispatch(actionCreators.authOtp(webmail, otp)),
    goBack: () => dispatch(actionCreators.cancelVerification()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Otp);

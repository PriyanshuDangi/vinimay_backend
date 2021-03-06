import React, { Component } from "react";
import styleClasses from "./Login.module.css";
import Logo from "../../../components/Logo/Logo";
import Input from "../../../components/UI/Input/Input";
import { Link, Redirect } from "react-router-dom";
import * as actionCreators from "../../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";

class Login extends Component {
  state = {
    controls: {
      webmail: {
        elementType: "input",
        elementConfig: {
          type: "email",
          required: true,
          autoFocus: true,
          pattern: "[0-9]{9}@nitt.edu",
        },
        value: "",
        label: "Webmail Id",
        helper: " Please enter your Webmail Id ending with @nitt.edu",
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          required: true,
          minLength: "7",
        },
        value: "",
        label: "Password",
        helper: "Must be 7 characters long.",
      },
    },
  };

  inputChangeHandler = (event) => {
    const updatedControls = {
      ...this.state.controls,
      [event.target.name]: {
        ...this.state.controls[event.target.name],
        value: event.target.value,
      },
    };
    this.setState({
      controls: updatedControls,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onLogin(
      this.state.controls.webmail.value,
      this.state.controls.password.value
    );
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    let formInput = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        name={formElement.id}
        label={formElement.config.label}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        helper={formElement.config.helper}
        changed={this.inputChangeHandler}
      />
    ));
    let error;
    if (this.props.authError) {
      error = (
        <div className="alert alert-warning text-center" role="alert">
          {this.props.authError}
        </div>
      );
    }

    let formContent = (
      <form onSubmit={this.submitHandler}>
        {error}
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 ">Login</h1>
        </div>
        {formInput}
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Continue
        </button>
        <hr />
        <p className=" text-center form-text text-muted">
          New To Vinimay
          <Link to="/signup">
            {" "}
            <i className="fa fa-chevron-right" aria-hidden="true"></i> Create
            Your Vinimay Account
          </Link>
        </p>
      </form>
    );

    if (this.props.loading) {
      formContent = <Spinner />;
    }

    return (
      <div className={styleClasses.Login}>
        {this.props.isAuth ? <Redirect to="/" /> : null}
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
    authError: state.auth.error,
    isAuth: state.auth.token !== null,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (webmail, password) =>
      dispatch(actionCreators.authLogin(webmail, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

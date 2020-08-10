import React, { Component } from "react";
import { connect } from "react-redux";
import styleClasses from "./MyProfile.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";
import axios from "axios";

class MyProfile extends Component {
  state = {
    changePassword: false,
    error: null,
    loading: false,
    message: null,
    controls: {
      oldPassword: {
        elementType: "input",
        elementConfig: {
          type: "password",
          required: true,
          minLength: "7",
        },
        value: "",
        label: "Old Password",
      },
      newPassword: {
        elementType: "input",
        elementConfig: {
          type: "password",
          required: true,
          minLength: "7",
        },
        value: "",
        label: "New Password",
      },
    },
  };
  toggleChangePasswordState = () => {
    this.setState((prevState) => {
      return {
        changePassword: !prevState.changePassword,
        error: null,
        message: null,
      };
    });
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
    this.setState({
      loading: true,
      error: false,
    });
    axios
      .post(
        "/api/user/changePassword",
        {
          webmail: this.props.webmail,
          oldPassword: this.state.controls.oldPassword.value,
          newPassword: this.state.controls.newPassword.value,
        },
        {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + this.props.token,
          },
        }
      )
      .then((response) => {
        this.setState({
          loading: false,
          error: null,
          message: response.data.message,
          changePassword: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.response.data.error,
        });
      });
  };
  render() {
    let message;
    if (this.state.message) {
      message = (
        <div className="alert alert-success text-center" role="alert">
          {this.state.message}
        </div>
      );
    }
    let content = (
      <React.Fragment>
        <div className={styleClasses.Details}>
          {message}
          <div>
            <span>Name: </span>
            <span>{this.props.name}</span>
          </div>
          <div>
            <span>Webmail: </span>
            <span>{this.props.webmail}</span>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={this.toggleChangePasswordState}>
            Want To Change Password?
          </button>
        </div>
      </React.Fragment>
    );
    if (this.state.changePassword) {
      let error;
      if (this.state.error) {
        error = (
          <div className="alert alert-warning text-center" role="alert">
            {this.state.error}
          </div>
        );
      }
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
      content = (
        <form onSubmit={this.submitHandler}>
          {error}
          {formInput}
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Change Password
          </button>
          <button
            className="btn btn-danger btn-block"
            type="button"
            onClick={this.toggleChangePasswordState}>
            Go Back
          </button>
        </form>
      );
      if (this.state.loading) {
        content = <Spinner />;
      }
    }
    return (
      <React.Fragment>
        <div className={styleClasses.MyProfile}>
          <div className={styleClasses.Container}>{content}</div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    webmail: state.auth.webmail,
    name: state.auth.name,
  };
};

export default connect(mapStateToProps)(MyProfile);

import * as actionTypes from "./actionTypes";
import axios from "axios";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("webmail");
  localStorage.removeItem("name");
  localStorage.removeItem("_id");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authActionStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (data) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    data: data,
  };
};

export const authFail = (error, errorStatus) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
    errorStatus,
  };
};

export const authLogin = (webmail, password) => {
  return (dispatch) => {
    dispatch(authActionStart());
    const authData = {
      webmail,
      password,
    };
    axios
      .post("/api/user/login", authData)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("_id", response.data.user._id);
        localStorage.setItem("webmail", response.data.user.webmail);
        localStorage.setItem("name", response.data.user.name);
        console.log(response.data);
        dispatch(authSuccess(response.data));
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error.response.data.error, error.response.status));
        console.log(error.response);
      });
  };
};

export const authSignup = (webmail, password, name) => {
  return (dispatch) => {
    dispatch(authActionStart());
    const authData = {
      webmail,
      password,
      name,
    };
    axios
      .post("/api/user/signup", authData)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("_id", response.data.user._id);
        localStorage.setItem("webmail", response.data.user.webmail);
        localStorage.setItem("name", response.data.user.name);
        console.log(response.data);
        dispatch(authSuccess(response.data));
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error.response.data.error, error.response.status));
        console.log(error.response);
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const _id = localStorage.getItem("_id");
      const webmail = localStorage.getItem("webmail");
      const name = localStorage.getItem("name");
      if (_id || webmail || name) {
        const data = {
          token,
          user: {
            _id,
            webmail,
            name,
          },
        };
        dispatch(authSuccess(data));
      } else {
        dispatch(logout());
      }
    }
  };
};

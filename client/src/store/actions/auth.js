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

export const authActionStart = (webmail) => {
  return {
    type: actionTypes.AUTH_START,
    webmail,
  };
};

export const authOtpStart = () => {
  return {
    type: actionTypes.AUTH_OTP_START,
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

export const getVerified = () => {
  return {
    type: actionTypes.GET_VERIFIED,
  };
};

export const cancelVerification = () => {
  return {
    type: actionTypes.CANCEL_VERIFICATION,
  };
};

export const authOtp = (webmail, otp) => {
  return (dispatch) => {
    dispatch(authOtpStart(webmail));
    const data = {
      webmail,
      otp,
    };
    axios
      .post("/api/user/checkOTP", data)
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

export const authLogin = (webmail, password) => {
  return (dispatch) => {
    dispatch(authActionStart(webmail));
    const authData = {
      webmail,
      password,
    };
    axios
      .post("/api/user/login", authData)
      .then((response) => {
        console.log(response);
        if (response.data.doVerify) {
          dispatch(getVerified());
        } else {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("_id", response.data.user._id);
          localStorage.setItem("webmail", response.data.user.webmail);
          localStorage.setItem("name", response.data.user.name);
          console.log(response.data);
          dispatch(authSuccess(response.data));
        }
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
    dispatch(authActionStart(webmail));
    const authData = {
      webmail,
      password,
      name,
    };
    axios
      .post("/api/user/signup", authData)
      .then((response) => {
        // console.log(response);
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("_id", response.data.user._id);
        // localStorage.setItem("webmail", response.data.user.webmail);
        // localStorage.setItem("name", response.data.user.name);
        // console.log(response.data);
        // dispatch(authSuccess(response.data));
        dispatch(getVerified());
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
        let data = {
          token,
          user: {
            _id,
            webmail,
            name,
          },
        };
        dispatch(authSuccess(data));
        axios
          .get("/api/user/checkToken", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            localStorage.setItem("_id", response.data.user._id);
            localStorage.setItem("webmail", response.data.user.webmail);
            localStorage.setItem("name", response.data.user.name);
            data = {
              token,
              user: { ...response.data.user },
            };
            dispatch(authSuccess(data));
          })
          .catch(() => {
            dispatch(logout());
          });
      } else {
        dispatch(logout());
      }
    }
  };
};

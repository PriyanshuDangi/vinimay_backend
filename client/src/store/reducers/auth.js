import * as actionTypes from "../actions/actionTypes";

const intialState = {
  name: null,
  webmail: null,
  token: null,
  userId: null,
  loading: false,
  error: null,
  errorStatus: null,
  doVerify: false,
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_OTP_START:
      return {
        ...state,
        loading: true,
        error: null,
        errorStatus: null,
      };
    case actionTypes.GET_VERIFIED:
      return {
        ...state,
        error: null,
        errorStatus: null,
        doVerify: true,
        loading: false,
      };
    case actionTypes.CANCEL_VERIFICATION:
      return {
        ...state,
        name: null,
        webmail: null,
        token: null,
        userId: null,
        loading: false,
        error: null,
        errorStatus: null,
        doVerify: false,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        name: null,
        webmail: null,
        token: null,
        userId: null,
        loading: false,
        error: null,
        errorStatus: null,
        doVerify: false,
      };
    case actionTypes.AUTH_START:
      return {
        ...state,
        webmail: action.webmail,
        loading: true,
        error: null,
        errorStatus: null,
        doVerify: false,
      };
    case actionTypes.AUTH_SUCCESS:
      const updatedState = {
        ...state,
        error: null,
        errorStatus: null,
        loading: false,
        name: action.data.user.name,
        webmail: action.data.user.webmail,
        token: action.data.token,
        userId: action.data.user._id,
        doVerify: false,
      };
      return updatedState;
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        error: action.error,
        errorStatus: action.errorStatus,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "./actionTypes";

export const incrementCount = (count, details) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.INCREMENT_COUNT, count, details });
  };
};

export const decrementCount = (count) => {
  console.log(count);
  return (dispatch) => {
    dispatch({ type: actionTypes.DECREMENT_COUNT, count });
  };
};

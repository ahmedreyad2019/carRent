import * as actionTypes from "../actionConstants/action-types";
const intialState = {
  loggedIn: false,
  error: false,
  token: null,
  loading: false,
  userId: null,
  user: null
};
export default (loginReducer = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        loggedIn: true
      };
    case actionTypes.SIGN_UP:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        loggedIn: true

      };
    case actionTypes.LOGOUT:
      return {
        intialState
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.error,
        loggedIn: false
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
});

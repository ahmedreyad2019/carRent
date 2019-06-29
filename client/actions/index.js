import * as types from "../actionConstants/action-types";
import { AsyncStorage } from "react-native";
const axios = require("axios");
export const loading = loading => {
  return {
    type: types.SET_LOADING,
    loading
  };
};
export const setError = error => {
  return {
    type: types.SET_ERROR,
    error
  };
};
export const setUser = user => {
  return {
    type: types.SET_USER,
    user
  };
};
export const setCars = cars => {
  return {
    type: types.SET_CARS,
    cars: cars
  };
};
export const setTransactions = transactions => {
  return {
    type: types.SET_TRANSACTIONS,
    allCompanies: transactions
  };
};

export const selectCar = car => {
  return {
    type: types.SELECT_CAR,
    car
  };
};
export const closeCarModal = () => {
  return {
    type: types.CLOSE_CAR_MODAL
  };
};
export const setOrder = () => {
  return {
    type: types.SET_ORDER
  };
};
export const setSource = source => {
  return {
    type: types.SET_SOURCE,
    source
  };
};
export const openCarModal = () => {
  return {
    type: types.OPEN_CAR_MODAL
  };
};
export const closeFilterModal = () => {
  return {
    type: types.CLOSE_FILTER_MODAL
  };
};
export const openFilterModal = () => {
  return {
    type: types.OPEN_FILTER_MODAL
  };
};
export const closeDateModal = () => {
  return {
    type: types.CLOSE_DATE_MODAL
  };
};
export const openDateModal = () => {
  return {
    type: types.OPEN_DATE_MODAL
  };
};
export const closeSearchModal = () => {
  return {
    type: types.CLOSE_SEARCH_MODAL
  };
};
export const openSearchModal = () => {
  return {
    type: types.OPEN_SEARCH_MODAL
  };
};
export const clear = () => {
  return {
    type: types.CLEAR
  };
};
export const logout = () => {
  return dispatch => {
    dispatch(setCars(""));
    dispatch(setRequests(""));
    AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
    dispatch({ type: types.LOGOUT });
  };
};
export const setToken = (token, userId) => {
  return {
    type: types.LOGIN,
    token,
    userId
  };
};
export const setSignUp = token => {
  return {
    type: types.SIGN_UP,
    token,
    userId
  };
};
export const login = (mobileNumber, password) => {
  return dispatch => {
    dispatch(loading(true));
    try {
      AsyncStorage.getAllKeys()
        .then(AsyncStorage.multiRemove)
        .then(
          fetch("http://192.168.0.110:3000/carRenter/login", {
            method: "POST",
            body: JSON.stringify({
              mobileNumber: mobileNumber,
              password: password
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }).then(response => {
            response.json().then(data => {
              if (data.auth) {
                AsyncStorage.setItem("jwt", data.token);
                AsyncStorage.getItem("jwt").then(res => {
                  console.log(res);
                });
                dispatch(setToken(data.token, data.id));
              } else dispatch(setError(true));
              dispatch(loading(false));
            });
          })
        );
    } catch (error) {
      dispatch(setError(true));
    }
  };
};
export const signUp = user => {
  return dispatch => {
    dispatch(loading(true));

    AsyncStorage.getAllKeys()
      .then(AsyncStorage.multiRemove)
      .then(
        fetch("http://serverbrogrammers.herokuapp.com/api/investors/register", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => {
          response.json().then(data => {
            console.log(data);
            if (data.auth) {
              dispatch(setSignUp(data.token, data.id));
            }
            dispatch(loading(false));
          });
        })
      );
  };
};

export const fetchCars = () => {
  return dispatch => {
    dispatch(loading(true));
    AsyncStorage.getItem("jwt").then(token =>
      axios
        .get(
          `http://192.168.0.110:3000/carRenter/view/availableCars`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": token
            }
          }
        )
        .then(res => {
          console.log(res.data.data)
          dispatch(setCars(res.data.data));
          dispatch(loading(false));
        })
        .catch(error => {
          console.log(error);
        })
    );
  };
};

export const fetchRequests = () => {
  return dispatch => {
    dispatch(loading(true));

    AsyncStorage.getItem("jwt").then(token =>
      axios
        .get(
          `http://serverbrogrammers.herokuapp.com/api/investors/MyRequests/all`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": token
            }
          }
        )
        .then(res => {
          dispatch(setRequests(res.data.data));
          dispatch(loading(false));
        })
        .catch(error => {
          console.log(error);
        })
    );
  };
};
export const fetchProfile = (userId, token) => {
  return dispatch => {
    dispatch(loading(true));
    fetch(`http://192.168.0.110:3000/carRenter/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        dispatch(setUser(response.data));
        dispatch(loading(false));
      })
      .catch(error => {
        dispatch(error());
      });
  };
};

import * as types from "../actionConstants/action-types";
import { AsyncStorage ,Alert} from "react-native";
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
export const setCurrentTransactions = currentTransactions => {
  return {
    type: types.SET_CURRENT_TRANSACTIONS,
    currentTransactions: currentTransactions
  };
};
export const setPastTransactions = pastTransactions => {
  return {
    type: types.SET_PAST_TRANSACTIONS,
    pastTransactions: pastTransactions
  };
};
export const setUpcomingTransactions = upcomingTransactions => {
  return {
    type: types.SET_UPCOMING_TRANSACTIONS,
    upcomingTransactions: upcomingTransactions
  };
};

export const selectCar = selectedCar => {
  return {
    type: types.SELECT_CAR,
    selectedCar
  };
};
export const selectTransaction = selectedTransaction => {
  return {
    type: types.SELECT_TRANSACTION,
    selectedTransaction
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
export const setRentingDate = (rentingDateStart, rentingDateEnd) => {
  return {
    type: types.SET_RENTING_DATE,
    rentingDateStart,
    rentingDateEnd
  };
};
export const setRentingLocation = location => {
  return {
    type: types.SET_RENTING_LOCATION,
    location
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
export const closeRentModal = () => {
  return {
    type: types.CLOSE_RENT_MODAL
  };
};
export const openRentModal = () => {
  return {
    type: types.OPEN_RENT_MODAL
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
export const rent = carID => {
  return dispatch => {
    dispatch(loading(true));
    AsyncStorage.getItem("jwt").then(token =>
      fetch(
        `https://carrentalserver.herokuapp.com/carRenter/view/availableCars/${carID}/rent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        }
      )
        .then(res => res.json())
        .then(res => {
          dispatch(selectCar({ ...res.transaction, cars: [res.data] }));
          dispatch(loading(false));
        })
        .catch(error => {
          console.log(error);
        })
    );
  };
};
export const login = (mobileNumber, password) => {
  return dispatch => {
    dispatch(loading(true));
    try {
      AsyncStorage.getAllKeys()
        .then(AsyncStorage.multiRemove)
        .then(
          fetch("https://carrentalserver.herokuapp.com/carRenter/login", {
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
        fetch("https://carrentalserver.herokuapp.com/carRenter", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => {
          response.json().then(data => {
            if (!data.error) {
              //dispatch(setSignUp(data.token, data.id));
              //Mobile verification here
              Alert.alert(
                'Success!',
                'Your Account was Created succefully, Please check your Email to verify your account.',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
            }else{
              Alert.alert(
                'Sorry',
                'An account is already Registered with this number.',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
            }
            dispatch(loading(false));
          });
        })
      );
  };
};

export const fetchCars = search => {
  return dispatch => {
    dispatch(loading(true));
    AsyncStorage.getItem("jwt").then(token =>
      fetch("https://carrentalserver.herokuapp.com/carRenter/view/availableCars", {
        method: "POST",
        body: JSON.stringify({
          rentingDateStart: search.rentingDateStart,
          rentingDateEnd: search.rentingDateEnd,
          location: search.location
        }),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      })
        .then(res => res.json())
        .then(res => {
          dispatch(setCars(res.data));
          dispatch(loading(false));
        })
        .catch(error => {
          dispatch(setError(error));

          console.log(error);
        })
    );
  };
};
export const fetchPastTransactions = () => {
  return dispatch => {
    dispatch(loading(true));
    AsyncStorage.getItem("jwt").then(token =>
    fetch(`https://carrentalserver.herokuapp.com/carRenter/view/pastRentals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    })
      .then(response => response.json())
      .then(response => {
        dispatch(setPastTransactions(response.data));
        dispatch(loading(false));
      })
      .catch(error => {
        console.log(error)
        dispatch(setError(error));
      }));
  };
};
export const fetchUpcomingTransactions = () => {
  return dispatch => {
    dispatch(loading(true));
    AsyncStorage.getItem("jwt").then(token =>
    fetch(`https://carrentalserver.herokuapp.com/carRenter/view/upComingRentals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    })
      .then(response => response.json())
      .then(response => {
        dispatch(setUpcomingTransactions(response.data));
        dispatch(loading(false));
      })
      .catch(error => {
        dispatch(setError(error));
      }));
  };
};
export const fetchProfile = (userId, token) => {
  return dispatch => {
    dispatch(loading(true));
    fetch(`https://carrentalserver.herokuapp.com/carRenter/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    })
      .then(response => response.json())
      .then(response => {
        dispatch(setUser(response.data));
        dispatch(loading(false));
      })
      .catch(error => {
        dispatch(setError(error));
      });
  };
};

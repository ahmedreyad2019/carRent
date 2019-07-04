import * as actionTypes from "../actionConstants/action-types";
const initialState = {
  cars: [],
  allCompanies: [],
  search: {
    rentingDateStart: Date.now(),
    rentingDateEnd: Date.now(),
    location: "location"
  },
  selectedCar: "",
  companyModalVisible: false,
  filterModalVisible: false,
  rentModalVisible: false,
  searchModalVisible: false,
  dateModalVisible: false,
  order: "asc",
  source: "feed",
};
export default (carReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CARS:
      return {
        ...state,
        cars: action.cars
      };
    case actionTypes.SELECT_CAR:
      return {
        ...state,
        selectedCar: action.selectedCar
      };
    case actionTypes.SET_RENTING_DATE: {
      return {
        ...state,
        search: {
          ...state.search,
          rentingDateStart: action.rentingDateStart,
          rentingDateEnd: action.rentingDateEnd
        }
      };
    }
    case actionTypes.SET_RENTING_LOCATION: {
      return {
        ...state,
        search: {
          ...state.search,
          location: action.location
        }
      };
    }
    case actionTypes.SET_REQUESTS:
      return {
        ...state,
        companies: { ...state.companies, requested: action.requests }
      };
    case actionTypes.CLEAR:
      return {
        state
      };
    case actionTypes.RENT:
      return {
        state
      };
    case actionTypes.SET_ORDER:
      return {
        ...state,
        order: state.order === "asc" ? "desc" : "asc"
      };
    case actionTypes.SET_SOURCE:
      return {
        ...state,
        source: action.source
      };
    case actionTypes.OPEN_COMPANY_MODAL:
      return {
        ...state,
        companyModalVisible: true
      };
    case actionTypes.CLOSE_FILTER_MODAL:
      return {
        ...state,
        filterModalVisible: false
      };
    case actionTypes.OPEN_FILTER_MODAL:
      return {
        ...state,
        filterModalVisible: true
      };
    case actionTypes.CLOSE_RENT_MODAL:
      return {
        ...state,
        rentModalVisible: false
      };
    case actionTypes.OPEN_RENT_MODAL:
      return {
        ...state,
        rentModalVisible: true
      };
    case actionTypes.CLOSE_DATE_MODAL:
      return {
        ...state,
        dateModalVisible: false
      };
    case actionTypes.OPEN_DATE_MODAL:
      return {
        ...state,
        dateModalVisible: true
      };
    case actionTypes.CLOSE_SEARCH_MODAL:
      return {
        ...state,
        searchModalVisible: false
      };
    case actionTypes.OPEN_SEARCH_MODAL:
      return {
        ...state,
        searchModalVisible: true
      };
    default:
      return state;
  }
});

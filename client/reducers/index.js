import { combineReducers } from "redux";
import filterReducer from "./filterReducer";
import loginReducer from "./loginReducer";
import carReducer from "./carReducer";

const rootReducer = combineReducers({
  loginReducer,
  carReducer
});
export default rootReducer;

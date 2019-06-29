import { combineReducers } from "redux";
import filterReducer from "./filterReducer";
import loginReducer from "./loginReducer";
import companyReducer from "./companyReducer";

const rootReducer = combineReducers({
  loginReducer,
  companyReducer
});
export default rootReducer;

import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
const middleWare = applyMiddleware(thunk);
export const store = createStore(rootReducer, middleWare);

import { combineReducers } from "redux";
import { USER_ACTIONS } from "actions";
import user from "./user";

const rootReducer = combineReducers({
  user,
});

export default (state, action) => {
  if (action.type === USER_ACTIONS.USER_NOT_LOGGED_IN) {
    state = undefined;
  }
  return rootReducer(state, action);
};

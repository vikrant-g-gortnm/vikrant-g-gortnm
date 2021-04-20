import { USER_ACTIONS } from "./index";

export const setUserAttributes = payload => ({
  type: USER_ACTIONS.SET_USER_ATTRIBUTES,
  payload,
});

export const userLoggedIn = payload => ({
  type: USER_ACTIONS.USER_LOGGED_IN,
  payload,
});

export const userNotLoggedIn = () => ({
  type: USER_ACTIONS.USER_NOT_LOGGED_IN,
});

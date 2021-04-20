import { USER_ACTIONS } from "actions";

const initialState = {
  loggedIn: false,
  loading: true,
  attributes: [],
  cognitoUser: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case USER_ACTIONS.USER_LOGGED_IN:
      return {
        ...state,
        cognitoUser: action.payload,
        loggedIn: true,
        loading: false,
      };
    case USER_ACTIONS.SET_USER_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
      };
    case USER_ACTIONS.USER_NOT_LOGGED_IN:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

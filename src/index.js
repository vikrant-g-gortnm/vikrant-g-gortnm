import JssProvider from "react-jss/lib/JssProvider";
import { Auth, Hub, Logger } from "aws-amplify";
import { create } from "jss";
import { createGenerateClassName, jssPreset } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { Routes } from "./routes";
import { appsyncClient, initializeAwsConfig } from "./awsconfig";
import rootReducer from "./reducers/index";
import { setUserAttributes, userLoggedIn, userNotLoggedIn } from "actions/user";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "core-js/stable";
import "./styles/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./styles/fonts/fontawesome-pro-5.13.0-web/css/all.min.css";
import "./styles/style.scss";
import { createMuiTheme } from "@material-ui/core";

initializeAwsConfig();
console.log(
  ` %c STAGE: ${process.env.REACT_APP_STAGE} `,
  "background: #C80000; color: white;"
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {};

if (localStorage) {
  const user = localStorage.getItem("user");
  if (user) {
    if (!user.attributes) {
      localStorage.clear();
    } else {
      initialState.user = JSON.parse(user);
    }
  }
}

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

export const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff6969",
    },
    secondary: {
      main: "#af5959",
    },
  },
});

Auth.currentAuthenticatedUser()
  .then(user => {
    store.dispatch(userLoggedIn(user));
    Auth.userAttributes(user).then(data => {
      store.dispatch(setUserAttributes(data));
    });
  })
  .catch(e => {
    store.dispatch(userNotLoggedIn(e));
  });

const syncAttributes = new Logger("Sync_attributes");

syncAttributes.onHubCapsule = capsule => {
  const payload = capsule.payload;
  switch (payload.event) {
    case "signIn":
      Auth.userAttributes(payload.data).then(data => {
        store.dispatch(setUserAttributes(data));
      });
      break;
    default:
  }
  console.log(capsule);
};

Hub.listen("auth", syncAttributes);

const render = () => {
  ReactDOM.render(
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <Provider store={store}>
        <ApolloProvider client={appsyncClient}>
          <Routes />
        </ApolloProvider>
      </Provider>
    </JssProvider>,
    document.getElementById("root")
  );
};

render();

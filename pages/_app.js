import "../styles/globals.css";
import React, { useReducer } from "react";
import AppContext from "../state/AppContext";
import reducer, { initialState } from "../state/reducer";

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;

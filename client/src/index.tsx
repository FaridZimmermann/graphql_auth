import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import client from "./apollo/client";
import { store } from "./redux/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}> 
      <ApolloProvider client={client}> 
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
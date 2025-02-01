import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import client from "./graphql/client.ts";
import { store } from "./redux/store.ts";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}> 
      <ApolloProvider client={client}> 
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import ChatProvider from "./context/ChatProvider";

ReactDOM.render(
  <BrowserRouter>
    <ChatProvider>
      <MantineProvider>
        <NotificationsProvider position="bottom-right">
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </ChatProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

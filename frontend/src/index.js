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
    <MantineProvider>
      <NotificationsProvider position="bottom-right">
        <ChatProvider>
          <App />
        </ChatProvider>
      </NotificationsProvider>
    </MantineProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

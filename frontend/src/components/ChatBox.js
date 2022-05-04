import { Box, MediaQuery } from "@mantine/core";
import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <>
      <MediaQuery
        smallerThan="sm"
        styles={{ display: selectedChat ? "flex" : "none", width: "100%" }}
      >
        <MediaQuery largerThan="sm" styles={{ display: "flex", width: "71%" }}>
          <Box
            style={{
              backgroundColor: "white",
              boxShadow: "2px 5px 5px 5px rgb(104, 146, 214)",
              borderRadius: "5px",
              borderWidth: "1px",
            }}
            m={2}
          >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        </MediaQuery>
      </MediaQuery>
    </>
  );
};

export default ChatBox;

import { Avatar, Box, Container, ScrollArea, Tooltip } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { isLastMessage, isSameSender } from "../config/chatLogic";
import { ChatState } from "../context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChats = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              justifyContent: `${m.sender._id === user._id ? "right" : "left"}`,
              alignItems: "center",
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} withArrow>
                <Avatar
                  src={m.sender.pic}
                  alt={m.sender._id}
                  radius={100}
                  ml={10}
                  size="md"
                />
              </Tooltip>
            )}
            <div
              style={{
                backgroundColor: `${
                  m.sender._id !== user._id ? "white" : "rgb(0,116,204)"
                }`,
                color: `${m.sender._id === user._id ? "white" : "black"}`,
                borderRadius: "20px",
                padding: "7px 15px",
                height: "fit-content",
                wordWrap: "break-word",
                fontFamily: "Arial",
                maxWidth: "70%",
                margin: `${
                  !isLastMessage(messages, i, user._id) &&
                  !isSameSender(messages, m, i, user._id)
                    ? "7px 3rem"
                    : "7px 10px"
                }`,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;

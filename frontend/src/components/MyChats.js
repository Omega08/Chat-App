import {
  Box,
  Button,
  Group,
  MediaQuery,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import ChatLoading from "./miscellaneous/ChatLoading";
import { getSender } from "../config/chatLogic";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, setChats, chats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      setChats(data);
      console.log(chats);
      console.log("here");
    } catch (error) {
      showNotification({
        title: "Error!",
        message: "Could not load the chats",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <MediaQuery
      smallerThan="sm"
      styles={{ display: selectedChat ? "none" : "flex", width: "100%" }}
    >
      <MediaQuery largerThan="sm" styles={{ display: "flex", width: "31%" }}>
        <Box
          style={{
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "lg",
            borderWidth: "1px",
          }}
          p={5}
        >
          <Box
            px={3}
            pb={3}
            style={{
              fontSize: "1.3rem",
              fontFamily: "sans-serif",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            My Chats
            <Button
              variant="subtle"
              radius={100}
              rightIcon={<AiOutlineUsergroupAdd size={24} />}
            >
              New Group
            </Button>
          </Box>
          <Box
            style={{
              flexDirection: "column",
              width: "100%",
              height: "100%",
              overflowY: "hidden",
              borderRadius: "lg",
            }}
            p={5}
          >
            {chats ? (
              <Stack
                style={{
                  overflowY: "scroll",
                }}
              >
                {chats.map((chat) => {
                  <Box
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedChat === chat ? "grey" : "white",
                      color: selectedChat === chat ? "black" : "white",
                      borderRadius: "lg",
                    }}
                    px={5}
                    py={5}
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>;
                })}
              </Stack>
            ) : (
              <ChatLoading />
            )}
          </Box>
        </Box>
      </MediaQuery>
    </MediaQuery>
  );
};

export default MyChats;

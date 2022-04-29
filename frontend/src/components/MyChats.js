import {
  Avatar,
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
      <MediaQuery largerThan="sm" styles={{ display: "flex", width: "29%" }}>
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
                  overflowY: "auto",
                  height: "100%",
                }}
                m={10}
              >
                {chats.map((chat) => (
                  <Group
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedChat === chat ? "rgb(54, 120, 219)" : "white",
                      color: selectedChat === chat ? "white" : "blue",
                      borderRadius: "20px",
                      height: "60px",
                      width: "90%",
                      margin: " 5px auto",
                      alignContent: "center",
                    }}
                    px={10}
                    py={2}
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <Avatar
                      src={chat.users[1].pic}
                      my={2}
                      radius="100%"
                      alt={user.name}
                      size="3rem"
                      style={{ border: "2px solid white" }}
                    />
                    <Text
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "400",
                      }}
                    >
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Group>
                ))}
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

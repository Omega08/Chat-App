import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Loader,
  MediaQuery,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { MdArrowBack } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { getSender, getSenderFull } from "../config/chatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupModal from "./miscellaneous/UpdateGroupModal";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";
import Lottie from "lottie-react";
import Typing from "../animation/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      showNotification({
        title: "Could Not Load the Messages! :(",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  console.log(notification);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        showNotification({
          title: "Could Not Send the Message!",
          autoClose: 5000,
          color: "red",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <Box
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Group
            style={{
              width: "100%",
              minHeight: "3rem",
              justifyContent: "space-between",
            }}
            px={10}
            pt={10}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Button variant="subtle">
                <MdArrowBack
                  size="1.5rem"
                  onClick={() => setSelectedChat("")}
                />
              </Button>
            </MediaQuery>
            {!selectedChat.isGroupChat ? (
              <Group spacing={30}>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                <Text style={{ fontSize: "1.5rem", color: "blue" }}>
                  {getSender(user, selectedChat.users)}
                </Text>
              </Group>
            ) : (
              <Text
                color={"blue"}
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
                mx={10}
              >
                {selectedChat.chatName.toString().toUpperCase()}
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </Text>
            )}
          </Group>
          <Box
            style={{
              overflow: "hidden",
              backgroundColor: "rgb(222, 227, 232)",
              padding: "0.5rem",
              overflow: "hidden",
              margin: "8px 10px",
              display: "flex",
              flexDirection: "column",
              flex: 10,
              borderRadius: "10px",
            }}
          >
            {loading ? (
              <Loader
                color="grape"
                size={55}
                style={{
                  alignSelf: "center",
                  margin: "auto",
                }}
              />
            ) : (
              <Box
                style={{
                  display: "flex",
                  width: "100%",
                  overflowX: "hidden",
                  flexDirection: "column",
                  flex: 1000,
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChats messages={messages} />
              </Box>
            )}
            {isTyping ? (
              <div
                style={{
                  height: "50px",
                  width: "100px",
                }}
              >
                <Lottie
                  animationData={Typing}
                  loop={true}
                  autoPlay={true}
                ></Lottie>
              </div>
            ) : (
              <></>
            )}
            <Box
              style={{
                alignSelf: "end",
                width: "100%",
                padding: 0,
              }}
            >
              <TextInput
                placeholder="Enter a message here!"
                size="md"
                onKeyDown={sendMessage}
                onChange={typingHandler}
                value={newMessage}
                style={{
                  width: "100%",
                }}
                rightSection={
                  <ActionIcon onClick={sendMessage}>
                    <IoSend size={25} />
                  </ActionIcon>
                }
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: "25px" }}>
            Click on a User to Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

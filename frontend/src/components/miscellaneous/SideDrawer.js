import {
  Avatar,
  Box,
  Button,
  Drawer,
  Group,
  MediaQuery,
  Menu,
  MenuLabel,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import React from "react";
import { FaSearch, FaRegBell, FaChevronDown } from "react-icons/fa";
import { CgMenuRightAlt } from "react-icons/cg";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = async () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const form = useForm({
    initialValues: {
      search: "",
    },

    validate: {
      search: (value) =>
        value !== "" ? null : "Can't Search with an Empty Field!",
    },
  });

  const handleSearch = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${form.getInputProps("search").value}`,
        config
      );
      setLoading(false);
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      console.log("error");
      setLoading(false);
      showNotification({
        title: "Something went wrong!!",
        message: "Error",
        autoClose: 5000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      setOpened(false);
    } catch (error) {
      setLoadingChat(false);
      showNotification({
        title: "Error!!",
        message: "Error fetching the chats!",
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          width: "calc(100%-10px)",
          borderWidth: "4px",
        }}
        px={5}
        py={10}
      >
        <Tooltip
          label="Search Users!"
          position="bottom"
          placement="center"
          transition="slide-down"
          withArrow
        >
          <Button
            variant="subtle"
            color="indigo"
            onClick={() => setOpened(true)}
          >
            <FaSearch />
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <MediaQuery largerThan="sm" styles={{ display: "flex" }}>
                <Text px={16} my={20}>
                  Search User
                </Text>
              </MediaQuery>
            </MediaQuery>
          </Button>
        </Tooltip>
        <Text
          align="center"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          weight={700}
          style={{ fontFamily: "Greycliff CF, sans-serif", fontSize: "1.4rem" }}
        >
          Chat Application
        </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Menu
            shadow="xl"
            control={
              <Button variant="subtle">
                <FaRegBell color="blue" size="1.5rem" />
              </Button>
            }
          >
            <MenuLabel>Notifications</MenuLabel>
          </Menu>
          <ProfileModal user={user} self={true}></ProfileModal>
          <Menu
            shadow="xl"
            control={
              <Button variant="subtle">
                <CgMenuRightAlt color="blue" size="1.5rem" />
              </Button>
            }
          >
            <MenuLabel>Settings</MenuLabel>
            <Menu.Item onClick={logoutHandler}>Log Out</Menu.Item>
          </Menu>
        </div>
      </Box>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Search Users"
        padding="xl"
        size="lg"
      >
        <Group my={15}>
          <TextInput
            style={{ flexGrow: "4" }}
            placeholder="Search by name or username"
            size="md"
            value={form.getInputProps("search").value}
            {...form.getInputProps("search")}
          ></TextInput>
          <Button
            variant="filled"
            onClick={() => {
              let n = form.validate();
              if (n.hasErrors) return;
              handleSearch();
            }}
          >
            <FaSearch size={17} />
          </Button>
        </Group>
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
      </Drawer>
    </>
  );
};

export default SideDrawer;

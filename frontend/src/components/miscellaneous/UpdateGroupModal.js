import {
  ActionIcon,
  Button,
  Center,
  Group,
  Input,
  Loader,
  Modal,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../userAvatar/UserBadge";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [opened, setOpened] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  //   const handleAddUser = () => {};
  //   const handleRemove = () => {};
  //   const handleRename = () => {};
  //   const handleSearch = () => {};

  const handleAddUser = async (_user) => {
    if (selectedChat.users.find((u) => u._id === _user._id)) {
      showNotification({
        title: "User Already Added!",
        color: "purple",
        autoClose: 5000,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      showNotification({
        title: "Only Admin can add Members!",
        color: "red",
        autoClose: 5000,
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: _user._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error Occurred!!",
        message: "Could not add the User",
        autoClose: 5000,
        color: "red",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showNotification({
        title: "Only Admin can remove Users",
        color: "red",
        autoClose: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Could remove the User!",
        color: "red",
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setSearch(query);
    if (!query || query === "") return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      showNotification({
        title: "Error!",
        message: "Failed to load the search results!",
        autoClose: 5000,
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      console.log(user.token);
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      showNotification({
        title: "Error Occurred",
        message: "Could Not Update The Group",
        color: "red",
        autoClose: 5000,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <Button variant="subtle" compact onClick={() => setOpened(true)}>
        <MdModeEditOutline size={23} />
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered={true}
        title={
          <Title order={3} color="blue">
            {selectedChat.chatName}
          </Title>
        }
        overlayOpacity={0.4}
      >
        <Stack>
          <Group>
            {selectedChat.users.map((u) => (
              <UserBadge
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Group>
          <Group align={"flex-end"}>
            <TextInput
              label="Group Name"
              //   value={selectedChat.chatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="subtle"
              loading={renameLoading}
              onClick={() => handleRename()}
            >
              Rename
            </Button>
          </Group>
          <TextInput
            label="Add Users"
            placeholder="Add Users to Group"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            searchResult
              .slice(0, 4)
              .map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
          )}
        </Stack>
        <Center mt={20}>
          <Button
            style={{
              borderRadius: "10px",
            }}
            onClick={() => {
              handleRemove(user);
            }}
            loading={loading}
            color="red"
          >
            Leave Group
          </Button>
        </Center>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;

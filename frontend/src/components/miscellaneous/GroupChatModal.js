import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import UserListItem from "../userAvatar/UserListItem";
import UserBadge from "../userAvatar/UserBadge";

const GroupChatModal = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      showNotification({
        title: "Please fill all fields!",
        message: "Group Chat Name and Members required!",
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpened(false);
      showNotification({
        title: "New Group Created Successfully!",
        color: "green",
        autoClose: 5000,
      });
    } catch (error) {
      showNotification({
        title: "Failed to create the group!",
        message: error.message,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      showNotification({
        title: "User already Added!",
        color: "orange",
        autoClose: 5000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={3}>Create Group</Title>}
      >
        <Stack spacing={20} my={10}>
          <TextInput
            label="Group Name"
            placeholder="Enter Group Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <TextInput
            label="Search Users"
            placeholder="Search for Users"
            onChange={(e) => handleSearch(e.target.value)}
            rightSection={<FaRegUser />}
          />
          <Group>
            {selectedUsers.map((u) => (
              <UserBadge
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Group>
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
                  handleFunction={() => handleGroup(u)}
                />
              ))
          )}
        </Stack>
        <Center>
          <Button
            style={{
              borderRadius: "10px",
            }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Center>
      </Modal>

      <span onClick={() => setOpened(true)}>{children}</span>
    </>
  );
};

export default GroupChatModal;

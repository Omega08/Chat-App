import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Group
        m={10}
        ml={1}
        p={10}
        onClick={handleFunction}
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "25px",
        }}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[2],
          "&:hover": {
            backgroundColor: theme.colors.blue[4],
            cursor: "pointer",
            color: "white",
          },
        })}
      >
        <Avatar
          src={user.pic}
          radius="100%"
          alt={user.name}
          size={50}
          style={{ flex: 1 }}
        />
        <Stack spacing={0} style={{ flex: 5 }}>
          <Text p={0}>{user.name}</Text>
          <Text style={{ fontWeight: "500" }} my={0} p={0}>
            {user.email}
          </Text>
        </Stack>
      </Group>
    </>
  );
};

export default UserListItem;

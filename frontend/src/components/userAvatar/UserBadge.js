import { ActionIcon, Avatar, Badge } from "@mantine/core";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const UserBadge = ({ user, handleFunction }) => {
  const avatar = (
    <Avatar
      alt="Avatar for badge"
      size={24}
      mr={5}
      radius={100}
      src={user.pic}
    />
  );

  const removeButton = (
    <ActionIcon
      size="xs"
      color="blue"
      radius="xl"
      variant="transparent"
      onClick={handleFunction}
    >
      <AiOutlineClose size={10} />
    </ActionIcon>
  );

  return (
    <Badge
      sx={{ paddingLeft: 0 }}
      size="lg"
      radius="xl"
      color="blue"
      style={{
        width: "fit-content",
      }}
      leftSection={avatar}
      rightSection={removeButton}
    >
      {user.name}
    </Badge>
  );
};

export default UserBadge;

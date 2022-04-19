import { Group, Skeleton, Stack } from "@mantine/core";
import React from "react";

const ChatLoading = () => {
  return (
    <>
      <Stack mt={0}>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
        <Group style={{ display: "flex", flexDirection: "row" }} p={10}>
          <Skeleton height={50} circle style={{ flex: 1 }} />
          <Skeleton height={50} radius="xl" style={{ flex: 4.5 }} />
        </Group>
      </Stack>
    </>
  );
};

export default ChatLoading;

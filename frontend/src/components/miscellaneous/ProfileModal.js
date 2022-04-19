import { Avatar, Button, Center, Modal, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";

const ProfileModal = ({ user, self }) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        overlayColor="lightblue"
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "linear-gradient(#3a7bd5, white)",
            }}
          >
            <Center>
              <Avatar
                src={user.pic}
                my={20}
                radius="100%"
                alt={user.name}
                size="10rem"
                style={{ border: "5px solid white" }}
              />
            </Center>
          </div>
        </div>
        <Center>
          <Title style={{ fontFamily: "Garamond" }}>{user.name}</Title>
        </Center>
        <Center>
          <Text>{user.email}</Text>
        </Center>
        <Center>
          <Button variant="filled" onClick={() => setOpened(false)} m={10}>
            Close
          </Button>
        </Center>
      </Modal>
      <Button variant="subtle" onClick={() => setOpened(true)}>
        {self ? (
          <Avatar alt={user.name} src={user.pic} radius="xl" size="1.8rem" />
        ) : (
          <CgProfile />
        )}
      </Button>
    </>
  );
};

export default ProfileModal;

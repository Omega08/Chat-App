import React, { useEffect } from "react";
import { Container, Tabs, Title, Text } from "@mantine/core";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "Center",
        minWidth: "50%",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "1rem 0",
          padding: "0.8rem",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "6px",
        }}
      >
        <Title order={2}>
          <Text
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: "purple", to: "indigo", deg: 45 }}
            weight={700}
            style={{ fontFamily: "Greycliff CF, sans-serif", fontSize: "2rem" }}
          >
            Chat Application
          </Text>
        </Title>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: "5px",

          width: "100%",
          borderWidth: "1px",
        }}
      >
        <Tabs color="violet" tabPadding="sm" grow>
          <Tabs.Tab label="Login">
            <Login />
          </Tabs.Tab>
          <Tabs.Tab label="Sign Up">
            <Signup />
          </Tabs.Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default HomePage;

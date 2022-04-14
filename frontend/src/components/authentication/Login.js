import { PasswordInput, Stack, TextInput, Button } from "@mantine/core";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (value !== "" ? null : "Please Enter Username"),
      password: (value) => (value !== "" ? null : "Please Enter Password"),
    },
  });

  const SubmitHandler = async () => {
    setLoading(true);
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          username: form.getInputProps("username").value,
          password: form.getInputProps("password").value,
        },
        config
      );
      console.log(JSON.stringify(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      showNotification({
        title: "Something went wrong!!",
        message: error.reponse.data.message,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <Stack spacing="xl" mx={20}>
        <TextInput
          required
          label="Username"
          placeholder="Username"
          value={form.getInputProps("username").value}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          required
          label="Password"
          placeholder="Your Password"
          value={form.getInputProps("password").value}
          {...form.getInputProps("password")}
          // visibilityToggleIcon={({ reveal, size }) =>
          //   reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
          // }
        />
        <Button
          type="submit"
          variant="filled"
          color="indigo"
          my={20}
          style={{ borderRadius: "1000px" }}
          onClick={() => {
            let n = form.validate();
            console.log(n);
            if (n.hasErrors) return;
            SubmitHandler();
          }}
          loading={loading}
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default Login;

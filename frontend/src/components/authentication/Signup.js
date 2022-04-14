import {
  PasswordInput,
  Stack,
  TextInput,
  Stepper,
  Button,
  Group,
  Center,
  Input,
  InputWrapper,
} from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [active, setActive] = useState(0);
  const [nextText, setNextText] = useState("Next");
  const [picError, setPicError] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const nextStep = () => {
    if (active === 0) setNextText("Submit");
    if (active === 1) setNextText("Done");
    setActive((current) => (current < 2 ? current + 1 : current));
  };
  const prevStep = () => {
    if (active === 1) setNextText("Next");
    if (active === 2) setNextText("Submit");
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      username: "",
      cpassword: "",
    },

    validate: {
      name: (value) => {
        if (active > 0) return null;
        if (value !== "") {
          return null;
        } else return "Please Enter Your Name";
      },
      email: (value) => {
        if (active > 0) return null;
        if (/^\S+@\S+$/.test(value)) {
          return null;
        } else return "Invalid email";
      },
      password: (value) => {
        if (active !== 1) return null;
        if (value === "") return "Please Enter Password";
        else {
          return null;
        }
      },
      cpassword: (value) => {
        if (active !== 1) return null;
        if (form.getInputProps("password").value === "")
          return "Please Enter Password Above First";
        if (value !== form.getInputProps("password").value)
          return "Passwords Do Not Match";
        return null;
      },
      username: (value) => {
        if (active !== 1) return null;
        if (value !== "") {
          return null;
        } else return "Please Enter Username";
      },
    },
  });

  const postPic = (value) => {
    setLoading(true);
    if (value.type === "image/jpeg" || value.type === "image/png") {
      const data = new FormData();
      data.append("file", value);
      data.append("upload_preset", "chat-application");
      data.append("cloud_name", "due6e520h");
      fetch("https://api.cloudinary.com/v1_1/due6e520h/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url);
          console.log(data.url);
          setPicError("");
          setLoading(false);
        })
        .catch((err) => {
          setPicError("Could not upload the pic");
          setLoading(false);
        });
    } else {
      setPicError("Incorrect File Type!");
      setLoading(false);
    }
  };

  const SubmitHandler = async () => {
    setLoading(true);
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name: form.getInputProps("name").value,
          email: form.getInputProps("email").value,
          username: form.getInputProps("username").value,
          password: form.getInputProps("password").value,
          pic: pic,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
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
    <>
      <form>
        <Stepper
          active={active}
          onStepClick={setActive}
          contentPadding={12}
          breakpoint="md"
          iconSize={42}
          style={{ marginTop: "3%" }}
          mx={5}
        >
          <Stepper.Step
            mx={50}
            label="First step"
            allowStepSelect={false}
            description="Create an account"
          >
            <Stack spacing="md" mx={20}>
              <TextInput
                required
                label="Name"
                placeholder="Your Name"
                value={form.getInputProps("name").value}
                {...form.getInputProps("name")}
              />
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                value={form.getInputProps("email").value}
                {...form.getInputProps("email")}
              />
            </Stack>
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            allowStepSelect={false}
            mx={50}
            description="Login Details"
          >
            <Stack spacing="md">
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
              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm Password"
                value={form.getInputProps("cpassword").value}
                {...form.getInputProps("cpassword")}
              />
              <Stack>
                <InputWrapper
                  label="Enter Your Profile Pic: (JPG, PNG)"
                  error={picError}
                >
                  <Input
                    type="file"
                    onChange={(e) => postPic(e.target.files[0])}
                  ></Input>
                </InputWrapper>
              </Stack>
            </Stack>
          </Stepper.Step>
          <Stepper.Completed>
            <Center>Congrats!! You Have Made Your Account Successfully</Center>
          </Stepper.Completed>
        </Stepper>
        <Group position="center" my="lg">
          <Button
            variant="filled"
            onClick={prevStep}
            style={{ borderRadius: "1000px" }}
          >
            Back
          </Button>
          <Button
            variant="filled"
            style={{ borderRadius: "1000px" }}
            onClick={() => {
              let n = form.validate();
              if (n.hasErrors) return;
              if (pic === undefined && active === 1) {
                setPicError("Please Select an Image !!!");
                return;
              }
              if (picError !== "" && active === 1) return;
              if (nextText === "Submit") SubmitHandler();
              if (nextText === "Done") history.push("/chats");
              nextStep();
            }}
            loading={loading}
          >
            {nextText}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default Signup;

import { Box } from "@mantine/core";
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: "0", padding: "0" }}>
      {user && <SideDrawer />}
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "calc(92.7% - 20px)",
        })}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;

import { Box } from "@mantine/core";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100vw", height: "100vh", margin: "0", padding: "0" }}>
      {user && <SideDrawer />}
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        })}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;

import "./App.css";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" component={HomePage} exact />
        <Route path="/chats" component={ChatPage} />
      </BrowserRouter>
    </div>
  );
}

export default App;

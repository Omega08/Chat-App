const express = require("express");
const { chats } = require("./data/data.js");
const app= express();

app.get("/", function(req,res){
    res.send("api is running");
});


app.get("/api/chat", (req,res) => {
res.send(chats);

});

app.get("/api/chat/:id",(req,res)=>{
   // console.log(req.params.id);
const single_chat= chats.find((c)=> c._id===req.params.id);
res.send(single_chat);
});


app.listen(5000,console.log("server started on port 5000"));
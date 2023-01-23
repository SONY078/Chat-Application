const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname,'/public')));

app.get('/',function(req,res)
{
    res.sendFile(__dirname + '/public/index.html');
})
const server = app.listen(8080,function()
{
    console.log("server connected");
})

const io = socket(server, {cors:{origin:'*'}});
const userA = [];
let name;
io.on("connection",(socket)=>
{
        console.log("Socket is connected : ",socket.id);
        socket.on('joining-chat',(usrname)=>{
            console.log(usrname);
            name = usrname;
            // console.log(name);
            const user = {
                id : socket.id,
                name : name 
            };
            
            userA.push(user);
            console.log('all user joined',userA);
            io.emit("chat-message",`----- ${user.name} has joined the chat -----`);
           
        })
        
       
        
        socket.on("disconnect",()=>
        {
            console.log("user disconnected");
            const removeUser = userA.filter((user) => socket.id === user.id);
            console.log("user has been left the conversation",removeUser);
            const removedValue = removeUser.map((val)=>{
                return val.name;
            })
            io.emit('chat-message',`----- ${removedValue} left the chat -----`);

        })
        socket.on("chat-message",(message)=>
        {
            socket.broadcast.emit('chat-message',message);
        })
})

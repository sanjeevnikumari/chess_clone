// const express=require('express')
// const socket=require('socket.io')
// const http=require('http')
// const{Chess}=require('chess.js');
// const path = require('path');
// const { log } = require('console');

// const app=express();
// const server=http.createServer(app);
// const io=socket(server)

// const chess=new Chess();
// let players={}
// let currentpalyers="W"

// app.set('view engine','ejs');
// app.use(express.static(path.join(__dirname,"public")))

// app.get("/",(req,res)=>{
//     res.render("index",{title:"Chess Game"})
// })
// io.on("connection",function(uniquesocket){
//      console.log("conected")
//     if(!players.white){
//         players.white=uniquesocket.id;
//         uniquesocket.emit("playeRole","w")
//     }
//     else if(!players.black){
//         players.black=uniquesocket.id;
//         uniquesocket.emit("playeRole","b")
//     }else{
//         uniquesocket.emit("spectator role")
//     }

//     uniquesocket.on("disconnect",function(){
//         if(uniquesocket.id==players.white){
//             delete players.white;
//         }
//         else if(uniquesocket.id==players.black){
//             delete players.black
//         }
//     })

//     uniquesocket.on("move",(move)=>{
//         try{
//             if(chess.turn()=="w" && uniquesocket.id!==players.white) return;
//             if(chess.turn()=="b" && uniquesocket.id!==players.black) return;

//             const result=chess.move(move);
//             if(result){
//                 currentpalyers=chess.turn();
//                 io.emit("move",move)
//                 io.emit("boardState",chess.fen())
//             }else{
//                 console.log("invalid move",move)
//                 uniquesocket.emit("invalid move",move)
//             }
//         }
//         catch(err){
//             console.log(err)
//             uniquesocket.emit("invalid move",move)
//         }
//     })
// })

// server.listen(3000,function(){
//     console.log("listening")
// });
////////////////////////////////////
const express=require('express');
const socket=require('socket.io');
const http=require('http');
const {Chess} =require('chess.js');
const path=require('path');
const { log } = require('console');

const port=process.env.PORT || 3000;
const app=express();
const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();
let players={};
let currentPlayer="w";

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index",{title:"Chess Game"});
})

io.on("connection", function(uniquesocket){
    console.log("connected");
    if(!players.white){
        players.white=uniquesocket.id;
        uniquesocket.emit("playerRole","w");
    }else if(!players.black){
        players.black=uniquesocket.id;
        uniquesocket.emit("playerRole","b");
    }else{
        uniquesocket.emit("spectatorRole")
    }
    uniquesocket.on("disconnect",function(){
        if(uniquesocket.id===players.white){
            delete players.white;
        }else if(uniquesocket.id===players.black){
            delete players.black;
        }
    })
    uniquesocket.on("move",function(move){
        try{
            if(chess.turn==="w" && uniquesocket.id!==players.white) return;
            if(chess.turn==="b" && uniquesocket.id!==players.black) return;

            const result=chess.move(move);
            if(result){
                currentPlayer=chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen()) //location of pieces
            }else{
                console.log("Invalid move :", move);
                uniquesocket.emit("invalid Move",move)
                }
        }
        catch (err){ 
            console.log(err);
            uniquesocket.emit("invalid Move",move)
        }
    })

   
})

server.listen(port,function(){
    console.log("listening ");
    
})
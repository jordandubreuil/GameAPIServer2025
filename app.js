const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const { nanoid } = require("nanoid");
const Player = require("./models/Player");

const app = express();
app.use(express.json());
app.use(cors()); //Allows us to make requiests from our game.
app.use(bodyParser.json());

const FILE_PATH = "player.json";

//Connection for MongoDB
mongoose.connect("mongodb+srv://jordan:pass1234@cluster0.ezrcu.mongodb.net/GamesDB?retryWrites=true&w=majority&appName=Cluster0");//"mongodb://localhost:27017/gamedb");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});


//API endpoint for player.json;

// app.get("/player", (req,res)=>{
//     fs.readFile(FILE_PATH, "utf-8",(err, data)=>{
//         if(err){
//             return res.status(500).json({error:"Unable to fetch data"});
//         }
//         res.json(JSON.parse(data));
//         console.log(`Responded with: ${data}`);
//     })
// });

app.get("/player", async (req,res)=>{
    try{
        const players = await Player.find();
        if(!players){
            return res.status(404).json({error:"Players not found"});
        }

        res.json(players);
        console.log(players);
    }
    catch(error){
        res.status(500).json({error:"Failed to retrieve players"})
    }
});

app.get("/player/:playerid", async(req,res)=>{
    try{

        const player = await Player.findOne({playerid:req.params.playerid});

        if(!player){
            return res.status(404).json({error:"Player not found"})
        }
        res.json(player);

    }
    catch(error)
    {
        res.status(500).json({error:"Failed to retrieve player"})
    }
});

app.post("/sentdata", (req,res)=>{
    const newPlayerData = req.body;

    console.log(JSON.stringify(newPlayerData,null,2));

    res.json({message:"Player Data recieved"});
});

app.post("/sentdatatodb", async (req,res)=>{
    try{
        const newPlayerData = req.body;

        console.log(JSON.stringify(newPlayerData,null,2));

        const newPlayer = new Player({
            playerid:nanoid(8),
            name:newPlayerData.name,
            level:newPlayerData.level,
            score:newPlayerData.score

        });
        //save to database
        await newPlayer.save();
        res.json({message:"Player Added Successfully",playerid:newPlayer.playerid, name:newPlayer.name});
    }
    catch(error){
        res.status(500).json({error:"Failed to add player"})
    }
    
    
});

//Update Player
app.post("/updatePlayer", async(req,res)=>{
    const playerData = req.body;

    const player = await Player.findOne({name:playerData.name});

    if(!player){
        return res.status(404).json({message:"Player not found"});
    }

    player.score = playerData.score;
    player.level = playerData.level;

    await player.save();

    res.json({message:"Player updated", player});
});


app.listen(3000, ()=>{
    console.log("Running on port 3000");
})
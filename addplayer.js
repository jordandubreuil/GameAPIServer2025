const mongoose = require("mongoose");
const Player = require("./models/Player");
const { nanoid } = require("nanoid");

mongoose.connect("mongodb+srv://jordan:pass1234@cluster0.ezrcu.mongodb.net/GamesDB?retryWrites=true&w=majority&appName=Cluster0");

async function addPlayer(){
    await Player.create({
        playerid:nanoid(8),
        name:"Jay",
        level:20,
        score:3001000
    });

    console.log("Player Added");
    mongoose.connection.close();
}

addPlayer();

const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    playerid:{ type: String, unique:true},
    name:String,
    level:Number,
    score:Number
})

const Player = mongoose.model("Player", playerSchema);

module.exports = Player
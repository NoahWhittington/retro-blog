const mongoose = require("mongoose"), 
comments       = require("./comments")

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ] 
});

module.exports = mongoose.model("BlogPost", blogSchema);
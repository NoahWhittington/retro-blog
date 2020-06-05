const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    name: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("comment", commentSchema);
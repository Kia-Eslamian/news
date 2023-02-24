// Required packages
const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;


// comment Schema
const commentSchema = new Schema({
    article: {type: Schema.Types.ObjectId, ref: 'article', required: true},
    message: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, default: null},
    status: {type: String, default: "PENDING", enum: ["PENDING", "CONFIRMED", "TRASHED"]},

}, {timestamps: true});


// Model creation
const commentModel = mongoose.model("comment", commentSchema, "comments");


// Export model
module.exports = commentModel;
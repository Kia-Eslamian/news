// Required packages
const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

// article Schema
const articleSchema = new Schema({
    title: { type: String, required: true, text: true },
    page_title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    image: { type: String, default: null },
    // poster: {type: String, default: null},
    author: { type: Schema.Types.ObjectId, ref: 'admin', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'articleCategory', default: null },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], default: [], ref: 'comment' },
    isPublished: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },


}, { timestamps: true });

articleSchema.index({ title: "text" })


// Model creation
const articleModel = mongoose.model("articles", articleSchema, "articles");

// Export model
module.exports = articleModel;
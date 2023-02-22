// Required packages
const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

// article Schema
const categorySchema = new Schema({
    title: {type: String, required: true, text: true},
    admin: {type:Schema.Types.ObjectId ,  ref:'admin' , required:true},

}, {timestamps: true});

categorySchema.index({title: "text"});

// Model creation
const categoryModel = mongoose.model("articleCategory", categorySchema, "articleCategories");


// Export model
module.exports = categoryModel;
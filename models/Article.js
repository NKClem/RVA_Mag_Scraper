const mongoose = require("mongoose");
const Note = require("./Note");

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
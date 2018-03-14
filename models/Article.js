const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Article = mongoose.model("article", ArticleSchema);

module.exports = Article;
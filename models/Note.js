const mongoose = require("mongoose");
const Article = require("./Article");

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
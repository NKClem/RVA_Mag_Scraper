require("dotenv").config();

//dependencies
const express = require("express");
const request = require("request");
const logger = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const PORT = process.env.DB_PORT;

const app = express();

const router = require("./controllers/controllers.js");

//morgan logs requests
app.use(logger("dev"));

//body-parser handles form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//server public folder as a static directory
app.use(express.static("public"));

//express-handlebars serves views
const hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: "views/partials/"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//connect to Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/rvaScrape");

const connect = mongoose.connection;

connect.on("error", function(err) {
    console.log(`Connection Error: ${err}`);
});

connect.once("open", function() {
    console.log("You are connected!");
});

const db = require("./models");

db.Article.remove({}, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Collection removed.");
    }
});

app.use("/", router);

app.listen(PORT, function() {
    console.log(`App running on port: ${PORT}!`);
});
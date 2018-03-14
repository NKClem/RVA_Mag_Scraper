require("dotenv").config();

//dependencies
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.DB_PORT;

const app = express();

//morgan logs requests
app.use(logger("dev"));

//body-parser handles form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//server public folder as a static directory
app.use(express.static("public"));

//express-handlebars serves views
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
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

app.get("/", function(req, res) {
    res.render("index");
});

app.listen(PORT, function() {
    console.log(`App running on port: ${PORT}!`);
});
require("dotenv").config();

//dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

//const db = require("./models");

const PORT = process.env.DB_PORT;

const app = express();

//morgan logs requests
app.use(logger("dev"));

//body-parser handles form submissions
app.use(bodyParser.urlencoded({ extended: false }));

//server public folder as a static directory
app.use(express.static("public"));

//connect to Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/rvaScrape");

app.listen(PORT, function() {
    console.log(`App running on port: ${PORT}!`);
});
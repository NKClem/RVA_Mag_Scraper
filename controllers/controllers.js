//dependencies
const express = require("express");
const request = require("request");
const path = require("path");
const cheerio = require("cheerio");

const db = require("../models");

app.get("/", function(req, res) {
    db.Article.finx({ "saved": false }, function(error, data) {
        let hbsObj = {
            article: data
        };
        console.log(hbsObj);
        res.render("home", hbsObj);
    });
});

app.get("/saved", function(req, res) {
    db.Article
        .find({ "saved": true })
        .populate("notes")
        .exec(function(error, articles) {
            let hbsObj = {
                article: articles
            };
            res.render("saved", hbsObj);
        });
});


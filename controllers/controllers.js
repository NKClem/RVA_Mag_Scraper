//dependencies
const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

app.get("/", function(req, res) {
    db.Article.finx({ "saved": false }, function(err, data) {
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

app.get("/scrape", function(req, res) {
    axios.get("https://rvamag.com/").then(function(response) {
        const $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2").text();
            result.summary = $(this).children("p.excerpt").text();
            result.link = $(this).children("h2").children("a").attr("href");

            db.Article
                .create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            
        });
        res.send("Scrape Complete!");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/save/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/delete/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": false, "note": [] })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});


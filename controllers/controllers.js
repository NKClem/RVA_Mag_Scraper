//dependencies
const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

const router = express.Router();

router.get("/", function(req, res) {
    db.Article.finx({ "saved": false }, function(err, data) {
        let hbsObj = {
            article: data
        };
        console.log(hbsObj);
        res.render("home", hbsObj);
    });
});

router.get("/saved", function(req, res) {
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

router.get("/scrape", function(req, res) {
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

router.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.post("/articles/save/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post("/articles/delete/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": false, "note": [] })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post("/notes/save/:id", function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.delete("/notes/delete/:note_id/:article_id", function(req, res) {
    db.Note.findOneAndRemove({ _id: req.params.note_id }, function(err) {
        if (err) {
            res.json(err);
        } else {
            db.Article.findOneAndUpdate({ _id: req.params.article_id }, {$pull: { "note": req.params.note_id }})
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
        }
    })
});

module.exports = router;


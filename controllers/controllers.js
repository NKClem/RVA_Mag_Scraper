//dependencies
const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

const router = express.Router();

router.get("/", function(req, res) {
    db.Article.find({ "saved": false }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            let hbsObj = {
                article: data
            };
            res.render("index", hbsObj);
        }
    });
});

router.get("/saved", function(req, res) {
    db.Article
        .find({ "saved": true })
        .populate("note")
        .exec(function(err, dbArticle) {
            if (err) {
                console.log(err);
            } else {
                let hbsObj = {
                    article: dbArticle
                };
                res.render("saved", hbsObj);
            }
        });
});

router.get("/scrape", function(req, res) {
    request("https://rvamag.com/", function(err, response, html) {
        const $ = cheerio.load(html);

        $("div.title-block").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2.article-title").text();
            result.summary = $(this).children("p.excerpt").text();
            result.link = $(this).children("h2.article-title").children("a").attr("href");

            let newArticle = new db.Article(result);

            newArticle.save(function(err, dbArticle) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(dbArticle);
                }
            });
        });
        res.send("Scrape Complete!");
    });
});

router.get("/articles", function(req, res) {
    db.Article.find({}, function(err, dbArticle) {
        if (err) {
            res.json(err);
        } else {
            res.json(dbArticle);
        }
    });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .exec(function(err, dbArticle) {
        if (err) {
            res.json(err);
        } else {
            res.json(dbArticle);
        }
    });
});

router.post("/articles/save/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": true })
        .exec(function(err, dbArticle) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbArticle);
            }
        });
});

router.post("/articles/delete/:id", function(req, res) {
    db.Article
        .findOneAndUpdate({ _id: req.params.id }, { "saved": false, "note": [] })
        .exec(function(err, dbArticle) {
            if (err) {
                res.json(err);
            } else {
                res.json(dbArticle);
            }
        });
});

router.post("/notes/save/:id", function(req, res) {
    let newNote = new db.Note({
        body: req.body.text,
        article: req.params.id
    });

    console.log(req.body);

    newNote.save(function(err, dbNote) {
        if (err) {
            console.log(err);
        } else {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { "note": dbNote }})
            .exec(function(err) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    res.json(dbNote);
                }
            });
        }
    });
});

router.delete("/notes/delete/:note_id/:article_id", function(req, res) {
    db.Note.findOneAndRemove({ _id: req.params.note_id }, function(err) {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            db.Article.findOneAndUpdate({ _id: req.params.article_id }, {$pull: { "note": req.params.note_id }})
            .exec(function(err) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    res.json("Note Deleted");
                }
            });
        }
    });
});

module.exports = router;


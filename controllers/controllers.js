//dependencies
const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

const router = express.Router();

router.get("/", function(req, res) {
    res.redirect("/articles");
});

router.get("/scrape", function(req, res) {
    axios
        .get("https://rvamag.com/")
        .then(function(response) {
        const $ = cheerio.load(response.data);

        $("div.title-block").each(function(i, element) {
            let result = {};

            result.title = $(this).children("h2.article-title").text();
            result.summary = $(this).children("p.excerpt").text();
            result.link = $(this).children("h2.article-title").children("a").attr("href");

            db.Article
                .create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        });
        res.redirect("/");
    });
});

router.get("/articles", function(req, res) {
    db.Article
        .find({ "saved": false })
        .sort({ _id: -1 })
        .then(function(dbArticle) {
            let hbsObj = {
                article: dbArticle
            };
            res.render("index", hbsObj);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get("/saved", function(req, res) {
    db.Article
        .find({ "saved": true })
        .populate("note")
        .then(function(dbArticle) {
            let hbsObj = {
                article: dbArticle
            };
            res.render("saved", hbsObj);
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
        .findOneAndUpdate({ _id: req.params.id }, { "saved": false })
        .exec(function(err, dbArticle) {
            if (err) {
                console.log(err);
            } else {
                res.send(dbArticle);
            }
        })
});

router.post("/notes/save/:id", function(req, res) {
    const entry = new db.Note({
        body: req.body.text,
        article: req.params.id
    });

    entry.save(function(err, note) {
        if (err) {
            console.log(err);
        } else {
            db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { "note": note }})
            .exec(function(err, note) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    console.log(note)
                    res.send(note);
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

module.exports = router
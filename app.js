const express = require("express");
const bodyParser = require("body-parser");
const { name } = require("ejs");
const app = express();

const MongoClient = require("mongodb").MongoClient;

const connectionString =
  "mongodb+srv://hoangthai:Ukjvu5QVndLNGUzV@atlascluster.ub2msdf.mongodb.net/";

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to Database");

    const db = client.db("test");
    const quotesCollection = db.collection("datas");

    app.set("view engine", "ejs");

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static("publics"));

    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      db.collection("datas")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);

          res.render("index.ejs", { datas: results });
        })
        .catch();
    });

    app.get("/add", (req, res) => {
      res.render("add.ejs");
    });

    app.post("/save", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);

          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.post("/delete", (req, res) => {
      db.collection("datas").deleteOne({ name: req.body.name });
    });

    app.listen(3000, function () {
      console.log("listening on 3000");
    });
  }
);

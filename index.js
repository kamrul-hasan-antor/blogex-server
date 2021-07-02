const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcrxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const blogCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("blogs");

  app.get("/blogs", (req, res) => {
    blogCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addBlogs", (req, res) => {
    const newBlog = req.body;
    console.log(newBlog);
    blogCollection.insertOne(newBlog).then((result) => {
      res.send(result.insertedCount > 0);
      res.redirect("/");
    });
  });

  app.get("/blog/:_id", (req, res) => {
    blogCollection
      .find({ _id: ObjectId(req.params._id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
  app.delete("/delete/:_id", (req, res) => {
    blogCollection
      .deleteOne({ _id: ObjectId(req.params._id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to Blogex SERVER......");
});

app.listen(port);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const car = require("./routes/car");
const carRenter = require("./routes/carRenter");
const carOwner = require("./routes/carOwner");
const transaction = require("./routes/transaction");
const admin = require("./routes/admin");
const moderator = require("./routes/moderator");

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
// DB Config
const db = require("./config/keys_dev").mongoURI;
const dotenv = require("dotenv");
dotenv.config();

// Connect to mongo
//as
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to CarRent </h1>
    <a href="/car">Cars</a> </br>
    <a href="/carRenter">Car Renters</a> </br>
    <a href="/carOwner">Car Owner</a> </br>
    <a href="/transaction">Transaction</a></br>
    <a href="/admin">Admin</a></br>
    <a href="/moderator">Moderator</a></br>
    `);
});

// Direct routes to appropriate files
app.use("/car", car);
app.use("/carRenter", carRenter);
app.use("/carOwner", carOwner);
app.use("/transaction", transaction);
app.use("/admin", admin);
app.use("/moderator", moderator);

// Handling 404
app.use((req, res) => {
  res.status(404).send({ err: "We can not find what you are looking for" });
});
// S2

app.options("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, x-access-token"
  );
  res.send(200);
});

// S2
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));

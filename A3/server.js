const express = require("express");
const app = express();

const fridgeRouter = require("./fridge-router.js");
const fridgeMod = require("./public/js/comm-fridge.js").default
// fridgeMod.initialize();

app.use('/', fridgeRouter);

app.use(express.static("public"));

app.get("/", function(req, res, next){
    res.send("Welcome to the Community fridge!");
  });


app.listen(8000);
console.log("Server running at http://localhost:8000");
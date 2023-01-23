const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};

app.get("/", (req, res) => {
  res.send("<html><body>Welcome to the <i>homepage</i></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/catoz", (req, res) => {
  res.send("catz?");
});
app.get("/set", (req,res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
app.get("/fetch", (req,res) => {
  const a = "<html><body><b>epskenik</b></body></html>";
  res.send(`a = ${a}`);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
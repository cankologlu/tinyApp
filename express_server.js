const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",     
  "9sm5xK": "http://google.com"
};

app.get("/", (req, res) => {
  res.send("Hello");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
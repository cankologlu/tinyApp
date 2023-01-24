const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;
app.set("view engine", "ejs");      // Setting ejs as the templating engine

const randomStringGenerator = () => {
  let randomString = "";
for (let i = 5; i >= 0; i--) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  randomString += chars[Math.floor(Math.random()*61)];
}return randomString
}

console.log(randomStringGenerator())


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};
app.use(express.urlencoded({ extended: true }));   // To convert the data in the req body to a string. Has to be before any get route so it doesn't miss data

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.get("/", (req, res) => {
  res.send("<html><body>Welcome to the <i>homepage</i></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const templateVars = { id: req.params.id, longURL: urlDatabase[id]};
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


















// app.get("/hello", (req, res) => {
//   const templateVars = {greeting: "Hello there!"}
//   res.render("hello_world", templateVars);
// });



// app.get("/catoz", (req, res) => {
//   res.send("catz?");
// });
// app.get("/set", (req,res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
// app.get("/fetch", (req,res) => {
//   const a = "<html><body><b>epskenik</b></body></html>";
//   res.send(`a = ${a}`);
// });

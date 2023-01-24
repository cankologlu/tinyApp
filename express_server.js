const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;
app.set("view engine", "ejs");      // Setting ejs as the templating engine

const randomStringGenerator = () => {
  let randomString = "";
  for (let i = 5; i >= 0; i--) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    randomString += chars[Math.floor(Math.random() * 61)];
  }
  return randomString;
}

// console.log(randomStringGenerator())   //Generator testing


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};
app.use(express.urlencoded({ extended: true }));   // To convert the data in the req body to a string. Has to be before any get route so it doesn't miss data

app.post("/urls", (req, res) => {
  console.log(req.body);
  const randomId = randomStringGenerator()
  urlDatabase[randomId] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${randomId}`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {                  //deleting a url
  const { id } = req.params

  delete urlDatabase[id];
  return res.redirect("/urls")
});

app.post("/urls/:id/", (req, res) => {
  console.log(req.params);
  const id = req.params.id
  const longUrl = req.body.longURL
  urlDatabase[id] = longUrl;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { username } = req.body
  console.log(username);
  res.cookie("username", username);
  return res.redirect("/urls")
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
  const templateVars = { id: req.params.id, longURL: urlDatabase[id] };
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

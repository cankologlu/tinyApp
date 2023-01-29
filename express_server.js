const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");


const { getUserByEmail, randomStringGenerator, urlsForUser, urlDatabase } = require("./helpers");

// ======================== App library settings ============================

app.set("view engine", "ejs");      // Setting ejs as the templating engine

app.use(cookieSession({
  name: 'session',
  keys: ["my common senses are tingling", "and one final cookie to rule them all"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.urlencoded({ extended: true }));   // To convert the data in the req body to a string. Has to be before any get route so it doesn't miss data
// ====================== Database =========================

const users = {
  horses: {
    id: "horses",
    email: "horse@fast.com",
    password: bcrypt.hashSync("1234", 10)
  },
  cornholio: {
    id: "cornholio",
    email: "cornholio@unreal.com",
    password: bcrypt.hashSync("4321", 10)
  }
};

// =============================== GET =================================
app.get("/", (req, res) => {
  return res.redirect("/login");                      //Homepage
});

app.get("/urls", (req, res) => {
  const userId = req.session["user_id"];
  if (!userId) {
    return res.send("<html><h2><a href='/login'>Please login!!!</a></h2></html>");
  }
  const templateVars = { user: users[userId], urls: urlsForUser(userId) };
  res.render("urls_index", templateVars);       //Passing user data to ejs
});

app.get("/register", (req, res) => {
  const userId = req.session["user_id"];
  if (userId) {
    return res.redirect("/urls");
  }
  const templateVars = { user: users[userId] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.session["user_id"];
  if (userId) {
    return res.redirect("/urls");
  }
  const templateVars = { user: users[userId] };
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session["user_id"];
  if (!userId) {
    return res.redirect("/login");
  }
  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const userId = req.session["user_id"];
  if (!userId) {
    return res.redirect("/login");
  }
  if (!urlDatabase[req.params.id] || !urlDatabase[req.params.id].longURL) {
    return res.status(400).send("<html><h2>ID does not exist!!!</h2></html>");
  }
  const longURL = urlDatabase[req.params.id].longURL;
  if (userId !== urlDatabase[req.params.id].userID) {
    return res.status(400).send("<html><h2>Short url doesn't belong to account!</h2></html>");
  }
  if (longURL.startsWith("http://") || longURL.startsWith("https://")) {
    return res.redirect(longURL);
  }
  res.redirect("http://" + longURL);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session["user_id"];
  if (!userId) {
    return res.status(400).send("<html><h2><a href='/login'>Please login!!!</a></h2></html>");
  }
  const id = req.params.id;
  if (!urlsForUser(userId)[id]) {
    return res.status(400).send("<html><h2>Url doesn't belong to account!</h2></html>");
  }

  const templateVars = { user: users[userId], id: req.params.id, longURL: urlsForUser(userId).longURL };
  res.render("urls_show", templateVars);
});

//================================= POST ====================================

app.post("/urls", (req, res) => {
  const userId = req.session["user_id"];
  if (!userId) {
    return res.status(400).send("<html><h2><a href='/login'>Please login!!!</a></h2></html>");
  }
  const randomId = randomStringGenerator();
  urlDatabase[randomId] = { longURL: req.body.longURL, userID: userId };
  res.redirect(`/urls/${randomId}`);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (email === "" || password === "") {
    return res.status(400).send("<html><h2>Email or Password cannot be blank.</h2></html>");
  }
  if (user) {
    return res.status(400).send("<html><h2>Email already registered.</h2></html>");
  }
  const randomUserId = randomStringGenerator();
  users[randomUserId] = { id: randomUserId, email, password: bcrypt.hashSync(password, 10) };
  req.session.user_id = randomUserId;
  return res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).send("<html><h2>Please fill email and password</h2></html>");
  }
  const user = getUserByEmail(email, users);
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    } else {
      return res.status(403).send("<html><h2>Password is incorrect!</h2></html>");
    }
  }

  return res.status(403).send("<html><h2>Email adress incorrect!</h2></html>");

});

app.post("/urls/:id/delete", (req, res) => {                        //DELETE
  const userId = req.session["user_id"];
  if (!userId) {
    return res.status(400).send("<html><h2><a href='/login'>Please login!!!</a></h2></html>");
  }
  const id = req.params.id;
  if (!urlsForUser(userId)[id]) {
    return res.status(400).send("<html><h2>Url not found!</h2></html>");
  }
  delete urlDatabase[id];
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {                                  // EDIT
  const userId = req.session["user_id"];
  if (!userId) {
    return res.status(400).send("<html><h2><a href='/login'>Please login!!!</a></h2></html>");
  }
  const id = req.params.id;
  if (!urlsForUser(userId)[id]) {
    return res.status(400).send("<<html><h2>Url not found!</h2></html>");
  }
  const longUrl = req.body.longURL;
  urlDatabase[id] = { longURL: longUrl, userID: userId };
  return res.redirect("/urls");
});



app.post("/logout", (req, res) => {
  res.clearCookie("session");
  return res.redirect("/login");
});


app.listen(PORT, () => {                              // Channel open!
  console.log(`Listening on port ${PORT}!`);
});






const express = require("express"); // Importing express library
const app = express();              // Calling express
const PORT = 8080;
// const cookieParser = require("cookie-parser"); //turns it into string
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
// ========================== Functions ======================================
const randomStringGenerator = () => {
  let randomString = "";
  for (let i = 5; i >= 0; i--) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    randomString += chars[Math.floor(Math.random() * 61)];
  }
  return randomString;
};

const urlsForUser = (ID) => {
  const userUrls = {};
  for(const id in urlDatabase) {
    if (urlDatabase[id].userID === ID) {
      userUrls[id] = urlDatabase[id];
    };
  }console.log("Output:",userUrls) 
  return userUrls;
}

// ======================== App library settings ============================

app.set("view engine", "ejs");      // Setting ejs as the templating engine

// app.use(cookieParser());            // Reach you cookies faster
app.use(cookieSession({
  name: 'session',
  keys: ["my common senses are tingling", "and one final cookie to rule them all"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(express.urlencoded({ extended: true }));   // To convert the data in the req body to a string. Has to be before any get route so it doesn't miss data
// ====================== Database =========================
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  }
};

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
  return res.redirect("/login");
});

app.get("/urls", (req, res) => {
  const userId = req.session["user_id"]
  if(!userId){
    return res.status(400).send("<<html><h2>Please login !!</h2></html>")
    
  }
  console.log("user urls are:", urlsForUser(userId));
  const templateVars = {  user:users[userId], urls: urlsForUser(userId) };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const userId = req.session["user_id"]
  if(userId) {
    return res.redirect("/urls")
  }
  const templateVars = { user:users[userId] };
  console.log(req.session["user_id"])
  res.render("register", templateVars);
});

app.get("/login", (req,res) => {
  const userId = req.session["user_id"]
  if(userId) {
    return res.redirect("/urls")
  }
  const templateVars = { user:users[userId] };
  res.render("login", templateVars)
})

app.get("/urls/new", (req, res) => {
  const userId = req.session["user_id"]
  if(!userId) {
    return res.redirect("/login");
  }
  const templateVars = { user:users[userId] };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  
  if(!longURL) {
    return res.status(400).send("ID does not exist!!!")
  }
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session["user_id"]
  if(!userId){
    return res.status(400).send("<<html><h2>Please login !!</h2></html>")
  }
  const id = req.params.id
  if(!urlsForUser(userId)[id]) {
    return res.status(400).send("<<html><h2>Url doesn't belong to account!</h2></html>")
  }
 
  const templateVars = { user:users[userId], id: req.params.id, longURL: urlsForUser(userId).longURL };
  res.render("urls_show", templateVars);
});

//================================= POST ====================================

app.post("/urls", (req, res) => {
  const userId = req.session["user_id"]
  if(!userId) {
    return res.status(400).send("Please login!!!")
  }
  const randomId = randomStringGenerator()
  urlDatabase[randomId] = { longURL:req.body.longURL, userID: userId };
  // console.log(urlDatabase);
  res.redirect(`/urls/${randomId}`);
});

app.post("/register", (req, res) => {
  const {email, password} = req.body 
  // console.log(req.body);
  if (email === "" || password === "") {
    res.status(400).send(" Email or Password cannot be blank.")
  }
  for (const id in users) {                      
    if(email === users[id].email) {
      res.status(400).send ("Email already registered.")
    }
  }
  const randomUserId = randomStringGenerator()
  users[randomUserId] = { id: randomUserId, email, password: bcrypt.hashSync(password, 10) }
  // console.log(users[randomUserId]);
  req.session.user_id = randomUserId
  return res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const {email, password} = req.body
  if(!email || !password) {
    return res.status(403).send("Please fill email and password")
  }
  for (const id in users) {
    if (email === users[id].email) {
      if (bcrypt.compareSync(password, users[id].password)) {
        req.session.user_id = id;
        console.log("User password is:",users[id].password)
        return res.redirect("/urls");
      } else {
        res.status(403).send ("Password is incorrect!");
      }
    }
  }
  res.status(403).send ("Email adress incorrect!");

});

app.post("/urls/:id/delete", (req, res) => {                        //DELETE
  const userId = req.session["user_id"]
  if(!userId){
    return res.status(400).send("<<html><h2>Please login !!</h2></html>")
  }               
  const id = req.params.id
  if(!urlsForUser(userId)[id]) {
    return res.status(400).send("<<html><h2>Url not found!</h2></html>")
  }
  delete urlDatabase[id];
  return res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {                                  // EDIT
  const userId = req.session["user_id"]
  if(!userId){
    return res.status(400).send("<<html><h2>Please login !!</h2></html>")
  }
  const id = req.params.id
  if(!urlsForUser(userId)[id]) {
    return res.status(400).send("<<html><h2>Url not found!</h2></html>")
  }
  const longUrl = req.body.longURL
  urlDatabase[id] = { longURL:longUrl, userID: userId }
  res.redirect("/urls");
});



app.post("/logout", (req, res) => {

  // console.log(username);
  res.clearCookie("session");
  return res.redirect("/login")
});















app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


















// app.get("/hello", (req, res) => {
//   const templateVars = {greeting: "Hello there!"}
//   res.render("hello_world", templateVars);
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
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

const bcrypt = require("bcryptjs");

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

const getUserByEmail = (email, database) => {     //Takes in email address and database returns user object
  for (const id in database) {
    if (email === database[id].email) { 
      return database[id];
    } 
  } return null;
}

const randomStringGenerator = () => {                 //Generates a six digit alpahnumeric string
  let randomString = "";
  for (let i = 5; i >= 0; i--) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    randomString += chars[Math.floor(Math.random() * 61)];
  }
  return randomString;
};


const urlsForUser = (ID) => {                           //Takes in a string and searches the urldatabase to find matching id and returns an object with the urls related to that id 
  const userUrls = {};
  for (const id in urlDatabase) {
    if (urlDatabase[id].userID === ID) {
      userUrls[id] = urlDatabase[id];
    }
  }
  return userUrls;
}


module.exports = {getUserByEmail, randomStringGenerator, urlsForUser, urlDatabase} 
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


const getUserByEmail = (email, database) => {
  for (const id in database) {
    if (email === database[id].email) { 
      return database[id];
    } 
  } return null;
}

const randomStringGenerator = () => {
  let randomString = "";
  for (let i = 5; i >= 0; i--) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    randomString += chars[Math.floor(Math.random() * 61)];
  }
  return randomString;
};





module.exports = {getUserByEmail, randomStringGenerator} 
const res = require("express/lib/response");
const { get } = require("express/lib/response");

const generateRandomString = function() {
  const randomKey =  Math.random().toString(36).substring(6);
  return randomKey;
};

const getUserByEmail = function (database, email) {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
};

const checkPassword = function(user, password) {
  return user.password === password;
};

//returns shortURL:{longurl, userID}
const urlsForUsers = function(id, urlDatabase) {
  const urls = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key];
    }
  }
  return urls;
};

module.exports = {
  getUserByEmail,
  checkPassword,
  generateRandomString,
  urlsForUsers
};
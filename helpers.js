const { get } = require("express/lib/response");

const generateRandomString = function() {
  const randomKey =  Math.random().toString(36).substring(6);
  return randomKey;
};

const getUserByEmail = function (obj, email) {
  for(let key in obj) {
    if (obj[key].email === email) {
      return obj[key];
    }
  }
  return null;
};

const checkPassword = function(user, password) {
  return user.password === password
};

module.exports = { 
  getUserByEmail,
  checkPassword,
  generateRandomString
};
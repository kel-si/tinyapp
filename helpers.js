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

const checkPassword = function(obj, password) {
  for (let key in obj) {
    if (obj[key].password === password) {
      return obj[key].id;
    }
  }
  return false;
};

module.exports = getUserByEmail;
module.exports = checkPassword;
module.exports = generateRandomString;
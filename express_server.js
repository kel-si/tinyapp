//create server
const express = require("express");
const app = express();
const PORT = 8080; //default

//express
const res = require("express/lib/response");

//allows for POST requests; adds data to the req object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
const { redirect } = require("express/lib/response");
app.use(cookieParser());

//express app to use EJS templating engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// //add additional endpoints
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//pass URL data to template
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user, urls: urlDatabase};
  res.render("urls_index", templateVars);
});

//to show the form
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

//adds shortURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//delete URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//edit URLs
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

// //create username
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   res.cookie("username", username);
//   res.redirect("/urls");
// });

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//registration page
app.get("/register", (req, res) => {
  res.render("register");
});

//new register
app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const id = generateRandomString();
  res.cookie("user_id", id);

  if(!email || !password) {
    res.status(400).send("Must input email and password.");
  }

 if(getUserByEmail(users, email)) {
   res.status(400).send("Email already registered.");
 }

  const newUser = {id, email, password};
  users[id] = newUser;
  res.redirect("/urls");
});

//log in
app.get("/login", (req, res) => {
  res.render("login");
});

//log in
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const user = getUserByEmail(users, email);

  if (user === null) {
    res.status(403).send("Email cannot be found.")
  };

  const userIdKey = (checkPassword(users, password));
  console.log(userIdKey);
    
    res.cookie("user_id", userIdKey);
    res.redirect("/urls");
  
  if (!userIdKey) {
    res.status(403).send("Password is incorrect.")
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});

//returns a random string of 6 characters
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
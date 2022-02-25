const {getUserByEmail, checkPassword, generateRandomString, urlsForUsers} = require("./helpers");
const { redirect, res } = require("express/lib/response");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const express = require("express");

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//DATABASES:

const urlDatabase = {
  b6UTxQ: { //shortURL
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "user2RandomID"
  }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//GET METHODS:

//pass URL data to template
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const urls = urlsForUsers(userId, urlDatabase);
  const templateVars = {user, urls};
 
  if(!userId) {
    return res.redirect("/redirect");
  }
  
  res.render("urls_index", templateVars);
});

//to show the form
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user};

  if(!userId) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};

  if(!userId) {
    return res.redirect("/redirect");
  }

  res.render("urls_show", templateVars);
});

//redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//registration page
app.get("/register", (req, res) => {
  res.render("register", {user: null});
});

//log in
app.get("/login", (req, res) => {
  res.render("login", {user: null});
});

app.get("/redirect", (req, res) => {
  res.render("redirect", {user: null});
});


//POST METHODS
//adds shortURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  res.redirect(`/urls/${shortURL}`);
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
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//new register
app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  if(!email || !password) {
    return res.status(400).send("Must input email and password.");
  }

  if(getUserByEmail(users, email)) {
    return res.status(400).send("Email already registered.");
  }

  const id = generateRandomString();
  res.cookie("user_id", id);

  const newUser = {id, email, password};
  users[id] = newUser;
  res.redirect("/urls");
});

//log in
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = getUserByEmail(users, email);

  if (!user || !checkPassword(user, password)) {
    return res.status(403).send("Email or password cannot be found.")
  };
  
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
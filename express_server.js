const {getUserByEmail, checkPassword, generateRandomString, urlsForUsers} = require("./helpers");

const { redirect, res } = require("express/lib/response");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const express = require("express");
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'sessions',
  keys: ['user_id']
}));

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
    password: "$2a$10$mmJlbIJsRNKSF8I9PYuls.CBKOdltHRvESk8VRUAfQ/Yb6WwkaYj6"
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
  const userId = req.session.user_id;
  const user = users[userId];
  const urls = urlsForUsers(userId, urlDatabase);
  const templateVars = {user, urls};
 
  if (!userId) {
    return res.redirect("/login");
  }
  
  res.render("urls_index", templateVars);
});

//create new URL
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = {user};

  if (!userId) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

//short URL page
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {user, shortURL, longURL};
  res.render("urls_show", templateVars);
});

//redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];

  if (!url) {
    return res.status(400).send("This URL does not exist.");
  }
  const longURL = urlDatabase[shortURL].longURL;
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
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});

//delete URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.redirect("/login");
  }

  const ownedURLS = urlsForUsers(userId, urlDatabase);

  if (!ownedURLS[shortURL]) {
    return res.status(400).send("Error: cannot delete URL.");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//edit URLs
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.redirect("/login");
  }
  urlDatabase[shortURL].longURL = longURL;

  res.redirect("/urls");
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//new register
app.post("/register", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  if (!email || !password) {
    return res.status(400).send("Must input email and password.");
  }

  if (getUserByEmail(users, email)) {
    return res.status(400).send("Email already registered.");
  }

  const id = generateRandomString();
  req.session.user_id = users.id;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {id, email, password: hashedPassword};
  users[id] = newUser;

  res.redirect("/urls");
});

//log in
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = getUserByEmail(users, email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Email or password cannot be found.");
  }
 
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
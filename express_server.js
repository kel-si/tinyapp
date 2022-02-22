//create server
const express = require("express");
const app = express();
const PORT = 8080; //default

//express
const res = require("express/lib/response");

//allows for POST requests; adds data to the req object under the key body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//express app to use EJS as its templating engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!")
});

//add additional endpoints
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//sending HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//testing scope
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

//pass URL data to template
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("urls_show", templateVars);
});

//handles post request (logs and gives a response)
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});

//returns a random string of 6 characters
function generateRandomString() {
  const randomKey =  Math.random().toString(36).substring(6);
  return randomKey;
};



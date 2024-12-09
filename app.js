const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/mongoose");
const user = require("./models/user");
const Hisaab = require("./models/hisaab");
const hisaab = require("./models/hisaab");

let loggedInUser = null; //store the logged-in user in memory.

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//routes

//render signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

//handle signup form submission (post method)

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //check if the user is already exists

  const existingUser = await user.findOne({ username });

  if (existingUser) {
    return res.send("user already exixts.please try again");
  } else {
    //create a new user and save to the database
    const newUser = user.create({ username, password });
  }

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//login post route for form handling.
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userexist = await user.findOne({ username });
  //if user match  allow it home page(index)

  if (userexist) {
    loggedInUser = userexist; //set the logged-in user
    return res.redirect("/");
  }
  //if not exist send message
  return res.send("Invalid credentials. Try again.");
});

//logout logic

app.get("/logout", (req, res) => {
  loggedInUser = null; //clear logged-in user
  res.redirect("/login");
});

//create user

app.get("/create", async (req, res) => {
  if (!loggedInUser) {
    return res.redirect("/login");
  }

  // Fetch only the Hisaabs associated with the logged-in user
  const allHisaab = await Hisaab.find({ userId: loggedInUser._id });
  res.render("create", { hisaab: allHisaab, user: loggedInUser });
});

app.post("/create", async (req, res) => {
  const { name, amount, description } = req.body;
  if (!loggedInUser) {
    return res.redirect("/login");
  }
  const hisaab = await Hisaab.create({
    name,
    amount,
    description,
    userId: loggedInUser._id, // Associate the Hisaab with the logged-in user
  });
  res.redirect("/");
});

//showing hisaab in dashboard:

app.get("/", async (req, res) => {
  if (!loggedInUser) {
    return res.redirect("/login");
  }

  const allHisaab = await Hisaab.find({ userId: loggedInUser._id });
  //  console.log(allHisaab);
  res.render("dashboard", { allHisaab });
});

//view hisaab
app.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  if (!loggedInUser) {
    return res.redirect("/login");
  }
  const hisaab = await Hisaab.findOne({ _id: id });
  res.render("view", { hisaab: hisaab });
});

//delete hisaab
app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const hisaab = await Hisaab.findOneAndDelete({ _id: id });
  res.redirect("/");
});

//get route for edit
app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const hisaab = await Hisaab.findOne({ _id: id });
  res.render("edit", { hisaab });
});

//post route for edit hisaab
app.post("/edit/:id", async (req, res) => {
  let { name, amount, description } = req.body;
  const { id } = req.params;

  if (!loggedInUser) {
    return res.redirect("/login");
  }

  const hisaab = await Hisaab.findOneAndUpdate(
    { _id: id },
    { name, description, amount },
    { new: true }
  );

  res.redirect("/");
});

app.listen(3000);

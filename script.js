//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const BookedCenter = require('./booking');


const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  vaccine_center: String
});

const userSchema2 = new mongoose.Schema({
  firstName: String,
    lastName: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
const User2 = mongoose.model("admin", userSchema2);

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/adminlogin.html", function(req, res) {
  res.sendFile(path.join(__dirname, "adminlogin.html"));
});

app.get("/userlogin.html",function(req,res){
  res.sendFile(path.join(__dirname,"userlogin.html"))
})

app.get("/Userdashboard.html",function(req,res){
  res.sendFile(path.join(__dirname,"Userdashboard.html"))
})

app.get("/Displayusers.html",function(req,res){
  res.sendFile(path.join(__dirname,"Displayusers.html"))
})


app.post("/admin-login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Perform authentication logic here
  // Check if the username and password are valid

  if (username === "admin" && password === "password") {
    // Redirect to the dashboard page
    res.redirect("/dashboard.html");
  } else {
    // Redirect to login page with an error message
    res.redirect("/adminlogin.html?error=1");
  }
});

app.get("/dashboard.html", async function(req, res) {
  try {
    const users = await User.find({}).exec();
    res.sendFile(path.join(__dirname, "dashboard.html"));
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard.html?error=1");
    
  }
});

app.post("/dashboard/add", async function(req, res) {
   
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    vaccine_center: req.body.vaccine_center
    
  });
  

  try {
  
    await newUser.save();
    
    res.redirect("/dashboard.html");
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard.html?error=1");
  }
});

app.delete("/deleteuser/:id", async function(req, res) {
  const userId = req.params.id;

  try {
    await User.findByIdAndRemove(userId).exec();
    res.send({ status: "ok", message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error", message: "Failed to delete user" });
  }
});


app.post("/dashboard/update/:id", async function(req, res) {
  const userId = req.params.id;

  try {
    await User.findByIdAndUpdate(
      userId,
      { name: req.body.name, email: req.body.email }
    ).exec();
    res.redirect("/dashboard.html");
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard.html?error=1");
  }
});

app.post("/signup", async function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const newUser2 = new User2({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  });

  try {
    await newUser2.save();
    console.log("User saved to the database");
    res.redirect("/userlogin.html"); 
  } catch (err) {
    console.log("Error occurred while saving user:", err);
    res.sendStatus(500); 
  }
});


app.post("/login", async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email,password)

  try {
    const user = await User2.findOne({ email: email, password: password }).exec();
    console.log(user);
    if (user) {
     
      res.redirect("/Userdashboard.html");
    } else {
      
      res.redirect("/userlogin.html?error=1");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/userlogin.html?error=1");
  }
});

app.get("/getalluser", async (req, res) => {
  try {
    const allUser = await User.find({});
    const vaccineCenters = [...new Set(allUser.map(user => user.vaccine_center))];
    res.send({ status: "ok", data: allUser, centers: vaccineCenters });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});

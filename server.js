const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const AdminRoutes = require("./routes/admin");
const VendeurRoutes=require("./routes/vendeur");
const app = express();
const cors=require("cors");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "YourSecretKey",
    resave: false,
    saveUninitialized: false
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://useryassine:uVbuxLPSCeESz6ZH@cluster0.l38olsk.mongodb.net/?retryWrites=true&w=majority");



app.use(AdminRoutes);

app.use(VendeurRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

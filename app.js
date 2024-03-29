const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const path = require("path");
const mongoose = require("./database");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const authenticate = require("./middleware/authenticate");
const Item = require("./models/item"); 
const newsRoutes = require('./routes/newsRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const app = express();
const createAdminUser = require('./utils/createAdmin');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use('/', authRoutes);
app.use('/main-page', authenticate);  
app.use('/admin', authenticate); 
app.use('/', itemRoutes);
app.use('/news', newsRoutes);
app.use('/',phoneRoutes); 


app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get('/main-page', authenticate, async (req, res) => {
  try {
    const items = await Item.find();
    res.render('main', { items: items });
  } catch (error) {
    console.error('Error rendering main page:', error);
    res.status(500).send('Internal Server Error');
  } 
});
app.get("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.clearCookie("adminToken"); 
  res.redirect("/login"); 
});


app.get('/admin', authenticate, async (req, res) => {
  if (req.isAdmin) {
    const item = await Item.find();

    res.render("admin",{ item: item } );
  } else {
    res.status(403).send("Forbidden - you do not have access to the admin panel, only admins can "); 
  }
});


createAdminUser();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

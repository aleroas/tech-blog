const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const { Sequelize } = require('sequelize');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars.js as the template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set up session
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const sessionStore = new sequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home'); // Make sure you have a 'home.handlebars' view
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

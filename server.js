const express = require("express");
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const path = require('path');
const db = require('./models'); 
const {User}= require('./models/index');


const app = express();
const PORT = process.env.PORT || 5000;

const { ensureAuthenticated } = require('./middleware/auth');
const userRoutes = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const sequelizeURI = "mysql://root:@localhost:3307/db_pweb";

const authenticate = async (req, res, next) => {
    const { NIM, password } = req.body;
    try {
      const user = await UserModel.findOne({ where: { NIM } });
      if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id; // Set user id in session
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

db.sequelize.authenticate()
  .then(() => {
    console.log('MySQL Connected');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

  const store = new SequelizeStore({
    db: db.sequelize
  });

store.sync();

app.use(session({
    secret: 'key that will sign cookie',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, // 2 jam
    },
  }));

app.use('/users', userRoutes);


app.get("/", (req, res) => {
    res.render("login");
});

app.use(userRoutes);

// app.post("/login", userRoutes.login);

app.get('/dashboardjurusan', ensureAuthenticated, (req, res) => {
  res.render('dashboardjurusan', { user: req.session.userId });
});

app.get('/DataKelompok', ensureAuthenticated, (req, res) => {
    res.render('DataKelompok');
});

app.get('/change-password', ensureAuthenticated, (req, res) => {
  res.render('change-password');
});

app.get('/profile', ensureAuthenticated, async(req, res) => {
  const user = await User.findByPk(req.session.userId);
  res.render('profile', { user});
});


app.listen(5000, () => {
    console.log("Server Running on http://localhost:5000")
});
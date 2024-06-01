const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const db = require('./models');


const app = express();
const PORT = process.env.PORT || 3000;

const { ensureAuthenticated } = require('./middleware/auth');
const userRoutes = require('./routes/users');
const dataKelompokRoutes = require('./routes/dataKelompok');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// const sequelize = new Sequelize('mysql://root:@localhost:3306/db_pweb');

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
    maxAge: 2 * 60 * 60 * 1000,
  },
}));

// Routes
app.use('/users', userRoutes);
app.use('/dataKelompok', dataKelompokRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/DataKelompok', ensureAuthenticated, (req, res) => {
  res.render('DataKelompok');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

const sequelize = db.sequelize;

const authenticate = async (req, res, next) => {
  const { NIM, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { NIM } });
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

sequelize.authenticate()
.then(() => {
  console.log('MySQL Connected');
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('Error connecting to the database:', err);
});
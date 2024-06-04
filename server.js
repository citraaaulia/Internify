const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const db = require('./models'); 
const {User}= require('./models/index');


const app = express();
const PORT = process.env.PORT || 5000;

const { ensureAuthenticated } = require('./middleware/auth');
const userRoutes = require('./routes/users');
const dataKelompokRoutes = require('./routes/dataKelompok');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/stylelsheets", express.static('dist'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const sequelizeURI = "mysql://root:@localhost:3306/db_pweb";

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
    maxAge: 2 * 60 * 60 * 1000,
  },
}));

app.use('/users', userRoutes);
app.use('/dataKelompok', dataKelompokRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.use(userRoutes);

app.get('/dashboardjurusan', ensureAuthenticated, (req, res) => {
  res.render('dashboardjurusan', { user: req.session.userId });
});

app.get('/UnggahProposal', ensureAuthenticated, (req, res) => {
  res.render('UnggahProposal', { user: req.session.userId });
});

app.get('/DataKelompok', (req, res) => {
  res.render('DataKelompok');
});

app.get('/change-password', ensureAuthenticated, (req, res) => {
  res.render('change-password');
});

app.get('/profile', ensureAuthenticated, async(req, res) => {
  const user = await User.findByPk(req.session.userId);
  res.render('profile', { user});
});

app.get('/surat-balasan', ensureAuthenticated, (req, res) => {
  res.render('surat-balasan');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/suratpengantarsekjur', (req, res) => {
  res.render('suratpengantarsekjur');
});

const sequelize = db.sequelize;


sequelize.authenticate()
.then(() => {
  console.log('MySQL Connected');
  app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:5000`);
  });
})
.catch(err => {
  console.error('Error connecting to the database:', err);
});
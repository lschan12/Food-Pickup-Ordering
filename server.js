// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

/** 
 * Define Routes
*/

// API Routes
const userApiRoutes = require('./routes/users-api');
const dishesApiRoutes = require('./routes/dishes-api');
const ordersApiRoutes = require('./routes/orders-api');
const smsApiRoutes = require('./routes/sms-api');

// Render Routes
const usersRoutes = require('./routes/users');
const dishesRoutes = require('./routes/dishes');

/** 
 * Mount Routes
*/

// API Routes
app.use('/api/users', userApiRoutes);
app.use('/api/dishes', dishesApiRoutes);
app.use('/api/orders', ordersApiRoutes);
app.use('/api/sms', smsApiRoutes);

// Render Routes
app.use('/users', usersRoutes);
app.use('/dishes', dishesRoutes);

/** 
 * Home Page
*/

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.redirect('dishes');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

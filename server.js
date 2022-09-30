// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const cookieSession = require("cookie-session");
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["user_id"],
  maxAge: 24 * 60 * 60 * 1000
}));
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
const receiptApiRoutes = require('./routes/receipt-api');
const loginApiRoutes = require('./routes/login-api');
const registerApiRoutes = require('./routes/register-api');

// Render Routes
const dishesRoutes = require('./routes/dishes');
const ordersRoutes = require('./routes/orders');
const receiptRoutes = require('./routes/receipt');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');

/* const usersRoutes = require('./routes/users');*/

/**
 * Mount Routes
*/

// API Routes
app.use('/api/users', userApiRoutes);
app.use('/api/dishes', dishesApiRoutes);
app.use('/api/orders', ordersApiRoutes);
app.use('/api/sms', smsApiRoutes);
app.use('/api/receipt', receiptApiRoutes);
app.use('/api/register', registerApiRoutes);
app.use('/api/login', loginApiRoutes);

// Render Routes
app.use('/dishes', dishesRoutes);
app.use('/orders', ordersRoutes);
app.use('/receipt', receiptRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

/* app.use('/users', usersRoutes); */


/**
 * Home Page
*/

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.redirect('login');
});

app.use(express.static('/' + '/public'));

io.on('connection', function(socket) {
  console.log("a user connected");
  socket.on("client speaks:", (payload, callback) => {
    console.log("payload", payload);
    // To do: add login here to grab data from orders.js and socket.emit to client
    const response = {message: "all good"};
    io.emit("hello from server", response);
    return callback(response);
  });
  socket.on("orderid", (payload) => {
    io.emit("server payload", payload);
  });
  socket.on("new-est", (payload) => {
    io.emit("server payload2", payload);
  });
  // socket.emit('message', {message: 'welcome to the chat'});
  // socket.on('send', function(data) {
  //   io.sockets.emit('message', data);
});

server.listen(PORT);


// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });

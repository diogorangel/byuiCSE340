/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");
const accountRoute = require("./routes/accountRoute");
const session = require("express-session");
const pool = require("./database/");
const pgSession = require("connect-pg-simple")(session);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressMessages = require("express-messages");

/* ***********************
 * Middleware
 *************************/
// Middleware for processing JSON and form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for processing cookies.
app.use(cookieParser());

// Session middleware (uses cookies and the database pool).
app.use(session({
  store: new pgSession({
    pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
}));

// Flash message middleware. Must come after session middleware.
app.use(flash());

// Middleware to make flash messages available in views.
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Utility to check for JWT token.
app.use(utilities.checkJWTToken);

/* *************************
 * View Engine and Templates
 ***************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
// Static route for serving files.
app.use(static);

// Index route.
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes.
app.use("/inv", inventoryRoute);

// User account routes.
app.use("/account", accountRoute);

// Route to intentionally trigger a 500 server error.
// This must be placed here, before the 404 handler.
app.get("/error-test", utilities.handleErrors(baseController.throwError));

/* ***********************
 * Error Handling
 *************************/
// 404 Not Found route - must be the LAST route before the general error handler.
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, the page you're looking for was not found." });
});

// Express general error handler. Must be the LAST middleware.
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  // This is the key change: use the specific error message if it exists, otherwise use a generic one.
  const message = err.message || "Oops! A crash occurred. Maybe try a different route?";

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    errors: null,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Start the server
 *************************/
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
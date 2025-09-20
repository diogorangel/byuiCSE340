const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
// Removemos os parâmetros req, res, next, pois a função é chamada diretamente pelo controlador
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ****************************************
 * Build classification list drop-down menu
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div id="inv-display" class="grid grid--2-cols grid--3-cols">';
    data.forEach((vehicle) => {
      grid += "<div class='vehicle-card'>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span class='vehiclePrice'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</div>";
    });
    grid += "</div>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the chosen vehicle view HTML
 * ************************************ */
Util.buildSingleVehiclePage = async function (vehicle, locals = null) {
  let carDetailsGrid;
  carDetailsGrid = "<h1>";
  carDetailsGrid += vehicle.inv_make + " " + vehicle.inv_model;
  carDetailsGrid += "</h1>";

  carDetailsGrid += '<div id="inv-display" class="grid grid--2-cols">';

  carDetailsGrid += "<div>";
  carDetailsGrid +=
    '<a href="../../inv/detail/' +
    vehicle.inv_id +
    '" title="View ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    'details"><img src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    ' on CSE Motors" /></a>';
  carDetailsGrid += "</div>";

  carDetailsGrid += "<div>"; // Open div details section
  carDetailsGrid += "<div class='prominent'>"; // Open div prominent section
  carDetailsGrid += "<h2>";
  carDetailsGrid +=
    " " + vehicle.inv_year + "  " + vehicle.inv_make + " " + vehicle.inv_model;
  carDetailsGrid += "</h2>";

  carDetailsGrid += "<h2>";
  carDetailsGrid +=
    "$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price);
  carDetailsGrid += "</h2>";
  carDetailsGrid += "</div>"; // Close div prominent section

  carDetailsGrid += "<div>"; // Open div more details section
  carDetailsGrid += "<p>";
  carDetailsGrid +=
    "<span class='label'>Mileage:</span> " + vehicle.inv_miles.toLocaleString();
  carDetailsGrid += "</p>";

  carDetailsGrid += "<p>";
  carDetailsGrid += "<span class='label'>Color:</span> " + vehicle.inv_color;
  carDetailsGrid += "</p>";

  carDetailsGrid += "<p>";
  carDetailsGrid +=
    "<span class='label'>Description:</span> " + vehicle.inv_description;
  carDetailsGrid += "</p>";

  carDetailsGrid += "</div>"; // Close div more details section

  carDetailsGrid += "</div>"; // Close grid
  carDetailsGrid += "</div>"; // Close

  /***************************************
   * Build the inquiry form
   ************************************* */
  carDetailsGrid += "<hr>"; // Close
  carDetailsGrid += '<div class="grid grid--2-cols">';
  carDetailsGrid += '<div class="inquiry-form">';
  if (locals) {
    carDetailsGrid += `<form id="inquiryForm" method="post" action="/inv/inquiry">
    <fieldset>
      <legend>Your inquiry</legend>
      <label class="top" for="fName"
        >First Name:
        <input
          type="text"
          id="fName"
          name="inquiry_firstname"
          required
          value="${locals.account_firstname}"
      /></label>
      <br />
      <label class="top" for="lName"
        >Last Name:
        <input
          type="text"
          id="lName"
          name="inquiry_lastname"
          required
          value="${locals.account_lastname}"
      /></label>
      <br />
      <label class="top" for="email"
        >Email:
        <input
          type="email"
          id="email"
          name="inquiry_email"
          required
          placeholder="Enter a valid email address"
          value="${locals.account_email}"
      /></label>
        <br />
      <label class="top" for="inquiry">Your Message 
      <textarea id="inquiry" name="inquiry_message" rows="4" placeholder="Type here your inquiry!">${ locals.inquiry_message ?? ''}</textarea></label>

      <br />
      <input
        type="hidden"
        name="inv_id"
        value="${vehicle.inv_id}"         
      >
      <input type="submit" value="Submit" class="submitBtn" />
    </fieldset>
  </form>`;
  } else {
    carDetailsGrid += '<div class="inquiry-info">';
    carDetailsGrid += '<h3>Do you want to make an inquiry?</h3>';
    carDetailsGrid += '<a href="/account/login">You must be logged in to send a message</a>';
    carDetailsGrid += '</div>';
  }
  carDetailsGrid += '</div>';

  carDetailsGrid += '<div class="inquiry-info">';
  carDetailsGrid += '<h3>Are you interested?</h3>';
  carDetailsGrid += '<p>Should you need more information about this particular car, please complete the inquiry form and our team will contact you withing the next 24 hours.</p>';
  carDetailsGrid += '<h3>How to find us</h3>';
  carDetailsGrid += '<p class="info-text">CSE Motors</p>';
  carDetailsGrid += '<p class="info-text">4011 W Sunset Blvd, Los Angeles, 90029</p>';
  carDetailsGrid += '<p class="info-text">323-669-1601</p>';
  carDetailsGrid += '<p class="info-text">Monday – Saturday: 8:00 AM to 6:00 PM</p>';
  carDetailsGrid += '</div>';

  carDetailsGrid += "</div>"; // Close grid

  return carDetailsGrid;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Middleware to check account type
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err || (accountData.account_type != "Employee" && accountData.account_type != "Admin")) {
          req.flash("notice", "Access Denied.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        next();
      }
    );
  } else {
    req.flash("notice", "Access Denied.");
    return res.redirect("/account/login");
  }
};


/* ****************************************
 * Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
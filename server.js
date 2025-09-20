/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const session = require("express-session")
const flash = require("connect-flash")
// Importa o utilitário para construir a navegação
const utilities = require("./utilities/")
const cookieParser = require("cookie-parser")

// Importando as novas rotas
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

/* ***********************
 * Middleware
 *************************/
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-secret-string',
  resave: false,
  saveUninitialized: false,
  name: "sessionId"
}))

app.use(flash())

app.use(cookieParser())

app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Routes
 *************************/
// Rota para o inventário
app.use("/inv", inventoryRoute)

// Rota para contas de usuário
app.use("/account", accountRoute)

// Rota de índice - ASYNC
app.get("/", async (req, res) => {
  let nav = await utilities.getNav()
  res.render("index", {
    title: "Home",
    nav, // Passa 'nav' para a view para que ela possa ser usada no parcial de navegação
  })
})

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on  http://localhost:${port}`)
})
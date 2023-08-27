
require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const port = 3000

//connection database
require("./mongo")

//Controllers
const {createUser,logUser} = require("./controllers/users")
const {getSauces, createSauce} = require("./controllers/sauces")

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const {authUser} = require("./middleware/auth");

//Routes

app.post("/api/auth/signup", createUser );          // req,res => createUser(req,res)
app.post("/api/auth/login",logUser);
app.get("/api/sauces", authUser, getSauces);
app.post("/api/sauces", authUser, createSauce);
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.listen(port,()=>console.log("Listen on port "+ port))

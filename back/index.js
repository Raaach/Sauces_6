
require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000

//connection database
require("./mongo")

//Controllers
const {createUser,logUser} = require("./controllers/users")
const {getSauces} = require("./controllers/sauces")

//Middleware
app.use(cors());
app.use(express.json());

//Routes

app.post("/api/auth/signup", createUser );          // req,res => createUser(req,res)
app.post("/api/auth/login",logUser);
app.get("/api/sauces", getSauces);
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.listen(port,()=>console.log("Listen on port "+ port))

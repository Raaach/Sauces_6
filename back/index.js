console.log("hello World")
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000

//Database
const mongoose= require("mongoose");
const password = "A0MWbXekaMrgTdcU";
const uri = 
    `mongodb+srv://Rachid:${password}@nicolas.4q71gdx.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri).then((()=>console.log("Connected to Mongo!"))).catch(err => console.error
    ("Error connecting to mongo:" , err))

//Middleware
app.use(cors());
app.use(express.json());

//Routes

app.post("/api/auth/signup", (req, res) => {
    console.log("Signup request: " + req.body)
    res.send({message : "Utilisateur enregistré !"})
});
app.get("/", (req, res) => res.send("Hello World"))
app.listen(port,()=>console.log("Listen on port "+ port))
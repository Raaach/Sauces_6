const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000

//Middleware
app.use(cors());

//Routes

app.post("api/auth/signup", (req, res) => {
    console.log("Signup request: " + req.body)
});
app.get("/", (req, res) => res.send("Hello World"))
app.listen(port,()=>console.log("Listen on port "+ port))
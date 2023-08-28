
require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb){
        cb(null,makeFileName(file))
    }
})
function makeFileName(file){
    return `${Date.now()}-${file.originalname}`
}
const upload = multer({storage: storage});


//connection database
require("./mongo")

//Controllers
const {createUser,logUser} = require("./controllers/users")
const {getSauces, createSauce} = require("./controllers/sauces")

//Middleware
app.use(cors());
app.use(express.json());

const {authUser} = require("./middleware/auth");



//Routes

app.post("/api/auth/signup", createUser );          // req,res => createUser(req,res)
app.post("/api/auth/login",logUser);
app.get("/api/sauces", authUser, getSauces);
app.post("/api/sauces", authUser, upload.single("image"), createSauce);
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.listen(port,()=>console.log("Listen on port "+ port))

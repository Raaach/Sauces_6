
require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb){
        cb(null,makeFileName(req, file))
    }
})
function makeFileName(req, file){
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-");
    file.fileName = fileName
    return fileName
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

const {authUser} = require("./middleware/auth")



//Routes

app.post("/api/auth/signup", createUser );          // req,res => createUser(req,res)
app.post("/api/auth/login",logUser);
app.get("/api/sauces", authUser, getSauces);
app.post("/api/sauces", authUser, upload.single("image"), createSauce);
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.use("/images", express.static('images'))
app.listen(port,()=>console.log("Listen on port "+ port))

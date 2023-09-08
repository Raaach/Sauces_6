
const {app, express} = require("./server");
const port = 3000;
const path = require("path");


//connection database  
require("./mongo")

//Controllers
const {createUser,logUser} = require("./controllers/users")
const {getSauces, createSauce, getSaucesById, deleteSauces} = require("./controllers/sauces")

//Middleware
const {upload} = require("./middleware/multer")
const {authUser} = require("./middleware/auth")


//Routes

app.post("/api/auth/signup", createUser );          // req,res => createUser(req,res)
app.post("/api/auth/login",logUser);
app.get("/api/sauces", authUser, getSauces);
app.post("/api/sauces", authUser, upload.single("image"), createSauce);
app.get("/api/sauces/:id", authUser, getSaucesById);
app.delete("/api/sauces/:id", authUser, deleteSauces); //vérifie le token puis delete
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.use("/images", express.static(path.join(__dirname, 'images'))) // c'est un chemin absolu qui permet de retrouver images même si le index est déplacé 
app.listen(port,()=>console.log("Listen on port "+ port))

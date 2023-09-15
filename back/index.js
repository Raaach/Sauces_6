const {app, express} = require("./server");
const {saucesRouter} = require("./routers/sauces.routers");
const {authRouter} = require("./routers/auth.routers");
const port = 3000;
const path = require("path");

//connection database  
require("./mongo")

//Middleware
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)

//Routes
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.use("/images", express.static(path.join(__dirname, 'images'))) // c'est un chemin absolu qui permet de retrouver images même si le index est déplacé 
app.listen(port,()=>console.log("Listen on port "+ port))

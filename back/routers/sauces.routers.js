const express = require("express");
const {
    getSauces, 
    createSauce, 
    getSaucesById, 
    deleteSauces, 
    modifySauce, 
    sauceLike
    } 
    = require("../controllers/sauces")
const {authUser} = require("../middleware/auth")
const {upload} = require("../middleware/multer")
const saucesRouter =  express.Router()



saucesRouter.get("/", authUser, getSauces);
saucesRouter.post("/", authUser, upload.single("image"), createSauce);
saucesRouter.get("/:id", authUser, getSaucesById);
saucesRouter.delete("/:id", authUser, deleteSauces); //vérifie le token puis delete
saucesRouter.put("/:id", authUser, upload.single("image"), modifySauce);
saucesRouter.post("/:id/like ", authUser, sauceLike)



module.exports = {saucesRouter}
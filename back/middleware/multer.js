const multer = require("multer");   // package de gestion de fichier

const storage = multer.diskStorage({ // diskStorage configure le chemin et le nom du fichier entrants
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


const upload = multer({storage});


module.exports ={upload}
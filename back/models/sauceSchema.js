const mongoose = require('mongoose');
//** schéma de données**//
const saucesSchema = new mongoose.Schema({      //la structure comportant les données suivantes
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked:[ String ],
    usersDisliked : [ String ]

})

module.exports = {saucesSchema}
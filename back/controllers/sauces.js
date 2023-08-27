const mongoose = require('mongoose');
const saucesSchema = new mongoose.Schema({
    userId: String,
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

const Sauces =  mongoose.model("Sauces", saucesSchema)



function getSauces( req, res){                                    //cette fontion est a utiliser en interne
        console.log("le token est validé, nous sommes bien dans getSauces")
        //console.log("Le token est valid",decoded)
        Sauces.find({}).then(sauces => res.send(sauces))
        //res.send({message: [{sauce: "sauces1"}, {sauce: "sauces2"}]})
    }


function createSauce(req, res){

    const sauce = new Sauces({
        userId: "Prout",
        manufacturer: "Prout",
        description: "Prout",
        mainPepper: "Prout",
        imageUrl: "Prout",
        heat: 2,
        likes: 2,
        dislikes: 2,
        usersLiked:["Prout"],
        usersDisliked : ["Prout"]
    })
    sauce.save().then((res)=> console.log("Success saved Sauces", res )).catch(console.error)
}

module.exports = {getSauces, createSauce} 



//Sauces.deleteMany({}).then(()=>console.log("all removed"))
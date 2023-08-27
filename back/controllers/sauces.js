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
    const  sauce = JSON.parse(req.body.sauce)

    const {name, manufacturer, description, mainPepper, heat, userId} = sauce

    console.log({body: req.body.sauce})
    console.log({file: req.file})

    const imageUrl = req.file.destination+ req.file.filename
    console.log({imagePath: imageUrl})

    const sauceProduct = new Sauces({
        userId,                                 //on peut se le permettre en JS car pareil que userId:userdId
        manufacturer,
        description,
        mainPepper,
        imageUrl,
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked : []
    })
    sauceProduct.save().then((res)=> console.log("Success saved Sauces", res )).catch(console.error)
}

module.exports = {getSauces, createSauce} 



//Sauces.deleteMany({}).then(()=>console.log("all removed"))
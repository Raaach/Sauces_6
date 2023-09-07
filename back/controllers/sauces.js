const mongoose = require('mongoose');
const {unlink} = require("fs");
 

const saucesSchema = new mongoose.Schema({
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

const Sauces =  mongoose.model("Sauces", saucesSchema)



function getSauces( req, res){                                    //cette fontion est a utiliser en interne
        Sauces.find({})
        .then((sauces) => res.send(sauces))
        .catch((error) => res.status(500).send(error))
    }

// async function getSaucesById(req,res){
//     try {
//         const {id} = req.params
//         const sauce = await Sauces.findById(id)
//             res.send(sauce)
//     } catch(error){
//         res.status(500).send(error)}
// }

//identique à :

function getSaucesById(req, res){
    const {id} = req.params
    Sauces.findById(id)
    .then((sauce) =>res.send(sauce))
    .catch(console.error)
}

function deleteSauces(req,res){
    const {id} = req.params

    Sauces.findByIdAndDelete(id)
        .then(deleteSaucesImage)
        .then(sauce => res.send({message: sauce}))
        .catch((err) => res.status(500).send({message: err}))
}

function deleteSaucesImage(sauce) {
    const imageUrl = sauce.imageUrl
    const fileDelete = imageUrl.split('/').at(-1)
    unlink(`images/${fileDelete}`, (err)=>{
    console.error("Problem deleting Image", err)
    })
    return sauce
}


function createSauce(req, res){
    const {body,file}= req
    const {fileName} = file
    const  sauce = JSON.parse(body.sauce) //on le transforme en objet avec JSON.parsew
    const {name, manufacturer, description, mainPepper, heat, userId} = sauce

    function makeImageUrl(req, fileName) {
        return req.protocol +"://"+ req.get("host") + "/images/"+fileName
    }

    const sauceProduct = new Sauces({
        userId,                                 //on peut se le permettre en JS car pareil que userId:userdId
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: makeImageUrl(req,fileName),
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked : []
    })
    sauceProduct
        .save()
        .then((message)=> {
            res.status(201).send({message})
            return console.log("Success saved Sauces", message )
        })
        .catch(console.error)
}

module.exports = {getSauces, createSauce, getSaucesById, deleteSauces} 



//Sauces.deleteMany({}).then(()=>console.log("all removed"))
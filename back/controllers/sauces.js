const { response } = require('express');
const mongoose = require('mongoose');
const unlink = require("fs").promises.unlink;
 

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
    .then((sauce) => clientResSend(sauce,res))
    .catch((err) => res.status(500).send({message: err}))
    //.then(deleteSaucesImage)
}

// function deleteSaucesImage(sauce) {
    // const {imageUrl} = sauce     // c'est identique à imageUrl = sauce.imageUrl
    // const fileDelete = imageUrl.split('/').at(-1)
    // return unlink(`images/${fileDelete}`).then(()=> sauce)   //unlink va suprimer quelque chose du dossier
// }

function modifySauce(req,res){
    const {
        params: {id}
    } = req

    const {body} = req
    console.log("body and params:", body, id)

    const hasNewImage = req.file != null  // boolean
    console.log('hasNewImage:', hasNewImage);


    //mise a jour database
    Sauces.findByIdAndUpdate(id, body)
    .then((responseDB) => clientResSend(responseDB,res))
    .catch((err) => console.error("probleme update",err))
}

function clientResSend(sauce, res) {
    if (sauce == null){
        console.log("Rien à mettre à jour ")
        return res.status(404).send({message: " Object non trouvé sur database"})
    }
    console.log("update validate:",sauce)
    res.status(200).send({message: "mise à jour réussi"})
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
        .then((message)=>res.status(201).send({message}))
        .catch((err) => res.status(500).send({message}))
}

module.exports = {getSauces, createSauce, getSaucesById, deleteSauces, modifySauce} 



//Sauces.deleteMany({}).then(()=>console.log("all removed"))
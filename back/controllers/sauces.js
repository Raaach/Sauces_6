const mongoose = require('mongoose');
const {unlink} = require('fs/promises');
 

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
    .then((sauceItem)=> deleteImage(sauceItem))
    .then((res)=>console.log('file deleted',res))
    .catch((err) => res.status(500).send({message: err}))
    //.then(deleteSaucesImage)
}

// function deleteSaucesImage(sauce) {
    // const {imageUrl} = sauce     // c'est identique à imageUrl = sauce.imageUrl
    // const fileDelete = imageUrl.split('/').at(-1)
    // return unlink(`images/${fileDelete}`).then(()=> sauce)   //unlink va suprimer quelque chose du dossier
// }

function modifySauce(req,res){
    const {params: {id}} = req // recupère les données de la requete

    const hasNewImage = req.file != null  // boolean s'il y a une new image ou pas// s'il y a un req.file donc new image
    const payload = makePayload(hasNewImage, req) // et tu nous fabrique un payload


    //mise a jour database
    Sauces.findByIdAndUpdate(id, payload)
    .then((responseDB) => clientResSend(responseDB,res))
    .then((sauce)=> deleteImage(sauce))
    .then((res)=>console.log('file deleted',res))
    .catch((err) => console.error("probleme update",err))
}

function deleteImage(sauce){
    if (sauce == null) return 
    console.log('delete images',sauce)
    const imageToDelete = sauce.imageUrl.split('/').at(-1)
    return unlink("images/" + imageToDelete) // penser à mettre des return a la fin d'une promesse
}

function makePayload (hasNewImage, req){
    console.log('hasNewImage:', hasNewImage)
    if (!hasNewImage) return req.body // s'il n'y a pas de nouvelle image alors return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log('nouvelle image à gerer')
    console.log('voici le body', payload)
    return payload
}

function clientResSend(sauce, res) {
    if (sauce == null){
        console.log("Rien à mettre à jour ")
        return res.status(404).send({message: " Object non trouvé sur database"})
    }
    console.log("update validate:",sauce)
    return Promise.resolve(res.status(200).send({message: "mise à jour réussi"})).then(()=> sauce)
}


function makeImageUrl(req, fileName) {
    return req.protocol +"://"+ req.get("host") + "/images/"+fileName
}
function createSauce(req, res){
    const {body,file}= req
    const {fileName} = file
    const  sauce = JSON.parse(body.sauce) //on le transforme en objet avec JSON.parsew
    const {name, manufacturer, description, mainPepper, heat, userId} = sauce


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
// Ce code est une partie d'une application Node.js utilisant le framework Mongoose pour interagir avec une base de données MongoDB. 
// L'application gère des données relatives à des sauces et permet aux utilisateurs de créer, lire, mettre à jour, 
// supprimer et voter pour des sauces

//** importation dépendances **//
const mongoose = require('mongoose');           //une bibliothèque pour intéragir avec mongoDB
const {unlink} = require('fs/promises');        //pour suprimer des fichiers, ici des images
const {saucesSchema} = require('../models/sauceSchema')
 

const Sauces =  mongoose.model("Sauces", saucesSchema)



function getSauces(req, res){                                    //cette fontion est a utiliser en interne
        Sauces.find({})
        .then((sauces) => res.send(sauces))
        .catch((error) => res.status(500).send(error))
    }
    
//** récuperer sauce par son Id refactorer **//
function getSauce(req, res) {
    const {id} = req.params
    return Sauces.findById(id)
}
//** obtenir la sauce par Id **//
function getSaucesById(req, res){
    getSauce(req,res)
        .then((sauce) => clientResSend(sauce, res))
        .catch((err) => res.status(500).send(err))
}

//** suppression de la sauce **//
function deleteSauces(req,res){
    const {id} = req.params

    Sauces.findByIdAndDelete(id)
    .then((sauce) => clientResSend(sauce,res))
    .then((sauceItem)=> deleteImage(sauceItem))
    .then((res)=> console.log('file deleted',res))
    .catch((err) => res.status(500).send({message: err}))
}
//** modifier la sauce **//
function modifySauce(req,res){
    const {params: {id}} = req                                              // recupère les données de la requete

    const hasNewImage = req.file != null                                    // boolean s'il y a une new image ou pas
                                                                            // s'il y a un req.file donc new image
    const payload = makePayload(hasNewImage, req)                           // et tu nous fabrique un payload


    //mise a jour database
    Sauces.findByIdAndUpdate(id, payload)
    .then((responseDB) => clientResSend(responseDB,res))
    .then((sauce)=> deleteImage(sauce))
    .then((res)=>console.log('file deleted',res))
    .catch((err) => console.error("probleme update",err))
}

//** supression image **//
function deleteImage(sauce){
    if (sauce == null) return 
    //console.log('delete images',sauce)
    const imageToDelete = sauce.imageUrl.split('/').at(-1)
    return unlink("images/" + imageToDelete)                                // penser à mettre des return a la fin d'une promesse
}

function makePayload (hasNewImage, req){
    //console.log('hasNewImage:', hasNewImage)
    if (!hasNewImage) return req.body                                       // s'il n'y a pas de nouvelle image alors return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    //console.log('nouvelle image à gerer')
    //console.log('voici le body', payload)
    return payload
}

function clientResSend(sauce, res) {
    if (sauce == null){
        return res.status(404).send({message: " Object non trouvé sur database"})
    }
    return Promise.resolve(res.status(200).send(sauce)).then(()=> sauce)
}

//** créé l'URL du fichier enregistré ici image **//
function makeImageUrl(req, fileName) {
    return req.protocol +"://"+ req.get("host") + "/images/"+fileName       
}

//** Créatin de la sauce **//
function createSauce(req, res){
    const {body,file}= req
    const {fileName} = file
    const  sauce = JSON.parse(body.sauce)                                   //on le transforme en objet avec JSON.parser
    const {name, manufacturer, description, mainPepper, heat, userId} = sauce


    const sauceProduct = new Sauces({
        userId,                                 //on peut se le permettre en JS car pareil que userId=userdId
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: makeImageUrl(req,fileName),
        heat : heat,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked :[]
    })
    sauceProduct
        .save()
        .then((message)=>res.status(201).send({message}))
        .catch((err) => res.status(500).send({message}))
}

//** like **//
function likeSauce(req,res){
    const {like, userId} = req.body
    if (![1,-1,0].includes(like)) return res.status(403).send({message: "Bad request"})//si c'est égale à autre que -1, 1 ou 0 alors message 403
    

    getSauce(req,res)                                      //quand cette fonction reçois
    .then((sauce) => updateVote(sauce, like, userId, res))//sauce depuis la base de donnée, elle lance la fonction updateVote
    .then(sauCCE => sauCCE.save())
    .then (prodcut  => clientResSend(prodcut, res))
    .catch((err) => res.status(500).send(err))
}

//** mise à jour du vote**//
function updateVote(sauce, like, userId, res){                              // cette fonction regarde si liek est égale à 1 ou -1
    if (like === 1 || like === -1) return incrementVote(sauce, userId, like)// on place le return
    return resetVote(sauce, userId, res)
}

//** reset vote **//
function resetVote(sauce, userId, res){
    const {usersLiked, usersDisliked} = sauce
    if ([usersLiked, usersDisliked].every(arr => arr.includes(userId)))  // avec every on vérifie dans chaque array
    return Promise.reject("User seems to have voted both ways")          // on le force à aller dans le point catch au-dessus

    if (![usersLiked, usersDisliked].some(arr => arr.includes(userId)))  //si aucune des array n'inclue userID alors return...
    return Promise.reject("user seems to have not voted")
        
    if (usersLiked.includes(userId)){
        --sauce.likes 
        sauce.usersLiked = sauce.usersLiked.filter (id => id !== userId )
    } else {
        --sauce.dislikes
        sauce.usersDisliked = sauce.usersDisliked.filter (id => id !== userId)
    }
    return sauce


}

//** vote des likes et dislikes **//
function incrementVote(sauce, userId, like){
    const {usersLiked, usersDisliked} = sauce

    const votersArray = like === 1 ? usersLiked : usersDisliked  //ternary operator, manière de vérifier si like = 1,
                                                                // si oui on cherche a pusher
                                                                // dans usersLiked, si non, alors on cherche à pusher dans usersDisliked

    if (votersArray.includes(userId)) return sauce              // si ça inclue userid dans l'array usersLiked
    votersArray.push(userId)

    like === 1 ? ++sauce.likes : ++sauce.dislikes // c'est exactement comme la ligne en dessous
    //     if (like === 1){
    // ++sauce.likes
    // }else{
    //     ++sauce.dislikes
    // }
    // console.log("produit après vote:", sauce)
    return sauce

}


module.exports = {getSauces, createSauce, getSaucesById, deleteSauces, modifySauce, likeSauce} 



//Sauces.deleteMany({}).then(()=>console.log("all removed"))
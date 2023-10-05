const {User}= require("../mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//**Création d'un utilisateur**//

async function createUser(req, res)  {
    try{                                        //récupérer émail et password via la requette HTTP 
    const email = req.body.email
    const password = req.body.password          // idem: const (email, password)= req.body

    const hashedPassword = await hashPassword(password) //Cette fonction prend password en argument et l'applique à l'algorithme de hachage bcrypt pour le sécuriser. Elle renvoie le mot de passe haché. 

    const user = new User({email, password: hashedPassword})
    await user.save()
    res.status(201).send({message : "Utilisateur enregistré !"}) //(201)= ressource créée
    }
    catch(err){
            res.status(409).send({message: "User pas enregitré:" + err}) //(409)= conflit
    }
}

function hashPassword(password) {
    const saltRounds = 10                           // nombre d'itérarions
    return bcrypt.hash(password, saltRounds)
}


//** Cette fonction gère le processus de connexion de l'utilisateur **// 

async function logUser(req,res){
    try{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email})

    const isPasswordOk = await bcrypt.compare(password,user.password)
    if (!isPasswordOk) {
        res.status(403).send({message: 'Mot de passe incorecte'})
    }

    //puis compare le mot de passe fourni avec le mot de passe haché stocké en base de données. 
    // Si le mot de passe correspond, 
    // elle génère un jeton JWT (JSON Web Token) signé avec la clé secrète JWT, 
    // qui peut être utilisé pour authentifier l'utilisateur.

    const token = creatEmailToken(email)
    res.status(200).send({userId: user?._id, token: token})
    }
    catch(err){
        console.error(err)
        res.status(500).send({message:" Erreur interne"})
    }
}
//** Cette fonction génère un jeton à partir de l'émail utilisateur **//

function creatEmailToken(email){
    const passwordJwt = process.env.JWT_PASSWORD
    return jwt.sign({email: email}, passwordJwt, {expiresIn: "200h"})
}
//User.deleteMany({}).then(()=>console.log("all removed"))
module.exports ={createUser, logUser}
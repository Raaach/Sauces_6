const {User}= require("../mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


async function createUser(req, res)  {
    try{
    const email = req.body.email
    const password = req.body.password          // idem: const (email, password)= req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({email, password: hashedPassword})
    await user.save()
    res.status(201).send({message : "Utilisateur enregistré !"}) //(201)= ressource créée
    }
    catch(err){
            res.status(409).send({message: "User pas enregitré:" + err}) //(409)= conflit
    }
}

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

async function logUser(req,res){
    try{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email})

    const isPasswordOk = await bcrypt.compare(password,user.password)
    if (!isPasswordOk) {
        res.status(403).send({message: 'Mot de passe incorecte'})
    }
    const token = creatEmailToken(email)
    res.status(200).send({userId: user?._id, token: token})
    }
    catch(err){
        console.error(err)
        res.status(500).send({message:" Erreur interne"})
    }
}

function creatEmailToken(email){
    const passwordJwt = process.env.JWT_PASSWORD
    return jwt.sign({email: email}, passwordJwt, {expiresIn: "12h"})
}
//User.deleteMany({}).then(()=>console.log("all removed"))
module.exports ={createUser, logUser}
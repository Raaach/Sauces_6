const {User}= require("../mongo")
const bcrypt = require("bcrypt")


async function createUser(req, res)  {
    const email = req.body.email
    const password = req.body.password          // idem: const (email, password)= req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({email, password: hashedPassword})

    user
        .save()
        .then(()=> res.status(201).send({message : "Utilisateur enregistré !"})) //(201)= ressource créée
        .catch((err)=> res.status(409).send({message: "User pas enregitré:" + err})) //(409)= conflit
    }

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

function logUser(req,res){
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email}).then(console.log)

}

module.exports ={createUser, logUser}
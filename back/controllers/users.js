const {User}= require("../mongo")
const bcrypt = require("bcrypt")


async function createUser(req, res)  {
    const email = req.body.email
    const password = req.body.password          // idem: const (email, password)= req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({email, password: hashedPassword})

    user
        .save()
        .then(()=> res.send({message : "Utilisateur enregistré !"}))
        .catch(err=> console.log("User pas enregitré!", err))
    }

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

module.exports ={createUser}
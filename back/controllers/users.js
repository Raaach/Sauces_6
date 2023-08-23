const {User}= require("../mongo")


function createUser(req, res)  {
    const email = req.body.email
    const password = req.body.password          // idem: const (email, password)= req.body
    const user = new User({email, password})

    user
        .save()
        .then(()=> res.send({message : "Utilisateur enregistré !"}))
        .catch(err=> console.log("User pas enregitré!", err))
    }

module.exports ={createUser}
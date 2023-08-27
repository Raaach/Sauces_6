const jwt = require('jsonwebtoken')

function authUser(req, res, next){
    console.log("authticate user")
    const header = req.header("Authorization")
    if (header== null) return res.status(403).send({message:"invalid"})
    
    const token = header.split(" ")[1]
    if (token ==null) return res.status(403).send({message:"Token can't be null"})

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({message: "Token not valid"+ err})
        console.log("le token est valide, nous pouvons suivre la démarche")
        next()
    })
}

module.exports = {authUser}
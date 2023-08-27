const jwt = require('jsonwebtoken');

function getSauces(req,res){
    const header = req.header("Authorization")
    if (header== null) return res.status(403).send({message:"invalid"})
    
    const token = header.split(" ")[1]
    if (token ==null) return res.status(403).send({message:"Token can't be null"})

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => handleToken(err, decoded, res))

}

function handleToken(err, decoded, res){
    if (err) res.status(403).send({message: "Token not valid"+ err})
    else {
        console.log("Le token est valid",decoded)
        res.send({message: "Voici toutes les sauces"})
    }
}

module.exports = {getSauces} 
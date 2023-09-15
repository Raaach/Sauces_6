const {createUser,logUser} = require("../controllers/users")
const express = require('express');
const authRouter = express.Router()


authRouter.post("/signup", createUser );          // req,res => createUser(req,res)
authRouter.post("/login",logUser);

module.exports = {authRouter}
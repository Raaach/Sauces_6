//Database
const mongoose= require("mongoose");
const password = process.env.DB_password;
const username = process.env.DB_username;
const uri = 
    `mongodb+srv://${username}:${password}@nicolas.4q71gdx.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then((()=>console.log("Connected to Mongo!")))
    .catch(err => console.error ("Error connecting to mongo:" , err))

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}
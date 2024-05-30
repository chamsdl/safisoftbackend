const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');


const VendeurSchema = new mongoose.Schema({
    username: { type: String, required: true },
    nom:{ type: String, required: true },
    prenom:{ type: String, required: true },
    cin:{ type: String, required: true },
    tel:{type:Number,required: true },
    password: { type: String },
    email: { type: String, required: true },
  
});

VendeurSchema.plugin(passportLocalMongoose);
VendeurSchema.plugin(findOrCreate);
const Vendeur = mongoose.model('Vendeur', VendeurSchema);
module.exports=Vendeur;
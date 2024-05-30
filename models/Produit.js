const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ProduitSchema = new mongoose.Schema({
    nom: { type: String },
    prix: { type: Number },
    description:String,
    code:{ type: Number},
    quantiteStock: { type: Number},
    quantiteVendu:{ type: Number },
  
});

const Produit = mongoose.model('Produit', ProduitSchema);
module.exports=Produit;
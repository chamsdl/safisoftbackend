const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
    produits: Array,
    date: { type: Date, default: Date.now },
    idvendeur:String,
    nomVendeur:String,
    montanttotal:Number
    

});
const Commande = mongoose.model('Commande', CommandeSchema);
module.exports=Commande;
const mongoose = require('mongoose');

const FournisseurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    adresse: { type: String, required: true }
});

const Fournisseur = mongoose.model('Fournisseur', FournisseurSchema);
module.exports = Fournisseur;

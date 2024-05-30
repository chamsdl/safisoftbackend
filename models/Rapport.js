const mongoose = require('mongoose');
const RapportSchema = new mongoose.Schema({
    contenu: { type: String, required: true },
    dateCreation: { type: Date, default: Date.now },
    // Add other fields specific to Rapport
});

const Rapport = mongoose.model('Rapport', RapportSchema);
module.exports=Rapport;
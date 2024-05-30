const mongoose = require('mongoose');
const DepotSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    nomresponsable :{ type: String, required: true },
    capaciteMax: { type: Number},

});
    
const Depot = mongoose.model('Depot', DepotSchema);
module.exports=Depot;
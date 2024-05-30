const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String},
    nom:{type:String},
    prenom:{type:String},
    cin:{type:String},
    tel:{type:String}
});


AdminSchema.plugin(passportLocalMongoose);

AdminSchema.plugin(findOrCreate);

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;

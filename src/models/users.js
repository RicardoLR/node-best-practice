
'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let UserSchema = new Schema({
    correo: {type: String},
    // correo: {
    //   type: String, required: true,
    //   trim: true, // unique: true,
    //   match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    // },
    firstName: {type: String},
    lastName: {type: String}
});

module.exports = mongoose.model( 'User', UserSchema )

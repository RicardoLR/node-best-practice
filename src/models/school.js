
'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

let SchoolSchema = Schema({
    name: {type: String},
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueno: { type: Schema.Types.ObjectId, ref: 'User' }
});
  
module.exports = mongoose.model( 'School', SchoolSchema )

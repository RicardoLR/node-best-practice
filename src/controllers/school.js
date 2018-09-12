'use strict'

const Validator = require('validatorjs');
const School = require('../models/school')

module.exports = {
    
    createSchool: async (req, res, next ) => {
         
        var rules = {
            name: 'required'
        };
         
        var validation = new Validator(req.body, rules);

       if( validation.passes() ){
            const newSchool = new School(req.body)
            const school = await newSchool.save();            
            res.status(200).json({school});
        } else 
            res.status(500).json( {error : 'error en validation rules'} );

    },

    getAllSchools: async (req, res, next ) => {
        const schools = await School.find().populate('dueno').populate('users')
        console.log("schools", schools);

        res.status(200).json({ schools});
    },


    prueba: async (req, res, next ) => {
         
        res.status(200).json({school: "prueba"});

    }

}


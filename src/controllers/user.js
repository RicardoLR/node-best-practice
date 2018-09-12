'use strict'

const Validator = require('validatorjs');

const User = require('../models/users')


module.exports = {
    
    createUser: async (req, res, next ) => {
         
        var rules = {
            correo: 'required|email',
            lastName: 'required',
            firstName: 'required'
        };
         
        var validation = new Validator(req.body, rules);

       if( validation.passes() ){
            const newUser = new User(req.body)
            const user = await newUser.save();            
            res.status(200).json({user});
        } else 
            res.status(500).json( {error : 'error en validation rules'} );
    },

    getAllUsers: async (req, res, next ) => {
        const users = await User.find();
        res.status(200).json({users});
    },
  
    getByIdUser: async (req, res, next ) => {
        const { userId } = req.params
        const user = await User.findById(userId)

        res.status(200).json({user})
    },
      
    getUser: async (req, res, next ) => {
        const { userId } = req.params
        const user = await User.findById(userId)

        res.status(200).json({user})
    },

    // PUT
    updateUser: async (req, res, next ) => {
        const { userId } = req.params
        const newUser = req.body;
        const oldUser = user.findByIdAndUpdate(userId, newUser)

        res.status(200).json( {success:true, oldUser} )        
    },

    deleteUser: async (req, res, next ) => {
        const { userId } = req.params
        const oldUser = user.remove({userId})

        res.status(200).json( {success:true, oldUser} ) 
    },

  
}
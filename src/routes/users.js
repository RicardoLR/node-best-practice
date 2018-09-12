
'use strict'

const router = require('express-promise-router')();


// destructuring
const {
    createUser,
    getAllUsers,
    getByIdUser,
    updateUser,
    deleteUser
} = require('../controllers/user')

router.get( '/', getAllUsers)
router.post( '/', createUser)

router.get( '/:userId', getByIdUser)
router.put( '/:userId', updateUser)
router.delete( '/:userId', deleteUser)

module.exports = router;

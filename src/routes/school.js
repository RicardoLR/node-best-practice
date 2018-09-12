'use strict'

const router = require('express-promise-router')();

// destructuring
const {
    createSchool,
    getAllSchools,
    prueba
} = require('../controllers/school')

router.get( '/prueba', prueba)
router.get( '/', getAllSchools)
router.post( '/', createSchool)


module.exports = router;

'use strict'

const moment = require('moment');
const CronJob = require('cron').CronJob;

const {
    MiController
} = require('../controllers/user')


exports.jobExample = function() {

    const job = new CronJob({
        cronTime: '0 */2 * * * *', // cada 5 minutos
        onTick: function() {
            console.log("Modificando por job");
            MiController();
        },
        start: false,
        timeZone: 'America/Los_Angeles'
    });

    job.start();
    
    console.log("job", job._timeout._idleTimeout)
    
}



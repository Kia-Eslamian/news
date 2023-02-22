// packages
const router = require('express').Router();


// sub routers
const v1Router = require('./v1/v1');



// sub routes
router.use('/v1', v1Router);




module.exports = router;
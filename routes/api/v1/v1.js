// packages
const router = require('express').Router();


// sub routers
const privateRouter = require('./private/private');
const publicRouter = require('./public/public');



// sub routes
router.use('/private', privateRouter);
router.use('/public', publicRouter);




module.exports = router;
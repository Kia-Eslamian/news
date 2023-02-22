// packages
const router = require('express').Router();


// sub routers
const adminRouter = require('./admin/admin');
const articleRouter = require('./article/article');


// sub routes
router.use('/admin', adminRouter);
router.use('/article', articleRouter);


module.exports = router;
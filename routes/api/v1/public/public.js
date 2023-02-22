// packages
const router = require('express').Router();

// sub routers
const authRouter = require('./auth/auth');
const articleRouter = require('./article/article');

// sub routes
router.use('/auth', authRouter);
router.use('/article', articleRouter);



module.exports = router;
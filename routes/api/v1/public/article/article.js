// packages
const router = require('express').Router();

// models
const articleModel = require('../../../../../models/article/article');

// sub routers
const categoryRouter = require('./articleCategory/articleCategory');
const commentRouter = require('./comment/comment');

// sub routes
router.use('/category', categoryRouter);
router.use('/comment', commentRouter);


// get article list
router.get('/', async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server erro"
        });
    }
});


// get single article
router.get('/article_id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


module.exports = router;
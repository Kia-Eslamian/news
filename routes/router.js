// packages
const router = require('express').Router();
const {join} = require('path');

// sub routers
const apiRouter = require('./api/api');


// sub routes
router.use('/api', apiRouter);

// blog -> article, comment, like
// auth -> admin
// admin -> article, comment, like, admins,


// home page
router.get('/', async (req, res) => {
    try {

        return res.render(join(__dirname, '../views/pages/home.ejs'));

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// author page
router.get('/author', async (req, res) => {
    try {

        return res.render(join(__dirname, '../views/pages/author.ejs'));

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// post page
router.get('/post', async (req, res) => {
    try {

        return res.render(join(__dirname, '../views/pages/post.ejs'));

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


module.exports = router;
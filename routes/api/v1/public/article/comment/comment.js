// packages
const router = require('express').Router();

// models
const articleModel = require('../../../../../../models/article/article');
const commentModel = require('../../../../../../models/article/comment');


// get comment list
router.get('/', async (req, res) => {
    try {

        const comments = await commentModel.find({status: "CONFIRMED"}).select({email: 0});

        return res.status(200).json({
            success: true,
            data: {result: comments}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// create new comment
router.post('/:article_id', async (req, res) => {
    try {

        const article_id = req.params['article_id'];
        const message = req.body['message'];
        const email = req.body['email'];
        const name = req.body['name'];

        const article = await articleModel.findById(article_id);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "مقاله مورد نظر یافت نشد"
            });
        }

        await commentModel.create({
            article: article._id,
            message,
            email,
            name: name ? name : 'Unknown user'
        });

        return res.status(200).json({
            success: true,
            message: "نظر شما ثبت شد و پس از بررسی منتشر خواهد شد"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


module.exports = router;
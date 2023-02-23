// packages
const router = require('express').Router();

// models
const articleModel = require('../../../../../models/article/article');
const adminModel = require('../../../../../models/admin/admin');

// modules
const articleImageUploader = require('../../../../../modules/articleImageUploader');

// sub routers
const articleCategoryRouter = require('./articleCategory/articleCategory');
const commentCategoryRouter = require('./comment/comment');

// sub routes
router.use('/category', articleCategoryRouter);
router.use('/comment', commentCategoryRouter);


// create new article
router.post('/', articleImageUploader, async (req, res) => {
    try {

        const {
            title,
            page_title,
            url,
            description,
            summary,
            author
        } = req.body;

        const admin = await adminModel.findById(author);
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "ادمین یافت نشد"
            });
        }

        await articleModel.create({
            title,
            page_title,
            url,
            description,
            summary,
            author: admin._id
        });

        return res.status(200).json({
            success: true,
            message: "مقاله ساخته شد"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// delete article
router.delete('/:article_id', async (req, res) => {
    try {

        const article = await articleModel.findById(req.params["article_id"]);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "مقاله یافت نشد"
            });
        }

        let message;
        if (article.isDelete === true) {
            article.isDelete = false;
            message = "مقاله حذف شد";
        } else {
            article.isDelete = true;
            message = "مقاله بازگردانده شد";
        }

        await article.save();

        return res.status(200).json({success: true, message});


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// publish article
router.patch('/publish/:article_id', async (req, res) => {
    try {

        const article = await articleModel.findById(req.params["article_id"]);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "مقاله یافت نشد"
            });
        }

        let message;
        if (article.isPublished === true) {
            article.isPublished = false;
            message = "مقاله منتشر شد";
        } else {
            article.isPublished = true;
            message = "مقاله از حالت انتشار برداشته شد";
        }

        await article.save();

        return res.status(200).json({success: true, message});


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// update article
router.patch('/:article_id', async (req, res) => {
    try {

        const fields = {
            title,
            page_title,
            url,
            description,
            summary
        } = req.body;

        const result = await articleModel.findByIdAndUpdate(req.params['article_id'], fields);
        if (!result) {
            return res.status(400).json({success: false, message: "مقاله یافت نشد"});
        }

        return res.status(200).json({
            success: true,
            message: "مقاله ویرایش شد"
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
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
            author,
            category
        } = req.body;

        const admin = await adminModel.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "admin not found"
            });
        }

        const articleData = {
            title,
            page_title,
            url: title,
            description,
            summary,
            author: admin._id,
            category
        };

        if (req?.file?.filename) articleData.image = req.file.filename;


        await articleModel.create(articleData);

        return res.status(200).json({
            success: true,
            message: "article created"
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
router.get('/remove/:article_id', async (req, res) => {
    try {

        const article = await articleModel.findById(req.params["article_id"]);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "article not found"
            });
        }

        let message;
        if (article.isDelete === true) {
            article.isDelete = false;
            message = "article removed";
        } else {
            article.isDelete = true;
            message = "article restored";
        }

        await article.save();

        return res.status(200).json({ success: true, message });


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

        return res.status(200).json({ success: true, message });


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
            return res.status(400).json({ success: false, message: "مقاله یافت نشد" });
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

// get article list
router.get('/', async (req, res) => {
    try {

        const category_id = req.query['category'];


        const aggregationPipeline = []
        if (category_id !== undefined) {
            const category = await categoryModel.findById(category_id);
            if (category) {
                aggregationPipeline.push(
                    {
                        '$match': {
                            category: category._id,
                            // isDelete: false
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'admins',
                            'localField': 'author',
                            'foreignField': '_id',
                            'as': 'author'
                        }
                    }, {
                    '$unwind': {
                        'path': '$author',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'articleCategories',
                        'localField': 'categories',
                        'foreignField': '_id',
                        'as': 'categories'
                    }
                }, {
                    '$lookup': {
                        'from': 'comments',
                        'localField': 'comments',
                        'foreignField': '_id',
                        'as': 'comments'
                    }
                },
                    // {
                    //     '$project': {
                    //         'title': 1,
                    //         'page_title': 1,
                    //         'url': 1,
                    //         'description': 1,
                    //         'summary': 1,
                    //         'image': 1,
                    //         'author.firstName': 1,
                    //         'author.lastName': 1,
                    //         'categories.title': 1,
                    //         'comments': 1,
                    //         'createdAt': 1,
                    //         'updatedAt': 1,
                    //         'isDeleted': 1
                    //     }
                    // }
                );
            }

        } else {
            aggregationPipeline.push(
                {
                    '$match': {
                        // isDelete: false
                    }
                },
                {
                    '$lookup': {
                        'from': 'admins',
                        'localField': 'author',
                        'foreignField': '_id',
                        'as': 'author'
                    }
                }, {
                '$unwind': {
                    'path': '$author',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'articleCategories',
                    'localField': 'categories',
                    'foreignField': '_id',
                    'as': 'categories'
                }
            }, {
                '$lookup': {
                    'from': 'comments',
                    'localField': 'comments',
                    'foreignField': '_id',
                    'as': 'comments'
                }
            },
                //  {
                //     '$project': {
                //         'title': 1,
                //         'page_title': 1,
                //         'url': 1,
                //         'description': 1,
                //         'summary': 1,
                //         'image': 1,
                //         'author.firstName': 1,
                //         'author.lastName': 1,
                //         'categories.title': 1,
                //         'comments': 1,
                //         'createdAt': 1,
                //         'updatedAt': 1,
                //         'isDeleted': 1
                //     }
                // }
            );
        }

        const articles = await articleModel.aggregate(aggregationPipeline);

        return res.status(200).json({
            success: true,
            data: { result: articles }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server erro"
        });
    }
});

module.exports = router;
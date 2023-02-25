// packages
const router = require('express').Router();

// models
const articleModel = require('../../../../../models/article/article');
const categoryModel = require('../../../../../models/article/articleCategory');

// sub routers
const categoryRouter = require('./articleCategory/articleCategory');
const commentRouter = require('./comment/comment');

// sub routes
router.use('/category', categoryRouter);
router.use('/comment', commentRouter);


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
                            isDelete: false
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
                }, {
                    '$project': {
                        'title': 1,
                        'page_title': 1,
                        'url': 1,
                        'description': 1,
                        'summary': 1,
                        'image': 1,
                        'author.firstName': 1,
                        'author.lastName': 1,
                        'categories.title': 1,
                        'comments': 1,
                        'createdAt': 1,
                        'updatedAt': 1
                    }
                }
                );
            }

        } else {
            aggregationPipeline.push(
                {
                    '$match': {
                        isDelete: false
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
            }, {
                '$project': {
                    'title': 1,
                    'page_title': 1,
                    'url': 1,
                    'description': 1,
                    'summary': 1,
                    'image': 1,
                    'author.firstName': 1,
                    'author.lastName': 1,
                    'categories.title': 1,
                    'comments': 1,
                    'createdAt': 1,
                    'updatedAt': 1
                }
            }
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


// get single article
router.get('/:article_id', async (req, res) => {
    try {

        const article_id = req.params['article_id'];

        const article = await articleModel.findById(article_id);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "article not found"
            });
        }

        const articles = await articleModel.aggregate(
            [
                {
                    '$match': {
                        _id: article._id
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
                }, {
                    '$project': {
                        'title': 1,
                        'page_title': 1,
                        'url': 1,
                        'description': 1,
                        'summary': 1,
                        'image': 1,
                        'author.firstName': 1,
                        'author.lastName': 1,
                        'categories.title': 1,
                        'comments': 1,
                        'createdAt': 1,
                        'updatedAt': 1
                    }
                }
            ]
        );

        return res.status(200).json({
            success: true,
            data: { result: articles[0] }
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
// packages
const router = require('express').Router();

// models
const commentModel = require('../../../../../../models/article/comment');
const articleModel = require('../../../../../../models/article/article');


// get comment list
router.get('/', async (req, res) => {
    try {

        const comments = await commentModel.aggregate([
            // {
            //     '$match':{
            //         status:{$ne:'TRASHED'}
            //     }
            // },
            {
                '$lookup': {
                    'from': 'articles',
                    'localField': 'article',
                    'foreignField': '_id',
                    'as': 'article'
                }
            }, {
                '$unwind': {
                    'path': '$article',
                    'preserveNullAndEmptyArrays': true
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: { result: comments }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// get single comment
router.get('/:comment_id', async (req, res) => {
    try {

        const comment = await commentModel.findById(req.params["comment_id"]);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "نطر یافت نشد"
            });
        }

        return res.status(200).json({
            success: true,
            data: { result: comment }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// save comment status
router.get('/status/confirm/:comment_id', async (req, res) => {
    try {

        const comment_id = req.params['comment_id'];


        const comment = await commentModel.findById(comment_id);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "کامنت یافت نشد"
            });
        }

        const article = await articleModel.findById(comment.article);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "مقاله یافت نشد"
            });
        }

        if (article.comments.includes(comment._id)) {
            return res.status(200).json({
                success: true,
                message: 'comment saved'
            });
        }

        await articleModel.findByIdAndUpdate(article._id, { $push: { comments: comment._id } });
        await commentModel.findByIdAndUpdate(comment._id, { status: "CONFIRMED" });

        return res.status(200).json({
            success: true,
            message: 'comment saved'
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


// remove comment status
router.get('/status/remove/:comment_id', async (req, res) => {
    try {

        const comment_id = req.params['comment_id'];


        const comment = await commentModel.findById(comment_id);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "کامنت یافت نشد"
            });
        }

        const article = await articleModel.findById(comment.article);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "مقاله یافت نشد"
            });
        }

        if (!article.comments.includes(comment._id)) {
            return res.status(200).json({
                success: true,
                message: 'comment removed'
            });
        }

        await articleModel.findByIdAndUpdate(article._id, { $pull: { comments: comment._id } });
        await commentModel.findByIdAndUpdate(comment._id, { status: "TRASHED" });

        return res.status(200).json({
            success: true,
            message: 'comment removed'
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
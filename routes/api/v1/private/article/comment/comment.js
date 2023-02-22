// packages
const router = require('express').Router();

// models
const commentModel = require('../../../../../../models/article/comment');
const articleModel = require('../../../../../../models/article/article');


// get comment list
router.get('/', async (req, res) => {
    try {

        const comments = await commentModel.find({});

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
            data: {result: comment}
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// change comment status
router.patch('/status/:comment_id', async (req, res) => {
    try {

        const comment_id = req.params['comment_id'];
        const status = req.body['status'];


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

        if (status === 'CONFIRMED') {

            comment.status === status;
            await comment.save();

            article.comments.push(comment._id);
            await article.save();

        } else if (status === "TRASHED") {
            comment.status === status;
            await comment.save();
        }

        return res.status(200).json({
            success: true,
            message: `وضعیت کامنت به ${status} تغییر کرد`
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
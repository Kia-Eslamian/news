// packages
const router = require('express').Router();
const { join } = require('path');
const ejs = require('ejs');

// sub routers
const apiRouter = require('./api/api');
const express = require("express");
const articleModel = require("../models/article/article");


// sub routes
router.use('/api', apiRouter);

// serve images
router.use('/serve',
    express.static(
        config.path.articleImage,
        { extensions: [`jpg`, `jpeg`, `png`, 'webp', 'svg'] }
    )
);

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

// post page
router.get('/article/:article_id', async (req, res) => {
    try {

        const article_id = req.params['article_id'];

        const article = await articleModel.findById(article_id);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "article not found"
            });
        }

        const targetArticle = (await articleModel.aggregate(
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
        ))[0];

        // console.log('targetArticle => ', targetArticle);

        const templatePath = join(__dirname, '../views/pages/post.ejs');

        return res.render(templatePath, { targetArticle });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// comment page
router.get('/admin/comments', async (req, res) => {
    try {

        return res.render(join(__dirname, '../views/pages/comment.ejs'));


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// articles page
router.get('/admin/articles', async (req, res) => {
    try {

        return res.render(join(__dirname, '../views/pages/article.ejs'));


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// update article page
router.get('/admin/article/update/:article_id', async (req, res) => {
    try {

        const article_id = req.params['article_id'];

        const article = await articleModel.findById(article_id);
        if (!article) {
            return res.status(400).json({
                success: false,
                message: "article not found"
            });
        }

        const targetArticle = (await articleModel.aggregate(
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
        ))[0];

        const templatePath = join(__dirname, '../views/pages/updateArticle.ejs');

        return res.render(templatePath, { targetArticle });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;
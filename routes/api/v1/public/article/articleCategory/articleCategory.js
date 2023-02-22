// packages
const router = require('express').Router();

// models
const categoryModel = require('../../../../../../models/article/articleCategory');

// get category list
router.get('/', async (req, res) => {
    try {

        const categories = await categoryModel.find({}).select({admin: 0});

        return res.status(200).json({
            success: true,
            data: {result: categories}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// get single category
router.get('/:category_id', async (req, res) => {
    try {

        const category_id = req.params['category_id'];

        const category = await categoryModel.findById(category_id).select({admin: 0});
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "دسته بندی یافت نشد"
            });
        }

        return res.status(200).json({
            success: true,
            data: {result: category}
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
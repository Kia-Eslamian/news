// packages
const router = require('express').Router();
const bcrypt = require("bcryptjs");

// models
const adminModel = require('../../../../../models/admin/admin');

// sub routers
const authRouter = require('./auth/auth');
const managerRouter = require('./manager/manager');

// sub routes
router.use('/auth', authRouter);
router.use('/manager', managerRouter);


// get writer information
router.get('/', async (req, res) => {
    try {

        const admin_id = req.admin._id;

        const admin = await adminModel.findById(admin_id).select({ password: 0 });

        return res.status(200).json({
            success: true,
            data: { result: admin }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// update writer
router.patch('/', async (req, res) => {
    try {

        const admin_id = req.admin._id;

        const fields = {
            firstName,
            lastName,
            email,
            mobile,
            password,

        } = req.body;

        const mongoValidationErrors = [];

        if (fields.mobile) {
            const duplicatedUrl = await adminModel.findOne({ mobile });
            if (duplicatedUrl) {
                mongoValidationErrors.push(
                    {
                        value: mobile,
                        msg: " تکراری است url فیلد",
                        param: "url",
                        location: "body"
                    }
                )
            }
        }

        if (fields.email) {
            const duplicatedUrl = await adminModel.findOne({ email });
            if (duplicatedUrl) {
                mongoValidationErrors.push(
                    {
                        value: email,
                        msg: " تکراری است url فیلد",
                        param: "url",
                        location: "body"
                    }
                )
            }
        }

        //check mongoose validation fields
        if (mongoValidationErrors.length) {
            return res.status(422).json({
                success: false,
                message: "درخواست نامعتبر",
                invalidFields: mongoValidationErrors
            });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);


        if (fields.password) {
            fields.password = hashedPassword;
        }

        await adminModel.findByIdAndUpdate(admin_id, fields);

        return res.status(200).json({
            success: true,
            message: "admin updated"
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
// packages
const router = require('express').Router();
const bcrypt = require('bcryptjs');


// models
const adminModel = require('../../../../../models/admin/admin');


// login admin
router.post('/', async (req, res) => {
    try {

        const mobile = req.body['mobile'];
        const password = req.body['password'];

        const admin = await adminModel.findOne({ mobile });
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "موبایل اشتباه است"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "رمز عبور اشتباه است"
            });
        }

        if (admin.isDelete) {
            return res.status(400).json({
                success: false,
                message: "این نام کابری غیر فعال می باشد"
            });
        }

        const loggedInAdmin = await adminModel.findByIdAndUpdate(admin._id);

        /* create user session and active that */
        loggedInAdmin.isActive = true;
        req.session.admin = loggedInAdmin;

        return res.status(200).json({
            success: true,
            message: "logged in"
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
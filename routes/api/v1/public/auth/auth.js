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

        const admin = await adminModel.findOne({mobile});
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

        if (!admin.isActive) {
            return res.status(400).json({
                success: false,
                message: "این نام کابری غیر فعال می باشد"
            });
        }
        if (admin.isDelete) {
            return res.status(400).json({
                success: false,
                message: "این نام کابری غیر فعال می باشد"
            });
        }

        // const {
        //     adminSession,
        //     adminAccessToken
        // } = await adminRefreshTokenCreator({admin}, req, res);


        return res.status(200).json({
            success: true,
            message: "با موفقیت وارد شدید",
            // data: {
            //     access_token: adminAccessToken.accessToken,
            //     refresh_token: adminSession.refreshToken
            // }
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
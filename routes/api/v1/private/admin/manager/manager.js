// packages
const router = require('express').Router();
const bcrypt = require("bcryptjs");

// models
const adminModel = require('../../../../../../models/admin/admin');


(async () => {
    try {

        const isManagerExists = await adminModel.findOne({ firstName: 'admin', lastName: 'admin', email: 'admin@gmail.com' });
        if (!isManagerExists) {

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('admin', salt);

            await adminModel.create({
                firstName: 'admin',
                lastName: 'admin',
                email: 'admin@gmail.com',
                mobile: '0921',
                password: hashedPassword
            });

            console.log('default admin created');
        }

    } catch (error) {
        console.log('error in creating default manager -> ', error);
    }
})();



// create admin with manager role
router.post('/create-manager', async (req, res) => {
    try {

        const { firstName, lastName, email, mobile, password } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await adminModel.create({
            firstName,
            lastName,
            email,
            mobile,
            role: "MANAGER",
            password: hashedPassword
        });

        return res.status(200).json({
            success: true,
            message: "manager created"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// create admin with writer role
router.post('/', async (req, res) => {
    try {

        const { firstName, lastName, email, mobile, password } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await adminModel.create({
            firstName,
            lastName,
            email,
            mobile,
            role: "WRITER",
            password: hashedPassword
        });

        return res.status(200).json({
            success: true,
            message: "writer created"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// get admins list
router.get('/', async (req, res) => {
    try {

        const role = req.query['role'];

        const matchData = {};
        if (role) matchData.role = role;

        const admins = await adminModel.find(matchData).select({ password: 0 });


        return res.status(200).json({
            success: true,
            data: { result: admins }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// get single admin
router.get('/:admin_id', async (req, res) => {
    try {

        const admin_id = req.params['admin_id'];

        const admin = await adminModel.findById(admin_id).select({ password: 0 });
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "admin not found"
            });
        }

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

// update admin by manager
router.patch('/:admin_id', async (req, res) => {

    try {

        const admin_id = req.params['admin_id'];

        const admin = await adminModel.findById(admin_id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "admin not found"
            });
        }

        const fields = {
            firstName,
            lastName,
            email,
            mobile,

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

        await adminModel.findByIdAndUpdate(admin._id, fields);

        return res.status(200).json({
            success: true,
            message: 'ادمین مورد نظر با موفقیت ویرایش شد',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }


});

// admin activation
router.patch('/activation/:admin_id', async (req, res) => {
    try {

        const admin_id = req.params.admin_id;
        const activeStatus = req.body.activeStatus;

        const admin = await adminModel.findById(admin_id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "admin not found"
            });
        }

        if (activeStatus !== admin.isActive) {
            await adminModel.findByIdAndUpdate(admin._id, { isActive: activeStatus });
        }

        let message;
        if (activeStatus) {
            message = "وضعیت ادمین  فعال میباشد"
        } else {
            message = "وضعیت ادمین غیر فعال میباشد"
        }

        return res.status(400).json({
            success: false,
            message
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// delete admin
router.delete('/:admin_id', async (req, res) => {
    try {

        const admin_id = req.params["admin_id"];
        const deleteStatus = req.body.isDeleted;

        const admin = await adminModel.findById(admin_id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "ادمین پیدا نشد"
            });
        }

        if (deleteStatus !== admin.isDeleted) {
            await adminModel.findByIdAndUpdate(admin._id, { isDeleted: deleteStatus });
        }

        let message;
        if (deleteStatus) {
            message = "ادمین حذف شده است"
        } else {
            message = "ادمین حذف نشده است"
        }

        return res.status(400).json({
            success: false,
            message
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
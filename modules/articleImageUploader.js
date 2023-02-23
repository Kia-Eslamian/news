const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require("path");
const ShortUniqueId = require("short-unique-id");
const {v4: uuidv4} = require('uuid');


const fileFilter = (req, file, cb) => {
    try {

        const fileExtname = path.extname(file.originalname);

        const allowedMimeTypes = ["image/png", "image/jpg", "image/svg+xml", "image/jpeg", "image/webp"];
        const allowedExtname = [".png", ".jpg", ".jpeg", '.webp', ".svg"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            // cb(null, false)
            return cb(new Error('Mimetype is not allowed'))
        }

        if (!allowedExtname.includes(fileExtname)) {
            return cb(new Error('File extname is not allowed'))
        }

        return cb(null, true);

    } catch (error) {
        console.log(error);
        return cb(new Error('internal server error'))
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveAsPath = config.path.static.public.bankImage;
        // mkdirp.sync(saveAsPath, 0o700);
        mkdirp.sync(saveAsPath);
        return cb(null, saveAsPath)
    },

    filename: function (req, file, cb) {
        const uid = new ShortUniqueId({length: 6});

        const uniqueFilename = `${uid()}-${file.originalname}`;
        return cb(null, uniqueFilename)
    }
});

const upload = multer({
    limits: {
        files: 1,
        fileSize: (1048576 * 5)
    },
    storage,
    fileFilter
}).single('image');


module.exports = function (req, res, next) {
    try {

        upload(req, res, async function (e) {

            /* multer error */
            if (e) {

                if (e instanceof multer.MulterError) {

                    switch (e.message) {

                        case 'Too many parts' :
                            return res.status(400).json({
                                success: false,
                                message: "فایل ارسالی معتبر نیست، دوباره تلاش کنید"
                            });
                        case 'File too large' :
                            return res.status(400).json({
                                success: false,
                                message: "حجم فایل ارسالی نباید بیشتر از ۵ مگابایت باشد"
                            });
                        case 'Too many files' :
                            return res.status(400).json({
                                success: false,
                                message: "تنها قادر به ارسال یک آیکون هستید"
                            });
                        case 'Field name too long' :
                            return res.status(400).json({
                                success: false,
                                message: "نام فیلد ارسالی طولانی تر از جد مجاز هست"
                            });
                        case 'Field value too long' :
                            return res.status(400).json({
                                success: false,
                                message: "مقدار فیلد ارسالی طولانی تر از جد مجاز هست"
                            });
                        case 'Too many fields' :
                            return res.status(400).json({
                                success: false,
                                message: "امکان ارسال فیلد برای این فرم نیستید"
                            });
                        case 'Unexpected field' :
                            return res.status(400).json({
                                success: false,
                                message: "فیلد ارسالی معتبر نیست"
                            });
                        case 'Field name missing' :
                            return res.status(500).json({
                                success: false,
                                message: "نام فیلد ارسالی ارسال نشده است"
                            });
                        default :
                            console.log(e)
                            return res.status(500).json({
                                success: false,
                                message: "Internal Server Error"
                            });
                    }
                }

                if (e.message === "Mimetype is not allowed" || e.message === "File extname is not allowed") {
                    return res.status(400).json({
                        success: false,
                        message: "فرمت داده ارسالی صحیح نیست"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });

            }


            return next();

        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
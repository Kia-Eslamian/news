const { Schema, model } = require('mongoose');

const adminSecurityActivitiesSchema = new Schema({
    admin: { type: Schema.Types.ObjectId, ref: 'admin', required: true },
    date: { type: String, required: true },
    agent: { type: String, default: null },
    ip: { type: String, default: null },
    status: { type: Boolean, default: false },
    action: {
        type: String,
        enum: [
            'loginActivity',
            'logout',
        ],
        required: true
    },
    message: { type: String, required: true }
}, { timestamps: true });


module.exports = model('adminSecurityActivities', adminSecurityActivitiesSchema, 'adminSecurityActivities');

const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    mobile: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['WRITER', 'MANAGER'], required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    password: { type: String, required: true },
}, { timestamps: true });

const adminModel = model('admin', adminSchema, 'admins');

adminSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}

module.exports = adminModel
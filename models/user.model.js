const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

// The model takes in the types of data that are specified, some are required and some are optional
const userSchema = new Schema({
    full_name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    }
}, { timestamps: true });

// uses bcrypt to compare passwords
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// exporting the model
module.exports = model('User', userSchema);
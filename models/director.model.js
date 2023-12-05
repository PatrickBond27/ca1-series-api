const { Schema, model } = require('mongoose');

// The model takes in the types of data that are specified, some are required and some are optional
const directorSchema = new Schema({
    full_name: {
        type: String,
        required: [true, 'Full Name field is required'],
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
    },
    series: [
        {
            type: Schema.Types.ObjectId,
            ref: "Serie",
            required: [true, 'Serie field is required'],
        }
    ],
    // password: {
    //     type: String,
    //     required: [true, 'Password field is required'],
    // },
}, { timestamps: true});

// exporting the model
module.exports = model('Director', directorSchema);
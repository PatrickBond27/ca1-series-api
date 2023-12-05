const { Schema, model } = require('mongoose');

// The model takes in the types of data that are specified, some are required and some are optional
const serieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title field is required'],
    },
    description: {
        type: String,
        required: [true, 'Description field is required'],
    },
    directors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Director",
            required: [true, 'Directors field is required'],
        }
    ],
    release_year: {
        type: String,
        required: [true, 'Release field is required'],
    },
    country: {
        type: String,
    },
    rating: {
        type: String,
        required: [true, 'Rating field is required'],
    },
    image_path: {
        type: String
    },
    // cast: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Cast",
    //     }
    // ],
    // genres: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Genre",
    //     }
    // ],
    // duration: {
    //     type: String,
    // },
    // date_added: {
    //     type: String,
    //     required: [true, 'Date added field is required'],
    // },
}, { timestamps: true});

// exporting the model
module.exports = model('Serie', serieSchema);
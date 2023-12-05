const express = require('express');
const router = express.Router();

const imageUpload = require('../configs/imageUpload');

const { loginRequired } = require('../controllers/user.controller');

const { readData, 
        readOne,
        createData,
        updateData,
        deleteData 
} = require('../controllers/serie.controller');

// Router for the API requests
router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', imageUpload.single('image'), loginRequired, createData)
    .put('/:id', imageUpload.single('image'), loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData);

module.exports = router;
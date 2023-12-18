const Director = require('../models/director.model');
const Serie = require('../models/serie.model');
const User = require('../models/user.model');

const readData = (req, res) => {

    Director.find({})
    .then((data) => {
        console.log(data);

        if(data.length > 0) {
            res.status(200).json(data);
        }
        else {
            res.status(404).json('None found');
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

const readOne = (req, res) => {

    let id = req.params.id;

    // searches for a Director by an ${id}
    Director.findById(id)
    .then(data => {

        if(!data) {
            res.status(404).json({ msg: `Director ${id} not found!`});
        }

        res.status(200).json(data);

    })
    .catch(err => {
        if(err.name === 'CastError') {
            res.status(404).json({ msg: `Director ${id} not found!`});
        }
        console.error(err);
        res.status(500).json(err);
    });

    // connect to db and retrieve director with :id

    // res.status(200).json({
    //     "msg": `You retrieved director with ID: ${id}`
    // });
};

const createData = (req, res) => {

    console.log(req.body);
    let inputData = req.body; // creating an inputData variable when creating new Series data

    Director.create(inputData) // creating new Directors data
    .then((data) => {
        console.log(`New Director Created`, data);
        res.status(201).json(data);
    })
    .catch((err) => {
        if (err.name === "ValidationError") {
            res.status(422).json(err);
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // check data is valid, 
    // connect to db and check email exists, if yes respond with error
    // if director info is missing, respond with error

    // if(data.password.length < 6) {
    //     res.status(422).json({
    //         "msg": "director password must be over 6 characters"
    //     });
    // } 
    // else {
    //     res.status(200).json({
    //         "msg": "All good",
    //         "data": data
    //     })
    // }

    // res.status(200).json({
    //     "msg": "All good"
    // });
};

// updating the Series data
const updateData = (req, res) => {

    let id = req.params.id; // requests the selected ${id} to use when updating
    let data = req.body; // requests the whole data

    Director.findByIdAndUpdate(id, data, {
        new: false
    })
    .then((data) => {
        res.status(201).json(data);
    })
    .catch(err => {
        if (err.name === "CastError") {
            res.status(404).json({"msg": `Director ${id} not found!`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // connect to db and check if director exists,
    // check data is valid, if yes update director with :id

    // data.id = id;

    // res.status(200).json({
    //     "msg": `You updated the director with ID: ${id}`,
    //     "data": data
    // });
};

  // Deletes the selected data
const deleteData = (req, res) => {

    let id = req.params.id;

    Director.findByIdAndDelete(id)
    .then(data => {

        if(!data) {
            res.status(404).json({"msg": `Director ${id} not found`});
        }

        res.status(200).json({ msg: `Director ${id} deleted!` });
    })
    .catch(err => {
        if (err.name === "CastError") {
            res.status(404).json({"msg": `Director ${id} not found`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    })

    // connect to db and check if director exists, if yes delete director with :id

    // res.status(200).json({
    //     "msg": `You deleted the director with ID: ${id}`
    // });
};

// exports the listed functions for an API
module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};
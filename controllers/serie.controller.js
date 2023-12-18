const Serie = require('../models/serie.model');
const Director = require('../models/director.model');
const User = require('../models/user.model');
const fs = require('fs');

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const deleteImage = async (filename) => {

    if(process.env.STORAGE_ENGINE === 'S3'){
        const s3 = new S3Client({
            region: process.env.MY_AWS_REGION,
            credentials: {
                accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
            }
        });

        try{
           const data = await s3.send(new DeleteObjectCommand({ Bucket: process.env.MY_AWS_BUCKET, Key: filename}));
           console.log("Success. Object deleted.", data);
        }
        catch(err){
            console.error(err);
        }
    }
    else {
        let path = `public/uploads/${filename}`;

        fs.access(path, fs.constants.F_OK, (err) => {
            if(err) {
                console.error(err);
                return;
            }

            fs.unlink(path, (err) => {
                if(err) throw err;
                console.log(`${filename} was deleted!`);
            });
        });
    }

};


// requests the Series data from the database
const readData = (req, res) => {

    // looks for any available data
    Serie.find()
    .then((data) => {
        console.log(data);

        // outputs the status message if no data was found
        if(data.length > 0) {
            res.status(200).json(data);
        }
        else {
            res.status(404).json('None found');
        }
    })
    // catches any error
    .catch(err => {
        console.log(err);
        // res.status(500).json(err);
    });

    // res.status(200).json({
    //     "msg": "All series retrieved"
    // });
};

// requests a single serie data from the database with the selected ${id}
const readOne = (req, res) => {
    let id = req.params.id;

    // searches for a Serie by an ${id}
    Serie.findById(id)
    .then((data) => {

        // outputs the status message if no data was found
        if(!data) {
            res.status(404).json({ msg: `Serie ${id} not found!`});
        }

        res.status(200).json(data);

    })
    // catches any error
    .catch((err) => {
        console.error(err);
        if(err.name === 'CastError') {
            res.status(404).json({ msg: `Serie ${id} not found!`});
        } else {
            res.status(500).json(err);
        }
    });

    // connect to db and retrieve serie with :id

    // res.status(200).json({
    //     "msg": `You retrieved serie with ID: ${id}`
    // });
};

const createData = (req, res) => {

    // console.log(req.file);
    console.log(req.body);
    let inputData = req.body; // creating an inputData variable when creating new Series data
    if (req.file) {
        inputData.image_path = req.file.key; // Setting image path if file is uploaded
      } else {
        return res.status(422).json({
          mgs: 'Image not uploaded',
        }); // Sending error if image is required but not uploaded
      }

    // if(req.file){
    //     inputData.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    // }
    // // include the following else if image is required
    // else {
    //     return res.status(422).json({
    //         msg: "Image not uploaded!!"
    //     });
    // }

    Serie.create(inputData) // creating new Series data
    .then((data) => {
        console.log(`New Serie Created`, data); // displaying message when data is created
        res.status(201).json(data);
    })
    // catch any errors including validation
    .catch((err) => {
        if (err.name === "ValidationError") {
            // console.error('Validation Error!!', err);
            res.status(422).json(err);
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // check data is valid, 
    // connect to db and check email exists, if yes respond with error
    // if serie info is missing, respond with error

    // if(data.password.length < 6) {
    //     res.status(422).json({
    //         "msg": "serie password must be over 6 characters"
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

    if (req.file) {
        body.image_path = req.file.filename; // Updates image path if the file is uploaded
    }

    Serie.findByIdAndUpdate(id, data, {
        new: false,
    })
    .then((data) => {
        if (data) {
            deleteImage(data.image_path); // Deletes the old image file
            res.status(201).json(data); // Sends updated data if founded
        } else {
        deleteImage(body.image_path); // Deletes new image file if no data was found
        res.status(404).json({
          "message": `Serie with id: ${id} not found`,
        }); // Sending message if no data found for update
      }
    })
    .catch((err) => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        }
        else if(err.name === 'CastError'){
            res.status(404).json({ msg: `Serie ${id} not found!`});
        }
        else {
            console.error(err);
            res.status(500).json(err);
        }
    });

    // connect to db and check if serie exists,
    // check data is valid, if yes update serie with :id

    // data.id = id;

    // res.status(200).json({
    //     "msg": `You updated the serie with ID: ${id}`,
    //     "data": data
    // });
};

// Deletes the selected image from the path
// const deleteImage = (filename) => {
//     let path = `/public/uploads/${filename}`;
  
//     fs.access(path, fs.constants.F_OK, (err) => {
//       if (err) {
//         console.log(err); // Logging errors if the file doesn't exist
//         return;
//       }
//       fs.unlink(path, (err) => {
//         if (err) throw err; // Handles the file deletion error
//         console.log(`${filename} was deleted`); // Logs the file deletion success
//       });
//     });
//   };

  // Deletes the selected data
const deleteData = (req, res) => {

    let id = req.params.id;
    let imagePath = '';

    Serie.findByIdAndDelete({
        _id: id
      })
    .then((data) => {
        console.log('data', data);
        if(data) {
            imagePath = data.image_path; // Stores image path before deletion
            return data.deleteOne(); // Deletes data entry
        } else {
            res.status(404).json({msg: `Serie ${id} not found`});
        }
    })
    .then(() => {
        deleteImage(imagePath); // Deleting associated image file
        res.status(200).json({ msg: `Serie ${id} deleted!` });
    })
    .catch((err) => {
        if (err.name === "CastError") {
            res.status(404).json({msg: `Serie ${id} not found`});
        }
        else {
            console.error(err);
            // res.status(500).json(err);
        }
    });

    // connect to db and check if serie exists, if yes delete serie with :id

    // res.status(200).json({
    //     "msg": `You deleted the serie with ID: ${id}`
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
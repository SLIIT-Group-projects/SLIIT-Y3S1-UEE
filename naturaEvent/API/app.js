const express = require("express");
const cors = require("cors");
const eventRoutes = require('./routes/eventPostRoutes');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
require("./models/postEventModel")
const Event = mongoose.model('Event');
const path = require('path');
const fs = require('fs');
dotenv.config();

const app =express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB connection error: ", err);
    });
app.listen(3000, () => {
    console.log("Server started on port 3000")
})

app.post('/events', (req, res) => {
    // Log request body and file (image) details
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Check if the image file is uploaded
    if (req.file) {
        req.body.imageUrl = req.file.path; // Assuming you save the file path for later use
    } else {
        return res.status(400).send({ message: "Image is required" });
    }

    // Create a new event with the request body
    const event = new Event(req.body);

    event.save((err, data) => {
        if (err) {
            // Log the actual error and send detailed error message
            console.error("Error details:", JSON.stringify(err, null, 2));

            // Check if it's a validation error
            if (err.name === 'ValidationError') {
                return res.status(400).send({
                    message: "Validation failed",
                    error: err.errors, // Send validation error details
                });
            }

            // General server error
            return res.status(500).send({ message: "Error creating event", error: err });
        }

        // Success response
        return res.status(201).send(data);
    });
});
app.get('/',( req, res) => {
    res.send('Welcome to Natura App')
})
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use event routes
app.use('/api', eventRoutes);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads'); // Adjust the path based on your directory structure
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// models/Resource.js

const mongoose = require('mongoose');

// Define the Resource schema
const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['Mineral', 'Water', 'Technology', 'Fuel', 'Food'], // Example resource types
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
});

// Create a method to format the resource data
resourceSchema.methods.toJSON = function() {
    const resource = this;
    const resourceObject = resource.toObject();

    // Remove sensitive information if needed
    delete resourceObject.__v; // Example: remove version key

    return resourceObject;
};

// Create the Resource model
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;

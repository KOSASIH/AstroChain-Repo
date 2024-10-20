// backend/api/resources.js

const express = require('express');
const router = express.Router();

// In-memory storage for resources (for demonstration purposes)
let resources = [
    {
        id: 1,
        name: 'Asteroid Ore',
        description: 'A valuable ore from asteroid belt',
        quantity: 1000,
        value: 5000,
        resourceType: 'Mineral',
        location: 'Asteroid Belt A',
        creationTime: Math.floor(Date.now() / 1000) // Current time in seconds
    },
    {
        id: 2,
        name: 'Lunar Water',
        description: 'Water extracted from the moon',
        quantity: 500,
        value: 3000,
        resourceType: 'Water',
        location: 'Moon Base',
        creationTime: Math.floor(Date.now() / 1000) // Current time in seconds
    }
];

// Get all resources
router.get('/', (req, res) => {
    res.json(resources);
});

// Get a resource by ID
router.get('/:id', (req, res) => {
    const resource = resources.find(r => r.id === parseInt(req.params.id));
    if (!resource) return res.status(404).send('Resource not found');
    res.json(resource);
});

// Create a new resource
router.post('/', (req, res) => {
    const { name, description, quantity, value, resourceType, location } = req.body;
    const newResource = {
        id: resources.length + 1,
        name,
        description,
        quantity,
        value,
        resourceType,
        location,
        creationTime: Math.floor(Date.now() / 1000) // Current time in seconds
    };
    resources.push(newResource);
    res.status(201).json(newResource);
});

// Update a resource
router.put('/:id', (req, res) => {
    const resource = resources.find(r => r.id === parseInt(req.params.id));
    if (!resource) return res.status(404).send('Resource not found');

    const { name, description, quantity, value, resourceType, location } = req.body;
    resource.name = name;
    resource.description = description;
    resource.quantity = quantity;
    resource.value = value;
    resource.resourceType = resourceType;
    resource.location = location;

    res.json(resource);
});

// Delete a resource
router.delete('/:id', (req, res) => {
    const resourceIndex = resources.findIndex(r => r.id === parseInt(req.params.id));
    if (resourceIndex === -1) return res.status(404).send('Resource not found');

    resources.splice(resourceIndex, 1);
    res.status(204).send();
});

module.exports = router;

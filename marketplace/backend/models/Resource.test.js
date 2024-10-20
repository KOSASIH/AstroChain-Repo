// models/Resource.test.js

const mongoose = require('mongoose');
const Resource = require('./Resource');

beforeAll(async () => {
    // Connect to the in-memory MongoDB instance
    await mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
});

afterAll(async () => {
    // Close the connection after tests
    await mongoose.connection.close();
});

describe('Resource Model', () => {
    it('should create a valid resource', async () => {
        const resourceData = {
            name: 'Asteroid Ore',
            description: 'A valuable ore from asteroid belt',
            quantity: 1000,
            value: 5000,
            resourceType: 'Mineral',
            location: 'Asteroid Belt A'
        };

        const resource = new Resource(resourceData);
        const savedResource = await resource.save();

        expect(savedResource._id).toBeDefined();
        expect(savedResource.name).toBe(resourceData.name);
        expect(savedResource.quantity).toBe(resourceData.quantity);
        expect(savedResource.value).toBe(resourceData.value);
    });

    it('should not create a resource without a name', async () => {
        const resourceData = {
            description: 'A valuable ore from asteroid belt',
            quantity: 1000,
            value: 5000,
            resourceType: 'Mineral',
            location: 'Asteroid Belt A'
        };

        const resource = new Resource(resourceData);
        let error;
        try {
            await resource.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.name).toBeDefined();
    });

    it('should not create a resource with negative quantity', async () => {
        const resourceData = {
            name: 'Asteroid Ore',
            description: 'A valuable ore from asteroid belt',
            quantity: -100,
            value: 5000,
            resourceType: 'Mineral',
            location: 'Asteroid Belt A'
        };

        const resource = new Resource(resourceData);
        let error;
        try {
            await resource.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.quantity).toBeDefined();
    });

    it('should format the resource data correctly', async () => {
        const resourceData = {
            name: 'Asteroid Ore',
            description: 'A valuable ore from asteroid belt',
            quantity: 1000,
            value: 5000,
            resourceType: 'Mineral',
            location: 'Asteroid Belt A'
        };

        const resource = new Resource(resourceData);
        const savedResource = await resource.save();
        const formattedResource = savedResource.toJSON();

        expect(formattedResource.__v).toBeUndefined(); // Check if __v is removed
        expect(formattedResource.creationTime).toBe InstanceOf(Date);
    });
});

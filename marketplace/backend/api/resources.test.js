// backend/api/resources.test.js

const request = require('supertest');
const express = require('express');
const resourcesRouter = require('./resources');

const app = express();
app.use(express.json());
app.use('/api/resources', resourcesRouter);

describe('Resource API', () => {
    it('should fetch all resources', async () => {
        const response = await request(app).get('/api/resources');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should fetch a resource by ID', async () => {
        const response = await request(app).get('/api/resources/1');
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Asteroid Ore');
    });

    it('should return 404 for a non-existent resource', async () => {
        const response = await request(app).get('/api/resources/999');
        expect(response.status).toBe(404);
    });

    it('should create a new resource', async () => {
        const newResource = {
            name: 'Solar Panel',
            description: 'A panel that converts solar energy',
            quantity: 200,
            value: 15000,
            resourceType: 'Technology',
            location: 'Solar Farm'
        };

        const response = await request(app).post('/api/resources').send(newResource);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newResource.name);
    });

    it('should update an existing resource', async () => {
        const updatedResource = {
            name: 'Updated Asteroid Ore',
            description: 'An updated valuable ore from asteroid belt ',
            quantity: 1200,
            value: 6000,
            resourceType: 'Mineral',
            location: 'Asteroid Belt B'
        };

        const response = await request(app).put('/api/resources/1').send(updatedResource);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedResource.name);
    });

    it('should delete a resource', async () => {
        const response = await request(app).delete('/api/resources/1');
        expect(response.status).toBe(204);
    });
});

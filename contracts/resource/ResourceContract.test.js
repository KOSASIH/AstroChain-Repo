// ResourceContract.test.js

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ResourceContract', function () {
    let resourceContract;
    let owner;
    let minter;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, minter, user1, user2] = await ethers.getSigners();
        const ResourceContract = await ethers.getContractFactory('ResourceContract');
        resourceContract = await ResourceContract.deploy();
        await resourceContract.deployed();

        // Grant MINTER_ROLE to the minter
        await resourceContract.grantRole(await resourceContract.MINTER_ROLE(), minter.address);
    });

    describe('Single Resource Creation', function () {
        it('should create a new resource', async function () {
            const name = 'Asteroid Ore';
            const description = 'A valuable ore from asteroid belt';
            const quantity = 1000;
            const value = 5000;
            const resourceType = 'Mineral';
            const location = 'Asteroid Belt A';

            await resourceContract.connect(minter).createResource(name, description, quantity, value, resourceType, location);

            const resourceId = 1; // First resource ID
            const resource = await resourceContract.getResource(resourceId);

            expect(resource.name).to.equal(name);
            expect(resource.description).to.equal(description);
            expect(resource.quantity).to.equal(quantity);
            expect(resource.value).to.equal(value);
            expect(resource.resourceType).to.equal(resourceType);
            expect(resource.location).to.equal(location);
        });

        it('should emit ResourceCreated event', async function () {
            const name = 'Asteroid Ore';
            const description = 'A valuable ore from asteroid belt';
            const quantity = 1000;
            const value = 5000;
            const resourceType = 'Mineral';
            const location = 'Asteroid Belt A';

            await expect(resourceContract.connect(minter).createResource(name, description, quantity, value, resourceType, location))
                .to.emit(resourceContract, 'ResourceCreated')
                .withArgs(1, name, resourceType, quantity, value, location);
        });
    });

    describe('Batch Resource Creation', function () {
        it('should create multiple resources in a single transaction', async function () {
            const names = ['Asteroid Ore', 'Lunar Water'];
            const descriptions = ['A valuable ore from asteroid belt', 'Water extracted from the moon'];
            const quantities = [1000, 500];
            const values = [5000, 3000];
            const resourceTypes = ['Mineral', 'Water'];
            const locations = ['Asteroid Belt A', 'Moon Base'];

            await resourceContract.connect(minter).createResourcesBatch(names, descriptions, quantities, values, resourceTypes, locations);

            const resource1 = await resourceContract.getResource(1);
            const resource2 = await resourceContract.getResource(2);

            expect(resource1.name).to.equal(names[0]);
            expect(resource2.name).to.equal(names[1]);
        });

        it('should emit ResourceBatchCreated event', async function () {
            const names = ['Asteroid Ore', 'Lunar Water'];
            const descriptions = ['A valuable ore from asteroid belt', 'Water extracted from the moon'];
            const quantities = [1000, 500];
            const values = [5000, 3000];
            const resourceTypes = ['Mineral', 'Water'];
            const locations = ['Asteroid Belt A', 'Moon Base'];

            await expect(resourceContract.connect(minter).createResourcesBatch(names, descriptions, quantities, values, resourceTypes, locations))
                .to.emit(resourceContract, 'ResourceBatchCreated');
        });
    });

    describe('Resource Update', function () {
        beforeEach(async function () {
            await resourceContract.connect(minter).createResource('Asteroid Ore', 'A valuable ore from asteroid belt', 1000, 5000, 'Mineral', 'Asteroid Belt A');
        });

        it('should update an existing resource', async function () {
            const resourceId = 1;
            const newName = 'Updated Asteroid Ore';
            const newQuantity = 1500;
            const newValue = 6000;

            await resourceContract.connect(minter).updateResource(resourceId, newName, newQuantity, newValue);

            const resource = await resourceContract.getResource(resourceId);
            expect(resource.name).to.equal(newName);
            expect(resource.quantity).to.equal(newQuantity);
            expect(resource.value).to.equal(newValue);
        });

        it('should revert if a non-owner tries to update the resource', async function () {
            const resourceId = 1;
            const newName = 'Updated Asteroid Ore';
            const newQuantity = 1500;
            const newValue = 6000;

            await expect(resourceContract.connect(user1).updateResource(resourceId, newName, newQuantity, newValue))
                .to.be.revertedWith('Only the owner can update the resource');
        });
    });

    describe('Resource Transfer', function () {
        beforeEach(async function () {
            await resourceContract.connect(minter).createResource('Asteroid Ore', 'A valuable ore from asteroid belt', 1000, 5000, 'Mineral', 'Asteroid Belt A');
        });

        it('should transfer a resource to another address', async function () {
            const resourceId = 1;
            await resourceContract.connect(minter).transferResource(resourceId, user1.address);

            expect(await resourceContract.ownerOf(resourceId)).to.equal(user1.address);
        });

        it('should emit ResourceTransferred event', async function () {
            const resourceId = 1;
            await expect(resourceContract.connect(minter).transferResource(resourceId, user1.address))
                .to.emit(resourceContract, 'ResourceTransferred')
                .withArgs(resourceId, minter.address, user1.address);
        });

        it('should revert if a non-owner tries to transfer the resource', async function () {
            const resourceId = 1;
            await expect(resourceContract.connect(user2).transferResource(resourceId, user1.address))
                .to.be.revertedWith('Only the owner can transfer the resource');
        });
    });

    describe('Resource Retrieval', function () {
        beforeEach(async function () {
            await resourceContract.connect(minter).createResource('Asteroid Ore', 'A valuable ore from asteroid belt', 1000, 5000, 'Mineral', 'Asteroid Belt A');
            await resourceContract.connect(minter).createResource('Lunar Water', 'Water extracted from the moon', 500, 3000, 'Water', 'Moon Base');
        });

        it('should retrieve a single resource by ID', async function () {
            const resourceId = 1;
            const resource = await resourceContract.getResource(resourceId);
            expect(resource.name).to.equal('Asteroid Ore');
        });

        it('should retrieve all resources', async function () {
            const resources = await resourceContract.getAllResources();
            expect(resources.length).to.equal(2);
        });

        it('should retrieve resources by type', async function () {
            const resources = await resourceContract.getResourceByType('Mineral');
            expect(resources.length).to.equal(1);
            expect(resources[0].name).to.equal('Asteroid Ore');
        });
    });
});

// tests/integration/resource-contract.test.js

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Resource Contract', function () {
    let ResourceContract;
    let resource;
    let owner;
    let addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        ResourceContract = await ethers.getContractFactory('Resource');
        resource = await ResourceContract.deploy();
        await resource.deployed();
    });

    it('should allow the owner to add resources', async function () {
        await resource.addResource('Resource1', 100);
        const resourceData = await resource.resources(0);
        expect(resourceData.name).to.equal('Resource1');
        expect(resourceData.amount).to.equal(100);
    });

    it('should not allow non-owners to add resources', async function () {
        await expect(resource.connect(addr1).addResource('Resource2', 200)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should allow the owner to update resources', async function () {
        await resource.addResource('Resource1', 100);
        await resource.updateResource(0, 'Resource1', 150);
        const resourceData = await resource.resources(0);
        expect(resourceData.amount).to.equal(150);
    });

    it('should emit ResourceAdded event on resource addition', async function () {
        await expect(resource.addResource('Resource1', 100))
            .to.emit(resource, 'ResourceAdded')
            .withArgs('Resource1', 100);
    });
});

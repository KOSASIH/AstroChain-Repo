const { expect } = require('chai');
const { ethers } = require('hardhat');
const { deployContract } = require('./deployContract');

describe('OwnershipContract', () => {
  let ownershipContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    ownershipContract = await deployContract('OwnershipContract', [owner.address]);
  });

  describe('mintAsteroid', () => {
    it('should mint a new asteroid', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await ownershipContract.connect(owner).mintAsteroid(name, description, size, value);

      const asteroidId = await ownershipContract.getAsteroidId();
      expect(asteroidId).to.be.gt(0);

      const metadata = await ownershipContract.getMetadata(asteroidId);
      expect(metadata.name).to.be.equal(name);
      expect(metadata.description).to.be.equal(description);
      expect(metadata.size).to.be.equal(size);
      expect(metadata.value).to.be.equal(value);
    });

    it('should revert if the owner is not the caller', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await expect(ownershipContract.connect(user1).mintAsteroid(name, description, size, value)).to.be.revertedWith('Only the owner can call this function');
    });
  });

  describe('transferAsteroid', () => {
    it('should transfer an asteroid', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await ownershipContract.connect(owner).mintAsteroid(name, description, size, value);

      const asteroidId = await ownershipContract.getAsteroidId();
      await ownershipContract.connect(owner).transferAsteroid(asteroidId, user1.address);

      const newOwner = await ownershipContract.getOwner(asteroidId);
      expect(newOwner).to.be.equal(user1.address);
    });

    it('should revert if the owner is not the caller', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await ownershipContract.connect(owner).mintAsteroid(name, description, size, value);

      const asteroidId = await ownershipContract.getAsteroidId();
      await expect(ownershipContract.connect(user2).transferAsteroid(asteroidId, user1.address)).to.be.revertedWith('Only the owner can call this function');
    });
  });

  describe('updateMetadata', () => {
    it('should update an asteroid\'s metadata', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await ownershipContract.connect(owner).mintAsteroid(name, description, size, value);

      const asteroidId = await ownershipContract.getAsteroidId();
      const newName = 'Asteroid 2';
      const newDescription = 'This is an updated test asteroid';
      const newSize = 200;
      const newValue = 2000;

      await ownershipContract.connect(owner).updateMetadata(asteroidId, newName, newDescription, newSize, newValue);

      const metadata = await ownershipContract.getMetadata(asteroidId);
      expect(metadata.name).to.be.equal(newName);
      expect(metadata.description).to.be.equal(newDescription);
      expect(metadata.size).to.be.equal(newSize);
      expect(metadata.value).to.be.equal(newValue);
    });

    it('should revert if the owner is not the caller', async () => {
      const name = 'Asteroid 1';
      const description = 'This is a test asteroid';
      const size = 100;
      const value = 1000;

      await ownershipContract.connect(owner).mintAsteroid(name, description, size, value);

      const asteroidId = await ownershipContract.getAsteroidId();
      const newName = 'Asteroid 2';
      const newDescription = 'This is an updated test asteroid';
      const newSize = 200;
      const newValue = 2000;

      await expect(ownershipContract.connect(user1).updateMetadata(asteroidId, newName, newDescription, newSize, newValue)).to.be.revertedWith('Only the owner can call this function');
    });
  });
});

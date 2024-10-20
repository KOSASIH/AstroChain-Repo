// tests/unit/ownership-contract.test.js

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Ownership Contract Unit Tests', function () {
    let OwnershipContract;
    let ownership;
    let owner;
    let addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        OwnershipContract = await ethers.getContractFactory('Ownership');
        ownership = await OwnershipContract.deploy();
        await ownership.deployed();
    });

    it('should set the correct initial owner', async function () {
        expect(await ownership.owner()).to.equal(owner.address);
    });

    it('should allow the owner to transfer ownership', async function () {
        await ownership.transferOwnership(addr1.address);
        expect(await ownership.owner()).to.equal(addr1.address);
    });

    it('should not allow non-owners to transfer ownership', async function () {
        await expect(ownership.connect(addr1).transferOwnership(addr1.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should emit OwnershipTransferred event on ownership transfer', async function () {
        await expect(ownership.transferOwnership(addr1.address))
            .to.emit(ownership, 'OwnershipTransferred')
            .withArgs(owner.address, addr1.address);
    });
});

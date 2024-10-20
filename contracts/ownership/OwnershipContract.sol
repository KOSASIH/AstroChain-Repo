// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/SafeERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/utils/Counters.sol";

contract OwnershipContract {
    // Mapping of asteroid IDs to their respective owners
    mapping (uint256 => address) public asteroidOwners;

    // Mapping of owner addresses to their respective asteroid IDs
    mapping (address => uint256[]) public ownerAsteroids;

    // Mapping of asteroid IDs to their respective metadata
    mapping (uint256 => AsteroidMetadata) public asteroidMetadata;

    // Event emitted when an asteroid is transferred
    event Transfer(uint256 indexed asteroidId, address indexed from, address indexed to);

    // Event emitted when an asteroid is minted
    event Mint(uint256 indexed asteroidId, address indexed owner);

    // Event emitted when an asteroid's metadata is updated
    event UpdateMetadata(uint256 indexed asteroidId, AsteroidMetadata metadata);

    // Struct to represent asteroid metadata
    struct AsteroidMetadata {
        string name;
        string description;
        uint256 size;
        uint256 value;
    }

    // Modifier to check if the caller is the owner of the asteroid
    modifier onlyOwner(uint256 asteroidId) {
        require(asteroidOwners[asteroidId] == msg.sender, "Only the owner can call this function");
        _;
    }

    // Modifier to check if the asteroid exists
    modifier asteroidExists(uint256 asteroidId) {
        require(asteroidOwners[asteroidId] != address(0), "Asteroid does not exist");
        _;
    }

    // Constructor to initialize the contract
    constructor() public {
        // Initialize the asteroid counter
        asteroidCounter = 0;
    }

    // Function to mint a new asteroid
    function mintAsteroid(string memory name, string memory description, uint256 size, uint256 value) public {
        // Increment the asteroid counter
        asteroidCounter++;

        // Create a new asteroid metadata struct
        AsteroidMetadata memory metadata = AsteroidMetadata(name, description, size, value);

        // Set the asteroid's metadata
        asteroidMetadata[asteroidCounter] = metadata;

        // Set the asteroid's owner
        asteroidOwners[asteroidCounter] = msg.sender;

        // Add the asteroid to the owner's list
        ownerAsteroids[msg.sender].push(asteroidCounter);

        // Emit the Mint event
        emit Mint(asteroidCounter, msg.sender);
    }

    // Function to transfer an asteroid
    function transferAsteroid(uint256 asteroidId, address to) public onlyOwner(asteroidId) asteroidExists(asteroidId) {
        // Remove the asteroid from the current owner's list
        ownerAsteroids[msg.sender].remove(asteroidId);

        // Set the asteroid's new owner
        asteroidOwners[asteroidId] = to;

        // Add the asteroid to the new owner's list
        ownerAsteroids[to].push(asteroidId);

        // Emit the Transfer event
        emit Transfer(asteroidId, msg.sender, to);
    }

    // Function to update an asteroid's metadata
    function updateMetadata(uint256 asteroidId, string memory name, string memory description, uint256 size, uint256 value) public onlyOwner(asteroidId) asteroidExists(asteroidId) {
        // Create a new asteroid metadata struct
        AsteroidMetadata memory metadata = AsteroidMetadata(name, description, size, value);

        // Set the asteroid's metadata
        asteroidMetadata[asteroidId] = metadata;

        // Emit the UpdateMetadata event
        emit UpdateMetadata(asteroidId, metadata);
    }

    // Function to get an asteroid's metadata
    function getMetadata(uint256 asteroidId) public view asteroidExists(asteroidId) returns (AsteroidMetadata memory) {
        return asteroidMetadata[asteroidId];
    }

    // Function to get an asteroid's owner
    function getOwner(uint256 asteroidId) public view asteroidExists(asteroidId) returns (address) {
        return asteroidOwners[asteroidId];
    }

    // Function to get an owner's asteroids
    function getAsteroids(address owner) public view returns (uint256[] memory) {
        return ownerAsteroids[owner];
    }
}

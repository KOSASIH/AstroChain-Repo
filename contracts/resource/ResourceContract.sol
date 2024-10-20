// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ResourceContract is ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _resourceIdCounter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct Resource {
        string name;
        string description;
        uint256 quantity;
        uint256 value;
        string resourceType; // e.g., "Mineral", "Gas", "Water"
        string location; // e.g., "Asteroid Belt A"
        uint256 creationTime; // Timestamp of creation
    }

    mapping(uint256 => Resource) private _resources;

    event ResourceCreated(uint256 indexed resourceId, string name, string resourceType, uint256 quantity, uint256 value, string location);
    event ResourceUpdated(uint256 indexed resourceId, string name, uint256 quantity, uint256 value);
    event ResourceTransferred(uint256 indexed resourceId, address indexed from, address indexed to);
    event ResourceBatchCreated(uint256[] indexed resourceIds);

    constructor() ERC721("ResourceToken", "RST") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    function createResource(
        string memory name,
        string memory description,
        uint256 quantity,
        uint256 value,
        string memory resourceType,
        string memory location
    ) public onlyMinter {
        _resourceIdCounter.increment();
        uint256 newResourceId = _resourceIdCounter.current();

        _resources[newResourceId] = Resource({
            name: name,
            description: description,
            quantity: quantity,
            value: value,
            resourceType: resourceType,
            location: location,
            creationTime: block.timestamp
        });

        _mint(msg.sender, newResourceId);
        emit ResourceCreated(newResourceId, name, resourceType, quantity, value, location);
    }

    function createResourcesBatch(
        string[] memory names,
        string[] memory descriptions,
        uint256[] memory quantities,
        uint256[] memory values,
        string[] memory resourceTypes,
        string[] memory locations
    ) public onlyMinter {
        require(names.length == descriptions.length && names.length == quantities.length && names.length == values.length && names.length == resourceTypes.length && names.length == locations.length, "Input arrays must have the same length");

        uint256[] memory resourceIds = new uint256[](names.length);

        for (uint256 i = 0; i < names.length; i++) {
            createResource(names[i], descriptions[i], quantities[i], values[i], resourceTypes[i], locations[i]);
            resourceIds[i] = _resourceIdCounter.current();
        }

        emit ResourceBatchCreated(resourceIds);
    }

    function updateResource(
        uint256 resourceId,
        string memory name,
        uint256 quantity,
        uint256 value
    ) public {
        require(_exists(resourceId), "Resource does not exist");
        require(ownerOf(resourceId) == msg.sender, "Only the owner can update the resource");

        Resource storage resource = _resources[resourceId];
        resource.name = name;
        resource.quantity = quantity;
        resource.value = value;

        emit ResourceUpdated(resourceId, name, quantity, value);
    }

    function transferResource(uint256 resourceId, address to) public {
        require(_exists(resourceId), "Resource does not exist");
        require(ownerOf(resourceId) == msg.sender, "Only the owner can transfer the resource");

        _transfer(msg.sender, to, resourceId);
        emit ResourceTransferred(resourceId, msg.sender, to);
    }

    function getResource(uint256 resourceId) public view returns (Resource memory) {
        require(_exists(resourceId), "Resource does not exist");
        return _resources[resourceId];
    }

    function getAllResources() public view returns (Resource[] memory) {
        uint256 totalResources = totalSupply();
        Resource[] memory resources = new Resource[](totalResources);

        for (uint256 i = 0; i < totalResources; i++) {
            uint256 resourceId = tokenByIndex(i);
            resources[i] = _resources[resourceId];
        }

        return resources ;
    }

    function getResourceByType(string memory resourceType) public view returns (Resource[] memory) {
        uint256 totalResources = totalSupply();
        Resource[] memory resources = new Resource[](totalResources);
        uint256 count = 0;

        for (uint256 i = 0; i < totalResources; i++) {
            uint256 resourceId = tokenByIndex(i);
            Resource memory resource = _resources[resourceId];

            if (keccak256(abi.encodePacked(resource.resourceType)) == keccak256(abi.encodePacked(resourceType))) {
                resources[count] = resource;
                count++;
            }
        }

        Resource[] memory filteredResources = new Resource[](count);

        for (uint256 i = 0; i < count; i++) {
            filteredResources[i] = resources[i];
        }

        return filteredResources;
    }
}

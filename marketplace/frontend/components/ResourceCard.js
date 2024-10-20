// components/ResourceCard.js

import React from 'react';
import './ResourceCard.css';

const ResourceCard = ({ resource, onTransfer }) => {
    const handleTransfer = () => {
        if (onTransfer) {
            onTransfer(resource.id);
        }
    };

    return (
        <div className="resource-card">
            <h2 className="resource-title">{resource.name}</h2>
            <p className="resource-description">{resource.description}</p>
            <div className="resource-details">
                <p><strong>Type:</strong> {resource.resourceType}</p>
                <p><strong>Quantity:</strong> {resource.quantity}</p>
                <p><strong>Value:</strong> {resource.value} Credits</p>
                <p><strong>Location:</strong> {resource.location}</p>
                <p><strong>Created At:</strong> {new Date(resource.creationTime * 1000).toLocaleString()}</p>
            </div>
            <button className="transfer-button" onClick={handleTransfer}>
                Transfer Resource
            </button>
        </div>
    );
};

export default ResourceCard;

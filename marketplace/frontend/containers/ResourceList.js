// containers/ResourceList.js

import React, { useEffect, useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import './ResourceList.css';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Simulating an API call to fetch resources
                const response = await fetch('/api/resources'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setResources(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleTransfer = (resourceId) => {
        console.log(`Transfer resource with ID: ${resourceId}`);
        // Implement transfer logic here
    };

    if (loading) {
        return <div className="loading">Loading resources...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="resource-list">
            {resources.length === 0 ? (
                <div className="no-resources">No resources available.</div>
            ) : (
                resources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} onTransfer={handleTransfer} />
                ))
            )}
        </div>
    );
};

export default ResourceList;

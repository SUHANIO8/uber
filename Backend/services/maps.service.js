const axios = require('axios');
const captainModel = require('../models/captain.model');

// Nominatim API headers for production use
const nominatimHeaders = {
    'User-Agent': 'UberApp/1.0 (Contact: your-email@example.com)'
};

// Get coordinates from address using Nominatim (free geocoding)
module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const url = `https://nominatim.openstreetmap.org/search`;

    try {
        const response = await axios.get(url, {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: nominatimHeaders,
            timeout: 5000
        });

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return {
                ltd: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error(`Address "${address}" not found. Try a more specific location or a known landmark.`);
        }
    } catch (error) {
        console.error('Nominatim Geocoding Error:', error.message);
        throw new Error(`Unable to fetch coordinates for "${address}": ${error.message}`);
    }
};

// Get distance and time using OSRM (free routing)
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // First, get coordinates for origin
        const originCoords = await module.exports.getAddressCoordinate(origin);
        // Then, get coordinates for destination
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        // OSRM API for distance and time calculation (free routing engine)
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destinationCoords.lng},${destinationCoords.ltd}`;

        const osrmResponse = await axios.get(osrmUrl, {
            params: {
                overview: 'full',
                steps: 'true'
            },
            timeout: 5000
        });

        if (osrmResponse.data && osrmResponse.data.routes && osrmResponse.data.routes.length > 0) {
            const route = osrmResponse.data.routes[0];
            return {
                distance: {
                    value: Math.round(route.distance),
                    text: `${(route.distance / 1000).toFixed(2)} km`
                },
                duration: {
                    value: Math.round(route.duration),
                    text: `${Math.round(route.duration / 60)} mins`
                },
                route: route.geometry
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error('OSRM Routing Error:', err.message);
        throw new Error('Unable to calculate distance and time');
    }
};

// Get autocomplete suggestions using Nominatim
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Input is required');
    }

    const url = `https://nominatim.openstreetmap.org/search`;

    try {
        const response = await axios.get(url, {
            params: {
                q: input,
                format: 'json',
                limit: 5,
                addressdetails: 1
            },
            headers: nominatimHeaders,
            timeout: 5000
        });

        if (response.data && response.data.length > 0) {
            return response.data.map(item => ({
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
            }));
        } else {
            return [];
        }
    } catch (err) {
        console.error('Nominatim Suggestions Error:', err.message);
        throw new Error('Unable to fetch suggestions');
    }
};

// Get captains within radius
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, ltd], radius / 6371]
                }
            }
        });

        return captains;
    } catch (err) {
        console.error('Error fetching captains:', err.message);
        throw new Error('Unable to fetch nearby captains');
    }
};